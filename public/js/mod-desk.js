/* Dezon Workspace — Bàn làm việc của tôi: KPI cá nhân, nhiệm vụ tích điểm, task hàng ngày, chấm công / ngày phép, đơn từ duyệt 2 cấp (Quản lý → HR). */

const DESK_md = s => addDays(md(s), -2); // mockup: hôm nay = 23/09/2026
const DESK_REL = ['Cá nhân','Quản lý dự án','Kinh doanh','Marketing','Mua hàng','HR','Tài chính','QS','Sản xuất','Wiki'];
const DESK_REL_VIEW = {'Quản lý dự án':'pm','Kinh doanh':'sales','Marketing':'mkt','Mua hàng':'po','HR':'att','Tài chính':'fin','QS':'qs','Sản xuất':'prod','Wiki':'wiki'};
const DESK_PRI = {high:['Cao','red'], med:['Trung bình','yellow'], low:['Thấp','gray']};
const DESK_TYPES = {
  xinphep:{title:'Xin phép nghỉ', sub:'Nghỉ phép năm, nghỉ ốm, nghỉ không lương', c:'green', icon:'userclock', dateFrom:'Từ ngày', reason:'Lý do xin nghỉ'},
  tamung:{title:'Tạm ứng', form:'Đề nghị tạm ứng', sub:'Đề nghị tạm ứng lương / công tác phí', c:'yellow', icon:'wallet', dateFrom:'Ngày cần nhận', amount:'Số tiền đề nghị tạm ứng (đ)', reason:'Lý do tạm ứng'},
  hoanung:{title:'Hoàn ứng', sub:'Quyết toán khoản đã tạm ứng trước đó', c:'blue', icon:'coin', dateFrom:'Ngày hoàn ứng', amount:'Số tiền hoàn (đ)', reason:'Nội dung quyết toán'}
};
const DESK_LEAVE_KINDS = ['Nghỉ phép năm','Nghỉ ốm','Nghỉ không lương'];
const DESK_ROLES = ['Quản lý trực tiếp','Nhân sự (HR)'];
const DESK_LEAVE_DEF = {total:12, used:4}; // khi chưa có module HR: phép năm & số ngày đã nghỉ trước khi dùng đơn từ

// Task hàng ngày: map theo người {mã: {list:[{id, title, related, due, priority, done, doneDate, created}]}}
syncCol('desk_tasks', 'map', () => S.desk_tasks, v => S.desk_tasks = v, {read:'all', write:'all', empty:() => ({})});
// Đơn từ: [{id, by, type, status 'pending'|'approved'|'rejected' (suy từ steps, lưu kèm để module khác đọc), leaveKind, dateFrom, dateTo, amount (đồng), pid, reason, sent (ISO), t, steps:[{who, name, role, status 'waiting'|'pending'|'approved'|'rejected', note, at}]}]
syncCol('desk_requests', 'array', () => S.desk_requests, v => S.desk_requests = v, {read:'all', write:'all', empty:() => []});

SEEDS.push(s => {
  ensurePeople(s, [{id:'cao-hung', name:'Cao Hưng', role:'CEO', team:'Ban giám đốc', c:'orange'}, {id:'le-trung-kien', name:'Lê Trung Kiên', role:'Trưởng phòng kỹ thuật', team:'Kỹ thuật', c:'blue'},
    {id:'nguyen-trung-thanh', name:'Nguyễn Trung Thành', role:'Trưởng phòng kinh doanh', team:'Kinh doanh', c:'purple'}, {id:'ngo-my-duyen', name:'Ngô Mỹ Duyên', role:'Chuyên viên đào tạo', team:'Nhân sự', c:'green'}]);
  const T = (title, related, due, priority, done, doneDate) => ({id:'dt' + uid(), title, related, due:due ? DESK_md(due) : '', priority, done:!!done, doneDate:doneDate ? DESK_md(doneDate) : '', created:DESK_md('2026-09-20')});
  s.desk_tasks = {ta:{list:[
    T('Hoàn thiện bóc tách vật tư GĐ2', 'Chung cư Riverside GĐ2', '2026-09-24', 'high'),
    T('Duyệt đơn mua hàng PO-004', 'Mua hàng', '2026-09-25', 'med'),
    T('Review App tiến độ thi công', 'Quản lý dự án', '2026-09-23', 'high'),
    T('Gửi báo giá cho khách Lô B12', 'Kinh doanh', '', 'low', true, '2026-09-21'),
    T('Chuẩn bị họp kinh doanh tổng', 'Kinh doanh', '2026-09-24', 'med'),
    T('Cập nhật Wiki quy trình thi công', 'Wiki', '2026-09-27', 'low'),
    T('Xác nhận nhân sự tăng ca cuối tuần', 'HR', '2026-09-26', 'med'),
    T('Chốt khối lượng phát sinh tầng 3', 'Quản lý dự án', '', 'med', true, '2026-09-22'),
    T('Gọi lại nhà cung cấp thép', 'Mua hàng', '', 'low', true, '2026-09-15')
  ]}};
  const st = (who, name, role, status, note, at) => ({who, name, role, status, note:note || '', at:at ? DESK_md(at) : ''});
  const R = (id, by, type, x, steps) => ({id, by, type, leaveKind:'', dateFrom:'', dateTo:'', amount:0, pid:'', reason:'', ...x, sent:DESK_md(x.sent), t:parseD(DESK_md(x.sent)).getTime() + 9 * 36e5, dateFrom:x.dateFrom ? DESK_md(x.dateFrom) : '', dateTo:x.dateTo ? DESK_md(x.dateTo) : '', steps});
  s.desk_requests = [
    R('rq1', 'ta', 'xinphep', {leaveKind:'Nghỉ ốm', dateFrom:'2026-09-18', dateTo:'2026-09-19', sent:'2026-09-17', reason:'Sốt siêu vi, có giấy khám bệnh'},
      [st('da', 'Nguyễn Đức Anh', DESK_ROLES[0], 'approved', 'Nghỉ ngơi cho khoẻ nhé', '2026-09-17'), st('bn', 'Phan Bảo Ngọc', DESK_ROLES[1], 'approved', '', '2026-09-17')]),
    R('rq2', 'ta', 'tamung', {amount:3000000, dateFrom:'2026-09-21', sent:'2026-09-20', pid:'b12', reason:'Công tác khảo sát Lô B12'},
      [st('da', 'Nguyễn Đức Anh', DESK_ROLES[0], 'approved', '', '2026-09-21'), st('bn', 'Phan Bảo Ngọc', DESK_ROLES[1], 'waiting')]),
    R('rq3', 'nh', 'xinphep', {leaveKind:'Nghỉ phép năm', dateFrom:'2026-09-29', dateTo:'2026-09-30', sent:'2026-09-22', reason:'Về quê giải quyết việc gia đình'},
      [st('ta', 'Trần Anh', DESK_ROLES[0], 'waiting'), st('bn', 'Phan Bảo Ngọc', DESK_ROLES[1], 'pending')]),
    R('rq4', 'vn', 'tamung', {amount:5000000, dateFrom:'2026-09-24', sent:'2026-09-23', pid:'riverside', reason:'Mua dụng cụ cầm tay cho tổ đội B'},
      [st('ta', 'Trần Anh', DESK_ROLES[0], 'waiting'), st('bn', 'Phan Bảo Ngọc', DESK_ROLES[1], 'pending')])
  ];
  s.desk_requests.forEach(r => { r.status = deskReqStatus(r); if (r.type === 'xinphep') r.days = deskDays(r.dateFrom, r.dateTo); });
});

