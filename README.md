# Student Card Generator - Indian Universities

Trang web tạo thẻ sinh viên ngẫu nhiên với ảnh AI từ thispersonnotexist.org

## ✨ Tính năng

- 🎓 **10 trường đại học Ấn Độ** hàng đầu
- 🤖 **Ảnh AI người thật** từ thispersonnotexist.org 
- 👤 **Tên Ấn Độ** ngẫu nhiên (30 tên)
- 📅 **Tuổi 20-25** ngẫu nhiên
- 🎯 **16 chuyên ngành** đa dạng
- 💳 **Student ID** tự động generate
- 📥 **Download PNG** chất lượng cao

## 🚀 Cách chạy Local

### 1. Cài đặt dependencies
```bash
cd create_student_card
npm install
```

### 2. Khởi động server
```bash
npm start
```

### 3. Mở trình duyệt
```
http://localhost:3000/thesinhvien.html
```

## 📋 Cấu trúc project

```
create_student_card/
├── thesinhvien.html        # Trang web chính
├── proxy-server.js         # Proxy server xử lý CORS
├── package.json           # Dependencies
└── README.md              # Hướng dẫn này
```

## 🔧 API sử dụng

- **thispersonnotexist.org/load-faces** - Lấy ảnh AI người châu Á
- **barcode.tec-it.com** - Tạo mã vạch cho thẻ
- **html2canvas** - Convert HTML thành PNG để download

## ⚠️ Lưu ý

- Web chỉ hoạt động qua proxy server (không thể mở file HTML trực tiếp)
- Cần kết nối internet để lấy ảnh AI
- Nếu API thispersonnotexist.org không hoạt động, web sẽ báo lỗi

## 🎯 Thông số API

```javascript
{
  "type": "R",
  "age": "21-35", 
  "race": "asian",
  "emotion": "none"
}
```

## 📸 Demo

1. Nhấn "Generate New Student Card"
2. Chờ load ảnh AI từ thispersonnotexist.org
3. Nhấn "Download Card" để tải về

---
**Chỉ sử dụng API thispersonnotexist.org - Không có fallback khác**

## 🌐 Deploy lên Render.com

### Bước 1: Chuẩn bị GitHub Repository

1. Tạo GitHub repository mới
2. Push toàn bộ project lên GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/student-card-generator.git
git push -u origin main
```

### Bước 2: Deploy trên Render.com

1. Truy cập [render.com](https://render.com) và đăng ký/đăng nhập
2. Kết nối GitHub account của bạn
3. Nhấn **"New"** → **"Web Service"**
4. Chọn GitHub repository vừa tạo
5. Cấu hình như sau:

**Service Configuration:**
- **Name**: `student-card-generator`
- **Environment**: `Node`
- **Region**: `Oregon (US West)`
- **Branch**: `main`

**Build & Deploy Settings:**
- **Root Directory**: ` ` (để trống)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
- **PORT**: `10000` (Render tự động set)

6. Nhấn **"Create Web Service"**

### Bước 3: Truy cập Website

Sau khi deploy thành công (3-5 phút), Render sẽ cung cấp URL dạng:
```
https://student-card-generator-xxxx.onrender.com
```

Truy cập: `https://your-app-url.onrender.com/thesinhvien.html`

### 🔧 Troubleshooting

**Nếu deployment failed:**
1. Kiểm tra logs trong Render dashboard
2. Đảm bảo `package.json` có đúng `engines` field
3. Kiểm tra `PORT` environment variable

**Nếu website không load được:**
1. Thêm `/thesinhvien.html` vào cuối URL
2. Kiểm tra Network tab trong Browser DevTools
3. Đảm bảo các API endpoints hoạt động

### 💡 Lưu ý về Render.com

- **Free tier**: App sẽ sleep sau 15 phút không sử dụng
- **Cold start**: Lần đầu truy cập sau khi sleep có thể mất 30-60s
- **Bandwidth**: 100GB/tháng cho free tier
- **Build time**: Tối đa 15 phút

### 🚀 Custom Domain (Optional)

1. Trong Render dashboard → Settings → Custom Domains
2. Thêm domain của bạn
3. Cập nhật DNS records theo hướng dẫn
# Student Card Generator

## Giới thiệu

**Student Card Generator** là một tiện ích web giúp bạn tạo thẻ sinh viên giả lập với thông tin, ảnh, mã vạch và thiết kế chuyên nghiệp. Tiện ích hỗ trợ sinh viên, giáo viên, hoặc các nhà phát triển cần dữ liệu mẫu cho mục đích demo, kiểm thử hoặc học tập.

## Tính năng nổi bật
- Tạo thẻ sinh viên với thông tin ngẫu nhiên (tên, ngày sinh, khoa, lớp, mã số sinh viên...)
- Tự động lấy ảnh khuôn mặt ngẫu nhiên phù hợp độ tuổi, chủng tộc
- Sinh mã vạch theo tên trường
- Giao diện đẹp, hiệu ứng mượt mà, có thể tải thẻ về dưới dạng ảnh PNG
- Hỗ trợ tích hợp với Chrome Extension để trích xuất thông tin thẻ

## Hướng dẫn sử dụng

### 1. Cài đặt & Khởi động
- Tải toàn bộ mã nguồn về máy tính.
- Đảm bảo bạn có Node.js (nếu muốn chạy proxy server để lấy ảnh khuôn mặt).
- Mở file `thesinhvien.html` trong trình duyệt để sử dụng ngay giao diện tạo thẻ.
- Nếu muốn sử dụng tính năng lấy ảnh khuôn mặt thật, chạy proxy server:
  ```sh
  node proxy-server.js
  ```
  Sau đó truy cập lại giao diện.

### 2. Tạo thẻ sinh viên
- Nhấn nút **Generate** để tạo thẻ mới với thông tin ngẫu nhiên.
- Chờ quá trình tải ảnh và sinh mã vạch hoàn tất.
- Thông tin thẻ sẽ được hiển thị đầy đủ trên giao diện.

### 3. Tải thẻ về máy
- Nhấn nút **Download** để lưu thẻ sinh viên dưới dạng ảnh PNG.

### 4. Trích xuất thông tin sang Extension (nếu có)
- Cài đặt Chrome Extension "Student Card Auto Verifier" từ thư mục `1NutLamNenTatCa` (xem hướng dẫn trong extension).
- Nhấn nút **Extract Info** để gửi thông tin thẻ sang extension.
- Làm theo hướng dẫn trên popup extension để xác minh hoặc sử dụng dữ liệu.

## Lưu ý
- Ảnh khuôn mặt được lấy từ dịch vụ AI, không phải người thật.
- Mọi thông tin sinh ra chỉ dùng cho mục đích demo, kiểm thử, không sử dụng cho mục đích gian lận.
- Nếu gặp lỗi mạng khi tải ảnh, hãy kiểm tra lại kết nối hoặc thử chạy proxy server.

## Tham khảo & Liên hệ
- Tác giả: hungvu25
- Đóng góp hoặc báo lỗi: [GitHub Repository](https://github.com/hungvu25/student-card-generator)

---
Chúc bạn sử dụng tiện ích hiệu quả!
