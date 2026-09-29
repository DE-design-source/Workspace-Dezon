/* Dezon Workspace — HR: Chấm công (theo ngày / theo nhân viên / duyệt ngoại vùng / của tôi), Hồ sơ nhân sự, Bảng lương. */

/* ================= hằng số & quy tắc ================= */
const HR_GRACE = 10;              // phút ân hạn: vào trễ ≤ 10 phút vẫn "Đúng giờ"; quá thì tính trễ từ giờ vào ca
const HR_WEEK_TARGET = 40 * 60;   // giờ công chuẩn / tuần (phút)
const HR_BH = {bhxh:.08, bhyt:.015, bhtn:.01};
const HR_BH_RATE = HR_BH.bhxh + HR_BH.bhyt + HR_BH.bhtn; // 10,5% NLĐ đóng, căn cứ = toàn bộ Gross
const HR_ST = {active:['Đang làm việc','green'], probation:['Thử việc','yellow'], left:['Đã nghỉ việc','gray']};
const HR_DEPTS = ['Quản lý dự án','Marketing','Kinh doanh','Thi công','Vận hành','Tài chính'];
const HR_LEAVE_BASE = 12;         // ngày phép/năm cho nhân viên chính thức, +1 ngày mỗi 5 năm thâm niên (wiki "Chế độ nghỉ phép")

/* ================= đồng bộ ================= */
syncCol('att_sites', 'array', () => S.att_sites, v => S.att_sites = v, {read: 'all', write:['att', 'projects'], empty:() => []});
syncCol('att_roster', 'map', () => S.att_roster, v => S.att_roster = v, {read:['att','hr'], write:['att'], empty:() => ({})});
// ai cũng tự chấm công được (tạo bản ghi + yêu cầu ngoài vùng); duyệt vẫn cần quyền sửa Chấm công (kiểm ở giao diện)
syncCol('att_recs', 'array', () => S.att_recs, v => S.att_recs = v, {read: 'all', write:'all', empty:() => []});
syncCol('att_reqs', 'array', () => S.att_reqs, v => S.att_reqs = v, {read: 'all', write:'all', empty:() => []});
syncCol('hr_staff', 'array', () => S.hr_staff, v => S.hr_staff = v, {read:['hr'], write:['hr'], empty:() => []});
syncCol('hr_pay', 'single', () => ({paid:S.hr_pay || {}}), v => S.hr_pay = v.paid || {}, {read:['hr'], write:['hr'], empty:() => ({paid:{}})});

/* ================= dữ liệu mẫu ================= */
SEEDS.push(s => {
  ensurePeople(s, [
    {id:'do-thao-vy', name:'Đỗ Thảo Vy', role:'Head Marketing', team:'Marketing', c:'pink'},
    {id:'minh-quan', name:'Minh Quân', role:'Media (quay, dựng video)', team:'Marketing', c:'blue'},
    {id:'thuy-duong', name:'Thuỳ Dương', role:'Content Creator', team:'Marketing', c:'yellow'},
    {id:'hoang-yen-nhi', name:'Hoàng Yến Nhi', role:'Nhân viên KD — Phòng Dân dụng', team:'Kinh doanh', c:'pink'},
    {id:'dang-quoc-cuong', name:'Đặng Quốc Cường', role:'Nhân viên KD — Phòng Dự án', team:'Kinh doanh', c:'orange'},
    {id:'vu-thi-dieu', name:'Vũ Thị Diệu', role:'Giám sát an toàn lao động', team:'Thi công', c:'green'}
  ]);
  const pidOf = name => (s.people.find(p => p.name === name) || {}).id || '';
  const T = md('2026-09-21');
  s.att_sites = [
    {id:'rs-a', pid:'riverside', name:'Riverside — Tòa A', addr:'123 Đại lộ Nguyễn Văn Linh, Q7', lat:10.7290, lng:106.7195, radius:100, expected:70, shift:'07:00', active:true, crew:{[T]:57}},
    {id:'rs-b', pid:'riverside', name:'Riverside — Tòa B', addr:'125 Đại lộ Nguyễn Văn Linh, Q7', lat:10.7296, lng:106.7206, radius:100, expected:50, shift:'07:00', active:true, crew:{[T]:39}},
    {id:'kho-bc', pid:'', name:'Kho vật tư Bình Chánh', addr:'QL1A, Bình Chánh', lat:10.6880, lng:106.5950, radius:100, expected:30, shift:'07:00', active:true, crew:{[T]:23}}
  ];
  s.att_roster = {lv:{site:'rs-a', shift:''}, nh:{site:'rs-a', shift:''}, pb:{site:'rs-a', shift:''}, hb:{site:'rs-a', shift:''}, nl:{site:'rs-a', shift:''},
    vn:{site:'rs-b', shift:''}, ts:{site:'rs-b', shift:''}, dp:{site:'rs-b', shift:'08:00'}, ct:{site:'kho-bc', shift:''}, lt:{site:'kho-bc', shift:''}, ta:{site:'rs-a', shift:'08:00'}};
  const R = (p, site, inT, out, extra = {}) => ({id:'r' + uid(), p, date:T, site, in:inT, out, task:'', dist:null, zone:'ok', ...extra});
  s.att_recs = [R('lv','rs-a','06:58',null,{task:'Đổ bê tông sàn tầng 3'}), R('nh','rs-a','07:02',null,{task:'Đổ bê tông sàn tầng 3'}), R('pb','rs-a','07:15',null), R('hb','rs-a','07:20',null,{task:'Trát tường tầng 2'}),
    R('nl','rs-a','06:50',null,{task:'Đi ống điện âm sàn'}), R('vn','rs-b','06:55',null), R('dp','rs-b','08:00',null), R('ct','kho-bc','07:10',null,{dist:180, zone:'pending', id:'r-ct'}), R('lt','kho-bc','07:05',null)];
  // 4 ngày làm việc (T2–T6) gần nhất trước hôm nay — dựng lịch sử cho bảng tuần & "Lịch sử"
  const prev = []; for (let d = addDays(T, -1); prev.length < 4; d = addDays(d, -1)){ const w = parseD(d).getDay(); if (w && w !== 6) prev.push(d); }
  const absent = {pb:1, ts:2};
  ['lv','nh','pb','hb','nl','vn','ts','dp','ct','lt'].forEach((p, k) => prev.forEach((d, i) => {
    if (absent[p] === i) return;
    const sh = p === 'dp' ? 480 : 420, a = sh - 8 + (k * 5 + i * 3) % 12, b = a + 490 + (k * 7 + i * 11) % 35;
    s.att_recs.push({id:'r' + uid(), p, date:d, site:s.att_roster[p].site, in:pad(Math.floor(a / 60)) + ':' + pad(a % 60), out:pad(Math.floor(b / 60)) + ':' + pad(b % 60), task:'', dist:null, zone:'ok'});
  }));
  s.att_recs.push(R('ta','rs-a','08:00','17:05',{date:prev[0]}), R('ta','rs-a','07:58','17:10',{date:prev[1]}));
  const yest = addDays(T, -1), d18 = md('2026-09-18');
  s.att_reqs = [
    {id:'q-ct', rec:'r-ct', p:'ct', name:'Cao Nhật Tân', site:'kho-bc', date:T, time:'07:10', dist:180, radius:100, status:'pending', note:'', by:'', at:0},
    {id:'q-nvl', rec:'', p:'', name:'Nguyễn Văn Long', site:'kho-bc', date:yest, time:'07:25', dist:140, radius:100, status:'approved', note:'Nhận hàng tại cổng sau kho', by:'ta', at:parseD(yest).getTime() + 9 * 36e5},
    {id:'q-dvk', rec:'', p:'', name:'Đỗ Văn Kiên', site:'rs-b', date:d18, time:'06:40', dist:420, radius:100, status:'rejected', note:'Không có mặt tại công trường', by:'ta', at:parseD(d18).getTime() + 8 * 36e5}
  ];
  s.hr_staff = [
    ['Trần Anh','Quản lý dự án','Quản lý dự án','0909 111 222','2022-03-01','active',25000000],
    ['Đỗ Thảo Vy','Head Marketing','Marketing','0909 222 333','2023-06-15','active',18000000],
    ['Ngọc Hà','Graphic Designer','Marketing','0909 333 444','2024-01-10','active',15000000],
    ['Minh Quân','Media (quay, dựng video)','Marketing','0909 444 555','2023-09-05','active',16000000],
    ['Thuỳ Dương','Content Creator','Marketing','0909 555 666','2024-11-20','active',14000000],
    ['Hoàng Yến Nhi','Nhân viên KD — Phòng Dân dụng','Kinh doanh','0909 666 777','2024-02-12','active',12000000],
    ['Đặng Quốc Cường','Nhân viên KD — Phòng Dự án','Kinh doanh','0909 777 888','2023-07-03','active',13000000],
    ['Nguyễn Đức Anh','Chỉ huy trưởng công trường','Thi công','0909 888 999','2022-04-18','active',20000000],
    ['Đỗ Thành Long','Tư vấn giám sát','Thi công','0909 999 000','2022-05-25','active',16000000],
    ['Vũ Thị Diệu','Giám sát an toàn lao động','Thi công','0912 111 222','2024-08-14','probation',12000000],
    ['Cao Nhật Tân','Mua hàng & cung ứng','Vận hành','0912 222 333','2023-10-09','active',13000000],
    ['Lý Thu Trang','Kế toán','Tài chính','0912 333 444','2023-01-01','left',12000000, md('2026-09-10')]
  ].map(([name, title, dept, phone, start, status, gross, end], i) => ({id:'h' + (i + 1), name, title, dept, phone, email:'', start, end:end || '', status, gross, pid:pidOf(name)}));
  const per = T.slice(0, 7), unpaid = ['Đỗ Thành Long','Vũ Thị Diệu'];
  s.hr_pay = {[per]:s.hr_staff.filter(x => x.status !== 'left' && !unpaid.includes(x.name)).map(x => x.id)};
});

