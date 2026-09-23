/* SiteFlow — Tài chính, QS (Bóc tách & Báo giá), Wiki */

/* ================= dữ liệu mẫu ================= */
SEEDS.push(s => {
  const B = (g, name, b, sp) => ({id:uid(), g, name, b, s:sp});
  const I = (code, partner, kind, amount, due, task, status) => ({id:uid(), code, partner, kind, amount, due:md(due), task, status});
  s.fin = {
    riverside:{cash:4200,
      budget:[B('Nhân công','Móng & kết cấu',1000,720), B('Nhân công','Hoàn thiện',1800,680), B('Vật tư','Thép & xi măng',1600,1550), B('Vật tư','Vật tư hoàn thiện (sơn, gạch)',1200,950), B('Thầu phụ','Cơ điện (MEP)',900,950), B('Thầu phụ','Kết cấu thép',600,580), B('Thiết bị & quản lý','Thiết bị thi công',700,250), B('Thiết bị & quản lý','Thiết bị nội thất & vệ sinh',300,100), B('Thiết bị & quản lý','Chi phí quản lý dự án',400,180)],
      inv:[I('INV-0142','Khách hàng ABC','in',620,'2026-09-16','Thu đợt 2 hợp đồng','pending'), I('INV-0143','Khách hàng ABC','in',480,'2026-09-30','Nghiệm thu phần móng','pending'), I('BILL-0087','Thầu phụ Nam Á','out',310,'2026-10-02','Đổ bê tông sàn tầng 4','pending'), I('INV-0144','Khách hàng XYZ','in',700,'2026-09-08','Hợp đồng riêng — Khu B','paid'), I('BILL-0088','Vật tư Hòa Phát','out',195,'2026-09-05','Thép & xi măng','paid'), I('BILL-0089','Cơ điện MEP Sài Gòn','out',420,'2026-10-20','Lắp đặt điện nước (MEP thô)','pending')],
      fc:[[950,620],[1100,480],[620,760],[1450,540],[800,700],[1300,610],[900,820],[860,870]]},
    b12:{cash:640,
      budget:[B('Nhân công','Nhân công phần thô',520,210), B('Vật tư','Vật tư phần thô',780,340), B('Thầu phụ','Điện nước',260,0), B('Thiết bị & quản lý','Quản lý & phát sinh',140,35)],
      inv:[I('INV-0151','Anh Quang Huy','in',630,'2026-09-25','Thu đợt 2 — xong móng','pending'), I('BILL-0092','Vật tư Kiến Phát','out',120,'2026-09-12','Vật tư móng','paid')],
      fc:[[630,160],[0,140],[0,180],[420,150],[0,120],[0,170],[420,190],[0,160]]}
  };
  const P = (id, name, brand, cat, w, k, a, price, fav) => ({id, name, brand, cat, w, k, a, price, fav:!!fav});
  s.qs = {cur:'qs1', room:'all', vat:8, filt:{cat:'', brands:[], w:'', k:'', a:'', fav:false, min:'', max:'', q:''},
    products:[
      P('p1','Đèn chùm phòng khách pha lê','Hồng Phúc','Đèn chùm',120,3000,360,4800000,1),
      P('p2','Đèn âm trần Downlight 9W','Rạng Đông','Đèn âm trần',9,4000,110,145000,1),
      P('p3','Đèn hắt tủ LED thanh (m)','Rạng Đông','Đèn hắt',8,3000,120,95000),
      P('p4','Đèn LED âm trần Spotlight 12W','Philips','Đèn spotlight',12,4000,36,320000),
      P('p5','Đèn ốp trần nổi tròn 24W','Điện Quang','Đèn ốp trần',24,6500,120,285000),
      P('p6','Đèn thả bàn ăn Pendant','MPE','Đèn trang trí',15,3000,90,1250000,1),
      P('p7','Đèn cầu thang âm tường','MPE','Đèn âm tường',3,3000,100,165000),
      P('p8','Đèn gương phòng tắm LED 12W','Philips','Đèn gương',12,4000,120,450000),
      P('p9','Downlight chống chói 12W','Philips','Đèn âm trần',12,3000,60,265000),
      P('p10','Đèn ốp trần vuông 36W','Rạng Đông','Đèn ốp trần',36,6500,120,390000),
      P('p11','Spotlight ray nam châm 7W','MPE','Đèn spotlight',7,3000,24,410000),
      P('p12','Đèn tường trang trí đôi','Hồng Phúc','Đèn trang trí',10,3000,60,690000),
      P('p13','Đèn LED dây 220V (m)','Điện Quang','Đèn hắt',9,3000,120,55000),
      P('p14','Đèn âm sàn ngoài trời 5W','MPE','Đèn âm tường',5,3000,45,380000),
      P('p15','Đèn chùm hiện đại 8 bóng','Hồng Phúc','Đèn chùm',64,4000,360,3200000),
      P('p16','Đèn gương tròn viền LED','Điện Quang','Đèn gương',18,4000,120,520000)
    ],
    projects:[
      {id:'qs1', code:'QS-01', pid:'riverside', name:'Căn hộ mẫu tầng 1', client:'BQL Riverside', phone:'0909 123 456', addr:'Riverside GĐ2, Tòa A', created:md('2026-09-21'), status:'doing', quoted:false, rooms:[
        {id:'r1', name:'Phòng khách', items:[{p:'p1', q:1},{p:'p2', q:8},{p:'p3', q:4}]},
        {id:'r2', name:'Phòng bếp', items:[{p:'p4', q:6},{p:'p5', q:2}]},
        {id:'r3', name:'Phòng ngủ master', items:[{p:'p6', q:2},{p:'p2', q:6}]},
        {id:'r4', name:'WC master', items:[{p:'p8', q:1},{p:'p2', q:1}]},
        {id:'r5', name:'Hành lang & cầu thang', items:[{p:'p7', q:10},{p:'p13', q:4}]}]},
      {id:'qs2', code:'QS-02', pid:'', name:'Căn hộ A1-05 (khách lẻ)', client:'Chị Minh Thư', phone:'0912 887 234', addr:'Riverside GĐ2, A1-05', created:md('2026-09-15'), status:'draft', quoted:false, rooms:[{id:'r6', name:'Phòng khách', items:[{p:'p9', q:6}]}]},
      {id:'qs3', code:'QS-03', pid:'riverside', name:'Sảnh & hành lang chung', client:'BQL Riverside', phone:'0909 123 456', addr:'Riverside GĐ2, khu chung', created:md('2026-09-08'), status:'done', quoted:true, rooms:[
        {id:'r7', name:'Sảnh chính', items:[{p:'p1', q:2},{p:'p2', q:20}]},
        {id:'r8', name:'Hành lang tầng 1–5', items:[{p:'p7', q:40}]}]},
      {id:'qs4', code:'QS-04', pid:'b12', name:'Nhà mẫu Villa Số 3', client:'Anh Quang Huy', phone:'0938 456 789', addr:'Riverside GĐ2, Villa 3', created:md('2026-09-18'), status:'doing', quoted:false, rooms:[
        {id:'r9', name:'Phòng khách', items:[{p:'p15', q:1},{p:'p11', q:6}]},
        {id:'r10', name:'Sân vườn', items:[{p:'p14', q:8}]}]}
    ],
    po:[
      {id:'po1', code:'PO-0031', qp:'qs3', brand:'MPE', items:[{p:'p7', q:40}], status:'wait', date:md('2026-09-19')},
      {id:'po2', code:'PO-0032', qp:'qs3', brand:'Hồng Phúc', items:[{p:'p1', q:2}], status:'wait', date:md('2026-09-19')},
      {id:'po3', code:'PO-0029', qp:'qs3', brand:'Rạng Đông', items:[{p:'p2', q:20}], status:'received', date:md('2026-09-12')}
    ]};
  const W = (id, cat, title, updated, mdText, by = 'ta') => ({id, cat, title, updated:md(updated), by, md:mdText});
  s.wiki = {cur:'intro', cats:['Sổ tay nhân viên','Nội quy công ty','Quy trình làm việc','Biểu mẫu & tài liệu'], pages:[
    W('intro','Sổ tay nhân viên','Giới thiệu công ty','2026-09-12',`Công ty TNHH Xây dựng SiteFlow hoạt động trong lĩnh vực thi công xây dựng dân dụng & công nghiệp, tổng thầu và quản lý dự án. Toàn bộ quy trình công trường — từ lập tiến độ, chấm công theo địa điểm đến kiểm soát dòng tiền — được số hoá để giảm sai sót và rút ngắn thời gian ra quyết định.

## Thông tin công ty
| Mục | Nội dung |
| Tên công ty | Công ty TNHH Xây dựng SiteFlow |
| Địa chỉ trụ sở | 123 Đại lộ Nguyễn Văn Linh, Quận 7, TP.HCM |
| Ngày thành lập | 15/03/2016 |
| Lĩnh vực | Thi công xây dựng, tổng thầu, quản lý dự án |

## Tầm nhìn & sứ mệnh
Trở thành nhà thầu xây dựng dân dụng hàng đầu khu vực phía Nam, lấy **chất lượng công trình** và **minh bạch tài chính** làm nền tảng cho mọi dự án.

## Cơ cấu tổ chức
- Ban Giám đốc
- Ban chỉ huy công trường
- Phòng Kỹ thuật & Thiết kế
- Phòng Kế toán — Tài chính
- Phòng Nhân sự
- Phòng Mua hàng & Cung ứng

## Liên hệ nội bộ
> Hotline IT nội bộ: nhánh 1 · Nhân sự: nhánh 2 · An toàn lao động: nhánh 3 (trực 24/7)`),
    W('culture','Sổ tay nhân viên','Văn hoá & giá trị cốt lõi','2026-08-02',`Bốn giá trị cốt lõi định hướng cách chúng ta làm việc mỗi ngày trên công trường và tại văn phòng.

## An toàn là ưu tiên số một
Không đánh đổi tiến độ lấy an toàn. Mọi công trường đều có quyền dừng thi công khi phát hiện rủi ro.

## Minh bạch số liệu
Tiến độ, chấm công và chi phí được ghi nhận đúng thời điểm phát sinh, ai cũng xem được phần việc của mình.

## Chủ động giải quyết
Phát hiện vấn đề thì báo ngay kèm đề xuất xử lý, không đợi đến buổi giao ban.

## Tôn trọng khách hàng & đồng nghiệp
Giữ lời hứa về thời gian, chất lượng và thái độ trong mọi tương tác.`),
    W('salary','Sổ tay nhân viên','Chính sách lương thưởng','2026-07-20',`## Kỳ trả lương
Lương được chi trả vào **ngày 5 hằng tháng** qua tài khoản ngân hàng. Nếu trùng ngày nghỉ, chi trả vào ngày làm việc liền trước.

## Cấu trúc thu nhập
- Lương cơ bản theo hợp đồng
- Phụ cấp công trường, xăng xe, điện thoại
- Thưởng tiến độ theo mốc nghiệm thu dự án
- Điểm thưởng nhiệm vụ đổi quà (xem tab Nhiệm vụ)

## Xét tăng lương
Xét định kỳ 1 lần/năm vào tháng 3 dựa trên đánh giá hiệu quả công việc.`),
    W('leave','Sổ tay nhân viên','Chế độ nghỉ phép','2026-06-15',`## Số ngày phép
- Nhân viên chính thức: **12 ngày/năm**, cộng thêm 1 ngày cho mỗi 5 năm công tác
- Phép chưa dùng được chuyển sang quý 1 năm sau

## Cách xin nghỉ
1. Tạo đơn trên SiteFlow (mục Chấm công) trước ít nhất 3 ngày làm việc
2. Quản lý trực tiếp duyệt trong 24 giờ
3. Nghỉ đột xuất: báo qua Chat cho quản lý trước 7h sáng

> Công nhân công trường cần báo tổ trưởng để bố trí người thay ca.`),
    W('rules','Nội quy công ty','Nội quy lao động','2026-05-10',`## Giờ làm việc
- Văn phòng: 8:00 – 17:30, nghỉ trưa 12:00 – 13:00
- Công trường: 7:00 – 17:00, nghỉ trưa 11:30 – 13:00

## Chấm công
Chấm công bằng ứng dụng tại vị trí công trường (bán kính 100m). Chấm công ngoài vùng phải được giám sát duyệt.

## Các hành vi bị nghiêm cấm
- Sử dụng rượu bia, chất kích thích trong giờ làm việc
- Tự ý mang vật tư, thiết bị ra khỏi công trường
- Làm việc trên cao khi không đeo dây an toàn`),
    W('safety','Nội quy công ty','Quy định an toàn lao động','2026-09-01',`## Trang bị bắt buộc
- Mũ bảo hộ, giày bảo hộ, áo phản quang
- Dây an toàn toàn thân khi làm việc từ 2m trở lên
- Kính, găng tay theo từng công việc (cắt, hàn, trộn vữa)

## Điểm danh an toàn hằng ngày
Mỗi sáng tổ trưởng kiểm tra trang bị và bấm **Điểm danh an toàn** trên SiteFlow. Chuỗi ngày không sự cố được cộng điểm thưởng.

## Khi có sự cố
1. Dừng thi công khu vực, sơ cứu và gọi hotline an toàn
2. Báo chỉ huy trưởng trong 15 phút
3. Lập biên bản theo mẫu trong mục Biểu mẫu`, 'tl'),
    W('dress','Nội quy công ty','Trang phục & tác phong','2026-04-02',`## Văn phòng
Trang phục lịch sự; thứ Sáu được mặc áo đồng phục công ty.

## Công trường
Mặc đồng phục và đầy đủ bảo hộ trong suốt ca làm việc. Giữ gìn vệ sinh khu vực thi công sau mỗi ca.`),
    W('att-proc','Quy trình làm việc','Chấm công & xin nghỉ','2026-09-05',`## Chấm công hằng ngày
1. Mở SiteFlow trên điện thoại khi đến công trường
2. Bấm **Chấm công vào** khi ở trong bán kính công trường
3. Cuối ca bấm **Chấm công ra**

## Ngoài vùng
Nếu làm việc ở vị trí khác (kho, nhà cung cấp), ghi chú lý do để giám sát duyệt trong ngày.`, 'dp'),
    W('expense','Quy trình làm việc','Duyệt chi phí','2026-08-22',`## Hạn mức duyệt
| Giá trị | Người duyệt |
| Dưới 20 triệu | Chỉ huy trưởng |
| 20 – 200 triệu | Quản lý dự án |
| Trên 200 triệu | Giám đốc |

## Các bước
1. Tạo hoá đơn / đề nghị thanh toán trong mục Tài chính, gắn với công việc trong tiến độ
2. Người duyệt kiểm tra ngân sách hạng mục còn lại
3. Kế toán thanh toán và cập nhật dòng tiền`, 'bn'),
    W('accept','Quy trình làm việc','Nghiệm thu công việc','2026-08-10',`## Nghiệm thu nội bộ
Tổ trưởng tự kiểm tra, chụp ảnh và đánh dấu hoàn thành nhiệm vụ trên SiteFlow.

## Nghiệm thu với tư vấn giám sát
1. Chỉ huy trưởng đặt lịch nghiệm thu trước 1 ngày
2. Lập biên bản theo mẫu, ký xác nhận
3. Cập nhật tiến độ 100% và mốc nghiệm thu trong Gantt — hệ thống tự nhắc Kế toán thu đợt tiếp theo`),
    W('incident','Quy trình làm việc','Xử lý sự cố công trường','2026-07-01',`## Phân loại
- **Nhẹ**: không ảnh hưởng người — xử lý tại chỗ, báo cáo cuối ngày
- **Trung bình**: hư hỏng vật tư, chậm tiến độ — báo chỉ huy trưởng trong 1 giờ
- **Nghiêm trọng**: tai nạn lao động — dừng thi công, báo ngay Ban Giám đốc`),
    W('f-leave','Biểu mẫu & tài liệu','Mẫu đơn xin nghỉ phép','2026-06-15',`Dùng khi không thể tạo đơn trực tiếp trên ứng dụng.

## Nội dung cần có
- Họ tên, bộ phận / đội
- Thời gian nghỉ (từ ngày – đến ngày)
- Lý do nghỉ
- Người nhận bàn giao công việc`, 'dp'),
    W('f-accept','Biểu mẫu & tài liệu','Mẫu biên bản nghiệm thu','2026-08-10',`## Thành phần
- Đại diện nhà thầu: chỉ huy trưởng, tổ trưởng
- Đại diện tư vấn giám sát
- Đại diện chủ đầu tư (nếu có)

## Nội dung
Hạng mục, khối lượng, đánh giá chất lượng, kết luận đạt / không đạt, yêu cầu sửa chữa (nếu có).`),
    W('f-advance','Biểu mẫu & tài liệu','Mẫu đề nghị tạm ứng','2026-05-20',`## Thông tin cần điền
- Người đề nghị, bộ phận
- Số tiền tạm ứng và mục đích
- Công việc / dự án gắn kèm
- Thời hạn hoàn ứng (tối đa 15 ngày)`, 'bn')
  ]};
});

