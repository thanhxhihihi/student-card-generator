// Background script - xử lý logic chính
let currentStudentInfo = {
  country: "India", // Thêm country field
  school: "Đại học Bách khoa TP.HCM",
  firstName: "Lan",
  lastName: "Phuong", 
  email: "lan.phuong@hcmut.edu.vn"
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startVerification") {
    // Sử dụng studentInfo từ request nếu có
    if (request.studentInfo) {
      currentStudentInfo = request.studentInfo;
      console.log('Đã cập nhật thông tin student từ website:', currentStudentInfo);
    }
    startStudentVerification();
    sendResponse({success: true});
  } else if (request.action === "startDirectVerification") {
    // Xử lý verification trực tiếp từ popup extension
    console.log('Starting DIRECT verification with:', request.studentInfo);
    
    currentStudentInfo = request.studentInfo;
    
    // Save student info mà không có auto-filled flag
    chrome.storage.sync.set({
      studentInfo: request.studentInfo,
      autoFilled: false,
      lastUpdated: Date.now()
    });
    
    startStudentVerification();
    sendResponse({success: true});
  } else if (request.action === "updateStudentInfo") {
    currentStudentInfo = request.studentInfo;
    sendResponse({success: true});
  } else if (request.action === "saveStudentInfo") {
    // Lưu thông tin student từ website vào storage
    currentStudentInfo = request.studentInfo;
    chrome.storage.sync.set({ 
      studentInfo: currentStudentInfo,
      autoFilled: true,
      lastUpdated: new Date().toISOString()
    });
    console.log('Đã lưu thông tin student từ website:', currentStudentInfo);
    sendResponse({success: true});
  }
});

// Bước 2: Mở trang Google One
function startStudentVerification() {
  chrome.tabs.create({ 
    url: 'https://one.google.com/u/1/ai-student' 
  }, (tab) => {
    console.log('Đã mở trang Google One, tabId:', tab.id);
    console.log('Sử dụng thông tin student:', currentStudentInfo);
    
    // Đợi trang load xong rồi click nút xác minh
    setTimeout(() => {
      clickVerifyButton(tab.id);
    }, 3000);
  });
}

// Bước 3: Click nút "Xác minh điều kiện sử dụng"
function clickVerifyButton(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => {
      // Thử nhiều selector khác nhau để tìm nút
      const selectors = [
        '[aria-label*="Xác minh điều kiện sử dụng"]',
        '[aria-label*="Verify eligibility"]',
        'button:has-text("Xác minh điều kiện sử dụng")',
        'button[data-testid*="verify"]',
        'a[href*="verify"]'
      ];
      
      for (const selector of selectors) {
        const button = document.querySelector(selector);
        if (button) {
          console.log('Tìm thấy nút xác minh:', button);
          button.click();
          return;
        }
      }
      
      // Nếu không tìm thấy, thử tìm theo text content
      const buttons = document.querySelectorAll('button, a');
      for (const btn of buttons) {
        if (btn.textContent.includes('Xác minh') || 
            btn.textContent.includes('Verify') ||
            btn.textContent.includes('verify')) {
          console.log('Tìm thấy nút theo text:', btn.textContent);
          btn.click();
          return;
        }
      }
      
      console.log('Không tìm thấy nút xác minh');
    }
  }).catch(err => {
    console.error('Lỗi khi click nút xác minh:', err);
  });
}

// Bước 4: Lắng nghe tab mới mở (SheerID)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && 
      tab.url && 
      (tab.url.includes("sheerid.com") || tab.url.includes("services.sheerid.com"))) {
    
    console.log('Phát hiện trang SheerID:', tab.url);
    
    // Kiểm tra xem có phải là trang verification form không
    if (tab.url.includes('/verify/')) {
      console.log('🔍 Đã phát hiện trang verification form, đợi trang load hoàn toàn...');
      
      // Đợi trang load hoàn toàn với timeout dài hơn và kiểm tra nhiều lần
      waitForPageFullyLoaded(tabId).then(() => {
        console.log('✅ Trang đã load hoàn toàn, bắt đầu điền form...');
        fillSheerIDForm(tabId);
      }).catch(err => {
        console.error('❌ Timeout waiting for page to load, trying anyway:', err);
        fillSheerIDForm(tabId);
      });
    }
  }
});

// Hàm đợi trang load hoàn toàn với kiểm tra thực tế
async function waitForPageFullyLoaded(tabId, maxWaitTime = 10000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = Math.floor(maxWaitTime / 500); // Check every 500ms
    
    const checkPageReady = () => {
      attempts++;
      
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          // Kiểm tra các điều kiện để xác định trang đã load xong
          const checks = {
            documentReady: document.readyState === 'complete',
            hasFormElements: document.querySelectorAll('input, select, textarea').length > 0,
            noLoadingIndicators: document.querySelectorAll('[class*="loading"], [class*="spinner"], [id*="loading"]').length === 0,
            hasSheerIDForm: document.querySelectorAll('[name*="school"], [name*="firstName"], [name*="lastName"]').length >= 2,
            jQueryReady: typeof window.jQuery !== 'undefined' ? window.jQuery.isReady : true
          };
          
          console.log('🔍 Page readiness checks:', checks);
          
          // Trang được coi là ready nếu:
          // 1. Document ready
          // 2. Có form elements 
          // 3. Không có loading indicators
          const isReady = checks.documentReady && checks.hasFormElements && checks.noLoadingIndicators;
          
          return {
            ready: isReady,
            checks: checks,
            url: window.location.href,
            timestamp: new Date().toISOString()
          };
        }
      }).then(results => {
        if (results && results[0] && results[0].result) {
          const result = results[0].result;
          console.log(`🔍 Page readiness check ${attempts}/${maxAttempts}:`, result);
          
          if (result.ready) {
            console.log('✅ Trang đã sẵn sàng để điền form');
            resolve();
            return;
          }
        }
        
        if (attempts >= maxAttempts) {
          console.log('⏰ Timeout waiting for page readiness, proceeding anyway');
          reject(new Error('Timeout waiting for page to be ready'));
          return;
        }
        
        // Check lại sau 500ms
        setTimeout(checkPageReady, 500);
      }).catch(err => {
        console.error('❌ Error checking page readiness:', err);
        if (attempts >= maxAttempts) {
          reject(err);
        } else {
          setTimeout(checkPageReady, 500);
        }
      });
    };
    
    // Bắt đầu check
    checkPageReady();
  });
}