/* ================= tiện ích ================= */
const HR_fmt = m => { m = Math.max(0, Math.floor(m)); return Math.floor(m / 60) + 'h' + pad(m % 60); };
const HR_hm = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
const HR_nowMin = () => toMin(nowHM());
const HR_sites = () => S.att_sites || [];
const HR_recs = () => S.att_recs || [];
const HR_roster = () => S.att_roster || {};
const HR_site = id => HR_sites().find(s => s.id === id) || {id, name:'—', radius:100, expected:0, crew:{}};
const HR_isWork = d => { const w = parseD(d).getDay(); return w !== 0 && w !== 6; };
const HR_name = r => r.p ? person(r.p).name : (r.name || '—');
const HR_avatar = (p, name, s = 28) => p ? av(p, s) : `<span class="av" style="width:${s}px;height:${s}px;font-size:${Math.round(s * .38)}px;background:var(--gray)">${esc(initials(name || '?'))}</span>`;
function HR_shift(p, siteId){ const r = HR_roster()[p]; return (r && r.shift) || HR_site(siteId).shift || '07:00'; }
// trạng thái 1 bản ghi: ok | late | out (ngoài vùng chờ duyệt) | rej (bị từ chối) | none
function HR_state(r){
  if (!r || !r.in) return {k:'none', label:'Chưa chấm công', c:'red', present:false};
  if (r.zone === 'pending') return {k:'out', label:'Ngoài vùng · Duyệt', c:'red', present:true};
  if (r.zone === 'rejected') return {k:'rej', label:'Ngoài vùng · Từ chối', c:'gray', present:false};
  const late = toMin(r.in) - toMin(HR_shift(r.p, r.site));
  return late > HR_GRACE ? {k:'late', label:`Trễ ${late} phút`, c:'yellow', present:true, late} : {k:'ok', label:'Đúng giờ', c:'green', present:true};
}
// phút làm việc: đã chấm ra = ra − vào; đang trong ca hôm nay = bây giờ − vào (hiển thị *); ngày cũ quên chấm ra = 0
function HR_worked(r){
  if (!r || !r.in || r.zone === 'rejected') return 0;
  const end = r.out ? toMin(r.out) : r.date === todayISO() ? HR_nowMin() : null;
  return end == null ? 0 : Math.max(0, end - toMin(r.in));
}
const HR_recOf = (p, d) => HR_recs().find(r => r.p === p && r.date === d);
function HR_periodRange(k){
  const t = todayISO();
  if (k === 'prev') return [addDays(t, -13), addDays(t, -7)];
  if (k === 'month') return [t.slice(0, 8) + '01', t];
  return [addDays(t, -6), t];
}
const HR_workdays = (a, b) => { let n = 0; for (let d = a; d <= b; d = addDays(d, 1)) if (HR_isWork(d)) n++; return n; };
function HR_week(p, a, b){
  const rs = HR_recs().filter(r => r.p === p && r.date >= a && r.date <= b && r.in && r.zone !== 'rejected');
  const min = sum(rs, HR_worked), days = new Set(rs.map(r => r.date)).size;
  return {days, min, avg:days ? Math.floor(min / days) : 0, of:HR_workdays(a, b)};
}
// ngày phép đã duyệt lấy từ Bàn làm việc (đơn "xinphep") nếu module đó có dữ liệu
function HR_deskLeaves(p){
  const R = Array.isArray(S.desk_requests) ? S.desk_requests : [];
  return R.filter(r => (r.type === 'xinphep' || r.type === 'leave') && [r.by, r.who, r.p, r.owner, r.author].includes(p)
    && (r.status === 'approved' || (r.approvals && Object.keys(r.approvals).length && Object.values(r.approvals).every(v => v === 'approved'))))
    .map(r => ({from:r.dateFrom || r.from, to:r.dateTo || r.to || r.dateFrom || r.from, kind:r.leaveKind || r.kind || 'Nghỉ phép năm'})).filter(x => x.from);
}
const HR_onLeave = (p, d) => HR_deskLeaves(p).some(x => d >= x.from && d <= x.to);

/* ================= hàm tích hợp (module khác gọi) ================= */
function attPending(){ return (S.att_reqs || []).filter(q => q.status === 'pending'); }
// tổng hợp theo công trường cho 1 ngày: có mặt = người chấm công hợp lệ + quân số tổ đội báo tay (công nhân không dùng app)
function attSummary(d = todayISO()){
  const sites = HR_sites().filter(s => s.active !== false).map(s => {
    const recs = HR_recs().filter(r => r.site === s.id && r.date === d);
    const st = recs.map(HR_state), tracked = st.filter(x => x.present).length;
    const present = tracked + (+((s.crew || {})[d]) || 0);
    return {...s, cap:Math.max(+s.expected || 0, present), expected:Math.max(+s.expected || 0, present), present, late:st.filter(x => x.k === 'late').length, out:st.filter(x => x.k === 'out').length};
  });
  return {sites, total:sum(sites, s => s.expected), present:sum(sites, s => s.present)};
}
function hrAddSite(project){
  if (!project) return null;
  S.att_sites = S.att_sites || [];
  let s = S.att_sites.find(x => x.pid === project.id);
  if (!s){ s = {id:'s' + uid(), pid:project.id, name:project.name, addr:project.addr || '', lat:null, lng:null, radius:100, expected:0, shift:'07:00', active:true, crew:{}}; S.att_sites.push(s); }
  return s;
}
function hrStaff(){ return S.hr_staff || []; }
function hrLeaveBalance(pid){
  const x = hrStaff().find(h => h.pid === pid || h.id === pid);
  const years = x && x.start ? Math.floor(diffDays(x.start, todayISO()) / 365.25) : 0;
  const total = !x ? HR_LEAVE_BASE : x.status === 'active' ? HR_LEAVE_BASE + Math.floor(years / 5) : 0;
  const y = todayISO().slice(0, 4);
  // ponytail: không tính phép năm trước chuyển sang quý I — thêm khi có dữ liệu phép tồn đầu năm
  let used = 0;
  HR_deskLeaves(x ? x.pid || pid : pid).filter(l => /phép năm/i.test(l.kind)).forEach(l => { for (let d = l.from; d <= l.to; d = addDays(d, 1)) if (d.startsWith(y) && parseD(d).getDay() !== 0) used++; });
  return {total, used};
}

