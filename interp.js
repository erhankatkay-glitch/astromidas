/* AstroMidas — Astrolog yorum motoru.
   Bir astroloğun okuma sırasını taklit eder: (1) etkenleri ağırlıklandırıp haritanın ana temalarını seçer,
   (2) her gezegeni durumuna göre (onur, retro, yanıklık, köşe, açılar, yönettiği evler) niteler,
   (3) hayat alanlarını ev + ev yöneticisi + evdeki gezegenler + doğal gösterge ile bütünleşik okur,
   (4) natal vaatleri bugünün zamanlamasına (profeksiyon, transit, progres, firdaria/daşa) bağlar,
   (5) her yorumun dayanağını "Neden?" listesiyle gösterir. Her şey uygulama içinde, kurallarla üretilir. */
(function (root) {
  'use strict';
  const AM = root.AM, A = AM.A, B = AM.B, esc = AM.esc, nm = AM.nm;
  const X = () => TX.AST;
  const PLS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const PERS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
  const BASE = { Sun: 10, Moon: 10, Mercury: 5, Venus: 5, Mars: 5, Jupiter: 5, Saturn: 5, Uranus: 3, Neptune: 3, Pluto: 3 };
  const tone = () => ((AM.S.settings && AM.S.settings.tone) === 'net' ? 1 : 0);
  const style = () => ((AM.S.settings && AM.S.settings.style) === 'olaysal' ? 1 : 0);
  const fill = (t, o) => t.replace(/\{(\w)\}/g, (_, k) => o[k] != null ? o[k] : '');
  const HN = h => `${h}. ev (${TX.H[h].n.toLocaleLowerCase('tr-TR')})`;
  const firstSentence = t => { const s = String(t || '').split(/\n\n/)[0]; const m = s.match(/^.*?[^0-9\s][.!?](\s+(?=[A-ZÇĞİÖŞÜ])|$)/); return (m ? m[0] : s).trim(); };
  const modernOf = c => c.calc ? c.calc.system === 'modern' : true;

  /* ---------- Analiz önbelleği ---------- */
  const memo = new WeakMap();
  function analyze(c) {
    if (memo.has(c)) return memo.get(c);
    const U = c.unknownTime, modern = modernOf(c), pts = PLS.map(id => c.get(id)).filter(Boolean);
    const asps = A.findAspects(pts.concat(U ? [] : [c.get('Asc'), c.get('MC')]), pts.concat(U ? [] : [c.get('Asc'), c.get('MC')]), { minor: false }).filter(a => a.asp.major && a.p.id !== a.q.id);
    const ruler = s => AM.rulerOf(s, modern);
    const ascRuler = U ? null : ruler(c.get('Asc').sign);
    const rulesHouses = id => U ? [] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(h => ruler(A.signOf(c.houses.cusps[h])) === id);
    const sun = c.get('Sun');
    // gezegen ağırlıkları
    const W = {}, why = {};
    for (const p of pts) {
      let w = BASE[p.id]; const ws = [`${nm(p.id)} temel ağırlık ${BASE[p.id]}`];
      if (p.id === ascRuler) { w += 9; ws.push('harita yöneticisi (+9)'); }
      if (!U) {
        if ([1, 10].includes(p.house)) { w += 6; ws.push(`${p.house}. evde, güçlü köşe (+6)`); } else if ([4, 7].includes(p.house)) { w += 5; ws.push(`${p.house}. evde, köşe (+5)`); } else if ([2, 5, 8, 11].includes(p.house)) w += 2;
        for (const ang of ['Asc', 'MC']) { const d = Math.abs(A.wrap180(p.lon - c.get(ang).lon)); if (d < 5 || Math.abs(d - 180) < 5) { w += 5; ws.push(`${ang === 'Asc' ? 'Yükselen/Alçalan' : 'MC/IC'} eksenine ${d < 5 ? d.toFixed(1) : (180 - d).toFixed(1)}° (+5)`); } }
      }
      if (p.dig && Math.abs(p.dig.score) >= 4) { w += 3; ws.push(`burç onuru belirgin: ${p.dig.list.join(', ')} (+3)`); }
      for (const a of asps) if (a.p.id === p.id || a.q.id === p.id) { const o = a.p.id === p.id ? a.q.id : a.p.id; let add = (a.asp.k === 'con' ? 2 : 1) + (a.orb < 1 ? 2 : a.orb < 3 ? 1 : 0) + (['Sun', 'Moon', 'Asc', 'MC', ascRuler].includes(o) ? 1 : 0); w += add; if (a.orb < 2) ws.push(`${nm(o)} ile ${a.asp.n.toLocaleLowerCase('tr-TR')} (orb ${AM.dms(a.orb)}, +${add})`); }
      W[p.id] = w; why[p.id] = ws;
    }
    // ev ağırlıkları
    const HW = Array(13).fill(0), Hwhy = Array.from({ length: 13 }, () => []);
    if (!U) for (const p of pts) { HW[p.house] += W[p.id] * 0.6; Hwhy[p.house].push(`${nm(p.id)} bu evde`); }
    const stell = {}; for (const p of pts) { const k = U ? 's' + p.sign : 'h' + p.house; (stell[k] = stell[k] || []).push(p.id); }
    for (const [k, ids] of Object.entries(stell)) if (ids.length >= 3 && k[0] === 'h') { const h = +k.slice(1); HW[h] += 8; Hwhy[h].push(`${ids.length} gezegenlik yığılma (${ids.map(nm).join(', ')})`); }
    if (!U) { HW[A.houseOf(sun.lon, c.houses.cusps)] += 4; HW[c.get('Moon').house] += 3; }
    const r = { c, U, modern, pts, asps, ascRuler, ruler, rulesHouses, W, why, HW, Hwhy, stell };
    memo.set(c, r); return r;
  }

  /* ---------- Gezegen durumu ---------- */
  function condition(c, id, opt) {
    const z = analyze(c), p = c.get(id), C = X().COND, T = tone(), out = [], why = [];
    if (!p) return { text: '', why };
    const pn = nm(id), d = p.dig ? p.dig.list : [];
    if (d.includes('Yönetici')) { out.push(fill(C.domicile[T], { p: pn })); why.push('kendi burcunda (yönetici)'); }
    else if (d.includes('Yücelim')) { out.push(fill(C.exalt[T], { p: pn })); why.push('yücelim burcunda'); }
    else if (d.includes('Zarar')) { out.push(fill(C.detriment[T], { p: pn })); why.push('zarar burcunda'); }
    else if (d.includes('Düşüş')) { out.push(fill(C.fall[T], { p: pn })); why.push('düşüş burcunda'); }
    else if (d.includes('Peregrin') && !opt?.short) { out.push(fill(C.peregrine[T], { p: pn })); why.push('peregrin (temel onuru yok)'); }
    if (p.retro && !['Sun', 'Moon'].includes(id)) { out.push(fill(C.retro[T], { p: pn })); why.push('retro'); }
    if (!['Sun', 'Moon'].includes(id) && PLS.slice(2, 7).includes(id)) { const ds = Math.abs(A.wrap180(p.lon - c.get('Sun').lon)); if (ds < 17 / 60) { out.push(fill(C.cazimi[T], { p: pn })); why.push(`Güneş’e ${(ds * 60).toFixed(0)}′ (cazimi)`); } else if (ds < 8.5) { out.push(fill(C.combust[T], { p: pn })); why.push(`Güneş’e ${ds.toFixed(1)}° (yanık)`); } }
    if (!z.U && !opt?.noAngle) { if ([1, 4, 7, 10].includes(p.house)) { out.push(fill(C.angular[T], { p: pn })); why.push(`${p.house}. ev köşe ev`); } else if ([3, 6, 9, 12].includes(p.house) && !opt?.short) { out.push(fill(C.cadent[T], { p: pn })); why.push(`${p.house}. ev düşen ev`); } }
    // iyicil / kötücül açılar
    let ben = null, mal = null;
    for (const a of z.asps) { if (a.p.id !== id && a.q.id !== id) continue; const o = a.p.id === id ? a.q.id : a.p.id, k = a.asp.k;
      if (['Venus', 'Jupiter'].includes(o) && ['con', 'tri', 'sex'].includes(k) && (!ben || a.orb < ben.orb)) ben = { o, a };
      if (['Mars', 'Saturn'].includes(o) && ['con', 'squ', 'opp'].includes(k) && (!mal || a.orb < mal.orb)) mal = { o, a }; }
    if (ben) { out.push(fill(C.benefic[T], { p: pn, q: AM.ek(nm(ben.o), 'abl') })); why.push(`${nm(ben.o)} ${ben.a.asp.n.toLocaleLowerCase('tr-TR')} (orb ${AM.dms(ben.a.orb)})`); }
    if (mal) { out.push(fill(C.malefic[T], { p: pn, q: AM.ek(nm(mal.o), 'abl') })); why.push(`${nm(mal.o)} ${mal.a.asp.n.toLocaleLowerCase('tr-TR')} (orb ${AM.dms(mal.a.orb)})`); }
    const rh = z.rulesHouses(id);
    if (rh.length && !opt?.noRules) { out.push(fill(C.rules[T], { p: pn, h: rh.map(h => HN(h)).join(' ve ') })); why.push(`${rh.join(', ')}. evlerin yöneticisi`); }
    // destek/zorluk puanı
    let score = (p.dig ? Math.sign(p.dig.score) * Math.min(2, Math.abs(p.dig.score) / 3) : 0) + (ben ? 1 : 0) - (mal ? 1 : 0) + (p.retro && !['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(id) ? -0.3 : 0);
    return { text: out.join(' '), why, score, ben, mal };
  }

  /* ---------- 1) Ana temalar ---------- */
  function themes(c, n) {
    const z = analyze(c), XA = X(), res = [];
    const topP = Object.entries(z.W).sort((a, b) => b[1] - a[1]);
    // baskın gezegenler (en güçlü iki)
    for (const [id, w] of topP.slice(0, 2)) {
      const p = c.get(id), cond = condition(c, id, { short: true });
      res.push({ kind: 'planet', id, w, title: XA.PL[id].t, text: XA.PL[id].s + (z.U ? '' : ` ${nm(id)} ${A.SIGNS[p.sign]} burcunda, ${p.house}. evde; bu yüzden tema en çok ${TX.H[p.house].t} üzerinden yaşanıyor.`) + (cond.text ? ' ' + cond.text : ''), why: z.why[id].concat(cond.why), strength: w });
    }
    // vurgulu ev
    if (!z.U) { const hs = z.HW.map((w, h) => [h, w]).slice(1).sort((a, b) => b[1] - a[1]); const [h, w] = hs[0]; if (w > 8) res.push({ kind: 'house', h, w, title: TX.H[h].n + ' alanı', text: XA.H[h] + ` ${A.SIGNS[A.signOf(c.houses.cusps[h])]} burcuyla açılan bu ev ${XA.SQ[A.signOf(c.houses.cusps[h])]} bir tarzda yaşanıyor.`, why: z.Hwhy[h].concat([`ev ağırlığı ${w.toFixed(1)}`]), strength: w }); }
    // en dar ve en anlamlı açı
    const keyA = z.asps.filter(a => PERS.includes(a.p.id) || PERS.includes(a.q.id) || [a.p.id, a.q.id].includes(z.ascRuler)).map(a => ({ a, s: (12 - a.orb * 3) + (BASE[a.p.id] || 6) + (BASE[a.q.id] || 6) + (a.asp.k === 'con' ? 3 : 0) })).sort((u, v) => v.s - u.s);
    for (const { a, s } of keyA.slice(0, 2)) {
      res.push({ kind: 'aspect', a, title: `${nm(a.p.id)} – ${nm(a.q.id)} ${a.asp.n.toLocaleLowerCase('tr-TR')}`, text: AM.aspectText(a), why: [`orb ${AM.dms(a.orb)}${a.orb < 1 ? ' (çok dar, hayat boyu hissedilir)' : ''}`, `${nm(a.p.id)} ve ${nm(a.q.id)} haritada ağırlıklı`], strength: s });
    }
    // yığılma
    for (const [k, ids] of Object.entries(z.stell)) if (ids.length >= 3) { const isH = k[0] === 'h', v = +k.slice(1); res.push({ kind: 'stellium', title: isH ? `${v}. evde yoğunlaşma` : `${A.SIGNS[v]} yoğunlaşması`, text: `${ids.map(nm).join(', ')} aynı ${isH ? 'evde' : 'burçta'} toplanıyor. Enerjinizin büyük bölümü ${isH ? TX.H[v].t : A.SIGNS[v] + ' niteliklerine (' + X().SQ[v] + ')'} yöneliyor; bu alan hayatınızın merkez sahnesi.`, why: [`${ids.length} gezegen: ${ids.map(nm).join(', ')}`], strength: 9 + ids.length * 2 }); }
    // tekrar eden imza: aynı gezegen hem baskın hem yığılmada / köşede → güçlendir
    res.sort((u, v) => v.strength - u.strength);
    const seen = new Set(), outT = [];
    for (const t of res) { const key = t.kind === 'planet' ? t.id : t.title; if (seen.has(key)) continue; seen.add(key); outT.push(t); if (outT.length >= (n || 5)) break; }
    return outT;
  }

  /* ---------- 2) Hayat alanları ---------- */
  function area(c, ar) {
    const z = analyze(c), XA = X(), T = tone(), Sy = style(), why = [], parts = [], parts3 = [];
    let score = 0;
    if (!z.U) {
      const h = ar.h[0], cs = A.signOf(c.houses.cusps[h]), rid = z.ruler(cs), rp = c.get(rid);
      parts.push(`${h}. eviniz ${A.SIGNS[cs]} burcuyla başlıyor: ${ar.q} konularında ${XA.SQ[cs]} bir yaklaşımınız var.`); why.push(`${h}. ev başlangıcı ${A.SIGNS[cs]}`);
      if (rp) {
        const rc = condition(c, rid, { short: true, noRules: true, noAngle: true }); score += rc.score;
        parts.push(`Bu evin yöneticisi ${nm(rid)}, ${rp.house}. evde: ${TX.RULERFROM[h]} ${TX.RULERTO[rp.house]}.`);
        if (rc.text) parts.push(rc.text);
        why.push(`${h}. ev yöneticisi ${nm(rid)} → ${rp.house}. ev`, ...rc.why.map(w => `${nm(rid)}: ${w}`));
      }
      for (const hh of ar.h) { const inH = z.pts.filter(p => p.house === hh); for (const p of inH) { const t0 = firstSentence(AM.houseText(p.id, hh).replace(/^[^:]{0,120}\):\s*/, '')); const t = t0 ? `${hh}. evdeki ${nm(p.id)}: ${t0}` : ''; if (t) { parts3.push(t); why.push(`${nm(p.id)} ${hh}. evde`); } const pc = condition(c, p.id, { short: true, noRules: true, noAngle: true }); score += pc.score * 0.7; } }
    } else { why.push('doğum saati bilinmiyor: evler yerine doğal göstergeler okundu'); }
    for (const sid of ar.sig) { const sp = c.get(sid); if (!sp) continue; const sc = condition(c, sid, { short: true, noRules: true, noAngle: true }); score += sc.score * 0.8; if (sc.text) parts3.push(`Bu alanın doğal göstergesi ${nm(sid)} ${AM.LOC[sp.sign]}. ${sc.text}`); why.push(`doğal gösterge ${nm(sid)} (${A.SIGNS[sp.sign]})${sc.why.length ? ': ' + sc.why.join(', ') : ''}`); }
    const v = score >= 1.2 ? 'good' : score <= -1.2 ? 'hard' : 'mixed';
    const lead = XA.VERDICT[v][T];
    const paras = [[lead, ar.ex[Sy]].join(' '), parts.join(' '), parts3.join(' ')].filter(Boolean);
    return { k: ar.k, n: ar.n, verdict: v, score, paras, text: paras.join(' '), parts, lead, why: why.concat([`alan puanı ${score.toFixed(1)} → ${{ good: 'destekli', mixed: 'karışık', hard: 'emek isteyen' }[v]}`]) };
  }
  function areas(c) { return X().AREAS.map(ar => area(c, ar)); }

  /* ---------- 3) Zamanlama: şu an hayatınızda ---------- */
  function timing(c, jd) {
    const z = analyze(c), out = [], why = [], age = (jd - c.jd) / 365.2425;
    if (age < 0) return { paras: ['Doğum tarihi henüz gelmedi.'], why };
    const prof = B.profection(c, age), lord = c.get(prof.lord), XA = X();
    let t = `${Math.floor(age)} yaşındasınız: yıllık profeksiyon ${prof.house}. eve geldi; yılın teması ${TX.H[prof.house].t}. Yılın yöneticisi ${nm(prof.lord)}`;
    if (lord && !z.U) { t += ` doğum haritanızda ${lord.house}. evde; bu yıl ${TX.H[prof.house].n.toLocaleLowerCase('tr-TR')} konuları ${TX.H[lord.house].t} ile bağlantılı yaşanıyor.`; const lc = condition(c, prof.lord, { short: true, noRules: true }); if (lc.score >= 1) t += ' Yılın yöneticisi haritanızda güçlü; bu yıl açılan kapılar kalıcı sonuç verebilir.'; else if (lc.score <= -1) t += ' Yılın yöneticisi haritanızda zorlanıyor; bu yıl sabır ve emekle ilerlemek gerekir.'; why.push(`profeksiyon ${prof.house}. ev, yıl yöneticisi ${nm(prof.lord)} (${lord.house}. ev)`, ...lc.why.map(w => `${nm(prof.lord)}: ${w}`)); }
    else t += '.';
    out.push(t);
    // ana temalardaki gezegenlere ve açılara yakın yavaş transitler
    const topIds = Object.entries(z.W).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]).concat(z.U ? [] : ['Asc', 'MC']);
    const sid = c.calc && c.calc.zodiac === 'S', L = (b, j) => A.norm(A.rawLon(b, j).lon - (sid ? A.ayanamsa(j) : 0));
    const ASP = [[0, 'con', 'kavuşum'], [90, 'squ', 'kare'], [180, 'opp', 'karşıt'], [120, 'tri', 'üçgen'], [60, 'sex', 'altmışlık']];
    const hits = [];
    for (const b of ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']) for (const id of topIds) { const np = c.get(id); if (!np) continue; for (const [a, k, n] of ASP) { const d = Math.abs(Math.abs(A.wrap180(L(b, jd) - np.lon)) - a); if (d < 2) hits.push({ b, id, k, n, d }); } }
    hits.sort((u, v) => u.d - v.d);
    if (hits.length) {
      const hh = hits.slice(0, 3);
      out.push(`Şu an gökyüzünde haritanızın en önemli noktalarına dokunan transitler var: ${hh.map(x => `${nm(x.b)}, natal ${nm(x.id)} ile ${x.n} (orb ${x.d.toFixed(1)}°)`).join('; ')}.` + (hh[0] && TX.TRN[hh[0].b] && TX.TRN[hh[0].b][hh[0].id] ? ' ' + TX.TRN[hh[0].b][hh[0].id] + ' ' + (TX.TRASP[hh[0].k] || '') : ''));
      why.push(...hh.map(x => `transit ${nm(x.b)} ${x.n} natal ${nm(x.id)} (${x.d.toFixed(1)}°) — natal ${nm(x.id)} haritanın ağırlıklı noktası`));
    } else out.push('Şu an haritanızın ana noktalarına dar açı yapan yavaş bir transit yok; bu, daha sakin ve kendi seçimlerinizle şekillenen bir dönem demek.');
    // progres Ay
    try { const pc = B.progressedChart(c, jd, c.calc), pm = pc.get('Moon'); out.push(`Progres Ay ${AM.LOC[pm.sign]}${z.U ? '' : `, natal ${A.houseOf(pm.lon, c.houses.cusps)}. evinizde`}: duygusal gündeminiz yaklaşık iki buçuk yıl boyunca ${X().SQ[pm.sign]} bir tona bürünüyor${z.U ? '' : ` ve ${TX.H[A.houseOf(pm.lon, c.houses.cusps)].t} öne çıkıyor`}.`); why.push(`progres Ay ${A.SIGNS[pm.sign]}`); } catch (e) { }
    // klasik/vedik dönemler
    if (c.calc && c.calc.system === 'classic') { const f = B.firdaria(c).find(f => jd >= f.start && jd < f.end); if (f) { out.push(`Firdaria’da ${nm(f.p)} dönemindesiniz; bu yıllar ${XA.PL[f.p] ? XA.PL[f.p].t.toLocaleLowerCase('tr-TR') : nm(f.p)} temasının olgunlaştığı bir dönem.`); why.push(`firdaria ${nm(f.p)}`); } }
    // natal vaat ile yılın bağlantısı
    const ar = X().AREAS.find(a => a.h.includes(prof.house));
    if (ar && !z.U) out.push(`Bu yüzden bu yıl özellikle “${ar.n.toLocaleLowerCase('tr-TR')}” alanına dair okumanız güncel ve tetiklenmiş durumda.`);
    return { paras: out, why };
  }

  /* ---------- HTML yardımcıları ---------- */
  const whyHTML = w => w && w.length ? `<details class="why"><summary>Neden böyle söylüyorum?</summary><ul>${w.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>` : '';
  function themesHTML(c, n) {
    const T = themes(c, n), CN = X().CONN;
    return T.map((t, i) => `<h3>${i + 1}. ${esc(t.title)}</h3><p>${i > 0 && i % 2 === 0 ? esc(CN[i % CN.length]) + ', ' : ''}${esc(i > 0 && i % 2 === 0 ? t.text.charAt(0).toLocaleLowerCase('tr-TR') + t.text.slice(1) : t.text)}</p>${whyHTML(t.why)}`).join('');
  }
  function areasHTML(c, focus) {
    let L = areas(c); if (focus && focus !== 'genel') L = L.filter(a => a.k === focus).concat(L.filter(a => a.k !== focus));
    const badge = v => `<span class="tag">${{ good: 'destekli', mixed: 'karışık', hard: 'emek isteyen' }[v]}</span>`;
    return L.map(a => `<h3>${esc(a.n)} ${badge(a.verdict)}</h3>${a.paras.map(t => `<p>${esc(t)}</p>`).join('')}${whyHTML(a.why)}`).join('');
  }
  function timingHTML(c, jd) { const t = timing(c, jd); return t.paras.map(p => `<p>${esc(p)}</p>`).join('') + whyHTML(t.why); }
  function conditionHTML(c, id) { const r = condition(c, id); return r.text ? `<p class="small"><b>Durum:</b> ${esc(r.text)}</p>${whyHTML(r.why)}` : ''; }

  root.ASTROLOG = { analyze, condition, themes, areas, area, timing, themesHTML, areasHTML, timingHTML, conditionHTML, whyHTML };
})(window);
