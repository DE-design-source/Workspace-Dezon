/* Dezon Workspace — Newsfeed: tin nội bộ theo danh mục, ghim, đăng tin (ảnh), thích / bình luận / chia sẻ theo từng người; Dezbot chung. */

// [mã, nhãn, màu, nhãn thẻ]
const FEED_CATS = [['duan','Dự án','purple','DỰ ÁN'],['sukien','Sự kiện','blue','SỰ KIỆN'],['giaithuong','Giải thưởng','yellow','GIẢI THƯỞNG'],['thongbao','Thông báo','green','THÔNG BÁO'],['nhansu','Nhân sự','pink','NHÂN SỰ']];
const feedCat = k => FEED_CATS.find(c => c[0] === k) || FEED_CATS[3];
// Mockup Newsfeed / Bàn làm việc / Lịch lấy hôm nay = 23/09/2026 → dời về hôm nay thật.
const FEED_md = s => addDays(md(s), -2);
const feedTs = (s, h) => parseD(FEED_md(s)).getTime() + toMin(h) * 6e4;
const feedAdmin = () => !LIVE || !!LIVE.isAdmin;
const feedIni = name => String(name || '?').split(/\s+/).filter(w => /^\p{L}/u.test(w)).slice(0, 3).map(w => w[0]).join('').toUpperCase() || '?';
const FEED_IC = {
  like:'<path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM7 10l4-7a2.5 2.5 0 0 1 2.8 2.9L13 10h5.6a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17.2 21H7"/>',
  share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/>',
  img:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>'
};
const feedIc = (n, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${FEED_IC[n]}</svg>`;

syncCol('feed_posts', 'array', () => S.feed_posts, v => S.feed_posts = v, {read:'all', write:'all', empty:() => []});

// Bài viết: {id, cat, by (mã người đăng, '' = phòng ban), author (tên hiển thị), t (ms), title, text, img (data URL), file (tên tệp), media (icon minh hoạ mẫu),
//   pinned, badge, likes:[mã người], likeBase, cmts:[{id, by, author, text, t, likes:[]}], cmtBase, shares:[mã người], shareBase}
SEEDS.push(s => {
  const P = (id, cat, author, date, time, title, text, likes, cmts, shares, x = {}) => ({id, cat, by:'', author, t:feedTs(date, time), title, text, img:'', file:'', media:'', pinned:false, badge:'',
    likes:[], likeBase:likes, cmts:[], cmtBase:cmts, shares:[], shareBase:shares, ...x});
  s.feed_posts = [
    P('p1', 'duan', 'Ban Giám đốc', '2026-09-23', '08:30', 'Khởi công dự án mới: Biệt thự Song lập Thảo Điền', 'Dezon chính thức khởi công dự án Biệt thự Song lập Thảo Điền — quy mô 18 căn, tổng mức đầu tư dự kiến 42 tỷ đồng. Lễ động thổ diễn ra sáng nay với sự tham dự của toàn thể ban lãnh đạo và đối tác chiến lược. Ban chỉ huy công trường đã được thành lập, kế hoạch thi công phần móng bắt đầu từ tuần sau; các phòng ban liên quan theo dõi tiến độ chi tiết tại mục Quản lý dự án.', 141, 37, 12,
      {pinned:true, badge:'DỰ ÁN MỚI', media:'building', likes:['ta'], cmts:[{id:'c1', by:'', author:'Ban Giám đốc', text:'Cảm ơn cả nhà đã đồng hành, dự án chính thức khởi công từ hôm nay!', t:feedTs('2026-09-23', '09:10'), likes:[]}]}),
    P('p2', 'thongbao', 'Hành chính', '2026-09-23', '07:00', 'Nghỉ lễ Quốc khánh 2/9: Văn phòng đóng cửa 2 ngày', 'Toàn công ty nghỉ lễ từ 01/09 đến hết 02/09/2026. Công trường vẫn duy trì lịch thi công bình thường theo phân công của chỉ huy trưởng.', 26, 4, 0),
    P('p3', 'sukien', 'Ban Giám đốc', '2026-09-22', '16:10', 'Họp toàn công ty quý 3 — 09:00 thứ Hai tuần sau', 'Tổng kết kết quả kinh doanh quý 3 và phương hướng quý 4. Địa điểm: Hội trường tầng 5, văn phòng chính. Yêu cầu toàn thể trưởng bộ phận tham dự.', 51, 9, 0),
    P('p4', 'giaithuong', 'Truyền thông', '2026-09-21', '10:00', 'Dezon đạt giải “Nhà thầu uy tín 2026”', 'Giải thưởng do Hiệp hội Xây dựng trao tặng, ghi nhận chất lượng thi công và tiến độ bàn giao đúng cam kết trong 3 năm liên tiếp.', 210, 47, 33, {media:'trophy'}),
    P('p5', 'duan', 'Anh Tuấn (PM)', '2026-09-20', '15:00', 'Nghiệm thu hoàn thành phần thô — Riverside Tòa A', 'Toàn bộ phần thô Tòa A đã được tư vấn giám sát nghiệm thu đạt yêu cầu, chuyển sang giai đoạn hoàn thiện từ tuần sau.', 33, 6, 0),
    P('p6', 'nhansu', 'HR', '2026-09-19', '09:00', 'Chào mừng 5 thành viên mới gia nhập Đội thi công B', 'Đội thi công B chính thức bổ sung 5 nhân sự mới nhằm đáp ứng tiến độ Riverside GĐ2 và chuẩn bị cho dự án Thảo Điền.', 64, 15, 0),
    P('p7', 'sukien', 'Công đoàn', '2026-09-18', '14:00', 'Team building cuối năm dự kiến tổ chức tại Đà Lạt', 'Dự kiến diễn ra cuối tháng 12, công đoàn sẽ khảo sát nhu cầu đăng ký của toàn thể nhân viên trong tuần tới.', 88, 21, 0),
    P('p8', 'thongbao', 'HR', '2026-09-16', '10:00', 'Cập nhật quy trình chấm công qua app từ 01/10', 'Toàn bộ nhân sự công trường chuyển sang chấm công bằng định vị GPS trên app, không dùng chấm công giấy từ tháng 10.', 19, 3, 0),
    P('p9', 'duan', 'Kinh doanh', '2026-09-16', '08:00', 'Ký hợp đồng mới: Văn phòng cho thuê Q3 giai đoạn mở rộng', 'Hợp đồng mở rộng giai đoạn 2 chính thức được ký kết, dự kiến khởi công đầu quý 4/2026.', 57, 11, 0)
  ];
});

/* ---------- API cho module khác ---------- */
// feedPost({author: mã người hoặc tên phòng ban, cat, title, text, img, pinned, badge}) → bài viết (người gọi tự render()).
function feedPost(o = {}){
  const isId = o.author && allPeople().some(p => p.id === o.author);
  const by = o.by !== undefined ? o.by : isId ? o.author : o.author ? '' : S.me;
  const p = {id:'p' + uid(), cat:FEED_CATS.some(c => c[0] === o.cat) ? o.cat : 'thongbao', by, author:by ? person(by).name : String(o.author || 'Hệ thống'),
    t:o.t || Date.now(), title:String(o.title || ''), text:String(o.text || ''), img:o.img || '', file:o.file || '', media:o.media || '', pinned:!!o.pinned, badge:o.badge || '',
    likes:[], likeBase:0, cmts:[], cmtBase:0, shares:[], shareBase:0};
  (S.feed_posts = S.feed_posts || []).unshift(p);
  return p;
}
const feedFind = id => (S.feed_posts || []).find(p => p.id === id);
const feedCanMod = p => feedAdmin() || (!!p.by && p.by === S.me);
function feedWhen(t){
  const s = iso(new Date(t)), n = -daysLeft(s);
  if (n === 0) return 'Hôm nay · ' + hm(t);
  if (n === 1) return 'Hôm qua · ' + hm(t);
  if (n > 1 && n < 7) return n + ' ngày trước';
  if (n >= 7 && n < 28) return Math.floor(n / 7) + ' tuần trước';
  return fmtFull(s);
}
const feedAv = (by, author, c, s) => by ? av(by, s) : `<span class="av" title="${esc(author)}" style="width:${s}px;height:${s}px;font-size:${Math.round(s * .32)}px;background:${cv(c)}">${esc(feedIni(author))}</span>`;
// Ảnh: thu nhỏ còn tối đa 1000px (JPEG) để lưu gọn cùng bài viết.
function feedImg(file){
  return new Promise(res => {
    if (!file || !file.size || !/^image\//.test(file.type)) return res('');
    const r = new FileReader();
    r.onerror = () => res('');
    r.onload = () => {
      const im = new Image();
      im.onerror = () => res('');
      im.onload = () => {
        const k = Math.min(1, 1000 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(im.width * k)); c.height = Math.max(1, Math.round(im.height * k));
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', .8));
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

/* ---------- giao diện ---------- */
function feedCard(p){
  const [, , c, badge] = feedCat(p.cat), me = S.me;
  const liked = p.likes.includes(me), shared = p.shares.includes(me);
  const nl = (p.likeBase || 0) + p.likes.length, nc = (p.cmtBase || 0) + p.cmts.length, ns = (p.shareBase || 0) + p.shares.length;
  const open = ui.feedOpen && ui.feedOpen[p.id], long = p.text.length > 240 && !open;
  const cmOpen = ui.feedCm && ui.feedCm[p.id], cm = p.cmts.slice().sort((a, b) => a.t - b.t), shown = cmOpen ? cm : cm.slice(-1);
  const isAuthor = x => (x.by && x.by === p.by) || (!x.by && !p.by && x.author === p.author);
  const media = p.img && /^data:image\//.test(p.img) ? `<img class="feed-img" src="${esc(p.img)}" alt="${esc(p.title || 'Ảnh bài viết')}" loading="lazy">`
    : p.media ? `<div class="feed-media" style="--c:${cv(c)};--t:${ct(c)}">${ic(p.media, 54)}</div>` : '';
  const summary = [nc ? nc + ' bình luận' : '', ns ? ns + ' chia sẻ' : ''].filter(Boolean).join(' · ');
  return `<article class="card feed-post ${p.pinned ? 'pinned' : ''}" id="post-${esc(p.id)}">
    ${p.pinned ? `<div class="feed-pin">${ic('pin', 13)}Bài viết đã ghim</div>` : ''}
    <div class="feed-h">${feedAv(p.by, p.author, c, 40)}<div class="ell"><b>${esc(p.author)}</b><small>${feedWhen(p.t)} · <span class="pill ${c}">${esc(p.badge || badge)}</span></small></div>
      ${feedCanMod(p) ? `<div class="feed-tools">
        ${feedAdmin() ? `<button class="icon-btn sm" data-act="feed-pin" data-id="${esc(p.id)}" title="${p.pinned ? 'Bỏ ghim' : 'Ghim bài viết'}" aria-label="${p.pinned ? 'Bỏ ghim' : 'Ghim bài viết'}">${ic('pin', 15)}</button>` : ''}
        <button class="icon-btn sm" data-act="feed-edit" data-id="${esc(p.id)}" title="Sửa bài viết" aria-label="Sửa bài viết">${ic('edit', 15)}</button>
        <button class="icon-btn sm" data-act="feed-del" data-id="${esc(p.id)}" title="${ui.feedArm === p.id ? 'Bấm lần nữa để xoá' : 'Xoá bài viết'}" aria-label="Xoá bài viết" ${ui.feedArm === p.id ? 'style="color:var(--red)"' : ''}>${ic('trash', 15)}</button></div>` : ''}
    </div>
    <div class="feed-body">${p.title ? `<h3>${esc(p.title)}</h3>` : ''}<p>${esc(long ? p.text.slice(0, 220).replace(/\s+\S*$/, '') + '…' : p.text)}${long ? ` <button class="link" data-act="feed-more" data-id="${esc(p.id)}">Xem thêm</button>` : ''}</p>
      ${p.file ? `<div class="file">${ic('clip', 15)}<span class="ell">${esc(p.file)}</span></div>` : ''}</div>
    ${media}
    ${nl || summary ? `<div class="feed-stats"><span>${nl ? `<i class="feed-like-dot">${feedIc('like', 11)}</i>${num(nl)}` : ''}</span><span>${summary}</span></div>` : ''}
    <div class="feed-acts">
      <button class="${liked ? 'on' : ''}" data-act="feed-like" data-id="${esc(p.id)}" aria-pressed="${liked}">${feedIc('like')}Thích</button>
      <button data-act="feed-cm" data-id="${esc(p.id)}">${ic('chat', 16)}Bình luận</button>
      <button class="${shared ? 'on' : ''}" data-act="feed-share" data-id="${esc(p.id)}">${feedIc('share')}Chia sẻ</button>
    </div>
    ${cm.length > shown.length ? `<button class="link feed-more-cm" data-act="feed-cm" data-id="${esc(p.id)}">Xem thêm bình luận (${cm.length - shown.length})</button>` : ''}
    ${shown.map(x => `<div class="feed-cmt">${feedAv(x.by, x.author, c, 30)}<div class="ell" style="white-space:normal">
      <div class="feed-bub"><b>${esc(x.by ? person(x.by).name : x.author)}</b>${isAuthor(x) ? ' <span class="pill gray">Tác giả</span>' : ''}<div>${esc(x.text)}</div></div>
      <div class="feed-cmeta">${ago(x.t)} · <button class="${x.likes.includes(me) ? 'on' : ''}" data-act="feed-clike" data-id="${esc(p.id)}" data-c="${esc(x.id)}">Thích${x.likes.length ? ' (' + x.likes.length + ')' : ''}</button> · <button data-act="feed-reply" data-id="${esc(p.id)}" data-n="${esc(x.by ? person(x.by).name : x.author)}">Phản hồi</button>${feedAdmin() || (x.by && x.by === me) ? ` · <button data-act="feed-cdel" data-id="${esc(p.id)}" data-c="${esc(x.id)}">${ui.feedArm === x.id ? 'Bấm lần nữa để xoá' : 'Xoá'}</button>` : ''}</div>
    </div></div>`).join('')}
    <form class="feed-cin" data-form="feed-cm" data-id="${esc(p.id)}">${av(me, 30)}<input id="fcm-${esc(p.id)}" name="text" autocomplete="off" maxlength="1000" placeholder="Bình luận dưới tên ${esc(person(me).name)}…" aria-label="Viết bình luận"><button class="icon-btn sm" type="submit" aria-label="Gửi bình luận">${ic('arrow', 16)}</button></form>
  </article>`;
}
MOD.feed = () => {
  const cat = ui.feedCat || 'all', all = S.feed_posts || [];
  const posts = all.filter(p => cat === 'all' || p.cat === cat).sort((a, b) => (b.pinned - a.pinned) || b.t - a.t);
  const me = person(S.me), first = me.name.split(' ').pop();
  const chips = [['all', 'Tất cả', all.length]].concat(FEED_CATS.map(([k, l]) => [k, l, all.filter(p => p.cat === k).length]))
    .map(([k, l, n]) => `<button class="fchip ${cat === k ? 'on' : ''}" data-act="feed-cat" data-k="${k}">${l}<span class="muted small">${n}</span></button>`).join('');
  // cột phải: sự kiện sắp tới (Lịch) + bài đã ghim
  let upcoming = [];
  if (typeof calEventsOn === 'function') for (let i = 0; i < 7 && upcoming.length < 5; i++){ const d = dayISO(i); calEventsOn(d).forEach(e => upcoming.push({...e, d})); }
  upcoming = upcoming.slice(0, 5);
  const pins = all.filter(p => p.pinned);
  const monthN = all.filter(p => iso(new Date(p.t)).slice(0, 7) === todayISO().slice(0, 7)).length;
  return head(`${ic('megaphone', 22)} Tin tức & cập nhật công ty`, 'Cập nhật hàng ngày: dự án mới, sự kiện, giải thưởng và thông báo nội bộ.', `<button class="btn" data-act="feed-new">${ic('plus', 15)}Đăng tin</button>`)
  + `<div class="feed-layout"><div class="feed-col">
    <div class="card pad feed-comp">
      <div class="row">${av(S.me, 38)}<button class="feed-say" data-act="feed-new">Bạn có tin gì muốn chia sẻ, ${esc(first)}?</button></div>
      <div class="feed-comp-f"><button class="btn ghost sm" data-act="feed-new" data-media="1">${feedIc('img', 15)}Ảnh/Video</button><button class="btn ghost sm" data-act="feed-new" data-cat="sukien">${ic('clock', 15)}Sự kiện</button><button class="btn sm" data-act="feed-new">Đăng tin</button></div>
    </div>
    <div class="chips" role="toolbar" aria-label="Lọc theo danh mục">${chips}</div>
    ${posts.map(feedCard).join('') || emptyBox('Chưa có tin nào', cat === 'all' ? 'Hãy là người đầu tiên chia sẻ tin tức với cả công ty.' : 'Danh mục này chưa có bài viết.', `<button class="btn sm" data-act="feed-new" ${cat !== 'all' ? `data-cat="${cat}"` : ''}>${ic('plus', 14)}Đăng tin</button>`)}
  </div>
  <aside class="feed-side">
    <div class="stats">${stat('Bài viết tháng này', monthN, all.length + ' bài trên bảng tin')}</div>
    <div class="card list-card"><h2 class="sec-title">Sắp diễn ra <button class="link" data-act="nav" data-v="cal">Mở Lịch ›</button></h2>
      ${upcoming.map(e => `<button class="li" data-act="nav" data-v="cal"><span class="dot" style="--c:${cv(e.color || 'purple')}"></span><span class="ell"><b>${esc(e.title)}</b><small>${relDay(e.d)}${e.start ? ' · ' + esc(e.start) + (e.end ? '–' + esc(e.end) : '') : ' · Cả ngày'}</small></span></button>`).join('') || '<div class="empty">Không có sự kiện trong 7 ngày tới</div>'}</div>
    <div class="card list-card"><h2 class="sec-title">Bài đã ghim</h2>
      ${pins.map(p => `<button class="li" data-act="feed-go" data-id="${esc(p.id)}">${ic('pin', 15)}<span class="ell"><b>${esc(p.title || p.text)}</b><small>${esc(p.author)} · ${feedWhen(p.t)}</small></span></button>`).join('') || '<div class="empty">Chưa ghim bài nào</div>'}</div>
  </aside></div>`;
};
AFTER.feed = () => {
  if (ui.feedFocus){ const el = document.getElementById(ui.feedFocus); ui.feedFocus = ''; if (el){ el.scrollIntoView({block:'center'}); if (el.tagName === 'INPUT') el.focus(); } }
};

/* ---------- đăng / sửa bài ---------- */
function feedModal(p, preset = {}){
  const x = p || {cat:preset.cat || (ui.feedCat && ui.feedCat !== 'all' ? ui.feedCat : 'thongbao'), title:'', text:'', pinned:false, img:'', file:''};
  const canCal = !p && typeof calAdd === 'function';
  showModal(`<form class="modal" data-form="feed-post" data-id="${p ? esc(p.id) : ''}">
    <h3>${p ? 'Sửa bài viết' : 'Đăng tin mới'}${closeBtn()}</h3>
    <div class="sub">Tin sẽ hiện trên Newsfeed của toàn công ty, đăng dưới tên ${esc(p ? p.author : person(S.me).name)}.</div>
    <div class="row2"><label class="field">Danh mục<select id="fp-cat" name="cat" data-change="feed-cat-f">${opt(FEED_CATS.map(c => [c[0], c[1]]), x.cat)}</select></label>
      <label class="field">Tiêu đề<input id="fp-title" name="title" maxlength="160" value="${esc(x.title)}" placeholder="VD: Khởi công dự án mới"></label></div>
    <label class="field">Nội dung *<textarea id="fp-text" name="text" required rows="5" maxlength="5000" placeholder="Bạn có tin gì muốn chia sẻ?">${esc(x.text)}</textarea></label>
    <label class="field">Ảnh / video (không bắt buộc)<input id="fp-img" name="img" type="file" accept="image/*,video/*">
      <span class="small">${x.img ? 'Đang có ảnh — chọn tệp mới để thay, hoặc tích “Bỏ ảnh”.' : x.file ? 'Tệp hiện tại: ' + esc(x.file) : 'Ảnh được thu nhỏ để lưu cùng bài; video chỉ lưu tên tệp.'}</span></label>
    ${x.img || x.file ? `<label class="row small"><input type="checkbox" name="noimg" value="1"> Bỏ ảnh / tệp hiện tại</label>` : ''}
    ${canCal ? `<div id="fp-ev" class="feed-ev" ${x.cat === 'sukien' ? '' : 'hidden'}><div class="small muted">Thêm sự kiện vào Lịch (không bắt buộc)</div>
      <div class="row3"><label class="field">Ngày<input id="fp-evd" name="evDate" type="date"></label><label class="field">Bắt đầu<input id="fp-evs" name="evStart" type="time" step="1800" value="09:00"></label><label class="field">Kết thúc<input id="fp-eve" name="evEnd" type="time" step="1800" value="10:00"></label></div></div>` : ''}
    ${feedAdmin() ? `<label class="row small"><input type="checkbox" name="pinned" value="1" ${x.pinned ? 'checked' : ''}> Ghim lên đầu bảng tin</label>` : ''}
    <div class="m-actions">${p ? delBtn('feed') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">${p ? 'Lưu' : 'Đăng tin'}</button></div>
  </form>`);
  if (preset.media) setTimeout(() => { const f = $('#fp-img'); if (f) f.click(); }, 60);
}
CHG['feed-cat-f'] = el => { const b = $('#fp-ev'); if (b) b.hidden = el.value !== 'sukien'; };
FORM['feed-post'] = async (v, f) => {
  const text = String(v.text || '').trim(), title = String(v.title || '').trim();
  if (!text) return toast('Vui lòng nhập nội dung bài viết.');
  const file = v.img && v.img.size ? v.img : null;
  if (v.evDate && v.evStart && v.evEnd && toMin(v.evEnd) <= toMin(v.evStart)) return toast('Giờ kết thúc sự kiện phải sau giờ bắt đầu.');
  const img = file ? await feedImg(file) : '';
  let p = feedFind(f.dataset.id);
  if (p){
    Object.assign(p, {cat:v.cat, title, text});
    if (v.noimg){ p.img = ''; p.file = ''; }
    if (file){ p.img = img; p.file = img ? '' : file.name; }
    if (feedAdmin()) p.pinned = !!v.pinned;
    toast('Đã lưu bài viết');
  } else {
    p = feedPost({by:S.me, cat:v.cat, title, text, img, file:file && !img ? file.name : '', pinned:feedAdmin() && !!v.pinned});
    if (v.evDate && typeof calAdd === 'function'){ calAdd({title:title || text.slice(0, 60), date:v.evDate, start:v.evStart || '09:00', end:v.evEnd || '10:00', cal:'hr', note:text}); toast('Đã đăng tin và thêm sự kiện vào Lịch'); }
    else toast('Đã đăng tin');
    log(`${person(S.me).name} đăng tin “${title || text.slice(0, 40)}”`, feedCat(p.cat)[2]);
  }
  ui.feedCat = ui.feedCat && ui.feedCat !== p.cat ? 'all' : ui.feedCat;
  closeModal(); render();
};
DEL.feed = id => { S.feed_posts = S.feed_posts.filter(p => p.id !== id); };

/* ---------- tương tác ---------- */
const feedToggle = (arr, id) => { const i = arr.indexOf(id); if (i >= 0) arr.splice(i, 1); else arr.push(id); return i < 0; };
Object.assign(ACT, {
  'feed-cat':(el, d) => { ui.feedCat = d.k; render(); },
  'feed-new':(el, d) => feedModal(null, {cat:d.cat, media:d.media}),
  'feed-edit':(el, d) => { const p = feedFind(d.id); if (p && feedCanMod(p)) feedModal(p); },
  'feed-more':(el, d) => { ui.feedOpen = {...(ui.feedOpen || {}), [d.id]:true}; render(); },
  'feed-like':(el, d) => { const p = feedFind(d.id); if (p){ feedToggle(p.likes, S.me); render(); } },
  'feed-clike':(el, d) => { const p = feedFind(d.id), c = p && p.cmts.find(x => x.id === d.c); if (c){ feedToggle(c.likes, S.me); render(); } },
  'feed-cm':(el, d) => { ui.feedCm = {...(ui.feedCm || {}), [d.id]:true}; ui.feedFocus = 'fcm-' + d.id; render(); },
  'feed-reply':(el, d) => { const i = document.getElementById('fcm-' + d.id); if (i){ i.value = '@' + d.n + ' '; i.focus(); } },
  'feed-share':(el, d) => {
    const p = feedFind(d.id); if (!p) return;
    if (!p.shares.includes(S.me)) p.shares.push(S.me);
    copyText([p.title, p.text, '— ' + p.author + ' · Newsfeed Dezon Workspace'].filter(Boolean).join('\n'), 'Đã sao chép nội dung bài viết để chia sẻ');
    render();
  },
  'feed-pin':(el, d) => { const p = feedFind(d.id); if (!p || !feedAdmin()) return; p.pinned = !p.pinned; render(); toast(p.pinned ? 'Đã ghim bài viết' : 'Đã bỏ ghim'); },
  'feed-del':(el, d) => {
    const p = feedFind(d.id); if (!p || !feedCanMod(p)) return;
    if (ui.feedArm !== p.id){ ui.feedArm = p.id; render(); toast('Bấm biểu tượng xoá lần nữa để xoá bài viết'); setTimeout(() => { if (ui.feedArm === p.id){ ui.feedArm = ''; if (S.view === 'feed') render(); } }, 3000); return; }
    ui.feedArm = ''; S.feed_posts = S.feed_posts.filter(x => x.id !== p.id); render(); toast('Đã xoá bài viết');
  },
  'feed-cdel':(el, d) => {
    const p = feedFind(d.id), c = p && p.cmts.find(x => x.id === d.c); if (!c || !(feedAdmin() || c.by === S.me)) return;
    if (ui.feedArm !== c.id){ ui.feedArm = c.id; render(); return; }
    ui.feedArm = ''; p.cmts = p.cmts.filter(x => x.id !== c.id); render(); toast('Đã xoá bình luận');
  },
  'feed-go':(el, d) => { ui.feedCat = 'all'; ui.feedFocus = 'post-' + d.id; nav('feed'); }
});
FORM['feed-cm'] = (v, f) => {
  const p = feedFind(f.dataset.id), text = String(v.text || '').trim();
  if (!p || !text) return;
  p.cmts.push({id:'c' + uid(), by:S.me, author:person(S.me).name, text, t:Date.now(), likes:[]});
  ui.feedCm = {...(ui.feedCm || {}), [p.id]:true}; ui.feedFocus = 'fcm-' + p.id;
  const i = document.getElementById('fcm-' + p.id); if (i) i.value = '';
  render();
};
SEARCH.push(hit => (S.feed_posts || []).filter(p => hit(p.title + ' ' + p.text)).slice(0, 5).map(p => ({icon:'megaphone', label:p.title || p.text.slice(0, 60), sub:'Newsfeed · ' + p.author, run:() => { ui.feedCat = 'all'; ui.feedFocus = 'post-' + p.id; nav('feed'); }})));

/* ================= Dezbot — chủ đề chung (theo KB của source) ================= */
AI_CHIPS.push(['gantt','purple','Tiến độ','Tiến độ dự án đang thế nào?'], ['userclock','green','Chấm công','Tình hình chấm công hôm nay?'], ['wallet','yellow','Dòng tiền','Dòng tiền tháng này ra sao?'], ['briefcase','orange','Khách hàng','Khách hàng nào đang tiềm năng?'], ['chat','blue','Tin nhắn','Tôi có tin nhắn nào chưa đọc?']);
AI_SUGG.push('Tóm tắt tình hình dự án hôm nay', 'Hôm nay tôi có lịch gì?', 'Tôi còn bao nhiêu ngày phép?', 'Đơn từ nào đang chờ duyệt?', 'Có tin tức gì mới?');
AI.push({re:/tin tức|bản tin|newsfeed|tin (gì )?mới|bài (viết|đăng)|được ghim|thông báo (mới|công ty|nội bộ)/, fn:() => {
  const l = (S.feed_posts || []).slice().sort((a, b) => (b.pinned - a.pinned) || b.t - a.t).slice(0, 4);
  return l.length ? 'Tin mới trên Newsfeed:' + list(l.map(p => `<button class="link" data-act="feed-go" data-id="${esc(p.id)}">${esc(p.title || p.text.slice(0, 60))}</button> · ${esc(p.author)} · ${feedWhen(p.t)}${p.pinned ? ' · đã ghim' : ''}`)) : 'Newsfeed chưa có bài viết nào.';
}});
AI.push({re:/tóm tắt tình hình|tình hình (dự án|chung|công ty)|tổng quan (công ty|hôm nay)/, fn:() => {
  const out = [];
  const p = typeof proj === 'function' ? proj(S.pid) || (S.projects || [])[0] : null;
  if (p && typeof ganttStats === 'function'){ const g = ganttStats(p.id); out.push(`<b>${esc(p.name)}</b>: tiến độ ${g.actual}% (kế hoạch ${g.plan}%), ${g.late} hạng mục trễ`); }
  if (typeof attSummary === 'function'){ const a = attSummary(); out.push(`Nhân công có mặt ${a.present}/${a.total}`); }
  if (p && typeof finStats === 'function'){ const f = finStats(p.id); out.push(`Đã chi ${vnd(f.spent)} / ngân sách ${vnd(f.budget)}, ${f.overdue.length} hoá đơn quá hạn`); }
  if (typeof chatUnreadTotal === 'function') out.push(`${chatUnreadTotal()} tin nhắn chưa đọc`);
  if (typeof calEventsOn === 'function') out.push(`${calEventsOn(todayISO()).length} sự kiện trên lịch hôm nay`);
  return out.length ? 'Tình hình hôm nay:' + list(out) : '';
}});
AI.push({re:/(giới thiệu|thông tin|địa chỉ|liên hệ) công ty|hotline|mã số thuế|dezon là/, fn:() => {
  if (typeof company !== 'function') return '';
  const c = company();
  return `<b>${esc(c.name)}</b>` + list([c.addr && 'Địa chỉ: ' + esc(c.addr), c.hotline && 'Hotline: ' + esc(c.hotline), c.email && 'Email: ' + esc(c.email), c.web && 'Website: ' + esc(c.web), c.tax && 'MST: ' + esc(c.tax)].filter(Boolean));
}});
AI.push({re:/^(trợ giúp|help)|(bạn|dezbot) (làm|giúp) được gì|hỏi (được )?gì|hướng dẫn (dùng|sử dụng)/, fn:() => 'Mình đọc trực tiếp dữ liệu workspace, bạn có thể hỏi:' + list(['Tiến độ dự án, việc trễ', 'Chấm công, nhân công hôm nay, ngày phép còn lại', 'Dòng tiền, hoá đơn quá hạn', 'Khách hàng tiềm năng, hợp đồng', 'Tin nhắn chưa đọc, tin tức mới', 'Lịch hôm nay, cuộc họp trùng giờ', 'Đơn từ chờ duyệt, nhiệm vụ của tôi', 'Bóc tách QS, mua hàng, quy trình / nội quy']) + 'Mở trang bất kỳ nhanh bằng <b>Ctrl K</b>.'});