/* ================= trang HR ================= */
MOD.att = () => {
  // Ai cũng có tab Chấm công (ít nhất để tự chấm công); hồ sơ & lương cần quyền hr.
  const tabsAll = [['cc','Chấm công','all'],['staff','Hồ sơ nhân sự','hr'],['pay','Bảng lương','hr']].filter(t => t[2] === 'all' || perm(t[2]) !== 'none');
  // deep link nav('att','approve'|'staff'…) ghi vào S.sub.att → quy về đúng tab
  const a = S.sub.att;
  if (['cc','staff','pay'].includes(a)){ S.sub.hr = a; S.sub.att = 'day'; }
  else if (a && a !== ui.attSeen && (ui.attSeen !== undefined || a !== 'day')){ S.sub.hr = 'cc'; }
  ui.attSeen = S.sub.att;
  let cur = S.sub.hr || 'cc'; if (!tabsAll.some(t => t[0] === cur)) cur = S.sub.hr = (tabsAll[0] || ['cc'])[0];
  const tabs = subtabs('hr', tabsAll.map(t => [t[0], t[1], t[0] === 'cc' ? attPending().length : 0]), 'cc');
  const edit = perm('hr') === 'edit';
  let body, act = '';
  if (cur === 'cc'){ body = HR_cc(); if (perm('att') !== 'none') act = `<button class="btn line" data-act="sub" data-view="att" data-k="mine">${ic('phone', 15)}Xem giao diện mobile</button>`; }
  else if (cur === 'staff'){ body = HR_staffView(edit); if (edit) act = `<button class="btn" data-act="hr-new">${ic('plus', 15)}Thêm nhân sự</button>`; }
  else body = HR_payView(edit);
  return head('HR', 'Chấm công theo công trường, hồ sơ nhân sự và bảng lương hằng tháng.', act) + tabs + body;
};

/* ---------- Chấm công ---------- */
function HR_cc(){
  if (perm('att') === 'none'){ S.sub.att = 'mine'; return HR_ccMine(); }   // nhân viên không có quyền quản lý chấm công: chỉ tự chấm công
  const pend = attPending(), cur = sub('att', 'day');
  const tabs = subtabs('att', [['day','Theo ngày'],['emp','Theo nhân viên'],['approve','Duyệt ngoại vùng', pend.length],['mine','Chấm công của tôi']], 'day');
  const body = cur === 'emp' ? HR_ccStaff() : cur === 'approve' ? HR_ccApprove() : cur === 'mine' ? HR_ccMine() : HR_ccDay();
  return tabs + body;
}
function HR_ccDay(){
  const d = ui.attDate || todayISO(), fs = ui.attSite || 'all', canEdit = perm('att') === 'edit';
  const sm = attSummary(d), sites = sm.sites.filter(s => fs === 'all' || s.id === fs);
  const total = sum(sites, s => s.expected), present = sum(sites, s => s.present), late = sum(sites, s => s.late);
  const pend = attPending().filter(q => fs === 'all' || q.site === fs);
  // danh sách: người được phân công (roster) + ai có bản ghi hôm đó
  const R = HR_roster(), ids = new Set(Object.keys(R).filter(p => fs === 'all' || R[p].site === fs));
  HR_recs().filter(r => r.date === d && (fs === 'all' || r.site === fs)).forEach(r => ids.add(r.p || r.id));
  const future = d > todayISO();
  const rows = [...ids].map(p => { const r = HR_recOf(p, d) || HR_recs().find(x => x.id === p); return {p:r ? r.p : p, r, site:r ? r.site : (R[p] || {}).site}; })
    .filter(x => HR_sites().some(s => s.id === x.site) || x.r)
    .sort((a, b) => HR_site(a.site).name.localeCompare(HR_site(b.site).name) || HR_name({p:a.p}).localeCompare(HR_name({p:b.p})));
  const statusCell = x => {
    if (!x.r && HR_onLeave(x.p, d)) return pill('Nghỉ phép', 'blue');
    if (!x.r && (future || !HR_isWork(d))) return '<span class="muted">—</span>';
    const st = HR_state(x.r);
    return st.k === 'out' ? `<button class="pill red" data-act="sub" data-view="att" data-k="approve">${st.label} ›</button>` : pill(st.label, st.c);
  };
  return `<div class="toolbar hr-bar">
      <button class="icon-btn" data-act="att-day" data-n="-1" aria-label="Ngày trước">${ic('left', 16)}</button>
      <span class="hr-date">${ic('clock', 15)}${longDate(d)}</span>
      <button class="icon-btn" data-act="att-day" data-n="1" aria-label="Ngày sau">${ic('chev', 16)}</button>
      <button class="fchip sm ${d === todayISO() ? 'on' : ''}" data-act="att-day" data-n="0">Hôm nay</button>
      <select class="hr-sel" data-change="att-site" aria-label="Lọc công trường">${opt([['all','Tất cả công trường'], ...HR_sites().map(s => [s.id, s.name])], fs)}</select>
      ${canEdit ? `<span style="flex:1"></span><button class="btn line sm" data-act="att-roster">${ic('users', 14)}Phân công chấm công</button><button class="btn sm" data-act="att-site-new">${ic('plus', 14)}Công trường</button>` : ''}
    </div>
    ${HR_sites().length ? `<div class="stats">
      ${stat('Tổng nhân sự ' + (d === todayISO() ? 'hôm nay' : 'ngày ' + fmtDate(d)), num(total), sites.length + ' công trường hoạt động')}
      ${stat('Đang có mặt', num(present) + ` <span class="small muted">/${num(total)}</span>`, pill((total ? Math.round(present / total * 100) : 0) + '%', 'green'))}
      ${stat('Trễ / Chưa chấm công', late + ' / ' + num(Math.max(0, total - present)), 'Trễ · chưa chấm công', late ? 'bad' : '')}
      <button class="card stat hr-kpi-link" data-act="sub" data-view="att" data-k="approve"><small>Cần duyệt ngoài vùng</small><b>${pend.length}</b><em class="${pend.length ? 'bad' : ''}">Xem & duyệt ngay ›</em></button>
    </div>
    <div class="hr-sites">${sites.map(s => `<button class="card pad hr-site ${s.out ? 'warn' : ''}" ${canEdit ? `data-act="att-site-edit" data-id="${s.id}"` : 'disabled'} title="${canEdit ? 'Sửa công trường, quân số tổ đội' : ''}">
        <div class="row">${ic('pin', 16)}<b class="ell">${esc(s.name)}</b>${s.out ? `<span style="margin-left:auto">${pill(s.out + ' ngoài vùng', 'red')}</span>` : ''}</div>
        <div class="hr-site-n"><b>${num(s.present)}</b> / ${num(s.expected)} có mặt</div>${bar(s.expected ? s.present / s.expected * 100 : 0, 'var(--green)')}
        <small class="muted">Bán kính ${s.radius}m · vào ca ${esc(s.shift || '07:00')}${(s.crew || {})[d] ? ' · tổ đội báo ' + s.crew[d] : ''}</small></button>`).join('')}</div>
    <div class="table-wrap"><table><thead><tr><th>Nhân viên</th><th>Đội / Vai trò</th><th>Địa điểm</th><th>Giờ vào</th><th>Giờ ra</th><th class="r">Tổng giờ</th><th>Trạng thái</th></tr></thead><tbody>
      ${rows.map(x => { const pp = person(x.p), r = x.r, st = HR_state(r); return `<tr ${canEdit ? `class="click" data-act="att-rec" data-p="${esc(x.p || '')}" data-id="${r ? r.id : ''}" tabindex="0"` : ''}>
        <td><div class="who">${HR_avatar(x.p, r ? HR_name(r) : pp.name)}<b style="font-weight:500">${esc(r ? HR_name(r) : pp.name)}</b></div></td>
        <td>${esc(pp.team || '—')}<div class="small muted">${esc(pp.role || '')}</div></td><td>${esc(HR_site(x.site).name)}</td>
        <td class="num">${r && r.in ? esc(r.in) : '—'}</td><td class="num">${r && r.out ? esc(r.out) : '—'}</td>
        <td class="r num">${r && r.in && st.k !== 'rej' ? HR_fmt(HR_worked(r)) + (r.out ? '' : r.date === todayISO() ? '*' : ' <span class="small muted">(chưa chấm ra)</span>') : '—'}</td>
        <td>${statusCell(x)}</td></tr>`; }).join('') || `<tr><td colspan="7" class="empty">Chưa có ai được phân công chấm công${fs === 'all' ? '' : ' tại công trường này'}.</td></tr>`}
    </tbody></table><div class="foot-note">* Đang trong ca làm việc, giờ tính đến thời điểm hiện tại. Ân hạn ${HR_GRACE} phút; ca công trường vào ${esc(HR_sites()[0] ? HR_sites()[0].shift || '07:00' : '07:00')}, văn phòng 08:00. Hiển thị ${rows.length}/${num(total)} nhân sự (phần còn lại là quân số tổ đội do chỉ huy công trường báo).</div></div>`
    : emptyBox('Chưa có công trường', 'Thêm công trường (toạ độ + bán kính) để nhân sự chấm công theo vị trí.', canEdit ? `<button class="btn" data-act="att-site-new">${ic('plus', 15)}Thêm công trường</button>` : '')}`;
}
function HR_ccStaff(){
  const per = ui.attPer || 'week', [a, b] = HR_periodRange(per), q = (ui.attQ || '').toLowerCase().trim();
  const R = HR_roster(), ids = new Set(Object.keys(R));
  HR_recs().filter(r => r.p && r.date >= a && r.date <= b).forEach(r => ids.add(r.p));
  const rows = [...ids].filter(p => !q || (person(p).name + ' ' + person(p).team).toLowerCase().includes(q)).map(p => ({p, ...HR_week(p, a, b)})).sort((x, y) => y.min - x.min);
  return `<div class="toolbar"><div class="search" style="flex:1;min-width:200px;max-width:320px">${ic('search', 15)}<input id="att-q" data-input="att-q" value="${esc(ui.attQ || '')}" placeholder="Tìm nhân viên..." aria-label="Tìm nhân viên"></div>
      <select class="hr-sel" data-change="att-per" aria-label="Kỳ">${opt([['week', `7 ngày qua (${fmtDate(HR_periodRange('week')[0])}–${fmtDate(HR_periodRange('week')[1])})`], ['prev', `Tuần trước (${fmtDate(HR_periodRange('prev')[0])}–${fmtDate(HR_periodRange('prev')[1])})`], ['month', 'Tháng này']], per)}</select></div>
    <div class="table-wrap"><table><thead><tr><th>Nhân viên</th><th>Đội</th><th>Ngày công</th><th class="r">Tổng giờ</th><th class="r">TB giờ / ngày</th><th></th></tr></thead><tbody>
      ${rows.map(x => `<tr><td><div class="who">${av(x.p, 28)}<b style="font-weight:500">${esc(person(x.p).name)}</b></div></td><td>${esc(person(x.p).team || '—')}</td>
        <td><div class="row hr-days">${bar(x.of ? x.days / x.of * 100 : 0, 'var(--green)')}<span class="num small">${x.days}/${x.of}</span></div></td>
        <td class="r b num">${HR_fmt(x.min)}</td><td class="r num">${x.days ? HR_fmt(x.avg) : '—'}</td>
        <td class="r"><button class="link" data-act="att-hist" data-p="${esc(x.p)}">Lịch sử ›</button></td></tr>`).join('') || '<tr><td colspan="6" class="empty">Không có nhân viên phù hợp</td></tr>'}
    </tbody></table><div class="foot-note">Ngày công = số ngày có chấm công hợp lệ / số ngày làm việc (T2–T6) trong kỳ. TB = Tổng giờ / Ngày công. Giờ hôm nay tính đến hiện tại.</div></div>`;
}
function HR_ccApprove(){
  const pend = attPending(), canEdit = perm('att') === 'edit';
  const done = (S.att_reqs || []).filter(q => q.status !== 'pending').sort((a, b) => (b.at || 0) - (a.at || 0)).slice(0, 10);
  return (pend.map(q => { const pp = person(q.p); return `<div class="card pad stack hr-req">
      <div class="row">${ic('alert', 18)}${HR_avatar(q.p, q.name, 40)}<div><b style="font-weight:600">${esc(q.p ? pp.name : q.name)}</b><div class="small muted">${q.p && pp.team ? esc(pp.team) + ' · ' : ''}${esc(HR_site(q.site).name)}</div></div><span style="margin-left:auto">${pill(relDay(q.date) + ', ' + q.time, 'orange')}</span></div>
      <div class="hr-callout">${ic('pin', 18)}<span>${q.dist == null ? 'Không xác định được vị trí khi chấm công (thiết bị tắt định vị).' : `Vị trí chấm công cách tâm công trường <b>${num(q.dist)}m</b>, vượt quá bán kính cho phép <b>${num(q.radius)}m</b>.`}</span></div>
      ${canEdit ? `<textarea class="hr-note" id="att-note-${q.id}" rows="2" placeholder="Ghi chú duyệt (không bắt buộc)..." aria-label="Ghi chú duyệt"></textarea>
      <div class="m-actions"><button class="btn danger" data-act="att-decide" data-id="${q.id}" data-ok="0">Từ chối</button><button class="btn" data-act="att-decide" data-id="${q.id}" data-ok="1">${ic('check', 15)}Duyệt chấm công</button></div>` : '<div class="small muted">Chỉ người có quyền sửa Chấm công được duyệt.</div>'}
    </div>`; }).join('') || emptyBox('Không có yêu cầu nào cần duyệt', 'Chấm công ngoài bán kính công trường sẽ hiện ở đây để giám sát duyệt.'))
    + `<div class="card list-card"><h2 class="sec-title">Đã xử lý gần đây</h2>${done.map(q => `<div class="li">${HR_avatar(q.p, q.name, 30)}<span class="ell"><b>${esc(q.p ? person(q.p).name : q.name)} — ${esc(HR_site(q.site).name)}</b><small>${q.status === 'approved' ? 'Duyệt' : 'Từ chối'} bởi ${esc(person(q.by).name)} · ${q.at ? relDay(iso(new Date(q.at))) + ' ' + hm(q.at) : relDay(q.date)}${q.note ? ' · “' + esc(q.note) + '”' : ''}</small></span><span class="end">${pill(q.status === 'approved' ? 'Đã duyệt' : 'Từ chối', q.status === 'approved' ? 'green' : 'red')}</span></div>`).join('') || '<div class="empty">Chưa có yêu cầu nào được xử lý.</div>'}</div>`;
}
// danh sách việc đang thi công của dự án (từ tiến độ nếu mod-pm có) — dò mọi phần tử có name trong S.gantt[pid]
function HR_tasks(pid){
  const out = [], walk = x => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object'){ if (Array.isArray(x.tasks)) x.tasks.forEach(walk); else if (x.name) out.push(x.name); } };
  try { walk(((S.gantt || {})[pid])); } catch (e) {}
  return [...new Set(out)].slice(0, 60);
}
function HR_dist(a, b){ // haversine, mét
  const R = 6371e3, rad = x => x * Math.PI / 180, dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}
