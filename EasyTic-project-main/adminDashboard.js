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

// הגדרת מאזינים לאירועים
function setupEventListeners() {
    console.log('מגדיר מאזיני אירועים בפאנל הניהול...');
    
    // מאזין לכפתור התנתקות
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        logoutUser();
      });
    }
    
    // מאזין לכפתורי סרגל הצד
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // הסרת הסגנון הפעיל מכל הקישורים
        sidebarLinks.forEach(l => l.classList.remove('active'));
        
        // הוספת הסגנון הפעיל לקישור הנוכחי
        this.classList.add('active');
        
        // הצגת המקטע המתאים
        const section = this.getAttribute('href').replace('#', '');
        showSection(section);
      });
    });
    
    // מאזין לכפתור שליחת תשובה לשאלה
    const sendReplyButton = document.getElementById('send-reply');
    if (sendReplyButton) {
      sendReplyButton.addEventListener('click', function() {
        const questionId = document.getElementById('question-id').value;
        const replyText = document.getElementById('reply-text').value;
        const addToFaq = document.getElementById('add-to-faq').checked;
        
        if (replyText.trim() !== '') {
          submitReply(questionId, replyText, addToFaq);
        }
      });
    }
    
    // מאזינים לכפתורי סינון וחיפוש
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          const filterType = this.getAttribute('data-filter');
          
          // הסרת הסגנון הפעיל מכל הכפתורים
          filterButtons.forEach(btn => btn.classList.remove('active'));
          
          // הוספת הסגנון הפעיל לכפתור הנוכחי
          this.classList.add('active');
          
          // הפעלת פונקציית הסינון אם קיימת
          if (typeof filterData === 'function') {
            filterData(filterType);
          }
        });
      });
    }
    
    // מאזין לטופס חיפוש
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchQuery = document.getElementById('search-input').value;
        
        // הפעלת פונקציית החיפוש אם קיימת
        if (typeof searchData === 'function') {
          searchData(searchQuery);
        }
      });
    }
    
    // מאזין לכפתור טוען המידע מחדש
    const refreshButton = document.querySelector('.refresh-data');
    if (refreshButton) {
      refreshButton.addEventListener('click', function() {
        // רענון הנתונים בהתאם למקטע הנוכחי
        const currentSection = window.location.hash.replace('#', '') || 'dashboard';
        refreshSectionData(currentSection);
      });
    }
    
    // מאזין לכפתור הניווט בצד על מסכים קטנים
    const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');
    if (toggleSidebarBtn) {
      toggleSidebarBtn.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
        document.querySelector('.content-wrapper').classList.toggle('sidebar-active');
      });
    }
  }

  // פונקציה לרענון נתונים במקטע
function refreshSectionData(section) {
    console.log('מרענן נתונים במקטע:', section);
    
    switch (section) {
      case 'dashboard':
        loadDummyData();
        initSalesChart();
        break;
      case 'attractions':
        // רענון נתוני אטרקציות
        if (typeof loadAttractions === 'function') {
          loadAttractions();
        }
        break;
      case 'questions':
        // רענון נתוני שאלות
        if (typeof loadQuestions === 'function') {
          loadQuestions();
        }
        break;
      case 'sales':
        // רענון נתוני מכירות
        if (typeof loadSalesData === 'function') {
          loadSalesData();
        }
        break;
      case 'orders':
        // רענון נתוני הזמנות
        if (typeof loadOrders === 'function') {
          loadOrders();
        }
        break;
      default:
        console.log('אין פונקציית רענון מוגדרת למקטע זה');
    }
  }

  // פונקציה לאתחול סרגל הצד
function initSidebar() {
    // התאמת סרגל הצד למצב התחלתי בהתאם לגודל המסך
    if (window.innerWidth <= 768) {
      document.querySelector('.sidebar').classList.remove('active');
      document.querySelector('.content-wrapper').classList.remove('sidebar-active');
    }
    
    // הוספת האזנה לשינוי גודל המסך
    window.addEventListener('resize', function() {
      if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('active');
        document.querySelector('.content-wrapper').classList.remove('sidebar-active');
      } else {
        document.querySelector('.sidebar').classList.add('active');
        document.querySelector('.content-wrapper').classList.add('sidebar-active');
      }
    });
  }

  // פונקציה לטיפול בשליחת תשובה לשאלה
