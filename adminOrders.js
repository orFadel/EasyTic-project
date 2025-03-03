// אתחול מודול ניהול ההזמנות
document.addEventListener('DOMContentLoaded', function() {
    // אם הדף נטען, הוסף מאזינים לאירועים בחלק ניהול ההזמנות
    if (document.getElementById('orders-section')) {
        setupOrdersEventListeners();
        loadOrders();
    }
});

// הגדרת מאזינים לאירועים בחלק ניהול ההזמנות
function setupOrdersEventListeners() {
    // מאזינים לסינון הזמנות
    const statusFilter = document.getElementById('order-filter-status');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterOrders);
    }
    
    const sortOrder = document.getElementById('order-sort-order');
    if (sortOrder) {
        sortOrder.addEventListener('change', filterOrders);
    }
    
    const searchInput = document.getElementById('order-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterOrders);
    }
}

// טעינת רשימת ההזמנות
function loadOrders() {
    console.log('טוען הזמנות...');
    const ordersContainer = document.getElementById('orders-list');
    if (!ordersContainer) return;
    
    ordersContainer.innerHTML = '<tr><td colspan="6" class="text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">טוען...</span></div></td></tr>';
    
    fetch('/api/admin/orders')
        .then(response => {
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('אין הרשאה לצפייה בהזמנות');
                }
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(orders => {
            console.log('הזמנות נטענו:', orders);
            ordersContainer.innerHTML = '';
            
            if (!orders || orders.length === 0) {
                ordersContainer.innerHTML = '<tr><td colspan="6" class="text-center">אין הזמנות להצגה</td></tr>';
                return;
            }
            
            orders.forEach(order => {
                const row = document.createElement('tr');
                
                // קביעת צבע התג לפי סטטוס ההזמנה
                let statusClass;
                switch (order.status) {
                    case 'completed':
                        statusClass = 'badge-success';
                        break;
                    case 'pending':
                        statusClass = 'badge-warning';
                        break;
                    case 'cancelled':
                        statusClass = 'badge-danger';
                        break;
                    default:
                        statusClass = 'badge-secondary';
                }
                
                // תרגום סטטוס ההזמנה לעברית
                let statusText;
                switch (order.status) {
                    case 'completed':
                        statusText = 'הושלם';
                        break;
                    case 'pending':
                        statusText = 'ממתין לתשלום';
                        break;
                    case 'cancelled':
                        statusText = 'בוטל';
                        break;
                    default:
                        statusText = order.status;
                }
                
                row.innerHTML = `
                    <td>${order.orderNumber}</td>
                    <td>${new Date(order.date).toLocaleDateString()}</td>
                    <td>${order.customer}</td>
                    <td>${order.total.toFixed(2)}₪</td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="viewOrderDetails('${order.id}')">
                            <i class="fas fa-info-circle"></i> פרטים
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order.id}')">
                            <i class="fas fa-edit"></i> עדכן סטטוס
                        </button>
                    </td>
                `;
                ordersContainer.appendChild(row);
            });
        })
        .catch(error => {
            console.error('שגיאה בטעינת הזמנות:', error);
            ordersContainer.innerHTML = `<tr><td colspan="6" class="text-center text-danger">שגיאה בטעינת ההזמנות: ${error.message}</td></tr>`;
            
            // הצגת הזמנות לדוגמה במקרה של כישלון בטעינה מהשרת
            setTimeout(() => {
                try {
                    const dummyOrders = [
                        { id: '1', orderNumber: '1001', date: new Date(), customer: 'ישראל ישראלי', total: 350.00, status: 'completed' },
                        { id: '2', orderNumber: '1002', date: new Date(Date.now() - 86400000), customer: 'שרה כהן', total: 420.50, status: 'pending' },
                        { id: '3', orderNumber: '1003', date: new Date(Date.now() - 172800000), customer: 'יעקב לוי', total: 280.00, status: 'completed' },
                        { id: '4', orderNumber: '1004', date: new Date(Date.now() - 259200000), customer: 'רחל גולדברג', total: 510.25, status: 'cancelled' },
                        { id: '5', orderNumber: '1005', date: new Date(Date.now() - 345600000), customer: 'משה פרץ', total: 190.00, status: 'completed' }
                    ];
                    
                    alert('מציג הזמנות לדוגמה. התחבר לשרת לנתונים אמיתיים.');
                    
                    ordersContainer.innerHTML = '';
                    
                    dummyOrders.forEach(order => {
                        const row = document.createElement('tr');
                        
                        // קביעת צבע התג לפי סטטוס ההזמנה
                        let statusClass;
                        switch (order.status) {
                            case 'completed':
                                statusClass = 'badge-success';
                                break;
                            case 'pending':
                                statusClass = 'badge-warning';
                                break;
                            case 'cancelled':
                                statusClass = 'badge-danger';
                                break;
                            default:
                                statusClass = 'badge-secondary';
                        }
                        
                        // תרגום סטטוס ההזמנה לעברית
                        let statusText;
                        switch (order.status) {
                            case 'completed':
                                statusText = 'הושלם';
                                break;
                            case 'pending':
                                statusText = 'ממתין לתשלום';
                                break;
                            case 'cancelled':
                                statusText = 'בוטל';
                                break;
                            default:
                                statusText = order.status;
                        }
                        
                        row.innerHTML = `
                            <td>${order.orderNumber}</td>
                            <td>${new Date(order.date).toLocaleDateString()}</td>
                            <td>${order.customer}</td>
                            <td>${order.total.toFixed(2)}₪</td>
                            <td><span class="badge ${statusClass}">${statusText}</span></td>
                            <td>
                                <button class="btn btn-sm btn-info" onclick="viewOrderDetails('${order.id}')">
                                    <i class="fas fa-info-circle"></i> פרטים
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order.id}')">
                                    <i class="fas fa-edit"></i> עדכן סטטוס
                                </button>
                            </td>
                        `;
                        ordersContainer.appendChild(row);
                    });
                } catch (fallbackError) {
                    console.error('שגיאה בטעינת הזמנות לדוגמה:', fallbackError);
                }
            }, 500);
        });
}

// סינון הזמנות
function filterOrders() {
    const statusFilter = document.getElementById('order-filter-status').value;
    const sortOrder = document.getElementById('order-sort-order').value;
    const searchText = document.getElementById('order-search').value.toLowerCase();
    
    const rows = document.querySelectorAll('#orders-list tr');
    
    rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        if (columns.length < 5) return; // דלג על שורות שאינן מכילות נתונים
        
        const orderNumber = columns[0].textContent.toLowerCase();
        const customer = columns[2].textContent.toLowerCase();
        const statusElement = columns[4].querySelector('.badge');
        const status = statusElement ? statusElement.textContent : '';
        
        const matchesStatus = !statusFilter || 
                            (statusFilter === 'completed' && status.includes('הושלם')) ||
                            (statusFilter === 'pending' && status.includes('ממתין')) ||
                            (statusFilter === 'cancelled' && status.includes('בוטל'));
        
        const matchesSearch = !searchText || 
                            orderNumber.includes(searchText) || 
                            customer.includes(searchText);
        
        row.style.display = (matchesStatus && matchesSearch) ? '' : 'none';
    });
    
    // מיון הזמנות
    sortOrders(sortOrder);
}