function HR_ccMine(){
  const me = S.me, t = todayISO(), ro = HR_roster()[me], siteId = ui.attMySite || (ro && ro.site) || (HR_sites()[0] || {}).id;
  if (!HR_sites().length) return emptyBox('Chưa có công trường', 'Quản lý cần thêm công trường trước khi chấm công.');
  const s = HR_site(siteId), r = HR_recOf(me, t), inNow = r && r.in && !r.out;
  const pos = ui.attPos, dist = pos && s.lat != null ? HR_dist(pos, s) : null, inZone = dist != null && dist <= s.radius;
  const zone = dist == null ? `<span class="small muted">${ui.attLocating ? 'Đang xác định vị trí…' : 'Chưa xác định vị trí'}</span>` : inZone ? `<span class="small hr-in">${ic('check', 13)} Trong khu vực · ${num(dist)}m</span>` : `<span class="small hr-out">● Ngoài khu vực · ${num(dist)}m</span>`;
  const mon = addDays(t, -((parseD(t).getDay() + 6) % 7));
  const wk = HR_week(me, mon, t), todayMin = HR_worked(r);
  const hist = HR_recs().filter(x => x.p === me && x.date < t && x.in).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const tasks = HR_tasks(s.pid), st = r ? HR_state(r) : null;
  return `<div class="phone hr-phone">
      <div class="row between"><div><b style="font-size:17px">Xin chào, ${esc(person(me).name.split(' ').pop())}</b><div class="small muted">${longDate(t)}</div></div>${av(me, 38)}</div>
      <div class="loc"><span class="hr-geo"><i></i></span><div style="flex:1;min-width:0"><div class="row between"><b class="ell" style="font-weight:600">${esc(s.name)}</b></div>${zone}<div class="small muted">${esc(s.addr || '')}</div>
        <div class="row" style="margin-top:6px;gap:6px"><select class="hr-sel sm" data-change="att-my-site" aria-label="Công trường">${opt(HR_sites().map(x => [x.id, x.name]), s.id)}</select><button class="btn line sm" data-act="att-locate">${ic('pin', 13)}Kiểm tra vị trí</button></div></div></div>
      <div class="loc" style="flex-direction:column;align-items:stretch;gap:10px">
        <div class="row">${r && r.in ? `<span class="sq hr-ok">${ic('check', 16)}</span><div><b>${r.out ? 'Đã chấm công ra' : 'Đã chấm công vào'}</b><div class="small muted">${r.out ? esc(r.in) + ' – ' + esc(r.out) : esc(r.in) + ' sáng nay'}${st && st.k !== 'ok' ? ' · ' + esc(st.label) : ''}</div></div>` : `<span class="sq">${ic('clock', 16)}</span><div><b>Chưa chấm công hôm nay</b><div class="small muted">Vào ca lúc ${esc(HR_shift(me, s.id))}</div></div>`}</div>
        <label class="field">Đang thi công<input id="att-task" list="att-tasks" value="${esc((r && r.task) || ui.attTask || '')}" placeholder="Chọn hoặc nhập công việc" data-input="att-task"><datalist id="att-tasks">${tasks.map(x => `<option value="${esc(x)}">`).join('')}</datalist></label>
        ${r && r.out ? `<div class="small muted" style="text-align:center">Hoàn thành ca hôm nay · ${HR_fmt(todayMin)}</div>` : `<button class="btn hr-punch ${inNow ? 'out' : ''}" data-act="att-punch">${ic(inNow ? 'left' : 'check', 16)}${inNow ? 'Chấm công ra' : 'Chấm công vào'} · ${nowHM()}</button>`}
      </div>
      <div class="loc" style="flex-direction:column;align-items:stretch;gap:8px">
        <div class="row between small"><span>Giờ công tuần này</span><b>${HR_fmt(wk.min)} / ${HR_WEEK_TARGET / 60}h</b></div>${bar(wk.min / HR_WEEK_TARGET * 100, 'var(--green)', 'thick')}
        <div class="row between small"><span>Hôm nay: <b>${HR_fmt(todayMin)}</b></span><span>Còn lại: <b>${HR_fmt(Math.max(0, HR_WEEK_TARGET - wk.min))}</b></span></div></div>
      <div><b style="font-size:13px">Lịch sử gần đây</b>${hist.map(h => `<div class="row between small hr-hist"><span class="row">${ic('check', 13)}${longDate(h.date).replace(/\/\d{4}$/, '')}</span><span class="num">${esc(h.in)} – ${esc(h.out || '…')}</span></div>`).join('') || '<div class="small muted" style="padding:8px 0">Chưa có lịch sử.</div>'}</div>
    </div>
    <div class="small muted" style="text-align:center">Chấm công dùng GPS của thiết bị. Ngoài bán kính ${s.radius}m → gửi yêu cầu duyệt tới giám sát (Duyệt ngoại vùng).</div>`;
}

