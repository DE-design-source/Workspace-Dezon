/* Dezon Workspace — QS: bóc tách chiếu sáng theo phòng, danh mục sản phẩm, báo giá. Tiền: đồng. */

/* ================= dữ liệu mẫu ================= */
SEEDS.push(s => {
  const P = (id, name, brand, cat, w, k, a, price, extra = {}) => ({id, name, brand, cat, w, k, a, price, fav:false, combo:false, unit:'', ...extra});
  const R = (id, name, items) => ({id, name, items:items.map(([p, q]) => ({p, q}))});
  s.qs = {vat:8,
    products:[
      P('p1','Đèn âm trần Downlight 9W','Rạng Đông','Đèn âm trần',9,4000,90,145000,{fav:true}),
      P('p2','Đèn LED âm trần Spotlight 12W','Philips','Đèn spotlight',12,3000,36,320000),
      P('p3','Đèn thả bàn ăn Pendant','MPE','Đèn trang trí',40,3000,120,1250000,{fav:true}),
      P('p4','Đèn ốp trần nổi tròn 24W','Điện Quang','Đèn ốp trần',24,4000,180,285000),
      P('p5','Đèn hắt tủ LED thanh (m)','Rạng Đông','Đèn hắt',5,3000,120,95000,{unit:'m'}),
      P('p6','Đèn cầu thang âm tường','MPE','Đèn âm tường',3,3000,60,165000),
      P('p7','Đèn chùm phòng khách','Hồng Phúc','Đèn chùm',60,3000,360,4800000,{fav:true}),
      P('p8','Đèn gương nhà tắm LED','Rạng Đông','Đèn gương',15,6500,100,220000),
      P('p9','Downlight chống chói 12W','Philips','Đèn âm trần',12,3000,60,265000),
      P('p10','Đèn ốp trần vuông 36W','Rạng Đông','Đèn ốp trần',36,6500,120,390000),
      P('p11','Spotlight ray nam châm 7W','MPE','Đèn spotlight',7,3000,24,410000),
      P('p12','Đèn tường trang trí đôi','Hồng Phúc','Đèn trang trí',10,3000,60,690000),
      P('p13','Đèn LED dây 220V (m)','Điện Quang','Đèn hắt',9,3000,120,55000,{unit:'m'}),
      P('p14','Đèn chùm hiện đại 8 bóng','Hồng Phúc','Đèn chùm',64,4000,360,3200000),
      P('p15','Combo downlight phòng khách (10 bộ)','Rạng Đông','Đèn âm trần',9,4000,90,1350000,{combo:true}),
      P('p16','Combo đèn phòng tắm (gương + ốp)','Philips','Đèn gương',20,6500,120,690000,{combo:true})
    ],
    projects:[
      {id:'qs1', code:'QS-01', pid:'riverside', name:'Căn hộ mẫu tầng 1', client:'BQL Riverside', phone:'0909 123 456', addr:'Riverside GĐ2, Tòa A', created:md('2026-09-21'), status:'doing', progress:65, quoted:false, quotedAt:'', rooms:[
        R('r1','Phòng khách',[['p7',1],['p1',8],['p5',4]]), R('r2','Phòng bếp',[['p2',6],['p4',2]]), R('r3','Phòng ngủ master',[['p3',2],['p1',6]]),
        R('r4','WC master',[['p8',3]]), R('r5','Hành lang & cầu thang',[['p6',6],['p1',3],['p5',5]])]},
      {id:'qs2', code:'QS-02', pid:'', name:'Căn hộ A1-05 (khách lẻ)', client:'Chị Minh Thư', phone:'0912 887 234', addr:'Riverside GĐ2, A1-05', created:md('2026-09-15'), status:'draft', progress:20, quoted:false, quotedAt:'', rooms:[
        R('r6','Phòng khách',[['p9',6]]), R('r7','Phòng ngủ',[['p10',1]])]},
      {id:'qs3', code:'QS-03', pid:'riverside', name:'Sảnh & hành lang chung', client:'BQL Riverside', phone:'0909 123 456', addr:'Riverside GĐ2, khu chung', created:md('2026-09-08'), status:'done', progress:100, quoted:true, quotedAt:md('2026-09-21'), rooms:[
        R('r8','Sảnh chính',[['p7',2],['p1',20]]), R('r9','Hành lang tầng 1–5',[['p6',40]])]},
      {id:'qs4', code:'QS-04', pid:'riverside', name:'Nhà mẫu Villa Số 3', client:'Anh Quang Huy', phone:'0938 456 789', addr:'Riverside GĐ2, Villa 3', created:md('2026-09-18'), status:'doing', progress:40, quoted:false, quotedAt:'', rooms:[
        R('r10','Phòng khách',[['p14',1],['p11',6]]), R('r11','Sân vườn',[['p12',4]])]}
    ], po:[]};
});
syncCol('qs_projects', 'array', () => S.qs.projects, v => S.qs.projects = v, {read:['qs','po'], write:['qs', 'projects'], empty:() => []});
syncCol('qs_products', 'array', () => S.qs.products, v => S.qs.products = v, {read:['qs','po'], write:['qs']});
syncCol('qs_settings', 'single', () => ({vat:S.qs.vat}), v => S.qs.vat = v && v.vat != null ? v.vat : 8, {read:['qs','po'], write:['qs']});

