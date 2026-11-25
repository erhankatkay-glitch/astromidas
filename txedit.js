/* AstroMidas — yorum metni düzenleyici: her metin uygulama içinde değiştirilebilir, değişiklikler kalıcıdır */
(function () {
  'use strict';
  const ORIG = JSON.parse(JSON.stringify(TX));
  const KEY = 'am_txo';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const store = o => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } };
  const getP = (obj, path) => path.reduce((o, k) => (o == null ? o : o[k]), obj);
  const setP = (obj, path, val) => { let o = obj; for (let i = 0; i < path.length - 1; i++) { if (o[path[i]] == null) return; o = o[path[i]]; } o[path[path.length - 1]] = val; };
  const parse = s => s.split('|').map(x => (/^\d+$/.test(x) ? +x : x));
  function apply() { const o = load(); for (const [k, val] of Object.entries(o)) setP(TX, parse(k), val); }
  apply();

  const SG = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
  const PN = { Sun: 'Güneş', Moon: 'Ay', Mercury: 'Merkür', Venus: 'Venüs', Mars: 'Mars', Jupiter: 'Jüpiter', Saturn: 'Satürn', Uranus: 'Uranüs', Neptune: 'Neptün', Pluto: 'Plüton', Asc: 'Yükselen', MC: 'MC', NNode: 'Kuzey Düğüm' };
  const pn = k => k.split('-').map(x => PN[x] || x).join('–');
  function catalog() {
    const C = [];
    const arr12 = (key, title, base, off) => C.push({ k: key, n: title, items: Array.from({ length: 12 }, (_, i) => ({ p: [...base, i + (off || 0)], l: off ? (i + 1) + '. ev' : SG[i] })) });
    arr12('SUN', 'Güneş burçlarda', ['SUN']); arr12('MOON', 'Ay burçlarda', ['MOON']); arr12('ASC', 'Yükselen burçlar', ['ASC']); arr12('MC', 'MC burçlarda', ['MC']);
    for (const p of ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) arr12('S' + p, PN[p] + ' burçlarda', ['SIGNTXT', p]);
    for (const p of ['Uranus', 'Neptune', 'Pluto']) arr12('O' + p, PN[p] + ' burçlarda (kuşak)', ['OUTERSIGN', p]);
    for (const p of Object.keys(TX.HOUSETXT)) C.push({ k: 'H' + p, n: PN[p] + ' evlerde', items: Array.from({ length: 12 }, (_, i) => ({ p: ['HOUSETXT', p, i], l: (i + 1) + '. ev' })) });
    arr12('NODE', 'Ay Düğümleri burçlarda', ['NODE']);
    C.push({ k: 'NODEH', n: 'Kuzey Düğüm evlerde', items: Array.from({ length: 12 }, (_, i) => ({ p: ['NODEH', i + 1], l: (i + 1) + '. ev' })) });
    C.push({ k: 'RULERIN', n: 'Harita yöneticisi evlerde', items: Array.from({ length: 12 }, (_, i) => ({ p: ['RULERIN', i + 1], l: (i + 1) + '. ev' })) });
    const three = ['Kavuşum', 'Uyumlu (üçgen/altmışlık)', 'Zorlayıcı (kare/karşıt)'];
    C.push({ k: 'ASP3', n: 'Natal açılar', items: Object.keys(TX.ASP3).flatMap(pair => three.map((t, i) => ({ p: ['ASP3', pair, i], l: pn(pair) + ' · ' + t }))) });
    C.push({ k: 'SYN', n: 'Sinastri temasları', items: Object.keys(TX.SYN).flatMap(pair => three.map((t, i) => ({ p: ['SYN', pair, i], l: pn(pair) + ' · ' + t }))) });
    C.push({ k: 'TRN', n: 'Transitler', items: Object.keys(TX.TRN).flatMap(tr => Object.keys(TX.TRN[tr]).map(nt => ({ p: ['TRN', tr, nt], l: 'Transit ' + PN[tr] + ' → natal ' + (PN[nt] || nt) }))) });
    C.push({ k: 'TRASP', n: 'Transit açı türleri', items: Object.keys(TX.TRASP).map(k => ({ p: ['TRASP', k], l: k })) });
    C.push({ k: 'SRHOUSE', n: 'Solar return: Güneş evlerde', items: Array.from({ length: 12 }, (_, i) => ({ p: ['SRHOUSE', i + 1], l: (i + 1) + '. ev' })) });
    C.push({ k: 'PROFECT', n: 'Profeksiyon yılları', items: Array.from({ length: 12 }, (_, i) => ({ p: ['PROFECT', i + 1], l: (i + 1) + '. ev yılı' })) });
    C.push({ k: 'RETRO', n: 'Retro gezegenler', items: Object.keys(TX.RETRO).map(k => ({ p: ['RETRO', k], l: PN[k] })) });
    C.push({ k: 'PATTERN', n: 'Açı figürleri', items: Object.keys(TX.PATTERN).map(k => ({ p: ['PATTERN', k], l: k })) });
    C.push({ k: 'SHAPE', n: 'Harita şekilleri', items: Object.keys(TX.SHAPE).map(k => ({ p: ['SHAPE', k], l: k })) });
    C.push({ k: 'PHASE', n: 'Ay evreleri (doğum)', items: TX.PHASE.map((x, i) => ({ p: ['PHASE', i, 1], l: x[0] })) });
    C.push({ k: 'DASHA', n: 'Vimşottari daşa dönemleri', items: Object.keys(TX.DASHATXT).map(k => ({ p: ['DASHATXT', k], l: k })) });
    C.push({ k: 'STAR', n: 'Sabit yıldızlar', items: Object.keys(TX.STAR).map(k => ({ p: ['STAR', k, 1], l: k })) });
    return C;
  }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const st = { cat: 'SUN', item: 0, q: '' };
  function view() {
    const C = catalog(), o = load(), cat = C.find(c => c.k === st.cat) || C[0];
    let items = cat.items;
    if (st.q) { const q = st.q.toLocaleLowerCase('tr'); items = C.flatMap(c => c.items.map(it => ({ ...it, l: c.n + ' · ' + it.l }))).filter(it => (it.l + ' ' + getP(TX, it.p)).toLocaleLowerCase('tr').includes(q)).slice(0, 60); }
    const it = items[Math.min(st.item, items.length - 1)] || items[0];
    const key = it ? it.p.join('|') : '', cur = it ? getP(TX, it.p) : '', orig = it ? getP(ORIG, it.p) : '', edited = key in o;
    const nEd = Object.keys(o).length;
    return `<div class="card"><h3 style="margin-top:0">Yorum metinlerini düzenle</h3><p class="small muted">Uygulamadaki her yorum metnini kendi astrolojik bakışınızla değiştirebilirsiniz. Kaydettiğiniz metin bütün ekranlarda ve raporlarda kullanılır; “Orijinale dön” ile eski hâline gelir. Şu an ${nEd} metin düzenlenmiş.</p>
      <label for="txe_q">Metinlerde ara</label><input id="txe_q" value="${esc(st.q)}" placeholder="örn. Satürn, kıskançlık, 7. ev">
      ${st.q ? '' : `<label for="txe_c">Bölüm</label><select id="txe_c">${C.map(c => `<option value="${c.k}" ${c.k === cat.k ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select>`}
      <label for="txe_i">Metin</label><select id="txe_i">${items.map((x, i) => `<option value="${i}" ${x === it ? 'selected' : ''}>${(x.p.join('|') in o) ? '✎ ' : ''}${esc(x.l)}</option>`).join('')}</select>
      ${it ? `<label for="txe_t">${edited ? 'Düzenlenmiş metin' : 'Metin'}</label><textarea id="txe_t" rows="12" data-key="${esc(key)}">${esc(cur)}</textarea>
      <div class="row" style="margin-top:10px"><button class="btn" data-txe="save">Kaydet</button>${edited ? '<button class="btn ghost" data-txe="reset">Orijinale dön</button>' : ''}</div>
      ${edited ? `<details style="margin-top:10px"><summary>Orijinal metin</summary><p class="small">${esc(orig).replace(/\n/g, '<br>')}</p></details>` : ''}` : '<p class="muted">Sonuç yok.</p>'}</div>`;
  }
  function save(key, val) { const o = load(); const path = parse(key); o[key] = val; store(o); setP(TX, path, val); }
  function reset(key) { const o = load(); delete o[key]; store(o); const path = parse(key); setP(TX, path, getP(ORIG, path)); }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-txe]'); if (!b) return;
    const t = document.getElementById('txe_t'); if (!t) return;
    if (b.dataset.txe === 'save') { save(t.dataset.key, t.value); AM.toast('Metin kaydedildi'); }
    else if (b.dataset.txe === 'reset') { reset(t.dataset.key); AM.toast('Orijinal metne dönüldü'); }
    AM.cache.clear(); window.render();
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'txe_c') { st.cat = e.target.value; st.item = 0; window.render(); }
    else if (e.target.id === 'txe_i') { st.item = +e.target.value; window.render(); }
    else if (e.target.id === 'txe_q') { st.q = e.target.value.trim(); st.item = 0; window.render(); }
  });
  window.TXEDIT = { view, load, importAll: o => { store(Object.assign(load(), o || {})); apply(); } };
})();
