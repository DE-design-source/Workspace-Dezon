/* Dezon Workspace — Mua hàng: đơn mua hàng vật tư (Chưa đặt → Đã đặt → Đã nhận), đồng bộ từ bóc tách QS. Tiền: đồng. */

/* ================= dữ liệu mẫu ================= */
SEEDS.push(s => {
  if (!s.qs) s.qs = {projects:[], products:[], po:[], vat:8};
  const L = (p, q) => { const x = s.qs.products.find(y => y.id === p) || {name:p, price:0}; return {p, name:x.name, price:x.price, q}; };
  const O = (code, brand, items, status, due) => ({id:'po-' + code.slice(3), code, qp:'qs1', pid:'riverside', brand, items, status, date:md('2026-09-14'), due:md(due), note:'Từ bóc tách QS-01', billed:false, billId:'',
    orderedAt:status !== 'wait' ? md('2026-09-16') : '', receivedAt:status === 'received' ? md('2026-09-18') : ''});
  s.qs.po = [
    O('PO-001', 'Rạng Đông', [L('p1', 6), L('p5', 7), L('p8', 2)], 'wait', '2026-09-25'),
    O('PO-002', 'MPE', [L('p3', 2), L('p6', 1)], 'ordered', '2026-09-27'),
    O('PO-003', 'Philips', [L('p2', 6)], 'received', '2026-09-18'),
    O('PO-004', 'Hồng Phúc', [L('p7', 1)], 'wait', '2026-10-02'),
    O('PO-005', 'Điện Quang', [L('p4', 2)], 'ordered', '2026-09-24')
  ];
});
syncCol('qs_po', 'array', () => S.qs.po, v => S.qs.po = v, {read:['po','qs','prod'], write:['po','qs','prod'], empty:() => []});

/* ================= tiện ích ================= */
const PO_ST = {wait:['Chưa đặt','gray'], ordered:['Đã đặt','blue'], received:['Đã nhận','green']};
const PO_NEXT = {wait:['ordered','Đánh dấu đã đặt hàng'], ordered:['received','Đã nhận hàng']};
const poEd = () => perm('po') === 'edit';
const poList = () => (S.qs && S.qs.po) || [];
const poSupName = o => o.supplier || o.brand || '—';                                   // đơn từ Sản xuất có thể dùng 'supplier'
const poSt = o => o.status === 'approve' || !PO_ST[o.status] ? 'wait' : o.status;   // dữ liệu cũ có bước "Chờ duyệt" → Chưa đặt
const poProd = id => typeof qsProduct === 'function' ? qsProduct(id) : null;
const poLinePrice = it => it.price != null && it.price !== '' ? +it.price || 0 : (poProd(it.p) || {}).price || 0;
const poLineName = it => it.name || (poProd(it.p) || {}).name || 'Mặt hàng';
const poVal = o => sum(o.items || [], it => poLinePrice(it) * it.q);
const poLate = o => poSt(o) === 'ordered' && !!o.due && daysLeft(o.due) < 0;
const poPending = () => poList().filter(o => poSt(o) === 'wait').length;
const poPName = id => { const p = id && (S.projects || []).find(x => x.id === id); return p ? p.name : '—'; };
const poQs = o => ((S.qs && S.qs.projects) || []).find(x => x.id === o.qp);
const poNextCode = () => 'PO-' + String(Math.max(0, ...poList().map(o => +String(o.code).split('-')[1] || 0)) + 1).padStart(3, '0');
function poNotify(title, text){
  if (typeof botPost !== 'function') return;
  if (typeof notifyPrefs === 'function' && notifyPrefs() && notifyPrefs().po === false) return;
  botPost(title, text, 'yellow', 'Module Mua hàng', 'po', '');
}

/* Gom bóc tách theo thương hiệu (= nhà cung cấp): mỗi NCC một đơn, gộp sản phẩm trùng, không VAT.
   NCC đã có đơn "Chưa đặt" của cùng hồ sơ → cập nhật lại mặt hàng; NCC đã đặt/nhận → bỏ qua. */
