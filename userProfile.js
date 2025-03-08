document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
        window.location.href = 'loginPage.html';
        return;
    }

    // עדכון שם המשתמש בכותרת העליונה - הוסף את הקוד הזה
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay && userInfo.displayName) {
        usernameDisplay.textContent = `שלום ${userInfo.displayName},`;
    }

    // יש להציג את הערך הנוכחי של השם גם בטופס ההגדרות - הוסף את הקוד הזה
    const displayNameInput = document.getElementById('display-name');
    if (displayNameInput && userInfo.displayName) {
        displayNameInput.value = userInfo.displayName;
    }

    // אם יש אימייל בפרטי המשתמש, נציג אותו בשדה האימייל - הוסף את הקוד הזה
    const emailInput = document.getElementById('email');
    if (emailInput && userInfo.email) {
        emailInput.value = userInfo.email;
    }

    // Load user questions when the page loads
    loadUserQuestions();
        // טעינת היסטוריית הרכישות
        loadPurchaseHistory();
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
        <div class="question-text" style="text-align: right;">${question.questionText}</div>
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

// פונקציה לטעינת היסטוריית הרכישות
async function loadPurchaseHistory() {
    const ordersContainer = document.getElementById('orders-container');
    
    if (!ordersContainer) return;
    
    try {
        // הצגת אינדיקטור טעינה
        ordersContainer.innerHTML = '<p class="text-center"><i class="fas fa-spinner fa-spin"></i> טוען הזמנות...</p>';
        
        // קבלת מידע המשתמש המחובר
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        // פנייה לשרת לקבלת היסטוריית הרכישות
        const response = await fetch('/api/user/orders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userInfo.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load purchase history');
        }
        
        const data = await response.json();
        
        // בדיקה אם יש הזמנות
        if (!data.orders || data.orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="text-center my-4">
                    <p>אין לך הזמנות קודמות.</p>
                    <a href="homePage.html" class="btn btn-primary mt-3">
                        <i class="fas fa-shopping-cart"></i> התחל בקניות
                    </a>
                </div>
            `;
            return;
        }
        
        // יצירת טבלה להצגת ההזמנות - הוספת class="text-right" לכל התאים
        let tableHTML = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-right">מספר הזמנה</th>
                            <th class="text-right">תאריך</th>
                            <th class="text-right">סכום</th>
                            <th class="text-right">סטטוס</th>
                            <th class="text-right">פרטים</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // מילוי הטבלה בהזמנות - הוספת class="text-right" לכל התאים
        data.orders.forEach(order => {
            // עיצוב סטטוס ההזמנה
            let statusClass = '';
            switch (order.status) {
                case 'completed':
                    statusClass = 'text-success';
                    break;
                case 'processing':
                    statusClass = 'text-primary';
                    break;
                case 'cancelled':
                    statusClass = 'text-danger';
                    break;
                default:
                    statusClass = 'text-muted';
            }
            
            // פורמט תאריך
            const orderDate = new Date(order.orderDate);
            const formattedDate = orderDate.toLocaleDateString('he-IL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // פורמט מחיר
            const formattedAmount = new Intl.NumberFormat('he-IL', {
                style: 'currency',
                currency: 'ILS'
            }).format(order.totalAmount);
            
            // הוספת שורה לטבלה - תיקון: הוספת class="text-right" לכל תא
            tableHTML += `
                <tr>
                    <td class="text-right">#${order.orderNumber}</td>
                    <td class="text-right">${formattedDate}</td>
                    <td class="text-right">${formattedAmount}</td>
                    <td class="text-right"><span class="${statusClass}">${getStatusText(order.status)}</span></td>
                    <td class="text-right">
                        <button class="btn btn-sm btn-outline-info" 
                                onclick="showOrderDetails('${order.id}')" 
                                data-toggle="modal" 
                                data-target="#orderDetailsModal">
                            <i class="fas fa-eye"></i> הצג
                        </button>
                    </td>
                </tr>
            `;
        });
        
        // סגירת הטבלה
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        // הוספת החלק התחתון עם סיכום - הפוך את הסדר ליישור ימין
        tableHTML += `
            <div class="card-footer text-muted">
                <div class="d-flex justify-content-between align-items-center">
                    <a href="homePage.html" class="btn btn-primary btn-sm order-1">
                        <i class="fas fa-plus"></i> הזמנה חדשה
                    </a>
                    <span class="text-right order-2">סה"כ הזמנות: ${data.orders.length}</span>
                </div>
            </div>
        `;
        
        // הוספת הטבלה לדף
        ordersContainer.innerHTML = tableHTML;
        
        // הוספת מודל להצגת פרטי הזמנה (יופיע רק אחרי לחיצה על כפתור "הצג")
        // תיקון מבנה המודל כך שיתאים ל-RTL
        if (!document.getElementById('orderDetailsModal')) {
            const modalHTML = `
                <div class="modal fade" id="orderDetailsModal" tabindex="-1" role="dialog" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="orderDetailsModalLabel">פרטי הזמנה</h5>
                                <button type="button" class="close ml-0 mr-auto" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-right" id="orderDetailsContent">
                                <p class="text-center"><i class="fas fa-spinner fa-spin"></i> טוען פרטים...</p>
                            </div>
                            <div class="modal-footer justify-content-start">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">סגור</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
    } catch (error) {
        console.error('Error loading purchase history:', error);
        ordersContainer.innerHTML = `
            <div class="alert alert-danger" style="text-align: right;">
                <i class="fas fa-exclamation-circle"></i> אירעה שגיאה בטעינת ההזמנות, אנא נסה שוב מאוחר יותר.
            </div>
        `;
    }
}

