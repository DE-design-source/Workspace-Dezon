/* Dezon Workspace — Marketing, Mua hàng, HR (hồ sơ & bảng lương), Cài đặt */

/* ================= dữ liệu mẫu ================= */
function mkQuest(name, team, teamNote, soon, steps, pts, rewards, redeems, base){
  return {pid:'', name, team, teamNote, soon, player:Object.keys(pts)[0] || '', base, pts, rewards, redeems,
    steps:steps.map(([title, tasks]) => ({name:title, tasks:tasks.map(([t, p, who, done], i) => ({name:t, pts:p, who, done:!!done, by:done ? who : '', date:done ? dayISO(-(10 - i)) : ''}))}))};
}
const R_ = (id, name, pts, icon) => ({id, name, pts, icon});
SEEDS.push(s => {
  s.people.push(
    {id:'vy', name:'Đỗ Thảo Vy', role:'Head Marketing', team:'Marketing', c:'pink'},
    {id:'mq', name:'Minh Quân', role:'Content Creator', team:'Marketing', c:'blue'},
    {id:'tdg', name:'Thuỳ Dương', role:'Designer', team:'Marketing', c:'purple'},
    {id:'nm', name:'Nhật Minh', role:'Video Editor', team:'Marketing', c:'orange'},
    {id:'kd1', name:'Lâm Quốc Huy', role:'Trưởng phòng KD Dự án', team:'Kinh doanh', c:'blue'},
    {id:'kd2', name:'Phạm Thanh Mai', role:'Trưởng phòng KD Dân dụng', team:'Kinh doanh', c:'green'},
    {id:'kd3', name:'Võ Minh Khang', role:'Sales', team:'Kinh doanh', c:'yellow'},
    {id:'kd4', name:'Trương Bảo Châu', role:'Sales', team:'Kinh doanh', c:'pink'});
  s.quest_sales = mkQuest('Quy trình chốt hợp đồng — BQL Riverside GĐ3', 'Kinh doanh', '2 phòng KD Dự Án & Dân dụng', 'Quy trình chăm sóc khách hàng sau bàn giao', [
    ['Tiếp cận & xác minh khách hàng tiềm năng', [['Gọi điện xác minh nhu cầu', 15, 'kd3', 1], ['Cập nhật hồ sơ khách lên hệ thống', 15, 'kd3', 1], ['Gửi hồ sơ năng lực công ty', 20, 'kd1', 1]]],
    ['Tư vấn & khảo sát nhu cầu', [['Hẹn lịch khảo sát công trình', 20, 'kd1', 1], ['Khảo sát hiện trạng cùng kỹ thuật', 25, 'kd1', 1], ['Tổng hợp yêu cầu & ngân sách', 20, 'kd4', 1]]],
    ['Lập báo giá', [['Phối hợp QS bóc tách khối lượng', 25, 'kd1', 1], ['Gửi báo giá lần 1', 20, 'kd1'], ['Thu thập phản hồi & điều chỉnh', 20, 'kd4']]],
    ['Đàm phán hợp đồng', [['Họp đàm phán điều khoản thanh toán', 25, 'kd1'], ['Chuẩn bị dự thảo hợp đồng', 20, 'kd2'], ['Trình duyệt chiết khấu', 15, 'kd1']]],
    ['Chốt hợp đồng & bàn giao hồ sơ', [['Ký hợp đồng', 25, 'kd1'], ['Nhận tạm ứng đợt 1', 25, 'kd1'], ['Bàn giao hồ sơ cho Quản lý dự án', 20, 'kd3']]]
  ], {kd1:{week:180, total:2450, avail:1320}, kd2:{week:140, total:1980, avail:860}, kd3:{week:120, total:1310, avail:540}, kd4:{week:95, total:980, avail:410}},
  [R_('s1', 'Phiếu ăn trưa (1 tuần)', 300, 'gift'), R_('s2', 'Voucher nhà hàng 500.000đ', 500, 'gift'), R_('s3', 'Khoá học kỹ năng đàm phán', 700, 'book'), R_('s4', 'Thêm 1 ngày phép', 1000, 'star'), R_('s5', 'Du lịch team building', 2500, 'flame'), R_('s6', 'Thưởng tiền mặt 1.000.000đ', 3000, 'wallet')],
  [{who:'kd2', reward:'Voucher nhà hàng 500.000đ', pts:500, date:md('2026-09-17')}, {who:'kd3', reward:'Phiếu ăn trưa (1 tuần)', pts:300, date:md('2026-09-11')}], 7000);
  s.quest_mkt = mkQuest('Quy trình chiến dịch — Ra mắt Riverside Giai đoạn 3', 'Marketing', 'Toàn bộ phòng Marketing', 'Quy trình Truyền thông thương hiệu Quý 4', [
    ['Lên kế hoạch & duyệt ngân sách', [['Lập kế hoạch truyền thông', 20, 'vy', 1], ['Lập báo giá chiến dịch', 20, 'vy', 1], ['Trình duyệt ngân sách', 15, 'vy', 1]]],
    ['Sản xuất nội dung', [['Quay chụp nhà mẫu', 30, 'nm', 1], ['Thiết kế bộ key visual', 25, 'tdg', 1], ['Viết bài & kịch bản video', 20, 'mq', 1]]],
    ['Setup quảng cáo', [['Tạo form thu lead', 15, 'mq', 1], ['Setup chiến dịch Facebook Ads', 25, 'mq'], ['Setup Google Ads & SEO landing', 25, 'tdg']]],
    ['Chạy chiến dịch & tối ưu', [['Theo dõi CPL hằng ngày', 20, 'mq'], ['A/B test nội dung quảng cáo', 25, 'tdg'], ['Chuyển lead cho Kinh doanh', 20, 'vy']]],
    ['Đo lường & báo cáo', [['Tổng hợp số KHTN & CPL', 20, 'mq'], ['Báo cáo hiệu quả chiến dịch', 25, 'vy'], ['Rút kinh nghiệm & lưu wiki', 15, 'vy']]]
  ], {vy:{week:140, total:1580, avail:860}, mq:{week:125, total:1320, avail:640}, tdg:{week:110, total:1190, avail:400}, nm:{week:90, total:960, avail:520}},
  [R_('m1', 'Phiếu cà phê / trà sữa (1 tuần)', 250, 'gift'), R_('m2', 'Ngày làm việc từ xa (1 ngày)', 400, 'star'), R_('m3', 'Voucher mua sắm 200.000đ', 500, 'gift'), R_('m4', 'Khoá học thiết kế / dựng video nâng cao', 800, 'book'), R_('m5', 'Bộ phụ kiện quay dựng cá nhân', 1500, 'phone'), R_('m6', 'Thưởng tiền mặt 500.000đ', 2000, 'wallet')],
  [{who:'mq', reward:'Ngày làm việc từ xa (1 ngày)', pts:400, date:md('2026-09-19')}, {who:'nm', reward:'Phiếu cà phê / trà sữa (1 tuần)', pts:250, date:md('2026-09-12')}], 5000);
  s.mkt = {catalog:MKT_CATALOG.map(x => ({...x})), campaigns:[
    {id:'c1', name:'Ra mắt Riverside Giai đoạn 3', type:'Ra mắt dự án', client:'BQL Riverside', owner:'vy', start:md('2026-09-01'), end:md('2026-10-31'), status:'active', vat:true, notes:'Mục tiêu 40 khách hàng tiềm năng, CPL dưới 500.000đ.', items:[{id:'f1', qty:1}, {id:'f3', qty:1}, {id:'a2', qty:2}, {id:'g3', qty:1}, {id:'h1', qty:1}]},
    {id:'c2', name:'Truyền thông thương hiệu Quý 4', type:'Truyền thông thương hiệu', client:'', owner:'vy', start:md('2026-10-01'), end:md('2026-12-31'), status:'draft', vat:false, notes:'Chờ duyệt ngân sách.', items:[{id:'a1', qty:1}, {id:'a3', qty:1}, {id:'c1', qty:3}, {id:'f1', qty:1}, {id:'g1', qty:2}]},
    {id:'c3', name:'Tuyển khách hàng biệt thự Quý 3', type:'Tuyển khách hàng tiềm năng (Lead gen)', client:'', owner:'mq', start:md('2026-07-01'), end:md('2026-08-31'), status:'done', vat:true, notes:'Đạt 28 KHTN.', items:[{id:'f1', qty:1}, {id:'g2', qty:1}]}
  ]};
  s.hr = {paid:{[todayISO().slice(0, 7)]:['h1','h2','h3','h4','h5','h6','h7','h8','h9']}, staff:[
    ['h1','Trần Anh','Quản lý dự án','Quản lý dự án','0909 111 222','2021-03-15','active',28000000,'ta'],
    ['h2','Đỗ Thảo Vy','Head Marketing','Marketing','0908 225 118','2022-06-01','active',18000000,'vy'],
    ['h3','Lâm Quốc Huy','Trưởng phòng KD Dự án','Kinh doanh','0903 440 215','2020-09-10','active',20000000,'kd1'],
    ['h4','Phạm Thanh Mai','Trưởng phòng KD Dân dụng','Kinh doanh','0917 662 009','2021-11-01','active',18000000,'kd2'],
    ['h5','Nguyễn Đức Anh','Chỉ huy trưởng','Thi công','0912 334 556','2019-04-20','active',22000000,'da'],
    ['h6','Phan Bảo Ngọc','Kế toán trưởng','Tài chính','0938 771 204','2020-01-06','active',17000000,'bn'],
    ['h7','Cao Nhật Tân','Nhân viên mua hàng','Vận hành','0976 118 430','2023-02-13','active',11000000,'ct'],
    ['h8','Minh Quân','Content Creator','Marketing','0934 558 612','2023-08-01','active',12000000,'mq'],
    ['h9','Võ Minh Khang','Sales','Kinh doanh','0901 889 305','2024-03-04','active',10000000,'kd3'],
    ['h10','Lê Thị Hoa','Tư vấn thiết kế','Quản lý dự án','0985 220 761','2022-10-17','active',9000000,'hoa'],
    ['h11','Trương Bảo Châu','Sales','Kinh doanh','0932 614 090','2026-08-18','probation',9000000,'kd4'],
    ['h12','Đặng Minh Tú','Kỹ sư giám sát','Thi công','0919 003 447','2023-05-02','left',15000000,'']
  ].map(([id, name, title, dept, phone, start, status, gross, pid]) => ({id, name, title, dept, phone, email:'', start:md(start), status, gross, pid}))};
  s.settings = {company:{name:'Công ty Dezon', short:'Dezon', addr:'', hotline:'', email:'support@dezon.vn', tax:'', bank:'', web:'dezon.vn'}, tz:'Asia/Ho_Chi_Minh'};
  const rv = s.projects.find(p => p.id === 'riverside');
  if (rv) rv.members = [{id:'ta', role:'PM công trường', dept:'general'}, {id:'da', role:'Chỉ huy trưởng', dept:'qldth'}, {id:'tl', role:'Tư vấn giám sát', dept:'qldth'}, {id:'kd1', role:'Phụ trách hợp đồng', dept:'kinh-doanh'}, {id:'ct', role:'Mua hàng', dept:'qs'}, {id:'dp', role:'Chấm công công trường', dept:'hr'}, {id:'bn', role:'Kế toán dự án', dept:'tai-chinh'}];
  const b12 = s.projects.find(p => p.id === 'b12');
  if (b12) b12.members = [{id:'ta', role:'PM', dept:'general'}, {id:'lv', role:'Tổ trưởng đội A', dept:'qldth'}];
  s.qs.po.forEach(o => { o.due = o.due || addDays(o.date, 7); o.pid = o.pid || 'riverside'; });
  s.qs.po.push({id:'po4', code:'PO-0033', qp:'qs1', pid:'riverside', brand:'Philips', items:[{p:'p4', q:6}], status:'approve', date:dayISO(-1), due:dayISO(6), note:'Từ bóc tách QS-01'});
});

