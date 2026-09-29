/* Dezon Workspace — Lịch: xem Ngày / Tuần / Tháng, lịch của tôi + lịch module + lịch đồng nghiệp, tạo/sửa sự kiện (lặp lại, phòng, họp video, khách mời),
   cảnh báo trùng lịch khách, kéo thả đổi giờ/ngày (bước 30 phút), vạch giờ hiện tại. */

if (!IC.calendar) IC.calendar = '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>';
const CAL_md = s => addDays(md(s), -2); // mockup: hôm nay = 23/09/2026
const CAL_H0 = 7, CAL_H1 = 23, CAL_PX = 44; // khung giờ hiển thị, px mỗi giờ (30 phút = 22px)
const CAL_WD = ['CN','T2','T3','T4','T5','T6','T7'];
// Lịch module / lịch dùng chung: [mã, tên, màu]. Module khác gọi calAdd({cal:'<mã>', …}).
const CAL_MODS = [['qs','Lịch QS','orange'], ['fin','Lịch Tài chính','yellow'], ['project','Lịch Dự án','blue'], ['hr','Lịch nhân sự','green'],
  ['trip','Lịch Công tác','pink'], ['ot','Lịch Tăng ca','brown'], ['care','Lịch hậu mãi','orange'], ['leave','Nghỉ phép / WFH','red']];
const CAL_ROOMS = ['Phòng họp 1 — B122', 'Phòng họp 2 — B123', 'Phòng Lab vật liệu B123'];
const CAL_DEF_ON = {me:1, qs:1, fin:1, project:1, hr:1};
const CAL_REPEAT = [['', 'Không lặp lại'], ['daily', 'Hằng ngày'], ['weekly', 'Hằng tuần'], ['monthly', 'Hằng tháng']];
const CAL_PERMS = [['invite', 'Khách được mời người khác'], ['list', 'Khách xem danh sách khách'], ['view', 'Khách chỉ xem sự kiện']];

// Sự kiện: {id, title, date, start 'HH:MM', end 'HH:MM', allDay, repeat ''|daily|weekly|monthly, until, cal 'me'|mã module, owner, guests:[mã], room, link, guestPerm, note}
syncCol('cal_events', 'array', () => S.cal_events, v => S.cal_events = v, {read:'all', write:'all', empty:() => []});
// Tuỳ chọn hiển thị theo người: {mã: {on:{mã lịch: bool}, people:[mã đồng nghiệp đang so sánh]}}
syncCol('cal_prefs', 'map', () => S.cal_prefs, v => S.cal_prefs = v, {read:'all', write:'all', empty:() => ({})});

SEEDS.push(s => {
  ensurePeople(s, [{id:'cao-hung', name:'Cao Hưng', role:'CEO', team:'Ban giám đốc', c:'orange'}, {id:'le-trung-kien', name:'Lê Trung Kiên', role:'Trưởng phòng kỹ thuật', team:'Kỹ thuật', c:'blue'},
    {id:'nguyen-trung-thanh', name:'Nguyễn Trung Thành', role:'Trưởng phòng kinh doanh', team:'Kinh doanh', c:'purple'}, {id:'ngo-my-duyen', name:'Ngô Mỹ Duyên', role:'Chuyên viên đào tạo', team:'Nhân sự', c:'green'}]);
  const E = (date, cal, title, start, end, x = {}) => ({id:'ev' + uid(), title, date:CAL_md(date), start, end, allDay:false, repeat:'', until:'', cal, owner:'ta', guests:[], room:'', link:'', guestPerm:'invite', note:'', ...x});
  s.cal_events = [
    E('2026-09-21', 'project', 'Giao ban đầu tuần', '08:00', '08:30', {repeat:'weekly', room:CAL_ROOMS[0], guests:['da', 'lv', 'nh']}),
    E('2026-09-21', 'fin', 'Họp nhanh tài chính', '10:00', '10:30', {guests:['bn']}),
    E('2026-09-21', 'qs', 'Check-in ứng dụng', '10:30', '11:00'),
    E('2026-09-21', 'project', 'Họp Vua Thầu', '15:00', '16:00'),
    E('2026-09-22', 'me', 'Dashboard MKT', '14:00', '14:30'),
    E('2026-09-22', 'qs', 'Check-in Alpha', '17:00', '18:00'),
    E('2026-09-23', 'fin', 'Họp tài chính & Review', '10:00', '11:00', {guests:['bn', 'cao-hung'], room:CAL_ROOMS[1]}),
    E('2026-09-23', 'qs', 'Họp bóc tách thi công', '11:30', '12:30', {guests:['hoa']}),
    E('2026-09-23', 'me', 'Review App', '13:30', '15:00', {guests:['le-trung-kien', 'hoa'], link:'https://meet.jit.si/dezon-review-app'}),
    E('2026-09-23', 'qs', 'Check-in QS', '16:00', '17:00'),
    E('2026-09-23', 'hr', 'Học online với thầy Tài', '21:00', '22:00'),
    E('2026-09-24', 'project', 'Họp team Dự án (Nội bộ)', '12:00', '12:30'),
    E('2026-09-24', 'hr', 'Họp kế hoạch nhân sự', '12:30', '13:00', {guests:['dp']}),
    E('2026-09-24', 'me', 'Họp kinh doanh tổng', '16:30', '17:30', {guests:['nguyen-trung-thanh', 'cao-hung'], room:CAL_ROOMS[0]}),
    E('2026-09-25', 'project', 'Họp vua thầu', '14:00', '15:00'),
    E('2026-09-25', 'me', 'Họp RnD tuần', '15:00', '16:00'),
    E('2026-09-25', 'project', 'Tham quan nhà mẫu dự án Bđs Q7', '16:00', '18:00'),
    E('2026-09-28', 'hr', 'Họp toàn công ty quý 3', '09:00', '10:30', {room:'Hội trường tầng 5', note:'Tổng kết quý 3, phương hướng quý 4. Toàn thể trưởng bộ phận tham dự.'}),
    E('2026-09-18', 'leave', 'Nghỉ ốm — Trần Anh', '09:00', '10:00', {allDay:true, repeat:'daily', until:CAL_md('2026-09-19')}),
    // lịch đồng nghiệp (để so sánh / cảnh báo trùng lịch khách mời)
    E('2026-09-22', 'me', 'Họp nội bộ', '09:00', '10:00', {owner:'cao-hung'}),
    E('2026-09-24', 'me', 'Công tác', '13:30', '15:00', {owner:'le-trung-kien'}),
    E('2026-09-21', 'me', 'Họp khách hàng', '16:00', '17:00', {owner:'nguyen-trung-thanh'}),
    E('2026-09-25', 'me', 'Đào tạo', '09:30', '11:00', {owner:'ngo-my-duyen'}),
    E('2026-09-24', 'me', 'Đi công trình Thảo Điền', '08:30', '11:00', {owner:'da'})
  ];
});