/* ================= TÀI CHÍNH ================= */
const GROUPS = ['Nhân công','Vật tư','Thầu phụ','Thiết bị & quản lý'];
const invOverdue = i => i.status !== 'paid' && daysLeft(i.due) < 0;
function invState(i){
  if (i.status === 'paid') return [i.kind === 'in' ? 'Đã thu' : 'Đã thanh toán', 'green'];
  if (invOverdue(i)) return ['Quá hạn ' + (-daysLeft(i.due)) + ' ngày', 'red'];
  return [i.kind === 'in' ? 'Chờ thu' : 'Chờ thanh toán', i.kind === 'in' ? 'blue' : 'yellow'];
}
function finStats(pid){
  const f = S.fin[pid];
  if (!f) return {budget:(proj(pid) || {}).budget || 0, spent:0, cash:0, fc:[[0,0],[0,0],[0,0],[0,0]], net4:0, overdue:[], recv:0};
  const fc4 = f.fc.slice(0, 4);
  return {budget:sum(f.budget, b => b.b), spent:sum(f.budget, b => b.s), cash:f.cash, fc:f.fc, net4:sum(fc4, x => x[0] - x[1]), overdue:f.inv.filter(invOverdue), recv:sum(f.inv.filter(i => i.kind === 'in' && i.status !== 'paid'), i => i.amount)};
}
function finTemplate(p){
  const b = p.budget || 1000, split = [['Nhân công','Nhân công thi công',.3],['Vật tư','Vật tư chính',.35],['Thầu phụ','Thầu phụ MEP',.2],['Thiết bị & quản lý','Quản lý & phát sinh',.15]];
  return {cash:0, budget:split.map(([g, n, r]) => ({id:uid(), g, name:n, b:Math.round(b * r), s:0})), inv:[], fc:Array.from({length:8}, (_, i) => [i % 3 === 0 ? Math.round(b * .1) : 0, Math.round(b * .04)])};
}
const budState = b => { const r = b.s / b.b; return r > 1 ? ['Vượt NS','red'] : r >= .9 ? ['Sắp hết','yellow'] : ['Trong NS','green']; };
MOD.fin = () => {
  const p = proj(S.pid) || S.projects[0], f = S.fin[p.id];
  const cur = sub('fin', 'overview');
  if (!f) return head('Tài chính', esc(p.name)) + `<div class="card pad empty">Dự án chưa có ngân sách. <button class="btn sm" data-act="setup-go" data-id="${p.id}">Thiết lập thi công</button></div>`;
  const st = finStats(p.id), over = f.budget.filter(b => b.s > b.b);
  const tabs = subtabs('fin', [['overview','Tổng quan'],['budget','Ngân sách'],['invoices','Hoá đơn', st.overdue.length],['cash','Dòng tiền']], 'overview');
  const fcChart = (line, h = 240) => {
    let bal = f.cash; const bals = f.fc.map(x => bal += x[0] - x[1]);
    return barChart({labels:f.fc.map((_, i) => 'T' + (i + 1)), series:[{name:'Thu', c:'var(--green)', values:f.fc.map(x => x[0])}, {name:'Chi', c:'var(--orange)', values:f.fc.map(x => x[1])}], fmt:v => v >= 1000 ? dec(v / 1000, 1) + 'k' : Math.round(v), h, line:line ? {name:'Tồn quỹ', c:'var(--purple)', values:bals} : null, lineFmt:trd});
  };
  const invRow = i => { const s = invState(i); return `<tr class="click" data-act="inv" data-id="${i.id}" tabindex="0"><td class="b num">${esc(i.code)}</td><td>${esc(i.partner)}</td><td>${pill(i.kind === 'in' ? 'Thu' : 'Chi', i.kind === 'in' ? 'green' : 'orange')}</td><td class="r b">${trd(i.amount)}</td><td class="num">${fmtDate(i.due)}</td><td>${esc(i.task)}</td><td>${pill(...s)}</td><td class="r">${i.status !== 'paid' ? `<button class="btn line sm" data-act="inv-pay" data-id="${i.id}">${i.kind === 'in' ? 'Đã thu' : 'Đã trả'}</button>` : ''}</td></tr>`; };
  const invHead = '<thead><tr><th>Mã</th><th>Đối tác</th><th>Loại</th><th class="r">Số tiền</th><th>Hạn</th><th>Gắn với công việc</th><th>Trạng thái</th><th></th></tr></thead>';
  let body;
  if (cur === 'overview'){
    const end = f.cash + sum(f.fc, x => x[0] - x[1]);
    body = `<div class="stats">
      ${stat('Tổng ngân sách', trd(st.budget), esc(p.name))}
      ${stat('Đã chi thực tế', trd(st.spent), Math.round(st.spent / st.budget * 100) + '% ngân sách')}
      ${stat('Còn lại', trd(st.budget - st.spent), Math.round((1 - st.spent / st.budget) * 100) + '% ngân sách')}
      ${stat('Công nợ phải thu', trd(st.recv), st.overdue.filter(i => i.kind === 'in').length ? trd(sum(st.overdue.filter(i => i.kind === 'in'), i => i.amount)) + ' quá hạn' : 'không có quá hạn', st.overdue.length ? 'bad' : '')}
    </div>
    <div class="grid-3-2">
      <div class="card pad"><h2 class="sec-title">Dự báo dòng tiền — 8 tuần tới ${legend([['var(--green)','Thu'],['var(--orange)','Chi']])}</h2>${fcChart(false)}<div class="small muted">Đơn vị: triệu đồng / tuần. Tồn quỹ dự kiến cuối kỳ: <b style="color:var(--ink)">${trd(end)}</b> — hiện tại ${trd(f.cash)} (${end >= f.cash ? '+' : ''}${trd(end - f.cash)}).</div></div>
      <div class="card pad stack"><h2 class="sec-title" style="margin:0">Ngân sách theo hạng mục <button class="link" data-act="sub" data-view="fin" data-k="budget">Chi tiết</button></h2>
        ${GROUPS.map(g => { const items = f.budget.filter(b => b.g === g); if (!items.length) return ''; const b = sum(items, x => x.b), s2 = sum(items, x => x.s); return `<div><div class="kpi-row"><span>${g}</span><span>${trd(s2)} / ${trd(b)}</span></div>${bar(s2 / b * 100, s2 > b ? 'var(--red)' : s2 / b >= .9 ? 'var(--yellow)' : 'var(--green)', 'thick')}${s2 > b ? `<div class="kpi-note late">Vượt ngân sách ${trd(s2 - b)}</div>` : ''}</div>`; }).join('')}
      </div>
    </div>
    <div class="card list-card"><h2 class="sec-title">Hoá đơn & công nợ <button class="link" data-act="sub" data-view="fin" data-k="invoices">Tất cả hoá đơn</button></h2>
      ${[...f.inv].sort((a, b) => (a.status === 'paid') - (b.status === 'paid') || a.due.localeCompare(b.due)).slice(0, 5).map(i => { const s2 = invState(i); return `<button class="li" data-act="inv" data-id="${i.id}"><span class="sq" style="--c:${cv(i.kind === 'in' ? 'green' : 'orange')};--t:${ct(i.kind === 'in' ? 'green' : 'orange')}">${ic('file', 16)}</span><span class="ell"><b>${esc(i.code)} · ${esc(i.partner)}</b><small>${esc(i.task)} · hạn ${fmtDate(i.due)}</small></span><span class="end"><b class="num">${trd(i.amount)}</b>${pill(...s2)}</span></button>`; }).join('')}
    </div>`;
  } else if (cur === 'budget'){
    const committed = st.spent + sum(f.inv.filter(i => i.kind === 'out' && i.status !== 'paid'), i => i.amount);
    body = `<div class="stats">
      ${stat('Tổng ngân sách', trd(st.budget), f.budget.length + ' hạng mục chi phí')}
      ${stat('Đã chi / cam kết', trd(committed), Math.round(committed / st.budget * 100) + '% ngân sách')}
      ${stat('Còn lại', trd(st.budget - committed), Math.round((1 - committed / st.budget) * 100) + '% ngân sách')}
      ${stat('Hạng mục vượt NS', over.length, over.map(b => esc(b.name)).join(' · ') || 'Không có', over.length ? 'bad' : 'good')}
    </div>
    <div class="row between"><h2 class="sec-title" style="margin:0">Ngân sách theo hạng mục chi phí</h2><button class="btn sm" data-act="bud-new">${ic('plus', 14)}Thêm hạng mục</button></div>
    <div class="table-wrap"><table><thead><tr><th>Hạng mục</th><th class="r">Ngân sách</th><th class="r">Đã chi</th><th class="r">Còn lại</th><th style="width:170px">% sử dụng</th><th>Trạng thái</th></tr></thead><tbody>
      ${GROUPS.map(g => { const items = f.budget.filter(b => b.g === g); return items.length ? `<tr class="grp"><td colspan="6">${g}</td></tr>` + items.map(b => { const r = Math.round(b.s / b.b * 100), s2 = budState(b); return `<tr class="click" data-act="bud" data-id="${b.id}" tabindex="0"><td>${esc(b.name)}</td><td class="r">${trd(b.b)}</td><td class="r">${trd(b.s)}</td><td class="r ${b.b - b.s < 0 ? 'late' : ''}">${trd(b.b - b.s)}</td><td><div class="row"><div style="flex:1">${bar(r, cv(s2[1]))}</div><span class="small num">${r}%</span></div></td><td>${pill(...s2)}</td></tr>`; }).join('') : ''; }).join('')}
    </tbody></table></div>`;
  } else if (cur === 'invoices'){
    const ff = ui.invF || 'all';
    const rows = f.inv.filter(i => ff === 'all' || (ff === 'in' ? i.kind === 'in' && i.status !== 'paid' : ff === 'out' ? i.kind === 'out' && i.status !== 'paid' : ff === 'late' ? invOverdue(i) : i.status === 'paid'));
    const paid = f.inv.filter(i => i.status === 'paid');
    body = `<div class="stats">
      ${stat('Phải thu (khách hàng)', trd(sum(f.inv.filter(i => i.kind === 'in' && i.status !== 'paid'), i => i.amount)), f.inv.filter(i => i.kind === 'in' && i.status !== 'paid').length + ' hoá đơn chưa thu')}
      ${stat('Phải trả (NCC/thầu phụ)', trd(sum(f.inv.filter(i => i.kind === 'out' && i.status !== 'paid'), i => i.amount)), f.inv.filter(i => i.kind === 'out' && i.status !== 'paid').length + ' hoá đơn chờ thanh toán')}
      ${stat('Quá hạn', trd(sum(st.overdue, i => i.amount)), st.overdue.length + ' hoá đơn', st.overdue.length ? 'bad' : '')}
      ${stat('Đã tất toán', trd(sum(paid, i => i.amount)), trd(sum(paid.filter(i => i.kind === 'in'), i => i.amount)) + ' thu · ' + trd(sum(paid.filter(i => i.kind === 'out'), i => i.amount)) + ' chi')}
    </div>
    <div class="row between" style="flex-wrap:wrap;gap:8px"><div class="toolbar">${[['all','Tất cả'],['in','Phải thu'],['out','Phải trả'],['late','Quá hạn'],['paid','Đã tất toán']].map(([k, l]) => `<button class="fchip ${ff === k ? 'on' : ''}" data-act="inv-f" data-f="${k}">${l}</button>`).join('')}</div><button class="btn sm" data-act="inv-new">${ic('plus', 14)}Tạo hoá đơn</button></div>
    <div class="table-wrap"><table>${invHead}<tbody>${rows.map(invRow).join('') || '<tr><td colspan="8" class="empty">Không có hoá đơn</td></tr>'}</tbody></table></div>`;
  } else {
    let bal = f.cash; const weeks = f.fc.map(x => { bal += x[0] - x[1]; return [...x, bal]; });
    const monday = addDays(todayISO(), -((today0().getDay() + 6) % 7));
    body = `<div class="stats">
      ${stat('Tồn quỹ hiện tại', trd(f.cash), 'Cập nhật hôm nay')}
      ${stat('Dự kiến cuối kỳ (8 tuần)', trd(bal), (bal >= f.cash ? '+' : '') + trd(bal - f.cash), bal >= f.cash ? 'good' : 'bad')}
      ${stat('Tổng thu dự kiến', trd(sum(f.fc, x => x[0])), '8 tuần tới')}
      ${stat('Tổng chi dự kiến', trd(sum(f.fc, x => x[1])), '8 tuần tới')}
    </div>
    <div class="card pad"><h2 class="sec-title">Dự báo dòng tiền chi tiết — 8 tuần tới ${legend([['var(--green)','Thu'],['var(--orange)','Chi'],['var(--purple)','Tồn quỹ','line']])}</h2>${fcChart(true, 260)}<div class="small muted">Đường tồn quỹ vẽ trên thang riêng để thấy rõ xu hướng. Bấm vào ô Thu / Chi trong bảng để sửa dự báo.</div></div>
    <div class="table-wrap"><table><thead><tr><th>Tuần</th><th class="r">Thu (tr)</th><th class="r">Chi (tr)</th><th class="r">Ròng</th><th class="r">Tồn quỹ cuối tuần</th></tr></thead><tbody>
      ${weeks.map((w, i) => `<tr><td>Tuần ${i + 1} <span class="small muted">(${fmtDate(addDays(monday, i * 7))})</span></td><td class="r"><input class="num" style="width:90px;text-align:right;border:1px solid var(--line);border-radius:8px;height:30px;padding:0 8px;background:var(--card)" type="number" value="${w[0]}" data-change="fc" data-i="${i}" data-k="0" aria-label="Thu tuần ${i + 1}"></td><td class="r"><input class="num" style="width:90px;text-align:right;border:1px solid var(--line);border-radius:8px;height:30px;padding:0 8px;background:var(--card)" type="number" value="${w[1]}" data-change="fc" data-i="${i}" data-k="1" aria-label="Chi tuần ${i + 1}"></td><td class="r ${w[0] - w[1] < 0 ? 'late' : ''}">${w[0] - w[1] >= 0 ? '+' : ''}${trd(w[0] - w[1])}</td><td class="r b">${trd(w[2])}</td></tr>`).join('')}
    </tbody></table></div>`;
  }
  return head('Tài chính & dòng tiền', esc(p.name) + ' — ngân sách, hoá đơn, công nợ và dự báo dòng tiền.') + tabs + body;
};
const curFin = () => S.fin[S.pid];
CHG.fc = el => { curFin().fc[+el.dataset.i][+el.dataset.k] = Math.max(0, +el.value || 0); render(); };
ACT['inv-f'] = (el, d) => { ui.invF = d.f; render(); };
ACT['inv-pay'] = (el, d, e) => {
  e.stopPropagation();
  const f = curFin(), i = f.inv.find(x => x.id === d.id);
  i.status = 'paid'; f.cash += i.kind === 'in' ? i.amount : -i.amount;
  if (i.kind === 'out'){ const b = f.budget.find(x => x.name === i.task) || null; if (b) b.s += i.amount; }
  log(`${i.code}: ${i.kind === 'in' ? 'đã thu' : 'đã thanh toán'} ${trd(i.amount)}`, 'yellow');
  render(); toast(`${i.code} — ${i.kind === 'in' ? 'đã thu' : 'đã thanh toán'} ${trd(i.amount)}`);
};
ACT.inv = (el, d) => invModal(curFin().inv.find(x => x.id === d.id));
ACT['inv-new'] = () => invModal(null);
function invModal(i){
  const f = curFin(), tasks = allTasks(S.pid).filter(t => !t.ms).map(t => t.name).concat(f.budget.map(b => b.name));
  const next = k => (k === 'in' ? 'INV-' : 'BILL-') + pad(Math.max(0, ...f.inv.filter(x => x.kind === k).map(x => +x.code.split('-')[1] || 0)) + 1).padStart(4, '0');
  i = i || {id:'', code:next('in'), partner:'', kind:'in', amount:100, due:dayISO(14), task:'', status:'pending'};
  showModal(`<form class="modal" data-form="inv" data-id="${i.id}">
    <h3>${i.id ? 'Hoá đơn ' + esc(i.code) : 'Tạo hoá đơn'}${closeBtn()}</h3>
    <div class="row2"><label class="field">Loại<select id="iv-kind" name="kind">${opt([['in','Thu — khách hàng'],['out','Chi — NCC / thầu phụ']], i.kind)}</select></label><label class="field">Mã<input id="iv-code" name="code" required value="${esc(i.code)}"></label></div>
    <label class="field">Đối tác<input id="iv-partner" name="partner" required value="${esc(i.partner)}"></label>
    <div class="row2"><label class="field">Số tiền (triệu đồng)<input id="iv-amount" type="number" min="0" name="amount" required value="${i.amount}"></label><label class="field">Hạn thanh toán<input id="iv-due" type="date" name="due" required value="${i.due}"></label></div>
    <label class="field">Gắn với công việc / hạng mục<input id="iv-task" name="task" list="iv-tasks" value="${esc(i.task)}"></label>
    <datalist id="iv-tasks">${[...new Set(tasks)].map(t => `<option value="${esc(t)}">`).join('')}</datalist>
    <label class="field">Trạng thái<select id="iv-status" name="status">${opt([['pending','Chưa tất toán'],['paid','Đã tất toán']], i.status)}</select></label>
    <div class="m-actions">${i.id ? delBtn('inv') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">${i.id ? 'Lưu' : 'Tạo hoá đơn'}</button></div>
  </form>`);
}
FORM.inv = (v, fm) => {
  const f = curFin(); let i = f.inv.find(x => x.id === fm.dataset.id);
  const data = {code:v.code.trim(), partner:v.partner.trim(), kind:v.kind, amount:+v.amount || 0, due:v.due, task:v.task, status:v.status};
  if (i){ if (i.status !== 'paid' && data.status === 'paid') f.cash += data.kind === 'in' ? data.amount : -data.amount; Object.assign(i, data); }
  else { i = {id:uid(), ...data}; f.inv.push(i); if (i.status === 'paid') f.cash += i.kind === 'in' ? i.amount : -i.amount; log('Tạo hoá đơn ' + i.code, 'yellow'); }
  closeModal(); render(); toast('Đã lưu hoá đơn ' + i.code);
};
DEL.inv = id => { const f = curFin(); f.inv = f.inv.filter(x => x.id !== id); };
ACT.bud = (el, d) => budModal(curFin().budget.find(x => x.id === d.id));
ACT['bud-new'] = () => budModal(null);
function budModal(b){
  b = b || {id:'', g:'Vật tư', name:'', b:100, s:0};
  showModal(`<form class="modal" data-form="bud" data-id="${b.id}"><h3>${b.id ? esc(b.name) : 'Thêm hạng mục chi phí'}${closeBtn()}</h3>
    <div class="row2"><label class="field">Nhóm<select id="bd-g" name="g">${opt(GROUPS, b.g)}</select></label><label class="field">Tên hạng mục<input id="bd-name" name="name" required value="${esc(b.name)}"></label></div>
    <div class="row2"><label class="field">Ngân sách (triệu)<input id="bd-b" type="number" min="0" name="b" required value="${b.b}"></label><label class="field">Đã chi (triệu)<input id="bd-s" type="number" min="0" name="s" value="${b.s}"></label></div>
    <div class="m-actions">${b.id ? delBtn('bud') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu</button></div></form>`);
}
FORM.bud = (v, fm) => {
  const f = curFin(); const b = f.budget.find(x => x.id === fm.dataset.id);
  const data = {g:v.g, name:v.name.trim(), b:+v.b || 0, s:+v.s || 0};
  if (b) Object.assign(b, data); else f.budget.push({id:uid(), ...data});
  if (data.s > data.b) botPost('Vượt ngân sách', `Hạng mục “${data.name}” đã chi ${trd(data.s)} / ${trd(data.b)}.`, 'red', 'Module Tài chính', 'fin', 'budget');
  closeModal(); render(); toast('Đã lưu ngân sách');
};
DEL.bud = id => { const f = curFin(); f.budget = f.budget.filter(x => x.id !== id); };
SEARCH.push(hit => Object.entries(S.fin).flatMap(([pid, f]) => f.inv.filter(i => hit(i.code + ' ' + i.partner)).map(i => ({icon:'file', label:i.code + ' · ' + i.partner, sub:'Hoá đơn · ' + trd(i.amount), run:() => { S.pid = pid; nav('fin', 'invoices'); invModal(i); }}))));

