/* Dezon Workspace — Chat (giống Lark): danh sách hội thoại, luồng tin, bảng thông tin. Dữ liệu chat KHÔNG đi qua syncCol (live.js lo bảng chat). */

/* ================= dữ liệu mẫu ================= */
SEEDS.push(s => {
  const at = (t, off = 0) => { const d = today0(); d.setDate(d.getDate() + off); const [h, m] = t.split(':').map(Number); d.setHours(h, m, 0, 0); return d.getTime(); };
  const G = (id, name, icon, c, members, extra = {}) => ({id, type:'group', name, sub:'Nhóm', icon, c, members, files:[], ...extra});
  const D = (id, user, extra = {}) => ({id, type:'dm', user, name:'', sub:'', icon:null, c:'gray', members:[user, 'ta'], files:[], ...extra});
  s.convs = [
    G('g-riverside', 'Riverside — Giai đoạn 2', 'building', 'blue', ['da', 'nh', 'hoa', 'lv', 'ta'], {pid:'riverside', size:24,
      files:[{name:'Bao_cao_tien_do_T9.xlsx', size:'860 KB'}],
      links:[{title:'Bản vẽ kết cấu tầng 2 — Google Drive', url:'https://drive.google.com/'}, {title:'Báo giá vật tư thép Hoà Phát T9/2026', url:'https://hoaphat.com.vn/'}]}),
    {id:'bot', type:'bot', name:'Dezbot', sub:'Thông báo hệ thống', icon:'bot', c:'gray', members:[], files:[]},
    D('dm-nh', 'nh', {online:true}),
    D('dm-bn', 'bn'),
    G('g-bch', 'Ban chỉ huy công trường', 'hardhat', 'green', ['da', 'tl', 'ta'], {size:8}),
    D('dm-lv', 'lv'),
    G('g-doib', 'Đội thi công B', 'hardhat', 'yellow', ['nh', 'vn'], {size:12})
  ];
  const M = (cv, from, text, t, extra = {}) => ({id:uid(), cv, from, by:from, text, t, file:null, bot:null, ...extra});
  const B = (cv, level, title, text, meta, t, go, subk) => M(cv, 'bot', text, t, {bot:{level, title, meta, go, sub:subk || ''}});
  s.msgs = [
    M('g-riverside', 'da', 'Chào cả nhà, hôm nay mình tập trung đổ bê tông đài móng khu B nhé', at('08:02')),
    M('g-riverside', 'da', 'Đội thi công B chuẩn bị vật tư từ 7h sáng giúp anh', at('08:03')),
    M('g-riverside', 'nh', 'Dạ anh, bên em đã sẵn sàng vật tư từ hôm qua rồi ạ', at('08:15')),
    B('g-riverside', 'red', 'Cảnh báo tiến độ', 'Đổ bê tông sàn tầng 5 đang trễ 3 ngày so với kế hoạch (đường găng).', 'Module Tiến độ', at('09:40'), 'pm', 'gantt'),
    M('g-riverside', 'hoa', 'Em đã cập nhật bản vẽ điện tầng 2, mọi người xem giúp em ạ', at('10:22'), {file:{name:'Ban_ve_dien_tang2.pdf', size:'2,4 MB', type:'application/pdf'}}),
    M('g-riverside', 'ta', 'Ok em, để anh xem qua rồi phản hồi trong chiều nay', at('10:25')),
    M('g-riverside', 'ta', 'Anh Đức Anh cho hỏi tiến độ móng khu B đến chiều nay khoảng bao nhiêu % rồi ạ?', at('10:26')),
    M('g-riverside', 'da', 'Đang khoảng 45% anh ơi, chắc mai xong', at('10:31')),
    B('bot', 'red', 'Cảnh báo tiến độ', 'Đổ bê tông sàn tầng 5 đang trễ 3 ngày so với kế hoạch (đường găng).', 'Dự án: Riverside — Giai đoạn 2', at('09:40'), 'pm', 'gantt'),
    B('bot', 'yellow', 'Chấm công ngoài vùng', '1 nhân sự chấm công ngoài bán kính công trường tại Kho vật tư Bình Chánh, cần giám sát duyệt.', 'Module Chấm công', at('11:05'), 'att'),
    B('bot', 'red', 'Hoá đơn quá hạn', 'Hoá đơn INV-0142 (620 triệu đ) của Khách hàng ABC đã quá hạn thanh toán 5 ngày.', 'Module Tài chính', at('13:20'), 'fin'),
    B('bot', 'blue', 'Mốc nghiệm thu sắp tới', 'Còn 7 ngày đến mốc "Nghiệm thu bàn giao tầng 1" (' + fmtDate(md('2026-09-28')) + ').', 'Module Tiến độ', at('14:00'), 'pm', 'gantt'),
    M('dm-nh', 'nh', 'Anh ơi vật tư thép đợt 2 chắc tuần sau mới về kịp ạ', at('16:40', -1)),
    M('dm-nh', 'ta', 'Ok em cứ báo bên mua hàng đẩy nhanh giúp anh', at('16:52', -1)),
    M('dm-nh', 'nh', 'Dạ em báo cáo, tiến độ sàn tầng 4 hiện đang 45% ạ', at('09:50')),
    M('dm-nh', 'nh', 'Em xin thêm 2 ngày vì chờ vật tư anh nhé', at('09:51')),
    M('dm-bn', 'bn', 'Anh ơi hoá đơn INV-0142 bên khách hàng ABC vẫn chưa thanh toán ạ', at('11:02')),
    M('dm-bn', 'bn', 'Đã quá hạn 5 ngày rồi, anh nhắc giúp em với', at('11:03')),
    M('g-bch', 'da', 'Họp giao ban 8h sáng mai tại văn phòng công trường nhé mọi người', at('17:30', -1)),
    M('g-bch', 'tl', 'Rõ anh, em chuẩn bị báo cáo giám sát', at('17:42', -1)),
    M('dm-lv', 'ta', 'Móng đài cọc xong chưa em?', at('15:05', -1)),
    M('dm-lv', 'lv', 'Vâng anh, móng đã xong 100% rồi ạ', at('15:20', -1)),
    M('g-doib', 'vn', 'Vật tư về rồi mọi người ơi, ra bốc dỡ giúp', at('16:10', -1))
  ].sort((a, b) => a.t - b.t);
  // chưa đọc mẫu: nhóm Riverside 3, Dezbot 2, Phan Bảo Ngọc 1 (= 6 trên menu)
  const unread = {'g-riverside':3, bot:2, 'dm-bn':1};
  s.read = {};
  s.convs.forEach(c => s.read[c.id] = s.msgs.filter(m => m.cv === c.id).length - (unread[c.id] || 0));
  s.cv = 'g-riverside';
});

