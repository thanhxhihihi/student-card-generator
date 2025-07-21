# 🚀 HƯỚNG DẪN DEPLOY LÊN RENDER.COM

## ✅ Kiểm tra trước khi deploy

Project của bạn đã được chuẩn bị đầy đủ để deploy lên Render.com:

- ✅ `package.json` với engines field
- ✅ `proxy-server.js` sử dụng process.env.PORT  
- ✅ Start script: `npm start`
- ✅ Dependencies đầy đủ
- ✅ Root route redirect
- ✅ Static files serving
- ✅ CORS enabled

## 📋 Các bước deploy

### 1️⃣ Upload lên GitHub

```bash
# Khởi tạo Git repository (nếu chưa có)
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit - Student Card Generator"

# Tạo main branch
git branch -M main

# Thêm remote origin (thay YOUR_USERNAME/YOUR_REPO bằng repo thật)
git remote add origin https://github.com/YOUR_USERNAME/student-card-generator.git

# Push lên GitHub
git push -u origin main
```

### 2️⃣ Deploy trên Render.com

1. **Truy cập Render.com**
   - Đi tới https://render.com
   - Đăng ký/đăng nhập bằng GitHub

2. **Tạo Web Service**
   - Nhấn **"New"** → **"Web Service"**
   - Chọn **GitHub repository** vừa tạo
   - Nhấn **"Connect"**

3. **Cấu hình Service**
   ```
   Name: student-card-generator
   Environment: Node
   Region: Oregon (US West)
   Branch: main
   Root Directory: (để trống)
   Build Command: npm install
   Start Command: npm start
   ```

4. **Deploy**
   - Nhấn **"Create Web Service"**
   - Chờ 3-5 phút để build và deploy

### 3️⃣ Truy cập Website

Sau khi deploy thành công:
- Render sẽ cung cấp URL: `https://student-card-generator-xxxx.onrender.com`
- Website sẽ tự động redirect từ `/` → `/thesinhvien.html`

## 🔧 Thông tin kỹ thuật

### Environment Variables (Render tự động set)
- `PORT`: 10000 (hoặc dynamic)

### API Endpoints
- `GET /` - Redirect to main page
- `GET /thesinhvien.html` - Main application
- `POST /api/load-faces` - Proxy for thispersonnotexist.org
- `GET /api/image/:base64path` - Proxy for AI images  
- `GET /api/barcode` - Proxy for barcode generation

### Dependencies
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5", 
  "node-fetch": "^2.7.0"
}
```

## 🚨 Troubleshooting

### Deploy failed?
1. Kiểm tra logs trong Render dashboard
2. Đảm bảo `package.json` có `engines` field
3. Verify build/start commands

### Website không load?
1. Thêm `/thesinhvien.html` vào URL
2. Check Network tab in DevTools
3. Verify API endpoints hoạt động

### API không hoạt động?
1. CORS đã được enable trong proxy
2. Kiểm tra console logs
3. Verify external APIs (thispersonnotexist.org)

## 💡 Render.com Free Tier

- **Sleep**: App sleep sau 15 phút không dùng
- **Cold start**: 30-60s lần đầu truy cập sau sleep
- **Bandwidth**: 100GB/tháng
- **Build time**: Tối đa 15 phút

## ⚡ Optimizations

Để app không bị sleep:
1. Sử dụng UptimeRobot ping mỗi 14 phút
2. Hoặc upgrade lên paid plan

## 🎯 Test Local trước khi deploy

```bash
# Chạy local server
npm start

# Mở browser
http://localhost:3000/thesinhvien.html

# Test tất cả chức năng:
# ✅ Generate card  
# ✅ Load AI image
# ✅ Download PNG
```

---

🎉 **Project đã sẵn sàng để deploy!**
