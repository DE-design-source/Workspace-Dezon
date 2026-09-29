/* Dezon Workspace — Kinh doanh: tổng quan, pipeline khách hàng, khách hàng tiềm năng, bảng Dự án (Thiết kế / Thi công), nhiệm vụ & điểm thưởng.
   Dữ liệu: S.leads (bộ 'leads_v2' — giá trị tính bằng ĐỒNG). Chuyển vào/ra cột Dự án → syncLeadToProject(lead) của mod-pm. */

/* ================= hằng số ================= */
const SALES_STG = [['lead','Tiếp cận','gray'],['consult','Tư vấn','blue'],['quote','Báo giá','yellow'],['nego','Đàm phán','orange'],['signed','Chốt hợp đồng','green'],['design','Dự án (Thiết kế)','purple'],['build','Dự án (Thi công)','brown']];
const SALES_OPEN = ['lead','consult','quote','nego','signed'];          // 5 giai đoạn pipeline (trước khi thành dự án)
const SALES_PROJ = ['design','build'];
const SALES_DEPTS = {'du-an':['Phòng KD Dự Án','Dự án','blue'], 'dan-dung':['Phòng KD Dân dụng','Dân dụng','green']};
const SALES_SUBS = {
  design:[['intake','Chờ tiếp nhận','gray'],['concept','Lên concept','blue'],['drafting','Triển khai bản vẽ','yellow'],['review','Chờ khách duyệt','purple'],['approved','Đã duyệt','green']],
  build:[['prep','Chuẩn bị mặt bằng','gray'],['structure','Thi công phần thô','blue'],['finishing','Hoàn thiện','yellow'],['acceptance','Nghiệm thu','purple'],['handover','Đã bàn giao','green']]
};
const SALES_TYPES = ['Nhà phố','Biệt thự','Chung cư','Văn phòng','Khác'];
const SALES_SOURCES = ['Giới thiệu','Website','Mạng xã hội','Sự kiện','Khác'];
const SALES_INTERESTS = ['Xây dựng thô','Hoàn thiện nội thất','Thiết kế kiến trúc','Cảnh quan sân vườn'];
const salesStg = k => SALES_STG.find(s => s[0] === k) || SALES_STG[0];
const salesIdx = k => SALES_STG.findIndex(s => s[0] === k);
const leadStageLabel = k => salesStg(k)[1];
const salesLeads = () => S.leads || [];
const salesLead = id => salesLeads().find(l => l.id === id);
// tiền đồng → "15 tỷ", "5,2 tỷ", "620tr"
const salesMoney = v => (!v || v >= 1e9) ? (Math.round((v || 0) / 1e8) / 10).toLocaleString('vi-VN') + ' tỷ' : Math.round(v / 1e6) + 'tr';
const salesDeptPill = d => SALES_DEPTS[d] ? `<span class="pill ${SALES_DEPTS[d][2]} sales-dp">${SALES_DEPTS[d][1]}</span>` : '';
const salesInDept = l => (ui.salesDept || 'all') === 'all' || (l.dept || 'dan-dung') === ui.salesDept;
const salesCanEdit = () => perm('sales') === 'edit';