/* ================= hàm tích hợp (theo hợp đồng) ================= */
const convMsgs = id => (S.msgs || []).filter(m => m.cv === id);
const convUnread = id => LIVE ? LIVE.unread(id) : Math.max(0, convMsgs(id).length - ((S.read || {})[id] || 0));
function chatUnreadTotal(){ return S && S.convs ? sum(S.convs, c => convUnread(c.id)) : 0; }
const fmtSize = bytes => { bytes = +bytes || 0; if (bytes < 1024) return bytes + ' B'; const kb = bytes / 1024; return kb < 1024 ? Math.round(kb) + ' KB' : dec(kb / 1024, 1) + ' MB'; };
const CHAT_LV = {red:'red', danger:'red', yellow:'yellow', amber:'yellow', blue:'blue', info:'blue', green:'green'};
function botPost(title, text, level = 'blue', meta = '', go = '', goSub = '', alsoConvId){
  level = CHAT_LV[level] || 'blue';
  if (LIVE) return LIVE.postBot(title, text, level, meta, go, goSub, alsoConvId);
  if (!S.convs) return;
  const m = {id:uid(), cv:'bot', from:'bot', by:'bot', text, t:Date.now(), file:null, bot:{level, title, meta, go, sub:goSub}};
  if (S.convs.some(c => c.id === 'bot')) S.msgs.push(m);
  const pc = alsoConvId && S.convs.find(c => c.id === alsoConvId || (c.pid && 'g-' + c.pid === alsoConvId));
  if (pc && pc.id !== 'bot') S.msgs.push({...m, id:uid(), cv:pc.id});
}
const CHAT_REPLIES = ['Dạ em nhận rồi ạ.', 'Ok anh, em xử lý trong hôm nay.', 'Em kiểm tra lại rồi báo anh trong 30 phút nhé.', 'Dạ, em cập nhật lên tiến độ luôn ạ.'];
function sendChat(extra, fileObj){
  if (LIVE) return LIVE.send(S.cv, extra, fileObj);
  const c = S.convs.find(x => x.id === S.cv); if (!c) return;
  S.msgs.push({id:uid(), cv:c.id, from:S.me, by:S.me, t:Date.now(), text:'', file:null, bot:null, ...extra});
  S.read[c.id] = convMsgs(c.id).length;
  render(); const i = $('#chatIn'); if (i) i.focus();
  // demo: người nhắn riêng tự trả lời
  const replier = c.type === 'dm' ? c.user : null;
  if (!replier) return;
  const cvId = c.id;
  setTimeout(() => { ui.typing = {cv:cvId, user:replier}; const tp = $('#typing'); if (tp && S.cv === cvId && S.view === 'chat') tp.textContent = person(replier).name + ' đang nhập...'; }, 700);
  setTimeout(() => {
    ui.typing = null;
    S.msgs.push({id:uid(), cv:cvId, from:replier, by:replier, text:CHAT_REPLIES[Math.floor(Math.random() * CHAT_REPLIES.length)], t:Date.now(), file:null, bot:null});
    log(person(replier).name + ' đã trả lời bạn', 'purple');
    if (S.view === 'chat' && $('#modal').hidden) render(); else { renderRail(); renderTop(); save(); }
  }, 2300);
}

