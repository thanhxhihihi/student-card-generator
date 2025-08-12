// Danh sách các trường đại học Mỹ
const usUniversities = [
    // {
    //     name: "Harvard University",
    //     shortName: "HU",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/1200px-Harvard_University_logo.svg.png"
    // },
    // {
    //     name: "Stanford University",
    //     shortName: "SU",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Seal_of_Leland_Stanford_Junior_University.svg/1200px-Seal_of_Leland_Stanford_Junior_University.svg.png"
    // },
    // {
    //     name: "Massachusetts Institute of Technology",
    //     shortName: "MIT",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png"
    // },
    // {
    //     name: "Yale University",
    //     shortName: "YU",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Yale_University_Shield_1.svg/1200px-Yale_University_Shield_1.svg.png"
    // },
    // {
    //     name: "Princeton University",
    //     shortName: "PU",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Princeton_seal.svg/1200px-Princeton_seal.svg.png"
    // },
    // {
    //     name: "University of California, Berkeley",
    //     shortName: "UCB",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/University_of_California%2C_Berkeley_logo.svg/1200px-University_of_California%2C_Berkeley_logo.svg.png"
    // },
    // {
    //     name: "Columbia University",
    //     shortName: "CU",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Columbia_University_shield.svg/1200px-Columbia_University_shield.svg.png"
    // },
    // {
    //     name: "University of Chicago",
    //     shortName: "UC",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/University_of_Chicago_shield.svg/1200px-University_of_Chicago_shield.svg.png"
    // },
    // {
    //     name: "Carnegie Mellon University",
    //     shortName: "CMU",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Carnegie_Mellon_University_seal.svg/1200px-Carnegie_Mellon_University_seal.svg.png"
    // },
    // {
    //     name: "New York University",
    //     shortName: "NYU",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/New_York_University_seal.svg/1200px-New_York_University_seal.svg.png"
    // },
    // {
    //     name: "University of Pennsylvania",
    //     shortName: "UPenn",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UPenn_shield_with_banner.svg/1200px-UPenn_shield_with_banner.svg.png"
    // },
    // {
    //     name: "Duke University",
    //     shortName: "DU",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Duke_University_seal.svg/1200px-Duke_University_seal.svg.png"
    // },
    // {
    //     name: "Northwestern University",
    //     shortName: "NU",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Northwestern_University_seal.svg/1200px-Northwestern_University_seal.svg.png"
    // },
    // {
    //     name: "California Institute of Technology",
    //     shortName: "Caltech",
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Caltech_Logo.svg/1200px-Caltech_Logo.svg.png"
    // },
    {
        name: "Santa Fe College",
        shortName: "SFC",
        logo: "logous.png"
    }
];

// Tên Mỹ phổ biến
const usFirstNames = [
    // Male names
    "James", "Robert", "John", "Michael", "David", "William", "Richard", "Thomas", "Christopher", "Charles",
    "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Joshua", "Kenneth", "Kevin",
    "Brian", "George", "Timothy", "Ronald", "Jason", "Edward", "Jeffrey", "Ryan", "Jacob", "Gary",
    "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin", "Samuel",
    
    // Female names
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Lisa", "Nancy", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon", "Michelle",
    "Laura", "Amy", "Kimberly", "Deborah", "Dorothy", "Kathleen", "Angela", "Brenda", "Emma", "Olivia"
];

const usLastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
];

function generateUSFullName() {
    const firstName = getRandomElement(usFirstNames);
    const lastName = getRandomElement(usLastNames);
    return `${firstName} ${lastName}`;
}

// Các trường/khoa trong trường đại học Mỹ
const usSchools = [
    "School of Engineering", "College of Arts & Sciences", "Business School", "School of Medicine",
    "Law School", "School of Education", "College of Liberal Arts", "School of Nursing",
    "School of Computer Science", "College of Natural Sciences", "School of Social Work",
    "Graduate School", "School of Public Health", "School of Architecture", "College of Fine Arts"
];

