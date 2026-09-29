/* Dezon Workspace — Cài đặt: tài khoản, giao diện (sáng/tối, màu chủ đạo, mật độ, vị trí menu), thông báo, workspace, thành viên, bảo mật. */

/* ================= giao diện: áp ngay khi nạp trang ================= */
// [key, tên, màu nền sáng, màu nền tối] — CSS tương ứng ở css/settings.css (html[data-accent])
const SET_ACCENTS = [['default','Mặc định Dezon','#131416','#f1f2f3'],['blue','Xanh dương','#2F5DA8','#7AA2E3'],['purple','Tím','#6D4FC2','#A796E8'],['green','Xanh lá','#1E8E5A','#4FC585'],['orange','Cam','#B7791F','#E0AC4F'],['red','Đỏ','#C0392B','#E0685A'],['teal','Ngọc lam','#0E8A82','#3FC2B6']];
const SET_LOOK_DEF = {accent:'default', density:'comfortable', side:'left'};
function SET_look(){ try { return {...SET_LOOK_DEF, ...JSON.parse(localStorage.getItem('sf-look') || '{}')}; } catch (e) { return {...SET_LOOK_DEF}; } }
function SET_apply(l = SET_look()){
  const r = document.documentElement;
  if (l.accent && l.accent !== 'default') r.dataset.accent = l.accent; else delete r.dataset.accent;
  r.dataset.density = l.density === 'compact' ? 'compact' : 'comfortable';
  const f = document.getElementById('frame'); if (f) f.classList.toggle('sb-right', l.side === 'right');
}
function SET_save(patch){ const l = {...SET_look(), ...patch}; try { localStorage.setItem('sf-look', JSON.stringify(l)); } catch (e) {} SET_apply(l); }
SET_apply();

/* ================= dữ liệu ================= */
syncCol('settings', 'single', () => S.settings, v => S.settings = v, {read:'all', write:'admin'});
SEEDS.push(s => {
  s.settings = {company:{name:'Công ty CP Xây dựng Dezon', short:'Dezon', addr:'123 Đại lộ Nguyễn Văn Linh, Quận 7, TP.HCM', hotline:'1900 6868', email:'support@dezon.vn', web:'dezon.vn', tax:'0312xxxxxx', bank:''}, tz:'Asia/Ho_Chi_Minh',
    members:[{id:'m1', name:'Trần Anh', email:'tran.anh@dezon.vn', role:'Quản lý dự án', perm:'admin', status:'active'},
      {id:'m2', name:'Đỗ Thảo Vy', email:'thao.vy@dezon.vn', role:'Head Marketing', perm:'member', status:'active'},
      {id:'m3', name:'Nguyễn Đức Anh', email:'duc.anh@dezon.vn', role:'Chỉ huy trưởng', perm:'member', status:'active'}]};
  const me = s.people.find(p => p.id === 'ta'); if (me){ me.email = me.email || 'tran.anh@dezon.vn'; me.phone = me.phone || '0909 111 222'; }
});

/* ================= hàm tích hợp ================= */
const company = () => ({name:'Công ty Dezon', short:'Dezon', addr:'', hotline:'', email:'', web:'', tax:'', bank:'', ...((S.settings && S.settings.company) || {})});
function companyHead(){
  const c = company();
  const line = [c.addr, c.hotline && 'Hotline: ' + c.hotline, c.email, c.web, c.tax && 'MST: ' + c.tax].filter(Boolean).map(esc).join(' · ');
  return `<b style="font-size:15px">${esc((c.name || 'Công ty Dezon').toUpperCase())}</b>${line ? `<div style="color:#666;font-size:12px">${line}</div>` : ''}`;
}
const SET_NOTIFY_DEF = {chat:true, delay:true, po:false, digest:false};
function notifyPrefs(){ try { return {...SET_NOTIFY_DEF, ...JSON.parse(localStorage.getItem('sf-notify') || '{}')}; } catch (e) { return {...SET_NOTIFY_DEF}; } }

