document.addEventListener('DOMContentLoaded', function() {
    // בדיקת הרשאות מנהל
    checkAdminAuth();
    
    // טעינת תכני הדפים הנוספים
    loadSectionContent('attractions-section-container', 'attractions-section.html');
    loadSectionContent('questions-section-container', 'questions-section.html');
    loadSectionContent('sales-section-container', 'sales-section.html');
    loadSectionContent('orders-section-container', 'orders-section.html');
    loadSectionContent('settings-section-container', 'settings-section.html');
    
    // עדכון ברכה למנהל
    updateAdminGreeting();
    
    // אתחול הנתונים בלוח הבקרה
    initDashboard();
    
    // הגדרת מאזינים לאירועים
    setupEventListeners();
    
    // אתחול סרגל צד על מסכים קטנים
    initSidebar();

    // הצגת מקטע לוח הבקרה כברירת מחדל
    showSection('dashboard');
});

// בדיקת הרשאות מנהל
function checkAdminAuth() {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    console.log('Admin check - isAdmin value:', sessionStorage.getItem('isAdmin'));
    
    if (!isAdmin) {
        alert("גישה נדחתה. גישה למנהלים בלבד.");
        window.location.href = 'loginPage.html?redirect=admin';
    } else {
        console.log('אימות מנהל הצליח');
    }
}

// עדכון ברכה למנהל עם שם התצוגה
function updateAdminGreeting() {
    const adminName = sessionStorage.getItem('displayName') || sessionStorage.getItem('username') || "מנהל";
    const adminGreeting = document.getElementById('admin-greeting');
    if (adminGreeting) {
        adminGreeting.textContent = ' היי, ' + adminName;
    }
}

// אתחול לוח הבקרה וטעינת נתונים ראשונית
function initDashboard() {
    // טעינת נתונים לדוגמה (יוחלף בהמשך בקריאת API אמיתית)
    loadDummyData();
    
    // אתחול גרף המכירות
    initSalesChart();
}

// אתחול גרף המכירות
function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // נתונים לדוגמה (יוחלפו בהמשך בנתונים אמיתיים)
    const salesData = {
        labels: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
        datasets: [{
            label: 'מכירות (₪)',
            data: [1200, 1500, 1800, 1300, 2100, 2400, 2800, 3100, 1900, 1600, 1400, 1100],
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(0, 123, 255, 1)',
            pointBorderColor: '#fff',
            pointRadius: 5
        }]
    };
    
    // הגדרות הגרף
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: function(value) {
                        return '₪' + value.toLocaleString();
                    }
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    return 'מכירות: ₪' + tooltipItem.yLabel.toLocaleString();
                }
            }
        }
    };
    
    // יצירת הגרף
    new Chart(ctx, {
        type: 'line',
        data: salesData,
        options: options
    });
}