/* ---------- dữ liệu & tính toán ---------- */
const deskTasks = (pid = S.me) => { S.desk_tasks = S.desk_tasks || {}; return (S.desk_tasks[pid] = S.desk_tasks[pid] || {list:[]}).list; };
const deskReqs = () => S.desk_requests || [];
const deskFind = id => deskReqs().find(r => r.id === id);
function deskReqStatus(r){ return r.steps.some(s => s.status === 'rejected') ? 'rejected' : r.steps.every(s => s.status === 'approved') ? 'approved' : 'pending'; }
const deskCurStep = r => r.steps.find(s => s.status === 'waiting');
const deskIsMe = st => !!st && (st.who ? st.who === S.me : st.name === person(S.me).name);
// Đơn đang chờ chính mình duyệt (bước hiện tại là mình)
const deskInbox = () => deskReqs().filter(r => deskReqStatus(r) === 'pending' && deskIsMe(deskCurStep(r)));
const deskMonday = s => addDays(s, -((parseD(s).getDay() + 6) % 7));
// Số ngày nghỉ (bỏ Chủ nhật), tính cả hai đầu
function deskDays(a, b){ let n = 0; for (let d = a; d <= (b || a); d = addDays(d, 1)) if (parseD(d).getDay() !== 0) n++; return n; }
// Ngày phép năm đã nghỉ qua đơn từ đã duyệt (năm hiện tại) — HR có thể cộng vào số dư
function deskLeaveUsed(pid = S.me, year = todayISO().slice(0, 4)){
  return sum(deskReqs().filter(r => r.by === pid && r.type === 'xinphep' && r.leaveKind === 'Nghỉ phép năm' && deskReqStatus(r) === 'approved' && r.dateFrom.slice(0, 4) === year), r => deskDays(r.dateFrom, r.dateTo));
}
function deskLeave(pid = S.me){
  // HR (hrLeaveBalance) đã tự cộng các đơn nghỉ phép năm đã duyệt trong S.desk_requests
  const hr = typeof hrLeaveBalance === 'function' ? hrLeaveBalance(pid) : null;
  const total = hr && hr.total != null ? +hr.total || 0 : DESK_LEAVE_DEF.total;
  const used = hr && hr.used != null ? +hr.used || 0 : DESK_LEAVE_DEF.used + deskLeaveUsed(pid);
  return {total, used, left:Math.max(0, total - used)};
}
// Chấm công tháng này: hrAttMonth nếu có; không thì đọc bản ghi chấm công HR (S.att_recs); chưa có bản ghi → suy từ ngày làm việc & đơn nghỉ đã duyệt.
function deskAtt(pid = S.me){
  const ym = todayISO().slice(0, 7), today = todayISO();
  if (typeof hrAttMonth === 'function'){ const a = hrAttMonth(pid, ym); if (a) return {worked:+a.worked || 0, workdays:+a.workdays || 0, late:+a.late || 0, early:+a.early || 0, absent:+a.absent || 0, src:'hr'}; }
  const isWork = typeof HR_isWork === 'function' ? HR_isWork : d => parseD(d).getDay() !== 0;
  const leaves = deskReqs().filter(r => r.by === pid && r.type === 'xinphep' && deskReqStatus(r) === 'approved');
  const onLeave = d => leaves.some(r => d >= r.dateFrom && d <= (r.dateTo || r.dateFrom));
  let workdays = 0, leave = 0;
  for (let d = ym + '-01'; d <= today; d = addDays(d, 1)) if (isWork(d)){ workdays++; if (onLeave(d)) leave++; }
  const recs = Array.isArray(S.att_recs) ? S.att_recs.filter(r => r.p === pid && r.in && r.zone !== 'rejected') : [];
  if (recs.length && typeof HR_state === 'function'){
    const mine = recs.filter(r => r.date.slice(0, 7) === ym), days = new Set(mine.map(r => r.date));
    const first = recs.map(r => r.date).sort()[0];
    const early = typeof HR_shift === 'function' ? mine.filter(r => r.out && toMin(r.out) < toMin(HR_shift(r.p, r.site)) + 9 * 60).length : 0;
    let absent = 0; // chỉ tính từ ngày bắt đầu có dữ liệu chấm công
    for (let d = first > ym + '-01' ? first : ym + '-01'; d < today; d = addDays(d, 1)) if (isWork(d) && !days.has(d) && !onLeave(d)) absent++;
    return {worked:days.size, workdays, late:mine.filter(r => HR_state(r).k === 'late').length, early, absent, leave, src:'hr'};
  }
  return {worked:workdays - leave, workdays, late:0, early:0, absent:0, leave, src:'desk'};
}
// Nhiệm vụ tích điểm của tôi từ mọi quy trình (Quản lý dự án, Kinh doanh, Marketing…)
function deskQuests(){
  if (typeof QUESTS !== 'object') return [];
  return Object.keys(QUESTS).flatMap(k => {
    const q = S['quest_' + k]; if (!q || !q.steps) return [];
    const v = QUESTS[k].view;
    return q.steps.flatMap(st => st.tasks.filter(t => t.who === S.me || (t.done && t.by === S.me)).map(t => ({k, v, sub:QUESTS[k].sub || 'quest', mod:(VIEWS[v] || {}).label || v, name:t.name, pts:+t.pts || 0, done:!!t.done, date:t.date, step:st.name, qn:q.name})));
  });
}
function deskKpi(){
  const tasks = deskTasks(), qs = deskQuests(), today = todayISO(), ws = deskMonday(today), lws = addDays(ws, -7);
  const open = tasks.filter(t => !t.done), openQ = qs.filter(t => !t.done);
  const soon = open.filter(t => t.due && daysLeft(t.due) <= 2);
  const doneIn = (a, b) => tasks.filter(t => t.done && t.doneDate >= a && t.doneDate < b).length + qs.filter(t => t.done && t.date >= a && t.date < b).length;
  return {open:open.length + openQ.length, soon, overdue:open.filter(t => t.due && t.due < today), week:doneIn(ws, addDays(ws, 7)), last:doneIn(lws, ws)};
}
const deskMoney = s => Math.round(+String(s || '').replace(/[^\d]/g, '') || 0);
function deskReqTitle(r){
  if (r.type === 'xinphep') return `Xin phép ${(r.leaveKind || 'nghỉ').toLowerCase()} — ${fmtDate(r.dateFrom)}${r.dateTo && r.dateTo !== r.dateFrom ? ' đến ' + fmtDate(r.dateTo) : ''}`;
  return (DESK_TYPES[r.type] || {}).title + (r.amount ? ' — ' + vnd(r.amount) : '');
}
const DESK_ST = {approved:['✓', 'đã duyệt'], waiting:['⏳', 'đang chờ duyệt'], rejected:['✕', 'đã từ chối'], pending:['', 'chưa xét']};
const deskStepper = r => `<span class="desk-steps" title="${esc(r.steps.map(s => `${s.name} ${DESK_ST[s.status][1]}`).join(' · '))}">${r.steps.map((s, i) => `<i class="${s.status}">${['QL', 'HR'][i] || i + 1}${DESK_ST[s.status][0] ? ' ' + DESK_ST[s.status][0] : ''}</i>`).join('')}</span>`;