/* ================= tiện ích ================= */
const QS_ST = {draft:['Bản nháp','gray'], doing:['Đang bóc','yellow'], done:['Hoàn tất','green']};
const QS_BAR = {draft:'var(--muted)', doing:'var(--purple)', done:'var(--green)'};
const QS_CATS = ['Đèn âm trần','Đèn spotlight','Đèn trang trí','Đèn ốp trần','Đèn hắt','Đèn âm tường','Đèn chùm','Đèn gương'];
const QS_W = [['<10','<10W', w => w < 10], ['10-20','10–20W', w => w >= 10 && w <= 20], ['20-40','20–40W', w => w > 20 && w <= 40], ['>40','>40W', w => w > 40]];
const QS_A = [['<60','<60°', a => a < 60], ['60-120','60–120°', a => a >= 60 && a <= 120], ['>120','>120°', a => a > 120]];
const QS_K = [3000, 4000, 6500];
const QS_PAL = ['purple','blue','green','orange','red','pink'];
const QS_ROOMS = ['Phòng khách','Phòng bếp','Phòng ăn','Phòng ngủ master','Phòng ngủ 2','WC master','WC chung','Ban công','Sân vườn','Hành lang & cầu thang','Sảnh chính'];
const qsEd = () => perm('qs') === 'edit';
const qsProduct = id => (S.qs.products || []).find(p => p.id === id);
const qsPrice = it => { const p = qsProduct(it.p); return p ? +p.price || 0 : 0; };
const qsRoomTotal = r => sum(r.items, it => qsPrice(it) * it.q);
const qsTotal = q => q ? sum(q.rooms || [], qsRoomTotal) : 0;
const qsVatOf = q => q && q.vat != null ? +q.vat : +S.qs.vat || 0;
const qsCalc = q => { const sub_ = qsTotal(q), vat = Math.round(sub_ * qsVatOf(q) / 100); return {sub:sub_, vat, total:sub_ + vat}; };
const qsProgress = q => q.status === 'done' ? 100 : clamp(+q.progress || 0, 0, 100);
const qsColor = brand => { let h = 0; for (const ch of String(brand)) h = (h * 31 + ch.charCodeAt(0)) % QS_PAL.length; return QS_PAL[h]; };
const qsCur = () => S.qs.projects.find(q => q.id === ui.qsCur) || S.qs.projects[0];
const qsSite = q => { const p = q.pid && (S.projects || []).find(x => x.id === q.pid); return p ? p.name : q.addr; };
const qsPoStatus = o => o.status === 'approve' ? 'wait' : o.status;
const qsPoVal = o => typeof poVal === 'function' ? poVal(o) : sum(o.items || [], it => (it.price != null ? +it.price : qsPrice(it)) * it.q);
const qsMil = v => dec(v / 1e6, 2) + 'tr';
const qsF = () => ui.qsF || (ui.qsF = {cat:'', brands:[], w:'', k:'', a:'', fav:false, combo:false, min:'', max:'', q:''});
const qsBrands = () => [...new Set(S.qs.products.map(p => p.brand))].sort((a, b) => a.localeCompare(b, 'vi'));
function qsMatch(p){
  const f = qsF();
  if (f.q && !(p.name + ' ' + p.brand + ' ' + p.cat).toLowerCase().includes(f.q.toLowerCase())) return false;
  if (f.cat && p.cat !== f.cat) return false;
  if (f.brands.length && !f.brands.includes(p.brand)) return false;
  if (f.w && !QS_W.find(x => x[0] === f.w)[2](+p.w || 0)) return false;
  if (f.k && +p.k !== +f.k) return false;
  if (f.a && !QS_A.find(x => x[0] === f.a)[2](+p.a || 0)) return false;
  if (f.fav && !p.fav) return false;
  if (f.combo && !p.combo) return false;
  if (f.min !== '' && p.price < +f.min) return false;
  if (f.max !== '' && p.price > +f.max) return false;
  return true;
}
function qsTouch(q){ if (q.status === 'draft') q.status = 'doing'; }
function qsTargetRoom(q){
  if (!q) return null;
  let r = q.rooms.find(x => x.id === ui.qsRoom);
  if (!r) r = q.rooms[0];
  if (!r){ r = {id:uid(), name:'Phòng khách', items:[]}; q.rooms.push(r); }
  return r;
}
function qsAddProduct(q, room, pid){
  const it = room.items.find(x => x.p === pid);
  if (it) it.q++; else room.items.push({p:pid, q:1});
  qsTouch(q);
}

/* ================= trang ================= */
MOD.qs = () => {
  const cur = sub('qs', 'overview'), Q = S.qs, q = qsCur();
  const pend = Q.po.filter(o => qsPoStatus(o) === 'wait').length;
  const tabs = subtabs('qs', [['overview','Tổng quan'],['projects','Dự án'],['takeoff','Bóc tách chi phí'],['products','Danh sách sản phẩm'],['quote','Xuất báo giá'],['po','Mua hàng', pend]], 'overview');
  const qsApp = (S.apps || []).find(x => x.id === 'qspro');
  const h = head('QS — Bóc tách & Báo giá', 'Bóc tách chiếu sáng theo phòng, chọn sản phẩm từ danh mục, xuất báo giá và tạo đơn mua hàng.', qsApp ? `<button class="btn line" data-act="nav" data-v="app-qspro">${ic('external', 15)}Mở QS Pro</button>` : '') + tabs;
  if (!q && ['takeoff','quote','po'].includes(cur)) return h + emptyBox('Chưa có dự án QS', 'Tạo dự án QS đầu tiên để bắt đầu bóc tách theo phòng.', qsEd() ? `<button class="btn" data-act="qs-new">${ic('plus', 15)}Tạo dự án QS</button>` : '');
  return h + ({overview:qsOverview, projects:qsProjectsTab, takeoff:qsTakeoffTab, products:qsProductsTab, quote:qsQuoteTab, po:qsPoTab}[cur] || qsOverview)(q);
};
const qsPicker = q => `<select data-change="qs-cur" aria-label="Chọn dự án QS" style="height:34px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);padding:0 8px;max-width:280px">${opt(S.qs.projects.map(x => [x.id, x.code + ' · ' + x.name]), q.id)}</select>`;

