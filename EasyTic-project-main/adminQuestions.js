// אתחול מודול ניהול השאלות
document.addEventListener('DOMContentLoaded', function() {
    // אם הדף נטען, הוסף מאזינים לאירועים בחלק ניהול השאלות
    if (document.getElementById('questions-section')) {
        setupQuestionsEventListeners();
        loadQuestions();
    }

      // קריאה לפונקציה להוספת מאזינים
    if (document.getElementById('question-filter-status')) {
        setupFilterListeners();
      }
});

// הגדרת מאזינים לאירועים בחלק ניהול השאלות
function setupQuestionsEventListeners() {
    // מאזין לשליחת תשובה לשאלה
    document.getElementById('send-reply').addEventListener('click', submitReply);
    
    // מאזינים לסינון שאלות
    const statusFilter = document.getElementById('question-filter-status');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterQuestions);
    }
    
    const sortOrder = document.getElementById('question-sort-order');
    if (sortOrder) {
        sortOrder.addEventListener('change', filterQuestions);
    }
    
    const searchInput = document.getElementById('question-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterQuestions);
    }
}

function setupFilterListeners() {
    // מאזין לשינוי בסוג השאלה
    const statusFilter = document.getElementById('question-filter-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', function() {
        filterQuestions();
      });
    }
    
    // מאזין לשינוי בסדר המיון
    const sortOrder = document.getElementById('question-sort-order');
    if (sortOrder) {
      sortOrder.addEventListener('change', function() {
        filterQuestions();
      });
    }
    
    // מאזין לשינוי בתיבת החיפוש
    const searchInput = document.getElementById('question-search');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        filterQuestions();
      });
    }
  }