/* ================= dữ liệu mẫu ================= */
syncCol('leads_v2', 'array', () => S.leads, v => S.leads = v, {read:['sales'], write:['sales'], empty:() => []});
registerQuest('sales', {view:'sales', sub:'quest', perm:'sales', stepWord:'bước quy trình'});
SEEDS.push(s => {
  ensurePeople(s, [
    {id:'dang-quoc-cuong', name:'Đặng Quốc Cường', role:'Nhân viên kinh doanh', team:'Phòng KD Dự Án', c:'blue'},
    {id:'hoang-yen-nhi', name:'Hoàng Yến Nhi', role:'Nhân viên kinh doanh', team:'Phòng KD Dân dụng', c:'green'},
    {id:'vu-dinh-khoa', name:'Vũ Đình Khoa', role:'Kỹ sư dự toán', team:'Phòng KD Dự Án', c:'yellow'},
    {id:'lam-bao-ngoc', name:'Lâm Bảo Ngọc', role:'Nhân viên kinh doanh', team:'Phòng KD Dân dụng', c:'purple'}
  ]);
  // [id, tên, dự án/công trình, loại, giá trị (tỷ), giai đoạn, phòng, điện thoại, phụ trách, tạo, cập nhật, thêm]
  const L = (id, name, proj, type, ty_, stage, dept, phone, owner, created, updated, extra = {}) => ({id, name, proj, type, phone, email:'', source:'Giới thiệu', addr:'', dept, scale:'',
    interests:['Xây dựng thô'], value:Math.round(ty_ * 1e9), stage, sub:'', owner, created:md(created), updated:md(updated), signedAt:'', concept:'', note:'', boq:'', projectId:'', ...extra});
  s.leads = [
    L('l1','Anh Minh Khang','Nhà phố','Nhà phố',1.8,'lead','dan-dung','0903 214 587','hoang-yen-nhi','2026-09-16','2026-09-18',{source:'Website'}),
    L('l2','Chị Lan Anh','Biệt thự','Biệt thự',5.2,'lead','dan-dung','0977 224 890','ta','2026-09-05','2026-09-08'),
    L('l3','Cty XYZ Group','Văn phòng','Văn phòng',3.5,'lead','du-an','028 3910 2255','dang-quoc-cuong','2026-09-10','2026-09-14',{source:'Sự kiện'}),
    L('l4','Anh Đức Thịnh','Nhà phố','Nhà phố',2.0,'lead','dan-dung','0935 118 402','lam-bao-ngoc','2026-09-12','2026-09-15',{source:'Mạng xã hội'}),
    L('l5','Chị Thu Hằng','Chung cư mini','Chung cư',4.1,'lead','dan-dung','0908 663 190','hoang-yen-nhi','2026-09-17','2026-09-19'),
    L('l6','Chị Bích Ngọc','Biệt thự','Biệt thự',6.0,'consult','dan-dung','0938 556 771','ta','2026-08-28','2026-09-12',{source:'Mạng xã hội'}),
    L('l7','Anh Hoàng Long','Nhà phố','Nhà phố',2.3,'consult','dan-dung','0916 402 733','lam-bao-ngoc','2026-08-30','2026-09-11'),
    L('l8','Cty Minh Phát','Văn phòng','Văn phòng',4.8,'consult','du-an','028 3845 6612','vu-dinh-khoa','2026-08-25','2026-09-10',{source:'Website'}),
    L('l9','Anh Tuấn Kiệt','Nhà phố','Nhà phố',1.9,'consult','dan-dung','0937 509 128','hoang-yen-nhi','2026-09-02','2026-09-13'),
    L('l10','Chị Minh Thư','Biệt thự Song lập — Thảo Điền','Biệt thự',6.8,'quote','dan-dung','0912 887 234','ta','2026-08-12','2026-09-17',{interests:['Thiết kế kiến trúc','Xây dựng thô'], email:'minhthu@example.com', addr:'Đường số 10, Thảo Điền, TP. Thủ Đức'}),
    L('l11','Anh Văn Sơn','Nhà phố','Nhà phố',2.2,'quote','dan-dung','0909 771 356','lam-bao-ngoc','2026-08-20','2026-09-16'),
    L('l12','Cty Đông Dương','Văn phòng','Văn phòng',5.5,'quote','du-an','028 3822 4410','ta','2026-08-08','2026-09-15',{source:'Sự kiện'}),
    L('l13','BQL Riverside','Mở rộng Giai đoạn 3','Chung cư',15.0,'nego','du-an','0909 123 456','ta','2026-07-20','2026-09-20',{source:'Khác', interests:['Xây dựng thô','Hoàn thiện nội thất'], scale:'Chung cư (GĐ3)'}),
    L('l14','Chị Hải Yến','Biệt thự Nhà Bè','Biệt thự',7.2,'nego','dan-dung','0918 345 221','ta','2026-07-28','2026-09-19',{source:'Website'}),
    L('l17','Anh Phúc Nguyên','Nhà phố','Nhà phố',2.4,'signed','dan-dung','0932 845 017','hoang-yen-nhi','2026-07-15','2026-09-16',{signedAt:md('2026-09-16')}),
    L('l18','Chị Ngọc Diễm','Nhà phố','Nhà phố',2.6,'design','dan-dung','0905 377 842','lam-bao-ngoc','2026-07-05','2026-09-09',{sub:'concept', signedAt:md('2026-09-04'), interests:['Thiết kế kiến trúc','Hoàn thiện nội thất']}),
    L('l19','Anh Bảo Long','Biệt thự','Biệt thự',5.4,'design','dan-dung','0913 662 095','hoang-yen-nhi','2026-06-18','2026-09-18',{sub:'review', signedAt:md('2026-08-22'), interests:['Thiết kế kiến trúc']}),
    L('l15','Anh Quang Huy','Nhà phố Lô B12 — KDC Bình Chánh','Nhà phố',2.1,'build','dan-dung','0938 456 789','ta','2026-05-10','2026-08-18',{sub:'structure', signedAt:md('2026-07-10'), projectId:'b12', addr:'Lô B12, KDC Bình Chánh, TP.HCM'}),
    L('l16','Cty TNHH ABC Logistics','Văn phòng cho thuê — Q3','Văn phòng',4.2,'build','du-an','028 3930 1122','dang-quoc-cuong','2026-01-12','2026-09-01',{sub:'handover', signedAt:md('2026-03-02'), projectId:'q3', addr:'Võ Văn Tần, Quận 3, TP.HCM'})
  ];
  const R = (id, name, pts, icon) => ({id, name, pts, icon});
  s.quest_sales = mkQuest('Quy trình chốt hợp đồng — BQL Riverside GĐ3', 'Phòng KD Dự Án', '2 phòng KD Dự Án & Dân dụng', 'Quy trình chăm sóc khách hàng sau bàn giao', [
    ['Tiếp cận & xác minh khách hàng tiềm năng', [['Gọi điện xác minh nhu cầu', 20, 'dang-quoc-cuong', 1], ['Ghi nhận thông tin vào hệ thống', 15, 'dang-quoc-cuong', 1], ['Phân loại theo phòng ban phụ trách', 15, 'ta', 1]]],
    ['Tư vấn & khảo sát nhu cầu', [['Hẹn gặp tư vấn trực tiếp', 20, 'dang-quoc-cuong', 1], ['Khảo sát hiện trạng / mặt bằng', 25, 'vu-dinh-khoa', 1], ['Ghi nhận yêu cầu thiết kế', 20, 'dang-quoc-cuong', 1]]],
    ['Lập báo giá', [['Bóc tách sơ bộ chi phí', 25, 'vu-dinh-khoa', 1], ['Soạn báo giá & trình duyệt', 20, 'ta', 1], ['Gửi báo giá cho khách hàng', 15, 'dang-quoc-cuong']]],
    ['Đàm phán hợp đồng', [['Trao đổi điều khoản thanh toán', 20, 'ta'], ['Điều chỉnh phạm vi công việc', 20, 'vu-dinh-khoa'], ['Thống nhất tiến độ bàn giao', 20, 'dang-quoc-cuong']]],
    ['Chốt hợp đồng & bàn giao hồ sơ', [['Ký kết hợp đồng', 25, 'ta'], ['Thu tạm ứng đợt 1', 20, 'ta'], ['Bàn giao hồ sơ sang phòng Dự án / Thi công', 20, 'dang-quoc-cuong']]]
  ], {ta:{week:150, total:1780, avail:1320}, 'dang-quoc-cuong':{week:120, total:1420, avail:1120}, 'hoang-yen-nhi':{week:110, total:1320, avail:820}, 'vu-dinh-khoa':{week:80, total:960, avail:960}, 'lam-bao-ngoc':{week:60, total:760, avail:760}},
  [R('s1','Phiếu ăn trưa miễn phí (1 tuần)',300,'gift'), R('s2','Voucher nhà hàng 500.000đ',500,'gift'), R('s3','Khoá học kỹ năng đàm phán',700,'book'), R('s4','Ngày nghỉ phép thêm (1 ngày)',1000,'star'), R('s5','Chuyến du lịch team quý (2 ngày 1 đêm)',2500,'flame'), R('s6','Thưởng tiền mặt 1.000.000đ',3000,'wallet')],
  [{who:'hoang-yen-nhi', reward:'Voucher nhà hàng 500.000đ', pts:500, date:md('2026-09-18')}, {who:'dang-quoc-cuong', reward:'Phiếu ăn trưa miễn phí (1 tuần)', pts:300, date:md('2026-09-10')}], 7080);
});

