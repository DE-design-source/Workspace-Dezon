/* SiteFlow — Tổng quan, Kinh doanh, Dự án, Chat */

/* ================= dữ liệu mẫu ================= */
const at = (hhmm, dayOff = 0) => { const d = today0(); d.setDate(d.getDate() + dayOff); const [h, m] = hhmm.split(':').map(Number); d.setHours(h, m, 0, 0); return d.getTime(); };
SEEDS.push(s => {
  s.projects = [
    {id:'riverside', name:'Chung cư Riverside — Giai đoạn 2', client:'Công ty CP Đầu tư Riverside', contact:'Ông Nguyễn Văn Bình', phone:'0909 123 456', email:'contact@riverside-invest.vn', addr:'Khu đô thị Riverside, Quận 7, TP.HCM', type:'Chung cư', budget:8500, progress:58, pm:'ta', team:'Đội thi công A', safety:'tl', purchase:'ct', start:md('2026-09-01'), status:'active', note:'Khách yêu cầu báo cáo tiến độ hằng tuần vào thứ Hai.', leadId:'l8'},
    {id:'b12', name:'Nhà phố Lô B12 — KDC Bình Chánh', client:'Anh Quang Huy', contact:'Anh Quang Huy', phone:'0938 456 789', email:'quanghuy@example.com', addr:'Lô B12, KDC Bình Chánh, TP.HCM', type:'Nhà phố', budget:2100, progress:27, pm:'ta', team:'Đội thi công A', safety:'tl', purchase:'lt', start:md('2026-08-18'), status:'active', note:'', leadId:'l7'},
    {id:'thaodien', name:'Biệt thự Song lập — Thảo Điền', client:'Chị Minh Thư', contact:'Chị Minh Thư', phone:'0912 887 234', email:'minhthu@example.com', addr:'Đường số 10, Thảo Điền, TP. Thủ Đức', type:'Biệt thự', budget:6800, progress:0, pm:'', team:'', safety:'', purchase:'', start:'', status:'draft', note:'Khách muốn khởi công sau Tết.', leadId:'l3'},
    {id:'q3', name:'Văn phòng cho thuê — Q3', client:'Cty TNHH ABC Logistics', contact:'Chị Thu', phone:'028 3930 1122', email:'admin@abclogistics.example', addr:'Võ Văn Tần, Quận 3, TP.HCM', type:'Văn phòng', budget:4200, progress:100, pm:'ta', team:'Đội thi công C', safety:'tl', purchase:'ct', start:md('2026-03-02'), status:'done', note:'', leadId:'l9'}
  ];
  const L = (id, name, proj, phone, type, value, stage, upd, extra = {}) => ({id, name, proj, phone, email:'', source:'Giới thiệu', addr:'', type, scale:'', interests:['Xây dựng thô'], value, stage, owner:'ta', updated:md(upd), note:'', concept:'', boq:'', projectId:'', ...extra});
  s.leads = [
    L('l1','BQL Riverside','Mở rộng Giai đoạn 3','0909 123 456','Chung cư',15.0,'nego','2026-09-20',{source:'Khách cũ', interests:['Xây dựng thô','Hoàn thiện nội thất']}),
    L('l2','Chị Hải Yến','Biệt thự Nhà Bè','0918 345 221','Biệt thự',7.2,'nego','2026-09-19',{source:'Website'}),
    L('l3','Chị Minh Thư','Biệt thự Song lập Thảo Điền','0912 887 234','Biệt thự',6.8,'design','2026-09-17',{projectId:'thaodien', interests:['Thiết kế kiến trúc','Xây dựng thô']}),
    L('l4','Cty Đông Dương','Văn phòng 5 tầng','028 3822 4410','Văn phòng',5.5,'quote','2026-09-15',{source:'Sự kiện'}),
    L('l5','Chị Bích Ngọc','Biệt thự Phú Mỹ Hưng','0938 556 771','Biệt thự',6.0,'consult','2026-09-12',{source:'Mạng xã hội'}),
    L('l6','Chị Lan Anh','Biệt thự Quận 2','0977 224 890','Biệt thự',5.2,'lead','2026-09-08'),
    L('l7','Anh Quang Huy','Nhà phố Lô B12','0938 456 789','Nhà phố',2.1,'build','2026-08-10',{projectId:'b12'}),
    L('l8','Công ty CP Đầu tư Riverside','Chung cư Riverside GĐ2','0909 123 456','Chung cư',8.5,'build','2026-08-25',{projectId:'riverside'}),
    L('l9','Cty TNHH ABC Logistics','Văn phòng cho thuê Q3','028 3930 1122','Văn phòng',4.2,'build','2026-02-20',{projectId:'q3'}),
    L('l10','Anh Phong','Shophouse Vạn Phúc','0903 771 245','Nhà phố',4.8,'quote','2026-09-18',{source:'Website'}),
    L('l11','Anh Dũng','Nhà xưởng Long An','0913 208 664','Khác',3.6,'signed','2026-09-16'),
    L('l12','Chị Mai','Căn hộ Sunrise City','0909 882 017','Chung cư',1.4,'consult','2026-09-14',{interests:['Hoàn thiện nội thất']}),
    L('l13','Anh Tùng','Nhà phố Thủ Đức','0935 640 118','Nhà phố',3.1,'lead','2026-09-20',{source:'Mạng xã hội'}),
    L('l14','Café Hạt Mộc','Cải tạo quán Q10','0906 155 390','Khác',0.9,'lead','2026-09-18')
  ];
  const G = (id, name, sub, icon, c, members, extra = {}) => ({id, type:'group', name, sub, icon, c, members, files:[], ...extra});
  s.convs = [
    G('g-riverside','Riverside — Giai đoạn 2','Nhóm dự án','building','blue',['da','nh','hoa','lv','ta','tl','ct'],{pid:'riverside', files:[{name:'Ban_ve_dien_tang2.pdf', size:'2.4 MB'},{name:'Bao_cao_tien_do_T9.xlsx', size:'860 KB'}]}),
    {id:'bot', type:'bot', name:'SiteFlow Bot', sub:'Thông báo hệ thống', icon:'bot', c:'gray', members:[], files:[]},
    {id:'dm-nh', type:'dm', user:'nh', members:['nh','ta'], files:[]},
    {id:'dm-bn', type:'dm', user:'bn', members:['bn','ta'], files:[]},
    G('g-bch','Ban chỉ huy công trường','8 thành viên','hardhat','green',['da','tl','ta','lv','nh','ts']),
    G('g-b12','Nhà phố Lô B12','Nhóm dự án','building','yellow',['lv','pb','ta','lt'],{pid:'b12'}),
    {id:'dm-da', type:'dm', user:'da', members:['da','ta'], files:[]},
    G('g-office','Văn phòng công ty','Thông báo chung','users','purple',['ta','dp','bn','ct','lt','hoa'])
  ];
  const M = (cv, from, text, t, extra = {}) => ({id:uid(), cv, from, text, t, ...extra});
  s.msgs = [
    M('g-riverside','da','Chào cả nhà, hôm nay mình tập trung đổ bê tông đài móng khu B nhé',at('08:02')),
    M('g-riverside','da','Đội thi công B chuẩn bị vật tư từ 7h sáng giúp anh',at('08:03')),
    M('g-riverside','nh','Dạ anh, bên em đã sẵn sàng vật tư từ hôm qua rồi ạ',at('08:15')),
    M('g-riverside','bot','Đổ bê tông sàn tầng 4 đang trễ 3 ngày so với kế hoạch (đường găng).',at('09:40'),{bot:{level:'red', title:'Cảnh báo tiến độ', meta:'Module Tiến độ', go:'pm'}}),
    M('g-riverside','hoa','Em đã cập nhật bản vẽ điện tầng 2, mọi người xem giúp em ạ',at('10:22'),{file:{name:'Ban_ve_dien_tang2.pdf', size:'2.4 MB'}}),
    M('g-riverside','ta','Ok em, để anh xem qua rồi phản hồi trong chiều nay',at('10:25')),
    M('g-riverside','ta','Anh Đức Anh cho hỏi tiến độ móng khu B đến chiều nay khoảng bao nhiêu % rồi ạ?',at('10:26')),
    M('g-riverside','da','Đang khoảng 45% anh ơi, chắc mai xong',at('10:31')),
    M('bot','bot','Đổ bê tông sàn tầng 4 đang trễ 3 ngày so với kế hoạch (đường găng).',at('09:40'),{bot:{level:'red', title:'Cảnh báo tiến độ', meta:'Dự án: Riverside — Giai đoạn 2', go:'pm'}}),
    M('bot','bot','1 nhân sự chấm công ngoài bán kính công trường tại Kho vật tư Bình Chánh, cần giám sát duyệt.',at('11:05'),{bot:{level:'yellow', title:'Chấm công ngoài vùng', meta:'Module Chấm công', go:'att', sub:'approve'}}),
    M('bot','bot','Hoá đơn INV-0142 (620 triệu đ) của Khách hàng ABC đã quá hạn thanh toán.',at('13:20'),{bot:{level:'red', title:'Hoá đơn quá hạn', meta:'Module Tài chính', go:'fin', sub:'invoices'}}),
    M('bot','bot','Còn 9 ngày đến mốc "Nghiệm thu phần móng khu B".',at('14:00'),{bot:{level:'blue', title:'Mốc nghiệm thu sắp tới', meta:'Module Tiến độ', go:'pm'}}),
    M('dm-nh','nh','Anh ơi vật tư thép đợt 2 chắc tuần sau mới về kịp ạ',at('16:40',-1)),
    M('dm-nh','ta','Ok em cứ báo bên mua hàng đẩy nhanh giúp anh',at('16:52',-1)),
    M('dm-nh','nh','Dạ em báo cáo, tiến độ sàn tầng 4 hiện đang 80% ạ',at('09:50')),
    M('dm-nh','nh','Em xin thêm 2 ngày vì chờ vật tư anh nhé',at('09:51')),
    M('dm-bn','bn','Anh ơi hoá đơn INV-0142 bên khách hàng ABC vẫn chưa thanh toán ạ',at('11:02')),
    M('dm-bn','bn','Đã quá hạn rồi, anh nhắc giúp em với',at('11:03')),
    M('g-bch','da','Họp giao ban 8h sáng mai tại văn phòng công trường nhé mọi người',at('17:30',-1)),
    M('g-bch','tl','Nhớ mang theo biên bản nghiệm thu cốt thép tầng 4',at('17:42',-1)),
    M('g-b12','lv','Đã xong bước 4 "Đổ bê tông lót móng", mời anh kiểm tra ạ',at('15:10',-1)),
    M('dm-da','da','Chiều nay anh qua kho Bình Chánh kiểm vật tư nhé',at('07:45')),
    M('g-office','dp','Nhắc mọi người: hạn nộp bảng chấm công tháng là ngày 25.',at('08:30',-2))
  ];
  s.read = {'g-riverside':5, bot:2, 'dm-nh':4, 'dm-bn':1, 'g-bch':2, 'g-b12':1, 'dm-da':1, 'g-office':1};
  s.cv = 'g-riverside';
});

