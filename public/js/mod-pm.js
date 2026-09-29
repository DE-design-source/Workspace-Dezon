/* Dezon Workspace — Quản lý dự án: Danh sách dự án · Thiết lập thi công (chung / sơ đồ tổ chức / thầu phụ / chi tiết & luồng dữ liệu) · Tiến độ (Gantt) · Nhiệm vụ. */

/* ================= hằng ================= */
const PM_DEPTS = [['general','Ban chỉ huy công trường'],['kinh-doanh','Kinh doanh'],['qs','QS'],['qldth','Quản lý dự án (Tiến độ)'],['hr','HR / Chấm công'],['tai-chinh','Tài chính']];
const PM_AUTO_DEPTS = ['chat','nhiem-vu']; // mọi thành viên dự án tự vào nhóm chat & thấy nhiệm vụ
const pmDeptLabel = k => (PM_DEPTS.find(d => d[0] === k) || PM_DEPTS[0])[1];
const PM_TEAMS = ['Đội thi công A','Đội thi công B','Đội thi công C'];
const PM_SUB_ST = {active:['Đang thi công','blue'], pending:['Chờ ký hợp đồng','orange'], done:['Hoàn thành','green']};
const PM_GST = {done:['Hoàn thành','green'], progress:['Đang thực hiện','yellow'], overdue:['Trễ hạn','red'], notstarted:['Chưa bắt đầu','gray']};
const PM_SETUP_TABS = [['setup','Thiết lập chung'],['orgchart','Sơ đồ tổ chức'],['subs','Thầu phụ'],['detail','Chi tiết & luồng dữ liệu']];
const PM_TABS = [['list','Danh sách dự án','projects'],['setup','Thiết lập thi công','projects'],['gantt','Tiến độ','pm'],['quest','Nhiệm vụ','pm']];
const pmTy = d => trd((+d || 0) / 1e6);                     // đồng → "8,50 tỷ" / "620tr"
const pmMoney = v => { const n = +String(v ?? '').replace(/[^\d]/g, ''); return n || 0; }; // "8.500.000.000" → 8500000000
function pmStatus(p){
  if (p.status === 'done') return ['Hoàn tất','green'];
  if (p.status === 'active') return ['Đang thi công','blue'];
  if (p.stage === 'thiet-ke') return ['Thiết kế','purple'];
  return ['Bản nháp','gray'];
}

/* ================= dữ liệu ================= */
// Chuẩn hoá (dữ liệu cũ lưu ngân sách theo triệu, thiếu members/subs…) — idempotent.
function pmNorm(p){
  if (!p) return p;
  if (p.budget > 0 && p.budget < 1e6) p.budget = Math.round(p.budget * 1e6);
  if (!Array.isArray(p.members)) p.members = [];
  if (!Array.isArray(p.subs)) p.subs = [];
  if (p.stage === undefined) p.stage = p.status === 'active' ? 'thi-cong' : '';
  if (!p.init) p.init = {};
  return p;
}
function pmNormGantt(g){
  Object.values(g || {}).forEach(phs => (phs || []).forEach(ph => { ph.members = ph.members || []; ph.tasks = ph.tasks || []; ph.tasks.forEach(t => { t.comments = t.comments || []; t.notes = t.notes || ''; t.progress = +t.progress || 0; }); }));
  return g;
}
syncCol('projects', 'array', () => S.projects, v => S.projects = (v || []).map(pmNorm), {read:['projects','pm','sales','fin','att','qs','po','mkt','prod'], write:['projects','sales'], empty:() => []});
syncCol('gantt', 'map', () => S.gantt, v => S.gantt = pmNormGantt(v || {}), {read:['pm','projects'], write:['pm','projects'], empty:() => ({})});
registerQuest('pm', {view:'pm', sub:'quest', perm:'pm', stepWord:'bước thi công', safety:true});

