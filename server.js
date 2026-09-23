// Dezon Workspace — máy chủ tối giản cho Render (không cần thư viện ngoài).
//  • Phục vụ giao diện tĩnh trong /public
//  • /config.js : cấu hình Supabase cho trình duyệt (URL + publishable/anon key — công khai)
//  • /api/admin/* : quản lý tài khoản, dùng khoá bí mật SUPABASE_SERVICE_KEY (chỉ nằm ở server)
//
// Biến môi trường trên Render:
//   SUPABASE_URL          https://<project>.supabase.co
//   SUPABASE_ANON_KEY     publishable key (sb_publishable_…) hoặc anon key
//   SUPABASE_SERVICE_KEY  secret key (sb_secret_…) hoặc service_role key — KHÔNG đưa lên trình duyệt
//   SITE_URL              https://workspace-dezon.onrender.com (link trong email mời / đặt lại mật khẩu)
// Thiếu SUPABASE_ANON_KEY → app chạy chế độ demo (dữ liệu mẫu trong trình duyệt).
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;
// Project Supabase riêng của workspace (URL công khai). Đổi bằng biến SUPABASE_URL nếu cần.
const SB_URL = (process.env.SUPABASE_URL || 'https://unosioqjrigqcscodmzr.supabase.co').replace(/\/+$/, '');
const SB_ANON = process.env.SUPABASE_ANON_KEY || '';
const SB_SERVICE = process.env.SUPABASE_SERVICE_KEY || '';
const SITE_URL = (process.env.SITE_URL || 'https://workspace-dezon.onrender.com').replace(/\/+$/, '');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json'
};

const send = (res, code, obj) => { res.writeHead(code, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'}); res.end(JSON.stringify(obj)); };
const svcHeaders = extra => Object.assign({apikey: SB_SERVICE, 'Content-Type': 'application/json'},
  SB_SERVICE.startsWith('eyJ') ? {Authorization: 'Bearer ' + SB_SERVICE} : {}, extra || {});
async function sb(pathname, opt = {}){
  const r = await fetch(SB_URL + pathname, {...opt, headers: svcHeaders(opt.headers)});
  const text = await r.text(); let body = null; try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  return {ok: r.ok, status: r.status, body};
}
const errMsg = b => (b && (b.msg || b.message || b.error_description || b.error)) || 'Lỗi không xác định';
function readJson(req){
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 1e5) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
  });
}
// Xác minh người gọi là quản trị viên còn hoạt động.
async function requireAdmin(req){
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const u = await fetch(SB_URL + '/auth/v1/user', {headers: {apikey: SB_ANON, Authorization: 'Bearer ' + token}});
  if (!u.ok) return null;
  const user = await u.json();
  const p = await sb(`/rest/v1/profiles?id=eq.${user.id}&select=is_admin,active`);
  return p.ok && p.body[0] && p.body[0].is_admin && p.body[0].active ? user : null;
}
const redirect = () => SITE_URL || '';

