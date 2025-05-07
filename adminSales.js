document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('sales-section')) {
        setupSalesEventListeners();
        loadSalesData('month'); // טווח ברירת מחדל
    }
});

// יצירת מאזינים לאירועים בלוח הבקרה של סטטיסטיקות המכירות
function setupSalesEventListeners() {
    const dateRangeSelect = document.getElementById('date-range');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', handleDateRangeChange);
    }

    const updateStatsBtn = document.getElementById('update-stats');
    if (updateStatsBtn) {
        updateStatsBtn.addEventListener('click', updateSalesStats);
    }
}

// טיפול בשינוי טווח תאריכים שנבחר בתפריט
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
        loadSalesData(range);
    }
}

// שליחת בקשה לטעינת נתונים לפי טווח תאריכים
function updateSalesStats() {
    const range = document.getElementById('date-range').value;

    if (range === 'custom') {
        const startDate = document.getElementById('date-from').value;
        const endDate = document.getElementById('date-to').value;

        if (!startDate || !endDate) {
            alert('יש לבחור תאריך התחלה וסיום');
            return;
        }

        loadSalesData(range, startDate, endDate);
    } else {
        loadSalesData(range);
    }
}

// בקשה לשרת לטעינת נתוני המכירות והצגתם בדף
function loadSalesData(range, startDate, endDate) {
    document.getElementById('total-sales').innerHTML = spinner();
    document.getElementById('orders-count').innerHTML = spinner();
    document.getElementById('average-order').innerHTML = spinner();
    document.getElementById('top-attraction').innerHTML = spinner();
    document.getElementById('recent-orders').innerHTML = '<tr><td colspan="5" class="text-center">' + spinner('primary') + '</td></tr>';

    let url = `/api/admin/sales-stats?range=${range}`;
    if (range === 'custom') {
        url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(res.status === 403 ? 'אין הרשאה לצפייה בנתוני מכירות' : `HTTP error ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            document.getElementById('total-sales').textContent = data.totalSales.toFixed(2) + '₪';
            document.getElementById('orders-count').textContent = data.ordersCount;
            document.getElementById('average-order').textContent = data.averageOrder.toFixed(2) + '₪';
            
            // חישוב האטרקציות המובילות מתוך נתוני ההזמנות
            const topAttractionsData = updateTopAttractionsExtended(data.orders || []);
            
            // עדכון האטרקציה המובילה ישירות מנתוני הגרף
            if (topAttractionsData && topAttractionsData.length > 0) {
                document.getElementById('top-attraction').textContent = topAttractionsData[0].label;
            } else {
                document.getElementById('top-attraction').textContent = 'מגדל אייפל';  // ברירת מחדל אם אין נתונים
            }
            
            // עדכון נתונים אחרים
            updateTopAttractionsChart(topAttractionsData);
            updateRecentOrdersTable(data.recentOrders || []);
            updateSalesChart(data.chartData || []);
            updateCountriesChart(data.countriesData || []);
            updateCategoriesChart(data.categoriesData || []);
        })
        .catch(err => {
            console.error('שגיאה:', err);
            alert('שגיאה בטעינת נתונים. מציג נתונים לדוגמה');
            setupDummySalesData();
        });
}

// מחזיר HTML של מחוון טעינה מותאם לצבע שנבחר
function spinner(color = 'light') {
    return `<div class="spinner-border text-${color} spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>`;
}

// פונקציה לעדכון טבלת הזמנות אחרונות במסך
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
            <td><button class="btn btn-sm btn-info" onclick="viewOrderDetails('${order.id}')"><i class="fas fa-info-circle"></i> פרטים</button></td>
        `;
        tableBody.appendChild(row);
    });
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

let salesChart; // משתנה גלובלי לגרף
//גרף מכירות לפי תקופה 
function updateSalesChart(chartData) {
    const ctx = document.getElementById('sales-chart').getContext('2d');
    if (salesChart) {
        salesChart.destroy();
    }
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.map(d => d.label),
            datasets: [{
                label: 'מכירות (₪)',
                data: chartData.map(d => d.value),
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

let countriesChart;
//גרף מכירות לפי מדינה 
function updateCountriesChart(chartData) {
    const ctx = document.getElementById('countries-chart').getContext('2d');
    if (countriesChart) {
        countriesChart.destroy();
    }
    countriesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartData.map(d => d.label),
            datasets: [{
                data: chartData.map(d => d.value),
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

let categoriesChart;
//גרף מכירות לפי קטגוריה 
function updateCategoriesChart(chartData) {
    const ctx = document.getElementById('categories-chart').getContext('2d');
    if (categoriesChart) {
        categoriesChart.destroy();
    }
    categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.map(d => d.label),
            datasets: [{
                data: chartData.map(d => d.value),
                backgroundColor: ['#6f42c1', '#fd7e14', '#20c997', '#e83e8c']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

let topAttractionsChart;
//גרף 10 האטרקציות המובילות
function updateTopAttractionsChart(chartData) {
    const ctx = document.getElementById('top-attractions-chart').getContext('2d');
    
    // בדיקה אם יש נתונים
    if (!chartData || chartData.length === 0) {
        console.warn('אין נתונים להצגה בגרף האטרקציות המובילות');
        
        // יצירת נתוני דוגמה במקרה שאין נתונים
        chartData = [
            { label: 'מגדל אייפל', value: 18 },
            { label: 'בורג\' ח\'ליפה', value: 16 },
            { label: 'הקולוסאום', value: 14 },
            { label: 'מוזיאון הלובר', value: 12 },
            { label: 'עולם פרארי', value: 10 }
        ];
    }
    
    // הוספת לוג לבדיקה
    console.log('נתוני גרף אטרקציות:', chartData);
    
    // ניקוי גרף קודם אם קיים
    if (topAttractionsChart) {
        topAttractionsChart.destroy();
    }
    
    // הגדרת סולם ערכים מותאם
    const maxValue = Math.max(...chartData.map(d => d.value)) * 1.1; // 110% מהערך המקסימלי
    
    topAttractionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.map(d => d.label),
            datasets: [{
                label: 'מספר הזמנות',
                data: chartData.map(d => d.value),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)',
                    'rgba(83, 102, 255, 0.7)',
                    'rgba(40, 159, 64, 0.7)',
                    'rgba(210, 199, 199, 0.7)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)',
                    'rgb(199, 199, 199)',
                    'rgb(83, 102, 255)',
                    'rgb(40, 159, 64)',
                    'rgb(210, 199, 199)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // גרף אופקי
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { 
                    beginAtZero: true,
                    max: maxValue // קובע את הערך המקסימלי של הסולם
                }
            }
        }
    });
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
        const date = order.date ? new Date(order.date) : new Date();
        row.innerHTML = `
            <td>${order.orderNumber}</td>
            <td>${date.toLocaleDateString('he-IL')}</td>
            <td>${order.customer || 'אורח'}</td>
            <td>${(order.total || 0).toFixed(2)}₪</td>
            <td><button class="btn btn-sm btn-info" onclick="viewOrderDetails('${order.id}')"><i class="fas fa-info-circle"></i> פרטים</button></td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * פונקציה לחישוב ועדכון 10 האטרקציות המובילות לפי ניתוח נתוני הזמנות
 * @param {Array} orders - מערך של הזמנות למיון וניתוח
 * @returns {Array} מערך מסודר של 10 האטרקציות המובילות
 */
function updateTopAttractions(orders) {
    // מבנה נתונים לספירת הזמנות לכל אטרקציה
    const attractionCount = {};
    
    // עוברים על כל ההזמנות
    orders.forEach(order => {
        // בהנחה שלכל הזמנה יש מערך של פריטים (אטרקציות)
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const attractionName = item.attraction;
                
                // אם האטרקציה כבר קיימת במבנה הנתונים, נעדכן את הספירה
                if (attractionCount[attractionName]) {
                    attractionCount[attractionName]++;
                } else {
                    // אם האטרקציה חדשה, נוסיף אותה למבנה הנתונים
                    attractionCount[attractionName] = 1;
                }
            });
        }
    });
    
    // המרת מבנה הנתונים למערך לצורך מיון
    const attractionsArray = Object.keys(attractionCount).map(attraction => {
        return {
            label: attraction,
            value: attractionCount[attraction]
        };
    });
    
    // מיון האטרקציות לפי מספר ההזמנות בסדר יורד
    attractionsArray.sort((a, b) => b.value - a.value);
    
    // לקיחת 10 האטרקציות המובילות (או פחות אם אין 10)
    const topAttractions = attractionsArray.slice(0, 10);
    
    // עדכון הגרף
    updateTopAttractionsChart(topAttractions);
    
    // עדכון התצוגה של האטרקציה המובילה
    if (topAttractions.length > 0) {
        document.getElementById('top-attraction').textContent = topAttractions[0].label;
    } else {
        document.getElementById('top-attraction').textContent = 'לא קיימת';
    }
    
    return topAttractions;
}