/* ================= helpers ================= */
const chatName = c => c.type === 'dm' ? person(c.user).name : c.type === 'bot' ? (c.name || 'Dezbot') : c.name;
const chatSub = c => {
  if (c.type === 'dm'){ const p = person(c.user); return [p.role, p.team].filter(Boolean).join(' · ') + (c.online ? ' · đang hoạt động' : ''); }
  if (c.type === 'group') return (c.size || c.members.length) + ' thành viên' + (c.pid ? ' · Nhóm dự án' : '');
  return c.sub || 'Thông báo hệ thống';
};
const chatIcon = (c, s = 36) => c.type === 'dm'
  ? `<span class="cx-av">${av(c.user, s)}${c.online ? '<i class="cx-on"></i>' : ''}</span>`
  : `<span class="sq" style="--c:${cv(c.c || 'gray')};--t:${ct(c.c || 'gray')};width:${s}px;height:${s}px">${ic(c.icon || 'users', Math.round(s / 2))}</span>`;
const chatLast = id => convMsgs(id).slice(-1)[0];
const chatWhen = t => daysLeft(iso(new Date(t))) === 0 ? hm(t) : relDay(iso(new Date(t)));
const chatIsImg = f => !!f && /^image\//.test(f.type || '');
const CHAT_IMG_IC = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>';
const CHAT_URL = /https?:\/\/[^\s<>"']+/g;
function chatPreview(c, m){
  if (!m) return 'Chưa có tin nhắn';
  if (m.deleted) return 'Tin nhắn đã được thu hồi';
  if (m.bot) return m.bot.title + ': ' + m.text;
  const body = m.text || (m.file ? (chatIsImg(m.file) ? '[Hình ảnh] ' : '📎 ') + m.file.name : '');
  return (m.from === S.me ? 'Bạn: ' : c.type === 'group' ? person(m.from).name.split(' ').pop() + ': ' : '') + body;
}
// văn bản → HTML an toàn, link http(s) bấm được
function chatText(t, q){
  let out = '', i = 0;
  const mark = s => { s = esc(s); if (!q) return s; const k = esc(q); return s.split(k).join(`<mark>${k}</mark>`); };
  String(t || '').replace(CHAT_URL, (u, pos) => { out += mark(t.slice(i, pos)) + `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>`; i = pos + u.length; return u; });
  return out + mark(String(t || '').slice(i));
}
const chatDomain = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } };
// tệp, ảnh, link đã chia sẻ — suy ra từ tin nhắn (+ danh sách mẫu của hội thoại)
function chatShared(c){
  const ms = convMsgs(c.id).filter(m => !m.deleted && !m.bot);
  const imgs = ms.filter(m => chatIsImg(m.file)).map(m => ({m, f:m.file}));
  const files = (c.files || []).concat(ms.filter(m => m.file && !chatIsImg(m.file)).map(m => ({...m.file, _m:m})));
  const seenF = new Set(); const fl = files.filter(f => { const k = f.path || f.name; if (seenF.has(k)) return false; seenF.add(k); return true; });
  const links = (c.links || []).map(l => ({title:l.title, url:l.url})), seenL = new Set(links.map(l => l.url));
  ms.forEach(m => (String(m.text || '').match(CHAT_URL) || []).forEach(u => { if (!seenL.has(u)){ seenL.add(u); links.push({title:u, url:u}); } }));
  return {imgs, files:fl, links};
}
function chatFileHtml(f, own){
  if (!f) return '';
  if (f.path){
    const img = chatIsImg(f) ? `<img class="chat-img" data-path="${esc(f.path)}" alt="${esc(f.name)}" data-act="chat-file" data-path2="${esc(f.path)}">` : '';
    return img + (chatIsImg(f) ? '' : `<button class="file" data-act="chat-file" data-path="${esc(f.path)}">${ic('file', 18)}<span>${esc(f.name)}<small>${esc(f.size)} · bấm để mở</small></span></button>`);
  }
  if (chatIsImg(f) && f.url) return `<img class="chat-img" src="${esc(f.url)}" alt="Ảnh đã gửi" data-act="chat-img" data-src="${esc(f.url)}">`;
  return `<div class="file">${ic('file', 18)}<span>${esc(f.name)}<small>${esc(f.size || '')}</small></span></div>`;
}

