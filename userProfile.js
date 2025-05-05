document.addEventListener('DOMContentLoaded', function() {
    // בדיקה אם המשתמש מחובר
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
        window.location.href = 'loginPage.html';
        return;
    }

    // עדכון שם המשתמש בכותרת העליונה
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay && userInfo.displayName) {
        usernameDisplay.textContent = `שלום ${userInfo.displayName},`;
    }

        // טעינת פרטי המשתמש מהשרת (כולל האימייל האמיתי)
        loadUserProfile();

    // מילוי ערכים קיימים בטופס
    const displayNameInput = document.getElementById('display-name');
    const emailInput = document.getElementById('email');
    
    if (displayNameInput && userInfo.displayName) {
        displayNameInput.value = userInfo.displayName;
    }
    
    if (emailInput) {
        // תיקון: השתמש ישירות בשדה email מהמשתמש אם קיים
        if (userInfo.email) {
            emailInput.value = userInfo.email;
        } else {
            // כגיבוי: השתמש ב-username אם אין email
            emailInput.value = userInfo.username || '';
        }
    }

    // טעינת שאלות ורכישות
    loadUserQuestions();
    loadPurchaseHistory();
    
    // הוספת טיפול באירוע שליחת הטופס
    const userSettingsForm = document.getElementById('user-settings-form');
    if (userSettingsForm) {
        // החלף את התנהגות ברירת המחדל של שליחת הטופס
        userSettingsForm.addEventListener('submit', function(event) {
            event.preventDefault(); // מניעת התנהגות ברירת המחדל של הטופס
            updateUserProfile();
        });
    }

    // הוספת מאזינים ללשוניות
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // הסרת קלאס פעיל מכל הלשוניות
            document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
            
            // הסרת קלאס פעיל מכל תוכן הלשוניות
            document.querySelectorAll('.tab-pane').forEach(p => {
                p.classList.remove('show', 'active');
            });
            
            // הוספת קלאס פעיל ללשונית הנוכחית
            this.classList.add('active');
            
            // הצגת התוכן המתאים
            const targetId = this.getAttribute('href').substring(1);
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('show', 'active');
                
                // טעינת נתונים ספציפיים ללשונית
                if (targetId === 'questions') {
                    loadUserQuestions();
                } else if (targetId === 'orders') {
                    loadPurchaseHistory();
                }
            }
        });
    });
});

async function loadUserQuestions() {
    const questionsContainer = document.getElementById('user-questions-container');
    const noQuestionsMessage = document.getElementById('no-questions-message');
    
    if (!questionsContainer) return;
    
    try {
        questionsContainer.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> טוען שאלות...</div>';
        
        // קבלת הטוקן מהמקומות האפשריים
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const token = userInfo.token || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('לא נמצא טוקן אימות. יש להתחבר מחדש');
        }
        
        // פנייה לשרת עם הטוקן
        const response = await fetch('/api/user/questions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('פג תוקף החיבור, יש להתחבר מחדש');
            }
            throw new Error(`שגיאת שרת: ${response.status}`);
        }
        
        const data = await response.json();
        
        // בדיקה אם יש שאלות
        if (!data.questions || data.questions.length === 0) {
            questionsContainer.innerHTML = '';
            noQuestionsMessage.style.display = 'block';
            return;
        }
        
        noQuestionsMessage.style.display = 'none';
        questionsContainer.innerHTML = '';
        
        // הצגת השאלות
        data.questions.forEach(question => {
            const questionElement = createQuestionElement(question);
            questionsContainer.appendChild(questionElement);
        });
    } catch (error) {
        console.error('שגיאה בטעינת השאלות:', error);
        questionsContainer.innerHTML = `
            <div class="alert alert-danger text-right">
                <i class="fas fa-exclamation-circle"></i> אירעה שגיאה בטעינת השאלות: ${error.message}
            </div>
        `;
        
        // אם השגיאה היא בגלל פג תוקף הטוקן
        if (error.message.includes('פג תוקף') || error.message.includes('להתחבר מחדש')) {
            setTimeout(() => {
                window.location.href = 'loginPage.html';
            }, 3000);
        }
    }
}

/**
 * פונקציה לטעינת פרטי המשתמש מהשרת
 * הפונקציה מבצעת קריאת API כדי לקבל את פרטי המשתמש המלאים ומעדכנת את הטופס
 */