const pmAt = (hhmm, dayOff = 0) => { const d = today0(); d.setDate(d.getDate() + dayOff); const [h, m] = hhmm.split(':').map(Number); d.setHours(h, m, 0, 0); return d.getTime(); };
SEEDS.push(s => {
  ensurePeople(s, [
    {id:'vu-thi-dieu', name:'Vũ Thị Diệu', role:'An toàn lao động', team:'Ban chỉ huy', c:'orange'},
    {id:'tran-van-minh', name:'Trần Văn Minh', role:'Kỹ sư trưởng', team:'Kỹ thuật', c:'blue'},
    {id:'bui-minh-khue', name:'Bùi Minh Khuê', role:'Phòng QLCL', team:'Kỹ thuật', c:'purple'},
    {id:'trinh-anh-thu', name:'Trịnh Anh Thư', role:'Kiểm soát ngân sách', team:'Kế toán', c:'pink'}
  ]);
  const ALL_INIT = {qs:true, gantt:true, hr:true, fin:true, quest:true, chat:true};
  s.projects = [
    {id:'riverside', name:'Chung cư Riverside — Giai đoạn 2', client:'Công ty CP Đầu tư Riverside', contact:'Ông Nguyễn Văn Bình', phone:'0909 123 456', email:'contact@riverside-invest.vn', addr:'123 Nguyễn Hữu Cảnh, P.22, Bình Thạnh, TP.HCM', type:'Chung cư',
      budget:8500000000, contract:12000000000, progress:58, status:'active', stage:'thi-cong', start:md('2026-09-01'), end:md('2027-02-10'), pm:'ta', team:'Đội thi công A', safety:'vu-thi-dieu', purchase:'ct',
      note:'Khách yêu cầu báo cáo tiến độ hằng tuần vào thứ Hai.', leadId:'', hasData:true, setupAt:md('2026-09-01'), init:{...ALL_INIT},
      members:[{id:'ta', role:'PM công trường', dept:'general'}, {id:'da', role:'Chỉ huy trưởng', dept:'qldth'}, {id:'tl', role:'Tư vấn giám sát', dept:'qldth'}],
      subs:[
        {id:'sub1', name:'Công ty Cơ điện Phúc An', scope:'Thi công M&E (điện, nước, HVAC)', contact:'Anh Hùng', phone:'0909 456 789', value:1850000000, status:'active'},
        {id:'sub2', name:'Công ty Nhôm kính Sài Gòn', scope:'Cửa nhôm kính, vách mặt dựng', contact:'Chị Lan', phone:'0918 223 344', value:620000000, status:'active'},
        {id:'sub3', name:'Xưởng nội thất Gia Bảo', scope:'Nội thất, tủ bếp gỗ', contact:'Anh Bảo', phone:'0938 771 209', value:980000000, status:'pending'},
        {id:'sub4', name:'Công ty PCCC An Toàn Việt', scope:'Hệ thống phòng cháy chữa cháy', contact:'Anh Khoa', phone:'0912 556 880', value:340000000, status:'done'}
      ]},
    {id:'b12', name:'Nhà phố Lô B12 — KDC Bình Chánh', client:'Anh Quang Huy', contact:'Anh Quang Huy', phone:'', email:'', addr:'KDC Bình Chánh, TP.HCM', type:'Nhà phố',
      budget:2100000000, contract:2100000000, progress:27, status:'active', stage:'thi-cong', start:md('2026-08-15'), end:'', pm:'ta', team:'Đội thi công A', safety:'', purchase:'lt',
      note:'', leadId:'l15', hasData:false, setupAt:md('2026-08-15'), init:{...ALL_INIT}, members:[{id:'ta', role:'PM công trường', dept:'general'}], subs:[]},
    {id:'thaodien', name:'Biệt thự Song lập — Thảo Điền', client:'Chị Minh Thư', contact:'', phone:'', email:'', addr:'Thảo Điền, TP. Thủ Đức', type:'Biệt thự',
      budget:6800000000, contract:0, progress:0, status:'draft', stage:'', start:'', end:'', pm:'', team:'', safety:'', purchase:'',
      note:'Khách muốn khởi công sau Tết.', leadId:'', hasData:false, init:{}, members:[], subs:[]},
    {id:'q3', name:'Văn phòng cho thuê — Q3', client:'Cty TNHH ABC Logistics', contact:'', phone:'', email:'', addr:'Quận 3, TP.HCM', type:'Văn phòng',
      budget:4200000000, contract:4200000000, progress:100, status:'done', stage:'', start:md('2026-03-02'), end:md('2026-06-20'), pm:'ta', team:'Đội thi công C', safety:'', purchase:'ct',
      note:'', leadId:'l16', hasData:false, setupAt:md('2026-03-02'), init:{...ALL_INIT}, members:[{id:'ta', role:'PM công trường', dept:'general'}], subs:[]}
  ];
  // Gantt: T công việc · M mốc · F thu/chi (amount = triệu đồng, giữ tương thích dữ liệu cũ)
  const T = (id, name, a, b, progress, owner, crit) => ({id, name, start:md(a), end:md(b), progress, owner, crit:!!crit, notes:'', comments:[]});
  const M = (id, name, d, progress, owner = 'Ban chỉ huy công trường') => ({id, name, start:md(d), end:md(d), progress, owner, ms:true, crit:false, notes:'', comments:[]});
  const F = (id, name, d, kind, amount, owner) => ({id, name, start:md(d), end:md(d), progress:0, owner, money:kind, amount, ms:true, crit:false, notes:'', comments:[]});
  const P = (id, name, members, tasks) => ({id, name, members:members.map(([pid, role]) => ({id:pid, role})), tasks});
  const g = {
    riverside:[
      P('p1','Chuẩn bị & xin phép', [['tran-van-minh','Kỹ sư trưởng'], ['hoa','Pháp lý']], [
        T('t1','Khảo sát địa chất & hiện trạng','2026-08-01','2026-08-08',100,'Phòng kỹ thuật'),
        T('t2','Lập hồ sơ thiết kế cơ sở','2026-08-05','2026-08-20',100,'Tư vấn thiết kế',1),
        T('t3','Xin giấy phép xây dựng','2026-08-15','2026-09-01',100,'Bộ phận pháp lý',1),
        M('m1','Khởi công','2026-09-01',100)]),
      P('p2','Thi công phần móng', [['da','Chỉ huy trưởng'], ['pb','Đội thi công A'], ['tl','Tư vấn giám sát']], [
        T('t4','San lấp mặt bằng','2026-09-01','2026-09-08',100,'Đội thi công A'),
        T('t5','Ép cọc & gia cố nền','2026-09-05','2026-09-12',100,'Đội thi công A',1),
        T('t6','Đổ bê tông đài móng','2026-09-14','2026-09-28',45,'Đội thi công B',1),
        T('t7','Nghiệm thu phần móng','2026-09-26','2026-10-02',0,'Tư vấn giám sát',1)]),
      P('p3','Thi công phần thân (kết cấu)', [['da','Chỉ huy trưởng'], ['vn','Đội thi công B'], ['ts','Đội thi công C']], [
        T('t8','Đổ cột & vách tầng 1–5','2026-09-28','2026-10-20',0,'Đội thi công B',1),
        T('t9','Đổ sàn tầng 1–5','2026-10-10','2026-11-05',0,'Đội thi công B'),
        T('t10','Đổ cột & vách tầng 6–10','2026-11-05','2026-11-25',0,'Đội thi công C',1),
        T('t11','Đổ sàn tầng 6–10','2026-11-20','2026-12-15',0,'Đội thi công C'),
        M('m2','Cất nóc','2026-12-15',0)]),
      P('p4','Hoàn thiện & lắp đặt MEP', [['hb','Đội hoàn thiện'], ['nl','Đội MEP']], [
        T('t12','Xây tường bao che','2026-12-01','2026-12-20',0,'Đội hoàn thiện'),
        T('t13','Lắp đặt điện nước (MEP thô)','2026-12-10','2027-01-05',0,'Đội MEP',1),
        T('t14','Trát tường & sơn bả','2026-12-20','2027-01-15',0,'Đội hoàn thiện',1),
        T('t15','Lắp thiết bị vệ sinh & nội thất','2027-01-05','2027-01-25',0,'Đội hoàn thiện')]),
      P('p5','Nghiệm thu & bàn giao', [['tl','Tư vấn giám sát'], ['bui-minh-khue','Phòng QLCL']], [
        T('t16','Nghiệm thu PCCC','2027-01-20','2027-01-28',0,'Phòng QLCL'),
        T('t17','Nghiệm thu hoàn công','2027-01-25','2027-02-05',0,'Tư vấn giám sát',1),
        M('m3','Bàn giao dự án','2027-02-10',0)]),
      P('p6','Mua hàng & cung ứng', [['ct','Trưởng phòng mua hàng'], ['lt','Nhân viên cung ứng']], [
        T('pu1','Đặt hàng thép & xi măng','2026-08-20','2026-09-05',100,'Lý Thu Trang'),
        T('pu2','Nhập vật tư đợt 1 (móng)','2026-09-01','2026-09-10',100,'Lý Thu Trang',1),
        T('pu3','Đặt hàng thép kết cấu tầng cao','2026-09-20','2026-10-08',35,'Cao Nhật Tân',1),
        T('pu4','Đặt hàng thiết bị MEP','2026-10-15','2026-11-15',0,'Cao Nhật Tân'),
        T('pu5','Nhập vật tư hoàn thiện (sơn, gạch)','2026-12-01','2026-12-25',0,'Lý Thu Trang'),
        T('pu6','Nhập thiết bị nội thất & vệ sinh','2027-01-05','2027-01-20',0,'Lý Thu Trang')]),
      P('p7','Tài chính — dòng tiền', [['bn','Kế toán trưởng'], ['trinh-anh-thu','Kiểm soát ngân sách']], [
        F('f1','Thu tiền đợt 1 (30% hợp đồng)','2026-08-10','in',3600,'Phan Bảo Ngọc'),
        F('f2','Chi tạm ứng nhà thầu móng','2026-09-03','out',1200,'Trịnh Anh Thư'),
        F('f3','Chi mua vật tư đợt 1','2026-09-08','out',850,'Trịnh Anh Thư'),
        F('f4','Thu tiền đợt 2 (30% hợp đồng)','2026-10-05','in',3600,'Phan Bảo Ngọc'),
        F('f5','Chi thanh toán nhà thầu kết cấu','2026-11-20','out',2400,'Trịnh Anh Thư'),
        F('f6','Chi mua thiết bị MEP & hoàn thiện','2026-12-28','out',1800,'Trịnh Anh Thư'),
        F('f7','Thu tiền đợt 3 (30% hợp đồng)','2027-01-10','in',3600,'Phan Bảo Ngọc'),
        F('f8','Thu tiền đợt cuối & bàn giao (10%)','2027-02-12','in',1200,'Phan Bảo Ngọc')]),
      P('p8','Nhân sự & an toàn lao động', [['dp','Phụ trách nhân sự'], ['vu-thi-dieu','An toàn lao động']], [
        T('h1','Tuyển dụng bổ sung công nhân','2026-08-25','2026-09-10',100,'Đặng Hữu Phúc'),
        T('h2','Đào tạo an toàn lao động đầu dự án','2026-09-01','2026-09-05',100,'Vũ Thị Diệu',1),
        T('h3','Kiểm tra an toàn định kỳ — phần móng','2026-09-14','2026-09-20',70,'Vũ Thị Diệu'),
        T('h4','Kiểm tra an toàn định kỳ — kết cấu','2026-10-15','2026-10-20',0,'Vũ Thị Diệu'),
        T('h5','Huấn luyện PCCC & thoát hiểm','2026-11-01','2026-11-05',0,'Vũ Thị Diệu'),
        T('h6','Đánh giá an toàn trước nghiệm thu','2027-01-15','2027-01-22',0,'Vũ Thị Diệu',1)])
    ],
    b12:[
      P('bp1','Phần móng', [['lv','Tổ trưởng Đội thi công A'], ['tl','Tư vấn giám sát']], [
        T('b1','Định vị tim mốc & đào móng','2026-08-18','2026-08-25',100,'Đội thi công A'),
        T('b2','Đổ bê tông lót & cốt thép móng','2026-08-24','2026-09-05',100,'Đội thi công A',1),
        T('b3','Đổ bê tông móng','2026-09-06','2026-09-16',100,'Đội thi công A',1),
        T('b4','Xây tường móng & đà kiềng','2026-09-15','2026-09-27',40,'Đội thi công A')]),
      P('bp2','Phần thân', [['lv','Tổ trưởng Đội thi công A']], [
        T('b5','Cột & sàn tầng 1','2026-09-28','2026-10-15',0,'Đội thi công A',1),
        T('b6','Cột & sàn tầng 2–3','2026-10-15','2026-11-15',0,'Đội thi công A'),
        M('bm1','Cất nóc','2026-11-20',0)])
    ]
  };
  const t6 = g.riverside[1].tasks[2], t3 = g.riverside[0].tasks[2];
  t6.comments = [
    {by:'da', t:pmAt('08:02'), text:'Team chú ý tiến độ đài móng đang chậm, cần bổ sung nhân lực ca chiều.'},
    {by:'nh', t:pmAt('09:15'), text:'Dạ em đã yêu cầu thêm 2 nhân sự từ Đội thi công A, dự kiến bù kịp trong 2 ngày. @Lê Văn hỗ trợ điều phối giúp em.'},
    {by:'lv', t:pmAt('09:20'), text:'Vâng chị, em sắp xếp ngay ạ.'}];
  t3.comments = [{by:'hoa', t:pmAt('16:30', -1), text:'Hồ sơ xin phép đã nộp Sở Xây dựng, dự kiến có kết quả trong tuần. @Nguyễn Đức Anh anh xem giúp em bản vẽ đính kèm.'}];
  s.gantt = g;

  // Nhiệm vụ: quy trình 15 bước (Lô B12). who = mã người nhận điểm.
  const W = {'Phòng kỹ thuật':'tran-van-minh', 'Bộ phận pháp lý':'hoa', 'Đội thi công A':'lv', 'Đội thi công B':'nh', 'Đội thi công C':'ts', 'Vũ Thị Diệu':'vu-thi-dieu', 'Đỗ Thành Long':'tl', 'Đội MEP':'nl', 'Đội hoàn thiện':'hb', 'Ban chỉ huy công trường':'da'};
  const steps = [
    ['Khảo sát địa chất & hiện trạng', [['Khảo sát địa chất','Phòng kỹ thuật',20,1],['Đo đạc hiện trạng khu đất','Phòng kỹ thuật',20,1],['Lập báo cáo khảo sát','Phòng kỹ thuật',20,1]]],
    ['Xin giấy phép xây dựng', [['Soạn hồ sơ xin phép','Bộ phận pháp lý',20,1],['Nộp hồ sơ Sở Xây dựng','Bộ phận pháp lý',20,1],['Nhận giấy phép xây dựng','Bộ phận pháp lý',20,1]]],
    ['Chuẩn bị mặt bằng & rào chắn công trình', [['Dọn dẹp mặt bằng','Đội thi công A',20,1],['Dựng hàng rào tôn công trình','Đội thi công A',20,1],['Lắp biển báo an toàn','Vũ Thị Diệu',20,1]]],
    ['Ép cọc / gia cố nền móng', [['Tập kết cọc bê tông','Đội thi công A',30,1],['Ép cọc theo bản vẽ','Đội thi công A',30,1],['Nghiệm thu độ sâu ép cọc','Đỗ Thành Long',30,1]]],
    ['Đào đất, đổ bê tông lót móng', [['Đào đất hố móng theo bản vẽ','Đội thi công A',30,1],['Kiểm tra cao độ đáy móng','Đỗ Thành Long',30,1],['Đổ bê tông lót móng mác 100','Đội thi công A',30,0]]],
    ['Thi công đài móng, giằng móng', [['Lắp cốt thép đài móng','Đội thi công B',30],['Lắp cốp pha đài, giằng móng','Đội thi công B',30],['Đổ bê tông đài, giằng móng','Đội thi công B',30]]],
    ['Thi công cột, dầm, sàn tầng trệt', [['Lắp cốt thép cột, dầm, sàn','Đội thi công B',40],['Lắp cốp pha','Đội thi công B',40],['Đổ bê tông, bảo dưỡng','Đội thi công B',40]]],
    ['Xây tường bao tầng trệt', [['Xây tường 200 bao ngoài','Đội thi công A',30],['Xây tường 100 ngăn phòng','Đội thi công A',30]]],
    ['Thi công cột, dầm, sàn các tầng lầu', [['Lắp cốt thép cột, dầm, sàn các lầu','Đội thi công C',50],['Lắp cốp pha các lầu','Đội thi công C',50],['Đổ bê tông, bảo dưỡng các lầu','Đội thi công C',50]]],
    ['Xây tường bao các tầng lầu', [['Xây tường bao ngoài các lầu','Đội thi công A',45],['Xây tường ngăn phòng các lầu','Đội thi công A',45]]],
    ['Thi công mái', [['Lắp cốt thép, cốp pha sàn mái','Đội thi công C',40],['Đổ bê tông sàn mái / lợp mái','Đội thi công C',40],['Chống thấm sàn mái','Đội thi công C',40]]],
    ['Lắp đặt điện nước âm tường (M&E thô)', [['Đi ống điện âm tường, âm sàn','Đội MEP',40],['Đi ống cấp thoát nước âm tường','Đội MEP',40],['Nghiệm thu M&E thô trước khi tô trát','Đỗ Thành Long',40]]],
    ['Tô trát, chống thấm', [['Tô trát tường, trần toàn bộ căn nhà','Đội hoàn thiện',45],['Chống thấm WC, sân thượng, ban công','Đội hoàn thiện',45]]],
    ['Sơn bả, lát gạch, hoàn thiện nội thất', [['Sơn bả toàn bộ căn nhà','Đội hoàn thiện',50],['Lát gạch nền, ốp gạch WC','Đội hoàn thiện',50],['Lắp thiết bị vệ sinh, nội thất','Đội hoàn thiện',50]]],
    ['Nghiệm thu & bàn giao', [['Vệ sinh công nghiệp toàn bộ căn nhà','Đội hoàn thiện',30],['Nghiệm thu tổng thể với khách hàng','Đỗ Thành Long',35],['Bàn giao hồ sơ, chìa khoá','Ban chỉ huy công trường',35]]]
  ].map(([n, ts]) => [n, ts.map(([t, who, pts, done]) => [t, pts, W[who] || '', !!done])]);
  const pts = {lv:{week:180, total:1240, avail:1240}, nh:{week:150, total:1180, avail:680}, pb:{week:120, total:990, avail:690}, vn:{week:90, total:860, avail:860},
    ct:{week:70, total:740, avail:740}, lt:{week:60, total:690, avail:690}, dp:{week:40, total:520, avail:520}, hb:{week:30, total:480, avail:480}};
  const rewards = [
    {id:'r1', name:'Phiếu ăn trưa miễn phí (1 tuần)', pts:300, icon:'gift'},
    {id:'r2', name:'Áo đồng phục cao cấp', pts:500, icon:'star'},
    {id:'r3', name:'Voucher đổ xăng 200.000đ', pts:600, icon:'coin'},
    {id:'r4', name:'Bộ dụng cụ bảo hộ lao động cao cấp', pts:900, icon:'hardhat'},
    {id:'r5', name:'Ngày nghỉ phép thêm (1 ngày)', pts:1200, icon:'clock'},
    {id:'r6', name:'Thưởng tiền mặt 500.000đ', pts:2000, icon:'wallet'}];
  const redeems = [{who:'nh', reward:'Áo đồng phục cao cấp', pts:500, date:md('2026-09-18')}, {who:'pb', reward:'Phiếu ăn trưa miễn phí (1 tuần)', pts:300, date:md('2026-09-10')}];
  s.quest_pm = mkQuest('Quy trình thi công nhà phố — Lô B12', 'Đội thi công A', 'Trên 3 đội thi công', 'Quy trình nghiệm thu hoàn công', steps, pts, rewards, redeems, 18450 - 330);
  Object.assign(s.quest_pm, {player:'lv', streak:12, lastSafety:dayISO(-1), pid:'b12'});
  s.quest_pm.steps.forEach((st, i) => st.tasks.forEach(t => { if (t.done) t.date = dayISO(-Math.max(1, 14 - i * 3)); }));
});

