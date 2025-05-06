// אתחול מודול ניתוח המכירות
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('sales-section')) {
        setupSalesEventListeners();
        analyzeExistingOrdersTable(); // קורא ישירות לפונקציה שמנתחת את הטבלה
    }
});

// הגדרת מאזינים לאירועים בחלק ניתוח המכירות
function setupSalesEventListeners() {
    const updateStatsBtn = document.getElementById('update-stats');
    if (updateStatsBtn) {
        updateStatsBtn.addEventListener('click', function() {
            analyzeExistingOrdersTable();
        });
    }
    
    const dateRangeSelect = document.getElementById('date-range');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            const range = dateRangeSelect.value;
            const customDateContainer = document.getElementById('custom-date-container');
            const customDateToContainer = document.getElementById('custom-date-to-container');
            
            if (range === 'custom') {
                customDateContainer.style.display = 'block';
                customDateToContainer.style.display = 'block';
            } else {
                customDateContainer.style.display = 'none';
                customDateToContainer.style.display = 'none';
                analyzeExistingOrdersTable();
            }
        });
    }
}

function analyzeExistingOrdersTable() {
    console.log('מנתח את טבלת ההזמנות הקיימת');
    
    // הצגת מחוון טעינה בכל המקומות הרלוונטיים
    showLoadingSpinners();
    
    // קבלת נתונים מטבלת ההזמנות הקיימת
    const orders = extractOrdersFromTable();
    
    // חישוב סטטיסטיקות
    const totalSales = calculateTotalSales(orders);
    const ordersCount = orders.length;
    const averageOrder = ordersCount > 0 ? totalSales / ordersCount : 0;
    
    // ניתוח מכירות לפי עיר
    const cityData = analyzeSalesByCity(orders);
    
    // ניתוח מכירות לפי אטרקציה
    const attractionData = analyzeSalesByAttraction(orders);
    
    // עדכון התצוגה
    updateDashboardStats(totalSales, ordersCount, averageOrder);
    
    // עדכון הגרפים
    updateChartsWithData(cityData, attractionData);
}

function showLoadingSpinners() {
    document.getElementById('total-sales').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('orders-count').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('average-order').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('top-attraction').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
}

// חילוץ נתוני הזמנות מהטבלה הקיימת
function extractOrdersFromTable() {
    const orders = [];
    const table = document.getElementById('recent-orders-table');
    
    if (!table) {
        console.error('טבלת הזמנות לא נמצאה');
        return orders;
    }
    
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            // חילוץ נתונים מהתאים
            const orderNumber = cells[0].textContent.trim();
            const orderDate = cells[1].textContent.trim();
            const customer = cells[2].textContent.trim();
            
            // חילוץ הסכום - הסרת סימן ₪ והמרה למספר
            let total = cells[3].textContent.trim();
            total = parseFloat(total.replace('₪', '').replace(',', ''));
            
            // שימוש בחלוקה רנדומלית כדי להגדיר עיר ואטרקציה לדוגמה
            const cities = ['תל אביב', 'ירושלים', 'חיפה', 'אילת', 'דובאי', 'פריז', 'לונדון', 'רומא'];
            const attractions = ['סיור במגדל אייפל', 'בורג\' ח\'ליפה', 'הקולוסאום', 'מוזיאון הלובר', 'ביג בן', 'כותל המערבי'];
            
            // בחירת עיר ואטרקציה באופן רנדומלי אבל עקבי עבור אותו מספר הזמנה
            const orderIndex = parseInt(orderNumber.replace(/\D/g, '')) % cities.length;
            const attractionIndex = parseInt(orderNumber.replace(/\D/g, '')) % attractions.length;
            
            // הוספת ההזמנה למערך
            orders.push({
                orderNumber,
                date: new Date(orderDate),
                customer,
                total,
                city: cities[orderIndex],
                attraction: attractions[attractionIndex]
            });
        }
    });
    
    return orders;
}

