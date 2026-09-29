/* Dezon Workspace — Wiki công ty: sổ tay, nội quy, quy trình, biểu mẫu. Nội dung lưu dạng markdown, vẽ ra HTML có mục lục. */

/* ================= đồng bộ & dữ liệu mẫu ================= */
syncCol('wiki_pages', 'array', () => S.wiki_pages, v => S.wiki_pages = v, {read:'all', write:['wiki']});
syncCol('wiki_cats', 'single', () => ({cats:S.wiki_cats || []}), v => S.wiki_cats = v.cats || [], {read:'all', write:['wiki']});
const WIKI_ICONS = ['book','alert','check','file','bulb','users','gear','clip'];
const WIKI_FORM_NOTE = 'Biểu mẫu chuẩn dùng chung toàn công ty. Vui lòng không chỉnh sửa cấu trúc mẫu khi điền thông tin.';
const WIKI_MAX = 1.5 * 1024 * 1024; // tệp đính kèm lưu kèm trang (data URL) — giới hạn để đồng bộ nhẹ
SEEDS.push(s => {
  const C = ['Sổ tay nhân viên','Nội quy công ty','Quy trình làm việc','Biểu mẫu & tài liệu'];
  s.wiki_cats = C.slice();
  const P = (id, c, title, updated, md, form = null) => ({id, cat:C[c], title, updated:md_(updated), by:'ta', md, form});
  const md_ = d => md(d);
  s.wiki_pages = [
    P('intro', 0, 'Giới thiệu công ty', '2026-09-12', `{{company.name}} hoạt động trong lĩnh vực thi công xây dựng dân dụng & công nghiệp, tổng thầu và quản lý dự án. Chúng tôi số hoá toàn diện quy trình công trường trên Dezon Workspace — từ lập tiến độ, chấm công theo địa điểm đến kiểm soát dòng tiền — nhằm giảm sai sót và rút ngắn thời gian ra quyết định cho ban chỉ huy công trình.

## Thông tin công ty
| Tên công ty | {{company.name}} |
| Mã số thuế | {{company.tax}} |
| Địa chỉ trụ sở | {{company.addr}} |
| Ngày thành lập | 15/03/2016 |
| Lĩnh vực | Thi công xây dựng, tổng thầu, quản lý dự án |
| Người đại diện | Ông Nguyễn Đức Anh — Tổng Giám đốc |

## Tầm nhìn & sứ mệnh
Trở thành nhà thầu xây dựng dân dụng hàng đầu khu vực phía Nam, lấy chất lượng công trình và minh bạch tài chính làm nền tảng cho mọi dự án.

## Cơ cấu tổ chức
- Ban Giám đốc
- Ban chỉ huy công trường
- Phòng Kỹ thuật & Thiết kế
- Phòng Kế toán — Tài chính
- Phòng Nhân sự
- Phòng Mua hàng & Cung ứng

## Liên hệ nội bộ
> **Hotline IT nội bộ:** {{company.hotline}} (nhánh 1) · **Hotline Nhân sự:** {{company.hotline}} (nhánh 2) · **Hotline An toàn lao động:** {{company.hotline}} (nhánh 3, trực 24/7)`),
    P('culture', 0, 'Văn hoá & giá trị cốt lõi', '2026-08-02', `Ba giá trị cốt lõi định hướng cách chúng tôi làm việc mỗi ngày trên công trường và tại văn phòng.

## An toàn là ưu tiên số một
Không đánh đổi tiến độ lấy an toàn. Mọi công trường đều có quyền dừng thi công khi phát hiện rủi ro.

## Minh bạch số liệu
Tiến độ, chấm công và chi phí được ghi nhận đúng thời điểm phát sinh, không xử lý trên giấy sau đó.

## Đúng hẹn với khách hàng
Cam kết tiến độ bàn giao là cam kết pháp lý, không phải con số ước lượng.`),
    P('salary', 0, 'Chính sách lương thưởng', '2026-09-01', `Áp dụng cho toàn thể nhân viên khối văn phòng và cán bộ quản lý công trường, có hiệu lực từ 01/09/2026.

## Kỳ trả lương
Lương được trả vào ngày **05 hàng tháng** qua chuyển khoản ngân hàng. Nếu trùng ngày nghỉ lễ, lương được trả vào ngày làm việc liền trước.

## Các khoản phụ cấp
| Loại phụ cấp | Đối tượng | Mức áp dụng |
|---|---|---|
| Phụ cấp công trường xa | Nhân sự công trường ngoài nội thành | 500.000đ / tháng |
| Phụ cấp trách nhiệm | Chỉ huy trưởng, Trưởng phòng | 1.000.000 – 2.000.000đ / tháng |
| Phụ cấp ăn trưa | Toàn thể nhân viên | 730.000đ / tháng |
| Phụ cấp điện thoại | Quản lý từ cấp Trưởng phòng | 300.000đ / tháng |

## Thưởng hiệu suất
- Thưởng hoàn thành tiến độ: 1 tháng lương khi dự án bàn giao đúng hoặc sớm hơn mốc cam kết.
- Thưởng cuối năm theo kết quả kinh doanh, xét duyệt bởi Ban Giám đốc.
- Thưởng sáng kiến cải tiến quy trình thi công / vận hành.`),
    P('leave', 0, 'Chế độ nghỉ phép', '2026-09-01', `## Nghỉ phép năm
12 ngày phép/năm đối với nhân viên chính thức, cộng thêm 1 ngày cho mỗi 5 năm thâm niên. Phép chưa dùng hết được chuyển tối đa sang quý I năm sau.

## Nghỉ ốm, thai sản
Thực hiện theo quy định của Luật Bảo hiểm xã hội hiện hành; nhân viên nộp giấy chứng nhận nghỉ ốm cho Phòng Nhân sự trong vòng 3 ngày làm việc.

## Nghỉ lễ, Tết
- Tết Dương lịch: 1 ngày
- Tết Âm lịch: 5 ngày
- Giỗ Tổ Hùng Vương, 30/4, 1/5, Quốc khánh: theo lịch nghỉ chung của Nhà nước

## Quy trình xin nghỉ
Gửi yêu cầu trước tối thiểu 1 ngày làm việc qua mục **Bàn làm việc › Đơn từ** trên Dezon Workspace hoặc theo mẫu đơn giấy đối với công nhân công trường chưa có tài khoản. Xem chi tiết tại trang [Quy trình chấm công & xin nghỉ](page:attendance-process).`),
    P('labor-rules', 1, 'Nội quy lao động', '2026-07-20', `## Giờ làm việc
Khối văn phòng: 08:00 – 17:00, thứ Hai đến thứ Sáu, nghỉ trưa 12:00 – 13:00. Khối công trường: theo ca do Ban chỉ huy công trường quy định, chấm công bắt buộc qua định vị GPS trong bán kính công trường.

## Quy định ra vào công trường
- Đeo thẻ nhân viên và trang bị bảo hộ lao động đầy đủ khi vào khu vực thi công.
- Khách và nhà thầu phụ phải đăng ký với bảo vệ và được giám sát dẫn vào.
- Không mang chất kích thích, vũ khí, vật dụng dễ cháy nổ vào công trường.

## Các hành vi vi phạm và hình thức xử lý
| Vi phạm | Hình thức xử lý |
|---|---|
| Đi trễ, về sớm không phép (dưới 3 lần/tháng) | Nhắc nhở bằng văn bản |
| Không mang bảo hộ lao động khi thi công | Đình chỉ công việc trong ngày |
| Giả mạo vị trí chấm công | Khiển trách, trừ điểm thi đua |
| Vi phạm an toàn nghiêm trọng gây nguy hiểm | Xem xét chấm dứt hợp đồng lao động |`),
    P('safety', 1, 'Quy định an toàn lao động', '2026-09-05', `> [!danger] An toàn lao động là điều kiện bắt buộc, không phải khuyến nghị. Mọi nhân sự có quyền và trách nhiệm dừng công việc nếu phát hiện nguy cơ mất an toàn.

## Trang bị bảo hộ lao động (PPE) bắt buộc
- Mũ bảo hộ đạt chuẩn khi vào khu vực thi công.
- Giày bảo hộ chống đinh, chống trơn trượt.
- Dây đai an toàn khi làm việc trên cao từ 2m trở lên.
- Kính, khẩu trang, găng tay khi hàn cắt, mài, tiếp xúc hoá chất.

## Quy định PCCC
Mỗi công trường bố trí bình chữa cháy tại các tầng đang thi công, sơ đồ thoát hiểm được cập nhật theo tiến độ và diễn tập PCCC tối thiểu 1 lần/quý.

## Xử lý sự cố tai nạn lao động
1. Sơ cứu tại chỗ, cách ly khu vực nguy hiểm.
2. Báo ngay cho Giám sát an toàn lao động và Chỉ huy trưởng.
3. Ghi nhận sự cố trên Dezon Workspace (nhóm Chat dự án hoặc Nhiệm vụ an toàn) trong vòng 1 giờ.
4. Lập biên bản, điều tra nguyên nhân trong vòng 24 giờ.

> [!hotline] **Hotline An toàn lao động:** {{company.hotline}} (nhánh 3) — trực 24/7.`),
    P('dress-code', 1, 'Trang phục & tác phong', '2026-06-10', `Nội dung đang được Phòng Nhân sự biên soạn, dự kiến cập nhật trong tháng 10/2026.`),
    P('attendance-process', 2, 'Chấm công & xin nghỉ', '2026-09-15', `Quy trình áp dụng cho toàn bộ nhân sự công trường và văn phòng sử dụng module **Chấm công** trên Dezon Workspace.

## Chấm công vào / ra
1. Mở Dezon Workspace (web hoặc điện thoại) › HR › Chấm công › Chấm công của tôi.
2. Ứng dụng xác định vị trí GPS và đối chiếu với bán kính công trường (geofence).
3. Trong bán kính cho phép: chấm công được ghi nhận ngay, chọn công việc đang thi công.
4. Ngoài bán kính cho phép: hệ thống gắn cờ "ngoài vùng", gửi yêu cầu duyệt tới giám sát công trường qua mục *Duyệt ngoại vùng*.

## Xin nghỉ phép
1. Gửi yêu cầu nghỉ trước tối thiểu 1 ngày làm việc trên Dezon Workspace (Bàn làm việc › Đơn từ).
2. Quản lý trực tiếp duyệt hoặc từ chối, có thể trao đổi qua Chat.
3. Ngày nghỉ được duyệt tự động phản ánh vào bảng công tuần/tháng và số ngày phép còn lại.

> Xem hướng dẫn thao tác chi tiết và các trạng thái chấm công tại module [Chấm công](view:att/cc).`),
    P('expense-process', 2, 'Duyệt chi phí', '2026-08-28', `Nội dung đang được Phòng Kế toán biên soạn. Tham khảo tạm thời tại module [Tài chính](view:fin) — tab Ngân sách / Hoá đơn.`),
    P('acceptance-process', 2, 'Nghiệm thu công việc', '2026-08-22', `Nội dung đang được Phòng Kỹ thuật biên soạn, dự kiến hoàn thiện cùng đợt cập nhật module Tiến độ quý IV/2026.`),
    P('incident-process', 2, 'Xử lý sự cố công trường', '2026-08-22', `Nội dung đang được biên soạn — tham khảo mục "Xử lý sự cố tai nạn lao động" tại trang [Quy định an toàn lao động](page:safety) trong lúc chờ cập nhật.`),
    P('form-leave', 3, 'Mẫu đơn xin nghỉ phép', '2026-03-01', WIKI_FORM_NOTE, {name:'Mau_don_xin_nghi_phep.docx', size:48 * 1024, type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document', data:''}),
    P('form-acceptance', 3, 'Mẫu biên bản nghiệm thu', '2026-05-14', WIKI_FORM_NOTE, {name:'Bien_ban_nghiem_thu.docx', size:62 * 1024, type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document', data:''}),
    P('form-advance', 3, 'Mẫu đề nghị tạm ứng', '2026-05-14', WIKI_FORM_NOTE, {name:'De_nghi_tam_ung.xlsx', size:35 * 1024, type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', data:''})
  ];
});

/* ================= markdown → HTML ================= */
function WIKI_fill(src){
  const c = typeof company === 'function' ? company() : {};
  return String(src || '').replace(/\{\{company\.(\w+)\}\}/g, (m, k) => c[k] || '—');
}
function WIKI_inline(s){
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, href) => {
      if (href.startsWith('page:')) return `<button type="button" class="wk-link" data-act="wiki-go" data-id="${href.slice(5)}">${t}</button>`;
      if (href.startsWith('view:')){ const [v, sb] = href.slice(5).split('/'); return `<button type="button" class="wk-link" data-act="nav" data-v="${v}"${sb ? ` data-sub="${sb}"` : ''}>${t}</button>`; }
      if (/^https?:\/\//.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${t}</a>`;
      return t;
    })
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>');
}
function WIKI_render(src){
  const out = [], toc = [], ids = {}; let list = null, table = null, para = [];
  const cell = (c, h) => `<${h}>${WIKI_inline(c)}</${h}>`;
  const flush = () => {
    if (para.length){ out.push('<p>' + WIKI_inline(para.join(' ')) + '</p>'); para = []; }
    if (list){ out.push(`<${list.t}>` + list.items.map(x => '<li>' + WIKI_inline(x) + '</li>').join('') + `</${list.t}>`); list = null; }
    if (table){
      const hasHead = table.length > 1 && table[1].every(c => /^:?-{2,}:?$/.test(c));
      out.push(hasHead
        ? '<table><thead><tr>' + table[0].map(c => cell(c, 'th')).join('') + '</tr></thead><tbody>' + table.slice(2).map(r => '<tr>' + r.map(c => cell(c, 'td')).join('') + '</tr>').join('') + '</tbody></table>'
        : '<table class="wk-kv"><tbody>' + table.map(r => '<tr>' + r.map((c, i) => cell(c, i ? 'td' : 'th')).join('') + '</tr>').join('') + '</tbody></table>');
      table = null;
    }
  };
  WIKI_fill(src).split('\n').forEach(raw => {
    const l = raw.trim(); let m;
    if (!l){ flush(); return; }
    if ((m = l.match(/^(#{2,3})\s+(.*)/))){
      flush(); let id = 'h-' + (slug(m[2]) || 'muc'); if (ids[id]) id += '-' + (++ids[id]); else ids[id] = 1;
      toc.push([id, m[2], m[1].length]); out.push(`<h${m[1].length} id="${id}">${WIKI_inline(m[2])}</h${m[1].length}>`); return;
    }
    if ((m = l.match(/^[-*]\s+(.*)/))){ if (para.length || table || (list && list.t !== 'ul')) flush(); list = list || {t:'ul', items:[]}; list.items.push(m[1]); return; }
    if ((m = l.match(/^\d+[.)]\s+(.*)/))){ if (para.length || table || (list && list.t !== 'ol')) flush(); list = list || {t:'ol', items:[]}; list.items.push(m[1]); return; }
    if (l.startsWith('|')){ if (para.length || list) flush(); table = table || []; table.push(l.replace(/^\||\|$/g, '').split('|').map(c => c.trim())); return; }
    if (l.startsWith('>')){
      flush(); const t = l.replace(/^>\s*/, ''), k = (t.match(/^\[!(info|danger|hotline)\]\s*/) || [])[1] || 'info';
      out.push(`<div class="wk-callout ${k}">${ic(k === 'danger' ? 'alert' : k === 'hotline' ? 'phone' : 'info', 17)}<span>${WIKI_inline(t.replace(/^\[!\w+\]\s*/, ''))}</span></div>`); return;
    }
    if (l === '---'){ flush(); out.push('<hr>'); return; }
    if (list || table) flush();
    para.push(l);
  });
  flush();
  return {html:out.join(''), toc};
}
const WIKI_plain = p => WIKI_fill(p.md).replace(/[#>*|[\]()-]+/g, ' ');
const WIKI_size = b => typeof fmtSize === 'function' ? fmtSize(b) : b >= 1048576 ? dec(b / 1048576, 1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';

/* ================= trang ================= */
const WIKI_pages = () => S.wiki_pages || [];
const WIKI_cats = () => { const c = (S.wiki_cats || []).slice(); WIKI_pages().forEach(p => { if (p.cat && !c.includes(p.cat)) c.push(p.cat); }); return c; };
const WIKI_icon = p => p.icon || WIKI_ICONS[Math.max(0, WIKI_cats().indexOf(p.cat)) % WIKI_ICONS.length];
MOD.wiki = () => {
  const edit = perm('wiki') === 'edit', q = (ui.wikiQ || '').toLowerCase().trim();
  const pages = WIKI_pages(), pg = pages.find(p => p.id === S.sub.wiki) || pages[0];
  const acts = edit ? `<button class="btn line" data-act="wiki-cats">${ic('filter', 15)}Danh mục</button>${pg ? `<button class="btn" data-act="wiki-edit" data-id="${esc(pg.id)}">${ic('edit', 15)}Sửa trang</button>` : `<button class="btn" data-act="wiki-new">${ic('plus', 15)}Trang mới</button>`}` : '';
  const hd = head('Wiki công ty', 'Sổ tay, nội quy & quy trình nội bộ — áp dụng toàn công ty.', acts);
  if (!pg) return hd + emptyBox('Wiki còn trống', 'Tạo trang đầu tiên: sổ tay nhân viên, nội quy, quy trình…');
  const match = p => !q || p.title.toLowerCase().includes(q) || WIKI_plain(p).toLowerCase().includes(q);
  const tree = WIKI_cats().map(c => {
    const ps = pages.filter(p => p.cat === c && match(p));
    if (!ps.length && q) return '';
    return `<div class="cat">${esc(c)}</div>` + (ps.map(p => `<button class="pg ${p === pg ? 'on' : ''}" data-act="wiki-go" data-id="${esc(p.id)}">${ic(WIKI_icon(p), 15)}<span class="ell">${esc(p.title)}</span></button>`).join('') || '<div class="small muted wk-none">Chưa có trang</div>');
  }).join('');
  const {html, toc} = WIKI_render(pg.md);
  const f = pg.form;
  const file = f ? `<div class="wk-file">${ic('file', 22)}<div class="ell" style="flex:1;min-width:0"><b class="ell">${esc(f.name || 'Chưa có tệp')}</b><small class="muted">${f.data ? WIKI_size(f.size || 0) + ' · ' : f.size ? WIKI_size(f.size) + ' · chưa tải tệp lên · ' : 'chưa có tệp · '}Cập nhật ${fmtFull(pg.updated)}</small></div>
      <button class="btn line sm" data-act="wiki-preview" data-id="${esc(pg.id)}" ${f.data ? '' : 'disabled title="Chưa có tệp"'}>Xem trước</button><button class="btn sm" data-act="wiki-download" data-id="${esc(pg.id)}" ${f.data ? '' : 'disabled title="Chưa có tệp"'}>Tải xuống</button></div>
      ${f.data ? '' : `<div class="small muted">Chưa có tệp đính kèm${edit ? ' — bấm <b>Sửa trang</b> để tải tệp lên.' : '.'}</div>`}` : '';
  return hd + `<div class="wiki wk2">
    <nav class="card wiki-tree" aria-label="Danh mục wiki">
      <div class="search">${ic('search', 15)}<input id="wiki-q" data-input="wiki-q" value="${esc(ui.wikiQ || '')}" placeholder="Tìm trong Wiki..." aria-label="Tìm trong Wiki"></div>
      ${edit ? `<button class="btn line sm wk-new" data-act="wiki-new">${ic('plus', 14)}Trang mới</button>` : ''}
      ${tree || '<div class="empty">Không tìm thấy trang phù hợp</div>'}
      ${f ? '' : `<div class="wk-toc"><div class="cat">Trong trang này</div>${toc.length ? toc.map(([id, t, lv]) => `<button class="wk-toc-a ${lv === 3 ? 'h3' : ''}" data-act="wiki-toc" data-id="${id}">${esc(t)}</button>`).join('') : '<div class="small muted wk-none">Không có mục lục.</div>'}</div>`}
    </nav>
    <article class="card article">
      <div class="wk-cat">${esc(pg.cat)}</div><h1>${esc(pg.title)}</h1>
      <div class="row small muted" style="margin-bottom:16px">${av(pg.by, 22)}Cập nhật bởi ${esc(person(pg.by).name)} · ${fmtFull(pg.updated)}</div>
      ${file}<div class="prose">${html}</div>
    </article></div>`;
};
ACT['wiki-go'] = (el, d) => { S.sub.wiki = d.id; if (S.view !== 'wiki') return nav('wiki'); render(); $('#main').scrollTop = 0; };
ACT['wiki-toc'] = (el, d) => { const h = document.getElementById(d.id); if (h) h.scrollIntoView({behavior:'smooth', block:'start'}); };
INP['wiki-q'] = el => { ui.wikiQ = el.value; render(); };
function WIKI_blob(f){
  const [meta, b64] = f.data.split(','), bin = atob(b64 || ''), arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], {type:f.type || (meta.match(/data:([^;]+)/) || [])[1] || 'application/octet-stream'});
}
ACT['wiki-download'] = (el, d) => {
  const p = WIKI_pages().find(x => x.id === d.id), f = p && p.form; if (!f || !f.data) return toast('Trang này chưa có tệp');
  const url = URL.createObjectURL(WIKI_blob(f)), a = document.createElement('a');
  a.href = url; a.download = f.name || 'tep'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
};
ACT['wiki-preview'] = (el, d) => {
  const p = WIKI_pages().find(x => x.id === d.id), f = p && p.form; if (!f || !f.data) return toast('Trang này chưa có tệp');
  const t = f.type || '';
  if (!/^image\/|pdf|^text\//.test(t)) return toast('Định dạng này không xem trước được trong trình duyệt — hãy bấm Tải xuống');
  if (ui.wikiUrl) URL.revokeObjectURL(ui.wikiUrl);
  const url = ui.wikiUrl = URL.createObjectURL(WIKI_blob(f));
  showModal(`<div class="modal wide"><h3>${esc(f.name)}${closeBtn()}</h3>${t.startsWith('image/') ? `<img src="${url}" alt="${esc(f.name)}" class="wk-prev-img">` : `<iframe src="${url}" title="${esc(f.name)}" class="wk-prev"></iframe>`}
    <div class="m-actions"><button class="btn" data-act="wiki-download" data-id="${esc(p.id)}">Tải xuống</button></div></div>`);
};

/* ---------- soạn trang ---------- */
ACT['wiki-new'] = () => WIKI_modal(null);
ACT['wiki-edit'] = (el, d) => WIKI_modal(WIKI_pages().find(p => p.id === d.id));
function WIKI_modal(p){
  if (perm('wiki') !== 'edit') return toast('Bạn chưa có quyền sửa Wiki');
  const cats = WIKI_cats();
  p = p || {id:'', cat:cats[0] || 'Sổ tay nhân viên', title:'', md:'## Mục 1\nNội dung…\n\n- Ý 1\n- Ý 2', form:null};
  ui.wikiFile = null;
  showModal(`<form class="modal wide" data-form="wiki" data-id="${esc(p.id)}"><h3>${p.id ? 'Sửa trang' : 'Trang mới'}${closeBtn()}</h3>
    <div class="row2"><label class="field">Tiêu đề *<input id="wk-title" name="title" required value="${esc(p.title)}"></label><label class="field">Danh mục (chọn hoặc gõ tên mới)<input id="wk-cat" name="cat" list="wk-cats" required value="${esc(p.cat)}"></label></div>
    <datalist id="wk-cats">${cats.map(c => `<option value="${esc(c)}">`).join('')}</datalist>
    <label class="field">Nội dung <span>(## Mục · ### Mục con · - gạch đầu dòng · 1. đánh số · **đậm** · *nghiêng* · &gt; ghi chú · &gt; [!danger] cảnh báo · | bảng | cột | · [chữ](page:mã-trang) liên kết trang · {{company.name}} tên công ty)</span><textarea class="md" id="wk-md" name="md">${esc(p.md)}</textarea></label>
    <div class="card pad stack wk-attach"><label class="row small"><input type="checkbox" name="isForm" value="1" ${p.form ? 'checked' : ''}> <b>Trang biểu mẫu</b> — có tệp đính kèm (Xem trước / Tải xuống)</label>
      ${p.form && p.form.data ? `<div class="row small">${ic('clip', 14)}<span class="ell">${esc(p.form.name)} · ${WIKI_size(p.form.size || 0)}</span><label class="row small" style="margin-left:auto"><input type="checkbox" name="rmFile" value="1"> Gỡ tệp</label></div>` : ''}
      <label class="field">Tải tệp lên (tối đa ${WIKI_size(WIKI_MAX)}; PDF / ảnh xem trước được)<input type="file" id="wk-file" data-change="wiki-file"></label><div class="small muted" id="wk-file-st"></div></div>
    <div class="m-actions">${p.id ? delBtn('wiki') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu trang</button></div></form>`);
}
CHG['wiki-file'] = el => {
  const file = el.files && el.files[0], st = $('#wk-file-st'); ui.wikiFile = null;
  if (!file) return;
  if (file.size > WIKI_MAX){ el.value = ''; if (st) st.textContent = 'Tệp quá lớn (' + WIKI_size(file.size) + ') — tối đa ' + WIKI_size(WIKI_MAX) + '.'; return; }
  const r = new FileReader();
  r.onload = () => { ui.wikiFile = {name:file.name, size:file.size, type:file.type, data:r.result}; if (st) st.textContent = 'Đã chọn ' + file.name + ' · ' + WIKI_size(file.size); const cb = el.form && el.form.querySelector('[name=isForm]'); if (cb) cb.checked = true; };
  r.onerror = () => { if (st) st.textContent = 'Không đọc được tệp'; };
  r.readAsDataURL(file);
};
FORM.wiki = (v, f) => {
  if (perm('wiki') !== 'edit') return toast('Bạn chưa có quyền sửa Wiki');
  const cat = v.cat.trim(), title = v.title.trim(); if (!title || !cat) return toast('Nhập tiêu đề và danh mục');
  S.wiki_cats = S.wiki_cats || []; if (!S.wiki_cats.includes(cat)) S.wiki_cats.push(cat);
  S.wiki_pages = S.wiki_pages || [];
  let p = S.wiki_pages.find(x => x.id === f.dataset.id);
  const data = {title, cat, md:v.md, updated:todayISO(), by:S.me};
  if (p) Object.assign(p, data);
  else { let id = slug(title) || 'trang'; while (S.wiki_pages.some(x => x.id === id)) id += '-' + uid().slice(0, 3); p = {id, form:null, ...data}; S.wiki_pages.push(p); }
  if (!v.isForm) p.form = null;
  else {
    const old = p.form && !v.rmFile ? p.form : null;
    p.form = ui.wikiFile || old || {name:'', size:0, type:'', data:''};
  }
  ui.wikiFile = null; S.sub.wiki = p.id; log('Cập nhật wiki: ' + p.title, 'brown'); closeModal(); render(); toast('Đã lưu trang wiki');
};
DEL.wiki = id => { S.wiki_pages = WIKI_pages().filter(p => p.id !== id); S.sub.wiki = (S.wiki_pages[0] || {}).id; };

/* ---------- quản lý danh mục ---------- */
ACT['wiki-cats'] = () => {
  if (perm('wiki') !== 'edit') return;
  const cats = WIKI_cats();
  showModal(`<form class="modal" data-form="wiki-cats"><h3>Danh mục wiki${closeBtn()}</h3><div class="sub">Đổi tên, sắp xếp hoặc xoá danh mục. Xoá danh mục còn trang → các trang chuyển sang danh mục đầu tiên còn lại.</div>
    <div class="stack" id="wk-cat-list" style="gap:8px">${cats.map(c => `<div class="row wk-cat-row"><input type="hidden" name="o" value="${esc(c)}"><input class="hr-sel" name="c" value="${esc(c)}" required style="flex:1" aria-label="Tên danh mục">
      <span class="small muted">${WIKI_pages().filter(p => p.cat === c).length} trang</span>
      <button type="button" class="icon-btn sm" data-act="wiki-cat-up" aria-label="Lên trên">${ic('left', 14)}</button><label class="small row"><input type="checkbox" name="rm" value="${esc(c)}"> Xoá</label></div>`).join('')}</div>
    <label class="field">Thêm danh mục mới<input name="add" placeholder="VD: Hướng dẫn phần mềm"></label>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu danh mục</button></div></form>`);
};
ACT['wiki-cat-up'] = el => { const row = el.closest('.wk-cat-row'), prev = row && row.previousElementSibling; if (prev) row.parentNode.insertBefore(row, prev); };
FORM['wiki-cats'] = v => {
  const o = [].concat(v.o || []), c = [].concat(v.c || []).map(x => x.trim()), rm = [].concat(v.rm || []);
  let next = [];
  o.forEach((old, i) => { const name = c[i] || old; if (rm.includes(old)) return; if (!next.includes(name)) next.push(name); WIKI_pages().forEach(p => { if (p.cat === old) p.cat = name; }); });
  const add = (v.add || '').trim(); if (add && !next.includes(add)) next.push(add);
  if (!next.length) next = ['Chung'];
  WIKI_pages().forEach(p => { if (!next.includes(p.cat)) p.cat = next[0]; });
  S.wiki_cats = next; closeModal(); render(); toast('Đã lưu danh mục');
};

/* ================= tìm nhanh & trợ lý ================= */
SEARCH.push(hit => perm('wiki') === 'none' ? [] : WIKI_pages().filter(p => hit(p.title + ' ' + WIKI_plain(p))).slice(0, 6).map(p => ({icon:'book', label:p.title, sub:'Wiki · ' + p.cat, run:() => { S.sub.wiki = p.id; nav('wiki'); }})));
AI.push({re:/nội quy|quy định|quy trình|tài liệu|wiki|an toàn|biểu mẫu|chính sách|phụ cấp|giờ làm/, fn:(q, s) => {
  if (perm('wiki') === 'none') return '';
  const P = WIKI_pages(); if (!P.length) return '';
  if (/vừa|mới|gần đây|cập nhật/.test(s)){
    const r = P.slice().sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 4);
    return 'Trang wiki cập nhật gần đây:' + list(r.map(p => `<button class="link" data-act="wiki-go" data-id="${esc(p.id)}">${esc(p.title)}</button> — ${fmtFull(p.updated)} · ${esc(person(p.by).name)}`));
  }
  const STOP = ['thế','nào','như','của','cho','với','những','gồm','bước','tóm','tắt','công','các','này','không','được'];
  const words = s.replace(/[?.,!]/g, '').split(/\s+/).filter(w => w.length > 2 && !STOP.includes(w));
  const score = p => { const t = p.title.toLowerCase(), b = WIKI_plain(p).toLowerCase(); return sum(words, w => (t.includes(w) ? 3 : 0) + (b.includes(w) ? 1 : 0)); };
  const top = P.map(p => [p, score(p)]).filter(x => x[1]).sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (!top.length) return '';
  const p = top[0][0], {toc} = WIKI_render(p.md);
  const pts = toc.length ? toc.filter(x => x[2] === 2).map(x => esc(x[1])) : [esc(WIKI_plain(p).trim().slice(0, 180)) + '…'];
  return `Theo trang wiki <b>${esc(p.title)}</b>:` + list(pts) + top.map(([x]) => `<button class="link" data-act="wiki-go" data-id="${esc(x.id)}">Mở “${esc(x.title)}”</button>`).join(' · ');
}});