/* ================= API dùng chung (module khác gọi) ================= */
const proj = id => pmNorm((S.projects || []).find(p => p.id === id));
const projName = id => (proj(id) || {}).name || '—';
const pmIsWork = t => !t.ms && !t.money;
const pmTasks = pid => ((S.gantt || {})[pid] || []).flatMap(ph => (ph.tasks || []).map(t => ({...t, phase:ph.name, phaseId:ph.id})));
function pmTStatus(t){
  const td = todayISO();
  if (t.money) return t.start <= td ? 'done' : 'notstarted';
  if (t.ms) return t.progress >= 100 ? 'done' : t.start < td ? 'overdue' : 'notstarted';
  if (t.progress >= 100) return 'done';
  if (t.end < td) return 'overdue';
  if (t.start <= td) return 'progress';
  return 'notstarted';
}
function pmPlanAt(pid, date){ // % kế hoạch theo thời lượng tới ngày date
  const ts = pmTasks(pid).filter(pmIsWork); let w = 0, v = 0;
  ts.forEach(t => { const dur = diffDays(t.start, t.end) + 1; w += dur; v += clamp((diffDays(t.start, date) + 1) / dur, 0, 1) * dur; });
  return w ? v / w * 100 : 0;
}
// actual = trung bình % của công việc (không tính mốc, thu/chi) — như thẻ "Tiến độ trung bình".
function ganttStats(pid){
  const ts = pmTasks(pid).filter(pmIsWork);
  if (!ts.length){ const p = proj(pid), v = p ? +p.progress || 0 : 0; return {actual:v, plan:v, count:0, late:0, done:0, progress:0, notstarted:0}; }
  const c = {}; ts.forEach(t => { const s = pmTStatus(t); c[s] = (c[s] || 0) + 1; });
  return {actual:Math.round(sum(ts, t => t.progress) / ts.length), plan:Math.round(pmPlanAt(pid, todayISO())), count:ts.length, late:c.overdue || 0, done:c.done || 0, progress:c.progress || 0, notstarted:c.notstarted || 0};
}
const ganttLate = pid => pmTasks(pid).filter(t => pmIsWork(t) && pmTStatus(t) === 'overdue').sort((a, b) => a.end.localeCompare(b.end));
const projProgress = p => p ? ganttStats(p.id).actual : 0;
function projMembers(pid, dept){
  const p = proj(pid); if (!p) return [];
  return !dept || PM_AUTO_DEPTS.includes(dept) ? p.members : p.members.filter(m => m.dept === dept);
}
// Kinh doanh gọi khi cơ hội vào/ra giai đoạn Dự án (Thiết kế / Thi công).
function syncLeadToProject(lead){
  if (!lead || !Array.isArray(S.projects)) return null;
  const st = lead.deleted ? '' : {design:'thiet-ke', 'thiet-ke':'thiet-ke', build:'thi-cong', 'thi-cong':'thi-cong'}[lead.stage] || '';
  let p = S.projects.find(x => x.leadId && x.leadId === lead.id) || (lead.projectId ? S.projects.find(x => x.id === lead.projectId) : null);
  if (p){ pmNorm(p); if (!p.leadId && !lead.deleted) p.leadId = lead.id; }
  if (!st){
    if (!p) return null;
    if (p.setupAt || (S.gantt && S.gantt[p.id] && S.gantt[p.id].length)){ // đã thiết lập: giữ hồ sơ, chỉ tách khỏi pipeline
      p.stage = ''; if (lead.deleted){ p.leadId = ''; p.fromSales = false; }
      log(`${p.name}: cơ hội rời giai đoạn Dự án — giữ hồ sơ đã thiết lập`, 'blue');
      return p;
    }
    S.projects = S.projects.filter(x => x !== p);
    if (S.pid === p.id) S.pid = (S.projects.find(x => x.status !== 'draft') || S.projects[0] || {}).id;
    lead.projectId = '';
    log(`Gỡ hồ sơ dự án ${p.name} (cơ hội rời giai đoạn Dự án)`, 'blue');
    return null;
  }
  let v = +lead.value || 0; if (v > 0 && v < 1e4) v = Math.round(v * 1e9); // dữ liệu cũ lưu theo tỷ
  const name = (lead.proj || '').trim() || lead.name || 'Dự án mới';
  const info = {client:lead.name || '', contact:lead.contact || lead.name || '', phone:lead.phone || '', email:lead.email || '', addr:lead.addr || ''};
  if (!p){
    p = pmNorm({id:'p' + uid(), name, ...info, type:lead.type || '—', budget:v, contract:v, progress:0, status:st === 'thi-cong' ? 'active' : 'draft', stage:st, start:'', end:'', pm:'', team:'', safety:'', purchase:'',
      note:lead.note || '', leadId:lead.id, fromSales:true, hasData:true, init:{}, subs:[], members:lead.owner ? [{id:lead.owner, role:'Phụ trách kinh doanh', dept:'kinh-doanh'}] : []});
    S.projects.push(p);
    log('Hồ sơ dự án mới từ Kinh doanh: ' + p.name, 'blue');
    if (typeof botPost === 'function') botPost('Hồ sơ dự án mới', `Cơ hội “${lead.name}” đã chuyển sang ${st === 'thi-cong' ? 'Dự án (Thi công)' : 'Dự án (Thiết kế)'}. Hồ sơ “${p.name}” đã có ở Quản lý dự án, chờ thiết lập thi công.`, 'green', 'Module Kinh doanh', 'pm', 'setup');
  } else {
    Object.keys(info).forEach(k => { if (info[k]) p[k] = info[k]; });
    if (!p.setupAt){ p.name = name; if (v) p.budget = p.contract = v; if (p.status !== 'done') p.status = st === 'thi-cong' ? 'active' : 'draft'; }
    p.stage = st;
  }
  lead.projectId = p.id;
  return p;
}

/* ================= khởi tạo module khác khi lưu thiết lập ================= */
function pmTemplate(p){
  const s = p.start || todayISO(), team = p.team || 'Đội thi công A';
  const T = (name, a, b, crit) => ({id:'t' + uid(), name, start:addDays(s, a), end:addDays(s, b), progress:0, owner:team, crit:!!crit, notes:'', comments:[]});
  const M = (name, d) => ({id:'m' + uid(), name, start:d, end:d, progress:0, owner:'Ban chỉ huy công trường', ms:true, crit:false, notes:'', comments:[]});
  const tpl = {
    'Nhà phố':[['Phần móng',[['Định vị & đào móng',0,6],['Bê tông lót & cốt thép móng',6,14,1],['Đổ bê tông móng',14,20,1]]],['Phần thân',[['Cột & sàn tầng 1',21,38,1],['Cột & sàn các tầng trên',38,70]]],['Hoàn thiện',[['Xây tô & chống thấm',70,95],['Ốp lát, sơn bả',95,120]]]],
    'Biệt thự':[['Chuẩn bị',[['Khảo sát & phá dỡ',0,10]]],['Kết cấu',[['Móng & tầng hầm',10,40,1],['Khung & sàn',40,90,1]]],['Hoàn thiện',[['MEP',80,130],['Nội thất & cảnh quan',120,180]]]],
    'Chung cư':[['Chuẩn bị',[['Chuẩn bị mặt bằng',0,14]]],['Phần móng',[['Ép cọc & gia cố nền',14,45,1],['Đài móng & tầng hầm',45,90,1]]],['Phần thân',[['Kết cấu các tầng',90,240,1]]],['Hoàn thiện & MEP',[['MEP',200,300],['Hoàn thiện',240,330,1]]]]
  }[p.type] || [['Chuẩn bị',[['Chuẩn bị mặt bằng',0,10]]],['Thi công chính',[['Kết cấu',10,60,1],['MEP',50,90]]],['Hoàn thiện',[['Hoàn thiện & vệ sinh',90,120]]]];
  const phases = tpl.map(([name, rows]) => ({id:'ph' + uid(), name, members:[], tasks:rows.map(([n, a, b, c]) => T(n, a, b, c))}));
  phases[0].tasks.unshift(M('Khởi công', s));
  const endD = phases.flatMap(ph => ph.tasks).map(t => t.end).sort().slice(-1)[0];
  phases[phases.length - 1].tasks.push(M('Bàn giao', p.end && p.end > endD ? p.end : addDays(endD, 3)));
  return phases;
}
function pmInitModules(p){
  const done = [], init = p.init = p.init || {};
  const tryIt = (key, label, fn) => { try { if (fn() !== false){ init[key] = true; done.push(label); } } catch (e){ console.error(e); } };
  if (!S.gantt) S.gantt = {};
  tryIt('gantt', 'Tiến độ', () => { if (!S.gantt[p.id] || !S.gantt[p.id].length) S.gantt[p.id] = pmTemplate(p); });
  if (!init.hr) tryIt('hr', 'Chấm công', () => typeof hrAddSite === 'function' ? (hrAddSite(p), true) : false);
  if (!init.fin) tryIt('fin', 'Tài chính', () => typeof finInitProject === 'function' ? (finInitProject(p), true) : false);
  tryIt('qs', 'QS', () => {
    if (!S.qs || !Array.isArray(S.qs.projects)) return false;
    if (!S.qs.projects.some(q => q.pid === p.id)) S.qs.projects.push({id:'q' + uid(), code:'QS-' + pad(S.qs.projects.length + 1), pid:p.id, name:p.name, client:p.client, phone:p.phone, addr:p.addr, created:todayISO(), status:'draft', quoted:false, rooms:[{id:uid(), name:'Hạng mục chung', items:[]}]});
  });
  tryIt('quest', 'Nhiệm vụ', () => { const q = typeof Q === 'function' ? Q('pm') : null; if (!q) return false; if (!q.pid) q.pid = p.id; });
  tryIt('chat', 'Chat', () => {
    const ids = [...new Set([S.me, p.pm, p.safety, p.purchase, ...p.members.map(m => m.id)].filter(Boolean))];
    const conv = (S.convs || []).find(c => c.pid === p.id);
    if (LIVE){ if (!conv && LIVE.createGroup) LIVE.createGroup(p.name, ids, p.id); return; }
    if (!Array.isArray(S.convs)) return false;
    if (conv) ids.forEach(id => { if (!conv.members.includes(id)) conv.members.push(id); });
    else S.convs.push({id:'g-' + p.id, type:'group', name:p.name, sub:'Nhóm dự án', icon:'building', c:'blue', members:ids, files:[], pid:p.id});
  });
  return done;
}
// thêm người vào nhóm chat dự án (demo; live dùng chức năng thêm thành viên của Chat)
function pmChatAdd(p, id){
  if (LIVE || !Array.isArray(S.convs)) return;
  const c = S.convs.find(x => x.pid === p.id);
  if (c && !c.members.includes(id)) c.members.push(id);
}

/* ================= trang ================= */
MOD.pm = () => {
  // giữ vị trí cuộn Gantt khi vẽ lại cùng dự án / cùng thang
  const g0 = $('#gantt'); ui.gPos = g0 ? [g0.scrollLeft, g0.scrollTop, g0.dataset.key] : null;
  if (!S.projects) S.projects = [];
  if (!S.gantt) S.gantt = {};
  if (S.sub.pm === 'detail'){ S.sub.pm = 'setup'; S.sub.pmSetup = 'detail'; }
  const tabsOk = PM_TABS.filter(t => perm(t[2]) !== 'none');
  let cur = sub('pm', 'list');
  if (!tabsOk.some(t => t[0] === cur)) cur = S.sub.pm = (tabsOk[0] || PM_TABS[0])[0];
  let act = '', body;
  if (cur === 'list'){ body = pmListView(); act = `<button class="btn" data-act="nav" data-v="sales">${ic('plus', 15)}Thêm cơ hội mới (Kinh doanh)</button>`; }
  else if (cur === 'setup') body = pmSetupView();
  else if (cur === 'gantt'){
    const p = proj(S.pid) || S.projects.find(x => S.gantt[x.id]) || S.projects[0];
    body = p ? pmGanttView(p) : emptyBox('Chưa có dự án', 'Dự án được tạo từ Kinh doanh, thiết lập thi công xong sẽ có tiến độ.', `<button class="btn" data-act="nav" data-v="sales">Mở Kinh doanh</button>`);
    if (p && S.gantt[p.id] && perm('pm') === 'edit') act = `<button class="btn" data-act="pm-tnew" data-pid="${p.id}">${ic('plus', 15)}Thêm công việc</button>`;
  } else body = questView('pm');
  return head('Quản lý dự án', 'Điểm khởi đầu — danh sách dự án, thiết lập thi công, tiến độ, nhiệm vụ & luồng dữ liệu trong một nơi', act) + subtabs('pm', tabsOk.map(t => [t[0], t[1]]), 'list') + body;
};

/* ---------- thành viên dự án ---------- */
function pmStack(p, dept, max = 3){
  const ms = projMembers(p.id, dept), edit = perm('projects') === 'edit';
  const preset = dept && !PM_AUTO_DEPTS.includes(dept) ? dept : '';
  return `<span class="mstack">${ms.slice(0, max).map(m => `<span title="${esc(person(m.id).name)} · ${esc(m.role)} · ${esc(pmDeptLabel(m.dept))}">${av(m.id, 26)}</span>`).join('')}${ms.length > max ? `<span class="av more" title="${ms.length - max} người khác">+${ms.length - max}</span>` : ''}${edit ? `<button class="av add" data-act="pm-mem" data-id="${p.id}" data-dept="${preset}" title="Thêm nhân sự${preset ? ' vào ' + esc(pmDeptLabel(preset)) : ''}" aria-label="Thêm nhân sự">${ic('plus', 13)}</button>` : ''}${!ms.length && !edit ? '<span class="small muted">Chưa gán</span>' : ''}</span>`;
}
function pmMemModal(pid, dept){
  const p = proj(pid); if (!p) return;
  showModal(`<form class="modal" data-form="pm-mem" data-id="${p.id}"><h3>Nhân sự tham gia — ${esc(p.name)}${closeBtn()}</h3>
    <div class="stack" style="gap:6px">${p.members.map((m, i) => `<div class="li" style="padding:8px 10px;background:var(--hover)">${av(m.id, 30)}<span class="ell"><b>${esc(person(m.id).name)}</b><small>${esc(m.role)} · ${esc(pmDeptLabel(m.dept))}</small></span><button type="button" class="icon-btn sm" style="margin-left:auto" data-act="pm-mem-del" data-id="${p.id}" data-i="${i}" aria-label="Bỏ khỏi dự án">${ic('x', 14)}</button></div>`).join('') || '<div class="empty" style="padding:12px">Chưa có nhân sự</div>'}</div>
    <div class="row2"><label class="field">Họ tên<select id="pmm-id" name="id" required>${peopleOpts('', '— Chọn nhân sự —')}</select></label><label class="field">Phòng ban trong dự án<select id="pmm-dept" name="dept">${opt(PM_DEPTS, dept || 'general')}</select></label></div>
    <label class="field">Vai trò<input id="pmm-role" name="role" placeholder="VD: Kỹ sư, Đội thi công..."></label>
    <div class="small muted">Mọi thành viên dự án tự có mặt trong nhóm Chat dự án và thấy Nhiệm vụ.</div>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Đóng</button><button class="btn" type="submit">${ic('plus', 14)}Thêm nhân sự</button></div></form>`);
}
ACT['pm-mem'] = (el, d) => pmMemModal(d.id, d.dept);
FORM['pm-mem'] = (v, f) => {
  const p = proj(f.dataset.id); if (!p) return;
  if (!v.id){ $('#pmm-id').focus(); return toast('Chọn nhân sự cần thêm'); }
  if (p.members.some(m => m.id === v.id && m.dept === v.dept)) return toast('Người này đã ở phòng ban đó');
  p.members.push({id:v.id, role:(v.role || '').trim() || 'Thành viên', dept:v.dept || 'general'});
  pmChatAdd(p, v.id);
  log(`Thêm ${person(v.id).name} vào ${p.name}`, 'blue'); render(); pmMemModal(p.id, v.dept);
};
ACT['pm-mem-del'] = (el, d) => {
  const p = proj(d.id); if (!p) return;
  const m = p.members.splice(+d.i, 1)[0];
  if (m) log(`Bỏ ${person(m.id).name} khỏi ${p.name}`, 'blue');
  render(); pmMemModal(p.id);
};