function submitReply(questionId, replyText, addToFaq) {
    console.log('שולח תשובה לשאלה:', questionId);
    
    // הסוג של שאלה (רגילה או נוספת ל-FAQ)
    const status = addToFaq ? 'added_to_faq' : 'answered';
    
    // השגת טוקן הזדהות מהסשן
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('אין הרשאת גישה. נדרשת התחברות מחדש.');
      return;
    }
    
    // שליחת התשובה לשרת
    fetch(`/api/admin/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        answer: replyText,
        status: status
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('שגיאה בשליחת התשובה');
      }
      return response.json();
    })
    .then(data => {
      console.log('תשובה נשלחה בהצלחה:', data);
      
      // סגירת המודל
      $('#replyModal').modal('hide');
      
      // רענון נתוני השאלות
      if (typeof loadQuestions === 'function') {
        loadQuestions();
      } else {
        // רענון כללי של הדף
        window.location.reload();
      }
      
      // הודעת הצלחה
      alert('התשובה נשלחה בהצלחה!');
    })
    .catch(error => {
      console.error('שגיאה בשליחת התשובה:', error);
      alert('אירעה שגיאה בשליחת התשובה: ' + error.message);
    });
  }

// בדיקת הרשאות מנהל
function checkAdminAuth() {
  console.log('***DEBUG*** בודק הרשאות מנהל...');
  console.log('***DEBUG*** נתוני הרשאות בסשן:', {
      isAdmin: sessionStorage.getItem('isAdmin'),
      userId: sessionStorage.getItem('userId'),
      username: sessionStorage.getItem('username'),
      token: sessionStorage.getItem('token') ? 'קיים' : 'לא קיים'
  });
  
  // בדיקת הרשאות בלוקאל סטורג'
  try {
      const userInfoStr = localStorage.getItem('userInfo');
      console.log('***DEBUG*** מידע משתמש בלוקאל:', userInfoStr ? 'קיים' : 'לא קיים');
      
      if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          console.log('***DEBUG*** הרשאות בלוקאל:', {
              isAdmin: userInfo.isAdmin,
              userId: userInfo.userId,
              username: userInfo.username,
              token: userInfo.token ? 'קיים' : 'לא קיים'
          });
      }
  } catch (error) {
      console.error('***DEBUG*** שגיאה בקריאת מידע מלוקאל סטורג\':', error);
  }
  
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  console.log('***DEBUG*** האם מנהל:', isAdmin);
  
  if (!isAdmin) {
      console.error('***DEBUG*** אין הרשאות מנהל - מעביר לדף כניסה');
      alert("גישה נדחתה. גישה למנהלים בלבד.");
      window.location.href = 'loginPage.html?redirect=admin';
  } else {
      console.log('***DEBUG*** אימות מנהל הצליח');
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
  console.log('***DEBUG*** מתחיל טעינת נתונים לדשבורד');
  
  // Get token from multiple sources
  let token = sessionStorage.getItem('token');
  console.log('***DEBUG*** טוקן בסשן:', token ? 'נמצא' : 'לא נמצא');
  
  // אם אין טוקן בסשן, בדוק בלוקאל סטורג'
  if (!token) {
      try {
          const userInfoStr = localStorage.getItem('userInfo');
          console.log('***DEBUG*** מידע משתמש בלוקאל:', userInfoStr ? 'נמצא' : 'לא נמצא');
          
          if (userInfoStr) {
              const userInfo = JSON.parse(userInfoStr);
              token = userInfo.token;
              console.log('***DEBUG*** טוקן מלוקאל סטורג\':', token ? 'נמצא' : 'לא נמצא');
              
              if (token) {
                  // העבר את הטוקן לסשן
                  sessionStorage.setItem('token', token);
                  console.log('***DEBUG*** הטוקן הועבר מלוקאל לסשן');
              }
          }
      } catch (error) {
          console.error('***DEBUG*** שגיאה בקריאת נתוני משתמש מלוקאל:', error);
      }
  }
  
  // בדיקה נוספת למידע משתמש ב-session
  console.log('***DEBUG*** מידע משתמש בסשן:', {
      userId: sessionStorage.getItem('userId'),
      username: sessionStorage.getItem('username'),
      displayName: sessionStorage.getItem('displayName'),
      isAdmin: sessionStorage.getItem('isAdmin')
  });
  
  if (!token) {
      console.error('***DEBUG*** אין טוקן זמין - טוען נתונים סטטיים');
      
      // טעינת נתונים סטטיים במקום
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
      
      return; // יציאה מהפונקציה
  }
  
  console.log('***DEBUG*** יש טוקן תקף - שולח בקשת API לקבלת שאלות');
  
  // Fetch pending questions count
  fetch('/api/admin/questions', {
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
  })
  .then(response => {
      console.log('***DEBUG*** תגובת API לשאלות:', response.status, response.statusText);
      return response.ok ? response.json() : null;
  })
  .then(data => {
      console.log('***DEBUG*** נתוני API לשאלות:', data ? 'התקבלו' : 'ריק');
      
      if (data && data.questions) {
          // Count pending questions (questions without answers)
          const pendingQuestions = data.questions.filter(q => !q.answer || q.status === 'pending');
          console.log('***DEBUG*** מספר שאלות ממתינות:', pendingQuestions.length);
          
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
      } else {
          console.log('***DEBUG*** לא התקבלו שאלות מה-API או שדה questions חסר');
      }
  })
  .catch(error => console.error('***DEBUG*** שגיאה בטעינת שאלות:', error));
  
  // המשך טעינת יתר הנתונים...
  console.log('***DEBUG*** ממשיך בטעינת יתר הנתונים הסטטיים');
  
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
  
  console.log('***DEBUG*** טעינת נתונים לדשבורד הסתיימה');
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
  console.log('***DEBUG*** מחליף למקטע:', sectionName);
  
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
  
  // טעינת נתונים ספציפיים למקטע שנבחר
  if (sectionName === 'questions') {
      console.log('***DEBUG*** מקטע שאלות נבחר - טוען את הנתונים');
      // בדיקה אם פונקציית loadQuestions קיימת וטעינת השאלות
      if (typeof loadQuestions === 'function') {
          loadQuestions();
      } else {
          console.error('***DEBUG*** פונקציית loadQuestions לא נמצאה');
      }
  } else if (sectionName === 'attractions') {
      // טעינת מידע על אטרקציות
      if (typeof loadAttractions === 'function') {
          loadAttractions();
      }
  } else if (sectionName === 'orders') {
      // טעינת מידע על הזמנות
      if (typeof loadOrders === 'function') {
          loadOrders();
      }
  } else if (sectionName === 'sales') {
      // טעינת מידע על מכירות
      if (typeof loadSalesData === 'function') {
          loadSalesData();
      }
  } else if (sectionName === 'settings') {
      // טעינת מידע על הגדרות
      if (typeof loadSettings === 'function') {
          loadSettings();
      }
  }
  
  // עדכון ההיסטוריה של הדפדפן
  window.location.hash = sectionName;
}

// פונקצית התנתקות
function logoutUser() {
    console.log('מתנתק מהמערכת...');
    
    // ניקוי מלא של כל הנתונים בזיכרון המקומי
    // ניקוי sessionStorage
    sessionStorage.removeItem('displayName');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('isAdmin');
    
    // ניקוי localStorage
    localStorage.removeItem('displayName');
    localStorage.removeItem('UserName');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('usrId');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    
    // ניסיון לשלוח בקשת התנתקות לשרת
    try {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('תגובת שרת להתנתקות:', response);
            window.location.href = 'homePage.html'; // הפניה לדף הבית
        })
        .catch(error => {
            console.error('שגיאה בעת התנתקות:', error);
            window.location.href = 'homePage.html'; // הפניה לדף הבית גם במקרה של שגיאה
        });
    } catch (error) {
        console.error('שגיאה בעת שליחת בקשת התנתקות:', error);
        window.location.href = 'homePage.html'; // הפניה לדף הבית במקרה של שגיאה
    }
}