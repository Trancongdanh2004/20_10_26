# Vietnamese Women's Day (20/10) Greeting Website - Phiên Bản Dành Tặng Em Gái Hoàng Yến Nhi 🌸

Trang web thiệp chúc mừng tĩnh, sống động và tối ưu giao diện điện thoại được thiết kế riêng dành tặng em gái **Hoàng Yến Nhi** nhân **Ngày Phụ Nữ Việt Nam (20/10)**.

Xây dựng bằng **HTML5, CSS3 và Vanilla JavaScript (ES6+) thuần**, không cần backend hay database, chạy trực tiếp trên trình duyệt hoặc qua local server.

---

## 🌟 Tính Năng Trọng Tâm

### 1. Nhạc Nền "Hóa Ra..." (MP3) & Tự Động Phát
- **Tập tin âm thanh**: `audio/hoa-ra.mp3` (sao chép trực tiếp từ đường dẫn `E:\hóa ra...mp3`).
- **Tự động phát khi mở trang**: Cố gắng phát nhạc ngay khi tải trang; nếu trình duyệt di động/desktop áp dụng chính sách chặn autoplay, hệ thống sẽ kích hoạt thông minh ngay từ chạm/click đầu tiên của người dùng.
- **Thanh nhắc phát nhạc nổi**: Widget nổi bo tròn xinh xắn ở góc màn hình nhắc nhở phát nhạc nếu bị chặn, tự động biến mất khi nhạc bắt đầu.
- **Nút điều khiển nhạc & Equalizer**: Nút trên thanh điều hướng với hiệu ứng sóng âm 3 vạch nhảy múa sinh động (`.m-bar`) và hiển thị tên bài hát *"Hóa Ra... 🎶"*.

### 2. Tối Ưu Hóa Tuyệt Đối Cho Điện Thoại (Mobile-First Optimization)
- **Viewport tràn viền**: Hỗ trợ `viewport-fit=cover` và vùng an toàn cho các dòng điện thoại có tai thỏ/notch (iPhone, Samsung Galaxy, Pixel,...).
- **Tránh tràn ngang (`overflow-x: hidden`)**: Cố định cấu trúc hiển thị 100% không bị rung lắc hay lệch trang khi vuốt ngón tay.
- **Lưới nút bấm thiệp 2x2**: 4 nút thao tác (*Lời chúc khác, Sao chép, Tải ảnh PNG, Đọc tâm thư*) tự động xếp thành lưới 2 cột gọn gàng, vừa vặn ngón cái, không kéo dài màn hình.
- **Hộp quà bí mật 2 cột**: 4 hộp quà 3D hiển thị cân đối 2x2 trên di động, chạm mượt mà.
- **Hộp thoại quà tặng & Tâm thư**: Thiết kế vừa vặn 94vw / 88vh, có cuộn mượt nội dung và nút đóng to bản dễ chạm.
- **Túi quà đã nhận (Bottom Sheet)**: Trên điện thoại, ngăn chứa quà trượt từ dưới lên như ứng dụng native iOS/Android.
- **Cải thiện hiệu năng**: Tự động giảm số lượng cánh hoa rơi trên điện thoại từ 50 xuống 20 cánh để đảm bảo mượt mà 60 FPS và tiết kiệm pin.

### 3. Thiệp Chúc Mừng 20/10 Dành Riêng Cho Em Gái Hoàng Yến Nhi
- **Người nhận mặc định**: `Hoàng Yến Nhi` (hiển thị cố định, trang trọng).
- **Người gửi mặc định**: `Anh trai` (hoặc có thể chỉnh sửa thành *Anh hai*).
- **Bộ 15+ lời chúc ý nghĩa**: Chọn lọc riêng cho tình cảm anh em trong gia đình: vừa ngọt ngào, ấm áp, vừa hài hước, động viên em gái học tập, làm việc và luôn có anh trai làm chỗ dựa.
- **Hiệu ứng đánh máy (Typewriter)**: Chữ xuất hiện nhịp nhàng kèm con trỏ nhấp nháy.
- **Tải thiệp PNG độ nét cao**: Kết xuất canvas chất lượng 1200x800 kèm hoa văn trang nhã, lời chúc và chữ ký của anh trai.
- **Tâm thư gửi em gái**: Hộp thư tâm tình trải lòng về tình cảm anh em, lời hứa bảo vệ và che chở em gái trọn đời.

### 4. Chiếc Hộp Quà 20/10 Bí Mật
- 4 hộp quà 3D tương tác với nơ ruy băng mềm mại.
- **Tỉ lệ mở quà ngẫu nhiên có trọng số**: Phổ biến (60%), Hiếm (30%), Huyền thoại (10%).
- **Voucher đặc quyền anh trai dành cho em gái**:
  - *Voucher 01 Ly Trà Sữa Full Topping (Anh bao 100%)*
  - *Voucher 01 Bữa Ăn Lẩu / Nướng No Nê*
  - *Voucher Xe Ôm Cao Cấp 03 Lần*
  - *Voucher Anh Rửa Bát & Dọn Phòng Hộ 1 Ngày*
  - *Kim Bài Miễn Tử Khi Bị Bố Mẹ Mắng (Anh đứng ra đỡ đạn)*
  - *Voucher Shopping Quà 20/10*
  - *Voucher Miễn Trừ Tranh Cãi 24h (Em gái luôn luôn đúng!)*
  - *Voucher Vé Xem Phim Cuối Tuần + Bắp Nước*
- **Mini-game tương tác**:
  - *Thước đo tình thương của anh dành cho em gái Nhi* (Kéo tăng vọt lên ∞ Vô Cực %).
  - *Trắc nghiệm: Ai là cô em gái đáng yêu nhất?* (Đáp án 100% luôn là Hoàng Yến Nhi).
- **Tải phiếu quà PNG**: Xuất ảnh voucher để em gái chụp màn hình lưu lại đòi quà.

---

## 🚀 Hướng Dẫn Sử Dụng

1. **Chạy qua máy chủ nội bộ**:
   ```bash
   npm run dev
   # Truy cập: http://localhost:52930/
   ```
2. **Mở trực tiếp (Offline)**:
   - Nhấp đúp chuột vào tệp `index.html` để mở ngay trên trình duyệt (Chrome, Safari, Edge, Cốc Cốc, Firefox,...).