async function adminApi(req, res, action){
  if (!SB_URL || !SB_SERVICE) return send(res, 503, {error: 'Máy chủ chưa cấu hình SUPABASE_SERVICE_KEY'});
  const admin = await requireAdmin(req);
  if (!admin) return send(res, 403, {error: 'Chỉ quản trị viên mới làm được thao tác này'});
  if (action === 'users' && req.method === 'GET'){
    const r = await sb('/auth/v1/admin/users?per_page=1000');
    if (!r.ok) return send(res, r.status, {error: errMsg(r.body)});
    return send(res, 200, {users: (r.body.users || []).map(u => ({id: u.id, email: u.email, last_sign_in_at: u.last_sign_in_at, confirmed: !!(u.email_confirmed_at || u.confirmed_at), invited_at: u.invited_at, banned: !!u.banned_until && new Date(u.banned_until) > new Date()}))});
  }
  if (req.method !== 'POST') return send(res, 405, {error: 'Method not allowed'});
  let b; try { b = await readJson(req); } catch (e) { return send(res, 400, {error: 'Dữ liệu không hợp lệ'}); }
  if (action === 'invite'){
    const email = String(b.email || '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return send(res, 400, {error: 'Email không hợp lệ'});
    const q = redirect() ? '?redirect_to=' + encodeURIComponent(redirect() + '/') : '';
    const r = await sb('/auth/v1/invite' + q, {method: 'POST', body: JSON.stringify({email, data: {name: b.name || '', title: b.title || '', team: b.team || ''}})});
    if (!r.ok) return send(res, r.status, {error: /already|registered|exists/i.test(errMsg(r.body)) ? 'Email này đã có tài khoản' : errMsg(r.body)});
    const id = r.body.id || (r.body.user && r.body.user.id);
    const patch = {name: b.name || email.split('@')[0], title: b.title || '', team: b.team || ''};
    if (b.is_admin) patch.is_admin = true;
    if (typeof b.role === 'string' && /^[a-z]{2,20}$/.test(b.role)) patch.role = b.role;
    if (b.perms && typeof b.perms === 'object'){
      const ok = ['sales','projects','pm','att','fin','qs','wiki','apps'], lv = ['none','view','edit'];
      patch.perms = Object.fromEntries(Object.entries(b.perms).filter(([k, v]) => ok.includes(k) && lv.includes(v)));
    }
    if (id) await sb(`/rest/v1/profiles?id=eq.${id}`, {method: 'PATCH', body: JSON.stringify(patch)});
    return send(res, 200, {ok: true, id});
  }
  const id = String(b.id || '');
  if (!/^[0-9a-f-]{36}$/.test(id)) return send(res, 400, {error: 'Thiếu tài khoản'});
  if (id === admin.id && (action === 'lock' || action === 'delete')) return send(res, 400, {error: 'Không thể tự khoá hoặc xoá tài khoản của chính mình'});
  if (action === 'lock' || action === 'unlock'){
    const on = action === 'unlock';
    const r = await sb(`/auth/v1/admin/users/${id}`, {method: 'PUT', body: JSON.stringify({ban_duration: on ? 'none' : '876000h'})});
    if (!r.ok) return send(res, r.status, {error: errMsg(r.body)});
    await sb(`/rest/v1/profiles?id=eq.${id}`, {method: 'PATCH', body: JSON.stringify({active: on})});
    return send(res, 200, {ok: true});
  }
  if (action === 'resend'){
    // Chưa kích hoạt → gửi lại thư mời; đã kích hoạt → gửi thư đặt lại mật khẩu.
    const u = await sb(`/auth/v1/admin/users/${id}`);
    if (!u.ok) return send(res, u.status, {error: errMsg(u.body)});
    const confirmed = !!(u.body.email_confirmed_at || u.body.confirmed_at);
    const q = redirect() ? '?redirect_to=' + encodeURIComponent(redirect() + '/') : '';
    const r = confirmed
      ? await sb('/auth/v1/recover' + q, {method: 'POST', body: JSON.stringify({email: u.body.email})})
      : await sb('/auth/v1/invite' + q, {method: 'POST', body: JSON.stringify({email: u.body.email})});
    if (!r.ok) return send(res, r.status, {error: errMsg(r.body)});
    return send(res, 200, {ok: true, kind: confirmed ? 'recovery' : 'invite'});
  }
  if (action === 'delete'){
    const r = await sb(`/auth/v1/admin/users/${id}`, {method: 'DELETE'});
    if (!r.ok) return send(res, r.status, {error: errMsg(r.body)});
    return send(res, 200, {ok: true});
  }
  return send(res, 404, {error: 'Không có thao tác này'});
}

http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/healthz') { res.writeHead(200, {'Content-Type': 'text/plain'}); return res.end('ok'); }
  if (url === '/config.js'){
    res.writeHead(200, {'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-cache'});
    return res.end('window.SF_CONFIG = ' + JSON.stringify(SB_URL && SB_ANON ? {url: SB_URL, key: SB_ANON, admin: !!SB_SERVICE} : null) + ';');
  }
  const m = url.match(/^\/api\/admin\/([a-z]+)$/);
  if (m) return adminApi(req, res, m[1]).catch(e => { console.error(e); send(res, 500, {error: 'Lỗi máy chủ'}); });
  let file = path.normalize(path.join(ROOT, url));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (err || st.isDirectory()) file = err ? path.join(ROOT, 'index.html') : path.join(file, 'index.html');
    fs.readFile(file, (e, buf) => {
      if (e) { res.writeHead(404); return res.end('Not found'); }
      const ext = path.extname(file);
      // no-cache: trình duyệt luôn lấy bản mới sau mỗi lần deploy (tránh HTML mới chạy với JS cũ).
      res.writeHead(200, {'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache'});
      res.end(buf);
    });
  });
}).listen(PORT, () => console.log('Dezon Workspace chạy tại cổng ' + PORT + (SB_URL ? ' · Supabase: ' + SB_URL : ' · chế độ demo')));