/* ================= logic ================= */
// Đổi giai đoạn: cập nhật mốc, gán cột con khi vào bảng dự án, đồng bộ hồ sơ dự án (mod-pm) khi vào/ra 'design'/'build'.
function salesSetStage(l, st){
  if (!l || l.stage === st || salesIdx(st) < 0) return false;
  const old = l.stage;
  l.stage = st; l.updated = todayISO();
  if (salesIdx(st) >= 4 && !l.signedAt) l.signedAt = todayISO();
  if (SALES_SUBS[st] && !SALES_SUBS[st].some(x => x[0] === l.sub)) l.sub = SALES_SUBS[st][0][0];
  log(`${l.name} → ${leadStageLabel(st)}`, 'orange');
  if ((SALES_PROJ.includes(st) || SALES_PROJ.includes(old)) && typeof syncLeadToProject === 'function') syncLeadToProject(l);
  if (SALES_PROJ.includes(st) && !SALES_PROJ.includes(old)) toast(`${l.name} đã chuyển sang ${leadStageLabel(st)} — hồ sơ hiện ở Quản lý dự án`);
  return true;
}
// Dữ liệu demo cũ lưu giá trị theo tỷ → quy về đồng (chạy lặp lại vô hại).
function salesFix(){ salesLeads().forEach(l => { if (l.value && Math.abs(l.value) < 1e5) l.value = Math.round(l.value * 1e9); if (!l.dept) l.dept = 'dan-dung'; }); }
const salesMonth = s => s && s.slice(0, 7) === todayISO().slice(0, 7);
function salesKpi(){
  const L = salesLeads(), open = L.filter(l => SALES_OPEN.includes(l.stage));
  const recent = L.filter(l => l.created && daysLeft(l.created) >= -90);
  const won = recent.filter(l => salesIdx(l.stage) >= 4);
  const signed = L.filter(l => salesMonth(l.signedAt));
  return {open, openVal:sum(open, l => l.value), newMonth:open.filter(l => salesMonth(l.created)).length,
    rate:recent.length ? Math.round(won.length / recent.length * 100) : null, signed, signedVal:sum(signed, l => l.value)};
}

