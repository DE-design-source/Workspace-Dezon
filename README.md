# Workspace-Dezon — Dezon Workspace

Không gian làm việc tất cả trong một cho công ty xây dựng / nội thất:

Chức năng & logic dựng lại theo mockup `SiteFlow-UI` (17 màn hình), giao diện Dezon.

| Module | File |
|---|---|
| Newsfeed · Bàn làm việc · Lịch | `mod-feed.js` · `mod-desk.js` · `mod-cal.js` |
| Marketing · Kinh doanh | `mod-mkt.js` · `mod-sales.js` |
| Chat | `mod-chat.js` (+ realtime trong `live.js`) |
| Quản lý dự án (danh sách, thiết lập thi công, Gantt, nhiệm vụ, luồng dữ liệu) | `mod-pm.js` |
| HR (chấm công, hồ sơ, lương) · Cài đặt · Wiki | `mod-hr.js` · `mod-settings.js` · `mod-wiki.js` |
| Tài chính · QS · Mua hàng | `mod-fin.js` · `mod-qs.js` · `mod-po.js` |
| Sản xuất (xưởng mộc) | `mod-prod.js` |
| Nhiệm vụ & điểm thưởng dùng chung | `mod-quest.js` |

Mỗi module khai báo dữ liệu đồng bộ bằng `syncCol()`; SQL phân quyền sinh bằng `node scripts/gen-perms-sql.js > supabase/migration-004-rebuild.sql`.

## Chạy

```bash
npm start   # http://localhost:3000
```

Không cần cài thư viện. Render: Build `npm install`, Start `npm start` (hoặc `node index.js`).

## Hai chế độ
- **Demo** (chưa khai báo `SUPABASE_ANON_KEY`): dữ liệu mẫu lưu trong trình duyệt.
- **Dữ liệu thật** (Supabase): đăng nhập email + mật khẩu, quên / đổi mật khẩu qua email, chat realtime có tệp đính kèm, dữ liệu mọi module dùng chung, trang quản trị tài khoản.
  Cài đặt: xem [SETUP-SUPABASE.md](SETUP-SUPABASE.md).
