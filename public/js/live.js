/* Dezon Workspace — chế độ dữ liệu thật (Supabase): đăng nhập, đồng bộ dữ liệu dùng chung, chat realtime, quản trị tài khoản. */

const FIXED_CONVS = ['00000000-0000-0000-0000-000000000b07', '00000000-0000-0000-0000-000000000001'];
const BOT_CONV = FIXED_CONVS[0];
// Dữ liệu module ↔ bảng records. array: mỗi phần tử 1 dòng (theo id) · map: mỗi khoá 1 dòng · single: cả khối 1 dòng.
const SYNC = [
  ['projects', 'array', () => S.projects, v => S.projects = v],
  ['leads', 'array', () => S.leads, v => S.leads = v],
  ['people', 'array', () => S.people, v => S.people = v],
  ['gantt', 'map', () => S.gantt, v => S.gantt = v],
  ['fin', 'map', () => S.fin, v => S.fin = v],
  ['quest', 'single', () => S.quest, v => S.quest = v],
  ['att', 'single', () => S.att, v => S.att = v],
  ['qs_projects', 'array', () => S.qs.projects, v => S.qs.projects = v],
  ['qs_products', 'array', () => S.qs.products, v => S.qs.products = v],
  ['qs_po', 'array', () => S.qs.po, v => S.qs.po = v],
  ['qs_settings', 'single', () => ({vat:S.qs.vat}), v => S.qs.vat = v.vat],
  ['wiki_pages', 'array', () => S.wiki.pages, v => S.wiki.pages = v],
  ['wiki_cats', 'single', () => ({cats:S.wiki.cats}), v => S.wiki.cats = v.cats],
  ['activity', 'single', () => ({list:S.activity}), v => S.activity = v.list || []],
  ['apps', 'single', () => ({list:S.apps}), v => S.apps = v.list || []],
  ['quest_sales', 'single', () => S.quest_sales, v => S.quest_sales = v],
  ['quest_mkt', 'single', () => S.quest_mkt, v => S.quest_mkt = v],
  ['mkt_catalog', 'array', () => S.mkt.catalog, v => S.mkt.catalog = v],
  ['mkt_campaigns', 'array', () => S.mkt.campaigns, v => S.mkt.campaigns = v],
  ['hr_staff', 'array', () => S.hr.staff, v => S.hr.staff = v],
  ['hr_pay', 'single', () => ({paid:S.hr.paid || {}}), v => S.hr.paid = v.paid || {}],
  ['settings', 'single', () => S.settings, v => S.settings = v]
];
// Mẫu vai trò: áp nhanh rồi chỉnh riêng từng module.
const ROLES = {
  admin:{label:'Quản trị viên', admin:true},
  director:{label:'Ban giám đốc', perms:{mkt:'edit', sales:'edit', projects:'edit', pm:'edit', att:'edit', hr:'edit', fin:'edit', qs:'edit', po:'edit', wiki:'edit', apps:'edit'}},
  pm:{label:'Quản lý dự án', perms:{mkt:'none', sales:'view', projects:'edit', pm:'edit', att:'edit', hr:'none', fin:'view', qs:'edit', po:'edit', wiki:'edit', apps:'view'}},
  marketing:{label:'Marketing', perms:{mkt:'edit', sales:'view', projects:'view', pm:'none', att:'none', hr:'none', fin:'none', qs:'none', po:'none', wiki:'view', apps:'view'}},
  sales:{label:'Kinh doanh', perms:{mkt:'view', sales:'edit', projects:'view', pm:'view', att:'none', hr:'none', fin:'none', qs:'view', po:'none', wiki:'view', apps:'view'}},
  accountant:{label:'Kế toán', perms:{mkt:'view', sales:'view', projects:'view', pm:'view', att:'view', hr:'view', fin:'edit', qs:'view', po:'view', wiki:'view', apps:'none'}},
  qs:{label:'QS / Dự toán', perms:{mkt:'none', sales:'view', projects:'view', pm:'view', att:'none', hr:'none', fin:'none', qs:'edit', po:'edit', wiki:'view', apps:'view'}},
  site:{label:'Kỹ thuật / Công trường', perms:{mkt:'none', sales:'none', projects:'view', pm:'edit', att:'edit', hr:'none', fin:'none', qs:'view', po:'view', wiki:'view', apps:'view'}},
  hr:{label:'Nhân sự', perms:{mkt:'none', sales:'none', projects:'view', pm:'view', att:'edit', hr:'edit', fin:'none', qs:'none', po:'none', wiki:'edit', apps:'none'}},
  staff:{label:'Nhân viên', perms:{mkt:'none', sales:'none', projects:'none', pm:'view', att:'none', hr:'none', fin:'none', qs:'none', po:'none', wiki:'view', apps:'view'}},
  custom:{label:'Tuỳ chỉnh'}
};
const LEVELS = [['none','Không'],['view','Xem'],['edit','Sửa']];
// Giống hàm can_read_record / can_write_record trong migration-002 (máy chủ mới là nơi chặn thật).
function colRead(col, P){
  if (['activity','people','wiki_cats','qs_settings','apps','settings'].includes(col)) return true;
  if (col === 'leads' || col === 'quest_sales') return P('sales') !== 'none';
  if (col === 'quest_mkt' || col.startsWith('mkt_')) return P('mkt') !== 'none';
  if (col.startsWith('hr_')) return P('hr') !== 'none';
  if (col === 'qs_po') return P('po') !== 'none' || P('qs') !== 'none';
  if (col === 'projects') return ['projects','pm','fin','att','qs','sales'].some(m => P(m) !== 'none');
  if (col === 'gantt' || col === 'quest') return P('pm') !== 'none';
  if (col === 'att') return P('att') !== 'none';
  if (col === 'fin') return P('fin') !== 'none';
  if (col.startsWith('qs_')) return P('qs') !== 'none';
  if (col.startsWith('wiki_')) return P('wiki') !== 'none';
  return false;
}
function colWrite(col, P){
  const e = m => P(m) === 'edit';
  switch (col){
    case 'activity': return true;
    case 'people': return e('att') || e('projects') || e('pm') || e('hr');
    case 'leads': case 'quest_sales': return e('sales');
    case 'quest_mkt': case 'mkt_catalog': case 'mkt_campaigns': return e('mkt');
    case 'hr_staff': case 'hr_pay': return e('hr');
    case 'qs_po': return e('po') || e('qs');
    case 'settings': return !!(LIVE && LIVE.isAdmin);
    case 'projects': return e('projects') || e('sales');
    case 'gantt': return e('pm') || e('projects');
    case 'quest': return e('pm');
    case 'att': return e('att') || e('projects');
    case 'fin': return e('fin') || e('projects') || e('po');
    case 'qs_projects': return e('qs') || e('projects');
    case 'apps': return e('apps');
  }
  if (col.startsWith('qs_')) return e('qs');
  if (col.startsWith('wiki_')) return e('wiki');
  return false;
}
// Dữ liệu "trống" dùng làm nền: không để lọt dữ liệu mẫu vào workspace thật.
function blankState(){
  const s0 = seed();
  Object.assign(s0, {projects:[], leads:[], people:[], gantt:{}, fin:{}, activity:[]});
  s0.att = {sites:[], rec:[], approvals:[], week:[], mine:{p:'', site:'', in:null, out:null, task:'', weekMin:0, hist:[]}};
  s0.qs.projects = []; s0.qs.po = [];
  const blankQ = q => ({...q, pid:'', player:'', pts:{}, redeems:[], base:0, steps:q.steps.map(st => ({...st, tasks:st.tasks.map(t => ({...t, done:false, by:'', date:''}))}))});
  s0.quest_sales = blankQ(s0.quest_sales); s0.quest_mkt = blankQ(s0.quest_mkt);
  s0.mkt.campaigns = []; s0.hr = {staff:[], paid:{}};
  s0.quest = {...s0.quest, pid:'', player:'', streak:0, lastSafety:'', pts:{}, redeems:[], base:0, steps:s0.quest.steps.map(st => ({...st, tasks:st.tasks.map(t => ({...t, done:false, by:'', date:''}))}))};
  return s0;
}
const UI_KEYS = ['view', 'tabs', 'pid', 'sub', 'ai', 'cv', 'seenAct'];

// So sánh theo nội dung: Postgres (jsonb) tự sắp xếp lại thứ tự khoá nên phải chuẩn hoá trước khi so.
const stable = v => v === null || typeof v !== 'object' ? JSON.stringify(v) ?? 'null'
  : Array.isArray(v) ? '[' + v.map(stable).join(',') + ']'
  : '{' + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