/* ================= trang ================= */
const salesDeptSeg = () => `<div class="seg">${[['all','Tất cả'], ...Object.entries(SALES_DEPTS).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button class="${(ui.salesDept || 'all') === k ? 'on' : ''}" data-act="sales-dept" data-k="${k}">${l}</button>`).join('')}</div>`;
const salesStageSel = l => `<select data-change="lead-stage" data-id="${l.id}" aria-label="Chuyển giai đoạn" ${salesCanEdit() ? '' : 'disabled'}>${opt(SALES_STG.map(s => [s[0], s[1]]), l.stage)}</select>`;
const salesProjLink = l => l.projectId ? `<button class="link" data-act="sales-open-proj" data-id="${esc(l.projectId)}">Hồ sơ dự án ›</button>`
  : SALES_PROJ.includes(l.stage) && typeof syncLeadToProject === 'function' && salesCanEdit() ? `<button class="link" data-act="sales-sync" data-id="${l.id}">Tạo hồ sơ dự án</button>` : '';

MOD.sales = () => {
  if (!S.leads) S.leads = [];
  salesFix();
  const cur = sub('sales', 'overview'), edit = salesCanEdit(), L = salesLeads();
  const cnt = k => L.filter(l => l.stage === k).length;
  const tabs = subtabs('sales', [['overview','Tổng quan'],['pipeline','Pipeline khách hàng'],['leads','Khách hàng tiềm năng'],['design','Dự án (Thiết kế)', cnt('design')],['build','Dự án (Thi công)', cnt('build')],['quest','Nhiệm vụ & điểm thưởng']], 'overview');
  const addBtn = edit ? `<button class="btn" data-act="lead-new">${ic('plus', 15)}Thêm khách hàng tiềm năng</button>` : '';
  const top = head('Kinh doanh', 'Pipeline khách hàng — chốt hợp đồng sẽ tự tạo hồ sơ tại tab Dự án', addBtn) + tabs;
  if (cur === 'quest') return top + questView('sales');
  if (!L.length && cur !== 'quest') return top + emptyBox('Chưa có khách hàng tiềm năng', 'Thêm khách hàng đầu tiên để bắt đầu theo dõi pipeline — khi chuyển sang cột “Dự án”, hồ sơ dự án sẽ tự tạo.', addBtn);
  let body = '';
  if (cur === 'overview'){
    const k = salesKpi();
    const fun = SALES_STG.slice(0, 5).map(([key, l]) => [l === 'Chốt hợp đồng' ? 'Chốt HĐ' : l, cnt(key), key]);
    const max = Math.max(1, ...fun.map(f => f[1]));
    const hot = L.filter(l => ['nego','quote'].includes(l.stage)).sort((a, b) => b.value - a.value).slice(0, 3);
    body = `<div class="stats">
        ${stat('Tổng giá trị pipeline', salesMoney(k.openVal), k.open.length + ' cơ hội đang theo dõi')}
        ${stat('Khách hàng tiềm năng', k.open.length, '+' + k.newMonth + ' trong tháng này', k.newMonth ? 'good' : '')}
        ${stat('Tỷ lệ chốt hợp đồng', k.rate == null ? '—' : k.rate + '%', 'Trung bình 3 tháng')}
        ${stat('Đã chốt tháng này', salesMoney(k.signedVal), k.signed.length + ' hợp đồng')}
      </div>
      <div class="grid-3-2">
        <div class="card pad"><h2 class="sec-title">Phễu bán hàng (Sales Funnel)<button class="link" data-act="sub" data-view="sales" data-k="pipeline">Mở pipeline ›</button></h2>
          <div class="sales-funnel">${fun.map(([l, n, key]) => `<button class="sales-fbar ${key === 'signed' ? 'won' : ''}" data-act="sub" data-view="sales" data-k="pipeline" title="${l}: ${n}"><b>${n}</b><i style="height:${Math.max(6, Math.round(n / max * 160))}px"></i><span>${l}</span></button>`).join('')}</div></div>
        <div class="card list-card"><h2 class="sec-title">Cơ hội sắp chốt</h2>
          ${hot.map(l => `<button class="li" data-act="lead" data-id="${l.id}">${av(l.owner, 32)}<span class="ell"><b class="ell">${esc(l.name)} — ${esc(l.proj)}</b><small>${esc(person(l.owner).name)} · cập nhật ${fmtDate(l.updated)}</small></span><span class="end">${pill(leadStageLabel(l.stage), salesStg(l.stage)[2])}<div class="val" style="margin-top:4px">${salesMoney(l.value)}</div></span></button>`).join('') || '<div class="empty">Chưa có cơ hội ở giai đoạn Báo giá / Đàm phán</div>'}
        </div>
      </div>`;
  } else if (cur === 'pipeline'){
    const view = ui.salesView || 'kanban', V = L.filter(salesInDept);
    body = `<div class="small muted">Kéo thả thẻ giữa các cột, hoặc dùng ô chọn giai đoạn trên mỗi thẻ để chuyển. Thẻ vào cột "Dự án (Thiết kế)" / "Dự án (Thi công)" sẽ tự xuất hiện ở tab Dự án.</div>
      <div class="row between" style="flex-wrap:wrap;gap:10px">${salesDeptSeg()}<div class="seg">${[['kanban','Kanban'],['list','Danh sách']].map(([k, l]) => `<button class="${view === k ? 'on' : ''}" data-act="sales-view" data-k="${k}">${l}</button>`).join('')}</div></div>`;
    if (view === 'kanban'){
      body += `<div class="board">${SALES_STG.map(([k, l, c]) => {
        const items = V.filter(x => x.stage === k);
        return `<div class="col" data-drop="lead:${k}">
          <div class="col-h"><span class="dot" style="--c:${cv(c)}"></span>${l}<span class="sum">${items.length} · ${salesMoney(sum(items, x => x.value))}</span></div>
          ${items.map(x => `<div class="tcard" ${edit ? `draggable="true" data-drag="lead:${x.id}"` : ''}>
            <button data-act="lead" data-id="${x.id}" style="text-align:left"><span class="ttitle">${esc(x.name)}</span>${SALES_PROJ.includes(k) ? ' <span class="pill purple sales-dp">→ Dự án</span>' : ''}<div class="small muted">${esc(x.proj || x.type)}</div></button>
            <div class="tfoot">${salesDeptPill(x.dept)}<span class="val">${salesMoney(x.value)}</span>${av(x.owner, 22)}</div>
            <div class="row between">${salesStageSel(x)}${salesProjLink(x)}</div>
          </div>`).join('') || '<div class="small muted" style="padding:6px 4px">Chưa có thẻ</div>'}
        </div>`;
      }).join('')}</div>`;
    } else {
      body += `<div class="table-wrap"><table><thead><tr><th>Khách hàng</th><th>Loại dự án</th><th>Phòng ban</th><th class="r">Giá trị</th><th>Giai đoạn</th><th>Chuyển tới</th></tr></thead><tbody>
        ${V.map(l => `<tr><td><button class="link" style="font-size:13px;color:var(--ink);font-weight:500" data-act="lead" data-id="${l.id}">${esc(l.name)}</button><div class="small muted">${esc(l.proj)}</div></td><td>${esc(l.type)}</td><td>${salesDeptPill(l.dept)}</td><td class="r b">${salesMoney(l.value)}</td><td>${pill(leadStageLabel(l.stage), salesStg(l.stage)[2])}</td><td>${salesStageSel(l)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Không có khách hàng thuộc phòng ban này</td></tr>'}
      </tbody></table></div>`;
    }
  } else if (cur === 'leads'){
    const V = L.filter(salesInDept).sort((a, b) => String(b.updated).localeCompare(String(a.updated)));
    body = `<div class="row between" style="flex-wrap:wrap;gap:10px"><span class="small muted">Lọc danh sách theo phòng ban phụ trách.</span>${salesDeptSeg()}</div>
      <div class="table-wrap"><table><thead><tr><th>Khách hàng</th><th>Điện thoại</th><th>Loại dự án</th><th>Phòng ban</th><th class="r">Giá trị</th><th>Giai đoạn</th><th>Phụ trách</th><th>Cập nhật</th></tr></thead><tbody>
      ${V.map(l => `<tr class="click" data-act="lead" data-id="${l.id}" tabindex="0"><td><b style="font-weight:500">${esc(l.name)}</b><div class="small muted">${esc(l.proj)}</div></td><td class="num">${esc(l.phone || '—')}</td><td>${esc(l.type)}${l.scale ? `<div class="small muted">${esc(l.scale)}</div>` : ''}</td><td>${salesDeptPill(l.dept)}</td><td class="r b">${salesMoney(l.value)}</td><td>${pill(leadStageLabel(l.stage), salesStg(l.stage)[2])}</td><td><div class="who">${av(l.owner, 22)}${esc(person(l.owner).name)}</div></td><td>${fmtDate(l.updated)}</td></tr>`).join('') || '<tr><td colspan="8" class="empty">Không có khách hàng thuộc phòng ban này</td></tr>'}
      </tbody></table></div>`;
  } else {
    const stage = cur === 'build' ? 'build' : 'design', subs = SALES_SUBS[stage];
    const items = L.filter(l => l.stage === stage);
    body = `<div class="small muted">Bảng Kanban kiểu ${stage === 'design' ? 'Lark Base' : 'Lark Task'} — kéo thả thẻ giữa các cột, hoặc bấm "+ Thêm thẻ" ở cuối mỗi cột để tạo nhanh. Tổng ${items.length} dự án · ${salesMoney(sum(items, l => l.value))}.</div>
      <div class="board">${subs.map(([k, l, c]) => {
        const its = items.filter(x => (subs.some(s => s[0] === x.sub) ? x.sub : subs[0][0]) === k);
        return `<div class="col sales-sub" style="--c:${cv(c)}" data-drop="leadsub:${k}">
          <div class="col-h"><span class="dot" style="--c:${cv(c)}"></span>${l}<span class="n">${its.length}</span></div>
          ${its.map(x => `<div class="tcard" ${edit ? `draggable="true" data-drag="leadsub:${x.id}"` : ''}>
            <button data-act="lead" data-id="${x.id}" style="text-align:left"><span class="ttitle">${esc(x.name)}</span><div class="small muted">${esc(x.proj || x.type)}</div></button>
            <div class="tfoot">${salesDeptPill(x.dept)}<span class="val">${salesMoney(x.value)}</span>${av(x.owner, 22)}</div>
            ${salesProjLink(x) ? `<div>${salesProjLink(x)}</div>` : ''}
          </div>`).join('')}
          ${edit ? `<form class="quick" data-form="sales-subq" data-stage="${stage}" data-sub="${k}"><input id="sq-${stage}-${k}" name="name" data-change="sales-subq" placeholder="+ Thêm thẻ — Tên khách hàng / dự án, Enter để lưu" aria-label="Thêm thẻ vào cột ${l}" autocomplete="off"></form>` : ''}
        </div>`;
      }).join('')}</div>`;
  }
  return top + body;
};