/* ================= helpers dùng chung ================= */
const company = () => (S.settings && S.settings.company) || {name:'Công ty Dezon', short:'Dezon'};
function companyHead(){
  const c = company();
  const line = [c.addr, c.hotline && 'Hotline: ' + c.hotline, c.email, c.web].filter(Boolean).map(esc).join(' · ');
  return `<b style="font-size:15px">${esc((c.name || 'Công ty Dezon').toUpperCase())}</b>${line ? `<div style="color:#666;font-size:12px">${line}</div>` : ''}`;
}

/* ================= MUA HÀNG ================= */
const POST = {approve:['Chờ duyệt','orange'], wait:['Chưa đặt','gray'], ordered:['Đã đặt','blue'], received:['Đã nhận','green']};
const poLine = it => it.p ? {name:(prod(it.p) || {}).name || it.p, price:(prod(it.p) || {}).price || 0} : {name:it.name, price:+it.price || 0};
const poVal = o => sum(o.items, it => poLine(it).price * it.q);
const poPending = () => (S.qs && S.qs.po || []).filter(o => o.status === 'approve').length;
MOD.po = () => {
  const P = S.qs.po, f = ui.poF || 'all', edit = perm('po') === 'edit';
  const rows = [...P].filter(o => f === 'all' || o.status === f).sort((a, b) => b.date.localeCompare(a.date));
  const sup = {}; P.forEach(o => { (sup[o.brand] = sup[o.brand] || []).push(o); });
  return head('Mua hàng', 'Đơn mua hàng vật tư — đồng bộ từ bóc tách QS, duyệt rồi đặt hàng với nhà cung cấp.', `<button class="btn line" data-act="nav" data-v="qs" data-sub="takeoff">Xem bóc tách tại QS ›</button>${edit ? `<button class="btn" data-act="po-new">${ic('plus', 15)}Tạo đơn mua hàng</button>` : ''}`)
    + `<div class="stats">
      ${stat('Tổng đơn mua hàng', P.length, 'Trên ' + Object.keys(sup).length + ' nhà cung cấp')}
      ${stat('Chờ duyệt / Chưa đặt', P.filter(o => o.status === 'approve').length + ' / ' + P.filter(o => o.status === 'wait').length, 'Cần xử lý trong tuần', P.some(o => o.status === 'approve') ? 'bad' : '')}
      ${stat('Đã đặt', P.filter(o => o.status === 'ordered').length, 'Đang chờ giao')}
      ${stat('Tổng giá trị', dec(sum(P, poVal) / 1e6, 2) + ' triệu', P.length + ' đơn mua hàng', 'good')}
    </div>
    <div class="toolbar">${[['all','Tất cả'], ...Object.entries(POST).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button class="fchip ${f === k ? 'on' : ''}" data-act="po-f" data-f="${k}">${l}${k !== 'all' ? ' · ' + P.filter(o => o.status === k).length : ''}</button>`).join('')}</div>
    <div class="table-wrap"><table><thead><tr><th>Mã PO</th><th>Nhà cung cấp</th><th>Dự án / Hồ sơ QS</th><th class="r">Số mặt hàng</th><th class="r">Tổng giá trị</th><th>Ngày giao dự kiến</th><th>Trạng thái</th></tr></thead><tbody>
      ${rows.map(o => { const qp = S.qs.projects.find(x => x.id === o.qp); const late = o.status === 'ordered' && o.due && daysLeft(o.due) < 0;
        return `<tr class="click" data-act="po-open" data-id="${o.id}" tabindex="0"><td class="b num">${esc(o.code)}</td><td>${esc(o.brand)}</td><td>${esc(projName(o.pid))}${qp ? `<div class="small muted">${esc(qp.code)}</div>` : ''}</td><td class="r">${o.items.length}</td><td class="r b">${num(poVal(o))}</td><td class="${late ? 'late' : ''}">${o.due ? fmtDate(o.due) + (late ? ' · trễ' : '') : '—'}</td><td>${pill(...POST[o.status])}</td></tr>`; }).join('') || '<tr><td colspan="7" class="empty">Không có đơn phù hợp</td></tr>'}
    </tbody></table></div>
    <div class="card pad"><h2 class="sec-title">Nhà cung cấp</h2><div class="sup-grid">${Object.entries(sup).map(([b, os]) => `<button class="sup" data-act="po-f" data-f="all" title="${esc(b)}"><b>${esc(b)}</b><small>${os.length} đơn · ${POST[os[0].status][0]}</small><span class="num">${dec(sum(os, poVal) / 1e6, 2)}tr</span></button>`).join('') || '<div class="empty">Chưa có nhà cung cấp</div>'}</div></div>`;
};
ACT['po-f'] = (el, d) => { ui.poF = d.f; render(); };
ACT['po-new'] = () => { ui.poD = {mode:'qs', qp:(S.qs.projects[0] || {}).id, brand:'', pid:S.pid || '', due:dayISO(7), note:'', items:[{p:(S.qs.products[0] || {}).id, q:1}]}; poNewModal(); };
function poNewModal(){
  const d = ui.poD, suppliers = [...new Set(S.qs.products.map(p => p.brand).concat(S.qs.po.map(o => o.brand)))];
  const qp = S.qs.projects.find(x => x.id === d.qp);
  const byBrand = {}; if (qp) qp.rooms.forEach(r => r.items.forEach(it => { const p = prod(it.p); if (p) byBrand[p.brand] = (byBrand[p.brand] || 0) + p.price * it.q; }));
  showModal(`<form class="modal wide" data-form="po-new"><h3>Tạo đơn mua hàng${closeBtn()}</h3>
    <div class="seg"><button type="button" class="${d.mode === 'qs' ? 'on' : ''}" data-act="po-mode" data-m="qs">Từ bóc tách QS</button><button type="button" class="${d.mode === 'manual' ? 'on' : ''}" data-act="po-mode" data-m="manual">Nhập tay</button></div>
    ${d.mode === 'qs' ? `<label class="field">Hồ sơ bóc tách<select id="pn-qp" name="qp" data-change="po-qp">${opt(S.qs.projects.map(x => [x.id, x.code + ' · ' + x.name]), d.qp)}</select></label>
      <div class="field">Sẽ tạo ${Object.keys(byBrand).length} đơn (mỗi nhà cung cấp 1 đơn), trạng thái “Chờ duyệt”:<div class="checklist">${Object.entries(byBrand).map(([b, v]) => `<div><span class="dot" style="--c:var(--purple)"></span><b style="font-weight:500">${esc(b)}</b><small>${vnd(v)}</small></div>`).join('') || '<div>Hồ sơ chưa có sản phẩm</div>'}</div></div>`
    : `<div class="row3"><label class="field">Nhà cung cấp<input id="pn-brand" name="brand" list="pn-sup" required value="${esc(d.brand)}"></label><label class="field">Dự án<select id="pn-pid" name="pid">${opt([['', '— Không gắn —'], ...S.projects.map(p => [p.id, p.name])], d.pid)}</select></label><label class="field">Ngày giao dự kiến<input id="pn-due" type="date" name="due" value="${d.due}"></label></div>
      <datalist id="pn-sup">${suppliers.map(x => `<option value="${esc(x)}">`).join('')}</datalist>
      <div class="field">Mặt hàng<div class="stack" style="gap:6px">${d.items.map((it, i) => `<div class="row"><select name="p_${i}" style="flex:1;height:38px;border:1px solid var(--line);border-radius:10px;background:var(--card);padding:0 8px" data-change="po-line" data-i="${i}">${opt(S.qs.products.map(p => [p.id, p.name + ' — ' + p.brand + ' · ' + num(p.price) + 'đ']), it.p)}</select><input name="q_${i}" type="number" min="1" value="${it.q}" style="width:80px;height:38px;border:1px solid var(--line);border-radius:10px;padding:0 8px;background:var(--card)" aria-label="Số lượng"><button type="button" class="icon-btn sm" data-act="po-line-del" data-i="${i}" aria-label="Xoá dòng">${ic('x', 14)}</button></div>`).join('')}
        <button type="button" class="btn ghost sm" data-act="po-line-add" style="align-self:flex-start">${ic('plus', 13)}Thêm mặt hàng</button></div></div>
      <label class="field">Ghi chú<input id="pn-note" name="note" value="${esc(d.note)}"></label>`}
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Tạo đơn</button></div></form>`);
}
function poCollect(){
  const f = document.querySelector('form[data-form="po-new"]'); if (!f || ui.poD.mode !== 'manual') return;
  const fd = new FormData(f), d = ui.poD;
  ['brand','pid','due','note'].forEach(k => { if (fd.has(k)) d[k] = fd.get(k); });
  d.items = d.items.map((it, i) => ({p:fd.get('p_' + i) || it.p, q:Math.max(1, +fd.get('q_' + i) || 1)}));
}
ACT['po-mode'] = (el, d) => { poCollect(); ui.poD.mode = d.m; poNewModal(); };
CHG['po-qp'] = el => { ui.poD.qp = el.value; poNewModal(); };
CHG['po-line'] = () => poCollect();
ACT['po-line-add'] = () => { poCollect(); ui.poD.items.push({p:(S.qs.products[0] || {}).id, q:1}); poNewModal(); };
ACT['po-line-del'] = (el, d) => { poCollect(); ui.poD.items.splice(+d.i, 1); if (!ui.poD.items.length) ui.poD.items.push({p:(S.qs.products[0] || {}).id, q:1}); poNewModal(); };
const nextPoCode = () => 'PO-' + String(Math.max(0, ...S.qs.po.map(o => +String(o.code).split('-')[1] || 0)) + 1).padStart(4, '0');
FORM['po-new'] = v => {
  const d = ui.poD;
  if (d.mode === 'qs'){
    const q = S.qs.projects.find(x => x.id === (v.qp || d.qp)); if (!q) return;
    const by = {}; q.rooms.forEach(r => r.items.forEach(it => { const p = prod(it.p); if (p){ by[p.brand] = by[p.brand] || {}; by[p.brand][it.p] = (by[p.brand][it.p] || 0) + it.q; } }));
    const brands = Object.keys(by); if (!brands.length) return toast('Hồ sơ chưa có sản phẩm để tạo đơn');
    brands.forEach(b => S.qs.po.push({id:uid(), code:nextPoCode(), qp:q.id, pid:q.pid || '', brand:b, items:Object.entries(by[b]).map(([p, qq]) => ({p, q:qq})), status:'approve', date:todayISO(), due:dayISO(7), note:'Từ bóc tách ' + q.code}));
    log(`Tạo ${brands.length} đơn mua từ ${q.code}`, 'purple'); toast(`Đã tạo ${brands.length} đơn — chờ duyệt`);
  } else {
    poCollect();
    if (!d.brand.trim()) return toast('Nhập nhà cung cấp');
    const o = {id:uid(), code:nextPoCode(), qp:'', pid:d.pid, brand:d.brand.trim(), items:d.items, status:'approve', date:todayISO(), due:d.due, note:d.note};
    S.qs.po.push(o); log('Tạo đơn mua ' + o.code, 'purple'); toast('Đã tạo ' + o.code + ' — chờ duyệt');
  }
  botPost('Đơn mua hàng cần duyệt', 'Có đơn mua hàng mới đang chờ duyệt.', 'yellow', 'Module Mua hàng', 'po', '');
  closeModal(); render();
};
ACT['po-open'] = (el, d) => poDetail(d.id);
function poDetail(id){
  const o = S.qs.po.find(x => x.id === id); if (!o) return;
  const edit = perm('po') === 'edit', f = S.fin[o.pid];
  const next = {approve:['wait', 'Duyệt đơn'], wait:['ordered', 'Đánh dấu đã đặt hàng'], ordered:['received', 'Đã nhận hàng']}[o.status];
  showModal(`<form class="modal wide" data-form="po-save" data-id="${o.id}"><h3><span>${esc(o.code)} · ${esc(o.brand)} ${pill(...POST[o.status])}</span>${closeBtn()}</h3>
    <div class="sub">Tạo ${fmtFull(o.date)}${o.note ? ' · ' + esc(o.note) : ''}</div>
    <div class="row2"><label class="field">Dự án<select name="pid" ${edit ? '' : 'disabled'}>${opt([['', '— Không gắn —'], ...S.projects.map(p => [p.id, p.name])], o.pid)}</select></label><label class="field">Ngày giao dự kiến<input type="date" name="due" value="${o.due || ''}" ${edit ? '' : 'disabled'}></label></div>
    <div class="table-wrap"><table style="min-width:0"><thead><tr><th>Mặt hàng</th><th class="r">SL</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th></tr></thead><tbody>
      ${o.items.map(it => { const l = poLine(it); return `<tr><td>${esc(l.name)}</td><td class="r">${it.q}</td><td class="r">${num(l.price)}</td><td class="r b">${num(l.price * it.q)}</td></tr>`; }).join('')}
      <tr class="grp"><td colspan="3" class="r">Tổng cộng</td><td class="r">${vnd(poVal(o))}</td></tr></tbody></table></div>
    ${o.status === 'received' && f && !o.billed && edit ? `<div class="card pad row between" style="background:var(--yellow-t);border:0;flex-wrap:wrap"><span class="small">Đã nhận hàng — tạo hoá đơn chi ${vnd(poVal(o))} vào Tài chính dự án <b>${esc(projName(o.pid))}</b>?</span><button type="button" class="btn sm" data-act="po-bill" data-id="${o.id}">Tạo hoá đơn chi</button></div>` : o.billed ? '<div class="small muted">Đã tạo hoá đơn chi trong Tài chính.</div>' : ''}
    <div class="m-actions">${edit ? delBtn('po') : ''}${edit && next ? `<button type="button" class="btn ${o.status === 'approve' ? 'ok' : 'line'}" data-act="po-next" data-id="${o.id}">${next[1]}</button>` : ''}<button type="button" class="btn ghost" data-act="modal-close">Đóng</button>${edit ? '<button class="btn" type="submit">Lưu</button>' : ''}</div></form>`);
}
FORM['po-save'] = (v, f) => { const o = S.qs.po.find(x => x.id === f.dataset.id); Object.assign(o, {pid:v.pid, due:v.due}); closeModal(); render(); toast('Đã lưu ' + o.code); };
ACT['po-next'] = (el, d) => {
  const o = S.qs.po.find(x => x.id === d.id), to = {approve:'wait', wait:'ordered', ordered:'received'}[o.status];
  o.status = to; if (to === 'wait'){ o.approvedBy = S.me; }
  log(`${o.code}: ${POST[to][0]}`, 'purple'); render(); poDetail(o.id); toast(`${o.code} → ${POST[to][0]}`);
};
ACT['po-bill'] = (el, d) => {
  const o = S.qs.po.find(x => x.id === d.id), f = S.fin[o.pid]; if (!f) return;
  const n = Math.max(0, ...f.inv.filter(i => i.kind === 'out').map(i => +String(i.code).split('-')[1] || 0)) + 1;
  f.inv.push({id:uid(), code:'BILL-' + String(n).padStart(4, '0'), partner:o.brand, kind:'out', amount:Math.max(1, Math.round(poVal(o) / 1e6)), due:dayISO(30), task:'Vật tư — ' + o.code, status:'pending'});
  o.billed = true; log(`Tạo hoá đơn chi cho ${o.code}`, 'yellow'); render(); poDetail(o.id); toast('Đã tạo hoá đơn chi trong Tài chính');
};
DEL.po = id => { S.qs.po = S.qs.po.filter(o => o.id !== id); };
SEARCH.push(hit => S.qs.po.filter(o => hit(o.code + ' ' + o.brand)).map(o => ({icon:'cart', label:o.code + ' · ' + o.brand, sub:'Mua hàng · ' + POST[o.status][0], run:() => { nav('po'); poDetail(o.id); }})));

/* ================= MARKETING ================= */
const MKT_GROUPS = [['A','Nhân sự (đã gồm BH & KPCĐ DN đóng)'],['C','Công cụ & phần mềm'],['D','Thiết bị quay, chụp, dựng (khấu hao)'],['F','Quảng cáo'],['G','Sản xuất nội dung'],['H','Tổ chức sự kiện'],['I','Chi phí khác']];
const MI = (id, group, name, unit, price) => ({id, group, name, unit, price});
const MKT_CATALOG = [
  MI('a1','A','Head Marketing','người-tháng',21870000), MI('a2','A','Content Creator','người-tháng',14580000), MI('a3','A','Designer','người-tháng',15795000), MI('a4','A','Video Editor','người-tháng',15795000), MI('a5','A','Performance Ads','người-tháng',17010000), MI('a6','A','Intern content','người-tháng',3500000),
  MI('c1','C','Adobe Creative Cloud','tháng',133333), MI('c2','C','Canva Pro','tháng',110000), MI('c3','C','CapCut Pro','tháng',90000), MI('c4','C','ChatGPT Plus','tháng',520000), MI('c5','C','Google Workspace','tháng',150000),
  MI('d1','D','Máy quay Sony a7s3','tháng',2083333), MI('d2','D','Ống kính 24-70 GM','tháng',1250000), MI('d3','D','Gimbal DJI RS3','tháng',375000), MI('d4','D','Flycam DJI Mini 4 Pro','tháng',500000), MI('d5','D','Đèn LED studio','tháng',250000), MI('d6','D','Micro Rode','tháng',150000),
  MI('f1','F','Quảng cáo fanpage Dezon','tháng',55000000), MI('f2','F','Quảng cáo TikTok','tháng',20000000), MI('f3','F','Quảng cáo Web (Google Ads, SEO)','tháng',35000000),
  MI('g1','G','Quay chụp công trình hoàn thiện','lần',6000000), MI('g2','G','Dựng video 3D walkthrough','lần',12000000), MI('g3','G','In ấn ấn phẩm (brochure, catalogue)','lần',2400000), MI('g4','G','KOL / KOC review','lần',8000000),
  MI('h1','H','Ngân sách sự kiện mở bán / khai trương','sự kiện',15000000), MI('h2','H','Gian hàng triển lãm','sự kiện',25000000),
  MI('i1','I','Dự phòng phát sinh','lần',2000000), MI('i2','I','Quà tặng khách hàng','lần',1500000)
];
const CSTATUS = {draft:['Bản nháp','yellow'], active:['Đang chạy','green'], done:['Đã hoàn tất','gray']};
const CTYPES = ['Ra mắt dự án','Truyền thông thương hiệu','Tuyển khách hàng tiềm năng (Lead gen)','Sự kiện','Khác'];
const mktItem = id => S.mkt.catalog.find(x => x.id === id);
function campMonths(c){ if (!c.start || !c.end) return 1; const a = parseD(c.start), b = parseD(c.end); return Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth() + 1); }
const perMonth = u => u === 'tháng' || u === 'người-tháng';
function campCalc(c){
  const m = campMonths(c);
  const lines = c.items.map(it => { const x = mktItem(it.id); if (!x || !it.qty) return null; const mult = perMonth(x.unit) ? m : 1; return {...x, qty:it.qty, mult, total:x.price * it.qty * mult}; }).filter(Boolean);
  const sub_ = sum(lines, l => l.total), vat = c.vat ? sub_ * .08 : 0;
  return {m, lines, sub:sub_, vat, total:sub_ + vat};
}
const mktClients = () => [...new Set(S.leads.map(l => l.name).concat(S.projects.map(p => p.client)))];
MOD.mkt = () => {
  const cur = sub('mkt', 'campaigns'), edit = perm('mkt') === 'edit';
  const tabs = subtabs('mkt', [['campaigns','Chiến dịch'],['catalog','Danh mục'],['quote','Báo giá'],['quest','Nhiệm vụ']], 'campaigns');
  const C = S.mkt.campaigns;
  let body;
  if (cur === 'campaigns'){
    const cf = ui.mktF || 'all';
    body = `<div class="stats">
      ${stat('Tổng chiến dịch', C.length, 'Đã khởi tạo trong hệ thống')}
      ${stat('Đang chạy', C.filter(c => c.status === 'active').length, 'Đã duyệt / đang triển khai', 'good')}
      ${stat('Bản nháp', C.filter(c => c.status === 'draft').length, 'Chờ duyệt ngân sách')}
      ${stat('Tổng ngân sách đã lập', trd(sum(C, c => campCalc(c).total) / 1e6), 'Cộng dồn báo giá các chiến dịch')}
    </div>
    <div class="toolbar">${[['all','Tất cả'], ...Object.entries(CSTATUS).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button class="fchip sm ${cf === k ? 'on' : ''}" data-act="mkt-f" data-f="${k}">${l}</button>`).join('')}</div>
    <div class="camp-grid">${C.filter(c => cf === 'all' || c.status === cf).map(c => { const k = campCalc(c); return `<button class="card camp" data-act="mkt-quote" data-id="${c.id}">
      <div class="row between"><b>${esc(c.name)}</b>${pill(...CSTATUS[c.status])}</div>
      <span class="small muted">${esc(c.type)}${c.client ? ' · ' + esc(c.client) : ''}</span>
      <span class="small muted">${fmtDate(c.start)} → ${fmtDate(c.end)} (${k.m} tháng) · ${esc(person(c.owner).name)}</span>
      <div class="row between camp-f"><span class="small muted">${k.lines.length} hạng mục</span><span class="camp-total">${vnd(k.total)}</span></div></button>`; }).join('') || `<div class="empty">Chưa có chiến dịch nào — bấm “Tạo chiến dịch” để khởi tạo và lập báo giá.</div>`}</div>`;
  } else if (cur === 'catalog'){
    body = `<div class="card pad small" style="background:var(--hover)">Đơn giá nhóm A (nhân sự) đã gồm bảo hiểm doanh nghiệp đóng trên lương Gross: BHXH 17,5% + BHYT 3% + BHTN 1%. Hạng mục tính theo <b>tháng / người-tháng</b> được nhân với số tháng của chiến dịch.</div>
    <div class="small muted">${S.mkt.catalog.length} hạng mục</div>
    ${MKT_GROUPS.map(([g, label]) => { const items = S.mkt.catalog.filter(x => x.group === g); return `<div class="table-wrap"><table style="min-width:520px"><thead><tr class="grp"><td colspan="3"><b>${g}. ${esc(label)}</b> <span class="muted" style="font-weight:400">· ${items.length} hạng mục</span></td></tr><tr><th>Hạng mục</th><th>Đơn vị</th><th class="r">Đơn giá</th></tr></thead><tbody>
      ${items.map(x => `<tr class="${edit ? 'click' : ''}" ${edit ? `data-act="mkt-item" data-id="${x.id}"` : ''}><td>${esc(x.name)}</td><td>${esc(x.unit)}</td><td class="r b">${num(x.price)}</td></tr>`).join('')}
      ${edit ? `<tr><td colspan="3"><button class="link" data-act="mkt-item-new" data-g="${g}">${ic('plus', 12)} Thêm hạng mục</button></td></tr>` : ''}</tbody></table></div>`; }).join('')}
    <div class="small muted">Phúc lợi & chi phí nhân sự dùng chung không đưa vào danh mục — xem ở báo cáo phòng ban.</div>`;
  } else if (cur === 'quote'){
    const c = C.find(x => x.id === ui.mktCamp) || C[0];
    if (!c) body = emptyBox('Chưa có chiến dịch nào để lập báo giá', 'Tạo chiến dịch trước.', edit ? `<button class="btn" data-act="mkt-new">${ic('plus', 15)}Tạo chiến dịch</button>` : '');
    else {
      const k = campCalc(c), tpl = ui.mktTpl || 'modern';
      body = `<div class="row" style="flex-wrap:wrap"><label class="field" style="flex-direction:row;align-items:center;gap:10px">Xem báo giá chiến dịch:<select data-change="mkt-camp" style="min-width:260px">${opt(C.map(x => [x.id, x.name]), c.id)}</select></label></div>
      <div class="quote-layout"><div class="stack">
        <div class="card pad stack" style="gap:8px"><b>Thông tin chiến dịch</b>
          ${[['Tên', c.name], ['Loại', c.type], ['Dự án / KH', c.client || '—'], ['Phụ trách', person(c.owner).name], ['Thời gian', fmtDate(c.start) + ' → ' + fmtDate(c.end) + ' (' + k.m + ' tháng)']].map(([a, b]) => `<div class="row between small"><span class="muted">${a}</span><b style="font-weight:500;text-align:right">${esc(b)}</b></div>`).join('')}
          <div class="row between small"><span class="muted">Trạng thái</span>${pill(...CSTATUS[c.status])}</div>
          ${c.notes ? `<div class="small muted" style="border-top:1px solid var(--line);padding-top:8px">${esc(c.notes)}</div>` : ''}
          ${edit ? `<button class="btn ${c.vat ? 'ok' : 'line'} sm" data-act="mkt-vat" data-id="${c.id}">${c.vat ? '✓ VAT 8% đã áp dụng' : '+ VAT 8%'}</button>
          <div class="row" style="flex-wrap:wrap">${c.status === 'draft' ? `<button class="btn sm" data-act="mkt-status" data-id="${c.id}" data-s="active">Duyệt ngân sách</button>` : c.status === 'active' ? `<button class="btn line sm" data-act="mkt-status" data-id="${c.id}" data-s="done">Đánh dấu hoàn tất</button>` : ''}<button class="btn ghost sm" data-act="mkt-edit" data-id="${c.id}">Sửa chiến dịch</button></div>` : ''}
        </div>
        <div class="card pad stack" style="gap:8px"><b class="small muted" style="letter-spacing:.06em">MẪU BÁO GIÁ</b>${[['modern','Mẫu Hiện đại'],['classic','Mẫu Cổ điển'],['minimal','Mẫu Tối giản'],['detail','Mẫu Chi tiết']].map(([t, l]) => `<button class="tpl ${tpl === t ? 'on' : ''}" data-act="mkt-tpl" data-t="${t}">${l}</button>`).join('')}
          <button class="btn line sm" data-act="mkt-copy" data-id="${c.id}">${ic('copy', 13)}Sao chép bảng (dán vào Excel)</button></div>
      </div>${campQuoteDoc(c, k, tpl)}</div>`;
    }
  } else body = questView('mkt');
  return head('Marketing', 'Khởi tạo chiến dịch → chọn hạng mục chi phí vào gói → ra báo giá.', edit ? `<button class="btn" data-act="mkt-new">${ic('plus', 15)}Tạo chiến dịch</button>` : '') + tabs + body;
};
function campQuoteDoc(c, k, tpl){
  const co = company(), no = 'BG-' + String(c.id).replace(/\D/g, '').padStart(3, '0') + '-' + parseD(todayISO()).getFullYear();
  const groups = MKT_GROUPS.map(([g, l]) => [g, l, k.lines.filter(x => x.group === g)]).filter(x => x[2].length);
  const head_ = `<div class="doc-head"><div>${companyHead()}</div><div style="text-align:right;font-size:12px;color:#444">Số: ${no}<br>Ngày: ${fmtFull(todayISO())}<br>Hiệu lực 15 ngày</div></div>`;
  const totals = (label = 'Tổng cộng') => `<tr class="tot"><td colspan="4" class="r">Tạm tính</td><td class="r">${vnd(k.sub)}</td></tr>${c.vat ? `<tr class="tot"><td colspan="4" class="r">VAT (8%)</td><td class="r">${vnd(k.vat)}</td></tr>` : ''}<tr class="tot"><td colspan="4" class="r" style="font-size:15px">${label}</td><td class="r" style="font-size:15px">${vnd(k.total)}</td></tr>`;
  const sign = `<div class="sign"><div>NGƯỜI LẬP BÁO GIÁ<small>(Ký, ghi rõ họ tên)</small>${esc(person(c.owner).name)}</div><div>KHÁCH HÀNG XÁC NHẬN<small>(Ký, ghi rõ họ tên)</small></div></div>`;
  let inner;
  if (tpl === 'classic'){
    let n = 0;
    inner = `${head_}<h2>BÁO GIÁ</h2><p style="margin:14px 0 4px"><b>Kính gửi:</b> ${esc(c.client || 'Quý khách hàng')}</p><p style="margin:0 0 14px"><b>Về việc:</b> Báo giá chiến dịch “${esc(c.name)}” (${fmtDate(c.start)} – ${fmtDate(c.end)}, ${k.m} tháng)</p>
      <div style="overflow-x:auto"><table class="bordered"><thead><tr><th>STT</th><th>Hạng mục</th><th>ĐVT</th><th class="r">SL</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th></tr></thead><tbody>
      ${k.lines.map(l => `<tr><td>${++n}</td><td>${esc(l.name)}</td><td>${esc(l.unit)}</td><td class="r">${l.qty}${l.mult > 1 ? ' × ' + l.mult : ''}</td><td class="r">${num(l.price)}</td><td class="r">${num(l.total)}</td></tr>`).join('')}
      <tr class="tot"><td colspan="5" class="r">Tạm tính</td><td class="r">${vnd(k.sub)}</td></tr>${c.vat ? `<tr class="tot"><td colspan="5" class="r">Thuế GTGT (8%)</td><td class="r">${vnd(k.vat)}</td></tr>` : ''}<tr class="tot"><td colspan="5" class="r">TỔNG CỘNG</td><td class="r">${vnd(k.total)}</td></tr></tbody></table></div>${sign}`;
  } else if (tpl === 'minimal'){
    inner = `${head_}<h2 style="text-align:left;letter-spacing:0">${esc(c.name)}</h2><div style="color:#777;margin-bottom:18px">${esc(c.client || '')} · ${fmtDate(c.start)} – ${fmtDate(c.end)}</div>
      ${groups.map(([g, l, ls]) => `<div style="margin:14px 0 6px;font-weight:600">${esc(l)}</div>${ls.map(x => `<div class="min-line"><span>${esc(x.name)} <span style="color:#999">× ${x.qty}${x.mult > 1 ? ' × ' + x.mult + ' tháng' : ''}</span></span><span>${num(x.total)}</span></div>`).join('')}`).join('')}
      <div class="min-total"><span>Tổng${c.vat ? ' (gồm VAT 8%)' : ''}</span><b>${vnd(k.total)}</b></div>`;
  } else {
    const detail = tpl === 'detail';
    inner = `${head_}<h2>BÁO GIÁ CHIẾN DỊCH</h2>
      <div class="doc-info"><div><span style="color:#777">Chiến dịch:</span> <b>${esc(c.name)}</b></div><div><span style="color:#777">Dự án / khách hàng:</span> ${esc(c.client || '—')}</div><div><span style="color:#777">Thời gian triển khai:</span> ${fmtDate(c.start)} – ${fmtDate(c.end)} (${k.m} tháng)</div><div><span style="color:#777">Người phụ trách:</span> ${esc(person(c.owner).name)}</div>${detail ? `<div><span style="color:#777">MST:</span> ${esc(co.tax || '—')}</div><div><span style="color:#777">STK:</span> ${esc(co.bank || '—')}</div><div><span style="color:#777">Trạng thái:</span> ${CSTATUS[c.status][0]}</div>` : ''}</div>
      <div style="overflow-x:auto"><table><thead><tr><th>Hạng mục</th><th class="r">Đơn giá</th><th class="r">SL</th><th class="r">${detail ? 'Nhân tháng' : ''}</th><th class="r">Thành tiền</th></tr></thead><tbody>
      ${groups.map(([g, l, ls]) => `<tr class="grp"><td colspan="4">${g}. ${esc(l)}</td><td class="r">${detail ? num(sum(ls, x => x.total)) : ''}</td></tr>` + ls.map(x => `<tr><td>${esc(x.name)} <span style="color:#999">(${esc(x.unit)})</span></td><td class="r">${num(x.price)}</td><td class="r">${x.qty}</td><td class="r">${detail && x.mult > 1 ? '× ' + x.mult : ''}</td><td class="r">${num(x.total)}</td></tr>`).join('')).join('')}
      ${totals()}</tbody></table></div>
      ${detail ? `<div style="margin-top:16px;font-size:12.5px"><b>Điều khoản & điều kiện</b><ol style="margin:6px 0 0;padding-left:18px;color:#444"><li>Báo giá có hiệu lực 15 ngày kể từ ngày lập.</li><li>Tạm ứng 50% khi ký xác nhận, 50% còn lại khi nghiệm thu chiến dịch.</li><li>Chi phí quảng cáo thực tế có thể chênh lệch theo biểu phí nền tảng.</li><li>Phát sinh ngoài báo giá được thống nhất bằng văn bản.</li></ol></div>` : ''}${sign}`;
  }
  return `<div class="doc quote-${tpl}">${inner}</div>`;
}
ACT['mkt-f'] = (el, d) => { ui.mktF = d.f; render(); };
ACT['mkt-quote'] = (el, d) => { ui.mktCamp = d.id; S.sub.mkt = 'quote'; render(); };
CHG['mkt-camp'] = el => { ui.mktCamp = el.value; render(); };
ACT['mkt-tpl'] = (el, d) => { ui.mktTpl = d.t; render(); };
ACT['mkt-vat'] = (el, d) => { const c = S.mkt.campaigns.find(x => x.id === d.id); c.vat = !c.vat; render(); };
ACT['mkt-status'] = (el, d) => { const c = S.mkt.campaigns.find(x => x.id === d.id); c.status = d.s; log(`${c.name}: ${CSTATUS[d.s][0]}`, 'pink'); if (d.s === 'active') botPost('Duyệt ngân sách chiến dịch', `Chiến dịch “${c.name}” đã được duyệt ngân sách ${vnd(campCalc(c).total)}.`, 'green', 'Module Marketing', 'mkt', 'campaigns'); render(); toast(CSTATUS[d.s][0]); };
ACT['mkt-copy'] = (el, d) => {
  const c = S.mkt.campaigns.find(x => x.id === d.id), k = campCalc(c);
  const rows = [['Hạng mục','Đơn vị','SL','Nhân tháng','Đơn giá','Thành tiền']].concat(k.lines.map(l => [l.name, l.unit, l.qty, l.mult, l.price, l.total]), [['','','','','Tạm tính', k.sub]], c.vat ? [['','','','','VAT 8%', k.vat]] : [], [['','','','','Tổng cộng', k.total]]);
  copyText(rows.map(r => r.join('\t')).join('\n'), 'Đã sao chép báo giá — dán vào Excel');
};
/* danh mục */
ACT['mkt-item-new'] = (el, d) => mktItemModal({id:'', group:d.g, name:'', unit:'tháng', price:0});
ACT['mkt-item'] = (el, d) => mktItemModal(mktItem(d.id));
function mktItemModal(x){
  showModal(`<form class="modal" data-form="mkt-item" data-id="${x.id}"><h3>${x.id ? 'Sửa hạng mục' : 'Thêm hạng mục'}${closeBtn()}</h3>
    <label class="field">Nhóm<select name="group">${opt(MKT_GROUPS.map(([g, l]) => [g, g + '. ' + l]), x.group)}</select></label>
    <label class="field">Tên hạng mục<input name="name" required value="${esc(x.name)}"></label>
    <div class="row2"><label class="field">Đơn vị<select name="unit">${opt(['người-tháng','tháng','lần','sự kiện'], x.unit)}</select></label><label class="field">Đơn giá (đồng)<input name="price" type="number" min="0" step="1000" required value="${x.price}"></label></div>
    <div class="m-actions">${x.id ? delBtn('mkt-item') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu</button></div></form>`);
}
FORM['mkt-item'] = (v, f) => {
  const data = {group:v.group, name:v.name.trim(), unit:v.unit, price:Math.max(0, Math.round(+v.price || 0))};
  const x = mktItem(f.dataset.id); if (x) Object.assign(x, data); else S.mkt.catalog.push({id:v.group.toLowerCase() + uid(), ...data});
  closeModal(); render(); toast('Đã lưu hạng mục');
};
DEL['mkt-item'] = id => { S.mkt.catalog = S.mkt.catalog.filter(x => x.id !== id); };
/* tạo / sửa chiến dịch — 3 bước */
ACT['mkt-new'] = () => { ui.mkw = {step:1, d:{id:'', name:'', type:CTYPES[0], client:'', owner:S.me, start:todayISO(), end:dayISO(60), status:'draft', vat:false, notes:'', items:[]}}; mkwModal(); };
ACT['mkt-edit'] = (el, d) => { ui.mkw = {step:1, d:JSON.parse(JSON.stringify(S.mkt.campaigns.find(x => x.id === d.id)))}; mkwModal(); };
function mkwModal(){
  const {step, d} = ui.mkw, k = campCalc(d), q = id => (d.items.find(i => i.id === id) || {}).qty || 0;
  const s1 = `<label class="field">Tên chiến dịch *<input id="mk-name" name="name" required value="${esc(d.name)}" placeholder="VD: Ra mắt Biệt thự Nhà Bè"></label>
    <div class="row2"><label class="field">Loại chiến dịch<select name="type">${opt(CTYPES, d.type)}</select></label><label class="field">Dự án / khách hàng liên quan<select name="client">${opt([['', '— Không gắn dự án cụ thể —'], ...mktClients().map(x => [x, x])], d.client)}</select></label></div>
    <div class="row3"><label class="field">Người phụ trách<select name="owner">${peopleOpts(d.owner)}</select></label><label class="field">Bắt đầu<input type="date" name="start" value="${d.start}"></label><label class="field">Kết thúc<input type="date" name="end" value="${d.end}"></label></div>
    <label class="field">Ghi chú<textarea name="notes">${esc(d.notes)}</textarea></label>`;
  const s2 = `<div class="small muted">Chiến dịch ${k.m} tháng — hạng mục tính theo tháng được nhân ${k.m}.</div><div class="table-wrap" style="max-height:48vh;overflow:auto"><table style="min-width:620px"><thead><tr><th>Hạng mục</th><th>Đơn vị</th><th class="r">Đơn giá</th><th class="r">SL</th><th class="r">Thành tiền</th></tr></thead><tbody>
    ${MKT_GROUPS.map(([g, l]) => `<tr class="grp"><td colspan="5">${g}. ${esc(l)}</td></tr>` + S.mkt.catalog.filter(x => x.group === g).map(x => `<tr><td>${esc(x.name)}</td><td>${esc(x.unit)}</td><td class="r">${num(x.price)}</td><td class="r"><input class="mkw-qty" type="number" min="0" value="${q(x.id)}" data-input="mkw-qty" data-id="${x.id}" aria-label="Số lượng ${esc(x.name)}"></td><td class="r b" id="mkw-t-${x.id}">${q(x.id) ? num(x.price * q(x.id) * (perMonth(x.unit) ? k.m : 1)) : '—'}</td></tr>`).join('')).join('')}
    </tbody></table></div><div class="row between"><span class="muted">Tạm tính</span><b id="mkw-sub" style="font-size:17px">${vnd(k.sub)}</b></div>`;
  const s3 = `<div class="card pad" style="background:var(--hover)"><b>${esc(d.name)}</b><div class="small muted">${esc(d.type)}${d.client ? ' · ' + esc(d.client) : ''} · ${fmtDate(d.start)} → ${fmtDate(d.end)} (${k.m} tháng) · ${esc(person(d.owner).name)}</div></div>
    <div class="table-wrap"><table style="min-width:0"><thead><tr><th>Hạng mục</th><th class="r">SL</th><th class="r">Đơn giá</th><th class="r">Nhân tháng</th><th class="r">Thành tiền</th></tr></thead><tbody>
    ${k.lines.map(l => `<tr><td>${esc(l.name)}</td><td class="r">${l.qty}</td><td class="r">${num(l.price)}</td><td class="r">${l.mult > 1 ? '× ' + l.mult : '—'}</td><td class="r b">${num(l.total)}</td></tr>`).join('') || '<tr><td colspan="5" class="empty">Chưa chọn hạng mục nào (bước 2)</td></tr>'}
    <tr class="grp"><td colspan="4" class="r">Tạm tính</td><td class="r">${vnd(k.sub)}</td></tr></tbody></table></div>
    <label class="checks"><label><input type="checkbox" name="vat" ${d.vat ? 'checked' : ''}>Áp dụng VAT 8%</label></label>`;
  showModal(`<form class="modal wide" data-form="mkw"><h3>${d.id ? 'Sửa chiến dịch' : 'Tạo chiến dịch Marketing'}${closeBtn()}</h3>
    <div class="seg">${['1. Thông tin chiến dịch','2. Chọn hạng mục chi phí','3. Báo giá & xác nhận'].map((l, i) => `<button type="button" class="${step === i + 1 ? 'on' : ''}" data-act="mkw-step" data-s="${i + 1}">${l}</button>`).join('')}</div>
    ${step === 1 ? s1 : step === 2 ? s2 : s3}
    <div class="m-actions"><span class="small muted" style="margin-right:auto;align-self:center">Bước ${step}/3</span>${step > 1 ? `<button type="button" class="btn ghost" data-act="mkw-step" data-s="${step - 1}">Quay lại</button>` : ''}${step < 3 ? `<button type="button" class="btn line" data-act="mkw-step" data-s="${step + 1}">Tiếp theo</button>` : ''}<button class="btn" type="submit">Lưu chiến dịch & xem báo giá</button></div></form>`);
}
function mkwCollect(){
  const f = document.querySelector('form[data-form="mkw"]'); if (!f) return;
  const d = ui.mkw.d, fd = new FormData(f);
  ['name','type','client','owner','start','end','notes'].forEach(k => { if (fd.has(k)) d[k] = fd.get(k); });
  if (ui.mkw.step === 3) d.vat = fd.has('vat');
}
INP['mkw-qty'] = el => {
  const d = ui.mkw.d, id = el.dataset.id, qty = Math.max(0, Math.round(+el.value || 0));
  d.items = d.items.filter(i => i.id !== id); if (qty) d.items.push({id, qty});
  const k = campCalc(d), x = mktItem(id), cell = document.getElementById('mkw-t-' + id);
  if (cell) cell.textContent = qty ? num(x.price * qty * (perMonth(x.unit) ? k.m : 1)) : '—';
  const s = document.getElementById('mkw-sub'); if (s) s.textContent = vnd(k.sub);
};
ACT['mkw-step'] = (el, dd) => {
  mkwCollect();
  if (ui.mkw.step === 1 && +dd.s > 1 && !ui.mkw.d.name.trim()){ const i = document.getElementById('mk-name'); if (i) i.focus(); return; }
  ui.mkw.step = +dd.s; mkwModal();
};
FORM.mkw = () => {
  mkwCollect();
  const d = ui.mkw.d;
  if (!d.name.trim()){ ui.mkw.step = 1; mkwModal(); return toast('Cần đặt tên chiến dịch'); }
  d.items = d.items.filter(i => i.qty > 0);
  const old = S.mkt.campaigns.find(x => x.id === d.id);
  if (old) Object.assign(old, d); else { d.id = 'c' + uid(); S.mkt.campaigns.push(d); log('Tạo chiến dịch ' + d.name, 'pink'); }
  ui.mktCamp = d.id; S.sub.mkt = 'quote'; closeModal(); render(); toast('Đã lưu chiến dịch');
};
SEARCH.push(hit => S.mkt.campaigns.filter(c => hit(c.name + ' ' + c.client)).map(c => ({icon:'megaphone', label:c.name, sub:'Marketing · ' + CSTATUS[c.status][0], run:() => { ui.mktCamp = c.id; nav('mkt', 'quote'); }})));