/* ---------- dữ liệu ---------- */
const calHM = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
const calFind = id => (S.cal_events || []).find(e => e.id === id);
const calCanEdit = e => !LIVE || !!LIVE.isAdmin || e.owner === S.me;
function calPref(){
  S.cal_prefs = S.cal_prefs || {};
  const p = S.cal_prefs[S.me] = S.cal_prefs[S.me] || {on:{}, people:[]};
  p.on = p.on || {}; p.people = (p.people || []).filter(id => id !== S.me);
  return p;
}
const calOf = (e, id) => (e.owner === id && e.cal === 'me') || (e.guests || []).includes(id);
function calCals(){
  const pf = calPref(), me = person(S.me);
  const L = [{key:'me', name:me.name, c:me.c || 'purple', group:'mine', match:e => calOf(e, S.me)}]
    .concat(pf.people.map(id => ({key:'u:' + id, name:person(id).name, c:person(id).c || 'gray', group:'mine', person:id, match:e => calOf(e, id)})))
    .concat(CAL_MODS.map(([k, n, c]) => ({key:k, name:n, c, group:'follow', match:e => e.cal === k})))
    .concat(CAL_ROOMS.map((r, i) => ({key:'room' + i, name:r, c:'gray', group:'follow', room:true, match:e => e.room === r})));
  return L.map(x => ({...x, on:pf.on[x.key] !== undefined ? !!pf.on[x.key] : x.key === 'me' || x.key.startsWith('u:') || !!CAL_DEF_ON[x.key]}));
}
// Sự kiện có diễn ra vào ngày d (tính cả lặp lại)?
function calOccurs(e, d){
  if (!e.date || d < e.date || (e.until && d > e.until)) return false;
  if (!e.repeat) return d === e.date;
  if (e.repeat === 'daily') return true;
  if (e.repeat === 'weekly') return diffDays(e.date, d) % 7 === 0;
  if (e.repeat === 'monthly') return parseD(d).getDate() === parseD(e.date).getDate();
  return false;
}
// Sự kiện hiển thị trong ngày theo các lịch đang bật; màu = lịch khớp đầu tiên.
function calVisibleOn(d, cals = calCals().filter(c => c.on)){
  return (S.cal_events || []).filter(e => calOccurs(e, d)).map(e => { const c = cals.find(x => x.match(e)); return c ? {...e, occ:d, color:c.c, ck:c.key} : null; }).filter(Boolean)
    .sort((a, b) => (b.allDay - a.allDay) || a.start.localeCompare(b.start));
}
/* API cho module khác */
function calEventsOn(d){ return calVisibleOn(d).map(e => ({id:e.id, title:e.title, start:e.allDay ? '' : e.start, end:e.allDay ? '' : e.end, allDay:!!e.allDay, cal:e.cal, color:e.color})); }
function calAdd(ev = {}){
  const e = {id:'ev' + uid(), title:'', date:todayISO(), start:'09:00', end:'10:00', allDay:false, repeat:'', until:'', cal:'me', owner:S.me, guests:[], room:'', link:'', guestPerm:'invite', note:'', ...ev};
  e.title = String(e.title || 'Sự kiện'); e.guests = [].concat(e.guests || []);
  (S.cal_events = S.cal_events || []).push(e);
  return e;
}
// Trùng lịch: với mỗi người trong ids, các sự kiện khác (không phải exceptId) cùng ngày chồng giờ.
function calConflicts(ids, d, start, end, allDay, exceptId){
  const s = allDay ? 0 : toMin(start), en = allDay ? 1440 : toMin(end), out = [];
  ids.forEach(id => (S.cal_events || []).forEach(e => {
    if (e.id === exceptId || !calOccurs(e, d) || !((e.owner === id) || (e.guests || []).includes(id))) return;
    const es = e.allDay ? 0 : toMin(e.start), ee = e.allDay ? 1440 : toMin(e.end);
    if (s < ee && es < en) out.push({id, e});
  }));
  return out;
}
const calRoomBusy = (room, d, start, end, allDay, exceptId) => !room ? [] : (S.cal_events || []).filter(e => e.id !== exceptId && e.room === room && calOccurs(e, d)
  && (allDay || e.allDay || (toMin(start) < toMin(e.end) && toMin(e.start) < toMin(end))));