function qsOverview(){
  const P = S.qs.projects, by = {};
  P.forEach(x => x.rooms.forEach(r => r.items.forEach(it => { const p = qsProduct(it.p); if (p) by[p.brand] = (by[p.brand] || 0) + p.price * it.q; })));
  const bl = Object.entries(by).sort((a, b) => b[1] - a[1]), bmax = bl.length ? bl[0][1] : 1;
  const quoted = P.filter(x => x.quoted), cnt = k => P.filter(x => x.status === k).length;
  const pend = S.qs.po.filter(o => qsPoStatus(o) === 'wait');
  return `<div class="stats">
      ${stat('Dự án QS', P.length, cnt('doing') + ' đang bóc · ' + cnt('draft') + ' bản nháp · ' + cnt('done') + ' hoàn tất')}
      ${stat('Tổng giá trị bóc tách', dec(sum(P, qsTotal) / 1e6, 1) + ' triệu', 'Trên ' + P.length + ' dự án chiếu sáng (chưa VAT)')}
      ${stat('Đã xuất báo giá', quoted.length, quoted.map(x => esc(x.name)).join(', ') || 'Chưa gửi báo giá nào')}
      ${stat('Đơn mua hàng đang chờ', pend.length, pend.length ? 'Cần đặt hàng trong tuần' : 'Không có đơn chờ đặt', pend.length ? 'bad' : 'good')}
    </div>
    ${P.length ? `<div class="grid-3-2">
      <div class="card list-card"><h2 class="sec-title">Dự án QS gần đây <button class="link" data-act="sub" data-view="qs" data-k="projects">Xem tất cả ›</button></h2>
        ${[...P].sort((a, b) => String(b.created).localeCompare(String(a.created))).slice(0, 6).map(x => `<button class="li" data-act="qs-open" data-id="${x.id}"><span class="sq" style="--c:var(--purple);--t:var(--purple-t)">${ic('ruler', 16)}</span><span class="ell"><b>${esc(x.name)}</b><small>${esc(x.client)} · ${fmtDate(x.created)}</small></span><span class="end row" style="gap:10px"><span style="width:90px">${bar(qsProgress(x), QS_BAR[x.status])}</span><span class="small num">${qsProgress(x)}%</span>${pill(...QS_ST[x.status])}</span></button>`).join('')}</div>
      <div class="card pad stack"><h2 class="sec-title" style="margin:0">Top thương hiệu sử dụng</h2>${bl.map(([b, v]) => `<div><div class="kpi-row"><span>${esc(b)}</span><span>${qsMil(v)}</span></div>${bar(v / bmax * 100, cv(qsColor(b)))}</div>`).join('') || '<div class="empty">Chưa có sản phẩm trong bóc tách</div>'}</div>
    </div>` : emptyBox('Chưa có dự án QS', 'Tạo dự án QS để bắt đầu bóc tách.', qsEd() ? `<button class="btn" data-act="qs-new">${ic('plus', 15)}Tạo dự án QS</button>` : '')}`;
}

function qsProjectsTab(){
  const s = (ui.qsQ || '').toLowerCase();
  const rows = S.qs.projects.filter(x => !s || (x.code + ' ' + x.name + ' ' + x.client).toLowerCase().includes(s));
  return `<div class="row between" style="flex-wrap:wrap;gap:8px"><div class="search" style="flex:1;max-width:360px">${ic('search', 15)}<input id="qs-q" data-input="qs-q" value="${esc(ui.qsQ || '')}" placeholder="Tìm dự án QS..." aria-label="Tìm dự án QS"></div>${qsEd() ? `<button class="btn sm" data-act="qs-new">${ic('plus', 14)}Tạo dự án</button>` : ''}</div>
    <div class="table-wrap"><table><thead><tr><th>Mã</th><th>Tên dự án</th><th>Khách hàng</th><th>Điện thoại</th><th>Địa chỉ</th><th>Ngày tạo</th><th style="width:140px">Tiến độ</th><th class="r">Giá trị</th><th>Trạng thái</th><th></th></tr></thead><tbody>
      ${rows.map(x => `<tr class="click" data-act="qs-open" data-id="${x.id}" tabindex="0"><td class="b num">${esc(x.code)}</td><td class="b">${esc(x.name)}</td><td>${esc(x.client)}</td><td class="num">${esc(x.phone)}</td><td>${esc(x.addr)}</td><td>${fmtDate(x.created)}</td><td><div class="row"><div style="flex:1">${bar(qsProgress(x), QS_BAR[x.status])}</div><span class="small num">${qsProgress(x)}%</span></div></td><td class="r">${vnd(qsTotal(x))}</td><td>${pill(...QS_ST[x.status])}</td><td class="r"><span class="row" style="gap:4px;justify-content:flex-end">${qsEd() ? `<button class="icon-btn sm" data-act="qs-edit" data-id="${x.id}" aria-label="Sửa thông tin ${esc(x.code)}">${ic('edit', 15)}</button>` : ''}<span class="link">Bấm để sửa ›</span></span></td></tr>`).join('') || `<tr><td colspan="10" class="empty">${S.qs.projects.length ? 'Không tìm thấy dự án phù hợp' : 'Chưa có dự án QS'}</td></tr>`}
    </tbody></table></div>`;
}

