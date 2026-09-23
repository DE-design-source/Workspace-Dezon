/* SiteFlow — Quản lý dự án (Tiến độ Gantt + Nhiệm vụ & điểm thưởng), Chấm công */

/* ================= dữ liệu mẫu ================= */
SEEDS.push(s => {
  const T = (id, name, start, end, progress, owner, extra = {}) => ({id, name, start:md(start), end:md(end), progress, owner, crit:false, notes:'', comments:[], ...extra});
  const MS = (id, name, date, done, owner = 'Ban chỉ huy công trường') => ({id, name, start:md(date), end:md(date), progress:done ? 100 : 0, owner, ms:true, notes:'', comments:[]});
  const $$ = (id, name, date, kind, amount, owner) => ({id, name, start:md(date), end:md(date), progress:0, owner, money:kind, amount, notes:'', comments:[]});
  s.gantt = {
    riverside:[
      {id:'ph1', name:'Chuẩn bị & xin phép', tasks:[
        T('t1','Khảo sát địa chất & hiện trạng','2026-08-01','2026-08-08',100,'Phòng kỹ thuật'),
        T('t2','Lập hồ sơ thiết kế cơ sở','2026-08-05','2026-08-20',100,'Tư vấn thiết kế',{crit:true}),
        T('t3','Xin giấy phép xây dựng','2026-08-15','2026-09-01',100,'Bộ phận pháp lý',{crit:true}),
        MS('m1','Khởi công','2026-09-01',true),
        $$('c1','Thu tạm ứng đợt 1','2026-09-01','in',1700,'Kế toán')
      ]},
      {id:'ph2', name:'Kết cấu khối đế Tòa A', tasks:[
        T('t4','Đổ bê tông sàn tầng 4','2026-08-28','2026-09-18',80,'Đội thi công B',{crit:true, notes:'Chờ thép đợt 2 từ Hòa Phát.'}),
        T('t5','Lắp đặt điện tầng 2','2026-09-05','2026-09-20',70,'Đội MEP'),
        T('t6','Đổ bê tông sàn tầng 5','2026-09-15','2026-10-02',25,'Đội thi công B',{crit:true}),
        $$('c2','Thanh toán thép & xi măng','2026-09-05','out',195,'Mua hàng')
      ]},
      {id:'ph3', name:'Thi công phần móng Tòa B', tasks:[
        T('t7','San lấp mặt bằng','2026-09-01','2026-09-08',100,'Đội thi công A'),
        T('t8','Ép cọc & gia cố nền','2026-09-05','2026-09-12',100,'Đội thi công A',{crit:true}),
        T('t9','Đổ bê tông đài móng','2026-09-14','2026-09-28',45,'Đội thi công B',{crit:true}),
        T('t10','Nghiệm thu phần móng','2026-09-26','2026-10-02',0,'Tư vấn giám sát',{crit:true}),
        MS('m2','Nghiệm thu phần móng khu B','2026-09-30',false,'Tư vấn giám sát'),
        $$('c3','Thu đợt 2 — nghiệm thu móng','2026-09-30','in',480,'Kế toán'),
        $$('c4','Thanh toán thầu phụ Nam Á','2026-10-02','out',310,'Kế toán')
      ]},
      {id:'ph4', name:'Kết cấu thân Tòa B', tasks:[
        T('t11','Đổ cột & vách tầng 1–5','2026-09-28','2026-10-20',0,'Đội thi công B',{crit:true}),
        T('t12','Đổ sàn tầng 1–5','2026-10-10','2026-11-05',0,'Đội thi công B'),
        T('t13','Đổ cột & vách tầng 6–10','2026-11-05','2026-11-25',0,'Đội thi công C',{crit:true}),
        T('t14','Đổ sàn tầng 6–10','2026-11-20','2026-12-15',0,'Đội thi công C'),
        MS('m3','Cất nóc','2026-12-15',false)
      ]},
      {id:'ph5', name:'Hoàn thiện & lắp đặt MEP', tasks:[
        T('t15','Lắp đặt điện nước (MEP thô)','2026-10-20','2026-11-30',0,'Đội MEP'),
        $$('c5','Thanh toán Cơ điện MEP Sài Gòn','2026-10-20','out',420,'Kế toán'),
        T('t16','Xây tô & chống thấm','2026-11-15','2026-12-31',0,'Đội hoàn thiện'),
        T('t17','Sơn bả & ốp lát','2026-12-10','2027-01-31',0,'Đội hoàn thiện'),
        MS('m4','Bàn giao Giai đoạn 2','2027-02-28',false)
      ]}
    ],
    b12:[
      {id:'bp1', name:'Phần móng', tasks:[
        T('b1','Định vị tim mốc & đào móng','2026-08-18','2026-08-25',100,'Đội thi công A'),
        T('b2','Đổ bê tông lót & cốt thép móng','2026-08-24','2026-09-05',100,'Đội thi công A',{crit:true}),
        T('b3','Đổ bê tông móng','2026-09-06','2026-09-16',100,'Đội thi công A',{crit:true}),
        T('b4','Xây tường móng & đà kiềng','2026-09-15','2026-09-27',40,'Đội thi công A')
      ]},
      {id:'bp2', name:'Phần thân', tasks:[
        T('b5','Cột & sàn tầng 1','2026-09-28','2026-10-15',0,'Đội thi công A',{crit:true}),
        T('b6','Cột & sàn tầng 2–3','2026-10-15','2026-11-15',0,'Đội thi công A'),
        MS('bm1','Cất nóc','2026-11-20',false)
      ]}
    ]
  };
  const stepNames = ['Chuẩn bị mặt bằng','Định vị tim mốc','Đào móng','Đổ bê tông lót móng','Cốt thép & cốp pha móng','Đổ bê tông móng','Xây tường móng','Cột & sàn tầng 1','Cột & sàn tầng 2–3','Xây tường bao','Đi ống điện nước âm','Tô trát','Chống thấm','Ốp lát','Sơn bả & bàn giao'];
  const subs = [['Chụp ảnh hiện trạng trước khi làm',20],['Hoàn thành khối lượng theo bản vẽ',50],['Tự kiểm tra & gửi nghiệm thu nội bộ',30]];
  s.quest = {pid:'b12', name:'Quy trình thi công nhà phố — Lô B12', team:'Đội thi công A', player:'lv', streak:12, lastSafety:dayISO(-1),
    steps:stepNames.map((n, i) => ({name:n, tasks:subs.map(([t, p], j) => ({name:t, pts:p, done:i < 4 || (i === 4 && j === 0), by:'lv', date:dayISO(i < 4 ? -(20 - i * 4) : -1)}))})),
    pts:{lv:{week:220, total:2860, avail:1240}, pb:{week:180, total:2310, avail:640}, nh:{week:165, total:2140, avail:980}, vn:{week:150, total:1980, avail:420}, ts:{week:120, total:1650, avail:760}, hb:{week:95, total:1320, avail:300}, nl:{week:80, total:1110, avail:510}},
    rewards:[
      {id:'r1', name:'Phiếu ăn trưa miễn phí (1 tuần)', pts:300, icon:'gift'},
      {id:'r2', name:'Áo đồng phục cao cấp', pts:500, icon:'hardhat'},
      {id:'r3', name:'Voucher đổ xăng 200.000đ', pts:600, icon:'coin'},
      {id:'r4', name:'Bộ dụng cụ bảo hộ lao động cao cấp', pts:900, icon:'hardhat'},
      {id:'r5', name:'Ngày nghỉ phép thêm (1 ngày)', pts:1200, icon:'star'},
      {id:'r6', name:'Thưởng tiền mặt 500.000đ', pts:2000, icon:'wallet'}
    ],
    redeems:[{who:'nh', reward:'Áo đồng phục cao cấp', pts:500, date:md('2026-09-18')}, {who:'pb', reward:'Phiếu ăn trưa miễn phí (1 tuần)', pts:300, date:md('2026-09-10')}],
    base:9730};
  const R = (p, site, inT, status, extra = {}) => ({p, site, in:inT, out:null, status, ...extra});
  s.att = {
    sites:[
      {id:'ra', pid:'riverside', name:'Riverside — Tòa A', addr:'123 Đại lộ Nguyễn Văn Linh, Q7', radius:100, cap:70, present:62},
      {id:'rb', pid:'riverside', name:'Riverside — Tòa B', addr:'125 Đại lộ Nguyễn Văn Linh, Q7', radius:100, cap:50, present:41},
      {id:'kbc', pid:'', name:'Kho vật tư Bình Chánh', addr:'QL1A, Bình Chánh', radius:100, cap:30, present:25}
    ],
    rec:[R('lv','ra','06:58','ok'), R('nh','ra','07:02','ok'), R('pb','ra','07:15','late'), R('hb','ra','07:20','late'), R('nl','ra','06:50','ok'), R('vn','rb','06:55','ok'), R('ts','rb',null,'none'), R('dp','rb','08:00','ok'), R('ct','kbc','07:10','out'), R('lt','kbc','07:05','ok')],
    approvals:[
      {id:'ap1', p:'ct', name:'Cao Nhật Tân', site:'kbc', time:'07:10', dist:180, radius:100, status:'pending', date:todayISO(), note:'Nhận vật tư tại cổng sau của kho'},
      {id:'ap0', p:'', name:'Nguyễn Văn Long', site:'kbc', time:'07:25', dist:140, radius:100, status:'ok', date:dayISO(-1), by:'ta'},
      {id:'apx', p:'', name:'Đỗ Văn Kiên', site:'rb', time:'06:40', dist:420, radius:100, status:'no', date:md('2026-09-18'), by:'ta'}
    ],
    week:[['lv',5,2460],['nh',5,2430],['pb',4,1930],['vn',5,2445],['ct',5,2360],['hb',5,2390],['nl',5,2475],['ts',3,1440]],
    mine:{p:'lv', site:'ra', in:'07:02', out:null, task:'Đổ bê tông sàn tầng 3', weekMin:30 * 60, hist:[{date:md('2026-09-18'), in:'08:00', out:'17:05'}, {date:md('2026-09-17'), in:'07:58', out:'17:10'}, {date:md('2026-09-16'), in:'07:55', out:'17:00'}]}
  };
  s.sub.pm = 'gantt';
});

