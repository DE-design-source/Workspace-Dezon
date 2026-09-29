/* Dezon Workspace — Sản xuất (xưởng mộc): đơn sản xuất 13 công đoạn, kanban, kho vật tư, nhân công, máy móc. */

/* ================= hằng số ================= */
const PROD_ST = [
  ['doVe', 'Đo vẽ hiện trạng', 'gray'], ['banVe', 'Lên bản vẽ sản xuất', 'blue'], ['catTam', 'Cắt tấm', 'orange'],
  ['lapDatXuong', 'Lắp đặt tại xưởng', 'brown'], ['qcXuong', 'QC xưởng', 'purple'], ['dongGoiGiao', 'Đóng gói & giao hàng', 'yellow'],
  ['nhanHang', 'Nhận hàng', 'blue'], ['vanChuyen', 'Vận chuyển lên công trình', 'orange'], ['lapDatCT', 'Lắp đặt tại công trình', 'brown'],
  ['qcCT', 'QC công trình', 'purple'], ['defect', 'Defect', 'red'], ['nghiemThu', 'Nghiệm thu', 'pink'], ['hoanThanh', 'Hoàn thành', 'green']];
const prodSt = k => PROD_ST.find(s => s[0] === k) || PROD_ST[0];
const PROD_PRI = {high:['Cao', 'red'], med:['TB', 'orange'], low:['Thấp', 'gray']};
const PROD_CAT = {goTuNhien:'Gỗ tự nhiên', goCN:'Gỗ CN', vatTuPhu:'Vật tư phụ'};
const PROD_WS = {working:['Đang làm việc', 'green'], off:['Nghỉ phép', 'gray']};
const PROD_MS = {ok:['Hoạt động tốt', 'green'], maintenance:['Đang bảo trì', 'orange'], broken:['Hỏng — cần sửa', 'red']};
const PROD_GROUPS = [['all', 'Tất cả'], ['chuanBi', 'Chuẩn bị'], ['dangSanXuat', 'Đang sản xuất'], ['hoanThanh', 'Hoàn thành'], ['late', 'Trễ tiến độ']];
const PROD_PO_OPEN = s => !['received', 'done', 'cancel', 'cancelled'].includes(s);

/* ================= dữ liệu mẫu ================= */
SEEDS.push(s => {
  ensurePeople(s, [
    {id:slug('Văn Thanh'), name:'Văn Thanh', role:'Thợ mộc', team:'Tổ lắp ráp', c:'brown'},
    {id:slug('Minh Hải'), name:'Minh Hải', role:'Thợ mộc', team:'Tổ cắt & gia công', c:'orange'},
    {id:slug('Thành Huy'), name:'Thành Huy', role:'Thợ mộc', team:'Tổ hoàn thiện', c:'green'},
    {id:slug('Quốc Bảo'), name:'Quốc Bảo', role:'Thợ sơn', team:'Tổ sơn', c:'blue'},
    {id:slug('Đình Phong'), name:'Đình Phong', role:'Thợ mộc', team:'Tổ cắt & gia công', c:'yellow'}]);
  const mon = md('2026-09-21').slice(0, 7);
  const W = (name, team, status, done) => ({id:slug(name), name, pid:slug(name), team, status, done:{[mon]:done}});
  s.prod_workers = [W('Văn Thanh', 'Tổ lắp ráp', 'working', 6), W('Minh Hải', 'Tổ cắt & gia công', 'working', 4), W('Thành Huy', 'Tổ hoàn thiện', 'working', 4), W('Quốc Bảo', 'Tổ sơn', 'working', 7), W('Đình Phong', 'Tổ cắt & gia công', 'off', 3)];
  const Mt = (id, name, type, cat, qty, min, unit, supplier, price) => ({id, name, type, cat, qty, min, unit, supplier, price, moves:[]});
  s.prod_materials = [
    Mt('m-occho', 'Gỗ óc chó (tấm)', 'Gỗ tấm', 'goTuNhien', 4, 15, 'tấm', 'Gỗ Tài Nguyên', 3500000),
    Mt('m-soi', 'Gỗ sồi (tấm)', 'Gỗ tấm', 'goTuNhien', 18, 10, 'tấm', 'Gỗ Tài Nguyên', 2200000),
    Mt('m-thong', 'Gỗ thông (thanh)', 'Gỗ thanh', 'goTuNhien', 120, 50, 'thanh', 'Lâm sản Miền Đông', 180000),
    Mt('m-mdf', 'Ván MDF phủ Melamine', 'Ván công nghiệp', 'goCN', 32, 15, 'tấm', 'An Cường', 650000),
    Mt('m-pu', 'Sơn PU bóng (thùng 5L)', 'Sơn - hoá chất', 'vatTuPhu', 3, 8, 'thùng', 'Sơn Đức Việt', 1450000),
    Mt('m-keo', 'Keo dán gỗ Titebond', 'Sơn - hoá chất', 'vatTuPhu', 6, 5, 'thùng', 'Sơn Đức Việt', 950000),
    Mt('m-banle', 'Bản lề giảm chấn', 'Phụ kiện', 'vatTuPhu', 340, 100, 'bộ', 'Hafele VN', 85000),
    Mt('m-ray', 'Ray trượt ngăn kéo', 'Phụ kiện', 'vatTuPhu', 85, 100, 'bộ', 'Hafele VN', 210000)];
  const O = (n, name, customer, qty, stage, workers, due, priority, progress, late, extra = {}) => ({id:'sx' + n, code:'SX-' + String(n).padStart(3, '0'), name, customer, pid:'', qty, stage, workers, due:md(due), priority, progress, late, note:'', bom:[], comments:[], created:md('2026-09-01'), doneAt:null, ...extra});
  s.prod_orders = [
    O(1, 'Tủ bếp gỗ óc chó', 'KH: Nguyễn Văn A', 1, 'lapDatXuong', ['Văn Thanh'], '2026-09-30', 'high', 65, false, {bom:[{m:'m-occho', q:6}, {m:'m-banle', q:12}, {m:'m-ray', q:8}],
      comments:[{id:'c1', by:'van-thanh', name:'Văn Thanh', text:'Đã lắp xong khung tủ dưới, chờ gỗ óc chó để làm cánh. @Trần Anh anh xem giúp đợt nhập gỗ nhé.', t:Date.now() - 3 * 36e5}]}),
    O(2, 'Bộ bàn ghế ăn 6 ghế', 'KH: Trần Thị B', 1, 'qcXuong', ['Minh Hải'], '2026-09-22', 'high', 80, true, {bom:[{m:'m-soi', q:4}, {m:'m-pu', q:2}]}),
    O(3, 'Cửa gỗ tự nhiên 2 cánh', 'DA: Riverside GĐ2', 4, 'catTam', ['Minh Hải'], '2026-09-28', 'med', 30, false, {pid:'riverside', bom:[{m:'m-soi', q:8}, {m:'m-pu', q:2}]}),
    O(4, 'Kệ tivi phòng khách', 'KH: Lê Văn C', 1, 'banVe', ['Thành Huy'], '2026-10-05', 'low', 5, false, {bom:[{m:'m-mdf', q:3}]}),
    O(5, 'Giường ngủ gỗ sồi', 'KH: Phạm D', 1, 'dongGoiGiao', ['Văn Thanh', 'Quốc Bảo'], '2026-09-25', 'med', 95, false),
    O(6, 'Tủ quần áo 4 cánh', 'KH: Hoàng E', 1, 'lapDatXuong', ['Thành Huy'], '2026-10-03', 'med', 55, false, {bom:[{m:'m-mdf', q:6}, {m:'m-banle', q:8}, {m:'m-ray', q:4}]}),
    O(7, 'Bàn trà mặt kính gỗ', 'KH lẻ: Vũ F', 2, 'hoanThanh', ['Minh Hải'], '2026-09-18', 'low', 100, false, {doneAt:md('2026-09-18')})];
  const Mc = (id, name, status, last, next) => ({id, name, status, last:last ? md(last) : '', next:next ? md(next) : '', note:''});
  s.prod_machines = [
    Mc('mc1', 'Máy cưa CNC', 'ok', '2026-09-01', '2026-12-01'), Mc('mc2', 'Máy bào 4 mặt', 'ok', '2026-08-15', '2026-11-15'),
    Mc('mc3', 'Máy phun sơn', 'maintenance', '2026-09-20', ''), Mc('mc4', 'Máy chà nhám thùng', 'ok', '2026-09-10', '2026-12-10'),
    Mc('mc5', 'Máy khoan ngang CNC', 'broken', '', ''), Mc('mc6', 'Máy nén khí', 'ok', '2026-09-05', '2026-12-05')];
});
syncCol('prod_orders', 'array', () => S.prod_orders, v => S.prod_orders = v, {read:['prod'], write:['prod'], empty:() => []});
syncCol('prod_materials', 'array', () => S.prod_materials, v => S.prod_materials = v, {read:['prod'], write:['prod'], empty:() => []});
syncCol('prod_workers', 'array', () => S.prod_workers, v => S.prod_workers = v, {read:['prod'], write:['prod'], empty:() => []});
syncCol('prod_machines', 'array', () => S.prod_machines, v => S.prod_machines = v, {read:['prod'], write:['prod'], empty:() => []});

