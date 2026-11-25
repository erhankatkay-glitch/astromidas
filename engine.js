/* Yıldız Atlası — hesap motoru
   Kaynaklar: J. Meeus, Astronomical Algorithms (2. bs.) — Ay (ELP2000 kısaltılmış, bl. 47), nütasyon, eğiklik, yıldız zamanı;
   E.M. Standish (JPL), "Keplerian Elements for Approximate Positions of the Major Planets" (1800–2050);
   P. Schlyter, "How to compute planetary positions" — Jüpiter/Satürn/Uranüs pertürbasyonları;
   Espenak & Meeus ΔT polinomları; ev sistemleri Swiss Ephemeris belgelerindeki formüllerle. */
(function (root) {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const sin = x => Math.sin(x * D2R), cos = x => Math.cos(x * D2R), tan = x => Math.tan(x * D2R);
  const asin = x => Math.asin(Math.max(-1, Math.min(1, x))) * R2D;
  const acos = x => Math.acos(Math.max(-1, Math.min(1, x))) * R2D;
  const atan2 = (y, x) => Math.atan2(y, x) * R2D;
  const norm = x => ((x % 360) + 360) % 360;
  const wrap180 = x => { x = norm(x); return x > 180 ? x - 360 : x; };

  /* ---------- Zaman ---------- */
  function jdFromUTC(ms) { return ms / 86400000 + 2440587.5; }
  function utcFromJD(jd) { return (jd - 2440587.5) * 86400000; }
  function deltaT(year) {
    let t;
    if (year < 1800) { const u = (year - 1820) / 100; return -20 + 32 * u * u; }
    if (year < 1860) { t = year - 1800; return 13.72 - 0.332447 * t + 0.0068612 * t ** 2 + 0.0041116 * t ** 3 - 0.00037436 * t ** 4 + 0.0000121272 * t ** 5 - 0.0000001699 * t ** 6 + 0.000000000875 * t ** 7; }
    if (year < 1900) { t = year - 1860; return 7.62 + 0.5737 * t - 0.251754 * t ** 2 + 0.01680668 * t ** 3 - 0.0004473624 * t ** 4 + t ** 5 / 233174; }
    if (year < 1920) { t = year - 1900; return -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4; }
    if (year < 1941) { t = year - 1920; return 21.20 + 0.84493 * t - 0.0761 * t ** 2 + 0.0020936 * t ** 3; }
    if (year < 1961) { t = year - 1950; return 29.07 + 0.407 * t - t * t / 233 + t ** 3 / 2547; }
    if (year < 1986) { t = year - 1975; return 45.45 + 1.067 * t - t * t / 260 - t ** 3 / 718; }
    if (year < 2000) { t = year - 2000; return 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5; }
    // ölçülen değerler (IERS) 2000–2025, sonrası yavaş artış varsayımı
    const tab = [[2000, 63.83], [2005, 64.69], [2010, 66.07], [2015, 67.64], [2020, 69.36], [2025, 69.2]];
    if (year >= 2025) return 69.2 + 0.1 * (year - 2025);
    for (let i = 0; i < tab.length - 1; i++) if (year < tab[i + 1][0]) { const [y0, v0] = tab[i], [y1, v1] = tab[i + 1]; return v0 + (v1 - v0) * (year - y0) / (y1 - y0); }
    return 69.2;
  }
  function jdTT(jdUT) { const y = 2000 + (jdUT - 2451545) / 365.25; return jdUT + deltaT(y) / 86400; }

  // IANA saat dilimi ile yerel saat → UTC (tarihsel yaz saati kuralları tarayıcının tz veritabanından)
  function tzOffsetMin(zone, ms) {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const p = {}; for (const x of f.formatToParts(new Date(ms))) p[x.type] = x.value;
    const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    return Math.round((asUTC - Math.floor(ms / 1000) * 1000) / 60000);
  }
  function localToUTC(y, mo, d, h, mi, zone) {
    const naive = Date.UTC(y, mo - 1, d, h, mi);
    let off = tzOffsetMin(zone, naive);
    let utc = naive - off * 60000;
    const off2 = tzOffsetMin(zone, utc);
    if (off2 !== off) utc = naive - off2 * 60000;
    return { ms: utc, offsetMin: tzOffsetMin(zone, utc) };
  }

  /* ---------- Nütasyon ve eğiklik ---------- */
  function nutation(T) {
    const Om = 125.04452 - 1934.136261 * T, L = 280.4665 + 36000.7698 * T, Lp = 218.3165 + 481267.8813 * T;
    const dpsi = (-17.20 * sin(Om) - 1.32 * sin(2 * L) - 0.23 * sin(2 * Lp) + 0.21 * sin(2 * Om)) / 3600;
    const deps = (9.20 * cos(Om) + 0.57 * cos(2 * L) + 0.10 * cos(2 * Lp) - 0.09 * cos(2 * Om)) / 3600;
    const eps0 = 23 + 26 / 60 + 21.448 / 3600 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T ** 3) / 3600;
    return { dpsi, deps, eps0, eps: eps0 + deps };
  }

  /* ---------- Ay (Meeus bl. 47) ---------- */
  const ML = [[0,0,1,0,6288774,-20905355],[2,0,-1,0,1274027,-3699111],[2,0,0,0,658314,-2955968],[0,0,2,0,213618,-569925],[0,1,0,0,-185116,48888],[0,0,0,2,-114332,-3149],[2,0,-2,0,58793,246158],[2,-1,-1,0,57066,-152138],[2,0,1,0,53322,-170733],[2,-1,0,0,45758,-204586],[0,1,-1,0,-40923,-129620],[1,0,0,0,-34720,108743],[0,1,1,0,-30383,104755],[2,0,0,-2,15327,10321],[0,0,1,2,-12528,0],[0,0,1,-2,10980,79661],[4,0,-1,0,10675,-34782],[0,0,3,0,10034,-23210],[4,0,-2,0,8548,-21636],[2,1,-1,0,-7888,24208],[2,1,0,0,-6766,30824],[1,0,-1,0,-5163,-8379],[1,1,0,0,4987,-16675],[2,-1,1,0,4036,-12831],[2,0,2,0,3994,-10445],[4,0,0,0,3861,-11650],[2,0,-3,0,3665,14403],[0,1,-2,0,-2689,-7003],[2,0,-1,2,-2602,0],[2,-1,-2,0,2390,10056],[1,0,1,0,-2348,6322],[2,-2,0,0,2236,-9884],[0,1,2,0,-2120,5751],[0,2,0,0,-2069,0],[2,-2,-1,0,2048,-4950],[2,0,1,-2,-1773,4130],[2,0,0,2,-1595,0],[4,-1,-1,0,1215,-3958],[0,0,2,2,-1110,0],[3,0,-1,0,-892,3258],[2,1,1,0,-810,2616],[4,-1,-2,0,759,-1897],[0,2,-1,0,-713,-2117],[2,2,-1,0,-700,2354],[2,1,-2,0,691,0],[2,-1,0,-2,596,0],[4,0,1,0,549,-1423],[0,0,4,0,537,-1117],[4,-1,0,0,520,-1571],[1,0,-2,0,-487,-1739],[2,1,0,-2,-399,0],[0,0,2,-2,-381,-4421],[1,1,1,0,351,0],[3,0,-2,0,-340,0],[4,0,-3,0,330,0],[2,-1,2,0,327,0],[0,2,1,0,-323,1165],[1,1,-1,0,299,0],[2,0,3,0,294,0]];
  const MB = [[0,0,0,1,5128122],[0,0,1,1,280602],[0,0,1,-1,277693],[2,0,0,-1,173237],[2,0,-1,1,55413],[2,0,-1,-1,46271],[2,0,0,1,32573],[0,0,2,1,17198],[2,0,1,-1,9266],[0,0,2,-1,8822],[2,-1,0,-1,8216],[2,0,-2,-1,4324],[2,0,1,1,4200],[2,1,0,-1,-3359],[2,-1,-1,1,2463],[2,-1,0,1,2211],[2,-1,-1,-1,2065],[0,1,-1,-1,-1870],[4,0,-1,-1,1828],[0,1,0,1,-1794],[0,0,0,3,-1749],[0,1,-1,1,-1565],[1,0,0,1,-1491],[0,1,1,1,-1475],[0,1,1,-1,-1410],[0,1,0,-1,-1344],[1,0,0,-1,-1335],[0,0,3,1,1107],[4,0,0,-1,1021],[4,0,-1,1,833]];
  function moonArgs(T) {
    return {
      Lp: norm(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T ** 3 / 538841 - T ** 4 / 65194000),
      D: norm(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T ** 3 / 545868 - T ** 4 / 113065000),
      M: norm(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T ** 3 / 24490000),
      Mp: norm(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T ** 3 / 69699 - T ** 4 / 14712000),
      F: norm(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T ** 3 / 3526000 + T ** 4 / 863310000)
    };
  }
  function moonGeo(T) { // ortalama ekinoks, nütasyonsuz; km
    const { Lp, D, M, Mp, F } = moonArgs(T);
    const E = 1 - 0.002516 * T - 0.0000074 * T * T;
    const A1 = 119.75 + 131.849 * T, A2 = 53.09 + 479264.290 * T, A3 = 313.45 + 481266.484 * T;
    let sl = 0, sr = 0, sb = 0;
    for (const [d, m, mp, f, l, r] of ML) {
      const arg = d * D + m * M + mp * Mp + f * F, e = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E * E : 1;
      sl += l * e * sin(arg); sr += r * e * cos(arg);
    }
    for (const [d, m, mp, f, b] of MB) {
      const e = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E * E : 1;
      sb += b * e * sin(d * D + m * M + mp * Mp + f * F);
    }
    sl += 3958 * sin(A1) + 1962 * sin(Lp - F) + 318 * sin(A2);
    sb += -2235 * sin(Lp) + 382 * sin(A3) + 175 * sin(A1 - F) + 175 * sin(A1 + F) + 127 * sin(Lp - Mp) - 115 * sin(Lp + Mp);
    return { lon: norm(Lp + sl / 1e6), lat: sb / 1e6, dist: 385000.56 + sr / 1000 };
  }
  function lunarNodes(T) {
    const mean = norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T ** 3 / 467441 - T ** 4 / 60616000);
    const { D, M, Mp, F } = moonArgs(T);
    const tru = norm(mean - 1.4979 * sin(2 * (D - F)) - 0.1500 * sin(M) - 0.1226 * sin(2 * D) + 0.1176 * sin(2 * F) - 0.0801 * sin(2 * (Mp - F)));
    // ortalama Ay apojesi (Kara Ay / Lilith)
    const perigee = 83.3532465 + 4069.0137287 * T - 0.0103200 * T * T - T ** 3 / 80053 + T ** 4 / 18999000;
    return { mean, tru, lilith: norm(perigee + 180) };
  }

  /* ---------- Gezegenler ---------- */
  // Standish (JPL) 1800–2050: a, e, I, L, ϖ, Ω ve yüzyıllık değişimleri (J2000 ekliptiği)
  const KEP = {
    Mercury: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081],
    Venus: [0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418],
    EMB: [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0, 0],
    Mars: [1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343],
    Neptune: [30.06992276, 0.00026291, 0.00859048, 0.00005105, 1.77004347, 0.00035372, -55.12002969, 218.45945325, 44.96476227, -0.32241464, 131.78422574, -0.00508664],
    Pluto: [39.48211675, -0.00031596, 0.24882730, 0.00005170, 17.14001206, 0.00004818, 238.92903833, 145.20780515, 224.06891629, -0.04062942, 110.30393684, -0.01183482]
  };
  function kepler(M, e) { let E = M + R2D * e * sin(M); for (let i = 0; i < 30; i++) { const dE = (M - (E - R2D * e * sin(E))) / (1 - e * cos(E)); E += dE; if (Math.abs(dE) < 1e-9) break; } return E; }
  function standishHelio(name, T) { // ekinoks: tarihin (yaklaşık presesyonla)
    const k = KEP[name];
    const a = k[0] + k[1] * T, e = k[2] + k[3] * T, I = k[4] + k[5] * T, L = k[6] + k[7] * T, w = k[8] + k[9] * T, O = k[10] + k[11] * T;
    const om = w - O, M = norm(L - w), E = kepler(M, e);
    const xp = a * (cos(E) - e), yp = a * Math.sqrt(1 - e * e) * sin(E);
    const x = (cos(om) * cos(O) - sin(om) * sin(O) * cos(I)) * xp + (-sin(om) * cos(O) - cos(om) * sin(O) * cos(I)) * yp;
    const y = (cos(om) * sin(O) + sin(om) * cos(O) * cos(I)) * xp + (-sin(om) * sin(O) + cos(om) * cos(O) * cos(I)) * yp;
    const z = sin(om) * sin(I) * xp + cos(om) * sin(I) * yp;
    const p = 1.396971 * T + 0.0003086 * T * T; // genel presesyon (boylam)
    return [x * cos(p) - y * sin(p), x * sin(p) + y * cos(p), z];
  }
  // Schlyter: tarihin ekinoksu, d = JD(TT) − 2451543.5
  const SCH = {
    Jupiter: d => [100.4542 + 2.76854e-5 * d, 1.3030 - 1.557e-7 * d, 273.8777 + 1.64505e-5 * d, 5.20256, 0.048498 + 4.469e-9 * d, 19.8950 + 0.0830853001 * d],
    Saturn: d => [113.6634 + 2.38980e-5 * d, 2.4886 - 1.081e-7 * d, 339.3939 + 2.97661e-5 * d, 9.55475, 0.055546 - 9.499e-9 * d, 316.9670 + 0.0334442282 * d],
    Uranus: d => [74.0005 + 1.3978e-5 * d, 0.7733 + 1.9e-8 * d, 96.6612 + 3.0565e-5 * d, 19.18171 - 1.55e-8 * d, 0.047318 + 7.45e-9 * d, 142.5905 + 0.011725806 * d]
  };
  function schlyterHelio(name, jd) {
    const d = jd - 2451543.5;
    const [N, i, w, a, e, M0] = SCH[name](d), M = norm(M0);
    const E = kepler(M, e);
    const xv = a * (cos(E) - e), yv = a * Math.sqrt(1 - e * e) * sin(E);
    const v = atan2(yv, xv), r = Math.hypot(xv, yv);
    const xh = r * (cos(N) * cos(v + w) - sin(N) * sin(v + w) * cos(i));
    const yh = r * (sin(N) * cos(v + w) + cos(N) * sin(v + w) * cos(i));
    const zh = r * sin(v + w) * sin(i);
    let lon = atan2(yh, xh), lat = atan2(zh, Math.hypot(xh, yh));
    const Mj = norm(19.8950 + 0.0830853001 * d), Ms = norm(316.9670 + 0.0334442282 * d), Mu = norm(142.5905 + 0.011725806 * d);
    if (name === 'Jupiter') lon += -0.332 * sin(2 * Mj - 5 * Ms - 67.6) - 0.056 * sin(2 * Mj - 2 * Ms + 21) + 0.042 * sin(3 * Mj - 5 * Ms + 21) - 0.036 * sin(Mj - 2 * Ms) + 0.022 * cos(Mj - Ms) + 0.023 * sin(2 * Mj - 3 * Ms + 52) - 0.016 * sin(Mj - 5 * Ms - 69);
    if (name === 'Saturn') { lon += 0.812 * sin(2 * Mj - 5 * Ms - 67.6) - 0.229 * cos(2 * Mj - 4 * Ms - 2) + 0.119 * sin(Mj - 2 * Ms - 3) + 0.046 * sin(2 * Mj - 6 * Ms - 69) + 0.014 * sin(Mj - 3 * Ms + 32); lat += -0.020 * cos(2 * Mj - 4 * Ms - 2) + 0.018 * sin(2 * Mj - 6 * Ms - 49); }
    if (name === 'Uranus') lon += 0.040 * sin(Ms - 2 * Mu + 6) + 0.035 * sin(Ms - 3 * Mu + 33) - 0.015 * sin(Mj - Mu + 20);
    return [r * cos(lat) * cos(lon), r * cos(lat) * sin(lon), r * sin(lat)];
  }
  function helio(name, jdT) {
    const T = (jdT - 2451545) / 36525;
    if (SCH[name]) return schlyterHelio(name, jdT);
    return standishHelio(name, T);
  }
  function earthHelio(jdT) {
    const T = (jdT - 2451545) / 36525;
    const emb = standishHelio('EMB', T);
    const m = moonGeo(T), k = m.dist / 149597870.7 / 82.30056;
    return [emb[0] - k * cos(m.lat) * cos(m.lon), emb[1] - k * cos(m.lat) * sin(m.lon), emb[2] - k * sin(m.lat)];
  }
  function geoPlanet(name, jdT) { // ışık zamanı + yıllık sapınç (Dünya da t−τ'da)
    let tau = 0, g;
    for (let i = 0; i < 3; i++) {
      const p = helio(name, jdT - tau), e = earthHelio(jdT - tau);
      g = [p[0] - e[0], p[1] - e[1], p[2] - e[2]];
      tau = Math.hypot(...g) * 0.0057755183;
    }
    return { lon: norm(atan2(g[1], g[0])), lat: atan2(g[2], Math.hypot(g[0], g[1])), dist: Math.hypot(...g) };
  }
  function geoSun(jdT) {
    const e = earthHelio(jdT), r = Math.hypot(...e);
    return { lon: norm(atan2(-e[1], -e[0]) - 20.4898 / 3600 / r), lat: atan2(-e[2], Math.hypot(e[0], e[1])), dist: r };
  }

  const BODIES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const ASTEROIDS = ['Chiron', 'Ceres', 'Pallas', 'Juno', 'Vesta', 'Pholus'];
  const SEIP = { Sun: 'sun', Moon: 1, Mercury: 2, Venus: 3, Mars: 4, Jupiter: 5, Saturn: 6, Uranus: 7, Neptune: 8, Pluto: 9, Chiron: 12, Pholus: 13, Ceres: 14, Pallas: 15, Juno: 16, Vesta: 17 };
  const SE = () => (typeof root !== 'undefined' && root.SEPH_API && root.SEPH_API.ready()) ? root.SEPH_API : null;
  function precessJ2000(v, T) { // IAU 1976 (Meeus 21), ekvatoral J2000 → tarihin ortalama ekvatoru
    const a = s => s / 3600;
    const z0 = a(2306.2181 * T + 0.30188 * T * T + 0.017998 * T ** 3), z = a(2306.2181 * T + 1.09468 * T * T + 0.018203 * T ** 3), th = a(2004.3109 * T - 0.42665 * T * T - 0.041833 * T ** 3);
    const [x, y, w] = v;
    return [
      (cos(z0) * cos(z) * cos(th) - sin(z0) * sin(z)) * x + (-sin(z0) * cos(z) * cos(th) - cos(z0) * sin(z)) * y + (-cos(z) * sin(th)) * w,
      (cos(z0) * sin(z) * cos(th) + sin(z0) * cos(z)) * x + (-sin(z0) * sin(z) * cos(th) + cos(z0) * cos(z)) * y + (-sin(z) * sin(th)) * w,
      (cos(z0) * sin(th)) * x + (-sin(z0) * sin(th)) * y + cos(th) * w];
  }
  function eqToEcl(v, eps) { return [v[0], v[1] * cos(eps) + v[2] * sin(eps), -v[1] * sin(eps) + v[2] * cos(eps)]; }
  function seGeoVec(body, jdT) { // görünür geosentrik vektör, J2000 ekvatoral
    const se = SE(), ip = SEIP[body];
    if (ip === 1) { const r0 = se.raw(1, jdT), tau = Math.hypot(...r0) * 0.0057755183; return se.raw(1, jdT - tau); }
    let tau = 0, g;
    for (let i = 0; i < 3; i++) { const p = se.bodyBary(ip, jdT - tau), e = se.earthBary(jdT - tau); g = [p[0] - e[0], p[1] - e[1], p[2] - e[2]]; tau = Math.hypot(...g) * 0.0057755183; }
    return g;
  }
  function seEcl(vJ2000, T, nu) { const v = eqToEcl(precessJ2000(vJ2000, T), nu.eps0), r = Math.hypot(...v); return { lon: norm(atan2(v[1], v[0])), lat: asin(v[2] / r), dist: r, vec: v }; }
  function seMoonOsc(jdT, T, nu) { // oskülasyon düğümü ve apojesi (Gerçek Düğüm / Gerçek Lilith)
    const se = SE(), dt = 0.01;
    const P = j => eqToEcl(precessJ2000(se.raw(1, j), T), nu.eps0);
    const r = P(jdT), r1 = P(jdT - dt), r2 = P(jdT + dt), v = [(r2[0] - r1[0]) / (2 * dt), (r2[1] - r1[1]) / (2 * dt), (r2[2] - r1[2]) / (2 * dt)];
    const h = [r[1] * v[2] - r[2] * v[1], r[2] * v[0] - r[0] * v[2], r[0] * v[1] - r[1] * v[0]];
    const node = norm(atan2(h[0], -h[1]));
    const mu = 8.9970116e-10, rn = Math.hypot(...r);
    const vxh = [v[1] * h[2] - v[2] * h[1], v[2] * h[0] - v[0] * h[2], v[0] * h[1] - v[1] * h[0]];
    const ev = [vxh[0] / mu - r[0] / rn, vxh[1] / mu - r[1] / rn, vxh[2] / mu - r[2] / rn];
    return { node, apogee: norm(atan2(-ev[1], -ev[0])), apoLat: atan2(-ev[2], Math.hypot(ev[0], ev[1])) };
  }
  function seAvailable(body, jdT) { const se = SE(); if (!se) return false; const ip = SEIP[body]; if (ip == null) return false; return se.has(ip === 'sun' ? 0 : ip, jdT) && se.has(0, jdT) && se.has(1, jdT) && se.has(10, jdT); }
  function rawLon(body, jdUT, opts) {
    const jdT = jdTT(jdUT), T = (jdT - 2451545) / 36525, nu = nutation(T);
    let r, src = 'analitik';
    const seOK = seAvailable('Moon', jdT);
    if ((body === 'NNode' && !(opts && opts.meanNode)) || (body === 'Lilith' && opts && opts.trueLilith)) {
      if (seOK) { const o = seMoonOsc(jdT, T, nu); r = { lon: body === 'NNode' ? o.node : o.apogee, lat: body === 'NNode' ? 0 : o.apoLat }; src = 'SE'; }
    }
    if (!r) {
      if (SEIP[body] != null && seAvailable(body, jdT)) { r = seEcl(seGeoVec(body, jdT), T, nu); src = 'SE'; }
      else if (body === 'Sun') r = geoSun(jdT);
      else if (body === 'Moon') { const m = moonGeo(T); r = { lon: m.lon, lat: m.lat, dist: m.dist }; }
      else if (body === 'NNode') { const n = lunarNodes(T); r = { lon: opts && opts.meanNode ? n.mean : n.tru, lat: 0 }; }
      else if (body === 'Lilith') { r = { lon: lunarNodes(T).lilith, lat: 0 }; }
      else if (ASTEROIDS.includes(body)) return null;
      else r = geoPlanet(body, jdT);
    }
    return { lon: norm(r.lon + nu.dpsi), lat: r.lat, dist: r.dist, eps: nu.eps, dpsi: nu.dpsi, src };
  }
  function ayanamsa(jdUT) { const T = (jdUT - 2451545) / 36525; return 23.85706 + 1.396971 * T + 0.0003086 * T * T; }

  function bodyPos(body, jdUT, opts) {
    const h = body === 'Moon' ? 0.05 : 0.25;
    const p = rawLon(body, jdUT, opts), p1 = rawLon(body, jdUT - h, opts), p2 = rawLon(body, jdUT + h, opts);
    if (!p) return null;
    const speed = wrap180(p2.lon - p1.lon) / (2 * h);
    let lon = p.lon; if (opts && opts.sidereal) lon = norm(lon - ayanamsa(jdUT));
    const dec = asin(sin(p.lat) * cos(p.eps) + cos(p.lat) * sin(p.eps) * sin(p.lon));
    return { lon, lat: p.lat, speed, dec, dist: p.dist, retro: speed < 0 };
  }

  /* ---------- Yıldız zamanı ve evler ---------- */
  function gast(jdUT) {
    const T = (jdUT - 2451545) / 36525, nu = nutation((jdTT(jdUT) - 2451545) / 36525);
    const gmst = 280.46061837 + 360.98564736629 * (jdUT - 2451545) + 0.000387933 * T * T - T ** 3 / 38710000;
    return norm(gmst + nu.dpsi * cos(nu.eps));
  }
  function ascFrom(ramc, lat, eps) { return norm(atan2(cos(ramc), -(sin(ramc) * cos(eps) + tan(lat) * sin(eps)))); }
  const asc1 = (oa, lat, eps) => ascFrom(oa - 90, lat, eps);
  function mcFrom(ramc, eps) { return norm(atan2(sin(ramc), cos(ramc) * cos(eps))); }
  const HSYS = { P: 'Placidus', K: 'Koch', R: 'Regiomontanus', C: 'Campanus', O: 'Porphyry', E: 'Eşit ev', W: 'Tam burç' };

  function houses(jdUT, lat, lonE, sys, opts) {
    const T = (jdTT(jdUT) - 2451545) / 36525, eps = nutation(T).eps;
    const ramc = norm(gast(jdUT) + lonE);
    const r = housesRAMC(ramc, lat, eps, sys);
    return siderealize(r, jdUT, opts);
  }
  function siderealize(res, jdUT, opts) {
    if (!(opts && opts.sidereal)) return res;
    const ay = ayanamsa(jdUT), s = x => norm(x - ay);
    const out = { ...res, asc: s(res.asc), mc: s(res.mc), vertex: s(res.vertex), eastPt: s(res.eastPt), cusps: res.cusps.map(x => x == null ? x : s(x)) };
    if (res.sys === 'W') { const st = Math.floor(out.asc / 30) * 30; for (let i = 1; i <= 12; i++) out.cusps[i] = norm(st + 30 * (i - 1)); }
    return out;
  }
  function housesRAMC(ramc, lat, eps, sys) {
    const mc = mcFrom(ramc, eps), asc = ascFrom(ramc, lat, eps);
    const vlat = lat >= 0 ? 90 - lat : -90 - lat;
    const vertex = ascFrom(ramc + 180, Math.abs(vlat) > 89.9999 ? Math.sign(vlat) * 89.9999 : vlat, eps);
    // Ekvator yükseleni (Doğu noktası)
    const eastPt = ascFrom(ramc, 0, eps);
    let c = new Array(13), used = sys, note = '';
    const polar = Math.abs(lat) >= 90 - eps;
    if ((sys === 'P' || sys === 'K') && polar) { used = 'O'; note = 'Kutup dairesine yakın enlemde Placidus/Koch tanımsız; Porphyry kullanıldı.'; }
    const porph = () => {
      const d = norm(asc - mc), e = 180 - d;
      c[10] = mc; c[11] = norm(mc + d / 3); c[12] = norm(mc + 2 * d / 3); c[1] = asc; c[2] = norm(asc + e / 3); c[3] = norm(asc + 2 * e / 3);
    };
    if (used === 'O') porph();
    else if (used === 'E') { for (let i = 1; i <= 12; i++) c[i] = norm(asc + 30 * (i - 1)); }
    else if (used === 'W') { const s = Math.floor(asc / 30) * 30; for (let i = 1; i <= 12; i++) c[i] = norm(s + 30 * (i - 1)); }
    else if (used === 'P') {
      const raToLon = ra => norm(atan2(sin(ra), cos(ra) * cos(eps)));
      const cusp = (f, below) => {
        let ra = below ? ramc + 180 - f * 90 : ramc + f * 90, lon;
        for (let i = 0; i < 60; i++) {
          lon = raToLon(ra);
          const dec = asin(sin(eps) * sin(lon));
          const sad = acos(-tan(lat) * tan(dec));
          const nra = below ? ramc + 180 - f * (180 - sad) : ramc + f * sad;
          if (Math.abs(wrap180(nra - ra)) < 1e-8) { ra = nra; break; } ra = nra;
        }
        return raToLon(ra);
      };
      c[10] = mc; c[11] = cusp(1 / 3, false); c[12] = cusp(2 / 3, false); c[1] = asc; c[2] = cusp(2 / 3, true); c[3] = cusp(1 / 3, true);
    } else if (used === 'K') {
      const dmc = asin(sin(eps) * sin(mc)), ad3 = asin(tan(lat) * tan(dmc)) / 3;
      c[10] = mc; c[1] = asc;
      c[11] = asc1(ramc + 30 - 2 * ad3, lat, eps); c[12] = asc1(ramc + 60 - ad3, lat, eps);
      c[2] = asc1(ramc + 120 + ad3, lat, eps); c[3] = asc1(ramc + 150 + 2 * ad3, lat, eps);
    } else if (used === 'R') {
      const f1 = atan2(tan(lat) * 0.5, 1), f2 = atan2(tan(lat) * cos(30), 1);
      c[10] = mc; c[1] = asc;
      c[11] = asc1(ramc + 30, f1, eps); c[12] = asc1(ramc + 60, f2, eps); c[2] = asc1(ramc + 120, f2, eps); c[3] = asc1(ramc + 150, f1, eps);
    } else if (used === 'C') {
      const fh1 = asin(sin(lat) / 2), fh2 = asin(Math.sqrt(3) / 2 * sin(lat));
      const xh1 = atan2(Math.sqrt(3), cos(lat)), xh2 = atan2(1 / Math.sqrt(3), cos(lat));
      c[10] = mc; c[1] = asc;
      c[11] = asc1(ramc + 90 - xh1, fh1, eps); c[12] = asc1(ramc + 90 - xh2, fh2, eps); c[2] = asc1(ramc + 90 + xh2, fh2, eps); c[3] = asc1(ramc + 90 + xh1, fh1, eps);
    }
    if (used !== 'E' && used !== 'W') { c[4] = norm(c[10] + 180); c[5] = norm(c[11] + 180); c[6] = norm(c[12] + 180); c[7] = norm(c[1] + 180); c[8] = norm(c[2] + 180); c[9] = norm(c[3] + 180); }
    return { cusps: c, asc, mc, vertex, eastPt, ramc, eps, sys: used, note };
  }
  function houseOf(lon, cusps) {
    for (let i = 1; i <= 12; i++) {
      const a = cusps[i], b = cusps[i % 12 + 1], w = norm(b - a);
      if (norm(lon - a) < w) return i;
    }
    return 1;
  }

  /* ---------- Burçlar, değerler ---------- */
  const SIGNS = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
  const ELEM = ['Ateş', 'Toprak', 'Hava', 'Su'], MODE = ['Öncü', 'Sabit', 'Değişken'];
  const RULER = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
  const MODERN = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Pluto', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  const EXALT = { Sun: 0, Moon: 1, Mercury: 5, Venus: 11, Mars: 9, Jupiter: 3, Saturn: 6 };
  const TRIP = [['Sun', 'Jupiter'], ['Venus', 'Moon'], ['Saturn', 'Mercury'], ['Venus', 'Mars']]; // Doroteus gündüz/gece
  const TERMS = [[['Jupiter',6],['Venus',12],['Mercury',20],['Mars',25],['Saturn',30]],[['Venus',8],['Mercury',14],['Jupiter',22],['Saturn',27],['Mars',30]],[['Mercury',6],['Jupiter',12],['Venus',17],['Mars',24],['Saturn',30]],[['Mars',7],['Venus',13],['Mercury',19],['Jupiter',26],['Saturn',30]],[['Jupiter',6],['Venus',11],['Saturn',18],['Mercury',24],['Mars',30]],[['Mercury',7],['Venus',17],['Jupiter',21],['Mars',28],['Saturn',30]],[['Saturn',6],['Mercury',14],['Jupiter',21],['Venus',28],['Mars',30]],[['Mars',7],['Venus',11],['Mercury',19],['Jupiter',24],['Saturn',30]],[['Jupiter',12],['Venus',17],['Mercury',21],['Saturn',26],['Mars',30]],[['Mercury',7],['Jupiter',14],['Venus',22],['Saturn',26],['Mars',30]],[['Mercury',7],['Venus',13],['Jupiter',20],['Mars',25],['Saturn',30]],[['Venus',12],['Jupiter',16],['Mercury',19],['Mars',28],['Saturn',30]]];
  const CHALD = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
  const signOf = lon => Math.floor(norm(lon) / 30);
  function termRuler(lon) { const s = signOf(lon), d = norm(lon) - s * 30; for (const [p, e] of TERMS[s]) if (d < e) return p; return TERMS[s][4][0]; }
  function faceRuler(lon) { const dec = Math.floor(norm(lon) / 10); return CHALD[(2 + dec) % 7]; }
  function dignity(body, lon, isDay) {
    const s = signOf(lon), out = [], score = { v: 0 };
    const add = (t, v) => { out.push(t); score.v += v; };
    if (RULER[s] === body || (s === 7 && body === 'Mars') || (s === 10 && body === 'Saturn') || (s === 11 && body === 'Jupiter')) add('Yönetici', 5);
    if (EXALT[body] === s) add('Yücelim', 4);
    if (TRIP[s % 4][isDay ? 0 : 1] === body) add('Üçlük', 3);
    if (termRuler(lon) === body) add('Sınır', 2);
    if (faceRuler(lon) === body) add('Yüz', 1);
    const opp = (s + 6) % 12;
    if (RULER[opp] === body || (opp === 7 && body === 'Mars') || (opp === 10 && body === 'Saturn') || (opp === 11 && body === 'Jupiter')) add('Zarar', -5);
    if (EXALT[body] != null && (EXALT[body] + 6) % 12 === s) add('Düşüş', -4);
    if (!out.some(x => ['Yönetici', 'Yücelim', 'Üçlük', 'Sınır', 'Yüz'].includes(x)) && EXALT[body] != null) out.push('Peregrin');
    return { list: out, score: score.v };
  }

  /* ---------- Açılar ---------- */
  const ASPECTS = [
    { k: 'con', n: 'Kavuşum', a: 0, orb: 8, major: true }, { k: 'opp', n: 'Karşıt', a: 180, orb: 8, major: true },
    { k: 'tri', n: 'Üçgen', a: 120, orb: 7, major: true }, { k: 'squ', n: 'Kare', a: 90, orb: 7, major: true },
    { k: 'sex', n: 'Altmışlık', a: 60, orb: 5, major: true }, { k: 'qcx', n: 'Quincunx', a: 150, orb: 3 },
    { k: 'ssx', n: 'Yarım altmışlık', a: 30, orb: 2 }, { k: 'ssq', n: 'Yarım kare', a: 45, orb: 2 },
    { k: 'sqq', n: 'Bir buçuk kare', a: 135, orb: 2 }, { k: 'qui', n: 'Kuintil', a: 72, orb: 1.5 }, { k: 'bqu', n: 'Bikuintil', a: 144, orb: 1.5 }
  ];
  function findAspects(A, B, o) {
    o = o || {}; const same = A === B, res = [], mult = o.orbMult || 1;
    for (let i = 0; i < A.length; i++) for (let j = same ? i + 1 : 0; j < B.length; j++) {
      const p = A[i], q = B[j];
      if (same && ((p.id === 'NNode' && q.id === 'SNode') || (p.id === 'SNode' && q.id === 'NNode') || (p.id === 'Asc' && q.id === 'MC') || (p.id === 'MC' && q.id === 'Asc'))) continue;
      const sep = Math.abs(wrap180(p.lon - q.lon));
      for (const as of ASPECTS) {
        if (!o.minor && !as.major) continue;
        let orb = as.orb * mult;
        if (as.major && (p.id === 'Sun' || p.id === 'Moon' || q.id === 'Sun' || q.id === 'Moon')) orb += 2;
        if (['NNode', 'SNode', 'Lilith', 'Vertex', 'Fortune', 'Spirit'].includes(p.id) || ['NNode', 'SNode', 'Lilith', 'Vertex', 'Fortune', 'Spirit'].includes(q.id)) orb = Math.min(orb, as.major ? 3 : 1);
        if (o.fixedOrb != null) orb = as.major ? o.fixedOrb : Math.min(o.fixedOrb, 1);
        const d = Math.abs(sep - as.a);
        if (d <= orb) {
          const dt = 0.1, sep2 = Math.abs(wrap180((p.lon + (p.speed || 0) * dt) - (q.lon + (o.staticB ? 0 : (q.speed || 0)) * dt)));
          const applying = Math.abs(sep2 - as.a) < d;
          res.push({ p, q, asp: as, orb: d, applying, exact: d < 0.1667 });
          break;
        }
      }
    }
    return res.sort((x, y) => x.orb - y.orb);
  }

  /* ---------- Harita ---------- */
  function chart(input, settings) {
    settings = settings || {};
    const jd = input.jd, opts = { sidereal: settings.zodiac === 'S', meanNode: settings.node === 'mean', trueLilith: settings.lilith === 'true' };
    const h = houses(jd, input.lat, input.lon, settings.hsys || 'P', opts);
    const pts = [];
    for (const b of BODIES) pts.push({ id: b, ...bodyPos(b, jd, opts) });
    const nn = bodyPos('NNode', jd, opts); pts.push({ id: 'NNode', ...nn, retro: nn.speed < 0 });
    pts.push({ id: 'SNode', lon: norm(nn.lon + 180), lat: 0, speed: nn.speed, dec: -nn.dec, retro: nn.speed < 0 });
    const li = bodyPos('Lilith', jd, opts); pts.push({ id: 'Lilith', ...li, retro: false });
    if (settings.asteroids !== false) for (const a of ASTEROIDS) { if (a === 'Pholus' && !settings.pholus) continue; const r = rawLon(a, jd, opts); if (r) pts.push({ id: a, ...bodyPos(a, jd, opts) }); }
    const sun = pts[0], moon = pts[1];
    const isDay = norm(sun.lon - h.asc) > 180;
    const decOf = l => asin(sin(h.eps) * sin(l));
    pts.push({ id: 'Asc', lon: h.asc, speed: 360, dec: decOf(h.asc) }, { id: 'MC', lon: h.mc, speed: 360, dec: decOf(h.mc) });
    pts.push({ id: 'Vertex', lon: h.vertex, speed: 360, dec: decOf(h.vertex) });
    const fort = isDay ? norm(h.asc + moon.lon - sun.lon) : norm(h.asc + sun.lon - moon.lon);
    const spir = isDay ? norm(h.asc + sun.lon - moon.lon) : norm(h.asc + moon.lon - sun.lon);
    pts.push({ id: 'Fortune', lon: fort, speed: 360, dec: decOf(fort) }, { id: 'Spirit', lon: spir, speed: 360, dec: decOf(spir) });
    for (const p of pts) {
      p.sign = signOf(p.lon); p.deg = norm(p.lon) - p.sign * 30;
      p.house = houseOf(p.lon, h.cusps);
      if (EXALT[p.id] != null) p.dig = dignity(p.id, p.lon, isDay);
      p.oob = BODIES.includes(p.id) && Math.abs(p.dec) > h.eps;
      p.sabian = Math.floor(p.deg) + 1;
    }
    const phaseAngle = norm(moon.lon - sun.lon);
    return { input, settings, jd, houses: h, points: pts, isDay, phaseAngle, get: id => pts.find(p => p.id === id) };
  }

  /* ---------- Yardımcı aramalar ---------- */
  function lonAt(body, jd, opts) { return rawLon(body, jd, opts).lon - (opts && opts.sidereal ? ayanamsa(jd) : 0); }
  function findLonCross(body, target, jd0, jd1, opts) { // kök bulma: f(jd)=wrap(lon−target)
    const f = j => wrap180(lonAt(body, j, opts) - target);
    let a = jd0, b = jd1, fa = f(a), fb = f(b);
    if (fa * fb > 0 || Math.abs(fa - fb) > 90) return null;
    for (let i = 0; i < 50; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) { b = m; fb = fm; } else { a = m; fa = fm; } if (b - a < 1e-6) break; }
    return (a + b) / 2;
  }
  function solarReturn(natalSunLon, approxJD, opts) {
    for (let k = -3; k < 4; k++) { const r = findLonCross('Sun', natalSunLon, approxJD + k * 2.5, approxJD + (k + 1) * 2.5, opts); if (r) return r; }
    return null;
  }
  function lunations(jd0, days) { // yeni ay & dolunay, tutulma tespiti
    const out = []; const f = (j, t) => wrap180(rawLon('Moon', j).lon - rawLon('Sun', j).lon - t);
    for (const t of [0, 180]) {
      let prev = f(jd0, t);
      for (let j = jd0 + 1; j <= jd0 + days; j += 1) {
        const cur = f(j, t);
        if (prev < 0 && cur >= 0) {
          let a = j - 1, b = j; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (f(m, t) < 0) a = m; else b = m; }
          const jj = (a + b) / 2, mo = rawLon('Moon', jj), lat = Math.abs(mo.lat);
          out.push({ jd: jj, type: t === 0 ? 'new' : 'full', lon: mo.lon, eclipse: t === 0 ? lat < 1.55 : lat < 1.45, moonLat: mo.lat });
        }
        prev = cur;
      }
    }
    return out.sort((a, b) => a.jd - b.jd);
  }
  function stations(body, jd0, days) {
    const out = []; let prev = bodyPos(body, jd0).speed;
    for (let j = jd0 + 1; j <= jd0 + days; j++) {
      const s = bodyPos(body, j).speed;
      if (Math.sign(s) !== Math.sign(prev)) {
        let a = j - 1, b = j, sa = prev;
        for (let i = 0; i < 30; i++) { const m = (a + b) / 2, sm = bodyPos(body, m).speed; if (Math.sign(sm) === Math.sign(sa)) { a = m; sa = sm; } else b = m; }
        out.push({ jd: (a + b) / 2, body, type: s < 0 ? 'R' : 'D', lon: rawLon(body, (a + b) / 2).lon });
      }
      prev = s;
    }
    return out;
  }

  const API = { housesRAMC, siderealize, precessJ2000, eqToEcl, SEIP, ASTEROIDS, D2R, R2D, norm, wrap180, jdFromUTC, utcFromJD, jdTT, deltaT, tzOffsetMin, localToUTC, nutation, moonGeo, lunarNodes, rawLon, bodyPos, gast, houses, houseOf, ascFrom, mcFrom, HSYS, SIGNS, ELEM, MODE, RULER, MODERN, EXALT, TRIP, TERMS, termRuler, faceRuler, dignity, ASPECTS, findAspects, chart, lonAt, findLonCross, solarReturn, lunations, stations, signOf, BODIES, ayanamsa };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Astro = API;
})(typeof window !== 'undefined' ? window : globalThis);
