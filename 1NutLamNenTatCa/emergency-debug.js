// Tiện ích này được làm bởi Hung Vu : fb.com/hungvu25
// 🔍 EMERGENCY DEBUG SCRIPT - Paste vào Console của SheerID page
// (Đã loại bỏ toàn bộ log ra console)

// Hàm chờ selector input xuất hiện (Promise)
function waitForInput(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      observer.disconnect();
      reject('Timeout: ' + selector + ' not found');
    }, timeout);
  });
}

// Thông tin cần điền (bạn thay bằng dữ liệu thực tế)
const studentInfo = {
  firstName: 'PrePriVi',
  lastName: 'Yadav',
  email: 'prepriviyadav4354@gmail.com',
  school: 'Manipal Academy of Higher Education',
  dateOfBirth: '2004-04-08',
};

(async () => {
  try {
    // Chờ các trường xuất hiện
    const firstNameInput = await waitForInput('input[name="firstName"], input[autocomplete="given-name"], input[id*="first"], input[placeholder*="first" i], input[aria-label*="first" i]');
    const lastNameInput = await waitForInput('input[name="lastName"], input[autocomplete="family-name"], input[id*="last"], input[placeholder*="last" i], input[aria-label*="last" i]');
    const emailInput = await waitForInput('input[type="email"], input[name="email"], input[autocomplete="email"], input[placeholder*="email" i]');
    // Trường school có thể là text hoặc select
    let schoolInput = document.querySelector('input[name*="school" i], input[placeholder*="school" i], input[name*="college" i], input[placeholder*="college" i], input[name*="university" i], input[placeholder*="university" i], input[name*="institution" i], input[placeholder*="institution" i]');
    if (!schoolInput) {
      // Nếu là select
      schoolInput = document.querySelector('select');
    }
    // Ngày sinh có thể là input[type=date] hoặc 3 trường riêng
    let dobInput = document.querySelector('input[type="date"], input[name*="birth" i], input[autocomplete*="bday"], input[name*="date" i]');

    // Điền giá trị
    if (firstNameInput) firstNameInput.value = studentInfo.firstName;
    if (lastNameInput) lastNameInput.value = studentInfo.lastName;
    if (emailInput) emailInput.value = studentInfo.email;
    if (schoolInput) schoolInput.value = studentInfo.school;
    if (dobInput) dobInput.value = studentInfo.dateOfBirth;
  } catch (e) {
    // Không log ra console để tránh lộ debug
  }
})();