function qsTakeoffTab(q){
  const ed = qsEd(), room = q.rooms.find(r => r.id === ui.qsRoom), shown = room ? [room] : q.rooms, C = qsCalc(q);
  const line = (r, it, i) => { const p = qsProduct(it.p) || {name:'(Sản phẩm đã xoá)', brand:'—', cat:'', price:0};
    return `<tr><td>${esc(p.name)}<div class="small muted">${esc(p.cat)}${p.w ? ' · ' + p.w + 'W' + (p.unit ? '/' + esc(p.unit) : '') : ''}${p.k ? ' · ' + p.k + 'K' : ''}</div></td><td>${esc(p.brand)}</td>
      <td>${ed ? `<span class="stepper"><button data-act="qs-qty" data-r="${r.id}" data-i="${i}" data-d="-1" aria-label="Giảm">${ic('minus', 13)}</button><input id="qty-${r.id}-${i}" type="number" min="1" value="${it.q}" data-change="qs-qty-set" data-r="${r.id}" data-i="${i}" aria-label="Số lượng ${esc(p.name)}"><button data-act="qs-qty" data-r="${r.id}" data-i="${i}" data-d="1" aria-label="Tăng">${ic('plus', 13)}</button></span>` : it.q}</td>
      <td class="r">${num(p.price)}</td><td class="r b">${num(p.price * it.q)}</td><td class="r">${ed ? `<button class="icon-btn sm" data-act="qs-item-del" data-r="${r.id}" data-i="${i}" aria-label="Xoá dòng">${ic('trash', 15)}</button>` : ''}</td></tr>`; };
  return `<div class="card pad row between" style="flex-wrap:wrap;gap:10px">
      <div class="row" style="flex-wrap:wrap">${qsPicker(q)}<b>${esc(q.name)}${qsSite(q) ? ' — ' + esc(qsSite(q)) : ''}</b>${pill(...QS_ST[q.status])}${pill('VAT ' + qsVatOf(q) + '%', 'purple')}</div>
      <div class="row" style="flex-wrap:wrap">${ed ? `<label class="small muted row" style="gap:6px">VAT<select data-change="qs-vat" style="height:30px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink)">${opt([[0,'0%'],[8,'8%'],[10,'10%']], qsVatOf(q))}</select></label>
        <button class="btn line sm" data-act="sub" data-view="qs" data-k="products">${ic('filter', 14)}Bộ lọc</button><button class="btn line sm" data-act="qs-edit" data-id="${q.id}">${ic('edit', 14)}Thông tin</button><button class="btn line sm" data-act="qs-room-new">${ic('plus', 14)}Thêm phòng</button><button class="btn sm" data-act="qs-pick">${ic('plus', 14)}Thêm hạng mục</button>` : ''}</div></div>
    <div class="qs-layout">
      <div class="card" style="padding:8px"><div class="small muted" style="padding:6px 10px">Danh sách phòng</div>
        <button class="room ${!room ? 'on' : ''}" data-act="qs-room" data-id="all"><span>Tất cả (${q.rooms.length} phòng)</span><small>${qsMil(C.sub)}</small></button>
        ${q.rooms.map(r => `<button class="room ${room === r ? 'on' : ''}" data-act="qs-room" data-id="${r.id}"><span class="ell">${esc(r.name)}</span><small>${qsMil(qsRoomTotal(r))}</small></button>`).join('')}
        ${ed ? `<button class="room" data-act="qs-room-new"><span class="muted">+ Thêm phòng khác</span></button>` : ''}
      </div>
      <div class="stack">
        ${shown.map(r => `<div class="card"><div class="row between" style="padding:12px 16px;flex-wrap:wrap"><b>${esc(r.name)}</b><span class="row"><b class="num">${vnd(qsRoomTotal(r))}</b>${ed ? `<button class="btn ghost sm" data-act="qs-pick" data-r="${r.id}">${ic('plus', 13)}Thêm</button><button class="icon-btn sm" data-act="qs-room-edit" data-id="${r.id}" aria-label="Đổi tên hoặc xoá phòng ${esc(r.name)}">${ic('edit', 15)}</button>` : ''}</span></div>
          <div class="table-wrap" style="border:0;border-radius:0"><table><thead><tr><th>Sản phẩm</th><th>Thương hiệu</th><th>SL</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th><th></th></tr></thead><tbody>
          ${r.items.map((it, i) => line(r, it, i)).join('') || `<tr><td colspan="6" class="small muted" style="text-align:center">Chưa có sản phẩm${ed ? ` — <button class="link" data-act="qs-pick" data-r="${r.id}">thêm sản phẩm</button>` : ''}</td></tr>`}
          </tbody></table></div></div>`).join('') || emptyBox('Chưa có phòng', 'Thêm phòng rồi chọn sản phẩm từ danh mục.', ed ? `<button class="btn" data-act="qs-room-new">${ic('plus', 15)}Thêm phòng</button>` : '')}
        <div class="card totals"><div><span class="muted">Tạm tính (${q.rooms.length} phòng)</span><span class="num">${vnd(C.sub)}</span></div><div><span class="muted">VAT (${qsVatOf(q)}%)</span><span class="num">${vnd(C.vat)}</span></div><div class="grand"><span>Tổng cộng</span><span class="num">${vnd(C.total)}</span></div>
          <div style="margin-top:6px;gap:8px;justify-content:flex-end;flex-wrap:wrap">${perm('po') === 'edit' ? `<button class="btn line sm" data-act="qs-po-gen" data-id="${q.id}">${ic('cart', 14)}Tạo đơn mua hàng</button>` : ''}<button class="btn sm" data-act="sub" data-view="qs" data-k="quote">Xem báo giá ›</button></div></div>
      </div>
    </div>`;
}

