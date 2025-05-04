// אתחול מודול ניהול השאלות
document.addEventListener('DOMContentLoaded', function() {
    // אם הדף נטען, הוסף מאזינים לאירועים בחלק ניהול השאלות
    if (document.getElementById('questions-section')) {
        setupQuestionsEventListeners();
        loadQuestions();
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

// טעינת רשימת השאלות מהשרת
function loadQuestions() {
    console.log('טוען שאלות מהדאטהבייס...');
    const questionsContainer = document.getElementById('questions-list');
    if (!questionsContainer) return;
    
    questionsContainer.innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">טוען...</span></div></td></tr>';
    
    // קבל את הטוקן מהסשן
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('אנא התחבר מחדש למערכת');
        window.location.href = 'loginPage.html?redirect=admin';
        return;
    }
    
    // שליחת בקשה לשרת לקבלת כל השאלות
    fetch('/api/admin/questions', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('אין הרשאה לצפייה בשאלות');
            }
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // וודא שיש לנו שאלות במערך
        const questions = data.questions || [];
        console.log('שאלות נטענו:', questions);
        
        questionsContainer.innerHTML = '';
        
        // עדכון מספר השאלות לפי סטטוס
        const pendingQuestions = questions.filter(q => q.status === 'pending' || !q.answer);
        const answeredQuestions = questions.filter(q => q.status === 'answered' && q.answer);
        const faqQuestions = questions.filter(q => q.status === 'added_to_faq');
        
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
        
        if (questions.length === 0) {
            questionsContainer.innerHTML = '<tr><td colspan="5" class="text-center">אין שאלות להצגה</td></tr>';
            return;
        }
        
        // הצגת כל השאלות בטבלה
        questions.forEach(question => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(question.submittedAt).toLocaleDateString()}</td>
                <td>${question.questionText}</td>
                <td>${question.userEmail || 'אלמוני'}</td>
                <td>${getStatusLabel(question)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="openReplyModal('${question._id}', '${escapeHtml(question.questionText)}')">
                        ${question.answer ? 'ערוך תשובה' : 'ענה'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteQuestion('${question._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            questionsContainer.appendChild(row);
        });
    })
    .catch(error => {
        console.error('שגיאה בטעינת שאלות:', error);
        questionsContainer.innerHTML = `<tr><td colspan="5" class="text-center text-danger">שגיאה בטעינת השאלות: ${error.message}</td></tr>`;
    });
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
    document.getElementById('question-text').textContent = questionText;
    document.getElementById('question-id').value = questionId;
    document.getElementById('reply-text').value = ''; // נקה את התיבה קודם
    document.getElementById('add-to-faq').checked = false;
    
    // קבל את הטוקן מהסשן
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('אנא התחבר מחדש למערכת');
        window.location.href = 'loginPage.html?redirect=admin';
        return;
    }
    
    // בדוק אם יש כבר תשובה, ואם כן - טען אותה לתיבה
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
    const statusFilter = document.getElementById('question-filter-status').value;
    const sortOrder = document.getElementById('question-sort-order').value;
    const searchText = document.getElementById('question-search').value.toLowerCase();
    
    const rows = document.querySelectorAll('#questions-list tr');
    
    rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        if (columns.length < 4) return; // דלג על שורות שאינן מכילות נתונים
        
        const questionText = columns[1].textContent.toLowerCase();
        const statusElement = columns[3].querySelector('.badge');
        const status = statusElement ? statusElement.textContent : '';
        
        const matchesStatus = !statusFilter || 
                             (statusFilter === 'pending' && status.includes('ממתין')) ||
                             (statusFilter === 'answered' && status.includes('נענה') && !status.includes('FAQ')) ||
                             (statusFilter === 'added_to_faq' && status.includes('FAQ'));
        
        const matchesSearch = !searchText || questionText.includes(searchText);
        
        row.style.display = (matchesStatus && matchesSearch) ? '' : 'none';
    });
}

window.openReplyModal = openReplyModal;
window.deleteQuestion = deleteQuestion;