/* ================= sự kiện ================= */
ACT['sales-dept'] = (el, d) => { ui.salesDept = d.k; render(); };
ACT['sales-view'] = (el, d) => { ui.salesView = d.k; render(); };
ACT['sales-open-proj'] = (el, d) => { S.pid = d.id; nav('pm', 'list'); };
ACT['sales-sync'] = (el, d) => { const l = salesLead(d.id); if (l && typeof syncLeadToProject === 'function'){ syncLeadToProject(l); render(); toast('Đã tạo hồ sơ dự án cho ' + l.name); } };
DROP.lead = (id, st) => { if (salesCanEdit()) salesSetStage(salesLead(id), st); };
DROP.leadsub = (id, k) => { const l = salesLead(id); if (!l || !salesCanEdit() || l.sub === k) return; l.sub = k; l.updated = todayISO(); const s = (SALES_SUBS[l.stage] || []).find(x => x[0] === k); if (s) log(`${l.name} → ${s[1]}`, 'orange'); };
CHG['lead-stage'] = el => { if (salesSetStage(salesLead(el.dataset.id), el.value)) render(); };
function salesQuickAdd(input){
  const name = (input.value || '').trim(), f = input.closest('form');
  if (!name || !f || !salesCanEdit()) return;
  input.value = '';
  const l = {id:'l' + uid(), name, proj:'Chưa xác định', type:'Khác', phone:'', email:'', source:'Khác', addr:'', dept:'dan-dung', scale:'', interests:[], value:0,
    stage:f.dataset.stage, sub:f.dataset.sub, owner:S.me, created:todayISO(), updated:todayISO(), signedAt:todayISO(), concept:'', note:'', boq:'', projectId:''};
  S.leads.push(l);
  if (typeof syncLeadToProject === 'function') syncLeadToProject(l);
  log('Thêm thẻ dự án ' + name, 'orange'); render();
}
FORM['sales-subq'] = (v, f) => salesQuickAdd(f.querySelector('input'));
CHG['sales-subq'] = el => salesQuickAdd(el);