/* ---------- giao diện ---------- */
function deskTaskRow(t){
  const [pl, pc] = DESK_PRI[t.priority] || DESK_PRI.med, late = !t.done && t.due && t.due < todayISO();
  const meta = esc(t.related || 'Cá nhân') + (t.done ? (t.doneDate ? ' · Hoàn thành ' + fmtDate(t.doneDate) : '') : t.due ? ` · <span class="${late ? 'late' : ''}">${late ? 'Quá hạn' : 'Hạn'} ${relDay(t.due)}</span>` : '');
  return `<div class="desk-task ${t.done ? 'done' : ''}"><input type="checkbox" data-change="desk-tk" data-id="${esc(t.id)}" ${t.done ? 'checked' : ''} aria-label="Đánh dấu hoàn thành: ${esc(t.title)}">
    <button class="ell" data-act="desk-tk-edit" data-id="${esc(t.id)}"><b>${esc(t.title)}</b><small>${meta}</small></button>${pill(pl === 'Trung bình' ? 'TB' : pl, t.done ? 'gray' : pc)}</div>`;
}
const deskSortTasks = l => l.slice().sort((a, b) => (a.done - b.done) || (a.done ? (b.doneDate || '').localeCompare(a.doneDate || '') : ((a.due || '9999').localeCompare(b.due || '9999') || ['high','med','low'].indexOf(a.priority) - ['high','med','low'].indexOf(b.priority))));
function deskReqRow(r, inbox){
  const T = DESK_TYPES[r.type] || DESK_TYPES.xinphep, stt = deskReqStatus(r);
  return `<button class="li desk-req" data-act="desk-req" data-id="${esc(r.id)}"><span class="sq" style="--c:${cv(T.c)};--t:${ct(T.c)}">${ic(T.icon, 17)}</span>
    <span class="ell"><b>${inbox ? esc(person(r.by).name) + ' · ' : ''}${esc(deskReqTitle(r))}</b><small>Gửi ${fmtFull(r.sent)} · ${esc(r.reason)}</small></span>
    <span class="end row">${stt === 'approved' ? pill('Đã duyệt', 'green') : stt === 'rejected' ? pill('Từ chối', 'red') : ''}${deskStepper(r)}</span></button>`;
}
// Trạng thái chấm công hôm nay của tôi (S.att_recs của HR); nút mở trang chấm công cá nhân nếu có quyền.
function deskCheckin(){
  if (!Array.isArray(S.att_recs)) return '';
  const r = S.att_recs.filter(x => x.p === S.me && x.date === todayISO() && x.in).sort((a, b) => b.in.localeCompare(a.in))[0];
  const st = r && typeof HR_state === 'function' ? HR_state(r) : null;
  const txt = !r ? 'Chưa chấm công hôm nay' : `Vào ca ${esc(r.in)}${r.out ? ' · ra ca ' + esc(r.out) : ' · đang trong ca'}`;
  const c = !r ? 'red' : st ? st.c : 'green';
  return `<div class="card pad row between" style="flex-wrap:wrap;gap:10px"><div class="row"><span class="sq" style="--c:${cv(c)};--t:${ct(c)}">${ic('userclock', 17)}</span><div><b style="font-weight:600">${txt}</b><div class="small muted">${st ? esc(st.label) + ' · ' : ''}${longDate(todayISO())}</div></div></div>
    ${canSee('att') ? `<button class="btn sm ${r ? 'line' : ''}" data-act="desk-att">${r && !r.out ? 'Chấm ra ca' : r ? 'Xem chấm công' : 'Chấm công'}</button>` : ''}</div>`;
}
function deskOverview(){
  const k = deskKpi(), lv = deskLeave(), at = deskAtt(), qs = deskQuests(), inbox = deskInbox();
  const got = sum(qs.filter(t => t.done), t => t.pts), tot = sum(qs, t => t.pts);
  const tasks = deskSortTasks(deskTasks()).slice(0, 8);
  const delta = k.week - k.last;
  const myProjects = (S.projects || []).filter(p => p.status !== 'done' && (p.pm === S.me || (p.members || []).some(m => m.id === S.me))).length;
  const avail = typeof QUESTS === 'object' ? sum(Object.keys(QUESTS), q => ((S['quest_' + q] || {}).pts || {})[S.me] ? S['quest_' + q].pts[S.me].avail : 0) : 0;
  const tile = (n, l, c) => `<div class="desk-tile" style="--c:${cv(c)};--t:${ct(c)}"><b>${n}</b><small>${l}</small></div>`;
  const kv = (l, v, act) => `<div class="desk-kv"><span>${l}</span>${act ? `<button class="link" ${act}>${v}</button>` : `<b>${v}</b>`}</div>`;
  const lvPct = lv.total ? Math.round(lv.used / lv.total * 100) : 0;
  return `<div class="stats">
      ${stat('Nhiệm vụ đang làm', k.open, k.overdue.length ? `<span class="late">${k.overdue.length} việc quá hạn</span>` : k.soon.length + ' việc sắp đến hạn')}
      ${stat('Hoàn thành tuần này', `<span style="color:var(--green-ink)">${k.week}</span>`, (delta >= 0 ? '+' : '') + delta + ' so với tuần trước', delta >= 0 ? 'good' : 'bad')}
      ${stat('Ngày công tháng này', `<span style="color:var(--blue-ink)">${at.worked}/${at.workdays}</span>`, at.late ? at.late + ' lần đi trễ' : at.src === 'hr' ? 'Không đi trễ' : (at.leave ? at.leave + ' ngày nghỉ có phép' : 'Theo ngày làm việc'))}
      ${stat('Ngày phép còn lại', `<span style="color:var(--yellow-ink)">${lv.left}/${lv.total}</span>`, 'Đã dùng ' + lv.used + ' ngày')}
    </div>
    <div class="grid-3-2"><div class="stack">
      <div class="card pad stack"><div class="row between"><h2 class="sec-title" style="margin:0">Nhiệm vụ của tôi</h2><b class="num" style="color:var(--yellow-ink)">${num(got)} / ${num(tot)} điểm</b></div>
        <div class="small muted">Tổng hợp nhiệm vụ bạn được giao & tham gia từ các hạng mục khác — hoàn thành để tích điểm đổi quà.</div>
        ${bar(tot ? got / tot * 100 : 0, 'var(--yellow)')}
        <div>${qs.slice().sort((a, b) => a.done - b.done).slice(0, 6).map(t => `<button class="li" data-act="desk-quest" data-k="${t.k}" data-v="${t.v}" data-s="${t.sub}" data-tab="tasks"><span class="sq" style="--c:${cv(t.done ? 'green' : 'yellow')};--t:${ct(t.done ? 'green' : 'yellow')}">${ic(t.done ? 'check' : 'target', 16)}</span><span class="ell"><b ${t.done ? 'style="text-decoration:line-through;color:var(--muted)"' : ''}>${esc(t.name)}</b><small>${esc(t.mod)} · ${esc(t.qn)} · ${esc(t.step)}</small></span><span class="end pill yellow">+${t.pts}</span></button>`).join('')
          || '<div class="empty">Chưa có nhiệm vụ tích điểm nào được giao cho bạn.</div>'}
        ${inbox.map(r => `<button class="li" data-act="desk-req" data-id="${esc(r.id)}"><span class="sq" style="--c:var(--orange);--t:var(--orange-t)">${ic('file', 16)}</span><span class="ell"><b>Duyệt đơn: ${esc(deskReqTitle(r))}</b><small>Đơn từ · ${esc(person(r.by).name)} · gửi ${fmtDate(r.sent)}</small></span><span class="end pill orange">Chờ bạn</span></button>`).join('')}</div>
        <div class="row between" style="flex-wrap:wrap"><button class="btn sm" style="background:var(--yellow);color:#1a1300" data-act="desk-quest" data-k="pm" data-v="pm" data-s="quest" data-tab="rewards">${ic('gift', 15)}Đổi quà</button><button class="link" data-act="desk-quest" data-k="pm" data-v="pm" data-s="quest" data-tab="tasks">Xem tất cả tại Quản lý dự án ›</button></div>
      </div>
      <div class="card pad stack"><div class="row between"><h2 class="sec-title" style="margin:0">Task hàng ngày</h2><button class="btn sm" data-act="desk-tk-new">${ic('plus', 14)}Thêm việc</button></div>
        <div class="small muted">Ghi chú & việc cần làm cá nhân trong ngày — không tính điểm.</div>
        <div class="desk-tasks">${tasks.map(deskTaskRow).join('') || '<div class="empty">Chưa có việc nào — bấm “Thêm việc”.</div>'}</div>
        ${deskTasks().length > tasks.length ? `<button class="link" data-act="sub" data-view="desk" data-k="tasks">Xem tất cả ${deskTasks().length} việc ›</button>` : ''}
      </div>
    </div><div class="stack">
      ${deskCheckin()}
      <div class="card pad stack"><h2 class="sec-title" style="margin:0">Thống kê chấm công <small>tháng ${todayISO().slice(5, 7)}</small></h2>
        <div class="desk-tiles">${tile(at.worked, 'Ngày công đủ giờ', 'blue')}${tile(at.late, 'Đi trễ', 'yellow')}${tile(at.early, 'Về sớm', 'gray')}${tile(at.absent, 'Nghỉ không phép', 'red')}</div>
        ${at.src === 'hr' ? '' : '<div class="small muted">Chưa có dữ liệu chấm công chi tiết — tính theo ngày làm việc (T2–T7) trừ ngày nghỉ đã duyệt.</div>'}
      </div>
      <div class="card pad stack"><h2 class="sec-title" style="margin:0">Ngày nghỉ phép</h2>
        <div class="kpi-row" style="margin:0"><span>Đã dùng ${lv.used} / ${lv.total} ngày</span><span style="color:var(--blue-ink)">${lvPct}%</span></div>${bar(lvPct, 'var(--blue)')}
        <div class="small muted">Còn lại ${lv.left} ngày phép năm ${todayISO().slice(0, 4)}, đăng ký nghỉ phép năm trước ít nhất 3 ngày.</div>
        <button class="btn line sm" data-act="desk-req-new" data-t="xinphep">${ic('plus', 14)}Xin phép nghỉ</button>
      </div>
      <div class="card pad"><h2 class="sec-title" style="margin:0 0 6px">Thông số khác</h2>
        ${kv('Dự án đang tham gia', myProjects, 'data-act="nav" data-v="pm" data-sub="list"')}
        ${kv('Điểm thưởng khả dụng', num(avail), 'data-act="desk-quest" data-k="pm" data-v="pm" data-s="quest" data-tab="rewards"')}
        ${kv('Tin nhắn chưa đọc', typeof chatUnreadTotal === 'function' ? chatUnreadTotal() : 0, 'data-act="nav" data-v="chat"')}
        ${typeof poPending === 'function' ? kv('Đơn mua hàng đang chờ xử lý', poPending(), 'data-act="nav" data-v="po"') : ''}
        ${kv('Đơn từ chờ bạn duyệt', inbox.length, 'data-act="sub" data-view="desk" data-k="req"')}
        ${kv('Đơn của tôi đang chờ', deskReqs().filter(r => r.by === S.me && deskReqStatus(r) === 'pending').length, 'data-act="sub" data-view="desk" data-k="req"')}
      </div>
    </div></div>`;
}
function deskTasksTab(){
  const f = ui.deskTf || 'open', today = todayISO(), all = deskTasks();
  const F = {open:['Đang làm', t => !t.done], today:['Hôm nay', t => !t.done && t.due === today], late:['Quá hạn', t => !t.done && t.due && t.due < today], done:['Đã xong', t => t.done], all:['Tất cả', () => true]};
  const l = deskSortTasks(all.filter(F[f][1]));
  return `<div class="row between" style="flex-wrap:wrap;gap:10px"><div class="chips">${Object.entries(F).map(([k, [lb, fn]]) => `<button class="fchip sm ${f === k ? 'on' : ''}" data-act="desk-tf" data-k="${k}">${lb} <span class="muted">${all.filter(fn).length}</span></button>`).join('')}</div>
      <div class="row">${all.some(t => t.done) ? `<button class="btn ghost sm" data-act="desk-tk-clear">${ic('trash', 14)}Xoá việc đã xong</button>` : ''}<button class="btn sm" data-act="desk-tk-new">${ic('plus', 14)}Thêm việc</button></div></div>
    <div class="card pad"><div class="desk-tasks">${l.map(deskTaskRow).join('') || `<div class="empty">${f === 'open' ? 'Không còn việc nào đang làm 🎉' : 'Không có việc nào'}</div>`}</div></div>`;
}
function deskReqTab(){
  const inbox = deskInbox(), f = ui.deskRf || 'all';
  const mine = deskReqs().filter(r => r.by === S.me).sort((a, b) => b.t - a.t);
  const done = deskReqs().filter(r => r.by !== S.me && r.steps.some(s => deskIsMe(s) && ['approved','rejected'].includes(s.status))).sort((a, b) => b.t - a.t).slice(0, 10);
  const F = {all:'Tất cả', pending:'Đang chờ', approved:'Đã duyệt', rejected:'Từ chối'};
  const l = mine.filter(r => f === 'all' || deskReqStatus(r) === f);
  return `<div class="desk-types">${Object.entries(DESK_TYPES).map(([k, T]) => `<button class="card desk-type" data-act="desk-req-new" data-t="${k}" style="--c:${cv(T.c)};--t:${ct(T.c)}"><span class="sq">${ic(T.icon, 18)}</span><span><b>${T.title}</b><small>${T.sub}</small></span>${ic('plus', 16)}</button>`).join('')}</div>
    ${inbox.length ? `<div class="card list-card"><h2 class="sec-title">Chờ bạn duyệt <small>${inbox.length} đơn</small></h2>${inbox.sort((a, b) => a.t - b.t).map(r => deskReqRow(r, true)).join('')}</div>` : ''}
    <div class="card list-card"><h2 class="sec-title">Lịch sử đơn từ <small>Bấm vào 1 trong 3 loại đơn phía trên để tạo đơn mới.</small></h2>
      <div class="chips" style="padding:0 12px 8px">${Object.entries(F).map(([k, lb]) => `<button class="fchip sm ${f === k ? 'on' : ''}" data-act="desk-rf" data-k="${k}">${lb} <span class="muted">${mine.filter(r => k === 'all' || deskReqStatus(r) === k).length}</span></button>`).join('')}</div>
      ${l.map(r => deskReqRow(r)).join('') || '<div class="empty">Chưa có đơn nào</div>'}</div>
    ${done.length ? `<div class="card list-card"><h2 class="sec-title">Bạn đã xét gần đây</h2>${done.map(r => deskReqRow(r, true)).join('')}</div>` : ''}`;
}
MOD.desk = () => {
  const tab = sub('desk', 'overview'), n = deskInbox().length;
  return head(`${ic('target', 22)} Bàn làm việc của tôi`, `Nhiệm vụ, chấm công & ngày phép cá nhân — ${esc(person(S.me).name)} · ${longDate(todayISO())}`, `<button class="btn line" data-act="desk-tk-new">${ic('plus', 15)}Thêm việc</button><button class="btn" data-act="desk-req-new" data-t="xinphep">${ic('file', 15)}Tạo đơn</button>`)
    + subtabs('desk', [['overview', 'Tổng quan'], ['tasks', 'Task hàng ngày', deskTasks().filter(t => !t.done).length], ['req', 'Đơn từ', n]], 'overview')
    + (tab === 'tasks' ? deskTasksTab() : tab === 'req' ? deskReqTab() : deskOverview());
};

