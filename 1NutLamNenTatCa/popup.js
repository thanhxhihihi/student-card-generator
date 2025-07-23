// Popup script
document.addEventListener('DOMContentLoaded', function() {
  const directVerifyBtn = document.getElementById('directVerifyBtn');
  const extractBtn = document.getElementById('extractBtn');
  const statusDiv = document.getElementById('status');
  
  // Load saved config và kiểm tra auto-filled data
  chrome.storage.sync.get(['studentInfo', 'autoFilled', 'lastUpdated'], (result) => {
    if (result.studentInfo) {
      // Điền thông tin vào form
      document.getElementById('school').value = result.studentInfo.school || '';
      document.getElementById('firstName').value = result.studentInfo.firstName || '';
      document.getElementById('lastName').value = result.studentInfo.lastName || '';
      document.getElementById('dateOfBirth').value = result.studentInfo.dateOfBirth || '';
      document.getElementById('email').value = result.studentInfo.email || '';
      
      // Hiển thị thông báo nếu data được auto-fill từ website
      if (result.autoFilled && result.lastUpdated) {
        const lastUpdated = new Date(result.lastUpdated);
        const timeAgo = getTimeAgo(lastUpdated);
  // Khi nhấn nút Verify Google One, mở tab Google One, lấy email meta và cập nhật vào popup
  document.addEventListener('DOMContentLoaded', function () {
    const verifyBtn = document.getElementById('directVerifyBtn');
    const emailInput = document.getElementById('email');

    verifyBtn.addEventListener('click', async function () {
      // Mở tab mới tới Google One AI Student
      chrome.tabs.create({ url: 'https://one.google.com/u/1/ai-student', active: true }, function (tab) {
        // Đợi tab load xong rồi inject script lấy meta
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === tab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            // Inject script lấy content meta[name="og-profile-acct"] (chờ tối đa 10s)
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: function () {
                return new Promise((resolve) => {
                  let tries = 0;
                  function check() {
                    const meta = document.querySelector('meta[name="og-profile-acct"]');
                    if (meta && meta.content) {
                      resolve(meta.content);
                    } else if (tries++ < 50) {
                      setTimeout(check, 200); // thử lại mỗi 200ms, tối đa 10s
                    } else {
                      resolve('');
                    }
                  }
                  check();
                });
              }
            }, (results) => {
              if (results && results[0] && results[0].result) {
                const email = results[0].result;
                // Gửi message về popup
                chrome.runtime.sendMessage({ action: 'updateEmail', email });
              }
            });
          }
        });
      });
    });

    // Lắng nghe message để cập nhật trường email
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      if (msg.action === 'updateEmail' && msg.email) {
        emailInput.value = msg.email;
        emailInput.style.backgroundColor = '#e8f5e8';
        setTimeout(() => { emailInput.style.backgroundColor = ''; }, 2000);
      }
    });
  });
        showStatus('info', `📋 Extracted from Student Card (${timeAgo})`);
        
        // Highlight các field được auto-fill
        const fields = ['school', 'firstName', 'lastName', 'dateOfBirth', 'email'];
        fields.forEach(fieldId => {
          const field = document.getElementById(fieldId);
          if (field && field.value) {
            field.style.backgroundColor = '#e8f5e8';
            field.style.border = '2px solid #4CAF50';
          }
        });
        
        // Focus vào nút verify để user biết bước tiếp theo
        directVerifyBtn.style.animation = 'pulse 2s infinite';
        setTimeout(() => {
          directVerifyBtn.style.animation = '';
        }, 6000);
      } else {
        // Data được nhập manual hoặc từ direct verify
        showStatus('success', '✅ Ready to verify');
      }
    }
  });
  
  // Event listener cho nút Direct Verify
  directVerifyBtn.addEventListener('click', function() {
    // Lấy thông tin từ form
    const studentInfo = {
      school: document.getElementById('school').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      dateOfBirth: document.getElementById('dateOfBirth').value,
      email: document.getElementById('email').value
    };
    
    // Validate thông tin
    if (!studentInfo.school || !studentInfo.firstName || !studentInfo.lastName || !studentInfo.email) {
      showStatus('error', '❌ Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    // Disable button và show status
    directVerifyBtn.disabled = true;
    directVerifyBtn.textContent = '⏳ Đang verify...';
    
    showStatus('info', '🔐 Bắt đầu verify Google One Student...');
    
    // Save thông tin và bắt đầu verify trực tiếp
    chrome.storage.sync.set({ 
      studentInfo,
      autoFilled: false 
    });
    
    // Gửi message trực tiếp để verify Google One
    chrome.runtime.sendMessage({
      action: 'startDirectVerification',
      studentInfo: studentInfo
    }, (response) => {
      if (response && response.success) {
        showStatus('success', '✅ Đang mở Google One... Vui lòng hoàn tất verification!');
        // Đợi trang SheerID load hoàn toàn rồi mới điền thông tin
        // (inject script sẽ chờ selector input[name="firstName"] xuất hiện)
        // Tự động đóng popup sau 3 giây
        setTimeout(() => {
          window.close();
        }, 3000);
      } else {
        showStatus('error', '❌ Lỗi: ' + (response?.error || 'Không thể bắt đầu verification'));
        directVerifyBtn.disabled = false;
        directVerifyBtn.textContent = '🔐 Verify Google One';
      }
    });
  });
  
  // Helper function để hiển thị status
  function showStatus(type, message) {
    // Cho phép truyền HTML nếu message chứa thẻ <a>
    if (/<a\s/i.test(message)) {
      statusDiv.innerHTML = message;
    } else {
      statusDiv.textContent = message;
    }
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
  }
  
  // Helper function để tính thời gian
  function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  }
});

