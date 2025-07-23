# 🔍 Debugging Extract Button - Step by Step Guide

## Current Status
✅ Server is running on http://localhost:3000  
✅ Extension files updated with debug logging  
✅ Content script injection mechanism added  
✅ Timeout fallback implemented  

## Test Steps

### 1. **Reload Extension**
```
1. Open Chrome Extensions page (chrome://extensions/)
2. Find "Student Card Auto Verifier" extension
3. Click "Reload" button (🔄)
4. Verify extension is active
```

### 2. **Open Student Card Website**
```
1. Navigate to: http://localhost:3000/thesinhvien.html
2. Wait for student card to generate automatically
3. Verify student card is displayed with all information
```

### 3. **Test Extract Button**
```
1. Click extension icon in Chrome toolbar
2. Extension popup should open
3. Click "📋 Extract Info from Website" button
4. Check browser console for debug messages
```

## Debug Information to Look For

### In Extension Popup Console:
```
🔍 DEBUG: Attempting to inject content script first...
🔍 DEBUG: Content script injected successfully
🔍 DEBUG: Response from content script: [object]
🔍 DEBUG: Successfully extracted: [student info object]
```

### In Website Console:
```
🔍 DEBUG: Student Card Auto Verifier content script loaded on: http://localhost:3000/thesinhvien.html
🔍 DEBUG: Content script received message: {action: "extractStudentInfo"}
🔍 DEBUG: Found elements: {universityName: "...", studentName: "..."}
```

## Common Issues & Solutions

### Issue 1: "Cannot connect to website"
**Solution:** 
- Refresh the student card website page
- Reload the extension
- Check if localhost:3000 is accessible

### Issue 2: "No student card found"
**Solution:**
- Wait for student card to fully generate
- Check if all DOM elements are present
- Verify element IDs: university-name, student-name, etc.

### Issue 3: Button stuck at "⏳ Extracting..."
**Solution:**
- Wait 8 seconds for timeout
- Check console for error messages
- Try manual content script injection

## Manual Testing Commands

### Open Extension Console:
```
1. Right-click extension icon → "Inspect popup"
2. Go to Console tab
3. Look for debug messages starting with "🔍 DEBUG:"
```

### Open Website Console:
```
1. Press F12 on student card website
2. Go to Console tab
3. Look for content script messages
```

### Test Content Script Manually:
```javascript
// Run in website console to test extraction
const universityName = document.getElementById('university-name')?.textContent?.trim();
const studentName = document.getElementById('student-name')?.textContent?.trim();
console.log('Manual test:', {universityName, studentName});
```

## Expected Behavior
1. Button shows "⏳ Extracting..." for 1-2 seconds
2. Form fields auto-fill with extracted data
3. Button changes to "✅ Student info extracted successfully!"
4. Status shows success message
5. Fields highlight in green

## If Still Not Working
1. Check all console logs
2. Verify extension permissions
3. Test with fresh browser tab
4. Reload extension completely
5. Restart Chrome if needed

---
Last Updated: July 22, 2025
Extension Version: 1.0.0