/* ================= TIẾN ĐỘ ================= */
const isWork = t => !t.ms && !t.money;
const allTasks = pid => (S.gantt[pid] || []).flatMap(ph => ph.tasks.map(t => ({...t, phase:ph.name})));
function gStatus(t){
  if (t.ms) return t.progress >= 100 ? 'done' : daysLeft(t.start) < 0 ? 'late' : 'todo';
  if (t.progress >= 100) return 'done';
  if (daysLeft(t.end) < 0) return 'late';
  if (daysLeft(t.start) <= 0) return 'doing';
  return 'todo';
}
const GST = {done:['Hoàn thành','green'], doing:['Đang thực hiện','yellow'], late:['Trễ hạn','red'], todo:['Chưa bắt đầu','gray']};
function planAt(pid, date){
  const ts = allTasks(pid).filter(isWork); let w = 0, v = 0;
  ts.forEach(t => { const dur = diffDays(t.start, t.end) + 1; w += dur; v += clamp((diffDays(t.start, date) + 1) / dur, 0, 1) * dur; });
  return w ? v / w * 100 : 0;
}
function ganttStats(pid){
  const p = proj(pid);
  if (!S.gantt[pid]) return {actual:p ? p.progress : 0, plan:p ? p.progress : 0, count:0, late:0};
  const ts = allTasks(pid).filter(isWork); let w = 0, v = 0;
  ts.forEach(t => { const dur = diffDays(t.start, t.end) + 1; w += dur; v += t.progress / 100 * dur; });
  return {actual:Math.round(w ? v / w * 100 : 0), plan:Math.round(planAt(pid, todayISO())), count:ts.length, late:ts.filter(t => gStatus(t) === 'late').length};
}
const ganttLate = pid => allTasks(pid).filter(t => isWork(t) && gStatus(t) === 'late').sort((a, b) => a.end.localeCompare(b.end));
function ganttSeries(pid){
  const ts = allTasks(pid).filter(isWork);
  if (!ts.length) return {labels:['Nay'], plan:[0], actual:[0], nowIdx:0};
  const start = ts.map(t => t.start).sort()[0], end = ts.map(t => t.end).sort().slice(-1)[0];
  const weeks = Math.max(2, Math.min(24, Math.ceil(diffDays(start, end) / 7) + 1));
  const g = ganttStats(pid), pn = planAt(pid, todayISO()), ratio = pn ? g.actual / pn : 1;
  const labels = [], plan = [], actual = []; let nowIdx = 0;
  for (let i = 0; i < weeks; i++){
    const d = addDays(start, i * 7);
    labels.push('T' + (i + 1)); plan.push(Math.round(planAt(pid, d)));
    if (d <= todayISO()){ actual.push(Math.round(planAt(pid, d) * ratio)); nowIdx = i; } else actual.push(null);
  }
  if (nowIdx < weeks - 1 || addDays(start, nowIdx * 7) < todayISO()){ actual[nowIdx] = g.actual; }
  return {labels, plan, actual, nowIdx};
}
function ganttTemplate(p){
  const s = p.start || todayISO(), team = p.team || 'Đội thi công A';
  const T = (name, a, b, owner, crit) => ({id:uid(), name, start:addDays(s, a), end:addDays(s, b), progress:0, owner, crit:!!crit, notes:'', comments:[]});
  const tpl = {
    'Nhà phố':[['Phần móng',[['Định vị & đào móng',0,6],['Bê tông lót & cốt thép móng',6,14,1],['Đổ bê tông móng',14,20,1]]],['Phần thân',[['Cột & sàn tầng 1',21,38,1],['Cột & sàn các tầng trên',38,70]]],['Hoàn thiện',[['Xây tô & chống thấm',70,95],['Ốp lát, sơn bả',95,120]]]],
    'Biệt thự':[['Chuẩn bị',[['Khảo sát & phá dỡ',0,10]]],['Kết cấu',[['Móng & tầng hầm',10,40,1],['Khung & sàn',40,90,1]]],['Hoàn thiện',[['MEP',80,130],['Nội thất & cảnh quan',120,180]]]]
  }[p.type] || [['Chuẩn bị',[['Chuẩn bị mặt bằng',0,10]]],['Thi công chính',[['Kết cấu',10,60,1],['MEP',50,90]]],['Hoàn thiện',[['Hoàn thiện & vệ sinh',90,120]]]];
  const phases = tpl.map(([name, rows]) => ({id:uid(), name, tasks:rows.map(([n, a, b, c]) => T(n, a, b, team, c))}));
  phases[0].tasks.unshift({id:uid(), name:'Khởi công', start:s, end:s, progress:0, owner:'Ban chỉ huy công trường', ms:true, notes:'', comments:[]});
  const last = phases[phases.length - 1].tasks.slice(-1)[0];
  phases[phases.length - 1].tasks.push({id:uid(), name:'Bàn giao', start:addDays(last.end, 3), end:addDays(last.end, 3), progress:0, owner:'Ban chỉ huy công trường', ms:true, notes:'', comments:[]});
  return phases;
}
function findGTask(pid, id){ for (const ph of S.gantt[pid] || []) { const t = ph.tasks.find(x => x.id === id); if (t) return {ph, t}; } return {}; }

