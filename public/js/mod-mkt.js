/* Dezon Workspace — Marketing: chiến dịch → chọn hạng mục chi phí vào gói → báo giá (4 mẫu), danh mục chi phí phòng, nhiệm vụ & điểm thưởng.
   Menu tab con sửa được (ẩn / khôi phục / đổi tên / thêm tab) — lưu theo workspace ở bộ 'mkt_tabs'. */

/* ================= hằng số & công thức ================= */
const MKT_GROUPS = [['A','Nhân sự (đã gồm BH & KPCĐ DN đóng)'],['C','Công cụ & phần mềm'],['D','Thiết bị quay, chụp, dựng (khấu hao)'],['F','Quảng cáo fanpage'],['G','Sản xuất nội dung'],['H','Tổ chức sự kiện'],['I','Chi phí khác']];
const mktGroupLabel = g => (MKT_GROUPS.find(x => x[0] === g) || [g, g])[1];
const MKT_CATALOG_SEED = [
  ['a1','A','Head Marketing','người-tháng',21870000],['a2','A','Graphic Designer','người-tháng',18225000],['a3','A','Media (quay, dựng video)','người-tháng',19440000],
  ['a4','A','Content Creator','người-tháng',17010000],['a5','A','Intern dựng video','người-tháng',3000000],['a6','A','Intern content','người-tháng',3500000],
  ['c1','C','Adobe Creative Cloud','tháng',133333],['c2','C','CapCut Pro / phần mềm dựng khác','tháng',93333],['c3','C','Render video AI','tháng',780000],
  ['d1','D','Máy quay / máy ảnh Sony a73','tháng',944444],['d2','D','Máy quay / máy ảnh Sony a7s3','tháng',2083333],['d3','D','Lens FE 1.8/50','tháng',166667],
  ['d4','D','Lens Tamron 17-28mm F/2.8','tháng',444444],['d5','D','Tripod','tháng',83333],['d6','D','Đèn ZSYB 500GRB','tháng',72222],['d7','D','Đèn YZYB Y500S','tháng',111111],
  ['d8','D','Softbox','tháng',83333],['d9','D','Mic DJI','tháng',47222],['d10','D','MIC RODE','tháng',208333],['d11','D','Mic chân Podcast','tháng',194444],['d12','D','Ổ cứng HDD Synology 12TB','tháng',916667],
  ['f1','F','Decox','tháng',55000000],['f2','F','Decox Design','tháng',15000000],['f3','F','Kiến Phong Legend (Studio network)','tháng',3000000],['f4','F','Mas Architect (Studio network)','tháng',3000000],
  ['f5','F','Quảng cáo Web (Google Ads, SEO)','tháng',35000000],
  ['g1','G','Đi lại quay / chụp công trình','tháng',500000],['g2','G','In ấn ấn phẩm (profile, brochure, catalogue)','lần',2400000],['g3','G','Thuê ngoài / freelancer','tháng',5000000],
  ['h1','H','Ngân sách sự kiện (mở bán, tri ân KH...)','sự kiện',15000000],
  ['i1','I','Văn phòng phẩm, vật tư','tháng',300000],['i2','I','Dự phòng phát sinh','tháng',2000000]
].map(([id, group, name, unit, price]) => ({id, group, groupLabel:mktGroupLabel(group), name, unit, price}));
const MKT_STATUS = {draft:['Bản nháp','yellow'], active:['Đang chạy','green'], done:['Đã hoàn tất','gray']};
const MKT_TYPES = ['Ra mắt dự án','Truyền thông thương hiệu','Tuyển khách hàng tiềm năng (Lead gen)','Sự kiện','Khác'];
const MKT_UNITS = ['người-tháng','tháng','lần','sự kiện'];
const MKT_NOCLIENT = '— Không gắn dự án cụ thể —';
const MKT_TABS_DEF = [['campaigns','Chiến dịch'],['catalog','Danh mục'],['quote','Báo giá'],['quest','Nhiệm vụ']];
const MKT_TPLS = [['modern','Hiện đại','pink'],['classic','Cổ điển','brown'],['minimal','Tối giản','gray'],['detailed','Chi tiết','blue']];

// Số tháng = số tháng lịch tính cả 2 đầu (bỏ qua ngày); thiếu ngày → 1.
function mktMonths(start, end){
  if (!start || !end) return 1;
  const a = parseD(start), b = parseD(end);
  return Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1);
}
const mktScales = unit => unit === 'tháng' || unit === 'người-tháng';
const mktItem = id => (S.mkt && S.mkt.catalog || []).find(x => x.id === id);
const mktFmt = n => vnd(n);
// Toàn bộ số liệu báo giá của 1 chiến dịch: dòng (theo thứ tự hạng mục trong gói, chỉ SL>0), tổng nhóm, tạm tính, VAT 8%, tổng.
function mktCalc(c, vatOn){
  const months = mktMonths(c.start, c.end);
  const lines = (c.items || []).map(it => {
    const x = mktItem(it.id); if (!x || !(it.qty > 0)) return null;
    const scales = mktScales(x.unit);
    return {id:x.id, name:x.name, unit:x.unit, price:x.price, qty:it.qty, group:x.group, groupLabel:x.groupLabel || mktGroupLabel(x.group), scales, total:it.qty * x.price * (scales ? months : 1)};
  }).filter(Boolean);
  const groupTotals = {};
  lines.forEach(l => groupTotals[l.group] = (groupTotals[l.group] || 0) + l.total);
  const subtotal = sum(lines, l => l.total), vat = vatOn ? subtotal * .08 : 0;
  return {months, lines, groupTotals, subtotal, vat, grand:subtotal + vat};
}
const mktNo = c => 'BG-' + String((String(c.id).match(/\d+/) || ['0'])[0]).padStart(3, '0') + '-' + new Date().getFullYear();
const mktOwner = c => { const p = allPeople().find(x => x.id === c.owner); return p ? p.name : (c.owner || '—'); };
const mktDate = s => s ? fmtFull(s) : '—';
const mktRange = c => `${mktDate(c.start)} → ${mktDate(c.end)}`;
const mktCanEdit = () => perm('mkt') === 'edit';
const MKT_DEFCO = {name:'Công ty TNHH Kiến trúc Xây dựng Decox', short:'SiteFlow', addr:'123 Đường Nguyễn Văn Linh, Q.7, TP.HCM', hotline:'0909 123 456', email:'marketing@decox.vn', tax:'0312xxxxxx', bank:'0071xxxxxxx — Vietcombank CN TP.HCM'};
const mktCo = () => { const c = typeof company === 'function' ? company() : null; return c && c.name ? c : MKT_DEFCO; };
// Khách / dự án liên quan lấy từ Kinh doanh + Quản lý dự án
function mktClients(cur){
  const a = (S.leads || []).map(l => l.proj && l.proj !== l.type ? `${l.name} — ${l.proj}` : l.name).concat((S.projects || []).map(p => p.client || p.name));
  return [...new Set([...a.filter(Boolean), 'Khác', ...(cur ? [cur] : [])])];
}