/* ---------- hành động chấm công ---------- */
ACT['att-day'] = (el, d) => { ui.attDate = +d.n === 0 ? todayISO() : addDays(ui.attDate || todayISO(), +d.n); render(); };
CHG['att-site'] = el => { ui.attSite = el.value; render(); };
CHG['att-per'] = el => { ui.attPer = el.value; render(); };
INP['att-q'] = el => { ui.attQ = el.value; render(); };
INP['att-task'] = el => { ui.attTask = el.value; };
CHG['att-my-site'] = el => { ui.attMySite = el.value; render(); };
function HR_locate(){
  return new Promise(res => {
    if (!navigator.geolocation) return res(null);
    navigator.geolocation.getCurrentPosition(p => res({lat:p.coords.latitude, lng:p.coords.longitude, acc:p.coords.accuracy}), () => res(null), {enableHighAccuracy:true, timeout:10000, maximumAge:60000});
  });
}
ACT['att-locate'] = async () => {
  ui.attLocating = true; render();
  const p = await HR_locate(); ui.attLocating = false; ui.attPos = p;
  render(); if (!p) toast('Không lấy được vị trí — kiểm tra quyền định vị của trình duyệt');
};
let HR_punching = false;
ACT['att-punch'] = async () => {
  if (HR_punching) return; HR_punching = true;
  try {
    const me = S.me, t = todayISO(), ro = HR_roster()[me], s = HR_site(ui.attMySite || (ro && ro.site) || (HR_sites()[0] || {}).id);
    const task = (($('#att-task') || {}).value || '').trim(), now = nowHM();
    let r = HR_recOf(me, t);
    if (r && r.in && !r.out){ r.out = now; if (task) r.task = task; log(person(me).name + ' chấm công ra ' + now, 'green'); render(); toast('Đã chấm công ra lúc ' + now); return; }
    if (r && r.out) return toast('Hôm nay bạn đã chấm công đủ vào / ra');
    toast('Đang xác định vị trí…');
    const pos = await HR_locate(); ui.attPos = pos;
    const dist = pos && s.lat != null ? HR_dist(pos, s) : null, ok = dist != null && dist <= s.radius;
    r = {id:'r' + uid(), p:me, date:t, site:s.id, in:now, out:null, task, dist, zone:ok ? 'ok' : 'pending', lat:pos ? pos.lat : null, lng:pos ? pos.lng : null};
    S.att_recs = S.att_recs || []; S.att_recs.push(r);
    if (!HR_roster()[me]){ S.att_roster = S.att_roster || {}; S.att_roster[me] = {site:s.id, shift:''}; }
    if (!ok){
      S.att_reqs = S.att_reqs || [];
      S.att_reqs.push({id:'q' + uid(), rec:r.id, p:me, name:person(me).name, site:s.id, date:t, time:now, dist, radius:s.radius, status:'pending', note:'', by:'', at:0});
      log(person(me).name + ' chấm công ngoài vùng tại ' + s.name, 'orange');
      if (typeof botPost === 'function') botPost('Chấm công ngoài vùng', `${person(me).name} chấm công ${dist == null ? 'không xác định được vị trí' : 'cách tâm ' + dist + 'm (bán kính ' + s.radius + 'm)'} tại ${s.name}, cần giám sát duyệt.`, 'yellow', 'Module Chấm công', 'att', 'approve');
      render(); toast('Ngoài khu vực — đã gửi yêu cầu duyệt chấm công');
    } else { log(person(me).name + ' chấm công vào ' + now + ' tại ' + s.name, 'green'); render(); toast('Đã chấm công vào lúc ' + now); }
  } finally { HR_punching = false; }
};
ACT['att-decide'] = (el, d) => {
  if (perm('att') !== 'edit') return toast('Bạn chưa có quyền duyệt chấm công');
  const q = (S.att_reqs || []).find(x => x.id === d.id); if (!q) return;
  const ok = d.ok === '1', note = (($('#att-note-' + q.id) || {}).value || '').trim();
  Object.assign(q, {status:ok ? 'approved' : 'rejected', by:S.me, at:Date.now(), note});
  const r = HR_recs().find(x => x.id === q.rec); if (r) r.zone = ok ? 'approved' : 'rejected';
  const nm = q.p ? person(q.p).name : q.name;
  log(`${ok ? 'Duyệt' : 'Từ chối'} chấm công ngoài vùng của ${nm}`, ok ? 'green' : 'red');
  if (typeof botPost === 'function') botPost('Kết quả duyệt chấm công', `${nm} — ${HR_site(q.site).name}: ${ok ? 'đã được duyệt' : 'bị từ chối'} bởi ${person(S.me).name}.${note ? ' Ghi chú: ' + note : ''}`, ok ? 'green' : 'red', 'Module Chấm công', 'att', 'approve');
  render(); toast(ok ? 'Đã duyệt chấm công' : 'Đã từ chối chấm công');
};
ACT['att-hist'] = (el, d) => {
  const p = d.p, rs = HR_recs().filter(r => r.p === p && r.date >= addDays(todayISO(), -30)).sort((a, b) => b.date.localeCompare(a.date));
  showModal(`<div class="modal wide"><h3>Lịch sử chấm công — ${esc(person(p).name)}${closeBtn()}</h3><div class="sub">30 ngày gần nhất · ${esc(person(p).team || '')}</div>
    <div class="table-wrap"><table><thead><tr><th>Ngày</th><th>Địa điểm</th><th>Vào</th><th>Ra</th><th class="r">Giờ công</th><th>Trạng thái</th></tr></thead><tbody>
    ${rs.map(r => { const st = HR_state(r); return `<tr><td>${longDate(r.date).replace(/\/\d{4}$/, '')}</td><td>${esc(HR_site(r.site).name)}</td><td class="num">${esc(r.in || '—')}</td><td class="num">${esc(r.out || '—')}</td><td class="r num">${r.in ? HR_fmt(HR_worked(r)) + (!r.out && r.date === todayISO() ? '*' : '') : '—'}</td><td>${pill(st.label, st.c)}</td></tr>`; }).join('') || '<tr><td colspan="6" class="empty">Chưa có dữ liệu chấm công</td></tr>'}
    </tbody></table></div></div>`);
};
// sửa / chấm công hộ (quản lý)
ACT['att-rec'] = (el, d) => {
  if (perm('att') !== 'edit') return;
  const r = HR_recs().find(x => x.id === d.id), p = r ? r.p : d.p, date = r ? r.date : ui.attDate || todayISO();
  const site = r ? r.site : (HR_roster()[p] || {}).site;
  showModal(`<form class="modal" data-form="att-rec" data-id="${r ? r.id : ''}"><input type="hidden" name="p" value="${esc(p || '')}"><input type="hidden" name="date" value="${date}">
    <h3>${r ? 'Sửa chấm công' : 'Chấm công hộ'} — ${esc(r ? HR_name(r) : person(p).name)}${closeBtn()}</h3><div class="sub">${longDate(date)}</div>
    <label class="field">Công trường<select name="site">${opt(HR_sites().map(s => [s.id, s.name]), site)}</select></label>
    <div class="row2"><label class="field">Giờ vào<input type="time" name="in" required value="${esc(r && r.in || '')}"></label><label class="field">Giờ ra<input type="time" name="out" value="${esc(r && r.out || '')}"></label></div>
    <label class="field">Công việc<input name="task" value="${esc(r && r.task || '')}"></label>
    <div class="m-actions">${r ? delBtn('att_rec') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu</button></div></form>`);
};
FORM['att-rec'] = (v, f) => {
  if (v.out && v.out <= v.in) return toast('Giờ ra phải sau giờ vào');
  let r = HR_recs().find(x => x.id === f.dataset.id);
  if (!r){ r = {id:'r' + uid(), p:v.p, date:v.date, dist:null, zone:'ok'}; S.att_recs = S.att_recs || []; S.att_recs.push(r); }
  Object.assign(r, {site:v.site, in:v.in, out:v.out || null, task:v.task.trim()});
  log('Cập nhật chấm công ' + HR_name(r) + ' ngày ' + fmtDate(r.date), 'green'); closeModal(); render(); toast('Đã lưu chấm công');
};
DEL.att_rec = id => { S.att_recs = HR_recs().filter(r => r.id !== id); S.att_reqs = (S.att_reqs || []).filter(q => q.rec !== id); };
// công trường
ACT['att-site-new'] = () => HR_siteModal(null);
ACT['att-site-edit'] = (el, d) => HR_siteModal(HR_sites().find(s => s.id === d.id));
function HR_siteModal(s){
  const x = s || {id:'', name:'', pid:'', addr:'', lat:'', lng:'', radius:100, expected:0, shift:'07:00', active:true, crew:{}}, d = ui.attDate || todayISO();
  const projs = Array.isArray(S.projects) ? S.projects : [];
  showModal(`<form class="modal wide" data-form="att-site" data-id="${x.id}"><h3>${s ? 'Sửa công trường' : 'Thêm công trường'}${closeBtn()}</h3>
    <div class="row2"><label class="field">Tên công trường *<input name="name" required value="${esc(x.name)}"></label><label class="field">Dự án<select name="pid">${opt([['', '— Không gắn —'], ...projs.map(p => [p.id, p.name])], x.pid)}</select></label></div>
    <label class="field">Địa chỉ<input name="addr" value="${esc(x.addr || '')}"></label>
    <div class="row3"><label class="field">Vĩ độ (lat)<input id="as-lat" name="lat" type="number" step="any" value="${x.lat ?? ''}"></label><label class="field">Kinh độ (lng)<input id="as-lng" name="lng" type="number" step="any" value="${x.lng ?? ''}"></label><label class="field">&nbsp;<button type="button" class="btn line" data-act="att-site-here">${ic('pin', 14)}Lấy vị trí hiện tại</button></label></div>
    <div class="row3"><label class="field">Bán kính cho phép (m)<input name="radius" type="number" min="20" step="10" value="${x.radius}"></label><label class="field">Quân số dự kiến<input name="expected" type="number" min="0" value="${x.expected}"></label><label class="field">Giờ vào ca<input name="shift" type="time" value="${esc(x.shift || '07:00')}"></label></div>
    <label class="field">Quân số tổ đội có mặt ngày ${fmtDate(d)} (công nhân không dùng app, chỉ huy báo)<input name="crew" type="number" min="0" value="${(x.crew || {})[d] || 0}"></label>
    <label class="row small"><input type="checkbox" name="active" value="1" ${x.active !== false ? 'checked' : ''}> Đang hoạt động</label>
    <div class="m-actions">${s ? delBtn('att_site') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu</button></div></form>`);
}
ACT['att-site-here'] = async () => { toast('Đang lấy vị trí…'); const p = await HR_locate(); if (!p) return toast('Không lấy được vị trí'); const a = $('#as-lat'), b = $('#as-lng'); if (a && b){ a.value = p.lat.toFixed(6); b.value = p.lng.toFixed(6); toast('Đã điền toạ độ (sai số ~' + Math.round(p.acc) + 'm)'); } };
FORM['att-site'] = (v, f) => {
  const d = ui.attDate || todayISO(), n = x => x === '' || x == null ? null : +x;
  let s = HR_sites().find(x => x.id === f.dataset.id);
  if (!s){ s = {id:'s' + uid(), crew:{}}; S.att_sites = S.att_sites || []; S.att_sites.push(s); }
  Object.assign(s, {name:v.name.trim(), pid:v.pid, addr:v.addr.trim(), lat:n(v.lat), lng:n(v.lng), radius:Math.max(20, +v.radius || 100), expected:Math.max(0, +v.expected || 0), shift:v.shift || '07:00', active:!!v.active});
  s.crew = s.crew || {}; s.crew[d] = Math.max(0, +v.crew || 0);
  closeModal(); render(); toast('Đã lưu công trường');
};
DEL.att_site = id => { S.att_sites = HR_sites().filter(s => s.id !== id); Object.keys(HR_roster()).forEach(p => { if (S.att_roster[p].site === id) delete S.att_roster[p]; }); };
// phân công chấm công (ai chấm ở đâu, giờ vào ca riêng)
ACT['att-roster'] = () => {
  const R = HR_roster();
  showModal(`<form class="modal wide" data-form="att-roster"><h3>Phân công chấm công${closeBtn()}</h3><div class="sub">Người được phân công sẽ hiện trong bảng ngày (kể cả khi chưa chấm công). Giờ vào ca trống = theo công trường; văn phòng thường 08:00.</div>
    <div class="table-wrap"><table><thead><tr><th>Nhân sự</th><th>Công trường</th><th>Giờ vào ca riêng</th><th></th></tr></thead><tbody>
    ${Object.entries(R).map(([p, r]) => `<tr><td><div class="who">${av(p, 24)}${esc(person(p).name)}</div></td><td><select class="hr-sel" name="site_${esc(p)}">${opt(HR_sites().map(s => [s.id, s.name]), r.site)}</select></td><td><input class="hr-sel" type="time" name="shift_${esc(p)}" value="${esc(r.shift || '')}"></td><td class="r"><label class="small"><input type="checkbox" name="rm" value="${esc(p)}"> Bỏ</label></td></tr>`).join('') || '<tr><td colspan="4" class="empty">Chưa phân công ai</td></tr>'}
    </tbody></table></div>
    <div class="row3"><label class="field">Thêm người<select name="np">${peopleOpts('', '— Chọn —')}</select></label><label class="field">Công trường<select name="ns">${opt(HR_sites().map(s => [s.id, s.name]))}</select></label><label class="field">Giờ vào ca riêng<input type="time" name="nsh"></label></div>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu phân công</button></div></form>`);
};
FORM['att-roster'] = v => {
  S.att_roster = S.att_roster || {};
  const rm = [].concat(v.rm || []);
  Object.keys(S.att_roster).forEach(p => { if (rm.includes(p)) return delete S.att_roster[p]; S.att_roster[p] = {site:v['site_' + p] || S.att_roster[p].site, shift:v['shift_' + p] || ''}; });
  if (v.np && v.ns) S.att_roster[v.np] = {site:v.ns, shift:v.nsh || ''};
  closeModal(); render(); toast('Đã lưu phân công chấm công');
};