MOD.pm = () => {
  const cur = sub('pm', 'gantt');
  const p = proj(S.pid) || S.projects[0];
  const tabs = subtabs('pm', [['gantt','Tiến độ'],['quest','Nhiệm vụ & điểm thưởng']], 'gantt');
  const body = cur === 'gantt' ? ganttView(p) : questView();
  return head('Quản lý dự án', esc(p.name) + (cur === 'gantt' ? ' — tiến độ Gantt, mốc quan trọng và dòng tiền gắn với công việc.' : ' — quy trình game hoá, đổi quà và bảng xếp hạng.'),
    cur === 'gantt' && S.gantt[p.id] ? `<button class="btn" data-act="gtask-new">${ic('plus', 15)}Thêm công việc</button>` : '') + tabs + body;
};
function ganttView(p){
  if (!S.gantt[p.id]) return `<div class="card pad empty">Dự án chưa có khung tiến độ. <button class="btn sm" data-act="setup-go" data-id="${p.id}" style="margin-left:8px">Thiết lập thi công</button></div>`;
  const g = ganttStats(p.id), zoom = ui.gz || 'week', dw = zoom === 'week' ? 18 : 6, filt = ui.gf || 'all', LW = 360;
  const all = allTasks(p.id);
  const start = addDays(all.map(t => t.start).sort()[0], -3), end = addDays(all.map(t => t.end).sort().slice(-1)[0], 10);
  const N = diffDays(start, end) + 1, W = N * dw, X = d => diffDays(start, d) * dw;
  let hdr = '';
  for (let i = 0; i < N; i++){
    const d = parseD(addDays(start, i));
    if (d.getDate() === 1 || i === 0) hdr += `<span class="g-month" style="left:${i * dw}px">Tháng ${d.getMonth() + 1}/${d.getFullYear()}</span>`;
    if (zoom === 'week' && d.getDay() === 1) hdr += `<span class="g-week" style="left:${i * dw}px">${pad(d.getDate())}</span>`;
  }
  const counts = {};
  all.filter(isWork).forEach(t => { const s = gStatus(t); counts[s] = (counts[s] || 0) + 1; });
  let rows = '';
  S.gantt[p.id].forEach(ph => {
    const ts = ph.tasks.filter(t => filt === 'all' || (filt === 'ms' ? (t.ms || t.money) : isWork(t) && gStatus(t) === filt));
    if (!ts.length) return;
    const ps = ph.tasks.map(t => t.start).sort()[0], pe = ph.tasks.map(t => t.end).sort().slice(-1)[0];
    const pw = ph.tasks.filter(isWork), pp = pw.length ? Math.round(sum(pw, t => t.progress * (diffDays(t.start, t.end) + 1)) / sum(pw, t => diffDays(t.start, t.end) + 1)) : 0;
    rows += `<div class="g-row phase"><div class="g-left"><span class="nm">${esc(ph.name)}</span><span class="ow">${pp}%</span></div><div class="g-right" style="width:${W}px"><span class="g-phase" style="left:${X(ps)}px;width:${(diffDays(ps, pe) + 1) * dw}px"></span></div></div>`;
    ts.forEach(t => {
      let mark;
      if (t.ms) mark = `<span class="g-ms" style="left:${X(t.start) + dw / 2 - 8}px;background:${t.progress >= 100 ? 'var(--green)' : 'var(--purple)'}"></span><span class="g-lbl" style="left:${X(t.start) + dw / 2 + 12}px">${esc(t.name)} · ${fmtDate(t.start)}</span>`;
      else if (t.money) mark = `<span class="g-coin" style="left:${X(t.start) + dw / 2 - 9}px;--c:${t.money === 'in' ? 'var(--green)' : 'var(--orange)'}">${t.money === 'in' ? '+' : '−'}</span><span class="g-lbl" style="left:${X(t.start) + dw / 2 + 13}px">${t.money === 'in' ? 'Thu' : 'Chi'} ${trd(t.amount)}</span>`;
      else { const st = gStatus(t), c = GST[st][1] === 'gray' ? 'gray' : GST[st][1]; mark = `<span class="g-bar ${t.crit ? 'crit' : ''}" style="left:${X(t.start)}px;width:${(diffDays(t.start, t.end) + 1) * dw}px;--c:${cv(c)};--t:${ct(c)}" title="${esc(t.name)}: ${t.progress}%"><i style="width:${t.progress}%"></i></span><span class="g-lbl" style="left:${X(t.end) + dw + 6}px">${t.progress}%${t.crit ? ' · găng' : ''}</span>`; }
      const icon = t.ms ? ic('flame', 13) : t.money ? ic('coin', 13) : `<span class="dot" style="--c:${cv(GST[gStatus(t)][1] === 'gray' ? 'gray' : GST[gStatus(t)][1])}"></span>`;
      rows += `<div class="g-row task" data-act="gtask" data-pid="${p.id}" data-id="${t.id}" tabindex="0" role="button"><div class="g-left">${icon}<span class="nm">${esc(t.name)}</span><span class="ow">${esc(t.owner)}</span></div><div class="g-right" style="width:${W}px">${mark}</div></div>`;
    });
  });
  const todayX = LW + X(todayISO()) + dw / 2;
  const chip = (k, l, n) => `<button class="fchip sm ${filt === k ? 'on' : ''}" data-act="gfilt" data-f="${k}">${l}${n != null ? ' · ' + n : ''}</button>`;
  return `
    <div class="card pad"><div class="row between" style="flex-wrap:wrap;gap:12px"><div style="flex:1;min-width:240px"><div class="kpi-row"><span>Tổng tiến độ · kế hoạch ${g.plan}%</span><span>${g.actual}%</span></div>${bar(g.actual, 'var(--purple)', 'thick')}</div>
      <div class="row"><div class="seg"><button class="${zoom === 'week' ? 'on' : ''}" data-act="gzoom" data-z="week">Tuần</button><button class="${zoom === 'month' ? 'on' : ''}" data-act="gzoom" data-z="month">Tháng</button></div><button class="btn line sm" data-act="gtoday">Về hôm nay</button></div></div></div>
    <div class="toolbar">${chip('all', 'Tất cả')}${chip('done', 'Hoàn thành', counts.done || 0)}${chip('doing', 'Đang thực hiện', counts.doing || 0)}${chip('late', 'Trễ hạn', counts.late || 0)}${chip('todo', 'Chưa bắt đầu', counts.todo || 0)}${chip('ms', 'Mốc & thu chi')}
      <span style="flex:1"></span>${legend([['var(--purple)','Mốc quan trọng'],['var(--green)','Thu tiền'],['var(--orange)','Chi tiền'],['var(--red)','Hôm nay']])}</div>
    <div class="gantt" id="gantt" style="--dw:${dw}px;--lw:${LW}px"><div class="g-inner" style="width:${LW + W}px">
      <div class="g-row head"><div class="g-left"><span class="nm">Công việc</span><span class="ow">Phụ trách</span></div><div class="g-right" style="width:${W}px">${hdr}</div></div>
      ${rows || '<div class="empty">Không có công việc phù hợp bộ lọc</div>'}
      <div class="g-today" style="left:${todayX}px"><span>Hôm nay</span></div>
    </div></div>`;
}
AFTER.pm = () => { const g = $('#gantt'); if (g && !ui.gKeep){ const t = g.querySelector('.g-today'); if (t) g.scrollLeft = Math.max(0, parseFloat(t.style.left) - 360 - g.clientWidth * .35); } ui.gKeep = false; };
ACT.gzoom = (el, d) => { ui.gz = d.z; render(); };
ACT.gfilt = (el, d) => { ui.gf = d.f; render(); };
ACT.gtoday = () => render();
ACT.gtask = (el, d) => { const {ph, t} = findGTask(d.pid, d.id); if (t) gTaskModal(d.pid, ph, t); };
ACT['gtask-new'] = () => { gTaskModal(S.pid, null, null); };
function gTaskModal(pid, ph, t){
  const isNew = !t;
  t = t || {id:'', name:'', start:todayISO(), end:dayISO(7), progress:0, owner:'Đội thi công A', crit:false, notes:'', comments:[]};
  const kind = t.ms ? 'ms' : t.money ? 'money' : 'task';
  const st = isWork(t) ? gStatus(t) : null;
  showModal(`<form class="modal wide" data-form="gtask" data-id="${t.id}" data-pid="${pid}" data-kind="${kind}">
    <h3>${isNew ? 'Công việc mới' : esc(t.name)}${closeBtn()}</h3>
    ${!isNew ? `<div class="row" style="margin-top:-6px">${ph ? pill(ph.name, 'gray') : ''}${st ? pill(GST[st][0], GST[st][1]) : ''}${t.crit ? pill('Đường găng', 'red') : ''}${t.money ? pill(t.money === 'in' ? 'Thu tiền' : 'Chi tiền', t.money === 'in' ? 'green' : 'orange') : ''}${t.ms ? pill('Mốc quan trọng', 'purple') : ''}</div>` : ''}
    <div class="row2"><label class="field">Tên công việc<input id="gt-name" name="name" required value="${esc(t.name)}"></label>
      <label class="field">Giai đoạn<select id="gt-phase" name="phase">${opt((S.gantt[pid] || []).map(x => [x.id, x.name]), ph ? ph.id : '')}</select></label></div>
    <div class="row3"><label class="field">${kind === 'task' ? 'Bắt đầu' : 'Ngày'}<input id="gt-start" type="date" name="start" required value="${t.start}"></label>
      ${kind === 'task' ? `<label class="field">Kết thúc<input id="gt-end" type="date" name="end" required value="${t.end}"></label>` : kind === 'money' ? `<label class="field">Số tiền (triệu)<input id="gt-amount" type="number" name="amount" value="${t.amount}"></label>` : '<span></span>'}
      <label class="field">Phụ trách<input id="gt-owner" name="owner" value="${esc(t.owner)}" list="owners"></label></div>
    <datalist id="owners">${[...new Set(['Đội thi công A','Đội thi công B','Đội thi công C','Đội MEP','Đội hoàn thiện','Tư vấn giám sát','Kế toán', ...S.people.map(x => x.name)])].map(x => `<option value="${esc(x)}">`).join('')}</datalist>
    ${kind !== 'money' ? `<label class="field">Tiến độ hoàn thành: <b id="gt-pv" style="color:var(--ink)">${t.progress}%</b><input id="gt-progress" type="range" name="progress" min="0" max="100" step="5" value="${t.progress}" data-input="gt-pv"></label>` : ''}
    ${kind === 'task' ? `<label class="checks"><label><input type="checkbox" name="crit" ${t.crit ? 'checked' : ''}>Thuộc đường găng (critical path)</label></label>` : ''}
    <label class="field">Ghi chú<textarea id="gt-notes" name="notes" placeholder="Chưa có ghi chú cho công việc này.">${esc(t.notes)}</textarea></label>
    ${!isNew ? `<div class="field">Bình luận (${t.comments.length})<div class="stack" style="gap:6px">${t.comments.map(c => `<div class="comment"><small>${esc(person(c.by).name)} · ${ago(c.t)}</small>${esc(c.text)}</div>`).join('')}</div>
      <div class="row"><input id="gc-in" style="flex:1" placeholder="Viết bình luận… (Enter để gửi, @ để nhắc nhân sự)"><button type="button" class="btn line sm" data-act="gcomment">Gửi</button></div></div>` : ''}
    <div class="m-actions">${!isNew ? delBtn('gtask') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">${isNew ? 'Thêm công việc' : 'Lưu thay đổi'}</button></div>
  </form>`);
}
INP['gt-pv'] = el => { $('#gt-pv').textContent = el.value + '%'; };
FORM.gtask = (v, f) => {
  const pid = f.dataset.pid, phases = S.gantt[pid];
  const {ph, t} = findGTask(pid, f.dataset.id);
  const target = phases.find(x => x.id === v.phase) || phases[0];
  const kind = f.dataset.kind;
  const data = {name:v.name.trim(), start:v.start, end:kind === 'task' ? (v.end < v.start ? v.start : v.end) : v.start, owner:v.owner, notes:v.notes};
  if (kind !== 'money') data.progress = +v.progress;
  if (kind === 'task') data.crit = !!v.crit;
  if (kind === 'money') data.amount = +v.amount || 0;
  if (t){
    const before = t.progress;
    Object.assign(t, data);
    if (ph !== target){ ph.tasks = ph.tasks.filter(x => x !== t); target.tasks.push(t); }
    if (before !== t.progress) log(`${t.name}: ${before}% → ${t.progress}%`, 'purple');
    if (before < 100 && t.progress >= 100 && t.ms) botPost('Đạt mốc', `Mốc “${t.name}” đã hoàn thành.`, 'green', projName(pid), 'pm');
  } else {
    target.tasks.push({id:uid(), progress:0, crit:false, comments:[], ...data});
    log('Thêm công việc ' + data.name, 'purple');
  }
  closeModal(); ui.gKeep = true; render(); toast('Đã lưu tiến độ');
};
ACT.gcomment = () => {
  const inp = $('#gc-in'), text = inp.value.trim(); if (!text) return;
  const f = inp.closest('form'), {ph, t} = findGTask(f.dataset.pid, f.dataset.id);
  t.comments.push({by:S.me, text, t:Date.now()}); save();
  const m = /@([\p{L}]+(?:\s[\p{L}]+)?)/u.exec(text);
  if (m) toast('Đã nhắc ' + m[1]);
  gTaskModal(f.dataset.pid, ph, t);
};
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'gc-in'){ e.preventDefault(); ACT.gcomment(); } });
DEL.gtask = (id, f) => { const {ph} = findGTask(f.dataset.pid, id); if (ph) ph.tasks = ph.tasks.filter(x => x.id !== id); };
SEARCH.push(hit => Object.entries(S.gantt).flatMap(([pid, phs]) => phs.flatMap(ph => ph.tasks.filter(t => hit(t.name)).map(t => ({icon:'gantt', label:t.name, sub:projName(pid), run:() => { S.pid = pid; S.sub.pm = 'gantt'; nav('pm'); const r = findGTask(pid, t.id); gTaskModal(pid, r.ph, r.t); }})))));