// חישוב סך המכירות
function calculateTotalSales(orders) {
    return orders.reduce((total, order) => total + order.total, 0);
}

// ניתוח מכירות לפי עיר
function analyzeSalesByCity(orders) {
    const citySales = {};
    
    orders.forEach(order => {
        if (!citySales[order.city]) {
            citySales[order.city] = 0;
        }
        
        citySales[order.city] += order.total;
    });
    
    // המרה למערך לגרף
    return Object.keys(citySales).map(city => ({
        label: city,
        value: citySales[city]
    })).sort((a, b) => b.value - a.value);
}

// ניתוח מכירות לפי אטרקציה
function analyzeSalesByAttraction(orders) {
    const attractionSales = {};
    
    orders.forEach(order => {
        if (!attractionSales[order.attraction]) {
            attractionSales[order.attraction] = 0;
        }
        
        attractionSales[order.attraction] += 1; // ספירת מספר פעמים שהאטרקציה נרכשה
    });
    
    // מציאת האטרקציה המובילה
    let topAttraction = '';
    let maxCount = 0;
    
    Object.keys(attractionSales).forEach(attraction => {
        if (attractionSales[attraction] > maxCount) {
            maxCount = attractionSales[attraction];
            topAttraction = attraction;
        }
    });
    
    // עדכון האטרקציה המובילה בדף
    document.getElementById('top-attraction').textContent = topAttraction;
    
    // המרה למערך לגרף
    return Object.keys(attractionSales).map(attraction => ({
        label: attraction,
        value: attractionSales[attraction]
    })).sort((a, b) => b.value - a.value);
}

function updateDashboardStats(totalSales, ordersCount, averageOrder) {
    document.getElementById('total-sales').textContent = totalSales.toFixed(2) + '₪';
    document.getElementById('orders-count').textContent = ordersCount;
    document.getElementById('average-order').textContent = averageOrder.toFixed(2) + '₪';
}

// עדכון הגרפים עם הנתונים
function updateChartsWithData(cityData, attractionData) {
    // עדכון גרף התפלגות מכירות לפי עיר
    updateCountriesChart(cityData);
    
    // עדכון גרף אטרקציות מובילות
    updateTopAttractionsChart(attractionData);
    
    // יצירת נתונים לגרף מכירות לפי תקופה (לדוגמה)
    const salesChartData = [
        { label: 'ינואר', value: 1200 },
        { label: 'פברואר', value: 1500 },
        { label: 'מרץ', value: 1800 },
        { label: 'אפריל', value: 1300 },
        { label: 'מאי', value: 2100 },
        { label: 'יוני', value: 2400 },
        { label: 'יולי', value: 2800 },
        { label: 'אוגוסט', value: 3100 },
        { label: 'ספטמבר', value: 1900 },
        { label: 'אוקטובר', value: 1600 },
        { label: 'נובמבר', value: 1400 },
        { label: 'דצמבר', value: 1100 }
    ];
    updateSalesChart(salesChartData);
    
    // יצירת נתונים לגרף קטגוריות (לדוגמה)
    const categoriesData = [
        { label: 'אטרקציות', value: 35 },
        { label: 'מוזיאונים', value: 25 },
        { label: 'סיורים', value: 22 },
        { label: 'פארקים', value: 18 }
    ];
    updateCategoriesChart(categoriesData);
}

// עדכון גרף המכירות לפי תקופה
function updateSalesChart(chartData) {
    const ctx = document.getElementById('sales-chart').getContext('2d');
    
    // מחיקת גרף קיים אם יש
    if (window.salesChart) {
        window.salesChart.destroy();
    }
    
    const labels = chartData.map(item => item.label);
    const values = chartData.map(item => item.value);
    
    window.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'מכירות (₪)',
                data: values,
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                pointBorderColor: '#fff',
                pointRadius: 5
            }]
        },
        options: {
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
        }
    });
}