/**
 * הפונקציה משופרת למקרה שבו מבנה ההזמנות שונה מהמצופה
 * @param {Array} orders - מערך של הזמנות עם מבנה שונה
 * @returns {Array} מערך מסודר של 10 האטרקציות המובילות
 */
function updateTopAttractionsExtended(orders) {
    // אם orders הוא ריק או undefined נחזיר מערך ריק
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
        console.warn('לא התקבלו נתוני הזמנות לניתוח אטרקציות מובילות');
        return [];
    }

    console.log('מספר ההזמנות שהתקבלו:', orders.length);
    
    // מבנה נתונים לספירת הזמנות לכל אטרקציה
    const attractionCount = {};
    
    try {
        // בדיקה של מבנה ההזמנות
        orders.forEach(order => {
            // רישום מבנה ההזמנה לצורך דיבוג
            console.log('מבנה הזמנה:', Object.keys(order));
            
            // אם יש שדה attractions ישירות בהזמנה
            if (order.attractions && Array.isArray(order.attractions)) {
                order.attractions.forEach(attraction => {
                    const attractionName = typeof attraction === 'string' ? attraction : 
                                          (attraction.name || 'אטרקציה לא ידועה');
                    
                    if (attractionCount[attractionName]) {
                        attractionCount[attractionName]++;
                    } else {
                        attractionCount[attractionName] = 1;
                    }
                });
            } 
            // אם יש שדה items שמכיל אטרקציות
            else if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    // בדיקה האם האיבר הוא מחרוזת או אובייקט
                    const attractionName = typeof item === 'string' ? item : 
                                         (item.attraction ? item.attraction : 
                                         (item.name ? item.name : 
                                         (item.title ? item.title : 'פריט לא ידוע')));
                    
                    if (attractionName && attractionName !== 'פריט לא ידוע') {
                        if (attractionCount[attractionName]) {
                            attractionCount[attractionName]++;
                        } else {
                            attractionCount[attractionName] = 1;
                        }
                    }
                });
            }
            // אם יש שדה attraction בודד בהזמנה
            else if (order.attraction) {
                const attractionName = order.attraction;
                
                if (attractionCount[attractionName]) {
                    attractionCount[attractionName]++;
                } else {
                    attractionCount[attractionName] = 1;
                }
            }
            // אם אין מבנה מוכר, ננסה לחפש שדות שיכולים להכיל את שם האטרקציה
            else if (order.title || order.productName || order.eventName) {
                const attractionName = order.title || order.productName || order.eventName;
                
                if (attractionCount[attractionName]) {
                    attractionCount[attractionName]++;
                } else {
                    attractionCount[attractionName] = 1;
                }
            }
        });
        
        // רישום הספירה הסופית לצורך דיבוג
        console.log('ספירת אטרקציות:', attractionCount);
        
        // המרה למערך ומיון
        const attractionsArray = Object.keys(attractionCount).map(attraction => {
            return {
                label: attraction,
                value: attractionCount[attraction]
            };
        });
        
        // מיון בסדר יורד
        attractionsArray.sort((a, b) => b.value - a.value);
        
        // לקיחת 10 הראשונים
        const topAttractions = attractionsArray.slice(0, 10);
        
        // עדכון התצוגה של האטרקציה המובילה
        if (topAttractions.length > 0) {
            document.getElementById('top-attraction').textContent = topAttractions[0].label;
        } else {
            document.getElementById('top-attraction').textContent = 'לא קיימת';
        }
        
        console.log('10 האטרקציות המובילות:', topAttractions);
        
        return topAttractions;
    } catch (error) {
        console.error('שגיאה בחישוב האטרקציות המובילות:', error);
        return [];
    }
}

/**
 * דוגמה לפונקציה להתאמה לתבנית API נתונים אחרת
 * @param {Object} data - נתוני API משרת בפורמט שונה
 * @returns {Array} מערך מסודר של 10 האטרקציות המובילות
 */
function processOrdersData(data) {
    let orders = [];
    
    // בדיקה לפי מבנה הנתונים מהשרת
    if (data.orders) {
        orders = data.orders;
    } else if (data.sales && data.sales.orders) {
        orders = data.sales.orders;
    } else if (Array.isArray(data)) {
        orders = data;
    }
    
    return updateTopAttractionsExtended(orders);
}

