# Kết nối Supabase cho Dezon Workspace

Project: `unosioqjrigqcscodmzr` — https://supabase.com/dashboard/project/unosioqjrigqcscodmzr

Làm theo thứ tự. Chưa xong bước 5 thì app vẫn chạy chế độ demo như hiện tại.

## 1. Tạo bảng dữ liệu
SQL Editor → New query → dán toàn bộ nội dung file `supabase/schema.sql` → **Run**.
Chạy lại nhiều lần vẫn an toàn.

## 2. Tắt tự đăng ký
Authentication → Sign In / Providers:
- **Email**: bật
- **Allow new users to sign up**: TẮT (chỉ quản trị viên mời mới có tài khoản)

## 3. Đường dẫn trong email
Authentication → URL Configuration:
- **Site URL**: `https://workspace-dezon.onrender.com`
- **Redirect URLs**: thêm `https://workspace-dezon.onrender.com/**`

## 4. Máy chủ gửi email (bắt buộc khi mời 60 người)
Email mặc định của Supabase chỉ gửi được vài thư mỗi giờ. Authentication → Emails → **SMTP Settings** → dùng email công ty:

| Dịch vụ email công ty | Host | Port | Username | Password |
|---|---|---|---|---|
| Google Workspace | smtp.gmail.com | 465 | noreply@congty.vn | App Password (tạo ở tài khoản Google → Bảo mật → Mật khẩu ứng dụng) |
| Microsoft 365 | smtp.office365.com | 587 | noreply@congty.vn | mật khẩu hộp thư |

Sender name: `Dezon Workspace`.

### Mẫu email tiếng Việt (Authentication → Emails → Templates)

**Invite user** — Subject: `Bạn được mời vào Dezon Workspace`
```html
<h2>Chào mừng bạn đến Dezon Workspace</h2>
<p>Bạn được mời dùng không gian làm việc nội bộ của công ty.</p>
<p><a href="{{ .ConfirmationURL }}">Bấm vào đây để tạo mật khẩu và đăng nhập</a></p>
<p>Link có hiệu lực trong 24 giờ. Đăng nhập bằng email này: {{ .Email }}</p>
```

**Reset password** — Subject: `Đặt lại mật khẩu Dezon Workspace`
```html
<h2>Đặt lại mật khẩu</h2>
<p>Có yêu cầu đặt lại mật khẩu cho tài khoản {{ .Email }}.</p>
<p><a href="{{ .ConfirmationURL }}">Bấm vào đây để đặt mật khẩu mới</a></p>
<p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
```

## 5. Khai báo khoá trên Render
Supabase → Project Settings → **API Keys** → lấy 2 khoá, rồi Render → service Workspace-Dezon → **Environment** → thêm:

| Key | Giá trị |
|---|---|
| `SUPABASE_ANON_KEY` | Publishable key (`sb_publishable_…`) |
| `SUPABASE_SERVICE_KEY` | Secret key (`sb_secret_…`) — **chỉ để ở Render, không gửi cho ai** |

Save Changes → Render tự deploy lại.

## 6. Tài khoản quản trị đầu tiên
Supabase → Authentication → Users → **Add user → Send invitation** → nhập email của bạn.
Tài khoản đầu tiên tự động là **quản trị viên**. Mở email → bấm link → đặt mật khẩu → chọn *Dữ liệu mẫu* hoặc *Bắt đầu trống*.

## 7. Mời nhân viên
Trong workspace → menu **Tài khoản** → **Mời nhân viên** (email, họ tên, chức danh, phòng ban).
Nhân viên nhận email, tự đặt mật khẩu. Quên mật khẩu → bấm “Quên mật khẩu?” ở màn hình đăng nhập.
Quản trị viên có thể gửi lại email, khoá / mở khoá, xoá tài khoản.

---

### Dữ liệu nằm ở đâu
| Bảng | Nội dung |
|---|---|
| `profiles` | Tài khoản nhân viên |
| `conversations`, `conversation_members`, `messages` | Chat — chỉ thành viên nhóm đọc được (RLS) |
| `records` | Dữ liệu các module: dự án, kinh doanh, tiến độ, tài chính, QS, chấm công, nhiệm vụ, wiki |
| Storage `chat-files` | Tệp gửi trong chat (tối đa 25 MB/tệp), chỉ thành viên nhóm mở được |

Kiểm thử phân quyền: `supabase/test/` (chạy trên Postgres local bằng Docker).