// עדכון גרף התפלגות מכירות לפי עיר
function updateCountriesChart(chartData) {
    const ctx = document.getElementById('countries-chart').getContext('2d');
    
    // מחיקת גרף קיים אם יש
    if (window.countriesChart) {
        window.countriesChart.destroy();
    }
    
    const labels = chartData.map(item => item.label);
    const values = chartData.map(item => item.value);
    
    // צבעים לגרף
    const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
    ];
    
    window.countriesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'מכירות לפי עיר',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'right'
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const value = data.datasets[0].data[tooltipItem.index];
                        const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${data.labels[tooltipItem.index]}: ${percentage}% (${value.toFixed(2)}₪)`;
                    }
                }
            }
        }
    });
}

// עדכון גרף התפלגות מכירות לפי קטגוריה
function updateCategoriesChart(chartData) {
    const ctx = document.getElementById('categories-chart').getContext('2d');
    
    // מחיקת גרף קיים אם יש
    if (window.categoriesChart) {
        window.categoriesChart.destroy();
    }
    
    const labels = chartData.map(item => item.label);
    const values = chartData.map(item => item.value);
    
    // צבעים לגרף
    const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
    ];
    
    window.categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'מכירות לפי קטגוריה',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'right'
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const value = data.datasets[0].data[tooltipItem.index];
                        const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${data.labels[tooltipItem.index]}: ${percentage}% (${value})`;
                    }
                }
            }
        }
    });
}

// עדכון גרף האטרקציות המובילות
function updateTopAttractionsChart(chartData) {
    const ctx = document.getElementById('top-attractions-chart').getContext('2d');
    
    // מחיקת גרף קיים אם יש
    if (window.topAttractionsChart) {
        window.topAttractionsChart.destroy();
    }
    
    // מיון וחיתוך הנתונים ל-10 האטרקציות המובילות
    const sortedData = [...chartData].sort((a, b) => b.value - a.value).slice(0, 10);
    
    const labels = sortedData.map(item => item.label);
    const values = sortedData.map(item => item.value);
    
    window.topAttractionsChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                label: 'מספר מכירות',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return `מכירות: ${tooltipItem.xLabel}`;
                    }
                }
            }
        }
    });
}

// טיפול בשינוי טווח תאריכים
function handleDateRangeChange() {
    const range = document.getElementById('date-range').value;
    const customDateContainer = document.getElementById('custom-date-container');
    const customDateToContainer = document.getElementById('custom-date-to-container');
    
    if (range === 'custom') {
        customDateContainer.style.display = 'block';
        customDateToContainer.style.display = 'block';
    } else {
        customDateContainer.style.display = 'none';
        customDateToContainer.style.display = 'none';
        
        // טעינת נתונים אוטומטית בעת שינוי הטווח (למעט טווח מותאם אישית)
        loadSalesData(range);
    }
}

// עדכון סטטיסטיקות המכירות
function updateSalesStats() {
    const range = document.getElementById('date-range').value;
    
    if (range === 'custom') {
        const startDate = document.getElementById('date-from').value;
        const endDate = document.getElementById('date-to').value;
        
        if (!startDate || !endDate) {
            alert('יש לבחור תאריך התחלה ותאריך סיום');
            return;
        }
        
        loadSalesData(range, startDate, endDate);
    } else {
        loadSalesData(range);
    }
}

// טעינת נתוני המכירות
function loadSalesData(range, startDate, endDate) {
    console.log('טוען נתוני מכירות:', range, startDate, endDate);
    
    // הצגת מחוון טעינה בכל המקומות הרלוונטיים
    showLoadingSpinners();
    
    let url = `/api/admin/sales-stats?range=${range}`;
    
    if (range === 'custom') {
        url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('אין הרשאה לצפייה בנתוני מכירות');
                }
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('נתוני מכירות נטענו:', data);
            updateDashboardWithData(data);
        })
        .catch(error => {
            console.error('שגיאה בטעינת נתוני מכירות:', error);
            
            // במקרה של שגיאה, טען נתונים לדוגמה
            console.log('טוען נתוני מכירות לדוגמה במקום');
            setupDummySalesData();
            
            // הודעה למשתמש
            alert('שגיאה בטעינת נתוני המכירות: ' + error.message + '\nמציג נתונים לדוגמה במקום.');
        });
}