/* ---------- task hàng ngày ---------- */
function deskTaskModal(t){
  const x = t || {title:'', related:'Cá nhân', due:dayISO(3), priority:'med'};
  const rel = DESK_REL.concat((S.projects || []).filter(p => p.status !== 'done').map(p => p.name));
  if (x.related && !rel.includes(x.related)) rel.push(x.related);
  showModal(`<form class="modal" data-form="desk-tk" data-id="${t ? esc(t.id) : ''}"><h3>${t ? 'Sửa việc' : 'Thêm việc hàng ngày'}${closeBtn()}</h3>
    <label class="field">Nội dung ghi chú *<input id="dk-title" name="title" required maxlength="200" value="${esc(x.title)}" placeholder="VD: Gọi lại cho nhà cung cấp thép"></label>
    <label class="field">Liên quan tới (không bắt buộc)<select id="dk-rel" name="related">${opt(rel, x.related)}</select></label>
    <div class="row2"><label class="field">Hạn chót (không bắt buộc)<input id="dk-due" name="due" type="date" value="${esc(x.due || '')}"></label>
      <label class="field">Độ ưu tiên<select id="dk-pri" name="priority">${opt(Object.entries(DESK_PRI).map(([k, [l]]) => [k, l]), x.priority)}</select></label></div>
    <div class="m-actions">${t ? delBtn('desk-tk') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">${t ? 'Lưu' : 'Thêm việc'}</button></div></form>`);
}
FORM['desk-tk'] = (v, f) => {
  const title = String(v.title || '').trim();
  if (!title) return toast('Vui lòng nhập tiêu đề task.');
  const list = deskTasks(), t = list.find(x => x.id === f.dataset.id), data = {title, related:v.related || 'Cá nhân', due:v.due || '', priority:DESK_PRI[v.priority] ? v.priority : 'med'};
  if (t) Object.assign(t, data); else list.unshift({id:'dt' + uid(), ...data, done:false, doneDate:'', created:todayISO()});
  closeModal(); render(); toast(t ? 'Đã lưu việc' : 'Đã thêm việc');
};
DEL['desk-tk'] = id => { const l = deskTasks(), i = l.findIndex(x => x.id === id); if (i >= 0) l.splice(i, 1); };
CHG['desk-tk'] = el => {
  const t = deskTasks().find(x => x.id === el.dataset.id); if (!t) return;
  t.done = el.checked; t.doneDate = el.checked ? todayISO() : '';
  render(); if (el.checked) toast('Đã hoàn thành: ' + t.title);
};

