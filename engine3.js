/* AstroMidas — profesyonel teknikler: zodiakal salınım, primer direksiyonlar (açılar), midpoint, harmonik, Vedik yogalar ve bölünmüş haritalar */
(function (root) {
  'use strict';
  const A = root.Astro, norm = A.norm, wrap180 = A.wrap180;
  const D = Math.PI / 180, sin = x => Math.sin(x * D), cos = x => Math.cos(x * D), tan = x => Math.tan(x * D);
  const asin = x => Math.asin(Math.max(-1, Math.min(1, x))) / D, atan2 = (y, x) => Math.atan2(y, x) / D;

  /* ---------- Zodiakal salınım (Vettius Valens) ---------- */
  const MINOR = [15, 8, 20, 25, 19, 20, 8, 15, 12, 27, 30, 12]; // burçların küçük yılları
  function zr(lotSign, fortuneSign, birthJD, levels) {
    const Y = 360, M = 30; // Valens: 360 günlük yıl, 30 günlük ay
    const peak = s => { const d = (s - fortuneSign + 12) % 12; return d === 0 ? 'Doruk (1.)' : d === 9 ? 'Büyük doruk (10.)' : d === 6 ? 'Doruk (7.)' : d === 3 ? 'Doruk (4.)' : ''; };
    const out = []; let t = birthJD, s = lotSign;
    while (t < birthJD + 100 * 365.25) {
      const len = MINOR[s] * Y, st = t, en = t + len, subs = [];
      if (levels > 1) { // L2: aynı burçtan başlar; 12 burç tamamlanınca bağ çözülür (karşı burca atlar)
        let u = st, q = s, count = 0, lb = false;
        while (u < en - 1e-6) {
          if (count === 12) { q = (s + 6) % 12; lb = true; }
          const l2 = MINOR[q] * M, ue = Math.min(en, u + l2);
          subs.push({ s: q, start: u, end: ue, lb: lb && count === 12, peak: peak(q) });
          u = ue; q = (q + 1) % 12; count++;
        }
      }
      out.push({ s, start: st, end: en, peak: peak(s), subs });
      t = en; s = (s + 1) % 12;
    }
    return out;
  }

  /* ---------- Primer direksiyonlar: açılara (MC ve Yükselen), Naibod anahtarı, zodyakta ---------- */
  function primaryToAngles(c, maxAge) {
    maxAge = maxAge || 90;
    const eps = c.houses.eps, ramc = c.houses.ramc, lat = c.input.lat, NAIBOD = 0.98564733, ayn = c.settings && c.settings.zodiac === 'S' ? A.ayanamsa(c.jd) : 0;
    const raDec = l => [norm(atan2(sin(l) * cos(eps), cos(l))), asin(sin(eps) * sin(l))];
    const ids = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'NNode'];
    const asps = [[0, 'kavuşum'], [60, 'altmışlık'], [90, 'kare'], [120, 'üçgen'], [180, 'karşıt'], [-60, 'altmışlık'], [-90, 'kare'], [-120, 'üçgen']];
    const out = [], oaAsc = norm(ramc + 90);
    for (const id of ids) {
      const p = c.get(id); if (!p) continue;
      for (const [a, an] of asps) {
        const l = norm(p.lon + ayn + a), [ra, dec] = raDec(l);
        const arcMC = norm(ra - ramc), ad = Math.abs(tan(lat) * tan(dec)) < 1 ? asin(tan(lat) * tan(dec)) : null;
        if (arcMC / NAIBOD <= maxAge && arcMC > 0.05) out.push({ to: 'MC', pr: id, asp: an, arc: arcMC, age: arcMC / NAIBOD });
        if (ad != null) { const oa = norm(ra - ad), arcA = norm(oa - oaAsc); if (arcA / NAIBOD <= maxAge && arcA > 0.05) out.push({ to: 'Asc', pr: id, asp: an, arc: arcA, age: arcA / NAIBOD }); }
      }
    }
    return out.sort((x, y) => x.age - y.age);
  }

  /* ---------- Midpoint ağacı (90° kadranı) ---------- */
  function midpoints(c, orb) {
    orb = orb || 1.5;
    const ids = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'NNode', 'Asc', 'MC'].filter(i => c.get(i) && !(c.unknownTime && ['Asc', 'MC'].includes(i)));
    const P = ids.map(i => c.get(i)), mps = [];
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) { const m = norm(P[i].lon + wrap180(P[j].lon - P[i].lon) / 2); mps.push({ a: P[i].id, b: P[j].id, lon: m }); }
    const d90 = x => ((x % 90) + 90) % 90, tree = [];
    for (const p of P) {
      const hits = mps.filter(m => m.a !== p.id && m.b !== p.id).map(m => { let d = Math.abs(d90(m.lon) - d90(p.lon)); if (d > 45) d = 90 - d; return { ...m, orb: d }; }).filter(m => m.orb <= orb).sort((x, y) => x.orb - y.orb);
      tree.push({ id: p.id, lon: p.lon, hits });
    }
    return { tree, mps };
  }

  /* ---------- Harmonik harita ---------- */
  function harmonic(c, n) {
    const pts = c.points.map(p => { const l = norm(p.lon * n); return { ...p, lon: l, sign: A.signOf(l), deg: l - A.signOf(l) * 30 }; });
    const asc = norm(c.houses.asc * n), cus = [null]; for (let i = 1; i <= 12; i++) cus[i] = norm(asc + 30 * (i - 1));
    for (const p of pts) p.house = A.houseOf(p.lon, cus);
    return { ...c, points: pts, houses: { ...c.houses, asc, mc: norm(c.houses.mc * n), cusps: cus }, get: id => pts.find(p => p.id === id), harmonic: n };
  }

  /* ---------- Vedik bölünmüş haritalar ---------- */
  function varga(lon, n) {
    lon = norm(lon); const s = Math.floor(lon / 30), d = lon - s * 30, odd = s % 2 === 0, mov = s % 3 === 0, fix = s % 3 === 1;
    switch (n) {
      case 1: return s;
      case 2: return odd ? (d < 15 ? 4 : 3) : (d < 15 ? 3 : 4);
      case 3: return (s + [0, 4, 8][Math.floor(d / 10)]) % 12;
      case 4: return (s + [0, 3, 6, 9][Math.floor(d / 7.5)]) % 12;
      case 7: return ((odd ? s : s + 6) + Math.floor(d / (30 / 7))) % 12;
      case 9: return Math.floor(lon / (10 / 3)) % 12;
      case 10: return ((odd ? s : s + 8) + Math.floor(d / 3)) % 12;
      case 12: return (s + Math.floor(d / 2.5)) % 12;
      case 16: return ((mov ? 0 : fix ? 4 : 8) + Math.floor(d / 1.875)) % 12;
      case 20: return ((mov ? 0 : fix ? 8 : 4) + Math.floor(d / 1.5)) % 12;
      case 24: return ((odd ? 4 : 3) + Math.floor(d / 1.25)) % 12;
      case 30: { const o = [[5, 0], [10, 10], [18, 8], [25, 2], [30, 6]], e = [[5, 1], [12, 5], [20, 11], [25, 9], [30, 7]]; for (const [lim, sg] of (odd ? o : e)) if (d < lim) return sg; return odd ? 6 : 7; }
      case 60: return (s + Math.floor(d / 0.5)) % 12;
    }
    return s;
  }
  const VARGA_NAMES = { 1: 'D1 Rasi (genel)', 2: 'D2 Hora (servet)', 3: 'D3 Drekkana (kardeşler)', 4: 'D4 Chaturthamsa (mülk, şans)', 7: 'D7 Saptamsa (çocuklar)', 9: 'D9 Navamsa (evlilik, dharma)', 10: 'D10 Dasamsa (kariyer)', 12: 'D12 Dwadasamsa (ebeveynler)', 16: 'D16 Shodasamsa (araçlar, konfor)', 20: 'D20 Vimsamsa (maneviyat)', 24: 'D24 Chaturvimsamsa (eğitim)', 30: 'D30 Trimsamsa (talihsizlikler)', 60: 'D60 Shashtiamsa (karma)' };

  /* ---------- Vedik yogalar ---------- */
  const OWN = { Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10] };
  const EX = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
  function yogas(v) {
    const R = {}; for (const r of v.rows) R[r.id] = r;
    const lag = R.Asc.sign, hFrom = (s, from) => (s - from + 12) % 12 + 1, kendra = h => [1, 4, 7, 10].includes(h), trikona = h => [1, 5, 9].includes(h);
    const lord = h => A.RULER[(lag + h - 1) % 12];
    const out = [], add = (n, d, ok) => { if (ok) out.push({ n, d }); };
    add('Gajakesari yoga', 'Jüpiter, Ay’dan bir kendra (1, 4, 7, 10) evinde: bilgelik, itibar ve koruma.', kendra(hFrom(R.Jupiter.sign, R.Moon.sign)));
    add('Budha-Aditya yoga', 'Güneş ve Merkür aynı burçta: keskin zekâ, iletişim ve öğrenme yeteneği.', R.Sun.sign === R.Mercury.sign);
    add('Chandra-Mangala yoga', 'Ay ve Mars birlikte ya da karşılıklı: girişimcilik ve kazanç gücü.', R.Moon.sign === R.Mars.sign || (R.Moon.sign + 6) % 12 === R.Mars.sign);
    const PM = { Mars: ['Ruchaka', 'cesaret, liderlik, fiziksel güç'], Mercury: ['Bhadra', 'zekâ, ticaret, belagat'], Jupiter: ['Hamsa', 'bilgelik, ahlak, saygınlık'], Venus: ['Malavya', 'güzellik, sanat, konfor'], Saturn: ['Sasa', 'otorite, disiplin, toplumsal güç'] };
    for (const [p, [n, d]] of Object.entries(PM)) { const r = R[p]; add(n + ' yoga (Pancha Mahapurusha)', `${A.SIGNS[r.sign]} burcundaki ${p === 'Mars' ? 'Mars' : p === 'Mercury' ? 'Merkür' : p === 'Jupiter' ? 'Jüpiter' : p === 'Venus' ? 'Venüs' : 'Satürn'} kendi/yücelim burcunda ve kendrada: ${d}.`, (OWN[p].includes(r.sign) || EX[p] === r.sign) && kendra(hFrom(r.sign, lag))); }
    const others = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const in2 = others.filter(p => hFrom(R[p].sign, R.Moon.sign) === 2), in12 = others.filter(p => hFrom(R[p].sign, R.Moon.sign) === 12), withM = others.filter(p => R[p].sign === R.Moon.sign);
    add('Sunapha yoga', 'Ay’dan 2. evde gezegen var: kendi emeğiyle kazanç ve itibar.', in2.length && !in12.length);
    add('Anapha yoga', 'Ay’dan 12. evde gezegen var: rahat, nazik ve saygın bir yaşam.', in12.length && !in2.length);
    add('Durudhara yoga', 'Ay’ın iki yanında gezegen var: bolluk ve destek.', in2.length && in12.length);
    add('Kemadruma yoga', 'Ay’ın iki yanında ve yanında gezegen yok: duygusal yalnızlık ve maddi dalgalanma temaları; diğer güçlü yogalar bunu hafifletir.', !in2.length && !in12.length && !withM.length);
    const benef = ['Jupiter', 'Venus', 'Mercury'];
    add('Amala yoga', 'Lagna ya da Ay’dan 10. evde hayırlı gezegen: lekesiz bir itibar.', benef.some(p => hFrom(R[p].sign, lag) === 10 || hFrom(R[p].sign, R.Moon.sign) === 10));
    const TRN = { Sun: "Güneş", Moon: "Ay", Mercury: "Merkür", Venus: "Venüs", Mars: "Mars", Jupiter: "Jüpiter", Saturn: "Satürn" };
    // Raja yoga: kendra lordu ile trikona lordu aynı burçta
    const rj = []; for (const k of [1, 4, 7, 10]) for (const t of [5, 9]) { const a = lord(k), b = lord(t); if (a !== b && R[a] && R[b] && R[a].sign === R[b].sign) rj.push(`${k}. ev lordu ${TRN[a] || a} ile ${t}. ev lordu ${TRN[b] || b}`); }
    const yk = ['Mars', 'Venus', 'Saturn'].filter(p => { const hs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(h => lord(h) === p); return hs.some(h => [4, 7, 10].includes(h)) && hs.some(h => [5, 9].includes(h)); });
    for (const p of yk) add('Yogakaraka: ' + TRN[p], `${TRN[p]} hem bir kendra hem bir trikona evini yönetiyor; bu lagna için en hayırlı gezegendir, dönemleri yükseliş getirir.`, true);
    add('Raja yoga', 'Kendra ve trikona lordları birleşiyor (' + rj.join('; ') + '): güç, statü ve başarı.', rj.length > 0);
    const dh = []; for (const k of [2, 11]) for (const t of [5, 9]) { const a = lord(k), b = lord(t); if (a !== b && R[a] && R[b] && R[a].sign === R[b].sign) dh.push(`${k}. ve ${t}. ev lordları`); }
    add('Dhana yoga', 'Servet evlerinin lordları birleşiyor (' + dh.join('; ') + '): maddi bolluk potansiyeli.', dh.length > 0);
    const vp = [6, 8, 12].filter(h => [6, 8, 12].includes(hFrom(R[lord(h)] ? R[lord(h)].sign : -1, lag)));
    add('Viparita Raja yoga', 'Zorlu evlerin (6, 8, 12) lordları yine zorlu evlerde: zorluklardan beklenmedik yükseliş.', vp.length > 0);
    return out;
  }

  root.Astro3 = { zr, MINOR, primaryToAngles, midpoints, harmonic, varga, VARGA_NAMES, yogas };
})(typeof window !== 'undefined' ? window : globalThis);