// הצגת מחווני טעינה בכל המקומות
function showLoadingSpinners() {
    document.getElementById('total-sales').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('orders-count').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('average-order').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('top-attraction').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('recent-orders').innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">טוען...</span></div></td></tr>';
}

// עדכון הדאשבורד עם הנתונים
function updateDashboardWithData(data) {
    // עדכון הסטטיסטיקות
    document.getElementById('total-sales').textContent = data.totalSales.toFixed(2) + '₪';
    document.getElementById('orders-count').textContent = data.ordersCount;
    document.getElementById('average-order').textContent = data.averageOrder.toFixed(2) + '₪';
    document.getElementById('top-attraction').textContent = data.topAttraction;
    
    // עדכון טבלת ההזמנות האחרונות
    updateRecentOrdersTable(data.recentOrders);
    
    // עדכון הגרפים
    updateSalesChart(data.chartData);
    updateCountriesChart(data.countriesData);
    updateCategoriesChart(data.categoriesData);
    updateTopAttractionsChart(data.topAttractionsData);
}

// עדכון חלונית סטטיסטיקת מכירות עם נתונים לדוגמה במקרה שהשרת לא מחזיר נתונים
function setupDummySalesData() {
    document.getElementById('total-sales').textContent = '15,240.00₪';
    document.getElementById('orders-count').textContent = '42';
    document.getElementById('average-order').textContent = '362.85₪';
    document.getElementById('top-attraction').textContent = 'סיור במגדל אייפל';
    
    // נתונים לדוגמה לגרף מכירות
    const salesChartData = [
        { label: 'ינואר', value: 1200 },
        { label: 'פברואר', value: 1500 },
        { label: 'מרץ', value: 1800 },
        { label: 'אפריל', value: 1300 },
        { label: 'מאי', value: 2100 },
        { label: 'יוני', value: 2400 },
        { label: 'יולי', value: 2800 },
        { label: 'אוגוסט', value: 3100 },
        { label: 'ספטמבר', value: 1900 },
        { label: 'אוקטובר', value: 1600 },
        { label: 'נובמבר', value: 1400 },
        { label: 'דצמבר', value: 1100 }
    ];
    
    updateSalesChart(salesChartData);
    
    // נתונים לדוגמה לגרף מכירות לפי מדינה
    const countriesData = [
        { label: 'דובאי', value: 42 },
        { label: 'פריז', value: 28 },
        { label: 'רומא', value: 18 },
        { label: 'לונדון', value: 12 }
    ];
    
    updateCountriesChart(countriesData);
    
    // נתונים לדוגמה לגרף מכירות לפי קטגוריה
    const categoriesData = [
        { label: 'אטרקציות', value: 35 },
        { label: 'מוזיאונים', value: 25 },
        { label: 'סיורים', value: 22 },
        { label: 'פארקים', value: 18 }
    ];
    
    updateCategoriesChart(categoriesData);
    
    // נתונים לדוגמה לגרף האטרקציות המובילות
    const topAttractionsData = [
        { label: 'מגדל אייפל', value: 18 },
        { label: 'בורג\' ח\'ליפה', value: 16 },
        { label: 'הקולוסאום', value: 14 },
        { label: 'מוזיאון הלובר', value: 12 },
        { label: 'עולם פרארי', value: 10 },
        { label: 'ביג בן', value: 8 },
        { label: 'סיור בוותיקן', value: 7 },
        { label: 'גן פארק גואל', value: 6 },
        { label: 'מצודת לונדון', value: 5 },
        { label: 'דיסנילנד פריז', value: 4 }
    ];
    
    updateTopAttractionsChart(topAttractionsData);
    
    // נתוני הזמנות אחרונות לדוגמה
    const dummyOrders = [
        { id: '1', orderNumber: '1001', date: new Date(), customer: 'ישראל ישראלי', total: 350.00 },
        { id: '2', orderNumber: '1002', date: new Date(Date.now() - 86400000), customer: 'שרה כהן', total: 420.50 },
        { id: '3', orderNumber: '1003', date: new Date(Date.now() - 172800000), customer: 'יעקב לוי', total: 280.00 },
        { id: '4', orderNumber: '1004', date: new Date(Date.now() - 259200000), customer: 'רחל גולדברג', total: 510.25 },
        { id: '5', orderNumber: '1005', date: new Date(Date.now() - 345600000), customer: 'משה פרץ', total: 190.00 }
    ];
    
    updateRecentOrdersTable(dummyOrders);
}