/* ================= helpers dùng chung ================= */
const proj = id => S.projects.find(p => p.id === id);
const projName = id => (proj(id) || {}).name || '—';
const projProgress = p => (typeof ganttStats === 'function' && S.gantt && S.gantt[p.id]) ? ganttStats(p.id).actual : p.progress;
const PSTATUS = {active:['Đang thi công','blue'], draft:['Bản nháp','gray'], done:['Hoàn tất','green']};
function botPost(title, text, level = 'blue', meta = '', go = '', subk = '', alsoConv){
  if (LIVE) return LIVE.postBot(title, text, level, meta, go, subk, alsoConv);
  const m = {id:uid(), cv:'bot', from:'bot', text, t:Date.now(), bot:{level, title, meta, go, sub:subk}};
  S.msgs.push(m);
  if (alsoConv) S.msgs.push({...m, id:uid(), cv:alsoConv});
}

/* ================= TỔNG QUAN ================= */
function calendarEvents(){
  const ev = [];
  Object.entries(S.gantt || {}).forEach(([pid, phases]) => phases.forEach(ph => ph.tasks.forEach(t => {
    if (t.ms) ev.push({date:t.start, title:t.name, c:'purple', tag:'Mốc', pc:'purple', go:'pm', pid});
    else if (t.money) ev.push({date:t.start, title:t.name, c:t.money === 'in' ? 'green' : 'orange', tag:t.money === 'in' ? 'Thu tiền' : 'Chi tiền', pc:t.money === 'in' ? 'green' : 'orange', go:'fin', pid});
    else if (t.progress < 100) ev.push({date:t.end, title:'Hạn: ' + t.name, c:'blue', tag:'Công việc', pc:'blue', go:'pm', pid, minor:true});
  })));
  Object.entries(S.fin || {}).forEach(([pid, f]) => f.inv.filter(i => i.status !== 'paid').forEach(i => ev.push({date:i.due, title:i.code + ' · ' + i.partner, c:'yellow', tag:'Hoá đơn', pc:'yellow', go:'fin', sub:'invoices', pid})));
  return ev;
}
const noProjects = () => head('Chưa có dự án nào', '') + emptyBox('Bắt đầu từ Kinh doanh', 'Thêm khách hàng tiềm năng, khi chuyển sang cột “Dự án” hồ sơ dự án sẽ tự tạo — sau đó thiết lập thi công để có tiến độ, tài chính, chấm công.', `<button class="btn" data-act="nav" data-v="sales" data-sub="kanban">${ic('plus', 15)}Thêm khách hàng</button>`);
MOD.dash = () => {
  const p = proj(S.pid) || S.projects[0];
  if (!p) return noProjects();
  const g = ganttStats(p.id), att = attSummary(), f = finStats(p.id);
  const late = ganttLate(p.id), pend = attPending(), overdue = f.overdue;
  const alerts = late.length + pend.length + overdue.length;
  const h = new Date().getHours(), greet = h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  const kpi = (icon, c, title, link, v, subk, lbl, val, pc, note) => `
    <div class="card kpi">
      <div class="kpi-h"><span class="kpi-ic" style="--c:${cv(c)};--t:${ct(c)}">${ic(icon, 14)}</span>${title}<button class="link" data-act="nav" data-v="${v}" ${subk ? `data-sub="${subk}"` : ''}>${link}</button></div>
      <div><div class="kpi-row"><span>${lbl}</span><span>${val}</span></div>${bar(pc, cv(c))}${note ? `<div class="kpi-note">${note}</div>` : ''}</div>
    </div>`;
  const tile = (icon, c, n, lbl, v, subk) => `<button class="tile" style="--c:${cv(c)};--t:${ct(c)}" data-act="nav" data-v="${v}" ${subk ? `data-sub="${subk}"` : ''}><span class="tile-ic">${ic(icon, 17)}</span><span><b>${n}</b><small>${lbl}</small></span><span class="chev">${ic('chev', 16)}</span></button>`;
  const gap = g.plan - g.actual;
  const series = ganttSeries(p.id);
  // lịch + sự kiện sắp tới
  const t0 = today0(), tI = iso(t0), selD = ui.dashDay || tI, evs = calendarEvents();
  const cells = monthCells(t0.getFullYear(), t0.getMonth()).map((d, i) => {
    const s = iso(d), inM = d.getMonth() === t0.getMonth(), e = evs.filter(x => x.date === s && !x.minor);
    const cls = !inM ? 'out' : s === tI ? 'today' : (i % 7 === 6 ? 'wk' : 'in');
    return `<button class="d ${cls} ${s === selD && s !== tI ? 'sel' : ''}" data-act="dash-day" data-d="${s}" aria-label="${fmtDate(s)}${e.length ? ', ' + e.length + ' sự kiện' : ''}">${d.getDate()}${inM && e.length ? `<span class="dots">${[...new Set(e.map(x => x.c))].slice(0, 3).map(c => `<i style="background:${cv(c)}"></i>`).join('')}</span>` : ''}</button>`;
  }).join('');
  const upcoming = evs.filter(e => e.date >= selD && !e.minor).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4).map(e => {
    const dl = daysLeft(e.date), d = parseD(e.date);
    return `<button class="card due" data-act="nav" data-v="${e.go}" ${e.sub ? `data-sub="${e.sub}"` : ''} style="--c:${cv(e.c)}">
      <div class="due-h"><span class="ring"></span><span class="ell">${esc(e.title)}</span><span class="pill ${e.pc}">${e.tag}</span></div>
      <div class="due-date">${pad(d.getDate())}<small>Tháng ${d.getMonth() + 1}</small></div>
      <div class="due-f"><span>${esc(projName(e.pid))}</span><b>${dl === 0 ? 'Hôm nay' : dl < 0 ? 'Đã qua' : 'Còn ' + dl + ' ngày'}</b></div>
      ${bar(Math.max(8, 100 - Math.max(dl, 0) * 5), cv(e.c))}
    </button>`;
  }).join('');
  const fc = f.fc.slice(0, 4);
  return `
    <div class="hello"><h1>${greet}, ${esc(person(S.me).name)} 👋</h1><p>${esc(p.name)} · ${longDate(tI)}. Có ${alerts} cảnh báo cần xử lý và ${chatUnreadTotal()} tin nhắn chưa đọc.</p></div>
    <div class="kpis">
      ${kpi('target','yellow','Tiến độ tổng thể','Quản lý dự án','pm','','Thực tế / kế hoạch ' + g.plan + '%', g.actual + '%', g.actual, gap > 0 ? `<span class="late">Chậm ${gap} điểm %</span> so với kế hoạch` : 'Đúng hoặc vượt kế hoạch')}
      ${kpi('userclock','green','Nhân công hôm nay','Chấm công','att','','Đang có mặt', att.present + ' / ' + att.total, att.present / att.total * 100, att.sites.length + ' công trường hoạt động')}
      ${kpi('wallet','purple','Tồn quỹ dự kiến','Tài chính','fin','cash','Thu ' + trd(sum(fc, x => x[0])) + ' · Chi ' + trd(sum(fc, x => x[1])), (f.net4 >= 0 ? '+' : '') + trd(f.net4), sum(fc, x => x[0]) / (sum(fc, x => x[0]) + sum(fc, x => x[1]) || 1) * 100, '4 tuần tới · tồn quỹ hiện tại ' + trd(f.cash))}
    </div>
    <section>
      <h2 class="sec-title">Cần xử lý</h2>
      <div class="tiles">
        ${tile('alert','orange', late.length, 'Hạng mục trễ tiến độ', 'pm')}
        ${tile('pin','green', pend.length, 'Chấm công ngoài vùng', 'att', 'approve')}
        ${tile('file','yellow', overdue.length, 'Hoá đơn quá hạn', 'fin', 'invoices')}
        ${tile('chat','purple', chatUnreadTotal(), 'Tin nhắn chưa đọc', 'chat')}
      </div>
    </section>
    <div class="grid-3-2">
      <div class="card pad">
        <h2 class="sec-title">Tiến độ theo tuần — Kế hoạch vs Thực tế ${legend([['var(--gray)','Kế hoạch','line'],['var(--purple)','Thực tế','line']])}</h2>
        ${lineChart({labels:series.labels, series:[{c:'var(--gray)', values:series.plan, dash:true}, {c:'var(--purple)', values:series.actual, area:true}], marker:{i:series.nowIdx, label:'Hiện tại · ' + g.actual + '%'}})}
        <div class="small muted">Trục ngang: tuần thi công. Trục dọc: % khối lượng hoàn thành luỹ kế.</div>
      </div>
      <div class="card list-card">
        <h2 class="sec-title">Hạng mục cần chú ý <button class="link" data-act="nav" data-v="pm">Mở tiến độ</button></h2>
        ${late.map(t => `<button class="li" data-act="gtask" data-pid="${p.id}" data-id="${t.id}"><span class="sq" style="--c:var(--red);--t:var(--red-t)">${ic('alert', 16)}</span><span class="ell"><b class="ell">${esc(t.name)}</b><small>${esc(t.owner)} · ${t.progress}%</small></span><span class="end">${pill('Trễ ' + (-daysLeft(t.end)) + ' ngày', 'red')}</span></button>`).join('') || '<div class="empty">Không có hạng mục trễ 🎉</div>'}
      </div>
    </div>
    <section>
      <h2 class="sec-title">Lịch trình <small>Mốc tiến độ, thu chi và hạn hoá đơn</small></h2>
      <div class="sched">
        <div class="card cal"><div class="cal-grid">${['T2','T3','T4','T5','T6','T7','CN'].map(x => `<div class="dow">${x}</div>`).join('')}${cells}</div></div>
        <div class="dues">${upcoming || '<div class="empty">Không có sự kiện từ ngày này</div>'}</div>
      </div>
    </section>
    <div class="grid2">
      <div class="card pad">
        <h2 class="sec-title">Dòng tiền 4 tuần tới ${legend([['var(--green)','Thu'],['var(--orange)','Chi']])}</h2>
        ${barChart({labels:fc.map((_, i) => 'Tuần ' + (i + 1)), series:[{name:'Thu', c:'var(--green)', values:fc.map(x => x[0])}, {name:'Chi', c:'var(--orange)', values:fc.map(x => x[1])}], fmt:v => Math.round(v) + 'tr', h:210})}
      </div>
      <div class="card pad stack">
        <h2 class="sec-title" style="margin:0">Chấm công theo địa điểm — hôm nay <button class="link" data-act="nav" data-v="att">Chi tiết</button></h2>
        ${att.sites.map(s => `<div><div class="kpi-row"><span>${esc(s.name)}</span><span>${s.present}/${s.cap}</span></div>${bar(s.present / s.cap * 100, 'var(--green)', 'thick')}</div>`).join('')}
        ${pend.length ? `<button class="btn line sm" data-act="nav" data-v="att" data-sub="approve" style="align-self:flex-start">${ic('pin', 14)}${pend.length} chấm công ngoài vùng cần duyệt</button>` : ''}
      </div>
    </div>`;
};
ACT['dash-day'] = (el, d) => { ui.dashDay = d.d; render(); };