// Lắng nghe tab mới được tạo (cho sign-in)
chrome.tabs.onCreated.addListener((tab) => {
  console.log('Tab mới được tạo:', tab.id);
  
  // Đợi tab load xong rồi check URL
  setTimeout(() => {
    chrome.tabs.get(tab.id, (updatedTab) => {
      if (updatedTab && updatedTab.url && 
          (updatedTab.url.includes('login') || 
           updatedTab.url.includes('signin') || 
           updatedTab.url.includes('auth') ||
           updatedTab.url.includes('sso'))) {
        
        console.log('🔍 Phát hiện tab sign-in:', updatedTab.url);
        console.log('🚪 Đóng tab sign-in sau 3 giây...');
        
        // Đóng tab sau 3 giây
        setTimeout(() => {
          chrome.tabs.remove(tab.id, () => {
            console.log('✅ Đã đóng tab sign-in');
          });
        }, 3000);
      }
    });
  }, 2000);
});

// Bước 5: Xử lý sau khi submit form - tìm nút "Sign in to your school" hoặc "Upload Proof of Enrollment"
function handlePostSubmit(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => {
      console.log('🔍 Tìm nút "Sign in to your school" hoặc "Upload Proof of Enrollment"...');
      
      function findAndClickButton() {
        // Tìm nút "Upload Proof of Enrollment" trước
        const uploadSelectors = [
          'button:contains("Upload Proof of Enrollment")',
          'a:contains("Upload Proof of Enrollment")',
          '[aria-label*="Upload Proof of Enrollment"]',
          'button[title*="Upload Proof of Enrollment"]'
        ];
        
        let uploadBtn = null;
        // Vì :contains không có trong querySelector, dùng cách khác
        const buttons = document.querySelectorAll('button, a, [role="button"]');
        for (const btn of buttons) {
          if (btn.textContent && btn.textContent.includes('Upload Proof of Enrollment')) {
            uploadBtn = btn;
            break;
          }
        }
        
        if (uploadBtn && uploadBtn.offsetParent !== null) {
          console.log('✅ Tìm thấy nút "Upload Proof of Enrollment", click luôn...');
          uploadBtn.click();
          console.log('✅ Đã click vào "Upload Proof of Enrollment"');
          return true;
        }
        
        // Nếu không có "Upload Proof of Enrollment", tìm "Sign in to your school"
        let signinBtn = document.querySelector('#sid-submit-btn-sso');
        
        if (!signinBtn || signinBtn.offsetParent === null) {
          // Fallback: tìm theo text nếu không tìm thấy ID
          const allButtons = document.querySelectorAll('button, a, [role="button"]');
          for (const btn of allButtons) {
            if (btn.textContent && btn.textContent.includes('Sign in to your school')) {
              signinBtn = btn;
              break;
            }
          }
        }
        
        if (signinBtn && signinBtn.offsetParent !== null) {
          console.log('✅ Tìm thấy nút "Sign in to your school" với ID:', signinBtn.id || 'unknown');
          
          // Lắng nghe tab mới mở
          let newTabId = null;
          const originalTabCount = window.chrome?.tabs?.query ? 0 : -1; // Placeholder, sẽ xử lý trong background
          
          signinBtn.click();
          console.log('✅ Đã click vào "Sign in to your school"');
          
          return 'signin_clicked';
        }
        
        return false;
      }
      
      // Thử tìm ngay lập tức
      const result = findAndClickButton();
      if (result === true) {
        return; // Đã tìm thấy và click "Upload Proof of Enrollment"
      } else if (result === 'signin_clicked') {
        return; // Đã click "Sign in to your school", sẽ xử lý ở background
      }
      
      // Nếu chưa tìm thấy, thử lại sau một vài giây
      let attempts = 0;
      const maxAttempts = 10;
      
      const retryInterval = setInterval(() => {
        attempts++;
        console.log(`🔄 Thử lần ${attempts}/${maxAttempts} tìm nút...`);
        
        const result = findAndClickButton();
        if (result === true || result === 'signin_clicked') {
          clearInterval(retryInterval);
          return;
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(retryInterval);
          console.log('❌ Timeout - không tìm thấy nút "Sign in to your school" hoặc "Upload Proof of Enrollment"');
        }
      }, 1000);
    }
  }).catch(err => {
    console.error('Lỗi khi tìm nút post-submit:', err);
  });
}