/* ================= trang ================= */
MOD.chat = () => {
  if (!S.convs) S.convs = []; if (!S.msgs) S.msgs = []; if (!S.read) S.read = {};
  const c = S.convs.find(x => x.id === S.cv) || S.convs[0];
  if (!c) return head('Chat', '') + emptyBox(LIVE ? 'Đang tải hội thoại…' : 'Chưa có hội thoại', LIVE ? 'Nếu lâu không thấy, hãy tải lại trang.' : 'Bấm “Khôi phục dữ liệu mẫu” để có hội thoại mẫu.');
  S.cv = c.id;
  if (LIVE) LIVE.markRead(c.id); else S.read[c.id] = convMsgs(c.id).length;
  const tab = ui.chatTab || 'all', q = (ui.chatQ || '').trim().toLowerCase();
  const lastT = x => (chatLast(x.id) || {t:0}).t;
  const items = S.convs.filter(x => (tab === 'all' || (tab === 'group' && x.type === 'group') || (tab === 'unread' && (convUnread(x.id) || x.id === c.id)))
      && (!q || chatName(x).toLowerCase().includes(q)))
    .sort((a, b) => lastT(b) - lastT(a));
  const list = items.map(x => {
    const last = chatLast(x.id), n = convUnread(x.id);
    return `<button class="conv ${x.id === c.id ? 'on' : ''} ${n ? 'unread' : ''}" data-act="cv" data-id="${esc(x.id)}">${chatIcon(x)}<span class="meta"><b><span class="ell">${esc(chatName(x))}</span><span>${last ? chatWhen(last.t) : ''}</span></b><small><span class="ell">${esc(chatPreview(x, last))}</span>${n ? `<span class="n">${n}</span>` : ''}</small></span></button>`;
  }).join('') || '<div class="empty">Không có hội thoại</div>';
  const total = chatUnreadTotal();

  // tin nhắn
  const fq = ui.chatFind && ui.chatFind.cv === c.id ? ui.chatFind.q.trim().toLowerCase() : '';
  let lastDay = '', prev = null;
  const all = convMsgs(c.id);
  const shown = fq ? all.filter(m => (m.text || '').toLowerCase().includes(fq) || (m.file && m.file.name.toLowerCase().includes(fq))) : all;
  const msgs = shown.map(m => {
    const day = iso(new Date(m.t)); let sep = '';
    if (day !== lastDay){ lastDay = day; prev = null; sep = `<div class="day-sep">${relDay(day)}</div>`; }
    if (m.bot){
      prev = null;
      const col = CHAT_LV[m.bot.level] || 'blue', icn = col === 'blue' ? 'info' : col === 'green' ? 'check' : 'alert';
      return sep + `<div class="botmsg" style="--c:${cv(col)};--t:${ct(col)}"><b>${ic(icn, 15)}${esc(m.bot.title)}</b><p>${chatText(m.text, fq)}</p><small><span>Dezbot · ${esc(m.bot.meta || '')} · ${hm(m.t)}</span>${m.bot.go && VIEWS[m.bot.go] ? `<button class="link" data-act="nav" data-v="${esc(m.bot.go)}" ${m.bot.sub ? `data-sub="${esc(m.bot.sub)}"` : ''}>Xem chi tiết ›</button>` : ''}</small></div>`;
    }
    const me = m.from === S.me;
    const cont = prev && prev.from === m.from && m.t - prev.t < 10 * 6e4;
    prev = m;
    const body = m.deleted ? '<i class="muted">Tin nhắn đã được thu hồi</i>' : chatText(m.text, fq) + (m.edited ? ' <small class="muted">(đã sửa)</small>' : '');
    const file = m.deleted ? '' : chatFileHtml(m.file, me);
    const tools = LIVE && me && !m.deleted && !m.pending && Date.now() - m.t < 24 * 36e5 ? ` · <button class="link" data-act="msg-recall" data-id="${esc(m.id)}">Thu hồi</button>` : '';
    const name = !me && !cont && c.type !== 'dm' ? `<div class="meta">${esc(person(m.from).name)}</div>` : '';
    const bubble = (m.text || m.deleted) ? `<div class="bubble">${body}</div>` : '';
    return sep + `<div class="msg ${me ? 'me' : ''} ${cont ? 'cont' : ''}">${me ? '' : cont ? '<span class="cx-sp"></span>' : av(m.from, 30)}<div class="cx-body">${name}${bubble}${file}<div class="cx-time">${hm(m.t)}${m.pending ? ' · đang gửi…' : ''}${tools}</div></div></div>`;
  }).join('');

  // bảng thông tin
  const info = ui.chatInfo !== false;
  const sh = chatShared(c);
  let panel = '';
  if (info){
    panel += `<div class="cx-hero">${chatIcon(c, 64)}<b>${esc(chatName(c))}</b><small>${esc(chatSub(c))}</small></div>`;
    if (c.type === 'group'){
      panel += `<h4>Thành viên (${c.members.length}${c.size && c.size !== c.members.length ? ' / ' + c.size : ''})</h4>`;
      if (LIVE) panel += `<div class="row"><button class="btn line sm" data-act="conv-add" data-id="${esc(c.id)}">${ic('plus', 13)}Thêm người</button>${LIVE.fixed(c.id) ? '' : `<button class="btn ghost sm" data-act="conv-leave" data-id="${esc(c.id)}">Rời nhóm</button>`}</div>`;
      panel += c.members.map(id => `<div class="who">${av(id, 30)}<span class="ell"><b style="font-weight:500;font-size:13px">${esc(person(id).name)}${id === S.me ? ' (bạn)' : ''}</b><small>${esc([person(id).role, person(id).team].filter(Boolean).join(' · '))}</small></span></div>`).join('');
    }
    if (c.type === 'dm'){
      const common = S.convs.filter(g => g.type === 'group' && g.members.includes(c.user));
      panel += `<h4>Nhóm chung (${common.length})</h4>` + (common.map(g => `<button class="li cx-li" data-act="cv" data-id="${esc(g.id)}">${chatIcon(g, 30)}<span class="ell"><b>${esc(g.name)}</b><small>${esc(chatSub(g))}</small></span></button>`).join('') || '<div class="small muted">Chưa có nhóm chung</div>');
    }
    if (c.type !== 'bot'){
      panel += `<div class="cx-count"><span title="Ảnh & video"><b>${sh.imgs.length}</b>Ảnh/Video</span><span title="Tệp"><b>${sh.files.length}</b>File</span><span title="Liên kết"><b>${sh.links.length}</b>Link</span></div>`;
      panel += `<h4>Ảnh & video đã gửi</h4>` + (sh.imgs.length ? `<div class="cx-media">${sh.imgs.map(({f}) => f.path ? `<img class="chat-img" data-path="${esc(f.path)}" alt="${esc(f.name)}" data-act="chat-file" data-path2="${esc(f.path)}">` : f.url ? `<img src="${esc(f.url)}" alt="${esc(f.name)}" data-act="chat-img" data-src="${esc(f.url)}">` : '').join('')}</div>` : '<div class="small muted">Chưa có ảnh</div>');
      panel += `<h4>Tệp đã chia sẻ</h4>` + (sh.files.map(f => f.path ? `<button class="file" data-act="chat-file" data-path="${esc(f.path)}" style="margin:0">${ic('file', 18)}<span class="ell">${esc(f.name)}<small>${esc(f.size || '')}</small></span></button>` : `<div class="file" style="margin:0">${ic('file', 18)}<span class="ell">${esc(f.name)}<small>${esc(f.size || '')}</small></span></div>`).join('') || '<div class="small muted">Chưa có tệp</div>');
      panel += `<h4>Liên kết đã chia sẻ</h4>` + (sh.links.map(l => `<a class="file cx-link" href="${esc(l.url)}" target="_blank" rel="noopener" style="margin:0">${ic('external', 16)}<span class="ell">${esc(l.title)}<small>${esc(chatDomain(l.url))}</small></span></a>`).join('') || '<div class="small muted">Chưa có liên kết</div>');
    }
  }

  const att = ui.chatAtt && ui.chatAtt.cv === c.id ? ui.chatAtt : null;
  const draft = (ui.chatDraft || {})[c.id] || '';
  const typing = ui.typing && ui.typing.cv === c.id ? esc(person(ui.typing.user).name) + ' đang nhập...' : '';
  return head('Chat', 'Nhóm theo dự án, tin nhắn riêng và cảnh báo tự động từ các module.') + `
    <div class="chat ${info ? 'info' : ''}">
      <div class="chat-side">
        <div class="top">
          <div class="row"><div class="search" style="flex:1">${ic('search', 15)}<input id="chat-q" data-input="chat-q" value="${esc(ui.chatQ || '')}" placeholder="Tìm cuộc trò chuyện..." aria-label="Tìm cuộc trò chuyện"></div>
            <button class="icon-btn" data-act="${LIVE ? 'conv-new' : 'chat-new'}" title="Soạn tin nhắn mới" aria-label="Soạn tin nhắn mới" style="border:1px solid var(--line)">${ic('plus')}</button></div>
          ${LIVE && LIVE.canNotify() ? `<button class="btn line sm" data-act="notify-on">${ic('bell', 14)}Bật thông báo tin nhắn mới</button>` : ''}
          <div class="seg">${[['all', 'Tất cả'], ['group', 'Nhóm'], ['unread', 'Chưa đọc']].map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" data-act="chat-tab" data-f="${k}">${l}${k === 'unread' && total ? `<span class="cnt">${total}</span>` : ''}</button>`).join('')}</div>
        </div>
        <div class="conv-list">${list}</div>
      </div>
      <div class="thread">
        <div class="th-head">${chatIcon(c, 36)}<div class="ell" style="flex:1"><b>${esc(chatName(c))}</b><small>${esc(chatSub(c))}</small></div>
          <button class="icon-btn" data-act="chat-find" aria-label="Tìm trong hội thoại" title="Tìm trong hội thoại">${ic('search')}</button>
          <button class="icon-btn" data-act="chat-info" aria-label="Thông tin hội thoại" title="${c.type === 'group' ? 'Thành viên nhóm' : 'Thông tin'}">${ic(c.type === 'group' ? 'users' : 'panel')}</button></div>
        ${ui.chatFind && ui.chatFind.cv === c.id ? `<div class="cx-find"><div class="search" style="flex:1">${ic('search', 15)}<input id="chat-find" data-input="chat-find" value="${esc(ui.chatFind.q)}" placeholder="Tìm trong hội thoại" aria-label="Tìm trong hội thoại"></div><span class="small muted">${fq ? shown.length + ' kết quả' : ''}</span><button class="icon-btn sm" data-act="chat-find" aria-label="Đóng tìm kiếm">${ic('x', 14)}</button></div>` : ''}
        <div class="msgs" id="msgs">${msgs || `<div class="empty">${fq ? 'Không có tin nhắn khớp' : 'Chưa có tin nhắn. Gửi lời chào đầu tiên!'}</div>`}</div>
        <div class="typing" id="typing">${typing}</div>
        ${c.type === 'bot' ? '<div class="foot-note" style="text-align:center">Kênh thông báo tự động — không nhận tin nhắn.</div>' : `<form class="composer cx-comp" data-form="chat">
          ${att ? `<div class="cx-att">${att.isImg ? `<img src="${esc(att.preview)}" alt="">` : ic('file', 20)}<span class="ell"><b>${esc(att.name)}</b><small>${esc(att.size)}</small></span><button type="button" class="icon-btn sm" data-act="chat-att-x" aria-label="Bỏ tệp đính kèm">${ic('x', 14)}</button></div>` : ''}
          <label class="icon-btn" title="Đính kèm tệp" aria-label="Đính kèm tệp" style="cursor:pointer">${ic('clip')}<input type="file" data-change="chat-att" hidden></label>
          <label class="icon-btn" title="Hình ảnh" aria-label="Gửi hình ảnh" style="cursor:pointer">${CHAT_IMG_IC}<input type="file" accept="image/*" data-change="chat-att" hidden></label>
          <button type="button" class="icon-btn" data-act="chat-at" title="Nhắc đến" aria-label="Nhắc đến">@</button>
          <textarea id="chatIn" name="text" rows="1" data-input="chat-draft" placeholder="Nhập tin nhắn... (Enter để gửi)" aria-label="Nội dung tin nhắn">${esc(draft)}</textarea>
          <button class="send" type="submit" style="margin-left:0" title="Gửi">Gửi</button></form>`}
      </div>
      ${info ? `<div class="chat-info">${panel}</div>` : ''}
    </div>`;
};
function chatGrow(){ const t = $('#chatIn'); if (t){ t.style.height = 'auto'; t.style.height = Math.min(120, t.scrollHeight) + 'px'; } }
AFTER.chat = () => { const m = $('#msgs'); if (m) m.scrollTop = m.scrollHeight; chatGrow(); };

/* ================= sự kiện ================= */
ACT.cv = (el, d) => { S.cv = d.id; ui.chatFind = null; if (S.view !== 'chat') return nav('chat'); render(); const i = $('#chatIn'); if (i) i.focus(); };
ACT['cv-go'] = (el, d) => { S.cv = d.id; nav('chat'); };
ACT['chat-tab'] = (el, d) => { ui.chatTab = d.f; render(); };
ACT['chat-info'] = () => { ui.chatInfo = ui.chatInfo === false; render(); };
ACT['chat-find'] = () => { ui.chatFind = ui.chatFind && ui.chatFind.cv === S.cv ? null : {cv:S.cv, q:''}; render(); const i = $('#chat-find'); if (i) i.focus(); };
ACT['chat-at'] = () => { const t = $('#chatIn'); if (!t) return; t.value += (t.value && !/\s$/.test(t.value) ? ' ' : '') + '@'; INP['chat-draft'](t); t.focus(); };
ACT['chat-att-x'] = () => { ui.chatAtt = null; render(); };
ACT['chat-img'] = (el, d) => showModal(`<div class="modal wide"><h3>Ảnh đã gửi${closeBtn()}</h3><img src="${esc(d.src)}" alt="Ảnh đã gửi" style="max-width:100%;border-radius:12px"></div>`);
INP['chat-q'] = el => { ui.chatQ = el.value; render(); };
INP['chat-find'] = el => { ui.chatFind = {cv:S.cv, q:el.value}; render(); };
INP['chat-draft'] = el => { ui.chatDraft = ui.chatDraft || {}; ui.chatDraft[S.cv] = el.value; chatGrow(); };
// đính kèm: 1 tệp; ảnh thu nhỏ thành dataURL để xem trước và lưu được trong bản demo
CHG['chat-att'] = el => {
  const f = el.files[0]; el.value = ''; if (!f) return;
  const isImg = /^image\//.test(f.type);
  const a = {cv:S.cv, file:f, name:f.name, size:fmtSize(f.size), type:f.type || '', isImg, preview:isImg ? URL.createObjectURL(f) : ''};
  ui.chatAtt = a; render();
  if (isImg && !LIVE){
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 900 / Math.max(img.width, img.height)), cvs = document.createElement('canvas');
      cvs.width = Math.round(img.width * k); cvs.height = Math.round(img.height * k);
      cvs.getContext('2d').drawImage(img, 0, 0, cvs.width, cvs.height);
      try { a.url = cvs.toDataURL('image/jpeg', .75); } catch (e) {}
    };
    img.src = a.preview;
  }
};
FORM.chat = (v, f) => {
  const text = (v.text || '').trim(), a = ui.chatAtt && ui.chatAtt.cv === S.cv ? ui.chatAtt : null;
  if (!text && !a) return;
  const inp = f.querySelector('#chatIn'); if (inp) inp.value = '';
  if (ui.chatDraft) ui.chatDraft[S.cv] = '';
  ui.chatAtt = null;
  const extra = {text};
  if (a) extra.file = {name:a.name, size:a.size, type:a.type, ...(LIVE ? {} : {url:a.url || a.preview})};
  sendChat(extra, a ? a.file : undefined);
};
document.addEventListener('keydown', e => {
  if (e.target.id === 'chatIn' && e.key === 'Enter' && !e.shiftKey && !e.isComposing){ e.preventDefault(); const f = e.target.form; if (f) f.requestSubmit(); }
});

// demo: tạo hội thoại mới (chế độ thật dùng conv-new của live.js)
ACT['chat-new'] = () => {
  showModal(`<form class="modal" data-form="chat-new"><h3>Cuộc trò chuyện mới${closeBtn()}</h3>
    <div class="sub">Chọn 1 người để nhắn riêng, hoặc nhiều người + đặt tên để tạo nhóm.</div>
    <label class="field">Tên nhóm (bỏ trống nếu nhắn riêng)<input id="cxn-name" name="name" placeholder="VD: Đội thiết kế"></label>
    <div class="stack" style="max-height:44vh;overflow:auto;gap:2px">${allPeople().filter(p => p.id !== S.me).map(p => `<label class="li" style="cursor:pointer"><input type="checkbox" name="u" value="${esc(p.id)}" style="accent-color:var(--purple)">${av(p.id, 30)}<span class="ell"><b>${esc(p.name)}</b><small>${esc([p.role, p.team].filter(Boolean).join(' · '))}</small></span></label>`).join('')}</div>
    <div class="small" id="cxn-err" style="color:var(--red)"></div>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Bắt đầu</button></div></form>`);
};
FORM['chat-new'] = v => {
  const ids = [].concat(v.u || []), name = (v.name || '').trim();
  if (!ids.length){ $('#cxn-err').textContent = 'Chọn ít nhất 1 người.'; return; }
  if (ids.length > 1 && !name){ $('#cxn-err').textContent = 'Đặt tên nhóm khi chọn từ 2 người trở lên.'; return; }
  let c;
  if (ids.length === 1 && !name){
    c = S.convs.find(x => x.type === 'dm' && x.user === ids[0]);
    if (!c){ c = {id:'dm-' + uid(), type:'dm', user:ids[0], name:'', sub:'', icon:null, c:'gray', members:[ids[0], S.me], files:[]}; S.convs.push(c); }
  } else {
    c = {id:'g-' + uid(), type:'group', name, sub:'Nhóm', icon:'users', c:'purple', members:[S.me, ...ids], files:[]}; S.convs.push(c);
    log('Tạo nhóm chat ' + name, 'blue');
  }
  S.read[c.id] = convMsgs(c.id).length;
  closeModal(); S.cv = c.id; nav('chat');
};

/* ================= tìm nhanh & trợ lý ================= */
SEARCH.push(hit => (S.convs || []).filter(c => hit(chatName(c))).map(c => ({icon:'chat', label:chatName(c), sub:'Chat', run:() => { S.cv = c.id; nav('chat'); }})));
AI.push({re:/tóm tắt hội thoại|tóm tắt nhóm|tóm tắt chat/, fn:q => {
  const s = q.toLowerCase(), c = (S.convs || []).find(x => x.type !== 'bot' && chatName(x).toLowerCase().split(/[\s—-]+/).some(w => w.length > 3 && s.includes(w))) || (S.convs || []).find(x => x.id === S.cv);
  if (!c) return 'Chưa có hội thoại để tóm tắt.';
  const ms = convMsgs(c.id).filter(m => !m.deleted).slice(-6);
  return `<b>${esc(chatName(c))}</b> — ${convMsgs(c.id).length} tin, ${convUnread(c.id)} chưa đọc. Gần nhất:` + list(ms.map(m => (m.bot ? '⚠ ' + esc(m.bot.title) + ': ' : (m.from === S.me ? 'Bạn' : esc(person(m.from).name.split(' ').pop())) + ': ') + esc((m.text || (m.file ? m.file.name : '')).slice(0, 90)))) + `<button class="link" data-act="cv-go" data-id="${esc(c.id)}">Mở hội thoại ›</button>`;
}});
AI.push({re:/cảnh báo nào|cảnh báo từ|dezbot|siteflow bot/, fn:() => {
  const ms = (S.msgs || []).filter(m => m.bot && m.cv === ((S.convs || []).find(c => c.type === 'bot') || {}).id).slice(-5).reverse();
  return ms.length ? 'Cảnh báo gần nhất từ Dezbot:' + list(ms.map(m => `<b>${esc(m.bot.title)}</b> — ${esc(m.text)} <small>(${chatWhen(m.t)})</small>`)) : 'Chưa có cảnh báo nào.';
}});
AI.push({re:/tin nhắn|chưa đọc|chat|hội thoại/, fn:() => {
  const l = (S.convs || []).filter(c => convUnread(c.id));
  return l.length ? `Bạn có <b>${chatUnreadTotal()}</b> tin chưa đọc:` + list(l.map(c => { const m = chatLast(c.id); return `<button class="link" data-act="cv-go" data-id="${esc(c.id)}">${esc(chatName(c))}</button> — ${convUnread(c.id)} tin${m ? ' · “' + esc(chatPreview(c, m).slice(0, 70)) + '”' : ''}`; })) : 'Bạn đã đọc hết tin nhắn.';
}});
