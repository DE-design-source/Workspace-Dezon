/* Dezon Workspace — lõi: tiện ích, trạng thái, khung giao diện, biểu đồ, trợ lý. */

/* ============ tiện ích ============ */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const DAY = 864e5;
const pad = n => String(n).padStart(2, '0');
const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const todayISO = () => iso(today0());
const dayISO = off => { const d = today0(); d.setDate(d.getDate() + off); return iso(d); };
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return iso(d); };
const diffDays = (a, b) => Math.round((parseD(b) - parseD(a)) / DAY);
const daysLeft = s => diffDays(todayISO(), s);
const fmtDate = s => { if (!s) return '—'; const d = parseD(s); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1); };
const fmtFull = s => { const d = parseD(s); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); };
const relDay = s => { const n = daysLeft(s); return n === 0 ? 'Hôm nay' : n === 1 ? 'Ngày mai' : n === -1 ? 'Hôm qua' : fmtDate(s); };
const hm = ts => { const d = new Date(ts); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const nowHM = () => hm(Date.now());
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const ago = t => { const m = Math.round((Date.now() - t) / 6e4); return m < 1 ? 'vừa xong' : m < 60 ? m + ' phút trước' : m < 1440 ? Math.round(m / 60) + ' giờ trước' : Math.round(m / 1440) + ' ngày trước'; };
const WD = ['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const longDate = s => { const d = parseD(s); return WD[d.getDay()] + ', ' + fmtFull(s); };
// Dữ liệu mẫu viết theo ngày của bản thiết kế (21/09/2026) rồi dời theo ngày hôm nay để luôn "đang diễn ra".
const MOCK_TODAY = new Date(2026, 8, 21);
const SHIFT = Math.round((today0() - MOCK_TODAY) / DAY);
const md = s => addDays(s, SHIFT);
// tiền: tr = triệu đồng; ty = tỷ đồng; vnd = đồng
const dec = (v, n) => v.toFixed(n).replace('.', ',');
const trd = v => { const a = Math.abs(v); return (v < 0 ? '−' : '') + (a >= 1000 ? dec(a / 1000, 2) + ' tỷ' : Math.round(a) + 'tr'); };
const ty = v => dec(v, 1) + ' tỷ';
const num = n => Math.round(n).toLocaleString('vi-VN');
const vnd = n => num(n) + ' đ';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sum = (arr, f = x => x) => arr.reduce((a, x) => a + (+f(x) || 0), 0);
const cv = c => `var(--${c})`, ct = c => `var(--${c}-t)`;

/* ============ biểu tượng ============ */
const IC = {
  grid:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  briefcase:'<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8.5 7V5.5A2.5 2.5 0 0 1 11 3h2a2.5 2.5 0 0 1 2.5 2.5V7M3 13h18"/>',
  building:'<rect x="4" y="3" width="11" height="18" rx="1.5"/><path d="M15 9h4.5a.5.5 0 0 1 .5.5V21M8 7h3M8 11h3M8 15h3M2.5 21h19"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  gantt:'<path d="M4 5h9M7 10h11M5 15h7M10 20h10"/>',
  userclock:'<circle cx="9" cy="8" r="4"/><path d="M2.5 20a6.5 6.5 0 0 1 9.5-5.8"/><circle cx="17.5" cy="16.5" r="4"/><path d="M17.5 14.8v1.9l1.2.8"/>',
  wallet:'<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3"/><rect x="3.5" y="7.5" width="17" height="12.5" rx="2.5"/><path d="M16 13.8h1.5"/>',
  ruler:'<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7M8.5 11h1M12 11h1M15 11h.5M8.5 14.5h1M12 14.5h1M8.5 18h1M12 18h1M15 14.5V18"/>',
  book:'<path d="M4 19V5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5 2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.5h5"/>',
  file:'<path d="M14 3H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V9z"/><path d="M14 3v6h6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  gift:'<rect x="3.5" y="8" width="17" height="4.5" rx="1"/><path d="M5 12.5V21h14v-8.5M12 8v13M12 8C10.5 4 7 4 7 6s3 2 5 2c2 0 5 0 5-2s-3.5-2-5 2"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9.5 17h5v4h-5z"/>',
  pin:'<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  filter:'<path d="M4 5h16l-6 7.5V19l-4 2v-8.5z"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  edit:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/>',
  alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  cart:'<circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/><path d="M3 4h2.5l2.2 11h10.8l2-8H6.5"/>',
  panel:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M15 4v16"/>',
  flame:'<path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-1.5-2-1.5-3C7 10 6 12.5 6 15a6 6 0 0 0 6 6z"/>',
  phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 3v4M17 5h4"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  minus:'<path d="M5 12h14"/>',
  chev:'<path d="m9 18 6-6-6-6"/>',
  left:'<path d="m15 18-6-6 6-6"/>',
  hash:'<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  coin:'<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2.1 0 2.9 6 1.6 6 4.4 0 1.2-1.3 2.1-3 2.1-1.4 0-2.6-.6-3.1-1.6M12 6v1.7M12 16.3V18"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  reset:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
  bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  clip:'<path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7"/>',
  external:'<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
  megaphone:'<path d="M3 10v4a1 1 0 0 0 1 1h3l5 4V5L7 9H4a1 1 0 0 0-1 1z"/><path d="M16 8.5a5 5 0 0 1 0 7M19 5.5a9 9 0 0 1 0 13"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  sidebar:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>',
  hardhat:'<path d="M3 18h18v-2a9 9 0 0 0-18 0zM10 7v6M14 7v6M10 7a2 2 0 0 1 4 0"/>'
};
const ic = (n, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;

/* ============ đăng ký module ============ */
// mods: quyền cần có (một trong số đó) để thấy mục; cur(): quyền áp cho tab đang mở (dải "Chỉ xem").
const VIEWS = {
  dash:{label:'Tổng quan', icon:'grid', group:'Menu'},
  mkt:{label:'Marketing', icon:'megaphone', group:'Menu', mods:['mkt']},
  sales:{label:'Kinh doanh', icon:'briefcase', group:'Menu', mods:['sales']},
  chat:{label:'Chat', icon:'chat', group:'Menu'},
  pm:{label:'Quản lý dự án', icon:'gantt', group:'Menu', scoped:true, mods:['projects','pm'], cur:() => ['gantt','quest'].includes(S.sub.pm) ? 'pm' : 'projects'},
  att:{label:'HR', icon:'userclock', group:'Menu', mods:['att','hr'], cur:() => (S.sub.hr || 'cc') === 'cc' ? 'att' : 'hr'},
  fin:{label:'Tài chính', icon:'wallet', group:'Menu', scoped:true, mods:['fin']},
  qs:{label:'QS', icon:'ruler', group:'Menu', mods:['qs']},
  po:{label:'Mua hàng', icon:'cart', group:'Menu', mods:['po']},
  wiki:{label:'Wiki', icon:'book', group:'Khác', mods:['wiki']},
  settings:{label:'Cài đặt', icon:'gear', group:'Khác'}
};
/* Ứng dụng web nhúng (giống mục ứng dụng trong Lark): mở ngay trong workspace bằng khung riêng. */
const DEFAULT_APPS = [{id:'qspro', name:'QS Pro', desc:'Dự toán & bóc tách chuyên nghiệp', url:'https://qs-pro-srgx.onrender.com/', icon:'ruler', c:'orange'}];
const APP_ICONS = ['ruler','grid','briefcase','building','wallet','book','chat','users','gantt','file','target','bulb'];
const isApp = v => String(v).startsWith('app-');
const appOf = v => (S.apps || []).find(a => 'app-' + a.id === v);
function vinfo(v){
  if (isApp(v)){ const a = appOf(v); return a ? {label:a.name, icon:a.icon, group:'Ứng dụng', app:a} : null; }
  return VIEWS[v] || null;
}
// LIVE = kết nối Supabase (live.js gán khi đăng nhập); null = chế độ demo dữ liệu mẫu trong trình duyệt.
let LIVE = null;
// Phân quyền theo module: none | view | edit. Demo = toàn quyền.
const PERM_MODS = [
  ['mkt','Marketing','Chiến dịch, danh mục chi phí, báo giá marketing'],
  ['sales','Kinh doanh','Pipeline khách hàng, cơ hội, hồ sơ khách'],
  ['projects','Dự án','Danh sách, thiết lập thi công, luồng dữ liệu'],
  ['pm','Tiến độ & nhiệm vụ','Gantt, mốc, nhiệm vụ & điểm thưởng thi công'],
  ['att','Chấm công','Chấm công theo công trường, duyệt ngoài vùng'],
  ['hr','Hồ sơ & lương','Hồ sơ nhân sự, bảng lương'],
  ['fin','Tài chính','Ngân sách, hoá đơn, công nợ, dòng tiền'],
  ['qs','QS','Bóc tách, báo giá, danh mục sản phẩm'],
  ['po','Mua hàng','Đơn mua hàng, nhà cung cấp, duyệt đơn'],
  ['wiki','Wiki','Sổ tay, nội quy, quy trình'],
  ['apps','Ứng dụng','QS Pro & các link web nhúng']];
const perm = mod => LIVE && LIVE.perm ? LIVE.perm(mod) : 'edit';
function canSee(v){
  if (v === 'admin') return !!(LIVE && LIVE.isAdmin);
  if (isApp(v)) return perm('apps') !== 'none';
  const mods = (VIEWS[v] || {}).mods;
  return !mods || mods.some(m => perm(m) !== 'none');
}
const viewPerm = v => { const x = VIEWS[v]; return x && x.mods ? perm(x.cur ? x.cur() : x.mods[0]) : 'edit'; };
const MOD = {}, AFTER = {}, ACT = {}, FORM = {}, INP = {}, CHG = {}, DROP = {}, DEL = {};
const SEEDS = [], SEARCH = [], AI = [], AI_CHIPS = [], AI_SUGG = [];

/* ============ trạng thái ============ */
const KEY = 'siteflow-workspace-v1';
let S;
const ui = {notif:false, palItems:[]};
function seed(){
  const s = {v:1, view:'dash', tabs:['dash','mkt','sales','chat','pm','app-qspro'], apps:JSON.parse(JSON.stringify(DEFAULT_APPS)), pid:'riverside', sub:{}, ai:[], activity:[], seenAct:0, me:'ta',
    people:[
      {id:'ta', name:'Trần Anh', role:'Quản lý dự án', team:'Văn phòng', c:'purple'},
      {id:'da', name:'Nguyễn Đức Anh', role:'Chỉ huy trưởng', team:'Ban chỉ huy', c:'blue'},
      {id:'hoa', name:'Lê Thị Hoa', role:'Tư vấn thiết kế', team:'Kỹ thuật', c:'pink'},
      {id:'lv', name:'Lê Văn', role:'Tổ trưởng', team:'Đội thi công A', c:'green'},
      {id:'nh', name:'Ngọc Hà', role:'Tổ trưởng', team:'Đội thi công B', c:'yellow'},
      {id:'pb', name:'Phạm Quốc Bảo', role:'Công nhân', team:'Đội thi công A', c:'orange'},
      {id:'hb', name:'Hoàng Gia Bảo', role:'Công nhân', team:'Đội hoàn thiện', c:'blue'},
      {id:'nl', name:'Ngô Thị Lan', role:'Kỹ thuật viên', team:'Đội MEP', c:'pink'},
      {id:'vn', name:'Vũ Hải Nam', role:'Công nhân', team:'Đội thi công B', c:'green'},
      {id:'ts', name:'Trịnh Xuân Sơn', role:'Tổ trưởng', team:'Đội thi công C', c:'orange'},
      {id:'dp', name:'Đặng Hữu Phúc', role:'Chuyên viên', team:'Nhân sự', c:'purple'},
      {id:'ct', name:'Cao Nhật Tân', role:'Nhân viên', team:'Mua hàng', c:'yellow'},
      {id:'lt', name:'Lý Thu Trang', role:'Nhân viên', team:'Cung ứng', c:'blue'},
      {id:'bn', name:'Phan Bảo Ngọc', role:'Kế toán trưởng', team:'Kế toán', c:'green'},
      {id:'tl', name:'Đỗ Thành Long', role:'Tư vấn giám sát', team:'Ban chỉ huy', c:'brown'}
    ]};
  SEEDS.forEach(f => f(s));
  s.activity = [
    {t:Date.now() - 20 * 6e4, text:'Ngọc Hà báo cáo tiến độ sàn tầng 4', c:'purple'},
    {t:Date.now() - 55 * 6e4, text:'Cao Nhật Tân chấm công ngoài vùng tại Kho Bình Chánh', c:'green'},
    {t:Date.now() - 140 * 6e4, text:'Hoá đơn INV-0142 đã quá hạn thanh toán', c:'red'}
  ];
  return s;
}
function load(){
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || S.v !== 1) S = seed();
  // dữ liệu demo cũ: bổ sung phần mới (Marketing, HR, Cài đặt…) từ dữ liệu mẫu
  const base = seed();
  Object.keys(base).forEach(k => { if (S[k] === undefined) S[k] = base[k]; });
  base.people.forEach(p => { if (!S.people.some(x => x.id === p.id)) S.people.push(p); });
  if (!S.apps) S.apps = JSON.parse(JSON.stringify(DEFAULT_APPS));
  S.tabs = [...new Set(S.tabs.map(t => t === 'projects' ? 'pm' : t))].filter(vinfo);
}
function save(){
  if (LIVE){ LIVE.saveUi(); LIVE.sync(); return; }
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
}
function log(text, c = 'purple'){ S.activity.unshift({t:Date.now(), text, c}); S.activity = S.activity.slice(0, 40); }
const allPeople = () => (S.profiles || []).concat(S.people || []);
const person = id => allPeople().find(p => p.id === id) || {id, name:id ? 'Không rõ' : '—', role:'', team:'', c:'gray'};
const initials = name => { const w = String(name).trim().split(/\s+/); return (w.length > 1 ? w[w.length - 2][0] + w[w.length - 1][0] : w[0].slice(0, 2)).toUpperCase(); };
function av(id, s = 26){
  const p = person(id);
  return `<span class="av" title="${esc(p.name)}" style="width:${s}px;height:${s}px;font-size:${Math.round(s * .38)}px;background:${cv(p.c)}">${esc(initials(p.name))}</span>`;
}
const peopleOpts = (sel, blank) => (blank ? `<option value="">${blank}</option>` : '') + allPeople().map(p => `<option value="${p.id}" ${p.id === sel ? 'selected' : ''}>${esc(p.name)}${p.role ? ' — ' + esc(p.role) : ''}</option>`).join('');
const opt = (list, sel) => list.map(x => { const [v, l] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(v)}" ${String(v) === String(sel) ? 'selected' : ''}>${esc(l)}</option>`; }).join('');
const sub = (view, def) => S.sub[view] || def;

/* ============ thành phần giao diện ============ */
const bar = (p, c, cls = '') => { p = clamp(Math.round(p), 0, 100); return `<div class="bar ${cls}"><i style="flex-basis:${p}%;background:${c}" ${p <= 0 ? 'hidden' : ''}></i><span ${p >= 100 ? 'hidden' : ''}></span></div>`; };
const pill = (text, c = 'gray') => `<span class="pill ${c}">${esc(text)}</span>`;
const stat = (label, value, note = '', cls = '') => `<div class="card stat"><small>${label}</small><b>${value}</b><em class="${cls}">${note}</em></div>`;
function subtabs(view, list, def){
  const cur = sub(view, def);
  return `<div class="seg" role="tablist">${list.map(([k, l, n]) => `<button role="tab" class="${cur === k ? 'on' : ''}" data-act="sub" data-view="${view}" data-k="${k}">${l}${n ? `<span class="cnt">${n}</span>` : ''}</button>`).join('')}</div>`;
}
const head = (title, desc, actions = '') => `<div class="head-row"><div class="hello"><h1>${title}</h1>${desc ? `<p>${desc}</p>` : ''}</div>${actions ? `<div class="actions">${actions}</div>` : ''}</div>`;
const emptyBox = (title, text, btn = '') => `<div class="card pad empty" style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:40px 24px"><b style="color:var(--ink);font-size:15px">${title}</b><span>${text}</span>${btn}</div>`;
const delBtn = kind => `<button type="button" class="btn danger" data-act="del" data-kind="${kind}">Xóa</button>`;
const closeBtn = () => `<button type="button" class="icon-btn" data-act="modal-close" aria-label="Đóng">${ic('x')}</button>`;
function monthCells(y, m){
  const first = new Date(y, m, 1), start = (first.getDay() + 6) % 7;
  const n = Math.ceil((start + new Date(y, m + 1, 0).getDate()) / 7) * 7;
  return Array.from({length:n}, (_, i) => new Date(y, m, 1 - start + i));
}

/* ============ biểu đồ SVG ============ */
function niceMax(v){ if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
function barChart({labels, series, line, w = 640, h = 230, fmt = v => num(v), lineFmt = v => num(v)}){
  const L = 46, R = line ? 56 : 12, T = 14, B = 28, pw = w - L - R, ph = h - T - B;
  const max = niceMax(Math.max(...series.flatMap(s => s.values)));
  const gw = pw / labels.length, bw = Math.min(20, gw * .7 / series.length);
  let g = '';
  for (let i = 0; i <= 4; i++){ const y = T + ph - ph * i / 4; g += `<line x1="${L}" x2="${w - R}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${L - 8}" y="${y + 4}" text-anchor="end">${fmt(max * i / 4)}</text>`; }
  labels.forEach((lb, i) => {
    const cx = L + gw * i + gw / 2;
    series.forEach((s, j) => {
      const v = s.values[i], bh = ph * v / max, x = cx - (series.length * bw) / 2 + j * bw;
      g += `<rect x="${x + 1}" y="${T + ph - bh}" width="${bw - 2}" height="${Math.max(bh, 0)}" rx="3" fill="${s.c}"><title>${esc(s.name)} ${esc(lb)}: ${fmt(v)}</title></rect>`;
    });
    g += `<text x="${cx}" y="${h - 8}" text-anchor="middle">${esc(lb)}</text>`;
  });
  if (line){
    const lmin = Math.min(...line.values), lmax = Math.max(...line.values), span = (lmax - lmin) || 1;
    const lo = lmin - span * .15, hi = lmax + span * .15;
    const pts = line.values.map((v, i) => [L + gw * i + gw / 2, T + ph - ph * (v - lo) / (hi - lo)]);
    g += `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${line.c}" stroke-width="2.5" stroke-linejoin="round"/>`;
    pts.forEach((p, i) => g += `<circle cx="${p[0]}" cy="${p[1]}" r="${i === pts.length - 1 ? 4.5 : 3}" fill="${i === pts.length - 1 ? line.c : 'var(--card)'}" stroke="${line.c}" stroke-width="2"><title>${esc(line.name)}: ${lineFmt(line.values[i])}</title></circle>`);
    const last = pts[pts.length - 1];
    g += `<text x="${last[0] + 8}" y="${last[1] + 4}" style="fill:var(--ink);font-weight:600">${lineFmt(line.values[line.values.length - 1])}</text>`;
  }
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">${g}</svg>`;
}
function lineChart({labels, series, w = 640, h = 230, max = 100, suffix = '%', marker}){
  const L = 40, R = 16, T = 14, B = 28, pw = w - L - R, ph = h - T - B, n = labels.length;
  const X = i => L + (n === 1 ? pw / 2 : pw * i / (n - 1)), Y = v => T + ph - ph * v / max;
  let g = '';
  for (let i = 0; i <= 4; i++){ const v = max * i / 4; g += `<line x1="${L}" x2="${w - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end">${Math.round(v)}${suffix}</text>`; }
  labels.forEach((lb, i) => { if (n <= 12 || i % Math.ceil(n / 12) === 0) g += `<text x="${X(i)}" y="${h - 8}" text-anchor="middle">${esc(lb)}</text>`; });
  series.forEach(s => {
    const pts = s.values.map((v, i) => v == null ? null : [X(i), Y(v)]).filter(Boolean);
    if (s.area && pts.length) g += `<path d="M${pts[0][0]},${Y(0)} ${pts.map(p => 'L' + p.join(',')).join(' ')} L${pts[pts.length - 1][0]},${Y(0)}Z" fill="${s.c}" opacity=".1"/>`;
    g += `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${s.c}" stroke-width="2.5" ${s.dash ? 'stroke-dasharray="5 5"' : ''} stroke-linejoin="round"/>`;
  });
  if (marker){
    const x = X(marker.i);
    g += `<line x1="${x}" x2="${x}" y1="${T}" y2="${T + ph}" stroke="var(--ink)" stroke-dasharray="3 3"/>`;
    const s = series.find(z => z.values[marker.i] != null && !z.dash) || series[0];
    const v = s.values[marker.i];
    if (v != null) g += `<circle cx="${x}" cy="${Y(v)}" r="5" fill="${s.c}" stroke="var(--card)" stroke-width="2"/><text x="${x + (marker.i > n * .7 ? -10 : 10)}" y="${Y(v) - 10}" text-anchor="${marker.i > n * .7 ? 'end' : 'start'}" style="fill:var(--ink);font-weight:600">${esc(marker.label)}</text>`;
  }
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">${g}</svg>`;
}
const legend = items => `<div class="legend">${items.map(([c, l, shape]) => `<span><i style="--c:${c};${shape === 'line' ? 'height:3px;width:14px' : ''}"></i>${l}</span>`).join('')}</div>`;

/* ============ khung ============ */
function renderRail(){
  const btn = (k, v, extra = '') => `<button class="rail-btn ${S.view === k ? 'on' : ''}" data-act="nav" data-v="${k}" title="${esc(v.label)}" aria-label="${esc(v.label)}" ${extra}>${ic(v.icon, 19)}<span class="rl">${esc(v.label)}</span>${v.badge ? '<span class="badge"></span>' : ''}</button>`;
  const withBadge = (k, v) => ({...v, badge:(k === 'chat' && typeof chatUnreadTotal === 'function' && chatUnreadTotal()) || (k === 'att' && typeof attPending === 'function' && attPending().length) || (k === 'po' && typeof poPending === 'function' && poPending())});
  const entries = Object.entries(VIEWS).filter(([k]) => canSee(k));
  let html = `<div class="rail-top"><div class="logo" title="Dezon Workspace"><img src="/img/logo.png" alt="Dezon" width="40" height="40"></div><span class="rl brand">Dezon<small>Workspace</small></span></div>
    <div class="rail-label">Menu</div>`;
  entries.filter(([, v]) => v.group === 'Menu').forEach(([k, v]) => html += btn(k, withBadge(k, v)));
  if (perm('apps') !== 'none'){
    html += `<div class="rail-label">Ứng dụng</div>`;
    S.apps.forEach(a => { const v = 'app-' + a.id; html += `<button class="rail-btn app ${S.view === v ? 'on' : ''}" data-act="nav" data-v="${v}" title="${esc(a.name)} — ${esc(a.desc || a.url)}" aria-label="${esc(a.name)}" style="--c:${cv(a.c)};--t:${ct(a.c)}">${ic(a.icon, 19)}<span class="rl">${esc(a.name)}</span></button>`; });
    if (perm('apps') === 'edit') html += `<button class="rail-btn extra" data-act="app-new" title="Thêm ứng dụng web" aria-label="Thêm ứng dụng web">${ic('plus', 19)}<span class="rl">Thêm ứng dụng</span></button>`;
  }
  html += `<div class="spacer"></div><div class="rail-sep"></div>`;
  entries.filter(([, v]) => v.group === 'Khác').forEach(([k, v]) => html += btn(k, v));
  html += `<button class="rail-btn extra" data-act="palette" title="Tìm nhanh (Ctrl K)" aria-label="Tìm nhanh">${ic('search', 19)}<span class="rl">Tìm nhanh <kbd>Ctrl K</kbd></span></button>
    <button class="rail-btn extra" data-act="theme" title="Đổi giao diện sáng / tối" aria-label="Đổi giao diện sáng tối">${ic('moon', 19)}<span class="rl">Giao diện sáng / tối</span></button>
    ${LIVE ? '' : `<button class="rail-btn extra" data-act="reset" title="Khôi phục dữ liệu mẫu" aria-label="Khôi phục dữ liệu mẫu">${ic('reset', 19)}<span class="rl">Khôi phục dữ liệu mẫu</span></button>`}
    <button class="rail-btn extra" data-act="rail-toggle" title="${ui.railOpen ? 'Thu gọn menu' : 'Mở rộng menu'}" aria-label="${ui.railOpen ? 'Thu gọn menu' : 'Mở rộng menu'}">${ic('sidebar', 19)}<span class="rl">Thu gọn menu</span></button>
    <button class="rail-me" data-act="me" title="${esc(person(S.me).name)} — ${LIVE ? 'Hồ sơ & mật khẩu' : 'chế độ demo'}"><span class="me" style="background:${cv(person(S.me).c || 'purple')}">${initials(person(S.me).name)}</span><span class="rl"><b>${esc(person(S.me).name)}</b><small>${esc(person(S.me).role || person(S.me).team || '')}</small></span></button>`;
  $('#rail').innerHTML = html;
}
function renderTabs(){
  $('#tabs').innerHTML = S.tabs.filter(v => vinfo(v) && canSee(v)).map(v => `
    <div class="tab ${S.view === v ? 'on' : ''}">
      <button data-act="nav" data-v="${v}">${ic(vinfo(v).icon, 14)}${esc(vinfo(v).label)}</button>
      ${S.tabs.length > 1 ? `<button class="x" data-act="tab-close" data-v="${v}" aria-label="Đóng tab ${esc(vinfo(v).label)}">${ic('x', 12)}</button>` : ''}
    </div>`).join('') + `<button class="tab-add" data-act="palette" aria-label="Mở trang khác" title="Mở trang khác">${ic('plus', 15)}</button>`;
}
function renderTop(){
  const v = vinfo(S.view);
  const a = v.app;
  const appBtns = a ? `<button class="icon-btn" data-act="app-reload" aria-label="Tải lại ${esc(a.name)}" title="Tải lại">${ic('reset')}</button>
      <a class="icon-btn" href="${esc(a.url)}" target="_blank" rel="noopener" aria-label="Mở trong trình duyệt" title="Mở trong trình duyệt">${ic('external')}</a>
      <button class="icon-btn" data-act="app-edit" data-id="${a.id}" aria-label="Sửa ứng dụng" title="Sửa ứng dụng">${ic('edit')}</button><span style="width:1px;height:20px;background:var(--line);margin:0 4px"></span>` : '';
  const scoped = v.scoped ? `<span class="ws">${ic('chev', 13)}</span><select data-change="pid" aria-label="Chọn dự án">${opt(S.projects.filter(p => p.status !== 'draft').map(p => [p.id, p.name]), S.pid)}</select>` : '';
  const newAct = S.activity.length > S.seenAct;
  $('#topbar').innerHTML = `
    <div class="crumb"><span class="ws">${a ? 'Ứng dụng' : 'Dezon'}</span>${scoped}<span class="ws">${ic('chev', 13)}</span><b>${ic(v.icon, 16)}${esc(v.label)}</b>${a ? `<span class="ws small ell" style="max-width:260px">${esc(a.url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</span>` : ''}</div>
    <div class="top-actions">${appBtns}
      <button class="icon-btn" data-act="palette" aria-label="Tìm nhanh" title="Tìm nhanh (Ctrl K)">${ic('search')}</button>
      <button class="icon-btn" data-act="nav" data-v="chat" aria-label="Chat" title="Chat">${ic('chat')}${chatUnreadTotal() ? '<span class="badge"></span>' : ''}</button>
      <button class="icon-btn" data-act="notif" aria-label="Hoạt động gần đây" title="Hoạt động gần đây">${ic('bell')}${newAct ? '<span class="badge"></span>' : ''}</button>
      <button class="icon-btn" data-act="ai-toggle" aria-label="Trợ lý" title="Bật / tắt trợ lý">${ic('sparkle')}</button>
      ${ui.notif ? `<div class="pop"><h4>Hoạt động gần đây</h4>${S.activity.slice(0, 10).map(a => `<div class="act" style="--c:${cv(a.c || 'purple')}"><i></i><div>${esc(a.text)}<small>${ago(a.t)}</small></div></div>`).join('') || '<div class="empty">Chưa có hoạt động</div>'}</div>` : ''}
    </div>`;
}
function render(){
  if (!vinfo(S.view) || !canSee(S.view) || (!isApp(S.view) && !MOD[S.view])) S.view = 'dash';
  renderTop();
  showApps();
  if (isApp(S.view)){ renderRail(); renderTabs(); save(); return; }
  const ae = document.activeElement, keep = ae && ae.id && /^(INPUT|TEXTAREA)$/.test(ae.tagName) && $('#view').contains(ae) ? {id:ae.id, v:ae.value, a:ae.selectionStart, b:ae.selectionEnd} : null;
  const ro = LIVE && viewPerm(S.view) === 'view'
    ? `<div class="ro-banner">${ic('info', 15)}<span><b>Chỉ xem</b> — bạn được xem ${esc(VIEWS[S.view].label)} nhưng chưa có quyền sửa. Thay đổi sẽ không được lưu. Cần sửa? Liên hệ quản trị viên.</span></div>` : '';
  try { $('#view').innerHTML = ro + MOD[S.view](); }
  catch (e){ console.error(e); $('#view').innerHTML = `<div class="card pad empty">Không hiển thị được trang này (${esc(e.message)}). <button class="btn sm" data-act="nav" data-v="dash">Về Tổng quan</button></div>`; }
  if (keep){ const el = document.getElementById(keep.id); if (el){ el.value = keep.v; el.focus(); try { el.setSelectionRange(keep.a, keep.b); } catch (e) {} } }
  renderRail(); renderTabs(); renderTop();
  if (AFTER[S.view]) try { AFTER[S.view](); } catch (e) { console.error(e); }
  save();
}
function nav(v, subKey){
  // tên cũ: Dự án → tab của Quản lý dự án; Tài khoản → Cài đặt
  if (v === 'projects'){ S.sub.pm = subKey || (['list','setup','detail'].includes(S.sub.pm) ? S.sub.pm : 'list'); v = 'pm'; subKey = null; }
  if (v === 'admin'){ v = 'settings'; subKey = 'members'; }
  if (!canSee(v)){ toast('Bạn chưa được cấp quyền dùng mục này'); return; }
  if (subKey) S.sub[v] = subKey;
  S.view = v; if (!S.tabs.includes(v)) S.tabs.push(v);
  ui.notif = false; $('#main').scrollTop = 0;
  if (innerWidth <= 1180) $('#frame').classList.remove('ai-open');
  render();
}

/* ============ modal / toast ============ */
function showModal(html){ const w = $('#modal'); w.innerHTML = html; w.hidden = false; const f = w.querySelector('input:not([type=hidden]),select,textarea'); if (f) f.focus(); }
function closeModal(){ $('#modal').hidden = true; $('#modal').innerHTML = ''; if (LIVE && LIVE.pending) LIVE.flush(); }
function toast(t){ const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => el.hidden = true, 2600); }
function copyText(text, okMsg){
  const done = () => toast(okMsg);
  try { navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, okMsg)); } catch (e) { fallbackCopy(text, okMsg); }
}
function fallbackCopy(text, okMsg){
  const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); toast(okMsg); } catch (e) { toast('Không sao chép được, hãy bôi đen và copy thủ công'); }
  ta.remove();
}

/* ============ tìm nhanh ============ */
function openPalette(){
  showModal(`<div class="modal pal"><input id="palQ" data-input="pal" placeholder="Tìm trang, dự án, khách hàng, công việc, trang wiki…" autocomplete="off" aria-label="Tìm nhanh"><div class="pal-list" id="palList"></div></div>`);
  palSearch('');
}
function palSearch(q){
  const s = q.trim().toLowerCase(), hit = x => !s || String(x).toLowerCase().includes(s);
  let items = Object.entries(VIEWS).filter(([k, o]) => canSee(k) && hit(o.label)).map(([v, o]) => ({icon:o.icon, label:'Mở ' + o.label, sub:'Trang', run:() => nav(v)}))
    .concat(S.apps.filter(a => perm('apps') !== 'none' && hit(a.name + ' ' + a.url)).map(a => ({icon:a.icon, label:'Mở ' + a.name, sub:'Ứng dụng', run:() => nav('app-' + a.id)})));
  if (s) SEARCH.forEach(f => items = items.concat(f(hit)));
  ui.palItems = items.slice(0, 14);
  $('#palList').innerHTML = ui.palItems.map((it, i) => `<button class="pal-item ${i === 0 ? 'first' : ''}" data-act="pal" data-i="${i}">${ic(it.icon, 16)}<span>${esc(it.label)}</span><small>${esc(it.sub)}</small></button>`).join('') || '<div class="empty">Không tìm thấy kết quả</div>';
}
INP.pal = el => palSearch(el.value);

/* ============ trợ lý (trả lời từ dữ liệu workspace) ============ */
const list = items => items.length ? '<ul>' + items.map(x => '<li>' + x + '</li>').join('') + '</ul>' : '';
function renderAi(){
  const body = $('#aiBody');
  body.innerHTML = S.ai.length
    ? S.ai.map(m => `<div class="ai-msg ${m.r}">${m.r === 'me' ? esc(m.h) : m.h}</div>`).join('')
    : `<div class="ai-empty"><h2>Tôi có thể giúp gì, <span>${esc(person(S.me).name.split(' ').pop())}?</span></h2>
        <p>Hỏi về tiến độ, nhân công, dòng tiền, khách hàng, bóc tách hay quy trình — trợ lý đọc trực tiếp dữ liệu trong workspace.</p>
        <div class="ai-chips">${AI_CHIPS.map(([i, c, l, q]) => `<button class="chip" style="--c:${cv(c)}" data-act="ai-ask" data-q="${esc(q)}">${ic(i, 14)}${l}</button>`).join('')}</div></div>`;
  body.scrollTop = body.scrollHeight;
  $('#aiSugg').innerHTML = AI_SUGG.map(q => `<button class="sugg" data-act="ai-ask" data-q="${esc(q)}">${esc(q)}</button>`).join('');
}
function aiAnswer(q){
  const s = q.toLowerCase();
  for (const r of AI){ if (r.re.test(s)){ let out = ''; try { out = r.fn(q, s); } catch (e) { out = 'Chưa đủ dữ liệu để trả lời câu này.'; } if (out) return out; } }
  return 'Tôi trả lời được về: <b>tiến độ & việc trễ</b>, <b>nhân công hôm nay</b>, <b>dòng tiền & hoá đơn quá hạn</b>, <b>pipeline khách hàng</b>, <b>bóc tách QS</b>, <b>điểm thưởng</b>, <b>tin chưa đọc</b>, <b>nội quy / quy trình</b>. Gõ <i>Tạo công việc: …</i> để thêm việc vào tiến độ dự án đang chọn.';
}
function aiAsk(q){
  q = q.trim(); if (!q) return;
  S.ai.push({r:'me', h:q}, {r:'bot', h:aiAnswer(q)});
  S.ai = S.ai.slice(-30);
  $('#aiQ').value = ''; renderAi(); render();
}

/* ============ sự kiện ============ */
let armed = null, resetArmed = false;
Object.assign(ACT, {
  nav:(el, d) => nav(d.v, d.sub),
  sub:(el, d) => { S.sub[d.view === 'projects' ? 'pm' : d.view] = d.k; render(); },
  'rail-toggle':() => { ui.railOpen = !ui.railOpen; $('#frame').classList.toggle('rail-open', ui.railOpen); try { localStorage.setItem('sf-rail-open', ui.railOpen ? '1' : ''); } catch (e) {} renderRail(); },
  'tab-close':(el, d) => { S.tabs = S.tabs.filter(v => v !== d.v); if (S.view === d.v) S.view = S.tabs[S.tabs.length - 1]; render(); },
  palette:() => openPalette(),
  pal:(el, d) => { const it = ui.palItems[+d.i]; closeModal(); it && it.run(); },
  notif:() => { ui.notif = !ui.notif; if (ui.notif) S.seenAct = S.activity.length; renderTop(); save(); },
  'ai-toggle':() => {
    const f = $('#frame');
    if (innerWidth <= 1180){ f.classList.toggle('ai-open'); if (f.classList.contains('ai-open')) setTimeout(() => $('#aiQ').focus(), 250); }
    else { f.classList.toggle('ai-hidden'); try { localStorage.setItem('sf-ai-hidden', f.classList.contains('ai-hidden') ? '1' : ''); } catch (e) {} }
  },
  'ai-clear':() => { S.ai = []; renderAi(); save(); },
  'ai-ask':(el, d) => aiAsk(d.q),
  'ai-fill':(el, d) => { $('#aiQ').value = d.q; $('#aiQ').focus(); },
  theme:() => {
    const dark = getComputedStyle(document.documentElement).colorScheme.includes('dark');
    document.documentElement.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('sf-theme', document.documentElement.dataset.theme); } catch (e) {}
  },
  reset:() => {
    if (!resetArmed){ resetArmed = true; toast('Bấm lần nữa để khôi phục toàn bộ dữ liệu mẫu'); setTimeout(() => resetArmed = false, 3000); return; }
    resetArmed = false; S = seed(); render(); renderAi(); toast('Đã khôi phục dữ liệu mẫu');
  },
  'modal-close':() => closeModal(),
  me:() => { if (LIVE) LIVE.profileModal(); else toast('Chế độ demo — dữ liệu mẫu lưu trong trình duyệt này'); },
  del:(el, d) => {
    if (armed !== el){ armed = el; el.textContent = 'Bấm lần nữa để xóa'; return; }
    armed = null; const f = el.closest('form, .modal');
    DEL[d.kind](f.dataset.id, f); closeModal(); render(); toast('Đã xóa');
  }
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (ui.notif && !e.target.closest('.pop') && !(el && el.dataset.act === 'notif')){ ui.notif = false; renderTop(); }
  if (!el || el.tagName === 'SELECT' || (el.tagName === 'INPUT' && el.type !== 'checkbox' && el.type !== 'button')) return;
  const fn = ACT[el.dataset.act];
  if (fn){ if (el.tagName === 'A') e.preventDefault(); fn(el, el.dataset, e); }
});
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('submit', e => {
  const f = e.target;
  if (f.id === 'aiForm'){ e.preventDefault(); aiAsk($('#aiQ').value); return; }
  const fn = FORM[f.dataset.form]; if (!fn) return;
  e.preventDefault();
  const v = {};
  new FormData(f).forEach((val, k) => { if (k in v){ v[k] = [].concat(v[k], val); } else v[k] = val; });
  fn(v, f);
});
document.addEventListener('input', e => { const n = e.target.dataset && e.target.dataset.input; if (n && INP[n]) INP[n](e.target, e); });
document.addEventListener('change', e => { const n = e.target.dataset && e.target.dataset.change; if (n && CHG[n]) CHG[n](e.target, e); });
CHG.pid = el => { S.pid = el.value; render(); };
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); openPalette(); return; }
  if (e.key === 'Escape'){
    if (!$('#modal').hidden) closeModal();
    else if (ui.notif){ ui.notif = false; renderTop(); }
    else $('#frame').classList.remove('ai-open');
  }
  if (e.key === 'Enter' && e.target.id === 'palQ'){ const it = ui.palItems[0]; if (it){ closeModal(); it.run(); } }
  if (e.key === 'Enter' && e.target.id === 'aiQ' && !e.shiftKey){ e.preventDefault(); aiAsk(e.target.value); }
  if (e.key === 'Enter' && e.target.matches && e.target.matches('tr[data-act]')) e.target.click();
});
/* kéo thả */
document.addEventListener('dragstart', e => {
  const c = e.target.closest && e.target.closest('[data-drag]'); if (!c) return;
  e.dataTransfer.setData('text/plain', c.dataset.drag); e.dataTransfer.effectAllowed = 'move'; c.classList.add('dragging');
});
document.addEventListener('dragend', e => { const c = e.target.closest && e.target.closest('[data-drag]'); if (c) c.classList.remove('dragging'); document.querySelectorAll('.over').forEach(x => x.classList.remove('over')); });
document.addEventListener('dragover', e => { const col = e.target.closest && e.target.closest('[data-drop]'); if (col){ e.preventDefault(); col.classList.add('over'); } });
document.addEventListener('dragleave', e => { const col = e.target.closest && e.target.closest('[data-drop]'); if (col && !col.contains(e.relatedTarget)) col.classList.remove('over'); });
document.addEventListener('drop', e => {
  const col = e.target.closest && e.target.closest('[data-drop]'); if (!col) return;
  e.preventDefault(); col.classList.remove('over');
  const [kind, id] = e.dataTransfer.getData('text/plain').split(':'), [ck, target] = col.dataset.drop.split(':');
  if (kind === ck && DROP[kind]) DROP[kind](id, target);
  render();
});

