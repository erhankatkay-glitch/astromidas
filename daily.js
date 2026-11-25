/* AstroMidas — Günlük Rehber: günün kozmik mesajı, manifest, astrolojik hava, tarot kartı, farkındalık sorusu, ritüel ve burç yorumları.
   Tüm içerik o günün gerçek gökyüzü hesabından (Ay burcu/fazı, saatli açılar, boşlukta Ay, retrolar) uygulama içinde üretilir. */
(function (root) {
  'use strict';
  const AM = root.AM, A = AM.A, B = AM.B, S = AM.S, esc = AM.esc, nm = AM.nm, $ = AM.$;
  const D = () => TX.DAY, T = () => TX.TAROT, BR = () => TX.BURC;
  const PL = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const ASP = [[0, 'con', 'kavuşum', '☌'], [60, 'sex', 'altmışlık', '⚹'], [90, 'squ', 'kare', '□'], [120, 'tri', 'üçgen', '△'], [180, 'opp', 'karşıt', '☍']];
  const sym = s => `<span class="sym">${s}</span>`;
  const G = id => sym(AM.gl(id));
  const SIGNS = A.SIGNS, SG = AM.SG;
  const LOC = ['Koç’ta', 'Boğa’da', 'İkizler’de', 'Yengeç’te', 'Aslan’da', 'Başak’ta', 'Terazi’de', 'Akrep’te', 'Yay’da', 'Oğlak’ta', 'Kova’da', 'Balık’ta'];
  const DAT = ['Koç’a', 'Boğa’ya', 'İkizler’e', 'Yengeç’e', 'Aslan’a', 'Başak’a', 'Terazi’ye', 'Akrep’e', 'Yay’a', 'Oğlak’a', 'Kova’ya', 'Balık’a'];
  const PHN = ['Yeni Ay', 'Hilal', 'İlk Dördün', 'Şişkin Ay', 'Dolunay', 'Yayılan Ay', 'Son Dördün', 'Balzamik Ay'];
  const TONE = ['ateşli ve atılgan', 'sakin ve somut', 'meraklı ve hareketli', 'duygusal ve korumacı', 'sıcak ve dışa dönük', 'titiz ve pratik', 'uyumlu ve sosyal', 'derin ve yoğun', 'iyimser ve özgür', 'ciddi ve hedef odaklı', 'özgün ve mesafeli', 'hassas ve sezgisel'];

  // tarih tohumu (aynı gün herkes aynı içeriği görür)
  function seed(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  const cap = t => t ? t.charAt(0).toLocaleUpperCase('tr-TR') + t.slice(1) : t;
  const pick = (arr, s) => arr[s % arr.length];
  const tz = () => AM.DEVICE_TZ;
  function todayStr() { const p = new Intl.DateTimeFormat('en-CA', { timeZone: tz(), year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); return p; }
  function shiftDate(ds, n) { const [y, m, d] = ds.split('-').map(Number), t = new Date(Date.UTC(y, m - 1, d + n)); return t.toISOString().slice(0, 10); }
  const hm = jd => new Intl.DateTimeFormat('tr-TR', { timeZone: tz(), hour: '2-digit', minute: '2-digit' }).format(new Date(A.utcFromJD(jd)));
  const L = (b, jd) => A.rawLon(b, jd).lon;

  /* ---------- Günün gökyüzü verisi ---------- */
  const cacheD = new Map();
  function compute(ds) {
    if (cacheD.has(ds)) return cacheD.get(ds);
    const [y, m, d] = ds.split('-').map(Number);
    const j0 = A.jdFromUTC(A.localToUTC(y, m, d, 0, 0, tz()).ms), j1 = A.jdFromUTC(A.localToUTC(...shiftDate(ds, 1).split('-').map(Number), 0, 0, tz()).ms);
    const isToday = ds === todayStr(), jRef = isToday ? AM.nowJD() : (j0 + j1) / 2;
    const moon = L('Moon', jRef), sun = L('Sun', jRef), ms = A.signOf(moon), ph = A.norm(moon - sun);
    const phi = Math.floor(((ph + 22.5) % 360) / 45), illum = Math.round((1 - Math.cos(ph * Math.PI / 180)) / 2 * 100);
    // Ay'ın gün içindeki açıları (saatlik tarama + ikiye bölme)
    const moonAsp = [];
    for (const p of PL) for (const [a, k, n, g] of ASP) for (const sg of a === 0 || a === 180 ? [1] : [1, -1]) {
      const f = j => A.wrap180(L('Moon', j) - L(p, j) - sg * a);
      let x = j0, fx = f(x);
      for (let jj = j0 + 1 / 24; jj <= j1 + 1e-9; jj += 1 / 24) {
        const fj = f(jj);
        if (fx < 0 && fj >= 0) { let lo = x, hi = jj; for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (f(mid) < 0) lo = mid; else hi = mid; } moonAsp.push({ jd: (lo + hi) / 2, p, a, k, n, g }); }
        x = jj; fx = fj;
      }
    }
    moonAsp.sort((u, v) => u.jd - v.jd);
    // Gezegenler arası açılar: gün içinde tam olanlar, yoksa 1° içinde uygulayanlar
    const plAsp = [];
    for (let i = 0; i < PL.length; i++) for (let k2 = i + 1; k2 < PL.length; k2++) {
      const p = PL[i], q = PL[k2];
      for (const [a, k, n, g] of ASP) {
        const f = j => Math.abs(A.wrap180(L(p, j) - L(q, j))) - a;
        const f0 = f(j0), f1 = f(j1);
        if (f0 * f1 <= 0 && Math.abs(f0) < 2) { let lo = j0, hi = j1, flo = f0; for (let t = 0; t < 30; t++) { const mid = (lo + hi) / 2, fm = f(mid); if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; } } plAsp.push({ jd: (lo + hi) / 2, p, q, a, k, n, g, exact: true }); }
        else if (Math.abs(f0) < 1 && Math.abs(f1) < Math.abs(f0)) plAsp.push({ jd: null, p, q, a, k, n, g, orb: Math.abs(f1), exact: false });
      }
    }
    plAsp.sort((u, v) => (u.exact === v.exact ? (u.jd || 0) - (v.jd || 0) || (u.orb || 0) - (v.orb || 0) : u.exact ? -1 : 1));
    const voc = B.voidOfCourse(j0 - 0.5, j1).filter(v => v.end > j0 && v.start < j1);
    const ing = B.moonIngresses(j0, j1);
    const retro = PL.filter(p => p !== 'Sun' && A.bodyPos(p, jRef).speed < 0);
    const stations = PL.filter(p => p !== 'Sun').flatMap(p => A.stations(p, j0 - 1, 2)).filter(s => s.jd >= j0 && s.jd < j1);
    const pIng = []; for (const p of PL) { const a0 = A.signOf(L(p, j0)), a1 = A.signOf(L(p, j1)); if (a0 !== a1) pIng.push({ p, s: a1 }); }
    const pos = {}; for (const p of ['Sun', 'Moon', ...PL.slice(1)]) pos[p] = L(p, jRef);
    const r = { ds, j0, j1, jRef, isToday, moon, ms, ph, phi, illum, moonAsp, plAsp: plAsp.slice(0, 6), voc, ing, retro, stations, pIng, pos, s: seed('AstroMidas|' + ds) };
    if (cacheD.size > 20) cacheD.clear(); cacheD.set(ds, r);
    return r;
  }

  /* ---------- İçerik ---------- */
  function content(r) {
    const DY = D(), s = r.s;
    const card = tarotCard(seed('tarot|' + r.ds) % 78);
    return {
      msg: pick(DY.MSG[r.ms], s), phaseMsg: DY.PHASEMSG[r.phi],
      mani: pick(DY.MANI[r.ms], s >>> 3), q: pick(DY.Q[r.ms], s >>> 5), rit: pick(DY.RIT[r.phi], s >>> 7), card
    };
  }
  function tarotCard(i) {
    const TT = T();
    if (i < 22) { const c = TT.MAJOR[i]; return { major: true, i, n: c.n, e: c.e, k: c.k, m: c.m, d: c.d, num: ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'][i] }; }
    const j = i - 22, su = Math.floor(j / 14), rk = j % 14, c = TT.MINOR[su][rk], suit = TT.SUITS[su];
    return { major: false, i, su, rk, n: rk === 0 ? `${suit.s1} Ası` : `${suit.gen} ${TT.RANKS[rk]}`, k: c[0], m: c[1], d: c[2], suit: suit.n, sg: suit.g };
  }
  function signReading(r, s) {
    const BB = BR(), h = (r.ms - s + 12) % 12, vh = (A.signOf(r.pos.Venus) - s + 12) % 12, sd = r.s >>> 11;
    const rel = (r.ms - s + 12) % 12, er = rel === 0 || rel === 4 || rel === 8 ? 'same' : rel === 2 || rel === 10 ? 'friend' : rel === 3 || rel === 9 ? 'square' : 'neutral';
    const hardTo = p => { const d = (A.signOf(r.pos[p]) - s + 12) % 12; return d === 3 || d === 9 ? 'kare' : d === 6 ? 'karşıt' : d === 0 ? 'kavuşum' : ''; };
    const softTo = p => { const d = (A.signOf(r.pos[p]) - s + 12) % 12; return d === 4 || d === 8 ? 'üçgen' : d === 2 || d === 10 ? 'altmışlık' : d === 0 ? 'kavuşum' : ''; };
    let love = BB.LOVE[h] + ' ' + BB.VEN[vh];
    if (r.retro.includes('Venus')) love += ' Venüs retroda: eski bir ilişki ya da duygu gündeme gelebilir.';
    let money = BB.MONEY[h]; if (r.retro.includes('Mercury')) money += ' Merkür retrosu nedeniyle imza ve ödemeleri iki kez kontrol et.';
    let mood = BB.MOOD[h] + (BB.ELEM[er] ? ' ' + BB.ELEM[er] : '');
    let care = BB.CARE[h]; const mh = hardTo('Mars'), sh = hardTo('Saturn');
    if (mh && mh !== 'kavuşum') care += ` Mars burcuna ${mh} açıda: gerginliği spora ya da işe yönlendir.`;
    else if (mh === 'kavuşum') care += ' Mars burcunda: enerjin yüksek ama sabrın kısa.';
    if (sh && sh !== 'kavuşum') care += ` Satürn burcuna ${sh} açıda: sorumluluklar ağır gelebilir, kendine adım adım ilerleme izni ver.`;
    let opp = BB.OPP[h]; const jh = softTo('Jupiter'); if (jh) opp += ` Jüpiter burcuna ${jh === 'kavuşum' ? 'kavuşuyor' : jh + ' açıda'}: şans kapıları aralık, cesur ol.`;
    const ingNote = r.ing.length ? ` Ay gün içinde (${hm(r.ing[0].jd)}) ${DAT[r.ing[0].sign]} geçince tema ${((r.ing[0].sign - s + 12) % 12) + 1}. eve kayıyor.` : '';
    return { love, money, mood: mood + ingNote, care, opp, mani: pick(BB.MANI[s], sd), house: h + 1 };
  }

  /* ---------- Tarot kart çizimi (özgün sembolik tasarım) ---------- */
  const SUITICON = [
    (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M0 -14 L0 14"/><path d="M0 -10 C4 -13 6 -9 3 -7 M0 -4 C-4 -7 -6 -3 -3 -1"/><circle cx="0" cy="-15" r="1.6" fill="currentColor"/></g>`,
    (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M-8 -12 H8 C8 -2 4 2 0 3 C-4 2 -8 -2 -8 -12Z"/><path d="M0 3 V10 M-5 12 H5"/></g>`,
    (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M0 -15 L2 -11 V7 H-2 V-11Z"/><path d="M-6 7 H6 M0 7 V13"/><circle cx="0" cy="14.5" r="1.4" fill="currentColor"/></g>`,
    (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="currentColor" stroke-width="1.3"><circle r="11"/><path d="M0 -9 L5.3 7.3 L-8.6 -2.8 H8.6 L-5.3 7.3Z" stroke-linejoin="round"/></g>`
  ];
  const EMB = {
    deli: '<circle cx="60" cy="58" r="13"/><path d="M28 128 H70 L92 104"/><path d="M78 92 l6 -16 l6 16" /><circle cx="84" cy="70" r="5"/>',
    buyucu: '<path d="M40 70 C40 58 58 58 60 70 C62 82 80 82 80 70 C80 58 62 58 60 70 C58 82 40 82 40 70Z"/><path d="M30 112 H90 M38 112 V128 M82 112 V128"/><path d="M60 90 V104"/>',
    basrahibe: '<path d="M30 50 V130 M90 50 V130"/><path d="M26 50 H34 M86 50 H94"/><path d="M68 72 A14 14 0 1 1 68 98 A10 10 0 1 0 68 72Z"/>',
    imparatorice: '<circle cx="60" cy="68" r="16"/><path d="M60 84 V118 M48 104 H72"/><path d="M34 128 C40 112 44 112 46 128 M74 128 C76 112 80 112 86 128"/>',
    imparator: '<rect x="38" y="72" width="44" height="52"/><path d="M38 72 L46 54 L54 66 L60 50 L66 66 L74 54 L82 72"/><path d="M60 86 V110 M50 98 H70"/>',
    basrahip: '<path d="M60 44 V130 M46 60 H74 M42 76 H78 M38 92 H82"/><circle cx="60" cy="40" r="4"/>',
    asiklar: '<circle cx="60" cy="50" r="11"/><path d="M60 30 V36 M42 50 H36 M84 50 H78"/><path d="M60 126 C30 104 34 80 50 82 C56 83 60 90 60 94 C60 90 64 83 70 82 C86 80 90 104 60 126Z"/>',
    araba: '<rect x="36" y="58" width="48" height="36"/><circle cx="42" cy="112" r="12"/><circle cx="78" cy="112" r="12"/><path d="M48 58 L60 44 L72 58"/><circle cx="60" cy="76" r="6"/>',
    guc: '<path d="M38 52 C38 42 54 42 60 52 C66 62 82 62 82 52 C82 42 66 42 60 52 C54 62 38 62 38 52Z"/><circle cx="60" cy="98" r="22"/><path d="M48 92 C54 86 66 86 72 92 M52 104 C56 108 64 108 68 104"/>',
    ermis: '<path d="M60 40 V52"/><path d="M48 52 H72 L76 100 H44Z"/><path d="M60 64 L63 74 L73 76 L63 80 L60 90 L57 80 L47 76 L57 74Z"/><path d="M52 100 V128 M68 100 V128"/>',
    cark: '<circle cx="60" cy="86" r="34"/><circle cx="60" cy="86" r="10"/><path d="M60 52 V120 M26 86 H94 M36 62 L84 110 M84 62 L36 110"/>',
    adalet: '<path d="M60 40 V128 M44 128 H76 M30 60 H90"/><path d="M30 60 L20 88 H40Z M90 60 L80 88 H100Z"/><circle cx="60" cy="40" r="4"/>',
    asilan: '<path d="M30 40 H90 M60 40 V66"/><circle cx="60" cy="112" r="9"/><path d="M60 66 L44 96 H76Z"/><path d="M50 82 L70 82"/>',
    olum: '<path d="M24 112 H96"/><path d="M42 112 A18 18 0 0 1 78 112"/><path d="M60 46 C66 52 72 54 72 62 C72 70 64 72 60 66 C56 72 48 70 48 62 C48 54 54 52 60 46Z"/><path d="M60 72 V86"/>',
    denge: '<path d="M34 60 H54 L50 82 H38Z M66 96 H86 L82 118 H70Z"/><path d="M52 66 C64 72 70 82 72 96" stroke-dasharray="3 3"/><path d="M60 38 L64 48 L56 48Z"/>',
    seytan: '<circle cx="60" cy="84" r="34"/><path d="M60 116 L40 60 L88 94 H32 L80 60Z" stroke-linejoin="round"/>',
    kule: '<path d="M44 128 V64 H76 V128"/><path d="M40 64 H80 M44 64 V56 H52 V64 M58 64 V56 H62 V64 M68 64 V56 H76 V64"/><path d="M88 34 L70 62 H82 L62 92" stroke-width="2"/><rect x="54" y="90" width="12" height="18"/>',
    yildiz: '<path d="M60 40 L66 66 L92 72 L66 78 L60 104 L54 78 L28 72 L54 66Z"/><path d="M30 112 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3Z M90 112 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3Z"/>',
    ay: '<path d="M72 44 A26 26 0 1 0 72 96 A20 20 0 1 1 72 44Z"/><path d="M30 130 V108 H40 V130 M80 130 V108 H90 V130"/><path d="M52 104 v4 M60 110 v4 M68 104 v4"/>',
    gunes: '<circle cx="60" cy="84" r="20"/>' + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${(60 + 26 * Math.cos(a)).toFixed(1)} ${(84 + 26 * Math.sin(a)).toFixed(1)} L${(60 + 38 * Math.cos(a)).toFixed(1)} ${(84 + 38 * Math.sin(a)).toFixed(1)}"/>`; }).join(''),
    mahkeme: '<path d="M30 70 L76 52 V88 L30 70Z"/><path d="M76 60 H90 M76 70 H94 M76 80 H90"/><path d="M36 128 V108 H52 V128 M68 128 V108 H84 V128"/>',
    dunya: '<ellipse cx="60" cy="86" rx="28" ry="40"/><path d="M60 70 L64 82 L76 86 L64 90 L60 102 L56 90 L44 86 L56 82Z"/><circle cx="22" cy="44" r="3"/><circle cx="98" cy="44" r="3"/><circle cx="22" cy="128" r="3"/><circle cx="98" cy="128" r="3"/>'
  };
  function cardSVG(c) {
    let inner = '';
    if (c.major) inner = `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${EMB[c.e] || ''}</g>`;
    else {
      const f = SUITICON[c.su];
      if (c.rk === 0) inner = f(60, 86, 2.4);
      else if (c.rk < 10) { const n = c.rk + 1, cols = n <= 3 ? 1 : 2, rows = Math.ceil(n / cols); for (let k = 0; k < n; k++) { const col = cols === 1 ? 0 : k % 2, row = cols === 1 ? k : Math.floor(k / 2), x = cols === 1 ? 60 : 44 + col * 32, y = 86 + (row - (rows - 1) / 2) * (rows > 4 ? 18 : 22) + (cols === 2 && n % 2 && k === n - 1 ? 0 : 0); inner += f(cols === 2 && n % 2 && k === n - 1 ? 60 : x, y, rows > 4 ? 0.58 : rows > 3 ? 0.7 : 0.85); } }
      else { inner = f(60, 96, 1.6) + ['<path d="M48 58 L52 46 L60 54 L68 46 L72 58Z" fill="none" stroke="currentColor" stroke-width="1.4"/>', '<path d="M46 62 C46 44 74 44 74 62 L70 66 H50Z" fill="none" stroke="currentColor" stroke-width="1.4"/>', '<path d="M46 60 L50 44 L56 54 L60 40 L64 54 L70 44 L74 60Z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="60" cy="38" r="2" fill="currentColor"/>', '<path d="M44 60 L48 42 L56 52 L60 36 L64 52 L72 42 L76 60Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M44 64 H76" stroke="currentColor" stroke-width="1.6"/>'][c.rk - 10]; }
    }
    return `<svg class="tcard" viewBox="0 0 120 172" role="img" aria-label="${esc(c.n)}"><defs><linearGradient id="tcg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a4668"/><stop offset="1" stop-color="#141b33"/></linearGradient><linearGradient id="tcb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f7fc"/><stop offset=".5" stop-color="#8c98b2"/><stop offset="1" stop-color="#dfe5f0"/></linearGradient><radialGradient id="tch" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#cfdcff" stop-opacity=".22"/><stop offset="1" stop-color="#cfdcff" stop-opacity="0"/></radialGradient></defs>
      <rect x="1" y="1" width="118" height="170" rx="9" fill="url(#tcg)" stroke="url(#tcb)" stroke-width="2"/><rect x="7" y="7" width="106" height="158" rx="6" fill="url(#tch)" stroke="rgba(230,236,250,.35)" stroke-width=".8"/>
      <rect x="11" y="11" width="98" height="150" rx="4" fill="none" stroke="rgba(230,236,250,.18)" stroke-width=".6" stroke-dasharray="1 2.4"/>
      ${[[11, 11], [109, 11], [11, 161], [109, 161]].map(([x, y]) => `<path d="M${x} ${y - 3.5} L${x + 3.5} ${y} L${x} ${y + 3.5} L${x - 3.5} ${y}Z" fill="#e8edf7"/>`).join('')}
      <circle cx="60" cy="86" r="40" fill="none" stroke="rgba(230,236,250,.22)" stroke-width=".7"/><circle cx="60" cy="86" r="44" fill="none" stroke="rgba(230,236,250,.12)" stroke-width=".5" stroke-dasharray="1 3"/>
      ${[[22, 40, 1.1], [98, 36, .9], [96, 128, 1.2], [24, 132, .8], [30, 70, .6], [92, 96, .7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".8"/>`).join('')}
      <path d="M34 142 H86" stroke="rgba(230,236,250,.35)" stroke-width=".6"/><path d="M34 30 H86" stroke="rgba(230,236,250,.35)" stroke-width=".6"/>
      <text x="60" y="24" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="13" fill="#eef2f9">${c.major ? c.num : ''}</text>
      <g color="#eef2fa" style="filter:drop-shadow(0 0 3px rgba(210,225,255,.55))">${inner}</g>
      <text x="60" y="156" text-anchor="middle" font-family="Manrope,system-ui,sans-serif" font-size="${c.n.length > 18 ? 7.4 : 8.6}" font-weight="600" letter-spacing=".04em" fill="#eef2f9">${esc(c.n.toLocaleUpperCase('tr-TR'))}</text></svg>`;
  }

  /* ---------- Görünüm ---------- */
  function sec(icon, title, body) { return `<section class="card dsec"><h3><span class="dic">${icon}</span>${title}</h3>${body}</section>`; }
  function view() {
    const ds = S.dayDate || todayStr(), r = compute(ds), c = content(r), DY = D();
    const ap = AM.activeP ? AM.activeP() : null;
    const mySign = ap ? A.signOf(AM.chartOf(ap, { zodiac: 'T', system: 'modern' }).get('Sun').lon) : null;
    const sel = S.daySign != null ? S.daySign : (mySign != null ? mySign : 0);
    const dLabel = new Intl.DateTimeFormat('tr-TR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ds + 'T12:00:00Z'));
    let h = `<div class="dnav"><button class="chip" data-dday="-1" aria-label="Önceki gün">‹</button><div class="dtitle"><b>${esc(dLabel)}</b><small>${r.isToday ? 'Bugün' : '<button class="linkbtn" data-dday="0">Bugüne dön</button>'}</small></div><button class="chip" data-dday="1" aria-label="Sonraki gün">›</button></div>`;
    h += `<div class="row" style="justify-content:center;margin:6px 0 4px"><input type="date" id="d_pick" value="${ds}" style="max-width:200px"><button class="btn ghost" data-dact="copy">Paylaşmak için kopyala</button></div>`;
    // 1 mesaj
    h += sec('✦', 'Günün kozmik mesajı', `<p class="dquote">${esc(c.msg)}</p><p class="small muted">${esc(c.phaseMsg)}</p>`);
    // 2 manifest
    h += sec('☾', 'Günlük manifest', `<p class="dmani">“${esc(c.mani)}”</p><p class="small muted">Sabah kalkınca üç kez, yavaşça ve sesli tekrar et.</p>`);
    // 3 astrolojik hava
    const F = DY.FOCUS[r.ms];
    let wx = `<p><b>Ay ${LOC[r.ms]} ${sym(SG[r.ms])}</b> · ${PHN[r.phi]} (%${r.illum} aydınlık). Gökyüzünün tonu ${TONE[r.ms]}.</p>`;
    wx += `<p><b>Ön planda:</b> ${esc(F[0])}.<br><b>Dikkat:</b> ${esc(F[1])}.</p>`;
    if (r.ing.length) wx += `<p>${esc(DY.INGRESS.replace('{s}', SIGNS[r.ing[0].sign]).replace('{k}', TONE[r.ing[0].sign]))} <span class="muted small">(${hm(r.ing[0].jd)})</span></p>`;
    if (r.voc.length) wx += `<p><b>Boşlukta Ay:</b> ${r.voc.map(v => `${v.start < r.j0 ? 'gün başından' : hm(v.start)} – ${v.end >= r.j1 ? 'gün sonuna kadar' : hm(v.end)}`).join(', ')}. <span class="small muted">${esc(DY.VOC)}</span></p>`;
    if (r.moonAsp.length) wx += `<h4>Ay’ın bugünkü açıları</h4><div class="list">${r.moonAsp.map(x => { const t = DY.MOONASP[x.p][x.k === 'con' ? 0 : x.k === 'tri' || x.k === 'sex' ? 1 : 2]; return `<div><b>${hm(x.jd)}</b> · ${G('Moon')} ${sym(x.g)} ${G(x.p)} Ay ${x.n} ${esc(nm(x.p))}<br><span class="small">${esc(t)}</span></div>`; }).join('')}</div>`;
    if (r.plAsp.length) wx += `<h4>Gezegenlerin açıları</h4><div class="list">${r.plAsp.map(x => `<div><b>${x.exact ? hm(x.jd) + ' tam' : 'yaklaşıyor, orb ' + AM.dms(x.orb)}</b> · ${G(x.p)} ${sym(x.g)} ${G(x.q)} ${esc(nm(x.p))} ${x.n} ${esc(nm(x.q))}<br><span class="small">${esc(cap(DY.PL[x.p]))} ile ${esc(DY.PL[x.q])} ${esc(DY.ASPDAY[x.k])}</span></div>`).join('')}</div>`;
    if (r.pIng.length) wx += `<p>${r.pIng.map(x => `${G(x.p)} <b>${esc(nm(x.p))} bugün ${DAT[x.s]} geçiyor.</b>`).join(' ')}</p>`;
    if (r.stations.length) wx += `<p>${r.stations.map(x => `${G(x.body)} <b>${esc(nm(x.body))} ${x.type === 'R' ? 'retroya giriyor' : 'direkt dönüyor'} (saat ${hm(x.jd)}).</b>`).join(' ')}</p>`;
    if (r.retro.length) wx += `<h4>Retro gezegenler</h4>${r.retro.map(p => `<p class="small">${G(p)} ${esc(DY.RETRO[p] || nm(p) + ' retroda.')}</p>`).join('')}`;
    h += sec('☉', 'Bugünün astrolojik havası', wx);
    // 4 kart
    h += sec('✧', 'Günün kartı', `<div class="dcard">${cardSVG(c.card)}<div><h4 style="margin-top:0">${esc(c.card.n)}</h4><p class="small muted">${c.card.major ? 'Büyük Arkana' : 'Küçük Arkana · ' + esc(c.card.suit) + ' — ' + esc(c.card.sg)}</p><p class="small"><b>Anahtar:</b> ${esc(c.card.k)}</p></div></div><p>${esc(c.card.m)}</p><p><b>Bugüne yansıması:</b> ${esc(c.card.d)}</p>`);
    // 5 soru
    h += sec('?', 'Günün farkındalık sorusu', `<p class="dquote">${esc(c.q)}</p><p class="small muted">Cevabı düşünmeden, aklına ilk geleni bir yere yaz.</p>`);
    // 6 ritüel
    h += sec('❋', 'Günün küçük ritüeli', `<p><b>${esc(c.rit[0])}</b> <span class="tag">${esc(c.rit[1])}</span></p><p>${esc(c.rit[2])}</p>`);
    // burçlar
    h += `<h2 class="dh2">Burçlara özel günlük yorum</h2><div class="dsigns">${SIGNS.map((n, i) => `<button class="chip ${i === sel ? 'on' : ''}" data-dsign="${i}">${sym(SG[i])} ${n}${i === mySign ? ' •' : ''}</button>`).join('')}</div>`;
    const R = signReading(r, sel);
    h += `<section class="card dsec"><h3><span class="dic">${sym(SG[sel])}</span>${SIGNS[sel]} ${mySign === sel && ap ? '<span class="small muted">(' + esc(ap.name) + ' · Güneş burcu)</span>' : ''}</h3><p class="small muted">Ay bugün ${SIGNS[sel]} için ${R.house}. evde (güneş burcu evleri).</p>
      <p>❤️ <b>Aşk ve ilişkiler:</b> ${esc(R.love)}</p><p>💰 <b>Para ve kariyer:</b> ${esc(R.money)}</p><p>🧠 <b>Ruh hali ve enerji:</b> ${esc(R.mood)}</p><p>⚠️ <b>Dikkat:</b> ${esc(R.care)}</p><p>✨ <b>Günün fırsatı:</b> ${esc(R.opp)}</p><p>🌙 <b>${SIGNS[sel]} manifesti:</b> “${esc(R.mani)}”</p></section>`;
    h += `<p class="small muted" style="text-align:center">Saatler ${esc(tz())} saat dilimine göredir. İçerik, o günün gerçek gökyüzü hesabından uygulama içinde üretilir; burç yorumları Güneş burcuna göre genel yorumlardır, kişisel harita yerine geçmez.</p>`;
    return h;
  }
  function plainText() {
    const ds = S.dayDate || todayStr(), r = compute(ds), c = content(r), DY = D();
    const dLabel = new Intl.DateTimeFormat('tr-TR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ds + 'T12:00:00Z'));
    const F = DY.FOCUS[r.ms];
    let t = `✨ AstroMidas · ${dLabel}\n\n1. Günün kozmik mesajı\n${c.msg}\n${c.phaseMsg}\n\n2. Günlük manifest\n“${c.mani}”\n\n3. Bugünün astrolojik havası\nAy ${LOC[r.ms]} · ${PHN[r.phi]} (%${r.illum})\nÖn planda: ${F[0]}.\nDikkat: ${F[1]}.\n`;
    if (r.voc.length) t += `Boşlukta Ay: ${r.voc.map(v => `${v.start < r.j0 ? 'gün başı' : hm(v.start)}–${v.end >= r.j1 ? 'gün sonu' : hm(v.end)}`).join(', ')}\n`;
    for (const x of r.moonAsp) t += `${hm(x.jd)} Ay ${x.n} ${nm(x.p)}: ${DY.MOONASP[x.p][x.k === 'con' ? 0 : x.k === 'tri' || x.k === 'sex' ? 1 : 2]}\n`;
    for (const x of r.plAsp.filter(x => x.exact)) t += `${hm(x.jd)} ${nm(x.p)} ${x.n} ${nm(x.q)}: ${cap(DY.PL[x.p])} ile ${DY.PL[x.q]} ${DY.ASPDAY[x.k]}\n`;
    if (r.retro.length) t += `Retro: ${r.retro.map(nm).join(', ')}\n`;
    t += `\n4. Günün kartı: ${c.card.n}\n${c.card.m}\nBugüne yansıması: ${c.card.d}\n\n5. Günün farkındalık sorusu\n${c.q}\n\n6. Günün küçük ritüeli (${c.rit[1]}): ${c.rit[0]}\n${c.rit[2]}\n\n♈ Burçlara özel\n`;
    for (let s = 0; s < 12; s++) { const R = signReading(r, s); t += `\n${SIGNS[s]}\n❤️ Aşk: ${R.love}\n💰 Para ve kariyer: ${R.money}\n🧠 Ruh hali: ${R.mood}\n⚠️ Dikkat: ${R.care}\n✨ Fırsat: ${R.opp}\n🌙 Manifest: ${R.mani}\n`; }
    return t;
  }
  // olaylar
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-dday],[data-dsign],[data-dact]'); if (!t) return;
    if (t.dataset.dday != null) { const n = +t.dataset.dday; S.dayDate = n === 0 ? null : shiftDate(S.dayDate || todayStr(), n); root.render(); return; }
    if (t.dataset.dsign != null) { S.daySign = +t.dataset.dsign; root.render(); return; }
    if (t.dataset.dact === 'copy') { const txt = plainText(); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => AM.toast('Günün içeriği kopyalandı'), () => { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); AM.toast('Günün içeriği kopyalandı'); } catch (er) { AM.toast('Kopyalanamadı'); } ta.remove(); }); }
  });
  document.addEventListener('change', e => { if (e.target.id === 'd_pick' && e.target.value) { S.dayDate = e.target.value === todayStr() ? null : e.target.value; root.render(); } });
  root.DAILY = { view, compute, content, signReading, plainText, tarotCard, cardSVG, todayStr };
})(window);