/* ---------- Hồ sơ nhân sự ---------- */
function HR_staffView(edit){
  const St = hrStaff(), f = ui.hrF || 'all', q = (ui.hrQ || '').toLowerCase(), dp = ui.hrDept || '';
  const rows = St.filter(x => (f === 'all' || x.status === f) && (!dp || x.dept === dp) && (!q || (x.name + ' ' + x.title + ' ' + x.phone).toLowerCase().includes(q)));
  const yearAgo = addDays(todayISO(), -365), depts = [...new Set(HR_DEPTS.concat(St.map(x => x.dept).filter(Boolean)))];
  const leave = x => { if (!x.pid || x.status === 'left') return '—'; const b = hrLeaveBalance(x.pid); return b.total ? `${b.total - b.used}/${b.total}` : '—'; };
  return `<div class="stats">
      ${stat('Tổng nhân sự', St.length, 'Trên ' + new Set(St.map(x => x.dept).filter(Boolean)).size + ' phòng ban')}
      ${stat('Đang làm việc', St.filter(x => x.status === 'active').length, 'Chính thức', 'good')}
      ${stat('Thử việc', St.filter(x => x.status === 'probation').length, 'Đang trong kỳ đánh giá')}
      ${stat('Đã nghỉ việc', St.filter(x => x.status === 'left' && (!x.end || x.end >= yearAgo)).length, 'Trong 12 tháng qua')}
    </div>
    <div class="row" style="flex-wrap:wrap"><div class="search" style="flex:1;min-width:200px;max-width:320px">${ic('search', 15)}<input id="hr-q" data-input="hr-q" value="${esc(ui.hrQ || '')}" placeholder="Tìm tên, chức vụ, điện thoại" aria-label="Tìm nhân sự"></div>
      <select class="hr-sel" data-change="hr-dept" aria-label="Lọc phòng ban">${opt([['', 'Tất cả phòng ban'], ...depts.map(x => [x, x])], dp)}</select>
      <div class="toolbar">${[['all','Tất cả'], ...Object.entries(HR_ST).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button class="fchip sm ${f === k ? 'on' : ''}" data-act="hr-f" data-f="${k}">${l}</button>`).join('')}</div></div>
    ${St.length ? `<div class="table-wrap"><table><thead><tr><th>Họ tên</th><th>Chức vụ</th><th>Phòng ban</th><th>Điện thoại</th><th>Ngày vào làm</th><th class="r">Phép còn</th><th>Trạng thái</th></tr></thead><tbody>
      ${rows.map(x => `<tr class="${edit ? 'click' : ''}" ${edit ? `data-act="hr-edit" data-id="${x.id}" tabindex="0"` : ''}><td><div class="who">${HR_avatar(x.pid, x.name)}<b style="font-weight:500">${esc(x.name)}</b></div></td><td>${esc(x.title)}</td><td>${esc(x.dept)}</td><td class="num">${esc(x.phone)}</td><td>${x.start ? fmtFull(x.start) : '—'}</td><td class="r num">${leave(x)}</td><td>${pill(...(HR_ST[x.status] || HR_ST.active))}</td></tr>`).join('') || '<tr><td colspan="7" class="empty">Không có nhân sự phù hợp</td></tr>'}
    </tbody></table><div class="foot-note">Phép năm: ${HR_LEAVE_BASE} ngày/năm cho nhân viên chính thức, +1 ngày mỗi 5 năm thâm niên; đã trừ đơn nghỉ phép năm được duyệt ở Bàn làm việc.</div></div>`
    : emptyBox('Chưa có hồ sơ nhân sự', 'Thêm nhân sự để quản lý hồ sơ, ngày phép và bảng lương.', edit ? `<button class="btn" data-act="hr-new">${ic('plus', 15)}Thêm nhân sự</button>` : '')}`;
}
ACT['hr-f'] = (el, d) => { ui.hrF = d.f; render(); };
CHG['hr-dept'] = el => { ui.hrDept = el.value; render(); };
INP['hr-q'] = el => { ui.hrQ = el.value; render(); };
ACT['hr-new'] = () => HR_modal({id:'', name:'', title:'', dept:HR_DEPTS[0], phone:'', email:'', start:todayISO(), end:'', status:'probation', gross:0, pid:''});
ACT['hr-edit'] = (el, d) => { const x = hrStaff().find(s => s.id === d.id); if (x) HR_modal(x); };
function HR_modal(x){
  const b = x.pid ? hrLeaveBalance(x.pid) : null;
  showModal(`<form class="modal wide" data-form="hr" data-id="${x.id}"><h3>${x.id ? esc(x.name) : 'Thêm nhân sự'}${closeBtn()}</h3>
    ${b && b.total ? `<div class="sub">Phép năm ${todayISO().slice(0, 4)}: đã dùng ${b.used}/${b.total} ngày · còn ${b.total - b.used}</div>` : ''}
    <div class="row2"><label class="field">Họ tên *<input name="name" required value="${esc(x.name)}"></label><label class="field">Chức vụ<input name="title" value="${esc(x.title)}"></label></div>
    <div class="row3"><label class="field">Phòng ban<select name="dept">${opt([...new Set(HR_DEPTS.concat(x.dept ? [x.dept] : []))], x.dept)}</select></label><label class="field">Điện thoại<input name="phone" value="${esc(x.phone)}"></label><label class="field">Email<input name="email" type="email" value="${esc(x.email || '')}"></label></div>
    <div class="row3"><label class="field">Ngày vào làm<input name="start" type="date" value="${esc(x.start || '')}"></label><label class="field">Trạng thái<select name="status">${opt(Object.entries(HR_ST).map(([k, v]) => [k, v[0]]), x.status)}</select></label><label class="field">Ngày nghỉ việc (nếu có)<input name="end" type="date" value="${esc(x.end || '')}"></label></div>
    <div class="row2"><label class="field">Lương Gross (đồng/tháng)<input name="gross" type="number" min="0" step="100000" value="${+x.gross || 0}"></label><label class="field">Gắn với người trong workspace<select name="pid">${peopleOpts(x.pid, '— Không gắn —')}</select></label></div>
    <div class="m-actions">${x.id ? delBtn('hr_staff') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu</button></div></form>`);
}
FORM.hr = (v, f) => {
  const status = v.status, end = status === 'left' ? (v.end || todayISO()) : '';
  const data = {name:v.name.trim(), title:v.title.trim(), dept:v.dept, phone:v.phone.trim(), email:v.email.trim(), start:v.start, end, status, gross:Math.max(0, Math.round(+v.gross || 0)), pid:v.pid};
  if (!data.name) return toast('Nhập họ tên');
  S.hr_staff = S.hr_staff || [];
  const x = S.hr_staff.find(s => s.id === f.dataset.id);
  if (x) Object.assign(x, data); else { S.hr_staff.push({id:'h' + uid(), ...data}); log('Thêm nhân sự ' + data.name, 'green'); }
  closeModal(); render(); toast('Đã lưu hồ sơ nhân sự');
};
DEL.hr_staff = id => { S.hr_staff = hrStaff().filter(x => x.id !== id); };

/* ---------- Bảng lương ---------- */
const HR_per = () => ui.payPer || todayISO().slice(0, 7);
function HR_payRows(per){
  const [y, m] = per.split('-').map(Number), first = per + '-01', last = per + '-' + pad(new Date(y, m, 0).getDate());
  return hrStaff().filter(x => (!x.start || x.start <= last) && !(x.status === 'left' && (!x.end || x.end <= last)))
    .map(x => { const bh = Math.round(x.gross * HR_BH_RATE); return {x, gross:+x.gross || 0, bh, net:(+x.gross || 0) - bh}; })
    .sort((a, b) => b.gross - a.gross);
}
function HR_payView(edit){
  const per = HR_per(), paid = new Set((S.hr_pay || {})[per] || []), rows = HR_payRows(per);
  const [yy, mm] = per.split('-'), last = per + '-' + pad(new Date(+yy, +mm, 0).getDate());
  const g = sum(rows, r => r.gross), bh = sum(rows, r => r.bh), paidN = rows.filter(r => paid.has(r.x.id)).length;
  const leftIn = hrStaff().filter(x => x.status === 'left' && x.end && x.end >= per + '-01' && x.end <= last);
  return `<div class="row between" style="flex-wrap:wrap;gap:10px"><div class="row"><b>Kỳ lương hiện tại</b><input class="hr-sel" type="month" value="${per}" data-change="pay-per" aria-label="Kỳ lương">${pill('Tháng ' + (+mm) + '/' + yy, 'blue')}</div>
      <div class="row"><button class="btn line sm" data-act="pay-copy">${ic('copy', 13)}Sao chép bảng lương</button>${edit && rows.length ? `<button class="btn sm" data-act="pay-all">Đánh dấu tất cả đã trả</button>` : ''}</div></div>
    <div class="stats">
      ${stat('Tổng quỹ lương (Gross)', vnd(g), rows.length + ' nhân sự nhận lương kỳ này')}
      ${stat('Bảo hiểm NLĐ đóng', vnd(bh), 'BHXH 8% + BHYT 1.5% + BHTN 1%')}
      ${stat('Tổng thực nhận', vnd(g - bh), 'Sau khi trừ bảo hiểm')}
      ${stat('Đã chi trả', paidN + ' / ' + rows.length, rows.length - paidN ? (rows.length - paidN) + ' hồ sơ đang chờ chi trả' : 'Đã chi trả đủ', rows.length - paidN ? 'bad' : 'good')}
    </div>
    ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>Họ tên</th><th>Chức vụ</th><th class="r">Lương Gross</th><th class="r">BH (NLĐ 10.5%)</th><th class="r">Thực nhận</th><th>Trạng thái</th></tr></thead><tbody>
      ${rows.map(r => { const on = paid.has(r.x.id); return `<tr><td><b style="font-weight:500">${esc(r.x.name)}</b><div class="small muted">${esc(r.x.dept)}</div></td><td>${esc(r.x.title)}</td><td class="r num">${num(r.gross)}</td><td class="r num">${num(r.bh)}</td><td class="r b num">${num(r.net)}</td>
        <td>${edit ? `<button class="pill ${on ? 'green' : 'yellow'}" data-act="pay-toggle" data-id="${r.x.id}" title="Bấm để đổi trạng thái">${on ? 'Đã chi trả' : 'Chờ chi trả'}</button>` : pill(on ? 'Đã chi trả' : 'Chờ chi trả', on ? 'green' : 'yellow')}</td></tr>`; }).join('')}
    </tbody></table><div class="foot-note">${leftIn.map(x => `* ${esc(x.name)} (${esc(x.title)}) đã nghỉ việc trong kỳ — không nằm trong bảng lương tháng này.<br>`).join('')}Thực nhận = Gross − 10,5% bảo hiểm người lao động (căn cứ đóng = Gross); chưa trừ thuế TNCN, chưa cộng phụ cấp.</div></div>`
    : emptyBox('Kỳ này chưa có ai nhận lương', 'Thêm nhân sự ở tab Hồ sơ nhân sự (có lương Gross) để lập bảng lương.')}`;
}
CHG['pay-per'] = el => { if (el.value) ui.payPer = el.value; render(); };
ACT['pay-toggle'] = (el, d) => {
  if (perm('hr') !== 'edit') return;
  const per = HR_per(); S.hr_pay = S.hr_pay || {};
  const s = new Set(S.hr_pay[per] || []); s.has(d.id) ? s.delete(d.id) : s.add(d.id); S.hr_pay[per] = [...s]; render();
};
ACT['pay-all'] = () => {
  if (perm('hr') !== 'edit') return;
  const per = HR_per(); S.hr_pay = S.hr_pay || {};
  S.hr_pay[per] = HR_payRows(per).map(r => r.x.id); log('Đã chi trả lương kỳ ' + per, 'green'); render(); toast('Đã đánh dấu chi trả toàn bộ kỳ ' + per);
};
ACT['pay-copy'] = () => {
  const per = HR_per(), paid = new Set((S.hr_pay || {})[per] || []);
  const rows = [['Họ tên','Chức vụ','Phòng ban','Lương Gross','BHXH 8%','BHYT 1.5%','BHTN 1%','BH NLĐ 10.5%','Thực nhận','Trạng thái']]
    .concat(HR_payRows(per).map(r => [r.x.name, r.x.title, r.x.dept, r.gross, Math.round(r.gross * HR_BH.bhxh), Math.round(r.gross * HR_BH.bhyt), Math.round(r.gross * HR_BH.bhtn), r.bh, r.net, paid.has(r.x.id) ? 'Đã chi trả' : 'Chờ chi trả']));
  copyText(rows.map(r => r.join('\t')).join('\n'), 'Đã sao chép bảng lương kỳ ' + per + ' — dán vào Excel');
};