// Lắng nghe message từ background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStatus') {
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
      statusDiv.className = `status ${request.type}`;
      statusDiv.textContent = request.message;
    }
  }
});

// Event listener cho nút Extract từ website
document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extractBtn');
  const loadTestDataBtn = document.getElementById('loadTestDataBtn');
  
  // Helper function để hiển thị status
  function showStatus(type, message) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
  }
  
  // Event listener cho Load Test Data button
  if (loadTestDataBtn) {
    loadTestDataBtn.addEventListener('click', function() {
      // Test data mô phỏng SheerID
      const testData = {
        school: "Indian Institute of Technology Madras (Chennai, Tamil Nadu)",
        firstName: "Lan",
        lastName: "Phuong",
        email: "lan.phuong2345@gmail.com",
        dateOfBirth: "1995-05-15",
        extractedAt: new Date().toISOString(),
        source: 'test-data'
      };
      
      // Điền vào form
      document.getElementById('school').value = testData.school;
      document.getElementById('firstName').value = testData.firstName;
      document.getElementById('lastName').value = testData.lastName;
      document.getElementById('dateOfBirth').value = testData.dateOfBirth;
      document.getElementById('email').value = testData.email;
      
      // Highlight các field
      const fields = ['school', 'firstName', 'lastName', 'dateOfBirth', 'email'];
      fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          field.style.backgroundColor = '#fff3e0';
          field.style.border = '2px solid #ff9800';
        }
      });
      
      // Lưu vào storage
      chrome.storage.sync.set({
        studentInfo: testData,
        autoFilled: false,
        lastUpdated: new Date().toISOString()
      });
      
      showStatus('success', '🧪 Test data loaded successfully!');
      
      // Focus vào verify button
      const directVerifyBtn = document.getElementById('directVerifyBtn');
      if (directVerifyBtn) {
        directVerifyBtn.style.animation = 'pulse 2s infinite';
        setTimeout(() => {
          directVerifyBtn.style.animation = '';
        }, 4000);
      }
    });
  }
  
  if (extractBtn) {
    extractBtn.addEventListener('click', async function() {
      // Disable button và show loading
      extractBtn.disabled = true;
      extractBtn.textContent = '⏳ Extracting...';
      
      showStatus('info', '📋 Reading student card from website...');
      
      // Gửi message đến content script để extract thông tin
      chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
        const currentTab = tabs[0];
        
        // Kiểm tra xem tab hiện tại có phải là student card website không
        const allowedUrls = ['localhost:3000', 'thesinhvien.html'];
        const isValidUrl = allowedUrls.some(url => currentTab.url.includes(url));

        if (!isValidUrl) {
          const errorMessage = `
            ❌ Xin vui lòng truy cập vào trang web 
            https://hungvu.id.vn/thesinhvien.html
            để có thể sử dụng tiện ích.
          `;
          showStatus('error', errorMessage.trim());
          extractBtn.disabled = false;
          extractBtn.textContent = '📋 Extract Info from Website';
          return;
        }
        console.log('🔍 DEBUG: Attempting to inject content script first...');
        
        // Inject content script manually để đảm bảo nó được load
        try {
          await chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['content.js']
          });
          console.log('🔍 DEBUG: Content script injected successfully');
        } catch (scriptError) {
          console.log('🔍 DEBUG: Script injection failed (might already be injected):', scriptError);
        }
        
        // Đợi một chút để content script khởi tạo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Gửi message đến content script để extract data
        chrome.tabs.sendMessage(currentTab.id, {
          action: 'extractStudentInfo'
        }, (response) => {
          console.log('🔍 DEBUG: Response from content script:', response);
          console.log('🔍 DEBUG: Chrome runtime error:', chrome.runtime.lastError);
          
          if (chrome.runtime.lastError) {
            console.error('🔍 DEBUG: Runtime error details:', chrome.runtime.lastError.message);
            showStatus('error', '❌ Cannot connect to website. Please refresh the page and try again.');
            extractBtn.disabled = false;
            extractBtn.textContent = '📋 Extract Info from Website';
            return;
          }
          
          if (response && response.success && response.studentInfo) {
            console.log('🔍 DEBUG: Successfully extracted:', response.studentInfo);
            
            // Điền thông tin vào form
            document.getElementById('school').value = response.studentInfo.school || '';
            document.getElementById('firstName').value = response.studentInfo.firstName || '';
            document.getElementById('lastName').value = response.studentInfo.lastName || '';
            document.getElementById('dateOfBirth').value = response.studentInfo.dateOfBirth || '';
            document.getElementById('email').value = response.studentInfo.email || '';
            
            // Save data với auto-filled flag
            chrome.storage.sync.set({
              studentInfo: response.studentInfo,
              autoFilled: true,
              lastUpdated: Date.now()
            });
            
            showStatus('success', '✅ Student info extracted successfully!');
            
            // Highlight các field được extract
            const fields = ['school', 'firstName', 'lastName', 'dateOfBirth', 'email'];
            fields.forEach(fieldId => {
              const field = document.getElementById(fieldId);
              if (field && field.value) {
                field.style.backgroundColor = '#e8f5e8';
                field.style.border = '2px solid #4CAF50';
              }
            });
            
            // Pulse animation cho verify button
            const directVerifyBtn = document.getElementById('directVerifyBtn');
            if (directVerifyBtn) {
              directVerifyBtn.style.animation = 'pulse 2s infinite';
              setTimeout(() => {
                directVerifyBtn.style.animation = '';
              }, 6000);
            }
            
          } else {
            console.error('🔍 DEBUG: No data or failed response:', response);
            showStatus('error', '❌ No student card found on current page!');
          }
          
          extractBtn.disabled = false;
          extractBtn.textContent = '📋 Extract Info from Website';
        });
        
        // Timeout fallback để tránh button bị stuck
        setTimeout(() => {
          if (extractBtn.disabled) {
            console.log('🔍 DEBUG: Extract timeout - resetting button');
            extractBtn.disabled = false;
            extractBtn.textContent = '📋 Extract Info from Website';
            showStatus('error', '⏰ Extraction timeout - please try again');
          }
        }, 8000);
      });
    });
  }
});