// מיון הזמנות
function sortOrders(sortOrder) {
    const tbody = document.getElementById('orders-list');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // דלג על מיון אם אין שורות או אם יש שורה אחת בלבד
    if (rows.length <= 1) return;
    
    // מיון השורות לפי הקריטריון שנבחר
    rows.sort((a, b) => {
        const columns_a = a.querySelectorAll('td');
        const columns_b = b.querySelectorAll('td');
        
        if (columns_a.length < 4 || columns_b.length < 4) return 0;
        
        switch (sortOrder) {
            case 'date_desc':
                // מיון לפי תאריך מהחדש לישן
                const date_a = new Date(columns_a[1].textContent);
                const date_b = new Date(columns_b[1].textContent);
                return date_b - date_a;
            
            case 'date_asc':
                // מיון לפי תאריך מהישן לחדש
                const date_a2 = new Date(columns_a[1].textContent);
                const date_b2 = new Date(columns_b[1].textContent);
                return date_a2 - date_b2;
            
            case 'price_desc':
                // מיון לפי מחיר מהגבוה לנמוך
                const price_a = parseFloat(columns_a[3].textContent.replace('₪', '').replace(',', ''));
                const price_b = parseFloat(columns_b[3].textContent.replace('₪', '').replace(',', ''));
                return price_b - price_a;
            
            case 'price_asc':
                // מיון לפי מחיר מהנמוך לגבוה
                const price_a2 = parseFloat(columns_a[3].textContent.replace('₪', '').replace(',', ''));
                const price_b2 = parseFloat(columns_b[3].textContent.replace('₪', '').replace(',', ''));
                return price_a2 - price_b2;
            
            default:
                return 0;
        }
    });
    
    // הוספת השורות הממוינות חזרה לטבלה
    rows.forEach(row => tbody.appendChild(row));
}

// עדכון סטטוס הזמנה
function updateOrderStatus(orderId) {
    // פתיחת חלון דו-שיח לבחירת סטטוס חדש
    const newStatus = prompt('בחר סטטוס חדש (completed, pending, cancelled):');
    
    if (!newStatus) return; // המשתמש ביטל את הפעולה
    
    // וידוא שהסטטוס החדש הוא אחד מהערכים המותרים
    const validStatuses = ['completed', 'pending', 'cancelled'];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
        alert('סטטוס לא חוקי. הערכים המותרים: completed, pending, cancelled');
        return;
    }
    
    // שליחת בקשה לעדכון הסטטוס
    fetch(`/api/admin/order/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.toLowerCase() })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || 'סטטוס ההזמנה עודכן בהצלחה');
        loadOrders(); // טעינה מחדש של רשימת ההזמנות
    })
    .catch(error => {
        console.error('שגיאה בעדכון סטטוס ההזמנה:', error);
        alert('שגיאה בעדכון סטטוס ההזמנה: ' + error.message);
    });
}