/* ================= tìm nhanh & trợ lý ================= */
SEARCH.push(hit => hrStaff().filter(x => perm('hr') !== 'none' && hit(x.name + ' ' + x.title)).slice(0, 5).map(x => ({icon:'users', label:x.name, sub:'HR · ' + x.title, run:() => { nav('att', 'staff'); if (perm('hr') === 'edit') HR_modal(x); }})));
SEARCH.push(hit => HR_sites().filter(s => perm('att') !== 'none' && hit(s.name)).slice(0, 3).map(s => ({icon:'pin', label:s.name, sub:'Chấm công · công trường', run:() => { ui.attSite = s.id; nav('att', 'day'); }})));
AI.push({re:/đi trễ|vắng|chưa chấm công|chấm công|nhân công|có mặt|ngoài vùng/, fn:() => {
  if (perm('att') === 'none' && perm('hr') === 'none') return 'Bạn chưa có quyền xem chấm công.';
  const t = todayISO(), a = attSummary(t), pend = attPending();
  const R = HR_roster(), late = [], none = [];
  Object.keys(R).forEach(p => { const r = HR_recOf(p, t), st = HR_state(r); if (st.k === 'late') late.push(`${esc(person(p).name)} — ${st.label.toLowerCase()}`); else if (st.k === 'none' && !HR_onLeave(p, t)) none.push(esc(person(p).name)); });
  return `Hôm nay có mặt <b>${num(a.present)}/${num(a.total)}</b> (${a.total ? Math.round(a.present / a.total * 100) : 0}%).`
    + (late.length ? ' Đi trễ:' + list(late) : ' Không ai đi trễ.') + (none.length ? ' Chưa chấm công: ' + none.join(', ') + '.' : '')
    + (pend.length ? ` <button class="link" data-act="nav" data-v="att" data-sub="approve">${pend.length} chấm công ngoài vùng chờ duyệt ›</button>` : '');
}});
AI.push({re:/lương|thử việc|hồ sơ nhân sự/, fn:() => {
  if (perm('hr') === 'none') return 'Bạn chưa có quyền xem hồ sơ & lương.';
  const per = HR_per(), rows = HR_payRows(per), paid = new Set((S.hr_pay || {})[per] || []), g = sum(rows, r => r.gross), bh = sum(rows, r => r.bh);
  const wait = rows.filter(r => !paid.has(r.x.id));
  return `Bảng lương kỳ ${per}: ${rows.length} nhân sự, Gross <b>${vnd(g)}</b>, BH NLĐ ${vnd(bh)}, thực nhận <b>${vnd(g - bh)}</b>. Đã chi ${rows.length - wait.length}/${rows.length}.` + (wait.length ? ' Chờ chi trả:' + list(wait.map(r => esc(r.x.name) + ' — ' + vnd(r.net))) : '') + `<button class="link" data-act="nav" data-v="att" data-sub="pay">Mở bảng lương ›</button>`;
}});
AI.push({re:/nghỉ phép|xin nghỉ|ngày phép/, fn:() => {
  const t = todayISO(), end = addDays(t, 6), who = allPeople().filter(p => HR_deskLeaves(p.id).some(l => l.to >= t && l.from <= end));
  const b = hrLeaveBalance(S.me);
  return (who.length ? 'Nghỉ phép trong 7 ngày tới:' + list(who.map(p => esc(p.name) + ' — ' + HR_deskLeaves(p.id).filter(l => l.to >= t && l.from <= end).map(l => fmtDate(l.from) + (l.to !== l.from ? '–' + fmtDate(l.to) : '')).join(', '))) : 'Tuần này chưa có ai được duyệt nghỉ phép.')
    + ` Phép năm của bạn: đã dùng ${b.used}/${b.total} ngày.`;
}});