/* ============ ứng dụng nhúng ============ */
// Mỗi ứng dụng giữ một iframe sống suốt phiên: chuyển tab không làm mất trạng thái / đăng nhập bên trong.
function showApps(){
  const box = $('#apps'), cur = isApp(S.view) ? appOf(S.view) : null;
  $('#view').hidden = !!cur; box.hidden = !cur;
  box.querySelectorAll('.app-frame').forEach(f => { if (!S.apps.some(a => a.id === f.dataset.id)) f.remove(); else f.hidden = !cur || f.dataset.id !== cur.id; });
  if (!cur) return;
  let f = box.querySelector(`.app-frame[data-id="${cur.id}"]`);
  if (f && f.dataset.url !== cur.url){ f.remove(); f = null; }
  if (!f){
    f = document.createElement('div'); f.className = 'app-frame'; f.dataset.id = cur.id; f.dataset.url = cur.url;
    f.innerHTML = `<div class="app-loading"><div class="spin"></div><b>Đang mở ${esc(cur.name)}…</b><span>Máy chủ miễn phí có thể mất tới ~50 giây để khởi động lần đầu.</span><a class="btn line sm" href="${esc(cur.url)}" target="_blank" rel="noopener">${ic('external', 14)}Mở trong trình duyệt</a></div>
      <iframe title="${esc(cur.name)}" src="${esc(cur.url)}" allow="clipboard-read; clipboard-write; fullscreen; downloads" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    f.querySelector('iframe').addEventListener('load', () => f.classList.add('ready'));
    box.appendChild(f);
  }
}
Object.assign(ACT, {
  'app-reload':() => { const f = $(`#apps .app-frame[data-id="${appOf(S.view).id}"]`); if (f){ f.classList.remove('ready'); const i = f.querySelector('iframe'); i.src = appOf(S.view).url; } },
  'app-new':() => appModal(null),
  'app-edit':(el, d) => appModal(S.apps.find(a => a.id === d.id))
});
function appModal(a){
  const x = a || {id:'', name:'', desc:'', url:'https://', icon:'grid', c:'blue'};
  showModal(`<form class="modal" data-form="app" data-id="${x.id}">
    <h3>${a ? 'Sửa ứng dụng' : 'Thêm ứng dụng web'}${closeBtn()}</h3>
    <div class="sub">Giống mục ứng dụng trong Lark: link web mở ngay bên trong workspace, có nút mở ra trình duyệt khi cần.</div>
    <div class="row2"><label class="field">Tên hiển thị<input id="ap-name" name="name" required value="${esc(x.name)}" placeholder="VD: QS Pro"></label>
      <label class="field">Mô tả ngắn<input id="ap-desc" name="desc" value="${esc(x.desc || '')}"></label></div>
    <label class="field">Đường dẫn (https://…)<input id="ap-url" name="url" type="url" required pattern="https://.+" value="${esc(x.url)}"></label>
    <div class="field">Biểu tượng<div class="chips">${APP_ICONS.map(i => `<label class="fchip sm" style="cursor:pointer"><input type="radio" name="icon" value="${i}" ${i === x.icon ? 'checked' : ''} style="accent-color:var(--purple)">${ic(i, 15)}</label>`).join('')}</div></div>
    <div class="field">Màu<div class="chips">${['orange','blue','purple','green','yellow','pink','brown'].map(c => `<label class="fchip sm" style="cursor:pointer"><input type="radio" name="c" value="${c}" ${c === x.c ? 'checked' : ''} style="accent-color:${cv(c)}"><span class="dot" style="--c:${cv(c)}"></span></label>`).join('')}</div></div>
    <div class="small muted">Lưu ý: một số trang (Google, Facebook, ngân hàng…) chặn việc nhúng — khi đó dùng nút “Mở trong trình duyệt”.</div>
    <div class="m-actions">${a ? delBtn('app') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">${a ? 'Lưu' : 'Thêm vào menu'}</button></div>
  </form>`);
}
FORM.app = (v, f) => {
  let a = S.apps.find(x => x.id === f.dataset.id);
  const data = {name:v.name.trim(), desc:v.desc.trim(), url:v.url.trim(), icon:v.icon || 'grid', c:v.c || 'blue'};
  if (a) Object.assign(a, data); else { a = {id:uid(), ...data}; S.apps.push(a); }
  closeModal(); log('Ứng dụng: ' + a.name, 'blue'); nav('app-' + a.id); toast('Đã lưu ứng dụng ' + a.name);
};
DEL.app = id => { S.apps = S.apps.filter(a => a.id !== id); S.tabs = S.tabs.filter(t => t !== 'app-' + id); if (S.view === 'app-' + id) S.view = 'dash'; };

/* ============ khởi động ============ */
function boot(){
  try { const th = localStorage.getItem('sf-theme'); if (th) document.documentElement.dataset.theme = th; } catch (e) {}
  try { if (localStorage.getItem('sf-ai-hidden')) $('#frame').classList.add('ai-hidden'); } catch (e) {}
  try { ui.railOpen = !!localStorage.getItem('sf-rail-open'); } catch (e) {}
  $('#frame').classList.toggle('rail-open', !!ui.railOpen);
  $('.ai-close').innerHTML = ic('x');
  $('#aiTools').innerHTML = [['gantt', 'Việc nào đang trễ tiến độ?', 'Hỏi việc trễ'], ['wallet', 'Dòng tiền 4 tuần tới thế nào?', 'Hỏi dòng tiền'], ['userclock', 'Nhân công hôm nay?', 'Hỏi nhân công']]
    .map(([i, q, l]) => `<button type="button" class="round" data-act="ai-fill" data-q="${esc(q)}" title="${l}" aria-label="${l}">${ic(i, 16)}</button>`).join('') + '<button class="send" type="submit">Gửi</button>';
  if (window.SF_CONFIG && window.supabase && typeof liveBoot === 'function') return liveBoot();
  load(); render(); renderAi();
}
