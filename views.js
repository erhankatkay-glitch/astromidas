/* AstroMidas — ekranlar ve raporlar */
(function () {
  'use strict';
  const { paras, A, B, S, $, esc, save, toast, calcSettings, SG, P, nm, gl, dms, fmtLon, fmtLonTxt, fmtDate, fmtShort, fmtTime, nowJD, aspClass, ASPG, inputOf, chartOf, person, activeP, pointsFor, aspectsOf, wheel, moonPhaseSVG, moonDefs, signText, houseText, aspectText, rulerOf, CORE, DEVICE_TZ, pad } = AM;
  const app = $('#app');
  const sym = t => `<span class="sym">${esc(t)}</span>`;
  const G = id => sym(gl(id));
  const LOGO = '<img src="logo-icon.jpg" alt="AstroMidas logosu" width="52" height="52" class="logo-ic">';
  let uidN = 0;

  /* ---------- Menü ---------- */
  const ICON = {
    an: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z"/></svg>',
    harita: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
    rezonans: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="10"/><path d="M12 2a5 5 0 0 1 0 10 5 5 0 0 0 0 10A10 10 0 0 1 12 2z" fill="currentColor" fill-opacity=".85"/><circle cx="12" cy="7" r="1.4" fill="#0b1226"/><circle cx="12" cy="17" r="1.4" fill="currentColor"/></svg>',
    donguler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M16 2.8A9.5 9.5 0 1 0 21.2 16 7.6 7.6 0 0 1 16 2.8z"/></svg>',
    defter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M7 3h11a2 2 0 0 1 2 2v1H9"/><path d="M7 3a2 2 0 0 0-2 2v14a2 2 0 0 1-2 2h12a2 2 0 0 0 2-2V6"/><path d="M9 9h6M9 12.5h6M9 16h4"/></svg>'
  };
  const TABS = [['an', 'An'], ['harita', 'Harita'], ['rezonans', 'Rezonans'], ['donguler', 'Döngüler'], ['defter', 'Defter']];
  function drawTabs() { $('#tabs').innerHTML = TABS.map(([k, t]) => `<button data-tab="${k}" class="${S.tab === k || (k === 'an' && S.tab === 'gunluk') ? 'on' : ''}" aria-label="${t}">${ICON[k]}<span>${t}</span></button>`).join(''); }
  $('#tabs').addEventListener('click', e => { const b = e.target.closest('button[data-tab]'); if (!b) return; S.tab = b.dataset.tab; location.hash = S.tab; render(); window.scrollTo(0, 0); });

  function medallion(ph) { // gümüş Ay madalyonu, gerçek evreyle
    const k = (1 - Math.cos(ph * Math.PI / 180)) / 2, wax = ph < 180, r = 17, rx = r * Math.abs(1 - 2 * k), so = wax ? 1 : 0, si = (k > .5) === wax ? 1 : 0;
    return `<svg class="medal" viewBox="0 0 48 48" width="48" height="48" aria-label="Ay evresi"><defs><radialGradient id="mdl" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#c9d0dc"/><stop offset="1" stop-color="#7f8aa0"/></radialGradient><radialGradient id="mdm" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#cfd6e4"/></radialGradient></defs><circle cx="24" cy="24" r="23" fill="url(#mdl)"/><circle cx="24" cy="24" r="20" fill="none" stroke="#fff" stroke-opacity=".7" stroke-dasharray="1 2"/><circle cx="24" cy="24" r="${r}" fill="#5d6780"/><path d="M24 ${24 - r} A${r} ${r} 0 0 ${so} 24 ${24 + r} A${rx.toFixed(2)} ${r} 0 0 ${si} 24 ${24 - r}Z" fill="url(#mdm)"/></svg>`;
  }
  function header() {
    const jd = nowJD(), sun = A.rawLon('Sun', jd), moon = A.rawLon('Moon', jd), ms = A.signOf(moon.lon), ph = A.norm(moon.lon - sun.lon);
    const d = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', timeZone: DEVICE_TZ }).format(new Date());
    const sd = Math.floor(A.norm(sun.lon) % 30), md = Math.floor(A.norm(moon.lon) % 30);
    return `<header class="top"><div class="brand">${LOGO}<div><b>AstroMidas</b><small>Ay ışığı &amp; kozmik rehber</small></div></div>
      <div class="today"><div>${esc(d)} · Ay ${AM.LOC[ms]} ${sym(SG[ms])}</div><div>${sym('☉\uFE0E')} ${pad(sd)}° ${sym(SG[A.signOf(sun.lon)])} · ${sym('☽\uFE0E')} ${pad(md)}° ${sym(SG[ms])}</div></div><img class="medal" src="medal.png" alt="" width="33" height="33"></header>`;
  }
  function subnav(key, items) {
    const cur = S.sub[key] || items[0][0];
    return `<div class="sub" role="tablist">${items.map(([k, t]) => `<button data-sub="${key}:${k}" class="${cur === k ? 'on' : ''}">${t}</button>`).join('')}</div>`;
  }
  const curSub = (key, def) => S.sub[key] || def;
  function personPicker(field, label) {
    const id = field === 'partner' ? S.partner : (activeP() || {}).id;
    if (!S.people.length) return '';
    return `<label>${label || 'Kişi'}</label><select data-pick="${field}">${S.people.map(p => `<option value="${esc(p.id)}" ${p.id === id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>`;
  }
  function timeNote(c) {
    const dst = c.input && c.input.gap ? `<div class="card small"><b>Dikkat:</b> girilen saat, yaz saatine geçiş nedeniyle o gün yaşanmamış bir saat. Geçiş öncesi saat dilimiyle hesaplandı; doğum belgesini kontrol edin.</div>` : c.input && c.input.ambiguous ? `<div class="card small"><b>Dikkat:</b> girilen saat, yaz saatinden dönüşte iki kez yaşandı; yaz saati varsayıldı. Gerekirse kişiyi düzenleyip UTC farkını elle girin.</div>` : '';
    if (dst && !c.unknownTime && !c.approxAsc) return dst;
    if (c.unknownTime) return dst + `<div class="card small"><b>Doğum saati bilinmiyor.</b> Yükselen, MC ve ev yerleşimleri hesaplanamaz; harita, Güneş derecesi 1. ev başlangıcı olacak şekilde güneş haritası olarak çizildi. Ay gün içinde ${fmtLon(c.moonRange[0])} ile ${fmtLon(c.moonRange[1])} arasında ilerler; Ay’ın burcu bu aralıkta değişiyorsa yorumu dikkatle okuyun.</div>`;
    if (c.approxAsc) return dst + `<div class="card small"><b>Doğum saati yaklaşık (±30 dk).</b> Bu aralıkta Yükselen ${fmtLon(c.approxAsc[0])} ile ${fmtLon(c.approxAsc[1])} arasında değişir. Ev ve açı noktası (Yükselen, MC) yorumlarını bu belirsizlikle değerlendirin; Rektifikasyon aracı saati daraltmaya yardım eder.</div>`;
    return '';
  }
  function needPerson() { return `<div class="card empty"><p>Önce bir doğum bilgisi ekleyin.</p><button class="btn" data-act="newperson">Kişi ekle</button></div>`; }

  /* ---------- AN ---------- */
  const CONST = [
    [[[-.8,.2],[-.2,-.1],[.4,-.25],[.8,.1]],[[0,1],[1,2],[2,3]]],
    [[[-.8,-.6],[-.2,0],[.1,.2],[.5,0],[.8,-.55],[.1,.65]],[[0,1],[1,2],[2,3],[3,4],[2,5]]],
    [[[-.6,-.8],[-.5,0],[-.4,.8],[.4,-.8],[.5,0],[.6,.8]],[[0,1],[1,2],[3,4],[4,5],[0,3]]],
    [[[0,-.1],[-.6,-.7],[.6,-.6],[0,.8]],[[0,1],[0,2],[0,3]]],
    [[[-.8,.4],[-.3,.5],[.2,.3],[.3,-.2],[0,-.6],[-.4,-.5],[.8,.5]],[[0,1],[1,2],[2,6],[2,3],[3,4],[4,5]]],
    [[[-.8,-.3],[-.3,-.1],[.1,-.4],[.4,0],[.8,.5],[.2,.5],[-.2,.75]],[[0,1],[1,2],[2,3],[3,4],[3,5],[5,6]]],
    [[[-.6,.4],[0,-.6],[.6,.4],[0,.2]],[[0,1],[1,2],[2,3],[3,0]]],
    [[[-.8,-.6],[-.5,-.4],[-.2,-.1],[.1,.2],[.3,.6],[.7,.7],[.8,.3]],[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]],
    [[[-.6,.2],[-.2,.35],[.2,.1],[.4,-.3],[0,-.5],[-.3,-.2],[.75,-.1]],[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[2,6]]],
    [[[-.8,-.4],[.8,-.5],[.2,.6],[-.3,.2]],[[0,1],[1,2],[2,3],[3,0]]],
    [[[-.8,-.5],[-.3,-.3],[.1,-.5],[.4,0],[.2,.6],[.7,.45]],[[0,1],[1,2],[2,3],[3,4],[4,5]]],
    [[[-.8,-.6],[-.4,0],[0,.6],[.4,.2],[.8,.4],[.5,-.3]],[[0,1],[1,2],[2,3],[3,4],[4,5]]]
  ];
  const DAYTXT = ['Ay’ın Koç’taki ateşi bugün cesaretle ilk adımı atmanı istiyor. Sabırsızlığı değil, girişimci ruhunu besle.', 'Ay Boğa’da: yavaşla, bedenini ve duyularını dinle. Küçük konforlar bugün ruhunu besliyor.', 'Ay İkizler’de: merakın açık, sözlerin canlı. Bugün konuşmak, yazmak ve öğrenmek sana iyi gelir.', 'Ay Yengeç’te, kendi evinde: duygularını besle, sevdiklerinle yuvanı ısıt.', 'Ay’ın gümüş ışığı Aslan burcunda parlıyor; içsel ışığını ortaya çıkarma cesaretini bugün bul. Kalbinden geleni yarat.', 'Ay Başak’ta: düzen kur, ayrıntılara özen göster. Bedenine iyi bakmak bugün en büyük şifa.', 'Ay Terazi’de: uyum ve güzellik arıyorsun. İlişkilerinde dengeyi gözet, nazik ol.', 'Ay Akrep’te: duygular derin ve yoğun. Sezgilerine güven, bırakman gerekeni bırak.', 'Ay Yay’da: ufkunu genişlet, iyimserliğini besle. Yeni bir fikir ya da yolculuk seni çağırıyor.', 'Ay Oğlak’ta: hedeflerine odaklan, sorumluluklarını sakinlikle taşı. Sağlam adımlar at.', 'Ay Kova’da: özgür düşün, dostlarınla bağ kur. Farklı olanı kucakla.', 'Ay Balık’ta: sezgilerin çok güçlü. Hayal kur, müzik dinle, ruhunu dinlendir.'];
  const HEAD = ['Gökyüzü Bugün Yeni Bir Sayfa Açıyor', 'Gökyüzü Bugün Niyetlerini Büyütüyor', 'Gökyüzü Bugün Seni Harekete Çağırıyor', 'Gökyüzü Bugün Olgunlaştırıyor', 'Gökyüzü Bugün Ay Işığıyla Konuşuyor', 'Gökyüzü Bugün Paylaşmaya Çağırıyor', 'Gökyüzü Bugün Bırakmayı Fısıldıyor', 'Gökyüzü Bugün Dinlenmeye Davet Ediyor'];
  function skyWheel(c) {
    const W = 600, cx = 300, cy = 300, th = l => (285 - l) * Math.PI / 180, P = (l, r) => [cx + r * Math.sin(th(l)), cy - r * Math.cos(th(l))];
    const moon = c.get('Moon'), ph = c.phaseAngle, f1 = x => x.toFixed(1);
    const R_OUT = 236, R_SIGN_O = 144, R_SIGN_I = 95, R_MOON = 75;
    let s = `<svg viewBox="0 0 ${W} ${W}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Anın göksel dokusu: Ay ${A.SIGNS[moon.sign]} burcunda">
    <defs><radialGradient id="mG" cx="40%" cy="36%" r="66%"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e2e6ee"/><stop offset=".85" stop-color="#b9c1d0"/><stop offset="1" stop-color="#8e98ad"/></radialGradient>
    <radialGradient id="mH" cx="50%" cy="50%" r="50%"><stop offset=".45" stop-color="#eef3ff" stop-opacity=".55"/><stop offset=".7" stop-color="#b9cbf5" stop-opacity=".18"/><stop offset="1" stop-color="#b9cbf5" stop-opacity="0"/></radialGradient>
    <filter id="mT" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="5" seed="12"/><feColorMatrix type="matrix" values="0 0 0 0 .42 0 0 0 0 .46 0 0 0 0 .55 0 0 0 -2.4 1.45"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="cr" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency=".13" numOctaves="2" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 .9 0 0 0 0 .92 0 0 0 0 .96 0 0 0 -6 2.6"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter><filter id="sb"><feGaussianBlur stdDeviation="5"/></filter><clipPath id="mC"><circle cx="${cx}" cy="${cy}" r="${R_MOON}"/></clipPath></defs>`;
    const ln = 'rgba(232,238,250,.62)';
    s += `<circle cx="${cx}" cy="${cy}" r="290" fill="url(#mH)" opacity=".35"/>`;
    const spark = (x, y, r, o) => `<g opacity="${o}"><circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="#dfe8ff" opacity=".35" filter="url(#gl)"/><path d="M${x} ${y - r * 3} L${x + r * .35} ${y - r * .35} L${x + r * 3} ${y} L${x + r * .35} ${y + r * .35} L${x} ${y + r * 3} L${x - r * .35} ${y + r * .35} L${x - r * 3} ${y} L${x - r * .35} ${y - r * .35}Z" fill="#fff"/></g>`;
    s += spark(46, 70, 2.2, .9) + spark(560, 40, 2.6, .95) + spark(574, 520, 1.8, .8) + spark(30, 470, 1.6, .7) + spark(500, 110, 1.4, .7) + spark(96, 560, 1.4, .6);
    s += `<g fill="none" stroke="${ln}" stroke-width="1"><circle cx="${cx}" cy="${cy}" r="292" stroke="rgba(230,236,250,.22)"/><circle cx="${cx}" cy="${cy}" r="${R_OUT}" stroke-width="1.3" stroke="rgba(230,236,250,.55)"/><circle cx="${cx}" cy="${cy}" r="${R_OUT - 7}" stroke-opacity=".5" stroke-dasharray="1.2 3.2"/><circle cx="${cx}" cy="${cy}" r="${R_SIGN_O}" stroke="rgba(230,236,250,.55)"/><circle cx="${cx}" cy="${cy}" r="${R_SIGN_I}"/></g>`;
    for (const d of [0, 90, 180, 270]) { const a = d * Math.PI / 180; s += `<line x1="${f1(cx + (R_SIGN_I) * Math.sin(a))}" y1="${f1(cy - (R_SIGN_I) * Math.cos(a))}" x2="${f1(cx + 292 * Math.sin(a))}" y2="${f1(cy - 292 * Math.cos(a))}" stroke="${ln}"/>`; }
    for (let d = 0; d < 360; d += 30) { if (d >= 150 && d <= 210) continue; const a = d * Math.PI / 180, rr = 254; s += `<text x="${f1(cx + rr * Math.sin(a))}" y="${f1(cy - rr * Math.cos(a))}" font-size="14.5" fill="rgba(232,238,250,.92)" text-anchor="middle" dominant-baseline="central" font-family="Manrope,system-ui,sans-serif">${d}°</text>`; }
    for (let i = 0; i < 12; i++) {
      const l0 = i * 30, [x1, y1] = P(l0, R_SIGN_I), [x2, y2] = P(l0, R_OUT);
      s += `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${ln}"/>`;
      const [gx, gy] = P(l0 + 15, (R_SIGN_O + R_SIGN_I) / 2); s += `<text x="${f1(gx)}" y="${f1(gy)}" font-size="19" fill="rgba(244,247,253,.95)" text-anchor="middle" dominant-baseline="central" class="sym">${SG[i]}</text>`;
      const [ox, oy] = P(l0 + 15, (R_OUT + R_SIGN_O) / 2), [pts, ed] = CONST[i], sc = 30, Q = p => [ox + p[0] * sc, oy + p[1] * sc];
      for (const [u, w] of ed) { const [a1, b1] = Q(pts[u]), [a2, b2] = Q(pts[w]); s += `<line x1="${f1(a1)}" y1="${f1(b1)}" x2="${f1(a2)}" y2="${f1(b2)}" stroke="rgba(240,245,255,.78)" stroke-width="1"/>`; }
      pts.forEach((p, k) => { const [a1, b1] = Q(p), r = k === 0 ? 2.1 : 1.4; s += `<circle cx="${f1(a1)}" cy="${f1(b1)}" r="${r * 2.6}" fill="#e3ebff" opacity=".35" filter="url(#gl)"/><circle cx="${f1(a1)}" cy="${f1(b1)}" r="${r}" fill="#fff"/>`; });
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${R_SIGN_I - 2}" fill="url(#mH)"/><circle cx="${cx}" cy="${cy}" r="${R_MOON + 6}" fill="#f2f6ff" opacity=".35" filter="url(#sb)"/><circle cx="${cx}" cy="${cy}" r="${R_MOON}" fill="url(#mG)"/>`;
    s += `<g clip-path="url(#mC)"><image href="moon.jpg" x="${cx - R_MOON - 1}" y="${cy - R_MOON - 1}" width="${2 * R_MOON + 2}" height="${2 * R_MOON + 2}" preserveAspectRatio="xMidYMid slice"/>`;
    const k = (1 - Math.cos(ph * Math.PI / 180)) / 2, wax = ph < 180, r = R_MOON, rx = r * Math.abs(1 - 2 * k), so = wax ? 0 : 1, si = (k > .5) === wax ? 0 : 1;
    if (k < .985) s += `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 ${so} ${cx} ${cy + r} A${rx.toFixed(2)} ${r} 0 0 ${si} ${cx} ${cy - r}Z" fill="#0a1228" opacity=".88"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R_MOON}" fill="none" stroke="#fff" stroke-opacity=".35"/></g>`;
    const t = th(moon.lon), ex = 196 * Math.sin(t), ey = -99 * Math.cos(t), rot = -38 * Math.PI / 180;
    const dx = cx + ex * Math.cos(rot) - ey * Math.sin(rot), dy = cy + ex * Math.sin(rot) + ey * Math.cos(rot);
    s += `<ellipse cx="${cx}" cy="${cy}" rx="196" ry="99" transform="rotate(-38 ${cx} ${cy})" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="5" opacity=".35" filter="url(#gl)"/><ellipse cx="${cx}" cy="${cy}" rx="196" ry="99" transform="rotate(-38 ${cx} ${cy})" fill="none" stroke="rgba(248,250,255,.95)" stroke-width="2.2"/>`;
    s += `<circle cx="${f1(dx)}" cy="${f1(dy)}" r="18" fill="#eef3ff" opacity=".45" filter="url(#sb)"/><circle cx="${f1(dx)}" cy="${f1(dy)}" r="8" fill="url(#mG)" stroke="#fff" stroke-width="1"/>`;
    return s + '</svg>';
  }
  function gauge(label, val, sub) {
    const f = Math.max(0, Math.min(100, val)) / 100, r = 30.5, cx = 34, cy = 33, a0 = 170, sw = 200;
    const pt = d => { const t = (a0 + d) * Math.PI / 180; return [(cx + r * Math.cos(t)).toFixed(2), (cy + r * Math.sin(t)).toFixed(2)]; };
    const arc = d => { const [x0, y0] = pt(0), [x1, y1] = pt(d); return `M${x0} ${y0} A${r} ${r} 0 ${d > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
    const id = 'g' + label.replace(/[^a-z]/gi, '').slice(0, 6), blue = /Saat|Transit/.test(label);
    return `<div class="gauge"><small>${label}</small><svg viewBox="0 0 68 43"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${blue ? '#d9e6ff' : '#ffffff'}"/><stop offset="1" stop-color="${blue ? '#8fb2ec' : '#c9d2e2'}"/></linearGradient><filter id="${id}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.6"/></filter></defs>
      <path d="${arc(sw)}" fill="none" stroke="rgba(150,165,195,.22)" stroke-width="3.4" stroke-linecap="round"/>
      ${f > 0 ? `<path d="${arc(sw * f)}" fill="none" stroke="url(#${id})" stroke-width="4" stroke-linecap="round" filter="url(#${id}f)" opacity=".75"/><path d="${arc(sw * f)}" fill="none" stroke="url(#${id})" stroke-width="3.4" stroke-linecap="round"/>` : ''}
      <text x="34" y="31" text-anchor="middle" font-size="10.5" font-weight="700" fill="#fff" font-family="Manrope,system-ui,sans-serif">${val}%</text><text x="34" y="40.5" text-anchor="middle" font-size="7.4" fill="#c3cbdb" font-family="Manrope,system-ui,sans-serif">${esc(sub)}</text></svg></div>`;
  }
  function viewAn() {
    const jd = nowJD(), here = S.settings.here, s = calcSettings({ system: 'modern', zodiac: 'T' });
    const c = A.chart({ jd, lat: here.lat, lon: here.lon }, s); c.calc = s;
    const ph = c.phaseAngle, illum = Math.round((1 - Math.cos(ph * Math.PI / 180)) / 2 * 100), cyc = Math.round(ph / 360 * 100);
    const phi = Math.floor(((ph + 22.5) % 360) / 45), moon = c.get('Moon');
    const local = new Date(), wdi = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(new Intl.DateTimeFormat('en-US', { timeZone: here.zone, weekday: 'short' }).format(local));
    const off = A.tzOffsetMin(here.zone, Date.now()), parts = new Intl.DateTimeFormat('en-CA', { timeZone: here.zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(local).split('-').map(Number);
    const midJD = A.jdFromUTC(Date.UTC(parts[0], parts[1] - 1, parts[2]) - off * 60000);
    let ph2 = B.planetaryHours(midJD, wdi, here.lat, here.lon), hour = null;
    if (ph2 && jd < ph2.sunrise) ph2 = B.planetaryHours(midJD - 1, (wdi + 6) % 7, here.lat, here.lon);
    if (ph2) hour = ph2.hours.find(h => jd >= h.start && jd < h.end);
    const hp = hour ? Math.round((jd - hour.start) / (hour.end - hour.start) * 100) : 0;
    const voc = B.voidOfCourse(jd - 2.5, jd + 2.5).find(v => jd >= v.start && jd < v.end);
    const ap = activeP();
    let mine = '', tint = null;
    if (ap) { // kişisel transit yoğunluğu: yavaş gezegenlerin 1,5° içindeki majör açıları, ağırlıklı
      const nat = chartOf(ap), W = { Pluto: 5, Neptune: 4, Uranus: 4, Saturn: 4, Jupiter: 2, Mars: 1 }, tgt = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Asc', 'MC'];
      let sc = 0; for (const t of Object.keys(W)) { const tl = c.get(t).lon; for (const id of tgt) { const n = nat.get(id); if (!n || (nat.unknownTime && ['Asc', 'MC'].includes(id))) continue; const sep = Math.abs(A.wrap180(tl - n.lon)); for (const ang of [0, 60, 90, 120, 180]) { const o = Math.abs(sep - ang); if (o < 1.5) sc += W[t] * (1 - o / 1.5) * (ang === 90 || ang === 180 || ang === 0 ? 1.2 : .8) * (['Sun', 'Moon', 'Asc', 'MC'].includes(id) ? 1.3 : 1); } } }
      tint = Math.min(100, Math.round(sc / 14 * 100));
    }
    if (ap) {
      const nat = chartOf(ap), tr = aspectsOf(c, nat, { fixedOrb: 1, staticB: true }).filter(a => CORE.includes(a.p.id) && a.asp.major).slice(0, 4);
      mine = `<div class="card"><h3 style="margin-top:0">${esc(ap.name)} için bugün</h3>${tr.length ? tr.map(a => `<p class="small"><span class="${aspClass(a.asp.k)}">${G(a.p.id)} ${ASPG[a.asp.k]} ${G(a.q.id)}</span> Transit ${nm(a.p.id)} ${a.asp.n.toLowerCase()} natal ${nm(a.q.id)} <span class="muted">(orb ${dms(a.orb)})</span></p>`).join('') : '<p class="muted small">Bugün 1° içinde transit yok.</p>'}</div>`;
    }
    const orbIcon = `<svg class="ic-orb" width="96" height="60" viewBox="0 0 96 60" fill="none"><ellipse cx="48" cy="30" rx="40" ry="16" transform="rotate(-18 48 30)" stroke="#dfe6f4" stroke-opacity=".8"/><circle cx="40" cy="32" r="11" fill="url(#ic1)"/><circle cx="58" cy="28" r="8" fill="#c9d1e0" opacity=".85"/><circle cx="84" cy="14" r="3.5" fill="#fff"/><circle cx="12" cy="46" r="3" fill="#fff" opacity=".8"/><defs><radialGradient id="ic1" cx="40%" cy="35%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#8f9ab0"/></radialGradient></defs></svg>`;
    const lineIcon = `<svg class="ic-line" width="120" height="44" viewBox="0 0 120 44" fill="none"><path d="M4 30h108" stroke="#dfe6f4" stroke-opacity=".8"/><path d="M108 26l6 4-6 4" stroke="#dfe6f4"/><circle cx="22" cy="30" r="2.5" fill="#cfd6e4"/><circle cx="44" cy="30" r="3" fill="#dfe6f4"/><circle cx="68" cy="30" r="6" fill="url(#ic1)"/><circle cx="90" cy="30" r="3" fill="#dfe6f4"/><text x="96" y="14" font-size="17" fill="#e8edf6" class="sym">♂︎</text></svg>`;
    const starIcon = `<svg class="ic-orb" width="96" height="60" viewBox="0 0 96 60" fill="none"><rect x="54" y="8" width="30" height="44" rx="4" stroke="#dfe6f4" stroke-opacity=".85" transform="rotate(10 69 30)"/><path d="M69 18 L72 27 L81 30 L72 33 L69 42 L66 33 L57 30 L66 27Z" fill="#eef2fa" transform="rotate(10 69 30)"/><path d="M22 18 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2Z M38 38 l1.4 4 l4 1.4 l-4 1.4 l-1.4 4 l-1.4 -4 l-4 -1.4 l4 -1.4Z" fill="#dfe6f4"/></svg>`;
    const wheelIcon = `<svg width="92" height="92" viewBox="0 0 92 92" fill="none" stroke="#dfe6f4" stroke-opacity=".85"><circle cx="46" cy="46" r="42"/><circle cx="46" cy="46" r="30"/><circle cx="46" cy="46" r="14"/>${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${(46 + 14 * Math.cos(a)).toFixed(1)}" y1="${(46 + 14 * Math.sin(a)).toFixed(1)}" x2="${(46 + 42 * Math.cos(a)).toFixed(1)}" y2="${(46 + 42 * Math.sin(a)).toFixed(1)}" stroke-opacity=".5"/>`; }).join('')}${[0, 2, 4, 7, 9].map(i => { const a = (i * 30 + 15) * Math.PI / 180; return `<text x="${(46 + 36 * Math.cos(a)).toFixed(1)}" y="${(46 + 36 * Math.sin(a)).toFixed(1)}" font-size="8" fill="#dfe6f4" stroke="none" text-anchor="middle" dominant-baseline="central" class="sym">${SG[i]}</text>`; }).join('')}</svg>`;
    return `<div class="an">${header()}
      <h3 class="eyebrow">Anın Göksel Dokusu</h3>
      <div class="wheelbox sky">${skyWheel(c)}</div>
      <h1 class="hero">${HEAD[phi]}</h1>
      <p class="lead">${esc(DAYTXT[moon.sign])}</p>
      <div class="gauges">${gauge('Ay Işığı', illum, 'Aydınlanma')}${gauge('Ay Döngüsü', cyc, TX.PHASE[phi][0])}${tint != null ? gauge('Transit Yoğunluğu', tint, ap.name.split(' ')[0]) : gauge('Gezegen Saati', hp, hour ? nm(hour.ruler) + ' saati' : '—')}</div>
      <button class="card navcard big" data-go="harita">${wheelIcon}<div><h3>Doğum Haritanız: Ay Işığı Aynası</h3><div class="muted small">Ruhunuzun ve göksel haritanızın gümüş yansıması</div><div class="go">Aydınlığa Yol Al →</div></div></button>
      <button class="card navcard" data-go="rezonans"><div style="flex:1"><h3>Kozmik Uyum &amp; Gümüş Rezonans</h3><div class="muted small">İki ruhun kozmik ve duygusal uyumu</div></div>${orbIcon}</button>
      <button class="card navcard" data-go="donguler"><div style="flex:1"><h3>Zamanın Ritmi &amp; Ay Döngüleri</h3><div class="muted small">Hilal’den Dolunay’a · ${voc ? 'Ay şu an boşlukta' : 'Ay ' + AM.LOC[moon.sign]} · ${hour ? nm(hour.ruler) + ' saati' : ''}</div></div>${lineIcon}</button>
      <button class="card navcard" data-go="gunluk"><div style="flex:1"><h3>Günün Rehberi &amp; Burç Yorumları</h3><div class="muted small">Kozmik mesaj, manifest, tarot ve 12 burç</div></div>${starIcon}</button></div>
      ${mine}`;
  }
  /* ---------- Kişi formu ---------- */
  function personForm(p) {
    p = p || { id: '', name: '', y: 1990, mo: 1, d: 1, h: 12, mi: 0, place: '', lat: '', lon: '', zone: 'Europe/Istanbul', offsetOverride: '' };
    const tzs = [...new Set(['Europe/Istanbul', ...CITY_TZ])].sort();
    return `<div class="card" id="pform"><h2 style="margin-top:0">${p.id ? 'Kişiyi düzenle' : 'Yeni doğum bilgisi'}</h2>
      <input type="hidden" id="f_id" value="${esc(p.id)}">
      <label for="f_name">Ad</label><input id="f_name" value="${esc(p.name)}" autocomplete="off">
      <label for="f_date">Doğum tarihi</label><input id="f_date" type="date" value="${p.y}-${pad(p.mo)}-${pad(p.d)}" min="1800-01-01" max="2399-12-31">
      <label for="f_time">Doğum saati (yerel, doğum belgesindeki saat)</label><input id="f_time" type="time" step="60" value="${pad(p.h)}:${pad(p.mi)}">
      <label for="f_acc">Doğum saatinin güvenilirliği</label><select id="f_acc"><option value="kesin" ${(p.timeAcc || 'kesin') === 'kesin' ? 'selected' : ''}>Kesin (belge ya da kayıt)</option><option value="yaklasik" ${p.timeAcc === 'yaklasik' ? 'selected' : ''}>Yaklaşık (±30 dakika)</option><option value="bilinmiyor" ${p.timeAcc === 'bilinmiyor' ? 'selected' : ''}>Bilinmiyor (güneş haritası)</option></select>
      <label for="f_city">Doğum yeri</label><div class="dd"><input id="f_city" value="${esc(p.place)}" placeholder="Şehir ara (örn. İzmir, Berlin)" autocomplete="off"><div class="ddlist" id="f_dd" hidden></div></div>
      <div class="grid2"><div><label for="f_lat">Enlem (K +, G −)</label><input id="f_lat" inputmode="decimal" value="${esc(p.lat)}"></div><div><label for="f_lon">Boylam (D +, B −)</label><input id="f_lon" inputmode="decimal" value="${esc(p.lon)}"></div></div>
      <label for="f_zone">Saat dilimi (tarihsel yaz saati otomatik)</label><select id="f_zone">${tzs.map(z => `<option ${z === p.zone ? 'selected' : ''}>${esc(z)}</option>`).join('')}</select>
      <label for="f_off">UTC farkını elle gir (dakika; boş = otomatik)</label><input id="f_off" inputmode="numeric" placeholder="örn. 180" value="${esc(p.offsetOverride)}">
      <p class="small muted" id="f_info"></p>
      <div class="row"><button class="btn" data-act="saveperson">Kaydet ve haritayı aç</button><button class="btn ghost" data-act="cancelform">Vazgeç</button></div></div>`;
  }
  function formInfo() {
    const el = $('#f_info'); if (!el) return;
    try {
      const [y, mo, d] = $('#f_date').value.split('-').map(Number), [h, mi] = $('#f_time').value.split(':').map(Number), z = $('#f_zone').value, ov = $('#f_off').value.trim();
      const off = ov !== '' ? +ov : A.localToUTC(y, mo, d, h, mi, z).offsetMin;
      const ms = Date.UTC(y, mo - 1, d, h, mi) - off * 60000;
      const r = ov !== '' ? {} : A.localToUTC(y, mo, d, h, mi, z);
      el.textContent = `UTC farkı: ${fmtOff(off)} · UTC: ${new Date(ms).toISOString().slice(0, 19).replace('T', ' ')}${r.gap ? ' · Dikkat: bu saat yaz saatine geçiş nedeniyle o gün yaşanmadı; belgedeki saati kontrol edin.' : r.ambiguous ? ' · Dikkat: bu saat yaz saatinden dönüşte iki kez yaşandı; yaz saati varsayıldı, gerekirse UTC farkını elle girin.' : ''}`;
    } catch (e) { el.textContent = ''; }
  }
  function fmtOff(m) { const sg = m >= 0 ? '+' : '−', t = Math.round(Math.abs(m) * 60), hh = Math.floor(t / 3600), mm = Math.floor(t % 3600 / 60), ss = t % 60; return sg + pad(hh) + ':' + pad(mm) + (ss ? ':' + pad(ss) : ''); }
  function citySearch(q) {
    q = q.toLocaleLowerCase('tr').trim(); if (q.length < 2) return [];
    const n = s => s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');
    const qq = n(q), out = [];
    for (const c of CITIES) { if (n(c[0]).startsWith(qq)) out.push(c); if (out.length > 30) break; }
    if (out.length < 12) for (const c of CITIES) { if (!out.includes(c) && n(c[0]).includes(qq)) out.push(c); if (out.length > 30) break; }
    return out.slice(0, 20);
  }

  /* ---------- HARİTA ---------- */
  function posTable(c, pts) {
    return `<div class="scroll"><table class="pos"><thead><tr><th>Nokta</th><th>Konum</th><th>Ev</th><th class="n">Hız/gün</th><th class="n">Dekl.</th><th>Not</th></tr></thead><tbody>${pts.map(p => `<tr><td style="white-space:nowrap">${G(p.id)} ${esc(nm(p.id))}</td><td style="white-space:nowrap">${fmtLon(p.lon, true)}${p.retro ? ' <b>R</b>' : ''}</td><td>${p.house}</td><td class="n">${p.speed != null && Math.abs(p.speed) < 100 ? (p.speed >= 0 ? '' : '−') + dms(p.speed, Math.abs(p.speed) < 1) : ''}</td><td class="n">${p.dec != null ? (p.dec < 0 ? 'G ' : 'K ') + dms(p.dec) : ''}</td><td class="small">${[p.oob ? 'Sınır dışı (OOB)' : '', p.dig ? p.dig.list.join(', ') : '', p.sabian ? 'Sabian ' + A.SIGNS[p.sign] + ' ' + p.sabian : ''].filter(Boolean).join(' · ')}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function cuspTable(c) { const cu = c.houses.cusps; return `<div class="scroll"><table><thead><tr><th>Ev</th><th>Başlangıç</th><th>Ev</th><th>Başlangıç</th></tr></thead><tbody>${[1, 2, 3, 4, 5, 6].map(i => `<tr><td>${i}</td><td>${fmtLon(cu[i], true)}</td><td>${i + 6}</td><td>${fmtLon(cu[i + 6], true)}</td></tr>`).join('')}</tbody></table></div><p class="small muted">${esc(A.HSYS[c.houses.sys])} · ${c.calc.zodiac === 'S' ? 'Sidereal (Lahiri)' : 'Tropikal'} · Vertex ${fmtLon(c.houses.vertex)} · Doğu noktası ${fmtLon(c.houses.eastPt)} · RAMC ${dms(c.houses.ramc)} ${c.houses.note ? '· ' + esc(c.houses.note) : ''}</p>`; }
  function aspectGrid(c, asps) {
    const pts = pointsFor(c, { aspectable: true }); const map = new Map(); for (const a of asps) { map.set(a.p.id + '|' + a.q.id, a); map.set(a.q.id + '|' + a.p.id, a); }
    let h = `<div class="scroll"><table style="width:auto;font-size:12px"><tbody>`;
    for (let i = 0; i < pts.length; i++) {
      h += `<tr><th>${G(pts[i].id)}</th>`;
      for (let j = 0; j < i; j++) { const a = map.get(pts[i].id + '|' + pts[j].id); h += `<td style="text-align:center;padding:3px 4px;border:1px solid var(--line)">${a ? `<span class="${aspClass(a.asp.k)} sym" title="${esc(a.asp.n)}">${ASPG[a.asp.k]}</span><br><span style="font-size:9.5px" class="muted">${dms(a.orb)}${a.applying ? 'y' : 'a'}</span>` : ''}</td>`; }
      h += `</tr>`;
    }
    return h + `</tbody></table></div><p class="small muted">y: yaklaşan, a: ayrılan</p>`;
  }
  function aspList(asps) { return `<div class="list">${asps.map(a => `<div><span class="${aspClass(a.asp.k)}">${G(a.p.id)} ${ASPG[a.asp.k]} ${G(a.q.id)}</span> <b>${esc(nm(a.p.id))} ${esc(a.asp.n.toLowerCase())} ${esc(nm(a.q.id))}</b> <span class="muted small">orb ${dms(a.orb)} ${a.applying ? 'yaklaşan' : 'ayrılan'}</span></div>`).join('')}</div>`; }

  function balance(c) {
    const W = { Sun: 3, Moon: 3, Asc: 3, MC: 1, Mercury: 2, Venus: 2, Mars: 2, Jupiter: 1, Saturn: 1, Uranus: .5, Neptune: .5, Pluto: .5 };
    const el = [0, 0, 0, 0], md = [0, 0, 0];
    for (const [id, w] of Object.entries(W)) { const p = c.get(id); if (!p) continue; el[p.sign % 4] += w; md[p.sign % 3] += w; }
    return { el, md };
  }
  function patterns(c) {
    const pts = CORE.map(id => c.get(id)), out = [], close = (a, b, ang, orb) => Math.abs(Math.abs(A.wrap180(a.lon - b.lon)) - ang) <= orb;
    const n = pts.length;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
      const [a, b, d] = [pts[i], pts[j], pts[k]];
      if (close(a, b, 120, 7) && close(b, d, 120, 7) && close(a, d, 120, 7)) { out.push({ t: 'Büyük Üçgen', ids: [a.id, b.id, d.id], el: A.ELEM[a.sign % 4] });
        for (const e of pts) if (![a, b, d].includes(e)) for (const x of [a, b, d]) if (close(e, x, 180, 6)) out.push({ t: 'Uçurtma', ids: [a.id, b.id, d.id, e.id] }); }
      for (const [x, y, z] of [[a, b, d], [a, d, b], [b, d, a]]) {
        if (close(x, y, 180, 8) && close(x, z, 90, 7) && close(y, z, 90, 7)) out.push({ t: 'T-Kare', ids: [x.id, y.id, z.id], apex: z.id });
        if (close(x, y, 60, 3) && close(x, z, 150, 3) && close(y, z, 150, 3)) out.push({ t: 'Yod', ids: [x.id, y.id, z.id], apex: z.id });
      }
    }
    const tsq = out.filter(o => o.t === 'T-Kare');
    for (let i = 0; i < tsq.length; i++) for (let j = i + 1; j < tsq.length; j++) { const u = new Set([...tsq[i].ids, ...tsq[j].ids]); if (u.size === 4) { out.push({ t: 'Büyük Haç', ids: [...u] }); break; } }
    const bySign = {}, byHouse = {}; for (const p of pts) { (bySign[p.sign] = bySign[p.sign] || []).push(p.id); (byHouse[p.house] = byHouse[p.house] || []).push(p.id); }
    for (const [s, l] of Object.entries(bySign)) if (l.length >= 3) out.push({ t: 'Stelyum', ids: l, where: A.SIGNS[s] + ' burcunda' });
    for (const [h, l] of Object.entries(byHouse)) if (l.length >= 3) out.push({ t: 'Stelyum', ids: l, where: h + '. evde' });
    const seen = new Set(); return out.filter(o => { const k = o.t + [...o.ids].sort().join(); if (seen.has(k)) return false; seen.add(k); return true; });
  }
  function shape(c) {
    const ls = CORE.map(id => c.get(id).lon).sort((a, b) => a - b), gaps = ls.map((l, i) => A.norm(ls[(i + 1) % ls.length] - l)).sort((a, b) => b - a);
    const span = 360 - gaps[0];
    if (span <= 120) return 'Demet'; if (span <= 185) return 'Kase';
    for (let k = 0; k < ls.length; k++) { const rest = ls.filter((_, i) => i !== k).sort((a, b) => a - b), g = rest.map((l, i) => A.norm(rest[(i + 1) % rest.length] - l)); if (360 - Math.max(...g) <= 185 && Math.max(...g) >= 160) return 'Kova (Kulplu)'; }
    if (span <= 245) return 'Lokomotif'; if (gaps[0] >= 60 && gaps[1] >= 60) return 'Tahterevalli'; if (gaps[0] < 60) return 'Dağınık'; return 'Yayılmış';
  }
  function dominants(c) {
    const sc = {}, modern = c.calc.system !== 'classic';
    for (const id of CORE) {
      const p = c.get(id); let s = 0;
      if ([1, 10].includes(p.house)) s += 4; else if ([4, 7].includes(p.house)) s += 3;
      for (const ang of ['Asc', 'MC']) if (Math.abs(A.wrap180(p.lon - c.get(ang).lon)) < 6) s += 5;
      if (rulerOf(c.get('Asc').sign, modern) === id || A.RULER[c.get('Asc').sign] === id) s += 5;
      if (A.RULER[c.get('Sun').sign] === id) s += 2; if (A.RULER[c.get('Moon').sign] === id) s += 2;
      if (p.dig) s += p.dig.score / 2;
      if (id === 'Sun' || id === 'Moon') s += 3;
      sc[id] = s;
    }
    for (const a of A.findAspects(CORE.map(i => c.get(i)), CORE.map(i => c.get(i)))) if (a.orb < 3 && a.p.id !== a.q.id) { sc[a.p.id] = (sc[a.p.id] || 0) + .7; sc[a.q.id] = (sc[a.q.id] || 0) + .7; }
    return Object.entries(sc).sort((a, b) => b[1] - a[1]);
  }

  function viewHarita() {
    const p = activeP(); if (!p) return header() + (S.form ? personForm(S.form === true ? null : S.form) : needPerson());
    if (S.form) return header() + personForm(S.form === true ? null : S.form);
    const items = [['natal', 'Natal'], ['klasik', 'Klasik Batı'], ['vedik', 'Vedik'], ['analiz', 'Analiz'], ['drakonik', 'Drakonik'], ['antisya', 'Antisya'], ['yildiz', 'Sabit yıldızlar'], ['karto', 'Kartografi'], ['rekt', 'Rektifikasyon']];
    const sub = curSub('harita', 'natal');
    let h = header() + `<div class="row" style="margin-top:12px"><div style="flex:1">${personPicker('active')}</div><button class="btn ghost" data-act="editperson" style="margin-top:26px">Düzenle</button><button class="btn ghost" data-act="newperson" style="margin-top:26px">+ Kişi</button></div>` + subnav('harita', items);
    const inp = inputOf(p), meta = `<p class="small muted" style="text-align:center">${esc(p.name)} · ${fmtDate(inp.jd, p.zone)} (${esc(p.zone)}, UTC${fmtOff(inp.offsetMin)}) · ${esc(p.place || '')} ${(+p.lat).toFixed(4)}, ${(+p.lon).toFixed(4)}</p>`;
    if (sub === 'natal') {
      const c = chartOf(p), asps = aspectsOf(c);
      h += `${timeNote(c)}<div class="wheelbox">${wheel(c, { uid: 'n', aspects: asps.filter(a => a.asp.major || S.settings.minor) })}</div>${meta}
        <div class="row" style="justify-content:center"><button class="btn" data-act="report" data-kind="natal">Natal raporu oluştur</button></div>
        <h2>Gezegen konumları</h2>${posTable(c, pointsFor(c))}
        <h2>Ev başlangıçları</h2>${cuspTable(c)}
        <h2>Açı tablosu</h2>${aspectGrid(c, asps)}
        <details><summary>Açı listesi (${asps.length})</summary>${aspList(asps)}</details>`;
      const b = balance(c);
      h += `<h2>Denge</h2><div class="grid2"><div>${A.ELEM.map((e, i) => `<label>${e} ${b.el[i].toFixed(1)}</label><div class="bar"><i style="width:${b.el[i] / 22 * 100}%"></i></div>`).join('')}</div><div>${A.MODE.map((e, i) => `<label>${e} ${b.md[i].toFixed(1)}</label><div class="bar"><i style="width:${b.md[i] / 22 * 100}%"></i></div>`).join('')}</div></div>
        <p class="small muted">Ağırlık: Güneş, Ay, Yükselen 3; Merkür, Venüs, Mars 2; Jüpiter, Satürn, MC 1; dış gezegenler 0,5.</p>
        <p>Harita şekli: <b>${shape(c)}</b> · ${c.isDay ? 'Gündüz haritası' : 'Gece haritası'} · Ay evresi: <b>${TX.PHASE[Math.floor(c.phaseAngle / 45)][0]}</b> (${dms(c.phaseAngle)})</p>
        ${patterns(c).map(o => `<span class="tag">${esc(o.t)}: ${o.ids.map(nm).join(', ')}${o.where ? ' — ' + esc(o.where) : ''}</span>`).join('')}`;
    } else if (sub === 'klasik') h += viewKlasik(p, meta);
    else if (sub === 'vedik') h += viewVedik(p, meta);
    else if (sub === 'drakonik') {
      const c = chartOf(p), d = B.draconic(c), pts = pointsFor(c).map(x => d.get(x.id)).filter(Boolean);
      const cont = []; for (const x of pts) for (const y of pointsFor(c)) { const o = Math.abs(A.wrap180(x.lon - y.lon)); if (o <= 1.5 && !['Vertex', 'SNode'].includes(x.id)) cont.push({ x, y, o }); }
      h += `<div class="wheelbox">${wheel({ ...c, houses: d.houses, get: d.get }, { uid: 'd', points: pts })}</div>${meta}<p class="small muted">Drakonik zodyakta 0° Koç, Kuzey Ay Düğümü’ne eşitlenir. Ruhsal amacı ve “öz” temaları gösterdiği kabul edilir.</p>
        <h2>Drakonik konumlar</h2>${posTable(c, pts)}<h2>Drakonik → natal kavuşumlar (1,5°)</h2>${cont.length ? `<div class="list">${cont.sort((a, b) => a.o - b.o).map(k => `<div>Drakonik ${G(k.x.id)} ${esc(nm(k.x.id))} ☌ natal ${G(k.y.id)} ${esc(nm(k.y.id))} <span class="muted small">${dms(k.o)}</span></div>`).join('')}</div>` : '<p class="muted">Yakın kavuşum yok.</p>'}`;
    } else if (sub === 'antisya') {
      const c = chartOf(p), an = B.antiscia(c, 1.5), pts = pointsFor(c).filter(x => !['SNode', 'Vertex'].includes(x.id));
      h += `<h2>Antisya ve kontra-antisya</h2><p class="small muted">Antisya, Yengeç–Oğlak (dönence) eksenine göre ayna noktadır; aynı gün uzunluğunu paylaşan dereceler gizli bir bağ kurar. Kontra-antisya, Koç–Terazi eksenine göre aynadır.</p>
      <div class="scroll"><table class="stack"><thead><tr><th>Nokta</th><th>Konum</th><th>Antisya</th><th>Kontra-antisya</th></tr></thead><tbody>${pts.map(x => `<tr><td>${G(x.id)} ${esc(nm(x.id))}</td><td>${fmtLon(x.lon)}</td><td>${fmtLon(A.norm(180 - x.lon))}</td><td>${fmtLon(A.norm(360 - x.lon))}</td></tr>`).join('')}</tbody></table></div>
      <h2>Temaslar (1,5°)</h2>${an.length ? `<div class="list">${an.map(k => `<div>${G(k.p)} ${esc(nm(k.p))} — ${G(k.q)} ${esc(nm(k.q))}: <b>${k.type}</b> <span class="muted small">${dms(k.orb)}</span><br><span class="small muted">${esc(nm(k.p))} ve ${esc(nm(k.q))} görünür bir açı yapmasa da ${k.type === 'Antisya' ? 'kavuşum benzeri gizli bir destekle' : 'karşıtlık benzeri gizli bir gerilimle'} birbirine bağlanır.</span></div>`).join('')}</div>` : '<p class="muted">Temas yok.</p>'}`;
    } else if (sub === 'yildiz') {
      const c = chartOf(p), sp = B.fixedStars(c.jd, STARS), con = B.starContacts(c, sp, 1);
      h += `<h2>Sabit yıldız kavuşumları</h2><p class="small muted">Orb 1° (1,5 kadirden parlak yıldızlar için 1,5°). Konumlar doğum tarihine göre presesyon ve öz hareketle hesaplandı.</p>${con.length ? `<div class="list">${con.map(k => `<div><b>${esc(k.star.n)}</b> ☌ ${G(k.p)} ${esc(nm(k.p))} <span class="muted small">orb ${dms(k.orb)} · ${fmtLon(k.star.lon)} · kadir ${k.star.mag}</span><br><span class="small">Doğası: ${esc((TX.STAR[k.star.n] || ['', ''])[0])}. ${esc((TX.STAR[k.star.n] || ['', ''])[1])}.</span></div>`).join('')}</div>` : '<p class="muted">1° içinde kavuşum yok.</p>'}
        <details><summary>Tüm yıldızların konumu</summary><div class="scroll"><table><thead><tr><th>Yıldız</th><th>Boylam</th><th class="n">Enlem</th><th class="n">Kadir</th></tr></thead><tbody>${sp.sort((a, b) => a.lon - b.lon).map(s => `<tr><td>${esc(s.n)}</td><td>${fmtLon(s.lon)}</td><td class="n">${s.lat.toFixed(1)}°</td><td class="n">${s.mag}</td></tr>`).join('')}</tbody></table></div></details>`;
    } else if (sub === 'analiz') h += viewAnaliz(p, meta);
    else if (sub === 'karto') h += viewKarto(p);
    else if (sub === 'rekt') h += viewRekt(p);
    return h;
  }

  function zrBlock(c) {
    if (c.unknownTime) return '<h2>Zodiakal salınım</h2><p class="muted">Doğum saati bilinmediği için Lot’lar hesaplanamaz.</p>';
    const now = nowJD(), fs = c.get('Fortune').sign;
    const blk = (lot, title) => { const z = Astro3.zr(c.get(lot).sign, fs, c.jd, 2), cur = z.find(x => now >= x.start && now < x.end), cs = cur && cur.subs.find(x => now >= x.start && now < x.end);
      return `<h3>${title} (${A.SIGNS[c.get(lot).sign]})</h3>${cur ? `<p>Şu an L1: <b>${A.SIGNS[cur.s]}</b> (${fmtShort(cur.start)} – ${fmtShort(cur.end)})${cur.peak ? ' · ' + cur.peak : ''}${cs ? ` · L2: <b>${A.SIGNS[cs.s]}</b> (${fmtShort(cs.start)} – ${fmtShort(cs.end)})${cs.peak ? ' · ' + cs.peak : ''}${cs.lb ? ' · bağın çözülmesi' : ''}` : ''}</p>` : ''}
      <details><summary>Tüm L1 dönemleri</summary><div class="list">${z.map(x => `<div><b>${A.SIGNS[x.s]}</b> ${fmtShort(x.start)} – ${fmtShort(x.end)} ${x.peak ? '<span class="tag">' + x.peak + '</span>' : ''}${x === cur ? '<br><span class="small muted">' + x.subs.map(y => A.SIGNS[y.s] + (y.lb ? ' (bağ çözülür)' : '') + ' ' + fmtShort(y.start)).join(' · ') + '</span>' : ''}</div>`).join('')}</div></details>`; };
    return `<h2>Zodiakal salınım (Valens)</h2><p class="small muted">Ruh Lotu’ndan salınım kariyer ve hayat yönünü, Şans Lotu’ndan salınım beden ve maddi koşulları gösterir. Şans Lotu’ndan 1., 4., 7. ve 10. burçlar doruk dönemleridir; 10. burç en güçlü dorukdur. 360 günlük yıl kullanılır.</p>${blk('Spirit', 'Ruh Lotu’ndan')}${blk('Fortune', 'Şans Lotu’ndan')}`;
  }
  function viewKlasik(p, meta) {
    const c = chartOf(p, { system: 'classic', hsys: S.settings.system === 'classic' ? S.settings.hsys : 'W' }), asps = aspectsOf(c);
    const seven = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    const alm = B.almuten(c), age = (nowJD() - c.jd) / 365.2425, prof = B.profection(c, age), fird = B.firdaria(c), now = nowJD();
    const cf = fird.find(f => now >= f.start && now < f.end), csub = cf && cf.subs.find(s => now >= s.start && now < s.end);
    const sectLight = c.isDay ? 'Sun' : 'Moon', benef = c.isDay ? 'Jupiter' : 'Venus', malef = c.isDay ? 'Saturn' : 'Mars';
    const dig = id => { const l = c.get(id).lon, s = A.signOf(l); return `<tr><td>${G(id)} ${nm(id)}</td><td>${fmtLon(l)}</td><td>${nm(A.RULER[s])}</td><td>${Object.entries(A.EXALT).filter(([, e]) => e === s).map(([k]) => nm(k)).join('') || '—'}</td><td>${nm(A.TRIP[s % 4][0])}/${nm(A.TRIP[s % 4][1])}</td><td>${nm(A.termRuler(l))}</td><td>${nm(A.faceRuler(l))}</td><td class="n">${c.get(id).dig ? c.get(id).dig.score : ''}</td><td class="small">${c.get(id).dig ? c.get(id).dig.list.join(', ') : ''}</td></tr>`; };
    return `<div class="wheelbox">${wheel(c, { uid: 'k', aspects: asps })}</div>${meta}
      <div class="row" style="justify-content:center"><button class="btn" data-act="report" data-kind="classic">Klasik raporu oluştur</button></div>
      <h2>Sekt</h2><p>${c.isDay ? 'Gündüz' : 'Gece'} haritası. Sekt ışığı: <b>${nm(sectLight)}</b>. Sektin hayırlısı <b>${nm(benef)}</b> en yapıcı biçimde çalışır; sekt dışı kötücül <b>${nm(malef)}</b> en zorlayıcı gezegendir.</p>
      <h2>Esansiyel değerler (Doroteus üçlükleri, Mısır sınırları, Keldani yüzleri)</h2><div class="scroll"><table class="stack"><thead><tr><th>Gezegen</th><th>Konum</th><th>Ev sahibi</th><th>Yücelim</th><th>Üçlük G/Gc</th><th>Sınır</th><th>Yüz</th><th class="n">Puan</th><th>Durum</th></tr></thead><tbody>${seven.map(dig).join('')}</tbody></table></div>
      <p>Haritanın Almuteni (Yükselen, MC, Güneş, Ay, Şans Lotu ve doğum öncesi yeni ay/dolunay üzerinden): <b>${nm(alm.winner)}</b> <span class="muted small">(${alm.scores.slice(0, 3).map(([k, v]) => nm(k) + ' ' + v).join(', ')})</span></p>
      <h2>Lot’lar</h2><p>Şans Lotu: ${fmtLon(c.get('Fortune').lon)} (${c.get('Fortune').house}. ev) · Ruh Lotu: ${fmtLon(c.get('Spirit').lon)} (${c.get('Spirit').house}. ev)</p>
      <h2>Yıllık profeksiyon</h2><p>${age < 0 ? 'Doğum tarihi henüz gelmedi; ilk yıl gösteriliyor' : prof.age + ' yaşındasınız'}: profeksiyon <b>${prof.house}. eve</b> (${A.SIGNS[prof.sign]}) ulaştı; yılın yöneticisi <b>${nm(prof.lord)}</b>. ${TX.PROFECT[prof.house]}</p>
      <h2>Firdaria</h2>${cf ? `<p>Şu anki dönem: <b>${nm(cf.p)}</b>${csub ? ' / alt dönem <b>' + nm(csub.p) + '</b>' : ''} (${fmtShort(cf.start)} – ${fmtShort(cf.end)})</p>` : ''}<details><summary>Tüm firdaria dönemleri</summary><div class="list">${fird.map(f => `<div><b>${nm(f.p)}</b> ${fmtShort(f.start)} – ${fmtShort(f.end)}${f.subs.length ? `<br><span class="small muted">${f.subs.map(s => nm(s.p) + ' ' + fmtShort(s.start)).join(' · ')}</span>` : ''}</div>`).join('')}</div></details>
      ${zrBlock(c)}
      <h2>Ptolemaik açılar (Lilly’nin moiety orbları)</h2>${aspList(asps)}`;
  }

  function viewAnaliz(p, meta) {
    const c = chartOf(p), n = S.harm || 5, hc = Astro3.harmonic(c, n); hc.calc = c.calc;
    const hpts = CORE.map(id => hc.get(id)).filter(Boolean), hasp = A.findAspects(hpts, hpts, { fixedOrb: 2 }).filter(a => a.asp.k === 'con' && a.p.id !== a.q.id);
    const mp = Astro3.midpoints(c, 1.5), pd = c.unknownTime ? [] : Astro3.primaryToAngles(c, 90);
    const HN = { 4: 'çaba ve başarı', 5: 'yaratıcı güç ve üslup', 7: 'ilham ve sezgisel çekim', 9: 'ruhsal olgunluk ve evlilik', 12: 'fedakârlık ve tamamlanma' };
    return `<h2>Harmonik harita</h2><div class="row">${[2, 3, 4, 5, 7, 8, 9, 12].map(k => `<button class="chip ${k === n ? 'on' : ''}" data-harm="${k}">H${k}</button>`).join('')}</div>
      <div class="wheelbox">${wheel(hc, { uid: 'hm', points: pointsFor(hc).filter(x => !['Vertex', 'Fortune', 'SNode'].includes(x.id)), aspects: [] })}</div>
      <p class="small muted">${n}. harmonik: tüm boylamlar ${n} ile çarpılır; natal haritada ${Math.round(360 / n)}° ve katları olan açılar burada kavuşum olarak görünür.${HN[n] ? ' Bu harmonik geleneksel olarak ' + HN[n] + ' temasıyla ilişkilendirilir.' : ''}</p>
      <h3>H${n} kavuşumları (2°)</h3>${hasp.length ? `<div class="list">${hasp.map(a => `<div>${G(a.p.id)} ☌ ${G(a.q.id)} <b>${esc(nm(a.p.id))} – ${esc(nm(a.q.id))}</b> <span class="small muted">orb ${dms(a.orb)}</span></div>`).join('')}</div>` : '<p class="muted">Yok.</p>'}
      <h2>Midpoint ağacı (90° kadranı, 1,5°)</h2><p class="small muted">Her nokta, kendisiyle kavuşum, kare, karşıt ya da yarım kare yapan orta noktalarla birlikte listelenir (Ebertin yöntemi).</p>
      <div class="list">${mp.tree.map(t => `<div><b>${G(t.id)} ${esc(nm(t.id))}</b> ${fmtLon(t.lon)}<br><span class="small">${t.hits.length ? t.hits.map(m => `= ${esc(nm(m.a))}/${esc(nm(m.b))} <span class="muted">(${dms(m.orb)})</span>`).join(' · ') : '<span class="muted">—</span>'}</span></div>`).join('')}</div>
      <h2>Primer direksiyonlar (açılara)</h2>${c.unknownTime ? '<p class="muted">Doğum saati bilinmediği için hesaplanamaz.</p>' : `<p class="small muted">Promissörler zodyakta (enlemsiz), anahtar Naibod (0°59′08″ = 1 yıl). Yalnızca MC ve Yükselen’e yapılan direksiyonlar gösterilir; doğum saatinin birkaç dakikalık hatası tarihleri aylarca kaydırır.</p>
      <div class="list">${pd.slice(0, 60).map(x => `<div><b>${x.age.toFixed(1)} yaş</b> · ${fmtShort(c.jd + x.age * 365.2422)}<br><span class="small">${G(x.pr)} ${esc(nm(x.pr))} ${esc(x.asp)} → ${x.to === 'MC' ? 'MC' : 'Yükselen'} <span class="muted">(ark ${dms(x.arc)})</span></span></div>`).join('')}</div>`}`;
  }
  function southGrid(rows, title, useNav) {
    const POS = { 11: [0, 0], 0: [0, 1], 1: [0, 2], 2: [0, 3], 3: [1, 3], 4: [2, 3], 5: [3, 3], 6: [3, 2], 7: [3, 1], 8: [3, 0], 9: [2, 0], 10: [1, 0] };
    const asc = rows.find(r => r.id === 'Asc'), ascS = useNav ? asc.navamsa : asc.sign;
    let h = `<div class="sgrid">`;
    for (let s = 0; s < 12; s++) {
      const [r, cc] = POS[s], inS = rows.filter(x => x.id !== 'Asc' && (useNav ? x.navamsa : x.sign) === s);
      h += `<div class="${s === ascS ? 'asc' : ''}" style="grid-row:${r + 1};grid-column:${cc + 1}">${s === ascS ? '<b style="font-size:10.5px">Lagna</b><br>' : ''}${inS.map(x => `${esc(TX.PLANETTR[x.id] || nm(x.id))}${useNav ? '' : ' ' + Math.floor(x.deg) + '°'}${x.retro ? 'ʀ' : ''}`).join('<br>')}<span class="sn">${A.SIGNS[s]}</span></div>`;
    }
    return h + `<div class="mid">${title}</div></div>`;
  }
  function viewVedik(p, meta) {
    const v = B.vedic(inputOf(p), calcSettings()), now = nowJD();
    const cur = v.dasha.find(d => now >= d.start && now < d.end), cs = cur && cur.subs.find(s => now >= s.start && now < s.end);
    const moon = v.rows.find(r => r.id === 'Moon'), lag = v.rows.find(r => r.id === 'Asc');
    return `${southGrid(v.rows, 'Rasi (D1)')}${meta}<p class="small muted" style="text-align:center">Güney Hint düzeni · Lahiri ayanamsa ${dms(v.ayanamsa, true)} · tam burç evleri · ortalama Rahu/Ketu</p>
      <div class="row" style="justify-content:center"><button class="btn" data-act="report" data-kind="vedic">Vedik raporu oluştur</button></div>
      <div class="scroll"><table class="stack"><thead><tr><th>Graha</th><th>Konum</th><th>Bhava</th><th>Nakşatra / pada</th><th>Yönetici</th><th>Navamsa</th><th>Durum</th></tr></thead><tbody>${v.rows.map(r => `<tr><td>${esc(r.id === 'Asc' ? 'Lagna' : TX.PLANETTR[r.id] || r.id)}${r.retro ? ' ʀ' : ''}</td><td>${dms(r.deg)} ${A.SIGNS[r.sign]}</td><td>${r.house}</td><td>${esc(r.nak.name)} ${r.nak.pada}</td><td>${esc(TX.PLANETTR[r.nak.lord] || r.nak.lord)}</td><td>${A.SIGNS[r.navamsa]}</td><td class="small">${esc(r.dig)}</td></tr>`).join('')}</tbody></table></div>
      ${southGrid(v.rows, 'Navamsa (D9)', true)}
      <h2>Bölünmüş haritalar (varga)</h2><select data-varga="1">${Object.entries(Astro3.VARGA_NAMES).map(([k, t]) => `<option value="${k}" ${+k === (S.varga || 10) ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
      ${southGrid(v.rows.map(r => ({ ...r, sign: Astro3.varga(r.lon, S.varga || 10), deg: 0 })), Astro3.VARGA_NAMES[S.varga || 10].split(' ')[0])}
      <h2>Yogalar</h2>${(() => { const y = Astro3.yogas(v); return y.length ? `<div class="list">${y.map(x => `<div><b>${esc(x.n)}</b><br><span class="small">${esc(x.d)}</span></div>`).join('')}</div>` : '<p class="muted">Tanımlı yogalardan biri bulunmadı.</p>'; })()}
      <p class="small muted">Ashtakavarga ve Shadbala hesapları henüz eklenmedi.</p>
      <h2>Ay nakşatrası</h2><p><b>${esc(moon.nak.name)}</b> (${moon.nak.pada}. pada): ${esc(TX.NAKTXT[moon.nak.i])}. Lagna nakşatrası: <b>${esc(lag.nak.name)}</b> — ${esc(TX.NAKTXT[lag.nak.i])}.</p>
      <h2>Vimşottari daşa</h2>${cur ? `<p>Şu an: <b>${esc(TX.PLANETTR[cur.p])}</b> mahadaşa${cs ? ' / <b>' + esc(TX.PLANETTR[cs.p]) + '</b> antardaşa' : ''}. ${esc(TX.DASHATXT[cur.p])}</p>` : ''}
      <div class="list">${v.dasha.map(d => `<div><b>${esc(TX.PLANETTR[d.p])}</b> ${fmtShort(d.start)} – ${fmtShort(d.end)}${d === cur ? ' <span class="tag">şu an</span>' : ''}${d === cur ? `<br><span class="small muted">${d.subs.map(s => esc(TX.PLANETTR[s.p]) + ' ' + fmtShort(s.start)).join(' · ')}</span>` : ''}</div>`).join('')}</div>`;
  }

  function viewKarto(p) {
    const c = chartOf(p, { zodiac: 'T' }), sel = S.kartoSel || ['Sun', 'Moon', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    const lines = B.astroLines(c, sel), g = A.gast(c.jd);
    const COL = { Sun: '#ffd27a', Moon: '#e8edf6', Mercury: '#b9e0ff', Venus: '#8fe3b8', Mars: '#ff8c8c', Jupiter: '#c7a8ff', Saturn: '#a9b3c8', Uranus: '#7fe0e0', Neptune: '#8fb8ff', Pluto: '#d48fd4' };
    const X = lo => lo + 180, Y = la => 90 - la;
    let svg = `<svg viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="180" fill="#0a1430"/>`;
    for (let lo = -180; lo <= 180; lo += 30) svg += `<line x1="${X(lo)}" y1="0" x2="${X(lo)}" y2="180" stroke="rgba(255,255,255,.07)" stroke-width=".3"/>`;
    for (let la = -60; la <= 60; la += 30) svg += `<line x1="0" y1="${Y(la)}" x2="360" y2="${Y(la)}" stroke="rgba(255,255,255,.07)" stroke-width=".3"/>`;
    svg += `<path d="${LAND_PATH}" fill="#26386f" stroke="#5a6ea8" stroke-width=".3"/>`;
    for (const l of lines) {
      const col = COL[l.id];
      svg += `<line x1="${X(l.mc)}" y1="0" x2="${X(l.mc)}" y2="180" stroke="${col}" stroke-width=".7"/><line x1="${X(l.ic)}" y1="0" x2="${X(l.ic)}" y2="180" stroke="${col}" stroke-width=".7" stroke-dasharray="2 1.5"/>`;
      const poly = (arr, dash) => { let d = '', prev = null; for (const [lo, la] of arr) { const jump = prev && Math.abs(lo - prev) > 90; d += `${!prev || jump ? 'M' : 'L'}${X(lo).toFixed(1)} ${Y(la).toFixed(1)}`; prev = lo; } return `<path d="${d}" fill="none" stroke="${col}" stroke-width=".7" ${dash ? 'stroke-dasharray="1 1"' : ''}/>`; };
      svg += poly(l.asc, false) + poly(l.dsc, true);
      svg += `<text x="${X(l.mc) + 1}" y="8" font-size="5" fill="${col}" class="sym">${gl(l.id)}</text>`;
    }
    svg += `<circle cx="${X(+p.lon)}" cy="${Y(+p.lat)}" r="1.8" fill="#fff" stroke="#0b1226" stroke-width=".5"/></svg>`;
    const near = B.nearLinesExact(lines, CITIES, g, 300).slice(0, 40);
    return `<h2>Astro-kartografi</h2><p class="small muted">Düz çizgi: MC (gezegen tepe noktasında) · kesik: IC · eğri düz: Yükselen (ASC) · eğri noktalı: Alçalan (DSC). Beyaz nokta doğum yeri.</p>
      <div class="row">${CORE.map(id => `<button class="chip ${sel.includes(id) ? 'on' : ''}" data-karto="${id}">${G(id)} ${esc(nm(id))}</button>`).join('')}</div>
      <div class="mapbox card" style="padding:6px">${svg}</div>
      <h3>Çizgilere 300 km yakın şehirler</h3><div class="scroll"><table class="stack"><thead><tr><th>Şehir</th><th>Çizgi</th><th class="n">Uzaklık</th><th>Anlamı</th></tr></thead><tbody>${near.map(n => `<tr><td>${esc(n.city)}, ${esc(n.country)}</td><td>${G(n.line)} ${esc(nm(n.line))} ${n.type}</td><td class="n">${n.km} km</td><td class="small">${esc(nm(n.line))} teması burada ${{ MC: 'kariyer ve görünürlükte', IC: 'ev, aile ve iç dünyada', ASC: 'kişilik ve bedende', DSC: 'ilişki ve ortaklıklarda' }[n.type]} öne çıkar: ${esc(P(n.line).k)}.</td></tr>`).join('')}</tbody></table></div>`;
  }

  function viewRekt(p) {
    const ev = p.events || [];
    const res = S.rektRes && S.rektRes.pid === p.id ? S.rektRes.list : null;
    return `<h2>Rektifikasyon yardımcısı</h2><p class="small muted">Doğum saatinden emin değilseniz önemli hayat olaylarını girin. Araç, seçtiğiniz saat aralığındaki her olası doğum anı için olay tarihlerindeki solar ark direksiyonlarının ve dış gezegen transitlerinin haritanın açılarına (ASC, MC, DSC, IC) isabetini puanlar. Sonuç, astroloğun kontrol etmesi gereken aday saatlerdir; kesin karar için birden çok olay girin.</p>
      <div class="card"><h3>Olaylar</h3>${ev.length ? `<div class="list">${ev.map((e, i) => `<div>${esc(e.date)} · ${esc({ iliski: 'Evlilik / ilişki', kariyer: 'Kariyer / statü', ev: 'Taşınma / aile', saglik: 'Sağlık / kaza', genel: 'Diğer' }[e.kind])} · ${esc(e.label)} <button class="chip" data-delev="${i}">Sil</button></div>`).join('')}</div>` : '<p class="muted">Henüz olay yok.</p>'}
      <div class="grid3"><div><label for="ev_d">Tarih</label><input type="date" id="ev_d"></div><div><label for="ev_k">Tür</label><select id="ev_k"><option value="iliski">Evlilik / ilişki</option><option value="kariyer">Kariyer / statü</option><option value="ev">Taşınma / aile</option><option value="saglik">Sağlık / kaza</option><option value="genel">Diğer</option></select></div><div><label for="ev_l">Açıklama</label><input id="ev_l" placeholder="örn. düğün"></div></div>
      <button class="btn ghost" data-act="addevent" style="margin-top:10px">Olay ekle</button></div>
      <div class="card"><div class="grid2"><div><label for="rk_a">Aralık başlangıcı</label><input type="time" id="rk_a" value="00:00"></div><div><label for="rk_b">Aralık sonu</label><input type="time" id="rk_b" value="23:59"></div></div><button class="btn" data-act="rectify" style="margin-top:10px">Aday saatleri hesapla</button></div>
      ${res ? `<h3>En yüksek puanlı aday saatler</h3><div class="list">${res.slice(0, 8).map(r => `<div><b>${pad(Math.floor(r.min / 60))}:${pad(r.min % 60)}</b> · puan ${r.score.toFixed(2)} · ASC ${fmtLon(r.asc)} · MC ${fmtLon(r.mc)} <button class="chip" data-settime="${r.min}">Bu saati uygula</button><br><span class="small muted">${r.hits.slice(0, 5).map(x => `${esc(x.ev)}: ${x.k === 'SA' ? 'solar ark' : 'transit'} ${esc(nm(x.p))} ${x.asp === 0 ? '☌' : x.asp === 90 ? '□' : '☍'} ${x.a} (${dms(x.orb)})`).join(' · ')}</span></div>`).join('')}</div>` : ''}`;
  }

  /* ---------- REZONANS ---------- */
  function viewRezonans() {
    let h = header();
    if (S.people.length < 2) return h + `<div class="card empty"><p>Rezonans için en az iki kişi gerekli.</p><button class="btn" data-act="newperson">Kişi ekle</button></div>`;
    const a = activeP(); if (!S.partner || S.partner === a.id || !person(S.partner)) S.partner = S.people.find(x => x.id !== a.id).id;
    const b = person(S.partner);
    h += `<div class="grid2" style="margin-top:12px"><div>${personPicker('active', '1. kişi')}</div><div>${personPicker('partner', '2. kişi')}</div></div>` + subnav('rez', [['sinastri', 'Sinastri'], ['kompozit', 'Kompozit'], ['davison', 'Davison']]);
    const ca = chartOf(a), cb = chartOf(b), sub = curSub('rez', 'sinastri');
    if (sub === 'sinastri') {
      const ia = aspectsOf(ca, cb, { staticB: false }).filter(x => !['Vertex'].includes(x.p.id));
      h += `<div class="wheelbox">${wheel(ca, { uid: 's', outer: pointsFor(cb).filter(x => !['Asc', 'MC', 'Vertex'].includes(x.id)), aspects: ia.filter(x => x.asp.major) })}</div><p class="small muted" style="text-align:center">İç çark: ${esc(a.name)} · dış halka (mavi): ${esc(b.name)}</p>
        <div class="row" style="justify-content:center"><button class="btn" data-act="report" data-kind="syn">Uyum raporu oluştur</button></div>
        <h2>Karşılıklı açılar</h2><div class="list">${ia.map(x => `<div><span class="${aspClass(x.asp.k)}">${G(x.p.id)} ${ASPG[x.asp.k]} ${G(x.q.id)}</span> <span class="small">${esc(synText(x, a.name, b.name))}</span></div>`).join('')}</div>
        <h2>Ev yerleşimleri</h2><div class="grid2"><div><h3>${esc(b.name)} gezegenleri, ${esc(a.name)} evlerinde</h3>${B.overlays(cb, ca).map(o => `<div class="small">${G(o.id)} ${esc(nm(o.id))} → ${o.house}. ev</div>`).join('')}</div><div><h3>${esc(a.name)} gezegenleri, ${esc(b.name)} evlerinde</h3>${B.overlays(ca, cb).map(o => `<div class="small">${G(o.id)} ${esc(nm(o.id))} → ${o.house}. ev</div>`).join('')}</div></div>`;
    } else if (sub === 'kompozit') {
      const k = B.composite(ca, cb, calcSettings()); k.calc = calcSettings();
      const pts = pointsFor(k), asps = aspectsOf(k);
      h += `<div class="wheelbox">${wheel(k, { uid: 'c', points: pts, aspects: asps.filter(x => x.asp.major) })}</div><p class="small muted" style="text-align:center">Orta nokta (midpoint) kompozit; evler kompozit MC’den, ortalama enlemle türetildi.</p>${posTable(k, pts)}<h2>Kompozit açılar</h2>${aspList(asps)}`;
    } else {
      const d = B.davison(inputOf(a), inputOf(b), calcSettings()); d.calc = calcSettings();
      h += `<div class="wheelbox">${wheel(d, { uid: 'dv', aspects: aspectsOf(d).filter(x => x.asp.major) })}</div><p class="small muted" style="text-align:center">Davison: iki doğumun zaman ve mekân orta noktası için gerçek bir harita — ${fmtDate(d.jd, 'UTC')} UTC · ${d.input.lat.toFixed(2)}, ${d.input.lon.toFixed(2)}</p>${posTable(d, pointsFor(d))}<h2>Açılar</h2>${aspList(aspectsOf(d))}`;
    }
    return h;
  }

  /* ---------- DÖNGÜLER ---------- */
  function dateInput(id, jd, zone, withTime) {
    const d = new Date(A.utcFromJD(jd)), f = new Intl.DateTimeFormat('en-CA', { timeZone: zone || DEVICE_TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d), g = Object.fromEntries(f.map(x => [x.type, x.value]));
    return `<input type="${withTime ? 'datetime-local' : 'date'}" id="${id}" value="${g.year}-${g.month}-${g.day}${withTime ? 'T' + g.hour + ':' + g.minute : ''}">`;
  }
  const targetJD = () => S.cycJD || nowJD();
  function viewDonguler() {
    let h = header();
    const items = [['transit', 'Transit'], ['progres', 'Progresyon'], ['solark', 'Solar ark'], ['donus', 'Dönüşler'], ['aytakvim', 'Ay takvimi'], ['saatler', 'Gezegen saatleri']];
    const sub = curSub('donguler', 'transit'); h += subnav('donguler', items);
    const p = activeP();
    if (!p && !['aytakvim', 'saatler'].includes(sub)) return h + needPerson();
    if (p && !['aytakvim', 'saatler'].includes(sub)) h += personPicker('active') + `<label for="cyc_d">Tarih ve saat (${esc(DEVICE_TZ)})</label>${dateInput('cyc_d', targetJD(), DEVICE_TZ, true)}`;
    const jd = targetJD();
    if (sub === 'transit') {
      const nat = chartOf(p), tr = B.transitChart(nat, jd, calcSettings()); tr.calc = calcSettings();
      const tp = pointsFor(tr).filter(x => !['Asc', 'MC', 'Vertex', 'Fortune'].includes(x.id)), asps = aspectsOf({ ...tr, get: id => tp.find(x => x.id === id) || null }, nat, { fixedOrb: 1.5, staticB: true }).filter(a => tp.includes(a.p));
      const hits = B.transitHits(nat, jd, 365, ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'], calcSettings());
      h += `<div class="wheelbox">${wheel(nat, { uid: 't', outer: tp, aspects: asps.filter(a => a.asp.major) })}</div><p class="small muted" style="text-align:center">İç çark natal · dış halka transit (${fmtDate(jd)})</p>
        <div class="row" style="justify-content:center"><button class="btn" data-act="report" data-kind="transit">12 aylık transit raporu</button></div>
        <h2>Yavaş gezegenler hangi evinizden geçiyor?</h2><div class="list">${['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].map(id => { const x = tr.get(id); return `<div>${G(id)} <b>${esc(nm(id))}</b> natal ${x.nhouse}. evinizde (${fmtLon(x.lon)})${x.retro ? ' · retro' : ''}<br><span class="small muted">${esc(nm(id))} ${esc(TX.TRANSIT[id])}; bu dönemde etkisi ${esc(TX.H[x.nhouse].t)} alanında yaşanır.</span></div>`; }).join('')}</div>
        <h2>Şu anki transitler (1,5°)</h2>${asps.length ? `<div class="list">${asps.map(a => `<div><span class="${aspClass(a.asp.k)}">${G(a.p.id)} ${ASPG[a.asp.k]} ${G(a.q.id)}</span> <b>Transit ${esc(nm(a.p.id))} ${esc(a.asp.n.toLowerCase())} natal ${esc(nm(a.q.id))}</b> <span class="small muted">${dms(a.orb)} ${a.applying ? 'yaklaşan' : 'ayrılan'}</span><br><span class="small">${esc(transitText(a.p.id, a.q.id, a.asp.k, nat))}</span></div>`).join('')}</div>` : '<p class="muted">Yok.</p>'}
        <h2>Önümüzdeki 12 ay: dış gezegen transitleri (tam isabet tarihleri)</h2>${timeline(hits, nat)}
        <h2>Transit konumları</h2>${posTable(tr, tp.map(x => ({ ...x, house: x.nhouse })))}`;
    } else if (sub === 'progres') {
      const nat = chartOf(p), pc = B.progressedChart(nat, jd, calcSettings()); pc.calc = calcSettings();
      const pp = pointsFor(pc).filter(x => !['Vertex', 'Fortune'].includes(x.id)), asps = aspectsOf({ ...pc, get: id => pp.find(x => x.id === id) }, nat, { fixedOrb: 1, staticB: true }).filter(a => pp.includes(a.p));
      const tl = B.progMoonTimeline(nat, jd - 365, 6, calcSettings());
      const pm = pc.get('Moon'), ps = pc.get('Sun'), lun = A.norm(pm.lon - ps.lon);
      h += `<div class="wheelbox">${wheel(nat, { uid: 'p', outer: pp.filter(x => !['Asc', 'MC'].includes(x.id)), aspects: asps.filter(a => a.asp.major) })}</div><p class="small muted" style="text-align:center">İkincil progresyon (1 gün = 1 yıl) · açılar solar ark MC ile · progres tarih ${fmtDate(pc.pjd, 'UTC')} UTC</p>
        <p>Progres Güneş ${fmtLon(ps.lon)} (${ps.house}. ev) · Progres Ay ${fmtLon(pm.lon)} (${pm.house}. ev) · Progres ASC ${fmtLon(pc.get('Asc').lon)} · MC ${fmtLon(pc.get('MC').lon)} · Progres lunasyon evresi: <b>${TX.PHASE[Math.floor(lun / 45)][0]}</b></p>
        <p>${esc(progMoonText(pm))}</p>
        <h2>Progres → natal açılar (1°)</h2>${asps.length ? `<div class="list">${asps.map(a => { const a3 = TX.ASP3[a.p.id + '-' + a.q.id] || TX.ASP3[a.q.id + '-' + a.p.id], k = a.asp.k, soft = k === 'tri' || k === 'sex'; return `<div><span class="${aspClass(k)}">${G(a.p.id)} ${ASPG[k]} ${G(a.q.id)}</span> <b>Progres ${esc(nm(a.p.id))} ${esc(a.asp.n.toLowerCase())} natal ${esc(nm(a.q.id))}</b> <span class="small muted">${dms(a.orb)} ${a.applying ? 'yaklaşan' : 'ayrılan'}</span><br><span class="small">Bu progresyon yaklaşık 1–2 yıl boyunca etkindir ve natal haritadaki ${esc(P(a.p.id).k.split(',')[0])} ile ${esc(P(a.q.id).k.split(',')[0])} temasını olgunlaştırır. ${esc(a3 ? (k === 'con' ? a3[0] : soft ? a3[1] : a3[2]) : '')}</span></div>`; }).join('')}</div>` : '<p class="muted">Yok.</p>'}
        <h2>Progres Ay takvimi</h2><div class="list">${tl.map(t => `<div>${fmtShort(t.jd)} · Progres Ay ${t.type === 'sign' ? A.SIGNS[t.v] + ' burcuna' : t.v + '. eve'} geçiyor</div>`).join('') || '<div class="muted">Bu aralıkta geçiş yok.</div>'}</div>
        <h2>Progres konumlar</h2>${posTable(pc, pp)}`;
    } else if (sub === 'solark') {
      const nat = chartOf(p), sa = B.solarArcChart(nat, jd, calcSettings());
      const hits = B.solarArcHits(nat, jd - 365, jd + 5 * 365, calcSettings());
      const pts = pointsFor(nat).filter(x => !['Vertex', 'Fortune', 'SNode'].includes(x.id)).map(x => sa.get(x.id));
      h += `<div class="wheelbox">${wheel(nat, { uid: 'sa', outer: pts.filter(x => !['Asc', 'MC'].includes(x.id)) })}</div><p>Solar ark: <b>${dms(sa.arc, true)}</b></p>
        <h2>Direksiyon isabetleri (geçen yıl – 5 yıl sonrası)</h2><div class="list">${hits.map(x => `<div>${fmtShort(x.jd)} · SA ${G(x.dir)} ${esc(nm(x.dir))} ${ASPG[{ 0: 'con', 60: 'sex', 90: 'squ', 120: 'tri', 180: 'opp' }[x.asp]]} natal ${G(x.nat)} ${esc(nm(x.nat))}<br><span class="small muted">${esc(saText(x))}</span></div>`).join('') || '<div class="muted">Yok.</div>'}</div>
        <h2>Yönlendirilmiş konumlar</h2>${posTable(nat, pts)}`;
    } else if (sub === 'donus') h += viewDonus(p, jd);
    else if (sub === 'aytakvim') h += viewAyTakvim();
    else if (sub === 'saatler') h += viewSaatler();
    return h;
  }
  function transitText(tr, nat, k, natal) {
    const n = natal.get(nat), base = (TX.TRN[tr] && TX.TRN[tr][nat]) || `${nm(tr)} ${TX.TRANSIT[tr] || ''}; natal ${nm(nat)} (${P(nat).k}) bu etkiyi taşır.`;
    const hh = n && n.house && !['Asc', 'MC'].includes(nat) ? ` Natal ${nm(nat)} ${n.house}. evde olduğundan özellikle ${TX.H[n.house].t} konuları etkilenir.` : '';
    return `${base} ${TX.TRASP[k] || ''}${hh}`;
  }
  function timeline(hits, nat) {
    const groups = new Map();
    for (const x of hits) { const k = x.tr + x.asp + x.nat; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(x); }
    return `<div class="list">${[...groups.values()].sort((a, b) => a[0].jd - b[0].jd).map(g => { const x = g[0]; const ak = { 0: 'con', 60: 'sex', 90: 'squ', 120: 'tri', 180: 'opp' }[x.asp]; return `<div><span class="${aspClass(ak)}">${G(x.tr)} ${ASPG[ak]} ${G(x.nat)}</span> <b>${esc(nm(x.tr))} ${esc(A.ASPECTS.find(a => a.k === ak).n.toLowerCase())} natal ${esc(nm(x.nat))}</b><br><span class="small">${g.map(y => fmtShort(y.jd) + (y.retro ? ' (retro)' : '')).join(' · ')}</span><br><span class="small muted">${esc(transitText(x.tr, x.nat, ak, nat))}</span></div>`; }).join('') || '<div class="muted">12 ay içinde majör isabet yok.</div>'}</div>`;
  }
  function progMoonText(pm) { return `Progres Ay ${A.SIGNS[pm.sign]} burcunda ve ${pm.house}. evde: yaklaşık 2,5 yıllık bu dönemde duygusal odağınız ${TX.H[pm.house].t} alanına kayar; ihtiyaçlarınız ${TX.S[pm.sign].st} ifade bulur.`; }
  function saText(x) { return `Solar ark ${nm(x.dir)}, natal ${nm(x.nat)} ile buluşur: ${P(x.dir).k} ile ${P(x.nat).k} temaları yaklaşık bir yıl boyunca birlikte etkinleşir.`; }

  function viewDonus(p, jd) {
    const nat = chartOf(p), here = S.settings.here, loc = S.retLoc === 'here' ? here : { lat: +p.lat, lon: +p.lon, name: p.place };
    const sr = B.nextReturn('Sun', nat.get('Sun').lon, jd - 366, calcSettings().zodiac === 'S' ? { sidereal: true } : null).filter(j => j > jd - 366)[0];
    const lr = B.nextReturn('Moon', nat.get('Moon').lon, jd - 28, calcSettings().zodiac === 'S' ? { sidereal: true } : null).filter(j => j <= jd + 28);
    const lrj = lr.filter(j => j <= jd).pop() || lr[0];
    const src = A.chart({ jd: sr, lat: loc.lat, lon: loc.lon }, calcSettings()); src.calc = calcSettings();
    const lrc = A.chart({ jd: lrj, lat: loc.lat, lon: loc.lon }, calcSettings()); lrc.calc = calcSettings();
    const which = S.retWhich || 'sr', c = which === 'sr' ? src : lrc;
    const pr = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Chiron'].map(b => ({ b, list: B.nextReturn(b, nat.get(b) ? nat.get(b).lon : 0, jd, calcSettings().zodiac === 'S' ? { sidereal: true } : null).slice(0, 3) })).filter(x => nat.get(x.b));
    return `<div class="row" style="margin-top:10px"><button class="chip ${which === 'sr' ? 'on' : ''}" data-ret="sr">Solar return</button><button class="chip ${which === 'lr' ? 'on' : ''}" data-ret="lr">Lunar return</button><button class="chip ${S.retLoc === 'here' ? '' : 'on'}" data-retloc="birth">Doğum yeri</button><button class="chip ${S.retLoc === 'here' ? 'on' : ''}" data-retloc="here">Bulunduğum yer (${esc(here.name)})</button></div>
      <div class="wheelbox">${wheel(c, { uid: 'r', aspects: aspectsOf(c).filter(a => a.asp.major) })}</div>
      <p class="small muted" style="text-align:center">${which === 'sr' ? 'Solar return' : 'Lunar return'}: ${fmtDate(c.jd)} · ${esc(loc.name || '')}</p>
      ${which === 'sr' ? `<div class="row" style="justify-content:center"><button class="btn" data-act="report" data-kind="sr">Solar return raporu</button></div><p>${esc(srText(src, nat))}</p>` : `<p>Lunar return Yükseleni ${A.SIGNS[lrc.get('Asc').sign]}; Ay ${lrc.get('Moon').house}. evde: bu ay duygusal odak ${TX.H[lrc.get('Moon').house].t} alanında.</p>`}
      ${posTable(c, pointsFor(c))}
      <h2>Gezegen dönüşleri</h2><div class="list">${pr.map(x => `<div><b>${G(x.b)} ${esc(nm(x.b))} dönüşü</b>: ${x.list.length ? x.list.map(j => fmtShort(j)).join(' · ') : 'bu aralıkta yok'}</div>`).join('')}</div>`;
  }
  function srText(src, nat) {
    const sh = src.get('Sun').house, as = src.get('Asc').sign, mh = src.get('Moon').house;
    return `Bu yılın solar return Güneşi ${sh}. evde: ${TX.SRHOUSE[sh]} Yılın yükseleni ${A.SIGNS[as]}: yıla ${TX.S[as].st} yaklaşırsınız. Ay ${mh}. evde; duygusal ihtiyaçlar ${TX.H[mh].t} alanında yoğunlaşır. Natal Yükselen solar return haritasında ${A.houseOf(nat.houses.asc, src.houses.cusps)}. eve düşüyor.`;
  }
  function viewAyTakvim() {
    const base = S.calMonth || (() => { const d = new Date(); return [d.getFullYear(), d.getMonth() + 1]; })();
    const [y, m] = base, zone = DEVICE_TZ;
    const j0 = A.jdFromUTC(A.localToUTC(y, m, 1, 0, 0, zone).ms), j1 = A.jdFromUTC(A.localToUTC(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1, 1, 0, 0, zone).ms);
    const lun = A.lunations(j0 - 1, j1 - j0 + 1).filter(l => l.jd >= j0 && l.jd < j1), ing = B.moonIngresses(j0, j1), voc = B.voidOfCourse(j0, j1);
    const ap = activeP(), nat = ap ? chartOf(ap) : null;
    const st = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].flatMap(b => A.stations(b, j0 - 1, j1 - j0 + 1)).filter(s => s.jd >= j0 && s.jd < j1);
    const mn = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 15));
    return `<div class="row" style="margin-top:12px;justify-content:space-between"><button class="btn ghost" data-cal="-1">‹ Önceki</button><h2 style="margin:0">${esc(mn)}</h2><button class="btn ghost" data-cal="1">Sonraki ›</button></div>
      <h3>Ay evreleri ve tutulmalar</h3><div class="list">${lun.map(l => `<div><b>${l.type === 'new' ? 'Yeni Ay' : 'Dolunay'}${l.eclipse ? (l.type === 'new' ? ' — Güneş tutulması' : ' — Ay tutulması') + ' (' + l.ecl + ')' : ''}</b> · ${fmtDate(l.jd, zone)} · ${fmtLon(l.lon)}${nat ? ` · ${esc(ap.name)} için ${A.houseOf(l.lon, nat.houses.cusps)}. ev (${TX.H[A.houseOf(l.lon, nat.houses.cusps)].t})` : ''}</div>`).join('')}</div>
      <h3>Retro ve direkt duruşlar</h3><div class="list">${st.map(s => `<div>${fmtDate(s.jd, zone)} · ${G(s.body)} ${esc(nm(s.body))} ${s.type === 'R' ? 'retro başlıyor' : 'direkt dönüyor'} · ${fmtLon(s.lon)}</div>`).join('') || '<div class="muted">Bu ay duruş yok.</div>'}</div>
      <h3>Ay’ın burç geçişleri ve boşlukta Ay</h3><div class="scroll"><table class="stack"><thead><tr><th>Boşluk başlar</th><th>Son açı</th><th>Ay burca girer</th></tr></thead><tbody>${ing.map(i => { const v = voc.find(x => Math.abs(x.end - i.jd) < 0.01); return `<tr><td>${v ? fmtDate(v.start, zone) : '—'}</td><td>${v ? esc(nm(v.lastPlanet)) + ' ' + esc(A.ASPECTS.find(a => a.a === v.lastAsp).n.toLowerCase()) : ''}</td><td>${fmtDate(i.jd, zone)} · ${A.SIGNS[i.sign]} ${sym(SG[i.sign])}</td></tr>`; }).join('')}</tbody></table></div><p class="small muted">Saatler ${esc(zone)} saat dilimine göredir. Boşlukta Ay: Ay’ın burcundan çıkmadan önceki son majör açısından burç değişimine kadar geçen süre (Güneş–Plüton).</p>`;
  }
  function viewSaatler() {
    const here = S.settings.here, d = S.hourDate || new Date().toISOString().slice(0, 10), [y, m, dd] = d.split('-').map(Number);
    const off = A.localToUTC(y, m, dd, 0, 0, here.zone).ms, wd = new Date(Date.UTC(y, m - 1, dd)).getUTCDay();
    const ph = B.planetaryHours(A.jdFromUTC(off), wd, here.lat, here.lon), now = nowJD();
    return `<h2>Gezegen saatleri</h2><div class="grid2"><div><label for="hr_d">Tarih</label><input type="date" id="hr_d" value="${d}"></div><div><label>Konum</label><button class="btn ghost" data-go="defter:ayar" style="width:100%">${esc(here.name)}</button></div></div>
      ${ph ? `<p>Gün doğumu ${fmtTime(ph.sunrise, here.zone)} · gün batımı ${fmtTime(ph.sunset, here.zone)} · günün yöneticisi <b>${nm(ph.ruler)}</b></p><div class="scroll"><table><thead><tr><th>#</th><th>Saat</th><th>Yönetici</th><th>Uygun işler</th></tr></thead><tbody>${ph.hours.map((h, i) => `<tr style="${now >= h.start && now < h.end ? 'background:rgba(159,192,255,.12)' : ''}"><td>${i < 12 ? 'G' : 'Gc'}${i % 12 + 1}</td><td class="n">${fmtTime(h.start, here.zone)}–${fmtTime(h.end, here.zone)}</td><td>${G(h.ruler)} ${nm(h.ruler)}</td><td class="small">${esc(TX.HOURTXT[h.ruler])}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">Bu enlemde bu tarihte Güneş doğmuyor/batmıyor; gezegen saatleri tanımsız.</p>'}
      <p class="small muted">Geleneksel eşit olmayan saatler: gündüz ve gece, gün doğumu–batımı arası 12’şer eşit parçaya bölünür; sıralama Keldani düzenini izler.</p>`;
  }

  /* ---------- DEFTER ---------- */
  function viewDefter() {
    let h = header() + subnav('defter', [['kisiler', 'Kişiler'], ['metin', 'Metinler'], ['ayar', 'Ayarlar'], ['yedek', 'Yedek'], ['test', 'Doğruluk testi'], ['hakkinda', 'Hakkında']]);
    const sub = curSub('defter', 'kisiler'), st = S.settings;
    if (S.form) return h + personForm(S.form === true ? null : S.form);
    if (S.notesFor && person(S.notesFor)) { const p = person(S.notesFor), ss = p.sessions || [];
      return h + `<div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">${esc(p.name)} · danışan defteri</h2><button class="btn ghost" data-act="closenotes">‹ Geri</button></div>
        <label for="nt_main">Genel notlar</label><textarea id="nt_main" rows="6" placeholder="Danışanla ilgili kalıcı notlar">${esc(p.notes || '')}</textarea><button class="btn ghost" data-act="savenotes" style="margin-top:8px">Notları kaydet</button>
        <h3>Görüşmeler</h3><div class="grid2"><div><label for="ss_d">Tarih</label><input type="date" id="ss_d" value="${new Date().toISOString().slice(0, 10)}"></div><div><label for="ss_t">Konu</label><input id="ss_t" placeholder="örn. solar return okuması"></div></div><label for="ss_n">Görüşme notu</label><textarea id="ss_n" rows="4"></textarea><button class="btn" data-act="addsession" style="margin-top:8px">Görüşmeyi ekle</button>
        <div class="list" style="margin-top:12px">${ss.slice().reverse().map((x, i) => `<div><b>${esc(x.date)}</b> · ${esc(x.topic || '')}<br><span class="small">${esc(x.note || '').replace(/\n/g, '<br>')}</span><br><button class="chip" data-delsession="${ss.length - 1 - i}">Sil</button></div>`).join('') || '<div class="muted">Henüz görüşme yok.</div>'}</div></div>`; }
    if (sub === 'kisiler') h += `<div class="row" style="margin:10px 0"><button class="btn" data-act="newperson">+ Yeni kişi</button></div>${S.people.length ? `<div class="list">${S.people.map(p => `<div><b>${esc(p.name)}</b> <span class="muted small">${p.d}.${p.mo}.${p.y} ${pad(p.h)}:${pad(p.mi)} · ${esc(p.place)}</span><div class="row" style="margin-top:6px"><button class="chip" data-open="${esc(p.id)}">Haritayı aç</button><button class="chip" data-notes="${esc(p.id)}">Danışan defteri</button><button class="chip" data-edit="${esc(p.id)}">Düzenle</button><button class="chip" data-del="${esc(p.id)}">Sil</button></div></div>`).join('')}</div>` : '<p class="muted">Henüz kayıtlı kişi yok.</p>'}`;
    else if (sub === 'ayar') {
      const sel = (id, label, opts, v) => `<label for="${id}">${label}</label><select id="${id}" data-set="${id}">${opts.map(([k, t]) => `<option value="${k}" ${String(v) === String(k) ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
      h += `<div class="card">${sel('system', 'Astroloji sistemi', [['modern', 'Modern Batı'], ['classic', 'Klasik (geleneksel) Batı'], ['vedic', 'Vedik (Jyotish)']], st.system)}
        ${sel('hsys', 'Ev sistemi', Object.entries(A.HSYS), st.hsys)}
        ${sel('zodiac', 'Zodyak', [['T', 'Tropikal'], ['S', 'Sidereal (Lahiri)']], st.zodiac)}
        ${sel('node', 'Ay Düğümü', [['true', 'Gerçek (oskülasyon)'], ['mean', 'Ortalama']], st.node)}
        ${sel('lilith', 'Kara Ay (Lilith)', [['mean', 'Ortalama'], ['true', 'Gerçek (oskülasyon apojesi)']], st.lilith)}
        ${sel('asteroids', 'Asteroitler (Kiron, Ceres, Pallas, Juno, Vesta)', [['true', 'Göster'], ['false', 'Gizle']], st.asteroids)}
        ${sel('minor', 'Minör açılar', [['false', 'Kapalı'], ['true', 'Açık']], st.minor)}
        ${sel('orbMult', 'Orb genişliği', [['0.75', 'Dar (×0,75)'], ['1', 'Standart'], ['1.25', 'Geniş (×1,25)']], st.orbMult)}
        <label for="here_city">Bulunduğum yer (An ekranı, gezegen saatleri, dönüşler)</label><div class="dd"><input id="here_city" value="${esc(st.here.name)}" autocomplete="off"><div class="ddlist" id="here_dd" hidden></div></div></div>`;
    } else if (sub === 'yedek') h += `<div class="card"><p>Kişileriniz, notlarınız ve metin düzenlemeleriniz bu cihazda saklanır${typeof claude !== 'undefined' ? '; claude.ai hesabınızla açtığınızda hesabınıza da yedeklenir' : ''}. Telefonu değiştirmeden ya da tarayıcı verisini silmeden önce yedek dosyası indirin. Başka bir cihaza taşımak için dosyayı orada “Dosyadan yükle” ile açın ya da aşağıdaki metni kopyalayıp “İçe aktar” deyin.</p><textarea id="bk" rows="5">${esc(JSON.stringify({ people: S.people, settings: S.settings, txo: TXEDIT.load() }))}</textarea><div class="row" style="margin-top:8px"><button class="btn ghost" data-act="copybk">Kopyala</button><button class="btn" data-act="importbk">İçe aktar</button></div><div class="row" style="margin-top:8px"><button class="btn" data-act="dlbk">Yedek dosyası indir</button><label class="btn ghost" style="display:inline-flex;align-items:center;cursor:pointer">Dosyadan yükle<input type="file" id="bkfile" accept=".json,application/json,text/plain" hidden></label></div></div>`;
    else if (sub === 'metin') h += TXEDIT.view();
    else if (sub === 'test') { const r = accuracyTests(), ok = r.filter(x => x.ok).length; h += `<div class="card"><h3>Doğruluk testleri: ${ok}/${r.length} başarılı</h3><p class="small muted">Hesap motoru, yayımlanmış referans değerlerle bu cihazda canlı olarak karşılaştırılır.</p><div class="scroll"><table class="stack"><thead><tr><th>Test</th><th class="n">Hesaplanan</th><th class="n">Beklenen</th><th class="n">Fark</th><th>Sonuç</th></tr></thead><tbody>${r.map(x => `<tr><td>${esc(x.name)}</td><td class="n">${x.got.toFixed(4)}</td><td class="n">${x.exp.toFixed(4)}</td><td class="n">${x.unit === '°' ? (x.d * 3600).toFixed(1) + '″' : x.d.toFixed(2)}</td><td>${x.ok ? '✓ geçti' : '✗ kaldı'}</td></tr>`).join('')}</tbody></table></div><p class="small muted">Ek efemeris: ${SEPH_API.sets()} veri bloğu yüklü (1900–2100 temel; 1800–1900 ve 2100–2400 gerektiğinde yüklenir).</p></div>`; }
    else h += `<div class="card"><h3>Hesap kaynakları</h3><p class="small">Gezegenler, Ay, asteroitler (1800–2400): Swiss Ephemeris, Astrodienst AG (NASA JPL DE441 tabanlı), sıkıştırılmış Chebyshev verisi doğrudan okunur. Bu aralık dışında Meeus, JPL Standish ve Schlyter analitik çözümleri kullanılır (±3′). Nütasyon, presesyon (IAU 1976), ışık zamanı ve yıllık sapınç uygulanır; ΔT değerleri Swiss Ephemeris ile aynıdır. 1800–2400 arası 150 rastgele tarih ve yerde Swiss Ephemeris'in kendi aracı swetest ile karşılaştırıldı: gezegenler, Ay, asteroitler, düğümler, Lilith, sabit yıldızlar ve yedi ev sistemi 1–2 yay saniyesi içinde (2100 sonrası evlerde en çok 13″) aynıdır; tutulmalar ve türleri birebir eşleşir. Sabit yıldızlar: Swiss Ephemeris sefstars.txt. Ev sistemleri: Swiss Ephemeris belgelerindeki formüller. Saat dilimleri: IANA tz veritabanı (tarihsel yaz saati). Şehirler ve dünya haritası: Natural Earth (kamu malı). ΔT: Espenak–Meeus ve IERS ölçümleri.</p><h3>Yorumlar</h3><p class="small">Geleneksel kaynakların (Doroteus, Batlamyus, Valens, Lilly, Bonatti) ve çağdaş psikolojik astrolojinin ilkelerine dayanarak özgün biçimde yazılmıştır. Sabian sembol metinleri telifli olduğu için yalnızca Sabian derecesi gösterilir.</p></div>`;
    return h;
  }

  /* ---------- RAPORLAR ---------- */
  function synth(c) {
    const sun = c.get('Sun'), moon = c.get('Moon'), asc = c.get('Asc'), modern = c.calc.system !== 'classic';
    const se = sun.sign % 4, me = moon.sign % 4;
    const rel = se === me ? 'aynı elementte; iradeniz ile duygularınız aynı dili konuşur, içsel tutarlılığınız yüksektir.' : ((se + me === 2 && (se === 0 || se === 2)) || (se === 0 && me === 2) || (se === 2 && me === 0) || (se === 1 && me === 3) || (se === 3 && me === 1)) ? 'uyumlu elementlerde; isteklerinizle ihtiyaçlarınız birbirini destekler.' : 'farklı ve zorlayıcı elementlerde; kafanızın istediğiyle kalbinizin ihtiyaç duyduğu arasında köprü kurmak hayat boyu süren bir ustalıktır.';
    const rul = rulerOf(asc.sign, modern), rp = c.get(rul) || c.get(A.RULER[asc.sign]);
    const b = balance(c), elMax = b.el.indexOf(Math.max(...b.el)), elMin = b.el.indexOf(Math.min(...b.el)), mdMax = b.md.indexOf(Math.max(...b.md));
    const dom = dominants(c).slice(0, 3);
    const above = CORE.filter(id => c.get(id).house >= 7).length, east = CORE.filter(id => [10, 11, 12, 1, 2, 3].includes(c.get(id).house)).length;
    const OUT = ['Uranus', 'Neptune', 'Pluto'], asps = aspectsOf(c).filter(a => a.asp.major && CORE.includes(a.p.id) && CORE.includes(a.q.id) && !(OUT.includes(a.p.id) && OUT.includes(a.q.id)));
    const soft = asps.filter(a => ['tri', 'sex'].includes(a.asp.k)).length, hard = asps.filter(a => ['squ', 'opp'].includes(a.asp.k)).length;
    const pats = patterns(c), shp = shape(c), houseCount = {}; for (const id of CORE) houseCount[c.get(id).house] = (houseCount[c.get(id).house] || 0) + 1;
    const topH = Object.entries(houseCount).sort((a, b) => b[1] - a[1]).slice(0, 2);
    const nn = c.get('NNode');
    const paras = [];
    if (c.unknownTime) paras.push(`Haritanızın temel ikilisi Güneş ${A.SIGNS[sun.sign]} ve Ay ${A.SIGNS[moon.sign]}. Güneş ile Ay ${rel} Özünüz ${TX.S[sun.sign].st} parlar, duygusal güvenliğiniz ${TX.S[moon.sign].st} beslenir. Doğum saati bilinmediği için Yükselen ve ev yorumları bu raporda yer almaz.`);
    else paras.push(`Haritanızın temel üçlüsü Güneş ${A.SIGNS[sun.sign]}, Ay ${A.SIGNS[moon.sign]} ve Yükselen ${A.SIGNS[asc.sign]}. Güneş ile Ay ${rel} Dünyaya ${TX.S[asc.sign].st} yaklaşırsınız; insanların sizde ilk gördüğü budur, ama özünüz ${TX.S[sun.sign].st} parlar ve duygusal güvenliğiniz ${TX.S[moon.sign].st} beslenir.`);
    if (rp && !c.unknownTime) paras.push(`Harita yöneticiniz ${nm(rp.id)}, ${A.SIGNS[rp.sign]} burcunda ve ${rp.house}. evde${rp.retro ? ', retro hareketle' : ''}${rp.dig && rp.dig.score >= 4 ? '; esansiyel olarak güçlü olduğundan hayat yönünüzü kararlılıkla çizebilirsiniz' : rp.dig && rp.dig.score <= -4 ? '; esansiyel olarak zorlandığından hayat yönünüzü bulmak deneme ve olgunlaşma ister' : ''}. ${TX.RULERIN[rp.house]}`);
    paras.push(`En baskın gezegenleriniz ${dom.map(([id]) => nm(id)).join(', ')}. Bu yüzden ${dom.map(([id]) => P(id).k.split(',').slice(0, 2).join(' ve ')).join('; ')} temaları hayatınızda olağandan fazla yer kaplar.`);
    const REM = { 'Ateş': 'hareket, spor ve sizi heyecanlandıran hedefler', 'Toprak': 'düzenli rutinler, bütçe ve bedensel bakım', 'Hava': 'okumak, yazmak ve farklı bakış açılarıyla sohbet', 'Su': 'duygularınızı adlandırmak, sanat ve yakın ilişkiler' };
    paras.push(`Element dengesinde ${A.ELEM[elMax]} öne çıkıyor (ağırlıklı puan ${b.el[elMax].toFixed(1)}). ${TX.ELEMTXT[A.ELEM[elMax]]} ${b.el[elMin] < 3 ? TX.ELEMTXT['low' + A.ELEM[elMin]] + ' Bu eksikliği ' + REM[A.ELEM[elMin]] + ' yoluyla bilinçli olarak tamamlayabilirsiniz.' : 'Diğer elementler de yeterince temsil edildiği için mizacınız dengelidir.'} Nitelik olarak ${TX.MODETXT[A.MODE[mdMax]].toLowerCase()}`);
    paras.push(`Gezegenlerin ${above >= 6 ? 'çoğu ufkun üstünde: hayatınız dışa dönük, toplumsal ve görünür alanlarda şekillenir' : above <= 4 ? 'çoğu ufkun altında: güç ve anlamı önce iç dünyanızda, ailede ve kişisel alanda kurarsınız' : 'ufkun iki yanına dengeli dağılmış: iç dünya ile dış hayat arasında denge kurarsınız'}; ${east >= 6 ? 'doğu yarısındaki ağırlık kaderinizi kendi inisiyatifinizle çizdiğinizi' : east <= 4 ? 'batı yarısındaki ağırlık hayatınızın büyük ölçüde ilişkiler ve başkalarıyla birlikte şekillendiğini' : 'doğu–batı dengesi bağımsızlık ile iş birliğini birlikte kullandığınızı'} gösterir. En yoğun alanlar ${topH.map(([h]) => h + '. ev (' + TX.H[h].t + ')').join(' ve ')}.`);
    paras.push(`Açı yapınızda ${soft} uyumlu, ${hard} zorlayıcı majör açı var. ${hard > soft + 2 ? 'Gerilimli açıların ağırlığı, sizi sürekli harekete geçiren güçlü bir iç motor demektir; zorluklar başarıya dönüşür.' : soft > hard + 2 ? 'Uyumlu açıların ağırlığı doğal yetenekleri ve kolaylığı gösterir; bu potansiyeli bilinçli çabayla kullanmak önemlidir.' : 'Uyum ve gerilimin dengesi, hem yetenekleri hem de büyütücü meydan okumaları birlikte taşıdığınızı gösterir.'} Harita şekli “${shp}”: ${TX.SHAPE[shp].split(': ')[1]}`);
    if (pats.length) {
      const gc = pats.filter(o => o.t === 'Büyük Haç'), gcSet = new Set(gc.flatMap(o => o.ids));
      const use = pats.filter(o => !(o.t === 'T-Kare' && gc.length && o.ids.every(i => gcSet.has(i))));
      const txt = use.slice(0, 4).map(o => {
        if (o.t === 'T-Kare') { const ap = c.get(o.apex), opp = o.ids.filter(i => i !== o.apex); const es = (ap.sign + 6) % 12, eh = (ap.house + 5) % 12 + 1; return `T-Kare: ${nm(opp[0])}–${nm(opp[1])} karşıtlığının gerilimi odak gezegen ${nm(o.apex)} üzerinde toplanır. ${nm(o.apex)} ${A.SIGNS[ap.sign]} burcunda ve ${ap.house}. evde olduğundan, ${TX.H[ap.house].t} alanı hayatınızda sürekli çalıştığınız, zorlandığınız ve sonunda ustalaştığınız yerdir. Klasik çözüm, “boş bacağı”, yani ${A.SIGNS[es]} burcunun ve ${eh}. evin (${TX.H[eh].t}) niteliklerini bilinçle geliştirmektir.`; }
        if (o.t === 'Yod') { const ap = c.get(o.apex); return `Yod: ${o.ids.filter(i => i !== o.apex).map(nm).join(' ve ')} uyumlu biçimde bağlanır ve ikisi de ${AM.ek(nm(o.apex), 'dat')} quincunx açı yapar. Tepe gezegen ${nm(o.apex)}, ${ap.house}. evde (${TX.H[ap.house].t}), hayatınızda sürekli ayar gerektiren, kader duygusu taşıyan özel bir görev alanını işaret eder.`; }
        if (o.t === 'Büyük Haç') return `Büyük Haç (${o.ids.map(nm).join(', ')}): dört yönlü bir gerilim yapısı. Hayatınızın birden çok alanı aynı anda dikkat ister; bu yük, zamanla olağanüstü bir dayanıklılık ve çok yönlülük kazandırır. Dengenin anahtarı, tek bir alanı diğerlerinin önüne geçirmemektir.`;
        if (o.t === 'Büyük Üçgen') return `${o.el || ''} Büyük Üçgeni (${o.ids.map(nm).join(', ')}): bu elementte doğal, akıcı bir yetenek akışı vardır. Ancak kapalı bir devre olduğu için kendi kendine yeterli kalabilir; bilinçli bir hedefe bağlandığında hayatınızın en büyük kaynağına dönüşür.`;
        if (o.t === 'Stelyum') return `Stelyum (${o.ids.map(nm).join(', ')}, ${o.where}): bu yoğunlaşma, hayatınızda bu ${o.where.includes('ev') ? 'alanın' : 'burcun niteliklerinin'} olağanüstü baskın olduğunu gösterir; enerjinizin büyük bölümü buraya akar.`;
        if (o.t === 'Uçurtma') return `Uçurtma (${o.ids.map(nm).join(', ')}): büyük üçgenin akıcı yetenekleri, karşıt gezegenin gerilimi sayesinde somut bir amaca yönlendirilir.`;
        return '';
      }).filter(Boolean);
      if (txt.length) paras.push(...txt);
    }
    paras.push(`Ay Düğümleri ekseni hayat yolculuğunuzun yönünü gösterir. ${TX.NODE[nn.sign].replace(/^[^:]+: /, '')} Kuzey Düğüm ${nn.house}. evde olduğundan bu gelişim özellikle ${TX.H[nn.house].t} alanında yaşanır.`);
    paras.push(`Ay evreniz ${TX.PHASE[Math.floor(c.phaseAngle / 45)][0]}: ${TX.PHASE[Math.floor(c.phaseAngle / 45)][1]}`);
    { // tutarlılık: birbirine ters düşen eğilimleri tek cümlede buluştur
      const t = [], el = i => A.ELEM[i];
      const ext = b.el[0] + b.el[2], int = b.el[1] + b.el[3];
      if (!c.unknownTime) { const ae = asc.sign % 4; if ((ae === 0 || ae === 2) !== (se === 0 || se === 2)) t.push(`Yükseleniniz (${el(ae)}) ile Güneşiniz (${el(se)}) farklı mizaçları gösterir: dışarıdan göründüğünüz kişi ile içteki özünüz aynı hızda çalışmaz. İnsanlar sizi ilk izlenime göre tanımlasa da yakın çevreniz asıl doğanızı zamanla görür.`); }
      if ((se === 0 || se === 2) && (me === 1 || me === 3)) t.push('Güneşiniz dışa dönük bir elementte, Ayınız ise içe dönük bir elementte: sosyal ortamlarda canlı ve girişken olsanız da duygusal olarak yenilenmek için yalnız ve sakin zamanlara ihtiyaç duyarsınız. Bu bir çelişki değil, iki ritmin birlikteliğidir.');
      if ((me === 0 || me === 2) && (se === 1 || se === 3)) t.push('Özünüz temkinli ve derin, duygusal tepkileriniz ise hızlı ve dışa dönük: kalbiniz hemen konuşur, aklınız sonra tartar. Önemli kararları ilk duygusal tepkiden sonra vermek size iyi gelir.');
      const has = (p, q, ks) => asps.some(a => ((a.p.id === p && a.q.id === q) || (a.p.id === q && a.q.id === p)) && ks.includes(a.asp.k));
      if (has('Venus', 'Saturn', ['squ', 'opp', 'con']) && has('Venus', 'Jupiter', ['tri', 'sex', 'con'])) t.push('Sevgide hem cömert ve iyimser hem de temkinli ve korkulu iki eğilim bir aradadır: kolay bağ kurar ama derin bağlılıkta zaman ve güven istersiniz.');
      if (has('Sun', 'Uranus', ['con', 'squ', 'opp']) && (c.get('Saturn').house === 10 || c.get('Saturn').house === 1 || has('Sun', 'Saturn', ['con', 'squ', 'opp']))) t.push('Özgürlük ihtiyacı (Uranüs) ile güvenlik ve sorumluluk ihtiyacı (Satürn) haritanızda birlikte güçlüdür: düzen kurup içinde özgürce hareket edebildiğiniz yapılar size en iyi gelir.');
      const h12 = CORE.filter(id => c.get(id).house === 12).length, h10 = CORE.filter(id => c.get(id).house === 10).length;
      if (!c.unknownTime && h12 >= 2 && h10 >= 2) t.push('Hem görünür bir kamusal hayat (10. ev) hem de güçlü bir iç dünya ve geri çekilme ihtiyacı (12. ev) vurgulanmış: dışarıda parlayabilmek için düzenli olarak sessizliğe çekilmeniz gerekir.');
      if (Math.abs(ext - int) < 2 && t.length === 0) t.push('Mizacınızda dışa dönük (ateş ve hava) ile içe dönük (toprak ve su) elementler dengelidir; ortama göre her iki yüzünüzü de rahatça kullanabilirsiniz.');
      if (t.length) paras.push('Denge ve iç çelişkiler: ' + t.join(' '));
    }
    const strengths = asps.filter(a => ['tri', 'sex'].includes(a.asp.k)).slice(0, 3).map(a => `${nm(a.p.id)}–${nm(a.q.id)} ${a.asp.n.toLowerCase()}: ${(TX.PAIR[a.p.id + '-' + a.q.id] || TX.PAIR[a.q.id + '-' + a.p.id] || ['', ''])[1]}`);
    const chall = asps.filter(a => ['squ', 'opp'].includes(a.asp.k)).slice(0, 3).map(a => `${nm(a.p.id)}–${nm(a.q.id)} ${a.asp.n.toLowerCase()}: ${(TX.PAIR[a.p.id + '-' + a.q.id] || TX.PAIR[a.q.id + '-' + a.p.id] || ['', '', ''])[2]}`);
    return { paras, strengths, chall, dom, rp, b, elMax, mdMax, shp, pats };
  }
  function pageWrap(title, n, body) { return `<section class="page"><span class="pn">${n}</span><h2>${esc(title)}</h2>${body}</section>`; }
  function cover(title, subtitle, wheelSvg) {
    return `<section class="page cover" style="text-align:center;background:radial-gradient(120% 80% at 50% 0%,#1d2a58,#0e1735 60%,#0b1226);padding:28px 18px"><img src="logo-full.jpg" width="100%" alt="AstroMidas logosu" style="max-width:420px;border-radius:18px;display:block;margin:0 auto;box-shadow:0 10px 40px rgba(0,0,0,.45)"><div class="small muted" style="letter-spacing:.14em;text-transform:uppercase;margin-top:12px">Ay ışığı &amp; kozmik rehber</div><h1 style="margin-top:18px">${esc(title)}</h1><p class="muted">${subtitle}</p><div class="wheelbox" style="max-width:480px">${wheelSvg}</div></section>`;
  }
  function natalReport(p, kind) {
    const c = chartOf(p, kind === 'classic' ? { system: 'classic', hsys: 'W' } : kind === 'vedic' ? { system: 'vedic' } : null), inp = inputOf(p), asps = aspectsOf(c), sy = synth(c), modern = c.calc.system !== 'classic';
    let n = 1, out = '';
    const sysName = { modern: 'Modern Batı', classic: 'Klasik Batı', vedic: 'Vedik' }[c.calc.system];
    out += cover(`${p.name} — Doğum Haritası Raporu`, `${fmtDate(inp.jd, p.zone)} · ${esc(p.place || '')} (${(+p.lat).toFixed(3)}, ${(+p.lon).toFixed(3)})<br>${sysName} · ${esc(A.HSYS[c.houses.sys])} · ${c.calc.zodiac === 'S' ? 'Sidereal (Lahiri)' : 'Tropikal'}`, wheel(c, { uid: 'rp' + (uidN++), aspects: asps.filter(a => a.asp.major) }));
    out += pageWrap('Özet', ++n, `${sy.paras.slice(0, 3).map(t => `<p>${esc(t)}</p>`).join('')}<h3>Güçlü yanlar</h3><ul>${sy.strengths.map(t => `<li>${esc(t)}</li>`).join('') || '<li>Uyumlu majör açı yok; yetenekler daha çok gezegenlerin burç ve ev konumlarından gelir.</li>'}</ul><h3>Gelişim alanları</h3><ul>${sy.chall.map(t => `<li>${esc(t)}</li>`).join('') || '<li>Zorlayıcı majör açı yok; gelişim daha çok bilinçli hedef koyarak gelir.</li>'}</ul><h3>Bir bakışta</h3><table><tbody><tr><td>Güneş / Ay / Yükselen</td><td>${A.SIGNS[c.get('Sun').sign]} / ${A.SIGNS[c.get('Moon').sign]} / ${A.SIGNS[c.get('Asc').sign]}</td></tr><tr><td>Harita yöneticisi</td><td>${sy.rp ? nm(sy.rp.id) + ' (' + A.SIGNS[sy.rp.sign] + ', ' + sy.rp.house + '. ev)' : ''}</td></tr><tr><td>Baskın gezegenler</td><td>${sy.dom.map(([id]) => nm(id)).join(', ')}</td></tr><tr><td>Baskın element / nitelik</td><td>${A.ELEM[sy.elMax]} / ${A.MODE[sy.mdMax]}</td></tr><tr><td>Harita şekli</td><td>${sy.shp}</td></tr><tr><td>Sekt</td><td>${c.isDay ? 'Gündüz' : 'Gece'} haritası</td></tr></tbody></table>`);
    out += pageWrap('Haritanın sentezi', ++n, sy.paras.slice(3).map(t => `<p>${esc(t)}</p>`).join(''));
    out += pageWrap('Hesap verileri', ++n, posTable(c, pointsFor(c)) + '<h3>Ev başlangıçları</h3>' + cuspTable(c) + '<h3>Açı tablosu</h3>' + aspectGrid(c, asps));
    const U = c.unknownTime, HT = (id, h) => U ? '' : paras(houseText(id, h));
    if (U || c.approxAsc) out += pageWrap('Doğum saati notu', ++n, timeNote(c));
    out += pageWrap(U ? 'Kimlik ve kişilik: Güneş ve Ay' : 'Kimlik ve kişilik: Güneş, Ay, Yükselen, MC', ++n, ['Sun', 'Moon'].map(id => `<h3>${G(id)} ${nm(id)} — ${A.SIGNS[c.get(id).sign]}${U ? '' : ', ' + c.get(id).house + '. ev'}</h3>${paras(signText(id, c.get(id).sign))}${HT(id, c.get(id).house)}`).join('') + (U ? '' : `<h3>Yükselen ${A.SIGNS[c.get('Asc').sign]}</h3>${paras(signText('Asc', c.get('Asc').sign))}<h3>MC ${A.SIGNS[c.get('MC').sign]}</h3>${paras(signText('MC', c.get('MC').sign))}`));
    const rest = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', ...(modern ? ['Uranus', 'Neptune', 'Pluto'] : [])];
    out += pageWrap('Gezegenler burçlarda ve evlerde', ++n, rest.map(id => { const x = c.get(id); return `<h3>${G(id)} ${nm(id)} — ${fmtLon(x.lon)}, ${x.house}. ev${x.retro ? ' (retro)' : ''}</h3><p class="small muted">${esc(P(id).f)}</p>${paras(signText(id, x.sign))}${HT(id, x.house)}${x.retro && TX.RETRO[id] ? `<p class="small">${esc(TX.RETRO[id])}</p>` : ''}${x.dig && x.dig.list.length ? `<p class="small muted">Esansiyel durum: ${x.dig.list.join(', ')} (puan ${x.dig.score})</p>` : ''}${x.oob ? '<p class="small">Sınır dışı (out of bounds): bu gezegen alışılmadık, kuralların dışına taşan ve özgün bir biçimde çalışır.</p>' : ''}`; }).join(''));
    if (!U) out += pageWrap('Ev yöneticileri', ++n, `<p class="small muted">Her evin konuları, o evin başlangıç burcunu yöneten gezegenin bulunduğu yere taşınır. Bu, haritanın hayat alanlarını birbirine bağlayan görünmez ağdır.</p>` + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => { const s = A.signOf(c.houses.cusps[h]), r = rulerOf(s, modern), rp = c.get(r); if (!rp) return ''; const same = rp.house === h; return `<p><b>${h}. ev (${TX.H[h].n}), ${A.SIGNS[s]} · yöneticisi ${G(r)} ${nm(r)} ${rp.house}. evde${rp.dig && rp.dig.list.length ? ' (' + rp.dig.list.join(', ') + ')' : ''}.</b> ${esc(TX.RULERFROM[h])} ${same ? 'kendi alanında güçlü ve bağımsız biçimde işler; bu ev hayatınızda kendi kendine yeten, belirgin bir temadır.' : esc(TX.RULERTO[rp.house]) + '.'}${h === 1 ? ' ' + esc(TX.RULERIN[rp.house]) : ''}${rp.dig && rp.dig.score >= 4 ? ' Yönetici gezegen güçlü olduğu için bu alan kolayca destek bulur.' : rp.dig && rp.dig.score <= -4 ? ' Yönetici gezegen zorlandığı için bu alan emek ve olgunlaşma ister.' : ''}</p>`; }).join(''));
    const mainAsps = asps.filter(a => (CORE.includes(a.p.id) || ['Asc', 'MC'].includes(a.p.id)) && (CORE.includes(a.q.id) || ['Asc', 'MC'].includes(a.q.id)));
    out += pageWrap('Açılar', ++n, mainAsps.map(a => `<p><span class="${aspClass(a.asp.k)}">${G(a.p.id)} ${ASPG[a.asp.k]} ${G(a.q.id)}</span> ${esc(aspectText(a))}</p>`).join('') || '<p class="muted">Majör açı yok.</p>');
    out += pageWrap('Açı figürleri ve harita şekli', ++n, `<p>${esc(TX.SHAPE[sy.shp])}</p>${sy.pats.map(o => `<p><b>${esc(o.t)}</b> (${o.ids.map(nm).join(', ')}${o.where ? ', ' + o.where : ''}): ${esc(TX.PATTERN[o.t].split(': ').slice(1).join(': '))}</p>`).join('') || '<p class="muted">Belirgin bir açı figürü yok.</p>'}`);
    const nn = c.get('NNode');
    out += pageWrap('Ay Düğümleri ve Kara Ay', ++n, `<p>${esc(TX.NODE[nn.sign])}</p><p>${esc(TX.NODEH[nn.house])}</p>${c.get('Lilith') ? `<p><b>Kara Ay ${A.SIGNS[c.get('Lilith').sign]}, ${c.get('Lilith').house}. ev:</b> ${esc(TX.P.Lilith.f)} Bu enerji ${TX.S[c.get('Lilith').sign].st} ve ${TX.H[c.get('Lilith').house].t} alanında kendini gösterir.</p>` : ''}`);
    if (c.calc.asteroids) out += pageWrap('Kiron ve asteroitler', ++n, ['Chiron', 'Ceres', 'Pallas', 'Juno', 'Vesta'].filter(id => c.get(id)).map(id => { const x = c.get(id); return `<p><b>${G(id)} ${nm(id)} ${fmtLon(x.lon)}, ${x.house}. ev:</b> ${esc(P(id).f)} ${A.SIGNS[x.sign]} burcunda bu tema ${TX.S[x.sign].st}, ${TX.H[x.house].t} alanında yaşanır.</p>`; }).join(''));
    const sp = B.starContacts(c, B.fixedStars(c.jd, STARS), 1);
    out += pageWrap('Sabit yıldızlar', ++n, sp.length ? sp.map(k => `<p><b>${esc(k.star.n)}</b> ☌ ${nm(k.p)} (orb ${dms(k.orb)}): doğası ${esc((TX.STAR[k.star.n] || ['', ''])[0])}; ${esc((TX.STAR[k.star.n] || ['', ''])[1])}. ${['Asc', 'MC', 'Sun', 'Moon'].includes(k.p) ? 'Bir açı noktası ya da ışıkla kavuştuğu için etkisi belirgindir.' : ''}</p>`).join('') : '<p class="muted">1° içinde sabit yıldız kavuşumu yok.</p>');
    // Dönem
    const now = nowJD(), tr = B.transitHits(c, now, 365, ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'], c.calc).slice(0, 12), prof = B.profection(c, (now - c.jd) / 365.2425), pc = B.progressedChart(c, now, c.calc);
    let per = `<p><b>Yıllık profeksiyon:</b> ${prof.house}. ev, yılın yöneticisi ${nm(prof.lord)}. ${TX.PROFECT[prof.house]}</p><p><b>Progres Ay:</b> ${esc(progMoonText(pc.get('Moon')))}</p>`;
    if (c.calc.system === 'vedic') { const v = B.vedic(inp, c.calc), cur = v.dasha.find(d => now >= d.start && now < d.end); if (cur) per += `<p><b>Vimşottari:</b> ${TX.PLANETTR[cur.p]} mahadaşa (${fmtShort(cur.start)} – ${fmtShort(cur.end)}). ${TX.DASHATXT[cur.p]}</p>`; }
    if (c.calc.system === 'classic') { const f = B.firdaria(c).find(f => now >= f.start && now < f.end); if (f) per += `<p><b>Firdaria:</b> ${nm(f.p)} dönemi (${fmtShort(f.start)} – ${fmtShort(f.end)}).</p>`; }
    per += `<h3>Önümüzdeki 12 ayın ana transitleri</h3>${timeline(tr, c)}`;
    out += pageWrap('Şu anki dönem', ++n, per);
    if (c.calc.system === 'vedic') { const v = B.vedic(inp, c.calc); out += pageWrap('Vedik harita', ++n, southGrid(v.rows, 'Rasi (D1)') + southGrid(v.rows, 'Navamsa (D9)', true) + `<p>Ay nakşatrası ${v.rows.find(r => r.id === 'Moon').nak.name}: ${esc(TX.NAKTXT[v.rows.find(r => r.id === 'Moon').nak.i])}.</p>`); }
    out += `<p class="small muted" style="text-align:center">AstroMidas · Swiss Ephemeris (JPL DE441) hesaplamaları · ${fmtDate(nowJD())}</p>`;
    return out;
  }
  function synText(x, an, bn) {
    const k = x.asp.k, soft = k === 'tri' || k === 'sex', hard = k === 'squ' || k === 'opp' || k === 'qcx';
    const t = TX.SYN[x.p.id + '-' + x.q.id] || TX.SYN[x.q.id + '-' + x.p.id];
    const ra = TX.SYNROLE[x.p.id] || P(x.p.id).k, rb = TX.SYNROLE[x.q.id] || P(x.q.id).k;
    let s = `${AM.ek(an, 'gen')} ${AM.ek(nm(x.p.id), 'poss')} (${ra}) ile ${AM.ek(bn, 'gen')} ${AM.ek(nm(x.q.id), 'poss')} (${rb}) ${x.asp.n.toLowerCase()} yapar (orb ${dms(x.orb)}). `;
    s += t ? (k === 'con' ? t[0] : soft ? t[1] : hard ? t[2] : t[1]) : (soft || k === 'con' ? `Bu iki alan birbirini destekler; ${an} ve ${bn} bu konularda kolayca uyum yakalar.` : `Bu iki alan arasında sürtüşme vardır; farkındalıkla büyütücü bir dinamiğe dönüşür.`);
    return s;
  }
  function synReport(a, b) {
    const ca = chartOf(a), cb = chartOf(b), ia = aspectsOf(ca, cb).filter(x => x.asp.major), k = B.composite(ca, cb, calcSettings()); k.calc = calcSettings();
    let n = 1, out = cover(`${a.name} & ${b.name} — Uyum Raporu`, 'Sinastri, ev yerleşimleri ve kompozit harita', wheel(ca, { uid: 'sr' + (uidN++), outer: pointsFor(cb).filter(x => !['Asc', 'MC', 'Vertex'].includes(x.id)), aspects: ia }));
    const soft = ia.filter(x => ['tri', 'sex'].includes(x.asp.k)).length, hard = ia.filter(x => ['squ', 'opp'].includes(x.asp.k)).length, con = ia.filter(x => x.asp.k === 'con').length;
    const key = ia.filter(x => ['Sun', 'Moon', 'Venus', 'Mars', 'Asc'].includes(x.p.id) && ['Sun', 'Moon', 'Venus', 'Mars', 'Asc'].includes(x.q.id));
    const el = (c, id) => c.get(id).sign % 4;
    out += pageWrap('Özet', ++n, `<p>İki harita arasında ${ia.length} majör açı var: ${soft} uyumlu, ${hard} zorlayıcı, ${con} kavuşum. ${soft > hard ? 'Uyumlu bağların ağırlığı, birlikteliğin doğal bir akış ve kolaylık taşıdığını gösterir.' : hard > soft ? 'Gerilimli bağların ağırlığı yoğun bir çekim ve karşılıklı büyüme getirir; iletişim ve sabır anahtardır.' : 'Uyum ile gerilim dengede; ilişki hem rahatlatıcı hem de geliştiricidir.'}</p><p>Ay’lar ${el(ca, 'Moon') === el(cb, 'Moon') ? 'aynı elementte: duygusal dilleriniz benzer.' : 'farklı elementlerde: birbirinizin duygusal ihtiyaçlarını öğrenmek zaman alır.'} Venüs–Mars bağları: ${ia.filter(x => (x.p.id === 'Venus' && x.q.id === 'Mars') || (x.p.id === 'Mars' && x.q.id === 'Venus')).map(x => x.asp.n.toLowerCase()).join(', ') || 'doğrudan majör açı yok'}.</p><h3>Anahtar temaslar</h3>${key.map(x => `<p><span class="${aspClass(x.asp.k)}">${G(x.p.id)} ${ASPG[x.asp.k]} ${G(x.q.id)}</span> ${esc(synText(x, a.name, b.name))}</p>`).join('') || '<p class="muted">Kişisel noktalar arasında majör temas yok.</p>'}`);
    out += pageWrap('Tüm karşılıklı açılar', ++n, ia.map(x => `<p><span class="${aspClass(x.asp.k)}">${G(x.p.id)} ${ASPG[x.asp.k]} ${G(x.q.id)}</span> ${esc(synText(x, a.name, b.name))}</p>`).join(''));
    const ov = (c1, c2, n1, n2) => c2.unknownTime ? `<p class="muted">${esc(n2)} için doğum saati bilinmediğinden ev yerleşimleri hesaplanamaz.</p>` : B.overlays(c1, c2).filter(o => CORE.includes(o.id)).map(o => `<p><b>${esc(AM.ek(n1, 'gen'))} ${AM.ek(nm(o.id), 'poss')}, ${esc(AM.ek(n2, 'gen'))} ${o.house}. evinde:</b> ${esc(n1)}, ${esc(n2)}’ın ${TX.H[o.house].t} alanını ${P(o.id).k.split(',')[0]} temasıyla etkiler.</p>`).join('');
    out += pageWrap('Ev yerleşimleri', ++n, ov(cb, ca, b.name, a.name) + ov(ca, cb, a.name, b.name));
    out += pageWrap('Kompozit harita', ++n, `<div class="wheelbox" style="max-width:440px">${wheel(k, { uid: 'kc' + (uidN++), points: pointsFor(k), aspects: aspectsOf(k).filter(x => x.asp.major) })}</div><p>İlişkinin kendisinin haritası: kompozit Güneş ${A.SIGNS[k.get('Sun').sign]}, ${k.get('Sun').house}. evde — ilişkinin amacı ${TX.H[k.get('Sun').house].t} alanında parlar. Kompozit Ay ${A.SIGNS[k.get('Moon').sign]}: birlikteyken duygusal ihtiyaçlarınız ${TX.S[k.get('Moon').sign].st} karşılanır. Kompozit Venüs ${k.get('Venus').house}. evde: sevgi en çok ${TX.H[k.get('Venus').house].t} alanında ifade bulur.</p>`);
    return out;
  }
  function srReport(p) {
    const nat = chartOf(p), jd = targetJD(), sr = B.nextReturn('Sun', nat.get('Sun').lon, jd - 366, calcSettings().zodiac === 'S' ? { sidereal: true } : null).filter(j => j > jd - 366)[0];
    const loc = S.retLoc === 'here' ? S.settings.here : { lat: +p.lat, lon: +p.lon, name: p.place }, c = A.chart({ jd: sr, lat: loc.lat, lon: loc.lon }, calcSettings()); c.calc = calcSettings();
    let n = 1, out = cover(`${p.name} — Solar Return ${new Date(A.utcFromJD(sr)).getUTCFullYear()}`, `${fmtDate(sr)} · ${esc(loc.name || '')}`, wheel(c, { uid: 'srw' + (uidN++), aspects: aspectsOf(c).filter(a => a.asp.major) }));
    out += pageWrap('Özet', ++n, `<p>${esc(srText(c, nat))}</p>`);
    out += pageWrap('Yılın gezegenleri', ++n, CORE.map(id => { const x = c.get(id); return `<p><b>${G(id)} ${nm(id)} ${x.house}. evde</b> (${fmtLon(x.lon)}): ${esc(TX.SRPL[id] || P(id).k)}: ${esc(TX.H[x.house].t)}. ${x.retro ? 'Gezegen retro olduğu için bu alanda geçmişe dönüş, gözden geçirme ve yeniden değerlendirme öne çıkar.' : ''}</p>`; }).join('') + posTable(c, pointsFor(c)));
    return out;
  }
  function transitReport(p) {
    const nat = chartOf(p), jd = targetJD(), hits = B.transitHits(nat, jd, 365, ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'], calcSettings());
    const tr = B.transitChart(nat, jd, calcSettings()); tr.calc = calcSettings();
    let n = 1, out = cover(`${p.name} — 12 Aylık Transit Raporu`, `${fmtShort(jd)} – ${fmtShort(jd + 365)}`, wheel(nat, { uid: 'trw' + (uidN++), outer: pointsFor(tr).filter(x => !['Asc', 'MC', 'Vertex', 'Fortune'].includes(x.id)) }));
    const big = hits.filter(h => h.tr !== 'Mars');
    out += pageWrap('Özet', ++n, `<p>Önümüzdeki 12 ayda ${big.length} yavaş gezegen isabeti var. En belirleyici temalar: ${[...new Set(big.map(h => nm(h.tr) + '–' + nm(h.nat)))].slice(0, 6).join(', ') || 'belirgin bir yavaş gezegen isabeti yok'}.</p>`);
    out += pageWrap('Yavaş gezegenler', ++n, timeline(big, nat));
    out += pageWrap('Mars transitleri (eylem zamanlaması)', ++n, timeline(hits.filter(h => h.tr === 'Mars'), nat));
    const lun = A.lunations(jd, 365).filter(l => l.eclipse);
    out += pageWrap('Tutulmalar', ++n, lun.map(l => `<p><b>${l.type === 'new' ? 'Güneş tutulması' : 'Ay tutulması'} (${l.ecl})</b> ${fmtDate(l.jd)} · ${fmtLon(l.lon)} · ${A.houseOf(l.lon, nat.houses.cusps)}. ev: ${TX.H[A.houseOf(l.lon, nat.houses.cusps)].t} alanında bir kapanış ya da başlangıç.</p>`).join('') || '<p class="muted">Yok.</p>');
    return out;
  }
  function showReport(kind) {
    const p = activeP(); let html = '';
    if (kind === 'syn') html = synReport(p, person(S.partner)); else if (kind === 'sr') html = srReport(p); else if (kind === 'transit') html = transitReport(p); else html = natalReport(p, kind);
    S.report = { kind, html, name: p.name };
    render(); window.scrollTo(0, 0);
  }
  function viewReport() {
    return `<div class="row noprint" style="margin:10px 0;position:sticky;top:0;z-index:5;background:rgba(11,18,38,.85);padding:8px 0;backdrop-filter:blur(8px)"><button class="btn ghost" data-act="closereport">‹ Geri</button><button class="btn" data-act="dlreport">İndir</button><button class="btn ghost" data-act="copyreport">Metni kopyala</button></div><div id="rep">${S.report.html}</div>`;
  }
  async function downloadReport() {
    const css = document.querySelector('style').textContent;
    const logoURI = await fetch('logo-full.jpg').then(r => r.blob()).then(b => new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); })).catch(() => '');
    const body = $('#rep').innerHTML.replace(/src="logo-full\.jpg"/g, `src="${logoURI}"`);
    const doc = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AstroMidas — ${esc(S.report.name)}</title><link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:wght@500;600&family=Manrope:wght@400;600&family=Noto+Sans+Symbols&family=Noto+Sans+Symbols+2&display=swap" rel="stylesheet"><style>${css}
@media print{body{background:#0b1226;-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{break-inside:avoid-page;page-break-after:always}}</style></head><body><div class="app" style="padding-bottom:20px">${body}<p class="noprint small muted" style="text-align:center">PDF için tarayıcıda Yazdır → PDF olarak kaydet.</p></div></body></html>`;
    try { const dl = await claude.use('downloads'); if (dl) { await dl.save({ filename: `AstroMidas-${S.report.name}-${S.report.kind}.html`.replace(/\s+/g, '_'), data: new Blob([doc], { type: 'text/html' }) }); toast('Rapor indirildi'); return; } } catch (e) { }
    try { window.print(); return; } catch (e) { }
    try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([doc], { type: 'text/html' })); a.download = `AstroMidas-${S.report.name}-${S.report.kind}.html`.replace(/\s+/g, '_'); document.body.appendChild(a); a.click(); a.remove(); toast('Rapor indirildi'); return; } catch (e) { }
    toast('İndirme bu görünümde kullanılamıyor; metni kopyalayabilirsiniz');
  }

  /* ---------- Ana çizim ---------- */
  const EXT = { a: { f: 'eph-1800.js', v: 'SEPH_1800', st: 0 }, b: { f: 'eph-2100.js', v: 'SEPH_2100', st: 0 } };
  function needEph() { // 1900–2100 dışı tarihler için ek Swiss Ephemeris verisini gerektiğinde yükle
    const jds = S.people.map(p => { try { return inputOf(p).jd; } catch (e) { return 2451545; } });
    if (S.cycJD) jds.push(S.cycJD);
    const need = [];
    if (jds.some(j => j < 2415030)) need.push('a');
    if (jds.some(j => j > 2488060) || (S.cycJD && S.cycJD > 2488060)) need.push('b');
    for (const k of need) { const e = EXT[k]; if (e.st) continue; e.st = 1; const sc = document.createElement('script'); sc.src = e.f; sc.onload = () => { try { SEPH_API.init(window[e.v]); e.st = 2; AM.cache.clear(); render(); } catch (er) { } }; document.head.appendChild(sc); }
  }
  function accuracyTests() {
    const rows = [], add = (name, got, exp, tol, unit) => { const d = Math.abs(got - exp); rows.push({ name, got, exp, d, ok: d <= tol, unit }); };
    const dt = 59.1 / 86400; // 1992 için ΔT
    const m = A.rawLon('Moon', 2448724.5 - dt); add('Ay boylamı — Meeus örnek 47.a (1992-04-12)', m.lon, 133.167265, 0.003, '°');
    add('Ay enlemi — Meeus örnek 47.a', m.lat, -3.229126, 0.003, '°');
    add('Güneş boylamı — Meeus örnek 25.b (1992-10-13)', A.rawLon('Sun', 2448908.5 - dt).lon, 199.906016, 0.002, '°');
    add('Venüs boylamı — Meeus örnek 33.a (1992-12-20)', A.rawLon('Venus', 2448976.5 - dt).lon, 313.08102, 0.003, '°');
    const ing = (b, y, mo, d, h, mi, t) => add(`${nm(b)} ${t}° geçişi ${d}.${mo}.${y} ${pad(h)}:${pad(mi)} UT`, A.wrap180(A.rawLon(b, A.jdFromUTC(Date.UTC(y, mo - 1, d, h, mi))).lon - t), 0, 0.05, '°');
    ing('Sun', 2025, 3, 20, 9, 1, 0); ing('Jupiter', 2025, 6, 9, 21, 3, 90); ing('Uranus', 2025, 7, 7, 7, 45, 60); ing('Pluto', 2023, 3, 23, 12, 13, 300);
    // Swiss Ephemeris (swetest 2.10) referans değerleri
    const st = B.fixedStars(2451544.5, STARS), g = n => st.find(s => s.n === n).lon;
    add('Regulus 1.1.2000 0h UT — Swiss Ephemeris', g('Regulus'), 149.8289831, 0.0005, '°'); add('Spika 1.1.2000 0h UT — Swiss Ephemeris', g('Spica'), 203.8360799, 0.0005, '°');
    add('Ortalama Lilith 1.1.2000 12h UT — Swiss Ephemeris', A.bodyPos('Lilith', 2451545, {}).lon, 263.4643327, 0.0005, '°');
    add('Gerçek Ay Düğümü 1.1.2000 12h UT — Swiss Ephemeris', A.bodyPos('NNode', 2451545, {}).lon, 123.9540228, 0.0005, '°');
    add('Lahiri sidereal Güneş 1.1.2000 12h UT — Swiss Ephemeris', A.bodyPos('Sun', 2451545, { sidereal: true }).lon, 256.5156960, 0.0005, '°');
    const jI = A.jdFromUTC(Date.UTC(1990, 6, 15, 9, 30)), hI = A.houses(jI, 41.0082, 28.9784, 'P');
    add('Placidus Yükselen, İstanbul 15.7.1990 09:30 UT — Swiss Ephemeris', hI.asc, 191.4342455, 0.0005, '°');
    add('Placidus 11. ev, İstanbul 15.7.1990 09:30 UT — Swiss Ephemeris', hI.cusps[11], 136.7564854, 0.0005, '°');
    add('Ay, 8.4.2024 18:17:20 UT tam Güneş tutulması — Swiss Ephemeris', A.rawLon('Moon', A.jdFromUTC(Date.UTC(2024, 3, 8, 18, 17, 20))).lon, 19.3637249, 0.0005, '°');
    const h0 = A.houses(2451545, 0.0001, 0, 'P'), r0 = A.houses(2451545, 0.0001, 0, 'R');
    add('Placidus = Regiomontanus (ekvatorda) 11. ev', h0.cusps[11], r0.cusps[11], 0.001, '°');
    add('Türkiye saat dilimi 15.07.1990 (yaz saati +3)', A.localToUTC(1990, 7, 15, 12, 0, 'Europe/Istanbul').offsetMin / 60, 3, 0, 'sa');
    add('Türkiye saat dilimi 15.01.1990 (+2)', A.localToUTC(1990, 1, 15, 12, 0, 'Europe/Istanbul').offsetMin / 60, 2, 0, 'sa');
    return rows;
  }
  function render() {
    drawTabs();
    needEph();
    app.className = 'app tab-' + (S.report ? 'rapor' : S.tab);
    try {
      if (S.report) app.innerHTML = viewReport();
      else app.innerHTML = ({ an: viewAn, harita: viewHarita, rezonans: viewRezonans, donguler: viewDonguler, defter: viewDefter, gunluk: () => header() + (window.DAILY ? DAILY.view() : '') }[S.tab] || viewAn)();
    } catch (e) { console.error(e); app.innerHTML = header() + `<div class="card"><p>Bir hesap hatası oluştu: ${esc(e.message)}</p><button class="btn" data-go="defter">Defter</button></div>`; }
    if ($('#f_date')) { formInfo(); }
  }
  window.render = render;

  /* ---------- Olaylar ---------- */
  app.addEventListener('click', e => {
    const t = e.target.closest('[data-sub],[data-go],[data-act],[data-open],[data-edit],[data-del],[data-karto],[data-ret],[data-retloc],[data-cal],[data-settime],[data-delev],[data-harm],[data-notes],[data-delsession]'); if (!t) return;
    if (t.dataset.sub) { const [k, v] = t.dataset.sub.split(':'); S.sub[k] = v; render(); return; }
    if (t.dataset.go) { const [tab, sub] = t.dataset.go.split(':'); S.tab = tab; if (sub) S.sub[tab] = sub; S.report = null; render(); window.scrollTo(0, 0); return; }
    if (t.dataset.open) { S.active = t.dataset.open; S.tab = 'harita'; save(); render(); return; }
    if (t.dataset.edit) { S.form = person(t.dataset.edit); render(); return; }
    if (t.dataset.del) { const p = person(t.dataset.del); if (p && t.dataset.confirm === '1') { S.people = S.people.filter(x => x.id !== p.id); save(); toast('Silindi'); render(); } else { t.dataset.confirm = '1'; t.textContent = 'Emin misiniz? Tekrar dokunun'; } return; }
    if (t.dataset.karto) { const s = new Set(S.kartoSel || ['Sun', 'Moon', 'Venus', 'Mars', 'Jupiter', 'Saturn']); s.has(t.dataset.karto) ? s.delete(t.dataset.karto) : s.add(t.dataset.karto); S.kartoSel = [...s]; render(); return; }
    if (t.dataset.ret) { S.retWhich = t.dataset.ret; render(); return; }
    if (t.dataset.retloc) { S.retLoc = t.dataset.retloc; render(); return; }
    if (t.dataset.cal) { const b = S.calMonth || (() => { const d = new Date(); return [d.getFullYear(), d.getMonth() + 1]; })(); let [y, m] = b; m += +t.dataset.cal; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } S.calMonth = [y, m]; render(); return; }
    if (t.dataset.settime) { const p = activeP(), m = +t.dataset.settime; p.h = Math.floor(m / 60); p.mi = m % 60; save(); toast('Doğum saati güncellendi'); S.sub.harita = 'natal'; render(); return; }
    if (t.dataset.harm) { S.harm = +t.dataset.harm; render(); return; }
    if (t.dataset.notes) { S.notesFor = t.dataset.notes; render(); window.scrollTo(0, 0); return; }
    if (t.dataset.delsession) { const p = person(S.notesFor); p.sessions.splice(+t.dataset.delsession, 1); save(); render(); return; }
    if (t.dataset.delev) { const p = activeP(); p.events.splice(+t.dataset.delev, 1); save(); render(); return; }
    const act = t.dataset.act;
    if (act === 'newperson') { S.form = true; if (S.tab === 'an' || S.tab === 'rezonans') S.tab = 'harita'; render(); }
    else if (act === 'editperson') { S.form = activeP(); render(); }
    else if (act === 'cancelform') { S.form = null; render(); }
    else if (act === 'saveperson') {
      const name = $('#f_name').value.trim() || 'İsimsiz', [y, mo, d] = $('#f_date').value.split('-').map(Number), [h, mi] = ($('#f_time').value || '12:00').split(':').map(Number);
      const lat = parseFloat(String($('#f_lat').value).replace(',', '.')), lon = parseFloat(String($('#f_lon').value).replace(',', '.'));
      if (!y || isNaN(lat) || isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) { toast('Tarih ve koordinatları kontrol edin'); return; }
      const id = $('#f_id').value || 'p' + Date.now().toString(36);
      const old = person(id), rec = { ...(old || {}), id, name, y, mo, d, h, mi, place: $('#f_city').value.trim(), lat, lon, zone: $('#f_zone').value, offsetOverride: $('#f_off').value.trim(), timeAcc: $('#f_acc').value, events: old ? old.events || [] : [] };
      if (old) Object.assign(old, rec); else S.people.push(rec);
      S.active = id; S.form = null; S.tab = 'harita'; S.sub.harita = 'natal'; AM.cache.clear(); save(); toast('Kaydedildi'); render(); window.scrollTo(0, 0);
    }
    else if (act === 'report') showReport(t.dataset.kind);
    else if (act === 'closenotes') { S.notesFor = null; render(); }
    else if (act === 'savenotes') { const p = person(S.notesFor); p.notes = $('#nt_main').value; save(); toast('Notlar kaydedildi'); }
    else if (act === 'addsession') { const p = person(S.notesFor); (p.sessions = p.sessions || []).push({ date: $('#ss_d').value, topic: $('#ss_t').value.trim(), note: $('#ss_n').value.trim() }); save(); toast('Görüşme eklendi'); render(); }
    else if (act === 'closereport') { S.report = null; render(); }
    else if (act === 'dlreport') downloadReport();
    else if (act === 'copyreport') { const txt = $('#rep').innerText; navigator.clipboard.writeText(txt).then(() => toast('Kopyalandı'), () => toast('Kopyalanamadı')); }
    else if (act === 'copybk') navigator.clipboard.writeText($('#bk').value).then(() => toast('Kopyalandı'), () => toast('Kopyalanamadı'));
    else if (act === 'dlbk') { const txt = $('#bk').value, fn = 'AstroMidas-yedek-' + new Date().toISOString().slice(0, 10) + '.json';
      (async () => { try { const dl = await claude.use('downloads'); if (dl) { await dl.save({ filename: fn, data: new Blob([txt], { type: 'application/json' }) }); toast('Yedek indirildi'); return; } } catch (e) { }
        try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'application/json' })); a.download = fn; document.body.appendChild(a); a.click(); a.remove(); toast('Yedek indirildi'); } catch (e) { toast('İndirilemedi; metni kopyalayın'); } })(); }
    else if (act === 'importbk') { try { const v = JSON.parse($('#bk').value); if (Array.isArray(v.people)) { for (const p of v.people) { const ex = S.people.find(x => x.id === p.id); if (!ex) S.people.push(p); else { const seen = new Set((ex.sessions || []).map(x => x.date + '|' + x.topic + '|' + x.note)); for (const x of p.sessions || []) if (!seen.has(x.date + '|' + x.topic + '|' + x.note)) (ex.sessions = ex.sessions || []).push(x); if (!ex.notes && p.notes) ex.notes = p.notes; } } if (v.settings) S.settings = Object.assign({}, S.settings, v.settings); if (v.txo) TXEDIT.importAll(v.txo); save(); toast('İçe aktarıldı'); render(); } } catch (e) { toast('Geçersiz yedek metni'); } }
    else if (act === 'addevent') { const p = activeP(), d = $('#ev_d').value; if (!d) { toast('Tarih seçin'); return; } (p.events = p.events || []).push({ date: d, kind: $('#ev_k').value, label: $('#ev_l').value || 'olay' }); save(); render(); }
    else if (act === 'rectify') {
      const p = activeP(); if (!(p.events || []).length) { toast('Önce olay ekleyin'); return; }
      const tm = s => { const [a, b] = s.split(':').map(Number); return a * 60 + b; };
      const evs = p.events.map(e => { const [y, m, d] = e.date.split('-').map(Number); return { jd: A.jdFromUTC(Date.UTC(y, m - 1, d, 12)), kind: e.kind, label: e.label }; });
      toast('Hesaplanıyor…');
      setTimeout(() => { S.rektRes = { pid: p.id, list: B.rectify({ y: p.y, mo: p.mo, d: p.d, zone: p.zone, lat: +p.lat, lon: +p.lon }, evs, tm($('#rk_a').value), tm($('#rk_b').value), 2, calcSettings()) }; render(); }, 30);
    }
  });
  app.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.pick) { if (t.dataset.pick === 'partner') S.partner = t.value; else S.active = t.value; save(); render(); }
    else if (t.dataset.set) { let v = t.value; if (v === 'true') v = true; else if (v === 'false') v = false; else if (t.dataset.set === 'orbMult') v = +v; S.settings[t.dataset.set] = v; if (t.dataset.set === 'system') { if (v === 'classic') S.settings.hsys = 'W'; if (v === 'modern' && S.settings.hsys === 'W') S.settings.hsys = 'P'; if (v !== 'vedic' && S.settings.zodiac === 'S' && v === 'modern') S.settings.zodiac = 'T'; } AM.cache.clear(); save(); toast('Ayar kaydedildi'); render(); }
    else if (t.id === 'cyc_d') { const [d, tm] = t.value.split('T'), [y, m, dd] = d.split('-').map(Number), [h, mi] = (tm || '12:00').split(':').map(Number); S.cycJD = A.jdFromUTC(A.localToUTC(y, m, dd, h, mi, DEVICE_TZ).ms); render(); }
    else if (t.id === 'hr_d') { S.hourDate = t.value; render(); }
    else if (t.dataset.varga) { S.varga = +t.value; render(); }
    else if (t.id === 'bkfile' && t.files && t.files[0]) { t.files[0].text().then(txt => { $('#bk').value = txt; document.querySelector('[data-act="importbk"]').click(); }); }
    if (['f_date', 'f_time', 'f_zone', 'f_off'].includes(t.id)) formInfo();
  });
  app.addEventListener('input', e => {
    const t = e.target;
    if (t.id === 'f_city' || t.id === 'here_city') {
      const dd = $(t.id === 'f_city' ? '#f_dd' : '#here_dd'), res = citySearch(t.value);
      dd.hidden = !res.length;
      dd.innerHTML = res.map((c, i) => `<div data-city="${i}">${esc(c[0])}, ${esc(c[1])} <span class="muted small">${c[2].toFixed(2)}, ${c[3].toFixed(2)} · ${esc(CITY_TZ[c[4]])}</span></div>`).join('');
      dd._res = res;
    }
    if (['f_date', 'f_time', 'f_off'].includes(t.id)) formInfo();
  });
  app.addEventListener('mousedown', pickCity); app.addEventListener('touchstart', pickCity, { passive: true });
  function pickCity(e) {
    const d = e.target.closest('[data-city]'); if (!d) return;
    const dd = d.parentElement, c = dd._res[+d.dataset.city]; if (!c) return;
    if (dd.id === 'f_dd') { $('#f_city').value = `${c[0]}, ${c[1]}`; $('#f_lat').value = c[2]; $('#f_lon').value = c[3]; $('#f_zone').value = CITY_TZ[c[4]]; formInfo(); }
    else { S.settings.here = { name: c[0], lat: c[2], lon: c[3], zone: CITY_TZ[c[4]] }; save(); toast('Konum kaydedildi'); setTimeout(render, 50); }
    dd.hidden = true;
  }

  const h0 = (location.hash || '').slice(1); if (TABS.some(t => t[0] === h0)) S.tab = h0;
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (TABS.some(t => t[0] === h) && h !== S.tab) { S.tab = h; S.report = null; render(); } });
  render();
})();