// פונקציה להצגת פרטי הזמנה בודדת
function showOrderDetails(orderId) {
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    
    if (!orderDetailsContent) return;
    
    try {
        // הצגת אינדיקטור טעינה
        orderDetailsContent.innerHTML = '<p class="text-center"><i class="fas fa-spinner fa-spin"></i> טוען פרטים...</p>';
        
        // במקום לעשות קריאת API, נשתמש בנתונים מקומיים לצורך בדיקה
        setTimeout(() => {
            // דוגמה לנתונים - להחליף בקריאת שרת אמיתית
            const orderData = {
                id: orderId,
                orderNumber: "1740867274162",
                orderDate: "2025-03-02T12:00:00.000Z",
                status: "completed",
                totalAmount: 240.00,
                customerName: "לקוח לדוגמה",
                customerEmail: "customer@example.com",
                items: [
                    {
                        productName: "כרטיס כניסה לדיסנילנד",
                        productDetails: "אטרקציות - פריז",
                        quantity: 2,
                        unitPrice: 120.00
                    }
                ],
                tickets: [
                    {
                        name: "כרטיס כניסה לדיסנילנד",
                        downloadLink: "#"
                    }
                ]
            };
            
            // הצגת פרטי ההזמנה - שינוי: הכל מיושר לימין
            let detailsHTML = `
                <div class="order-details">
                    <div class="row mb-4">
                        <div class="col-md-6 text-right">
                            <h6>פרטי הזמנה #${orderData.orderNumber}</h6>
                            <p>תאריך: ${new Date(orderData.orderDate).toLocaleDateString('he-IL')}</p>
                            <p>סטטוס: <span class="${getStatusClass(orderData.status)}">${getStatusText(orderData.status)}</span></p>
                        </div>
                        <div class="col-md-6 text-right">
                            <h6>פרטי הרוכש</h6>
                            <p>${orderData.customerName}</p>
                            <p>${orderData.customerEmail}</p>
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th class="text-right">מוצר</th>
                                    <th class="text-right">פרטים</th>
                                    <th class="text-right">כמות</th>
                                    <th class="text-right">מחיר ליחידה</th>
                                    <th class="text-right">סה"כ</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            // הוספת פריטי ההזמנה - שינוי: כל התאים מיושרים לימין
            orderData.items.forEach(item => {
                const itemTotalPrice = item.quantity * item.unitPrice;
                detailsHTML += `
                    <tr>
                        <td class="text-right">${item.productName}</td>
                        <td class="text-right">${item.productDetails || '-'}</td>
                        <td class="text-right">${item.quantity}</td>
                        <td class="text-right">${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(item.unitPrice)}</td>
                        <td class="text-right">${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(itemTotalPrice)}</td>
                    </tr>
                `;
            });
            
            // סיכום - שינוי: יישור לימין
            detailsHTML += `
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="4" class="text-right font-weight-bold">סה"כ:</td>
                                    <td class="text-right font-weight-bold">${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(orderData.totalAmount)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                `;
            
            // אם יש קישורים להורדת כרטיסים
            if (orderData.tickets && orderData.tickets.length > 0) {
                detailsHTML += `
                    <div class="mt-3">
                        <h6 class="text-right">כרטיסים:</h6>
                        <ul class="list-group">
                `;
                
                orderData.tickets.forEach(ticket => {
                    detailsHTML += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <a href="${ticket.downloadLink}" class="btn btn-sm btn-primary" target="_blank">
                                <i class="fas fa-download"></i> הורד
                            </a>
                            <span>${ticket.name}</span>
                        </li>
                    `;
                });
                
                detailsHTML += `
                        </ul>
                    </div>
                `;
            }
            
            detailsHTML += '</div>';
            orderDetailsContent.innerHTML = detailsHTML;
            
        }, 1000); // סימולציית טעינה של שנייה אחת
        
    } catch (error) {
        console.error('Error loading order details:', error);
        orderDetailsContent.innerHTML = `
            <div class="alert alert-danger text-right">
                <i class="fas fa-exclamation-circle"></i> אירעה שגיאה בטעינת פרטי ההזמנה. אנא נסה שוב מאוחר יותר.
            </div>
        `;
    }
}

// פונקציה עזר להמרת קודי סטטוס לטקסט בעברית
function getStatusText(statusCode) {
    switch (statusCode) {
        case 'completed':
            return 'הושלמה';
        case 'processing':
            return 'בטיפול';
        case 'cancelled':
            return 'בוטלה';
        case 'pending':
            return 'ממתינה לאישור';
        case 'refunded':
            return 'זוכתה';
        default:
            return statusCode;
    }
}

// פונקציה עזר לקבלת קלאס CSS לפי סטטוס
function getStatusClass(statusCode) {
    switch (statusCode) {
        case 'completed':
            return 'text-success';
        case 'processing':
            return 'text-primary';
        case 'cancelled':
            return 'text-danger';
        case 'pending':
            return 'text-warning';
        case 'refunded':
            return 'text-info';
        default:
            return 'text-muted';
    }
}