// טעינת רשימת השאלות מהשרת
function loadQuestions() {
    console.log('***DEBUG*** טוען שאלות מהדאטהבייס...');
    const questionsContainer = document.getElementById('questions-list');
    if (!questionsContainer) {
        console.error('***DEBUG*** לא נמצא אלמנט questions-list בדף');
        return;
    }
    
    questionsContainer.innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">טוען...</span></div></td></tr>';
    
    // קבלת טוקן מכל מקור אפשרי
    let token = sessionStorage.getItem('token');
    console.log('***DEBUG*** טוקן מ-sessionStorage:', token ? 'נמצא' : 'לא נמצא');
    
    // אם אין טוקן בסשן, בדוק בלוקאל סטורג'
    if (!token) {
        try {
            const userInfoStr = localStorage.getItem('userInfo');
            console.log('***DEBUG*** userInfo מ-localStorage:', userInfoStr ? 'נמצא' : 'לא נמצא');
            
            const userInfo = JSON.parse(userInfoStr || '{}');
            token = userInfo.token;
            console.log('***DEBUG*** טוקן מ-localStorage:', token ? 'נמצא' : 'לא נמצא');
            
            // אם מצאנו טוקן בלוקאל סטורג', נשמור אותו גם בסשן
            if (token) {
                sessionStorage.setItem('token', token);
                console.log('***DEBUG*** טוקן הועתק מ-localStorage ל-sessionStorage');
            }
        } catch (error) {
            console.error('***DEBUG*** שגיאה בקריאת userInfo מ-localStorage:', error);
        }
    }
    
    if (!token) {
        console.error('***DEBUG*** לא נמצא טוקן בשום מקום! מעביר לדף התחברות');
        alert('אנא התחבר מחדש למערכת');
        window.location.href = 'loginPage.html?redirect=admin';
        return;
    }
    
    // בדיקת הטוקן
    console.log('***DEBUG*** שולח בקשת API עם טוקן:', token.substring(0, 10) + '...');
    
    // שליחת בקשה לשרת לקבלת כל השאלות מה-MongoDB
    fetch('/api/admin/questions', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('***DEBUG*** תגובת שרת:', response.status, response.statusText);
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('אין הרשאה לצפייה בשאלות');
            } else if (response.status === 401) {
                throw new Error('טוקן לא תקין או פג תוקפו');
            }
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('***DEBUG*** תגובת API:', data);
        
        // וודא שיש לנו שאלות במערך
        const questions = data.questions || [];
        console.log('***DEBUG*** מספר שאלות שהתקבלו:', questions.length);
        
        // עדכון מספר השאלות לפי סטטוס
        const pendingQuestions = questions.filter(q => q.status === 'pending' || !q.answer);
        const answeredQuestions = questions.filter(q => q.status === 'answered' && q.answer);
        const faqQuestions = questions.filter(q => q.status === 'added_to_faq');
        
        console.log('***DEBUG*** סטטיסטיקת שאלות:', {
            ממתינות: pendingQuestions.length,
            נענו: answeredQuestions.length,
            בFAQ: faqQuestions.length,
            סהכ: questions.length
        });
        
        // עדכון מונים
        document.getElementById('pending-questions-count').textContent = pendingQuestions.length;
        document.getElementById('answered-questions-count').textContent = answeredQuestions.length;
        document.getElementById('faq-questions-count').textContent = faqQuestions.length;
        document.getElementById('total-questions-count').textContent = questions.length;
        
        // עדכון תג מספר השאלות החדשות בסרגל הצד
        const sidebarBadge = document.getElementById('sidebar-questions-badge');
        if (sidebarBadge) {
            sidebarBadge.textContent = pendingQuestions.length;
            sidebarBadge.style.display = pendingQuestions.length > 0 ? 'inline-block' : 'none';
        }
        
        // עדכון מונה השאלות הממתינות בלוח הבקרה
        const dashboardPendingQuestions = document.getElementById('pending-questions');
        if (dashboardPendingQuestions) {
            dashboardPendingQuestions.textContent = pendingQuestions.length;
        }
        
        // ניקוי הטבלה
        questionsContainer.innerHTML = '';
        
        // בדיקה אם אין שאלות
        if (questions.length === 0) {
            console.log('***DEBUG*** אין שאלות להצגה!');
            questionsContainer.innerHTML = '<tr><td colspan="5" class="text-center">אין שאלות להצגה</td></tr>';
            return;
        }
        
        // יצירת מבנה טבלה חדש עם תמיכה מלאה בעברית
        const table = document.createElement('table');
        table.className = 'table table-striped table-hover';
        table.style.direction = 'rtl'; // כיוון מימין לשמאל
        
        // יצירת כותרות עם יישור לימין
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th class="text-right">תאריך</th>
                <th class="text-right">שאלה</th>
                <th class="text-right">מאת</th>
                <th class="text-right">סטטוס</th>
                <th class="text-right">פעולות</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // יצירת גוף הטבלה
        const tbody = document.createElement('tbody');
        
        // מיון השאלות לפי תאריך (חדש לישן)
        questions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        
        // הוספת כל השאלות לטבלה
        questions.forEach((question, index) => {
            console.log(`***DEBUG*** מוסיף שאלה ${index+1}:`, question._id);
            
            const row = document.createElement('tr');
            
            // פורמט תאריך ישראלי
            const questionDate = new Date(question.submittedAt);
            const formattedDate = questionDate.toLocaleDateString('he-IL');
            
            // קיצור הטקסט של השאלה אם הוא ארוך מדי
            let questionText = question.questionText;
            if (questionText.length > 100) {
                questionText = questionText.substring(0, 97) + '...';
            }
            
            row.innerHTML = `
                <td class="text-right">${formattedDate}</td>
                <td class="text-right">${questionText}</td>
                <td class="text-right">${question.userEmail || 'אלמוני'}</td>
                <td class="text-right">${getStatusLabel(question)}</td>
                <td class="text-right">
                    <button class="btn btn-sm btn-primary mr-1" onclick="openReplyModal('${question._id}', '${escapeHtml(question.questionText)}')">
                        ${question.answer ? 'ערוך תשובה' : 'ענה'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteQuestion('${question._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        
        // הוספת הטבלה למכיל
        questionsContainer.appendChild(table);
        
        // אתחול מערכת דפים (אם יש יותר מ-10 שאלות)
        setupPagination(questions.length);
        
        // עדכון סינון אם יש פרמטרים פעילים
        filterQuestions();
        
        console.log('***DEBUG*** טעינת השאלות הסתיימה בהצלחה');
    })
    .catch(error => {
        console.error('***DEBUG*** שגיאה בטעינת שאלות מ-MongoDB:', error);
        questionsContainer.innerHTML = `<tr><td colspan="5" class="text-center text-danger">שגיאה בטעינת השאלות: ${error.message}</td></tr>`;
    });
}

function setupPagination(totalQuestions) {
    const paginationContainer = document.getElementById('questions-pagination');
    if (!paginationContainer) return;
    
    // אם יש פחות מ-10 שאלות, לא צריך דפים
    if (totalQuestions <= 10) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    const questionsPerPage = 10;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);
    
    let paginationHTML = `
        <ul class="pagination justify-content-center mt-3">
            <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1" aria-label="קודם">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">קודם</span>
                </a>
            </li>
    `;
    
    // מציג עד 5 דפים
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        paginationHTML += `
            <li class="page-item ${i === 1 ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" aria-label="הבא">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">הבא</span>
                </a>
            </li>
        </ul>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // הוספת מאזיני אירועים לכפתורי הדפים
    document.querySelectorAll('#questions-pagination .page-link[data-page]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            goToPage(page);
        });
    });
    
    // מאזינים לכפתורי הקודם והבא
    const prevButton = document.querySelector('#questions-pagination .page-item:first-child .page-link');
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            const activePage = parseInt(document.querySelector('#questions-pagination .page-item.active .page-link').getAttribute('data-page'));
            if (activePage > 1) {
                goToPage(activePage - 1);
            }
        });
    }
    
    const nextButton = document.querySelector('#questions-pagination .page-item:last-child .page-link');
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            const activePage = parseInt(document.querySelector('#questions-pagination .page-item.active .page-link').getAttribute('data-page'));
            if (activePage < totalPages) {
                goToPage(activePage + 1);
            }
        });
    }
}