/* ================= trang ================= */
const SET_toggle = (id, on, label, desc, dis) => `<label class="set-row"><span><b>${label}</b><small>${desc}</small></span><span class="switch"><input type="checkbox" data-change="${id}" ${on ? 'checked' : ''} ${dis ? 'disabled' : ''} aria-label="${esc(label)}"><i></i></span></label>`;
const SET_isAdmin = () => LIVE ? !!LIVE.isAdmin : true;
MOD.settings = () => {
  const tabsList = [['account','Tài khoản'],['look','Giao diện'],['notify','Thông báo'],['workspace','Workspace']].concat(LIVE && LIVE.isAdmin ? [['members','Thành viên & phân quyền']] : []).concat([['security','Bảo mật']]);
  let cur = sub('settings', 'account'); if (!tabsList.some(t => t[0] === cur)) cur = 'account';
  const body = cur === 'look' ? SET_lookView() : cur === 'notify' ? SET_notifyView() : cur === 'workspace' ? SET_wsView() : cur === 'members' ? (MOD.admin ? MOD.admin() : '') : cur === 'security' ? SET_secView() : SET_accountView();
  return head('Cài đặt', 'Tài khoản, giao diện, thông báo & workspace') + `<div class="set-layout"><nav class="card set-nav" aria-label="Mục cài đặt">${tabsList.map(([k, l]) => `<button class="${cur === k ? 'on' : ''}" data-act="sub" data-view="settings" data-k="${k}">${l}</button>`).join('')}</nav><div class="stack">${body}</div></div>`;
};
ACT.me = () => nav('settings', 'account');