/* ================= HR: Chấm công + Hồ sơ nhân sự + Bảng lương ================= */
const HR_ST = {active:['Đang làm việc','green'], probation:['Thử việc','yellow'], left:['Đã nghỉ việc','gray']};
const HR_DEPTS = ['Quản lý dự án','Marketing','Kinh doanh','Thi công','Vận hành','Tài chính','Nhân sự'];
const BH_NLD = .105, BH_DN = .215;
MOD.att = () => {
  const tabsAll = [['cc','Chấm công','att'],['staff','Hồ sơ nhân sự','hr'],['pay','Bảng lương','hr']].filter(t => perm(t[2]) !== 'none');
  let cur = S.sub.hr || 'cc'; if (!tabsAll.some(t => t[0] === cur)) cur = S.sub.hr = (tabsAll[0] || ['cc'])[0];
  const tabs = subtabs('hr', tabsAll.map(t => [t[0], t[1]]), 'cc'), edit = perm('hr') === 'edit';
  let body, act = '';
  if (cur === 'cc') body = attCC();
  else if (cur === 'staff'){ body = hrStaff(edit); if (edit) act = `<button class="btn" data-act="hr-new">${ic('plus', 15)}Thêm nhân sự</button>`; }
  else body = hrPay(edit);
  return head('HR', 'Chấm công theo công trường, hồ sơ nhân sự và bảng lương hằng tháng.', act) + tabs + body;
};
function hrStaff(edit){
  const St = S.hr.staff, f = ui.hrF || 'all', q = (ui.hrQ || '').toLowerCase(), dp = ui.hrDept || '';
  const rows = St.filter(x => (f === 'all' || x.status === f) && (!dp || x.dept === dp) && (!q || (x.name + ' ' + x.title + ' ' + x.phone).toLowerCase().includes(q)));
  return `<div class="stats">
    ${stat('Tổng nhân sự', St.length, 'Trên ' + new Set(St.map(x => x.dept)).size + ' phòng ban')}
    ${stat('Đang làm việc', St.filter(x => x.status === 'active').length, 'Chính thức', 'good')}
    ${stat('Thử việc', St.filter(x => x.status === 'probation').length, 'Đang trong kỳ đánh giá')}
    ${stat('Đã nghỉ việc', St.filter(x => x.status === 'left').length, 'Trong 12 tháng qua')}
  </div>
  <div class="row" style="flex-wrap:wrap"><div class="search" style="flex:1;min-width:200px;max-width:320px">${ic('search', 15)}<input id="hr-q" data-input="hr-q" value="${esc(ui.hrQ || '')}" placeholder="Tìm tên, chức vụ, điện thoại"></div>
    <select data-change="hr-dept" style="height:34px;border:1px solid var(--line);border-radius:10px;background:var(--card);padding:0 8px" aria-label="Lọc phòng ban">${opt([['', 'Tất cả phòng ban'], ...HR_DEPTS.map(x => [x, x])], dp)}</select>
    <div class="toolbar">${[['all','Tất cả'], ...Object.entries(HR_ST).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button class="fchip sm ${f === k ? 'on' : ''}" data-act="hr-f" data-f="${k}">${l}</button>`).join('')}</div></div>
  <div class="table-wrap"><table><thead><tr><th>Họ tên</th><th>Chức vụ</th><th>Phòng ban</th><th>Điện thoại</th><th>Ngày vào làm</th><th>Trạng thái</th></tr></thead><tbody>
    ${rows.map(x => `<tr class="${edit ? 'click' : ''}" ${edit ? `data-act="hr-edit" data-id="${x.id}" tabindex="0"` : ''}><td><div class="who">${x.pid ? av(x.pid, 28) : `<span class="av" style="width:28px;height:28px;font-size:11px;background:var(--gray)">${initials(x.name)}</span>`}<b style="font-weight:500">${esc(x.name)}</b></div></td><td>${esc(x.title)}</td><td>${esc(x.dept)}</td><td class="num">${esc(x.phone)}</td><td>${x.start ? fmtFull(x.start) : '—'}</td><td>${pill(...HR_ST[x.status])}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Không có nhân sự phù hợp</td></tr>'}
  </tbody></table></div>`;
}
ACT['hr-f'] = (el, d) => { ui.hrF = d.f; render(); };
CHG['hr-dept'] = el => { ui.hrDept = el.value; render(); };
INP['hr-q'] = el => { ui.hrQ = el.value; render(); };
ACT['hr-new'] = () => hrModal({id:'', name:'', title:'', dept:HR_DEPTS[0], phone:'', email:'', start:todayISO(), status:'probation', gross:0, pid:''});
ACT['hr-edit'] = (el, d) => hrModal(S.hr.staff.find(x => x.id === d.id));
function hrModal(x){
  showModal(`<form class="modal wide" data-form="hr" data-id="${x.id}"><h3>${x.id ? esc(x.name) : 'Thêm nhân sự'}${closeBtn()}</h3>
    <div class="row2"><label class="field">Họ tên *<input name="name" required value="${esc(x.name)}"></label><label class="field">Chức vụ<input name="title" value="${esc(x.title)}"></label></div>
    <div class="row3"><label class="field">Phòng ban<select name="dept">${opt(HR_DEPTS, x.dept)}</select></label><label class="field">Điện thoại<input name="phone" value="${esc(x.phone)}"></label><label class="field">Email<input name="email" type="email" value="${esc(x.email)}"></label></div>
    <div class="row3"><label class="field">Ngày vào làm<input name="start" type="date" value="${x.start}"></label><label class="field">Trạng thái<select name="status">${opt(Object.entries(HR_ST).map(([k, v]) => [k, v[0]]), x.status)}</select></label><label class="field">Lương Gross (đồng/tháng)<input name="gross" type="number" min="0" step="100000" value="${x.gross}"></label></div>
    <label class="field">Gắn với tài khoản / hồ sơ trong workspace<select name="pid">${peopleOpts(x.pid, '— Không gắn —')}</select></label>
    <div class="m-actions">${x.id ? delBtn('hr') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu</button></div></form>`);
}
FORM.hr = (v, f) => {
  const data = {name:v.name.trim(), title:v.title.trim(), dept:v.dept, phone:v.phone.trim(), email:v.email.trim(), start:v.start, status:v.status, gross:Math.max(0, Math.round(+v.gross || 0)), pid:v.pid};
  const x = S.hr.staff.find(s => s.id === f.dataset.id);
  if (x) Object.assign(x, data); else { S.hr.staff.push({id:'h' + uid(), ...data}); log('Thêm nhân sự ' + data.name, 'green'); }
  closeModal(); render(); toast('Đã lưu hồ sơ nhân sự');
};
DEL.hr = id => { S.hr.staff = S.hr.staff.filter(x => x.id !== id); };
function hrPay(edit){
  const per = ui.payPer || todayISO().slice(0, 7), endDay = per + '-31';
  const paid = new Set((S.hr.paid || {})[per] || []);
  const rows = S.hr.staff.filter(x => x.status !== 'left' && (!x.start || x.start <= endDay));
  const g = sum(rows, x => x.gross), bh = g * BH_NLD, net = g - bh;
  const [yy, mm] = per.split('-');
  return `<div class="row between" style="flex-wrap:wrap;gap:10px"><div class="row"><b>Kỳ lương:</b><input type="month" value="${per}" data-change="pay-per" style="height:34px;border:1px solid var(--line);border-radius:10px;padding:0 8px;background:var(--card)" aria-label="Kỳ lương"><span class="muted">Tháng ${+mm}/${yy}</span></div>
    <div class="row"><button class="btn line sm" data-act="pay-copy">${ic('copy', 13)}Sao chép bảng lương</button>${edit ? `<button class="btn sm" data-act="pay-all">Đánh dấu tất cả đã trả</button>` : ''}</div></div>
  <div class="stats">
    ${stat('Tổng quỹ lương (Gross)', vnd(g), rows.length + ' nhân sự trong kỳ')}
    ${stat('Bảo hiểm NLĐ đóng', vnd(bh), 'BHXH 8% + BHYT 1,5% + BHTN 1%')}
    ${stat('Tổng thực nhận', vnd(net), 'Chưa trừ thuế TNCN')}
    ${stat('Đã chi trả', rows.filter(x => paid.has(x.id)).length + ' / ' + rows.length, 'Chi phí DN (gồm BH 21,5%): ' + trd(g * (1 + BH_DN) / 1e6))}
  </div>
  <div class="table-wrap"><table><thead><tr><th>Họ tên</th><th>Chức vụ</th><th class="r">Lương Gross</th><th class="r">BH (NLĐ 10,5%)</th><th class="r">Thực nhận</th><th class="r">BH DN đóng (21,5%)</th><th>Trạng thái</th></tr></thead><tbody>
    ${rows.map(x => `<tr><td><b style="font-weight:500">${esc(x.name)}</b><div class="small muted">${esc(x.dept)}</div></td><td>${esc(x.title)}</td><td class="r">${num(x.gross)}</td><td class="r">${num(x.gross * BH_NLD)}</td><td class="r b">${num(x.gross * (1 - BH_NLD))}</td><td class="r muted">${num(x.gross * BH_DN)}</td><td>${edit ? `<button class="pill ${paid.has(x.id) ? 'green' : 'yellow'}" data-act="pay-toggle" data-id="${x.id}" title="Bấm để đổi trạng thái">${paid.has(x.id) ? 'Đã chi trả' : 'Chờ chi trả'}</button>` : pill(paid.has(x.id) ? 'Đã chi trả' : 'Chờ chi trả', paid.has(x.id) ? 'green' : 'yellow')}</td></tr>`).join('') || '<tr><td colspan="7" class="empty">Không có nhân sự trong kỳ</td></tr>'}
  </tbody></table><div class="foot-note">Nhân sự đã nghỉ việc không tính vào kỳ lương. Thực nhận = Gross − 10,5% bảo hiểm người lao động; chưa trừ thuế TNCN và giảm trừ gia cảnh.</div></div>`;
}
CHG['pay-per'] = el => { ui.payPer = el.value; render(); };
ACT['pay-toggle'] = (el, d) => {
  const per = ui.payPer || todayISO().slice(0, 7); S.hr.paid = S.hr.paid || {};
  const list = new Set(S.hr.paid[per] || []); list.has(d.id) ? list.delete(d.id) : list.add(d.id); S.hr.paid[per] = [...list]; render();
};
ACT['pay-all'] = () => {
  const per = ui.payPer || todayISO().slice(0, 7); S.hr.paid = S.hr.paid || {};
  S.hr.paid[per] = S.hr.staff.filter(x => x.status !== 'left').map(x => x.id); log('Đã chi trả lương kỳ ' + per, 'green'); render(); toast('Đã đánh dấu chi trả toàn bộ kỳ ' + per);
};
ACT['pay-copy'] = () => {
  const rows = [['Họ tên','Chức vụ','Phòng ban','Lương Gross','BH NLĐ 10,5%','Thực nhận']].concat(S.hr.staff.filter(x => x.status !== 'left').map(x => [x.name, x.title, x.dept, x.gross, Math.round(x.gross * BH_NLD), Math.round(x.gross * (1 - BH_NLD))]));
  copyText(rows.map(r => r.join('\t')).join('\n'), 'Đã sao chép bảng lương — dán vào Excel');
};
SEARCH.push(hit => (S.hr ? S.hr.staff : []).filter(x => perm('hr') !== 'none' && hit(x.name + ' ' + x.title)).slice(0, 5).map(x => ({icon:'users', label:x.name, sub:'HR · ' + x.title, run:() => { nav('att', 'staff'); if (perm('hr') === 'edit') hrModal(x); }})));

/* ================= CÀI ĐẶT ================= */
const NOTIFY_DEF = {chat:true, delay:true, po:false, digest:false};
const notifyPrefs = () => { try { return {...NOTIFY_DEF, ...JSON.parse(localStorage.getItem('sf-notify') || '{}')}; } catch (e) { return {...NOTIFY_DEF}; } };
MOD.settings = () => {
  const isAdm = LIVE ? LIVE.isAdmin : true;
  const tabsList = [['account','Tài khoản'],['look','Giao diện'],['notify','Thông báo'],['workspace','Workspace']].concat(LIVE && LIVE.isAdmin ? [['members','Thành viên & phân quyền']] : []).concat([['security','Bảo mật']]);
  let cur = sub('settings', 'account'); if (!tabsList.some(t => t[0] === cur)) cur = 'account';
  const me = person(S.me);
  const toggle = (id, on, label, desc, dis) => `<label class="set-row"><span><b>${label}</b><small>${desc}</small></span><span class="switch"><input type="checkbox" data-change="${id}" ${on ? 'checked' : ''} ${dis ? 'disabled' : ''}><i></i></span></label>`;
  let body;
  if (cur === 'account'){
    body = `<form class="card pad stack set-card" data-form="set-account"><h2 class="sec-title" style="margin:0">Thông tin tài khoản</h2>
      <div class="row">${av(S.me, 56)}<div><b>${esc(me.name)}</b><div class="small muted">${esc(LIVE ? LIVE.email || me.email || '' : 'Chế độ demo')}</div></div></div>
      <div class="row2"><label class="field">Họ tên<input name="name" required value="${esc(me.name)}"></label><label class="field">Chức vụ<input name="title" value="${esc(me.role || '')}"></label></div>
      <div class="row2"><label class="field">Phòng ban / đội<input name="team" value="${esc(me.team || '')}"></label><label class="field">Màu đại diện<select name="color">${opt(['purple','blue','green','yellow','orange','pink','brown'].map(c => [c, {purple:'Tím', blue:'Xanh dương', green:'Xanh lá', yellow:'Vàng', orange:'Cam', pink:'Hồng', brown:'Nâu'}[c]]), me.c)}</select></label></div>
      <div class="m-actions">${LIVE ? `<button type="button" class="btn ghost" data-act="welcome">Xem giới thiệu</button>` : ''}<button class="btn" type="submit">Lưu thay đổi</button></div></form>`;
  } else if (cur === 'look'){
    const th = document.documentElement.dataset.theme || 'system';
    body = `<div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Chế độ hiển thị</h2><div class="small muted">Áp dụng cho toàn bộ Dezon Workspace trên trình duyệt này.</div>
      <div class="theme-cards">${[['light','Sáng'],['dark','Tối'],['system','Theo hệ thống']].map(([k, l]) => `<button class="theme-card ${th === k ? 'on' : ''}" data-act="set-theme" data-t="${k}"><span class="tc-prev tc-${k}"><i></i><i></i><i></i></span>${l}</button>`).join('')}</div></div>
      <div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Menu & bố cục</h2>
      ${toggle('set-rail', ui.railOpen, 'Mở rộng menu', 'Hiện tên mục bên cạnh biểu tượng')}
      ${toggle('set-ai', !$('#frame').classList.contains('ai-hidden'), 'Hiện Dezbot bên phải', 'Trợ lý trả lời về tiến độ, dòng tiền, việc trễ…')}</div>`;
  } else if (cur === 'notify'){
    const n = notifyPrefs(), perm_ = 'Notification' in window ? Notification.permission : 'unsupported';
    body = `<div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Kênh thông báo</h2>
      <div class="row between small" style="background:var(--hover);border-radius:12px;padding:10px 12px"><span>Thông báo trình duyệt: <b>${{granted:'Đã bật', denied:'Đã chặn (mở lại trong cài đặt trình duyệt)', default:'Chưa bật', unsupported:'Trình duyệt không hỗ trợ'}[perm_]}</b></span>${perm_ === 'default' ? `<button class="btn sm" data-act="notify-on">Bật thông báo</button>` : ''}</div>
      ${toggle('set-n-chat', n.chat, 'Tin nhắn Chat', 'Thông báo khi có tin nhắn mới')}
      ${toggle('set-n-delay', n.delay, 'Cảnh báo tiến độ trễ hạn', 'Từ module Quản lý dự án')}
      ${toggle('set-n-po', n.po, 'Đơn mua hàng cần duyệt', 'Từ module Mua hàng')}
      ${toggle('set-n-digest', n.digest, 'Bản tin tổng hợp email hàng tuần', 'Gửi mỗi thứ Hai lúc 8:00 — cần cấu hình máy chủ gửi email, sẽ có ở bản sau', true)}</div>`;
  } else if (cur === 'workspace'){
    const c = company(), canEdit = isAdm;
    body = `<form class="card pad stack set-card" data-form="set-company"><h2 class="sec-title" style="margin:0">Thông tin công ty</h2><div class="small muted">Dùng cho tiêu đề báo giá QS, báo giá Marketing và các chứng từ.${canEdit ? '' : ' Chỉ quản trị viên được sửa.'}</div>
      <div class="row2"><label class="field">Tên công ty<input name="name" value="${esc(c.name)}" ${canEdit ? '' : 'disabled'}></label><label class="field">Tên ngắn (ký tên chứng từ)<input name="short" value="${esc(c.short || '')}" ${canEdit ? '' : 'disabled'}></label></div>
      <label class="field">Địa chỉ<input name="addr" value="${esc(c.addr || '')}" ${canEdit ? '' : 'disabled'}></label>
      <div class="row3"><label class="field">Hotline<input name="hotline" value="${esc(c.hotline || '')}" ${canEdit ? '' : 'disabled'}></label><label class="field">Email<input name="email" value="${esc(c.email || '')}" ${canEdit ? '' : 'disabled'}></label><label class="field">Website<input name="web" value="${esc(c.web || '')}" ${canEdit ? '' : 'disabled'}></label></div>
      <div class="row3"><label class="field">Mã số thuế<input name="tax" value="${esc(c.tax || '')}" ${canEdit ? '' : 'disabled'}></label><label class="field">Số tài khoản ngân hàng<input name="bank" value="${esc(c.bank || '')}" ${canEdit ? '' : 'disabled'}></label><label class="field">Múi giờ<select name="tz" disabled><option>(GMT+7) Hồ Chí Minh</option></select></label></div>
      ${canEdit ? '<div class="m-actions"><button class="btn" type="submit">Lưu thông tin công ty</button></div>' : ''}</form>
      ${!LIVE ? `<div class="card pad small muted">Chế độ demo — khi kết nối Supabase, quản trị viên mời và phân quyền thành viên ở tab “Thành viên & phân quyền”.</div>` : ''}`;
  } else if (cur === 'members'){
    body = MOD.admin ? MOD.admin() : '';
  } else {
    body = `<form class="card pad stack set-card" data-form="set-pw"><h2 class="sec-title" style="margin:0">Đổi mật khẩu</h2>
      ${LIVE ? `<label class="field">Mật khẩu hiện tại<input name="old" type="password" autocomplete="current-password" required></label>
      <div class="row2"><label class="field">Mật khẩu mới (ít nhất 8 ký tự)<input name="p1" type="password" autocomplete="new-password" minlength="8" required></label><label class="field">Nhập lại mật khẩu mới<input name="p2" type="password" autocomplete="new-password" minlength="8" required></label></div>
      <div class="m-actions"><button class="btn" type="submit">Cập nhật mật khẩu</button></div>` : '<div class="small muted">Chế độ demo không có tài khoản.</div>'}</form>
      <div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Phiên đăng nhập</h2>
      ${toggle('set-2fa', false, 'Xác thực hai lớp (2FA)', 'Yêu cầu mã OTP khi đăng nhập thiết bị mới — sẽ có ở bản sau', true)}
      ${LIVE ? `<div class="row between"><span class="small">Đăng xuất khỏi mọi thiết bị (máy tính, điện thoại khác)</span><button class="btn line sm" data-act="logout-all">Đăng xuất mọi nơi</button></div><div class="row between"><span class="small">Đăng xuất trên thiết bị này</span><button class="btn danger sm" data-act="logout">Đăng xuất</button></div>` : ''}</div>`;
  }
  return head('Cài đặt', 'Tài khoản, giao diện, thông báo & workspace.') + `<div class="set-layout"><nav class="card set-nav">${tabsList.map(([k, l]) => `<button class="${cur === k ? 'on' : ''}" data-act="sub" data-view="settings" data-k="${k}">${l}</button>`).join('')}</nav><div class="stack">${body}</div></div>`;
};
ACT.me = () => nav('settings', 'account');
FORM['set-account'] = async v => {
  const data = {name:v.name.trim(), title:v.title.trim(), team:v.team.trim(), color:v.color};
  if (LIVE){
    const {error} = await LIVE.sb.from('profiles').update(data).eq('id', LIVE.uid);
    if (error) return toast('Không lưu được: ' + error.message);
    const me = S.profiles.find(p => p.id === LIVE.uid); Object.assign(me, {name:data.name, role:data.title, team:data.team, c:data.color});
  } else { const me = S.people.find(p => p.id === S.me); if (me) Object.assign(me, {name:data.name, role:data.title, team:data.team, c:data.color}); }
  render(); toast('Đã lưu tài khoản');
};
ACT['set-theme'] = (el, d) => {
  if (d.t === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = d.t;
  try { d.t === 'system' ? localStorage.removeItem('sf-theme') : localStorage.setItem('sf-theme', d.t); } catch (e) {}
  render();
};
CHG['set-rail'] = el => { if (!!ui.railOpen !== el.checked) ACT['rail-toggle'](); };
CHG['set-ai'] = el => { const f = $('#frame'); f.classList.toggle('ai-hidden', !el.checked); try { localStorage.setItem('sf-ai-hidden', el.checked ? '' : '1'); } catch (e) {} };
['chat','delay','po','digest'].forEach(k => CHG['set-n-' + k] = el => { const n = notifyPrefs(); n[k] = el.checked; try { localStorage.setItem('sf-notify', JSON.stringify(n)); } catch (e) {} toast(el.checked ? 'Đã bật' : 'Đã tắt'); });
FORM['set-company'] = v => { S.settings = S.settings || {}; S.settings.company = {name:v.name.trim(), short:v.short.trim(), addr:v.addr.trim(), hotline:v.hotline.trim(), email:v.email.trim(), web:v.web.trim(), tax:v.tax.trim(), bank:v.bank.trim()}; render(); toast('Đã lưu thông tin công ty'); };
FORM['set-pw'] = async (v, f) => {
  if (!LIVE) return;
  if (v.p1 !== v.p2) return toast('Hai mật khẩu mới chưa khớp');
  const chk = await LIVE.sb.auth.signInWithPassword({email:LIVE.email, password:v.old});
  if (chk.error) return toast('Mật khẩu hiện tại không đúng');
  const {error} = await LIVE.sb.auth.updateUser({password:v.p1});
  if (error) return toast(/same|different/i.test(error.message) ? 'Mật khẩu mới phải khác mật khẩu cũ' : error.message);
  f.reset(); toast('Đã đổi mật khẩu');
};
ACT['logout-all'] = async () => { if (!LIVE) return; await LIVE.sb.auth.signOut({scope:'global'}); location.reload(); };
if (typeof ACT['notify-on'] !== 'function') ACT['notify-on'] = async () => { try { await Notification.requestPermission(); } catch (e) {} render(); };

/* ================= trợ lý ================= */
AI.push({re:/marketing|chiến dịch|quảng cáo/, fn:() => {
  const C = S.mkt.campaigns;
  return `Có ${C.length} chiến dịch, tổng ngân sách <b>${vnd(sum(C, c => campCalc(c).total))}</b>:` + list(C.map(c => `${esc(c.name)} — ${CSTATUS[c.status][0]} · ${vnd(campCalc(c).total)}`));
}});
AI.push({re:/mua hàng|đơn mua|nhà cung cấp|\bpo\b/, fn:() => {
  const P = S.qs.po.filter(o => o.status !== 'received');
  return `${P.length} đơn chưa nhận hàng:` + list(P.map(o => `${esc(o.code)} · ${esc(o.brand)} · ${vnd(poVal(o))} — ${POST[o.status][0]}${o.due ? ', giao ' + fmtDate(o.due) : ''}`));
}});
AI.push({re:/lương|nhân sự|thử việc/, fn:() => {
  if (perm('hr') === 'none') return 'Bạn chưa có quyền xem hồ sơ & lương.';
  const St = S.hr.staff.filter(x => x.status !== 'left'), g = sum(St, x => x.gross);
  return `${St.length} nhân sự đang làm (${St.filter(x => x.status === 'probation').length} thử việc). Quỹ lương Gross <b>${vnd(g)}</b>, thực nhận ${vnd(g * (1 - BH_NLD))}.`;
}});