async function loadUserProfile() {
    try {
        // קבלת מידע המשתמש המחובר
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        if (!userInfo) {
            throw new Error('מידע משתמש לא נמצא');
        }
        
        // מילוי ערכים קיימים בטופס - ללא קריאה לשרת
        const displayNameInput = document.getElementById('display-name');
        const emailInput = document.getElementById('email');
        
        // בדיקה אם הפקדים קיימים
        if (!displayNameInput || !emailInput) {
            console.error('לא נמצאו פקדי הטופס הנדרשים');
            return; // יציאה מהפונקציה
        }
        
        // מילוי הטופס עם המידע שכבר קיים ב-localStorage
        if (userInfo.displayName) {
            displayNameInput.value = userInfo.displayName;
        }
        
        // להשתמש ב-username אם אין email (או ריק), מהנתונים שכבר יש בזיכרון
        if (userInfo.email && userInfo.email !== userInfo.username) {
            emailInput.value = userInfo.email;
            console.log('אימייל נטען מהזיכרון המקומי:', userInfo.email);
        } else if (userInfo.username) {
            emailInput.value = userInfo.username;
            console.log('שם משתמש נטען במקום אימייל:', userInfo.username);
        }
        
        // שמירת הטופס - אנחנו כבר מילאנו את הפרטים
        const userSettingsForm = document.getElementById('user-settings-form');
        if (userSettingsForm) {
            // החלף את התנהגות ברירת המחדל של שליחת הטופס
            userSettingsForm.addEventListener('submit', function(event) {
                event.preventDefault(); // מניעת התנהגות ברירת המחדל של הטופס
                updateUserProfile();
            });
        }
        
        console.log('פרטי המשתמש נטענו בהצלחה');
        
    } catch (error) {
        console.error('שגיאה בטעינת פרטי המשתמש:', error);
        
        // הצגת הודעת שגיאה בדף (ללא קריאה לפונקציה חיצונית)
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = 'שגיאה בטעינת פרטי המשתמש: ' + error.message;
        
        // הוספת ההודעה לדף
        const settingsTab = document.getElementById('settings');
        if (settingsTab) {
            const firstChild = settingsTab.firstChild;
            settingsTab.insertBefore(errorDiv, firstChild);
            
            // הסרת ההודעה אחרי 5 שניות
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }
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
        const token = userInfo.token || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('לא נמצא טוקן אימות. יש להתחבר מחדש');
        }
        
        // הדפסת הטוקן לצורכי בדיקה
        console.log('שולח טוקן לשרת:', token.substring(0, 10) + '...');
        
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

         // אם השגיאה היא בגלל פג תוקף הטוקן
         if (error.message.includes('פג תוקף') || error.message.includes('להתחבר מחדש')) {
            setTimeout(() => {
                window.location.href = 'loginPage.html';
            }, 3000);
        }
    }
}

//פונקציה להתחברות מחדש
function checkAndRefreshToken() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = userInfo.token || sessionStorage.getItem('token');
    
    if (!token) {
        // אם אין טוקן בכלל, הפנה להתחברות
        window.location.href = 'loginPage.html';
        return false;
    }
    
    // בדיקה אם הטוקן תקין ע"י שליחת בקשה לשרת
    fetch('/api/validate-token', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok && response.status === 401) {
            // הטוקן לא תקין - הפנה להתחברות
            alert('פג תוקף החיבור, יש להתחבר מחדש');
            window.location.href = 'loginPage.html';
            return false;
        }
    })
    .catch(error => {
        console.error('שגיאה בבדיקת תוקף הטוקן:', error);
    });
    
    return true;
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