/* ---------- Danh sách dự án ---------- */
function pmListView(){
  const ps = S.projects.map(pmNorm), q = (ui.pmQ || '').trim().toLowerCase();
  const rows = ps.filter(p => !q || (p.name + ' ' + p.client).toLowerCase().includes(q));
  return `<div class="stats">
      ${stat('Tổng dự án', ps.length, ps.filter(p => p.fromSales).length ? ps.filter(p => p.fromSales).length + ' từ Kinh doanh' : '')}
      ${stat('Đang thi công', ps.filter(p => p.status === 'active').length, '')}
      ${stat('Bản nháp', ps.filter(p => p.status === 'draft').length, 'chờ thiết lập thi công')}
      ${stat('Tổng ngân sách quản lý', pmTy(sum(ps, p => p.budget)), 'gồm ngân sách dự kiến')}
    </div>
    <div class="toolbar"><label class="search" style="flex:1;max-width:380px">${ic('search', 16)}<input id="pm-q" data-input="pm-q" placeholder="Tìm dự án, khách hàng..." value="${esc(ui.pmQ || '')}" aria-label="Tìm dự án"></label></div>
    ${ps.length ? `<div class="table-wrap"><table><thead><tr><th>Dự án</th><th>Khách hàng</th><th>Loại hình</th><th class="r">Ngân sách</th><th style="width:170px">Tiến độ</th><th>Nhân sự</th><th>Trạng thái</th></tr></thead><tbody>
      ${rows.map(p => { const pr = projProgress(p); return `<tr class="click" data-act="pm-open" data-id="${p.id}" tabindex="0"><td class="b">${esc(p.name)}${p.fromSales ? '<span class="pm-tag">Từ Kinh doanh</span>' : ''}</td><td>${esc(p.client || '—')}</td><td>${esc(p.type || '—')}</td><td class="r">${pmTy(p.budget)}${p.status === 'draft' ? ' <span class="small muted">(dự kiến)</span>' : ''}</td><td><div class="row"><div style="flex:1">${bar(pr, 'var(--blue)')}</div><span class="small num">${pr}%</span></div></td><td>${pmStack(p)}</td><td>${pill(...pmStatus(p))}</td></tr>`; }).join('') || '<tr><td colspan="7" class="empty">Không có dự án phù hợp</td></tr>'}
    </tbody></table></div>` : emptyBox('Chưa có dự án', 'Dự án tự xuất hiện khi một cơ hội bên Kinh doanh chuyển vào cột “Dự án (Thiết kế)” hoặc “Dự án (Thi công)”.', `<button class="btn" data-act="nav" data-v="sales">Mở Kinh doanh</button>`)}`;
}
INP['pm-q'] = el => { ui.pmQ = el.value; render(); };
ACT['pm-open'] = (el, d) => {
  const p = proj(d.id); if (!p) return;
  S.sub.pm = 'setup';
  if (!p.setupAt && p.status !== 'done'){ ui.pmSetupPid = p.id; S.sub.pmSetup = 'setup'; }
  else { S.pid = p.id; S.sub.pmSetup = 'detail'; }
  render();
};

/* ---------- Thiết lập thi công ---------- */
function pmSetupView(){
  const st = sub('pmSetup', 'setup');
  const tabs = subtabs('pmSetup', PM_SETUP_TABS, 'setup');
  if (!S.projects.length) return tabs + emptyBox('Chưa có dự án', 'Dự án được tạo khi cơ hội bên Kinh doanh chuyển sang cột “Dự án (Thiết kế)” hoặc “Dự án (Thi công)”.', `<button class="btn" data-act="nav" data-v="sales">Mở Kinh doanh</button>`);
  if (st === 'setup') return tabs + pmSetupGeneral();
  const p = proj(S.pid) || proj(S.projects[0].id);
  const pick = `<label class="field" style="flex-direction:row;align-items:center;gap:10px"><span style="white-space:nowrap">Dự án</span><select data-change="pm-pid" style="min-width:260px" aria-label="Chuyển qua dự án khác">${opt(S.projects.map(x => [x.id, x.name]), p.id)}</select></label>`;
  if (st === 'orgchart') return tabs + pmOrgView(p, pick);
  if (st === 'subs') return tabs + pmSubsView(p, pick);
  return tabs + pmDetailView(p, pick);
}
CHG['pm-pid'] = el => { S.pid = el.value; render(); };
CHG['pm-setup-pid'] = el => { ui.pmSetupPid = el.value; render(); };

function pmSetupGeneral(){
  const cand = S.projects.filter(p => p.status !== 'done');
  const p = proj(ui.pmSetupPid) && proj(ui.pmSetupPid).status !== 'done' ? proj(ui.pmSetupPid) : cand.find(x => x.id === S.pid) || cand.find(x => !x.setupAt) || cand[0];
  const intro = `<div class="card pad small" style="background:var(--hover)">Việc tạo hồ sơ khách hàng mới nay thuộc mục <button class="link" data-act="nav" data-v="sales" style="text-decoration:underline">Kinh doanh</button>. Khi một cơ hội được chuyển vào cột “Dự án (Thiết kế)” hoặc “Dự án (Thi công)” ở đó, dự án sẽ tự xuất hiện bên dưới.</div>`;
  if (!p) return intro + emptyBox('Chưa có dự án cần thiết lập', 'Tất cả dự án đều đã hoàn tất.');
  const edit = perm('projects') === 'edit', lock = p.leadId ? 'readonly' : '';
  const ro = (id, name, label, val) => `<label class="field">${label}<input id="${id}" name="${name}" value="${esc(val || '')}" ${lock} placeholder="—"></label>`;
  const init = [['qs','ruler','QS','Tạo hồ sơ bóc tách trống'],['gantt','gantt','Tiến độ','Khung Gantt mẫu theo loại hình ' + (p.type || '')],['hr','userclock','Chấm công','Địa điểm công trường từ địa chỉ'],['fin','wallet','Tài chính','Ngân sách trống theo dự kiến'],['quest','trophy','Nhiệm vụ','Gán quy trình game hoá theo loại hình'],['chat','chat','Chat','Tạo nhóm chat dự án tự động']];
  return intro + `<form class="card pad stack" data-form="pm-setup" data-id="${p.id}" style="gap:14px">
      <h2 class="sec-title" style="margin:0">Thiết lập chung cho dự án ${p.setupAt ? pill('Đã thiết lập ' + fmtDate(p.setupAt), 'green') : ''}</h2>
      <label class="field">Chọn dự án cần thiết lập *<select id="st-pid" data-change="pm-setup-pid">${opt(cand.map(x => [x.id, x.name + ' · ' + pmStatus(x)[0]]), p.id)}</select></label>
      <div class="small" style="font-weight:600">Thông tin cơ bản — ${p.leadId ? 'lấy từ Kinh doanh' : 'hồ sơ dự án'}</div>
      <div class="row2">${ro('st-client', 'client', 'Tên chủ đầu tư', p.client)}${ro('st-contact', 'contact', 'Người liên hệ', p.contact)}</div>
      <div class="row2">${ro('st-email', 'email', 'Email', p.email)}${ro('st-phone', 'phone', 'Số điện thoại', p.phone)}</div>
      ${ro('st-addr', 'addr', 'Địa chỉ', p.addr)}
      <div class="small" style="font-weight:600">Thông tin quan trọng</div>
      <div class="row2"><label class="field">Ngày khởi công<input id="st-start" type="date" name="start" required value="${p.start || ''}"></label>
        <label class="field">Ngày hoàn công (dự kiến)<input id="st-end" type="date" name="end" value="${p.end || ''}"></label></div>
      <div class="row2"><label class="field">Giá trị hợp đồng (đ)<input id="st-contract" name="contract" inputmode="numeric" placeholder="VD: 8.500.000.000" value="${p.contract ? num(p.contract) : ''}"></label>
        <label class="field">Ngân sách được duyệt (đ)<input id="st-budget" name="budget" inputmode="numeric" placeholder="VD: 2.500.000.000" value="${p.budget ? num(p.budget) : ''}"></label></div>
      <label class="field">Ghi chú<textarea id="st-note" name="note" rows="3" placeholder="Yêu cầu đặc biệt từ khách hàng, lưu ý về mặt bằng...">${esc(p.note || '')}</textarea></label>
      <div class="stack" style="gap:8px"><b style="font-size:14px;font-weight:600">Sau khi lưu, dữ liệu vận hành sẽ được khởi tạo tới</b><span class="small muted">Không cần nhập lại thông tin khách hàng hay địa điểm ở từng module.</span>
        <div class="pm-init">${init.map(([k, i, n, what]) => { const ok = p.init && p.init[k]; return `<div><span class="sq" style="--c:${ok ? 'var(--green)' : 'var(--muted)'};--t:${ok ? 'var(--green-t)' : 'var(--chip)'};width:30px;height:30px;border-radius:9px">${ic(ok ? 'check' : i, 15)}</span><span><b style="font-weight:600;font-size:13px">${n}</b><small>${ok ? 'Đã khởi tạo' : what}</small></span></div>`; }).join('')}</div></div>
      ${edit ? `<div class="m-actions"><button type="button" class="btn ghost" data-act="sub" data-view="pm" data-k="list">Huỷ</button><button class="btn" type="submit">${ic('check', 15)}${p.setupAt ? 'Lưu thiết lập' : 'Lưu thiết lập & bắt đầu thi công'}</button></div>` : ''}
    </form>`;
}
FORM['pm-setup'] = (v, f) => {
  const p = proj(f.dataset.id); if (!p) return;
  if (!v.start){ $('#st-start').focus(); return toast('Chọn ngày khởi công'); }
  if (v.end && v.end < v.start) return toast('Ngày hoàn công phải sau ngày khởi công');
  if (!p.leadId) ['client','contact','email','phone','addr'].forEach(k => { if (v[k] !== undefined) p[k] = v[k].trim(); });
  const first = !p.setupAt;
  Object.assign(p, {start:v.start, end:v.end || '', note:(v.note || '').trim(), status:'active', stage:'thi-cong', hasData:true, setupAt:p.setupAt || todayISO()});
  if (pmMoney(v.contract)) p.contract = pmMoney(v.contract);
  if (pmMoney(v.budget)) p.budget = pmMoney(v.budget);
  const done = pmInitModules(p);
  if (first && typeof botPost === 'function') botPost('Dự án bắt đầu thi công', `${p.name} đã được thiết lập: PM ${p.pm ? person(p.pm).name : 'chưa gán'}, khởi công ${fmtFull(p.start)}. Đã khởi tạo ${done.join(', ') || 'dữ liệu vận hành'}.`, 'green', 'Module Quản lý dự án', 'pm', 'setup', 'g-' + p.id);
  log((first ? 'Thiết lập thi công ' : 'Cập nhật thiết lập ') + p.name, 'blue');
  S.pid = p.id; S.sub.pmSetup = first ? 'orgchart' : 'detail';
  render(); toast(first ? 'Đã lưu & khởi tạo: ' + (done.join(', ') || '—') + '. Tiếp theo: bổ nhiệm nhân sự.' : 'Đã lưu thiết lập');
};

