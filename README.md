# Workspace-Dezon — SiteFlow Workspace

Không gian làm việc tất cả trong một cho công ty xây dựng / nội thất:

| Module | Chức năng |
|---|---|
| Tổng quan | Tiến độ vs kế hoạch, nhân công hôm nay, tồn quỹ, cảnh báo, lịch mốc & thu chi |
| Kinh doanh | Pipeline 7 giai đoạn (kéo thả), phễu bán hàng, form khách hàng 3 bước; chuyển sang "Dự án" tự tạo hồ sơ dự án |
| Dự án | Danh sách, thiết lập thi công (tự khởi tạo QS, Gantt, chấm công, tài chính, nhóm chat), luồng dữ liệu |
| Chat | Nhóm theo dự án, tin nhắn riêng, gửi tệp, SiteFlow Bot cảnh báo tự động |
| Quản lý dự án | Gantt (tuần/tháng, đường găng, mốc, thu/chi, bình luận) + Nhiệm vụ game hoá, đổi quà, bảng xếp hạng |
| Chấm công | Theo ngày / nhân viên, duyệt ngoài vùng, giao diện mobile chấm công vào/ra |
| Tài chính | Ngân sách theo hạng mục, hoá đơn & công nợ, dự báo dòng tiền 8 tuần |
| QS | Bóc tách theo phòng, danh mục sản phẩm có bộ lọc, báo giá, đơn mua hàng |
| Wiki | Sổ tay, nội quy, quy trình — soạn thảo dạng markdown |

## Chạy

```bash
npm start   # http://localhost:3000
```

Không cần cài thư viện. Render: Build `npm install`, Start `npm start` (hoặc `node index.js`).

## Hai chế độ
- **Demo** (chưa khai báo `SUPABASE_ANON_KEY`): dữ liệu mẫu lưu trong trình duyệt.
- **Dữ liệu thật** (Supabase): đăng nhập email + mật khẩu, quên / đổi mật khẩu qua email, chat realtime có tệp đính kèm, dữ liệu mọi module dùng chung, trang quản trị tài khoản.
  Cài đặt: xem [SETUP-SUPABASE.md](SETUP-SUPABASE.md).