/* ================= NHIỆM VỤ & ĐIỂM THƯỞNG ================= */
const questDone = () => S.quest.steps.filter(s => s.tasks.every(t => t.done)).length;
const questPts = () => [sum(S.quest.steps.flatMap(s => s.tasks.filter(t => t.done)), t => t.pts), sum(S.quest.steps.flatMap(s => s.tasks), t => t.pts)];
function questView(){
  const q = S.quest, cur = ui.qtab || 'overview';
  const tabs = `<div class="seg">${[['overview','Tổng quan'],['tasks','Nhiệm vụ'],['rewards','Đổi quà'],['rank','Bảng xếp hạng']].map(([k, l]) => `<button class="${cur === k ? 'on' : ''}" data-act="qtab" data-k="${k}">${l}</button>`).join('')}</div>`;
  const rank = Object.entries(q.pts).sort((a, b) => b[1].week - a[1].week);
  const medal = i => { const c = ['yellow','gray','brown'][i] || 'gray'; return `<span class="medal" style="--c:${cv(c === 'gray' ? 'ink-2' : c)};--t:${ct(c)}">${i + 1}</span>`; };
  const [got, tot] = questPts(), done = questDone();
  let body;
  if (cur === 'overview'){
    const weekDone = q.steps.flatMap(s => s.tasks).filter(t => t.done && daysLeft(t.date) > -7).length;
    const safeToday = q.lastSafety === todayISO();
    body = `<div class="stats">
      ${stat('Nhân sự tham gia', 24, 'Trên 3 đội thi công')}
      ${stat('Tổng điểm đã phát', num(q.base + got), 'Từ đầu dự án đến nay')}
      ${stat('Nhiệm vụ hoàn thành tuần này', weekDone, 'trong quy trình Lô B12')}
      ${stat('Quà đã đổi', q.redeems.length + 5, 'Xem lịch sử tại Đổi quà')}
    </div>
    <div class="grid-3-2"><div class="stack">
      <h2 class="sec-title" style="margin:0">Các quy trình đang “chơi”</h2>
      <div class="card pad stack"><div class="row between"><div><b style="font-weight:600">${esc(q.name)}</b><div class="small muted">${q.steps.length} bước · ${esc(q.team)}</div></div><button class="btn sm" data-act="qtab" data-k="tasks">Chơi tiếp</button></div><div class="kpi-row" style="margin:0"><span>${done}/${q.steps.length} bước · ${num(got)}/${num(tot)} điểm</span><span>${Math.round(done / q.steps.length * 100)}%</span></div>${bar(done / q.steps.length * 100, 'var(--pink)', 'thick')}</div>
      <div class="card pad row between" style="flex-wrap:wrap"><div class="row"><span class="sq" style="--c:var(--orange);--t:var(--orange-t)">${ic('flame', 18)}</span><div><b style="font-weight:600">An toàn lao động hàng ngày</b><div class="small muted">Toàn công trường · chuỗi hiện tại <b style="color:var(--orange)">${q.streak} ngày</b></div></div></div><button class="btn ${safeToday ? 'ghost' : 'ok'} sm" data-act="q-safety" ${safeToday ? 'disabled' : ''}>${safeToday ? 'Đã điểm danh hôm nay' : 'Điểm danh an toàn hôm nay'}</button></div>
      <div class="card pad row" style="opacity:.6"><span class="sq" style="--c:var(--muted);--t:var(--chip)">${ic('check', 18)}</span><div><b style="font-weight:600">Quy trình nghiệm thu hoàn công</b><div class="small muted">Sắp ra mắt — đang thiết kế nhiệm vụ & mốc điểm</div></div></div>
    </div>
    <div class="card list-card"><h2 class="sec-title">Bảng xếp hạng tuần này <button class="link" data-act="qtab" data-k="rank">Xem tất cả ›</button></h2>
      ${rank.slice(0, 5).map(([id, v], i) => `<div class="li">${medal(i)}${av(id, 30)}<span class="ell"><b>${esc(person(id).name)}</b><small>${esc(person(id).team)}</small></span><span class="end"><b class="num">${num(v.week)}</b><small>điểm</small></span></div>`).join('')}
    </div></div>`;
  } else if (cur === 'tasks'){
    const curStep = q.steps.findIndex(s => !s.tasks.every(t => t.done));
    body = `<div class="card pad row between" style="flex-wrap:wrap;gap:12px"><div><b style="font-weight:600">${esc(q.name)}</b><div class="small muted">${q.steps.length} bước chính · ${esc(q.team)} · Mỗi bước gồm các nhiệm vụ nhỏ, hoàn thành để nhận điểm</div></div>
      <div class="row"><label class="field" style="flex-direction:row;align-items:center;gap:8px">Người thực hiện<select data-change="q-player">${opt(S.people.filter(x => x.team === q.team).map(x => [x.id, x.name]), q.player)}</select></label><span class="pill pink">${num(got)} / ${num(tot)} điểm</span></div></div>
    <div class="steps">${q.steps.map((s, i) => {
      const dn = s.tasks.every(t => t.done), state = dn ? 'done' : i === curStep ? 'cur' : i > curStep ? 'lock' : '';
      return `<div class="step ${state}"><div class="step-h"><span class="step-n">${dn ? ic('check', 14) : i + 1}</span>${esc(s.name)}<span style="margin-left:auto">${dn ? pill('Hoàn thành', 'green') : i === curStep ? pill('Đang làm', 'pink') : pill('Chưa mở', 'gray')}</span></div>
        ${state === 'lock' ? '' : s.tasks.map((t, j) => `<label class="qtask ${t.done ? 'done' : ''}"><input type="checkbox" data-change="q-task" data-s="${i}" data-t="${j}" ${t.done ? 'checked' : ''}><span>${esc(t.name)}</span>${t.done ? `<small class="muted">${esc(person(t.by).name)} · ${fmtDate(t.date)}</small>` : ''}<span class="pts">+${t.pts}</span></label>`).join('')}</div>`;
    }).join('')}</div>`;
  } else if (cur === 'rewards'){
    const pl = q.pts[q.player] || {avail:0};
    body = `<div class="card pad row between" style="flex-wrap:wrap;gap:12px">${av(q.player, 42)}<div style="flex:1"><b style="font-weight:600">${esc(person(q.player).name)} — ${esc(person(q.player).team)}</b><div class="small muted">Điểm khả dụng để đổi quà</div></div><b style="font-size:24px;color:var(--pink)" class="num">${num(pl.avail)} điểm</b>
      <label class="field" style="flex-direction:row;align-items:center;gap:8px">Đổi cho<select data-change="q-player">${opt(Object.keys(q.pts).map(id => [id, person(id).name]), q.player)}</select></label></div>
    <div class="rewards">${q.rewards.map(r => `<div class="card reward"><span class="sq" style="--c:var(--pink);--t:var(--pink-t)">${ic(r.icon, 18)}</span><b>${esc(r.name)}</b><div class="row between"><span class="pill pink">${num(r.pts)} điểm</span><button class="btn sm" data-act="q-redeem" data-id="${r.id}" ${pl.avail < r.pts ? 'disabled' : ''}>${pl.avail < r.pts ? 'Không đủ điểm' : 'Đổi ngay'}</button></div></div>`).join('')}</div>
    <div class="card list-card"><h2 class="sec-title">Lịch sử đổi quà gần đây</h2>${q.redeems.map(r => `<div class="li">${av(r.who, 30)}<span class="ell"><b>${esc(person(r.who).name)} — ${esc(r.reward)}</b><small>${fmtDate(r.date)}</small></span><span class="end late">−${num(r.pts)} điểm</span></div>`).join('')}</div>`;
  } else {
    body = `<div class="table-wrap"><table><thead><tr><th>Hạng</th><th>Nhân viên</th><th>Đội</th><th class="r">Điểm tuần này</th><th class="r">Tổng điểm</th><th class="r">Khả dụng</th></tr></thead><tbody>
      ${rank.map(([id, v], i) => `<tr><td>${medal(i)}</td><td><div class="who">${av(id, 26)}${esc(person(id).name)}</div></td><td>${esc(person(id).team)}</td><td class="r b">${num(v.week)}</td><td class="r">${num(v.total)}</td><td class="r">${num(v.avail)}</td></tr>`).join('')}
    </tbody></table></div>`;
  }
  return tabs + body;
}
ACT.qtab = (el, d) => { ui.qtab = d.k; S.sub.pm = 'quest'; render(); };
CHG['q-player'] = el => { S.quest.player = el.value; render(); };
CHG['q-task'] = el => {
  const q = S.quest, t = q.steps[+el.dataset.s].tasks[+el.dataset.t], pl = q.pts[q.player] || (q.pts[q.player] = {week:0, total:0, avail:0});
  const k = el.checked ? 1 : -1;
  t.done = el.checked; t.by = q.player; t.date = todayISO();
  pl.week += k * t.pts; pl.total += k * t.pts; pl.avail += k * t.pts;
  if (el.checked){
    toast(`+${t.pts} điểm cho ${person(q.player).name}`);
    const s = q.steps[+el.dataset.s];
    if (s.tasks.every(x => x.done)){ log(`${person(q.player).name} hoàn thành bước “${s.name}”`, 'pink'); S.msgs.push({id:uid(), cv:'g-b12', from:q.player, text:`Đã xong bước ${+el.dataset.s + 1} “${s.name}”, mời anh kiểm tra ạ`, t:Date.now()}); }
  }
  render();
};
ACT['q-redeem'] = (el, d) => {
  const q = S.quest, r = q.rewards.find(x => x.id === d.id), pl = q.pts[q.player];
  if (!pl || pl.avail < r.pts) return;
  pl.avail -= r.pts; q.redeems.unshift({who:q.player, reward:r.name, pts:r.pts, date:todayISO()});
  log(`${person(q.player).name} đổi “${r.name}”`, 'pink'); render(); toast('Đã đổi quà: ' + r.name);
};
ACT['q-safety'] = () => { const q = S.quest; if (q.lastSafety === todayISO()) return; q.streak = q.lastSafety === dayISO(-1) ? q.streak + 1 : 1; q.lastSafety = todayISO(); log('Điểm danh an toàn lao động — chuỗi ' + q.streak + ' ngày', 'orange'); render(); toast('Chuỗi an toàn: ' + q.streak + ' ngày'); };