/* ---------- đơn từ ---------- */
function deskReqModal(type){
  const T = DESK_TYPES[type] || DESK_TYPES.xinphep, lv = deskLeave(), tmr = dayISO(1);
  const names = [...new Set(allPeople().map(p => p.name).concat(['Nguyễn Đức Anh', 'Cao Hưng', 'Đỗ Thành Long', 'Phan Bảo Ngọc', 'Ngọc Hà', 'Lê Trung Kiên', 'Nguyễn Trung Thành', 'Ngô Mỹ Duyên']))];
  const projs = (S.projects || []).filter(p => p.status !== 'done');
  showModal(`<form class="modal" data-form="desk-req" data-t="${type}"><h3>Tạo đơn — ${T.form || T.title}${closeBtn()}</h3>
    <div class="sub">Đơn được duyệt tuần tự: Quản lý trực tiếp → Nhân sự (HR).</div>
    ${type === 'xinphep' ? `<label class="field">Loại nghỉ<select id="dr-kind" name="leaveKind">${opt(DESK_LEAVE_KINDS, 'Nghỉ phép năm')}</select></label>
      <div class="row2"><label class="field">${T.dateFrom}<input id="dr-from" name="dateFrom" type="date" required value="${tmr}"></label><label class="field">Đến ngày<input id="dr-to" name="dateTo" type="date" required value="${tmr}"></label></div>
      <div class="small muted">Còn ${lv.left}/${lv.total} ngày phép năm. Nghỉ phép năm cần đăng ký trước ít nhất 3 ngày; không tính Chủ nhật.</div>`
    : `<div class="row2"><label class="field">${T.dateFrom}<input id="dr-from" name="dateFrom" type="date" required value="${tmr}"></label>
      <label class="field">${T.amount}<input id="dr-amt" name="amount" inputmode="numeric" required data-input="desk-money" placeholder="VD: 3.000.000"></label></div>
      ${projs.length ? `<label class="field">Dự án (không bắt buộc — để ghi nhận chi phí)<select id="dr-pid" name="pid"><option value="">— Không gắn dự án —</option>${opt(projs.map(p => [p.id, p.name]), '')}</select></label>` : ''}`}
    <label class="field">${T.reason} *<textarea id="dr-reason" name="reason" rows="3" required maxlength="1000" placeholder="Nhập nội dung..."></textarea></label>
    <div class="field">Cấp duyệt (chọn gợi ý hoặc tự nhập tên)
      <div class="desk-appr">${DESK_ROLES.map((role, i) => `<label><span class="desk-appr-n">${i + 1}</span><input id="dr-a${i}" name="a${i}" list="desk-ppl" value="${esc(['Nguyễn Đức Anh', 'Phan Bảo Ngọc'][i])}" aria-label="${role}"><small>${role}</small></label>`).join('')}</div>
      <datalist id="desk-ppl">${names.map(n => `<option value="${esc(n)}">`).join('')}</datalist></div>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Gửi đơn</button></div></form>`);
}
INP['desk-money'] = el => { const n = deskMoney(el.value); el.value = n ? num(n) : ''; };
FORM['desk-req'] = (v, f) => {
  const type = f.dataset.t, T = DESK_TYPES[type], reason = String(v.reason || '').trim();
  if (!T) return;
  if (!reason) return toast('Vui lòng nhập ' + T.reason.toLowerCase() + '.');
  if (!v.dateFrom) return toast('Vui lòng chọn ngày.');
  const r = {id:'rq' + uid(), by:S.me, type, leaveKind:'', dateFrom:v.dateFrom, dateTo:'', amount:0, pid:v.pid || '', reason, sent:todayISO(), t:Date.now(), steps:[]};
  if (type === 'xinphep'){
    r.leaveKind = DESK_LEAVE_KINDS.includes(v.leaveKind) ? v.leaveKind : DESK_LEAVE_KINDS[0];
    r.dateTo = v.dateTo || v.dateFrom;
    if (r.dateTo < r.dateFrom) return toast('“Đến ngày” phải sau hoặc bằng “Từ ngày”.');
    const days = r.days = deskDays(r.dateFrom, r.dateTo);
    if (!days) return toast('Khoảng nghỉ chỉ gồm Chủ nhật — không cần xin phép.');
    if (r.leaveKind === 'Nghỉ phép năm'){
      if (daysLeft(r.dateFrom) < 3) return toast('Nghỉ phép năm cần đăng ký trước ít nhất 3 ngày.');
      if (days > deskLeave().left) return toast(`Không đủ ngày phép: xin ${days} ngày, còn ${deskLeave().left} ngày.`);
    }
  } else {
    r.amount = deskMoney(v.amount);
    if (!r.amount) return toast('Vui lòng nhập số tiền.');
  }
  r.steps = DESK_ROLES.map((role, i) => {
    const name = String(v['a' + i] || '').trim() || role, p = personByName(name);
    return {who:p ? p.id : '', name, role, status:i ? 'pending' : 'waiting', note:'', at:''};
  });
  r.status = 'pending';
  (S.desk_requests = S.desk_requests || []).unshift(r);
  log(`${person(S.me).name} gửi đơn “${deskReqTitle(r)}”`, T.c);
  if (typeof botPost === 'function') botPost('Đơn từ chờ duyệt', `${person(S.me).name} gửi đơn “${deskReqTitle(r)}” — chờ ${r.steps[0].name} (${r.steps[0].role}) duyệt.`, 'yellow', esc(reason), 'desk', 'req');
  closeModal(); S.sub.desk = 'req'; ui.deskRf = 'all'; render(); toast('Đã gửi đơn — chờ ' + r.steps[0].name + ' duyệt');
};
function deskReqDetail(r){
  const T = DESK_TYPES[r.type] || DESK_TYPES.xinphep, cur = deskCurStep(r), mine = r.by === S.me, stt = deskReqStatus(r);
  const canDec = stt === 'pending' && cur && (deskIsMe(cur) || (LIVE && LIVE.isAdmin));
  const canCancel = mine && stt === 'pending' && !r.steps.some(s => s.status === 'approved');
  const rows = [['Người gửi', esc(person(r.by).name) + (person(r.by).role ? ' — ' + esc(person(r.by).role) : '')], ['Ngày gửi', fmtFull(r.sent)]]
    .concat(r.type === 'xinphep' ? [['Loại nghỉ', esc(r.leaveKind)], ['Thời gian', `${fmtFull(r.dateFrom)}${r.dateTo && r.dateTo !== r.dateFrom ? ' → ' + fmtFull(r.dateTo) : ''} · ${deskDays(r.dateFrom, r.dateTo)} ngày`]]
      : [['Số tiền', '<b>' + vnd(r.amount) + '</b>'], [T.dateFrom, fmtFull(r.dateFrom)]].concat(r.pid && typeof projName === 'function' ? [['Dự án', esc(projName(r.pid))]] : []))
    .concat([[T.reason, esc(r.reason)]]);
  showModal(`<form class="modal" data-id="${esc(r.id)}"><h3><span class="row"><span class="sq" style="--c:${cv(T.c)};--t:${ct(T.c)}">${ic(T.icon, 17)}</span>${esc(deskReqTitle(r))}</span>${closeBtn()}</h3>
    <div class="desk-dl">${rows.map(([k, x]) => `<span>${k}</span><div>${x}</div>`).join('')}</div>
    <div class="stack">${r.steps.map((s, i) => `<div class="desk-apr ${s.status}"><span class="desk-appr-n">${i + 1}</span><div class="ell" style="white-space:normal"><b>${esc(s.name)}</b> <small class="muted">${esc(s.role)}</small>
      <div class="small">${s.status === 'approved' ? 'Đã duyệt' : s.status === 'rejected' ? 'Đã từ chối' : s.status === 'waiting' ? 'Đang chờ duyệt' : 'Chưa xét'}${s.at ? ' · ' + fmtFull(s.at) : ''}${s.note ? ' — “' + esc(s.note) + '”' : ''}</div></div></div>`).join('')}</div>
    ${canDec ? `<label class="field">Ghi chú của bạn (bắt buộc khi từ chối)<textarea id="desk-note" rows="2" maxlength="500" placeholder="VD: Đồng ý, bàn giao việc cho anh Long"></textarea></label>` : ''}
    <div class="m-actions">${canCancel ? `<button type="button" class="btn danger" data-act="del" data-kind="desk-req">Rút đơn</button>` : ''}
      ${canDec ? `<button type="button" class="btn danger" data-act="desk-dec" data-id="${esc(r.id)}" data-v="rejected">Từ chối</button><button type="button" class="btn ok" data-act="desk-dec" data-id="${esc(r.id)}" data-v="approved">${ic('check', 15)}Duyệt</button>` : `<button type="button" class="btn ghost" data-act="modal-close">Đóng</button>`}</div></form>`);
}
DEL['desk-req'] = id => { const r = deskFind(id); if (r && r.by === S.me) S.desk_requests = S.desk_requests.filter(x => x.id !== id); };
// Duyệt xong toàn bộ: nghỉ → Lịch "Nghỉ phép / WFH"; tạm ứng gắn dự án → hoá đơn chi ở Tài chính.
function deskReqFinal(r){
  const name = person(r.by).name;
  if (r.type === 'xinphep' && typeof calAdd === 'function')
    calAdd({title:`${r.leaveKind} — ${name}`, date:r.dateFrom, until:r.dateTo && r.dateTo !== r.dateFrom ? r.dateTo : '', repeat:r.dateTo && r.dateTo !== r.dateFrom ? 'daily' : '', allDay:true, cal:'leave', owner:r.by, note:r.reason, src:'desk:' + r.id});
  if (r.type === 'tamung' && r.pid && typeof finAddInvoice === 'function')
    finAddInvoice(r.pid, {kind:'out', partner:name, amount:r.amount, due:r.dateFrom, task:'Tạm ứng', note:'Tạm ứng — ' + r.reason});
}
ACT['desk-dec'] = (el, d) => {
  const r = deskFind(d.id), cur = r && deskCurStep(r); if (!cur) return;
  if (!(deskIsMe(cur) || (LIVE && LIVE.isAdmin))) return toast('Bạn không phải người duyệt bước này');
  const note = ($('#desk-note') || {}).value || '';
  if (d.v === 'rejected' && !note.trim()) { toast('Vui lòng nhập lý do từ chối'); const n = $('#desk-note'); if (n) n.focus(); return; }
  cur.status = d.v; cur.note = note.trim(); cur.at = todayISO(); if (!cur.who && deskIsMe(cur)) cur.who = S.me;
  const i = r.steps.indexOf(cur), next = r.steps[i + 1];
  if (d.v === 'approved' && next) next.status = 'waiting';
  r.status = deskReqStatus(r);
  const title = deskReqTitle(r), who = person(r.by).name;
  if (d.v === 'approved' && next){
    if (typeof botPost === 'function') botPost('Đơn từ chờ duyệt', `${cur.name} đã duyệt đơn “${title}” của ${who} — chờ ${next.name} (${next.role}) duyệt.`, 'yellow', '', 'desk', 'req');
  } else {
    if (d.v === 'approved') deskReqFinal(r);
    if (typeof botPost === 'function') botPost(d.v === 'approved' ? 'Đơn từ đã duyệt' : 'Đơn từ bị từ chối', `Đơn “${title}” của ${who} ${d.v === 'approved' ? 'đã được duyệt đủ 2 cấp' : 'bị ' + cur.name + ' từ chối: ' + cur.note}.`, d.v === 'approved' ? 'green' : 'red', '', 'desk', 'req');
  }
  log(`${cur.name} ${d.v === 'approved' ? 'duyệt' : 'từ chối'} đơn “${title}” của ${who}`, d.v === 'approved' ? 'green' : 'red');
  closeModal(); render(); toast(d.v === 'approved' ? (next ? 'Đã duyệt — chuyển ' + next.name : 'Đã duyệt đơn') : 'Đã từ chối đơn');
};