function pmOrgView(p, pick){
  const edit = perm('projects') === 'edit';
  const node = (icon, c, label, field) => `<div class="card pad pm-node"><div class="row"><span class="sq" style="--c:${cv(c)};--t:${ct(c)}">${ic(icon, 17)}</span><b style="font-weight:600;font-size:13px">${label}</b></div>${field}</div>`;
  return `<form class="card pad stack" data-form="pm-org" data-id="${p.id}" style="gap:14px">
      <div class="row between" style="flex-wrap:wrap"><div><h2 class="sec-title" style="margin:0">Sơ đồ tổ chức dự án</h2><div class="small muted">Bổ nhiệm nhân sự phụ trách cho từng vai trò thi công.</div></div>${pick}</div>
      <fieldset ${edit ? '' : 'disabled'} class="pm-org">
        ${node('users', 'purple', 'Chỉ huy trưởng / PM công trường', `<select id="org-pm" name="pm" aria-label="PM công trường">${peopleOpts(p.pm, '— Chưa gán —')}</select>`)}
        <div class="kids">
          ${node('hardhat', 'blue', 'Đội thi công phụ trách', `<select id="org-team" name="team" aria-label="Đội thi công">${opt([['', '— Chưa gán —'], ...PM_TEAMS], p.team)}</select>`)}
          ${node('alert', 'orange', 'Giám sát an toàn lao động', `<select id="org-safety" name="safety" aria-label="Giám sát an toàn">${peopleOpts(p.safety, '— Chưa gán —')}</select>`)}
          ${node('cart', 'green', 'Phụ trách mua hàng & cung ứng', `<select id="org-purchase" name="purchase" aria-label="Phụ trách mua hàng">${peopleOpts(p.purchase, '— Chưa gán —')}</select>`)}
        </div>
      </fieldset>
      ${edit ? `<div class="m-actions"><button class="btn" type="submit">${ic('check', 15)}Lưu sơ đồ tổ chức</button></div>` : ''}
    </form>`;
}
FORM['pm-org'] = (v, f) => {
  const p = proj(f.dataset.id); if (!p) return;
  Object.assign(p, {pm:v.pm || '', team:v.team || '', safety:v.safety || '', purchase:v.purchase || ''});
  [[p.pm, 'PM công trường'], [p.safety, 'Giám sát an toàn lao động'], [p.purchase, 'Mua hàng & cung ứng']].forEach(([id, role]) => {
    if (id && !p.members.some(m => m.id === id)){ p.members.push({id, role, dept:'general'}); pmChatAdd(p, id); }
  });
  log('Cập nhật sơ đồ tổ chức ' + p.name, 'blue'); render(); toast('Đã lưu sơ đồ tổ chức');
};

function pmSubsView(p, pick){
  const edit = perm('projects') === 'edit';
  return `<div class="card pad row between" style="flex-wrap:wrap;gap:12px"><div><h2 class="sec-title" style="margin:0">Thầu phụ</h2><div class="small muted">Quản lý các nhà thầu phụ tham gia thi công dự án.</div></div>
      <div class="row" style="flex-wrap:wrap">${pick}${edit ? `<button class="btn" data-act="pm-sub" data-pid="${p.id}">${ic('plus', 15)}Thêm thầu phụ</button>` : ''}</div></div>
    ${p.subs.length ? `<div class="stats">${stat('Số thầu phụ', p.subs.length, p.subs.filter(s => s.status === 'pending').length + ' chờ ký hợp đồng')}${stat('Tổng giá trị hợp đồng', pmTy(sum(p.subs, s => s.value)), 'so với ngân sách ' + pmTy(p.budget))}${stat('Đang thi công', p.subs.filter(s => s.status === 'active').length, '')}</div>
    <div class="table-wrap"><table><thead><tr><th>Nhà thầu phụ</th><th>Hạng mục phụ trách</th><th>Người liên hệ</th><th>SĐT</th><th class="r">Giá trị hợp đồng</th><th>Trạng thái</th><th></th></tr></thead><tbody>
      ${p.subs.map(s => `<tr><td class="b">${esc(s.name)}</td><td>${esc(s.scope || 'Chưa xác định')}</td><td>${esc(s.contact || '—')}</td><td class="num">${esc(s.phone || '—')}</td><td class="r">${s.value ? vnd(s.value) : '—'}</td>
        <td>${edit ? `<select data-change="pm-sub-st" data-pid="${p.id}" data-id="${s.id}" aria-label="Trạng thái">${opt(Object.entries(PM_SUB_ST).map(([k, x]) => [k, x[0]]), s.status)}</select>` : pill(...(PM_SUB_ST[s.status] || PM_SUB_ST.pending))}</td>
        <td class="r">${edit ? `<button class="icon-btn sm" data-act="pm-sub" data-pid="${p.id}" data-id="${s.id}" aria-label="Sửa thầu phụ" title="Sửa">${ic('edit', 14)}</button>` : ''}</td></tr>`).join('')}
    </tbody></table></div>` : emptyBox('Chưa có thầu phụ', 'Thêm các nhà thầu phụ tham gia thi công dự án ' + esc(p.name) + '.', edit ? `<button class="btn" data-act="pm-sub" data-pid="${p.id}">${ic('plus', 15)}Thêm thầu phụ</button>` : '')}`;
}
ACT['pm-sub'] = (el, d) => {
  const p = proj(d.pid); if (!p) return;
  const s = p.subs.find(x => x.id === d.id), x = s || {id:'', name:'', scope:'', contact:'', phone:'', value:0, status:'pending'};
  showModal(`<form class="modal" data-form="pm-sub" data-pid="${p.id}" data-id="${x.id}"><h3>${s ? 'Sửa thầu phụ' : 'Thêm thầu phụ'}${closeBtn()}</h3><div class="sub">${s ? esc(p.name) : 'Bổ sung một nhà thầu phụ mới cho dự án.'}</div>
    <label class="field">Tên nhà thầu phụ *<input id="ps-name" name="name" required value="${esc(x.name)}" placeholder="VD: Công ty Cơ điện Phúc An"></label>
    <label class="field">Hạng mục phụ trách<input id="ps-scope" name="scope" value="${esc(x.scope)}" placeholder="VD: Thi công M&E"></label>
    <div class="row2"><label class="field">Người liên hệ<input id="ps-contact" name="contact" value="${esc(x.contact)}" placeholder="VD: Anh Hùng"></label><label class="field">Số điện thoại<input id="ps-phone" name="phone" type="tel" value="${esc(x.phone)}" placeholder="VD: 0909 xxx xxx"></label></div>
    <div class="row2"><label class="field">Giá trị hợp đồng (đ)<input id="ps-value" name="value" inputmode="numeric" value="${x.value ? num(x.value) : ''}" placeholder="VD: 850.000.000"></label>
      ${s ? `<label class="field">Trạng thái<select id="ps-status" name="status">${opt(Object.entries(PM_SUB_ST).map(([k, y]) => [k, y[0]]), x.status)}</select></label>` : '<span></span>'}</div>
    <div class="m-actions">${s ? delBtn('pm-sub') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">${s ? 'Lưu' : 'Thêm thầu phụ'}</button></div></form>`);
};
FORM['pm-sub'] = (v, f) => {
  const p = proj(f.dataset.pid); if (!p) return;
  const name = (v.name || '').trim();
  if (!name){ $('#ps-name').focus(); return toast('Vui lòng nhập tên nhà thầu phụ.'); }
  const data = {name, scope:(v.scope || '').trim(), contact:(v.contact || '').trim(), phone:(v.phone || '').trim(), value:pmMoney(v.value)};
  const s = p.subs.find(x => x.id === f.dataset.id);
  if (s) Object.assign(s, data, {status:v.status || s.status});
  else { p.subs.unshift({id:'s' + uid(), ...data, status:'pending'}); log(`Thêm thầu phụ ${name} — ${p.name}`, 'blue'); }
  closeModal(); render(); toast(s ? 'Đã lưu thầu phụ' : 'Đã thêm thầu phụ');
};
CHG['pm-sub-st'] = el => { const p = proj(el.dataset.pid), s = p && p.subs.find(x => x.id === el.dataset.id); if (s){ s.status = el.value; log(`${s.name}: ${PM_SUB_ST[s.status][0]}`, 'blue'); render(); } };
DEL['pm-sub'] = (id, f) => { const p = proj(f.dataset.pid); if (p) p.subs = p.subs.filter(x => x.id !== id); };

/* ---------- Chi tiết & luồng dữ liệu ---------- */
const pmTry = (fn, fb) => { try { return fn(); } catch (e){ console.error(e); return fb; } };
function pmDetailView(p, pick){
  const [stl, stc] = pmStatus(p);
  const demo = p.hasData === false ? pill('Dữ liệu minh hoạ', 'orange') : '';
  const lead = (S.leads || []).find(l => l.projectId === p.id || (p.leadId && l.id === p.leadId));
  const stageLbl = k => typeof leadStageLabel === 'function' ? leadStageLabel(k) : k;
  const g = ganttStats(p.id), hasG = !!(S.gantt[p.id] && S.gantt[p.id].length);
  const qsp = pmTry(() => S.qs && Array.isArray(S.qs.projects) ? S.qs.projects.filter(q => q.pid === p.id) : [], []);
  const qsSum = pmTry(() => typeof qsTotal === 'function' ? sum(qsp, q => qsTotal(q)) : 0, 0);
  const hr = pmTry(() => {
    if (typeof attSummary !== 'function') return null;
    const a = attSummary() || {}, sites = Array.isArray(a.sites) ? a.sites : [], mine = sites.filter(s => s.pid === p.id);
    if (mine.length && mine.some(s => s.cap != null || s.present != null)) return {present:sum(mine, s => s.present), total:sum(mine, s => s.cap), sites:mine.length};
    return {present:+a.present || 0, total:+a.total || 0, sites:Array.isArray(a.sites) ? a.sites.length : +a.sites || 0};
  }, null);
  const fin = pmTry(() => typeof finStats === 'function' ? finStats(p.id) : null, null);
  const conv = (S.convs || []).find(c => c.pid === p.id);
  const q = typeof Q === 'function' ? Q('pm') : null, qOk = q && q.steps;
  const qp = qOk ? questPts('pm') : [0, 0];
  const node = (dept, icon, c, name, big, small, go) => `<div class="card flow-card"><div class="row"><span class="sq" style="--c:${cv(c)};--t:${ct(c)}">${ic(icon, 17)}</span><b style="font-size:13.5px;font-weight:600">${name}</b></div>
      <div class="pm-sum"><b style="font-size:16px;color:var(--ink)">${big}</b><span>${small}</span></div>
      <div class="row between" style="margin-top:auto;flex-wrap:wrap">${pmStack(p, dept, 4)}${go || ''}</div></div>`;
  const link = (label, v, subk, extra = '') => `<button class="link" data-act="pm-flow" data-v="${v}" data-sub="${subk || ''}" data-pid="${p.id}" ${extra}>${label} ›</button>`;
  return `<div class="card pad stack">
      <div class="row between" style="flex-wrap:wrap;gap:12px;align-items:flex-start">
        <div style="min-width:0;flex:1"><div class="row" style="flex-wrap:wrap"><h2 style="margin:0;font-size:19px">${esc(p.name)}</h2>${pill(stl, stc)}${demo}</div>
          <div class="small muted" style="margin-top:4px">${esc(p.addr || '—')} · ${p.start ? (p.status === 'done' && p.end ? 'Bàn giao ' + fmtFull(p.end) : 'Khởi công ' + fmtFull(p.start)) : 'Chưa khởi công'}</div></div>
        ${pick}
      </div>
      <div class="row between" style="flex-wrap:wrap;gap:12px;border-top:1px solid var(--line);padding-top:12px">
        <div class="stack" style="gap:6px;min-width:0">
          <div class="small">Khách hàng: <b>${esc(p.client || '—')}</b> · Liên hệ: <b>${esc(p.contact || '—')}</b> · SĐT: ${esc(p.phone || '—')} · Email: ${esc(p.email || '—')}</div>
          <div class="row" style="flex-wrap:wrap"><span class="small muted">Nhân sự tham gia:</span>${pmStack(p, '', 8)}<span class="small muted">${p.members.length} người</span></div>
        </div>
        <div style="text-align:right"><b style="font-size:22px;font-weight:600" class="num">${pmTy(p.budget)}</b><div class="small muted">Ngân sách · PM: ${p.pm ? esc(person(p.pm).name) : 'Chưa gán'}</div>
          ${!p.setupAt && p.status !== 'done' && perm('projects') === 'edit' ? `<button class="btn sm" style="margin-top:6px" data-act="pm-setup-go" data-id="${p.id}">Thiết lập thi công</button>` : ''}</div>
      </div>
    </div>
    <div class="row between" style="flex-wrap:wrap"><h2 class="sec-title" style="margin:0">Sơ đồ phòng ban</h2><span class="small muted">Chat & Nhiệm vụ tự gồm mọi thành viên dự án</span></div>
    <div class="card pm-root"><span class="sq" style="--c:var(--purple);--t:var(--purple-t);width:40px;height:40px;border-radius:50%">${ic('building', 19)}</span><div><b style="font-weight:600">Dự án ${esc(p.name)}</b><div class="small muted">${p.members.length} nhân sự · ${esc(p.type || '—')}</div></div></div>
    <div class="flow">
      ${node('kinh-doanh', 'briefcase', 'orange', 'Kinh doanh', lead ? 'Giá trị ' + pmTy(lead.value) : 'Giá trị ' + pmTy(p.contract || p.budget), lead ? (['build','thi-cong','design','thiet-ke'].includes(lead.stage) ? 'Đã chốt từ pipeline · ' : '') + esc(stageLbl(lead.stage)) : 'Không gắn cơ hội Kinh doanh', link('Mở Kinh doanh', 'sales'))}
      ${node('qs', 'ruler', 'purple', 'QS', qsp.length + ' hồ sơ bóc tách', qsp.length ? (qsSum ? vnd(qsSum) + ' đã bóc tách' : 'Chưa có hạng mục bóc tách') : 'Chưa có hồ sơ QS', link('Mở QS', 'qs'))}
      ${node('qldth', 'gantt', 'blue', 'Thi công', hasG ? g.actual + '% hoàn thành' : (p.progress || 0) + '% hoàn thành', hasG ? g.count + ' công việc · ' + g.late + ' trễ hạn' : 'Chưa có khung tiến độ', link('Mở Thi công', 'pm', 'gantt'))}
      ${node('hr', 'userclock', 'green', 'HR', hr ? hr.present + '/' + hr.total + ' có mặt' : '—', hr ? hr.sites + ' địa điểm' : 'Chưa có dữ liệu chấm công', link('Mở HR', 'att'))}
      ${node('tai-chinh', 'wallet', 'yellow', 'Tài chính', fin ? 'Chi ' + pmTy(fin.spent) + ' / ' + pmTy(fin.budget || p.budget) : 'Ngân sách ' + pmTy(p.budget), fin ? (fin.overdue || []).length + ' hoá đơn quá hạn' : 'Chưa có dữ liệu tài chính', link('Mở Tài chính', 'fin'))}
      ${node('chat', 'chat', 'pink', 'Chat', conv ? 'Nhóm ' + esc(conv.name) : 'Chưa có nhóm chat', conv ? (conv.members || []).length + ' thành viên' : 'Tạo khi lưu thiết lập thi công', conv ? link('Mở nhóm chat', 'chat', '', `data-cv="${esc(conv.id)}"`) : '')}
      ${node('nhiem-vu', 'trophy', 'brown', 'Nhiệm vụ', qOk ? questDone('pm') + '/' + q.steps.length + ' bước' : '—', qOk ? num(qp[0]) + '/' + num(qp[1]) + ' điểm' + (q.pid && q.pid !== p.id ? ' · mẫu: ' + esc(projName(q.pid)) : '') : 'Chưa có quy trình', link('Mở Nhiệm vụ', 'pm', 'quest'))}
    </div>`;
}
ACT['pm-setup-go'] = (el, d) => { ui.pmSetupPid = d.id; S.sub.pm = 'setup'; S.sub.pmSetup = 'setup'; render(); };
ACT['pm-flow'] = (el, d) => {
  S.pid = d.pid;
  if (d.v === 'chat'){ if (d.cv) S.cv = d.cv; nav('chat'); return; }
  if (d.v === 'pm'){ S.sub.pm = d.sub || 'gantt'; if (d.sub === 'quest'){ ui.qtab = typeof ui.qtab === 'object' && ui.qtab ? ui.qtab : {}; ui.qtab.pm = 'overview'; } render(); return; }
  if (d.v === 'qs' && S.qs && Array.isArray(S.qs.projects)){ const x = S.qs.projects.find(y => y.pid === d.pid); if (x) S.qs.cur = x.id; }
  nav(d.v, d.sub || undefined);
};