/* ================= KINH DOANH ================= */
const STG = [['lead','Tiếp cận','blue'],['consult','Tư vấn','purple'],['quote','Báo giá','yellow'],['nego','Đàm phán','orange'],['signed','Chốt HĐ','green'],['design','Dự án (Thiết kế)','pink'],['build','Dự án (Thi công)','brown']];
const stg = k => STG.find(s => s[0] === k) || STG[0];
const stIdx = k => STG.findIndex(s => s[0] === k);
const OPEN_ST = ['lead','consult','quote','nego'];
MOD.sales = () => {
  const cur = sub('sales', 'overview');
  const open = S.leads.filter(l => OPEN_ST.includes(l.stage));
  const won = S.leads.filter(l => stIdx(l.stage) >= 4);
  const tabs = subtabs('sales', [['overview','Tổng quan'],['kanban','Pipeline khách hàng'],['list','Danh sách']], 'overview');
  let body = '';
  if (cur === 'overview'){
    const funnel = STG.slice(0, 5).map(([k, l, c], i) => {
      const n = S.leads.filter(x => stIdx(x.stage) >= i).length;
      return `<div style="--t:${ct(c)};width:${100 - i * 12}%"><span>${l}</span><b>${n}</b></div>`;
    }).join('');
    const hot = S.leads.filter(l => ['nego','quote'].includes(l.stage)).sort((a, b) => b.value - a.value).slice(0, 4);
    const month = won.filter(l => daysLeft(l.updated) > -31);
    body = `
      <div class="stats">
        ${stat('Tổng giá trị pipeline', ty(sum(open, l => l.value)), open.length + ' cơ hội đang theo dõi')}
        ${stat('Khách hàng tiềm năng', S.leads.filter(l => l.stage === 'lead').length, '+' + S.leads.filter(l => l.stage === 'lead' && daysLeft(l.updated) > -31).length + ' trong 30 ngày', 'good')}
        ${stat('Tỷ lệ chốt hợp đồng', Math.round(won.length / S.leads.length * 100) + '%', won.length + '/' + S.leads.length + ' cơ hội')}
        ${stat('Đã chốt 30 ngày qua', ty(sum(month, l => l.value)), month.length + ' hợp đồng')}
      </div>
      <div class="grid2">
        <div class="card pad"><h2 class="sec-title">Phễu bán hàng</h2><div class="funnel">${funnel}</div></div>
        <div class="card list-card"><h2 class="sec-title">Cơ hội sắp chốt <button class="link" data-act="sub" data-view="sales" data-k="kanban">Mở pipeline</button></h2>
          ${hot.map(l => `<button class="li" data-act="lead" data-id="${l.id}">${av(l.owner, 32)}<span class="ell"><b class="ell">${esc(l.name)} — ${esc(l.proj)}</b><small>${esc(l.type)} · cập nhật ${fmtDate(l.updated)}</small></span><span class="end">${pill(stg(l.stage)[1], stg(l.stage)[2])}<div class="val" style="margin-top:4px">${ty(l.value)}</div></span></button>`).join('')}
        </div>
      </div>`;
  } else if (cur === 'kanban'){
    body = `<div class="small muted">Kéo thả thẻ giữa các cột, hoặc dùng ô chọn giai đoạn trên thẻ. Thẻ vào cột “Dự án (Thiết kế)” / “Dự án (Thi công)” sẽ tự tạo hồ sơ ở tab Dự án.</div>
      <div class="board">${STG.map(([k, l, c]) => {
        const items = S.leads.filter(x => x.stage === k);
        return `<div class="col" data-drop="lead:${k}">
          <div class="col-h"><span class="dot" style="--c:${cv(c)}"></span>${l}<span class="n">${items.length}</span><span class="sum">${items.length ? ty(sum(items, x => x.value)) : ''}</span></div>
          ${items.map(x => `<div class="tcard" draggable="true" data-drag="lead:${x.id}">
            <button data-act="lead" data-id="${x.id}" style="text-align:left"><span class="ttitle">${esc(x.name)}</span><div class="small muted">${esc(x.proj)} · ${esc(x.type)}</div></button>
            <div class="tfoot"><span class="val">${ty(x.value)}</span>${av(x.owner, 22)}</div>
            <div class="row between"><select data-change="lead-stage" data-id="${x.id}" aria-label="Chuyển giai đoạn">${opt(STG.map(s => [s[0], s[1]]), x.stage)}</select>${x.projectId ? `<button class="link" data-act="open-proj" data-id="${x.projectId}">Hồ sơ dự án ›</button>` : `<span class="small muted">${fmtDate(x.updated)}</span>`}</div>
          </div>`).join('')}
          <form class="quick" data-form="lead-quick" data-stage="${k}"><input name="name" placeholder="+ Thêm thẻ nhanh" aria-label="Tên khách hàng mới ở cột ${l}"></form>
        </div>`;
      }).join('')}</div>`;
  } else {
    body = `<div class="table-wrap"><table><thead><tr><th>Khách hàng</th><th>Điện thoại</th><th>Loại dự án</th><th class="r">Giá trị</th><th>Giai đoạn</th><th>Phụ trách</th><th>Cập nhật</th></tr></thead><tbody>
      ${[...S.leads].sort((a, b) => b.updated.localeCompare(a.updated)).map(l => `<tr class="click" data-act="lead" data-id="${l.id}" tabindex="0"><td><b style="font-weight:500">${esc(l.name)}</b><div class="small muted">${esc(l.proj)}</div></td><td class="num">${esc(l.phone)}</td><td>${esc(l.type)}</td><td class="r b">${ty(l.value)}</td><td>${pill(stg(l.stage)[1], stg(l.stage)[2])}</td><td><div class="who">${av(l.owner, 22)}${esc(person(l.owner).name)}</div></td><td>${fmtDate(l.updated)}</td></tr>`).join('')}
    </tbody></table></div>`;
  }
  return head('Kinh doanh', 'Pipeline khách hàng — chốt hợp đồng sẽ tự tạo hồ sơ tại tab Dự án.', `<button class="btn" data-act="lead-new">${ic('plus', 15)}Thêm khách hàng tiềm năng</button>`) + tabs + body;
};
function setLeadStage(l, st){
  if (l.stage === st) return;
  l.stage = st; l.updated = todayISO();
  log(l.name + ' → ' + stg(st)[1], 'orange');
  if ((st === 'design' || st === 'build') && !l.projectId){
    const p = {id:'p' + uid(), name:l.proj || l.name, client:l.name, contact:l.name, phone:l.phone, email:l.email, addr:l.addr, type:l.type, budget:Math.round(l.value * 1000), progress:0, pm:'', team:'', safety:'', purchase:'', start:'', status:'draft', note:l.note, leadId:l.id};
    S.projects.push(p); l.projectId = p.id;
    botPost('Hồ sơ dự án mới', `Cơ hội “${l.name} — ${l.proj}” đã chuyển sang ${stg(st)[1]}. Hồ sơ dự án được tạo ở trạng thái Bản nháp, chờ thiết lập thi công.`, 'green', 'Module Kinh doanh', 'projects', 'setup');
    toast('Đã tạo hồ sơ dự án “' + p.name + '” ở tab Dự án');
  }
}
DROP.lead = (id, st) => { const l = S.leads.find(x => x.id === id); if (l) setLeadStage(l, st); };
CHG['lead-stage'] = el => { const l = S.leads.find(x => x.id === el.dataset.id); if (l){ setLeadStage(l, el.value); render(); } };
FORM['lead-quick'] = (v, f) => {
  if (!v.name.trim()) return;
  S.leads.push({id:'l' + uid(), name:v.name.trim(), proj:'Chưa đặt tên dự án', phone:'', email:'', source:'Khác', addr:'', type:'Nhà phố', scale:'', interests:[], value:1, stage:f.dataset.stage, owner:S.me, updated:todayISO(), note:'', concept:'', boq:'', projectId:''});
  log('Thêm khách hàng ' + v.name.trim(), 'orange'); render();
  const inp = document.querySelector(`form[data-stage="${f.dataset.stage}"] input`); if (inp) inp.focus();
};
ACT['open-proj'] = (el, d) => { S.pid = d.id; S.sub.projects = 'detail'; nav('projects'); };
/* form 3 bước */
ACT['lead-new'] = () => { ui.lead = {step:1, d:{id:'', name:'', proj:'', phone:'', email:'', source:'Giới thiệu', addr:'', type:'Nhà phố', scale:'', interests:[], value:1, stage:'lead', owner:S.me, note:'', concept:'', boq:''}}; leadModal(); };
ACT.lead = (el, d) => { const l = S.leads.find(x => x.id === d.id); ui.lead = {step:1, d:JSON.parse(JSON.stringify(l))}; leadModal(); };
function leadModal(){
  const {step, d} = ui.lead;
  const f1 = `<div class="row2"><label class="field">Tên khách hàng *<input id="ld-name" name="name" required value="${esc(d.name)}"></label><label class="field">Số điện thoại *<input id="ld-phone" name="phone" required value="${esc(d.phone)}"></label></div>
    <div class="row2"><label class="field">Email<input id="ld-email" name="email" type="email" value="${esc(d.email)}"></label><label class="field">Nguồn khách hàng<select id="ld-source" name="source">${opt(['Giới thiệu','Website','Mạng xã hội','Sự kiện','Khách cũ','Khác'], d.source)}</select></label></div>
    <label class="field">Tên dự án / công trình<input id="ld-proj" name="proj" value="${esc(d.proj)}" placeholder="VD: Biệt thự Nhà Bè"></label>`;
  const f2 = `<label class="field">Địa chỉ công trình<input id="ld-addr" name="addr" value="${esc(d.addr)}"></label>
    <div class="row3"><label class="field">Loại dự án<select id="ld-type" name="type">${opt(['Nhà phố','Biệt thự','Chung cư','Văn phòng','Khác'], d.type)}</select></label><label class="field">Quy mô<input id="ld-scale" name="scale" value="${esc(d.scale)}" placeholder="VD: 3 tầng, 250m²"></label><label class="field">Giá trị ước tính (tỷ)<input id="ld-value" name="value" type="number" step="0.1" min="0" value="${d.value}"></label></div>
    <div class="field">Hạng mục quan tâm<div class="checks">${['Xây dựng thô','Hoàn thiện nội thất','Thiết kế kiến trúc','Cảnh quan sân vườn'].map(x => `<label><input type="checkbox" name="interests" value="${x}" ${d.interests.includes(x) ? 'checked' : ''}>${x}</label>`).join('')}</div></div>
    <div class="row2"><label class="field">Giai đoạn hiện tại<select id="ld-stage" name="stage">${opt(STG.map(s => [s[0], s[1]]), d.stage)}</select></label><label class="field">Phụ trách<select id="ld-owner" name="owner">${peopleOpts(d.owner)}</select></label></div>`;
  const f3 = `<label class="field">BOQ (Bảng khối lượng dự toán)<input id="ld-boq" type="file" name="boqfile" accept=".xlsx,.xls,.pdf">${d.boq ? `<span>Đã đính kèm: ${esc(d.boq)}</span>` : ''}</label>
    <label class="field">Concept / Ý tưởng thiết kế<textarea id="ld-concept" name="concept">${esc(d.concept)}</textarea></label>
    <label class="field">Ghi chú nội bộ<textarea id="ld-note" name="note">${esc(d.note)}</textarea></label>`;
  showModal(`<form class="modal wide" data-form="lead" data-id="${d.id}">
    <h3>${d.id ? 'Hồ sơ khách hàng' : 'Thêm khách hàng tiềm năng'}${closeBtn()}</h3>
    <div class="sub">Điền thông tin theo 3 cấp độ — càng đầy đủ, hồ sơ chuyển giao sang thi công càng chính xác.</div>
    <div class="seg">${['1. Cơ bản','2. Chi tiết','3. Nâng cao'].map((l, i) => `<button type="button" class="${step === i + 1 ? 'on' : ''}" data-act="lead-step" data-s="${i + 1}">${l}</button>`).join('')}</div>
    ${step === 1 ? f1 : step === 2 ? f2 : f3}
    <div class="m-actions">${d.id ? delBtn('lead') : ''}<span class="small muted" style="margin-right:auto;align-self:center">Bước ${step}/3</span>
      ${step > 1 ? `<button type="button" class="btn ghost" data-act="lead-step" data-s="${step - 1}">Quay lại</button>` : ''}
      ${step < 3 ? `<button type="button" class="btn line" data-act="lead-step" data-s="${step + 1}">Tiếp theo</button>` : ''}
      <button class="btn" type="submit">Lưu khách hàng</button></div>
  </form>`);
}
function leadCollect(){
  const f = document.querySelector('form[data-form="lead"]'); if (!f) return;
  const d = ui.lead.d, fd = new FormData(f);
  ['name','phone','email','source','proj','addr','type','scale','stage','owner','concept','note'].forEach(k => { if (fd.has(k)) d[k] = fd.get(k); });
  if (fd.has('value')) d.value = +fd.get('value') || 0;
  if (f.querySelector('[name=interests]')) d.interests = fd.getAll('interests');
  const file = f.querySelector('[name=boqfile]'); if (file && file.files[0]) d.boq = file.files[0].name;
}
ACT['lead-step'] = (el, dd) => {
  leadCollect();
  const f = document.querySelector('form[data-form="lead"]');
  if (ui.lead.step === 1 && +dd.s > 1 && !f.reportValidity()) return;
  ui.lead.step = +dd.s; leadModal();
};
FORM.lead = () => {
  leadCollect();
  const d = ui.lead.d;
  if (!d.name.trim() || !d.phone.trim()){ ui.lead.step = 1; leadModal(); toast('Cần nhập tên và số điện thoại ở bước 1'); return; }
  if (!d.proj) d.proj = d.type + ' — ' + d.name;
  let l = S.leads.find(x => x.id === d.id);
  const newStage = d.stage;
  if (l){ const old = l.stage; Object.assign(l, d, {stage:old}); setLeadStage(l, newStage); l.updated = todayISO(); }
  else { l = {...d, id:'l' + uid(), stage:'lead', updated:todayISO(), projectId:''}; S.leads.push(l); if (newStage !== 'lead') setLeadStage(l, newStage); log('Thêm khách hàng ' + l.name, 'orange'); }
  closeModal(); render(); toast('Đã lưu khách hàng');
};
DEL.lead = id => { S.leads = S.leads.filter(l => l.id !== id); };

