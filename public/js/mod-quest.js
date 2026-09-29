/* Dezon Workspace — nhiệm vụ & điểm thưởng dùng chung (Quản lý dự án, Kinh doanh, Marketing…). questView(k) vẽ 4 tab: Tổng quan · Nhiệm vụ · Đổi quà · Bảng xếp hạng. */

/* ================= NHIỆM VỤ & ĐIỂM THƯỞNG — dùng chung cho Thi công, Kinh doanh, Marketing ================= */
// Mỗi module đăng ký 1 quy trình: registerQuest('pm', {view:'pm', sub:'quest', perm:'pm', stepWord:'bước thi công', safety:true})
// rồi seed S.quest_<k> = {name, team, teamNote, soon, player, base, pts:{id:{week,total,avail}}, rewards:[{id,name,pts,icon}], redeems:[], steps:[{name, tasks:[{name,pts,who,done,by,date}]}]}
const QUESTS = {};
function registerQuest(k, cfg){
  QUESTS[k] = cfg;
  syncCol('quest_' + k, 'single', () => S['quest_' + k], v => S['quest_' + k] = v, {read:[cfg.perm], write:[cfg.perm], empty:() => blankQuest(S['quest_' + k])});
}
const blankQuest = q => q ? {...q, player:'', pts:{}, redeems:[], base:0, streak:0, lastSafety:'', steps:q.steps.map(st => ({...st, tasks:st.tasks.map(t => ({...t, done:false, by:'', date:''}))}))} : q;
const Q = (k = 'pm') => S['quest_' + k];
// Tạo dữ liệu quy trình gọn: steps = [[tên bước, [[việc, điểm, người, xong?], …]], …]
function mkQuest(name, team, teamNote, soon, steps, pts, rewards, redeems, base){
  return {name, team, teamNote, soon, player:Object.keys(pts)[0] || '', base, pts, rewards, redeems,
    steps:steps.map(([title, tasks]) => ({name:title, tasks:tasks.map(([t, p, who, done], i) => ({name:t, pts:p, who, done:!!done, by:done ? who : '', date:done ? dayISO(-(10 - i)) : ''}))}))};
}
const stepDone = st => st.tasks.length > 0 && st.tasks.every(t => t.done);
const questDone = (k = 'pm') => Q(k).steps.filter(stepDone).length;
const questPts = (k = 'pm') => [sum(Q(k).steps.flatMap(s => s.tasks.filter(t => t.done)), t => t.pts), sum(Q(k).steps.flatMap(s => s.tasks), t => t.pts)];
const questPool = q => { const pool = allPeople().filter(p => (q.team && (p.team || '').includes(q.team)) || q.pts[p.id]); return pool.length ? pool : allPeople(); };
function questView(k){
  const q = Q(k), cfg = QUESTS[k], canEdit = perm(cfg.perm) === 'edit';
  ui.qtab = typeof ui.qtab === 'object' && ui.qtab ? ui.qtab : {};
  const cur = ui.qtab[k] || 'overview';
  const tabs = `<div class="seg">${[['overview','Tổng quan'],['tasks','Nhiệm vụ'],['rewards','Đổi quà'],['rank','Bảng xếp hạng']].map(([t, l]) => `<button class="${cur === t ? 'on' : ''}" data-act="qtab" data-q="${k}" data-k="${t}">${l}</button>`).join('')}</div>`;
  if (!q || !q.steps) return tabs + emptyBox('Chưa có quy trình', 'Quy trình nhiệm vụ chưa được khởi tạo.');
  const rank = Object.entries(q.pts || {}).sort((a, b) => b[1].week - a[1].week);
  const medal = i => { const c = ['yellow','gray','brown'][i] || 'gray'; return `<span class="medal" style="--c:${cv(c === 'gray' ? 'ink-2' : c)};--t:${ct(c)}">${i + 1}</span>`; };
  const [got, tot] = questPts(k), done = questDone(k);
  let body;
  if (cur === 'overview'){
    const weekDone = q.steps.flatMap(s => s.tasks).filter(t => t.done && t.date && daysLeft(t.date) > -7).length;
    const safeToday = q.lastSafety === todayISO();
    body = `<div class="stats">
      ${stat('Nhân sự tham gia', rank.length, esc(q.teamNote || q.team || ''))}
      ${stat('Tổng điểm đã phát', num((q.base || 0) + got), 'Từ đầu quy trình đến nay')}
      ${stat('Nhiệm vụ hoàn thành 7 ngày', weekDone, 'trong ' + esc(q.name))}
      ${stat('Quà đã đổi', (q.redeems || []).length, 'Xem lịch sử tại Đổi quà')}
    </div>
    <div class="grid-3-2"><div class="stack">
      <h2 class="sec-title" style="margin:0">Quy trình đang “chơi”</h2>
      <div class="card pad stack"><div class="row between"><div><b style="font-weight:600">${esc(q.name)}</b><div class="small muted">${q.steps.length} bước · ${esc(q.team || '')}</div></div><button class="btn sm" data-act="qtab" data-q="${k}" data-k="tasks">Chơi tiếp</button></div><div class="kpi-row" style="margin:0"><span>${done}/${q.steps.length} bước · ${num(got)}/${num(tot)} điểm</span><span>${Math.round(done / q.steps.length * 100)}%</span></div>${bar(done / q.steps.length * 100, 'var(--pink)', 'thick')}</div>
      ${QUESTS[k].safety ? `<div class="card pad row between" style="flex-wrap:wrap"><div class="row"><span class="sq" style="--c:var(--orange);--t:var(--orange-t)">${ic('flame', 18)}</span><div><b style="font-weight:600">An toàn lao động hàng ngày</b><div class="small muted">Toàn công trường · chuỗi hiện tại <b style="color:var(--orange)">${q.streak || 0} ngày</b></div></div></div><button class="btn ${safeToday ? 'ghost' : 'ok'} sm" data-act="q-safety" data-q="${k}" ${safeToday || !canEdit ? 'disabled' : ''}>${safeToday ? 'Đã điểm danh hôm nay' : 'Điểm danh an toàn hôm nay'}</button></div>` : ''}
      ${q.soon ? `<div class="card pad row" style="opacity:.6"><span class="sq" style="--c:var(--muted);--t:var(--chip)">${ic('check', 18)}</span><div><b style="font-weight:600">${esc(q.soon)}</b><div class="small muted">Sắp ra mắt — đang thiết kế nhiệm vụ & mốc điểm</div></div></div>` : ''}
    </div>
    <div class="card list-card"><h2 class="sec-title">Bảng xếp hạng tuần này <button class="link" data-act="qtab" data-q="${k}" data-k="rank">Xem tất cả ›</button></h2>
      ${rank.slice(0, 5).map(([id, v], i) => `<div class="li">${medal(i)}${av(id, 30)}<span class="ell"><b>${esc(person(id).name)}</b><small>${esc(person(id).team || person(id).role)}</small></span><span class="end"><b class="num">${num(v.week)}</b><small>điểm</small></span></div>`).join('') || '<div class="empty">Chưa có ai nhận điểm</div>'}
    </div></div>`;
  } else if (cur === 'tasks'){
    const curStep = q.steps.findIndex(s => !stepDone(s));
    const pool = questPool(q);
    body = `<div class="card pad row between" style="flex-wrap:wrap;gap:12px"><div><b style="font-weight:600">${esc(q.name)}</b><div class="small muted">${q.steps.length} bước chính · ${esc(q.team || '')} · Mỗi bước gồm các nhiệm vụ nhỏ, hoàn thành để nhận điểm</div></div>
      <div class="row" style="flex-wrap:wrap"><label class="field" style="flex-direction:row;align-items:center;gap:8px">Người thực hiện<select data-change="q-player" data-q="${k}">${opt(pool.map(x => [x.id, x.name]), q.player)}</select></label><span class="pill pink">${num(got)} / ${num(tot)} điểm</span>${canEdit ? `<button class="btn sm" data-act="q-new" data-q="${k}">${ic('plus', 14)}Tạo nhiệm vụ</button>` : ''}</div></div>
      <div class="kpi-row" style="margin:0"><span></span><span></span></div>${bar(tot ? got / tot * 100 : 0, 'var(--pink)')}
    <div class="steps">${q.steps.map((st, i) => {
      const dn = stepDone(st), state = dn ? 'done' : i === curStep ? 'cur' : i > curStep && curStep >= 0 ? 'lock' : '';
      const sp = [sum(st.tasks.filter(t => t.done), t => t.pts), sum(st.tasks, t => t.pts)];
      return `<div class="step ${state}"><div class="step-h"><span class="step-n">${dn ? ic('check', 14) : state === 'lock' ? ic('x', 12) : i + 1}</span><span>${esc(st.name)}<div class="small muted" style="font-weight:400">${st.tasks.length} nhiệm vụ nhỏ · ${sp[0]}/${sp[1]}đ${state === 'lock' ? ' · Hoàn thành bước trước để mở khoá' : ''}</div></span><span style="margin-left:auto">${dn ? pill('Hoàn thành', 'green') : i === curStep ? pill('Đang làm', 'pink') : pill('Chưa mở', 'gray')}</span></div>
        ${state === 'lock' ? '' : st.tasks.map((t, j) => `<label class="qtask ${t.done ? 'done' : ''}"><input type="checkbox" data-change="q-task" data-q="${k}" data-s="${i}" data-t="${j}" ${t.done ? 'checked' : ''} ${canEdit ? '' : 'disabled'}><span>${esc(t.name)}</span>${t.done ? `<small class="muted">${esc(person(t.by).name)} · ${fmtDate(t.date)}</small>` : t.who ? `<small class="muted">${esc(person(t.who).name)}</small>` : ''}<span class="pts">+${t.pts}</span></label>`).join('')}</div>`;
    }).join('')}</div>`;
  } else if (cur === 'rewards'){
    const ids = Object.keys(q.pts || {});
    const player = q.pts[q.player] ? q.player : ids[0];
    const pl = q.pts[player] || {avail:0};
    body = `<div class="card pad row between" style="flex-wrap:wrap;gap:12px">${player ? av(player, 42) : ''}<div style="flex:1"><b style="font-weight:600">${player ? esc(person(player).name) + ' — ' + esc(person(player).role || person(player).team) : 'Chưa có ai có điểm'}</b><div class="small muted">Điểm khả dụng để đổi quà</div></div><b style="font-size:24px;color:var(--pink)" class="num">${num(pl.avail)} điểm</b>
      ${ids.length ? `<label class="field" style="flex-direction:row;align-items:center;gap:8px">Đổi cho<select data-change="q-player" data-q="${k}">${opt(ids.map(id => [id, person(id).name]), player)}</select></label>` : ''}</div>
    <div class="rewards">${q.rewards.map(r => `<div class="card reward"><span class="sq" style="--c:var(--pink);--t:var(--pink-t)">${ic(r.icon, 18)}</span><b>${esc(r.name)}</b><div class="row between"><span class="pill pink">${num(r.pts)} điểm</span><button class="btn sm" data-act="q-redeem" data-q="${k}" data-id="${r.id}" ${pl.avail < r.pts || !canEdit ? 'disabled' : ''}>${pl.avail < r.pts ? 'Không đủ điểm' : 'Đổi ngay'}</button></div></div>`).join('')}</div>
    <div class="card list-card"><h2 class="sec-title">Lịch sử đổi quà gần đây</h2>${(q.redeems || []).map(r => `<div class="li">${av(r.who, 30)}<span class="ell"><b>${esc(person(r.who).name)} — ${esc(r.reward)}</b><small>${fmtDate(r.date)}</small></span><span class="end late">−${num(r.pts)} điểm</span></div>`).join('') || '<div class="empty">Chưa có lượt đổi quà</div>'}</div>`;
  } else {
    body = `<div class="table-wrap"><table><thead><tr><th>Hạng</th><th>Nhân sự</th><th>Phòng ban</th><th class="r">Điểm tuần này</th><th class="r">Tổng điểm</th><th class="r">Khả dụng</th></tr></thead><tbody>
      ${rank.map(([id, v], i) => `<tr><td>${medal(i)}</td><td><div class="who">${av(id, 26)}${esc(person(id).name)}</div></td><td>${esc(person(id).team || '—')}</td><td class="r b">${num(v.week)}</td><td class="r">${num(v.total)}</td><td class="r">${num(v.avail)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Chưa có dữ liệu</td></tr>'}
    </tbody></table></div>`;
  }
  return tabs + body;
}
ACT.qtab = (el, d) => { ui.qtab = typeof ui.qtab === 'object' && ui.qtab ? ui.qtab : {}; ui.qtab[d.q || 'pm'] = d.k; render(); };
CHG['q-player'] = el => { Q(el.dataset.q).player = el.value; render(); };
CHG['q-task'] = el => {
  const k = el.dataset.q, q = Q(k), st = q.steps[+el.dataset.s], t = st.tasks[+el.dataset.t];
  const who = t.who && allPeople().some(p => p.id === t.who) ? t.who : q.player;
  const pl = q.pts[who] || (q.pts[who] = {week:0, total:0, avail:0});
  const kk = el.checked ? 1 : -1;
  t.done = el.checked; t.by = who; t.date = todayISO();
  pl.week += kk * t.pts; pl.total += kk * t.pts; pl.avail += kk * t.pts;
  if (el.checked){
    toast(`+${t.pts} điểm cho ${person(who).name}`);
    if (stepDone(st)){ log(`${person(who).name} hoàn thành bước “${st.name}”`, 'pink'); if (typeof botPost === 'function') botPost('Hoàn thành bước', `${person(who).name} đã xong bước ${+el.dataset.s + 1} “${st.name}” — ${q.name}.`, 'green', esc(q.name), QUESTS[k].view, QUESTS[k].sub || 'quest'); }
  }
  render();
};
ACT['q-redeem'] = (el, d) => {
  const q = Q(d.q), r = q.rewards.find(x => x.id === d.id), who = q.pts[q.player] ? q.player : Object.keys(q.pts)[0], pl = q.pts[who];
  if (!pl || pl.avail < r.pts) return;
  pl.avail -= r.pts; (q.redeems = q.redeems || []).unshift({who, reward:r.name, pts:r.pts, date:todayISO()});
  log(`${person(who).name} đổi “${r.name}”`, 'pink'); render(); toast('Đã đổi quà: ' + r.name);
};
ACT['q-safety'] = (el, d) => { const q = Q(d.q || 'pm'); if (q.lastSafety === todayISO()) return; q.streak = q.lastSafety === dayISO(-1) ? (q.streak || 0) + 1 : 1; q.lastSafety = todayISO(); log('Điểm danh an toàn lao động — chuỗi ' + q.streak + ' ngày', 'orange'); render(); toast('Chuỗi an toàn: ' + q.streak + ' ngày'); };
ACT['q-new'] = (el, d) => {
  const q = Q(d.q), curStep = Math.max(0, q.steps.findIndex(s => !stepDone(s)));
  showModal(`<form class="modal" data-form="q-new" data-q="${d.q}"><h3>Tạo nhiệm vụ mới${closeBtn()}</h3><div class="sub">Dành cho trưởng nhóm — tạo nhiệm vụ và chỉ định nhân sự tham gia.</div>
    <label class="field">Tên nhiệm vụ *<input id="qn-name" name="name" required placeholder="VD: Kiểm tra chất lượng cốt thép"></label>
    <label class="field">Thuộc ${QUESTS[d.q].stepWord}<select id="qn-step" name="step">${opt(q.steps.map((s, i) => [i, (i + 1) + '. ' + s.name]), curStep)}</select></label>
    <div class="row2"><label class="field">Nhân sự tham gia<select id="qn-who" name="who">${peopleOpts('', 'Chưa gán')}</select></label><label class="field">Điểm thưởng<input id="qn-pts" name="pts" type="number" min="0" value="20"></label></div>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Tạo nhiệm vụ</button></div></form>`);
};
FORM['q-new'] = (v, f) => {
  const q = Q(f.dataset.q), st = q.steps[+v.step];
  st.tasks.push({name:v.name.trim(), pts:Math.max(0, +v.pts || 0), done:false, who:v.who || '', by:'', date:''});
  log(`Tạo nhiệm vụ “${v.name.trim()}” — ${st.name}`, 'pink'); closeModal(); render(); toast('Đã tạo nhiệm vụ');
};