async function updateUserProfile() {
    console.log("פונקציית updateUserProfile הופעלה");
    
    try {
        // השג את הערכים מהטופס
        const displayNameInput = document.getElementById('display-name');
        const emailInput = document.getElementById('email');
        const currentPasswordInput = document.getElementById('current-password');
        const newPasswordInput = document.getElementById('new-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        // וידוא שכל השדות אותרו
        if (!displayNameInput || !emailInput || !currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
            throw new Error("לא כל שדות הטופס אותרו");
        }
        
        // בדיקות תקינות בסיסיות
        if (!displayNameInput.value.trim()) {
            throw new Error("שם תצוגה הוא שדה חובה");
        }
        
        // בדיקת תקינות המייל
        if (emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
            throw new Error("כתובת המייל אינה תקינה");
        }
        
        // בדיקת סיסמה חדשה (אם הוזנה)
        if (newPasswordInput.value) {
            if (!currentPasswordInput.value) {
                throw new Error("יש להזין את הסיסמה הנוכחית כדי לשנות לסיסמה חדשה");
            }
            
            if (newPasswordInput.value !== confirmPasswordInput.value) {
                throw new Error("הסיסמאות החדשות אינן תואמות");
            }
            
            if (newPasswordInput.value.length < 6) {
                throw new Error("הסיסמה החדשה חייבת להכיל לפחות 6 תווים");
            }
        }
        
        // קבלת פרטי המשתמש המחובר
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
            throw new Error("נדרשת התחברות מחדש");
        }
        
        // הצגת אינדיקטור טעינה
        const submitButton = document.querySelector('#user-settings-form button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> מעדכן...';
        
        // הכנת הנתונים לשליחה
        const updateData = {
            displayName: displayNameInput.value.trim(),
            email: emailInput.value.trim()
        };
        
        // הוסף סיסמאות אם הוזנו
        if (newPasswordInput.value) {
            updateData.currentPassword = currentPasswordInput.value;
            updateData.newPassword = newPasswordInput.value;
        }
        
        console.log("שולח נתונים לעדכון:", JSON.stringify(updateData));
        
        // שליחת הנתונים לשרת
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "שגיאה בעדכון הפרטים");
        }
        
        const result = await response.json();
        console.log("תשובה מהשרת:", result);
        
        // עדכון מוצלח - עדכן את הנתונים בלוקל סטורג'
        if (result.token) {
            userInfo.token = result.token;
        }
        
        // עדכון פרטי המשתמש בזיכרון המקומי
        userInfo.displayName = updateData.displayName;
        userInfo.email = updateData.email;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        sessionStorage.setItem('displayName', updateData.displayName);
        localStorage.setItem('displayName', updateData.displayName);
        
        // עדכון שם התצוגה בראש העמוד
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = `שלום ${userInfo.displayName},`;
        }
        
        // עדכון שם התצוגה בתפריט הניווט
        const userGreeting = document.getElementById('user-greeting');
        if (userGreeting) {
            userGreeting.textContent = ` היי, ${userInfo.displayName}`;
        }
        
        // ניקוי שדות הסיסמה
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
        
        // הצגת הודעת הצלחה
        showMessage("פרטי המשתמש עודכנו בהצלחה", "success");
    } catch (error) {
        console.error("שגיאה בעדכון פרטי המשתמש:", error);
        showMessage(error.message || "שגיאה בעדכון הפרטים", "error");
    } finally {
        // החזרת כפתור השליחה למצב רגיל בכל מקרה
        const submitButton = document.querySelector('#user-settings-form button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "שמור שינויים";
        }
    }
}