/* ================= DỰ ÁN ================= */
MOD.projects = () => {
  const cur = sub('projects', 'list');
  const tabs = subtabs('projects', [['list','Danh sách dự án'],['setup','Thiết lập thi công'],['detail','Chi tiết & luồng dữ liệu']], 'list');
  let body = '';
  if (cur === 'list'){
    body = `<div class="stats">
      ${stat('Tổng dự án', S.projects.length, '')}
      ${stat('Đang thi công', S.projects.filter(p => p.status === 'active').length, '')}
      ${stat('Bản nháp', S.projects.filter(p => p.status === 'draft').length, 'chờ thiết lập thi công')}
      ${stat('Tổng ngân sách quản lý', trd(sum(S.projects, p => p.budget)), '')}
    </div>
    <div class="table-wrap"><table><thead><tr><th>Dự án</th><th>Khách hàng</th><th>Loại hình</th><th class="r">Ngân sách</th><th style="width:160px">Tiến độ</th><th>PM</th><th>Trạng thái</th></tr></thead><tbody>
      ${S.projects.map(p => { const pr = projProgress(p); return `<tr class="click" data-act="open-proj" data-id="${p.id}" tabindex="0"><td class="b">${esc(p.name)}</td><td>${esc(p.client)}</td><td>${esc(p.type)}</td><td class="r">${trd(p.budget)}${p.status === 'draft' ? ' <span class="small muted">(dự kiến)</span>' : ''}</td><td><div class="row"><div style="flex:1">${bar(pr, 'var(--blue)')}</div><span class="small num">${pr}%</span></div></td><td>${p.pm ? av(p.pm, 24) : '<span class="small muted">Chưa gán</span>'}</td><td>${pill(...PSTATUS[p.status])}</td></tr>`; }).join('')}
    </tbody></table></div>`;
  } else if (cur === 'setup'){
    const cand = S.projects.filter(p => p.status !== 'done');
    const p = proj(ui.setupPid) || cand.find(x => x.status === 'draft') || cand[0];
    if (!p) return head('Dự án', '') + tabs + emptyBox('Chưa có dự án cần thiết lập', 'Dự án được tạo khi cơ hội bên Kinh doanh chuyển sang cột “Dự án (Thiết kế)” hoặc “Dự án (Thi công)”.', `<button class="btn" data-act="nav" data-v="sales" data-sub="kanban">Mở Kinh doanh</button>`);
    const ex = {qs:S.qs.projects.some(q => q.pid === p.id), g:!!S.gantt[p.id], site:S.att.sites.some(s => s.pid === p.id), fin:!!S.fin[p.id], chat:S.convs.some(c => c.pid === p.id)};
    const ck = (ok, name, what) => `<div><span class="sq" style="--c:${ok ? 'var(--green)' : 'var(--muted)'};--t:${ok ? 'var(--green-t)' : 'var(--chip)'};width:26px;height:26px;border-radius:8px">${ic(ok ? 'check' : 'plus', 14)}</span><b style="font-weight:500">${name}</b><small>${ok ? 'Đã có' : what}</small></div>`;
    body = `<div class="card pad small" style="background:var(--hover)">Việc tạo hồ sơ khách hàng mới thuộc mục <button class="link" data-act="nav" data-v="sales" style="text-decoration:underline">Kinh doanh</button>. Khi một cơ hội chuyển vào cột “Dự án (Thiết kế)” hoặc “Dự án (Thi công)”, dự án tự xuất hiện ở đây để bạn bổ nhiệm nhân sự và khởi tạo dữ liệu vận hành.</div>
    <form class="card pad stack" data-form="setup" data-id="${p.id}" style="gap:14px">
      <label class="field">Chọn dự án cần thiết lập *<select id="st-pid" data-change="setup-pid">${opt(cand.map(x => [x.id, x.name + (x.status === 'draft' ? ' (bản nháp)' : '')]), p.id)}</select></label>
      <div class="row2"><label class="field">Chỉ huy trưởng / PM công trường<select id="st-pm" name="pm">${peopleOpts(p.pm, '— Chưa gán —')}</select></label>
        <label class="field">Đội thi công phụ trách<select id="st-team" name="team">${opt([['','— Chưa gán —'],'Đội thi công A','Đội thi công B','Đội thi công C'], p.team)}</select></label></div>
      <div class="row2"><label class="field">Giám sát an toàn lao động<select id="st-safety" name="safety">${peopleOpts(p.safety, '— Chưa gán —')}</select></label>
        <label class="field">Phụ trách mua hàng & cung ứng<select id="st-purchase" name="purchase">${peopleOpts(p.purchase, '— Chưa gán —')}</select></label></div>
      <div class="row3"><label class="field">Ngày khởi công thực tế<input id="st-start" type="date" name="start" required value="${p.start || dayISO(7)}"></label>
        <label class="field">Ngân sách được duyệt (tỷ)<input id="st-budget" type="number" step="0.1" min="0" name="budget" value="${(p.budget / 1000).toFixed(1)}"></label>
        <label class="field">Địa chỉ công trường<input id="st-addr" name="addr" value="${esc(p.addr)}"></label></div>
      <label class="field">Ghi chú bàn giao từ Kinh doanh<textarea id="st-note" name="note">${esc(p.note)}</textarea></label>
      <div class="field">Sau khi lưu, dữ liệu vận hành được khởi tạo tới — không cần nhập lại thông tin khách hàng hay địa điểm ở từng module:
        <div class="checklist">${ck(ex.qs,'QS','Tạo hồ sơ bóc tách trống')}${ck(ex.g,'Tiến độ','Khung Gantt mẫu theo loại hình ' + p.type)}${ck(ex.site,'Chấm công','Địa điểm công trường từ địa chỉ')}${ck(ex.fin,'Tài chính','Ngân sách theo hạng mục dự kiến')}${ck(S.quest.pid === p.id,'Nhiệm vụ','Gán quy trình game hoá theo loại hình')}${ck(ex.chat,'Chat','Tạo nhóm chat dự án tự động')}</div></div>
      <div class="m-actions"><button type="button" class="btn ghost" data-act="sub" data-view="projects" data-k="list">Huỷ</button><button class="btn" type="submit">${ic('check', 15)}Lưu thiết lập & bắt đầu thi công</button></div>
    </form>`;
  } else {
    const p = proj(S.pid) || S.projects[0];
    if (!p) return head('Dự án', '') + tabs + emptyBox('Chưa có dự án', 'Hồ sơ dự án tự tạo từ Kinh doanh.', `<button class="btn" data-act="nav" data-v="sales" data-sub="kanban">Mở Kinh doanh</button>`);
    const lead = S.leads.find(l => l.id === p.leadId);
    const g = S.gantt[p.id] ? ganttStats(p.id) : null;
    const qsp = S.qs.projects.filter(q => q.pid === p.id);
    const site = S.att.sites.find(s => s.pid === p.id);
    const f = S.fin[p.id] ? finStats(p.id) : null;
    const conv = S.convs.find(c => c.pid === p.id);
    const card = (icon, c, title, big, small, v, subk) => `<div class="card flow-card"><div class="row"><span class="sq" style="--c:${cv(c)};--t:${ct(c)}">${ic(icon, 17)}</span><b style="font-size:13.5px;font-weight:600">${title}</b></div><b>${big}</b><span class="small muted">${small}</span>${v ? `<button class="link" style="align-self:flex-start" data-act="flow-go" data-v="${v}" data-sub="${subk || ''}" data-pid="${p.id}">Mở ${title} ›</button>` : ''}</div>`;
    body = `<div class="toolbar"><label class="field" style="flex-direction:row;align-items:center;gap:10px">Dự án<select data-change="pid" style="min-width:260px">${opt(S.projects.map(x => [x.id, x.name]), p.id)}</select></label></div>
      <div class="card pad stack">
        <div class="row between" style="flex-wrap:wrap"><div><h2 style="margin:0;font-size:19px">${esc(p.name)}</h2><div class="small muted">${esc(p.addr)}${p.start ? ' · Khởi công ' + fmtFull(p.start) : ''}</div></div><div class="row">${pill(...PSTATUS[p.status])}${p.status === 'draft' ? `<button class="btn sm" data-act="setup-go" data-id="${p.id}">Thiết lập thi công</button>` : ''}</div></div>
        <div class="stats" style="margin-top:6px">
          <div><div class="small muted">Khách hàng</div><b style="font-weight:500">${esc(p.client)}</b></div>
          <div><div class="small muted">Liên hệ</div><b style="font-weight:500">${esc(p.contact)}</b><div class="small">${esc(p.phone)} · ${esc(p.email)}</div></div>
          <div><div class="small muted">Ngân sách · PM</div><b style="font-weight:600;font-size:18px">${trd(p.budget)}</b><div class="small">${p.pm ? esc(person(p.pm).name) : 'Chưa gán PM'}</div></div>
        </div>
      </div>
      <h2 class="sec-title" style="margin:0">Luồng phân phối dữ liệu từ dự án</h2>
      <div class="flow">
        ${card('briefcase','orange','Kinh doanh', lead ? ty(lead.value) : '—', lead ? 'Giai đoạn: ' + stg(lead.stage)[1] : 'Không gắn cơ hội', 'sales', 'kanban')}
        ${card('ruler','purple','QS', qsp.length + ' hồ sơ', qsp.length ? vnd(sum(qsp, q => qsTotal(q))) + ' đã bóc tách' : 'Chưa có hồ sơ bóc tách', 'qs', 'projects')}
        ${card('gantt','blue','Quản lý dự án', g ? g.actual + '%' : '—', g ? g.count + ' công việc · ' + g.late + ' trễ' : 'Chưa có khung tiến độ', g ? 'pm' : '', '')}
        ${card('userclock','green','Chấm công', site ? site.present + '/' + site.cap : '—', site ? esc(site.name) : 'Chưa có địa điểm', site ? 'att' : '', '')}
        ${card('wallet','yellow','Tài chính', f ? 'Chi ' + trd(f.spent) + ' / ' + trd(f.budget) : '—', f ? f.overdue.length + ' hoá đơn quá hạn' : 'Chưa có ngân sách', f ? 'fin' : '', '')}
        ${card('chat','pink','Chat', conv ? (conv.members.length + ' thành viên') : '—', conv ? esc(conv.name) : 'Chưa có nhóm chat', conv ? 'chat' : '', conv ? conv.id : '')}
        ${card('trophy','brown','Nhiệm vụ', S.quest.pid === p.id ? questDone() + '/' + S.quest.steps.length + ' bước' : 'Chưa gán riêng', S.quest.pid === p.id ? esc(S.quest.name) : 'Mẫu: ' + esc(S.quest.name), 'pm', 'quest')}
      </div>`;
  }
  return head('Dự án', 'Điểm khởi đầu — dữ liệu dự án được phân phối tới QS, Tiến độ, Chấm công, Tài chính & Nhiệm vụ.', `<button class="btn" data-act="nav" data-v="sales" data-sub="kanban">${ic('plus', 15)}Thêm cơ hội mới (Kinh doanh)</button>`) + tabs + body;
};
CHG['setup-pid'] = el => { ui.setupPid = el.value; render(); };
ACT['setup-go'] = (el, d) => { ui.setupPid = d.id; S.sub.projects = 'setup'; render(); };
ACT['flow-go'] = (el, d) => {
  S.pid = d.pid;
  if (d.v === 'chat' && d.sub){ S.cv = d.sub; nav('chat'); return; }
  if (d.v === 'pm' && d.sub === 'quest'){ S.sub.pm = 'quest'; nav('pm'); return; }
  if (d.v === 'qs'){ const q = S.qs.projects.find(x => x.pid === d.pid); if (q) S.qs.cur = q.id; }
  nav(d.v, d.sub || undefined);
};
FORM.setup = (v, f) => {
  const p = proj(f.dataset.id);
  Object.assign(p, {pm:v.pm, team:v.team, safety:v.safety, purchase:v.purchase, start:v.start, budget:Math.round((+v.budget || 0) * 1000), addr:v.addr, note:v.note, status:'active'});
  if (!S.gantt[p.id]) S.gantt[p.id] = ganttTemplate(p);
  if (!S.fin[p.id]) S.fin[p.id] = finTemplate(p);
  if (!S.att.sites.some(s => s.pid === p.id)) S.att.sites.push({id:'s' + uid(), pid:p.id, name:p.name.split('—')[0].trim(), addr:p.addr, radius:100, cap:20, present:0});
  if (!S.qs.projects.some(q => q.pid === p.id)) S.qs.projects.push({id:'q' + uid(), code:'QS-' + pad(S.qs.projects.length + 1), pid:p.id, name:p.name, client:p.client, phone:p.phone, addr:p.addr, created:todayISO(), status:'draft', quoted:false, rooms:[{id:uid(), name:'Phòng khách', items:[]}]});
  const gm = [S.me, p.pm, p.safety, p.purchase].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i);
  if (LIVE) LIVE.createGroup(p.name, gm, p.id);
  else if (!S.convs.some(c => c.pid === p.id)) S.convs.push({id:'g-' + p.id, type:'group', name:p.name, sub:'Nhóm dự án', icon:'building', c:'blue', members:gm, files:[], pid:p.id});
  const lead = S.leads.find(l => l.id === p.leadId); if (lead && lead.stage !== 'build'){ lead.stage = 'build'; lead.updated = todayISO(); }
  botPost('Dự án bắt đầu thi công', `${p.name} đã được thiết lập: PM ${p.pm ? person(p.pm).name : 'chưa gán'}, khởi công ${fmtFull(p.start)}. Đã khởi tạo QS, tiến độ, chấm công, tài chính và nhóm chat.`, 'green', 'Module Dự án', 'projects', 'detail', 'g-' + p.id);
  log('Thiết lập thi công ' + p.name, 'blue');
  S.pid = p.id; S.sub.projects = 'detail'; render(); toast('Đã lưu thiết lập & khởi tạo dữ liệu vận hành');
};
SEARCH.push(hit => S.projects.filter(p => hit(p.name + ' ' + p.client)).map(p => ({icon:'building', label:p.name, sub:'Dự án', run:() => { S.pid = p.id; S.sub.projects = 'detail'; nav('projects'); }})));
SEARCH.push(hit => S.leads.filter(l => hit(l.name + ' ' + l.proj + ' ' + l.phone)).map(l => ({icon:'briefcase', label:l.name + ' — ' + l.proj, sub:'Khách hàng · ' + stg(l.stage)[1], run:() => { nav('sales'); ACT.lead(null, {id:l.id}); }})));