/* ---------- Tiến độ (Gantt) ---------- */
function pmFind(pid, id){ for (const ph of (S.gantt || {})[pid] || []){ const t = ph.tasks.find(x => x.id === id); if (t) return {ph, t}; } return {}; }
const pmOwnerAv = o => { const p = o && personByName(o); return p ? av(p.id, 20) : `<span class="av" style="width:20px;height:20px;font-size:8px;background:var(--muted)">${esc(initials(o || '—'))}</span>`; };
function pmGanttView(p){
  const edit = perm('pm') === 'edit', phases = S.gantt[p.id] || [];
  const g = ganttStats(p.id), demo = p.hasData === false ? pill('Dữ liệu minh hoạ', 'orange') : '';
  const mq = (ui.pmMq || '').trim().toLowerCase();
  const menu = ui.pmMenu ? `<div class="pm-menu"><input id="pm-mq" data-input="pm-mq" placeholder="Tìm dự án..." value="${esc(ui.pmMq || '')}" aria-label="Tìm dự án"><div id="pm-mlist">${pmMenuList(p.id, mq)}</div></div>` : '';
  const C = 100.5, ring = `<div class="pm-ring"><svg width="44" height="44" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="none" stroke="var(--chip)" stroke-width="4"/><circle cx="20" cy="20" r="16" fill="none" stroke="var(--purple)" stroke-width="4" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${(C - C * g.actual / 100).toFixed(1)}"/></svg><div><b>${g.actual}%</b><small>Tổng tiến độ${g.count ? ' · KH ' + g.plan + '%' : ''}</small></div></div>`;
  const zoom = ui.gz === 'month' ? 'month' : 'week';
  const top = `<div class="card pad pm-gtop">
      <div class="pm-kick"><button class="pm-kicker" data-act="pm-menu" aria-haspopup="true" aria-expanded="${!!ui.pmMenu}">${esc(p.name.replace(/ — /g, ' / '))}${ic('chev', 13)}</button>
        <h2>Tiến độ ${demo}</h2>${menu}</div>
      ${ring}
      <label class="search" style="min-width:220px;flex:1;max-width:320px">${ic('search', 16)}<input id="pm-gq" data-input="pm-gq" placeholder="Tìm công việc, người phụ trách..." value="${esc(ui.gq || '')}" aria-label="Tìm công việc"></label>
      <div class="seg"><button class="${zoom === 'week' ? 'on' : ''}" data-act="pm-gz" data-z="week">Tuần</button><button class="${zoom === 'month' ? 'on' : ''}" data-act="pm-gz" data-z="month">Tháng</button></div>
      <button class="btn line sm" data-act="pm-gtoday">${ic('target', 14)}Về hôm nay</button>
    </div>`;
  if (!phases.length) return top + emptyBox('Dự án chưa có khung tiến độ', 'Lưu “Thiết lập thi công” hoặc tạo nhanh khung Gantt mẫu theo loại hình ' + esc(p.type || '') + '.', edit ? `<button class="btn" data-act="pm-gtpl" data-id="${p.id}">Tạo khung tiến độ mẫu</button>` : '');

  const stats = `<div class="stats">${stat('Tổng số công việc', g.count, 'không tính mốc & thu chi')}${stat('Đã hoàn thành', g.done, '', 'good')}${stat('Đang thực hiện', g.progress, '')}${stat('Trễ hạn', g.late, g.late ? 'cần xử lý' : 'không có', g.late ? 'bad' : '')}${stat('Tiến độ trung bình', g.actual + '%', 'kế hoạch tới hôm nay ' + g.plan + '%')}</div>`;
  const pf = phases.some(ph => ph.id === ui.pmPhase) ? ui.pmPhase : 'all';
  const chips = `<div class="toolbar"><span class="small muted">Lọc theo giai đoạn</span><button class="fchip sm ${pf === 'all' ? 'on' : ''}" data-act="pm-gph" data-ph="all">Tất cả</button>${phases.map(ph => `<button class="fchip sm ${pf === ph.id ? 'on' : ''}" data-act="pm-gph" data-ph="${ph.id}">${esc(ph.name)}</button>`).join('')}</div>
    ${legend([['var(--green)','Hoàn thành'],['var(--yellow)','Đang thực hiện'],['var(--red)','Trễ hạn'],['var(--gray)','Chưa bắt đầu'],['var(--purple)','Mốc quan trọng'],['var(--green)','↑ Thu tiền'],['var(--orange)','↓ Chi tiền']])}`;

  // phạm vi ngày
  const td = todayISO(), dw = zoom === 'week' ? 16 : 6;
  const all = phases.flatMap(ph => ph.tasks);
  const starts = all.map(t => t.start).concat(td).sort(), ends = all.map(t => t.end).concat(td).sort();
  const rs = addDays(starts[0], -6), re = addDays(ends[ends.length - 1], 8);
  const N = diffDays(rs, re) + 1, W = N * dw, X = d => diffDays(rs, d) * dw, tx = X(td);
  // tiêu đề tháng + tuần
  let hdr = '';
  for (let d = parseD(rs); iso(d) <= re; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)){
    const a = iso(d), nx = iso(new Date(d.getFullYear(), d.getMonth() + 1, 1)), b = nx > re ? addDays(re, 1) : nx;
    hdr += `<span class="g-month" style="left:${X(a)}px;width:${X(b) - X(a)}px;overflow:hidden">Th${d.getMonth() + 1} ${d.getFullYear()}</span>`;
  }
  const mon0 = addDays(rs, -((parseD(rs).getDay() + 6) % 7));
  for (let d = mon0; d <= re; d = addDays(d, 7)) if (X(d) >= 0) hdr += `<span class="g-week" style="left:${X(d)}px">${fmtDate(d)}</span>`;
  hdr += `<span class="pm-today-flag" style="left:${X(td) + dw / 2}px">Hôm nay · ${fmtFull(td)}</span>`;
  // lưới: cuối tuần tô nền, thứ Hai kẻ vạch
  let grid = '';
  for (let i = 0; i < N; i++){ const wd = parseD(addDays(rs, i)).getDay(); if (wd === 0 || wd === 6) grid += `<i style="left:${i * dw}px;width:${dw}px"></i>`; else if (wd === 1) grid += `<b style="left:${i * dw}px"></b>`; }

  const q = (ui.gq || '').trim().toLowerCase();
  const col = ui.pmCol || {};
  let rows = '';
  phases.filter(ph => pf === 'all' || ph.id === pf).forEach(ph => {
    const ts = ph.tasks.filter(t => !q || (t.name + ' ' + (t.owner || '')).toLowerCase().includes(q));
    if (!ts.length) return;
    const closed = !!col[ph.id], dn = ts.filter(t => pmTStatus(t) === 'done').length;
    const ps = ph.tasks.map(t => t.start).sort()[0], pe = ph.tasks.map(t => t.end).sort().slice(-1)[0];
    const mem = ph.members || [];
    rows += `<div class="g-row phase"><div class="g-left"><button class="pm-chev ${closed ? '' : 'open'}" data-act="pm-gcol" data-ph="${ph.id}" aria-label="${closed ? 'Mở rộng' : 'Thu gọn'} giai đoạn" aria-expanded="${!closed}">${ic('chev', 13)}</button>
        <span class="nm" data-act="pm-gcol" data-ph="${ph.id}">${esc(ph.name)}</span>
        <span class="mstack">${mem.slice(0, 4).map(m => `<span title="${esc(person(m.id).name)} — ${esc(m.role || '')}">${av(m.id, 22)}</span>`).join('')}${mem.length > 4 ? `<span class="av more" style="width:22px;height:22px" title="${mem.length - 4} người khác">+${mem.length - 4}</span>` : ''}${edit ? `<button class="av add" style="width:22px;height:22px" data-act="pm-phmem" data-pid="${p.id}" data-ph="${ph.id}" title="Thêm nhân sự" aria-label="Thêm nhân sự giai đoạn">${ic('plus', 11)}</button>` : ''}</span>
        <span class="pm-meta">${dn}/${ts.length}</span></div>
      <div class="g-right" style="width:${W}px"><span class="g-phase" style="left:${X(ps)}px;width:${X(pe) + dw - X(ps)}px"></span></div></div>`;
    if (closed) return;
    ts.forEach(t => {
      const st = pmTStatus(t), [stl, stc] = PM_GST[st];
      const pre = t.money ? (t.money === 'in' ? '↑ ' : '↓ ') : t.ms ? '◆ ' : '';
      const dur = t.money ? trd(t.amount) : t.ms ? fmtDate(t.start) : Math.max(1, diffDays(t.start, t.end) + 1) + 'd';
      const badge = t.money ? pill(t.money === 'in' ? 'Thu tiền' : 'Chi tiền', t.money === 'in' ? 'green' : 'orange') : pill(stl, stc);
      const cm = t.comments && t.comments.length;
      let mark;
      if (t.money) mark = `<span class="pm-money ${t.money}" style="left:${X(t.start)}px" title="${esc(t.name)} — ${trd(t.amount)}">${t.money === 'in' ? '↑' : '↓'} ${trd(t.amount)}</span>`;
      else if (t.ms) mark = `<span class="g-ms" style="left:${X(t.start) + dw / 2 - 8}px;background:${st === 'done' ? 'var(--green)' : st === 'overdue' ? 'var(--red)' : 'var(--purple)'}" title="${esc(t.name)}"></span><span class="g-lbl" style="left:${X(t.start) + dw / 2 + 12}px">${esc(t.name)} · ${fmtDate(t.start)}</span>`;
      else {
        const l = X(t.start), w = Math.max(dw, X(t.end) + dw - l);
        mark = `<span class="g-bar ${t.crit ? 'crit' : ''}" style="left:${l}px;width:${w}px;--c:${cv(stc)};--t:${ct(stc)}" title="${esc(t.name)} — ${t.progress}%"><i style="width:${clamp(t.progress, 0, 100)}%"></i></span><span class="g-lbl" style="left:${l + w + 6}px">${t.progress}%</span>${cm ? `<span class="pm-flag" style="left:${l + w + 42}px" title="Có bình luận — bấm để xem">${ic('chat', 11)}</span>` : ''}`;
      }
      rows += `<div class="g-row task ${ui.pmSel === t.id ? 'sel' : ''}" data-act="pm-gtask" data-id="${t.id}" tabindex="0" role="button" aria-label="${esc(t.name)}"><div class="g-left">
          ${t.crit ? '<span class="dot" style="--c:var(--red)" title="Đường găng"></span>' : ''}<span class="nm">${pre}${esc(t.name)}${cm ? ` <span class="pm-cm" title="Có bình luận">${ic('chat', 11)}${t.comments.length}</span>` : ''}</span>
          <span class="du">${dur}</span><span class="ow">${pmOwnerAv(t.owner)}<span class="ell">${esc(t.owner || '—')}</span></span><span class="stc">${badge}</span></div>
        <div class="g-right" style="width:${W}px">${mark}</div></div>`;
    });
  });
  return top + stats + chips + `<div class="gantt pm-gantt" id="gantt" data-tx="${tx}" data-key="${p.id}:${zoom}" style="--dw:${dw}px;--lw:500px"><div class="g-inner" style="width:calc(var(--lw) + ${W}px)">
      <div class="pm-grid" style="left:var(--lw);width:${W}px">${grid}</div>
      <div class="g-row head"><div class="g-left"><span class="nm">Công việc</span><span class="du">Thời lượng</span><span class="ow">Phụ trách</span><span class="stc">Trạng thái</span></div><div class="g-right" style="width:${W}px">${hdr}</div></div>
      ${rows || '<div class="empty">Không có công việc phù hợp bộ lọc / từ khoá</div>'}
      <div class="g-today" style="left:calc(var(--lw) + ${tx + dw / 2}px)"></div>
    </div></div>`;
}
function pmMenuList(curId, mq){
  const list = S.projects.filter(x => !mq || x.name.toLowerCase().includes(mq));
  return list.map(x => `<button class="it ${x.id === curId ? 'on' : ''}" data-act="pm-pick" data-id="${x.id}">${esc(x.name)}<small>${esc(x.type || '—')} · ${pmStatus(x)[0]}${S.gantt[x.id] ? '' : ' · chưa có tiến độ'}</small></button>`).join('') || '<div class="empty" style="padding:12px">Không tìm thấy dự án.</div>';
}
AFTER.pm = () => {
  const g = $('#gantt'); if (!g){ ui.gPos = null; return; }
  if (ui.gPos && ui.gPos[2] === g.dataset.key){ g.scrollLeft = ui.gPos[0]; g.scrollTop = ui.gPos[1]; }
  else g.scrollLeft = Math.max(0, +g.dataset.tx - 300);
  ui.gPos = null;
  if (ui.pmMenu){ const m = $('#pm-mq'); if (m && document.activeElement !== m) m.focus(); }
};
Object.assign(ACT, {
  'pm-menu':() => { ui.pmMenu = !ui.pmMenu; ui.pmMq = ''; render(); },
  'pm-pick':(el, d) => { S.pid = d.id; ui.pmMenu = false; ui.pmPhase = 'all'; ui.pmSel = null; render(); },
  'pm-gz':(el, d) => { ui.gz = d.z; render(); },
  'pm-gph':(el, d) => { ui.pmPhase = d.ph; render(); },
  'pm-gcol':(el, d) => { ui.pmCol = ui.pmCol || {}; ui.pmCol[d.ph] = !ui.pmCol[d.ph]; render(); },
  'pm-gtoday':() => { const g = $('#gantt'); if (!g) return; const lw = (g.querySelector('.g-left') || {}).offsetWidth || 0; g.scrollTo({left:Math.max(0, +g.dataset.tx - (g.clientWidth - lw) / 2), behavior:'smooth'}); },
  'pm-gtask':(el, d) => { ui.pmSel = d.id; render(); pmTaskModal(S.pid, d.id); },
  'pm-gopen':(el, d) => { S.pid = d.pid; S.sub.pm = 'gantt'; ui.pmSel = d.id; nav('pm'); pmTaskModal(d.pid, d.id); },
  'pm-tnew':(el, d) => pmTaskModal(d.pid || S.pid, '', 'task'),
  'pm-gtpl':(el, d) => { const p = proj(d.id); if (!p) return; S.gantt[p.id] = pmTemplate(p); p.init.gantt = true; log('Tạo khung tiến độ mẫu ' + p.name, 'purple'); render(); toast('Đã tạo khung tiến độ mẫu theo loại hình ' + (p.type || '')); }
});
INP['pm-gq'] = el => { ui.gq = el.value; render(); };
INP['pm-mq'] = el => { ui.pmMq = el.value; const l = $('#pm-mlist'); if (l) l.innerHTML = pmMenuList(S.pid, el.value.trim().toLowerCase()); };