// פונקציה למעבר לדף ספציפי
function goToPage(page) {
    const questionsPerPage = 10;
    const rows = document.querySelectorAll('#questions-list tbody tr');
    
    rows.forEach((row, index) => {
        if (index >= (page - 1) * questionsPerPage && index < page * questionsPerPage) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // עדכון כפתור הדף הפעיל
    document.querySelectorAll('#questions-pagination .page-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activePageButton = document.querySelector(`#questions-pagination .page-link[data-page="${page}"]`);
    if (activePageButton) {
        activePageButton.parentNode.classList.add('active');
    }
    
    // עדכון כפתורי הקודם והבא
    const prevButton = document.querySelector('#questions-pagination .page-item:first-child');
    const nextButton = document.querySelector('#questions-pagination .page-item:last-child');
    
    if (prevButton) {
        if (page > 1) {
            prevButton.classList.remove('disabled');
        } else {
            prevButton.classList.add('disabled');
        }
    }
    
    if (nextButton) {
        const totalRows = document.querySelectorAll('#questions-list tbody tr').length;
        const totalPages = Math.ceil(totalRows / questionsPerPage);
        
        if (page < totalPages) {
            nextButton.classList.remove('disabled');
        } else {
            nextButton.classList.add('disabled');
        }
    }
}

// פונקציה להבטחת תוכן HTML בטוח
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// קבלת תווית סטטוס לשאלה
function getStatusLabel(question) {
    if (!question.answer || question.status === 'pending') {
        return '<span class="badge badge-warning">ממתין לתשובה</span>';
    } else if (question.status === 'added_to_faq') {
        return '<span class="badge badge-success">נענה + נוסף ל-FAQ</span>';
    } else {
        return '<span class="badge badge-info">נענה</span>';
    }
}

// פתיחת מודל מענה לשאלה
function openReplyModal(questionId, questionText) {
    console.log('***DEBUG*** פותח חלון מענה לשאלה:', questionId);
    
    // בדיקה אם המודל קיים, ואם לא - יצירה שלו
    if (!document.getElementById('replyModal')) {
        const modalHtml = `
        <!-- מבנה מעודכן למודל מענה לשאלה -->
<div class="modal fade" id="replyModal" tabindex="-1" role="dialog" aria-labelledby="replyModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="replyModalLabel">מענה לשאלה</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="question-text">השאלה:</label>
          <p id="question-text" class="bg-light p-2"></p>
        </div>
        <div class="form-group">
          <label for="reply-text">תשובה:</label>
          <textarea class="form-control" id="reply-text" rows="5"></textarea>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="add-to-faq">
          <label class="form-check-label" for="add-to-faq">הוסף לשאלות נפוצות</label>
        </div>
        <input type="hidden" id="question-id">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="send-reply">שלח תשובה</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">ביטול</button>
      </div>
    </div>
  </div>
</div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // הוספת מאזין לכפתור השליחה
        document.getElementById('send-reply').addEventListener('click', submitReply);
    }
    
    // עדכון תוכן המודל
    document.getElementById('question-text').textContent = questionText;
    document.getElementById('question-id').value = questionId;
    document.getElementById('reply-text').value = ''; // ניקוי תיבת התשובה
    document.getElementById('add-to-faq').checked = false;
    
    // קבלת הטוקן
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('אנא התחבר מחדש למערכת');
        window.location.href = 'loginPage.html?redirect=admin';
        return;
    }
    
    // בדיקה אם יש כבר תשובה, ואם כן - טעינה שלה לתיבה
    fetch(`/api/admin/questions/${questionId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) return response.json();
        return null;
    })
    .then(question => {
        if (question && question.answer) {
            document.getElementById('reply-text').value = question.answer.text;
            document.getElementById('add-to-faq').checked = question.status === 'added_to_faq';
        }
    })
    .catch(error => console.error('שגיאה בטעינת פרטי השאלה:', error));
    
    // הצגת המודל
    $('#replyModal').modal('show');
}

// שליחת תשובה לשאלה
function submitReply() {
    const questionId = document.getElementById('question-id').value;
    const replyText = document.getElementById('reply-text').value.trim();
    const addToFaq = document.getElementById('add-to-faq').checked;
    
    if (!replyText) {
        alert('יש להזין תשובה');
        return;
    }
    
    // קבל את הטוקן מהסשן
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('אנא התחבר מחדש למערכת');
        window.location.href = 'loginPage.html?redirect=admin';
        return;
    }
    
    // הכנת האובייקט לשליחה
    const replyData = {
        answer: replyText,
        status: addToFaq ? 'added_to_faq' : 'answered'
    };
    
    // שליחת התשובה לשרת
    fetch(`/api/admin/questions/${questionId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(replyData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(data.message || 'התשובה נשלחה בהצלחה');
            $('#replyModal').modal('hide');
            
            // טעינת השאלות מחדש
            loadQuestions();
        } else {
            throw new Error(data.message || 'שגיאה בשליחת התשובה');
        }
    })
    .catch(error => {
        console.error('שגיאה בשליחת התשובה:', error);
        alert('שגיאה בשליחת התשובה: ' + error.message);
    });
}

// מחיקת שאלה
function deleteQuestion(questionId) {
    if (!confirm('האם אתה בטוח שברצונך למחוק את השאלה?')) {
        return;
    }
    
    // קבל את הטוקן מהסשן
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('אנא התחבר מחדש למערכת');
        window.location.href = 'loginPage.html?redirect=admin';
        return;
    }
    
    fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('השאלה נמחקה בהצלחה');
            
            // טעינת השאלות מחדש
            loadQuestions();
        } else {
            throw new Error(data.message || 'שגיאה במחיקת השאלה');
        }
    })
    .catch(error => {
        console.error('שגיאה במחיקת השאלה:', error);
        alert('שגיאה במחיקת השאלה: ' + error.message);
    });
}

// סינון שאלות
function filterQuestions() {
    console.log('***DEBUG*** מפעיל פונקציית סינון שאלות');
    const statusFilter = document.getElementById('question-filter-status').value;
    const sortOrder = document.getElementById('question-sort-order').value;
    const searchText = document.getElementById('question-search').value.toLowerCase();
    
    console.log('***DEBUG*** פרמטרי סינון:', { 
        סטטוס: statusFilter, 
        מיון: sortOrder, 
        חיפוש: searchText 
    });
    
    const rows = document.querySelectorAll('#questions-list tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        if (columns.length < 4) return; // דלג על שורות שאינן מכילות נתונים
        
        const questionText = columns[1].textContent.toLowerCase();
        const statusElement = columns[3].querySelector('.badge');
        const status = statusElement ? statusElement.textContent : '';
        
        let matchesStatus = true;
        
        if (statusFilter) {
            if (statusFilter === 'pending') {
                matchesStatus = status.includes('ממתין');
            } else if (statusFilter === 'answered') {
                matchesStatus = status.includes('נענה') && !status.includes('FAQ');
            } else if (statusFilter === 'added_to_faq') {
                matchesStatus = status.includes('FAQ');
            }
        }
        
        const matchesSearch = !searchText || questionText.includes(searchText);
        
        const shouldDisplay = matchesStatus && matchesSearch;
        row.style.display = shouldDisplay ? '' : 'none';
        
        if (shouldDisplay) {
            visibleCount++;
        }
    });
    
    console.log('***DEBUG*** מספר שורות מוצגות לאחר סינון:', visibleCount);
    
    // עדכון הדפים אחרי הסינון
    setupPagination(visibleCount);
}

window.openReplyModal = openReplyModal;
window.deleteQuestion = deleteQuestion;