/* ================= đồng bộ & dữ liệu mẫu ================= */
syncCol('mkt_catalog', 'array', () => S.mkt.catalog, v => { S.mkt = S.mkt || {}; S.mkt.catalog = v; }, {read:['mkt'], write:['mkt']});
syncCol('mkt_campaigns', 'array', () => S.mkt.campaigns, v => { S.mkt = S.mkt || {}; S.mkt.campaigns = v; }, {read:['mkt'], write:['mkt'], empty:() => []});
syncCol('mkt_tabs', 'single', () => S.mkt_tabs, v => S.mkt_tabs = v, {read:['mkt'], write:['mkt']});
registerQuest('mkt', {view:'mkt', sub:'quest', perm:'mkt', stepWord:'bước chiến dịch'});
// Ngày mẫu của chiến dịch dời theo NGUYÊN THÁNG (md() dời theo ngày sẽ làm lệch số tháng): 'YYYY-MM' → ngày đầu / cuối tháng.
const mktMonthMd = (ym, end) => { const [y, m] = ym.split('-').map(Number), mo = Math.round(SHIFT / 30.44); return iso(end ? new Date(y, m + mo, 0) : new Date(y, m - 1 + mo, 1)); };
SEEDS.push(s => {
  ensurePeople(s, [
    {id:'do-thao-vy', name:'Đỗ Thảo Vy', role:'Head Marketing', team:'Marketing', c:'pink'},
    {id:'minh-quan', name:'Minh Quân', role:'Media (quay, dựng video)', team:'Marketing', c:'blue'},
    {id:'thuy-duong', name:'Thuỳ Dương', role:'Content Creator', team:'Marketing', c:'green'},
    {id:'nhat-minh', name:'Nhật Minh', role:'Intern content', team:'Marketing', c:'orange'},
    {id:'gia-bao', name:'Gia Bảo', role:'Intern dựng video', team:'Marketing', c:'purple'}
  ]);
  s.mkt = {catalog:MKT_CATALOG_SEED.map(x => ({...x})), campaigns:[
    {id:'camp1', name:'Ra mắt Riverside Giai đoạn 3', type:'Ra mắt dự án', client:'BQL Riverside', owner:'ta', start:mktMonthMd('2026-09'), end:mktMonthMd('2026-10', true), status:'active', vat:false,
      notes:'Mục tiêu 40 KHTN, chốt tối thiểu 3 căn trong GĐ3.', items:[{id:'f1', qty:1}, {id:'f5', qty:1}, {id:'a4', qty:2}, {id:'g3', qty:1}, {id:'h1', qty:1}]},
    {id:'camp2', name:'Truyền thông thương hiệu Quý 4', type:'Truyền thông thương hiệu', client:'', owner:'ta', start:mktMonthMd('2026-10'), end:mktMonthMd('2026-12', true), status:'draft', vat:false,
      notes:'Tăng nhận diện thương hiệu trên các kênh mạng xã hội chính.', items:[{id:'a1', qty:1}, {id:'a3', qty:1}, {id:'c1', qty:1}, {id:'d1', qty:1}, {id:'f2', qty:1}]}
  ]};
  s.mkt_tabs = {list:MKT_TABS_DEF.map(([k, label]) => ({k, label, hidden:false}))};
  const R = (id, name, pts, icon) => ({id, name, pts, icon});
  s.quest_mkt = mkQuest('Quy trình chiến dịch — Ra mắt Riverside Giai đoạn 3', 'Phòng Marketing', 'Toàn bộ phòng Marketing', 'Quy trình Truyền thông thương hiệu Quý 4', [
    ['Lên kế hoạch & duyệt ngân sách', [['Xác định mục tiêu & KPI chiến dịch', 20, 'do-thao-vy', 1], ['Lập ngân sách & chọn hạng mục chi phí', 20, 'do-thao-vy', 1], ['Trình duyệt ngân sách', 15, 'ta', 1]]],
    ['Sản xuất nội dung', [['Viết kịch bản & content', 20, 'thuy-duong', 1], ['Quay, dựng video giới thiệu dự án', 30, 'minh-quan', 1], ['Thiết kế hình ảnh & ấn phẩm quảng cáo', 25, 'nh', 1]]],
    ['Setup quảng cáo', [['Setup tài khoản quảng cáo Decox / Decox Design', 20, 'do-thao-vy', 1], ['Setup landing page & form thu lead', 25, 'minh-quan', 1], ['Chạy thử nghiệm A/B creative', 20, 'thuy-duong']]],
    ['Chạy chiến dịch & tối ưu', [['Theo dõi ngân sách & hiệu suất hàng ngày', 20, 'do-thao-vy'], ['Tối ưu targeting theo dữ liệu', 25, 'minh-quan'], ['Trả lời tin nhắn / bình luận khách hàng tiềm năng', 20, 'nhat-minh']]],
    ['Đo lường & báo cáo', [['Tổng hợp số liệu KHTN / lead theo kênh', 20, 'gia-bao'], ['Tính chi phí trên mỗi lead (CPL)', 20, 'do-thao-vy'], ['Báo cáo tổng kết chiến dịch', 25, 'do-thao-vy']]]
  ], {'do-thao-vy':{week:140, total:1580, avail:860}, 'minh-quan':{week:110, total:1320, avail:920}, nh:{week:90, total:1150, avail:900}, 'thuy-duong':{week:80, total:980, avail:980}, 'nhat-minh':{week:50, total:520, avail:520}, 'gia-bao':{week:40, total:430, avail:430}},
  [R('m1','Phiếu cà phê / trà sữa (1 tuần)',250,'gift'), R('m2','Ngày làm việc từ xa (1 ngày)',400,'star'), R('m3','Voucher mua sắm 200.000đ',500,'gift'), R('m4','Khoá học thiết kế / dựng video nâng cao',800,'book'), R('m5','Bộ phụ kiện quay dựng cá nhân',1500,'phone'), R('m6','Thưởng tiền mặt 500.000đ',2000,'wallet')],
  [{who:'minh-quan', reward:'Ngày làm việc từ xa (1 ngày)', pts:400, date:md('2026-09-19')}, {who:'nh', reward:'Phiếu cà phê / trà sữa (1 tuần)', pts:250, date:md('2026-09-12')}], 6015);
});