/* ================= CHẤM CÔNG ================= */
const site = id => S.att.sites.find(s => s.id === id) || {name:'—'};
const attPending = () => S.att ? S.att.approvals.filter(a => a.status === 'pending') : [];
function attSummary(){ const s = S.att.sites; return {sites:s, total:sum(s, x => x.cap), present:sum(s, x => x.present)}; }
const fmtMin = m => Math.floor(m / 60) + 'h' + pad(Math.round(m % 60));
const workedMin = r => { if (!r.in) return 0; const end = r.out ? toMin(r.out) : Math.min(toMin(nowHM()), 17 * 60 + 30); return Math.max(0, end - toMin(r.in) - (end > 12 * 60 ? 60 : 0)); };
const REC_ST = {ok:['Đúng giờ','green'], late:['Trễ','yellow'], none:['Chưa chấm công','red'], out:['Ngoài vùng · chờ duyệt','orange'], 'out-ok':['Ngoài vùng · đã duyệt','green'], 'out-no':['Ngoài vùng · từ chối','red']};
MOD.att = () => {
  const cur = sub('att', 'day'), A = S.att, sm = attSummary(), pend = attPending();
  const tabs = subtabs('att', [['day','Theo ngày'],['staff','Theo nhân viên'],['approve','Duyệt ngoại vùng', pend.length],['mine','Mobile — cá nhân']], 'day');
  let body;
  if (cur === 'day'){
    const fs = ui.attSite || 'all', rows = A.rec.filter(r => fs === 'all' || r.site === fs);
    const lateN = A.rec.filter(r => r.status === 'late' || r.status === 'none').length;
    body = `<div class="row small muted">${ic('clock', 15)}${longDate(todayISO())} · Hôm nay</div>
      <div class="stats">
        ${stat('Tổng nhân sự hôm nay', sm.total, sm.sites.length + ' công trường hoạt động')}
        ${stat('Đang có mặt', sm.present + ' <span class="small muted">/' + sm.total + '</span>', Math.round(sm.present / sm.total * 100) + '%', 'good')}
        ${stat('Trễ / Chưa chấm công', lateN, 'trong ' + A.rec.length + ' nhân sự hiển thị', lateN ? 'bad' : '')}
        <button class="card stat" data-act="sub" data-view="att" data-k="approve" style="text-align:left"><small>Cần duyệt ngoài vùng</small><b>${pend.length}</b><em class="${pend.length ? 'bad' : ''}">Xem & duyệt ngay ›</em></button>
      </div>
      <div class="stats">${sm.sites.map(s => `<div class="card stat"><div class="row between"><small>${esc(s.name)}</small><span class="small muted">R ${s.radius}m</span></div><b>${s.present} <span class="small muted">/ ${s.cap} có mặt</span></b>${bar(s.present / s.cap * 100, 'var(--green)')}${A.rec.some(r => r.site === s.id && r.status === 'out') ? `<em class="bad">1 ngoài vùng</em>` : ''}</div>`).join('')}</div>
      <div class="toolbar"><button class="fchip ${fs === 'all' ? 'on' : ''}" data-act="att-site" data-id="all">Tất cả công trường</button>${sm.sites.map(s => `<button class="fchip ${fs === s.id ? 'on' : ''}" data-act="att-site" data-id="${s.id}">${esc(s.name)}</button>`).join('')}</div>
      <div class="table-wrap"><table><thead><tr><th>Nhân viên</th><th>Đội / Vai trò</th><th>Địa điểm</th><th>Giờ vào</th><th>Giờ ra</th><th class="r">Tổng giờ</th><th>Trạng thái</th></tr></thead><tbody>
        ${rows.map(r => { const p = person(r.p), st = REC_ST[r.status]; const lateMin = r.status === 'late' ? toMin(r.in) - 7 * 60 : 0; return `<tr><td><div class="who">${av(r.p, 28)}<b style="font-weight:500">${esc(p.name)}</b></div></td><td>${esc(p.team)}<div class="small muted">${esc(p.role)}</div></td><td>${esc(site(r.site).name)}</td><td class="num">${r.in || '—'}</td><td class="num">${r.out || '—'}</td><td class="r">${r.in ? fmtMin(workedMin(r)) + (r.out ? '' : '*') : '—'}</td><td>${r.status === 'out' ? `<button class="pill orange" data-act="sub" data-view="att" data-k="approve">${st[0]} ›</button>` : pill(st[0] + (lateMin ? ' ' + lateMin + ' phút' : ''), st[1])}</td></tr>`; }).join('')}
      </tbody></table><div class="foot-note">* Đang trong ca làm việc, giờ tính đến thời điểm hiện tại. Hiển thị ${rows.length}/${fs === 'all' ? sm.total : site(fs).cap} nhân sự.</div></div>`;
  } else if (cur === 'staff'){
    const monday = addDays(todayISO(), -((today0().getDay() + 6) % 7));
    body = `<h2 class="sec-title" style="margin:0">Tuần này (${fmtDate(monday)}–${fmtDate(addDays(monday, 6))})</h2>
      <div class="table-wrap"><table><thead><tr><th>Nhân viên</th><th>Đội</th><th class="r">Ngày công</th><th class="r">Tổng giờ</th><th class="r">TB giờ / ngày</th><th></th></tr></thead><tbody>
      ${A.week.map(([id, days, min]) => `<tr><td><div class="who">${av(id, 28)}${esc(person(id).name)}</div></td><td>${esc(person(id).team)}</td><td class="r">${days}/5</td><td class="r b">${fmtMin(min)}</td><td class="r">${fmtMin(min / days)}</td><td class="r"><button class="link" data-act="att-hist" data-id="${id}">Lịch sử ›</button></td></tr>`).join('')}
      </tbody></table></div>`;
  } else if (cur === 'approve'){
    const done = A.approvals.filter(a => a.status !== 'pending');
    body = (pend.map(a => `<div class="card pad stack">
        <div class="row">${a.p ? av(a.p, 40) : ''}<div><b style="font-weight:600">${esc(a.name)}</b><div class="small muted">${a.p ? esc(person(a.p).team) + ' · ' : ''}${esc(site(a.site).name)}</div></div><span style="margin-left:auto">${pill(relDay(a.date) + ', ' + a.time, 'orange')}</span></div>
        <div class="card pad row" style="background:var(--orange-t);border:0">${ic('pin', 18)}<span>Vị trí chấm công cách tâm công trường <b>${a.dist}m</b>, vượt quá bán kính cho phép <b>${a.radius}m</b>.${a.note ? ' Ghi chú: “' + esc(a.note) + '”' : ''}</span></div>
        <div class="m-actions"><button class="btn danger" data-act="att-decide" data-id="${a.id}" data-ok="0">Từ chối</button><button class="btn ok" data-act="att-decide" data-id="${a.id}" data-ok="1">${ic('check', 15)}Duyệt chấm công</button></div>
      </div>`).join('') || '<div class="card pad empty">Không còn yêu cầu nào chờ duyệt.</div>')
      + `<div class="card list-card"><h2 class="sec-title">Đã xử lý gần đây</h2>${done.map(a => `<div class="li">${a.p ? av(a.p, 30) : `<span class="av" style="width:30px;height:30px;font-size:11px;background:var(--gray)">${initials(a.name)}</span>`}<span class="ell"><b>${esc(a.name)} — ${esc(site(a.site).name)}</b><small>${a.status === 'ok' ? 'Duyệt' : 'Từ chối'} bởi ${esc(person(a.by).name)} · ${relDay(a.date)}</small></span><span class="end">${pill(a.status === 'ok' ? 'Đã duyệt' : 'Từ chối', a.status === 'ok' ? 'green' : 'red')}</span></div>`).join('')}</div>`;
  } else {
    const m = A.mine, p = person(m.p), s = site(m.site), inNow = m.in && !m.out;
    const todayMin = m.in ? workedMin({in:m.in, out:m.out}) : 0, weekMin = m.weekMin + todayMin;
    body = `<div class="small muted" style="text-align:center">Giao diện điện thoại cho công nhân — chấm công theo vị trí công trường.</div>
      <div class="phone">
        <div class="row between"><div><b style="font-size:17px">Xin chào, ${esc(p.name)}</b><div class="small muted">${longDate(todayISO())}</div></div>${av(m.p, 38)}</div>
        <div class="loc"><span class="sq" style="--c:var(--green);--t:var(--green-t)">${ic('pin', 18)}</span><div><b style="font-weight:600">${esc(s.name)}</b><div class="small" style="color:var(--green-ink)">● Trong khu vực</div><div class="small muted">${esc(s.addr)}</div></div></div>
        <div style="text-align:center" class="small">${inNow ? `Đã chấm công vào <b>${m.in}</b> sáng nay` : m.out ? `Đã chấm công ra lúc <b>${m.out}</b>` : 'Chưa chấm công hôm nay'}<div class="muted">Đang thi công: <b style="color:var(--ink)">${esc(m.task)}</b></div></div>
        <button class="big-btn" data-act="att-punch" style="--c:${inNow ? 'var(--orange)' : 'var(--green)'};--t:${inNow ? 'var(--orange-t)' : 'var(--green-t)'}"><span>${inNow ? 'Chấm công ra' : 'Chấm công vào'}<small>${nowHM()}</small></span></button>
        <div class="loc" style="flex-direction:column;gap:8px"><div class="kpi-row" style="width:100%;margin:0"><span>Giờ công tuần này</span><span>${fmtMin(weekMin)} / 40h</span></div><div style="width:100%">${bar(weekMin / 2400 * 100, 'var(--green)', 'thick')}</div><div class="row between small" style="width:100%"><span>Hôm nay: <b>${fmtMin(todayMin)}</b></span><span>Còn lại: <b>${fmtMin(Math.max(0, 2400 - weekMin))}</b></span></div></div>
        <div><b style="font-size:13px">Lịch sử gần đây</b>${m.hist.slice(0, 4).map(h => `<div class="row between small" style="padding:8px 0;border-bottom:1px solid var(--line)"><span>${longDate(h.date).replace(/\/\d{4}$/, '')}</span><span class="num">${h.in} – ${h.out}</span></div>`).join('')}</div>
      </div>`;
  }
  return head('Chấm công', 'Theo dõi nhân công theo công trường, chấm công bằng vị trí và duyệt các trường hợp ngoài vùng.') + tabs + body;
};
ACT['att-site'] = (el, d) => { ui.attSite = d.id; render(); };
ACT['att-decide'] = (el, d) => {
  const a = S.att.approvals.find(x => x.id === d.id), ok = d.ok === '1';
  a.status = ok ? 'ok' : 'no'; a.by = S.me;
  const r = S.att.rec.find(x => x.p === a.p && x.status === 'out'); if (r) r.status = ok ? 'out-ok' : 'out-no';
  if (ok) site(a.site).present++;
  log(`${ok ? 'Duyệt' : 'Từ chối'} chấm công ngoài vùng của ${a.name}`, ok ? 'green' : 'red');
  botPost('Kết quả duyệt chấm công', `${a.name} — ${site(a.site).name}: ${ok ? 'đã được duyệt' : 'bị từ chối'} bởi ${person(S.me).name}.`, ok ? 'green' : 'red', 'Module Chấm công', 'att', 'approve');
  render(); toast(ok ? 'Đã duyệt chấm công' : 'Đã từ chối');
};
ACT['att-hist'] = (el, d) => {
  const seedN = [...d.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rows = Array.from({length:5}, (_, i) => { const dt = addDays(todayISO(), -(i + 1)); const a = 6 * 60 + 50 + (seedN * (i + 3)) % 30, b = 17 * 60 + (seedN * (i + 7)) % 20; return [dt, a, b]; });
  showModal(`<div class="modal"><h3>Lịch sử chấm công — ${esc(person(d.id).name)}${closeBtn()}</h3>
    <table><thead><tr><th>Ngày</th><th>Vào</th><th>Ra</th><th class="r">Giờ công</th></tr></thead><tbody>${rows.map(([dt, a, b]) => `<tr><td>${longDate(dt).replace(/\/\d{4}$/, '')}</td><td class="num">${pad(Math.floor(a / 60))}:${pad(a % 60)}</td><td class="num">${pad(Math.floor(b / 60))}:${pad(b % 60)}</td><td class="r">${fmtMin(b - a - 60)}</td></tr>`).join('')}</tbody></table></div>`);
};
ACT['att-punch'] = () => {
  const m = S.att.mine, t = nowHM();
  if (m.in && !m.out){ m.out = t; m.hist.unshift({date:todayISO(), in:m.in, out:t}); log(person(m.p).name + ' chấm công ra ' + t, 'green'); toast('Đã chấm công ra lúc ' + t); }
  else { if (m.out) m.weekMin += workedMin({in:m.in, out:m.out}); m.in = t; m.out = null; log(person(m.p).name + ' chấm công vào ' + t, 'green'); toast('Đã chấm công vào lúc ' + t); }
  render();
};

/* ================= trợ lý ================= */
AI.push({re:/(tạo|thêm).*việc/, fn:q => {
  const m = q.match(/(?:tạo|thêm)\s*(?:công\s*)?việc\s*:?\s*(.+)/i);
  if (!m || !m[1].trim()) return 'Gõ theo mẫu: <i>Tạo công việc: Kiểm tra cốt thép sàn tầng 5</i>';
  const phases = S.gantt[S.pid]; if (!phases) return 'Dự án đang chọn chưa có khung tiến độ.';
  const ph = phases.find(x => x.tasks.some(t => isWork(t) && gStatus(t) !== 'done')) || phases[0];
  const t = {id:uid(), name:m[1].trim().slice(0, 120), start:todayISO(), end:dayISO(5), progress:0, owner:person(S.me).name, crit:false, notes:'Tạo bởi trợ lý', comments:[]};
  ph.tasks.push(t); log('Trợ lý tạo công việc ' + t.name, 'purple');
  return `Đã thêm <b>${esc(t.name)}</b> vào giai đoạn “${esc(ph.name)}” (${fmtDate(t.start)}–${fmtDate(t.end)}). <button class="link" data-act="gtask" data-pid="${S.pid}" data-id="${t.id}">Mở để chỉnh</button>`;
}});
AI.push({re:/trễ|tiến độ|gantt|chậm/, fn:() => {
  const p = proj(S.pid), g = ganttStats(p.id), l = ganttLate(p.id);
  return `<b>${esc(p.name)}</b>: thực tế ${g.actual}% / kế hoạch ${g.plan}%.` + (l.length ? ` Có ${l.length} hạng mục trễ:` + list(l.map(t => `<button class="link" data-act="gtask" data-pid="${p.id}" data-id="${t.id}">${esc(t.name)}</button> — ${esc(t.owner)}, ${t.progress}%, trễ ${-daysLeft(t.end)} ngày${t.crit ? ' <b>(đường găng)</b>' : ''}`)) : ' Không có hạng mục trễ.');
}});
AI.push({re:/nhân công|chấm công|có mặt|ngoài vùng|công nhân/, fn:() => {
  const a = attSummary(), pend = attPending();
  return `Hôm nay có mặt <b>${a.present}/${a.total}</b> (${Math.round(a.present / a.total * 100)}%).` + list(a.sites.map(s => `${esc(s.name)}: ${s.present}/${s.cap}`)) + (pend.length ? `<button class="link" data-act="nav" data-v="att" data-sub="approve">${pend.length} chấm công ngoài vùng chờ duyệt ›</button>` : '');
}});
AI.push({re:/điểm|thưởng|quà|xếp hạng|nhiệm vụ/, fn:() => {
  const q = S.quest, r = Object.entries(q.pts).sort((a, b) => b[1].week - a[1].week).slice(0, 3);
  return `Quy trình <b>${esc(q.name)}</b>: ${questDone()}/${q.steps.length} bước. Dẫn đầu tuần:` + list(r.map(([id, v]) => `${esc(person(id).name)} — ${num(v.week)} điểm`)) + `Chuỗi an toàn lao động: ${q.streak} ngày.`;
}});