function SET_accountView(){
  const me = person(S.me), email = LIVE ? LIVE.email || me.email || '' : me.email || '';
  return `<form class="card pad stack set-card" data-form="set-account"><h2 class="sec-title" style="margin:0">Thông tin tài khoản</h2>
    <div class="row">${av(S.me, 56)}<div><b>${esc(me.name)}</b><div class="small muted">${esc(email || 'Chế độ demo')}${LIVE && LIVE.isAdmin ? ' · Quản trị viên' : ''}</div></div></div>
    <div class="row2"><label class="field">Họ tên<input name="name" required value="${esc(me.name)}"></label><label class="field">Email<input name="email" type="email" value="${esc(email)}" ${LIVE ? 'disabled title="Email đăng nhập do quản trị viên quản lý"' : ''}></label></div>
    <div class="row2"><label class="field">Chức vụ<input name="title" value="${esc(me.role || '')}"></label><label class="field">Số điện thoại<input name="phone" type="tel" value="${esc(me.phone || '')}"></label></div>
    <div class="row2"><label class="field">Phòng ban / đội<input name="team" value="${esc(me.team || '')}"></label><label class="field">Màu ảnh đại diện<select name="color">${opt(['purple','blue','green','yellow','orange','pink','brown'].map(c => [c, {purple:'Tím', blue:'Xanh dương', green:'Xanh lá', yellow:'Vàng', orange:'Cam', pink:'Hồng', brown:'Nâu'}[c]]), me.c)}</select></label></div>
    <div class="m-actions">${LIVE ? `<button type="button" class="btn ghost" data-act="welcome">Xem giới thiệu</button>` : ''}<button class="btn" type="submit">Lưu thay đổi</button></div></form>`;
}
function SET_lookView(){
  const th = document.documentElement.dataset.theme || 'system', l = SET_look();
  return `<div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Chế độ hiển thị</h2><div class="small muted">Áp dụng cho toàn bộ giao diện Dezon Workspace trên trình duyệt này.</div>
      <div class="theme-cards">${[['light','Sáng'],['dark','Tối'],['system','Theo hệ thống']].map(([k, lb]) => `<button class="theme-card ${th === k ? 'on' : ''}" data-act="set-theme" data-t="${k}" aria-pressed="${th === k}"><span class="tc-prev tc-${k}"><i></i><i></i><i></i></span>${lb}</button>`).join('')}</div></div>
    <div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Màu chủ đạo</h2><div class="small muted">Áp dụng cho nút, tab và trạng thái active trên toàn bộ workspace.</div>
      <div class="set-swatches">${SET_ACCENTS.map(([k, lb, c1, c2]) => `<button class="set-sw ${l.accent === k ? 'on' : ''}" data-act="set-accent" data-a="${k}" title="${lb}" aria-label="${lb}" aria-pressed="${l.accent === k}"><i style="background:linear-gradient(135deg,${c1} 50%,${c2} 50%)"></i><span>${lb}</span></button>`).join('')}</div></div>
    <div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Mật độ hiển thị</h2><div class="small muted">Thu nhỏ khoảng cách & cỡ chữ để xem được nhiều nội dung hơn trên màn hình.</div>
      <div class="set-dens">${[['comfortable','Thoải mái','Khoảng cách rộng, dễ đọc'],['compact','Gọn (Compact)','Thu nhỏ 88%, hiện nhiều dòng hơn']].map(([k, lb, d]) => `<button class="theme-card ${l.density === k ? 'on' : ''}" data-act="set-density" data-d="${k}" aria-pressed="${l.density === k}"><span class="set-dens-prev ${k}"><i></i><i></i><i></i><i></i></span><b>${lb}</b><small class="muted">${d}</small></button>`).join('')}</div></div>
    <div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Sidebar</h2>
      <div class="set-row"><span><b>Vị trí sidebar</b><small>Đặt thanh điều hướng bên trái hoặc bên phải màn hình (máy tính)</small></span><div class="seg">${[['left','Trái'],['right','Phải']].map(([k, lb]) => `<button class="${l.side === k ? 'on' : ''}" data-act="set-side" data-s="${k}">${lb}</button>`).join('')}</div></div>
      ${SET_toggle('set-rail', !ui.railOpen, 'Thu gọn menu mặc định', 'Chỉ hiện biểu tượng, ẩn tên mục')}
      ${SET_toggle('set-ai', !$('#frame').classList.contains('ai-hidden'), 'Hiện Dezbot bên phải', 'Trợ lý trả lời về tiến độ, dòng tiền, việc trễ…')}</div>`;
}
function SET_notifyView(){
  const n = notifyPrefs(), np = 'Notification' in window ? Notification.permission : 'unsupported';
  return `<div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Kênh thông báo</h2>
    <div class="row between small set-hint"><span>Thông báo trình duyệt: <b>${{granted:'Đã bật', denied:'Đã chặn (mở lại trong cài đặt trình duyệt)', default:'Chưa bật', unsupported:'Trình duyệt không hỗ trợ'}[np]}</b></span>${np === 'default' ? `<button class="btn sm" data-act="notify-on">Bật thông báo</button>` : ''}</div>
    ${SET_toggle('set-n-chat', n.chat, 'Tin nhắn Chat', 'Thông báo khi có tin nhắn mới')}
    ${SET_toggle('set-n-delay', n.delay, 'Cảnh báo tiến độ trễ hạn', 'Từ module Quản lý dự án')}
    ${SET_toggle('set-n-po', n.po, 'Đơn mua hàng cần duyệt', 'Từ module Mua hàng')}
    ${SET_toggle('set-n-digest', n.digest, 'Bản tin tổng hợp email hàng tuần', 'Gửi mỗi thứ Hai lúc 8:00 (cần máy chủ gửi email)')}
    <div class="small muted">Lưu riêng cho bạn trên trình duyệt này.</div></div>`;
}
function SET_wsView(){
  const c = company(), can = SET_isAdmin(), dis = can ? '' : 'disabled';
  const S_ = S.settings || {}, members = S_.members || [];
  const memberCard = LIVE
    ? `<div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Thành viên workspace <small>${(S.profiles || []).length} tài khoản</small></h2>
        <div class="table-wrap"><table><thead><tr><th>Họ tên</th><th>Vai trò</th><th>Quyền</th></tr></thead><tbody>
        ${(S.profiles || []).map(p => `<tr><td><div class="who">${av(p.id, 26)}<span><b style="font-weight:500">${esc(p.name)}</b><small>${esc(p.email || '')}</small></span></div></td><td>${esc(p.role || '—')}</td><td>${p.isAdmin ? pill('Quản trị', 'purple') : pill(p.active === false ? 'Đã khoá' : 'Thành viên', p.active === false ? 'red' : 'gray')}</td></tr>`).join('')}
        </tbody></table></div>${LIVE.isAdmin ? `<div class="m-actions"><button class="btn" data-act="sub" data-view="settings" data-k="members">${ic('users', 15)}Mời & phân quyền</button></div>` : ''}</div>`
    : `<div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Thành viên workspace${can ? `<button class="btn sm" data-act="set-invite">${ic('plus', 14)}Mời thành viên</button>` : ''}</h2>
        <div class="table-wrap"><table><thead><tr><th>Họ tên</th><th>Vai trò</th><th>Quyền</th><th>Trạng thái</th>${can ? '<th></th>' : ''}</tr></thead><tbody>
        ${members.map(m => `<tr><td><b style="font-weight:500">${esc(m.name || m.email)}</b><div class="small muted">${esc(m.email || '')}</div></td><td>${esc(m.role || '—')}</td><td>${m.perm === 'admin' ? pill('Quản trị', 'purple') : pill('Thành viên', 'gray')}</td><td>${m.status === 'invited' ? pill('Đã mời', 'yellow') : pill('Hoạt động', 'green')}</td>${can ? `<td class="r"><button class="icon-btn sm" data-act="set-mem-del" data-id="${m.id}" aria-label="Xoá thành viên" title="Xoá">${ic('trash', 14)}</button></td>` : ''}</tr>`).join('') || `<tr><td colspan="5" class="empty">Chưa có thành viên</td></tr>`}
        </tbody></table></div><div class="small muted">Chế độ demo — khi kết nối Supabase, lời mời được gửi qua email và phân quyền theo từng module.</div></div>`;
  return `<form class="card pad stack set-card" data-form="set-company"><h2 class="sec-title" style="margin:0">Thông tin công ty</h2><div class="small muted">Dùng cho tiêu đề báo giá, chứng từ và Wiki (một nguồn duy nhất).${can ? '' : ' Chỉ quản trị viên được sửa.'}</div>
      <div class="row2"><label class="field">Tên công ty<input name="name" required value="${esc(c.name)}" ${dis}></label><label class="field">Tên ngắn (ký tên chứng từ)<input name="short" value="${esc(c.short || '')}" ${dis}></label></div>
      <label class="field">Địa chỉ<input name="addr" value="${esc(c.addr || '')}" ${dis}></label>
      <div class="row3"><label class="field">Hotline<input name="hotline" value="${esc(c.hotline || '')}" ${dis}></label><label class="field">Email<input name="email" type="email" value="${esc(c.email || '')}" ${dis}></label><label class="field">Website<input name="web" value="${esc(c.web || '')}" ${dis}></label></div>
      <div class="row3"><label class="field">Mã số thuế<input name="tax" value="${esc(c.tax || '')}" ${dis}></label><label class="field">Số tài khoản ngân hàng<input name="bank" value="${esc(c.bank || '')}" ${dis}></label><label class="field">Múi giờ<select name="tz" ${dis}><option value="Asia/Ho_Chi_Minh">(GMT+7) Hồ Chí Minh</option></select></label></div>
      ${can ? '<div class="m-actions"><button class="btn" type="submit">Lưu thông tin công ty</button></div>' : ''}</form>` + memberCard;
}
function SET_secView(){
  return `<form class="card pad stack set-card" data-form="set-pw"><h2 class="sec-title" style="margin:0">Đổi mật khẩu</h2>
      ${LIVE ? `<label class="field">Mật khẩu hiện tại<input name="old" type="password" autocomplete="current-password" placeholder="••••••••" required></label>
      <div class="row2"><label class="field">Mật khẩu mới (ít nhất 8 ký tự)<input name="p1" type="password" autocomplete="new-password" minlength="8" placeholder="••••••••" required></label><label class="field">Nhập lại mật khẩu mới<input name="p2" type="password" autocomplete="new-password" minlength="8" placeholder="••••••••" required></label></div>
      <div class="m-actions"><button class="btn" type="submit">Cập nhật mật khẩu</button></div>` : '<div class="small muted">Chế độ demo không có tài khoản đăng nhập — đổi mật khẩu dùng được khi kết nối Supabase.</div>'}</form>
    <div class="card pad stack set-card"><h2 class="sec-title" style="margin:0">Đăng nhập & thiết bị</h2>
      ${SET_toggle('set-2fa', false, 'Xác thực hai lớp (2FA) · sắp có', 'Yêu cầu mã OTP khi đăng nhập thiết bị mới', true)}
      ${LIVE ? `<div class="set-row"><span><b>Đăng xuất mọi thiết bị</b><small>Máy tính, điện thoại khác đang đăng nhập tài khoản này</small></span><button class="btn line sm" data-act="set-logout-all">Đăng xuất mọi nơi</button></div>
      <div class="set-row"><span><b>Đăng xuất thiết bị này</b><small>${esc(LIVE.email || '')}</small></span><button class="btn danger sm" data-act="logout">Đăng xuất</button></div>` : ''}</div>`;
}