/* ---------- giao diện ---------- */
const calMon = d => addDays(d, -((parseD(d).getDay() + 6) % 7));
function calRange(){
  const v = ui.calV || 'week', d = ui.calD || todayISO();
  if (v === 'day') return [d];
  if (v === 'week'){ const m = calMon(d); return Array.from({length:7}, (_, i) => addDays(m, i)); }
  const x = parseD(d); return monthCells(x.getFullYear(), x.getMonth()).map(iso);
}
function calLabel(){
  const v = ui.calV || 'week', d = ui.calD || todayISO(), x = parseD(d);
  if (v === 'day') return longDate(d);
  if (v === 'month') return `Tháng ${x.getMonth() + 1}, ${x.getFullYear()}`;
  const a = parseD(calMon(d)), b = parseD(addDays(calMon(d), 6));
  return a.getMonth() === b.getMonth() ? `${a.getDate()} – ${b.getDate()}/${b.getMonth() + 1}/${b.getFullYear()}` : `${a.getDate()}/${a.getMonth() + 1} – ${b.getDate()}/${b.getMonth() + 1}/${b.getFullYear()}`;
}
// Xếp các sự kiện chồng giờ thành cột cạnh nhau
function calLayout(evs){
  evs.sort((a, b) => a.s - b.s || b.e - a.e);
  let group = [], end = -1;
  const flush = () => { const cols = []; group.forEach(x => { let i = cols.findIndex(ce => ce <= x.s); if (i < 0){ i = cols.length; cols.push(0); } cols[i] = x.e; x.col = i; }); group.forEach(x => x.n = cols.length); group = []; };
  evs.forEach(x => { if (x.s >= end) flush(); group.push(x); end = Math.max(end, x.e); });
  flush();
  return evs;
}
const calNowTop = () => { const n = new Date(), m = n.getHours() * 60 + n.getMinutes(); return m < CAL_H0 * 60 || m > CAL_H1 * 60 ? -1 : (m - CAL_H0 * 60) / 60 * CAL_PX; };
function calEvBtn(e){
  const g = (e.guests || []).length;
  return `<button class="cal-ev ${e.h < 34 ? 'short' : ''}" data-act="cal-ev" data-id="${esc(e.id)}" data-occ="${e.occ}" ${calCanEdit(e) ? 'data-dragev="1"' : ''} style="--c:${cv(e.color)};--t:${ct(e.color)};top:${e.top}px;height:${e.h}px;left:calc(${e.col / e.n * 100}% + 2px);width:calc(${100 / e.n}% - 4px)" title="${esc(e.title)} · ${e.start}–${e.end}${e.room ? ' · ' + esc(e.room) : ''}">
    <b class="t">${e.repeat ? '↻ ' : ''}${esc(e.title)}</b><span class="s">${e.start} – ${e.end}${e.room ? ' · ' + esc(e.room) : ''}${g ? ' · ' + g + ' khách' : ''}</span></button>`;
}
function calTimeGrid(days){
  const today = todayISO(), H = CAL_H1 - CAL_H0, cals = calCals().filter(c => c.on);
  const per = days.map(d => calVisibleOn(d, cals));
  const hasAll = per.some(l => l.some(e => e.allDay));
  const cols = `grid-template-columns:52px repeat(${days.length},minmax(${days.length > 1 ? 92 : 200}px,1fr))`;
  const headRow = `<div class="cal-row cal-head" style="${cols}"><span></span>${days.map(d => `<button class="cal-dh ${d === today ? 'today' : ''}" data-act="cal-go" data-d="${d}" data-v="day"><small>${CAL_WD[parseD(d).getDay()]}</small><b>${parseD(d).getDate()}</b></button>`).join('')}</div>`;
  const allRow = hasAll ? `<div class="cal-row cal-allday" style="${cols}"><span class="small muted">Cả ngày</span>${per.map(l => `<div>${l.filter(e => e.allDay).map(e => `<button class="cal-chip" data-act="cal-ev" data-id="${esc(e.id)}" style="--c:${cv(e.color)};--t:${ct(e.color)}">${esc(e.title)}</button>`).join('')}</div>`).join('')}</div>` : '';
  const nowTop = calNowTop();
  const body = `<div class="cal-row cal-body" style="${cols}">
    <div class="cal-gut" style="height:${H * CAL_PX}px">${Array.from({length:H}, (_, i) => `<span style="top:${i * CAL_PX}px">${pad(CAL_H0 + i)}:00</span>`).join('')}${days.includes(today) && nowTop >= 0 ? `<em class="cal-now-l" style="top:${nowTop}px">${nowHM()}</em>` : ''}</div>
    ${days.map((d, i) => {
      const evs = calLayout(per[i].filter(e => !e.allDay).map(e => {
        const s = clamp(toMin(e.start), CAL_H0 * 60, CAL_H1 * 60 - 20), en = clamp(Math.max(toMin(e.end), s + 20), s + 20, CAL_H1 * 60);
        return {...e, s, e:en, top:(s - CAL_H0 * 60) / 60 * CAL_PX, h:Math.max(20, (en - s) / 60 * CAL_PX - 2)};
      }));
      return `<div class="cal-col ${d === today ? 'today' : ''}" data-act="cal-slot" data-d="${d}" style="height:${H * CAL_PX}px;--hr:${CAL_PX}px">
        ${evs.map(calEvBtn).join('')}${d === today && nowTop >= 0 ? `<div class="cal-now" id="calNow" data-d="${d}" style="top:${nowTop}px"><i></i></div>` : ''}</div>`;
    }).join('')}</div>`;
  return `<div class="card cal-wrap"><div class="cal-grid-t" style="min-width:${52 + days.length * (days.length > 1 ? 92 : 200)}px">${headRow}${allRow}${body}</div></div>`;
}
function calMonthGrid(days){
  const today = todayISO(), m = parseD(ui.calD || today).getMonth(), cals = calCals().filter(c => c.on);
  return `<div class="card cal-wrap"><div class="cal-month">${['T2','T3','T4','T5','T6','T7','CN'].map(x => `<div class="cal-mh">${x}</div>`).join('')}
    ${days.map(d => {
      const l = calVisibleOn(d, cals), out = parseD(d).getMonth() !== m;
      return `<div class="cal-mc ${out ? 'out' : ''} ${d === today ? 'today' : ''}" data-act="cal-new" data-d="${d}" data-drop="calev:${d}">
        <button class="cal-mn" data-act="cal-go" data-d="${d}" data-v="day" aria-label="Xem ngày ${fmtFull(d)}">${parseD(d).getDate()}</button>
        ${l.slice(0, 3).map(e => `<button class="cal-chip" data-act="cal-ev" data-id="${esc(e.id)}" ${calCanEdit(e) ? `draggable="true" data-drag="calev:${esc(e.id)}|${d}"` : ''} style="--c:${cv(e.color)};--t:${ct(e.color)}">${e.allDay ? '' : `<small>${e.start}</small> `}${esc(e.title)}</button>`).join('')}
        ${l.length > 3 ? `<button class="cal-more" data-act="cal-go" data-d="${d}" data-v="day">+${l.length - 3} sự kiện</button>` : ''}</div>`;
    }).join('')}</div></div>`;
}
function calSide(){
  const cur = ui.calD || todayISO(), mini = ui.calMini || cur.slice(0, 8) + '01', x = parseD(mini), today = todayISO();
  const range = calRange(), cals = calCals(), on = cals.filter(c => c.on), pf = calPref();
  const cells = monthCells(x.getFullYear(), x.getMonth()).map(dt => {
    const d = iso(dt), n = calVisibleOn(d, on).length;
    return `<button class="cal-md ${dt.getMonth() !== x.getMonth() ? 'out' : ''} ${range.includes(d) && (ui.calV || 'week') !== 'month' ? 'in' : ''} ${d === today ? 'today' : ''} ${d === cur ? 'sel' : ''}" data-act="cal-go" data-d="${d}" aria-label="${fmtFull(d)}${n ? ', ' + n + ' sự kiện' : ''}">${dt.getDate()}${n ? '<i></i>' : ''}</button>`;
  }).join('');
  const row = c => `<div class="cal-cl"><button class="cal-tog ${c.on ? 'on' : ''}" data-act="cal-tog" data-k="${esc(c.key)}" style="--c:${cv(c.c)}" aria-pressed="${c.on}"><span class="cal-box">${c.on ? ic('check', 11) : ''}</span><span class="ell">${esc(c.name)}</span></button>${c.person ? `<button class="icon-btn sm" data-act="cal-rm" data-id="${esc(c.person)}" aria-label="Bỏ so sánh ${esc(c.name)}" title="Bỏ so sánh">${ic('x', 13)}</button>` : c.key === 'me' ? '<span class="pill gray">Tôi</span>' : c.room ? '<span class="pill gray">Phòng</span>' : ''}</div>`;
  const others = allPeople().filter(p => p.id !== S.me && !pf.people.includes(p.id));
  return `<aside class="cal-side">
    <div class="card pad cal-mini"><div class="row between"><b>Tháng ${x.getMonth() + 1}, ${x.getFullYear()}</b><span class="row" style="gap:2px"><button class="icon-btn sm" data-act="cal-mini" data-n="-1" aria-label="Tháng trước">${ic('left', 15)}</button><button class="icon-btn sm" data-act="cal-mini" data-n="1" aria-label="Tháng sau">${ic('chev', 15)}</button></span></div>
      <div class="cal-mgrid">${['T2','T3','T4','T5','T6','T7','CN'].map(d => `<span>${d}</span>`).join('')}${cells}</div></div>
    <div class="card pad stack"><h2 class="sec-title" style="margin:0">Lịch của tôi & đồng nghiệp</h2>
      ${cals.filter(c => c.group === 'mine').map(row).join('')}
      ${others.length ? `<select class="cal-add" data-change="cal-add-person" aria-label="Thêm đồng nghiệp để so sánh"><option value="">+ Thêm đồng nghiệp để so sánh</option>${others.map(p => `<option value="${esc(p.id)}">${esc(p.name)}${p.role ? ' — ' + esc(p.role) : ''}</option>`).join('')}</select>` : ''}
      <div class="small muted">Hiện sự kiện đồng nghiệp tổ chức hoặc được mời — dùng để tìm giờ trống khi xếp lịch.</div></div>
    <div class="card pad stack"><h2 class="sec-title" style="margin:0">Đang theo dõi</h2><div class="cal-follow">${cals.filter(c => c.group === 'follow').map(row).join('')}</div></div>
  </aside>`;
}
MOD.cal = () => {
  const v = ui.calV || 'week', range = calRange();
  const todayN = calVisibleOn(todayISO()).length;
  return head(`${ic('calendar', 22)} Lịch`, `Lịch họp & sự kiện toàn công ty · hôm nay có ${todayN} sự kiện`, `<button class="btn" data-act="cal-new">${ic('plus', 15)}Tạo sự kiện</button>`)
    + `<div class="cal-layout">${calSide()}<div class="stack" style="min-width:0">
      <div class="toolbar"><button class="btn line sm" data-act="cal-today">Hôm nay</button>
        <span class="row" style="gap:2px"><button class="icon-btn" data-act="cal-step" data-n="-1" aria-label="${v === 'day' ? 'Ngày trước' : v === 'week' ? 'Tuần trước' : 'Tháng trước'}">${ic('left')}</button><button class="icon-btn" data-act="cal-step" data-n="1" aria-label="${v === 'day' ? 'Ngày sau' : v === 'week' ? 'Tuần sau' : 'Tháng sau'}">${ic('chev')}</button></span>
        <b class="cal-lbl">${calLabel()}</b>
        <div class="seg" style="margin-left:auto">${[['day', 'Ngày'], ['week', 'Tuần'], ['month', 'Tháng']].map(([k, l]) => `<button class="${v === k ? 'on' : ''}" data-act="cal-view" data-v="${k}">${l}</button>`).join('')}</div></div>
      ${v === 'month' ? calMonthGrid(range) : calTimeGrid(range)}
      <div class="small muted">Bấm vào ô trống để tạo sự kiện · kéo thả sự kiện để đổi giờ / ngày (bước 30 phút) · ↻ = sự kiện lặp lại.</div>
    </div></div>`;
};
let CAL_timer = 0;
AFTER.cal = () => {
  clearInterval(CAL_timer);
  CAL_timer = setInterval(() => {
    const n = document.getElementById('calNow');
    if (S.view !== 'cal'){ clearInterval(CAL_timer); return; }
    if (n && n.dataset.d !== todayISO()){ render(); return; }
    const top = calNowTop(); if (!n || top < 0) return;
    n.style.top = top + 'px';
    const l = document.querySelector('.cal-now-l'); if (l){ l.style.top = top + 'px'; l.textContent = nowHM(); }
  }, 60000);
};