function poCreateFromTakeoff(qsProjectId){
  const q = ((S.qs && S.qs.projects) || []).find(x => x.id === qsProjectId);
  if (!q){ toast('Không tìm thấy dự án QS'); return []; }
  const by = {};
  q.rooms.forEach(r => r.items.forEach(it => { const p = poProd(it.p); if (!p) return; const b = by[p.brand] = by[p.brand] || {}; b[p.id] = (b[p.id] || 0) + it.q; }));
  const brands = Object.keys(by);
  if (!brands.length){ toast('Bóc tách ' + q.code + ' chưa có sản phẩm để tạo đơn'); return []; }
  let made = 0, upd = 0, skip = 0; const out = [];
  brands.forEach(b => {
    const items = Object.entries(by[b]).map(([pid, n]) => { const p = poProd(pid); return {p:pid, name:p.name, price:p.price, q:n}; });
    const ex = poList().filter(o => o.qp === q.id && o.brand === b), w = ex.find(o => poSt(o) === 'wait');
    if (w){ w.items = items; w.status = 'wait'; upd++; out.push(w); return; }
    if (ex.length){ skip++; return; }
    const o = {id:uid(), code:poNextCode(), qp:q.id, pid:q.pid || '', brand:b, items, status:'wait', date:todayISO(), due:dayISO(7), note:'Từ bóc tách ' + q.code, billed:false, billId:'', orderedAt:'', receivedAt:''};
    S.qs.po.push(o); out.push(o); made++;
  });
  log(`Tạo ${made} đơn mua hàng từ bóc tách ${q.code}`, 'purple');
  if (made) poNotify('Đơn mua hàng mới', `${made} đơn mua hàng từ bóc tách ${q.code} đang chờ đặt.`);
  render();
  toast(`${q.code}: ${made} đơn mới${upd ? ' · cập nhật ' + upd + ' đơn chưa đặt' : ''}${skip ? ' · bỏ qua ' + skip + ' NCC đã đặt hàng' : ''}`);
  return out;
}