/* ================= CHAT ================= */
const convMsgs = id => S.msgs.filter(m => m.cv === id);
const convUnread = id => LIVE ? LIVE.unread(id) : Math.max(0, convMsgs(id).length - (S.read[id] || 0));
function chatUnreadTotal(){ return S.convs ? sum(S.convs, c => convUnread(c.id)) : 0; }
const convName = c => c.type === 'dm' ? person(c.user).name : c.name;
const convSub = c => c.type === 'dm' ? person(c.user).team + ' · ' + person(c.user).role : c.type === 'group' ? c.members.length + ' thành viên' + (c.pid ? ' · ' + c.sub : '') : c.sub;
const convIcon = (c, s = 36) => c.type === 'dm' ? av(c.user, s) : `<span class="sq" style="--c:${cv(c.c)};--t:${ct(c.c)};width:${s}px;height:${s}px">${ic(c.icon, Math.round(s / 2))}</span>`;
const LV = {red:['red','alert'], yellow:['yellow','pin'], blue:['blue','info'], green:['green','check']};
MOD.chat = () => {
  const c = S.convs.find(x => x.id === S.cv) || S.convs[0];
  if (!c) return head('Chat', '') + emptyBox('Đang tải hội thoại…', 'Nếu lâu không thấy, hãy tải lại trang.');
  S.cv = c.id;
  if (LIVE) LIVE.markRead(c.id); else S.read[c.id] = convMsgs(c.id).length;
  const filt = ui.chatFilt || 'all', q = (ui.chatQ || '').toLowerCase();
  const items = S.convs.filter(x => (filt === 'all' || convUnread(x.id) || x.id === c.id) && (!q || convName(x).toLowerCase().includes(q)))
    .sort((a, b) => (convMsgs(b.id).slice(-1)[0] || {t:0}).t - (convMsgs(a.id).slice(-1)[0] || {t:0}).t);
  const list = items.map(x => {
    const last = convMsgs(x.id).slice(-1)[0], n = convUnread(x.id);
    const prev = last ? (last.bot ? last.bot.title + ': ' : last.from === S.me ? 'Bạn: ' : x.type === 'group' ? person(last.from).name.split(' ').pop() + ': ' : '') + (last.file ? '📎 ' + last.file.name : last.text) : 'Chưa có tin nhắn';
    return `<button class="conv ${x.id === c.id ? 'on' : ''} ${n ? 'unread' : ''}" data-act="cv" data-id="${x.id}">${convIcon(x)}<span class="meta"><b><span class="ell">${esc(convName(x))}</span><span>${last ? (daysLeft(iso(new Date(last.t))) === 0 ? hm(last.t) : relDay(iso(new Date(last.t)))) : ''}</span></b><small><span class="ell">${esc(prev)}</span>${n ? `<span class="n">${n}</span>` : ''}</small></span></button>`;
  }).join('') || '<div class="empty">Không có hội thoại</div>';
  let lastDay = '';
  const msgs = convMsgs(c.id).map(m => {
    const day = iso(new Date(m.t)); let sep = '';
    if (day !== lastDay){ lastDay = day; sep = `<div class="day-sep">${relDay(day)}</div>`; }
    if (m.bot){ const [col, icn] = LV[m.bot.level] || LV.blue; return sep + `<div class="botmsg" style="--c:${cv(col)};--t:${ct(col)}"><b>${ic(icn, 15)}${esc(m.bot.title)}</b><p>${esc(m.text)}</p><small><span>SiteFlow Bot · ${esc(m.bot.meta)} · ${hm(m.t)}</span>${m.bot.go ? `<button class="link" data-act="nav" data-v="${m.bot.go}" ${m.bot.sub ? `data-sub="${m.bot.sub}"` : ''}>Xem chi tiết ›</button>` : ''}</small></div>`; }
    const me = m.from === S.me;
    const img = m.file && m.file.path && /^image\//.test(m.file.type || '');
    const file = m.file && !m.deleted ? (m.file.path
      ? `${img ? `<img class="chat-img" data-path="${esc(m.file.path)}" alt="${esc(m.file.name)}" data-act="chat-file" data-path2="${esc(m.file.path)}">` : ''}<button class="file" data-act="chat-file" data-path="${esc(m.file.path)}">${ic('file', 18)}<span>${esc(m.file.name)}<small>${esc(m.file.size)} · bấm để mở</small></span></button>`
      : `<div class="file">${ic('file', 18)}<span>${esc(m.file.name)}<small>${esc(m.file.size)}</small></span></div>`) : '';
    const body = m.deleted ? '<i class="muted">Tin nhắn đã được thu hồi</i>' : esc(m.text) + (m.edited ? ' <small class="muted">(đã sửa)</small>' : '');
    const tools = LIVE && me && !m.deleted && Date.now() - m.t < 24 * 36e5 ? ` · <button class="link" data-act="msg-recall" data-id="${m.id}">Thu hồi</button>` : '';
    return sep + `<div class="msg ${me ? 'me' : ''}">${me ? '' : av(m.from, 30)}<div><div class="meta">${me ? '' : esc(person(m.from).name) + ' · '}${hm(m.t)}${m.pending ? ' · đang gửi…' : ''}${tools}</div><div class="bubble">${body}${file}</div></div></div>`;
  }).join('');
  const info = ui.chatInfo && c.type !== 'bot';
  const files = c.files.concat(convMsgs(c.id).filter(m => m.file && !c.files.some(f => f.name === m.file.name)).map(m => m.file));
  return head('Chat', 'Nhóm theo dự án, tin nhắn riêng và cảnh báo tự động từ các module.') + `
    <div class="chat ${info ? 'info' : ''}">
      <div class="chat-side">
        <div class="top">
          <div class="row"><div class="search" style="flex:1">${ic('search', 15)}<input id="chat-q" data-input="chat-q" value="${esc(ui.chatQ || '')}" placeholder="Tìm hội thoại" aria-label="Tìm hội thoại"></div>${LIVE ? `<button class="icon-btn" data-act="conv-new" title="Nhắn riêng / tạo nhóm" aria-label="Nhắn riêng hoặc tạo nhóm" style="border:1px solid var(--line)">${ic('plus')}</button>` : ''}</div>
          ${LIVE && LIVE.canNotify() ? `<button class="btn line sm" data-act="notify-on">${ic('bell', 14)}Bật thông báo tin nhắn mới</button>` : ''}
          <div class="seg"><button class="${filt === 'all' ? 'on' : ''}" data-act="chat-filt" data-f="all">Tất cả</button><button class="${filt === 'unread' ? 'on' : ''}" data-act="chat-filt" data-f="unread">Chưa đọc${chatUnreadTotal() ? `<span class="cnt">${chatUnreadTotal()}</span>` : ''}</button></div>
        </div>
        <div class="conv-list">${list}</div>
      </div>
      <div class="thread">
        <div class="th-head">${convIcon(c, 38)}<div class="ell" style="flex:1"><b>${esc(convName(c))}</b><small>${esc(convSub(c))}</small></div>${c.type !== 'bot' ? `<button class="icon-btn" data-act="chat-info" aria-label="Thành viên & tệp" title="Thành viên & tệp">${ic('panel')}</button>` : ''}</div>
        <div class="msgs" id="msgs">${msgs || '<div class="empty">Chưa có tin nhắn. Gửi lời chào đầu tiên!</div>'}</div>
        <div class="typing" id="typing">${ui.typing && ui.typing.cv === c.id ? esc(person(ui.typing.user).name) + ' đang soạn tin…' : ''}</div>
        ${c.type === 'bot' ? '<div class="foot-note" style="text-align:center">Kênh thông báo tự động — không nhận tin nhắn.</div>' : `<form class="composer" data-form="chat">
          <label class="icon-btn" title="Đính kèm tệp" aria-label="Đính kèm tệp" style="cursor:pointer">${ic('clip')}<input type="file" data-change="chat-file" hidden></label>
          <input type="text" id="chatIn" name="text" autocomplete="off" placeholder="Nhắn tới ${esc(convName(c))}" aria-label="Nội dung tin nhắn"><button class="send" type="submit" style="margin-left:0">Gửi</button></form>`}
      </div>
      ${info ? `<div class="chat-info"><h4>Thành viên (${c.members.length})</h4>${LIVE && c.type === 'group' ? `<div class="row"><button class="btn line sm" data-act="conv-add" data-id="${c.id}">${ic('plus', 13)}Thêm người</button>${LIVE.fixed(c.id) ? '' : `<button class="btn ghost sm" data-act="conv-leave" data-id="${c.id}">Rời nhóm</button>`}</div>` : ''}${c.members.map(id => `<div class="who">${av(id, 30)}<span><b style="font-weight:500;font-size:13px">${esc(person(id).name)}${id === S.me ? ' (bạn)' : ''}</b><small>${esc(person(id).role)} · ${esc(person(id).team)}</small></span></div>`).join('')}
        <h4>Tệp đã chia sẻ</h4>${files.map(f => `<div class="file" style="margin:0">${ic('file', 18)}<span>${esc(f.name)}<small>${esc(f.size)}</small></span></div>`).join('') || '<div class="small muted">Chưa có tệp</div>'}</div>` : ''}
    </div>`;
};
AFTER.chat = () => { const m = $('#msgs'); if (m) m.scrollTop = m.scrollHeight; };
ACT.cv = (el, d) => { S.cv = d.id; render(); const i = $('#chatIn'); if (i) i.focus(); };
ACT['chat-filt'] = (el, d) => { ui.chatFilt = d.f; render(); };
ACT['chat-info'] = () => { ui.chatInfo = !ui.chatInfo; render(); };
INP['chat-q'] = el => { ui.chatQ = el.value; render(); const i = $('#chat-q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); };
const REPLIES = ['Dạ em nhận rồi ạ.','Ok anh, em xử lý trong hôm nay.','Em kiểm tra lại rồi báo anh trong 30 phút nhé.','Dạ, em cập nhật lên tiến độ luôn ạ.'];
function sendChat(extra, fileObj){
  if (LIVE) return LIVE.send(S.cv, extra, fileObj);
  const c = S.convs.find(x => x.id === S.cv);
  S.msgs.push({id:uid(), cv:c.id, from:S.me, t:Date.now(), text:'', ...extra});
  render(); const i = $('#chatIn'); if (i) i.focus();
  const replier = c.type === 'dm' ? c.user : null;
  if (!replier) return;
  const cvId = c.id;
  setTimeout(() => { ui.typing = {cv:cvId, user:replier}; const tp = $('#typing'); if (tp && S.cv === cvId && S.view === 'chat') tp.textContent = person(replier).name + ' đang soạn tin…'; }, 700);
  setTimeout(() => {
    ui.typing = null;
    S.msgs.push({id:uid(), cv:cvId, from:replier, text:REPLIES[Math.floor(Math.random() * REPLIES.length)], t:Date.now()});
    log(person(replier).name + ' đã trả lời bạn', 'purple');
    const inp = $('#chatIn'), val = inp ? inp.value : '';
    if (S.view === 'chat' && $('#modal').hidden) { render(); const i2 = $('#chatIn'); if (i2){ i2.value = val; i2.focus(); } } else { renderRail(); renderTop(); save(); }
  }, 2300);
}
FORM.chat = v => { const t = (v.text || '').trim(); if (t) sendChat({text:t}); };
const fmtSize = bytes => { const kb = bytes / 1024; return kb > 1024 ? dec(kb / 1024, 1) + ' MB' : Math.max(1, Math.round(kb)) + ' KB'; };
CHG['chat-file'] = el => { const f = el.files[0]; if (!f) return; el.value = ''; sendChat({text:'', file:{name:f.name, size:fmtSize(f.size), type:f.type}}, f); };
SEARCH.push(hit => S.convs.filter(c => hit(convName(c))).map(c => ({icon:'chat', label:convName(c), sub:'Chat', run:() => { S.cv = c.id; nav('chat'); }})));

/* ================= trợ lý ================= */
AI_CHIPS.push(['gantt','purple','Tiến độ','Việc nào đang trễ tiến độ?'],['userclock','green','Chấm công','Nhân công hôm nay?'],['wallet','yellow','Dòng tiền','Dòng tiền 4 tuần tới thế nào?'],['briefcase','orange','Khách hàng','Cơ hội nào sắp chốt?'],['chat','blue','Tin nhắn','Tin nhắn nào chưa đọc?']);
AI_SUGG.push('Tóm tắt tình hình dự án hôm nay','Hoá đơn nào quá hạn?','Tạo công việc: Kiểm tra cốt thép sàn tầng 5','Quy định nghỉ phép thế nào?');
AI.push({re:/tóm tắt|tình hình|tổng quan/, fn:() => {
  const p = proj(S.pid), g = ganttStats(p.id), a = attSummary(), f = finStats(p.id);
  return `<b>${esc(p.name)}</b>` + list([`Tiến độ ${g.actual}% (kế hoạch ${g.plan}%), ${g.late} hạng mục trễ`, `Nhân công ${a.present}/${a.total}, ${attPending().length} chấm công ngoài vùng chờ duyệt`, `Đã chi ${trd(f.spent)}/${trd(f.budget)}, ${f.overdue.length} hoá đơn quá hạn`, `Tồn quỹ ${trd(f.cash)}, 4 tuần tới ròng ${trd(f.net4)}`, `${chatUnreadTotal()} tin nhắn chưa đọc`]);
}});
AI.push({re:/khách|deal|chốt|pipeline|cơ hội|kinh doanh/, fn:() => {
  const l = S.leads.filter(x => ['nego','quote'].includes(x.stage)).sort((a, b) => b.value - a.value);
  return `Pipeline đang mở <b>${ty(sum(S.leads.filter(x => OPEN_ST.includes(x.stage)), x => x.value))}</b>. Cơ hội sắp chốt:` + list(l.map(x => `<button class="link" data-act="lead" data-id="${x.id}">${esc(x.name)} — ${esc(x.proj)}</button> · ${ty(x.value)} · ${stg(x.stage)[1]}`));
}});
AI.push({re:/tin|nhắn|chat|chưa đọc/, fn:() => {
  const l = S.convs.filter(c => convUnread(c.id));
  return l.length ? `Có ${chatUnreadTotal()} tin chưa đọc:` + list(l.map(c => `<button class="link" data-act="cv-go" data-id="${c.id}">${esc(convName(c))}</button> — ${convUnread(c.id)} tin`)) : 'Bạn đã đọc hết tin nhắn.';
}});
ACT['cv-go'] = (el, d) => { S.cv = d.id; nav('chat'); };