// טעינת נתוני הדגמה ללוח הבקרה
function loadDummyData() {
    // Get token from session storage
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('No token available');
        return;
    }
    
    // Fetch pending questions count
    fetch('/api/admin/questions', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.ok ? response.json() : null)
    .then(data => {
        if (data && data.questions) {
            // Count pending questions (questions without answers)
            const pendingQuestions = data.questions.filter(q => !q.answer || q.status === 'pending');
            
            // Update counter in sidebar and dashboard
            document.getElementById('sidebar-questions-badge').textContent = pendingQuestions.length;
            document.getElementById('pending-questions').textContent = pendingQuestions.length;
            
            // Update recent questions panel with up to 3 pending questions
            updateRecentQuestionsContainer(
                pendingQuestions.slice(0, 3).map(q => ({
                    id: q._id,
                    text: q.questionText,
                    author: q.userEmail || 'אלמוני',
                    date: new Date(q.submittedAt).toLocaleDateString()
                }))
            );
        }
    })
    .catch(error => console.error('Error fetching questions:', error));
    // טעינת הזמנות אחרונות
    const recentOrders = [
        { id: '1001', orderNumber: '1001', date: '01/03/2025', customer: 'ישראל ישראלי', total: 350.00, status: 'הושלם' },
        { id: '1002', orderNumber: '1002', date: '28/02/2025', customer: 'שרה כהן', total: 420.50, status: 'ממתין לתשלום' },
        { id: '1003', orderNumber: '1003', date: '27/02/2025', customer: 'יעקב לוי', total: 280.00, status: 'הושלם' }
    ];
    
    updateRecentOrdersTable(recentOrders);
    
    // טעינת אטרקציות פופולריות
    const popularAttractions = [
        { name: 'בורג\' ח\'ליפה', country: 'דובאי', sales: 56, revenue: 10360 },
        { name: 'מגדל אייפל', country: 'פריז', sales: 43, revenue: 6450 },
        { name: 'הקולוסיאום', country: 'רומא', sales: 38, revenue: 5700 }
    ];
    
    updatePopularAttractionsTable(popularAttractions);
    
    // טעינת שאלות אחרונות
    const recentQuestions = [
        { id: '1', text: 'האם יש הנחות לקבוצות?', author: 'דניאל ג.', date: '01/03/2025' },
        { id: '2', text: 'האם ניתן לבטל הזמנה?', author: 'אורי ל.', date: '28/02/2025' }
    ];
    
    updateRecentQuestionsContainer(recentQuestions);
    
    // עדכון מונה השאלות הממתינות
    document.getElementById('sidebar-questions-badge').textContent = recentQuestions.length;
    document.getElementById('pending-questions').textContent = recentQuestions.length;
}

// עדכון טבלת ההזמנות האחרונות
function updateRecentOrdersTable(orders) {
    const tableBody = document.getElementById('recent-orders-table');
    tableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        const statusClass = order.status === 'הושלם' ? 'badge-success' : 'badge-warning';
        
        row.innerHTML = `
            <td>${order.orderNumber}</td>
            <td>${order.customer}</td>
            <td>₪${order.total.toFixed(2)}</td>
            <td>${order.date}</td>
            <td><span class="badge ${statusClass}">${order.status}</span></td>
        `;
        
        row.addEventListener('click', () => viewOrderDetails(order.id));
        tableBody.appendChild(row);
    });
}

// עדכון טבלת האטרקציות הפופולריות
function updatePopularAttractionsTable(attractions) {
    const tableBody = document.getElementById('popular-attractions-table');
    tableBody.innerHTML = '';
    
    attractions.forEach(attraction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${attraction.name}</td>
            <td>${attraction.country}</td>
            <td>${attraction.sales}</td>
            <td>₪${attraction.revenue.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// עדכון מכיל השאלות האחרונות
function updateRecentQuestionsContainer(questions) {
    const container = document.getElementById('recent-questions');
    container.innerHTML = '';
    
    questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-item mb-3 p-3 bg-light rounded';
        
        questionElement.innerHTML = `
            <p class="mb-1 font-weight-bold">${question.text}</p>
            <small class="text-muted">מאת: ${question.author}, ${question.date}</small>
            <div class="mt-2">
                <button class="btn btn-sm btn-primary" onclick="openReplyModal('${question.id}')">מענה</button>
            </div>
        `;
        
        container.appendChild(questionElement);
    });
}

// טעינת תוכן ממקטע חיצוני
function loadSectionContent(containerId, sectionFile) {
    fetch(sectionFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`שגיאה בטעינת הקובץ (${response.status}): ${sectionFile}`);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        })
        .catch(error => {
            console.error(`שגיאה בטעינת ${sectionFile}:`, error);
            document.getElementById(containerId).innerHTML = `<div class="alert alert-danger">שגיאה בטעינת תוכן המקטע: ${error.message}</div>`;
        });
}

// החלפת מקטע מוצג
function showSection(sectionName) {
    // הסתרת כל המקטעים
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // הצגת המקטע המבוקש
    const selectedSection = document.getElementById(`${sectionName}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    } else {
        const sectionContainer = document.getElementById(`${sectionName}-section-container`);
        if (sectionContainer) {
            sectionContainer.style.display = 'block';
        }
    }
    
    // עדכון הלשונית הפעילה בסרגל הצד
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionName}`) {
            link.classList.add('active');
        }
    });
    
    // עדכון ההיסטוריה של הדפדפן
    window.location.hash = sectionName;
}