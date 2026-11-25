/* AstroMidas — çekirdek: durum, biçimlendirme, çark çizimi, yorum üretimi */
var AM = (function () {
  'use strict';
  const A = window.Astro, B = window.Astro2;
  SEPH_API.init(SEPH);
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DEVICE_TZ = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Istanbul'; } catch (e) { return 'Europe/Istanbul'; } })();

  /* ---------- Kalıcı durum ---------- */
  const DEF = { system: 'modern', hsys: 'P', zodiac: 'T', node: 'true', lilith: 'mean', asteroids: true, minor: false, orbMult: 1, here: { name: 'İstanbul', lat: 41.0082, lon: 28.9784, zone: 'Europe/Istanbul' } };
  const store = { get(k, d) { try { const v = localStorage.getItem('am_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('am_' + k, JSON.stringify(v)); } catch (e) { } } };
  const S = { settings: Object.assign({}, DEF, store.get('settings', {})), people: store.get('people', []), active: store.get('active', null), partner: store.get('partner', null), tab: 'an', sub: {} };
  function save() { store.set('settings', S.settings); store.set('people', S.people); store.set('active', S.active); store.set('partner', S.partner); dbSave(); }
  let DB = null, UID = null;
  (async () => { // claude.ai hesabında kalıcı yedek (varsa)
    try {
      const db = await claude.use('db'), user = await claude.use('user'); if (!db || !user) return;
      UID = await user.id(); DB = db;
      const d = await db.doc('data/users/' + UID + '/store/main').get();
      const v = d && (d.data ? (typeof d.data === 'function' ? d.data() : d.data) : d);
      if (v && Array.isArray(v.people)) {
        const ids = new Set(S.people.map(p => p.id)); let added = 0;
        for (const p of v.people) if (!ids.has(p.id)) { S.people.push(p); added++; }
        if (v.settings && !store.get('settings', null)) S.settings = Object.assign({}, DEF, v.settings);
        if (v.daily && window.DAILY) DAILY.importData(v.daily);
        if (added || v.daily) { store.set("people", S.people); window.render && window.render(); }
      }
    } catch (e) { DB = null; }
  })();
  let dbT = null;
  function dbSave() { if (!DB) return; clearTimeout(dbT); dbT = setTimeout(() => { try { DB.doc('data/users/' + UID + '/store/main').set({ people: S.people, settings: S.settings, daily: window.DAILY ? DAILY.exportData() : null }); } catch (e) { } }, 1500); }

  function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2200); }

  /* ---------- Ayarlar → hesap seçenekleri ---------- */
  function calcSettings(over) {
    const s = Object.assign({}, S.settings, over || {});
    if (s.system === 'classic') return { ...s, hsys: s.hsys || 'W', asteroids: false };
    if (s.system === 'vedic') return { ...s, zodiac: 'S', hsys: 'W', node: 'mean', asteroids: false };
    return s;
  }

  /* ---------- Biçimlendirme ---------- */
  const LOC = ['Koç’ta', 'Boğa’da', 'İkizler’de', 'Yengeç’te', 'Aslan’da', 'Başak’ta', 'Terazi’de', 'Akrep’te', 'Yay’da', 'Oğlak’ta', 'Kova’da', 'Balık’ta']; // bulunma hâli ekleri
  // Türkçe ekler (ünlü uyumu ve kaynaştırma harfleriyle): gen = -ın/-nin, poss = -ı/-sı, dat = -a/-ya, loc = -da/-ta
  function ek(w, kind) {
    w = String(w || ''); const par = (w.match(/\s*\([^)]*\)$/) || [''])[0], base = w.slice(0, w.length - par.length);
    if ((kind === 'poss' || kind === 'acc') && /\s/.test(base) && /[ıiuü]$/.test(base)) return w; // "Kuzey Ay Düğümü", "Tepe Noktası" zaten iyelikli
    if (par) return ek(base, kind) + par;
    const low = w.toLocaleLowerCase('tr-TR'), vs = low.match(/[aıoueiöü]/g), v = vs ? vs[vs.length - 1] : 'e', last = low.slice(-1), endsV = /[aıoueiöü]/.test(last);
    const I = { a: 'ı', ı: 'ı', o: 'u', u: 'u', e: 'i', i: 'i', ö: 'ü', ü: 'ü' }[v], Aa = 'aıou'.includes(v) ? 'a' : 'e';
    if (kind === 'gen') return w + '’' + (endsV ? 'n' : '') + I + 'n';
    if (kind === 'poss') return w + '’' + (endsV ? 's' : '') + I;
    if (kind === 'acc') return w + '’' + (endsV ? 'y' : '') + I;
    if (kind === 'dat') return w + '’' + (endsV ? 'y' : '') + Aa;
    if (kind === 'loc') return w + '’' + ('fstkçşhp'.includes(last) ? 't' : 'd') + Aa;
    if (kind === 'abl') return w + '’' + ('fstkçşhp'.includes(last) ? 't' : 'd') + Aa + 'n';
    return w;
  }
  const SG = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map(x => x + '︎');
  const ELC = ['var(--fire)', 'var(--earth)', 'var(--air)', 'var(--water)'];
  const P = id => TX.P[id] || { n: id, g: id };
  const nm = id => P(id).n, gl = id => (P(id).g || id) + (String(P(id).g || '').length === 1 ? '︎' : '');
  const pad = n => String(n).padStart(2, '0');
  function dms(x, sec) { x = Math.abs(x); let d = Math.floor(x), mf = (x - d) * 60, m = Math.floor(mf), s = Math.round((mf - m) * 60); if (s === 60) { s = 0; m++; } if (m === 60) { m = 0; d++; } return sec ? `${d}°${pad(m)}′${pad(s)}″` : `${d}°${pad(m)}′`; }
  function fmtLon(lon, sec) { lon = A.norm(lon); if (sec) lon = A.norm(Math.round(lon * 3600) / 3600); let s = Math.floor(lon / 30) % 12, d = lon - Math.floor(lon / 30) * 30; return `${dms(d, sec)} <span class="sym">${SG[s]}</span>`; }
  const fmtLonTxt = lon => { const s = A.signOf(lon); return `${dms(lon - s * 30)} ${A.SIGNS[s]}`; };
  function fmtDate(jd, zone, withTime = true) {
    const d = new Date(A.utcFromJD(jd));
    try { return new Intl.DateTimeFormat('tr-TR', { timeZone: zone || DEVICE_TZ, day: 'numeric', month: 'long', year: 'numeric', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}) }).format(d); } catch (e) { return d.toISOString(); }
  }
  const fmtShort = (jd, zone) => { const d = new Date(A.utcFromJD(jd)); try { return new Intl.DateTimeFormat('tr-TR', { timeZone: zone || DEVICE_TZ, day: 'numeric', month: 'short', year: 'numeric' }).format(d); } catch (e) { return ''; } };
  const fmtTime = (jd, zone) => { const d = new Date(A.utcFromJD(jd)); try { return new Intl.DateTimeFormat('tr-TR', { timeZone: zone || DEVICE_TZ, hour: '2-digit', minute: '2-digit' }).format(d); } catch (e) { return ''; } };
  const nowJD = () => A.jdFromUTC(Date.now());
  const ASPN = Object.fromEntries(A.ASPECTS.map(a => [a.a, a]));
  const aspClass = k => k === 'con' ? 'asp-con' : (k === 'opp' || k === 'squ' || k === 'ssq' || k === 'sqq') ? 'asp-hard' : (k === 'tri' || k === 'sex') ? 'asp-soft' : 'asp-min';
  const ASPG = { con: '☌', opp: '☍', tri: '△', squ: '□', sex: '⚹', qcx: '⚻', ssx: '⚺', ssq: '∠', sqq: '⚼', qui: 'Q', bqu: 'bQ' };

  /* ---------- Kişi → harita ---------- */
  function inputOf(p) {
    let ms, off, gap = false, ambiguous = false;
    if (p.offsetOverride != null && p.offsetOverride !== '') { off = +p.offsetOverride; ms = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi) - off * 60000; }
    else { const r = A.localToUTC(p.y, p.mo, p.d, p.h, p.mi, p.zone || 'UTC'); ms = r.ms; off = r.offsetMin; gap = r.gap; ambiguous = r.ambiguous; }
    return { jd: A.jdFromUTC(ms), lat: +p.lat, lon: +p.lon, ms, offsetMin: off, zone: p.zone, gap, ambiguous };
  }
  const cache = new Map();
  function chartOf(p, over) {
    const s = calcSettings(over), key = JSON.stringify([p.id, p.y, p.mo, p.d, p.h, p.mi, p.lat, p.lon, p.zone, p.offsetOverride, p.timeAcc, s]);
    if (cache.has(key)) return cache.get(key);
    const c = A.chart(inputOf(p), s); c.person = p; c.calc = s;
    if (p.timeAcc === 'bilinmiyor') { // güneş haritası: Güneş derecesi Yükselen, eşit evler
      const sl = c.get('Sun').lon, cu = [null]; for (let i = 1; i <= 12; i++) cu[i] = A.norm(sl + 30 * (i - 1));
      c.houses = { ...c.houses, cusps: cu, asc: sl, mc: A.norm(sl + 270), sys: 'E', note: 'Doğum saati bilinmediği için güneş haritası (Güneş derecesi = 1. ev, eşit evler) kullanıldı.' };
      for (const x of c.points) { if (x.id === 'Asc') x.lon = sl; if (x.id === 'MC') x.lon = A.norm(sl + 270); x.sign = A.signOf(x.lon); x.deg = x.lon - x.sign * 30; x.house = A.houseOf(x.lon, cu); }
      c.unknownTime = true;
      const i0 = inputOf({ ...p, h: 0, mi: 0 }), i1 = inputOf({ ...p, h: 23, mi: 59 });
      c.moonRange = [A.rawLon('Moon', i0.jd).lon, A.rawLon('Moon', i1.jd).lon];
    } else if (p.timeAcc === 'yaklasik') {
      const sh = m => A.houses(c.jd + m / 1440, +p.lat, +p.lon, s.hsys || 'P', { sidereal: s.zodiac === 'S' }).asc;
      c.approxAsc = [sh(-30), sh(30)];
    }
    if (cache.size > 30) cache.clear(); cache.set(key, c); return c;
  }
  const person = id => S.people.find(p => p.id === id);
  const activeP = () => person(S.active) || S.people[0] || null;

  /* ---------- Açılar (sisteme göre) ---------- */
  const CORE = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const MOIETY = { Sun: 7.5, Moon: 6, Mercury: 3.5, Venus: 3.5, Mars: 3.75, Jupiter: 4.5, Saturn: 4.5 };
    function pointsFor(c, opts) {
    const s = c.calc || calcSettings();
    let ids;
    if (s.system === 'classic') ids = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'NNode', 'SNode', 'Fortune', 'Spirit', 'Asc', 'MC'];
    else ids = [...CORE, 'NNode', 'SNode', 'Lilith', ...(s.asteroids ? ['Chiron', 'Ceres', 'Pallas', 'Juno', 'Vesta'] : []), 'Asc', 'MC', 'Vertex', 'Fortune'];
    if (c.unknownTime) ids = ids.filter(i => !['Asc', 'MC', 'Vertex', 'Fortune', 'Spirit'].includes(i));
    if (opts && opts.aspectable) ids = ids.filter(i => !['SNode', 'Vertex', 'Fortune', 'Spirit'].includes(i) || (opts.withParts && i === 'Fortune'));
    return ids.map(i => c.get(i)).filter(Boolean);
  }
  function aspectsOf(c, c2, opts) {
    const s = c.calc || calcSettings(); opts = opts || {};
    const A1 = pointsFor(c, { aspectable: true }), A2 = c2 ? pointsFor(c2, { aspectable: true }) : A1;
    if (s.system === 'classic') {
      const res = []; const same = !c2;
      for (let i = 0; i < A1.length; i++) for (let j = same ? i + 1 : 0; j < A2.length; j++) {
        const p = A1[i], q = A2[j]; if (same && p.id === 'Asc' && q.id === 'MC') continue;
        const orb = ((MOIETY[p.id] || 2.5) + (MOIETY[q.id] || 2.5)) * (opts.transit ? 0.25 : 1);
        const sep = Math.abs(A.wrap180(p.lon - q.lon));
        for (const as of A.ASPECTS.filter(a => a.major)) { const d = Math.abs(sep - as.a); if (d <= orb) { const dt = .1, s2 = Math.abs(A.wrap180(p.lon + (p.speed || 0) * dt - q.lon - (opts.staticB ? 0 : (q.speed || 0)) * dt)); res.push({ p, q, asp: as, orb: d, applying: Math.abs(s2 - as.a) < d }); break; } }
      }
      return res.sort((a, b) => a.orb - b.orb);
    }
    return A.findAspects(A1, c2 ? A2 : A1, { minor: S.settings.minor, orbMult: (S.settings.orbMult || 1), fixedOrb: opts.fixedOrb, staticB: opts.staticB });
  }

  /* ---------- Çark çizimi ---------- */
  function wheel(c, o) {
    o = o || {};
    const W = 600, cx = 300, cy = 300, outer = !!o.outer;
    const R0 = 294, R1 = outer ? 266 : 258, Rp = outer ? 172 : 236, Ro = 244, Ra = outer ? 108 : 168;
    const asc = c.houses.asc;
    const ang = l => (A.norm(l - asc) + 180) * Math.PI / 180;
    const X = (l, r) => (cx + r * Math.cos(ang(l))).toFixed(1), Yy = (l, r) => (cy - r * Math.sin(ang(l))).toFixed(1);
    let s = `<svg viewBox="0 0 ${W} ${W}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.label || 'Harita çarkı')}">`;
    s += `<defs><radialGradient id="wg${o.uid || ''}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#1a2550" stop-opacity=".9"/><stop offset="1" stop-color="#0b1226" stop-opacity=".4"/></radialGradient></defs>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R0}" fill="url(#wg${o.uid || ''})" stroke="rgba(230,238,255,.5)" stroke-width="1.4"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R1}" fill="none" stroke="rgba(230,238,255,.4)"/>`;
    // burç halkası
    for (let i = 0; i < 12; i++) {
      const l0 = i * 30, a0 = ang(l0);
      s += `<line x1="${X(l0, R1)}" y1="${Yy(l0, R1)}" x2="${X(l0, R0)}" y2="${Yy(l0, R0)}" stroke="rgba(230,238,255,.35)"/>`;
      const lm = l0 + 15;
      s += `<text x="${X(lm, (R0 + R1) / 2)}" y="${Yy(lm, (R0 + R1) / 2)}" font-size="21" text-anchor="middle" dominant-baseline="central" fill="${ELC[i % 4]}" class="sym">${SG[i]}</text>`;
      for (let d = 1; d < 30; d++) { const l = l0 + d, len = d % 10 === 0 ? 9 : d % 5 === 0 ? 6 : 3; s += `<line x1="${X(l, R1)}" y1="${Yy(l, R1)}" x2="${X(l, R1 + len)}" y2="${Yy(l, R1 + len)}" stroke="rgba(230,238,255,.3)" stroke-width=".8"/>`; }
    }
    if (outer) s += `<circle cx="${cx}" cy="${cy}" r="${Ro - 52}" fill="none" stroke="rgba(159,192,255,.3)"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${Ra}" fill="rgba(5,10,28,.35)" stroke="rgba(230,238,255,.3)"/>`;
    // evler
    const cu = c.houses.cusps;
    for (let i = 1; i <= 12; i++) {
      const l = cu[i], isAng = i === 1 || i === 4 || i === 7 || i === 10;
      s += `<line x1="${X(l, Ra)}" y1="${Yy(l, Ra)}" x2="${X(l, R1)}" y2="${Yy(l, R1)}" stroke="${isAng ? 'rgba(240,244,255,.85)' : 'rgba(230,238,255,.28)'}" stroke-width="${isAng ? 1.8 : .9}"/>`;
      const nx = cu[i % 12 + 1], midL = cu[i] + A.norm(nx - cu[i]) / 2;
      s += `<text x="${X(midL, Ra - 11)}" y="${Yy(midL, Ra - 11)}" font-size="10.5" fill="rgba(200,210,230,.7)" text-anchor="middle" dominant-baseline="central">${i}</text>`;
    }
    const lab = (l, t) => s += `<text x="${X(l, R0 + 0)}" y="${Yy(l, R0 + 0)}" font-size="0">${t}</text>`;
    // açı çizgileri
    const WA = new Set([...CORE, 'Asc', 'MC']);
    const asps = (o.aspects || []).filter(a => WA.has(a.p.id) && WA.has(a.q.id));
    for (const a of asps) {
      if (a.asp.k === 'con') continue;
      const col = { opp: '#ff8c8c', squ: '#ff8c8c', tri: '#8fb8ff', sex: '#8fb8ff', qcx: '#9fdcb0' }[a.asp.k] || '#b9c3d6';
      const r = Ra - 1;
      s += `<line x1="${X(a.p.lon, r)}" y1="${Yy(a.p.lon, r)}" x2="${X(a.q.lon, r)}" y2="${Yy(a.q.lon, r)}" stroke="${col}" stroke-width="${a.asp.major ? 1.1 : .8}" stroke-opacity="${Math.max(.25, 1 - a.orb / 9)}" ${a.asp.major ? '' : 'stroke-dasharray="3 3"'}/>`;
    }
    // gezegenler (çakışma önleme)
    function spread(arr, min) { // kümeleri eşit aralıkla, gerçek konumlarının ortasına yay
      arr.sort((x, y) => x.l - y.l);
      if (arr.length * min >= 360) min = 360 / arr.length;
      for (let it = 0; it < 60; it++) {
        // başlangıç noktası: en büyük boşluğun hemen sonrası
        let gi = 0, gmax = -1; for (let i = 0; i < arr.length; i++) { const g = A.norm(arr[(i + 1) % arr.length].l - arr[i].l); if (g > gmax) { gmax = g; gi = (i + 1) % arr.length; } }
        const seq = arr.slice(gi).concat(arr.slice(0, gi)); let base = seq[0].l, un = seq.map(x => { const u = base + A.norm(x.l - base); return u; });
        const clusters = []; for (let i = 0; i < seq.length; i++) { const last = clusters[clusters.length - 1]; if (last && un[i] - last.end < min - 1e-6) { last.items.push(i); last.end = last.start + (last.items.length - 1) * min; } else clusters.push({ items: [i], start: un[i], end: un[i] }); }
        let moved = false;
        for (const cl of clusters) { const mean = cl.items.reduce((s, i) => s + seq[i].t, 0) / cl.items.length; const start = mean - (cl.items.length - 1) * min / 2; cl.items.forEach((i, k) => { const nl = A.norm(start + k * min); if (Math.abs(A.wrap180(nl - seq[i].l)) > 1e-4) moved = true; seq[i].l = nl; }); }
        // komşu kümeler çakışıyorsa tekrar
        if (!moved) break;
        let ok = true; const s2 = [...seq].sort((x, y) => x.l - y.l); for (let i = 0; i < s2.length; i++) if (s2.length > 1 && A.norm(s2[(i + 1) % s2.length].l - s2[i].l) < min - 1e-3) ok = false;
        if (ok) break;
      }
      return arr;
    }
    function place(pts, r, small, color) {
      const arr = pts.filter(p => !['Asc', 'MC', 'Vertex', 'SNode', 'Spirit'].includes(p.id)).map(p => ({ p, l: p.lon, t: p.lon }));
      spread(arr, small ? 6.6 : 7.4);
      for (const { p, l } of arr) {
        s += `<line x1="${X(p.lon, R1)}" y1="${Yy(p.lon, R1)}" x2="${X(p.lon, R1 - 7)}" y2="${Yy(p.lon, R1 - 7)}" stroke="${color}" stroke-width="1.5"/>`;
        s += `<line x1="${X(p.lon, R1 - 7)}" y1="${Yy(p.lon, R1 - 7)}" x2="${X(l, r + 13)}" y2="${Yy(l, r + 13)}" stroke="${color}" stroke-opacity=".35" stroke-width=".7"/>`;
        if (!outer || small) s += `<line x1="${X(p.lon, Ra)}" y1="${Yy(p.lon, Ra)}" x2="${X(p.lon, Ra + 5)}" y2="${Yy(p.lon, Ra + 5)}" stroke="${color}" stroke-width="1.3"/>`;
        const g = gl(p.id), long = g.replace('\uFE0E', '').length > 1;
        s += `<text x="${X(l, r)}" y="${Yy(l, r)}" font-size="${long ? 10 : small ? 17 : 20}" fill="${color}" text-anchor="middle" dominant-baseline="central" class="sym">${esc(g)}</text>`;
        const dg = Math.floor(p.deg), mn = Math.floor((p.deg - dg) * 60), step = small ? 13 : 15;
        s += `<text x="${X(l, r - step - 3)}" y="${Yy(l, r - step - 3)}" font-size="${small ? 9 : 10.5}" font-weight="600" fill="rgba(235,240,250,.92)" text-anchor="middle" dominant-baseline="central">${dg}°</text>`;
        s += `<text x="${X(l, r - 2 * step - 3)}" y="${Yy(l, r - 2 * step - 3)}" font-size="${small ? 10 : 11.5}" fill="${ELC[p.sign % 4]}" text-anchor="middle" dominant-baseline="central" class="sym">${SG[p.sign]}</text>`;
        s += `<text x="${X(l, r - 3 * step - 3)}" y="${Yy(l, r - 3 * step - 3)}" font-size="${small ? 8.5 : 9.5}" fill="rgba(210,220,240,.8)" text-anchor="middle" dominant-baseline="central">${pad(mn)}′${p.retro ? 'ʀ' : ''}</text>`;
      }
    }
    place(o.points || pointsFor(c), Rp, false, '#eef2fa');
    if (outer) place(o.outer, Ro + 6, true, '#9fc0ff');
    // açılar etiketleri
    const angLab = [[c.houses.asc, 'ASC'], [A.norm(c.houses.asc + 180), 'DSC'], [c.houses.mc, 'MC'], [A.norm(c.houses.mc + 180), 'IC']];
    for (const [l, t] of angLab) s += `<text x="${X(l, R0 + 0) }" y="${Yy(l, R0 + 0)}" font-size="0"></text><text x="${X(l + 4, R1 - 12)}" y="${Yy(l + 4, R1 - 12)}" font-size="10" font-weight="700" fill="#cfd8ea" text-anchor="middle" dominant-baseline="central">${t}</text>`;
    if (o.center) s += o.center(cx, cy, Ra);
    s += `</svg>`;
    return s;
  }
  function moonPhaseSVG(phaseAngle, r, cx, cy) { // aydınlanmış kısım
    const k = (1 - Math.cos(phaseAngle * Math.PI / 180)) / 2, waxing = phaseAngle < 180;
    const rx = r * Math.abs(1 - 2 * k), sweepOuter = waxing ? 1 : 0, sweepInner = (k > .5) === waxing ? 1 : 0;
    const top = `${cx} ${cy - r}`, bot = `${cx} ${cy + r}`;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1b2446"/><path d="M${top} A${r} ${r} 0 0 ${sweepOuter} ${bot} A${rx} ${r} 0 0 ${sweepInner} ${top}Z" fill="url(#moonG)"/>`;
  }
  const moonDefs = `<defs><radialGradient id="moonG" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#dfe5ef"/><stop offset="1" stop-color="#a7b1c4"/></radialGradient></defs>`;

  /* ---------- Yorum üretimi ---------- */
  function signText(id, sg) {
    if (id === 'Sun') return TX.SUN[sg];
    if (id === 'Moon') return TX.MOON[sg];
    if (id === 'Asc') return TX.ASC[sg];
    if (id === 'MC') return TX.MC[sg];
    if (id === 'NNode') return TX.NODE[sg];
    if (TX.SIGNTXT[id] && ['Mercury', 'Venus', 'Mars'].includes(id)) return `${nm(id)} ${LOC[sg]}: ${TX.SIGNTXT[id][sg]}`;
    if (TX.SIGNTXT[id] && ['Jupiter', 'Saturn'].includes(id)) return TX.SIGNTXT[id][sg];
    if (['Uranus', 'Neptune', 'Pluto'].includes(id)) return `${TX.OUTERSIGN[id][sg]} Bu yerleşimi tüm kuşağınızla paylaşırsınız; sizin için kişisel anlamı, bulunduğu ev ve kişisel gezegenlerle yaptığı açılar üzerinden belirginleşir.`;
    const p = P(id); return `${p.n} ${LOC[sg]}: ${p.f} ${A.SIGNS[sg]} burcunda bu tema ${TX.S[sg].st} yaşanır.`;
  }
  function houseText(id, h) {
    if (TX.HOUSETXT[id]) return `${nm(id)} ${h}. evde (${TX.H[h].t}): ${TX.HOUSETXT[id][h - 1]}`;
    if (id === 'NNode') return TX.NODEH[h];
    if (id === 'Fortune') return `Şans Noktası ${h}. evde: Bedensel ve maddi iyilik en kolay ${TX.H[h].t} alanında akar.`;
    const p = P(id); return `${p.n} ${h}. evde: ${p.k ? p.k.split(',')[0] : ''} teması ${TX.H[h].t} alanında belirginleşir.`;
  }
  const ORDER = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  function aspectText(a, mode) {
    const i1 = ORDER.indexOf(a.p.id), i2 = ORDER.indexOf(a.q.id);
    let p = a.p.id, q = a.q.id; if (i1 > i2 && i2 >= 0) [p, q] = [q, p];
    const k = a.asp.k, soft = k === 'tri' || k === 'sex', hard = k === 'squ' || k === 'opp' || k === 'ssq' || k === 'sqq' || k === 'qcx';
    let t = `${nm(a.p.id)} ${a.asp.n.toLowerCase()} ${nm(a.q.id)} (orb ${dms(a.orb)}${a.applying ? ', yaklaşan' : ', ayrılan'}). `;
    const ang = ['Asc', 'MC'].includes(a.p.id) ? a.p.id : ['Asc', 'MC'].includes(a.q.id) ? a.q.id : null;
    const a3 = TX.ASP3[p + '-' + q] || TX.ASP3[q + '-' + p];
    if (ang) {
      const pl = ang === a.p.id ? a.q.id : a.p.id, P1 = P(pl);
      t += `${P1.n} (${P1.k}) ${ang === 'Asc' ? 'Yükselen' : 'MC'} ile bağlantılı olduğundan ${TX.ANGASP[ang][k === 'con' ? 'con' : soft ? 'soft' : 'hard']}.`;
    } else if (a3) {
      t += k === 'con' ? a3[0] : soft ? a3[1] : hard ? a3[2] : a3[1];
    } else {
      const pa = P(a.p.id), pb = P(a.q.id);
      t += `${pa.n} (${pa.k}) ile ${pb.n} (${pb.k}) birbirine bağlanır.`;
    }
    if (!a.asp.major) t += ' ' + (TX.ASPNAT[k] || '');
    return t;
  }
  function rulerOf(sign, modern) { return modern ? A.MODERN[sign] : A.RULER[sign]; }

  const paras = t => String(t || '').split('\n\n').map(x => `<p>${esc(x)}</p>`).join('');
  return { ek, LOC, paras, A, B, S, $, esc, save, toast, calcSettings, SG, ELC, P, nm, gl, dms, fmtLon, fmtLonTxt, fmtDate, fmtShort, fmtTime, nowJD, ASPN, aspClass, ASPG, inputOf, chartOf, person, activeP, pointsFor, aspectsOf, wheel, moonPhaseSVG, moonDefs, signText, houseText, aspectText, rulerOf, CORE, DEVICE_TZ, pad, store, cache };
})();
