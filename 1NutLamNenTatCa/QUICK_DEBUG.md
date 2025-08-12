# 🔧 Quick Debug Guide - Student Card Verifier

## ✅ Recent Updates
1. **Country Detection**: Tự động detect country từ URL trang student card
2. **Multi-University Support**: Hỗ trợ cả Indian và US universities

## 🌍 Country Detection Logic
- `thesinhvien.html` → Vietnam
- `thesinhvienus.html` → United States  
- Other pages → India (default)

## 🚨 Current Issues
1. **First name không được điền**
2. **Month field cần format 1-9 thay vì 01-09**

## 🔍 Debug Steps

### Step 1: Check Console Logs
Mở DevTools Console khi extension chạy, tìm:
```
🔍 Bắt đầu điền các field name và email...
🔍 DEBUG: Tất cả input fields trên trang:
🔍 Đang tìm field firstName với value: ...
```

### Step 2: Run Emergency Debug Script
1. Copy nội dung `emergency-debug.js`
2. Paste vào Console của trang SheerID
3. Tìm exact selectors trong output

### Step 3: Test Manual Fill
Trong Console:
```javascript
// Test điền first name
const firstField = document.querySelector('#sid-first-name') || 
                   document.querySelector('input[autocomplete="given-name"]');
if (firstField) {
  firstField.value = 'TEST';
  firstField.dispatchEvent(new Event('input', { bubbles: true }));
  console.log('First name filled:', firstField);
} else {
  console.log('❌ First name field not found');
}
```

### Step 4: Check Month Format
```javascript
// Test month với format 1-9
const monthField = document.querySelector('input[name*="month"]');
if (monthField) {
  monthField.value = '5'; // Thay vì '05'
  monthField.dispatchEvent(new Event('input', { bubbles: true }));
  console.log('Month filled with value 5');
}
```

## 🎯 Expected Results

### For First Name:
- Field được tìm thấy với selector `#sid-first-name` hoặc `input[autocomplete="given-name"]`
- Value được set thành công
- Console log: `✅ Đã điền firstName = "Lan" bằng selector: #sid-first-name`

### For Month:
- Field nhận value "5" thay vì "05"
- Dropdown hiện ra với options
- Item đầu tiên `.sid-birthdate_month-item-0` được click

## 🔧 Possible Solutions

### If First Name Still Not Found:
1. Thử tất cả selectors trong emergency debug output
2. Check if field bị hidden hoặc trong iframe
3. Check timing - có thể field chưa load

### If Month Dropdown Không Hiện:
1. Verify format: "5" instead of "05"
2. Check timing delay
3. Try trigger thêm events

## 📋 Test Checklist

- [ ] Extension loaded thành công
- [ ] Console logs hiện ra
- [ ] Emergency debug script chạy được
- [ ] Field selectors được identify
- [ ] Manual fill test thành công
- [ ] Month format 1-9 works
- [ ] Auto-fill hoàn chỉnh

## 🆘 If All Else Fails

1. Screenshot console logs
2. Run emergency debug và share output
3. Manual inspect elements trong DevTools
4. Check if page structure thay đổi
