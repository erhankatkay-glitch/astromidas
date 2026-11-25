/* AstroMidas — ileri teknikler: dönüşler, progresyon, solar ark, transit zaman çizelgesi, Vedik, sabit yıldızlar,
   gezegen saatleri, Ay takvimi, boşlukta Ay, kartografi, drakonik, antisya, kompozit/Davison, profeksiyon, firdaria, rektifikasyon. */
(function (root) {
  'use strict';
  const A = root.Astro || (typeof require !== 'undefined' ? require('./engine.js') : null);
  const { norm, wrap180 } = A;
  const D = Math.PI / 180, sin = x => Math.sin(x * D), cos = x => Math.cos(x * D), tan = x => Math.tan(x * D);
  const asin = x => Math.asin(Math.max(-1, Math.min(1, x))) / D, acos = x => Math.acos(Math.max(-1, Math.min(1, x))) / D, atan2 = (y, x) => Math.atan2(y, x) / D;
  const Y = 365.242199;
  const lon = (b, jd, o) => { const r = A.rawLon(b, jd, o); return r ? norm(r.lon - (o && o.sidereal ? A.ayanamsa(jd) : 0)) : null; };

  /* Genel kesişim tarayıcı: f(jd)=wrap180(lon−target) sıfırları */
  function crossings(body, target, jd0, jd1, step, o) {
    const out = []; let a = jd0, fa = wrap180(lon(body, a, o) - target);
    for (let b = jd0 + step; b <= jd1 + 1e-9; b += step) {
      const fb = wrap180(lon(body, b, o) - target);
      if (fa * fb <= 0 && Math.abs(fa - fb) < 90) {
        let x = a, y = b, fx = fa;
        for (let i = 0; i < 50 && y - x > 1e-6; i++) { const m = (x + y) / 2, fm = wrap180(lon(body, m, o) - target); if (fx * fm <= 0) y = m; else { x = m; fx = fm; } }
        out.push((x + y) / 2);
      }
      a = b; fa = fb;
    }
    return out;
  }
  const STEP = { Sun: 2, Moon: 0.25, Mercury: 1, Venus: 2, Mars: 3, Jupiter: 5, Saturn: 7, Uranus: 10, Neptune: 10, Pluto: 10, Chiron: 7 };

  /* ---------- Dönüşler ---------- */
  function nextReturn(body, natalLon, fromJD, o) {
    const span = { Sun: 370, Moon: 30, Mercury: 400, Venus: 600, Mars: 800, Jupiter: 4500, Saturn: 11000, Chiron: 19000 }[body] || 400;
    const c = crossings(body, natalLon, fromJD, fromJD + span, STEP[body] || 2, o);
    return c.length ? c : [];
  }

  /* ---------- Progresyon ve solar ark ---------- */
  function progressedJD(birthJD, targetJD) { return birthJD + (targetJD - birthJD) / Y; }
  function progressedChart(natal, targetJD, settings) {
    const pj = progressedJD(natal.jd, targetJD), o = { sidereal: settings.zodiac === 'S', meanNode: settings.node === 'mean' };
    const pc = A.chart({ jd: pj, lat: natal.input.lat, lon: natal.input.lon }, settings);
    const arc = norm(pc.get('Sun').lon - natal.get('Sun').lon);
    // MC güneş arkıyla ilerletilir (Solar Fire varsayılanı); RAMC dönüşümü tropikal boylamla yapılır
    const ayN = o.sidereal ? A.ayanamsa(natal.jd) : 0, mc = norm(natal.houses.mc + ayN + arc), eps = natal.houses.eps;
    const ramc = norm(atan2(sin(mc) * cos(eps), cos(mc)));
    const h = A.siderealize(A.housesRAMC(ramc, natal.input.lat, eps, settings.hsys || 'P'), natal.jd, o);
    const pSun = pc.get('Sun').lon, pMoon = pc.get('Moon').lon, day = norm(pSun - h.asc) > 180;
    const lot = (a, b) => norm(h.asc + a - b);
    for (const p of pc.points) if (['Asc', 'MC', 'Vertex', 'Fortune', 'Spirit'].includes(p.id)) { p.lon = p.id === 'Asc' ? h.asc : p.id === 'MC' ? h.mc : p.id === 'Vertex' ? h.vertex : p.id === 'Fortune' ? (day ? lot(pMoon, pSun) : lot(pSun, pMoon)) : (day ? lot(pSun, pMoon) : lot(pMoon, pSun)); p.sign = A.signOf(p.lon); p.deg = p.lon - p.sign * 30; }
    for (const p of pc.points) p.house = A.houseOf(p.lon, natal.houses.cusps);
    pc.progHouses = h; pc.arc = arc; pc.pjd = pj; pc.o = o;
    return pc;
  }
  function solarArcChart(natal, targetJD, settings) {
    const pj = progressedJD(natal.jd, targetJD);
    const arc = norm(lon('Sun', pj, { sidereal: settings.zodiac === 'S' }) - natal.get('Sun').lon);
    const pts = natal.points.map(p => { const l = norm(p.lon + arc); return { ...p, lon: l, sign: A.signOf(l), deg: l - A.signOf(l) * 30, speed: 0, house: A.houseOf(l, natal.houses.cusps) }; });
    return { arc, points: pts, get: id => pts.find(p => p.id === id) };
  }
  function progMoonTimeline(natal, fromJD, years, settings) {
    const o = { sidereal: settings.zodiac === 'S' }, out = [];
    const pj0 = progressedJD(natal.jd, fromJD), pj1 = progressedJD(natal.jd, fromJD + years * Y);
    let prevS = A.signOf(lon('Moon', pj0, o)), prevH = A.houseOf(lon('Moon', pj0, o), natal.houses.cusps);
    for (let pj = pj0 + 0.25; pj <= pj1; pj += 0.25) {
      const l = lon('Moon', pj, o), s = A.signOf(l), h = A.houseOf(l, natal.houses.cusps);
      const real = natal.jd + (pj - natal.jd) * Y;
      if (s !== prevS) out.push({ jd: real, type: 'sign', v: s });
      if (h !== prevH) out.push({ jd: real, type: 'house', v: h });
      prevS = s; prevH = h;
    }
    return out;
  }
  function solarArcHits(natal, fromJD, toJD, settings) {
    const out = [], ids = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Asc', 'MC'];
    const pts = ids.map(id => natal.get(id)), o = { sidereal: settings.zodiac === 'S' };
    const arcAt = j => norm(lon('Sun', progressedJD(natal.jd, j), o) - natal.get('Sun').lon);
    for (let j = fromJD; j < toJD; j += 15) {
      const a1 = arcAt(j), a2 = arcAt(j + 15);
      for (const p of pts) for (const q of pts) {
        if (p === q) continue;
        for (const asp of [0, 90, 180, 60, 120]) for (const sg of asp === 0 || asp === 180 ? [1] : [1, -1]) {
          const t = q.lon + sg * asp, f1 = wrap180(p.lon + a1 - t), f2 = wrap180(p.lon + a2 - t);
          if (f1 * f2 <= 0 && Math.abs(f1 - f2) < 5) out.push({ jd: j + 15 * f1 / (f1 - f2), dir: p.id, nat: q.id, asp });
        }
      }
    }
    return out.sort((a, b) => a.jd - b.jd);
  }

  /* ---------- Transit zaman çizelgesi ---------- */
  function transitHits(natal, fromJD, days, bodies, settings, targets) {
    const o = { sidereal: settings.zodiac === 'S' }, out = [];
    targets = targets || ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Asc', 'MC', 'NNode'];
    const nat = targets.map(id => natal.get(id)).filter(Boolean);
    for (const b of bodies) {
      const step = b === 'Mars' || b === 'Sun' || b === 'Venus' || b === 'Mercury' ? 0.5 : 1;
      const L = []; for (let j = fromJD; j <= fromJD + days + step; j += step) L.push(lon(b, j, o));
      for (const q of nat) for (const asp of [0, 60, 90, 120, 180]) for (const sg of asp === 0 || asp === 180 ? [1] : [1, -1]) {
        const t = norm(q.lon + sg * asp);
        for (let i = 0; i < L.length - 1; i++) {
          const f1 = wrap180(L[i] - t), f2 = wrap180(L[i + 1] - t);
          if (f1 * f2 <= 0 && Math.abs(f1 - f2) < 30) {
            let x = fromJD + i * step, y = x + step, fx = f1;
            for (let k = 0; k < 30; k++) { const m = (x + y) / 2, fm = wrap180(lon(b, m, o) - t); if (fx * fm <= 0) y = m; else { x = m; fx = fm; } }
            const jd = (x + y) / 2;
            out.push({ jd, tr: b, nat: q.id, asp, retro: A.bodyPos(b, jd, o).speed < 0 });
          }
        }
      }
    }
    out.sort((a, b) => a.jd - b.jd);
    return out;
  }
  function transitChart(natal, jd, settings) { const c = A.chart({ jd, lat: natal.input.lat, lon: natal.input.lon }, settings); for (const p of c.points) p.nhouse = A.houseOf(p.lon, natal.houses.cusps); return c; }

  /* ---------- Sinastri, kompozit, Davison ---------- */
  const mid = (a, b) => norm(a + wrap180(b - a) / 2);
  function composite(c1, c2, settings) {
    const ids = c1.points.map(p => p.id), pts = [];
    for (const id of ids) { const p = c1.get(id), q = c2.get(id); if (!q) continue; const l = mid(p.lon, q.lon); pts.push({ id, lon: l, speed: ((p.speed || 0) + (q.speed || 0)) / 2, dec: null }); }
    const sid = settings.zodiac === 'S', jm = (c1.jd + c2.jd) / 2, ay = sid ? A.ayanamsa(jm) : 0;
    const mc = mid(c1.houses.mc, c2.houses.mc), eps = (c1.houses.eps + c2.houses.eps) / 2, lat = (c1.input.lat + c2.input.lat) / 2;
    const mcT = norm(mc + ay), ramc = norm(atan2(sin(mcT) * cos(eps), cos(mcT)));
    const h = A.siderealize(A.housesRAMC(ramc, lat, eps, settings.hsys === 'P' && Math.abs(lat) > 66 ? 'O' : settings.hsys || 'P'), jm, { sidereal: sid });
    for (const p of pts) { if (p.id === 'Asc') p.lon = h.asc; if (p.id === 'MC') p.lon = h.mc; p.sign = A.signOf(p.lon); p.deg = p.lon - p.sign * 30; p.house = A.houseOf(p.lon, h.cusps); }
    return { houses: h, points: pts, get: id => pts.find(p => p.id === id), input: { lat, lon: 0 } };
  }
  function davison(i1, i2, settings) {
    const jd = (i1.jd + i2.jd) / 2, lat = (i1.lat + i2.lat) / 2, lo = norm(i1.lon + wrap180(i2.lon - i1.lon) / 2);
    return A.chart({ jd, lat, lon: lo > 180 ? lo - 360 : lo }, settings);
  }
  function overlays(c1, c2) { return c1.points.filter(p => !['Asc', 'MC', 'Vertex', 'Fortune', 'Spirit'].includes(p.id)).map(p => ({ id: p.id, house: A.houseOf(p.lon, c2.houses.cusps) })); }

  /* ---------- Drakonik, antisya ---------- */
  function draconic(c) {
    const n = c.get('NNode').lon;
    const pts = c.points.map(p => { const l = norm(p.lon - n); return { ...p, lon: l, sign: A.signOf(l), deg: l - A.signOf(l) * 30 }; });
    const cusps = c.houses.cusps.map(x => x == null ? x : norm(x - n));
    for (const p of pts) p.house = A.houseOf(p.lon, cusps);
    return { points: pts, houses: { ...c.houses, cusps, asc: norm(c.houses.asc - n), mc: norm(c.houses.mc - n) }, get: id => pts.find(p => p.id === id) };
  }
  function antiscia(c, orb) {
    orb = orb || 1.5; const P = c.points.filter(p => !['SNode', 'Vertex', 'Spirit'].includes(p.id)), out = [];
    for (const p of P) {
      const an = norm(180 - p.lon), ca = norm(360 - p.lon);
      p.antiscion = an; p.contra = ca;
      for (const q of P) if (q !== p && P.indexOf(q) > P.indexOf(p)) {
        const d1 = Math.abs(wrap180(an - q.lon)), d2 = Math.abs(wrap180(ca - q.lon));
        if (d1 <= orb) out.push({ p: p.id, q: q.id, type: 'Antisya', orb: d1 });
        if (d2 <= orb) out.push({ p: p.id, q: q.id, type: 'Kontra-antisya', orb: d2 });
      }
    }
    return out.sort((a, b) => a.orb - b.orb);
  }

  /* ---------- Sabit yıldızlar ---------- */
  function fixedStars(jdUT, stars) {
    const jdT = A.jdTT(jdUT), T = (jdT - 2451545) / 36525, nu = A.nutation(T), yrs = (jdT - 2451545) / 365.25;
    const sun = A.rawLon('Sun', jdUT).lon, K = 20.49552 / 3600, ecc = 0.016708634 - 0.000042037 * T, pi = 102.93735 + 1.71946 * T; // yıllık aberasyon (Meeus 23.2)
    return stars.map(s => {
      const dec = s.dec + s.pd / 3.6e6 * yrs, ra = s.ra + s.pa / 3.6e6 * yrs / Math.max(0.01, cos(s.dec));
      const v = [cos(dec) * cos(ra), cos(dec) * sin(ra), sin(dec)];
      const e = A.eqToEcl(A.precessJ2000(v, T), nu.eps0);
      let lon = atan2(e[1], e[0]), lat = asin(e[2]);
      const dl = (-K * cos(sun - lon) + ecc * K * cos(pi - lon)) / cos(lat), db = -K * sin(lat) * (sin(sun - lon) - ecc * sin(pi - lon));
      return { ...s, lon: norm(lon + dl + nu.dpsi), lat: lat + db };
    });
  }
  function starContacts(c, starPos, orb) {
    orb = orb || 1; const out = [];
    for (const s of starPos) for (const p of c.points) {
      if (['SNode', 'Spirit', 'Vertex', 'Lilith'].includes(p.id)) continue;
      const lim = s.mag < 1.5 ? orb * 1.5 : orb;
      const d = Math.abs(wrap180(s.lon - p.lon)); if (d <= lim) out.push({ star: s, p: p.id, orb: d });
    }
    return out.sort((a, b) => a.orb - b.orb);
  }

  /* ---------- Güneş doğuşu, gezegen saatleri ---------- */
  function sunAlt(jd, lat, lonE) {
    const r = A.rawLon('Sun', jd), eps = r.eps;
    const ra = atan2(sin(r.lon) * cos(eps), cos(r.lon)), dec = asin(sin(eps) * sin(r.lon));
    const H = A.gast(jd) + lonE - ra;
    return asin(sin(lat) * sin(dec) + cos(lat) * cos(dec) * cos(H));
  }
  function riseSet(jd0, jd1, lat, lonE, h0) {
    h0 = h0 == null ? -0.8333 : h0; const out = []; let a = jd0, fa = sunAlt(a, lat, lonE) - h0;
    for (let b = jd0 + 1 / 48; b <= jd1; b += 1 / 48) {
      const fb = sunAlt(b, lat, lonE) - h0;
      if (fa * fb < 0) { let x = a, y = b, fx = fa; for (let i = 0; i < 30; i++) { const m = (x + y) / 2, fm = sunAlt(m, lat, lonE) - h0; if (fx * fm <= 0) y = m; else { x = m; fx = fm; } } out.push({ jd: (x + y) / 2, rise: fa < 0 }); }
      a = b; fa = fb;
    }
    return out;
  }
  const CHALD = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
  const DAYRULER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  function planetaryHours(localMidnightUTCjd, weekday, lat, lonE) {
    const ev = riseSet(localMidnightUTCjd, localMidnightUTCjd + 2, lat, lonE);
    const r1 = ev.find(e => e.rise), s1 = r1 && ev.find(e => !e.rise && e.jd > r1.jd), r2 = s1 && ev.find(e => e.rise && e.jd > s1.jd);
    if (!r1 || !s1 || !r2) return null;
    const start = CHALD.indexOf(DAYRULER[weekday]), hours = [];
    const dl = (s1.jd - r1.jd) / 12, nl = (r2.jd - s1.jd) / 12;
    for (let i = 0; i < 24; i++) {
      const st = i < 12 ? r1.jd + i * dl : s1.jd + (i - 12) * nl;
      hours.push({ start: st, end: st + (i < 12 ? dl : nl), ruler: CHALD[(start + i) % 7], day: i < 12 });
    }
    return { sunrise: r1.jd, sunset: s1.jd, nextRise: r2.jd, ruler: DAYRULER[weekday], hours };
  }

  /* ---------- Ay takvimi, boşlukta Ay ---------- */
  function moonIngresses(jd0, jd1) {
    const out = []; let a = jd0, la = lon('Moon', a);
    for (let b = jd0 + 0.1; b <= jd1; b += 0.1) {
      const lb = lon('Moon', b);
      if (Math.floor(la / 30) !== Math.floor(lb / 30)) {
        const t = Math.floor(lb / 30) * 30; let x = a, y = b;
        for (let i = 0; i < 30; i++) { const m = (x + y) / 2; if (wrap180(lon('Moon', m) - t) < 0) x = m; else y = m; }
        out.push({ jd: (x + y) / 2, sign: Math.floor(lb / 30) % 12 });
      }
      a = b; la = lb;
    }
    return out;
  }
  function voidOfCourse(jd0, jd1) {
    const ing = moonIngresses(jd0 - 3, jd1), out = [], P = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    for (let k = 1; k < ing.length; k++) {
      const s0 = ing[k - 1].jd, s1 = ing[k].jd; let last = null, lastP = null, lastA = null;
      const step = 0.05; let prev = null;
      for (let j = s0; j <= s1 + 1e-9; j += step) {
        const m = lon('Moon', Math.min(j, s1 - 1e-6)), cur = P.map(p => lon(p, j));
        if (prev) for (let i = 0; i < P.length; i++) for (const asp of [0, 60, 90, 120, 180]) for (const sg of asp === 0 || asp === 180 ? [1] : [1, -1]) {
          const f1 = wrap180(prev.m - prev.c[i] - sg * asp), f2 = wrap180(m - cur[i] - sg * asp);
          if (f1 < 0 && f2 >= 0) { const t = j - step + step * (-f1) / (f2 - f1); if (!last || t > last) { last = t; lastP = P[i]; lastA = asp; } }
        }
        prev = { m, c: cur };
      }
      if (last && s1 > jd0) out.push({ start: last, end: s1, lastPlanet: lastP, lastAsp: lastA, nextSign: ing[k].sign });
    }
    return out;
  }

  /* ---------- Kartografi ---------- */
  function astroLines(c, bodies) {
    const g = A.gast(c.jd), eps = c.houses.eps, out = [];
    for (const id of bodies) {
      const p = c.get(id); if (!p) continue;
      const lat = p.lat || 0, ra = norm(atan2(sin(p.lon) * cos(eps) - tan(lat) * sin(eps), cos(p.lon))), dec = asin(sin(lat) * cos(eps) + cos(lat) * sin(eps) * sin(p.lon));
      const L = x => { x = norm(x); return x > 180 ? x - 360 : x; };
      const mcLon = L(ra - g), icLon = L(ra - g + 180), asc = [], dsc = [];
      for (let f = -75; f <= 75; f += 1) { const ch = -tan(f) * tan(dec); if (Math.abs(ch) > 1) continue; const H = acos(ch); asc.push([L(ra - H - g), f]); dsc.push([L(ra + H - g), f]); }
      out.push({ id, ra, dec, mc: mcLon, ic: icLon, asc, dsc });
    }
    return out;
  }
  function nearLinesExact(lines, cities, gast, km) {
    km = km || 350; const out = [];
    for (const [name, country, la, lo] of cities) for (const l of lines) {
      const add = (type, x) => { const d = Math.abs(wrap180(lo - x)) * 111.32 * cos(la); if (d <= km) out.push({ city: name, country, line: l.id, type, km: Math.round(d), lat: la, lon: lo }); };
      add('MC', l.mc); add('IC', l.ic);
      const ch = -tan(la) * tan(l.dec);
      if (Math.abs(ch) <= 1) { const H = acos(ch); add('ASC', wrap180(l.ra - H - gast)); add('DSC', wrap180(l.ra + H - gast)); }
    }
    return out.sort((a, b) => a.km - b.km);
  }

  /* ---------- Klasik: profeksiyon, firdaria ---------- */
  function profection(c, ageYears) {
    const n = Math.max(0, Math.floor(ageYears)), house = n % 12 + 1, sign = (A.signOf(c.houses.asc) + n) % 12;
    return { age: n, house, sign, lord: A.RULER[sign] };
  }
  const FIRD_D = [['Sun', 10], ['Venus', 8], ['Mercury', 13], ['Moon', 9], ['Saturn', 11], ['Jupiter', 12], ['Mars', 7], ['NNode', 3], ['SNode', 2]];
  const FIRD_N = [['Moon', 9], ['Saturn', 11], ['Jupiter', 12], ['Mars', 7], ['Sun', 10], ['Venus', 8], ['Mercury', 13], ['NNode', 3], ['SNode', 2]];
  function firdaria(c) {
    const seq = c.isDay ? FIRD_D : FIRD_N, out = []; let t = c.jd;
    for (let cyc = 0; cyc < 2; cyc++) for (const [p, y] of seq) {
      const st = t, en = t + y * 365.25, subs = [];
      if (p !== 'NNode' && p !== 'SNode') { const i0 = CHALD.indexOf(p); for (let k = 0; k < 7; k++) subs.push({ p: CHALD[(i0 + k) % 7], start: st + k * (en - st) / 7, end: st + (k + 1) * (en - st) / 7 }); }
      out.push({ p, start: st, end: en, subs }); t = en;
    }
    return out;
  }
  function almuten(c) { // Asc, MC, Güneş, Ay, Şans noktası ve doğum öncesi kavuşum/karşıtlık için esansiyel puan toplamı
    const score = {}; for (const p of CHALD) score[p] = 0;
    const syz = A.lunations(c.jd - 16, 16).filter(l => l.jd <= c.jd).pop();
    const pts = ['Asc', 'MC', 'Sun', 'Moon', 'Fortune'].map(id => c.get(id).lon).concat(syz ? [norm(syz.lon - (c.settings && c.settings.zodiac === 'S' ? A.ayanamsa(c.jd) : 0))] : []);
    for (const l of pts) for (const p of CHALD) { const d = A.dignity(p, l, c.isDay).list; if (d.includes('Yönetici')) score[p] += 5; if (d.includes('Yücelim')) score[p] += 4; if (d.includes('Üçlük')) score[p] += 3; if (d.includes('Sınır')) score[p] += 2; if (d.includes('Yüz')) score[p] += 1; }
    // gezegenin dignity listesi "kendisi için" hesaplanır; burada ilgili noktanın yöneticilerini sayarız:
    for (const p of CHALD) score[p] = 0;
    for (const l of pts) {
      const s = A.signOf(l);
      score[A.RULER[s]] += 5;
      for (const [p, e] of Object.entries(A.EXALT)) if (e === s) score[p] += 4;
      score[A.TRIP[s % 4][c.isDay ? 0 : 1]] += 3;
      score[A.termRuler(l)] += 2; score[A.faceRuler(l)] += 1;
    }
    const best = Object.entries(score).sort((a, b) => b[1] - a[1]);
    return { winner: best[0][0], scores: best };
  }

  /* ---------- Vedik ---------- */
  const NAK = ['Aşvini', 'Bharani', 'Krittika', 'Rohini', 'Mrigaşira', 'Ardra', 'Punarvasu', 'Puşya', 'Aşleşa', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Çitra', 'Svati', 'Vişakha', 'Anuradha', 'Jyeşta', 'Mula', 'Purva Aşadha', 'Uttara Aşadha', 'Şravana', 'Dhanişta', 'Şatabhişa', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
  const DASHA = [['Ketu', 7], ['Venus', 20], ['Sun', 6], ['Moon', 10], ['Mars', 7], ['Rahu', 18], ['Jupiter', 16], ['Saturn', 19], ['Mercury', 17]];
  function nakshatra(sidLon) { const i = Math.floor(norm(sidLon) / (40 / 3)), f = (norm(sidLon) - i * 40 / 3) / (40 / 3); return { i, name: NAK[i], pada: Math.floor(f * 4) + 1, lord: DASHA[i % 9][0], frac: f }; }
  function vimshottari(moonSid, birthJD) {
    const n = nakshatra(moonSid), i0 = n.i % 9, out = []; const yr = 365.25;
    let t = birthJD - n.frac * DASHA[i0][1] * yr;
    for (let k = 0; k < 9 * 2; k++) {
      const [L, y] = DASHA[(i0 + k) % 9], st = t, en = t + y * yr, subs = [];
      let s = st; for (let m = 0; m < 9; m++) { const [L2, y2] = DASHA[(i0 + k + m) % 9], len = y * y2 / 120 * yr; subs.push({ p: L2, start: s, end: s + len }); s += len; }
      out.push({ p: L, start: st, end: en, subs }); t = en;
      if (t > birthJD + 125 * yr) break;
    }
    return out;
  }
  const VEX = { Sun: [0, 10], Moon: [1, 3], Mars: [9, 28], Mercury: [5, 15], Jupiter: [3, 5], Venus: [11, 27], Saturn: [6, 20] };
  const MOOLA = { Sun: [4, 0, 20], Moon: [1, 3, 30], Mars: [0, 0, 12], Mercury: [5, 15, 20], Jupiter: [8, 0, 10], Venus: [6, 0, 15], Saturn: [10, 0, 20] };
  const OWN = { Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10] };
  const FRIEND = { Sun: [['Moon', 'Mars', 'Jupiter'], ['Venus', 'Saturn']], Moon: [['Sun', 'Mercury'], []], Mars: [['Sun', 'Moon', 'Jupiter'], ['Mercury']], Mercury: [['Sun', 'Venus'], ['Moon']], Jupiter: [['Sun', 'Moon', 'Mars'], ['Mercury', 'Venus']], Venus: [['Mercury', 'Saturn'], ['Sun', 'Moon']], Saturn: [['Mercury', 'Venus'], ['Sun', 'Moon', 'Mars']] };
  function vedicDignity(p, sidLon) {
    if (!VEX[p]) return '';
    const s = A.signOf(sidLon), d = sidLon - s * 30;
    if (p === 'Mercury' && s === 5) return d < 15 ? (d >= 14 ? 'Tam üçça' : 'Üçça (yücelim)') : d < 20 ? 'Mulatrikona' : 'Sva (kendi burcu)'; // BPHS: 0–15 üçça, 15–20 mulatrikona, 20–30 kendi
    if (p === 'Moon' && s === 1) return d < 3 ? (d >= 2 ? 'Tam üçça' : 'Üçça (yücelim)') : 'Mulatrikona'; // BPHS: 0–3 üçça, 3–30 mulatrikona
    if (VEX[p][0] === s) return Math.abs(d - VEX[p][1]) < 1 ? 'Tam üçça' : 'Üçça (yücelim)';
    if ((VEX[p][0] + 6) % 12 === s) return 'Nica (düşüş)';
    const m = MOOLA[p]; if (m[0] === s && d >= m[1] && d < m[2]) return 'Mulatrikona';
    if (OWN[p].includes(s)) return 'Sva (kendi burcu)';
    const lord = A.RULER[s]; if (FRIEND[p][0].includes(lord)) return 'Dost burç'; if (FRIEND[p][1].includes(lord)) return 'Düşman burç'; return 'Nötr burç';
  }
  function vedic(input, settings) {
    const s = { ...settings, zodiac: 'S', hsys: 'W', node: 'mean' };
    const c = A.chart(input, s);
    const ids = ['Asc', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'NNode', 'SNode'];
    const rows = ids.map(id => { const p = c.get(id), n = nakshatra(p.lon), nav = Math.floor(norm(p.lon) / (10 / 3)) % 12; return { id: id === 'NNode' ? 'Rahu' : id === 'SNode' ? 'Ketu' : id, lon: p.lon, sign: p.sign, deg: p.deg, house: (p.sign - c.get('Asc').sign + 12) % 12 + 1, nak: n, navamsa: nav, retro: p.retro && !['NNode', 'SNode'].includes(id), dig: vedicDignity(id, p.lon) }; });
    return { chart: c, rows, dasha: vimshottari(c.get('Moon').lon, input.jd), ayanamsa: A.ayanamsa(input.jd) };
  }

  /* ---------- Rektifikasyon yardımcısı ---------- */
  function rectify(base, events, t0min, t1min, stepMin, settings) {
    // base: {y,mo,d,zone,lat,lon}; events: [{jd, kind}] kind: 'iliski','kariyer','ev','saglik','genel'
    const res = [], o = { sidereal: settings.zodiac === 'S' };
    const ANG = { iliski: ['DSC'], kariyer: ['MC'], ev: ['IC'], saglik: ['ASC'], genel: ['ASC', 'MC', 'DSC', 'IC'] };
    const midUTC = A.localToUTC(base.y, base.mo, base.d, 12, 0, base.zone).ms, jdMid = A.jdFromUTC(midUTC);
    const natalPl = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].map(b => ({ id: b, lon: lon(b, jdMid, o) }));
    const evData = events.map(e => {
      const arc = norm(lon('Sun', progressedJD(jdMid, e.jd), o) - lon('Sun', jdMid, o));
      const tr = ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].map(b => ({ id: b, lon: lon(b, e.jd, o) }));
      return { ...e, arc, tr };
    });
    for (let m = t0min; m <= t1min; m += stepMin) {
      const u = A.localToUTC(base.y, base.mo, base.d, Math.floor(m / 60), m % 60, base.zone).ms, jd = A.jdFromUTC(u);
      const h = A.houses(jd, base.lat, base.lon, 'P', o);
      const ang = { ASC: h.asc, MC: h.mc, DSC: norm(h.asc + 180), IC: norm(h.mc + 180) };
      let score = 0; const hits = [];
      for (const e of evData) {
        for (const a of ANG[e.kind] || ANG.genel) {
          const al = ang[a];
          for (const p of natalPl) for (const asp of [0, 90, 180]) { // solar ark: açı → natal gezegen ve gezegen → açı
            const d1 = Math.abs(wrap180(al + e.arc - p.lon - asp)), d2 = Math.abs(wrap180(p.lon + e.arc - al - asp));
            const best = Math.min(d1, d2); if (best < 1) { const w = (asp === 0 ? 3 : 2) * (1 - best); score += w; hits.push({ ev: e.label, k: 'SA', a, p: p.id, asp, orb: best }); }
          }
          for (const t of e.tr) for (const asp of [0, 90, 180]) { const d = Math.abs(wrap180(t.lon - al - asp)); if (d < 1.5) { const w = (['Saturn', 'Uranus', 'Pluto', 'Neptune'].includes(t.id) ? 2 : 1) * (1 - d / 1.5); score += w; hits.push({ ev: e.label, k: 'TR', a, p: t.id, asp, orb: d }); } }
        }
      }
      res.push({ min: m, score, asc: h.asc, mc: h.mc, hits });
    }
    return res.sort((a, b) => b.score - a.score);
  }

  const API2 = { crossings, nextReturn, progressedJD, progressedChart, solarArcChart, progMoonTimeline, solarArcHits, transitHits, transitChart, composite, davison, overlays, draconic, antiscia, fixedStars, starContacts, sunAlt, riseSet, planetaryHours, moonIngresses, voidOfCourse, astroLines, nearLinesExact, profection, firdaria, almuten, NAK, DASHA, nakshatra, vimshottari, vedicDignity, vedic, rectify, CHALD, DAYRULER };
  if (typeof module !== 'undefined' && module.exports) module.exports = API2; else root.Astro2 = API2;
})(typeof window !== 'undefined' ? window : globalThis);