function toRecs(kind, val){
  const out = {};
  if (kind === 'array') (val || []).forEach(x => { if (x && x.id != null) out[String(x.id)] = x; });
  else if (kind === 'map') Object.entries(val || {}).forEach(([k, v]) => out[k] = v);
  else out._ = val;
  return out;
}

async function liveBoot(){
  const cfg = window.SF_CONFIG;
  const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
  const flow = hash.get('type');                     // invite | recovery | signup | magiclink
  const linkErr = hash.get('error_description');
  const sb = window.supabase.createClient(cfg.url, cfg.key, {auth:{flowType:'implicit', detectSessionInUrl:true, persistSession:true, autoRefreshToken:true}});
  const L = LIVE = {sb, cfg, snap:{}, ready:false, pending:false, lastRead:{}, uid:null, isAdmin:false, timer:null, readTimer:{}, signed:{}};

  /* ---------- màn hình đăng nhập ---------- */
  const shell = document.createElement('div');
  shell.id = 'auth'; shell.className = 'auth';
  document.body.appendChild(shell);
  // Trang đăng nhập hai nửa theo nhận diện dezon.vn: form bên trái, giới thiệu workspace bên phải.
  const WORDMARK = 'https://dezon.vn/wp-content/uploads/2026/03/Dezon-2026-SVG-black.svg';
  const HERO = 'https://dezon.vn/wp-content/uploads/2025/12/dks-house-mas-architecture-vietnam_6bnanner-4.jpg';
  const TOUR = [['briefcase','Kinh doanh','Pipeline khách hàng, chuyển cơ hội thành dự án'],['building','Dự án','Hồ sơ, thiết lập thi công, luồng dữ liệu'],['chat','Chat nội bộ','Nhóm dự án, nhắn riêng, gửi tệp'],['gantt','Tiến độ','Gantt, mốc, nhiệm vụ & điểm thưởng'],['userclock','Chấm công','Theo công trường, duyệt ngoài vùng'],['wallet','Tài chính','Ngân sách, hoá đơn, dòng tiền'],['ruler','QS','Bóc tách, báo giá, mua hàng'],['book','Wiki','Sổ tay, nội quy, quy trình']];
  const authView = (inner) => {
    shell.hidden = false;
    shell.innerHTML = `<div class="auth-split">
      <section class="auth-left">
        <header class="auth-brand"><img class="wordmark" src="${WORDMARK}" alt="DEZON" onerror="this.replaceWith(Object.assign(document.createElement('b'),{className:'wordmark-txt',textContent:'DEZON'}))"><span class="auth-tag">Workspace</span></header>
        <div class="auth-form">${inner}</div>
        <footer class="auth-foot">© ${new Date().getFullYear()} Dezon · Design And Build Data Zone · <a href="https://dezon.vn" target="_blank" rel="noopener">dezon.vn</a></footer>
      </section>
      <aside class="auth-right" aria-label="Giới thiệu Dezon Workspace">
        <div class="ar-bg" style="background-image:url('${HERO}')"></div>
        <div class="ar-inner">
          <span class="ar-pill">${ic('sparkle', 13)} Tất cả trong một</span>
          <h2>Toàn bộ công việc của Dezon,<br>ở một nơi.</h2>
          <p class="ar-lead">Từ khách hàng tiềm năng đến bàn giao công trình — kinh doanh, dự án, tiến độ, tài chính và trao đổi nội bộ dùng chung một nguồn dữ liệu.</p>
          <div class="ar-grid">${TOUR.map(([i, t, d]) => `<div class="ar-card"><span class="ar-ic">${ic(i, 16)}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>
          <ol class="ar-steps"><li><b>Nhận email mời</b><span>từ quản trị viên, gửi tới email công ty</span></li><li><b>Đặt mật khẩu</b><span>bấm link trong email, đặt mật khẩu riêng</span></li><li><b>Bắt đầu làm việc</b><span>thấy đúng các mục theo vai trò của bạn</span></li></ol>
          <div class="ar-trust">${ic('info', 14)} Phân quyền từng module · mỗi người chỉ thấy phần việc được giao</div>
        </div>
      </aside>
    </div>`;
    const f = shell.querySelector('.auth-form input:not([type=hidden])'); if (f) f.focus();
    shell.querySelectorAll('[data-eye]').forEach(b => b.onclick = () => { const i = b.parentElement.querySelector('input'); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'); b.classList.toggle('on', show); });
  };
  const msg = (t, bad) => `<div class="auth-msg ${bad ? 'bad' : ''}">${t}</div>`;
  const EYE = '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>';
  const MAIL = '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>';
  const LOCK = '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>';
  const svg = (d, n = 17) => `<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const inField = (label, id, name, type, extra = '', icon = MAIL, eye = false) => `<label class="af-label" for="${id}">${label}</label>
    <div class="af-input">${svg(icon)}<input id="${id}" name="${name}" type="${type}" ${extra}>${eye ? `<button type="button" class="af-eye" data-eye aria-label="Hiện mật khẩu">${svg(EYE)}</button>` : ''}</div>`;
  function showLogin(note = '', bad = false){
    authView(`<h1 class="auth-h">Đăng nhập<br>vào Workspace</h1><p class="auth-sub">Dùng email công ty và mật khẩu của bạn.</p>${note ? msg(note, bad) : ''}
      <form id="loginF" class="af">
        ${inField('Email công ty', 'lg-email', 'email', 'email', 'autocomplete="username" required placeholder="ten@dezon.vn"')}
        <div class="af-row"><label class="af-label" for="lg-pass">Mật khẩu</label><button type="button" class="af-link" id="goForgot">Quên mật khẩu?</button></div>
        <div class="af-input">${svg(LOCK)}<input id="lg-pass" name="password" type="password" autocomplete="current-password" required placeholder="••••••••"><button type="button" class="af-eye" data-eye aria-label="Hiện mật khẩu">${svg(EYE)}</button></div>
        <button class="af-btn" type="submit">Đăng nhập ${ic('arrow', 16)}</button>
      </form>
      <div class="af-or"><span>Chưa có tài khoản?</span></div>
      <p class="af-note">Tài khoản do quản trị viên tạo. Bạn sẽ nhận <b>email mời</b> tại hộp thư công ty — bấm link trong email để đặt mật khẩu.</p>`);
    shell.querySelector('#loginF').onsubmit = async e => {
      e.preventDefault(); const fd = new FormData(e.target), btn = e.target.querySelector('.af-btn'); btn.disabled = true; btn.textContent = 'Đang đăng nhập…';
      const {error} = await sb.auth.signInWithPassword({email:String(fd.get('email')).trim(), password:fd.get('password')});
      if (error) showLogin(/invalid/i.test(error.message) ? 'Email hoặc mật khẩu không đúng.' : /banned|disabled/i.test(error.message) ? 'Tài khoản đã bị khoá. Liên hệ quản trị viên.' : error.message, true);
    };
    shell.querySelector('#goForgot').onclick = () => showForgot();
  }
  function showForgot(note = '', bad = false){
    authView(`<button class="af-back" id="goLogin">${ic('left', 15)} Quay lại đăng nhập</button>
      <h1 class="auth-h">Quên mật khẩu</h1><p class="auth-sub">Nhập email công ty, hệ thống sẽ gửi link để bạn đặt mật khẩu mới.</p>${note ? msg(note, bad) : ''}
      <form id="forgotF" class="af">${inField('Email công ty', 'fg-email', 'email', 'email', 'required placeholder="ten@dezon.vn"')}
      <button class="af-btn" type="submit">Gửi link đặt lại mật khẩu ${ic('arrow', 16)}</button></form>
      <p class="af-note">Không thấy email sau vài phút? Kiểm tra mục Spam, hoặc nhờ quản trị viên gửi lại.</p>`);
    shell.querySelector('#forgotF').onsubmit = async e => {
      e.preventDefault(); const email = String(new FormData(e.target).get('email')).trim(); const btn = e.target.querySelector('.af-btn'); btn.disabled = true;
      const {error} = await sb.auth.resetPasswordForEmail(email, {redirectTo:location.origin + '/'});
      if (error) showForgot(/rate|seconds/i.test(error.message) ? 'Vừa gửi xong — hãy đợi một chút rồi thử lại.' : error.message, true);
      else showLogin(`Nếu <b>${esc(email)}</b> có tài khoản, email đặt lại mật khẩu đã được gửi. Mở email và bấm vào link.`);
    };
    shell.querySelector('#goLogin').onclick = () => showLogin();
  }
  function showSetPassword(kind){
    authView(`<h1 class="auth-h">${kind === 'invite' ? 'Chào mừng bạn!' : 'Đặt mật khẩu mới'}</h1><p class="auth-sub">${kind === 'invite' ? 'Đặt mật khẩu để kích hoạt tài khoản Dezon Workspace của bạn.' : 'Nhập mật khẩu mới cho tài khoản của bạn.'}</p>
      <form id="setPwF" class="af">
        ${inField('Mật khẩu mới (ít nhất 8 ký tự)', 'sp-p1', 'p1', 'password', 'autocomplete="new-password" minlength="8" required', LOCK, true)}
        ${inField('Nhập lại mật khẩu', 'sp-p2', 'p2', 'password', 'autocomplete="new-password" minlength="8" required', LOCK, true)}
        <div id="spMsg"></div><button class="af-btn" type="submit">Lưu mật khẩu & vào workspace ${ic('arrow', 16)}</button></form>`);
    shell.querySelector('#setPwF').onsubmit = async e => {
      e.preventDefault(); const fd = new FormData(e.target);
      if (fd.get('p1') !== fd.get('p2')){ shell.querySelector('#spMsg').innerHTML = msg('Hai mật khẩu chưa khớp.', true); return; }
      const {error} = await sb.auth.updateUser({password:fd.get('p1')});
      if (error){ shell.querySelector('#spMsg').innerHTML = msg(/same|different/i.test(error.message) ? 'Mật khẩu mới phải khác mật khẩu cũ.' : /weak|short|characters/i.test(error.message) ? 'Mật khẩu quá yếu — dùng ít nhất 8 ký tự, có chữ và số.' : error.message, true); return; }
      history.replaceState(null, '', location.pathname);
      settingPw = false; start();
    };
  }
  function showLoading(t){ authView(`<div class="stack" style="align-items:center;padding:20px 0;gap:14px"><div class="spin"></div><span class="muted">${t}</span></div>`); }

  /* ---------- tải dữ liệu ---------- */
  let started = false;
  async function start(){
    if (started) return; started = true;
    showLoading('Đang tải dữ liệu workspace…');
    try { await loadAll(); }
    catch (e){ console.error(e); started = false; authView(msg('Không tải được dữ liệu: ' + esc(e.message || e) + '. Kiểm tra đã chạy file schema.sql trên Supabase chưa.', true) + `<button class="btn" onclick="location.reload()">Thử lại</button>`); return; }
    if (!L.hasData){
      if (L.isAdmin) return showInit();
      authView(`<h1 class="auth-h">Workspace chưa sẵn sàng</h1><p class="muted">Quản trị viên chưa khởi tạo dữ liệu. Vui lòng thử lại sau.</p><button class="btn line" onclick="location.reload()">Tải lại</button>`); return;
    }
    enter();
  }
  function enter(){
    shell.hidden = true; L.ready = true;
    subscribe();
    render(); renderAi(); updateTitle();
    let seen = false; try { seen = !!localStorage.getItem('sf-welcome-' + L.uid); } catch (e) {}
    if (!seen) setTimeout(() => L.welcome(), 400);
  }
  function showInit(){
    authView(`<h1 class="auth-h">Khởi tạo workspace</h1><p class="muted small" style="margin:4px 0 18px">Bạn là quản trị viên đầu tiên. Chọn cách bắt đầu — có thể xoá / sửa mọi thứ sau.</p>
      <div class="stack">
        <button class="init-opt" id="initEmpty"><span class="sq" style="--c:var(--green);--t:var(--green-t)">${ic('plus', 18)}</span><span><b>Bắt đầu trống</b><small>Dùng thật ngay. Giữ sẵn danh mục sản phẩm, wiki mẫu và quy trình nhiệm vụ.</small></span></button>
        <button class="init-opt" id="initSample"><span class="sq" style="--c:var(--purple);--t:var(--purple-t)">${ic('grid', 18)}</span><span><b>Dùng dữ liệu mẫu</b><small>Để xem thử: dự án Riverside, pipeline khách hàng, bóc tách QS, wiki… Xoá được sau.</small></span></button>
      </div><div id="initMsg"></div>`);
    const go = async sample => {
      shell.querySelectorAll('button').forEach(b => b.disabled = true);
      shell.querySelector('#initMsg').innerHTML = msg('Đang ghi dữ liệu…');
      const s0 = sample ? seed() : blankState();
      const saved = S; S = s0;
      const rows = [];
      SYNC.forEach(([col, kind, get]) => Object.entries(toRecs(kind, get())).forEach(([id, data]) => rows.push({collection:col, id, data})));
      S = saved;
      for (let i = 0; i < rows.length; i += 200){
        const {error} = await sb.from('records').upsert(rows.slice(i, i + 200));
        if (error){ shell.querySelector('#initMsg').innerHTML = msg('Lỗi: ' + esc(error.message), true); shell.querySelectorAll('button').forEach(b => b.disabled = false); return; }
      }
      started = false; start();
    };
    shell.querySelector('#initSample').onclick = () => go(true);
    shell.querySelector('#initEmpty').onclick = () => go(false);
  }
  async function loadAll(){
    const {data:{user}} = await sb.auth.getUser();
    L.uid = user.id; L.email = user.email;
    const [prof, recs] = await Promise.all([
      sb.from('profiles').select('*').order('name'),
      sb.from('records').select('collection,id,data').order('created_at').order('id')
    ]);
    if (prof.error) throw prof.error; if (recs.error) throw recs.error;
    const me = prof.data.find(p => p.id === L.uid);
    if (!me) throw new Error('Không tìm thấy hồ sơ tài khoản');
    if (!me.active){ await sb.auth.signOut(); throw new Error('Tài khoản đã bị khoá'); }
    L.isAdmin = me.is_admin; L.myPermSig = permSig(me);
    // trạng thái giao diện riêng của từng người
    const base = blankState();
    let uiState = {};
    try { uiState = JSON.parse(localStorage.getItem('sf-ui-' + L.uid)) || {}; } catch (e) {}
    S = {...base, convs:[], msgs:[], read:{}, cv:null};
    UI_KEYS.forEach(k => { if (uiState[k] !== undefined) S[k] = uiState[k]; });
    S.me = L.uid;
    S.profiles = prof.data.map(mapProfile);
    // dữ liệu dùng chung
    const byCol = {};
    recs.data.forEach(r => (byCol[r.collection] = byCol[r.collection] || []).push(r));
    L.hasData = recs.data.length > 0;
    SYNC.forEach(([col, kind, , set]) => {
      const rows = byCol[col] || [];
      L.snap[col] = {};
      rows.forEach(r => L.snap[col][r.id] = stable(r.data));
      if (!L.hasData) return;
      if (!colRead(col, L.perm)) return;                                         // không có quyền đọc: giữ trống
      if (!rows.length) return;                                                  // chưa có trên máy chủ: dùng mặc định trống (danh mục mẫu sẽ tự lưu lên)
      if (kind === 'array') set(rows.map(r => r.data));                          // kể cả rỗng: không để lọt dữ liệu mẫu
      else if (kind === 'map') set(Object.fromEntries(rows.map(r => [r.id, r.data])));
      else if (rows[0]) set(rows[0].data);
    });
    if (!S.projects.some(p => p.id === S.pid)) S.pid = (S.projects[0] || {}).id;
    await loadChat();
  }
  const mapProfile = p => ({id:p.id, name:p.name || p.email, role:p.title || '', team:p.team || '', c:p.color || 'blue', email:p.email, isAdmin:p.is_admin, active:p.active, account:true, roleKey:p.role || 'staff', perms:p.perms || {}});
  const permSig = p => JSON.stringify([p.is_admin, p.active, p.role, p.perms]);
  L.perm = mod => { const me = (S.profiles || []).find(p => p.id === L.uid); if (!me) return 'none'; if (me.isAdmin) return 'edit'; return me.perms[mod] || 'none'; };

  /* ---------- chat ---------- */
  async function loadChat(){
    const [cv, mem, msgs] = await Promise.all([
      sb.from('conversations').select('*'),
      sb.from('conversation_members').select('*'),
      sb.from('messages').select('*').order('created_at', {ascending:false}).limit(3000)
    ]);
    if (cv.error) throw cv.error; if (mem.error) throw mem.error; if (msgs.error) throw msgs.error;
    L.members = mem.data;
    S.convs = cv.data.map(mapConv);
    S.msgs = msgs.data.reverse().map(mapMsg);
    mem.data.filter(m => m.user_id === L.uid).forEach(m => L.lastRead[m.conversation_id] = Date.parse(m.last_read_at));
    if (!S.convs.some(c => c.id === S.cv)) S.cv = (S.convs.find(c => c.id === FIXED_CONVS[1]) || S.convs[0] || {}).id;
  }
  function mapConv(c){
    const members = (L.members || []).filter(m => m.conversation_id === c.id).map(m => m.user_id);
    const other = c.type === 'dm' ? members.find(u => u !== L.uid) : null;
    return {id:c.id, type:c.type, name:c.type === 'bot' ? 'Dezbot' : c.name, icon:c.type === 'bot' ? 'bot' : c.icon || 'users', c:c.color || 'blue', pid:c.project_id, members, files:[], user:other,
      sub:c.type === 'bot' ? 'Thông báo hệ thống' : c.project_id ? 'Nhóm dự án' : 'Nhóm'};
  }
  const mapMsg = m => ({id:m.id, cv:m.conversation_id, from:m.bot ? 'bot' : m.sender_id, by:m.sender_id, text:m.body || '', t:Date.parse(m.created_at), bot:m.bot,
    file:m.file_path ? {name:m.file_name, size:fmtSize(m.file_size || 0), path:m.file_path, type:m.file_type} : null, deleted:!!m.deleted_at, edited:!!m.edited_at});
  L.unread = id => { const lr = L.lastRead[id] || 0; return S.msgs.filter(m => m.cv === id && m.t > lr && m.by !== L.uid).length; };
  L.markRead = id => {
    const last = S.msgs.filter(m => m.cv === id).reduce((a, m) => Math.max(a, m.t), 0);
    if (!last || (L.lastRead[id] || 0) >= last) return;
    L.lastRead[id] = Date.now();
    clearTimeout(L.readTimer[id]);
    L.readTimer[id] = setTimeout(() => sb.from('conversation_members').update({last_read_at:new Date().toISOString()}).eq('conversation_id', id).eq('user_id', L.uid).then(() => {}), 600);
    updateTitle();
  };
  L.fixed = id => FIXED_CONVS.includes(id);
  L.send = async (cvId, extra, fileObj) => {
    const id = crypto.randomUUID();
    const row = {id, conversation_id:cvId, sender_id:L.uid, body:extra.text || ''};
    const temp = {id, cv:cvId, from:L.uid, by:L.uid, text:row.body, t:Date.now(), pending:true, file:extra.file || null};
    S.msgs.push(temp); render();
    if (fileObj){
      const safe = fileObj.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w.\-]+/g, '_').slice(-80);
      const path = `${cvId}/${Date.now()}-${safe}`;
      const up = await sb.storage.from('chat-files').upload(path, fileObj, {contentType:fileObj.type || 'application/octet-stream'});
      if (up.error){ S.msgs = S.msgs.filter(m => m.id !== id); render(); toast(/size|large/i.test(up.error.message) ? 'Tệp quá lớn (tối đa 25 MB)' : 'Không gửi được tệp: ' + up.error.message); return; }
      Object.assign(row, {file_path:path, file_name:fileObj.name, file_size:fileObj.size, file_type:fileObj.type || ''});
    }
    const {data, error} = await sb.from('messages').insert(row).select().single();
    if (error){ S.msgs = S.msgs.filter(m => m.id !== id); render(); toast('Không gửi được: ' + error.message); return; }
    upsertMsg(mapMsg(data)); L.lastRead[cvId] = Date.now(); renderSoft();
  };
  L.postBot = (title, text, level, meta, go, subk, alsoConv) => {
    const bot = {level, title, meta, go, sub:subk};
    const targets = [BOT_CONV];
    const pc = alsoConv && S.convs.find(c => c.id === alsoConv || (c.pid && 'g-' + c.pid === alsoConv));
    if (pc) targets.push(pc.id);
    targets.forEach(cv => sb.from('messages').insert({conversation_id:cv, sender_id:L.uid, body:text, bot}).then(({error}) => { if (error) console.warn('bot', error.message); }));
  };
  L.createGroup = async (name, members, pid) => {
    const ids = members.filter(u => S.profiles.some(p => p.id === u));
    const {data, error} = await sb.rpc('create_group', {p_name:name, p_members:ids, p_project:pid || null, p_icon:pid ? 'building' : 'users', p_color:'blue'});
    if (error){ toast('Không tạo được nhóm chat: ' + error.message); return null; }
    await refreshConvs(); return data;
  };
  async function refreshConvs(){
    const [cv, mem] = await Promise.all([sb.from('conversations').select('*'), sb.from('conversation_members').select('*')]);
    if (cv.error || mem.error) return;
    L.members = mem.data; S.convs = cv.data.map(mapConv);
    mem.data.filter(m => m.user_id === L.uid).forEach(m => { if (!(m.conversation_id in L.lastRead)) L.lastRead[m.conversation_id] = Date.parse(m.last_read_at); });
    const known = new Set(S.msgs.map(m => m.cv));
    const missing = S.convs.filter(c => !known.has(c.id)).map(c => c.id);
    if (missing.length){ const {data} = await sb.from('messages').select('*').in('conversation_id', missing).order('created_at').limit(1000); (data || []).forEach(m => upsertMsg(mapMsg(m))); }
    renderSoft();
  }
  function upsertMsg(m){ const i = S.msgs.findIndex(x => x.id === m.id); if (i >= 0) S.msgs[i] = m; else { S.msgs.push(m); S.msgs.sort((a, b) => a.t - b.t); } }
  L.signedUrl = async path => {
    const c = L.signed[path]; if (c && c.exp > Date.now()) return c.url;
    const {data, error} = await sb.storage.from('chat-files').createSignedUrl(path, 3600);
    if (error) throw error;
    L.signed[path] = {url:data.signedUrl, exp:Date.now() + 50 * 6e4}; return data.signedUrl;
  };
  L.canNotify = () => 'Notification' in window && Notification.permission === 'default';
  function notify(m){
    updateTitle();
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (!document.hidden && S.view === 'chat' && S.cv === m.cv) return;
    const c = S.convs.find(x => x.id === m.cv) || {};
    const title = m.bot ? 'Dezbot · ' + m.bot.title : person(m.from).name + (c.type === 'group' ? ' · ' + c.name : '');
    try { const n = new Notification(title, {body:m.file ? '📎 ' + m.file.name : m.text.slice(0, 140), tag:m.cv}); n.onclick = () => { window.focus(); S.cv = m.cv; nav('chat'); n.close(); }; } catch (e) {}
  }
  function updateTitle(){ const n = chatUnreadTotal(); document.title = (n ? `(${n}) ` : '') + 'Dezon Workspace'; }

  /* ---------- đồng bộ dữ liệu dùng chung ---------- */
  L.saveUi = () => { if (!L.uid) return; try { const o = {}; UI_KEYS.forEach(k => o[k] = S[k]); localStorage.setItem('sf-ui-' + L.uid, JSON.stringify(o)); } catch (e) {} };
  L.sync = () => { if (!L.ready) return; clearTimeout(L.timer); L.timer = setTimeout(flushSync, 350); };
  async function flushSync(){
    const ups = [], dels = [], denied = [];
    SYNC.forEach(([col, kind, get, set]) => {
      const cur = toRecs(kind, get()), snap = L.snap[col] || (L.snap[col] = {});
      if (!colWrite(col, L.perm)){
        // chỉ có quyền xem: đưa dữ liệu về như trên máy chủ
        const changed = Object.entries(cur).some(([id, d]) => snap[id] !== stable(d)) || Object.keys(snap).some(id => !(id in cur));
        if (changed && colRead(col, L.perm)){
          const fromSnap = id => JSON.parse(snap[id]);
          if (kind === 'array') set(Object.keys(snap).map(fromSnap));
          else if (kind === 'map') set(Object.fromEntries(Object.keys(snap).map(id => [id, fromSnap(id)])));
          else if (snap._) set(fromSnap('_'));
          denied.push(col);
        }
        return;
      }
      Object.entries(cur).forEach(([id, data]) => { const j = stable(data); if (snap[id] !== j) ups.push({collection:col, id, data, j}); });
      Object.keys(snap).forEach(id => { if (!(id in cur)) dels.push({col, id}); });
    });
    if (denied.length){ toast('Bạn chỉ có quyền xem phần này — thay đổi chưa được lưu'); render(); }
    if (!ups.length && !dels.length) return;
    ups.forEach(u => L.snap[u.collection][u.id] = u.j);
    dels.forEach(d => delete L.snap[d.col][d.id]);
    setSaving(true);
    const tasks = [];
    if (ups.length) tasks.push(sb.from('records').upsert(ups.map(({collection, id, data}) => ({collection, id, data}))));
    const byCol = {}; dels.forEach(d => (byCol[d.col] = byCol[d.col] || []).push(d.id));
    Object.entries(byCol).forEach(([col, ids]) => tasks.push(sb.from('records').delete().eq('collection', col).in('id', ids)));
    const res = await Promise.all(tasks);
    const err = res.find(r => r.error);
    setSaving(false, err && err.error.message);
    if (err){ ups.forEach(u => delete L.snap[u.collection][u.id]); toast('Chưa lưu được lên máy chủ: ' + err.error.message); }
  }
  function setSaving(on, err){
    let el = document.getElementById('saveDot');
    if (!el){ el = document.createElement('div'); el.id = 'saveDot'; el.className = 'save-dot'; document.body.appendChild(el); }
    el.textContent = err ? 'Lỗi lưu' : on ? 'Đang lưu…' : 'Đã lưu';
    el.className = 'save-dot ' + (err ? 'bad' : on ? '' : 'ok');
    clearTimeout(el._t); if (!on && !err) el._t = setTimeout(() => el.className = 'save-dot hide', 1200);
  }
  function applyRecord(ev, row){
    const spec = SYNC.find(s => s[0] === row.collection); if (!spec) return;
    const [col, kind, get, set] = spec, snap = L.snap[col] || (L.snap[col] = {});
    if (ev === 'DELETE'){
      if (!(row.id in snap)) return;
      delete snap[row.id];
      if (kind === 'array') set(get().filter(x => String(x.id) !== row.id));
      else if (kind === 'map'){ const m = {...get()}; delete m[row.id]; set(m); }
    } else {
      const j = stable(row.data);
      if (snap[row.id] === j) return;            // chính mình vừa lưu
      snap[row.id] = j;
      if (kind === 'array'){ const arr = get().slice(), i = arr.findIndex(x => String(x.id) === row.id); if (i >= 0) arr[i] = row.data; else arr.push(row.data); set(arr); }
      else if (kind === 'map') set({...get(), [row.id]:row.data});
      else set(row.data);
    }
    renderSoft();
  }
  // Không vẽ lại khi đang mở form / đang gõ trong ô nhập (tránh mất chữ) — vẽ bù khi đóng form.
  function renderSoft(){
    const ae = document.activeElement;
    const busy = !$('#modal').hidden || (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && ae.id !== 'chatIn' && ae.id !== 'aiQ' && $('#view').contains(ae));
    if (busy){ L.pending = true; return; }
    L.pending = false; render();
  }
  L.flush = () => { L.pending = false; render(); };
  setInterval(() => { if (L.pending) renderSoft(); }, 4000);

  function subscribe(){
    sb.channel('sf-live')
      .on('postgres_changes', {event:'*', schema:'public', table:'records'}, p => applyRecord(p.eventType, p.eventType === 'DELETE' ? p.old : p.new))
      .on('postgres_changes', {event:'*', schema:'public', table:'messages'}, p => {
        if (p.eventType === 'DELETE') return;
        const m = mapMsg(p.new), isNew = !S.msgs.some(x => x.id === m.id);
        upsertMsg(m);
        if (!S.convs.some(c => c.id === m.cv)) { refreshConvs(); return; }
        if (isNew && m.by !== L.uid) notify(m);
        renderSoft(); updateTitle();
      })
      .on('postgres_changes', {event:'*', schema:'public', table:'conversation_members'}, () => refreshConvs())
      .on('postgres_changes', {event:'UPDATE', schema:'public', table:'conversations'}, () => refreshConvs())
      .on('postgres_changes', {event:'*', schema:'public', table:'profiles'}, async () => {
        const {data} = await sb.from('profiles').select('*').order('name');
        if (data){ S.profiles = data.map(mapProfile); const me = data.find(p => p.id === L.uid); if (!me || !me.active){ await sb.auth.signOut(); location.reload(); return; } if (permSig(me) !== L.myPermSig){ toast('Quyền của bạn vừa được cập nhật — đang tải lại…'); setTimeout(() => location.reload(), 1500); return; } L.isAdmin = me.is_admin; renderSoft(); }
      })
      .subscribe();
    // Quay lại tab sau thời gian dài: tải lại tin để không lỡ tin khi mất kết nối.
    document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - (L.lastSync || 0) > 60000){ L.lastSync = Date.now(); loadChat().then(renderSoft).catch(() => {}); } });
  }

  /* ---------- tài khoản của tôi ---------- */
  L.profileModal = () => {
    const me = S.profiles.find(p => p.id === L.uid);
    showModal(`<form class="modal" data-form="my-profile"><h3>Hồ sơ của tôi${closeBtn()}</h3>
      <div class="row">${av(L.uid, 44)}<div><b>${esc(me.name)}</b><div class="small muted">${esc(me.email)}${me.isAdmin ? ' · Quản trị viên' : ''}</div></div></div>
      <div class="row2"><label class="field">Họ tên<input id="mp-name" name="name" required value="${esc(me.name)}"></label><label class="field">Chức danh<input id="mp-title" name="title" value="${esc(me.role)}"></label></div>
      <div class="row2"><label class="field">Phòng ban / đội<input id="mp-team" name="team" value="${esc(me.team)}"></label><label class="field">Màu đại diện<select id="mp-color" name="color">${opt(['purple','blue','green','yellow','orange','pink','brown'].map(c => [c, c]), me.c)}</select></label></div>
      <div class="m-actions"><button type="button" class="btn danger" data-act="logout">Đăng xuất</button><button type="button" class="btn ghost" data-act="welcome">Giới thiệu</button><button type="button" class="btn line" data-act="change-pw">Đổi mật khẩu</button><button class="btn" type="submit">Lưu hồ sơ</button></div></form>`);
  };
  // Màn hình chào mừng: tổng quan những gì tài khoản này dùng được.
  L.welcome = () => {
    try { localStorage.setItem('sf-welcome-' + L.uid, '1'); } catch (e) {}
    const me = S.profiles.find(p => p.id === L.uid) || {name:''};
    const roleLabel = me.isAdmin ? 'Quản trị viên' : (ROLES[me.roleKey] || ROLES.custom).label;
    const mods = [['dash', 'Tổng quan', 'Tiến độ, nhân công, dòng tiền và việc cần xử lý trong ngày', 'edit'], ['chat', 'Chat', 'Nhắn riêng, nhóm dự án, gửi tệp — cả công ty', 'edit']]
      .concat(PERM_MODS.map(([k, l, d]) => [k, l, d, perm(k)])).filter(m => m[3] !== 'none');
    const off = PERM_MODS.filter(([k]) => perm(k) === 'none');
    showModal(`<div class="modal wide welcome"><div class="wl-head"><div><span class="ar-pill dark">${ic('sparkle', 13)} Chào mừng đến Dezon Workspace</span><h3 style="margin-top:12px">Xin chào, ${esc(me.name.split(' ').pop())} 👋</h3>
        <p class="muted" style="margin:6px 0 0">Vai trò của bạn: <b style="color:var(--ink)">${esc(roleLabel)}</b>. Đây là những gì bạn dùng được — bấm vào một mục để mở.</p></div>${closeBtn()}</div>
      <div class="wl-grid">${mods.map(([k, l, d, lv]) => `<button class="wl-card" data-act="wl-go" data-v="${k}"><span class="sq" style="--c:var(--ink);--t:var(--chip)">${ic((VIEWS[k] || {icon:'grid'}).icon, 17)}</span><span><b>${l} ${lv === 'view' ? '<span class="lv lv-view">Chỉ xem</span>' : ''}</b><small>${d}</small></span></button>`).join('')}</div>
      ${off.length ? `<p class="small muted">Chưa được cấp: ${off.map(m => m[1]).join(', ')}. Cần dùng? Nhắn quản trị viên trong Chat.</p>` : ''}
      <div class="wl-tips"><div>${ic('search', 16)}<span><b>Tìm nhanh</b> — nhấn <kbd>Ctrl</kbd> <kbd>K</kbd> để mở bất kỳ dự án, khách hàng, trang wiki</span></div>
        <div>${ic('sparkle', 16)}<span><b>Dezbot</b> — trợ lý bên phải trả lời về tiến độ, dòng tiền, việc trễ…</span></div>
        <div>${ic('bell', 16)}<span><b>Thông báo</b> — bật thông báo trong Chat để không lỡ tin nhắn</span></div></div>
      <div class="m-actions"><button class="btn" data-act="modal-close">Bắt đầu làm việc ${ic('arrow', 15)}</button></div></div>`);
  };
  ACT['wl-go'] = (el, d) => { closeModal(); nav(d.v); };
  ACT['welcome'] = () => { closeModal(); L.welcome(); };
  FORM['my-profile'] = async v => {
    const {error} = await sb.from('profiles').update({name:v.name.trim(), title:v.title.trim(), team:v.team.trim(), color:v.color}).eq('id', L.uid);
    if (error) return toast('Không lưu được: ' + error.message);
    const me = S.profiles.find(p => p.id === L.uid); Object.assign(me, {name:v.name.trim(), role:v.title.trim(), team:v.team.trim(), c:v.color});
    closeModal(); render(); toast('Đã lưu hồ sơ');
  };
  ACT.logout = async () => { await sb.auth.signOut(); location.reload(); };
  ACT['change-pw'] = () => showModal(`<form class="modal" data-form="change-pw"><h3>Đổi mật khẩu${closeBtn()}</h3>
    <label class="field">Mật khẩu hiện tại<input id="cp-old" name="old" type="password" autocomplete="current-password" required></label>
    <div class="row2"><label class="field">Mật khẩu mới<input id="cp-p1" name="p1" type="password" autocomplete="new-password" minlength="8" required></label><label class="field">Nhập lại<input id="cp-p2" name="p2" type="password" autocomplete="new-password" minlength="8" required></label></div>
    <div class="small muted">Quên mật khẩu hiện tại? Đăng xuất rồi bấm “Quên mật khẩu?” để nhận link qua email.</div>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Đổi mật khẩu</button></div></form>`);
  FORM['change-pw'] = async v => {
    if (v.p1 !== v.p2) return toast('Hai mật khẩu mới chưa khớp');
    const chk = await sb.auth.signInWithPassword({email:L.email, password:v.old});
    if (chk.error) return toast('Mật khẩu hiện tại không đúng');
    const {error} = await sb.auth.updateUser({password:v.p1});
    if (error) return toast(/same|different/i.test(error.message) ? 'Mật khẩu mới phải khác mật khẩu cũ' : error.message);
    closeModal(); toast('Đã đổi mật khẩu');
  };

  /* ---------- chat: tạo hội thoại, thêm người ---------- */
  const peoplePick = (exclude = []) => S.profiles.filter(p => p.id !== L.uid && p.active && !exclude.includes(p.id));
  ACT['conv-new'] = () => { ui.newConv = ui.newConv || 'dm'; convNewModal(); };
  function convNewModal(){
    const t = ui.newConv, list = peoplePick();
    showModal(`<form class="modal" data-form="conv-new"><h3>Cuộc trò chuyện mới${closeBtn()}</h3>
      <div class="seg"><button type="button" class="${t === 'dm' ? 'on' : ''}" data-act="conv-tab" data-t="dm">Nhắn riêng</button><button type="button" class="${t === 'group' ? 'on' : ''}" data-act="conv-tab" data-t="group">Tạo nhóm</button></div>
      ${t === 'group' ? `<label class="field">Tên nhóm<input id="cn-name" name="name" required placeholder="VD: Đội thiết kế"></label>` : ''}
      <div class="search">${ic('search', 15)}<input id="cn-q" placeholder="Tìm người" data-input="cn-q" autocomplete="off"></div>
      <div class="stack" id="cn-list" style="max-height:44vh;overflow:auto;gap:2px">${list.map(p => `<label class="li" data-name="${esc((p.name + ' ' + p.email + ' ' + p.team).toLowerCase())}" style="cursor:pointer"><input type="${t === 'dm' ? 'radio' : 'checkbox'}" name="u" value="${p.id}" ${t === 'dm' ? 'required' : ''} style="accent-color:var(--purple)">${av(p.id, 30)}<span class="ell"><b>${esc(p.name)}</b><small>${esc(p.role || p.email)}${p.team ? ' · ' + esc(p.team) : ''}</small></span></label>`).join('') || '<div class="empty">Chưa có đồng nghiệp nào khác — quản trị viên mời thêm ở mục Tài khoản.</div>'}</div>
      <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">${t === 'dm' ? 'Bắt đầu nhắn' : 'Tạo nhóm'}</button></div></form>`);
  }
  ACT['conv-tab'] = (el, d) => { ui.newConv = d.t; convNewModal(); };
  INP['cn-q'] = el => { const q = el.value.toLowerCase(); document.querySelectorAll('#cn-list [data-name]').forEach(r => r.hidden = !r.dataset.name.includes(q)); };
  FORM['conv-new'] = async v => {
    const ids = [].concat(v.u || []);
    let id;
    if (ui.newConv === 'dm'){ const r = await sb.rpc('create_dm', {other:ids[0]}); if (r.error) return toast(r.error.message); id = r.data; await refreshConvs(); }
    else { if (!ids.length) return toast('Chọn ít nhất 1 người'); id = await L.createGroup(v.name.trim(), ids, null); if (!id) return; }
    closeModal(); S.cv = id; nav('chat');
  };
  ACT['conv-add'] = (el, d) => {
    const c = S.convs.find(x => x.id === d.id), list = peoplePick(c.members);
    showModal(`<form class="modal" data-form="conv-add" data-id="${c.id}"><h3>Thêm người vào ${esc(c.name)}${closeBtn()}</h3>
      <div class="stack" style="max-height:50vh;overflow:auto;gap:2px">${list.map(p => `<label class="li" style="cursor:pointer"><input type="checkbox" name="u" value="${p.id}" style="accent-color:var(--purple)">${av(p.id, 30)}<span class="ell"><b>${esc(p.name)}</b><small>${esc(p.role || p.email)}</small></span></label>`).join('') || '<div class="empty">Mọi người đều đã ở trong nhóm.</div>'}</div>
      <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Thêm</button></div></form>`);
  };
  FORM['conv-add'] = async (v, f) => {
    const ids = [].concat(v.u || []); if (!ids.length) return closeModal();
    const r = await sb.rpc('add_members', {conv:f.dataset.id, p_members:ids});
    if (r.error) return toast(r.error.message);
    closeModal(); await refreshConvs(); toast('Đã thêm ' + ids.length + ' người');
  };
  ACT['conv-leave'] = async (el, d) => {
    if (el.dataset.armed !== '1'){ el.dataset.armed = '1'; el.textContent = 'Bấm lần nữa để rời'; return; }
    const r = await sb.from('conversation_members').delete().eq('conversation_id', d.id).eq('user_id', L.uid);
    if (r.error) return toast(r.error.message);
    S.convs = S.convs.filter(c => c.id !== d.id); S.cv = FIXED_CONVS[1]; ui.chatInfo = false; render(); toast('Đã rời nhóm');
  };
  ACT['msg-recall'] = async (el, d) => {
    const r = await sb.from('messages').update({deleted_at:new Date().toISOString(), body:''}).eq('id', d.id);
    if (r.error) return toast(r.error.message);
    const m = S.msgs.find(x => x.id === d.id); if (m){ m.deleted = true; m.text = ''; } render();
  };
  ACT['chat-file'] = async (el, d) => {
    const path = d.path || d.path2; const w = window.open('', '_blank');
    try { const url = await L.signedUrl(path); if (w) w.location = url; else location.href = url; }
    catch (e){ if (w) w.close(); toast('Không mở được tệp: ' + e.message); }
  };
  ACT['notify-on'] = async () => { try { await Notification.requestPermission(); } catch (e) {} render(); };
  // ảnh trong chat: lấy link tạm thời sau khi vẽ
  const prevAfter = AFTER.chat;
  AFTER.chat = () => {
    if (prevAfter) prevAfter();
    document.querySelectorAll('img.chat-img[data-path]:not([src])').forEach(img => L.signedUrl(img.dataset.path).then(u => { img.src = u; const m = $('#msgs'); if (m) img.onload = () => m.scrollTop = m.scrollHeight; }).catch(() => img.remove()));
  };

  /* ---------- quản trị tài khoản ---------- */
  const api = async (action, body) => {
    const {data:{session}} = await sb.auth.getSession();
    const r = await fetch('/api/admin/' + action, {method:body ? 'POST' : 'GET', headers:{'Content-Type':'application/json', Authorization:'Bearer ' + session.access_token}, body:body ? JSON.stringify(body) : undefined});
    const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Lỗi ' + r.status); return j;
  };
  // ---- trang Tài khoản: danh sách, ma trận quyền, vai trò mẫu ----
  const roleOf = p => p.isAdmin ? 'admin' : (ROLES[p.roleKey] ? p.roleKey : 'custom');
  const permOf = (p, m) => p.isAdmin ? 'edit' : (p.perms[m] || 'none');
  const LV_C = {edit:'green', view:'blue', none:'gray'};
  const lvCell = lv => `<span class="lv lv-${lv}" title="${{edit:'Được sửa', view:'Chỉ xem', none:'Không truy cập'}[lv]}">${{edit:'Sửa', view:'Xem', none:'—'}[lv]}</span>`;
  function permGrid(perms, roleKey){
    const isAdm = roleKey === 'admin';
    return `<div class="field">Vai trò (mẫu quyền)<select id="pg-role" name="role" data-change="adm-role">${opt(Object.entries(ROLES).map(([k, r]) => [k, r.label]), roleKey)}</select></div>
      <div class="perm-grid ${isAdm ? 'is-admin' : ''}" id="permGrid">
        <div class="pg-note">${isAdm ? 'Quản trị viên có toàn quyền mọi module, được mời / khoá / xoá tài khoản và phân quyền.' : 'Tổng quan và Chat luôn có. Chọn mức cho từng module:'}</div>
        ${PERM_MODS.map(([k, label, desc]) => `<div class="pg-row"><div><b>${label}</b><small>${desc}</small></div>
          <div class="lv-seg">${LEVELS.map(([lv, l]) => `<label><input type="radio" name="p_${k}" value="${lv}" data-change="adm-lv" ${(isAdm ? 'edit' : (perms[k] || 'none')) === lv ? 'checked' : ''} ${isAdm ? 'disabled' : ''}><span class="lv-${lv}">${l}</span></label>`).join('')}</div></div>`).join('')}
      </div>`;
  }
  const readGrid = v => Object.fromEntries(PERM_MODS.map(([k]) => [k, v['p_' + k] || 'none']));
  CHG['adm-role'] = el => {
    const f = el.closest('form'), r = ROLES[el.value], isAdm = el.value === 'admin';
    f.querySelector('#permGrid').classList.toggle('is-admin', isAdm);
    f.querySelector('.pg-note').textContent = isAdm ? 'Quản trị viên có toàn quyền mọi module, được mời / khoá / xoá tài khoản và phân quyền.' : 'Tổng quan và Chat luôn có. Chọn mức cho từng module:';
    PERM_MODS.forEach(([k]) => f.querySelectorAll(`[name=p_${k}]`).forEach(i => { i.disabled = isAdm; if (isAdm) i.checked = i.value === 'edit'; else if (r.perms) i.checked = i.value === (r.perms[k] || 'none'); }));
  };
  CHG['adm-lv'] = el => {
    const f = el.closest('form'), cur = Object.fromEntries(PERM_MODS.map(([k]) => [k, (f.querySelector(`[name=p_${k}]:checked`) || {}).value || 'none']));
    const match = Object.entries(ROLES).find(([k, r]) => r.perms && PERM_MODS.every(([m]) => (r.perms[m] || 'none') === cur[m]));
    f.querySelector('#pg-role').value = match ? match[0] : 'custom';
  };
  MOD.admin = () => {
    if (!L.isAdmin) return emptyBox('Chỉ quản trị viên', 'Bạn không có quyền xem trang này.');
    if (!ui.authUsers && !ui.authLoading){ ui.authLoading = true; api('users').then(j => { ui.authUsers = j.users; ui.authErr = ''; }).catch(e => ui.authErr = e.message).finally(() => { ui.authLoading = false; renderSoft(); }); }
    const au = Object.fromEntries((ui.authUsers || []).map(u => [u.id, u]));
    const cur = sub('admin', 'list'), q = (ui.admQ || '').toLowerCase(), rf = ui.admRole || 'all';
    const st = p => { const a = au[p.id]; return !p.active ? 'locked' : a && !a.confirmed ? 'pending' : 'active'; };
    const rows = S.profiles.filter(p => (!q || (p.name + ' ' + p.email + ' ' + p.team + ' ' + p.role).toLowerCase().includes(q)) && (rf === 'all' || roleOf(p) === rf));
    const counts = {active:0, pending:0, locked:0}; S.profiles.forEach(p => counts[st(p)]++);
    const statusPill = p => ({locked:pill('Đã khoá', 'red'), pending:pill('Chờ kích hoạt', 'yellow'), active:pill('Hoạt động', 'green')})[st(p)];
    const usedRoles = [...new Set(S.profiles.map(roleOf))];
    const tabs = subtabs('admin', [['list','Danh sách tài khoản'],['matrix','Ma trận phân quyền'],['roles','Vai trò mẫu']], 'list');
    const filters = `<div class="row" style="flex-wrap:wrap"><div class="search" style="flex:1;min-width:220px;max-width:360px">${ic('search', 15)}<input id="adm-q" data-input="adm-q" value="${esc(ui.admQ || '')}" placeholder="Tìm theo tên, email, phòng ban"></div>
      <div class="toolbar"><button class="fchip sm ${rf === 'all' ? 'on' : ''}" data-act="adm-rf" data-r="all">Tất cả vai trò</button>${usedRoles.map(r => `<button class="fchip sm ${rf === r ? 'on' : ''}" data-act="adm-rf" data-r="${r}">${ROLES[r].label}</button>`).join('')}</div></div>`;
    let body;
    if (cur === 'list'){
      body = filters + `<div class="table-wrap"><table><thead><tr><th>Nhân viên</th><th>Chức danh · Phòng ban</th><th>Vai trò</th><th>Được dùng</th><th>Trạng thái</th><th>Đăng nhập gần nhất</th><th></th></tr></thead><tbody>
        ${rows.map(p => { const a = au[p.id]; const on = PERM_MODS.filter(([m]) => permOf(p, m) !== 'none');
          return `<tr class="click" data-act="adm-edit" data-id="${p.id}" tabindex="0"><td><div class="who">${av(p.id, 30)}<span><b style="font-weight:500">${esc(p.name)}${p.id === L.uid ? ' (bạn)' : ''}</b><small>${esc(p.email)}</small></span></div></td>
          <td>${esc(p.role || '—')}${p.team ? `<div class="small muted">${esc(p.team)}</div>` : ''}</td>
          <td>${pill(ROLES[roleOf(p)].label, roleOf(p) === 'admin' ? 'purple' : roleOf(p) === 'custom' ? 'orange' : 'gray')}</td>
          <td><div class="mod-dots">${PERM_MODS.map(([m, l]) => `<span class="md md-${permOf(p, m)}" title="${l}: ${{edit:'Được sửa', view:'Chỉ xem', none:'Không'}[permOf(p, m)]}">${l.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>`).join('')}</div><small class="muted">${on.length}/${PERM_MODS.length} module</small></td>
          <td>${statusPill(p)}</td><td class="small">${a && a.last_sign_in_at ? ago(Date.parse(a.last_sign_in_at)) : '—'}</td>
          <td class="r"><button class="btn line sm" data-act="adm-edit" data-id="${p.id}">Quản lý</button></td></tr>`; }).join('') || '<tr><td colspan="7" class="empty">Không có tài khoản phù hợp</td></tr>'}
        </tbody></table></div>
        <div class="legend"><span><i style="--c:var(--green)"></i>Được sửa</span><span><i style="--c:var(--blue)"></i>Chỉ xem</span><span><i style="--c:var(--line)"></i>Không truy cập</span></div>`;
    } else if (cur === 'matrix'){
      body = filters + `<div class="small muted">Bấm vào ô để đổi nhanh: Không → Xem → Sửa. Quản trị viên luôn có toàn quyền.</div>
        <div class="table-wrap"><table class="matrix"><thead><tr><th>Nhân viên</th><th>Vai trò</th>${PERM_MODS.map(([, l]) => `<th class="c">${l}</th>`).join('')}</tr></thead><tbody>
        ${rows.map(p => `<tr><td><div class="who">${av(p.id, 26)}<span><b style="font-weight:500">${esc(p.name)}</b><small>${esc(p.team || p.email)}</small></span></div></td><td>${pill(ROLES[roleOf(p)].label, roleOf(p) === 'admin' ? 'purple' : roleOf(p) === 'custom' ? 'orange' : 'gray')}</td>
          ${PERM_MODS.map(([m]) => `<td class="c">${p.isAdmin ? lvCell('edit') : `<button class="lv-btn" data-act="adm-cycle" data-id="${p.id}" data-m="${m}" aria-label="Đổi quyền">${lvCell(permOf(p, m))}</button>`}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>`;
    } else {
      body = `<div class="small muted">Vai trò là mẫu quyền để áp nhanh khi mời hoặc sửa tài khoản. Sau khi áp vẫn chỉnh riêng từng module được (khi đó vai trò hiện “Tuỳ chỉnh”).</div>
        <div class="table-wrap"><table class="matrix"><thead><tr><th>Vai trò</th><th class="r">Số người</th>${PERM_MODS.map(([, l]) => `<th class="c">${l}</th>`).join('')}</tr></thead><tbody>
        ${Object.entries(ROLES).filter(([k]) => k !== 'custom').map(([k, r]) => `<tr><td><b style="font-weight:500">${r.label}</b></td><td class="r">${S.profiles.filter(p => roleOf(p) === k).length}</td>${PERM_MODS.map(([m]) => `<td class="c">${lvCell(r.admin ? 'edit' : (r.perms[m] || 'none'))}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>`;
    }
    return head('Tài khoản & phân quyền', 'Mời nhân viên bằng email công ty, chọn vai trò và mức quyền từng module. Quyền được kiểm tra ở cả máy chủ.', `<button class="btn" data-act="adm-invite">${ic('plus', 15)}Mời nhân viên</button>`)
      + (ui.authErr ? `<div class="card pad small" style="background:var(--red-t);color:var(--red)">${esc(ui.authErr)} — kiểm tra biến SUPABASE_SERVICE_KEY trên Render.</div>` : '')
      + `<div class="stats">${stat('Tổng tài khoản', S.profiles.length, S.profiles.filter(p => p.isAdmin).length + ' quản trị viên')}${stat('Đang hoạt động', counts.active, 'đã kích hoạt')}${stat('Chờ kích hoạt', counts.pending, 'chưa đặt mật khẩu', counts.pending ? 'bad' : '')}${stat('Đã khoá', counts.locked, 'không đăng nhập được')}</div>`
      + tabs + body;
  };
  INP['adm-q'] = el => { ui.admQ = el.value; render(); };
  ACT['adm-rf'] = (el, d) => { ui.admRole = d.r; render(); };
  const reloadProfiles = async () => { const {data} = await sb.from('profiles').select('*').order('name'); if (data) S.profiles = data.map(mapProfile); };
  ACT['adm-cycle'] = async (el, d) => {
    const p = S.profiles.find(x => x.id === d.id), next = {none:'view', view:'edit', edit:'none'}[permOf(p, d.m)];
    const perms = {...p.perms, [d.m]:next};
    const match = Object.entries(ROLES).find(([k, r]) => r.perms && PERM_MODS.every(([m]) => (r.perms[m] || 'none') === (perms[m] || 'none')));
    const {error} = await sb.from('profiles').update({perms, role:match ? match[0] : 'custom'}).eq('id', p.id);
    if (error) return toast(error.message);
    await reloadProfiles(); render();
  };
  ACT['adm-invite'] = () => showModal(`<form class="modal wide" data-form="adm-invite"><h3>Mời nhân viên${closeBtn()}</h3>
    <div class="sub">Hệ thống gửi email mời tới email công ty, nhân viên bấm link để tự đặt mật khẩu.</div>
    <div class="row2"><label class="field">Email công ty<input id="ai-email" name="email" type="email" required placeholder="ten@congty.vn"></label><label class="field">Họ tên<input id="ai-name" name="name" required></label></div>
    <div class="row2"><label class="field">Chức danh<input id="ai-title" name="title" placeholder="VD: Kỹ sư QS"></label><label class="field">Phòng ban / đội<input id="ai-team" name="team" list="ai-teams"></label></div>
    <datalist id="ai-teams">${[...new Set(S.profiles.map(p => p.team).filter(Boolean))].map(t => `<option value="${esc(t)}">`).join('')}</datalist>
    ${permGrid(ROLES.staff.perms, 'staff')}
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">${ic('check', 15)}Gửi lời mời</button></div></form>`);
  FORM['adm-invite'] = async (v, f) => {
    const btn = f.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Đang gửi…';
    const role = v.role || 'staff';
    try { await api('invite', {email:v.email, name:v.name, title:v.title, team:v.team, is_admin:role === 'admin', role, perms:role === 'admin' ? {} : readGrid(v)}); }
    catch (e){ btn.disabled = false; btn.textContent = 'Gửi lời mời'; return toast(e.message); }
    closeModal(); ui.authUsers = null; toast('Đã gửi email mời tới ' + v.email);
    await reloadProfiles(); render();
  };
  ACT['adm-edit'] = (el, d) => {
    const p = S.profiles.find(x => x.id === d.id), a = (ui.authUsers || []).find(x => x.id === d.id) || {};
    const self = p.id === L.uid;
    showModal(`<form class="modal wide" data-form="adm-edit" data-id="${p.id}"><h3><span class="row">${av(p.id, 36)}<span>${esc(p.name)}<div class="small muted" style="font-weight:400">${esc(p.email)}</div></span></span>${closeBtn()}</h3>
      <div class="row2"><label class="field">Họ tên<input id="ae-name" name="name" required value="${esc(p.name)}"></label><label class="field">Chức danh<input id="ae-title" name="title" value="${esc(p.role)}"></label></div>
      <label class="field">Phòng ban / đội<input id="ae-team" name="team" value="${esc(p.team)}"></label>
      ${self ? `<div class="card pad small" style="background:var(--purple-t)">Đây là tài khoản của bạn (quản trị viên). Không tự hạ quyền được — nhờ quản trị viên khác nếu cần.</div>` : permGrid(p.perms, roleOf(p))}
      <div class="field">Tài khoản<div class="row" style="flex-wrap:wrap"><button type="button" class="btn line sm" data-act="adm-do" data-a="resend" data-id="${p.id}">${ic('bell', 13)}${a.confirmed === false ? 'Gửi lại email mời' : 'Gửi email đặt lại mật khẩu'}</button>
        ${self ? '' : `<button type="button" class="btn line sm" data-act="adm-do" data-a="${p.active ? 'lock' : 'unlock'}" data-id="${p.id}">${p.active ? 'Khoá tài khoản' : 'Mở khoá'}</button><button type="button" class="btn danger sm" data-act="adm-do" data-a="delete" data-id="${p.id}">Xoá tài khoản</button>`}</div></div>
      <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Đóng</button><button class="btn" type="submit">Lưu thay đổi</button></div></form>`);
  };
  FORM['adm-edit'] = async (v, f) => {
    const patch = {name:v.name.trim(), title:v.title.trim(), team:v.team.trim()};
    if (f.dataset.id !== L.uid && v.role){ patch.role = v.role; patch.is_admin = v.role === 'admin'; if (v.role !== 'admin') patch.perms = readGrid(v); }
    const {error} = await sb.from('profiles').update(patch).eq('id', f.dataset.id);
    if (error) return toast(error.message);
    await reloadProfiles(); closeModal(); render(); toast('Đã lưu tài khoản & quyền');
  };
  ACT['adm-do'] = async (el, d) => {
    const risky = d.a === 'delete' || d.a === 'lock';
    if (risky && el.dataset.armed !== '1'){ el.dataset.armed = '1'; el.textContent = d.a === 'delete' ? 'Bấm lần nữa: xoá vĩnh viễn' : 'Bấm lần nữa để khoá'; return; }
    el.disabled = true;
    try { const r = await api(d.a, {id:d.id}); toast({resend:r.kind === 'invite' ? 'Đã gửi lại email mời' : 'Đã gửi email đặt lại mật khẩu', lock:'Đã khoá tài khoản', unlock:'Đã mở khoá', delete:'Đã xoá tài khoản'}[d.a]); }
    catch (e){ el.disabled = false; return toast(e.message); }
    closeModal(); ui.authUsers = null;
    const {data} = await sb.from('profiles').select('*').order('name'); if (data) S.profiles = data.map(mapProfile); render();
  };

  /* ---------- luồng đăng nhập ---------- */
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') return setTimeout(() => showSetPassword('recovery'), 0);
    if (event === 'SIGNED_OUT'){ LIVE.ready = false; }
  });
  if (linkErr){ history.replaceState(null, '', location.pathname); return showLogin(/expired|invalid/i.test(linkErr) ? 'Link đã hết hạn hoặc đã được dùng. Hãy bấm “Quên mật khẩu?” để nhận link mới.' : esc(linkErr), true); }
  showLoading('Đang kiểm tra đăng nhập…');
  const {data:{session}} = await sb.auth.getSession();
  let settingPw = !!session && (flow === 'invite' || flow === 'recovery');
  // Đăng nhập bằng form xong → vào workspace (đăng ký trước khi có thể return).
  sb.auth.onAuthStateChange(event => { if (event === 'SIGNED_IN' && !started && !settingPw) setTimeout(start, 0); });
  if (!session) return showLogin();
  if (settingPw) return showSetPassword(flow);
  start();
}