/* ================= menu tab sửa được ================= */
function mktTabs(){
  if (!S.mkt_tabs || !Array.isArray(S.mkt_tabs.list)) S.mkt_tabs = {list:MKT_TABS_DEF.map(([k, label]) => ({k, label, hidden:false}))};
  return S.mkt_tabs.list;
}
function mktTabBar(cur){
  const T = mktTabs(), vis = T.filter(t => !t.hidden), hid = T.filter(t => t.hidden), editing = !!ui.mktEdit && mktCanEdit();
  const inp = (form, id, val, ph) => `<form class="mkt-tab-inp" data-form="${form}"><input id="${id}" name="label" value="${esc(val)}" placeholder="${ph}" aria-label="${ph}" autocomplete="off"></form>`;
  return `<div class="mkt-tabbar ${editing ? 'editing' : ''}"><div class="seg" role="tablist">${vis.map(t => ui.mktRen === t.k && editing ? inp('mkt-tab-ren', 'mkt-ren', t.label, 'Tên tab')
      : `<button role="tab" class="${cur === t.k ? 'on' : ''}" data-act="mkt-tab" data-k="${esc(t.k)}" ${editing ? 'title="Bấm để đổi tên"' : ''}>${esc(t.label)}${editing ? `<span class="mkt-x" data-act="mkt-tab-hide" data-k="${esc(t.k)}" title="Ẩn tab này" aria-label="Ẩn tab ${esc(t.label)}">×</span>` : ''}</button>`).join('')}
      ${editing ? (ui.mktAdd ? inp('mkt-tab-add', 'mkt-add', '', 'Tên tab mới, Enter để lưu') : `<button class="mkt-plus" data-act="mkt-tab-add" title="Thêm tab mới" aria-label="Thêm tab mới">${ic('plus', 14)}</button>`) : ''}</div>
    ${mktCanEdit() ? `<button class="btn ${editing ? '' : 'line'} sm" data-act="mkt-tab-edit" title="Chỉnh sửa menu — thêm hoặc bớt tab">${editing ? 'Xong' : ic('edit', 13) + 'Chỉnh sửa menu'}</button>` : ''}</div>
    ${editing && hid.length ? `<div class="toolbar"><span class="small muted">Tab đã ẩn — bấm để khôi phục:</span>${hid.map(t => `<button class="fchip sm" data-act="mkt-tab-show" data-k="${esc(t.k)}">${ic('plus', 12)}${esc(t.label)}</button>`).join('')}</div>` : ''}
    ${editing ? '<div class="small muted">Bấm vào tên tab để đổi tên · × để ẩn · + để thêm tab tuỳ chỉnh. Thay đổi lưu cho cả workspace.</div>' : ''}`;
}
ACT['mkt-tab-edit'] = () => { ui.mktEdit = !ui.mktEdit; ui.mktRen = null; ui.mktAdd = false; render(); };
ACT['mkt-tab'] = (el, d) => {
  if (ui.mktEdit && mktCanEdit()){ ui.mktRen = d.k; ui.mktAdd = false; render(); return; }
  S.sub.mkt = d.k; render();
};
ACT['mkt-tab-hide'] = (el, d) => {
  const T = mktTabs(), t = T.find(x => x.k === d.k);
  if (!t || T.filter(x => !x.hidden).length <= 1){ toast('Cần giữ lại ít nhất 1 tab'); return; }
  t.hidden = true; if (ui.mktRen === d.k) ui.mktRen = null;
  if (sub('mkt', 'campaigns') === d.k) S.sub.mkt = T.find(x => !x.hidden).k;
  render();
};
ACT['mkt-tab-show'] = (el, d) => { const t = mktTabs().find(x => x.k === d.k); if (t){ t.hidden = false; render(); } };
ACT['mkt-tab-add'] = () => { ui.mktAdd = true; ui.mktRen = null; render(); };
function mktTabCommit(kind, value){
  if (kind === 'ren'){
    const k = ui.mktRen; if (!k) return; ui.mktRen = null;
    const t = mktTabs().find(x => x.k === k), v = String(value || '').trim();
    if (t && v) t.label = v.slice(0, 40);
  } else {
    if (!ui.mktAdd) return; ui.mktAdd = false;
    const v = String(value || '').trim();
    if (v){
      const T = mktTabs(), n = Math.max(0, ...T.map(t => +(String(t.k).match(/^custom(\d+)$/) || [0, 0])[1])) + 1;
      T.push({k:'custom' + n, label:v.slice(0, 40), hidden:false, custom:true}); S.sub.mkt = 'custom' + n;
    }
  }
  render();
}
FORM['mkt-tab-ren'] = v => mktTabCommit('ren', v.label);
FORM['mkt-tab-add'] = v => mktTabCommit('add', v.label);
AFTER.mkt = () => {
  // ô đổi tên / thêm tab: Enter hoặc rời ô = lưu, Esc = huỷ
  [['mkt-ren', 'ren'], ['mkt-add', 'add']].forEach(([id, kind]) => {
    const el = document.getElementById(id); if (!el) return;
    if (document.activeElement !== el){ el.focus(); el.select(); }
    el.onblur = () => mktTabCommit(kind, el.value);
    el.onkeydown = e => { if (e.key === 'Escape'){ e.stopPropagation(); if (kind === 'ren') ui.mktRen = null; else ui.mktAdd = false; render(); } };
  });
};

/* ================= trang ================= */
MOD.mkt = () => {
  if (!S.mkt) S.mkt = {catalog:MKT_CATALOG_SEED.map(x => ({...x})), campaigns:[]};
  if (!S.mkt.catalog) S.mkt.catalog = []; if (!S.mkt.campaigns) S.mkt.campaigns = [];
  const T = mktTabs(), vis = T.filter(t => !t.hidden);
  let cur = sub('mkt', 'campaigns');
  if (!vis.some(t => t.k === cur)) cur = (vis[0] || T[0]).k;
  const edit = mktCanEdit(), C = S.mkt.campaigns;
  const top = head('Marketing', 'Khởi tạo chiến dịch → chọn hạng mục chi phí vào gói → ra báo giá', edit ? `<button class="btn" data-act="mkt-new">${ic('plus', 15)}Tạo chiến dịch</button>` : '') + mktTabBar(cur);
  let body;
  if (cur === 'campaigns') body = mktCampaigns(C, edit);
  else if (cur === 'catalog') body = mktCatalog(edit);
  else if (cur === 'quote') body = mktQuote(C, edit);
  else if (cur === 'quest') body = questView('mkt');
  else { const t = T.find(x => x.k === cur); body = emptyBox(esc(t ? t.label : cur), `Tab "${esc(t ? t.label : cur)}" chưa có nội dung — đây là tab tuỳ chỉnh do bạn thêm vào menu.`); }
  return top + body;
};

