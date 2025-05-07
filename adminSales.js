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
            document.getElementById('top-attraction').textContent = data.topAttraction || 'לא קיימת';

            // עדכון טבלת הזמנות אחרונות
            updateRecentOrdersTable(data.recentOrders || []);
            
            // עדכון גרפים
            updateSalesChart(data.chartData || []);
            updateCountriesChart(data.countriesData || []);
            updateCategoriesChart(data.categoriesData || []);
            updateTopAttractionsChart(data.topAttractionsData || []);
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
    if (topAttractionsChart) {
        topAttractionsChart.destroy();
    }
    topAttractionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.map(d => d.label),
            datasets: [{
                label: 'מכירות',
                data: chartData.map(d => d.value),
                backgroundColor: 'rgba(255, 193, 7, 0.7)',
                borderColor: 'rgba(255, 193, 7, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true }
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

