document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('questions-section')) {
        setupQuestionsEventListeners();
        loadQuestions();
    }

    if (document.getElementById('question-filter-status')) {
        setupFilterListeners();
    }
});

// פונקציה לבריחה של HTML כדי למנוע תקלות בתצוגת טקסט
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
        '`': '&#096;'
    };
    return text.replace(/[&<>"'`]/g, function(m) { return map[m]; });
}

// הגדרת מאזינים לאירועים בחלק ניהול השאלות
function setupQuestionsEventListeners() {
    document.getElementById('send-reply').addEventListener('click', submitReply);

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
    const statusFilter = document.getElementById('question-filter-status');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterQuestions();
        });
    }

    const sortOrder = document.getElementById('question-sort-order');
    if (sortOrder) {
        sortOrder.addEventListener('change', function() {
            filterQuestions();
        });
    }

    const searchInput = document.getElementById('question-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterQuestions();
        });
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 'pending':
            return 'ממתינה למענה';
        case 'answered':
            return 'נענתה';
        case 'faq':
            return 'נוספה ל־FAQ';
        default:
            return 'סטטוס לא ידוע';
    }
}

// טעינת רשימת השאלות מהשרת
function loadQuestions() {
    const questionsContainer = document.getElementById('questions-list');
    if (!questionsContainer) {
        console.error('***DEBUG*** לא נמצא אלמנט questions-list בדף');
        return;
    }

    questionsContainer.innerHTML = `
        <tr>
            <td colspan="5" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">טוען...</span>
                </div>
            </td>
        </tr>
    `;

    let token = sessionStorage.getItem('token');
    if (!token) {
        try {
            const userInfoStr = localStorage.getItem('userInfo');
            const userInfo = JSON.parse(userInfoStr || '{}');
            token = userInfo.token;
            if (token) {
                sessionStorage.setItem('token', token);
            }
        } catch (error) {
            console.error('***DEBUG*** שגיאה בקריאת userInfo מ-localStorage:', error);
        }
    }

    if (!token) {
        alert('אנא התחבר מחדש למערכת');
        window.location.href = 'loginPage.html?redirect=admin';
        return;
    }

    fetch('/api/admin/questions', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return response.json();
    })
    .then(data => {
        const questions = data.questions || [];

        const pendingQuestions = questions.filter(q => q.status === 'pending' || !q.answer);
        const answeredQuestions = questions.filter(q => q.status === 'answered' && q.answer);
        const faqQuestions = questions.filter(q => q.status === 'added_to_faq');

        document.getElementById('pending-questions-count').textContent = pendingQuestions.length;
        document.getElementById('answered-questions-count').textContent = answeredQuestions.length;
        document.getElementById('faq-questions-count').textContent = faqQuestions.length;
        document.getElementById('total-questions-count').textContent = questions.length;

        const sidebarBadge = document.getElementById('sidebar-questions-badge');
        if (sidebarBadge) {
            sidebarBadge.textContent = pendingQuestions.length;
            sidebarBadge.style.display = pendingQuestions.length > 0 ? 'inline-block' : 'none';
        }

        const dashboardPendingQuestions = document.getElementById('pending-questions');
        if (dashboardPendingQuestions) {
            dashboardPendingQuestions.textContent = pendingQuestions.length;
        }

        questionsContainer.innerHTML = '';

        if (questions.length === 0) {
            questionsContainer.innerHTML = '<tr><td colspan="5" class="text-center">אין שאלות להצגה</td></tr>';
            return;
        }

        questions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        questions.forEach((question) => {
            const row = document.createElement('tr');
            const questionDate = new Date(question.submittedAt);
            const formattedDate = questionDate.toLocaleDateString('he-IL');
            let questionText = question.questionText;
            if (questionText.length > 100) {
                questionText = questionText.substring(0, 97) + '...';
            }

            row.innerHTML = `
                <td class="text-right">${formattedDate}</td>
                <td class="text-right">${questionText}</td>
                <td class="text-right">${question.userEmail || 'אלמוני'}</td>
                <td class="text-right">${getStatusLabel(question.status)}</td>
                <td class="text-right">
                    <button class="btn btn-sm btn-primary mr-1" onclick="openReplyModal('${question._id}', '${escapeHtml(question.questionText)}')">
                        ${question.answer ? 'ערוך תשובה' : 'ענה'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteQuestion('${question._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            questionsContainer.appendChild(row);
        });

        setupPagination(questions.length);
        filterQuestions();
    })
    .catch(error => {
        console.error('***DEBUG*** שגיאה בטעינת שאלות מ-MongoDB:', error);
        questionsContainer.innerHTML = `<tr><td colspan="5" class="text-center text-danger">שגיאה בטעינת השאלות: ${error.message}</td></tr>`;
    });
}

function setupPagination(totalQuestions) {
    const paginationContainer = document.getElementById('questions-pagination');
    if (!paginationContainer) return;

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
                </a>
            </li>
    `;

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
                </a>
            </li>
        </ul>
    `;

    paginationContainer.innerHTML = paginationHTML;

    document.querySelectorAll('#questions-pagination .page-link[data-page]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            goToPage(page);
        });
    });

    const prevButton = document.querySelector('#questions-pagination .page-item:first-child .page-link');
    if (prevButton) {
        prevButton.addEventListener('click', function (e) {
            e.preventDefault();
            const activePage = parseInt(document.querySelector('#questions-pagination .page-item.active .page-link').getAttribute('data-page'));
            if (activePage > 1) {
                goToPage(activePage - 1);
            }
        });
    }

    const nextButton = document.querySelector('#questions-pagination .page-item:last-child .page-link');
    if (nextButton) {
        nextButton.addEventListener('click', function (e) {
            e.preventDefault();
            const activePage = parseInt(document.querySelector('#questions-pagination .page-item.active .page-link').getAttribute('data-page'));
            if (activePage < totalPages) {
                goToPage(activePage + 1);
            }
        });
    }
}

function goToPage(page) {
    const questionsPerPage = 10;
    const rows = document.querySelectorAll('#questions-list tbody tr');

    rows.forEach((row, index) => {
        row.style.display = (index >= (page - 1) * questionsPerPage && index < page * questionsPerPage) ? '' : 'none';
    });

    document.querySelectorAll('#questions-pagination .page-item').forEach(item => item.classList.remove('active'));

    const activePageButton = document.querySelector(`#questions-pagination .page-link[data-page="${page}"]`);
    if (activePageButton) {
        activePageButton.parentNode.classList.add('active');
    }

    const prevButton = document.querySelector('#questions-pagination .page-item:first-child');
    const nextButton = document.querySelector('#questions-pagination .page-item:last-child');

    if (prevButton) prevButton.classList.toggle('disabled', page <= 1);

    const totalPages = Math.ceil(rows.length / questionsPerPage);
    if (nextButton) nextButton.classList.toggle('disabled', page >= totalPages);
}

function openReplyModal(questionId, questionText) {
    document.getElementById('question-text').textContent = questionText;
    document.getElementById('question-id').value = questionId;
    document.getElementById('reply-text').value = '';
    document.getElementById('add-to-faq').checked = false;

    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('אנא התחבר מחדש למערכת');
        window.location.href = 'loginPage.html?redirect=admin';
        return;
    }

    fetch(`/api/admin/questions/${questionId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.ok ? response.json() : null)
        .then(question => {
            if (question && question.answer) {
                document.getElementById('reply-text').value = question.answer.text;
                document.getElementById('add-to-faq').checked = question.status === 'added_to_faq';
            }
        })
        .catch(error => console.error('שגיאה בטעינת פרטי השאלה:', error));

    $('#replyModal').modal('show');
}

function submitReply() {
    const questionId = document.getElementById('question-id').value;
    const replyText = document.getElementById('reply-text').value.trim();
    const addToFaq = document.getElementById('add-to-faq').checked;

    if (!replyText) {
        alert('יש להזין תשובה');
        return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('אנא התחבר מחדש למערכת');
        window.location.href = 'loginPage.html?redirect=admin';
        return;
    }

    const replyData = {
        answer: replyText,
        status: addToFaq ? 'added_to_faq' : 'answered'
    };

    fetch(`/api/admin/questions/${questionId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(replyData)
    })
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
            if (data.success) {
                alert(data.message || 'התשובה נשלחה בהצלחה');
                $('#replyModal').modal('hide');
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

function deleteQuestion(questionId) {
    if (!confirm('האם אתה בטוח שברצונך למחוק את השאלה?')) return;

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
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
            if (data.success) {
                alert('השאלה נמחקה בהצלחה');
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

function filterQuestions() {
    const statusFilter = document.getElementById('question-filter-status').value;
    const sortOrder = document.getElementById('question-sort-order').value;
    const searchText = document.getElementById('question-search').value.toLowerCase();

    const rows = document.querySelectorAll('#questions-list tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        if (columns.length < 4) return;

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

        if (shouldDisplay) visibleCount++;
    });

    setupPagination(visibleCount);
}