/* ---------- form khách hàng 3 cấp độ ---------- */
const SALES_STEPS = ['Cơ bản','Chi tiết','Nâng cao'];
ACT['lead-new'] = () => {
  const prev = ui.leadPrev || {};   // select & checkbox giữ lựa chọn lần trước (như bản gốc)
  ui.lead = {step:1, d:{id:'', name:'', phone:'', email:'', source:prev.source || 'Giới thiệu', addr:'', dept:prev.dept || (ui.salesDept && ui.salesDept !== 'all' ? ui.salesDept : 'dan-dung'),
    owner:S.me, type:prev.type || 'Nhà phố', proj:'', scale:'', interests:prev.interests || ['Xây dựng thô'], valueTy:'', stage:prev.stage || 'lead', boq:'', concept:'', note:''}};
  salesLeadModal();
};
ACT.lead = (el, d) => {
  const l = salesLead(d.id); if (!l) return;
  ui.lead = {step:1, d:{...JSON.parse(JSON.stringify(l)), valueTy:l.value ? String(Math.round(l.value / 1e7) / 100).replace('.', ',') : ''}};
  salesLeadModal();
};
function salesLeadModal(){
  const {step, d} = ui.lead, edit = salesCanEdit(), isNew = !d.id;
  const stages = isNew ? SALES_STG.slice(0, 5) : SALES_STG;
  const f1 = `<div class="row2"><label class="field">Tên khách hàng *<input id="ld-name" name="name" value="${esc(d.name)}" placeholder="VD: Anh Nguyễn Văn Phú"></label><label class="field">Số điện thoại *<input id="ld-phone" name="phone" value="${esc(d.phone)}" placeholder="09xx xxx xxx" inputmode="tel"></label></div>
    <div class="row2"><label class="field">Email<input id="ld-email" name="email" type="email" value="${esc(d.email)}" placeholder="khachhang@email.com"></label><label class="field">Nguồn khách hàng<select name="source">${opt(SALES_SOURCES.includes(d.source) ? SALES_SOURCES : [...SALES_SOURCES, d.source], d.source)}</select></label></div>
    <label class="field">Địa chỉ<input id="ld-addr" name="addr" value="${esc(d.addr)}" placeholder="Số nhà, đường, phường/xã, quận/huyện"></label>
    <div class="row2"><label class="field">Phòng ban phụ trách<select name="dept">${opt([['dan-dung','Phòng KD Dân dụng'],['du-an','Phòng KD Dự Án']], d.dept)}</select></label><label class="field">Nhân viên phụ trách<select name="owner">${peopleOpts(d.owner)}</select></label></div>`;
  const f2 = `<div class="row2"><label class="field">Loại dự án<select name="type">${opt(SALES_TYPES, d.type)}</select></label><label class="field">Quy mô<input id="ld-scale" name="scale" value="${esc(d.scale)}" placeholder="VD: 5x20m, 1 trệt 3 lầu"></label></div>
    <label class="field">Tên dự án / công trình<input id="ld-proj" name="proj" value="${esc(d.proj)}" placeholder="VD: Biệt thự Nhà Bè (để trống sẽ lấy theo loại dự án & quy mô)"></label>
    <div class="field">Hạng mục quan tâm<div class="checks">${SALES_INTERESTS.map(x => `<label><input type="checkbox" name="interests" value="${x}" ${(d.interests || []).includes(x) ? 'checked' : ''}>${x}</label>`).join('')}</div></div>
    <div class="row2"><label class="field">Giá trị ước tính (tỷ)<input id="ld-value" name="valueTy" value="${esc(d.valueTy)}" placeholder="VD: 2.5" inputmode="decimal"></label><label class="field">Giai đoạn hiện tại<select name="stage">${opt(stages.map(s => [s[0], s[1]]), d.stage)}</select></label></div>`;
  const f3 = `<label class="field">BOQ (Bảng khối lượng dự toán)<input id="ld-boq" type="file" name="boqfile" accept=".xlsx,.xls,.pdf"><span class="small">${d.boq ? 'Đã đính kèm: ' + esc(d.boq) : 'Kéo thả file hoặc bấm để tải lên (.xlsx, .pdf)'}</span></label>
    <label class="field">Concept / Ý tưởng thiết kế<textarea id="ld-concept" name="concept" placeholder="Mô tả phong cách, ý tưởng thiết kế mong muốn của khách hàng...">${esc(d.concept)}</textarea></label>
    <label class="field">Ghi chú nội bộ<textarea id="ld-note" name="note" placeholder="Ghi chú cho đội kinh doanh / kỹ thuật...">${esc(d.note)}</textarea></label>`;
  showModal(`<form class="modal wide" data-form="lead" data-id="${esc(d.id)}" novalidate>
    <h3>${isNew ? 'Thêm khách hàng tiềm năng' : 'Hồ sơ khách hàng — ' + esc(d.name)}${closeBtn()}</h3>
    <div class="sub">Điền thông tin theo 3 cấp độ — càng đầy đủ, hồ sơ chuyển giao sang thi công càng chính xác.</div>
    <div class="seg">${SALES_STEPS.map((l, i) => `<button type="button" class="${step === i + 1 ? 'on' : ''}" data-act="lead-step" data-s="${i + 1}" data-free="1">${i + 1}. ${l}</button>`).join('')}</div>
    ${!isNew && d.projectId ? `<div class="small muted">Đã có hồ sơ dự án · ${salesProjLink(d)}</div>` : ''}
    ${step === 1 ? f1 : step === 2 ? f2 : f3}
    <div class="m-actions">${!isNew && edit ? delBtn('lead') : ''}<span class="small muted" style="margin-right:auto;align-self:center">Bước ${step}/3 — ${SALES_STEPS[step - 1]}</span>
      ${step > 1 ? `<button type="button" class="btn ghost" data-act="lead-step" data-s="${step - 1}">Quay lại</button>` : ''}
      ${step < 3 ? `<button type="button" class="btn line" data-act="lead-step" data-s="${step + 1}">Tiếp theo</button>` : ''}
      ${edit && (step === 3 || !isNew) ? `<button class="btn" type="submit">Lưu khách hàng</button>` : ''}</div>
  </form>`);
}
function salesLeadCollect(){
  const f = document.querySelector('form[data-form="lead"]'); if (!f) return;
  const d = ui.lead.d, fd = new FormData(f);
  ['name','phone','email','source','addr','dept','owner','type','scale','proj','valueTy','stage','concept','note'].forEach(k => { if (fd.has(k)) d[k] = fd.get(k); });
  if (f.querySelector('[name=interests]')) d.interests = fd.getAll('interests');
  const file = f.querySelector('[name=boqfile]'); if (file && file.files[0]) d.boq = file.files[0].name;
}
const salesFocusName = () => { const i = document.getElementById('ld-name'); if (i) i.focus(); };
ACT['lead-step'] = (el, dd) => {
  salesLeadCollect();
  // "Tiếp theo" ở bước 1 cần có tên; bấm thẳng vào tab bước thì cho nhảy tự do
  if (!dd.free && ui.lead.step === 1 && +dd.s > 1 && !String(ui.lead.d.name).trim()){ salesFocusName(); toast('Nhập tên khách hàng trước'); return; }
  ui.lead.step = +dd.s; salesLeadModal();
};
FORM.lead = () => {
  if (!salesCanEdit()) return;
  salesLeadCollect();
  const d = ui.lead.d;
  if (!String(d.name).trim()){ ui.lead.step = 1; salesLeadModal(); salesFocusName(); toast('Cần nhập tên khách hàng'); return; }
  const value = Math.max(0, Math.round((parseFloat(String(d.valueTy).replace(',', '.')) || 0) * 1e9));
  const proj = String(d.proj || '').trim() || (d.scale ? `${d.type} (${d.scale})` : d.type);
  const data = {name:d.name.trim(), phone:d.phone.trim(), email:d.email.trim(), source:d.source, addr:d.addr.trim(), dept:d.dept, owner:d.owner || S.me, type:d.type, scale:d.scale.trim(),
    proj, interests:d.interests || [], value, concept:d.concept, note:d.note, boq:d.boq || ''};
  ui.leadPrev = {source:d.source, dept:d.dept, type:d.type, interests:d.interests, stage:SALES_OPEN.includes(d.stage) ? d.stage : 'lead'};
  let l = salesLead(d.id);
  if (l){ Object.assign(l, data, {updated:todayISO()}); if (!salesSetStage(l, d.stage) && SALES_PROJ.includes(l.stage) && typeof syncLeadToProject === 'function') syncLeadToProject(l); }
  else {
    l = {id:'l' + uid(), ...data, stage:'lead', sub:'', created:todayISO(), updated:todayISO(), signedAt:'', projectId:''};
    S.leads.push(l); log('Thêm khách hàng ' + l.name, 'orange');
    salesSetStage(l, d.stage);
  }
  closeModal(); render(); toast('Đã lưu khách hàng ' + l.name);
};
DEL.lead = id => {
  const l = salesLead(id); if (!l) return;
  S.leads = S.leads.filter(x => x.id !== id);
  log('Xoá khách hàng ' + l.name, 'orange');
  if (SALES_PROJ.includes(l.stage) && typeof syncLeadToProject === 'function') syncLeadToProject({...l, stage:'', deleted:true});
};