/* ================= QS ================= */
const prod = id => S.qs.products.find(p => p.id === id);
const roomTotal = r => sum(r.items, it => (prod(it.p) || {price:0}).price * it.q);
const qsTotal = q => sum(q.rooms, roomTotal);
const QST = {draft:['Bản nháp','gray'], doing:['Đang bóc','yellow'], done:['Hoàn tất','green']};
const qsProgress = q => q.status === 'done' ? 100 : Math.min(95, q.rooms.filter(r => r.items.length).length * 15 + (q.status === 'doing' ? 20 : 5));
const curQs = () => S.qs.projects.find(q => q.id === S.qs.cur) || S.qs.projects[0];
const CATS = ['Đèn âm trần','Đèn spotlight','Đèn trang trí','Đèn ốp trần','Đèn hắt','Đèn âm tường','Đèn chùm','Đèn gương'];
const BRANDS = ['Rạng Đông','Philips','MPE','Điện Quang','Hồng Phúc'];
const WR = [['<10','<10W',0,9.99],['10-20','10–20W',10,20],['20-40','20–40W',20.01,40],['>40','>40W',40.01,1e9]];
const AR = [['<60','<60°',0,59],['60-120','60–120°',60,120],['>120','>120°',121,999]];
function prodMatch(p){
  const f = S.qs.filt;
  if (f.q && !(p.name + ' ' + p.brand).toLowerCase().includes(f.q.toLowerCase())) return false;
  if (f.cat && p.cat !== f.cat) return false;
  if (f.brands.length && !f.brands.includes(p.brand)) return false;
  if (f.w){ const r = WR.find(x => x[0] === f.w); if (p.w < r[2] || p.w > r[3]) return false; }
  if (f.k && p.k !== +f.k) return false;
  if (f.a){ const r = AR.find(x => x[0] === f.a); if (p.a < r[2] || p.a > r[3]) return false; }
  if (f.fav && !p.fav) return false;
  if (f.min && p.price < +f.min * 1000) return false;
  if (f.max && p.price > +f.max * 1000) return false;
  return true;
}
MOD.qs = () => {
  const cur = sub('qs', 'overview'), Q = S.qs, q = curQs();
  const tabs = subtabs('qs', [['overview','Tổng quan'],['projects','Dự án'],['takeoff','Bóc tách chi phí'],['products','Danh sách sản phẩm'],['quote','Xuất báo giá'],['po','Mua hàng', Q.po.filter(p => p.status === 'wait').length]], 'overview');
  const qsSelect = `<select data-change="qs-cur" aria-label="Chọn hồ sơ bóc tách">${opt(Q.projects.map(x => [x.id, x.code + ' · ' + x.name]), q.id)}</select>`;
  let body;
  if (cur === 'overview'){
    const brands = {};
    Q.projects.forEach(x => x.rooms.forEach(r => r.items.forEach(it => { const p = prod(it.p); if (p) brands[p.brand] = (brands[p.brand] || 0) + p.price * it.q; })));
    const bl = Object.entries(brands).sort((a, b) => b[1] - a[1]), bmax = bl.length ? bl[0][1] : 1;
    body = `<div class="stats">
      ${stat('Dự án QS', Q.projects.length, Q.projects.filter(x => x.status === 'doing').length + ' đang bóc · ' + Q.projects.filter(x => x.status === 'draft').length + ' bản nháp · ' + Q.projects.filter(x => x.status === 'done').length + ' hoàn tất')}
      ${stat('Tổng giá trị bóc tách', dec(sum(Q.projects, qsTotal) / 1e6, 1) + ' triệu', 'Trên ' + Q.projects.length + ' dự án chiếu sáng')}
      ${stat('Đã xuất báo giá', Q.projects.filter(x => x.quoted).length, Q.projects.filter(x => x.quoted).map(x => esc(x.name)).join(', ') || '—')}
      ${stat('Đơn mua hàng đang chờ', Q.po.filter(p => p.status === 'wait').length, 'Cần đặt hàng trong tuần')}
    </div>
    <div class="grid-3-2">
      <div class="card list-card"><h2 class="sec-title">Dự án QS gần đây <button class="link" data-act="sub" data-view="qs" data-k="projects">Xem tất cả ›</button></h2>
        ${[...Q.projects].sort((a, b) => b.created.localeCompare(a.created)).map(x => `<button class="li" data-act="qs-open" data-id="${x.id}"><span class="sq" style="--c:var(--purple);--t:var(--purple-t)">${ic('ruler', 16)}</span><span class="ell"><b>${esc(x.name)}</b><small>${esc(x.client)} · ${fmtDate(x.created)}</small></span><span class="end">${pill(...QST[x.status])}<div class="small num" style="margin-top:4px">${vnd(qsTotal(x))}</div></span></button>`).join('')}</div>
      <div class="card pad stack"><h2 class="sec-title" style="margin:0">Top thương hiệu sử dụng</h2>${bl.map(([b, v]) => `<div><div class="kpi-row"><span>${esc(b)}</span><span>${dec(v / 1e6, 2)}tr</span></div>${bar(v / bmax * 100, 'var(--purple)')}</div>`).join('')}</div>
    </div>`;
  } else if (cur === 'projects'){
    body = `<div class="row between"><h2 class="sec-title" style="margin:0">Hồ sơ bóc tách</h2><button class="btn sm" data-act="qs-new">${ic('plus', 14)}Tạo dự án</button></div>
    <div class="table-wrap"><table><thead><tr><th>Mã</th><th>Tên dự án</th><th>Khách hàng</th><th>Điện thoại</th><th>Địa chỉ</th><th>Ngày tạo</th><th style="width:130px">Tiến độ</th><th class="r">Giá trị</th><th>Trạng thái</th></tr></thead><tbody>
      ${Q.projects.map(x => `<tr class="click" data-act="qs-open" data-id="${x.id}" tabindex="0"><td class="b num">${esc(x.code)}</td><td class="b">${esc(x.name)}</td><td>${esc(x.client)}</td><td class="num">${esc(x.phone)}</td><td>${esc(x.addr)}</td><td>${fmtDate(x.created)}</td><td><div class="row"><div style="flex:1">${bar(qsProgress(x), 'var(--purple)')}</div><span class="small num">${qsProgress(x)}%</span></div></td><td class="r">${vnd(qsTotal(x))}</td><td>${pill(...QST[x.status])}</td></tr>`).join('')}
    </tbody></table><div class="foot-note">Bấm vào dòng để mở bảng bóc tách.</div></div>`;
  } else if (cur === 'takeoff'){
    const room = Q.room === 'all' ? null : q.rooms.find(r => r.id === Q.room);
    const shown = room ? [room] : q.rooms;
    const sub_ = qsTotal(q), vat = sub_ * Q.vat / 100;
    body = `<div class="card pad row between" style="flex-wrap:wrap;gap:10px"><div class="row" style="flex-wrap:wrap">${qsSelect}<span class="small muted">${esc(q.client)} · ${esc(q.addr)}</span>${pill(...QST[q.status])}</div>
      <div class="row"><label class="small muted row" style="gap:6px">VAT<select data-change="qs-vat">${opt([[0,'0%'],[8,'8%'],[10,'10%']], Q.vat)}</select></label><button class="btn line sm" data-act="room-new">${ic('plus', 14)}Thêm phòng</button><button class="btn sm" data-act="pick">${ic('plus', 14)}Thêm sản phẩm</button></div></div>
    <div class="qs-layout">
      <div class="card" style="padding:8px"><div class="small muted" style="padding:6px 10px">Danh sách phòng</div>
        <button class="room ${!room ? 'on' : ''}" data-act="room" data-id="all"><span>Tất cả (${q.rooms.length} phòng)</span><small>${dec(sub_ / 1e6, 2)}tr</small></button>
        ${q.rooms.map(r => `<button class="room ${room === r ? 'on' : ''}" data-act="room" data-id="${r.id}"><span>${esc(r.name)}</span><small>${dec(roomTotal(r) / 1e6, 2)}tr</small></button>`).join('')}
      </div>
      <div class="stack">
        <div class="table-wrap"><table><thead><tr><th>Sản phẩm</th><th>Thương hiệu</th><th>SL</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th><th></th></tr></thead><tbody>
          ${shown.map(r => `<tr class="grp"><td colspan="4">${esc(r.name)} ${room ? `<button class="link" data-act="room-edit" data-id="${r.id}">Đổi tên / xoá</button>` : ''}</td><td class="r">${vnd(roomTotal(r))}</td><td></td></tr>` + (r.items.map((it, i) => { const p = prod(it.p); return `<tr><td>${esc(p.name)}<div class="small muted">${esc(p.cat)} · ${p.w}W · ${p.k}K</div></td><td>${esc(p.brand)}</td><td><span class="stepper"><button data-act="qty" data-r="${r.id}" data-i="${i}" data-d="-1" aria-label="Giảm">${ic('minus', 13)}</button><input type="number" min="0" value="${it.q}" data-change="qty-set" data-r="${r.id}" data-i="${i}" aria-label="Số lượng ${esc(p.name)}"><button data-act="qty" data-r="${r.id}" data-i="${i}" data-d="1" aria-label="Tăng">${ic('plus', 13)}</button></span></td><td class="r">${num(p.price)}</td><td class="r b">${num(p.price * it.q)}</td><td class="r"><button class="icon-btn sm" data-act="item-del" data-r="${r.id}" data-i="${i}" aria-label="Xoá dòng">${ic('trash', 15)}</button></td></tr>`; }).join('') || `<tr><td colspan="6" class="small muted" style="text-align:center">Chưa có sản phẩm — <button class="link" data-act="pick" data-r="${r.id}">thêm sản phẩm</button></td></tr>`)).join('')}
        </tbody></table></div>
        <div class="card totals"><div><span class="muted">Tạm tính (${q.rooms.length} phòng)</span><span class="num">${vnd(sub_)}</span></div><div><span class="muted">VAT (${Q.vat}%)</span><span class="num">${vnd(vat)}</span></div><div class="grand"><span>Tổng cộng</span><span class="num">${vnd(sub_ + vat)}</span></div>
          <div style="margin-top:6px;gap:8px;justify-content:flex-end"><button class="btn line sm" data-act="sub" data-view="qs" data-k="po">Tạo đơn mua</button><button class="btn sm" data-act="sub" data-view="qs" data-k="quote">Xem báo giá ›</button></div></div>
      </div>
    </div>`;
  } else if (cur === 'products'){
    const F = Q.filt, list = Q.products.filter(prodMatch);
    const chips = (key, items, multi) => `<div class="chips">${items.map(([v, l]) => { const on = multi ? F[key].includes(v) : F[key] === v; return `<button class="fchip sm ${on ? 'on' : ''}" data-act="pf" data-k="${key}" data-v="${esc(v)}">${esc(l)}</button>`; }).join('')}</div>`;
    body = `<div class="prod-layout">
      <div class="card filters"><div class="row between"><b style="font-size:13px">${ic('filter', 15)} Bộ lọc</b><button class="link" data-act="pf-clear">Xoá lọc</button></div>
        <div><h4>Đề mục</h4><select data-change="pf-cat" style="width:100%;height:36px;border:1px solid var(--line);border-radius:10px;background:var(--card);padding:0 8px">${opt([['','Tất cả đề mục'], ...CATS], F.cat)}</select></div>
        <div><h4>Thương hiệu</h4>${chips('brands', BRANDS.map(b => [b, b]), true)}</div>
        <div><h4>Công suất</h4>${chips('w', WR.map(r => [r[0], r[1]]))}</div>
        <div><h4>Nhiệt độ màu</h4>${chips('k', [['3000','3000K'],['4000','4000K'],['6500','6500K']])}</div>
        <div><h4>Góc chiếu sáng</h4>${chips('a', AR.map(r => [r[0], r[1]]))}</div>
        <div><h4>Khác</h4><div class="chips"><button class="fchip sm ${F.fav ? 'on' : ''}" data-act="pf-fav">${ic('star', 13)}Yêu thích</button></div></div>
        <div><h4>Khoảng giá (nghìn đồng)</h4><div class="row"><input type="number" placeholder="Từ" value="${esc(F.min)}" data-change="pf-min" style="width:100%;height:34px;border:1px solid var(--line);border-radius:10px;padding:0 8px;background:var(--card)" aria-label="Giá từ">—<input type="number" placeholder="Đến" value="${esc(F.max)}" data-change="pf-max" style="width:100%;height:34px;border:1px solid var(--line);border-radius:10px;padding:0 8px;background:var(--card)" aria-label="Giá đến"></div></div>
      </div>
      <div class="stack">
        <div class="row between" style="flex-wrap:wrap;gap:8px"><div class="search" style="flex:1;min-width:200px">${ic('search', 15)}<input id="pf-q" data-input="pf-q" value="${esc(F.q)}" placeholder="Tìm tên sản phẩm, thương hiệu" aria-label="Tìm sản phẩm"></div><span class="small muted">${list.length} sản phẩm phù hợp · thêm vào: <b style="color:var(--ink)">${esc(q.code)}</b></span></div>
        <div class="prods">${list.map(p => `<div class="card prod"><div class="thumb" style="--c:var(--purple);--t:var(--purple-t)">${ic('bulb', 34)}</div>
          <div class="row between"><span class="small muted">${esc(p.brand)} · ${esc(p.cat)}</span><button class="star ${p.fav ? 'on' : ''}" data-act="fav" data-id="${p.id}" aria-label="Yêu thích">${ic('star', 16)}</button></div>
          <b>${esc(p.name)}</b><div class="spec">${pill(p.w + 'W', 'gray')}${pill(p.k + 'K', 'gray')}${pill(p.a + '°', 'gray')}</div>
          <div class="row between"><span class="val">${num(p.price)} đ</span><button class="btn sm" data-act="pick-add" data-p="${p.id}">${ic('plus', 13)}Thêm</button></div></div>`).join('') || '<div class="empty">Không có sản phẩm phù hợp bộ lọc</div>'}</div>
      </div></div>`;
  } else if (cur === 'quote'){
    const sub_ = qsTotal(q), vat = sub_ * Q.vat / 100;
    body = `<div class="card pad row between" style="flex-wrap:wrap;gap:10px"><div class="row">${qsSelect}${q.quoted ? pill('Đã gửi khách hàng', 'green') : pill('Chưa gửi', 'gray')}</div>
      <div class="row" style="flex-wrap:wrap"><button class="btn line sm" data-act="quote-copy">${ic('copy', 14)}Sao chép bảng (dán vào Excel)</button><button class="btn sm" data-act="quote-send" ${q.quoted ? 'disabled' : ''}>${ic('check', 14)}Đánh dấu đã gửi khách hàng</button></div></div>
    <div class="doc" id="quoteDoc">
      <div class="doc-head"><div><b style="font-size:15px">CÔNG TY TNHH XÂY DỰNG SITEFLOW</b><div style="color:#666;font-size:12px">123 Đại lộ Nguyễn Văn Linh, Q7, TP.HCM · Hotline: 1900 6868</div></div><div style="text-align:right;font-size:12px;color:#444">Số: ${esc(q.code)}/${parseD(todayISO()).getFullYear()}<br>Ngày: ${fmtFull(todayISO())}</div></div>
      <h2>BÁO GIÁ</h2>
      <div class="doc-info"><div><span style="color:#777">Khách hàng:</span> <b>${esc(q.client)}</b></div><div><span style="color:#777">Điện thoại:</span> ${esc(q.phone)}</div><div><span style="color:#777">Dự án:</span> ${esc(q.name)}</div><div><span style="color:#777">Địa chỉ:</span> ${esc(q.addr)}</div></div>
      <div style="overflow-x:auto"><table><thead><tr><th>Hạng mục / Sản phẩm</th><th class="r">SL</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th></tr></thead><tbody>
        ${q.rooms.filter(r => r.items.length).map(r => `<tr class="grp"><td colspan="4">${esc(r.name)}</td></tr>` + r.items.map(it => { const p = prod(it.p); return `<tr><td>${esc(p.name)} <span style="color:#888">(${esc(p.brand)})</span></td><td class="r">${it.q}</td><td class="r">${num(p.price)}</td><td class="r">${num(p.price * it.q)}</td></tr>`; }).join('')).join('')}
        <tr class="tot"><td colspan="3" class="r">Tạm tính</td><td class="r">${vnd(sub_)}</td></tr>
        <tr class="tot"><td colspan="3" class="r">VAT (${Q.vat}%)</td><td class="r">${vnd(vat)}</td></tr>
        <tr class="tot"><td colspan="3" class="r" style="font-size:15px">Tổng cộng</td><td class="r" style="font-size:15px">${vnd(sub_ + vat)}</td></tr>
      </tbody></table></div>
      <div style="font-size:12px;color:#666;margin-top:14px">Báo giá có hiệu lực 30 ngày. Giá đã bao gồm vận chuyển nội thành TP.HCM, chưa bao gồm nhân công lắp đặt.</div>
      <div class="sign"><div>ĐẠI DIỆN KHÁCH HÀNG<small>(Ký, ghi rõ họ tên)</small></div><div>ĐẠI DIỆN SITEFLOW<small>(Ký, đóng dấu)</small>${esc(person(S.me).name)}</div></div>
    </div>
    <div class="small muted" style="text-align:center">Xuất file Excel / PDF và gửi email trực tiếp sẽ có khi nối máy chủ. Hiện có thể sao chép bảng để dán vào Excel.</div>`;
  } else {
    const POS = {wait:['Chờ đặt hàng','yellow'], ordered:['Đã đặt hàng','blue'], received:['Đã nhận hàng','green']};
    body = `<div class="card pad row between" style="flex-wrap:wrap;gap:10px"><div class="row">${qsSelect}<span class="small muted">Gom sản phẩm trong bảng bóc tách theo thương hiệu thành đơn mua.</span></div><button class="btn sm" data-act="po-gen">${ic('cart', 14)}Tạo đơn từ bóc tách</button></div>
    <div class="table-wrap"><table><thead><tr><th>Mã đơn</th><th>Hồ sơ QS</th><th>Nhà cung cấp</th><th>Sản phẩm</th><th class="r">Giá trị</th><th>Ngày tạo</th><th>Trạng thái</th><th></th></tr></thead><tbody>
      ${[...Q.po].sort((a, b) => b.date.localeCompare(a.date)).map(o => { const qp = Q.projects.find(x => x.id === o.qp) || {code:'—'}; const v = sum(o.items, it => prod(it.p).price * it.q); return `<tr><td class="b num">${esc(o.code)}</td><td>${esc(qp.code)}</td><td>${esc(o.brand)}</td><td class="small">${o.items.map(it => esc(prod(it.p).name) + ' × ' + it.q).join('<br>')}</td><td class="r b">${vnd(v)}</td><td>${fmtDate(o.date)}</td><td>${pill(...POS[o.status])}</td><td class="r">${o.status !== 'received' ? `<button class="btn line sm" data-act="po-next" data-id="${o.id}">${o.status === 'wait' ? 'Đã đặt hàng' : 'Đã nhận hàng'}</button>` : ''}</td></tr>`; }).join('')}
    </tbody></table></div>`;
  }
  const qsApp = S.apps.find(x => x.id === 'qspro');
  return head('QS — Bóc tách & Báo giá', 'Bóc tách chi phí theo phòng, chọn sản phẩm từ danh mục, xuất báo giá và tạo đơn mua hàng.', qsApp ? `<button class="btn" data-act="nav" data-v="app-qspro">${ic('external', 15)}Mở QS Pro</button>` : '') + tabs + body;
};
CHG['qs-cur'] = el => { S.qs.cur = el.value; S.qs.room = 'all'; render(); };
CHG['qs-vat'] = el => { S.qs.vat = +el.value; render(); };
ACT['qs-open'] = (el, d) => { S.qs.cur = d.id; S.qs.room = 'all'; S.sub.qs = 'takeoff'; render(); };
ACT.room = (el, d) => { S.qs.room = d.id; render(); };
ACT.qty = (el, d) => { const r = curQs().rooms.find(x => x.id === d.r), it = r.items[+d.i]; it.q = Math.max(0, it.q + +d.d); if (!it.q) r.items.splice(+d.i, 1); qsTouch(); render(); };
CHG['qty-set'] = el => { const r = curQs().rooms.find(x => x.id === el.dataset.r); const it = r.items[+el.dataset.i]; it.q = Math.max(0, Math.round(+el.value || 0)); if (!it.q) r.items.splice(+el.dataset.i, 1); qsTouch(); render(); };
ACT['item-del'] = (el, d) => { curQs().rooms.find(x => x.id === d.r).items.splice(+d.i, 1); qsTouch(); render(); };
function qsTouch(){ const q = curQs(); if (q.status === 'draft') q.status = 'doing'; }
ACT['room-new'] = () => showModal(`<form class="modal" data-form="room"><h3>Thêm phòng${closeBtn()}</h3><label class="field">Tên phòng / khu vực<input id="rm-name" name="name" required placeholder="VD: Phòng ngủ 2" list="rm-list"></label><datalist id="rm-list">${['Phòng khách','Phòng bếp','Phòng ăn','Phòng ngủ master','Phòng ngủ 2','WC chung','Ban công','Sân vườn','Hành lang & cầu thang'].map(x => `<option value="${x}">`).join('')}</datalist><div class="m-actions"><button class="btn" type="submit">Thêm phòng</button></div></form>`);
FORM.room = (v, f) => {
  const q = curQs();
  if (f.dataset.id){ q.rooms.find(r => r.id === f.dataset.id).name = v.name.trim(); }
  else { const r = {id:uid(), name:v.name.trim(), items:[]}; q.rooms.push(r); S.qs.room = r.id; }
  closeModal(); render();
};
ACT['room-edit'] = (el, d) => { const r = curQs().rooms.find(x => x.id === d.id); showModal(`<form class="modal" data-form="room" data-id="${r.id}"><h3>${esc(r.name)}${closeBtn()}</h3><label class="field">Tên phòng<input id="rm-name" name="name" required value="${esc(r.name)}"></label><div class="m-actions">${delBtn('room')}<button class="btn" type="submit">Lưu</button></div></form>`); };
DEL.room = id => { const q = curQs(); q.rooms = q.rooms.filter(r => r.id !== id); S.qs.room = 'all'; };
ACT.pick = (el, d) => { ui.pickRoom = d.r || (S.qs.room !== 'all' ? S.qs.room : curQs().rooms[0] && curQs().rooms[0].id); ui.pickQ = ''; pickModal(); };
function pickModal(){
  const q = curQs(), s = (ui.pickQ || '').toLowerCase();
  if (!q.rooms.length) q.rooms.push({id:uid(), name:'Phòng khách', items:[]});
  if (!q.rooms.some(r => r.id === ui.pickRoom)) ui.pickRoom = q.rooms[0].id;
  const list = S.qs.products.filter(p => !s || (p.name + ' ' + p.brand + ' ' + p.cat).toLowerCase().includes(s));
  const html = `<div class="modal wide" id="pickM"><h3>Thêm sản phẩm vào bóc tách${closeBtn()}</h3>
    <div class="row" style="flex-wrap:wrap"><label class="field" style="flex:1;min-width:180px">Phòng<select data-change="pick-room">${opt(q.rooms.map(r => [r.id, r.name]), ui.pickRoom)}</select></label><label class="field" style="flex:2;min-width:200px">Tìm sản phẩm<input id="pick-q" data-input="pick-q" value="${esc(ui.pickQ || '')}" placeholder="Tên, thương hiệu, đề mục…"></label></div>
    <div class="stack" style="max-height:52vh;overflow:auto;gap:4px">${list.map(p => `<div class="li"><span class="sq" style="--c:var(--purple);--t:var(--purple-t)">${ic('bulb', 16)}</span><span class="ell"><b>${esc(p.name)}</b><small>${esc(p.brand)} · ${esc(p.cat)} · ${p.w}W · ${p.k}K</small></span><span class="end row"><span class="num small">${num(p.price)} đ</span><button class="btn sm" data-act="pick-add" data-p="${p.id}">${ic('plus', 13)}Thêm</button></span></div>`).join('')}</div>
    <div class="m-actions"><button class="btn" data-act="modal-close">Xong</button></div></div>`;
  if ($('#pickM')) { $('#modal').innerHTML = html; const i = $('#pick-q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); } else showModal(html);
}
INP['pick-q'] = el => { ui.pickQ = el.value; pickModal(); };
CHG['pick-room'] = el => { ui.pickRoom = el.value; };
ACT['pick-add'] = (el, d) => {
  const q = curQs();
  let r = q.rooms.find(x => x.id === ($('#pickM') ? ui.pickRoom : (S.qs.room !== 'all' ? S.qs.room : null))) || q.rooms[0];
  if (!r){ r = {id:uid(), name:'Phòng khách', items:[]}; q.rooms.push(r); }
  const it = r.items.find(x => x.p === d.p); if (it) it.q++; else r.items.push({p:d.p, q:1});
  qsTouch(); toast(`Đã thêm ${prod(d.p).name} vào ${r.name} (${q.code})`);
  if ($('#pickM')) save(); else render();
};
ACT.fav = (el, d) => { const p = prod(d.id); p.fav = !p.fav; render(); };
ACT.pf = (el, d) => { const F = S.qs.filt; if (d.k === 'brands'){ F.brands = F.brands.includes(d.v) ? F.brands.filter(x => x !== d.v) : F.brands.concat(d.v); } else F[d.k] = F[d.k] === d.v ? '' : d.v; render(); };
ACT['pf-fav'] = () => { S.qs.filt.fav = !S.qs.filt.fav; render(); };
ACT['pf-clear'] = () => { S.qs.filt = {cat:'', brands:[], w:'', k:'', a:'', fav:false, min:'', max:'', q:''}; render(); };
CHG['pf-cat'] = el => { S.qs.filt.cat = el.value; render(); };
CHG['pf-min'] = el => { S.qs.filt.min = el.value; render(); };
CHG['pf-max'] = el => { S.qs.filt.max = el.value; render(); };
INP['pf-q'] = el => { S.qs.filt.q = el.value; render(); const i = $('#pf-q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); };
ACT['qs-new'] = () => showModal(`<form class="modal" data-form="qsp"><h3>Tạo dự án QS${closeBtn()}</h3>
  <label class="field">Tên dự án / hạng mục<input id="qp-name" name="name" required placeholder="VD: Căn hộ mẫu tầng 2"></label>
  <div class="row2"><label class="field">Khách hàng<input id="qp-client" name="client" required></label><label class="field">Điện thoại<input id="qp-phone" name="phone"></label></div>
  <label class="field">Địa chỉ<input id="qp-addr" name="addr"></label>
  <label class="field">Gắn với dự án thi công<select id="qp-pid" name="pid">${opt([['','— Không gắn —'], ...S.projects.map(p => [p.id, p.name])], '')}</select></label>
  <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Tạo & bắt đầu bóc tách</button></div></form>`);
FORM.qsp = v => {
  const n = Math.max(...S.qs.projects.map(x => +x.code.split('-')[1] || 0)) + 1;
  const q = {id:'q' + uid(), code:'QS-' + pad(n), pid:v.pid, name:v.name.trim(), client:v.client.trim(), phone:v.phone, addr:v.addr, created:todayISO(), status:'draft', quoted:false, rooms:[{id:uid(), name:'Phòng khách', items:[]}]};
  S.qs.projects.push(q); S.qs.cur = q.id; S.qs.room = 'all'; S.sub.qs = 'takeoff';
  log('Tạo hồ sơ bóc tách ' + q.code, 'purple'); closeModal(); render();
};
ACT['quote-copy'] = () => {
  const q = curQs(), rows = [['Hạng mục / Sản phẩm','Thương hiệu','SL','Đơn giá','Thành tiền']];
  q.rooms.forEach(r => { if (!r.items.length) return; rows.push([r.name,'','','','']); r.items.forEach(it => { const p = prod(it.p); rows.push([p.name, p.brand, it.q, p.price, p.price * it.q]); }); });
  const s = qsTotal(q); rows.push(['','','','Tạm tính', s], ['','','','VAT ' + S.qs.vat + '%', s * S.qs.vat / 100], ['','','','Tổng cộng', s * (1 + S.qs.vat / 100)]);
  copyText(rows.map(r => r.join('\t')).join('\n'), 'Đã sao chép bảng báo giá — dán vào Excel');
};
ACT['quote-send'] = () => { const q = curQs(); q.quoted = true; q.status = 'done'; log(`Đã gửi báo giá ${q.code} cho ${q.client}`, 'purple'); render(); toast('Đã đánh dấu gửi báo giá ' + q.code); };
ACT['po-gen'] = () => {
  const q = curQs(), by = {};
  q.rooms.forEach(r => r.items.forEach(it => { const p = prod(it.p); (by[p.brand] = by[p.brand] || {}); by[p.brand][it.p] = (by[p.brand][it.p] || 0) + it.q; }));
  const brands = Object.keys(by); if (!brands.length){ toast('Hồ sơ chưa có sản phẩm để tạo đơn'); return; }
  let n = Math.max(...S.qs.po.map(o => +o.code.split('-')[1] || 0));
  brands.forEach(b => S.qs.po.push({id:uid(), code:'PO-' + String(++n).padStart(4, '0'), qp:q.id, brand:b, items:Object.entries(by[b]).map(([p, qq]) => ({p, q:qq})), status:'wait', date:todayISO()}));
  log(`Tạo ${brands.length} đơn mua từ ${q.code}`, 'purple'); render(); toast(`Đã tạo ${brands.length} đơn mua theo thương hiệu`);
};
ACT['po-next'] = (el, d) => { const o = S.qs.po.find(x => x.id === d.id); o.status = o.status === 'wait' ? 'ordered' : 'received'; log(`${o.code}: ${o.status === 'ordered' ? 'đã đặt hàng' : 'đã nhận hàng'}`, 'purple'); render(); };
SEARCH.push(hit => S.qs.projects.filter(q => hit(q.code + ' ' + q.name + ' ' + q.client)).map(q => ({icon:'ruler', label:q.code + ' · ' + q.name, sub:'QS', run:() => { S.qs.cur = q.id; S.qs.room = 'all'; nav('qs', 'takeoff'); }})));
SEARCH.push(hit => S.qs.products.filter(p => hit(p.name + ' ' + p.brand)).slice(0, 5).map(p => ({icon:'bulb', label:p.name, sub:p.brand + ' · ' + num(p.price) + ' đ', run:() => { S.qs.filt.q = p.name; nav('qs', 'products'); }})));

/* ================= WIKI ================= */
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function mdToHtml(src){
  const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
  const out = [], toc = []; let list = null, table = null, para = [];
  const flush = () => { if (para.length){ out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } if (list){ out.push(`<${list.t}>` + list.items.map(x => '<li>' + inline(x) + '</li>').join('') + `</${list.t}>`); list = null; } if (table){ out.push('<table><thead><tr>' + table[0].map(c => '<th>' + inline(c) + '</th>').join('') + '</tr></thead><tbody>' + table.slice(1).map(r => '<tr>' + r.map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>'); table = null; } };
  src.split('\n').forEach(raw => {
    const l = raw.trim(); let m;
    if (!l){ flush(); return; }
    if ((m = l.match(/^(#{2,3})\s+(.*)/))){ flush(); const id = 'h-' + slug(m[2]); if (m[1] === '##') toc.push([id, m[2]]); out.push(`<h${m[1].length} id="${id}">${inline(m[2])}</h${m[1].length}>`); return; }
    if ((m = l.match(/^[-*]\s+(.*)/))){ if (para.length || table || (list && list.t !== 'ul')) flush(); list = list || {t:'ul', items:[]}; list.items.push(m[1]); return; }
    if ((m = l.match(/^\d+[.)]\s+(.*)/))){ if (para.length || table || (list && list.t !== 'ol')) flush(); list = list || {t:'ol', items:[]}; list.items.push(m[1]); return; }
    if (l.startsWith('|')){ if (para.length || list) flush(); table = table || []; table.push(l.replace(/^\||\|$/g, '').split('|').map(c => c.trim())); return; }
    if (l.startsWith('>')){ flush(); out.push(`<div class="callout">${ic('info', 16)}<span>${inline(l.replace(/^>\s*/, ''))}</span></div>`); return; }
    if (list || table) flush();
    para.push(l);
  });
  flush();
  return {html:out.join(''), toc};
}
MOD.wiki = () => {
  const W = S.wiki, q = (ui.wikiQ || '').toLowerCase();
  const pg = W.pages.find(p => p.id === W.cur) || W.pages[0];
  const match = p => !q || (p.title + ' ' + p.md).toLowerCase().includes(q);
  const tree = W.cats.map(c => { const ps = W.pages.filter(p => p.cat === c && match(p)); return ps.length ? `<div class="cat">${esc(c)}</div>` + ps.map(p => `<button class="pg ${p === pg ? 'on' : ''}" data-act="wiki-go" data-id="${p.id}">${esc(p.title)}</button>`).join('') : ''; }).join('');
  const {html, toc} = mdToHtml(pg.md);
  return head('Wiki công ty', 'Sổ tay, nội quy & quy trình nội bộ — áp dụng toàn công ty.', `<button class="btn line" data-act="wiki-edit" data-id="${pg.id}">${ic('edit', 15)}Sửa trang</button><button class="btn" data-act="wiki-new">${ic('plus', 15)}Trang mới</button>`) + `
    <div class="wiki">
      <nav class="card wiki-tree" aria-label="Mục lục wiki"><div class="search" style="margin-bottom:6px">${ic('search', 15)}<input id="wiki-q" data-input="wiki-q" value="${esc(ui.wikiQ || '')}" placeholder="Tìm trong wiki" aria-label="Tìm trong wiki"></div>${tree || '<div class="empty">Không có trang phù hợp</div>'}</nav>
      <article class="card article"><div class="small muted">${esc(pg.cat)} ${ic('chev', 11)} ${esc(pg.title)}</div><h1>${esc(pg.title)}</h1>
        <div class="row small muted" style="margin-bottom:16px">${av(pg.by, 22)}Cập nhật bởi ${esc(person(pg.by).name)} · ${fmtFull(pg.updated)}</div>
        <div class="prose">${html}</div></article>
      <aside class="card toc"><b style="font-size:12px;color:var(--muted)">TRONG TRANG NÀY</b>${toc.map(([id, t]) => `<a href="#${id}" data-act="wiki-toc" data-id="${id}">${esc(t)}</a>`).join('') || '<span class="muted">—</span>'}</aside>
    </div>`;
};
ACT['wiki-go'] = (el, d) => { S.wiki.cur = d.id; render(); $('#main').scrollTop = 0; };
ACT['wiki-toc'] = (el, d) => { const h = document.getElementById(d.id); if (h) h.scrollIntoView({behavior:'smooth', block:'start'}); };
INP['wiki-q'] = el => { ui.wikiQ = el.value; render(); const i = $('#wiki-q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); };
ACT['wiki-new'] = () => wikiModal(null);
ACT['wiki-edit'] = (el, d) => wikiModal(S.wiki.pages.find(p => p.id === d.id));
function wikiModal(p){
  p = p || {id:'', cat:S.wiki.cats[0], title:'', md:'## Mục 1\nNội dung…\n\n- Ý 1\n- Ý 2'};
  showModal(`<form class="modal wide" data-form="wiki" data-id="${p.id}"><h3>${p.id ? 'Sửa trang' : 'Trang mới'}${closeBtn()}</h3>
    <div class="row2"><label class="field">Tiêu đề<input id="wk-title" name="title" required value="${esc(p.title)}"></label><label class="field">Danh mục<input id="wk-cat" name="cat" list="wk-cats" required value="${esc(p.cat)}"></label></div>
    <datalist id="wk-cats">${S.wiki.cats.map(c => `<option value="${esc(c)}">`).join('')}</datalist>
    <label class="field">Nội dung <span>(## Tiêu đề mục · - gạch đầu dòng · 1. đánh số · **đậm** · &gt; ghi chú · | bảng | cột |)</span><textarea class="md" id="wk-md" name="md">${esc(p.md)}</textarea></label>
    <div class="m-actions">${p.id ? delBtn('wiki') : ''}<button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu trang</button></div></form>`);
}
FORM.wiki = (v, f) => {
  const W = S.wiki, cat = v.cat.trim();
  if (!W.cats.includes(cat)) W.cats.push(cat);
  let p = W.pages.find(x => x.id === f.dataset.id);
  const data = {title:v.title.trim(), cat, md:v.md, updated:todayISO(), by:S.me};
  if (p) Object.assign(p, data); else { p = {id:'w' + uid(), ...data}; W.pages.push(p); }
  W.cur = p.id; log('Cập nhật wiki: ' + p.title, 'brown'); closeModal(); render(); toast('Đã lưu trang wiki');
};
DEL.wiki = id => { S.wiki.pages = S.wiki.pages.filter(p => p.id !== id); S.wiki.cur = S.wiki.pages[0].id; };
SEARCH.push(hit => S.wiki.pages.filter(p => hit(p.title + ' ' + p.md)).slice(0, 6).map(p => ({icon:'book', label:p.title, sub:'Wiki · ' + p.cat, run:() => { S.wiki.cur = p.id; nav('wiki'); }})));

/* ================= trợ lý ================= */
AI.push({re:/dòng tiền|tồn quỹ|thu chi|tiền mặt/, fn:() => {
  const p = proj(S.pid), f = S.fin[p.id]; if (!f) return 'Dự án đang chọn chưa có dữ liệu tài chính.';
  const fc = f.fc.slice(0, 4);
  return `<b>${esc(p.name)}</b> — tồn quỹ hiện tại ${trd(f.cash)}. 4 tuần tới:` + list(fc.map((x, i) => `Tuần ${i + 1}: thu ${trd(x[0])}, chi ${trd(x[1])} → ${x[0] - x[1] >= 0 ? '+' : ''}${trd(x[0] - x[1])}`)) + `Ròng 4 tuần: <b>${trd(sum(fc, x => x[0] - x[1]))}</b>. <button class="link" data-act="nav" data-v="fin" data-sub="cash">Mở dòng tiền ›</button>`;
}});
AI.push({re:/hoá đơn|hóa đơn|công nợ|quá hạn|ngân sách|vượt/, fn:(q, s) => {
  const p = proj(S.pid), f = S.fin[p.id]; if (!f) return 'Dự án đang chọn chưa có dữ liệu tài chính.';
  if (/ngân sách|vượt/.test(s)){ const o = f.budget.filter(b => b.s / b.b >= .9); return 'Hạng mục cần chú ý:' + list(o.map(b => `${esc(b.name)}: ${trd(b.s)} / ${trd(b.b)} (${Math.round(b.s / b.b * 100)}%)`)); }
  const o = f.inv.filter(invOverdue);
  return o.length ? `Có ${o.length} hoá đơn quá hạn:` + list(o.map(i => `${esc(i.code)} · ${esc(i.partner)} · ${trd(i.amount)} — quá hạn ${-daysLeft(i.due)} ngày`)) + '<button class="link" data-act="nav" data-v="fin" data-sub="invoices">Mở hoá đơn ›</button>' : 'Không có hoá đơn quá hạn.';
}});
AI.push({re:/bóc tách|qs|báo giá|đèn|sản phẩm/, fn:() => {
  const q = curQs(), s = qsTotal(q);
  return `Hồ sơ đang mở <b>${esc(q.code)} · ${esc(q.name)}</b>: ${q.rooms.length} phòng, tạm tính ${vnd(s)}, tổng sau VAT ${vnd(s * (1 + S.qs.vat / 100))}.` + list(q.rooms.map(r => `${esc(r.name)}: ${vnd(roomTotal(r))}`));
}});
AI.push({re:/nghỉ phép|nội quy|quy định|quy trình|lương|an toàn|wiki/, fn:q => {
  const STOP = ['thế','nào','như','của','cho','với','gì','quy','định','the','công','ty'];
  const words = q.toLowerCase().replace(/[?.,!]/g, '').split(/\s+/).filter(w => w.length > 2 && !STOP.includes(w));
  const score = p => sum(words, w => (p.title.toLowerCase().includes(w) ? 3 : 0) + (p.md.toLowerCase().includes(w) ? 1 : 0));
  const scored = S.wiki.pages.map(p => [p, score(p)]).filter(x => x[1]).sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (!scored.length) return '';
  const top = scored[0][0], first = top.md.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(0, 4).map(l => esc(l.replace(/^[-\d.>|]+\s*/, '').replace(/\*\*/g, '')));
  return `Theo trang wiki <b>${esc(top.title)}</b>:` + list(first) + scored.map(([p]) => `<button class="link" data-act="wiki-open" data-id="${p.id}">Mở “${esc(p.title)}”</button>`).join(' · ');
}});
ACT['wiki-open'] = (el, d) => { S.wiki.cur = d.id; nav('wiki'); };