// עדכון טבלת ההזמנות האחרונות
function updateRecentOrdersTable(orders) {
    const tableBody = document.getElementById('recent-orders');
    tableBody.innerHTML = '';
    
    if (!orders || orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">אין הזמנות להצגה</td></tr>';
        return;
    }
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderNumber}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.customer}</td>
            <td>${order.total.toFixed(2)}₪</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-info-circle"></i> פרטים
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// פונקציה לצפייה בפרטי הזמנה
function viewOrderDetails(orderId) {
    console.log('צפייה בפרטי הזמנה:', orderId);
    
    // כאן יש להוסיף קוד לפתיחת חלון מודאלי עם פרטי ההזמנה
    // למשל:
    fetch(`/api/admin/orders/${orderId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(orderDetails => {
            showOrderDetailsModal(orderDetails);
        })
        .catch(error => {
            console.error('שגיאה בטעינת פרטי הזמנה:', error);
            alert('שגיאה בטעינת פרטי ההזמנה: ' + error.message);
        });
}

// פונקציה להצגת מודאל פרטי הזמנה
function showOrderDetailsModal(orderDetails) {
    // בדיקה אם המודאל קיים כבר
    let modal = document.getElementById('orderDetailsModal');
    
    // אם המודאל לא קיים, צור אותו
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'orderDetailsModal';
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'orderDetailsModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="orderDetailsModalLabel">פרטי הזמנה #<span id="modal-order-number"></span></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="סגור">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="order-details-content">
                        <!-- תוכן המודאל יוזן דינמית -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">סגור</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // עדכון תוכן המודאל
    document.getElementById('modal-order-number').textContent = orderDetails.orderNumber;
    
    const orderDetailsContent = document.getElementById('order-details-content');
    
    // בניית תצוגת פרטי הזמנה
    let detailsHTML = `
        <div class="row mb-3">
            <div class="col-md-6">
                <strong>לקוח:</strong> ${orderDetails.customer}<br>
                <strong>תאריך:</strong> ${new Date(orderDetails.date).toLocaleDateString()}<br>
                <strong>סטטוס:</strong> <span class="badge badge-${orderDetails.status === 'completed' ? 'success' : 'warning'}">${orderDetails.status === 'completed' ? 'הושלם' : 'בטיפול'}</span>
            </div>
            <div class="col-md-6 text-left">
                <strong>סה"כ:</strong> ${orderDetails.total.toFixed(2)}₪<br>
                <strong>אמצעי תשלום:</strong> ${orderDetails.paymentMethod}<br>
                <strong>מספר עסקה:</strong> ${orderDetails.transactionId || 'אין'}
            </div>
        </div>
        
        <h6>פריטים שהוזמנו:</h6>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>אטרקציה</th>
                    <th>תאריך</th>
                    <th>כמות</th>
                    <th>מחיר</th>
                    <th>סה"כ</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // הוספת פריטי ההזמנה לטבלה
    if (orderDetails.items && orderDetails.items.length > 0) {
        orderDetails.items.forEach(item => {
            detailsHTML += `
                <tr>
                    <td>${item.attractionName}</td>
                    <td>${item.date ? new Date(item.date).toLocaleDateString() : 'לא צוין'}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)}₪</td>
                    <td>${(item.price * item.quantity).toFixed(2)}₪</td>
                </tr>
            `;
        });
    } else {
        detailsHTML += '<tr><td colspan="5" class="text-center">אין פריטים להצגה</td></tr>';
    }
    
    detailsHTML += `
            </tbody>
        </table>
    `;
    
    // הוספת פרטי הערות אם יש
    if (orderDetails.notes) {
        detailsHTML += `
            <div class="mt-3">
                <h6>הערות:</h6>
                <div class="p-2 bg-light">${orderDetails.notes}</div>
            </div>
        `;
    }
    
    orderDetailsContent.innerHTML = detailsHTML;
    
    // הצגת המודאל
    $(modal).modal('show');
}

// עדכון גרף המכירות
function updateSalesChart(chartData) {
    const ctx = document.getElementById('sales-chart').getContext('2d');
    
    // מחיקת גרף קיים אם יש
    if (window.salesChart) {
        window.salesChart.destroy();
    }
    
    const labels = chartData.map(item => item.label);
    const values = chartData.map(item => item.value);
    
    window.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'מכירות (₪)',
                data: values,
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                pointBorderColor: '#fff',
                pointRadius: 5
            }]
        },
        options: {
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
        }
    });
}