/* phase members */
function pmPhMemModal(pid, phId){
  const ph = (S.gantt[pid] || []).find(x => x.id === phId); if (!ph) return;
  ph.members = ph.members || [];
  showModal(`<form class="modal" data-form="pm-phmem" data-pid="${pid}" data-ph="${ph.id}"><h3>Nhân sự tham gia — ${esc(ph.name)}${closeBtn()}</h3>
    <div class="chips">${ph.members.map((m, i) => `<span class="fchip">${av(m.id, 20)}${esc(person(m.id).name)}<small class="muted">${esc(m.role || '')}</small><button type="button" data-act="pm-phmem-del" data-pid="${pid}" data-ph="${ph.id}" data-i="${i}" aria-label="Bỏ ${esc(person(m.id).name)}">${ic('x', 12)}</button></span>`).join('') || '<span class="small muted">Chưa có nhân sự</span>'}</div>
    <div class="row2"><label class="field">Họ tên<select id="phm-id" name="id" required>${peopleOpts('', '— Chọn nhân sự —')}</select></label><label class="field">Vai trò<input id="phm-role" name="role" placeholder="Vai trò (VD: Kỹ sư, Đội thi công...)"></label></div>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Đóng</button><button class="btn" type="submit">${ic('plus', 14)}Thêm nhân sự</button></div></form>`);
}
ACT['pm-phmem'] = (el, d) => pmPhMemModal(d.pid, d.ph);
FORM['pm-phmem'] = (v, f) => {
  const ph = (S.gantt[f.dataset.pid] || []).find(x => x.id === f.dataset.ph); if (!ph) return;
  if (!v.id){ $('#phm-id').focus(); return toast('Chọn nhân sự cần thêm'); }
  if (ph.members.some(m => m.id === v.id)) return toast('Người này đã có trong giai đoạn');
  ph.members.push({id:v.id, role:(v.role || '').trim() || 'Thành viên'});
  render(); pmPhMemModal(f.dataset.pid, ph.id);
};
ACT['pm-phmem-del'] = (el, d) => { const ph = (S.gantt[d.pid] || []).find(x => x.id === d.ph); if (!ph) return; ph.members.splice(+d.i, 1); render(); pmPhMemModal(d.pid, d.ph); };

/* task drawer (modal) */
function pmAutoNote(t){
  if (t.money === 'in') return 'Khoản thu theo tiến độ hợp đồng, đối chiếu với phòng kế toán trước khi ghi nhận.';
  if (t.money === 'out') return 'Khoản chi phục vụ thi công/mua sắm, cần đối chiếu chứng từ và ngân sách còn lại.';
  return t.crit ? 'Công việc nằm trên đường găng — mọi chậm trễ sẽ ảnh hưởng trực tiếp đến ngày bàn giao dự án.' : 'Công việc có thời gian dự phòng, chưa ảnh hưởng đến tiến độ tổng thể nếu chậm nhẹ.';
}
const pmReEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function pmHi(text){ // tô sáng @Tên (đối chiếu danh bạ)
  const t = esc(text), names = [...new Set(allPeople().map(p => esc(p.name)))].sort((a, b) => b.length - a.length);
  return names.length ? t.replace(new RegExp('@(' + names.map(pmReEsc).join('|') + ')', 'gu'), '<b class="pm-mention">@$1</b>') : t;
}
const pmMentioned = text => allPeople().filter(p => text.includes('@' + p.name)).map(p => p.name);
function pmCmtTime(ts){
  if (Date.now() - ts < 6e4) return 'Vừa xong';
  const d = iso(new Date(ts)), n = diffDays(d, todayISO());
  return n === 0 ? hm(ts) : n === 1 ? 'Hôm qua ' + hm(ts) : fmtDate(d) + ' ' + hm(ts);
}
const pmCmtList = t => (t.comments || []).map(c => { const who = allPeople().some(p => p.id === c.by) ? c.by : ''; return `<div class="comment"><div class="row" style="gap:8px;margin-bottom:4px">${who ? av(who, 22) : `<span class="av" style="width:22px;height:22px;font-size:9px;background:var(--muted)">${esc(initials(c.by || '?'))}</span>`}<b style="font-size:12.5px">${esc(who ? person(who).name : c.by)}</b><small style="display:inline">${pmCmtTime(c.t)}</small></div>${pmHi(c.text)}</div>`; }).join('') || '<div class="small muted">Chưa có bình luận nào. Hãy là người đầu tiên trao đổi về công việc này.</div>';
function pmTaskModal(pid, id, newKind, keep){
  const r = pmFind(pid, id), isNew = !r.t, edit = perm('pm') === 'edit';
  if (!S.gantt[pid]) return;
  const t = r.t || {id:'', name:(keep && keep.name) || '', start:todayISO(), end:dayISO(7), progress:0, owner:(keep && keep.owner) || '', crit:false, notes:'', comments:[], amount:0,
    ms:newKind === 'ms' || newKind === 'in' || newKind === 'out', money:newKind === 'in' || newKind === 'out' ? newKind : undefined};
  const kind = t.money ? t.money : t.ms ? 'ms' : 'task';
  const st = pmTStatus(t), [stl, stc] = PM_GST[st];
  const dur = t.money ? 'Giao dịch' : t.ms ? 'Mốc thời gian' : (diffDays(t.start, t.end) + 1) + ' ngày';
  const owners = [...new Set(['Đội thi công A','Đội thi công B','Đội thi công C','Đội MEP','Đội hoàn thiện','Tư vấn giám sát','Ban chỉ huy công trường','Kế toán', ...allPeople().map(x => x.name)])];
  showModal(`<form class="modal wide" data-form="pm-task" data-pid="${pid}" data-id="${t.id}" data-kind="${kind}">
    <h3>${isNew ? 'Thêm công việc' : esc(t.name)}${closeBtn()}</h3>
    ${isNew ? `<label class="field">Loại<select id="gt-kind" data-change="pm-tkind">${opt([['task','Công việc'],['ms','Mốc quan trọng'],['in','Thu tiền'],['out','Chi tiền']], kind)}</select></label>` : `<div class="row" style="margin-top:-6px;flex-wrap:wrap">${r.ph ? pill(r.ph.name, 'gray') : ''}${t.money ? pill(t.money === 'in' ? 'Thu tiền' : 'Chi tiền', t.money === 'in' ? 'green' : 'orange') : pill(stl, stc)}${t.crit ? pill('Đường găng', 'red') : ''}${t.ms && !t.money ? pill('Mốc quan trọng', 'purple') : ''}</div>
    <div class="pm-info"><div><small>Bắt đầu</small><b>${fmtFull(t.start)}</b></div><div><small>Kết thúc</small><b>${fmtFull(t.end)}</b></div><div><small>Thời lượng</small><b>${dur}</b></div><div><small>Phụ trách</small><b>${esc(t.owner || '—')}</b></div>${t.money ? `<div><small>Số tiền</small><b style="color:${t.money === 'in' ? 'var(--green)' : 'var(--orange)'}">${t.money === 'in' ? '+ ' : '− '}${trd(t.amount)}</b></div>` : `<div><small>Tiến độ hoàn thành</small><b>${t.progress}%</b>${bar(t.progress, cv(stc))}</div>`}</div>`}
    <fieldset class="stack" style="border:0;padding:0;margin:0;gap:12px" ${edit ? '' : 'disabled'}>
      <div class="row2"><label class="field">Tên công việc *<input id="gt-name" name="name" required value="${esc(t.name)}"></label>
        <label class="field">Giai đoạn<select id="gt-phase" name="phase">${opt(S.gantt[pid].map(x => [x.id, x.name]), r.ph ? r.ph.id : (ui.pmPhase && ui.pmPhase !== 'all' ? ui.pmPhase : ''))}</select></label></div>
      <div class="row3"><label class="field">${kind === 'task' ? 'Bắt đầu' : 'Ngày'}<input id="gt-start" type="date" name="start" required value="${t.start}"></label>
        ${kind === 'task' ? `<label class="field">Kết thúc<input id="gt-end" type="date" name="end" required value="${t.end}"></label>` : t.money ? `<label class="field">Số tiền (triệu đồng)<input id="gt-amount" type="number" min="0" step="1" name="amount" value="${+t.amount || 0}"></label>` : '<span></span>'}
        <label class="field">Phụ trách<input id="gt-owner" name="owner" value="${esc(t.owner)}" list="pm-owners" placeholder="Người / đội phụ trách"></label></div>
      <datalist id="pm-owners">${owners.map(x => `<option value="${esc(x)}">`).join('')}</datalist>
      ${t.money ? '' : `<label class="field">Tiến độ hoàn thành: <b id="gt-pv" style="color:var(--ink)">${t.progress}%</b><input id="gt-progress" type="range" name="progress" min="0" max="100" step="5" value="${t.progress}" data-input="pm-pv"></label>`}
      ${kind === 'task' ? `<div class="checks"><label><input type="checkbox" name="crit" ${t.crit ? 'checked' : ''}>Thuộc đường găng</label></div>` : ''}
      <label class="field">Ghi chú<textarea id="gt-notes" name="notes" placeholder="Chưa có ghi chú cho công việc này.">${esc(t.notes || '')}</textarea></label>
    </fieldset>
    ${isNew ? '' : `<div class="small muted pm-note">${ic('info', 13)} ${pmAutoNote(t)}</div>`}
    ${isNew ? '' : `<div class="field">Bình luận (${t.comments.length})<div class="pm-cmts" id="pm-cmts">${pmCmtList(t)}</div>
      ${edit ? `<div class="pm-compose"><div id="pm-men" class="pm-men" hidden></div><textarea id="pm-cmt-in" data-input="pm-cmt" rows="1" placeholder="Viết bình luận... gõ @ để nhắc ai đó" aria-label="Viết bình luận"></textarea><button type="button" class="btn sm" data-act="pm-cmt-send" title="Gửi bình luận" aria-label="Gửi bình luận">${ic('arrow', 14)}</button></div><small class="muted">Enter để gửi · @ để nhắc nhân sự</small>` : ''}</div>`}
    <div class="m-actions">${!isNew && edit ? delBtn('pm-task') : ''}<button type="button" class="btn ghost" data-act="modal-close">${edit ? 'Huỷ' : 'Đóng'}</button>${edit ? `<button class="btn" type="submit">${isNew ? 'Thêm công việc' : 'Lưu thay đổi'}</button>` : ''}</div>
  </form>`);
  const c = $('#pm-cmts'); if (c) c.scrollTop = c.scrollHeight;
}
CHG['pm-tkind'] = el => { const f = el.form; pmTaskModal(f.dataset.pid, '', el.value, {name:f.elements.name.value, owner:f.elements.owner.value}); };
INP['pm-pv'] = el => { const b = $('#gt-pv'); if (b) b.textContent = el.value + '%'; };
FORM['pm-task'] = (v, f) => {
  const pid = f.dataset.pid, phases = S.gantt[pid]; if (!phases || !phases.length) return;
  const r = pmFind(pid, f.dataset.id), kind = f.dataset.kind;
  const target = phases.find(x => x.id === v.phase) || phases[0];
  const name = (v.name || '').trim(); if (!name){ $('#gt-name').focus(); return toast('Nhập tên công việc'); }
  const start = v.start || todayISO(), end = kind === 'task' ? (v.end && v.end >= start ? v.end : start) : start;
  const data = {name, start, end, owner:(v.owner || '').trim(), notes:(v.notes || '').trim()};
  if (kind !== 'in' && kind !== 'out') data.progress = clamp(+v.progress || 0, 0, 100);
  if (kind === 'task') data.crit = !!v.crit;
  if (kind === 'in' || kind === 'out') data.amount = Math.max(0, +v.amount || 0);
  const p = proj(pid);
  if (r.t){
    const before = r.t.progress;
    Object.assign(r.t, data);
    if (r.ph !== target){ r.ph.tasks = r.ph.tasks.filter(x => x !== r.t); target.tasks.push(r.t); }
    if (data.progress !== undefined && before !== data.progress) log(`${r.t.name}: ${before}% → ${data.progress}%`, 'purple');
    if (r.t.ms && !r.t.money && before < 100 && r.t.progress >= 100 && typeof botPost === 'function') botPost('Đạt mốc', `Mốc “${r.t.name}” đã hoàn thành.`, 'green', projName(pid), 'pm', 'gantt');
  } else {
    const t = {id:'t' + uid(), progress:0, crit:false, comments:[], ...data};
    if (kind !== 'task') t.ms = true;
    if (kind === 'in' || kind === 'out') t.money = kind;
    target.tasks.push(t); ui.pmSel = t.id;
    log('Thêm công việc ' + name + ' — ' + projName(pid), 'purple');
  }
  if (p) p.hasData = true;
  closeModal(); render(); toast('Đã lưu tiến độ');
};
DEL['pm-task'] = (id, f) => { const r = pmFind(f.dataset.pid, id); if (r.ph){ r.ph.tasks = r.ph.tasks.filter(x => x.id !== id); log('Xoá công việc ' + r.t.name, 'purple'); } };