/* ================= tìm nhanh & trợ lý ================= */
SEARCH.push(hit => perm('sales') === 'none' ? [] : salesLeads().filter(l => hit(l.name + ' ' + l.proj + ' ' + l.phone)).map(l => ({icon:'briefcase', label:l.name + ' — ' + l.proj, sub:'Kinh doanh · ' + leadStageLabel(l.stage), run:() => { nav('sales', 'leads'); ACT.lead(null, {id:l.id}); }})));
AI.push({re:/cơ hội|pipeline|khách hàng|hợp đồng|kinh doanh|chăm sóc|sắp chốt/, fn:(q, s) => {
  if (perm('sales') === 'none' || !S.leads) return '';
  const L = salesLeads(), link = x => `<button class="link" data-act="lead" data-id="${x.id}">${esc(x.name)} — ${esc(x.proj)}</button>`;
  if (/chăm sóc|gấp/.test(s)){
    const cold = L.filter(x => SALES_OPEN.includes(x.stage) && x.stage !== 'signed' && daysLeft(x.updated) <= -7).sort((a, b) => a.updated.localeCompare(b.updated));
    return cold.length ? `${cold.length} khách hàng chưa được cập nhật từ 7 ngày trở lên:` + list(cold.slice(0, 6).map(x => `${link(x)} · ${leadStageLabel(x.stage)} · lần cuối ${fmtDate(x.updated)} · ${esc(person(x.owner).name)}`)) : 'Mọi khách hàng đang mở đều được cập nhật trong 7 ngày qua.';
  }
  const k = salesKpi(), hot = L.filter(x => ['nego','quote'].includes(x.stage)).sort((a, b) => b.value - a.value).slice(0, 5);
  return `Pipeline đang theo dõi <b>${k.open.length} cơ hội · ${salesMoney(k.openVal)}</b>; tháng này đã chốt ${k.signed.length} hợp đồng (${salesMoney(k.signedVal)}). `
    + SALES_STG.slice(0, 5).map(([st, l]) => `${l}: ${L.filter(x => x.stage === st).length}`).join(' · ')
    + (hot.length ? '<br>Cơ hội sắp chốt:' + list(hot.map(x => `${link(x)} · ${leadStageLabel(x.stage)} · ${salesMoney(x.value)}`)) : '')
    + `<button class="link" data-act="nav" data-v="sales" data-sub="pipeline">Mở pipeline ›</button>`;
}});