/* ================= tính toán ================= */
const PX = () => { ['prod_orders', 'prod_materials', 'prod_workers', 'prod_machines'].forEach(k => { if (!Array.isArray(S[k])) S[k] = []; }); return S; };
const prodEdit = () => perm('prod') === 'edit';
const prodOrder = id => PX().prod_orders.find(o => o.id === id);
const prodMat = id => PX().prod_materials.find(m => m.id === id);
const prodDone = o => o.stage === 'hoanThanh';
const prodLateDays = o => o.due ? Math.max(0, -daysLeft(o.due)) : 0;
const prodLate = o => !prodDone(o) && (!!o.late || prodLateDays(o) > 0);
const prodGroup = o => prodLate(o) ? 'late' : ['doVe', 'banVe'].includes(o.stage) ? 'chuanBi' : prodDone(o) ? 'hoanThanh' : 'dangSanXuat';
const prodMonth = (off = 0) => { const d = today0(); d.setDate(1); d.setMonth(d.getMonth() + off); return iso(d).slice(0, 7); };
const prodWorkerActive = w => PX().prod_orders.filter(o => !prodDone(o) && (o.workers || []).includes(w.name)).length;
const prodWorkerDone = (w, mon = prodMonth()) => ((w.done || {})[mon] || 0) + PX().prod_orders.filter(o => o.doneAt && o.doneAt.slice(0, 7) === mon && (o.workers || []).includes(w.name)).length;
const prodLow = m => m.qty < m.min;
const prodNeed = m => sum(PX().prod_orders.filter(o => !prodDone(o)), o => sum((o.bom || []).filter(b => b.m === m.id), b => b.q));
const prodUsers = m => PX().prod_orders.filter(o => !prodDone(o) && (o.bom || []).some(b => b.m === m.id));
const prodStockValue = () => sum(PX().prod_materials, m => m.qty * (m.price || 0));
const prodPOs = () => (S.qs && Array.isArray(S.qs.po) ? S.qs.po : []);
const prodPendingPOs = () => prodPOs().filter(p => p.src === 'prod' && PROD_PO_OPEN(p.status));
function prodAlerts(){
  const out = [];
  PX().prod_orders.filter(prodLate).forEach(o => { const n = prodLateDays(o); out.push({c:'red', title:`${o.code} trễ ${n ? n + ' ngày' : 'tiến độ'}`, text:`${o.name} — đang ${prodSt(o.stage)[1]}`, act:'px-open', id:o.id}); });
  PX().prod_materials.forEach(m => {
    const need = prodNeed(m), users = prodUsers(m);
    if (!prodLow(m) && need <= m.qty) return;
    out.push({c:'orange', title:`${m.name} ${prodLow(m) ? 'sắp hết' : 'không đủ cho đơn'}`, text:`Còn ${num(m.qty)} ${m.unit}${need > m.qty ? ` (cần ${num(need)})` : ''}${users.length ? ' — ảnh hưởng ' + users.map(o => o.code).join(', ') : ''}`, act:'px-mat', id:m.id});
  });
  PX().prod_machines.forEach(mc => {
    if (mc.status === 'broken') out.push({c:'red', title:`${mc.name} hỏng`, text:'Cần kỹ thuật viên xử lý gấp', act:'px-mc', id:mc.id});
    else if (mc.status === 'ok' && mc.next && daysLeft(mc.next) < 0) out.push({c:'yellow', title:`${mc.name} quá hạn bảo trì`, text:`Kế hoạch bảo trì ${fmtFull(mc.next)}`, act:'px-mc', id:mc.id});
  });
  return out;
}
const prodNextCode = () => 'SX-' + String(Math.max(0, ...PX().prod_orders.map(o => +String(o.code).split('-')[1] || 0)) + 1).padStart(3, '0');
function prodSetStage(o, st){
  if (!o || o.stage === st || !PROD_ST.some(s => s[0] === st)) return;
  const was = o.stage; o.stage = st;
  if (st === 'hoanThanh'){ o.progress = 100; o.late = false; o.doneAt = todayISO(); }
  else if (was === 'hoanThanh') o.doneAt = null;
  log(`${o.code}: chuyển sang “${prodSt(st)[1]}”`, 'brown');
}
const prodAv = (name, s = 26) => { const p = personByName(name); return p ? av(p.id, s) : `<span class="av" title="${esc(name)}" style="width:${s}px;height:${s}px;font-size:${Math.round(s * .38)}px;background:var(--gray)">${esc(initials(name || '?'))}</span>`; };
const prodPri = k => { const [l, c] = PROD_PRI[k] || PROD_PRI.med; return `<span class="row" style="gap:6px"><span class="dot" style="--c:${cv(c)}"></span>${l}</span>`; };
const prodStPill = k => { const [, l, c] = prodSt(k); return pill(l, c); };
const prodDue = o => prodLate(o) ? `<b style="color:var(--red)">Trễ · ${fmtDate(o.due)}</b>` : fmtDate(o.due);
const prodProjName = pid => pid && typeof proj === 'function' && proj(pid) ? proj(pid).name : '';
const prodMentionNames = () => [...new Set(PX().prod_workers.map(w => w.name).concat(allPeople().map(p => p.name)))];
function prodCmText(t){
  let s = esc(t); const found = [];
  prodMentionNames().sort((a, b) => b.length - a.length).forEach(n => { const k = esc('@' + n); if (s.includes(k)){ s = s.split(k).join('\u0000' + found.length + '\u0000'); found.push(n); } });
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<span class="pill purple">@${esc(found[+i])}</span>`);
}

/* ================= trang ================= */
MOD.prod = () => {
  PX();
  const tab = sub('prod', 'overview'), ed = prodEdit();
  const html = {overview:prodOverview, orders:prodOrdersTab, flow:prodFlow, stock:prodStock, workers:prodWorkers, machines:prodMachines}[tab] || prodOverview;
  return head('Sản xuất', 'Quản lý sản xuất xưởng mộc — đơn hàng qua 13 công đoạn từ xưởng đến công trình.', ed ? `<button class="btn" data-act="px-new">${ic('plus', 15)}Tạo đơn sản xuất</button>` : '')
    + subtabs('prod', [['overview', 'Tổng quan'], ['orders', 'Đơn sản xuất', S.prod_orders.filter(prodLate).length || ''], ['flow', 'Quy trình'], ['stock', 'Kho vật tư', S.prod_materials.filter(prodLow).length || ''], ['workers', 'Nhân công'], ['machines', 'Máy móc']], 'overview')
    + html();
};

function prodOverview(){
  const O = S.prod_orders, active = O.filter(o => !prodDone(o)), W = S.prod_workers;
  const cust = new Set(active.map(o => o.pid || o.customer)).size;
  const doneM = O.filter(o => o.doneAt && o.doneAt.slice(0, 7) === prodMonth()).length, doneP = O.filter(o => o.doneAt && o.doneAt.slice(0, 7) === prodMonth(-1)).length;
  const busy = W.filter(w => w.status === 'working' && prodWorkerActive(w) > 0).length;
  const lateN = O.filter(prodLate).length, low = S.prod_materials.filter(prodLow);
  const diff = doneM - doneP;
  const stats = `<div class="stats">
    ${stat('Đơn đang sản xuất', active.length, `Trên ${cust} khách hàng & dự án`)}
    ${stat('Hoàn thành tháng này', doneM, `${diff >= 0 ? '+' : ''}${diff} so với tháng trước`, diff >= 0 ? 'good' : 'bad')}
    ${stat('Công suất xưởng', W.length ? Math.round(busy / W.length * 100) + '%' : '—', `${busy}/${W.length} thợ đang có việc`)}
    ${stat('Trễ tiến độ', lateN, lateN ? 'Cần xử lý ngay' : 'Không có đơn trễ', lateN ? 'bad' : 'good')}
    ${stat('Giá trị tồn kho', trd(prodStockValue() / 1e6), low.length ? `${low.length} mặt hàng sắp hết` : 'Đủ định mức', low.length ? 'bad' : 'good')}</div>`;
  const stages = PROD_ST.map(([k, l, c]) => { const n = O.filter(o => o.stage === k).length; return `<div class="px-srow"><span class="ell">${l}</span><small>${n} đơn</small></div>${bar(O.length ? n / O.length * 100 : 0, cv(c))}`; }).join('');
  const pri = O.filter(o => o.priority === 'high' && !prodDone(o)).map(o => `<button class="li" data-act="px-open" data-id="${o.id}">${prodAv((o.workers || [])[0], 30)}<span class="ell"><b>${esc(o.code)} — ${esc(o.name)}</b><small>${esc(o.customer)}</small></span><span class="end">${prodLate(o) ? pill('Trễ', 'red') : pill('Giao ' + fmtDate(o.due), 'gray')}</span></button>`).join('') || '<div class="small muted" style="padding:8px 12px">Không có đơn ưu tiên cao nào.</div>';
  const al = prodAlerts();
  const alerts = al.map(a => `<button class="li" data-act="${a.act}" data-id="${a.id}"><span class="sq" style="--c:${cv(a.c)};--t:${ct(a.c)};width:30px;height:30px">${ic('alert', 15)}</span><span class="ell"><b>${esc(a.title)}</b><small>${esc(a.text)}</small></span></button>`).join('') || '<div class="small muted" style="padding:8px 12px">Không có cảnh báo — xưởng đang ổn.</div>';
  const teams = {}; W.forEach(w => { teams[w.team] = (teams[w.team] || 0) + prodWorkerDone(w); });
  const tmax = Math.max(1, ...Object.values(teams));
  const prodTeams = Object.entries(teams).sort((a, b) => b[1] - a[1]).map(([t, n]) => `<div class="px-srow"><span class="ell">${esc(t)}</span><small>${n} SP/tháng</small></div>${bar(n / tmax * 100, cv('brown'), 'thick')}`).join('') || '<div class="small muted">Chưa có thợ.</div>';
  if (!O.length && !S.prod_materials.length && !W.length) return stats + emptyBox('Chưa có dữ liệu sản xuất', 'Tạo đơn sản xuất đầu tiên, thêm vật tư và thợ xưởng để bắt đầu theo dõi.', prodEdit() ? `<button class="btn" data-act="px-new">${ic('plus', 15)}Tạo đơn sản xuất</button>` : '');
  return stats + `<div class="grid-3-2">
    <div class="card pad"><div class="sec-title">Tiến độ theo công đoạn<button class="link" data-act="sub" data-view="prod" data-k="flow">Mở quy trình ›</button></div><div class="stack" style="gap:6px">${stages}</div>
      <div class="sec-title" style="margin-top:20px">Đơn ưu tiên hôm nay</div><div class="stack" style="gap:2px">${pri}</div></div>
    <div class="stack" style="gap:12px">
      <div class="card list-card"><div class="sec-title">Cảnh báo cần xử lý ${al.length && typeof botPost === 'function' ? `<button class="link" data-act="px-alert-chat">Gửi lên Chat ›</button>` : ''}</div>${alerts}</div>
      <div class="card pad"><div class="sec-title">Năng suất theo tổ</div><div class="stack" style="gap:6px">${prodTeams}</div></div>
    </div></div>`;
}

function prodOrdersTab(){
  const f = ui.pxFilt || 'all', O = S.prod_orders;
  const rows = O.filter(o => f === 'all' || prodGroup(o) === f);
  const chips = PROD_GROUPS.map(([k, l]) => `<button class="fchip ${f === k ? 'on' : ''}" data-act="px-filt" data-f="${k}">${l} <span class="muted">${k === 'all' ? O.length : O.filter(o => prodGroup(o) === k).length}</span></button>`).join('');
  if (!O.length) return emptyBox('Chưa có đơn sản xuất', 'Bấm “Tạo đơn sản xuất” để thêm đơn đầu tiên.', prodEdit() ? `<button class="btn" data-act="px-new">${ic('plus', 15)}Tạo đơn sản xuất</button>` : '');
  return `<div class="toolbar">${chips}</div><div class="table-wrap"><table><thead><tr><th>Mã đơn</th><th>Sản phẩm</th><th>Khách hàng / Dự án</th><th class="r">SL</th><th>Công đoạn</th><th>Phụ trách</th><th>Tiến độ</th><th>Giao hàng</th><th>Ưu tiên</th></tr></thead><tbody>
    ${rows.map(o => `<tr class="click" data-act="px-open" data-id="${o.id}" tabindex="0"><td class="b px-code">${esc(o.code)}</td><td>${esc(o.name)} <span class="muted">×${o.qty}</span></td><td>${esc(o.customer)}${prodProjName(o.pid) ? `<small class="muted" style="display:block">${esc(prodProjName(o.pid))}</small>` : ''}</td><td class="r">${o.qty}</td><td>${prodStPill(o.stage)}</td><td>${esc((o.workers || []).join(', '))}</td><td style="min-width:120px"><div class="row" style="gap:8px"><div style="flex:1">${bar(o.progress, cv(prodSt(o.stage)[2]))}</div><small>${o.progress}%</small></div></td><td>${prodDue(o)}</td><td>${prodPri(o.priority)}</td></tr>`).join('') || '<tr><td colspan="9" class="empty">Không có đơn trong nhóm này</td></tr>'}
  </tbody></table></div>`;
}

function prodFlow(){
  const ed = prodEdit();
  return `<div class="sec-title" style="margin:0">Quy trình sản xuất<span class="small muted" style="font-weight:400">${ed ? 'Kéo thẻ để đổi công đoạn, hoặc bấm vào thẻ để xem chi tiết & bình luận.' : 'Bấm vào thẻ để xem chi tiết & bình luận.'}</span></div>
  <div class="board px-board">${PROD_ST.map(([k, l, c]) => { const list = S.prod_orders.filter(o => o.stage === k); return `<div class="col" data-drop="pxo:${k}"><div class="col-h"><span class="dot" style="--c:${cv(c)}"></span><span class="ell">${l}</span><span class="n">${list.length}</span></div>
    ${list.map(o => { const w = o.workers || [], n = (o.comments || []).length; return `<div class="tcard" ${ed ? `draggable="true" data-drag="pxo:${o.id}"` : ''} data-act="px-open" data-id="${o.id}" tabindex="0"><small class="px-code muted">${esc(o.code)}</small><div class="ttitle">${esc(o.name)}</div><small class="muted ell">${esc(o.customer)}</small>${bar(o.progress, cv(c))}
      <div class="tfoot"><span class="row" style="gap:4px">${prodAv(w[0], 22)}${w.length > 1 ? `<span class="pill gray">+${w.length - 1}</span>` : ''}</span>${n ? `<span class="row" style="gap:3px">${ic('chat', 13)}${n}</span>` : ''}<span style="margin-left:auto;${prodLate(o) ? 'color:var(--red);font-weight:600' : ''}">${prodLate(o) ? 'Trễ tiến độ' : 'Giao ' + fmtDate(o.due)}</span></div></div>`; }).join('')}</div>`; }).join('')}</div>`;
}

function prodStock(){
  const f = ui.pxCat || 'all', M = S.prod_materials, ed = prodEdit(), low = M.filter(prodLow), pos = prodPendingPOs();
  const stats = `<div class="stats">${stat('Tổng giá trị tồn kho', trd(prodStockValue() / 1e6), `${M.length} nhóm nguyên vật liệu`)}
    ${stat('Mặt hàng sắp hết', low.length, low.length ? esc(low.map(m => m.name).join(', ')) : 'Không có', low.length ? 'bad' : 'good')}
    ${stat('Đơn nhập hàng đang chờ', pos.length, canSee('po') ? `<button class="link" data-act="nav" data-v="po">Xem tại Mua hàng ›</button>` : 'Đơn mua bổ sung kho xưởng')}</div>`;
  const rows = M.filter(m => f === 'all' || m.cat === f);
  const po = m => { const p = m.po && prodPOs().find(x => x.id === m.po); return p && PROD_PO_OPEN(p.status) ? p : null; };
  return stats + `<div class="toolbar">${[['all', 'Tất cả']].concat(Object.entries(PROD_CAT)).map(([k, l]) => `<button class="fchip ${f === k ? 'on' : ''}" data-act="px-cat" data-f="${k}">${l}</button>`).join('')}
    ${ed ? `<span style="flex:1"></span><button class="btn ok sm" data-act="px-stock" data-mode="in">${ic('plus', 14)}Nhập kho</button><button class="btn danger sm" data-act="px-stock" data-mode="out">${ic('minus', 14)}Xuất kho</button><button class="btn line sm" data-act="px-mat">${ic('plus', 14)}Vật tư mới</button>` : ''}</div>
  ${M.length ? `<div class="table-wrap"><table><thead><tr><th>Vật tư</th><th>Loại</th><th class="r">Tồn kho</th><th class="r">Định mức tối thiểu</th><th class="r">Giá trị</th><th>Nhà cung cấp</th><th>Trạng thái</th></tr></thead><tbody>
    ${rows.map(m => { const p = po(m), need = prodNeed(m); return `<tr class="click" data-act="px-mat" data-id="${m.id}" tabindex="0"><td class="b">${esc(m.name)}${need ? `<small class="muted" style="display:block;font-weight:400">Đơn đang cần ${num(need)} ${esc(m.unit)}</small>` : ''}</td><td>${esc(m.type)}</td><td class="r" ${prodLow(m) ? 'style="color:var(--red);font-weight:600"' : ''}>${num(m.qty)} ${esc(m.unit)}</td><td class="r">${num(m.min)} ${esc(m.unit)}</td><td class="r">${m.price ? trd(m.qty * m.price / 1e6) : '—'}</td><td>${esc(m.supplier)}</td>
      <td><div class="row" style="gap:6px">${prodLow(m) ? pill('Sắp hết', 'red') : pill('Đủ dùng', 'green')}${p ? pill('Đã đặt ' + p.code, 'blue') : prodLow(m) && ed ? `<button class="btn line sm" data-act="px-po" data-id="${m.id}">${ic('cart', 13)}Đặt mua</button>` : ''}</div></td></tr>`; }).join('') || '<tr><td colspan="7" class="empty">Không có vật tư trong nhóm này</td></tr>'}
  </tbody></table></div>` : emptyBox('Kho vật tư trống', 'Thêm vật tư để theo dõi tồn kho và định mức.', ed ? `<button class="btn" data-act="px-mat">${ic('plus', 15)}Vật tư mới</button>` : '')}`;
}

function prodWorkers(){
  const W = S.prod_workers, working = W.filter(w => w.status === 'working').length, done = sum(W, w => prodWorkerDone(w)), teams = new Set(W.map(w => w.team)).size;
  const stats = `<div class="stats">${stat('Tổng thợ xưởng', W.length, `${teams} tổ sản xuất`)}
    ${stat('Đang có việc', W.filter(w => w.status === 'working' && prodWorkerActive(w)).length, `${W.length - working} thợ nghỉ phép`, 'good')}
    ${stat('SP hoàn thành tháng này', done, W.length ? `Trung bình ${dec(done / W.length, 1).replace(',0', '')} SP/thợ` : '')}</div>`;
  if (!W.length) return stats + emptyBox('Chưa có thợ xưởng', 'Thêm thợ để phân công đơn sản xuất.', prodEdit() ? `<button class="btn" data-act="px-worker">${ic('plus', 15)}Thêm thợ</button>` : '');
  return stats + `<div class="card list-card"><div class="sec-title">Thợ xưởng${prodEdit() ? `<button class="btn line sm" data-act="px-worker">${ic('plus', 14)}Thêm thợ</button>` : ''}</div>
    ${W.map(w => { const [l, c] = PROD_WS[w.status] || PROD_WS.working; return `<button class="li" data-act="px-worker" data-id="${w.id}">${prodAv(w.name, 34)}<span class="ell" style="flex:1"><b>${esc(w.name)}</b><small>${esc(w.team)}</small></span>
      <span class="px-num"><b>${prodWorkerActive(w)}</b><small>Đơn đang làm</small></span><span class="px-num"><b style="color:var(--green-ink)">${prodWorkerDone(w)}</b><small>Hoàn thành / tháng</small></span><span class="end">${pill(l, c)}</span></button>`; }).join('')}</div>`;
}

function prodMachines(){
  const L = S.prod_machines, ed = prodEdit();
  const next = mc => mc.status === 'maintenance' ? 'Đang bảo trì' : mc.status === 'broken' ? 'Cần sửa gấp' : mc.next ? fmtFull(mc.next) + (daysLeft(mc.next) < 0 ? ' · quá hạn' : '') : '—';
  return `<div class="toolbar"><span class="small muted">${L.filter(m => m.status === 'ok').length}/${L.length} máy hoạt động tốt</span><span style="flex:1"></span>${ed ? `<button class="btn line sm" data-act="px-mc">${ic('plus', 14)}Thêm máy</button>` : ''}</div>
  ${L.length ? `<div class="px-mgrid">${L.map(mc => { const [l, c] = PROD_MS[mc.status] || PROD_MS.ok; return `<div class="card pad stack" style="gap:8px"><div class="between row"><b style="font-size:15px">${esc(mc.name)}</b>${pill(l, c)}</div>
    <small class="muted">Bảo trì gần nhất: <b style="color:var(--ink);font-weight:500">${mc.last ? fmtFull(mc.last) : '—'}</b></small><small class="muted">Kế hoạch tiếp theo: <b style="color:${mc.status !== 'ok' || (mc.next && daysLeft(mc.next) < 0) ? cv(c === 'green' ? 'red' : c) : 'var(--ink)'};font-weight:500">${next(mc)}</b></small>${mc.note ? `<small>${esc(mc.note)}</small>` : ''}
    ${ed ? `<div class="row" style="margin-top:4px">${mc.status !== 'ok' || (mc.next && daysLeft(mc.next) <= 7) ? `<button class="btn ok sm" data-act="px-mc-done" data-id="${mc.id}">${ic('check', 14)}Đã bảo trì xong</button>` : ''}<button class="btn ghost sm" data-act="px-mc" data-id="${mc.id}">${ic('edit', 14)}Sửa</button></div>` : ''}</div>`; }).join('')}</div>` : emptyBox('Chưa có máy móc', 'Thêm máy để theo dõi bảo trì.', ed ? `<button class="btn" data-act="px-mc">${ic('plus', 15)}Thêm máy</button>` : '')}`;
}

/* ================= chi tiết đơn + bình luận ================= */
function prodDetail(id, focusCm){
  const o = prodOrder(id); if (!o) return;
  const ed = prodEdit(), [, sl, sc] = prodSt(o.stage), pn = prodProjName(o.pid);
  const cms = (o.comments || []).map(c => `<div class="row" style="align-items:flex-start">${prodAv(c.name, 28)}<div class="comment" style="flex:1"><small><b style="color:var(--ink)">${esc(c.name)}</b> · ${ago(c.t)}</small>${prodCmText(c.text)}</div></div>`).join('') || '<div class="small muted">Chưa có bình luận nào.</div>';
  const bom = (o.bom || []).map((b, i) => { const m = prodMat(b.m); return m ? `<div class="row small"><span class="ell" style="flex:1">${esc(m.name)}</span><b>${num(b.q)} ${esc(m.unit)}</b>${m.qty < b.q || prodLow(m) ? pill(m.qty < b.q ? 'Thiếu' : 'Sắp hết', 'red') : pill('Đủ', 'green')}${ed ? `<button class="icon-btn sm" data-act="px-bom-del" data-id="${o.id}" data-i="${i}" aria-label="Bỏ vật tư">${ic('x', 13)}</button>` : ''}</div>` : ''; }).join('') || '<div class="small muted">Chưa gắn vật tư cho đơn này.</div>';
  showModal(`<div class="modal wide" data-id="${o.id}">
    <h3><span><small class="px-code muted" style="display:block;font-size:12px;font-weight:500">${esc(o.code)}</small>${esc(o.name)} <span class="muted" style="font-weight:400">×${o.qty}</span></span>${closeBtn()}</h3>
    <div class="px-meta"><span>Khách hàng: <b>${esc(o.customer)}</b></span>${pn ? `<span>Dự án: <button class="link" data-act="px-proj" data-id="${esc(o.pid)}">${esc(pn)} ›</button></span>` : ''}<span>Công đoạn: <b style="color:${cv(sc)}">${sl}</b></span><span>Phụ trách: <b>${esc((o.workers || []).join(', '))}</b></span><span>Giao hàng: ${prodDue(o)}</span><span>Ưu tiên: ${prodPri(o.priority)}</span></div>
    ${o.note ? `<div class="small" style="white-space:pre-wrap">${esc(o.note)}</div>` : ''}
    ${ed ? `<div class="row2"><label class="field">Công đoạn<select data-change="px-stage" data-id="${o.id}">${opt(PROD_ST.map(s => [s[0], s[1]]), o.stage)}</select></label>
      <label class="field">Tiến độ: ${o.progress}%<input type="range" min="0" max="100" step="5" value="${o.progress}" data-change="px-prog" data-id="${o.id}"></label></div>` : bar(o.progress, cv(sc), 'thick')}
    <div class="sec-title" style="margin:6px 0 0">Vật tư sử dụng</div><div class="stack" style="gap:6px">${bom}</div>
    ${ed && S.prod_materials.length ? `<form class="row" data-form="px-bom" data-id="${o.id}"><select name="m" aria-label="Vật tư" style="flex:1;height:32px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink)">${opt(S.prod_materials.map(m => [m.id, m.name + ' (' + m.unit + ')']))}</select><input name="q" type="number" min="1" step="1" value="1" aria-label="Số lượng" style="width:80px;height:32px;border:1px solid var(--line);border-radius:10px;padding:0 8px;background:var(--card);color:var(--ink)"><button class="btn line sm">Gắn vật tư</button></form>` : ''}
    <div class="sec-title" style="margin:6px 0 0">Bình luận (${(o.comments || []).length})</div>
    <div class="stack px-cms" id="pxCms">${cms}</div>
    ${ed ? `<form class="px-cmform" data-form="px-cm" data-id="${o.id}">${av(S.me, 30)}<div style="flex:1;position:relative"><textarea id="pcIn" name="text" rows="2" data-input="px-cm" placeholder="Viết bình luận, gõ @ để nhắc đến đồng nghiệp..." aria-label="Bình luận"></textarea><div class="px-dd" id="pcDd" hidden></div></div><button class="btn sm" type="submit">Gửi</button></form>` : ''}
    ${ed ? `<div class="m-actions">${delBtn('prodOrder')}<button type="button" class="btn line" data-act="px-edit" data-id="${o.id}">${ic('edit', 14)}Sửa đơn</button></div>` : ''}
  </div>`);
  const cm = $('#pxCms'); if (cm) cm.scrollTop = cm.scrollHeight;
  if (focusCm){ const t = $('#pcIn'); if (t) t.focus(); }
}
const prodReopen = (id, f) => { render(); prodDetail(id, f); };
ACT['px-open'] = (el, d) => prodDetail(d.id);
ACT['px-proj'] = (el, d) => { closeModal(); S.pid = d.id; nav('pm', 'list'); };
CHG['px-stage'] = (el) => { const o = prodOrder(el.dataset.id); prodSetStage(o, el.value); prodReopen(o.id); };
CHG['px-prog'] = el => { const o = prodOrder(el.dataset.id); o.progress = clamp(+el.value || 0, 0, 100); prodReopen(o.id); };
DROP.pxo = (id, st) => { if (prodEdit()) prodSetStage(prodOrder(id), st); };
FORM['px-bom'] = (v, f) => {
  const o = prodOrder(f.dataset.id), q = Math.floor(+v.q);
  if (!v.m || !(q > 0)) return toast('Nhập số lượng vật tư hợp lệ');
  o.bom = o.bom || []; const b = o.bom.find(x => x.m === v.m); if (b) b.q = q; else o.bom.push({m:v.m, q});
  prodReopen(o.id);
};
ACT['px-bom-del'] = (el, d) => { const o = prodOrder(d.id); o.bom.splice(+d.i, 1); prodReopen(o.id); };
FORM['px-cm'] = (v, f) => {
  const o = prodOrder(f.dataset.id), text = (v.text || '').trim(); if (!text) return;
  const me = person(S.me);
  o.comments = o.comments || [];
  o.comments.push({id:uid(), by:S.me, name:me.name, text, t:Date.now()});
  const tagged = prodMentionNames().filter(n => n !== me.name && text.includes('@' + n));
  if (tagged.length){
    log(`${me.name} nhắc ${tagged.join(', ')} trong ${o.code}`, 'brown');
    if (typeof botPost === 'function') botPost('Được nhắc đến trong ' + o.code, `${me.name} nhắc ${tagged.map(n => '@' + n).join(', ')} trong đơn ${o.code} — ${o.name}: “${text.slice(0, 120)}”`, 'blue', 'Module Sản xuất', 'prod', 'flow');
  }
  prodReopen(o.id, true);
};
DEL.prodOrder = id => { S.prod_orders = S.prod_orders.filter(o => o.id !== id); };

/* @nhắc tên trong bình luận */
function prodDd(box, names, act){
  if (!box) return;
  box.hidden = !names.length;
  box.innerHTML = names.map((n, i) => `<button type="button" class="${i === 0 ? 'on' : ''}" data-act="${act}" data-n="${esc(n)}">${prodAv(n, 22)}<span class="ell">${esc(n)}</span></button>`).join('');
}
INP['px-cm'] = el => {
  const m = el.value.slice(0, el.selectionStart).match(/@([^\s@]*)$/);
  prodDd($('#pcDd'), m ? prodMentionNames().filter(n => n.toLowerCase().includes(m[1].toLowerCase())).slice(0, 6) : [], 'px-mention');
};
ACT['px-mention'] = (el, d) => {
  const t = $('#pcIn'); if (!t) return;
  const pos = t.selectionStart, before = t.value.slice(0, pos).replace(/@([^\s@]*)$/, '@' + d.n + ' ');
  t.value = before + t.value.slice(pos); t.focus(); t.setSelectionRange(before.length, before.length);
  $('#pcDd').hidden = true;
};

/* ================= tạo / sửa đơn ================= */
function prodOrderForm(o){
  const x = o || {name:'', customer:'', pid:'', qty:1, priority:'med', workers:[], due:md('2026-10-10'), note:'', stage:'doVe', progress:0, late:false};
  ui.pxTags = (x.workers || []).slice();
  const projs = typeof proj === 'function' && Array.isArray(S.projects) ? S.projects.filter(p => p.status !== 'done' || p.id === x.pid) : [];
  showModal(`<form class="modal" data-form="px-order" data-id="${o ? o.id : ''}">
    <h3>${o ? 'Sửa đơn ' + esc(o.code) : 'Tạo đơn sản xuất'}${closeBtn()}</h3>
    ${o ? '' : `<div class="sub">Mã đơn tự cấp: <b>${prodNextCode()}</b> · bắt đầu ở công đoạn “${prodSt('doVe')[1]}”.</div>`}
    <label class="field">Tên sản phẩm *<input id="px-name" name="name" value="${esc(x.name)}" placeholder="VD: Tủ bếp gỗ óc chó"></label>
    <div class="row2"><label class="field">Khách hàng / Dự án<input id="px-cust" name="customer" value="${esc(x.customer)}" placeholder="VD: Nguyễn Văn A"></label>
      ${projs.length ? `<label class="field">Gắn dự án<select name="pid"><option value="">— Không —</option>${opt(projs.map(p => [p.id, p.name]), x.pid)}</select></label>` : '<span></span>'}</div>
    <div class="row3"><label class="field">Số lượng<input id="px-qty" name="qty" type="number" min="1" step="1" value="${x.qty}"></label>
      <label class="field">Độ ưu tiên<select name="priority">${opt([['high', 'Cao'], ['med', 'Trung bình'], ['low', 'Thấp']], x.priority)}</select></label>
      <label class="field">Ngày giao dự kiến<input id="px-due" name="due" type="date" value="${esc(x.due || '')}"></label></div>
    <div class="field px-tagfield">Người phụ trách *<div class="px-tags"><span id="pxTagChips" class="px-chips">${prodTagChips()}</span><input id="pxTagQ" data-input="px-tag" placeholder="Gõ tên để thêm nhân sự..." autocomplete="off" aria-label="Thêm người phụ trách"></div><div class="px-dd" id="pxTagDd" hidden></div></div>
    ${o ? `<div class="row2"><label class="field">Công đoạn<select name="stage">${opt(PROD_ST.map(s => [s[0], s[1]]), x.stage)}</select></label><label class="field">Tiến độ (%)<input id="px-prog" name="progress" type="number" min="0" max="100" value="${x.progress}"></label></div>
      <label class="row small" style="cursor:pointer"><input type="checkbox" name="late" value="1" ${x.late ? 'checked' : ''} style="accent-color:var(--red)">Đánh dấu trễ tiến độ (ngoài việc quá ngày giao)</label>` : ''}
    <label class="field">Ghi chú<textarea id="px-note" name="note" placeholder="Vật liệu, quy cách...">${esc(x.note || '')}</textarea></label>
    <div class="small" id="pxErr" style="color:var(--red)"></div>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Hủy</button><button class="btn" type="submit">${o ? 'Lưu' : 'Tạo đơn'}</button></div></form>`);
}
const prodTagChips = () => (ui.pxTags || []).map((n, i) => `<span class="pill brown">${esc(n)}<button type="button" data-act="px-tag-del" data-i="${i}" aria-label="Bỏ ${esc(n)}">×</button></span>`).join('');
const prodTagCands = q => PX().prod_workers.map(w => w.name).filter(n => !(ui.pxTags || []).includes(n) && n.toLowerCase().includes(q.trim().toLowerCase()));
function prodTagPaint(){ const c = $('#pxTagChips'); if (c) c.innerHTML = prodTagChips(); const q = $('#pxTagQ'); prodDd($('#pxTagDd'), q && document.activeElement === q ? prodTagCands(q.value) : [], 'px-tag-add'); }
function prodTagAdd(n){ n = String(n || '').trim(); if (n && !ui.pxTags.includes(n)) ui.pxTags.push(n); const q = $('#pxTagQ'); if (q){ q.value = ''; q.focus(); } prodTagPaint(); }
INP['px-tag'] = () => prodTagPaint();
ACT['px-tag-add'] = (el, d) => prodTagAdd(d.n);
ACT['px-tag-del'] = (el, d) => { ui.pxTags.splice(+d.i, 1); prodTagPaint(); };
ACT['px-new'] = () => { if (prodEdit()) prodOrderForm(null); };
ACT['px-edit'] = (el, d) => prodOrderForm(prodOrder(d.id));
FORM['px-order'] = (v, f) => {
  const err = t => { $('#pxErr').textContent = t; };
  const name = (v.name || '').trim();
  if (!name) return err('Vui lòng nhập tên sản phẩm.');
  const pending = ($('#pxTagQ') || {}).value; if (pending && pending.trim()) prodTagAdd(pending);
  if (!ui.pxTags.length) return err('Vui lòng thêm ít nhất một người phụ trách.');
  const qty = Math.max(1, Math.floor(+v.qty) || 1), pid = v.pid || '';
  let cust = (v.customer || '').trim();
  if (!cust) cust = pid && prodProjName(pid) ? 'DA: ' + prodProjName(pid) : 'KH: Chưa rõ khách hàng';
  else if (!/^(KH|DA|KH lẻ)\s*:/i.test(cust)) cust = 'KH: ' + cust;
  const data = {name, customer:cust, pid, qty, priority:v.priority || 'med', workers:ui.pxTags.slice(), due:v.due || '', note:(v.note || '').trim()};
  let o = prodOrder(f.dataset.id);
  if (o){
    const st = v.stage || o.stage;
    Object.assign(o, data, {progress:clamp(Math.round(+v.progress || 0), 0, 100), late:!!v.late});
    prodSetStage(o, st);
    toast('Đã lưu ' + o.code);
  } else {
    o = {id:uid(), code:prodNextCode(), ...data, stage:'doVe', progress:0, late:false, bom:[], comments:[], created:todayISO(), doneAt:null};
    S.prod_orders.unshift(o);
    log('Tạo đơn sản xuất ' + o.code + ' — ' + name, 'brown'); toast('Đã tạo ' + o.code);
  }
  closeModal(); render();
};

/* ================= kho: nhập / xuất, vật tư, đặt mua ================= */
ACT['px-stock'] = (el, d) => {
  const out = d.mode === 'out', M = S.prod_materials; if (!M.length) return toast('Chưa có vật tư trong kho');
  const m0 = prodMat(d.id) || M[0];
  showModal(`<form class="modal" data-form="px-stock" data-mode="${out ? 'out' : 'in'}"><h3>${out ? 'Xuất kho' : 'Nhập kho'}${closeBtn()}</h3>
    <label class="field">Vật tư<select name="m" data-change="px-stock-m">${opt(M.map(m => [m.id, m.name + ' — tồn ' + num(m.qty) + ' ' + m.unit]), m0.id)}</select></label>
    <div class="row2"><label class="field">Số lượng<input id="pxs-q" name="q" type="number" min="1" step="1" placeholder="VD: 10"></label><label class="field">Đơn vị<input id="pxUnit" value="${esc(m0.unit)}" disabled></label></div>
    ${out ? `<label class="field">Cho đơn sản xuất<select name="order"><option value="">— Không gắn đơn —</option>${opt(S.prod_orders.filter(o => !prodDone(o)).map(o => [o.id, o.code + ' — ' + o.name]))}</select></label>` : ''}
    <label class="field">${out ? 'Lý do xuất kho' : 'Nhà cung cấp / ghi chú'}<textarea id="pxs-note" name="note" placeholder="Nhà cung cấp, lý do..."></textarea></label>
    <div class="small" id="pxErr" style="color:var(--red)"></div>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Hủy</button><button class="btn ${out ? 'danger' : 'ok'}" type="submit">Xác nhận</button></div></form>`);
};
CHG['px-stock-m'] = el => { const m = prodMat(el.value); const u = $('#pxUnit'); if (m && u) u.value = m.unit; };
FORM['px-stock'] = (v, f) => {
  const out = f.dataset.mode === 'out', m = prodMat(v.m), q = Number(v.q);
  const err = t => { $('#pxErr').textContent = t; };
  if (!m || !Number.isInteger(q) || q <= 0) return err('Vui lòng chọn vật tư và nhập số lượng hợp lệ (số nguyên > 0).');
  if (out && q > m.qty) return err(`Số lượng xuất vượt quá tồn kho hiện có (${num(m.qty)} ${m.unit}).`);
  m.qty += out ? -q : q;
  const o = v.order ? prodOrder(v.order) : null;
  m.moves = [{t:Date.now(), kind:out ? 'out' : 'in', q, note:(v.note || '').trim(), by:S.me, order:o ? o.code : ''}].concat(m.moves || []).slice(0, 60);
  log(`${out ? 'Xuất' : 'Nhập'} kho ${num(q)} ${m.unit} ${m.name}${o ? ' cho ' + o.code : ''}`, out ? 'orange' : 'green');
  closeModal(); render(); toast(`Đã ${out ? 'xuất' : 'nhập'} ${num(q)} ${m.unit} — tồn ${num(m.qty)}`);
};
ACT['px-mat'] = (el, d) => {
  const m = prodMat(d.id), ed = prodEdit();
  if (m && !ed){ prodMatHistory(m); return; }
  if (!ed) return;
  const x = m || {name:'', type:'', cat:'goTuNhien', qty:0, min:0, unit:'tấm', supplier:'', price:0, moves:[]};
  const types = [...new Set(S.prod_materials.map(z => z.type))], sups = [...new Set(S.prod_materials.map(z => z.supplier))];
  showModal(`<form class="modal" data-form="px-mat" data-id="${m ? m.id : ''}"><h3>${m ? esc(m.name) : 'Vật tư mới'}${closeBtn()}</h3>
    <label class="field">Tên vật tư<input id="pxm-name" name="name" required value="${esc(x.name)}"></label>
    <div class="row2"><label class="field">Loại<input id="pxm-type" name="type" list="pxTypes" value="${esc(x.type)}"><datalist id="pxTypes">${types.map(t => `<option value="${esc(t)}">`).join('')}</datalist></label>
      <label class="field">Nhóm<select name="cat">${opt(Object.entries(PROD_CAT), x.cat)}</select></label></div>
    <div class="row3">${m ? `<label class="field">Tồn kho<input value="${num(x.qty)}" disabled></label>` : `<label class="field">Tồn đầu kỳ<input id="pxm-qty" name="qty" type="number" min="0" step="1" value="0"></label>`}
      <label class="field">Định mức tối thiểu<input id="pxm-min" name="min" type="number" min="0" step="1" value="${x.min}"></label>
      <label class="field">Đơn vị<input id="pxm-unit" name="unit" required value="${esc(x.unit)}"></label></div>
    <div class="row2"><label class="field">Đơn giá (đồng / ${esc(x.unit || 'đv')})<input id="pxm-price" name="price" type="number" min="0" step="1000" value="${x.price || 0}"></label>
      <label class="field">Nhà cung cấp<input id="pxm-sup" name="supplier" list="pxSups" value="${esc(x.supplier)}"><datalist id="pxSups">${sups.map(t => `<option value="${esc(t)}">`).join('')}</datalist></label></div>
    ${m ? `<div class="row"><button type="button" class="btn ok sm" data-act="px-stock" data-mode="in" data-id="${m.id}">Nhập kho</button><button type="button" class="btn danger sm" data-act="px-stock" data-mode="out" data-id="${m.id}">Xuất kho</button></div>${prodMovesHtml(m)}` : ''}
    <div class="m-actions">${m ? delBtn('prodMat') : ''}<button type="button" class="btn ghost" data-act="modal-close">Hủy</button><button class="btn" type="submit">Lưu</button></div></form>`);
};
const prodMovesHtml = m => `<div class="sec-title" style="margin:4px 0 0">Lịch sử nhập / xuất</div>${(m.moves || []).length ? `<div class="stack" style="gap:4px;max-height:200px;overflow:auto">${m.moves.map(x => `<div class="row small"><span style="color:${x.kind === 'in' ? 'var(--green-ink)' : 'var(--red)'};font-weight:600;width:70px">${x.kind === 'in' ? '+' : '−'}${num(x.q)} ${esc(m.unit)}</span><span class="ell" style="flex:1">${esc(x.note || (x.kind === 'in' ? 'Nhập kho' : 'Xuất kho'))}${x.order ? ' · ' + esc(x.order) : ''}</span><small class="muted">${esc(person(x.by).name)} · ${ago(x.t)}</small></div>`).join('')}</div>` : '<div class="small muted">Chưa có giao dịch.</div>'}`;
function prodMatHistory(m){ showModal(`<div class="modal"><h3>${esc(m.name)}${closeBtn()}</h3><div class="small">Tồn ${num(m.qty)} ${esc(m.unit)} · định mức ${num(m.min)} · ${esc(m.supplier)}</div>${prodMovesHtml(m)}</div>`); }
FORM['px-mat'] = (v, f) => {
  const data = {name:v.name.trim(), type:(v.type || '').trim() || 'Khác', cat:v.cat, min:Math.max(0, Math.floor(+v.min) || 0), unit:v.unit.trim(), price:Math.max(0, Math.round(+v.price) || 0), supplier:(v.supplier || '').trim()};
  if (!data.name || !data.unit) return toast('Nhập tên và đơn vị vật tư');
  let m = prodMat(f.dataset.id);
  if (m) Object.assign(m, data); else { m = {id:uid(), ...data, qty:Math.max(0, Math.floor(+v.qty) || 0), moves:[]}; S.prod_materials.push(m); log('Thêm vật tư ' + m.name, 'brown'); }
  closeModal(); render(); toast('Đã lưu ' + m.name);
};
DEL.prodMat = id => { S.prod_materials = S.prod_materials.filter(m => m.id !== id); S.prod_orders.forEach(o => o.bom = (o.bom || []).filter(b => b.m !== id)); };
ACT['px-po'] = (el, d) => {
  const m = prodMat(d.id); if (!m) return;
  if (!(S.qs && Array.isArray(S.qs.po))) return toast('Chưa có module Mua hàng — không tạo được đơn mua');
  const codes = S.qs.po.map(p => String(p.code || '')), w = Math.max(3, ...codes.map(c => (c.split('-')[1] || '').length));
  const code = 'PO-' + String(Math.max(0, ...codes.map(c => +c.split('-')[1] || 0)) + 1).padStart(w, '0');
  const q = Math.max(m.min * 2 - m.qty, m.min - m.qty, 1);
  const po = {id:uid(), code, brand:m.supplier, supplier:m.supplier, pid:'', items:[{name:m.name, q, unit:m.unit, price:m.price || 0}], total:q * (m.price || 0), status:'approve', date:todayISO(), due:dayISO(7), note:'Bổ sung kho xưởng: ' + m.name, src:'prod', mat:m.id};
  S.qs.po.push(po); m.po = po.id;
  log(`Tạo đơn mua ${code} bổ sung ${num(q)} ${m.unit} ${m.name}`, 'purple'); render(); toast(`Đã tạo ${code} (${num(q)} ${m.unit}) — chờ duyệt ở Mua hàng`);
};
ACT['px-cat'] = (el, d) => { ui.pxCat = d.f; render(); };
ACT['px-filt'] = (el, d) => { ui.pxFilt = d.f; render(); };
ACT['px-alert-chat'] = () => {
  const al = prodAlerts(); if (!al.length || typeof botPost !== 'function') return;
  al.forEach(a => botPost(a.title, a.text, a.c === 'orange' ? 'yellow' : a.c, 'Module Sản xuất', 'prod', 'overview'));
  render(); toast(`Đã gửi ${al.length} cảnh báo lên kênh Dezbot`);
};

/* ================= thợ & máy ================= */
ACT['px-worker'] = (el, d) => {
  if (!prodEdit()) return;
  const w = S.prod_workers.find(x => x.id === d.id), x = w || {name:'', team:'', status:'working', done:{}};
  const teams = [...new Set(S.prod_workers.map(z => z.team))];
  showModal(`<form class="modal" data-form="px-worker" data-id="${w ? w.id : ''}"><h3>${w ? esc(w.name) : 'Thêm thợ xưởng'}${closeBtn()}</h3>
    <label class="field">Họ tên<input id="pxw-name" name="name" required list="pxPeople" value="${esc(x.name)}"><datalist id="pxPeople">${allPeople().map(p => `<option value="${esc(p.name)}">`).join('')}</datalist></label>
    <div class="row2"><label class="field">Tổ<input id="pxw-team" name="team" required list="pxTeams" value="${esc(x.team)}"><datalist id="pxTeams">${teams.map(t => `<option value="${esc(t)}">`).join('')}</datalist></label>
      <label class="field">Trạng thái<select name="status">${opt(Object.entries(PROD_WS).map(([k, [l]]) => [k, l]))}</select></label></div>
    <label class="field">SP hoàn thành tháng này ngoài đơn trên hệ thống<input id="pxw-done" name="done" type="number" min="0" step="1" value="${(x.done || {})[prodMonth()] || 0}"></label>
    ${w ? `<div class="small muted">Đang làm ${prodWorkerActive(w)} đơn · tổng hoàn thành tháng này ${prodWorkerDone(w)} SP.</div>` : ''}
    <div class="m-actions">${w ? delBtn('prodWorker') : ''}<button type="button" class="btn ghost" data-act="modal-close">Hủy</button><button class="btn" type="submit">Lưu</button></div></form>`);
  const sel = $('#modal select[name=status]'); if (sel) sel.value = x.status;
};
FORM['px-worker'] = (v, f) => {
  const name = v.name.trim(), team = v.team.trim(); if (!name || !team) return toast('Nhập họ tên và tổ');
  let w = S.prod_workers.find(x => x.id === f.dataset.id);
  if (S.prod_workers.some(x => x.name === name && x !== w)) return toast('Đã có thợ tên ' + name);
  if (!personByName(name)) ensurePeople(S, [{id:slug(name), name, role:'Thợ xưởng', team, c:'brown'}]);
  const pid = (personByName(name) || {}).id || slug(name);
  if (w){
    if (w.name !== name) S.prod_orders.forEach(o => o.workers = (o.workers || []).map(n => n === w.name ? name : n));
    Object.assign(w, {name, team, status:v.status, pid});
  } else { w = {id:uid(), name, pid, team, status:v.status, done:{}}; S.prod_workers.push(w); log('Thêm thợ xưởng ' + name, 'brown'); }
  w.done = {...(w.done || {}), [prodMonth()]:Math.max(0, Math.floor(+v.done) || 0)};
  closeModal(); render(); toast('Đã lưu ' + name);
};
DEL.prodWorker = id => { S.prod_workers = S.prod_workers.filter(w => w.id !== id); };
ACT['px-mc'] = (el, d) => {
  if (!prodEdit()) return;
  const mc = S.prod_machines.find(x => x.id === d.id), x = mc || {name:'', status:'ok', last:'', next:'', note:''};
  showModal(`<form class="modal" data-form="px-mc" data-id="${mc ? mc.id : ''}"><h3>${mc ? esc(mc.name) : 'Thêm máy'}${closeBtn()}</h3>
    <div class="row2"><label class="field">Tên máy<input id="pxc-name" name="name" required value="${esc(x.name)}"></label><label class="field">Tình trạng<select name="status">${opt(Object.entries(PROD_MS).map(([k, [l]]) => [k, l]), x.status)}</select></label></div>
    <div class="row2"><label class="field">Bảo trì gần nhất<input id="pxc-last" name="last" type="date" value="${esc(x.last)}"></label><label class="field">Kế hoạch tiếp theo<input id="pxc-next" name="next" type="date" value="${esc(x.next)}"></label></div>
    <label class="field">Ghi chú<textarea id="pxc-note" name="note">${esc(x.note || '')}</textarea></label>
    <div class="m-actions">${mc ? delBtn('prodMachine') : ''}<button type="button" class="btn ghost" data-act="modal-close">Hủy</button><button class="btn" type="submit">Lưu</button></div></form>`);
};
FORM['px-mc'] = (v, f) => {
  const data = {name:v.name.trim(), status:v.status, last:v.last || '', next:v.next || '', note:(v.note || '').trim()};
  if (!data.name) return toast('Nhập tên máy');
  let mc = S.prod_machines.find(x => x.id === f.dataset.id);
  if (mc){ if (mc.status !== data.status) log(`${data.name}: ${PROD_MS[data.status][0]}`, data.status === 'broken' ? 'red' : 'brown'); Object.assign(mc, data); }
  else { mc = {id:uid(), ...data}; S.prod_machines.push(mc); }
  closeModal(); render(); toast('Đã lưu ' + mc.name);
};
ACT['px-mc-done'] = (el, d) => { const mc = S.prod_machines.find(x => x.id === d.id); Object.assign(mc, {status:'ok', last:todayISO(), next:dayISO(90)}); log(mc.name + ' đã bảo trì xong', 'green'); render(); toast('Đã cập nhật — bảo trì tiếp theo ' + fmtFull(mc.next)); };
DEL.prodMachine = id => { S.prod_machines = S.prod_machines.filter(m => m.id !== id); };

/* ================= bàn phím & dropdown ================= */
document.addEventListener('keydown', e => {
  const id = e.target.id;
  if (id === 'pxTagQ'){
    if (e.key === 'Enter'){ e.preventDefault(); const c = prodTagCands(e.target.value); prodTagAdd(c[0] || e.target.value); }
    else if (e.key === 'Backspace' && !e.target.value && ui.pxTags && ui.pxTags.length){ ui.pxTags.pop(); prodTagPaint(); }
  }
  if (id === 'pcIn' && e.key === 'Enter' && !e.shiftKey && !e.isComposing){
    e.preventDefault();
    const dd = $('#pcDd'), first = dd && !dd.hidden && dd.querySelector('button');
    if (first) ACT['px-mention'](first, first.dataset); else e.target.form.requestSubmit();
  }
  if (id === 'pcIn' && e.key === 'Escape'){ const dd = $('#pcDd'); if (dd && !dd.hidden){ dd.hidden = true; e.stopPropagation(); } }
}, true);
document.addEventListener('mousedown', e => { if (e.target.closest && e.target.closest('.px-dd')) e.preventDefault(); });
document.addEventListener('focusin', e => { if (e.target.id === 'pxTagQ') prodTagPaint(); });
document.addEventListener('focusout', e => { if (e.target.id === 'pxTagQ' || e.target.id === 'pcIn'){ const dd = $(e.target.id === 'pcIn' ? '#pcDd' : '#pxTagDd'); if (dd) dd.hidden = true; } });

/* ================= tìm nhanh & trợ lý ================= */
SEARCH.push(hit => perm('prod') === 'none' ? [] : (S.prod_orders || []).filter(o => hit(o.code + ' ' + o.name + ' ' + o.customer)).map(o => ({icon:'hardhat', label:o.code + ' · ' + o.name, sub:'Sản xuất · ' + prodSt(o.stage)[1], run:() => { nav('prod', 'flow'); prodDetail(o.id); }}))
  .concat((S.prod_materials || []).filter(m => hit(m.name)).map(m => ({icon:'hardhat', label:m.name, sub:`Kho xưởng · tồn ${num(m.qty)} ${m.unit}`, run:() => { nav('prod', 'stock'); ACT['px-mat'](null, {id:m.id}); }}))));
AI.push({re:/sản xuất|xưởng|đơn sx|sx-\d|kho vật tư|tồn kho|thợ|máy móc|bảo trì|máy hỏng/, fn:(q, s) => {
  if (perm('prod') === 'none') return '';
  PX();
  const has = ws => ws.some(w => s.includes(w));
  const O = S.prod_orders, M = S.prod_materials, W = S.prod_workers, C = S.prod_machines;
  if (has(['máy', 'bảo trì', 'hỏng'])){
    const br = C.filter(m => m.status === 'broken'), mt = C.filter(m => m.status === 'maintenance');
    return `Xưởng có <b>${C.length}</b> máy. ` + (br.length || mt.length ? (br.length ? esc(br.map(m => m.name).join(', ')) + ' đang hỏng, cần kỹ thuật viên xử lý gấp. ' : '') + (mt.length ? esc(mt.map(m => m.name).join(', ')) + ' đang bảo trì định kỳ.' : '') : 'Tất cả máy đều hoạt động tốt.');
  }
  if (has(['vật tư', 'kho', 'nguyên liệu', 'tồn kho', 'gỗ', 'sơn'])){
    const low = M.filter(prodLow);
    return `Kho vật tư hiện có <b>${M.length}</b> mặt hàng, giá trị ${trd(prodStockValue() / 1e6)}. ` + (low.length ? `Sắp hết: ${esc(low.map(m => m.name).join(', '))}. Bạn có thể dùng nút Nhập kho hoặc Đặt mua để bổ sung. <button class="link" data-act="nav" data-v="prod" data-sub="stock">Mở kho ›</button>` : 'Tất cả vật tư đều đủ định mức tối thiểu.');
  }
  if (has(['thợ', 'nhân công', 'nhân sự', 'tổ sản xuất'])){
    const busy = W.filter(w => w.status === 'working' && prodWorkerActive(w)).length, done = sum(W, w => prodWorkerDone(w));
    return `Xưởng có <b>${W.length}</b> thợ, trong đó <b>${busy}</b> người đang có việc. Tháng này hoàn thành ${done} SP${W.length ? ` (trung bình ${dec(done / W.length, 1)} SP/thợ)` : ''}.`;
  }
  if (has(['hôm nay', 'ưu tiên', 'gấp'])){
    const hi = O.filter(o => o.priority === 'high' && !prodDone(o));
    return hi.length ? 'Các đơn ưu tiên cao cần chú ý hôm nay:' + list(hi.map(o => `<button class="link" data-act="px-open" data-id="${o.id}">${esc(o.code)} — ${esc(o.name)}</button>${prodLate(o) ? ' · <b>trễ</b>' : ' · giao ' + fmtDate(o.due)}`)) : 'Hôm nay không có đơn ưu tiên cao nào cần xử lý gấp.';
  }
  const late = O.filter(prodLate), act = O.filter(o => !prodDone(o));
  return `Xưởng hiện có <b>${act.length}</b> đơn đang sản xuất trên tổng ${O.length} đơn. ` + (late.length ? `Có <b>${late.length}</b> đơn trễ tiến độ:` + list(late.map(o => `<button class="link" data-act="px-open" data-id="${o.id}">${esc(o.code)} (${esc(o.name)})</button>`)) : 'Không có đơn nào đang trễ tiến độ.');
}});