// Điền form SheerID với cải thiện timing và retry logic
function fillSheerIDForm(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (studentInfo) => {
      console.log('🔍 DEBUG: Bắt đầu điền form SheerID với thông tin:', JSON.stringify(studentInfo, null, 2));
      
      // Validation đầu vào
      if (!studentInfo) {
        console.error('❌ ERROR: studentInfo is null or undefined!');
        return;
      }
      
      // Log từng field để debug
      console.log('🔍 DEBUG: Field values check:', {
        country: studentInfo.country,
        school: studentInfo.school,
        firstName: studentInfo.firstName,
        lastName: studentInfo.lastName,
        email: studentInfo.email,
        dateOfBirth: studentInfo.dateOfBirth
      });
      
      // Hàm đợi element xuất hiện với timeout
      function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
          const element = document.querySelector(selector);
          if (element) {
            console.log(`✅ Element đã sẵn sàng: ${selector}`);
            resolve(element);
            return;
          }
          
          const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
              console.log(`✅ Element đã xuất hiện sau mutation: ${selector}`);
              obs.disconnect();
              resolve(element);
            }
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          
          setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout waiting for element: ${selector}`));
          }, timeout);
        });
      }
      
      // Hàm đợi và điền form với retry logic cải tiến
      async function fillFormWithRetry() {
        const maxAttempts = 2; // Giảm từ 3 xuống 2 để ít loằng ngoằng hơn
        let attempt = 1;
        
        while (attempt <= maxAttempts) {
          try {
            console.log(`🔄 Attempt ${attempt}/${maxAttempts} to fill form...`);
            
            // Đợi các elements chính xuất hiện trước
            const mainSelectors = [
              'input[name*="school"], select[name*="school"]',
              'input[name*="firstName"], input[name*="first"]', 
              'input[name*="lastName"], input[name*="last"]',
              'input[name*="email"]'
            ];
            
            console.log('🔍 Đang đợi main form elements xuất hiện...');
            
            // Kiểm tra xem có ít nhất 2 trong 4 elements chính
            let foundElements = 0;
            for (const selector of mainSelectors) {
              try {
                await waitForElement(selector, 3000);
                foundElements++;
              } catch (e) {
                console.log(`⚠️ Element not found: ${selector}`);
              }
            }
            
            if (foundElements < 2) {
              throw new Error(`Only found ${foundElements}/4 main form elements`);
            }
            
            console.log(`✅ Found ${foundElements}/4 main form elements, proceeding with form fill...`);
            
            // Bắt đầu điền form theo thứ tự - không throw error nếu một field fail
            await fillFormFieldsWithContinue();
            
            console.log('✅ Form điền thành công!');
            break;
            
          } catch (error) {
            console.error(`❌ Attempt ${attempt} failed:`, error);
            
            if (attempt === maxAttempts) {
              console.error('❌ All attempts failed, but continuing anyway...');
              // Vẫn cố gắng điền form dù có lỗi
              try {
                await fillFormFieldsWithContinue();
              } catch (e) {
                console.error('❌ Final attempt also failed:', e);
              }
              return;
            }
            
            attempt++;
            console.log(`🔄 Waiting 1 second before retry...`); // Giảm từ 2s xuống 1s
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      // Main function to fill all form fields - cải tiến để continue khi một field fail
      async function fillFormFieldsWithContinue() {
        console.log('📝 Bắt đầu điền form theo thứ tự...');
        
        // 1. Điền Country trước tiên (nếu có)
        if (studentInfo.country) {
          try {
            console.log('🌍 Bước 1: Điền Country...');
            await fillCountryField(studentInfo.country);
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('✅ Country điền thành công');
          } catch (error) {
            console.error('❌ Country failed, continuing...', error);
          }
        }
        
        // 2. Điền First Name
        if (studentInfo.firstName) {
          try {
            console.log('👤 Bước 2: Điền First Name...');
            await fillField('input[name*="firstName"], input[name*="first"]', studentInfo.firstName, 'First Name');
            await new Promise(resolve => setTimeout(resolve, 200));
            console.log('✅ First Name điền thành công');
          } catch (error) {
            console.error('❌ First Name failed, continuing...', error);
          }
        }
        
        // 3. Điền Last Name
        if (studentInfo.lastName) {
          try {
            console.log('👤 Bước 3: Điền Last Name...');
            await fillField('input[name*="lastName"], input[name*="last"]', studentInfo.lastName, 'Last Name');
            await new Promise(resolve => setTimeout(resolve, 200));
            console.log('✅ Last Name điền thành công');
          } catch (error) {
            console.error('❌ Last Name failed, continuing...', error);
          }
        }
        
        // 4. Điền Email
        if (studentInfo.email) {
          try {
            console.log('📧 Bước 4: Điền Email...');
            await fillField('input[name*="email"], input[type="email"]', studentInfo.email, 'Email');
            await new Promise(resolve => setTimeout(resolve, 200));
            console.log('✅ Email điền thành công');
          } catch (error) {
            console.error('❌ Email failed, continuing...', error);
          }
        }
        
        // 5. Điền Date of Birth (nếu có)
        if (studentInfo.dateOfBirth) {
          try {
            console.log('📅 Bước 5: Điền Date of Birth...');
            await fillDateOfBirth(studentInfo.dateOfBirth);
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('✅ Date of Birth điền thành công');
          } catch (error) {
            console.error('❌ Date of Birth failed, continuing...', error);
          }
        }
        
        // 6. Điền School cuối cùng
        if (studentInfo.school) {
          try {
            console.log('🏫 Bước 6: Điền School (cuối cùng)...');
            await fillSchoolField(studentInfo.school);
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log('✅ School điền thành công');
          } catch (error) {
            console.error('❌ School failed, but continuing to submit...', error);
          }
        }
        
        console.log('📝 Hoàn thành điền form, chuẩn bị submit...');
        
        // 7. Submit form
        setTimeout(() => {
          submitForm();
        }, 1000);
      }

      // Backup function - giữ nguyên cho compatibility  
      async function fillFormFields() {
        return fillFormFieldsWithContinue();
      }
      
      // Start the process
      fillFormWithRetry();
      
      // Hàm helper để điền field với advanced validation (cải tiến)
      function fillField(selector, value, fieldType = 'text') {
        if (!value) {
          console.log(`⚠️ WARNING: Không có giá trị để điền cho ${fieldType}: "${selector}"`);
          return false;
        }
        
        const field = document.querySelector(selector);
        if (field) {
          console.log(`🎯 Điền ${fieldType}: ${selector} = "${value}"`);
          console.log(`🎯 Field details:`, {
            id: field.id,
            name: field.name,
            type: field.type,
            placeholder: field.placeholder,
            visible: field.offsetParent !== null,
            disabled: field.disabled,
            readonly: field.readOnly
          });
          
          // Check if field is actually visible and editable
          if (field.offsetParent === null) {
            console.log(`⚠️ WARNING: Field ${selector} is not visible`);
            return false;
          }
          
          if (field.disabled || field.readOnly) {
            console.log(`⚠️ WARNING: Field ${selector} is disabled or readonly`);
            return false;
          }
          
          // Step 1: Focus and activate field
          field.focus();
          field.click();
          
          // Step 2: Clear completely 
          field.value = '';
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Step 3: Set value using multiple methods for compatibility
          field.value = value;
          
          // For React/modern frameworks - set property directly
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(field, value);
          }
          
          // Step 4: Trigger all validation events
          const events = [
            'input',
            'change', 
            'keydown',
            'keyup',
            'blur',
            'focusout'
          ];
          
          events.forEach(eventType => {
            field.dispatchEvent(new Event(eventType, { bubbles: true }));
          });
          
          // Step 5: Special keyboard simulation for SheerID
          const keyboardEvent = new KeyboardEvent('keyup', {
            bubbles: true,
            cancelable: true,
            key: value.slice(-1), // Last character
            code: `Key${value.slice(-1).toUpperCase()}`,
            keyCode: value.slice(-1).charCodeAt(0)
          });
          field.dispatchEvent(keyboardEvent);
          
          // Step 6: Force validation check
          setTimeout(() => {
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('blur', { bubbles: true }));
          }, 50);
          
          // Step 7: Verify value was set correctly
          setTimeout(() => {
            if (field.value === value) {
              console.log(`✅ VERIFIED: ${fieldType} = "${value}" hiển thị chính xác trong UI`);
            } else {
              console.log(`⚠️ WARNING: ${fieldType} value trong DOM = "${field.value}" khác với expected = "${value}"`);
              
              // Try to force set value again
              field.value = value;
              field.dispatchEvent(new Event('input', { bubbles: true }));
              field.dispatchEvent(new Event('change', { bubbles: true }));
              console.log(`🔄 RETRY: Đã thử set lại ${fieldType} value = "${value}"`);
            }
          }, 100);
          
          console.log(`✅ Đã điền ${selector}: ${value}`);
          return true;
        } else {
          console.log(`❌ Không tìm thấy field với selector: ${selector}`);
        }
        return false;
      }
      
      // Hàm xử lý Date of Birth với cấu trúc SheerID đặc biệt
      async function fillDateOfBirth(dateValue) {
        if (!dateValue) return;
        
        // Parse date (format: YYYY-MM-DD)
        const dateParts = dateValue.split('-');
        if (dateParts.length !== 3) return;
        
        const year = dateParts[0];
        const monthWithZero = dateParts[1]; // "01", "02", etc.
        const month = parseInt(monthWithZero, 10).toString(); // "1", "2", etc. (remove leading zero)
        const day = dateParts[2];
        
        console.log(`Đang điền Date of Birth: ${month}/${day}/${year} (month without zero: ${month})`);
        
        // 1. Xử lý Month field (có dropdown giống School) - Dùng month không có số 0
        await fillMonthField(month);
        
        // 2. Xử lý Day field (autocomplete="bday-day")
        const daySelectors = [
          'input[name="sid-birthdate-day"]',
          'input[autocomplete="bday-day"]',
          'input[placeholder="Day"]',
          'input[aria-label="Day"]',
          'select[name*="day"]',
          'select[id*="day"]',
          'input[name*="day"]',
          'select[placeholder*="day"]',
          'select[placeholder*="ngày"]'
        ];
        
        for (const selector of daySelectors) {
          const dayField = document.querySelector(selector);
          if (dayField) {
            console.log(`✅ Tìm thấy day field với selector: ${selector}`, dayField);
            
            // Focus trước khi điền
            dayField.focus();
            
            // Clear existing value
            dayField.value = '';
            
            // Set new value
            dayField.value = day;
            
            // Trigger comprehensive events
            const events = [
              new Event('focus', { bubbles: true }),
              new Event('input', { bubbles: true, cancelable: true }),
              new Event('keydown', { bubbles: true }),
              new Event('keyup', { bubbles: true }),
              new Event('change', { bubbles: true }),
              new Event('blur', { bubbles: true })
            ];
            
            events.forEach(event => dayField.dispatchEvent(event));
            
            // Verify value was set for Day field
            setTimeout(() => {
              if (dayField.value === day) {
                console.log(`✅ VERIFIED: Day = "${day}" hiển thị chính xác trong UI`);
              } else {
                console.log(`⚠️ WARNING: Day value trong DOM = "${dayField.value}" khác với expected = "${day}"`);
                
                // Try to force set value again
                dayField.value = day;
                dayField.dispatchEvent(new Event('input', { bubbles: true }));
                dayField.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`🔄 RETRY: Đã thử set lại Day value = "${day}"`);
              }
            }, 200);
            
            console.log(`✅ Đã chọn ngày: ${day} bằng selector: ${selector}`);
            break;
          }
        }
        
        // 3. Xử lý Year field (autocomplete="bday-year")
        const yearSelectors = [
          'input[autocomplete="bday-year"]',
          'select[name*="year"]',
          'select[id*="year"]',
          'input[name*="year"]',
          'select[placeholder*="year"]',
          'select[placeholder*="năm"]'
        ];
        
        for (const selector of yearSelectors) {
          const yearField = document.querySelector(selector);
          if (yearField) {
            console.log(`✅ Tìm thấy year field với selector: ${selector}`, yearField);
            
            // Focus trước khi điền
            yearField.focus();
            
            // Clear existing value
            yearField.value = '';
            
            // Set new value
            yearField.value = year;
            
            // Trigger comprehensive events
            const events = [
              new Event('focus', { bubbles: true }),
              new Event('input', { bubbles: true, cancelable: true }),
              new Event('keydown', { bubbles: true }),
              new Event('keyup', { bubbles: true }),
              new Event('change', { bubbles: true }),
              new Event('blur', { bubbles: true })
            ];
            
            events.forEach(event => yearField.dispatchEvent(event));
            
            // Verify value was set for Year field
            setTimeout(() => {
              if (yearField.value === year) {
                console.log(`✅ VERIFIED: Year = "${year}" hiển thị chính xác trong UI`);
              } else {
                console.log(`⚠️ WARNING: Year value trong DOM = "${yearField.value}" khác với expected = "${year}"`);
              }
            }, 200);
            
            console.log(`✅ Đã chọn năm: ${year} bằng selector: ${selector}`);
            break;
          }
        }
        
        // Fallback: Chỉ dùng nếu không tìm thấy bất kỳ dropdown nào
        // (Tạm thời tắt để tránh ghi đè dropdown)
        /*
        const dateInputSelectors = [
          'input[type="date"]',
          'input[name*="birth"]',
          'input[name*="dob"]',
          'input[placeholder*="birth"]'
        ];
        
        for (const selector of dateInputSelectors) {
          const dateInput = document.querySelector(selector);
          if (dateInput) {
            dateInput.value = dateValue;
            dateInput.dispatchEvent(new Event('input', { bubbles: true }));
            dateInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`✅ Đã điền ngày sinh: ${dateValue} bằng selector: ${selector}`);
            break;
          }
        }
        */
      }
      
      // Hàm đặc biệt để xử lý Month field (có dropdown như School)
      async function fillMonthField(monthValue) {
        const monthSelectors = [
          'input[name*="month"]',
          'input[id*="month"]',
          'select[name*="month"]',
          'select[id*="month"]',
          'input[placeholder*="month"]',
          'input[placeholder*="tháng"]'
        ];
        
        let monthField = null;
        for (const selector of monthSelectors) {
          monthField = document.querySelector(selector);
          if (monthField) {
            console.log(`Tìm thấy month field với selector: ${selector}`);
            break;
          }
        }
        
        if (!monthField) {
          console.log('Không tìm thấy month field');
          return false;
        }
        
        // Nếu là select dropdown thông thường
        if (monthField.tagName === 'SELECT') {
          monthField.value = monthValue;
          monthField.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`✅ Đã chọn tháng từ select: ${monthValue}`);
          return true;
        }
        
        // Nếu là input với dropdown (giống School)
        if (monthField.tagName === 'INPUT') {
          // Click và focus
          monthField.click();
          monthField.focus();
          
          // Điền số tháng (không có leading zero)
          monthField.value = monthValue;
          
          console.log(`Đã điền month value: "${monthValue}" (không có leading zero)`);
          
          // Trigger events
          const events = ['focus', 'input', 'keydown', 'keyup', 'change'];
          events.forEach(eventType => {
            monthField.dispatchEvent(new Event(eventType, { bubbles: true }));
          });
          
          // Đợi và tìm dropdown item cho month
          return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 15;
            
            const checkForMonthDropdown = () => {
              attempts++;
              
              // Tìm month dropdown item (sid-birthdate_month-item-0)
              const monthItemSelectors = [
                '.sid-birthdate_month-item-0',
                '[class*="birthdate_month-item-0"]',
                '[class*="month-item"]:first-child',
                '[id*="month-item-0"]',
                '[role="option"]:first-child'
              ];
              
              let firstMonthItem = null;
              for (const selector of monthItemSelectors) {
                firstMonthItem = document.querySelector(selector);
                if (firstMonthItem && firstMonthItem.offsetParent !== null) {
                  console.log(`Tìm thấy month item với selector: ${selector}`);
                  break;
                }
              }
              
              if (firstMonthItem && firstMonthItem.offsetParent !== null) {
                // Hover và click
                firstMonthItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                
                setTimeout(() => {
                  firstMonthItem.click();
                  console.log('✅ Đã click vào month item đầu tiên');
                  resolve(true);
                }, 100);
                
                return;
              }
              
              // Debug month dropdown items
              if (attempts === 5) {
                console.log('Debug: Tìm tất cả month dropdown items:');
                const allMonthItems = document.querySelectorAll('[class*="month"], [class*="birthdate"], [role="option"]');
                allMonthItems.forEach((item, index) => {
                  if (item.offsetParent !== null) {
                    console.log(`Month item ${index}:`, {
                      text: item.textContent?.substring(0, 30),
                      classes: item.className,
                      id: item.id
                    });
                  }
                });
              }
              
              if (attempts < maxAttempts) {
                setTimeout(checkForMonthDropdown, 200);
              } else {
                console.log('Timeout - không tìm thấy month dropdown');
                resolve(false);
              }
            };
            
            setTimeout(checkForMonthDropdown, 300);
          });
        }
        
        return false;
      }
      
      // Hàm đặc biệt để xử lý country field với dropdown
      async function fillCountryField(countryName = "Vietnam") {
        const countrySelectors = [
          'select[name*="country"]',
          'select[id*="country"]', 
          'input[name*="country"]',
          'input[id*="country"]',
          'input[placeholder*="country"]',
          'input[placeholder*="Country"]',
          'input[aria-label*="country"]',
          '#country',
          '#sid-country',
          '[name="sid-country"]',
          '[role="combobox"][placeholder*="country"]'
        ];
        
        let countryField = null;
        for (const selector of countrySelectors) {
          countryField = document.querySelector(selector);
          if (countryField) {
            console.log(`Tìm thấy country field với selector: ${selector}`);
            break;
          }
        }
        
        if (!countryField) {
          console.log('Không tìm thấy field country');
          return false;
        }
        
          // Nếu là select dropdown thông thường
          if (countryField.tagName === 'SELECT') {
            // Tìm option có text chứa country name
            const options = countryField.querySelectorAll('option');
            let targetOption = null;
            
            for (const option of options) {
              const optionText = option.textContent.toLowerCase();
              const countryLower = countryName.toLowerCase();
              
              // Check exact match or contains
              if (optionText.includes(countryLower) ||
                  optionText.includes('vietnam') && countryLower.includes('vietnam') ||
                  optionText.includes('united states') && countryLower.includes('united states') ||
                  optionText.includes('usa') && countryLower.includes('united states') ||
                  optionText.includes('us') && countryLower.includes('united states') ||
                  option.value.toLowerCase().includes(countryLower)) {
                targetOption = option;
                break;
              }
            }
            
            if (targetOption) {
              countryField.value = targetOption.value;
              countryField.dispatchEvent(new Event('change', { bubbles: true }));
              console.log(`✅ Đã chọn country: ${targetOption.textContent}`);
              return true;
            }
          }        // Nếu là input với dropdown autocomplete
        if (countryField.tagName === 'INPUT') {
          // Click và focus
          countryField.click();
          countryField.focus();
          
          // Điền tên country
          countryField.value = countryName;
          
          console.log(`Đã điền country value: "${countryName}"`);
          
          // Trigger events
          const events = ['focus', 'input', 'keydown', 'keyup', 'change'];
          events.forEach(eventType => {
            countryField.dispatchEvent(new Event(eventType, { bubbles: true }));
          });
          
          // Đợi và tìm dropdown item cho country
          return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 15;
            
            const checkForCountryDropdown = () => {
              attempts++;
              
              // Tìm country dropdown item
              const countryItemSelectors = [
                '[role="option"]',
                '.dropdown-item',
                '.autocomplete-item',
                '.list-item',
                '.suggestion',
                '.option',
                '[class*="country-item"]',
                '[id*="country-item"]'
              ];
              
              let targetItem = null;
              for (const selector of countryItemSelectors) {
                const items = document.querySelectorAll(selector);
                for (const item of items) {
                  if (item.offsetParent !== null) {
                    const itemText = item.textContent.toLowerCase();
                    const countryLower = countryName.toLowerCase();
                    
                    // Check if this item matches our target country
                    if (itemText.includes(countryLower) ||
                        (itemText.includes('vietnam') || itemText.includes('viet nam')) && countryLower.includes('vietnam') ||
                        (itemText.includes('united states') || itemText.includes('usa') || itemText.includes('america')) && countryLower.includes('united states')) {
                      targetItem = item;
                      console.log(`Tìm thấy ${countryName} item với selector: ${selector}`);
                      break;
                    }
                  }
                }
                if (targetItem) break;
              }
              
              if (targetItem && targetItem.offsetParent !== null) {
                // Hover và click
                targetItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                
                setTimeout(() => {
                  targetItem.click();
                  console.log(`✅ Đã click vào ${countryName} item`);
                  resolve(true);
                }, 100);
                
                return;
              }
              
              // Debug country dropdown items
              if (attempts === 5) {
                console.log('Debug: Tìm tất cả country dropdown items:');
                const allCountryItems = document.querySelectorAll('[role="option"], .dropdown-item, [class*="item"]');
                allCountryItems.forEach((item, index) => {
                  if (item.offsetParent !== null) {
                    console.log(`Country item ${index}:`, {
                      text: item.textContent?.substring(0, 50),
                      classes: item.className,
                      id: item.id
                    });
                  }
                });
              }
              
              if (attempts < maxAttempts) {
                setTimeout(checkForCountryDropdown, 200);
              } else {
                console.log('Timeout - không tìm thấy country dropdown');
                resolve(false);
              }
            };
            
            setTimeout(checkForCountryDropdown, 300);
          });
        }
        
        return false;
      }

      // Hàm đặc biệt để xử lý trường học với dropdown (cải tiến timing)
      async function fillSchoolField(schoolName) {
        console.log(`🏫 Bắt đầu xử lý school field với tên: "${schoolName}"`);
        
        const schoolSelectors = [
          'input[id*="college"]',
          'input[name="school"]',
          'input[name="organization"]',
          'input[placeholder*="school"]',
          'input[placeholder*="trường"]',
          '#school',
          '#organization',
          '[role="combobox"]',
          'input[aria-autocomplete="list"]'
        ];
        
        let schoolField = null;
        for (const selector of schoolSelectors) {
          schoolField = document.querySelector(selector);
          if (schoolField) {
            console.log(`🎯 Tìm thấy school field với selector: ${selector}`);
            break;
          }
        }
        
        if (!schoolField) {
          console.log('❌ Không tìm thấy field trường học');
          return false;
        }
        
        // Bước 1: Clear field và focus
        console.log('📝 Bước 1: Clear và focus vào school field');
        schoolField.value = '';
        schoolField.focus();
        schoolField.click();
        
        // Đợi một chút để UI sẵn sàng
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Bước 2: Điền tên trường từng ký tự để trigger autocomplete tốt hơn
        console.log('⌨️ Bước 2: Điền tên trường từng ký tự');
        for (let i = 0; i < schoolName.length; i++) {
          schoolField.value = schoolName.substring(0, i + 1);
          
          // Trigger events cho từng ký tự
          schoolField.dispatchEvent(new Event('input', { bubbles: true }));
          schoolField.dispatchEvent(new KeyboardEvent('keydown', {
            key: schoolName[i],
            bubbles: true
          }));
          
          // Đợi một chút giữa các ký tự để autocomplete có thời gian phản hồi
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Trigger final events
        schoolField.dispatchEvent(new Event('input', { bubbles: true }));
        schoolField.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Thêm keyboard event để trigger autocomplete dropdown
        schoolField.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          code: 'ArrowDown',
          bubbles: true
        }));
        
        console.log(`✅ Đã điền đầy đủ tên trường: "${schoolName}"`);
        
        // Bước 3: Đợi dropdown hiện ra hoàn toàn với logic cải tiến
        console.log('⏰ Bước 3: Đợi dropdown load hoàn toàn...');
        
        return new Promise((resolve) => {
          let attempts = 0;
          const maxAttempts = 30; // Tăng từ 20 lên 30 (6 giây)
          let foundItemsCount = 0;
          let stableCount = 0; // Đếm số lần dropdown stable
          
          const checkForDropdown = () => {
            attempts++;
            
            // Tìm tất cả items trong dropdown
            const allItemSelectors = [
              '.sid-college-name-item-0',
              '[id*="college-name-item-0"]',
              '[class*="college-name-item"]',
              '[class*="college-name-item"][data-index="0"]',
              '[role="option"]',
              '.dropdown-item',
              '.autocomplete-item',
              'li[data-index]',
              'div[data-index]',
              '.list-item',
              '.suggestion',
              '.option'
            ];
            
            // Đếm tất cả items visible trong dropdown
            let totalItems = 0;
            let firstItem = null;
            
            for (const selector of allItemSelectors) {
              const items = document.querySelectorAll(selector);
              for (const item of items) {
                if (item.offsetParent !== null && item.textContent.trim()) {
                  totalItems++;
                  if (!firstItem) {
                    firstItem = item;
                  }
                }
              }
            }
            
            console.log(`🔍 Attempt ${attempts}/${maxAttempts}: Found ${totalItems} dropdown items`);
            
            // Kiểm tra dropdown đã stable chưa
            if (totalItems > 0) {
              if (totalItems === foundItemsCount) {
                stableCount++;
              } else {
                stableCount = 0; // Reset nếu số lượng items thay đổi
                foundItemsCount = totalItems;
              }
              
              // Nếu dropdown đã stable trong ít nhất 3 lần check (600ms) và có ít nhất 1 item
              if (stableCount >= 3 && totalItems >= 1 && firstItem) {
                console.log(`✅ Dropdown đã stable với ${totalItems} items, chọn item đầu tiên`);
                
                // Debug thông tin của item đầu tiên
                console.log('🎯 Item đầu tiên:', {
                  text: firstItem.textContent.trim(),
                  classes: firstItem.className,
                  id: firstItem.id,
                  visible: firstItem.offsetParent !== null
                });
                
                // Hover vào item để highlight
                firstItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                firstItem.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                
                // Đợi 500ms để đảm bảo dropdown hoàn toàn sẵn sàng trước khi click
                setTimeout(() => {
                  console.log('🖱️ Click vào item đầu tiên...');
                  firstItem.click();
                  firstItem.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                  
                  // Verify click thành công
                  setTimeout(() => {
                    if (schoolField.value && schoolField.value.toLowerCase().includes(schoolName.toLowerCase().substring(0, 5))) {
                      console.log('✅ School field đã được điền thành công:', schoolField.value);
                    } else {
                      console.log('⚠️ School field có thể chưa được điền đúng:', schoolField.value);
                    }
                  }, 200);
                  
                  resolve(true);
                }, 500);
                
                return;
              }
            }
            
            // Debug dropdown state mỗi 10 attempts
            if (attempts % 10 === 0) {
              console.log('🔍 Debug dropdown state:');
              const allPossibleItems = document.querySelectorAll('[class*="college"], [class*="item"], [role="option"], .dropdown *, .autocomplete *');
              let visibleCount = 0;
              allPossibleItems.forEach((item, index) => {
                if (item.offsetParent !== null && item.textContent.trim()) {
                  visibleCount++;
                  if (visibleCount <= 5) { // Chỉ log 5 items đầu tiên để tránh spam
                    console.log(`  Item ${visibleCount}:`, {
                      text: item.textContent.substring(0, 50),
                      classes: item.className,
                      selector: item.tagName + (item.id ? '#' + item.id : '') + (item.className ? '.' + item.className.split(' ')[0] : '')
                    });
                  }
                }
              });
              console.log(`📊 Total visible items: ${visibleCount}`);
            }
            
            // Tiếp tục check nếu chưa hết attempts
            if (attempts < maxAttempts) {
              setTimeout(checkForDropdown, 200);
            } else {
              console.log('⏰ Timeout - không tìm thấy dropdown ổn định sau', maxAttempts * 200, 'ms');
              console.log('🔄 Thử click vào field một lần nữa...');
              
              // Last attempt: thử click lại và tìm bất kỳ item nào
              schoolField.click();
              setTimeout(() => {
                const anyItem = document.querySelector('[role="option"], .dropdown-item, .autocomplete-item, .list-item');
                if (anyItem && anyItem.offsetParent !== null) {
                  console.log('🎯 Found fallback item, clicking...');
                  anyItem.click();
                  resolve(true);
                } else {
                  console.log('❌ No items found even after fallback');
                  resolve(false);
                }
              }, 500);
            }
          };
          
          // Bắt đầu check sau 500ms để dropdown có thời gian xuất hiện
          setTimeout(checkForDropdown, 500);
        });
      }
      
      // Thử các selector khác nhau cho các field khác
      const fieldSelectors = {
        firstName: [
          '#sid-first-name', // SheerID specific
          'input[name="sid-first-name"]',
          'input[autocomplete="given-name"]',
          'input[name="firstName"]',
          'input[name="first_name"]',
          'input[name="first-name"]',
          'input[name="fname"]',
          'input[id*="first"]',
          'input[id*="fname"]',
          'input[id*="given"]',
          'input[placeholder*="first"]',
          'input[placeholder*="First"]',
          'input[placeholder*="given"]',
          'input[placeholder*="tên"]',
          'input[aria-label*="first"]',
          'input[aria-label*="First"]',
          'input[data-name*="first"]',
          'input[class*="first"]',
          'input[class*="fname"]',
          '#firstName',
          '#first_name',
          '#fname',
          '#given-name',
          // Fallback: any input after school that might be first name
          'form input[type="text"]:nth-of-type(2)',
          'form input:not([type]):nth-of-type(2)'
        ],
        lastName: [
          '#sid-last-name',
          'input[autocomplete="family-name"]',
          'input[name="lastName"]',
          'input[name="last_name"]',
          'input[id*="last"]',
          'input[id*="lname"]',
          'input[placeholder*="last"]',
          'input[placeholder*="họ"]',
          '#lastName', 
          '#last_name',
          '#lname'
        ],
        email: [
          'input[autocomplete="email"]',
          'input[name="email"]',
          'input[type="email"]',
          'input[placeholder*="email"]',
          '#email'
        ]
      };

      
      
      // Điền country trước, sau đó mới điền school (async chain)
      fillCountryField(studentInfo.country || "Vietnam").then((countrySuccess) => {
        if (countrySuccess) {
          console.log('✅ Đã điền và chọn country thành công');
        } else {
          console.log('⚠️ Không tìm thấy field country hoặc lỗi khi điền');
        }
        
        // Sau khi điền xong country, điền trường học
        return fillSchoolField(studentInfo.school);
      }).then((success) => {
        if (success) {
          console.log('Đã điền và chọn trường học thành công');
        } else {
          console.log('Lỗi khi điền trường học, fallback về cách cũ');
          fillField('input[id*="college"]', studentInfo.school);
        }
        
        // Sau đó điền các field khác với delay để validation có thời gian xử lý
        console.log('🔍 Bắt đầu điền các field name và email...');
        
        // Điền từng field một cách tuần tự với delay
        const fillFieldsSequentially = async () => {
          const fieldOrder = ['firstName', 'lastName', 'email'];
          
          for (const fieldName of fieldOrder) {
            const selectors = fieldSelectors[fieldName];
            const value = studentInfo[fieldName];
            
            if (!value) continue;
            
            console.log(`🔍 Đang điền ${fieldName}: ${value}`);
            
            let fieldFound = false;
            for (const selector of selectors) {
              const field = document.querySelector(selector);
              if (field && field.offsetParent !== null) {
                console.log(`✅ Tìm thấy ${fieldName} field: ${selector}`);
                
                // Use enhanced fillField function
                const success = fillField(selector, value, fieldName);
                
                if (success) {
                  fieldFound = true;
                  break;
                }
              }
            }
            
            if (!fieldFound) {
              console.log(`❌ Không tìm thấy field ${fieldName}`);
            }
            
            // Delay 300ms giữa các field để validation có thời gian xử lý
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        };
        
        // Execute sequential fill và đợi hoàn tất
        fillFieldsSequentially().then(async () => {
          console.log('✅ Đã điền xong tất cả các field name và email');
          
          // Debug: In ra tất cả input fields trên trang
          const allInputs = document.querySelectorAll('input');
          console.log('🔍 DEBUG: Tất cả input fields trên trang:');
          allInputs.forEach((input, index) => {
            console.log(`Input ${index}:`, {
              id: input.id,
              name: input.name,
              type: input.type,
              autocomplete: input.autocomplete,
              placeholder: input.placeholder,
              className: input.className,
              ariaLabel: input.getAttribute('aria-label'),
              visible: input.offsetParent !== null,
              value: input.value
            });
          });
          
          // Debug đặc biệt cho First Name
          console.log('🔍 FIRST NAME DEBUG: Tìm tất cả field có thể là First Name:');
          const potentialFirstNameFields = Array.from(allInputs).filter(input => {
            const searchText = (
              (input.id || '') + ' ' +
              (input.name || '') + ' ' +
              (input.placeholder || '') + ' ' +
              (input.className || '') + ' ' +
              (input.getAttribute('aria-label') || '') + ' ' +
              (input.autocomplete || '')
            ).toLowerCase();
            
            return searchText.includes('first') || 
                   searchText.includes('given') || 
                   searchText.includes('fname') ||
                   input.autocomplete === 'given-name';
          });
          
          console.log('🎯 Potential First Name fields found:', potentialFirstNameFields.length);
          potentialFirstNameFields.forEach((input, index) => {
            console.log(`First Name Candidate ${index}:`, {
              element: input,
              RECOMMENDED_SELECTOR: input.id ? `#${input.id}` : 
                                    input.name ? `input[name="${input.name}"]` :
                                    input.autocomplete ? `input[autocomplete="${input.autocomplete}"]` :
                                    `input[placeholder="${input.placeholder}"]`,
              id: input.id,
              name: input.name,
              placeholder: input.placeholder,
              autocomplete: input.autocomplete,
              visible: input.offsetParent !== null,
              value: input.value
            });
          });
          
          // Xử lý Date of Birth và ĐỢI cho nó hoàn tất trước khi submit
          if (studentInfo.dateOfBirth) {
            console.log('🔍 Bắt đầu điền Date of Birth...');
            try {
              await fillDateOfBirth(studentInfo.dateOfBirth);
              console.log('✅ Đã điền xong Date of Birth, chờ 1 giây để validation hoàn tất...');
            } catch (error) {
              console.log('⚠️ Lỗi khi điền Date of Birth:', error);
            }
            
            // Thêm delay để đảm bảo Date of Birth được xử lý hoàn tất
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('✅ Date of Birth validation hoàn tất');
          } else {
            console.log('ℹ️ Không có Date of Birth để điền');
          }
          
          // Bây giờ mới tìm và click nút submit
          console.log('🔍 Tất cả fields đã được điền, tìm nút Verify student status để click...');
          
          const submitSelectors = [
            '#verify-status-text',
            'button[type="submit"]',
            'input[type="submit"]',
            'button:has-text("Submit")',
            'button:has-text("Verify")',
            'button:has-text("Continue")'
          ];
          
          let submitBtn = null;
          for (const selector of submitSelectors) {
            submitBtn = document.querySelector(selector);
            if (submitBtn) {
              console.log(`✅ Tìm thấy nút submit với selector: ${selector}`, submitBtn);
              break;
            }
          }
          
          if (submitBtn) {
            console.log('Tìm thấy nút submit:', submitBtn.textContent || submitBtn.id);
            
            // Highlight nút trước khi click (để user biết)
            submitBtn.style.border = '3px solid red';
            submitBtn.style.backgroundColor = '#ffeb3b';
            
            // Đợi 2-3 giây rồi tự động click
            setTimeout(() => {
              console.log('🚀 Tự động click nút Verify student status...');
              submitBtn.click();
              console.log('✅ Đã click vào nút Verify student status');
              
              // Sau khi click, đợi trang load rồi tìm nút tiếp theo
              setTimeout(() => {
                handlePostSubmitInSameTab();
              }, 3000);
            }, 2500); // 2.5 giây
            
          } else {
            console.log('❌ Không tìm thấy nút submit để tự động click');
          }
        });
      });
      
      // Function xử lý sau khi submit trong cùng tab
      function handlePostSubmitInSameTab() {
        console.log('🔍 Tìm nút "Sign in to your school" hoặc "Upload Proof of Enrollment"...');
        
        function findAndClickButton() {
          // Tìm nút "Upload Proof of Enrollment" trước
          const allButtons = document.querySelectorAll('button, a, [role="button"]');
          
          let uploadBtn = null;
          let signinBtn = null;
          
          // Tìm "Upload Proof of Enrollment" theo text
          for (const btn of allButtons) {
            if (btn.textContent && btn.textContent.includes('Upload Proof of Enrollment')) {
              uploadBtn = btn;
            }
          }
          
          // Tìm "Sign in to your school" theo ID và text
          signinBtn = document.querySelector('#sid-submit-btn-sso');
          if (!signinBtn || signinBtn.offsetParent === null) {
            // Fallback: tìm theo text nếu không tìm thấy ID
            for (const btn of allButtons) {
              if (btn.textContent && btn.textContent.includes('Sign in to your school')) {
                signinBtn = btn;
                break;
              }
            }
          }
          
          if (uploadBtn && uploadBtn.offsetParent !== null) {
            console.log('✅ Tìm thấy nút "Upload Proof of Enrollment", click luôn...');
            uploadBtn.click();
            console.log('✅ Đã click vào "Upload Proof of Enrollment"');
            return true;
          }
          
          if (signinBtn && signinBtn.offsetParent !== null) {
            console.log('✅ Tìm thấy nút "Sign in to your school" với ID:', signinBtn.id || 'unknown');
            
            // Store current tab info trước khi click
            const currentURL = window.location.href;
            
            signinBtn.click();
            console.log('✅ Đã click vào "Sign in to your school"');
            
            // Đợi một chút rồi check xem có tab mới không, nếu có thì đóng và quay lại
            setTimeout(() => {
              // Nếu URL vẫn như cũ, có nghĩa là mở tab mới
              if (window.location.href === currentURL) {
                console.log('🔄 Đã mở tab mới cho sign in, đợi nút chuyển thành Upload...');
                // Retry tìm nút "Upload Proof of Enrollment" sau một vài giây
                setTimeout(() => {
                  retryFindUploadButton();
                }, 3000);
              }
            }, 1000);
            
            return 'signin_clicked';
          }
          
          return false;
        }
        
        function retryFindUploadButton() {
          let attempts = 0;
          const maxAttempts = 10;
          
          const retryInterval = setInterval(() => {
            attempts++;
            console.log(`🔄 Thử lần ${attempts}/${maxAttempts} tìm nút "Upload Proof of Enrollment"...`);
            
            const allButtons = document.querySelectorAll('button, a, [role="button"]');
            for (const btn of allButtons) {
              if (btn.textContent && btn.textContent.includes('Upload Proof of Enrollment') && btn.offsetParent !== null) {
                console.log('✅ Tìm thấy nút "Upload Proof of Enrollment" sau khi sign in!');
                btn.click();
                console.log('✅ Đã click vào "Upload Proof of Enrollment"');
                clearInterval(retryInterval);
                return;
              }
            }
            
            if (attempts >= maxAttempts) {
              clearInterval(retryInterval);
              console.log('❌ Timeout - không tìm thấy nút "Upload Proof of Enrollment" sau sign in');
            }
          }, 1000);
        }
        
        // Thử tìm ngay lập tức
        const result = findAndClickButton();
        if (result === true) {
          return; // Đã tìm thấy và click "Upload Proof of Enrollment"
        } else if (result === 'signin_clicked') {
          return; // Đã click "Sign in to your school", đang đợi
        }
        
        // Nếu chưa tìm thấy, thử lại sau một vài giây
        let attempts = 0;
        const maxAttempts = 10;
        
        const retryInterval = setInterval(() => {
          attempts++;
          console.log(`🔄 Thử lần ${attempts}/${maxAttempts} tìm nút...`);
          
          const result = findAndClickButton();
          if (result === true || result === 'signin_clicked') {
            clearInterval(retryInterval);
            return;
          }
          
          if (attempts >= maxAttempts) {
            clearInterval(retryInterval);
            console.log('❌ Timeout - không tìm thấy nút "Sign in to your school" hoặc "Upload Proof of Enrollment"');
          }
        }, 1000);
      }
    },
    args: [currentStudentInfo] // Truyền studentInfo vào function
  }).catch(err => {
    console.error('Lỗi khi điền form SheerID:', err);
  });
}

// Xử lý lỗi chung
chrome.runtime.onInstalled.addListener(() => {
  console.log('Student Card Auto Verifier đã được cài đặt');
});