function showMessage(message, type) {
    // הסרת הודעות קודמות
    const existingMessages = document.querySelectorAll('.alert');
    existingMessages.forEach(msg => msg.remove());
    
    // יצירת אלמנט הודעה חדש
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'alert alert-danger' : 'alert alert-success';
    messageDiv.style.marginTop = '15px';
    messageDiv.style.marginBottom = '15px';
    messageDiv.style.textAlign = 'right'; // וידוא יישור לימין
    messageDiv.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}`;
    
    // בדיקה איזו לשונית פעילה ומיקום ההודעה בהתאם
    const activeTab = document.querySelector('.tab-pane.active');
    if (activeTab) {
        const tabId = activeTab.id;
        
        if (tabId === 'settings') {
            // הוספת ההודעה מעל הטופס
            const form = document.getElementById('user-settings-form');
            if (form) {
                form.parentNode.insertBefore(messageDiv, form);
            }
        } else if (tabId === 'questions') {
            // הוספת ההודעה למיכל השאלות
            const questionsContainer = document.getElementById('user-questions-container');
            if (questionsContainer) {
                questionsContainer.parentNode.insertBefore(messageDiv, questionsContainer);
            }
        } else {
            // בלשוניות אחרות - הוספה לראש המיכל
            activeTab.insertBefore(messageDiv, activeTab.firstChild);
        }
    }
    
    // הסרת ההודעה אחרי 5 שניות
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

  function showErrorMessage(message) {
    // בדוק אם כבר קיימת הודעת שגיאה ומחק אותה
    const existingError = document.querySelector('.profile-error-message');
    if (existingError) {
      existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger profile-error-message';
    errorDiv.textContent = message;
    
    const form = document.getElementById('user-settings-form');
    form.parentNode.insertBefore(errorDiv, form);
    
    // הסרת ההודעה אחרי 5 שניות
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  function showSuccessMessage(message) {
    // בדוק אם כבר קיימת הודעת הצלחה ומחק אותה
    const existingSuccess = document.querySelector('.profile-success-message');
    if (existingSuccess) {
      existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success profile-success-message';
    successDiv.textContent = message;
    
    const form = document.getElementById('user-settings-form');
    form.parentNode.insertBefore(successDiv, form);
    
    // הסרת ההודעה אחרי 5 שניות
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function showOrderDetails(orderId) {
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    
    if (!orderDetailsContent) return;
    
    try {
        // הצגת אינדיקטור טעינה
        orderDetailsContent.innerHTML = '<p class="text-center"><i class="fas fa-spinner fa-spin"></i> טוען פרטים...</p>';
        
        // קבלת מידע המשתמש המחובר - כולל המייל המעודכן!
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const userEmail = userInfo.email || userInfo.username; // שימוש במייל אם קיים
        
        // ביצוע קריאה לשרת לקבלת פרטי ההזמנה
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userInfo.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load order details');
        }
        
        // קבלת נתוני ההזמנה מהשרת
        const orderData = await response.json();
        
        // עדכון כותרת המודל
        const modalTitle = document.getElementById('orderDetailsModalLabel');
        if (modalTitle) {
            modalTitle.textContent = `פרטי הזמנה #${orderData.orderNumber}`;
        }
        
        // הצגת פרטי ההזמנה - כל התוכן מיושר לימין
        // שימוש במייל המעודכן מה-userInfo במקום מהשרת
        let detailsHTML = `
            <div class="order-details">
                <div class="row mb-4">
                    <div class="col-md-6 text-right">
                        <h6>פרטי רכישה</h6>
                        <p>תאריך: ${new Date(orderData.orderDate).toLocaleDateString('he-IL')}</p>
                        <p>סטטוס: <span class="${getStatusClass(orderData.status)}">${getStatusText(orderData.status)}</span></p>
                    </div>
                    <div class="col-md-6 text-right">
                        <h6>פרטי רוכש</h6>
                        <p>${userInfo.displayName || orderData.customerName}</p>
                        <p>${userEmail}</p>
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
        
        // הוספת פריטי ההזמנה לטבלה
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
        
        // סיכום הטבלה
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
        
        // הצגת מידע על כרטיסים אם קיימים
        // בדיקה אם יש כרטיסים בהזמנה, או אם אין, יצירת כרטיס אחד לפחות לפי פריטי ההזמנה
        const tickets = orderData.tickets && orderData.tickets.length > 0 
            ? orderData.tickets 
            : orderData.items.map(item => ({
                id: `item-${item.productName.replace(/\s+/g, '-')}`,
                name: item.productName
            }));
        
            if (orderData.items && orderData.items.length > 0) {
                detailsHTML += `
                    <div class="mt-3">
                        <h6 class="text-right">כרטיסים:</h6>
                        <ul class="list-group">
                `;
                
                // קיבוץ הכרטיסים לפי סוג האטרקציה
                const groupedItems = {};
                
                orderData.items.forEach(item => {
                    const productName = item.productName || "כרטיס כניסה";
                    
                    if (!groupedItems[productName]) {
                        groupedItems[productName] = {
                            count: 0,
                            details: item
                        };
                    }
                    
                    groupedItems[productName].count += (item.quantity || 1);
                });
                
                // הצגת הכרטיסים מקובצים
                Object.keys(groupedItems).forEach(productName => {
                    const group = groupedItems[productName];
                    const item = group.details;
                    
                    // יצירת קישור להורדה עם שם המוצר
                    const downloadLink = `/generateTicketPDF.html?orderId=${orderId}&productName=${encodeURIComponent(productName)}`;
                    
                    detailsHTML += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <a href="${downloadLink}" class="btn btn-sm btn-primary" target="_blank">
                                <i class="fas fa-download"></i> הורד
                            </a>
                            <div class="text-right">
                                <strong>${productName}</strong>
                                <div class="text-muted small">${group.count} כרטיסים</div>
                            </div>
                        </li>
                    `;
                });
                
                // הוספת אפשרות להורדת כל הכרטיסים
                if (Object.keys(groupedItems).length > 1) {
                    const allTicketsLink = `/generateTicketPDF.html?orderId=${orderId}`;
                    
                    detailsHTML += `
                        <li class="list-group-item d-flex justify-content-between align-items-center bg-light">
                            <a href="${allTicketsLink}" class="btn btn-sm btn-outline-primary" target="_blank">
                                <i class="fas fa-download"></i> הורד את כל הכרטיסים
                            </a>
                            <div class="text-right">
                                <strong>כל הכרטיסים</strong>
                            </div>
                        </li>
                    `;
                }
                
                detailsHTML += `
                        </ul>
                    </div>
                `;
            }
        
        detailsHTML += '</div>';
        orderDetailsContent.innerHTML = detailsHTML;
        
    } catch (error) {
        console.error('Error loading order details:', error);
        orderDetailsContent.innerHTML = `
            <div class="alert alert-danger text-right">
                <i class="fas fa-exclamation-circle"></i> אירעה שגיאה בטעינת פרטי ההזמנה. אנא נסה שוב מאוחר יותר.
            </div>
        `;
    }
}