/* ---------- điều hướng ---------- */
Object.assign(ACT, {
  'desk-tk-new':() => deskTaskModal(null),
  'desk-tk-edit':(el, d) => { const t = deskTasks().find(x => x.id === d.id); if (t) deskTaskModal(t); },
  'desk-tk-clear':() => {
    if (ui.deskClr !== 1){ ui.deskClr = 1; toast('Bấm lần nữa để xoá tất cả việc đã xong'); setTimeout(() => ui.deskClr = 0, 3000); return; }
    ui.deskClr = 0; const l = deskTasks(), keep = l.filter(t => !t.done); l.splice(0, l.length, ...keep); render(); toast('Đã xoá việc đã xong');
  },
  'desk-att':() => { S.sub.hr = 'cc'; S.sub.att = 'mine'; nav('att'); },
  'desk-tf':(el, d) => { ui.deskTf = d.k; render(); },
  'desk-rf':(el, d) => { ui.deskRf = d.k; render(); },
  'desk-req-new':(el, d) => deskReqModal(d.t),
  'desk-req':(el, d) => { const r = deskFind(d.id); if (r) deskReqDetail(r); },
  'desk-quest':(el, d) => { ui.qtab = typeof ui.qtab === 'object' && ui.qtab ? ui.qtab : {}; ui.qtab[d.k] = d.tab; nav(d.v, d.s); }
});
SEARCH.push(hit => deskTasks().filter(t => hit(t.title)).slice(0, 4).map(t => ({icon:'check', label:t.title, sub:'Task hàng ngày', run:() => { S.sub.desk = 'tasks'; ui.deskTf = 'all'; nav('desk'); }}))
  .concat(deskReqs().filter(r => (r.by === S.me || r.steps.some(deskIsMe)) && hit(deskReqTitle(r) + ' ' + r.reason)).slice(0, 4).map(r => ({icon:'file', label:deskReqTitle(r), sub:'Đơn từ · ' + person(r.by).name, run:() => { nav('desk', 'req'); deskReqDetail(r); }}))));