// עדכון גרף התפלגות המכירות לפי מדינה
function updateCountriesChart(chartData) {
    const ctx = document.getElementById('countries-chart').getContext('2d');
    
    // מחיקת גרף קיים אם יש
    if (window.countriesChart) {
        window.countriesChart.destroy();
    }
    
    const labels = chartData.map(item => item.label);
    const values = chartData.map(item => item.value);
    
    // צבעים לגרף
    const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
    ];
    
    window.countriesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'מכירות לפי מדינה',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'right'
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const value = data.datasets[0].data[tooltipItem.index];
                        const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${data.labels[tooltipItem.index]}: ${percentage}% (${value})`;
                    }
                }
            }
        }
    });
}

// עדכון גרף התפלגות המכירות לפי קטגוריה
function updateCategoriesChart(chartData) {
    const ctx = document.getElementById('categories-chart').getContext('2d');
    
    // מחיקת גרף קיים אם יש
    if (window.categoriesChart) {
        window.categoriesChart.destroy();
    }
    
    const labels = chartData.map(item => item.label);
    const values = chartData.map(item => item.value);
    
    // צבעים לגרף
    const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
    ];
    
    window.categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'מכירות לפי קטגוריה',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'right'
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const value = data.datasets[0].data[tooltipItem.index];
                        const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${data.labels[tooltipItem.index]}: ${percentage}% (${value})`;
                    }
                }
            }
        }
    });
}

// עדכון גרף האטרקציות המובילות
function updateTopAttractionsChart(chartData) {
    const ctx = document.getElementById('top-attractions-chart').getContext('2d');
    
    // מחיקת גרף קיים אם יש
    if (window.topAttractionsChart) {
        window.topAttractionsChart.destroy();
    }
    
    // מיון וחיתוך הנתונים ל-10 האטרקציות המובילות
    const sortedData = [...chartData].sort((a, b) => b.value - a.value).slice(0, 10);
    
    const labels = sortedData.map(item => item.label);
    const values = sortedData.map(item => item.value);
    
    window.topAttractionsChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                label: 'מספר מכירות',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return `מכירות: ${tooltipItem.xLabel}`;
                    }
                }
            }
        }
    });
}