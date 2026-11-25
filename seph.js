/* Swiss Ephemeris .se1 Chebyshev verisinin okuyucusu (sweph.c get_new_segment / rot_back mantığının JS uyarlaması).
   Koordinatlar: barisentrik/heliosentrik, J2000 ekvatoral, AU. */
(function (root) {
  'use strict';
  let BYTES = null, IDX = null;
  const SETS = [];
  const cache = new Map();
  function init(data) {
    const idx = {}; for (const d of data.idx) idx[d.ip] = d;
    const s = data.b64; let bytes;
    if (typeof atob === 'function') { const bin = atob(s); bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); }
    else bytes = new Uint8Array(Buffer.from(s, 'base64'));
    SETS.push({ idx, bytes, n: SETS.length });
    if (!BYTES) { BYTES = bytes; IDX = idx; }
  }
  function pick(ip, jd) { for (const st of SETS) { const d = st.idx[ip]; if (d && jd >= d.t0 && jd < d.t0 + d.nseg * d.dseg) return st; } return null; }
  function unpack(d, k) {
    let p = d.base + d.offs[k];
    const n = d.ncoe, rmax = d.rmax, c = new Float64Array(3 * n);
    const rd = len => { let v = 0; for (let i = len - 1; i >= 0; i--) v = v * 256 + BYTES[p + i]; p += len; return v; };
    for (let ic = 0; ic < 3; ic++) {
      let idbl = ic * n;
      const c0 = BYTES[p], c1 = BYTES[p + 1]; p += 2;
      let ns;
      if (c0 & 128) { const c2 = BYTES[p], c3 = BYTES[p + 1]; p += 2; ns = [c1 >> 4, c1 & 15, c2 >> 4, c2 & 15, c3 >> 4, c3 & 15]; }
      else ns = [c0 >> 4, c0 & 15, c1 >> 4, c1 & 15];
      for (let i = 0; i < ns.length; i++) {
        const cnt = ns[i]; if (!cnt) continue;
        if (i < 4) {
          for (let m = 0; m < cnt; m++) { const L = rd(4 - i); c[idbl++] = (L % 2) ? -(Math.floor((L + 1) / 2) / 1e9 * rmax / 2) : (Math.floor(L / 2) / 1e9 * rmax / 2); }
        } else {
          const per = i === 4 ? 2 : 4, base = i === 4 ? 16 : 4, k2 = Math.ceil(cnt / per); let jj = 0;
          for (let m = 0; m < k2; m++) {
            let L = BYTES[p++], o = i === 4 ? 16 : 64;
            for (let q = 0; q < per && jj < cnt; q++, jj++) {
              c[idbl++] = (L & o) ? -(Math.floor((L + o) / o / 2) * rmax / 2 / 1e9) : (Math.floor(L / o / 2) * rmax / 2 / 1e9);
              L %= o; o = Math.floor(o / base);
            }
          }
        }
      }
    }
    return c;
  }
  function rotBack(d, c, tseg0, isMoon) {
    const n = d.ncoe, t = tseg0 + d.dseg / 2, tdiff = (t - d.telem) / 365250, TW = 2 * Math.PI;
    let qav, pav;
    if (isMoon) { let dn = d.prot + tdiff * d.dprot; dn -= Math.trunc(dn / TW) * TW; const q = d.qrot + tdiff * d.dqrot; qav = q * Math.cos(dn); pav = q * Math.sin(dn); }
    else { qav = d.qrot + tdiff * d.dqrot; pav = d.prot + tdiff * d.dprot; }
    const x = new Float64Array(c), y0 = n, z0 = 2 * n;
    if (d.iflg & 4) {
      let om = d.peri + tdiff * d.dperi; om -= Math.trunc(om / TW) * TW;
      const co = Math.cos(om), so = Math.sin(om), r = d.refep;
      for (let i = 0; i < n; i++) { x[i] = c[i] + co * r[i] - so * r[n + i]; x[y0 + i] = c[y0 + i] + co * r[n + i] + so * r[i]; }
    }
    const k = 1 / (1 + qav * qav + pav * pav);
    const uiz = [2 * pav * k, -2 * qav * k, (1 - qav * qav - pav * pav) * k];
    const uix = [(1 + qav * qav - pav * pav) * k, 2 * qav * pav * k, -2 * pav * k];
    const uiy = [2 * qav * pav * k, (1 - qav * qav + pav * pav) * k, 2 * qav * k];
    const se = 0.39777715572793088, ce = 0.91748206215761929, o = new Float64Array(3 * n);
    for (let i = 0; i < n; i++) {
      const a = x[i], b = x[y0 + i], cc = x[z0 + i];
      let xr = a * uix[0] + b * uiy[0] + cc * uiz[0], yr = a * uix[1] + b * uiy[1] + cc * uiz[1], zr = a * uix[2] + b * uiy[2] + cc * uiz[2];
      if (isMoon) { const y2 = ce * yr - se * zr; zr = se * yr + ce * zr; yr = y2; }
      o[i] = xr; o[y0 + i] = yr; o[z0 + i] = zr;
    }
    return o;
  }
  function echeb(x, c, off, n) { const x2 = 2 * x; let br = 0, brp2 = 0, brpp = 0; for (let j = n - 1; j >= 0; j--) { brp2 = brpp; brpp = br; br = x2 * brpp - brp2 + c[off + j]; } return (br - brp2) * 0.5; }
  function has(ip, jd) { return !!pick(ip, jd); }
  function raw(ip, jd) { // ip: 0=EMB bary,1=Ay geo,2..9 gezegenler,10=EMB helio, 12 Chiron,13 Pholus,14 Ceres,15 Pallas,16 Juno,17 Vesta
    const st = pick(ip, jd) || SETS[0]; BYTES = st.bytes; const d = st.idx[ip];
    let k = Math.floor((jd - d.t0) / d.dseg); if (k < 0) k = 0; if (k >= d.nseg) k = d.nseg - 1;
    const key = st.n * 1e7 + ip * 100000 + k; let c = cache.get(key);
    if (!c) { c = unpack(d, k); if (d.iflg & 2) c = rotBack(d, c, d.t0 + k * d.dseg, ip === 1); if (cache.size > 400) cache.clear(); cache.set(key, c); }
    const t = (jd - (d.t0 + k * d.dseg)) / d.dseg * 2 - 1, n = d.ncoe;
    return [echeb(t, c, 0, n), echeb(t, c, n, n), echeb(t, c, 2 * n, n)];
  }
  const EMRAT = 81.30056907419062;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  function sunBary(jd) { return sub(raw(0, jd), raw(10, jd)); }
  function earthBary(jd) { const e = raw(0, jd), m = raw(1, jd); return [e[0] - m[0] / (EMRAT + 1), e[1] - m[1] / (EMRAT + 1), e[2] - m[2] / (EMRAT + 1)]; }
  function bodyBary(ip, jd) {
    if (ip === 'sun') return sunBary(jd);
    const v = raw(ip, jd), d = IDX[ip];
    /* heliosentrik kayıtlar ve asteroitler */ if ((d.iflg & 1) || ip >= 11) { const s = sunBary(jd); return [v[0] + s[0], v[1] + s[1], v[2] + s[2]]; }
    return v;
  }
  root.SEPH_API = { init, has, sets: () => SETS.length, raw, bodyBary, earthBary, sunBary, ready: () => !!BYTES };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.SEPH_API;
})(typeof window !== 'undefined' ? window : globalThis);