/* bình luận + @nhắc tên */
function pmSendComment(){
  const inp = $('#pm-cmt-in'); if (!inp) return;
  const text = inp.value.trim(); if (!text) return;
  const f = inp.closest('form'), r = pmFind(f.dataset.pid, f.dataset.id); if (!r.t) return;
  r.t.comments = r.t.comments || [];
  r.t.comments.push({by:S.me, text, t:Date.now()});
  inp.value = ''; inp.style.height = ''; pmMenHide();
  const box = $('#pm-cmts'); box.innerHTML = pmCmtList(r.t); box.scrollTop = box.scrollHeight;
  const names = pmMentioned(text);
  log(`${person(S.me).name} bình luận “${r.t.name}”${names.length ? ' — nhắc ' + names.join(', ') : ''}`, 'purple');
  if (names.length) toast('Đã nhắc ' + names.join(', '));
  render(); inp.focus();
}
function pmMenDraw(){
  const m = ui.pmMen, box = $('#pm-men'); if (!box || !m) return;
  box.innerHTML = m.items.map((id, i) => `<button type="button" class="${i === m.i ? 'on' : ''}" data-act="pm-men-pick" data-i="${i}">${av(id, 22)}<span>${esc(person(id).name)}</span><small>${esc(person(id).role || person(id).team || '')}</small></button>`).join('');
  box.hidden = false;
}
function pmMenHide(){ ui.pmMen = null; const b = $('#pm-men'); if (b){ b.hidden = true; b.innerHTML = ''; } }
function pmMenUpdate(el){
  const before = el.value.slice(0, el.selectionStart), m = before.match(/(?:^|\s)@([\p{L}]*)$/u);
  if (!m) return pmMenHide();
  const q = m[1].toLowerCase(), items = allPeople().filter(p => p.name.toLowerCase().includes(q)).slice(0, 6).map(p => p.id);
  if (!items.length) return pmMenHide();
  ui.pmMen = {items, i:0, start:before.length - m[1].length - 1, end:el.selectionStart};
  pmMenDraw();
}
function pmMenPick(i){
  const m = ui.pmMen, el = $('#pm-cmt-in'); if (!m || !el || !m.items[i]) return;
  const ins = '@' + person(m.items[i]).name + ' ';
  el.value = el.value.slice(0, m.start) + ins + el.value.slice(m.end);
  const pos = m.start + ins.length;
  pmMenHide(); el.focus(); el.setSelectionRange(pos, pos);
}
INP['pm-cmt'] = el => { el.style.height = 'auto'; el.style.height = Math.min(90, el.scrollHeight) + 'px'; pmMenUpdate(el); };
ACT['pm-cmt-send'] = () => pmSendComment();
ACT['pm-men-pick'] = (el, d) => pmMenPick(+d.i);
// Bàn phím cho ô bình luận (chạy trước phím Esc đóng hộp thoại của lõi) + Enter trên dòng Gantt.
document.addEventListener('keydown', e => {
  const t = e.target;
  if (t && t.id === 'pm-cmt-in'){
    if (e.isComposing) return;
    const m = ui.pmMen, open = m && $('#pm-men') && !$('#pm-men').hidden;
    if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')){ e.preventDefault(); m.i = (m.i + (e.key === 'ArrowDown' ? 1 : -1) + m.items.length) % m.items.length; pmMenDraw(); return; }
    if (open && (e.key === 'Enter' || e.key === 'Tab')){ e.preventDefault(); pmMenPick(m.i); return; }
    if (open && e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); pmMenHide(); return; }
    if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); pmSendComment(); }
    return;
  }
  if (e.key === 'Enter' && t && t.matches && t.matches('.g-row.task')){ e.preventDefault(); t.click(); }
  if (e.key === 'Escape' && ui.pmMenu && $('#modal').hidden){ ui.pmMenu = false; render(); }
}, true);
// Bấm ra ngoài: đóng menu chọn dự án / gợi ý @tên.
document.addEventListener('click', e => {
  if (ui.pmMenu && !e.target.closest('.pm-menu, [data-act="pm-menu"]')){ ui.pmMenu = false; render(); }
  if (ui.pmMen && !e.target.closest('#pm-men, #pm-cmt-in')) pmMenHide();
});

/* ================= tìm nhanh & trợ lý ================= */
SEARCH.push(hit => (S.projects || []).filter(p => hit(p.name + ' ' + p.client)).map(p => ({icon:'building', label:p.name, sub:'Dự án · ' + pmStatus(p)[0], run:() => { S.pid = p.id; S.sub.pmSetup = 'detail'; nav('pm', 'setup'); }})));
SEARCH.push(hit => perm('pm') === 'none' ? [] : Object.entries(S.gantt || {}).flatMap(([pid, phs]) => (phs || []).flatMap(ph => ph.tasks.filter(t => hit(t.name + ' ' + (t.owner || ''))).map(t => ({icon:'gantt', label:t.name, sub:'Tiến độ · ' + projName(pid), run:() => ACT['pm-gopen'](null, {pid, id:t.id})})))));
AI.push({re:/(tạo|thêm)\s*(công\s*)?việc/, fn:q => {
  const m = q.match(/(?:tạo|thêm)\s*(?:công\s*)?việc\s*:?\s*(.+)/i);
  if (!m || !m[1].trim()) return 'Gõ theo mẫu: <i>Tạo công việc: Kiểm tra cốt thép sàn tầng 5</i>';
  if (perm('pm') !== 'edit') return 'Bạn chưa có quyền sửa tiến độ.';
  const phases = (S.gantt || {})[S.pid]; if (!phases || !phases.length) return 'Dự án đang chọn chưa có khung tiến độ.';
  const ph = phases.find(x => x.tasks.some(t => pmIsWork(t) && pmTStatus(t) !== 'done')) || phases[0];
  const t = {id:'t' + uid(), name:m[1].trim().slice(0, 120), start:todayISO(), end:dayISO(5), progress:0, owner:person(S.me).name, crit:false, notes:'Tạo bởi trợ lý', comments:[]};
  ph.tasks.push(t); log('Trợ lý tạo công việc ' + t.name, 'purple');
  return `Đã thêm <b>${esc(t.name)}</b> vào giai đoạn “${esc(ph.name)}” (${fmtDate(t.start)}–${fmtDate(t.end)}). <button class="link" data-act="pm-gopen" data-pid="${S.pid}" data-id="${t.id}">Mở để chỉnh</button>`;
}});
AI.push({re:/trễ|tiến độ|tien do|gantt|chậm|dự án/, fn:() => {
  const p = proj(S.pid) || (S.projects || [])[0]; if (!p) return 'Chưa có dự án nào.';
  const g = ganttStats(p.id), l = ganttLate(p.id);
  return `<b>${esc(p.name)}</b>: trung bình ${g.actual}% (kế hoạch tới hôm nay ${g.plan}%), ${g.count} công việc.` + (l.length ? ` Có ${l.length} hạng mục trễ:` + list(l.map(t => `<button class="link" data-act="pm-gopen" data-pid="${p.id}" data-id="${t.id}">${esc(t.name)}</button> — ${esc(t.owner || '')}, ${t.progress}%, trễ ${-daysLeft(t.end)} ngày${t.crit ? ' <b>(đường găng)</b>' : ''}`)) : ' Không có hạng mục trễ.');
}});
AI.push({re:/điểm|thưởng|quà|xếp hạng|nhiệm vụ|quy trình/, fn:() => {
  const q = typeof Q === 'function' ? Q('pm') : null; if (!q || !q.steps) return '';
  const r = Object.entries(q.pts || {}).sort((a, b) => b[1].week - a[1].week).slice(0, 3), [got, tot] = questPts('pm');
  return `Quy trình <b>${esc(q.name)}</b>: ${questDone('pm')}/${q.steps.length} bước, ${num(got)}/${num(tot)} điểm. Dẫn đầu tuần:` + list(r.map(([id, v]) => `${esc(person(id).name)} — ${num(v.week)} điểm`)) + `Chuỗi an toàn lao động: ${q.streak || 0} ngày. <button class="link" data-act="nav" data-v="pm" data-sub="quest">Mở Nhiệm vụ ›</button>`;
}});
