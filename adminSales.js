// אתחול מודול ניתוח המכירות
document.addEventListener('DOMContentLoaded', function() {
    // אם הדף נטען, הוסף מאזינים לאירועים בחלק ניתוח המכירות
    if (document.getElementById('sales-section')) {
        setupSalesEventListeners();
        loadSalesData('month'); // טווח ברירת מחדל - חודש נוכחי
    }
});

// הגדרת מאזינים לאירועים בחלק ניתוח המכירות
function setupSalesEventListeners() {
    // מאזין לשינוי טווח תאריכים
    const dateRangeSelect = document.getElementById('date-range');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', handleDateRangeChange);
    }
    
    // מאזין לכפתור עדכון הנתונים
    const updateStatsBtn = document.getElementById('update-stats');
    if (updateStatsBtn) {
        updateStatsBtn.addEventListener('click', updateSalesStats);
    }
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
    
    // הצגת מחוון טעינה
    document.getElementById('total-sales').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('orders-count').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('average-order').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('top-attraction').innerHTML = '<div class="spinner-border text-light spinner-border-sm" role="status"><span class="sr-only">טוען...</span></div>';
    document.getElementById('recent-orders').innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">טוען...</span></div></td></tr>';
    
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
            // עדכון התצוגה עם הנתונים
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