/* ---------- Dezbot ---------- */
AI.push({re:/đơn từ|tạm ứng|hoàn ứng|đơn xin|đơn (nào )?(của tôi|đang chờ duyệt)|chờ tôi duyệt/, fn:() => {
  const mine = deskReqs().filter(r => r.by === S.me).sort((a, b) => b.t - a.t), inbox = deskInbox();
  const pend = mine.filter(r => deskReqStatus(r) === 'pending');
  const line = r => `<button class="link" data-act="desk-req" data-id="${esc(r.id)}">${esc(deskReqTitle(r))}</button> — ${(() => { const c = deskCurStep(r); const s = deskReqStatus(r); return s === 'pending' ? 'chờ ' + esc(c.name) : s === 'approved' ? 'đã duyệt' : 'bị từ chối'; })()}`;
  return (pend.length ? `Bạn có ${pend.length} đơn đang chờ duyệt:` + list(pend.map(line)) : 'Bạn không có đơn nào đang chờ duyệt.')
    + (inbox.length ? `Có <b>${inbox.length}</b> đơn chờ <b>bạn</b> duyệt:` + list(inbox.map(r => esc(person(r.by).name) + ' · ' + line(r))) : '')
    + (mine.length > pend.length ? 'Gần nhất đã xử lý:' + list(mine.filter(r => deskReqStatus(r) !== 'pending').slice(0, 2).map(line)) : '');
}});
AI.push({re:/ngày phép|phép (năm )?còn|còn .*phép|ngày công|chấm công (của tôi|tháng)/, fn:() => {
  const lv = deskLeave(), a = deskAtt(), last = deskReqs().filter(r => r.by === S.me && r.type === 'xinphep').sort((x, y) => y.t - x.t)[0];
  return `Bạn có <b>${a.worked}/${a.workdays}</b> ngày công tháng này${a.late ? ', ' + a.late + ' lần đi trễ' : ''}, còn <b>${lv.left}/${lv.total}</b> ngày phép năm (đã dùng ${lv.used}).`
    + (last ? ` Đơn nghỉ gần nhất “${esc(deskReqTitle(last))}” ${{approved:'đã được duyệt', rejected:'bị từ chối', pending:'đang chờ duyệt'}[deskReqStatus(last)]}.` : '')
    + ` <button class="link" data-act="desk-req-new" data-t="xinphep">Tạo đơn xin nghỉ</button>`;
}});
AI.push({re:/nhiệm vụ của tôi|việc của tôi|task|việc hàng ngày|tôi (cần )?làm gì/, fn:() => {
  const k = deskKpi(), open = deskSortTasks(deskTasks().filter(t => !t.done));
  return `Bạn đang có <b>${k.open}</b> nhiệm vụ${k.soon.length ? `, ${k.soon.length} việc sắp đến hạn` : ''}${k.overdue.length ? `, <span class="late">${k.overdue.length} việc quá hạn</span>` : ''}. Tuần này đã hoàn thành ${k.week} việc.`
    + list(open.slice(0, 4).map(t => `${esc(t.title)}${t.due ? ' (' + relDay(t.due) + ')' : ''}`)) + `<button class="link" data-act="nav" data-v="desk">Mở Bàn làm việc ›</button>`;
}});