/* ---------- tạo / sửa sự kiện ---------- */
const CAL_TIMES = Array.from({length:48}, (_, i) => calHM(i * 30));
function calModal(e, preset = {}){
  const x = e || {title:'', date:preset.date || ui.calD || todayISO(), start:preset.start || '09:00', end:preset.end || '10:00', allDay:false, repeat:'', until:'', cal:'me', owner:S.me, guests:[], room:'', link:'', guestPerm:'invite', note:''};
  const ro = e && !calCanEdit(e), dis = ro ? 'disabled' : '';
  const ends = CAL_TIMES.slice(1).concat('24:00');
  const withCur = (arr, v) => arr.includes(v) ? arr : arr.concat(v).sort();
  const people = allPeople().filter(p => p.id !== x.owner);
  const rooms = withCur(CAL_ROOMS, x.room || CAL_ROOMS[0]);
  showModal(`<form class="modal wide" id="calForm" data-form="cal-ev" data-id="${e ? esc(e.id) : ''}"><h3>${e ? (ro ? 'Chi tiết sự kiện' : 'Sửa sự kiện') : 'Tạo sự kiện'}${closeBtn()}</h3>
    ${e ? `<div class="sub">Người tạo: ${esc(person(x.owner).name)}${ro ? ' · bạn chỉ xem được sự kiện này' : ''}</div>` : ''}
    <input class="cal-title" id="ce-title" name="title" required maxlength="160" placeholder="Thêm tiêu đề" value="${esc(x.title)}" aria-label="Tiêu đề sự kiện" ${dis}>
    <div class="row3"><label class="field">Ngày<input id="ce-date" name="date" type="date" required value="${esc(x.date)}" data-change="cal-f" ${dis}></label>
      <label class="field">Bắt đầu<select id="ce-start" name="start" data-change="cal-f" ${x.allDay || ro ? 'disabled' : ''}>${opt(withCur(CAL_TIMES, x.start), x.start)}</select></label>
      <label class="field">Kết thúc<select id="ce-end" name="end" data-change="cal-f" ${x.allDay || ro ? 'disabled' : ''}>${opt(withCur(ends, x.end), x.end)}</select></label></div>
    <div class="row3"><label class="row small cal-chk"><input type="checkbox" id="ce-all" name="allDay" value="1" data-change="cal-f" ${x.allDay ? 'checked' : ''} ${dis}> Cả ngày</label>
      <label class="field">Lặp lại<select id="ce-rep" name="repeat" data-change="cal-f" ${dis}>${opt(CAL_REPEAT, x.repeat)}</select></label>
      <label class="field">Lặp đến ngày (không bắt buộc)<input id="ce-until" name="until" type="date" value="${esc(x.until || '')}" ${x.repeat ? '' : 'disabled'} ${dis}></label></div>
    <div class="row2"><label class="field">Lịch<select id="ce-cal" name="cal" ${dis}>${opt([['me', 'Lịch của ' + person(x.owner).name]].concat(CAL_MODS.map(([k, n]) => [k, n])), x.cal)}</select></label>
      <label class="field">Phòng (không bắt buộc)<select id="ce-room" name="room" data-change="cal-f" ${dis}><option value="">— Không đặt phòng —</option>${opt(rooms, x.room)}</select></label></div>
    <div class="field">Cuộc họp video<div class="row"><input id="ce-link" name="link" type="url" placeholder="https://… (Google Meet, Zoom, Jitsi…)" value="${esc(x.link || '')}" ${dis} style="flex:1">
      ${ro ? (x.link && /^https?:\/\//.test(x.link) ? `<a class="btn line sm" href="${esc(x.link)}" target="_blank" rel="noopener">${ic('external', 14)}Tham gia</a>` : '') : `<button type="button" class="btn line sm" data-act="cal-link">${ic('plus', 14)}Tạo link họp</button>`}</div></div>
    <div class="field"><span>Khách mời <b id="ce-gn" style="color:var(--ink)">(${1 + (x.guests || []).length} người, gồm người tổ chức)</b></span>
      ${ro ? '' : `<input id="ce-gq" data-input="cal-gq" placeholder="Tìm người trong danh bạ…" autocomplete="off">`}
      <div class="checks cal-guests" id="ce-guests">${people.map(p => `<label data-n="${esc((p.name + ' ' + (p.role || '') + ' ' + (p.team || '')).toLowerCase())}"><input type="checkbox" name="guests" value="${esc(p.id)}" data-change="cal-f" ${(x.guests || []).includes(p.id) ? 'checked' : ''} ${dis}>${av(p.id, 20)}${esc(p.name)}</label>`).join('') || '<span class="small muted">Danh bạ trống</span>'}</div></div>
    <div class="row2"><label class="field">Quyền của khách<select id="ce-perm" name="guestPerm" ${dis}>${opt(CAL_PERMS, x.guestPerm)}</select></label>
      <label class="field">Ghi chú<input id="ce-note" name="note" maxlength="500" value="${esc(x.note || '')}" ${dis}></label></div>
    <div id="calWarn" aria-live="polite"></div>
    <div class="m-actions">${e && !ro ? delBtn('calev') : ''}<button type="button" class="btn ghost" data-act="modal-close">${ro ? 'Đóng' : 'Huỷ'}</button>${ro ? '' : `<button class="btn" type="submit">${e ? 'Lưu' : 'Tạo sự kiện'}</button>`}</div></form>`);
  calWarn();
}
// Đọc form & hiện cảnh báo (không chặn lưu): giờ sai, khách mời bận, phòng đã có người đặt.
function calWarn(){
  const f = $('#calForm'); if (!f) return;
  const g = [...f.querySelectorAll('input[name=guests]:checked')].map(i => i.value);
  const all = f.allDay.checked, date = f.date.value, st = f.start.value, en = f.end.value, id = f.dataset.id, ro = $('#ce-title').disabled;
  f.start.disabled = f.end.disabled = all || ro;
  f.until.disabled = !f.repeat.value || ro;
  const gn = $('#ce-gn'); if (gn) gn.textContent = `(${1 + g.length} người, gồm người tổ chức)`;
  const lines = [], bad = !all && toMin(en) <= toMin(st);
  if (date){
    calConflicts(g, date, st, en, all, id).forEach(({id:p, e}) => lines.push(`${esc(person(p).name)} đang bận ${e.allDay ? 'cả ngày' : e.start + '–' + e.end} (${esc(e.title)})`));
    calRoomBusy(f.room.value, date, st, en, all, id).forEach(e => lines.push(`${esc(f.room.value)} đã được đặt ${e.allDay ? 'cả ngày' : e.start + '–' + e.end} (${esc(e.title)})`));
  }
  $('#calWarn').innerHTML = (bad ? `<div class="small late">Giờ kết thúc phải sau giờ bắt đầu.</div>` : '')
    + (lines.length ? `<div class="cal-warn">${ic('alert', 16)}<div><b>Trùng lịch (vẫn có thể lưu):</b><br>${lines.join('<br>')}</div></div>` : '');
}
CHG['cal-f'] = () => calWarn();
INP['cal-gq'] = el => { const q = el.value.trim().toLowerCase(); document.querySelectorAll('#ce-guests label').forEach(l => l.hidden = !!q && !l.dataset.n.includes(q) && !l.querySelector('input').checked); };
FORM['cal-ev'] = (v, f) => {
  const title = String(v.title || '').trim(), allDay = v.allDay === '1';
  if (!title) return toast('Vui lòng nhập tiêu đề sự kiện.');
  if (!v.date) return toast('Vui lòng chọn ngày.');
  const start = v.start || '09:00', end = v.end || '10:00';
  if (!allDay && toMin(end) <= toMin(start)) return toast('Giờ kết thúc phải sau giờ bắt đầu.');
  const repeat = CAL_REPEAT.some(r => r[0] === v.repeat) ? v.repeat : '', until = repeat ? v.until || '' : '';
  if (until && until < v.date) return toast('Ngày kết thúc lặp phải sau ngày bắt đầu.');
  const link = String(v.link || '').trim();
  if (link && !/^https?:\/\//i.test(link)) return toast('Link họp phải bắt đầu bằng http:// hoặc https://');
  const data = {title, date:v.date, allDay, repeat, until, cal:v.cal || 'me', guests:[].concat(v.guests || []), room:v.room || '', link, guestPerm:v.guestPerm || 'invite', note:String(v.note || '').trim()};
  if (!allDay) Object.assign(data, {start, end});
  let e = calFind(f.dataset.id);
  if (e){ if (!calCanEdit(e)) return; Object.assign(e, data); }
  else e = calAdd({...data, start, end});
  const n = calConflicts(e.guests, e.date, e.start, e.end, e.allDay, e.id).length;
  log(`${person(S.me).name} ${f.dataset.id ? 'cập nhật' : 'tạo'} sự kiện “${title}” ${fmtDate(e.date)}`, 'blue');
  closeModal(); ui.calD = e.date; render();
  toast((f.dataset.id ? 'Đã lưu sự kiện' : 'Đã tạo sự kiện') + (n ? ` — lưu ý ${n} lịch trùng của khách mời` : ''));
};
DEL.calev = id => { const e = calFind(id); if (e && calCanEdit(e)) S.cal_events = S.cal_events.filter(x => x.id !== id); };

/* ---------- điều hướng ---------- */
const calShift = (d, n, v) => { if (v === 'day') return addDays(d, n); if (v === 'week') return addDays(d, 7 * n); const x = parseD(d); return iso(new Date(x.getFullYear(), x.getMonth() + n, 1)); };
Object.assign(ACT, {
  'cal-view':(el, d) => { ui.calV = d.v; render(); },
  'cal-today':() => { ui.calD = todayISO(); ui.calMini = ''; render(); },
  'cal-step':(el, d) => { ui.calD = calShift(ui.calD || todayISO(), +d.n, ui.calV || 'week'); ui.calMini = ''; render(); },
  'cal-go':(el, d) => { ui.calD = d.d; if (d.v) ui.calV = d.v; if (S.view !== 'cal') nav('cal'); else render(); },
  'cal-mini':(el, d) => { const x = parseD(ui.calMini || (ui.calD || todayISO()).slice(0, 8) + '01'); ui.calMini = iso(new Date(x.getFullYear(), x.getMonth() + +d.n, 1)); render(); },
  'cal-tog':(el, d) => { const c = calCals().find(x => x.key === d.k); if (!c) return; calPref().on[d.k] = !c.on; render(); },
  'cal-rm':(el, d) => { const p = calPref(); p.people = p.people.filter(x => x !== d.id); delete p.on['u:' + d.id]; render(); },
  'cal-new':(el, d) => { if (Date.now() - CAL_dragEnd < 300) return; calModal(null, {date:d.d || ui.calD || todayISO()}); },
  'cal-slot':(el, d, e) => {
    if (Date.now() - CAL_dragEnd < 300) return;
    const m = CAL_H0 * 60 + Math.floor((e.clientY - el.getBoundingClientRect().top) / (CAL_PX / 2)) * 30, s = clamp(m, 0, 1410);
    calModal(null, {date:d.d, start:calHM(s), end:calHM(Math.min(s + 60, 1440))});
  },
  'cal-ev':(el, d) => { if (Date.now() - CAL_dragEnd < 300) return; const e = calFind(d.id); if (e) calModal(e); },
  'cal-link':() => { const i = $('#ce-link'); if (i){ i.value = 'https://meet.jit.si/dezon-' + uid() + uid(); i.focus(); } }
});
CHG['cal-add-person'] = el => { if (!el.value) return; const p = calPref(); if (!p.people.includes(el.value)) p.people.push(el.value); p.on['u:' + el.value] = true; render(); };
// Kéo thả trong chế độ Tháng: đổi ngày, giữ giờ (sự kiện lặp: dời cả chuỗi)
DROP.calev = (x, d) => {
  const [id, occ] = x.split('|'), e = calFind(id); if (!e || !calCanEdit(e)) return;
  const k = diffDays(occ, d); if (!k) return;
  e.date = addDays(e.date, k); if (e.until) e.until = addDays(e.until, k);
  CAL_dragEnd = Date.now(); toast(`Đã dời “${e.title}” sang ${fmtDate(d)}`);
};

/* ---------- kéo thả trong chế độ Ngày / Tuần (con trỏ chuột / cảm ứng, bước 30 phút) ---------- */
let CAL_drag = null, CAL_dragEnd = 0;
document.addEventListener('pointerdown', ev => {
  const el = ev.target.closest && ev.target.closest('.cal-ev[data-dragev]');
  if (!el || ev.button !== 0 || S.view !== 'cal') return;
  const e = calFind(el.dataset.id); if (!e) return;
  CAL_drag = {el, e, occ:el.dataset.occ, x0:ev.clientX, y0:ev.clientY, top0:el.offsetTop, dur:Math.max(30, toMin(e.end) - toMin(e.start)), moved:false, id:ev.pointerId};
});
document.addEventListener('pointermove', ev => {
  const g = CAL_drag; if (!g) return;
  const dy = ev.clientY - g.y0, dx = ev.clientX - g.x0;
  if (!g.moved){
    if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;
    g.moved = true; g.el.classList.add('dragging');
    g.el.style.left = '2px'; g.el.style.width = 'calc(100% - 4px)';
    try { g.el.setPointerCapture(g.id); } catch (err) {}
  }
  ev.preventDefault();
  const step = CAL_PX / 2, maxTop = (CAL_H1 - CAL_H0) * CAL_PX - g.el.offsetHeight;
  const top = clamp(Math.round((g.top0 + dy) / step) * step, 0, Math.max(0, Math.floor(maxTop / step) * step));
  g.el.style.top = top + 'px';
  g.el.style.pointerEvents = 'none';
  const under = document.elementFromPoint(ev.clientX, ev.clientY);
  g.el.style.pointerEvents = '';
  const col = under && under.closest && under.closest('.cal-col');
  if (col && col !== g.el.parentElement) col.appendChild(g.el);
  document.querySelectorAll('.cal-col.over').forEach(c => c !== g.el.parentElement && c.classList.remove('over'));
  g.el.parentElement.classList.add('over');
  g.start = CAL_H0 * 60 + Math.round(top / step) * 30; g.day = g.el.parentElement.dataset.d;
  const s = g.el.querySelector('.s'); if (s) s.textContent = calHM(g.start) + ' – ' + calHM(Math.min(1440, g.start + g.dur));
});
function calDragEnd(cancel){
  const g = CAL_drag; CAL_drag = null;
  if (!g || !g.moved) return;
  CAL_dragEnd = Date.now();
  document.querySelectorAll('.cal-col.over').forEach(c => c.classList.remove('over'));
  if (cancel || g.start == null){ render(); return; }
  const e = g.e, k = diffDays(g.occ, g.day), end = Math.min(1440, g.start + g.dur);
  e.date = addDays(e.date, k); if (e.until) e.until = addDays(e.until, k);
  e.start = calHM(g.start); e.end = calHM(end);
  const n = calConflicts(e.guests || [], g.day, e.start, e.end, false, e.id).length;
  render();
  toast(`Đã dời “${e.title}” sang ${fmtDate(g.day)} ${e.start}–${e.end}${n ? ` — ${n} lịch trùng của khách mời` : ''}`);
}
document.addEventListener('pointerup', () => calDragEnd(false));
document.addEventListener('pointercancel', () => calDragEnd(true));

SEARCH.push(hit => (S.cal_events || []).filter(e => hit(e.title) && (calOf(e, S.me) || e.cal !== 'me')).slice(0, 5).map(e => ({icon:'calendar', label:e.title, sub:'Lịch · ' + fmtFull(e.date) + (e.allDay ? '' : ' ' + e.start), run:() => { ui.calD = e.date; nav('cal'); calModal(e); }})));

/* ---------- Dezbot ---------- */
AI.push({re:/lịch (hôm nay|ngày mai|tuần|gì|họp|của tôi)|có lịch|cuộc họp|trùng giờ|trùng lịch|họp gì/, fn:(q, s) => {
  const mine = d => calVisibleOn(d).filter(e => calOf(e, S.me) || e.owner === S.me || e.cal !== 'me');
  const line = e => `${e.allDay ? 'Cả ngày' : e.start + '–' + e.end} · ${esc(e.title)}${e.room ? ' · ' + esc(e.room) : ''}`;
  const week = Array.from({length:7}, (_, i) => addDays(calMon(todayISO()), i));
  if (/trùng/.test(s)){
    const out = [];
    week.forEach(d => { const l = mine(d).filter(e => !e.allDay); l.forEach((a, i) => l.slice(i + 1).forEach(b => { if (toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end)) out.push(`${fmtDate(d)}: “${esc(a.title)}” (${a.start}–${a.end}) trùng “${esc(b.title)}” (${b.start}–${b.end})`); })); });
    return out.length ? `Tuần này có ${out.length} cặp sự kiện trùng giờ:` + list(out) : 'Tuần này không có cuộc họp nào bị trùng giờ.';
  }
  if (/tuần/.test(s)){
    const per = week.map(d => [d, mine(d).length]), tot = sum(per, x => x[1]), max = per.slice().sort((a, b) => b[1] - a[1])[0];
    return `Tuần này (${calLabelWeek(week)}) bạn có <b>${tot}</b> sự kiện${tot ? `, đông nhất ${CAL_WD[parseD(max[0]).getDay()]} ${fmtDate(max[0])} với ${max[1]} sự kiện` : ''}.` + list(per.filter(x => x[1]).map(([d, n]) => `${CAL_WD[parseD(d).getDay()]} ${fmtDate(d)}: ${n} sự kiện`)) + `<button class="link" data-act="cal-go" data-d="${todayISO()}" data-v="week">Mở lịch tuần ›</button>`;
  }
  const d = /ngày mai/.test(s) ? dayISO(1) : todayISO(), l = mine(d);
  return l.length ? `${d === todayISO() ? 'Hôm nay' : 'Ngày mai'} bạn có <b>${l.length}</b> sự kiện:` + list(l.map(line)) + `<button class="link" data-act="cal-go" data-d="${d}" data-v="day">Mở lịch ngày ›</button>` : `${d === todayISO() ? 'Hôm nay' : 'Ngày mai'} bạn chưa có sự kiện nào trên lịch.`;
}});
const calLabelWeek = w => `${fmtDate(w[0])} – ${fmtDate(w[6])}`;