/* ================= trang ================= */
MOD.po = () => {
  const P = poList(), f = ui.poF || 'all', sup = ui.poSup || '', ed = poEd();
  const cnt = k => P.filter(o => poSt(o) === k).length, late = P.filter(poLate);
  const bySup = {}; P.forEach(o => (bySup[poSupName(o)] = bySup[poSupName(o)] || []).push(o));
  const rows = P.filter(o => (f === 'all' || poSt(o) === f) && (!sup || poSupName(o) === sup)).sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.code).localeCompare(String(a.code)));
  const h = head('Mua hàng', 'Đơn mua hàng vật tư — đồng bộ từ bóc tách QS.', `<button class="btn line" data-act="nav" data-v="qs" data-sub="takeoff">Xem bóc tách tại QS ›</button>${ed ? `<button class="btn" data-act="po-new">${ic('plus', 15)}Tạo đơn mua hàng</button>` : ''}`);
  if (!P.length) return h + emptyBox('Chưa có đơn mua hàng', 'Tạo đơn từ bóc tách QS (mỗi nhà cung cấp một đơn) hoặc nhập tay.', ed ? `<button class="btn" data-act="po-new">${ic('plus', 15)}Tạo đơn mua hàng</button>` : '');
  return h + `<div class="stats">
      ${stat('Tổng đơn mua hàng', P.length, 'Trên ' + Object.keys(bySup).length + ' nhà cung cấp')}
      ${stat('Chưa đặt', cnt('wait'), cnt('wait') ? 'Cần đặt hàng trong tuần' : 'Không có đơn chờ đặt', cnt('wait') ? 'bad' : 'good')}
      ${stat('Đã đặt', cnt('ordered'), late.length ? late.length + ' đơn trễ giao' : 'Đang chờ giao', late.length ? 'bad' : '')}
      ${stat('Tổng giá trị', dec(sum(P, poVal) / 1e6, 2) + ' triệu', P.length + ' đơn mua hàng')}
    </div>
    <div class="card pad stack">
      <div class="row between" style="flex-wrap:wrap;gap:8px"><div class="toolbar">${[['all', 'Tất cả'], ...Object.entries(PO_ST).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button class="fchip ${f === k ? 'on' : ''}" data-act="po-f" data-f="${k}">${l}${k !== 'all' ? ' · ' + cnt(k) : ''}</button>`).join('')}${sup ? `<button class="fchip on" data-act="po-sup" data-s="">${esc(sup)} ${ic('x', 12)}</button>` : ''}</div>${ed ? `<button class="btn sm" data-act="po-new">${ic('plus', 14)}Tạo đơn mua hàng</button>` : ''}</div>
      <div class="table-wrap"><table><thead><tr><th>Mã PO</th><th>Nhà cung cấp</th><th>Dự án / QS</th><th class="r">Số mặt hàng</th><th class="r">Tổng giá trị</th><th>Ngày giao dự kiến</th><th>Trạng thái</th></tr></thead><tbody>
        ${rows.map(o => { const qp = poQs(o), lt = poLate(o); return `<tr class="click" data-act="po-open" data-id="${o.id}" tabindex="0"><td class="b num">${esc(o.code)}</td><td>${esc(poSupName(o))}</td><td>${esc(poPName(o.pid))}${qp ? `<div class="small muted">${esc(qp.code)} · ${esc(qp.name)}</div>` : ''}</td><td class="r">${(o.items || []).length}</td><td class="r b">${num(poVal(o))}</td><td class="${lt ? 'late' : ''}">${o.due ? fmtDate(o.due) + (lt ? ' · trễ ' + (-daysLeft(o.due)) + ' ngày' : '') : '—'}</td><td>${pill(...PO_ST[poSt(o)])}${o.billed ? ' ' + pill('Đã lập HĐ chi', 'yellow') : ''}</td></tr>`; }).join('') || '<tr><td colspan="7" class="empty">Không có đơn phù hợp</td></tr>'}
      </tbody></table></div>
    </div>
    <div class="card pad"><h2 class="sec-title">Nhà cung cấp</h2><div class="sup-grid">${Object.entries(bySup).sort((a, b) => sum(b[1], poVal) - sum(a[1], poVal)).map(([b, os]) => { const last = [...os].sort((x, y) => String(y.date).localeCompare(String(x.date)))[0]; return `<button class="sup" data-act="po-sup" data-s="${esc(b)}" title="Lọc đơn của ${esc(b)}" style="${sup === b ? 'border-color:var(--ink)' : ''}"><b>${esc(b)}</b><small>${os.length} đơn · ${PO_ST[poSt(last)][0]}</small><span class="num">${dec(sum(os, poVal) / 1e6, 2)}tr</span></button>`; }).join('')}</div></div>`;
};
ACT['po-f'] = (el, d) => { ui.poF = d.f; render(); };
ACT['po-sup'] = (el, d) => { ui.poSup = ui.poSup === d.s ? '' : d.s; render(); };

/* ================= chi tiết đơn ================= */
ACT['po-open'] = (el, d) => poDetail(d.id);
function poDetail(id){
  const o = poList().find(x => x.id === id); if (!o) return;
  const ed = poEd(), st = poSt(o), next = PO_NEXT[st], qp = poQs(o), dis = ed ? '' : 'disabled';
  const steps = Object.entries(PO_ST).map(([k, v], i) => { const done = Object.keys(PO_ST).indexOf(st) >= i; return `<span class="row" style="gap:6px">${i ? `<span class="muted">${ic('chev', 13)}</span>` : ''}${pill(v[0], done ? v[1] === 'gray' ? 'purple' : v[1] : 'gray')}</span>`; }).join('');
  const canBill = typeof finAddInvoice === 'function';
  const billBox = st !== 'received' ? '' : o.billed ? `<div class="small muted">Đã tạo hoá đơn chi ${esc(o.billId || '')} trong Tài chính.</div>`
    : ed && canBill ? `<div class="card pad row between" style="background:var(--yellow-t);border:0;flex-wrap:wrap;gap:8px"><span class="small">Đã nhận hàng — tạo hoá đơn chi <b>${vnd(poVal(o))}</b> cho ${esc(poSupName(o))} vào Tài chính dự án đang chọn ở trên?</span><button type="button" class="btn sm" data-act="po-bill" data-id="${o.id}">Tạo hoá đơn chi</button></div>` : '';
  showModal(`<form class="modal wide" data-form="po-save" data-id="${o.id}"><h3><span class="row" style="gap:8px">${esc(o.code)} · ${esc(poSupName(o))} ${pill(...PO_ST[st])}</span>${closeBtn()}</h3>
    <div class="sub">Tạo ${o.date ? fmtFull(o.date) : '—'}${o.note ? ' · ' + esc(o.note) : ''}${qp ? ` · <button type="button" class="link" data-act="po-qs" data-id="${qp.id}">Mở bóc tách ${esc(qp.code)} ›</button>` : ''}</div>
    <div class="row" style="flex-wrap:wrap;gap:4px">${steps}</div>
    <div class="row2"><label class="field">Dự án<select id="po-pid" name="pid" ${dis}>${opt([['', '— Không gắn —'], ...(S.projects || []).map(p => [p.id, p.name])], o.pid)}</select></label><label class="field">Ngày giao dự kiến<input id="po-due" type="date" name="due" value="${o.due || ''}" ${dis}></label></div>
    <div class="table-wrap"><table style="min-width:0"><thead><tr><th>Mặt hàng</th><th class="r">SL</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th></tr></thead><tbody>
      ${(o.items || []).map(it => `<tr><td>${esc(poLineName(it))}</td><td class="r">${it.q}${it.unit ? ' ' + esc(it.unit) : ''}</td><td class="r">${num(poLinePrice(it))}</td><td class="r b">${num(poLinePrice(it) * it.q)}</td></tr>`).join('')}
      <tr class="grp"><td colspan="3" class="r">Tổng cộng (không VAT)</td><td class="r">${vnd(poVal(o))}</td></tr></tbody></table></div>
    ${o.orderedAt || o.receivedAt ? `<div class="small muted">${o.orderedAt ? 'Đặt hàng ' + fmtFull(o.orderedAt) : ''}${o.receivedAt ? ' · Nhận hàng ' + fmtFull(o.receivedAt) : ''}${poLate(o) ? ' · <span class="late">trễ giao ' + (-daysLeft(o.due)) + ' ngày</span>' : ''}</div>` : ''}
    ${billBox}
    <div class="m-actions">${ed ? delBtn('po') : ''}${ed && next ? `<button type="button" class="btn ${st === 'ordered' ? 'ok' : 'line'}" data-act="po-next" data-id="${o.id}">${next[1]}</button>` : ''}<button type="button" class="btn ghost" data-act="modal-close">Đóng</button>${ed ? '<button class="btn" type="submit">Lưu</button>' : ''}</div></form>`);
}
// lấy dự án / ngày giao đang sửa trong modal trước khi chuyển trạng thái hoặc tạo hoá đơn
function poTakeForm(el, o){ const f = el.closest('form'); if (!f) return; if (f.pid) o.pid = f.pid.value; if (f.due) o.due = f.due.value; }
FORM['po-save'] = (v, f) => { if (!poEd()) return; const o = poList().find(x => x.id === f.dataset.id); if (!o) return; Object.assign(o, {pid:v.pid || '', due:v.due || ''}); closeModal(); render(); toast('Đã lưu ' + o.code); };
ACT['po-next'] = (el, d) => {
  const o = poList().find(x => x.id === d.id); if (!o || !poEd()) return;
  const nx = PO_NEXT[poSt(o)]; if (!nx) return;
  poTakeForm(el, o);
  o.status = nx[0];
  if (nx[0] === 'ordered') o.orderedAt = todayISO(); else o.receivedAt = todayISO();
  if (nx[0] === 'received' && o.src === 'prod' && typeof prodReceivePO === 'function') prodReceivePO(o);   // nhập kho Sản xuất
  log(`${o.code} · ${poSupName(o)}: ${PO_ST[nx[0]][0]}`, 'purple');
  render(); poDetail(o.id); toast(`${o.code} → ${PO_ST[nx[0]][0]}`);
};
ACT['po-bill'] = (el, d) => {
  const o = poList().find(x => x.id === d.id); if (!o || !poEd() || o.billed) return;
  if (typeof finAddInvoice !== 'function') return toast('Module Tài chính chưa sẵn sàng');
  poTakeForm(el, o);
  if (!o.pid) return toast('Chọn dự án cho đơn trước khi tạo hoá đơn chi');
  const inv = finAddInvoice(o.pid, {kind:'out', partner:poSupName(o), amount:poVal(o), due:dayISO(30), task:'Vật tư — ' + o.code, note:'Từ đơn mua hàng ' + o.code, group:'Vật tư', po:o.code});
  o.billed = true; o.billId = inv && inv.code || '';
  log(`Tạo hoá đơn chi ${o.billId} cho ${o.code}`, 'yellow');
  render(); poDetail(o.id); toast('Đã tạo hoá đơn chi ' + o.billId + ' trong Tài chính');
};
ACT['po-qs'] = (el, d) => { closeModal(); ui.qsCur = d.id; ui.qsRoom = 'all'; nav('qs', 'takeoff'); };
DEL.po = id => { S.qs.po = poList().filter(o => o.id !== id); };

/* ================= tạo đơn ================= */
const poBlankLine = () => ({p:'', name:'', price:'', q:1});
ACT['po-new'] = () => {
  const qps = (S.qs && S.qs.projects) || [];
  ui.poD = {mode:qps.length ? 'qs' : 'manual', qp:(typeof qsCur === 'function' && qsCur() || qps[0] || {}).id || '', brand:'', pid:S.pid || '', due:dayISO(7), note:'', items:[poBlankLine()]};
  poNewModal();
};
function poNewModal(){
  const d = ui.poD, prods = (S.qs && S.qs.products) || [], qps = (S.qs && S.qs.projects) || [];
  const suppliers = [...new Set(prods.map(p => p.brand).concat(poList().map(o => poSupName(o))))];
  let body;
  if (d.mode === 'qs'){
    const q = qps.find(x => x.id === d.qp), by = {};
    if (q) q.rooms.forEach(r => r.items.forEach(it => { const p = poProd(it.p); if (p) by[p.brand] = (by[p.brand] || 0) + p.price * it.q; }));
    body = `<label class="field">Dự án QS (bóc tách)<select id="pn-qp" name="qp" data-change="po-qp">${opt(qps.map(x => [x.id, x.code + ' · ' + x.name]), d.qp)}</select></label>
      <div class="field">Mỗi nhà cung cấp (thương hiệu) một đơn, trạng thái “Chưa đặt”, giá không VAT:
        <div class="stack" style="gap:4px">${Object.entries(by).map(([b, v]) => { const ex = poList().filter(o => q && o.qp === q.id && o.brand === b), note = ex.some(o => poSt(o) === 'wait') ? pill('Cập nhật đơn chưa đặt', 'yellow') : ex.length ? pill('Đã đặt — bỏ qua', 'gray') : pill('Tạo mới', 'green'); return `<div class="row between" style="padding:6px 0;border-bottom:1px solid var(--line)"><b style="font-weight:500;color:var(--ink)">${esc(b)}</b><span class="row">${note}<span class="num" style="color:var(--ink)">${vnd(v)}</span></span></div>`; }).join('') || '<div class="empty">Bóc tách chưa có sản phẩm</div>'}</div></div>`;
  } else {
    body = `<div class="row3"><label class="field">Nhà cung cấp<input id="pn-brand" name="brand" list="pn-sup" required value="${esc(d.brand)}"></label><label class="field">Dự án<select id="pn-pid" name="pid">${opt([['', '— Không gắn —'], ...(S.projects || []).map(p => [p.id, p.name])], d.pid)}</select></label><label class="field">Ngày giao dự kiến<input id="pn-due" type="date" name="due" value="${d.due}"></label></div>
      <datalist id="pn-sup">${suppliers.map(x => `<option value="${esc(x)}">`).join('')}</datalist>
      <div class="field">Mặt hàng (chọn từ danh mục hoặc nhập tay)<div class="stack" style="gap:6px">${d.items.map((it, i) => `<div class="row" style="flex-wrap:wrap;gap:6px">
          <select name="p_${i}" data-change="po-line" data-i="${i}" style="flex:2;min-width:160px;height:38px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink)" aria-label="Sản phẩm">${opt([['', '— Mặt hàng khác —'], ...prods.map(p => [p.id, p.name + ' — ' + p.brand])], it.p)}</select>
          <input id="pn-n${i}" name="n_${i}" value="${esc(it.name)}" placeholder="Tên mặt hàng" style="flex:2;min-width:140px;height:38px;border:1px solid var(--line);border-radius:10px;padding:0 8px;background:var(--card);color:var(--ink)" aria-label="Tên mặt hàng">
          <input id="pn-c${i}" name="c_${i}" type="number" min="0" value="${esc(it.price)}" placeholder="Đơn giá (đ)" style="width:120px;height:38px;border:1px solid var(--line);border-radius:10px;padding:0 8px;background:var(--card);color:var(--ink)" aria-label="Đơn giá">
          <input id="pn-q${i}" name="q_${i}" type="number" min="1" value="${it.q}" style="width:70px;height:38px;border:1px solid var(--line);border-radius:10px;padding:0 8px;background:var(--card);color:var(--ink)" aria-label="Số lượng">
          <button type="button" class="icon-btn sm" data-act="po-line-del" data-i="${i}" aria-label="Xoá dòng">${ic('x', 14)}</button></div>`).join('')}
        <button type="button" class="btn ghost sm" data-act="po-line-add" style="align-self:flex-start">${ic('plus', 13)}Thêm mặt hàng</button></div></div>
      <label class="field">Ghi chú<input id="pn-note" name="note" value="${esc(d.note)}"></label>`;
  }
  showModal(`<form class="modal wide" data-form="po-new"><h3>Tạo đơn mua hàng${closeBtn()}</h3>
    <div class="seg"><button type="button" class="${d.mode === 'qs' ? 'on' : ''}" data-act="po-mode" data-m="qs">Từ bóc tách QS</button><button type="button" class="${d.mode === 'manual' ? 'on' : ''}" data-act="po-mode" data-m="manual">Nhập tay</button></div>
    ${body}
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Tạo đơn</button></div></form>`);
}
function poCollect(){
  const f = document.querySelector('form[data-form="po-new"]'), d = ui.poD; if (!f || d.mode !== 'manual') return;
  const fd = new FormData(f);
  ['brand','pid','due','note'].forEach(k => { if (fd.has(k)) d[k] = fd.get(k); });
  d.items = d.items.map((it, i) => ({p:fd.get('p_' + i) || '', name:fd.get('n_' + i) || '', price:fd.get('c_' + i) || '', q:Math.max(1, Math.round(+fd.get('q_' + i) || 1))}));
}
ACT['po-mode'] = (el, d) => { poCollect(); ui.poD.mode = d.m; poNewModal(); };
CHG['po-qp'] = el => { ui.poD.qp = el.value; poNewModal(); };
CHG['po-line'] = el => {
  const p = poProd(el.value), i = el.dataset.i;
  if (p){ $('#pn-n' + i).value = p.name; $('#pn-c' + i).value = p.price; const b = $('#pn-brand'); if (b && !b.value) b.value = p.brand; }
};
ACT['po-line-add'] = () => { poCollect(); ui.poD.items.push(poBlankLine()); poNewModal(); };
ACT['po-line-del'] = (el, d) => { poCollect(); ui.poD.items.splice(+d.i, 1); if (!ui.poD.items.length) ui.poD.items.push(poBlankLine()); poNewModal(); };
FORM['po-new'] = v => {
  if (!poEd()) return;
  const d = ui.poD;
  if (d.mode === 'qs'){ const made = poCreateFromTakeoff(v.qp || d.qp); if (made.length) closeModal(); return; }
  poCollect();
  const items = d.items.filter(it => String(it.name).trim()).map(it => ({p:it.p || '', name:String(it.name).trim(), price:Math.max(0, Math.round(+it.price || 0)), q:it.q}));
  if (!d.brand.trim()) return toast('Nhập nhà cung cấp');
  if (!items.length) return toast('Thêm ít nhất một mặt hàng');
  const o = {id:uid(), code:poNextCode(), qp:'', pid:d.pid || '', brand:d.brand.trim(), items, status:'wait', date:todayISO(), due:d.due || '', note:d.note.trim(), billed:false, billId:'', orderedAt:'', receivedAt:''};
  S.qs.po.push(o);
  log('Tạo đơn mua hàng ' + o.code + ' · ' + poSupName(o), 'purple'); poNotify('Đơn mua hàng mới', `${o.code} · ${poSupName(o)} (${vnd(poVal(o))}) đang chờ đặt.`);
  closeModal(); render(); toast('Đã tạo ' + o.code + ' — Chưa đặt');
};

/* ================= tìm nhanh & trợ lý ================= */
SEARCH.push(hit => poList().filter(o => hit(o.code + ' ' + poSupName(o))).map(o => ({icon:'cart', label:o.code + ' · ' + poSupName(o), sub:'Mua hàng · ' + PO_ST[poSt(o)][0] + ' · ' + vnd(poVal(o)), run:() => { nav('po'); poDetail(o.id); }})));
AI.push({re:/đơn mua|mua hàng|nhà cung cấp|chưa đặt|đơn trễ|giao trễ|\bpo\b/, fn:() => {
  const P = poList(); if (!P.length) return 'Chưa có đơn mua hàng nào.';
  const wait = P.filter(o => poSt(o) === 'wait'), late = P.filter(poLate);
  return `Có <b>${P.length}</b> đơn mua hàng, tổng ${vnd(sum(P, poVal))}. ${wait.length ? `<b>${wait.length} đơn chưa đặt</b>:` + list(wait.map(o => `${esc(o.code)} · ${esc(poSupName(o))} · ${vnd(poVal(o))}`)) : 'Không có đơn chưa đặt. '}`
    + (late.length ? `Đơn trễ giao:` + list(late.map(o => `${esc(o.code)} · ${esc(poSupName(o))} — hẹn ${fmtDate(o.due)}, trễ ${-daysLeft(o.due)} ngày`)) : 'Không có nhà cung cấp giao trễ. ') + '<button class="link" data-act="nav" data-v="po">Mở Mua hàng ›</button>';
}});