function qsProductsTab(q){
  const F = qsF(), list = S.qs.products.filter(qsMatch), ed = qsEd();
  const chips = (key, items) => `<div class="chips">${items.map(([v, l]) => `<button class="fchip sm ${String(F[key]) === String(v) ? 'on' : ''}" data-act="qs-pf" data-k="${key}" data-v="${esc(v)}">${esc(l)}</button>`).join('')}</div>`;
  const inp = 'style="width:100%;height:34px;border:1px solid var(--line);border-radius:10px;padding:0 8px;background:var(--card);color:var(--ink)"';
  const target = q && qsTargetRoom(q);
  return `<div class="prod-layout">
    <div class="card filters"><div class="row between"><b style="font-size:13px" class="row">${ic('filter', 15)} Bộ lọc</b><button class="link" data-act="qs-pf-clear">Xoá lọc</button></div>
      <div><h4>Lọc theo đề mục</h4><div class="chips"><button class="fchip sm ${!F.cat ? 'on' : ''}" data-act="qs-pf" data-k="cat" data-v="">Tất cả đề mục</button>${[...new Set(QS_CATS.concat(S.qs.products.map(p => p.cat)))].map(c => `<button class="fchip sm ${F.cat === c ? 'on' : ''}" data-act="qs-pf" data-k="cat" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>
      <div><h4>Thương hiệu</h4><div class="stack" style="gap:6px">${qsBrands().map(b => `<label class="row small" style="gap:8px;cursor:pointer"><input type="checkbox" data-change="qs-brand" value="${esc(b)}" ${F.brands.includes(b) ? 'checked' : ''} style="accent-color:var(--purple)">${esc(b)}</label>`).join('')}</div></div>
      <div><h4>Công suất</h4>${chips('w', QS_W.map(x => [x[0], x[1]]))}</div>
      <div><h4>Nhiệt độ màu</h4>${chips('k', QS_K.map(k => [k, k + 'K']))}</div>
      <div><h4>Góc chiếu sáng</h4>${chips('a', QS_A.map(x => [x[0], x[1]]))}</div>
      <label class="row between small" style="cursor:pointer">Yêu thích<span class="switch"><input type="checkbox" data-change="qs-pf-fav" ${F.fav ? 'checked' : ''} aria-label="Chỉ sản phẩm yêu thích"><i></i></span></label>
      <label class="row between small" style="cursor:pointer">Combo<span class="switch"><input type="checkbox" data-change="qs-pf-combo" ${F.combo ? 'checked' : ''} aria-label="Chỉ combo"><i></i></span></label>
      <div><h4>Khoảng giá (đồng)</h4><div class="row"><input type="number" min="0" placeholder="Giá từ" value="${esc(F.min)}" data-change="qs-pf-min" ${inp} aria-label="Giá từ">—<input type="number" min="0" placeholder="Tới" value="${esc(F.max)}" data-change="qs-pf-max" ${inp} aria-label="Giá tới"></div></div>
    </div>
    <div class="stack">
      <div class="row between" style="flex-wrap:wrap;gap:8px"><div class="search" style="flex:1;min-width:200px">${ic('search', 15)}<input id="qs-pf-q" data-input="qs-pf-q" value="${esc(F.q)}" placeholder="Tìm tên sản phẩm, thương hiệu" aria-label="Tìm sản phẩm"></div>
        <span class="small muted">${list.length} sản phẩm phù hợp</span>${ed ? `<button class="btn line sm" data-act="qs-prod-new">${ic('plus', 14)}Sản phẩm</button>` : ''}</div>
      ${q && ed ? `<div class="card pad row" style="flex-wrap:wrap;gap:8px;padding:10px 14px"><span class="small muted">Bấm “+ Thêm” để đưa vào</span>${qsPicker(q)}<select data-change="qs-room-set" aria-label="Phòng nhận sản phẩm" style="height:34px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);padding:0 8px">${opt(q.rooms.map(r => [r.id, r.name]), target.id)}</select><button class="link" data-act="sub" data-view="qs" data-k="takeoff">Xem bóc tách ›</button></div>` : ''}
      <div class="prods">${list.map(p => { const c = qsColor(p.brand); return `<div class="card prod"><div class="thumb" style="--c:${cv(c)};--t:${ct(c)};position:relative">${ic('bulb', 34)}<button class="star ${p.fav ? 'on' : ''}" data-act="qs-fav" data-id="${p.id}" aria-label="${p.fav ? 'Bỏ yêu thích' : 'Yêu thích'}" style="position:absolute;top:8px;right:8px">${ic('star', 17)}</button>${p.combo ? `<span style="position:absolute;top:8px;left:8px">${pill('Combo', 'purple')}</span>` : ''}</div>
          <div class="row between"><span class="small muted ell">${esc(p.brand)} · ${esc(p.cat)}</span>${ed ? `<button class="icon-btn sm" data-act="qs-prod-edit" data-id="${p.id}" aria-label="Sửa sản phẩm">${ic('edit', 14)}</button>` : ''}</div>
          <b>${esc(p.name)}</b><div class="spec">${pill(p.w + 'W' + (p.unit ? '/' + p.unit : ''), 'gray')}${pill(p.k + 'K', 'gray')}${pill(p.a + '°', 'gray')}</div>
          <div class="row between"><span class="val">${num(p.price)} đ</span>${q && ed ? `<button class="btn sm" data-act="qs-add" data-p="${p.id}">${ic('plus', 13)}Thêm</button>` : ''}</div></div>`; }).join('') || '<div class="empty">Không có sản phẩm phù hợp bộ lọc</div>'}</div>
    </div></div>`;
}

function qsCompanyHead(){
  if (typeof companyHead === 'function') return companyHead();
  const c = typeof company === 'function' ? company() : {};
  return `<div><b style="font-size:15px">${esc(c.name || 'CÔNG TY DEZON')}</b><div style="font-size:12px;color:#555">${esc(c.addr || '')}${c.hotline ? ' · Hotline: ' + esc(c.hotline) : ''}</div></div>`;
}
function qsQuoteTab(q){
  const C = qsCalc(q), d = q.quotedAt || todayISO(), until = addDays(d, 15), ed = qsEd();
  return `<div class="card pad row between hide-print" style="flex-wrap:wrap;gap:10px"><div class="row" style="flex-wrap:wrap">${qsPicker(q)}${q.quoted ? pill('Đã gửi khách hàng ' + fmtDate(q.quotedAt), 'green') : pill('Chưa gửi', 'gray')}</div>
      <div class="row" style="flex-wrap:wrap"><button class="btn line sm" data-act="qs-quote-copy">${ic('copy', 14)}Xuất Excel</button><button class="btn line sm" data-act="qs-print">${ic('file', 14)}Xuất PDF</button>${ed ? `<button class="btn sm" data-act="qs-quote-send" ${q.quoted ? 'disabled' : ''}>${ic('check', 14)}Gửi khách hàng</button>` : ''}</div></div>
    <div class="doc" id="quoteDoc">
      <div class="doc-head">${qsCompanyHead()}<div style="text-align:right"><div style="font-size:20px;font-weight:700;letter-spacing:.06em">BÁO GIÁ</div><div style="font-size:12px;color:#444">Số: ${esc(q.code)}/${d.slice(0, 4)}<br>Ngày: ${fmtFull(d)}</div></div></div>
      <div class="doc-info"><div><span style="color:#777">Khách hàng:</span> <b>${esc(q.client)}</b></div><div><span style="color:#777">Điện thoại:</span> <b>${esc(q.phone || '—')}</b></div><div><span style="color:#777">Dự án:</span> <b>${esc(q.name)}${qsSite(q) ? ' — ' + esc(qsSite(q)) : ''}</b></div><div><span style="color:#777">Địa chỉ:</span> <b>${esc(q.addr || '—')}</b></div></div>
      <div style="overflow-x:auto"><table style="min-width:520px"><thead><tr><th>Hạng mục / Sản phẩm</th><th class="r">SL</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th></tr></thead><tbody>
        ${q.rooms.filter(r => r.items.length).map(r => `<tr class="grp"><td colspan="4">${esc(r.name)}</td></tr>` + r.items.map(it => { const p = qsProduct(it.p) || {name:'(Sản phẩm đã xoá)', price:0}; return `<tr><td>${esc(p.name)}</td><td class="r">${it.q}</td><td class="r">${num(p.price)}</td><td class="r">${num(p.price * it.q)}</td></tr>`; }).join('')).join('') || '<tr><td colspan="4" style="text-align:center;color:#888">Chưa có hạng mục</td></tr>'}
      </tbody></table></div>
      <div style="display:flex;justify-content:flex-end;margin-top:12px"><div style="min-width:280px;display:flex;flex-direction:column;gap:6px">
        <div class="row between"><span>Tạm tính</span><b>${vnd(C.sub)}</b></div>
        <div class="row between"><span>VAT (${qsVatOf(q)}%)</span><b>${vnd(C.vat)}</b></div>
        <div class="row between" style="border-top:2px solid #1b1d20;padding-top:8px;font-size:15px"><b>Tổng cộng</b><b>${vnd(C.total)}</b></div></div></div>
      <div style="font-size:12px;color:#666;margin-top:18px">Báo giá có hiệu lực trong 15 ngày kể từ ngày phát hành (đến ${fmtFull(until)}). Giá đã bao gồm VAT, chưa bao gồm chi phí lắp đặt (nếu có).</div>
    </div>`;
}

function qsPoTab(q){
  const mine = S.qs.po.filter(o => o.qp === q.id), c = k => mine.filter(o => qsPoStatus(o) === k).length;
  const ST = {wait:['Chưa đặt','gray'], ordered:['Đã đặt','blue'], received:['Đã nhận','green']};
  return `<div class="card pad row between" style="flex-wrap:wrap;gap:10px"><div class="row" style="flex-wrap:wrap">${qsPicker(q)}<span class="small muted">Gom sản phẩm bóc tách theo nhà cung cấp — mỗi thương hiệu một đơn, không VAT.</span></div>
      <div class="row" style="flex-wrap:wrap"><button class="btn line sm" data-act="nav" data-v="po">Xem đầy đủ tại trang Mua hàng ›</button>${perm('po') === 'edit' ? `<button class="btn sm" data-act="qs-po-gen" data-id="${q.id}">${ic('plus', 14)}Tạo đơn mua hàng</button>` : ''}</div></div>
    <div class="stats">${stat('Tổng đơn mua hàng', mine.length, q.code)}${stat('Chưa đặt', c('wait'), 'Cần đặt hàng', c('wait') ? 'bad' : '')}${stat('Đã đặt', c('ordered'), 'Đang chờ giao')}${stat('Tổng giá trị', dec(sum(mine, qsPoVal) / 1e6, 2) + ' triệu', c('received') + ' đơn đã nhận')}</div>
    <div class="table-wrap"><table><thead><tr><th>Mã PO</th><th>Nhà cung cấp</th><th class="r">Số mặt hàng</th><th class="r">Tổng giá trị</th><th>Ngày giao dự kiến</th><th>Trạng thái</th></tr></thead><tbody>
      ${mine.map(o => `<tr class="click" data-act="po-open" data-id="${o.id}" tabindex="0"><td class="b num">${esc(o.code)}</td><td>${esc(o.supplier || o.brand)}</td><td class="r">${(o.items || []).length}</td><td class="r b">${vnd(qsPoVal(o))}</td><td>${o.due ? fmtDate(o.due) : '—'}</td><td>${pill(...ST[qsPoStatus(o)] || ST.wait)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Dự án này chưa có đơn mua hàng</td></tr>'}
    </tbody></table></div>`;
}

/* ================= sự kiện ================= */
CHG['qs-cur'] = el => { ui.qsCur = el.value; ui.qsRoom = 'all'; render(); };
CHG['qs-vat'] = el => { const q = qsCur(); if (!q || !qsEd()) return; q.vat = +el.value; render(); };
INP['qs-q'] = el => { ui.qsQ = el.value; render(); };
ACT['qs-open'] = (el, d) => { ui.qsCur = d.id; ui.qsRoom = 'all'; S.sub.qs = 'takeoff'; render(); };
ACT['qs-room'] = (el, d) => { ui.qsRoom = d.id; render(); };
CHG['qs-room-set'] = el => { ui.qsRoom = el.value; };
const qsItemAt = d => { const q = qsCur(), r = q && q.rooms.find(x => x.id === d.r); return {q, r, it:r && r.items[+d.i]}; };
ACT['qs-qty'] = (el, d) => { const {q, r, it} = qsItemAt(d); if (!it || !qsEd()) return; it.q = Math.max(1, it.q + +d.d); qsTouch(q); render(); };
CHG['qs-qty-set'] = el => { const {q, it} = qsItemAt(el.dataset); if (!it || !qsEd()) return; it.q = Math.max(1, Math.round(+el.value || 1)); qsTouch(q); render(); };
ACT['qs-item-del'] = (el, d) => { const {q, r} = qsItemAt(d); if (!r || !qsEd()) return; r.items.splice(+d.i, 1); qsTouch(q); render(); };

/* phòng */
const qsRoomModal = r => showModal(`<form class="modal" data-form="qs-room" data-id="${r ? r.id : ''}"><h3>${r ? 'Phòng ' + esc(r.name) : 'Thêm phòng'}${closeBtn()}</h3>
  <label class="field">Tên phòng / khu vực<input id="rm-name" name="name" required list="rm-list" value="${esc(r ? r.name : '')}" placeholder="VD: Phòng ngủ 2"></label>
  <datalist id="rm-list">${QS_ROOMS.map(x => `<option value="${x}">`).join('')}</datalist>
  <div class="m-actions">${r ? delBtn('qs-room') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">${r ? 'Lưu' : 'Thêm phòng'}</button></div></form>`);
ACT['qs-room-new'] = () => qsRoomModal(null);
ACT['qs-room-edit'] = (el, d) => qsRoomModal(qsCur().rooms.find(r => r.id === d.id));
FORM['qs-room'] = (v, f) => {
  const q = qsCur(); if (!q || !qsEd()) return;
  const r = q.rooms.find(x => x.id === f.dataset.id);
  if (r) r.name = v.name.trim(); else { const n = {id:uid(), name:v.name.trim(), items:[]}; q.rooms.push(n); ui.qsRoom = n.id; qsTouch(q); }
  closeModal(); render();
};
DEL['qs-room'] = id => { const q = qsCur(); q.rooms = q.rooms.filter(r => r.id !== id); ui.qsRoom = 'all'; };

/* chọn sản phẩm từ danh mục */
ACT['qs-pick'] = (el, d) => { const q = qsCur(); if (!q) return; ui.qsPickRoom = d.r || qsTargetRoom(q).id; ui.qsPickQ = ''; qsPickModal(); };
function qsPickModal(){
  const q = qsCur(), s = (ui.qsPickQ || '').toLowerCase();
  if (!q.rooms.some(r => r.id === ui.qsPickRoom)) ui.qsPickRoom = qsTargetRoom(q).id;
  const room = q.rooms.find(r => r.id === ui.qsPickRoom);
  const list = S.qs.products.filter(p => !s || (p.name + ' ' + p.brand + ' ' + p.cat).toLowerCase().includes(s));
  const html = `<div class="modal wide" id="qsPickM"><h3>Thêm hạng mục vào bóc tách${closeBtn()}</h3>
    <div class="row" style="flex-wrap:wrap;align-items:flex-end"><label class="field" style="flex:1;min-width:180px">Phòng<select data-change="qs-pick-room">${opt(q.rooms.map(r => [r.id, r.name]), ui.qsPickRoom)}</select></label><label class="field" style="flex:2;min-width:200px">Tìm sản phẩm<input id="qs-pick-q" data-input="qs-pick-q" value="${esc(ui.qsPickQ || '')}" placeholder="Tên, thương hiệu, đề mục…"></label></div>
    <div class="stack" style="max-height:52vh;overflow:auto;gap:4px">${list.map(p => { const n = (room.items.find(x => x.p === p.id) || {}).q; return `<div class="li"><span class="sq" style="--c:${cv(qsColor(p.brand))};--t:${ct(qsColor(p.brand))}">${ic('bulb', 16)}</span><span class="ell"><b>${esc(p.name)}</b><small>${esc(p.brand)} · ${esc(p.cat)} · ${p.w}W · ${p.k}K</small></span><span class="end row"><span class="num small">${num(p.price)} đ</span>${n ? pill('×' + n, 'purple') : ''}<button class="btn sm" data-act="qs-pick-add" data-p="${p.id}">${ic('plus', 13)}Thêm</button></span></div>`; }).join('') || '<div class="empty">Không tìm thấy sản phẩm</div>'}</div>
    <div class="m-actions"><button class="btn" data-act="qs-pick-done">Xong</button></div></div>`;
  if ($('#qsPickM')){ $('#modal').innerHTML = html; const i = $('#qs-pick-q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); } else showModal(html);
}
INP['qs-pick-q'] = el => { ui.qsPickQ = el.value; qsPickModal(); };
CHG['qs-pick-room'] = el => { ui.qsPickRoom = el.value; qsPickModal(); };
ACT['qs-pick-add'] = (el, d) => {
  const q = qsCur(), r = q.rooms.find(x => x.id === ui.qsPickRoom); if (!r || !qsEd()) return;
  qsAddProduct(q, r, d.p); render(); qsPickModal(); toast(`Đã thêm ${qsProduct(d.p).name} vào ${r.name}`);
};
ACT['qs-pick-done'] = () => { closeModal(); render(); };
ACT['qs-add'] = (el, d) => {
  const q = qsCur(); if (!q || !qsEd()) return;
  const r = qsTargetRoom(q); qsAddProduct(q, r, d.p);
  render(); toast(`Đã thêm ${qsProduct(d.p).name} vào ${r.name} (${q.code})`);
};

/* bộ lọc danh mục */
ACT['qs-pf'] = (el, d) => { const F = qsF(); F[d.k] = String(F[d.k]) === d.v ? '' : d.v; if (d.k === 'cat') F.cat = d.v; render(); };
CHG['qs-brand'] = el => { const F = qsF(); F.brands = el.checked ? [...new Set(F.brands.concat(el.value))] : F.brands.filter(b => b !== el.value); render(); };
CHG['qs-pf-fav'] = el => { qsF().fav = el.checked; render(); };
CHG['qs-pf-combo'] = el => { qsF().combo = el.checked; render(); };
CHG['qs-pf-min'] = el => { qsF().min = el.value; render(); };
CHG['qs-pf-max'] = el => { qsF().max = el.value; render(); };
INP['qs-pf-q'] = el => { qsF().q = el.value; render(); };
ACT['qs-pf-clear'] = () => { ui.qsF = null; render(); };
ACT['qs-fav'] = (el, d) => { const p = qsProduct(d.id); if (!p || !qsEd()) return; p.fav = !p.fav; render(); };

/* sản phẩm */
function qsProdModal(p){
  const used = p && S.qs.projects.some(q => q.rooms.some(r => r.items.some(it => it.p === p.id)));
  p = p || {id:'', name:'', brand:'', cat:QS_CATS[0], w:10, unit:'', k:3000, a:90, price:0, combo:false};
  showModal(`<form class="modal" data-form="qs-prod" data-id="${p.id}"><h3>${p.id ? esc(p.name) : 'Thêm sản phẩm'}${closeBtn()}</h3>
    <label class="field">Tên sản phẩm<input id="pr-name" name="name" required value="${esc(p.name)}"></label>
    <div class="row2"><label class="field">Thương hiệu / nhà cung cấp<input id="pr-brand" name="brand" required list="pr-brands" value="${esc(p.brand)}"></label><label class="field">Đề mục<input id="pr-cat" name="cat" required list="pr-cats" value="${esc(p.cat)}"></label></div>
    <datalist id="pr-brands">${qsBrands().map(b => `<option value="${esc(b)}">`).join('')}</datalist><datalist id="pr-cats">${QS_CATS.map(c => `<option value="${c}">`).join('')}</datalist>
    <div class="row3"><label class="field">Công suất (W)<input id="pr-w" name="w" type="number" step="any" min="0" value="${p.w}"></label><label class="field">Nhiệt độ màu (K)<input id="pr-k" name="k" type="number" min="0" value="${p.k}"></label><label class="field">Góc chiếu (°)<input id="pr-a" name="a" type="number" min="0" value="${p.a}"></label></div>
    <div class="row3"><label class="field">Đơn giá (đồng)<input id="pr-price" name="price" type="number" min="0" step="1000" required value="${p.price}"></label><label class="field">Đơn vị tính theo<select id="pr-unit" name="unit">${opt([['', 'Bộ / cái'], ['m', 'Mét (W/m)']], p.unit || '')}</select></label><label class="field">Loại<select id="pr-combo" name="combo">${opt([['0', 'Sản phẩm lẻ'], ['1', 'Combo']], p.combo ? '1' : '0')}</select></label></div>
    ${used ? '<div class="small muted">Sản phẩm đang dùng trong bóc tách nên không xoá được.</div>' : ''}
    <div class="m-actions">${p.id && !used ? delBtn('qs-prod') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu</button></div></form>`);
}
ACT['qs-prod-new'] = () => qsProdModal(null);
ACT['qs-prod-edit'] = (el, d) => qsProdModal(qsProduct(d.id));
FORM['qs-prod'] = (v, f) => {
  if (!qsEd()) return;
  const p = qsProduct(f.dataset.id), data = {name:v.name.trim(), brand:v.brand.trim(), cat:v.cat.trim(), w:+v.w || 0, k:+v.k || 0, a:+v.a || 0, price:Math.round(+v.price || 0), unit:v.unit, combo:v.combo === '1'};
  if (p) Object.assign(p, data); else S.qs.products.push({id:'p' + uid(), fav:false, ...data});
  closeModal(); render(); toast('Đã lưu sản phẩm');
};
DEL['qs-prod'] = id => { S.qs.products = S.qs.products.filter(p => p.id !== id); };

/* dự án QS */
function qsProjModal(q){
  const x = q || {id:'', name:'', client:'', phone:'', addr:'', pid:'', status:'draft', progress:0};
  showModal(`<form class="modal" data-form="qs-proj" data-id="${x.id}"><h3>${q ? esc(q.code) + ' · ' + esc(q.name) : 'Tạo dự án QS'}${closeBtn()}</h3>
    <label class="field">Tên dự án / hạng mục<input id="qp-name" name="name" required value="${esc(x.name)}" placeholder="VD: Căn hộ mẫu tầng 2"></label>
    <div class="row2"><label class="field">Khách hàng<input id="qp-client" name="client" required value="${esc(x.client)}"></label><label class="field">Điện thoại<input id="qp-phone" name="phone" value="${esc(x.phone)}"></label></div>
    <label class="field">Địa chỉ<input id="qp-addr" name="addr" value="${esc(x.addr)}"></label>
    <label class="field">Gắn với dự án thi công<select id="qp-pid" name="pid">${opt([['', '— Không gắn —'], ...(S.projects || []).map(p => [p.id, p.name])], x.pid)}</select></label>
    ${q ? `<div class="row2"><label class="field">Trạng thái<select id="qp-status" name="status">${opt(Object.entries(QS_ST).map(([k, v]) => [k, v[0]]), x.status)}</select></label><label class="field">Tiến độ bóc tách (%)<input id="qp-progress" name="progress" type="number" min="0" max="100" value="${qsProgress(x)}"></label></div>` : ''}
    <div class="m-actions">${q ? delBtn('qs-proj') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">${q ? 'Lưu' : 'Tạo & bắt đầu bóc tách'}</button></div></form>`);
}
ACT['qs-new'] = () => qsProjModal(null);
ACT['qs-edit'] = (el, d, e) => { if (e) e.stopPropagation(); qsProjModal(S.qs.projects.find(x => x.id === d.id)); };
FORM['qs-proj'] = (v, f) => {
  if (!qsEd()) return;
  const q = S.qs.projects.find(x => x.id === f.dataset.id);
  const data = {name:v.name.trim(), client:v.client.trim(), phone:(v.phone || '').trim(), addr:(v.addr || '').trim(), pid:v.pid || ''};
  if (q){
    Object.assign(q, data, {status:v.status, progress:v.status === 'done' ? 100 : clamp(Math.round(+v.progress || 0), 0, 100)});
    closeModal(); render(); toast('Đã lưu ' + q.code); return;
  }
  const n = Math.max(0, ...S.qs.projects.map(x => +String(x.code).split('-')[1] || 0)) + 1;
  const nq = {id:'q' + uid(), code:'QS-' + pad(n), ...data, created:todayISO(), status:'draft', progress:0, quoted:false, quotedAt:'', rooms:[{id:uid(), name:'Phòng khách', items:[]}]};
  S.qs.projects.push(nq); ui.qsCur = nq.id; ui.qsRoom = 'all'; S.sub.qs = 'takeoff';
  log('Tạo dự án QS ' + nq.code + ' · ' + nq.name, 'purple'); closeModal(); render();
};
DEL['qs-proj'] = id => { S.qs.projects = S.qs.projects.filter(x => x.id !== id); if (ui.qsCur === id) ui.qsCur = null; };

/* báo giá & mua hàng */
ACT['qs-quote-copy'] = () => {
  const q = qsCur(), C = qsCalc(q), d = q.quotedAt || todayISO(), rows = [['BÁO GIÁ ' + q.code + '/' + d.slice(0, 4), '', '', fmtFull(d)], ['Khách hàng: ' + q.client, 'Điện thoại: ' + (q.phone || ''), '', ''], ['Hạng mục / Sản phẩm','SL','Đơn giá','Thành tiền']];
  q.rooms.forEach(r => { if (!r.items.length) return; rows.push([r.name, '', '', '']); r.items.forEach(it => { const p = qsProduct(it.p) || {name:'', price:0}; rows.push([p.name, it.q, p.price, p.price * it.q]); }); });
  rows.push(['', '', 'Tạm tính', C.sub], ['', '', 'VAT ' + qsVatOf(q) + '%', C.vat], ['', '', 'Tổng cộng', C.total]);
  copyText(rows.map(r => r.join('\t')).join('\n'), 'Đã sao chép bảng báo giá — dán vào Excel');
};
ACT['qs-print'] = () => window.print();
ACT['qs-quote-send'] = () => {
  const q = qsCur(); if (!q || !qsEd()) return;
  q.quoted = true; q.quotedAt = todayISO(); if (q.status === 'draft') q.status = 'doing';
  log(`Đã gửi báo giá ${q.code} (${vnd(qsCalc(q).total)}) cho ${q.client}`, 'purple');
  render(); toast('Đã đánh dấu gửi báo giá ' + q.code + ' cho ' + q.client);
};
ACT['qs-po-gen'] = (el, d) => {
  if (typeof poCreateFromTakeoff !== 'function') return toast('Module Mua hàng chưa sẵn sàng');
  poCreateFromTakeoff(d.id);
};

/* ================= tìm nhanh & trợ lý ================= */
SEARCH.push(hit => S.qs.projects.filter(q => hit(q.code + ' ' + q.name + ' ' + q.client)).map(q => ({icon:'ruler', label:q.code + ' · ' + q.name, sub:'QS · ' + vnd(qsTotal(q)), run:() => { ui.qsCur = q.id; ui.qsRoom = 'all'; nav('qs', 'takeoff'); }})));
SEARCH.push(hit => S.qs.products.filter(p => hit(p.name + ' ' + p.brand)).slice(0, 5).map(p => ({icon:'bulb', label:p.name, sub:p.brand + ' · ' + num(p.price) + ' đ', run:() => { qsF().q = p.name; nav('qs', 'products'); }})));
AI.push({re:/bóc tách|báo giá|\bqs\b|đơn giá/, fn:() => {
  if (!S.qs) return '';
  const P = S.qs.projects, open = P.filter(q => q.status !== 'done'), sent = P.filter(q => q.quoted);
  return `Có <b>${P.length}</b> dự án QS, tổng giá trị bóc tách ${vnd(sum(P, qsTotal))} (chưa VAT). ${open.length ? 'Chưa hoàn thành:' + list(open.map(q => `${esc(q.code)} · ${esc(q.name)} — ${QS_ST[q.status][0]} ${qsProgress(q)}%`)) : 'Tất cả đã hoàn tất. '}Đã gửi báo giá: ${sent.map(q => esc(q.code)).join(', ') || 'chưa có'}. <button class="link" data-act="nav" data-v="qs" data-sub="projects">Mở QS ›</button>`;
}});