// Các chuyên ngành phổ biến ở Mỹ
const usMajors = [
    "Computer Science", "Business Administration", "Psychology", "Biology", "Engineering",
    "Economics", "English Literature", "Political Science", "Communications", "Pre-Med",
    "Mathematics", "History", "Chemistry", "Physics", "Art", "Music", "Philosophy",
    "Sociology", "International Relations", "Environmental Science", "Finance", "Marketing",
    "Data Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering"
];

// Lưu danh sách ảnh trả về từ API để chọn
let studentPhotoList = [];

// Hàm lấy ảnh từ thispersonnotexist.org qua proxy server, trả về mảng URL ảnh
async function getStudentPhotoList() {
    try {
        const response = await fetch('/api/load-faces', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "type": "R",
                "age": "21-35",
                "race": "white",
                "emotion": "none"
            })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.fc && data.fc.length > 0) {
                // Trả về mảng URL ảnh
                return data.fc.map(base64Image => `/api/image/${base64Image}`);
            } else {
                throw new Error('No images in response');
            }
        } else {
            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        }
    } catch (error) {
        throw error;
    }
}

// Hiển thị danh sách thumbnail ảnh cho người dùng chọn
function showPhotoSelection(photoList, selectedIndex = 0) {
    let container = document.getElementById('photo-selection');
    if (!container) {
        container = document.createElement('div');
        container.id = 'photo-selection';
        container.style.display = 'flex';
        container.style.gap = '10px';
        container.style.margin = '0 0 16px 0';
        container.style.justifyContent = 'center';
        container.style.flexWrap = 'wrap';
        // Đặt container phía trên card
        const card = document.querySelector('.card');
        card.parentNode.insertBefore(container, card);
    }
    container.innerHTML = '';
    photoList.forEach((url, idx) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Photo ${idx+1}`;
        img.style.width = '60px';
        img.style.height = '75px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        img.style.border = idx === selectedIndex ? '3px solid #1a7ec7' : '2px solid #ccc';
        img.style.cursor = 'pointer';
        img.title = 'Chọn ảnh này';
        img.onclick = () => {
            document.getElementById('student-photo').src = url;
            showPhotoSelection(photoList, idx);
        };
        container.appendChild(img);
    });
    container.style.display = 'flex';
}
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateUSRandomDate() {
    const today = new Date();
    const minAge = 18;
    const maxAge = 25;
    
    const randomAge = minAge + Math.floor(Math.random() * (maxAge - minAge + 1));
    const birthYear = today.getFullYear() - randomAge;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;
    
    // US format: MM/DD/YYYY
    return `${birthMonth.toString().padStart(2, '0')}/${birthDay.toString().padStart(2, '0')}/${birthYear}`;
}

function generateUSStudentID(universityShort) {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 9999999999).toString().padStart(10, '0');
    return `${universityShort}${year}.${randomNumber}`;
}

function generateUSCourse() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear;
    const endYear = startYear + 4;
    return `${startYear} - ${endYear}`;
}

function generateUSValidUntil() {
    // Random valid date between 2028-2029
    const startYear = 2028;
    const endYear = 2029;
    const month = Math.floor(Math.random() * 12) + 1;
    const year = Math.random() < 0.5 ? startYear : endYear;
    const day = Math.floor(Math.random() * 28) + 1;
    
    // US format: MM/DD/YYYY
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
}

async function generateUSStudentCard() {
    // Enhanced loading state with better UX
    const generateBtn = document.querySelector('.btn-generate');
    const btnText = generateBtn.querySelector('.btn-text') || generateBtn;
    const originalText = btnText.textContent;
    const card = document.querySelector('.card');
    
    // Add loading spinner and disable button
    btnText.innerHTML = '<span class="loading-spinner"></span>Generating...';
    generateBtn.disabled = true;
    generateBtn.style.pointerEvents = 'none';
    card.classList.add('generating');

    try {
        // Add a small delay for better UX perception
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const university = getRandomElement(usUniversities);
        const studentName = generateUSFullName();
        const school = getRandomElement(usSchools);
        const major = getRandomElement(usMajors);
        const dob = generateUSRandomDate();
        const course = generateUSCourse();
        const studentID = generateUSStudentID(university.shortName);
        const validUntil = generateUSValidUntil();

        // Show progress update
        btnText.innerHTML = '<span class="loading-spinner"></span>Loading Photos...';

        // Lấy danh sách ảnh và lưu lại
        studentPhotoList = await getStudentPhotoList();
        if (!studentPhotoList || studentPhotoList.length === 0) throw new Error('No photos available');
        // Chọn ngẫu nhiên 1 ảnh làm mặc định
        const randomIndex = Math.floor(Math.random() * studentPhotoList.length);
        const studentPhoto = studentPhotoList[randomIndex];

        // Update card information with smooth transition
        card.style.opacity = '0.7';
        await new Promise(resolve => setTimeout(resolve, 300));

        document.getElementById('university-name').textContent = university.name;
        document.getElementById('student-name').textContent = studentName;
        document.getElementById('student-dob').textContent = dob;
        document.getElementById('student-course').textContent = course;
        document.getElementById('student-class').textContent = major;
        document.getElementById('student-department').textContent = school;
        document.getElementById('student-id').innerHTML = `🆔 Student ID: ${studentID}`;
        document.getElementById('valid-until').textContent = validUntil;

        // Load images with progress feedback
        btnText.innerHTML = '<span class="loading-spinner"></span>Loading Images...';

        document.getElementById('university-logo').src = university.logo;
        document.getElementById('student-photo').src = studentPhoto;

        // Hiển thị danh sách thumbnail cho người dùng chọn
        showPhotoSelection(studentPhotoList, randomIndex);

        // Update barcode
        const barcodeUrl = `/api/barcode?data=${encodeURIComponent(university.name)}&code=Code128`;
        document.getElementById('barcode').src = barcodeUrl;

        // Restore card opacity with animation
        card.style.opacity = '1';
        card.style.transform = 'scale(0.95)';
        await new Promise(resolve => setTimeout(resolve, 100));
        card.style.transform = 'scale(1)';

        // Final delay to ensure images are loaded
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Success feedback with notification
        btnText.innerHTML = '✅ Generated Successfully!';
        showNotification('🎉 Student card generated successfully!', 'success', 2000);
        await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
        console.error('Generation error:', error);
        // Enhanced error feedback with notification
        btnText.innerHTML = '❌ Generation Failed';
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show user-friendly error message via notification
        const errorMessage = error.message.includes('fetch') 
            ? 'Network error: Please check your internet connection and try again.' 
            : `Error: ${error.message}`;
        
        showNotification(`❌ Unable to generate student card.<br><small>${errorMessage}</small>`, 'error', 5000);
    } finally {
        // Restore button state with smooth transition
        setTimeout(() => {
            btnText.textContent = originalText;
            generateBtn.disabled = false;
            generateBtn.style.pointerEvents = 'auto';
            card.classList.remove('generating');
            
            // Enable download button with animation
            const downloadBtn = document.querySelector('.btn-download');
            downloadBtn.disabled = false;
            downloadBtn.style.opacity = '1';
            downloadBtn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                downloadBtn.style.transform = 'scale(1)';
            }, 200);
        }, 500);
    }
}

async function downloadCard() {
    const downloadBtn = document.querySelector('.btn-download');
    const originalText = downloadBtn.textContent;
    
    try {
        // Enhanced loading state for download
        downloadBtn.innerHTML = '<span class="loading-spinner"></span>Creating Image...';
        downloadBtn.disabled = true;
        downloadBtn.style.pointerEvents = 'none';
        
        // Add a small delay for UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        downloadBtn.innerHTML = '<span class="loading-spinner"></span>Processing...';
        
        // Create the image
        await drawCardManually();
        
        // Success feedback with notification
        downloadBtn.innerHTML = '✅ Download Complete!';
        showNotification('💾 Card downloaded successfully!', 'success', 2000);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
    } catch (error) {
        console.error('Download error:', error);
        downloadBtn.innerHTML = '❌ Download Failed';
        await new Promise(resolve => setTimeout(resolve, 1500));
        showNotification(`❌ Unable to download card.<br><small>Error: ${error.message}</small>`, 'error', 4000);
    } finally {
        // Restore button state
        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
            downloadBtn.style.pointerEvents = 'auto';
        }, 500);
    }
}

async function drawCardManually() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Kích thước canvas vừa khít thẻ sinh viên
    canvas.width = 1400;
    canvas.height = 1050;

    // Không vẽ nền ngoài, chỉ vẽ thẻ sinh viên
    const cardX = 0, cardY = 0;
    const cardWidth = 1400, cardHeight = 1050;

    // Card shadow (tùy chọn, có thể bỏ qua nếu muốn nền trong suốt)
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    // ctx.fillRect(cardX + 8, cardY + 8, cardWidth, cardHeight);

    // Card background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    
    // Card border với rounded corners
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 4;
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);

    // Header background
    const headerHeight = 210;
    ctx.fillStyle = '#6a9ed8';
    ctx.fillRect(cardX, cardY, cardWidth, headerHeight);
    
    // Load và vẽ logo university (ưu tiên local logo nếu có)
    try {
        const logoImg = new Image();
        let logoSrc = document.getElementById('university-logo').src;
        if (logoSrc.includes('MUlogo-scaled.jpg') || logoSrc.includes('mahe')) {
            logoSrc = 'logo-mahe.png';
        }
        if (!logoSrc.startsWith('http')) {
            logoImg.crossOrigin = null;
        } else {
            logoImg.crossOrigin = 'anonymous';
        }
        await new Promise((resolve) => {
            logoImg.onload = resolve;
            logoImg.onerror = resolve;
            logoImg.src = logoSrc;
            setTimeout(resolve, 3000);
        });
        if (logoImg.complete && logoImg.naturalWidth > 0) {
            // Fit logo to header, max height = headerHeight - 40, max width = 220
            const maxLogoWidth = 220;
            const maxLogoHeight = headerHeight - 40;
            let drawWidth = maxLogoWidth;
            let drawHeight = maxLogoWidth * (logoImg.naturalHeight / logoImg.naturalWidth);
            if (drawHeight > maxLogoHeight) {
                drawHeight = maxLogoHeight;
                drawWidth = maxLogoHeight * (logoImg.naturalWidth / logoImg.naturalHeight);
            }
            const logoX = cardX + 40;
            const logoY = cardY + (headerHeight - drawHeight) / 2;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(logoX - 6, logoY - 6, drawWidth + 12, drawHeight + 12);
            ctx.drawImage(logoImg, logoX, logoY, drawWidth, drawHeight);
        } else {
            // Logo placeholder
            const maxLogoWidth = 220;
            const maxLogoHeight = headerHeight - 40;
            const logoX = cardX + 40;
            const logoY = cardY + (headerHeight - maxLogoHeight) / 2;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(logoX - 6, logoY - 6, maxLogoWidth + 12, maxLogoHeight + 12);
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 3;
            ctx.strokeRect(logoX - 6, logoY - 6, maxLogoWidth + 12, maxLogoHeight + 12);
            ctx.fillStyle = '#666666';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('LOGO', logoX + maxLogoWidth / 2, logoY + maxLogoHeight / 2);
        }
    } catch (e) {
        console.warn('Logo loading failed:', e);
    }
    
    // University name - bắt đầu từ bên phải logo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px Arial';
    ctx.textAlign = 'left';
    const universityName = document.getElementById('university-name').textContent;

    const textStartX = cardX + 300;
    const maxTextWidth = 900;
    const lines = wrapText(ctx, universityName, maxTextWidth);
    const totalTextHeight = lines.length * 60 + 60 + 20;
    let textY = cardY + (headerHeight - totalTextHeight) / 2 + 54;
    lines.forEach((line, index) => {
        ctx.fillText(line, textStartX, textY + (index * 60));
    });
    ctx.fillStyle = '#cc0000';
    ctx.font = 'bold 44px Arial';
    const studentCardY = textY + (lines.length * 60) + 20;
    ctx.fillText('STUDENT CARD', textStartX, studentCardY);
    
    // Info section - bắt đầu dưới header
    // Info section - bắt đầu dưới header, căn đều với ảnh
    const infoY = cardY + headerHeight + 36;
    
    // Load và vẽ student photo
    let photoBottomY = infoY;
    try {
        const photoImg = new Image();
        photoImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
            photoImg.onload = resolve;
            photoImg.onerror = resolve;
            photoImg.src = document.getElementById('student-photo').src;
            setTimeout(resolve, 3000);
        });

        // Photo dimensions scaled lớn hơn
        const photoWidth = 200;
        const photoHeight = 250;
        const photoX = cardX + 60;
        const photoY = infoY;
        photoBottomY = photoY + photoHeight;

        if (photoImg.complete && photoImg.naturalWidth > 0) {
            ctx.strokeStyle = '#888888';
            ctx.lineWidth = 5;
            ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);

            ctx.save();
            ctx.beginPath();
            ctx.rect(photoX, photoY, photoWidth, photoHeight);
            ctx.clip();
            ctx.drawImage(photoImg, photoX, photoY, photoWidth, photoHeight);
            ctx.restore();
        } else {
            ctx.fillStyle = '#eeeeee';
            ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
            ctx.strokeStyle = '#888888';
            ctx.lineWidth = 5;
            ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);
            ctx.fillStyle = '#666666';
            ctx.font = 'bold 22px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PHOTO', photoX + photoWidth/2, photoY + photoHeight/2);
        }
    } catch (e) {
        console.warn('Photo loading failed:', e);
    }
    
    // Student details - positioning bên phải photo
    ctx.textAlign = 'left';
    const detailsX = cardX + 300;

    const details = [
        { label: 'Name:', value: document.getElementById('student-name').textContent, bold: true },
        { label: 'Date of Birth:', value: document.getElementById('student-dob').textContent },
        { label: 'Course:', value: document.getElementById('student-course').textContent },
        { label: 'Class:', value: document.getElementById('student-class').textContent },
        { label: 'Department:', value: document.getElementById('student-department').textContent }
    ];

    details.forEach((detail, index) => {
        // Căn đều với ảnh, mỗi dòng 56px, bắt đầu từ top ảnh
        const y = infoY + 24 + (index * 56);

        ctx.fillStyle = '#1a7ec7';
        ctx.font = 'bold 32px Arial';

        // Tăng khoảng cách label-value cho dòng Date of Birth để tránh đè lên tên
        let labelWidth = 170;
        let valueOffset = 16;
        if (detail.label === 'Date of Birth:') {
            labelWidth = 210; // đẩy value sang phải hơn
            valueOffset = 28;
        }

        ctx.fillText(detail.label, detailsX, y);

        ctx.fillStyle = '#000000';
        ctx.font = detail.bold ? 'bold 36px Arial' : '32px Arial';
        ctx.fillText(detail.value, detailsX + labelWidth + valueOffset, y);
    });
    
    // Valid until - match CSS .footer positioning
    // Căn dòng Valid until sát dưới ảnh
    ctx.fillStyle = '#444444';
    ctx.font = '24px Arial';
    const validText = `Valid until: ${document.getElementById('valid-until').textContent}`;
    const validY = photoBottomY + 28;
    ctx.fillText(validText, cardX + 60, validY);
    
    // Load và vẽ barcode thật từ API
    // Barcode nằm sát dưới dòng Valid until, không đè lên chữ
    try {
        const barcodeImg = new Image();
        barcodeImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
            barcodeImg.onload = resolve;
            barcodeImg.onerror = resolve;
            barcodeImg.src = document.getElementById('barcode').src;
            setTimeout(resolve, 3000);
        });

        const barcodeY = validY + 32;
        const barcodeStartX = cardX + 60;
        const barcodeWidth = 1180;
        const barcodeHeight = 80;

        if (barcodeImg.complete && barcodeImg.naturalWidth > 0) {
            ctx.drawImage(barcodeImg, barcodeStartX, barcodeY, barcodeWidth, barcodeHeight);
        } else {
            ctx.fillStyle = '#000000';
            const universityNameForBarcode = document.getElementById('university-name').textContent;
            for (let i = 0; i < barcodeWidth; i += 4) {
                const charIndex = Math.floor(i / 24) % universityNameForBarcode.length;
                const charCode = universityNameForBarcode.charCodeAt(charIndex);
                const shouldDraw = (charCode + i) % 7 !== 0;
                if (shouldDraw) {
                    const lineWidth = ((charCode + i) % 3) + 2;
                    const lineHeight = barcodeHeight * (0.8 + ((charCode + i) % 3) * 0.1);
                    ctx.fillRect(barcodeStartX + i, barcodeY, lineWidth, lineHeight);
                }
            }
        }
    } catch (e) {
        console.warn('Barcode loading failed:', e);
        ctx.fillStyle = '#000000';
        const barcodeY = validY + 32;
        const barcodeStartX = cardX + 60;
        const barcodeWidth = 1180;
        const barcodeHeight = 80;
        const universityNameForBarcode = document.getElementById('university-name').textContent;
        for (let i = 0; i < barcodeWidth; i += 4) {
            const charIndex = Math.floor(i / 24) % universityNameForBarcode.length;
            const charCode = universityNameForBarcode.charCodeAt(charIndex);
            const shouldDraw = (charCode + i) % 7 !== 0;
            if (shouldDraw) {
                const lineWidth = ((charCode + i) % 3) + 2;
                const lineHeight = barcodeHeight * (0.8 + ((charCode + i) % 3) * 0.1);
                ctx.fillRect(barcodeStartX + i, barcodeY, lineWidth, lineHeight);
            }
        }
    }
    
    // Footer elements - match CSS .id-number và .region positioning
    const footerY = cardY + cardHeight - 40;

    // Student ID (bottom left)
    ctx.fillStyle = '#222222';
    ctx.font = '28px Arial';
    ctx.textAlign = 'left';
    const studentId = document.getElementById('student-id').textContent;
    ctx.fillText(studentId, cardX + 60, footerY);

    // United States (bottom right)
    ctx.textAlign = 'right';
    ctx.fillText('United States', cardX + cardWidth - 60, footerY);
    
    // Download the canvas
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `student-card-${timestamp}.png`;
        link.href = url;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        console.log('Download completed successfully!');
    }, 'image/png', 1.0);
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Notification System
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Generate initial card khi trang được load
window.onload = async function() {
    showNotification('🚀 Welcome to US Student Card Generator!<br><small>Generating your first card...</small>', 'info', 3000);
    await generateUSStudentCard();
};

// Student Information Extract - Chỉ lấy thông tin, không verify ngay
function startStudentVerification() {
    const verifyBtn = document.querySelector('.btn-verify');
    const originalText = verifyBtn.textContent;
    
    try {
        // Kiểm tra xem Chrome Extension có được cài đặt không
        if (typeof window.studentCardVerifier === 'undefined') {
            showNotification('❌ Chrome Extension chưa được cài đặt!<br><small>Vui lòng cài đặt "Student Card Auto Verifier" extension từ thư mục 1NutLamNenTatCa</small>', 'error', 6000);
            return;
        }
        
        // Lấy thông tin từ student card hiện tại
        const studentInfo = extractStudentInfo();
        console.log('🔍 DEBUG: Extracted student info:', studentInfo);
        
        // Kiểm tra thông tin có hợp lệ không
        if (!studentInfo.school || !studentInfo.firstName) {
            showNotification('⚠️ No student card data found!<br><small>Please generate a student card first</small>', 'error', 4000);
            verifyBtn.textContent = originalText;
            verifyBtn.disabled = false;
            verifyBtn.style.pointerEvents = 'auto';
            return;
        }
        
        // Update button state - chỉ extract thông tin
        verifyBtn.innerHTML = '<span class="loading-spinner"></span>Extracting Info...';
        verifyBtn.disabled = true;
        verifyBtn.style.pointerEvents = 'none';
        
        // Gửi thông tin student card đến extension để lưu (không verify ngay)
        window.postMessage({
            type: 'STUDENT_CARD_EXTRACT',
            studentInfo: studentInfo,
            autoVerify: false  // Không verify ngay
        }, '*');
        
        // Lắng nghe response từ extension
        const messageHandler = (event) => {
            if (event.data.type === 'INFO_EXTRACTED') {
                window.removeEventListener('message', messageHandler);
                
                if (event.data.success) {
                    verifyBtn.innerHTML = '✅ Info Extracted!';
                    showNotification('� Student info extracted successfully!<br><small>Data saved to extension. Click "Bắt đầu xác minh" in extension popup to verify.</small>', 'success', 8000);
                    
                    // Mở extension popup sau khi extract thành công
                    setTimeout(() => {
                        showNotification('💡 Click extension icon to open popup and verify!', 'info', 5000);
                    }, 3000);
                } else {
                    verifyBtn.innerHTML = '❌ Extract Failed';
                    showNotification('❌ Failed to extract student info<br><small>Please try again or check extension</small>', 'error', 4000);
                }
                
                // Restore button state
                setTimeout(() => {
                    verifyBtn.textContent = originalText;
                    verifyBtn.disabled = false;
                    verifyBtn.style.pointerEvents = 'auto';
                }, 3000);
            }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Gọi Chrome Extension với thông tin student
        window.studentCardVerifier.startWithData(studentInfo);
        
        // Timeout fallback
        setTimeout(() => {
            window.removeEventListener('message', messageHandler);
            if (verifyBtn.disabled) {
                verifyBtn.textContent = originalText;
                verifyBtn.disabled = false;
                verifyBtn.style.pointerEvents = 'auto';
                showNotification('⏰ Verification timeout<br><small>Please try again</small>', 'error', 3000);
            }
        }, 10000);
        
    } catch (error) {
        console.error('Verification error:', error);
        verifyBtn.textContent = originalText;
        verifyBtn.disabled = false;
        verifyBtn.style.pointerEvents = 'auto';
        showNotification('❌ Error starting verification<br><small>Please check console for details</small>', 'error', 4000);
    }
}

// Hàm trích xuất thông tin từ student card
function extractStudentInfo() {
    try {
        // Lấy thông tin từ DOM elements
        const universityName = document.getElementById('university-name')?.textContent?.trim() || '';
        const studentName = document.getElementById('student-name')?.textContent?.trim() || '';
        const studentDob = document.getElementById('student-dob')?.textContent?.trim() || '';
        const studentDepartment = document.getElementById('student-department')?.textContent?.trim() || '';
        
        // Tách họ và tên
        const nameParts = studentName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Detect country từ source URL
        const sourceUrl = window.location.pathname;
        let country = 'Vietnam'; // Default
        if (sourceUrl.includes('thesinhvienus')) {
            country = 'United States';
        } else if (sourceUrl.includes('thesinhvien') && !sourceUrl.includes('us')) {
            country = 'India';
        }
        
        // Tạo email giả từ tên và trường (có thể customize)
        const emailPrefix = firstName.toLowerCase() + '.' + lastName.toLowerCase().replace(/\s+/g, '');
        const emailDomain = getEmailDomainFromUniversity(universityName);
        const email = `${emailPrefix}@${emailDomain}`;
        
        const studentInfo = {
            school: universityName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            dateOfBirth: studentDob,
            department: studentDepartment,
            country: country,  // 🔑 NEW: Country field for extension
            // Thêm metadata
            extractedAt: new Date().toISOString(),
            source: sourceUrl  // Sẽ là /thesinhvien.html hoặc /thesinhvienus.html
        };
        
        console.log('Extracted student info:', studentInfo);
        return studentInfo;
        
    } catch (error) {
        console.error('Error extracting student info:', error);
        return {
            school: '',
            firstName: '',
            lastName: '',
            email: '',
            dateOfBirth: '',
            department: '',
            country: 'United States'  // Default country for US page
        };
    }
}

// Helper function để tạo email domain từ tên trường
function getEmailDomainFromUniversity(universityName) {
    const domainMap = {
        // 'Harvard University': 'harvard.edu',
        // 'Stanford University': 'stanford.edu',
        // 'Massachusetts Institute of Technology': 'mit.edu',
        // 'Yale University': 'yale.edu',
        // 'Princeton University': 'princeton.edu',
        // 'University of California, Berkeley': 'berkeley.edu',
        // 'Columbia University': 'columbia.edu',
        // 'University of Chicago': 'uchicago.edu',
        // 'Carnegie Mellon University': 'cmu.edu',
        // 'New York University': 'nyu.edu',
        // 'University of Pennsylvania': 'upenn.edu',
        // 'Duke University': 'duke.edu',
        // 'Northwestern University': 'northwestern.edu',
        // 'California Institute of Technology': 'caltech.edu',
        'Santa Fe College': 'sfcollege.edu'
    };
    
    return domainMap[universityName] || 'student.edu';
}