function mktCampaigns(C, edit){
  const f = ui.mktF || 'all', totals = C.map(c => mktCalc(c).subtotal);
  return `<div class="stats">
      ${stat('Tổng chiến dịch', C.length, 'Đã khởi tạo trong hệ thống')}
      ${stat('Đang chạy', C.filter(c => c.status === 'active').length, 'Trạng thái đã duyệt / đang triển khai', 'good')}
      ${stat('Bản nháp', C.filter(c => c.status === 'draft').length, 'Chờ duyệt ngân sách')}
      ${stat('Tổng ngân sách đã lập', mktFmt(sum(totals)), 'Cộng dồn báo giá các chiến dịch')}
    </div>
    ${C.length ? `<div class="toolbar">${[['all','Tất cả'], ...Object.entries(MKT_STATUS).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button class="fchip sm ${f === k ? 'on' : ''}" data-act="mkt-f" data-f="${k}">${l}<span class="muted">${k === 'all' ? C.length : C.filter(c => c.status === k).length}</span></button>`).join('')}</div>` : ''}
    <div class="camp-grid">${C.map((c, i) => [c, totals[i]]).filter(([c]) => f === 'all' || c.status === f).map(([c, tot]) => `<button class="card camp" data-act="mkt-open" data-id="${esc(c.id)}">
      <div class="row between" style="align-items:flex-start"><b>${esc(c.name)}</b>${pill(...(MKT_STATUS[c.status] || MKT_STATUS.draft))}</div>
      <span class="small muted">${esc(c.type)} · ${esc(c.client || MKT_NOCLIENT)}</span>
      <span class="small muted">${mktRange(c)} (${mktMonths(c.start, c.end)} tháng) · ${esc(mktOwner(c))}</span>
      <div class="row between camp-f"><span class="small muted">${(c.items || []).filter(x => x.qty > 0).length} hạng mục</span><span class="camp-total">${mktFmt(tot)}</span></div></button>`).join('')
      || `<div class="card pad empty" style="grid-column:1/-1">${C.length ? 'Không có chiến dịch ở trạng thái này.' : 'Chưa có chiến dịch nào — bấm "Tạo chiến dịch" để khởi tạo và lập báo giá.'}</div>`}</div>`;
}

function mktCatalog(edit){
  const cat = S.mkt.catalog;
  return `<div class="row between" style="flex-wrap:wrap;gap:10px;align-items:flex-start"><div class="small muted" style="max-width:80ch">Danh mục hạng mục chi phí dùng để chọn vào gói khi tạo chiến dịch. Đơn giá nhân sự (nhóm A) đã bao gồm BH & KPCĐ doanh nghiệp đóng (BHXH 17.5% + BHYT 3% + BHTN 1% trên lương Gross).</div><span class="pill gray">${cat.length} hạng mục</span></div>
    <div class="mkt-cat">${MKT_GROUPS.map(([g, label]) => {
      const items = cat.filter(x => x.group === g);
      return `<div class="card mkt-group"><div class="mkt-group-h"><b>${g}. ${esc(label)}</b><span class="small muted">${items.length} hạng mục</span></div>
        <div style="overflow-x:auto"><table><thead><tr><th>Hạng mục</th><th>Đơn vị</th><th class="r">Đơn giá</th></tr></thead><tbody>
        ${items.map(x => `<tr class="${edit ? 'click' : ''}" ${edit ? `data-act="mkt-item" data-id="${esc(x.id)}" tabindex="0" title="Sửa hạng mục"` : ''}><td>${esc(x.name)}</td><td>${esc(x.unit)}</td><td class="r b">${mktFmt(x.price)}</td></tr>`).join('') || '<tr><td colspan="3" class="muted small">Chưa có hạng mục</td></tr>'}
        </tbody></table></div>
        ${edit ? `<button class="mkt-add-row" data-act="mkt-item-new" data-g="${g}">${ic('plus', 13)}Thêm hạng mục</button>` : ''}</div>`;
    }).join('')}</div>
    <div class="small muted">* Chi phí phúc lợi & chi phí nhân sự chung (nhóm B) không gắn theo từng chiến dịch nên không nằm trong danh mục lập báo giá — xem tại báo cáo phòng ban.</div>`;
}

function mktQuote(C, edit){
  if (!C.length) return emptyBox('Chưa có chiến dịch', 'Chưa có chiến dịch nào để lập báo giá — bấm "Tạo chiến dịch" ở góc trên bên phải.', edit ? `<button class="btn" data-act="mkt-new">${ic('plus', 15)}Tạo chiến dịch</button>` : '');
  const c = C.find(x => x.id === ui.mktCamp) || C[0], tpl = ui.mktTpl || 'modern', qd = mktCalc(c, !!c.vat), st = MKT_STATUS[c.status] || MKT_STATUS.draft;
  const next = {draft:['active','Duyệt ngân sách','ok'], active:['done','Đánh dấu hoàn tất','line'], done:['active','Mở lại chiến dịch','ghost']}[c.status];
  return `<div class="row" style="flex-wrap:wrap"><label class="field" style="flex-direction:row;align-items:center;gap:10px">Xem báo giá chiến dịch:<select data-change="mkt-camp" style="min-width:260px">${opt(C.map(x => [x.id, x.name]), c.id)}</select></label></div>
    <div class="quote-layout"><div class="stack">
      <div class="card pad stack" style="gap:8px"><b>Thông tin chiến dịch</b>
        ${[['Tên', c.name], ['Loại', c.type], ['Dự án/KH', c.client || MKT_NOCLIENT], ['Phụ trách', mktOwner(c)], ['Thời gian', `${mktRange(c)} (${qd.months} tháng)`]].map(([a, b]) => `<div class="row between small" style="align-items:flex-start"><span class="muted">${a}</span><b style="font-weight:${a === 'Tên' ? 600 : 500};text-align:right">${esc(b)}</b></div>`).join('')}
        <div class="row between small"><span class="muted">Trạng thái</span>${pill(...st)}</div>
        ${c.notes ? `<div class="small muted" style="border-top:1px solid var(--line);padding-top:8px">${esc(c.notes)}</div>` : ''}
        <button class="btn ${c.vat ? 'ok' : 'line'} sm" data-act="mkt-vat" data-id="${esc(c.id)}" ${edit ? '' : 'disabled'}>${c.vat ? '✓ VAT 8% đã áp dụng' : '+ VAT 8%'}</button>
        ${edit ? `<div class="row" style="flex-wrap:wrap;gap:6px">${next ? `<button class="btn ${next[2]} sm" data-act="mkt-status" data-id="${esc(c.id)}" data-s="${next[0]}">${next[1]}</button>` : ''}<button class="btn ghost sm" data-act="mkt-edit" data-id="${esc(c.id)}">${ic('edit', 13)}Sửa</button></div>` : ''}
      </div>
      <div class="card pad stack" style="gap:8px"><b class="small muted" style="letter-spacing:.06em">MẪU BÁO GIÁ</b>
        ${MKT_TPLS.map(([t, l, col]) => `<button class="tpl row ${tpl === t ? 'on' : ''}" data-act="mkt-tpl" data-t="${t}"><span class="dot" style="--c:${cv(col)}"></span>Mẫu ${l}</button>`).join('')}
        <button class="btn line sm" data-act="mkt-copy" data-id="${esc(c.id)}">${ic('copy', 13)}Sao chép bảng (dán vào Excel)</button>
      </div>
    </div>${mktDoc(c, qd, tpl)}</div>`;
}

/* ================= 4 mẫu báo giá ================= */
function mktDoc(c, qd, tpl){
  const co = mktCo(), NAME = esc(String(co.name || '').toUpperCase()), no = mktNo(c), date = fmtFull(todayISO()), owner = esc(mktOwner(c));
  const client = esc(c.client || MKT_NOCLIENT), range = `${mktRange(c)} (${qd.months} tháng)`;
  const groups = MKT_GROUPS.filter(([g]) => qd.groupTotals[g]).map(([g, l]) => [g, l, qd.lines.filter(x => x.group === g)]);
  const qtyTxt = l => `${num(l.qty)} ${esc(l.unit)}${l.scales ? ` × ${qd.months} tháng` : ''}`;
  const sign = (a, b) => `<div class="sign"><div>${a}<small>(Ký, ghi rõ họ tên)</small>${owner}</div><div>${b}<small>(Ký, ghi rõ họ tên)</small></div></div>`;
  const modernSign = `<div class="sign"><div>Người lập báo giá<small>&nbsp;</small>${owner}</div><div>Khách hàng xác nhận<small>&nbsp;</small><span style="font-weight:400;color:#777">(Ký, ghi rõ họ tên)</span></div></div>`;
  const totalsBox = () => `<div class="mkt-totals"><div><span>Tạm tính</span><b>${mktFmt(qd.subtotal)}</b></div>${c.vat ? `<div><span>VAT (8%)</span><b>${mktFmt(qd.vat)}</b></div>` : ''}<div class="grand"><span>Tổng cộng</span><b>${mktFmt(qd.grand)}</b></div></div>`;
  const coHead = typeof companyHead === 'function' ? companyHead()
    : `<b style="font-size:15px">${NAME}</b><div class="mkt-doc-sub">${esc(co.addr || '')}</div><div class="mkt-doc-sub">${[co.hotline && 'Hotline: ' + esc(co.hotline), esc(co.email || '')].filter(Boolean).join(' · ')}</div>`;
  let inner;
  if (tpl === 'classic'){
    inner = `<div style="text-align:center"><b style="font-size:15px">${NAME}</b><div class="mkt-doc-sub">${esc(co.addr || '')}${co.hotline ? ' — ĐT: ' + esc(co.hotline) : ''}</div></div>
      <h2>BÁO GIÁ</h2><div style="text-align:center;font-weight:600;letter-spacing:.04em">CHI PHÍ TRIỂN KHAI CHIẾN DỊCH MARKETING</div>
      <div class="mkt-doc-sub" style="text-align:center;margin-top:4px">Số: ${no} · Ngày ${date}</div>
      <div class="doc-info"><div>Kính gửi: <b>${client}</b></div><div>Người phụ trách: <b>${owner}</b></div><div>Về việc: <b>${esc(c.name)}</b></div><div>Thời gian: <b>${mktRange(c)}</b></div></div>
      <div style="overflow-x:auto"><table class="bordered"><thead><tr><th>STT</th><th>Hạng mục</th><th>ĐVT</th><th class="r">SL</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th></tr></thead><tbody>
      ${qd.lines.map((l, i) => `<tr><td>${i + 1}</td><td>${esc(l.name)}</td><td>${esc(l.unit)}</td><td class="r">${num(l.qty)}${l.scales ? ' × ' + qd.months : ''}</td><td class="r">${mktFmt(l.price)}</td><td class="r">${mktFmt(l.total)}</td></tr>`).join('') || '<tr><td colspan="6" style="text-align:center;color:#888">Chưa chọn hạng mục chi phí</td></tr>'}
      <tr class="tot"><td colspan="5" class="r">Tạm tính</td><td class="r">${mktFmt(qd.subtotal)}</td></tr>${c.vat ? `<tr class="tot"><td colspan="5" class="r">Thuế GTGT (8%)</td><td class="r">${mktFmt(qd.vat)}</td></tr>` : ''}<tr class="tot"><td colspan="5" class="r">TỔNG CỘNG</td><td class="r">${mktFmt(qd.grand)}</td></tr></tbody></table></div>
      <p class="mkt-doc-note">* Báo giá chưa bao gồm các chi phí phát sinh ngoài phạm vi hạng mục nêu trên và có hiệu lực trong 15 ngày kể từ ngày ký.</p>
      ${sign('NGƯỜI LẬP BÁO GIÁ', 'KHÁCH HÀNG XÁC NHẬN')}`;
  } else if (tpl === 'minimal'){
    inner = `<div class="mkt-doc-sub">Báo giá · ${no}</div><div class="mkt-min-title">${esc(c.name)}</div><div class="mkt-doc-sub">${client} · ${date} · ${qd.months} tháng triển khai</div>
      ${groups.map(([g, l, ls]) => `<div class="mkt-min-g">${esc(l)}</div>${ls.map(x => `<div class="min-line"><span>${esc(x.name)}<small>${qtyTxt(x)} · ${mktFmt(x.price)}</small></span><span>${mktFmt(x.total)}</span></div>`).join('')}`).join('') || '<p class="mkt-doc-note">Chưa chọn hạng mục chi phí.</p>'}
      <div class="min-total"><span>${c.vat ? 'Tạm tính + VAT 8%' : 'Tạm tính'}</span><b>${mktFmt(qd.grand)}</b></div>
      <div class="mkt-doc-sub" style="margin-top:18px">Người lập: ${owner} · ${esc(co.short || co.name)} Marketing · Hiệu lực 15 ngày</div>`;
  } else if (tpl === 'detailed'){
    const sec = t => `<div class="mkt-sec">${t}</div>`;
    inner = `<div class="doc-head"><div><b style="font-size:15px">${NAME}</b><div class="mkt-doc-sub">${esc(co.addr || '')}${co.tax ? ' · MST: ' + esc(co.tax) : ''}</div>${co.bank ? `<div class="mkt-doc-sub">STK: ${esc(co.bank)}</div>` : ''}</div>
        <div style="text-align:right"><b style="font-size:16px;letter-spacing:.04em">BÁO GIÁ CHI TIẾT</b><div class="mkt-doc-sub">${no}</div><div class="mkt-doc-sub">Ngày: ${date}</div></div></div>
      ${sec('Thông tin chiến dịch')}<div class="doc-info"><div>Chiến dịch: <b>${esc(c.name)}</b></div><div>Loại: ${esc(c.type)}</div><div>Dự án / khách hàng: ${client}</div><div>Thời gian: ${range}</div><div>Người phụ trách: ${owner}</div><div>Trạng thái: ${(MKT_STATUS[c.status] || MKT_STATUS.draft)[0]}</div></div>
      ${sec('Chi tiết hạng mục chi phí')}
      ${groups.map(([g, l, ls]) => `<div class="mkt-dg"><div class="mkt-dg-h"><span>${g}. ${esc(l)}</span><b>${mktFmt(qd.groupTotals[g])}</b></div>${ls.map(x => `<div class="min-line"><span>${esc(x.name)} — ${qtyTxt(x)}</span><span>${mktFmt(x.total)}</span></div>`).join('')}</div>`).join('') || '<p class="mkt-doc-note">Chưa chọn hạng mục chi phí.</p>'}
      ${totalsBox()}
      ${sec('Điều khoản & điều kiện')}<ul class="mkt-terms"><li>Báo giá có hiệu lực trong vòng 15 ngày kể từ ngày phát hành.</li><li>Thanh toán: tạm ứng 50% khi ký xác nhận, 50% còn lại khi hoàn tất chiến dịch.</li><li>Chi phí trên chưa bao gồm phát sinh ngoài phạm vi hạng mục đã liệt kê.</li><li>Số liệu quảng cáo (KHTN/lead) là ước tính tham khảo, không cam kết tuyệt đối.</li></ul>
      ${modernSign}`;
  } else {
    inner = `<div class="doc-head"><div>${coHead}</div><div style="text-align:right"><b class="mkt-modern-t">BÁO GIÁ</b><div class="mkt-doc-sub num">${no}</div><div class="mkt-doc-sub">Ngày: ${date}</div></div></div>
      <div class="mkt-cells"><div><small>Chiến dịch</small><b>${esc(c.name)}</b></div><div><small>Dự án / khách hàng</small><b>${client}</b></div><div><small>Thời gian triển khai</small><b>${range}</b></div><div><small>Người phụ trách</small><b>${owner}</b></div></div>
      <div style="overflow-x:auto"><table><thead><tr><th>Hạng mục</th><th class="r">Đơn giá</th><th class="r">SL</th><th class="r">Thành tiền</th></tr></thead><tbody>
      ${groups.map(([g, l, ls]) => `<tr class="grp"><td colspan="4">${g}. ${esc(l)}</td></tr>` + ls.map(x => `<tr><td>${esc(x.name)}<div class="mkt-doc-sub">${qtyTxt(x)}</div></td><td class="r">${mktFmt(x.price)}</td><td class="r">${num(x.qty * (x.scales ? qd.months : 1))}</td><td class="r">${mktFmt(x.total)}</td></tr>`).join('')).join('') || '<tr><td colspan="4" style="text-align:center;color:#888">Chưa chọn hạng mục chi phí.</td></tr>'}
      </tbody></table></div>
      ${totalsBox()}
      <p class="mkt-doc-note">Báo giá có hiệu lực 15 ngày kể từ ngày phát hành. Chưa bao gồm chi phí phát sinh ngoài phạm vi hạng mục nêu trên.</p>
      ${modernSign}`;
  }
  return `<div class="doc mkt-doc mkt-${tpl}">${inner}</div>`;
}
// Khối báo giá rút gọn (bước 3 của form tạo chiến dịch)
function mktQuoteBlock(c, vatOn){
  const qd = mktCalc(c, vatOn);
  if (!qd.lines.length) return '<div class="card pad empty">Chiến dịch chưa chọn hạng mục chi phí nào.</div>';
  return MKT_GROUPS.filter(([g]) => qd.groupTotals[g]).map(([g, l]) => `<div class="table-wrap"><table style="min-width:560px"><thead><tr class="grp"><td colspan="4">${g}. ${esc(l)}</td><td class="r">${mktFmt(qd.groupTotals[g])}</td></tr><tr><th>Hạng mục</th><th class="r">SL</th><th class="r">Đơn giá</th><th class="r">Nhân tháng</th><th class="r">Thành tiền</th></tr></thead><tbody>
    ${qd.lines.filter(x => x.group === g).map(x => `<tr><td>${esc(x.name)}</td><td class="r">${num(x.qty)} ${esc(x.unit)}</td><td class="r">${mktFmt(x.price)}</td><td class="r">${x.scales ? qd.months + ' th' : '—'}</td><td class="r b">${mktFmt(x.total)}</td></tr>`).join('')}</tbody></table></div>`).join('')
    + `<div class="card totals"><div><span>Tạm tính (${qd.lines.length} hạng mục · ${qd.months} tháng)</span><b>${mktFmt(qd.subtotal)}</b></div>${vatOn ? `<div><span>VAT (8%)</span><b>${mktFmt(qd.vat)}</b></div>` : ''}<div class="grand"><span>Tổng cộng${vatOn ? ' (đã gồm VAT)' : ''}</span><b>${mktFmt(qd.grand)}</b></div></div>`;
}

/* ================= sự kiện: chiến dịch & báo giá ================= */
const mktCamp = id => S.mkt.campaigns.find(x => x.id === id);
ACT['mkt-f'] = (el, d) => { ui.mktF = d.f; render(); };
ACT['mkt-open'] = (el, d) => { ui.mktCamp = d.id; const q = mktTabs().find(t => t.k === 'quote'); if (q) q.hidden = false; nav('mkt', 'quote'); };
CHG['mkt-camp'] = el => { ui.mktCamp = el.value; render(); };
ACT['mkt-tpl'] = (el, d) => { ui.mktTpl = d.t; render(); };
ACT['mkt-vat'] = (el, d) => { const c = mktCamp(d.id); if (!c || !mktCanEdit()) return; c.vat = !c.vat; render(); };
ACT['mkt-status'] = (el, d) => {
  const c = mktCamp(d.id); if (!c || !MKT_STATUS[d.s] || !mktCanEdit()) return;
  c.status = d.s; log(`Chiến dịch ${c.name}: ${MKT_STATUS[d.s][0]}`, 'pink');
  if (d.s === 'active' && typeof botPost === 'function') botPost('Duyệt ngân sách chiến dịch', `Chiến dịch “${c.name}” đã được duyệt ngân sách ${mktFmt(mktCalc(c, c.vat).grand)}.`, 'green', 'Module Marketing', 'mkt', 'campaigns');
  render(); toast(MKT_STATUS[d.s][0]);
};
ACT['mkt-copy'] = (el, d) => {
  const c = mktCamp(d.id); if (!c) return;
  const qd = mktCalc(c, !!c.vat);
  const rows = [['Nhóm', 'Hạng mục', 'Đơn vị', 'SL', 'Nhân tháng', 'Đơn giá', 'Thành tiền']]
    .concat(qd.lines.map(l => [l.group + '. ' + l.groupLabel, l.name, l.unit, l.qty, l.scales ? qd.months : 1, l.price, Math.round(l.total)]),
      [['', '', '', '', '', 'Tạm tính', Math.round(qd.subtotal)]], c.vat ? [['', '', '', '', '', 'VAT 8%', Math.round(qd.vat)]] : [], [['', '', '', '', '', 'Tổng cộng', Math.round(qd.grand)]]);
  copyText(rows.map(r => r.map(x => String(x).replace(/[\t\n]/g, ' ')).join('\t')).join('\n'), 'Đã sao chép báo giá — dán vào Excel');
};

/* ---------- danh mục: thêm / sửa / xoá hạng mục ---------- */
ACT['mkt-item-new'] = (el, d) => mktItemModal({id:'', group:d.g, name:'', unit:'tháng', price:0});
ACT['mkt-item'] = (el, d) => { const x = mktItem(d.id); if (x) mktItemModal(x); };
function mktItemModal(x){
  const used = x.id ? S.mkt.campaigns.filter(c => (c.items || []).some(i => i.id === x.id && i.qty > 0)).length : 0;
  showModal(`<form class="modal" data-form="mkt-item" data-id="${esc(x.id)}"><h3>${x.id ? 'Sửa hạng mục' : 'Thêm hạng mục'}${closeBtn()}</h3>
    <label class="field">Nhóm<select name="group">${opt(MKT_GROUPS.map(([g, l]) => [g, g + '. ' + l]), x.group)}</select></label>
    <label class="field">Tên hạng mục *<input id="mi-name" name="name" required value="${esc(x.name)}"></label>
    <div class="row2"><label class="field">Đơn vị<input id="mi-unit" name="unit" list="mkt-units" value="${esc(x.unit)}" placeholder="VD: tháng, người-tháng, lần, sự kiện"><datalist id="mkt-units">${MKT_UNITS.map(u => `<option value="${u}">`).join('')}</datalist></label>
      <label class="field">Đơn giá (VNĐ)<input id="mi-price" name="price" type="number" min="0" step="1" value="${Math.round(x.price) || 0}"></label></div>
    <div class="small muted">Đơn vị “tháng” / “người-tháng” tự nhân theo số tháng chiến dịch; đơn vị khác tính theo số lượng.${used ? ` Hạng mục đang dùng trong ${used} chiến dịch.` : ''}</div>
    <div class="m-actions">${x.id ? delBtn('mkt-item') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu</button></div></form>`);
}
FORM['mkt-item'] = (v, f) => {
  if (!mktCanEdit()) return;
  const data = {group:v.group, groupLabel:mktGroupLabel(v.group), name:v.name.trim(), unit:v.unit.trim() || 'tháng', price:Math.max(0, parseInt(String(v.price).replace(/\D/g, ''), 10) || 0)};
  if (!data.name) return;
  const x = mktItem(f.dataset.id);
  if (x) Object.assign(x, data);
  else { const n = Math.max(0, ...S.mkt.catalog.map(i => +(String(i.id).match(/^new(\d+)$/) || [0, 0])[1])) + 1; S.mkt.catalog.push({id:'new' + n, ...data}); }
  closeModal(); render(); toast('Đã lưu hạng mục');
};
DEL['mkt-item'] = id => { S.mkt.catalog = S.mkt.catalog.filter(x => x.id !== id); };

/* ---------- tạo / sửa chiến dịch — 3 bước ---------- */
const MKT_STEPS = ['Thông tin chiến dịch','Chọn hạng mục chi phí','Báo giá & xác nhận'];
ACT['mkt-new'] = () => { ui.mkw = {step:1, d:{id:'', name:'', type:MKT_TYPES[0], client:'', owner:S.me, start:'', end:'', status:'draft', vat:false, notes:'', items:[]}}; mkwModal(); };
ACT['mkt-edit'] = (el, d) => { const c = mktCamp(d.id); if (!c) return; ui.mkw = {step:1, d:JSON.parse(JSON.stringify(c))}; mkwModal(); };
function mkwModal(){
  const {step, d} = ui.mkw, qd = mktCalc(d, false), q = id => (d.items.find(i => i.id === id) || {}).qty || 0, isNew = !d.id;
  const lineT = x => q(x.id) ? mktFmt(x.price * q(x.id) * (mktScales(x.unit) ? qd.months : 1)) : '—';
  const s1 = `<label class="field">Tên chiến dịch *<input id="mk-name" name="name" value="${esc(d.name)}" placeholder="VD: Ra mắt Riverside Giai đoạn 3"></label>
    <div class="row2"><label class="field">Loại chiến dịch<select name="type">${opt(MKT_TYPES.includes(d.type) ? MKT_TYPES : [...MKT_TYPES, d.type], d.type)}</select></label>
      <label class="field">Dự án / khách hàng liên quan<select name="client">${opt([['', MKT_NOCLIENT], ...mktClients(d.client).map(x => [x, x])], d.client)}</select></label></div>
    <div class="row3"><label class="field">Người phụ trách<select name="owner">${peopleOpts(d.owner)}</select></label><label class="field">Bắt đầu<input id="mk-start" type="date" name="start" value="${esc(d.start)}"></label><label class="field">Kết thúc<input id="mk-end" type="date" name="end" value="${esc(d.end)}"></label></div>
    <label class="field">Ghi chú<textarea id="mk-notes" name="notes" placeholder="Mục tiêu chiến dịch, KPI kỳ vọng...">${esc(d.notes)}</textarea></label>`;
  const s2 = `<div class="small muted">Nhập số lượng cho hạng mục muốn đưa vào gói (0 = không chọn). Hạng mục theo "tháng"/"người-tháng" sẽ tự nhân theo số tháng chiến dịch chạy (${qd.months} tháng); hạng mục "lần"/"sự kiện" tính theo số lượng đã nhập.</div>
    <div class="stack mkw-list">${MKT_GROUPS.map(([g, l]) => { const items = S.mkt.catalog.filter(x => x.group === g); return items.length ? `<div class="table-wrap"><table style="min-width:600px"><thead><tr class="grp"><td colspan="5">${g}. ${esc(l)}</td></tr><tr><th>Hạng mục</th><th>Đơn vị</th><th class="r">Đơn giá</th><th class="r">SL</th><th class="r">Thành tiền</th></tr></thead><tbody>
      ${items.map(x => `<tr><td>${esc(x.name)}</td><td>${esc(x.unit)}</td><td class="r">${mktFmt(x.price)}</td><td class="r"><input class="mkw-qty" type="number" min="0" step="1" value="${q(x.id)}" data-input="mkw-qty" data-id="${esc(x.id)}" aria-label="Số lượng ${esc(x.name)}"></td><td class="r b" id="mkw-t-${esc(x.id)}">${lineT(x)}</td></tr>`).join('')}</tbody></table></div>` : ''; }).join('')}</div>`;
  const s3 = `<div class="card pad" style="background:var(--hover)"><b>${esc(d.name || '(Chưa đặt tên)')}</b>
      <div class="small muted">Loại: ${esc(d.type)} · Dự án/KH: ${esc(d.client || MKT_NOCLIENT)} · Phụ trách: ${esc(mktOwner(d))} · Thời gian: ${mktRange(d)} (${qd.months} tháng)</div></div>
    ${mktQuoteBlock(d, !!d.vat)}`;
  showModal(`<form class="modal wide" data-form="mkw" data-id="${esc(d.id)}" novalidate><h3>${isNew ? 'Tạo chiến dịch Marketing' : 'Sửa chiến dịch — ' + esc(d.name)}${closeBtn()}</h3>
    <div class="sub">Khởi tạo → chọn hạng mục chi phí vào gói → xác nhận báo giá.</div>
    <div class="seg">${MKT_STEPS.map((l, i) => `<button type="button" class="${step === i + 1 ? 'on' : ''}" data-act="mkw-step" data-s="${i + 1}" data-free="1">${i + 1}. ${l}</button>`).join('')}</div>
    ${step === 1 ? s1 : step === 2 ? s2 : s3}
    <div class="m-actions">${!isNew ? delBtn('mkt-camp') : ''}<span class="small muted" style="margin-right:auto;align-self:center">Bước ${step}/3 — ${MKT_STEPS[step - 1]}${step === 2 ? ` · <b style="color:var(--ink)">Tạm tính: <span id="mkw-sub">${mktFmt(qd.subtotal)}</span></b>` : ''}</span>
      ${step > 1 ? `<button type="button" class="btn ghost" data-act="mkw-step" data-s="${step - 1}">Quay lại</button>` : ''}
      ${step < 3 ? `<button type="button" class="btn line" data-act="mkw-step" data-s="${step + 1}">Tiếp theo</button>` : ''}
      ${step === 3 || !isNew ? `<button class="btn" type="submit">${isNew ? 'Lưu chiến dịch & xuất báo giá' : 'Lưu thay đổi'}</button>` : ''}</div></form>`);
}
function mkwCollect(){
  const f = document.querySelector('form[data-form="mkw"]'); if (!f) return;
  const d = ui.mkw.d, fd = new FormData(f);
  ['name','type','client','owner','start','end','notes'].forEach(k => { if (fd.has(k)) d[k] = fd.get(k); });
}
INP['mkw-qty'] = el => {
  if (!ui.mkw) return;
  const d = ui.mkw.d, id = el.dataset.id, qty = Math.max(0, parseInt(el.value, 10) || 0);
  const it = d.items.find(i => i.id === id);
  if (it) it.qty = qty; else if (qty) d.items.push({id, qty});
  const qd = mktCalc(d, false), x = mktItem(id), cell = document.getElementById('mkw-t-' + id);
  if (cell && x) cell.textContent = qty ? mktFmt(x.price * qty * (mktScales(x.unit) ? qd.months : 1)) : '—';
  const s = document.getElementById('mkw-sub'); if (s) s.textContent = mktFmt(qd.subtotal);
};
ACT['mkw-step'] = (el, dd) => {
  mkwCollect();
  if (!dd.free && ui.mkw.step === 1 && +dd.s > 1 && !ui.mkw.d.name.trim()){ const i = document.getElementById('mk-name'); if (i) i.focus(); toast('Nhập tên chiến dịch trước'); return; }
  ui.mkw.step = +dd.s; mkwModal();
};
FORM.mkw = () => {
  if (!mktCanEdit()) return;
  mkwCollect();
  const d = ui.mkw.d;
  d.name = d.name.trim() || 'Chiến dịch chưa đặt tên';
  d.owner = d.owner || S.me;
  if (d.start && d.end && d.end < d.start){ ui.mkw.step = 1; mkwModal(); toast('Ngày kết thúc phải sau ngày bắt đầu'); return; }
  d.items = d.items.filter(i => i.qty > 0);
  const old = mktCamp(d.id);
  if (old) Object.assign(old, d);
  else {
    d.id = 'camp' + (Math.max(0, ...S.mkt.campaigns.map(c => +(String(c.id).match(/\d+/) || [0])[0])) + 1);
    d.status = 'draft'; S.mkt.campaigns.push(d); log('Tạo chiến dịch ' + d.name, 'pink');
  }
  ui.mktCamp = d.id; ui.mkw = null;
  const qt = mktTabs().find(t => t.k === 'quote'); if (qt) qt.hidden = false;
  S.sub.mkt = 'quote'; closeModal(); render(); toast('Đã lưu chiến dịch ' + d.name);
};
DEL['mkt-camp'] = id => { const c = mktCamp(id); S.mkt.campaigns = S.mkt.campaigns.filter(x => x.id !== id); if (c) log('Xoá chiến dịch ' + c.name, 'pink'); ui.mkw = null; };

/* ================= tìm nhanh & trợ lý ================= */
SEARCH.push(hit => perm('mkt') === 'none' || !S.mkt ? [] : S.mkt.campaigns.filter(c => hit(c.name + ' ' + c.client + ' ' + c.type)).map(c => ({icon:'megaphone', label:c.name, sub:'Marketing · ' + (MKT_STATUS[c.status] || MKT_STATUS.draft)[0], run:() => { ui.mktCamp = c.id; nav('mkt', 'quote'); }})));
AI.push({re:/marketing|chiến dịch|quảng cáo/, fn:(q, s) => {
  if (perm('mkt') === 'none' || !S.mkt) return '';
  const C = S.mkt.campaigns;
  if (!C.length) return 'Chưa có chiến dịch marketing nào. <button class="link" data-act="nav" data-v="mkt" data-sub="campaigns">Tạo chiến dịch ›</button>';
  const rows = C.map(c => ({c, qd:mktCalc(c, !!c.vat)}));
  if (/quảng cáo/.test(s)){
    const ads = rows.map(({c, qd}) => ({c, v:sum(qd.lines.filter(l => l.group === 'F'), l => l.total)})).filter(x => x.v);
    return `Chi phí quảng cáo (nhóm F) đã lập: <b>${mktFmt(sum(ads, x => x.v))}</b>` + list(ads.map(x => `${esc(x.c.name)} — ${(MKT_STATUS[x.c.status] || MKT_STATUS.draft)[0]} · ${mktFmt(x.v)}`));
  }
  return `Có ${C.length} chiến dịch (${C.filter(c => c.status === 'active').length} đang chạy, ${C.filter(c => c.status === 'draft').length} bản nháp), tổng ngân sách đã lập <b>${mktFmt(sum(rows, r => r.qd.subtotal))}</b>:`
    + list(rows.map(({c, qd}) => `<button class="link" data-act="mkt-open" data-id="${esc(c.id)}">${esc(c.name)}</button> — ${(MKT_STATUS[c.status] || MKT_STATUS.draft)[0]} · ${mktFmt(qd.grand)} · ${qd.months} tháng`));
}});