/* ================= hành động ================= */
FORM['set-account'] = async v => {
  const data = {name:v.name.trim(), title:(v.title || '').trim(), team:(v.team || '').trim(), color:v.color}, phone = (v.phone || '').trim();
  if (!data.name) return toast('Nhập họ tên');
  if (LIVE){
    const {error} = await LIVE.sb.from('profiles').update(data).eq('id', LIVE.uid);
    if (error) return toast('Không lưu được: ' + error.message);
    LIVE.sb.from('profiles').update({phone}).eq('id', LIVE.uid).then(() => {}, () => {}); // cột phone có thể chưa có — bỏ qua lỗi
    const me = (S.profiles || []).find(p => p.id === LIVE.uid); if (me) Object.assign(me, {name:data.name, role:data.title, team:data.team, c:data.color, phone});
  } else {
    const me = S.people.find(p => p.id === S.me);
    if (me) Object.assign(me, {name:data.name, role:data.title, team:data.team, c:data.color, phone, email:(v.email || '').trim()});
  }
  render(); toast('Đã lưu tài khoản');
};
ACT['set-theme'] = (el, d) => {
  if (d.t === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = d.t;
  try { d.t === 'system' ? localStorage.removeItem('sf-theme') : localStorage.setItem('sf-theme', d.t); } catch (e) {}
  render();
};
ACT['set-accent'] = (el, d) => { SET_save({accent:d.a}); render(); toast('Đã đổi màu chủ đạo'); };
ACT['set-density'] = (el, d) => { SET_save({density:d.d}); render(); };
ACT['set-side'] = (el, d) => { SET_save({side:d.s}); render(); };
CHG['set-rail'] = el => { if (!!ui.railOpen === el.checked) ACT['rail-toggle'](); }; // bật "thu gọn" = railOpen false; core tự lưu sf-rail-open
CHG['set-ai'] = el => { const f = $('#frame'); f.classList.toggle('ai-hidden', !el.checked); try { localStorage.setItem('sf-ai-hidden', el.checked ? '' : '1'); } catch (e) {} };
['chat','delay','po','digest'].forEach(k => CHG['set-n-' + k] = el => { const n = notifyPrefs(); n[k] = el.checked; try { localStorage.setItem('sf-notify', JSON.stringify(n)); } catch (e) {} toast(el.checked ? 'Đã bật thông báo' : 'Đã tắt thông báo'); });
if (typeof ACT['notify-on'] !== 'function') ACT['notify-on'] = async () => { try { await Notification.requestPermission(); } catch (e) {} render(); };
FORM['set-company'] = v => {
  if (!SET_isAdmin()) return toast('Chỉ quản trị viên được sửa thông tin công ty');
  S.settings = S.settings || {};
  S.settings.company = {name:v.name.trim(), short:v.short.trim(), addr:v.addr.trim(), hotline:v.hotline.trim(), email:v.email.trim(), web:v.web.trim(), tax:v.tax.trim(), bank:v.bank.trim()};
  S.settings.tz = v.tz || 'Asia/Ho_Chi_Minh';
  log('Cập nhật thông tin công ty', 'blue'); render(); toast('Đã lưu thông tin công ty');
};
ACT['set-invite'] = () => showModal(`<form class="modal" data-form="set-invite"><h3>Mời thành viên${closeBtn()}</h3>
  <label class="field">Email *<input name="email" type="email" required placeholder="ten@dezon.vn"></label>
  <div class="row2"><label class="field">Họ tên<input name="name"></label><label class="field">Vai trò (chức danh)<input name="role"></label></div>
  <label class="field">Quyền<select name="perm">${opt([['member','Thành viên'],['admin','Quản trị']], 'member')}</select></label>
  <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Gửi lời mời</button></div></form>`);
FORM['set-invite'] = v => {
  const email = v.email.trim().toLowerCase(); S.settings = S.settings || {}; S.settings.members = S.settings.members || [];
  if (S.settings.members.some(m => (m.email || '').toLowerCase() === email)) return toast('Email này đã có trong workspace');
  S.settings.members.push({id:'m' + uid(), email, name:v.name.trim(), role:v.role.trim(), perm:v.perm, status:'invited'});
  log('Mời ' + email + ' vào workspace', 'blue'); closeModal(); render(); toast('Đã gửi lời mời tới ' + email);
};
ACT['set-mem-del'] = (el, d) => {
  if (el.dataset.armed !== '1'){ el.dataset.armed = '1'; el.classList.add('danger'); toast('Bấm lần nữa để xoá thành viên'); setTimeout(() => { el.dataset.armed = ''; }, 3000); return; }
  S.settings.members = (S.settings.members || []).filter(m => m.id !== d.id); render(); toast('Đã xoá thành viên');
};
FORM['set-pw'] = async (v, f) => {
  if (!LIVE) return;
  if (!v.old || !v.p1) return toast('Nhập đủ mật khẩu hiện tại và mật khẩu mới');
  if (v.p1.length < 8) return toast('Mật khẩu mới cần ít nhất 8 ký tự');
  if (v.p1 !== v.p2) return toast('Hai mật khẩu mới chưa khớp');
  if (v.p1 === v.old) return toast('Mật khẩu mới phải khác mật khẩu hiện tại');
  const chk = await LIVE.sb.auth.signInWithPassword({email:LIVE.email, password:v.old});
  if (chk.error) return toast('Mật khẩu hiện tại không đúng');
  const {error} = await LIVE.sb.auth.updateUser({password:v.p1});
  if (error) return toast(/same|different/i.test(error.message) ? 'Mật khẩu mới phải khác mật khẩu cũ' : error.message);
  f.reset(); toast('Đã đổi mật khẩu');
};
ACT['set-logout-all'] = async () => { if (!LIVE) return; await LIVE.sb.auth.signOut({scope:'global'}); location.reload(); };
