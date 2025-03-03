
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
        window.location.href = 'loginPage.html';
        return;
    }

    // Load user questions when the page loads
    loadUserQuestions();
});

async function loadUserQuestions() {
    const questionsContainer = document.getElementById('user-questions-container');
    const noQuestionsMessage = document.getElementById('no-questions-message');
    
    if (!questionsContainer) return;
    
    try {
        // Get user token from localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        // Fetch user questions
        const response = await fetch('/api/user/questions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userInfo.token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load questions');
        }
        
        const data = await response.json();
        
        // Clear loading indicator
        questionsContainer.innerHTML = '';
        
        if (!data.questions || data.questions.length === 0) {
            // Show "no questions" message
            noQuestionsMessage.style.display = 'block';
            return;
        }
        
        // Display each question
        data.questions.forEach(question => {
            const questionElement = createQuestionElement(question);
            questionsContainer.appendChild(questionElement);
        });
    } catch (error) {
        console.error('Error loading questions:', error);
        questionsContainer.innerHTML = '<p class="error-message">אירעה שגיאה בטעינת השאלות. אנא נסה שוב מאוחר יותר.</p>';
    }
}

function createQuestionElement(question) {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-item');
    
    // Format date
    const date = new Date(question.submittedAt);
    const formattedDate = date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Determine status class and text
    let statusClass = '';
    let statusText = '';
    
    switch (question.status) {
        case 'pending':
            statusClass = 'status-pending';
            statusText = 'ממתינה לתשובה';
            break;
        case 'answered':
            statusClass = 'status-answered';
            statusText = 'נענתה';
            break;
        case 'added_to_faq':
            statusClass = 'status-added-to-faq';
            statusText = 'נוספה לשאלות נפוצות';
            break;
        default:
            statusClass = 'status-pending';
            statusText = 'ממתינה לתשובה';
    }
    
    // HTML for the question
    questionItem.innerHTML = `
        <div class="question-text">${question.questionText}</div>
        <div class="question-meta">
            <span>תאריך: ${formattedDate}</span>
            <span class="question-status ${statusClass}">${statusText}</span>
        </div>
    `;
    
    // Add answer if it exists
    if (question.answer && question.answer.text) {
        const answerDate = new Date(question.answer.answeredAt);
        const formattedAnswerDate = answerDate.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const answerContainer = document.createElement('div');
        answerContainer.classList.add('answer-container');
        answerContainer.innerHTML = `
            <strong>תשובה:</strong>
            <p>${question.answer.text}</p>
            <small class="text-muted">התקבלה ב: ${formattedAnswerDate}</small>
        `;
        
        questionItem.appendChild(answerContainer);
    }
    
    return questionItem;
}