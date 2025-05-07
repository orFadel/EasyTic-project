// אתחול מודול ניהול האטרקציות
document.addEventListener('DOMContentLoaded', function() {
    // אם הדף נטען, הוסף מאזינים לאירועים בחלק ניהול האטרקציות
    if (document.getElementById('attractions-section')) {
        setupAttractionsEventListeners();
        loadAttractions();
    }
});

// הגדרת מאזינים לאירועים בחלק ניהול האטרקציות
function setupAttractionsEventListeners() {
    // מאזין לטופס הוספת/עריכת אטרקציה
    const attractionForm = document.getElementById('attraction-form');
    if (attractionForm) {
        attractionForm.addEventListener('submit', saveAttraction);
    }
    
    // מאזינים לסינון אטרקציות
    const countryFilter = document.getElementById('attraction-filter-country');
    if (countryFilter) {
        countryFilter.addEventListener('change', filterAttractions);
    }
    
    const categoryFilter = document.getElementById('attraction-filter-category');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAttractions);
    }
    
    const searchInput = document.getElementById('attraction-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterAttractions);
    }
}

// טעינת רשימת האטרקציות
function loadAttractions() {
    console.log('🔄 טוען אטרקציות מהשרת...');

    const tableBody = document.getElementById('attractions-list');
    if (!tableBody) return;

    // Spinner זמני
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">טוען...</span>
                </div>
            </td>
        </tr>
    `;

    // קריאה לשרת
    fetch('/get-attractions')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(attractions => {
            console.log('✅ DEBUG - attractions from server:', attractions);
            tableBody.innerHTML = '';

            if (!attractions || attractions.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">אין אטרקציות להצגה</td></tr>';
                return;
            }

            // מיפוי תרגומים
            const categoryMap = {
                'park': 'פארקים וגנים',
                'tour': 'סיורים',
                'museum': 'מוזיאונים',
                'tower': 'מגדלים ותצפיות'
            };

            const countryMap = {
                'dubai': 'דובאי',
                'paris': 'פריז',
                'rome': 'רומא',
                'london': 'לונדון'
            };

            // יצירת שורות בטבלה
            attractions.forEach(attraction => {
                const name = attraction.attractionName || attraction.name || '-';
                const rawCountry = attraction.contry || attraction.country || attraction.city || '';
                const country = countryMap[rawCountry.toLowerCase()] || rawCountry || '-';
                const category = categoryMap[attraction.category] || attraction.category || '-';
                const price = Array.isArray(attraction.ticketTypes) && attraction.ticketTypes.length > 0
                    ? Number(attraction.ticketTypes[0].price).toFixed(2) + '₪'
                    : (attraction.price ? Number(attraction.price).toFixed(2) + '₪' : '-');

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${name}</td>
                    <td>${country}</td>
                    <td>${category}</td>
                    <td>${price}</td>
                    <td>
                        <button class="btn btn-sm btn-info edit-btn" onclick="showEditAttractionForm('${attraction._id}')">
                            <i class="fas fa-edit"></i> ערוך
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" onclick="deleteAttraction('${attraction._id}')">
                            <i class="fas fa-trash"></i> מחק
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('❌ שגיאה בטעינת אטרקציות:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">שגיאה בטעינת האטרקציות: ${error.message}</td></tr>`;
        });
}

// סינון אטרקציות לפי מדינה, קטגוריה וחיפוש
function filterAttractions() {
    const countryFilter = document.getElementById('attraction-filter-country').value;
    const categoryFilter = document.getElementById('attraction-filter-category').value;
    const searchText = document.getElementById('attraction-search').value.toLowerCase();
    
    const rows = document.querySelectorAll('#attractions-list tr');
    
    rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        if (columns.length < 3) return; // דלג על שורות שאינן מכילות נתונים
        
        const name = columns[0].textContent.toLowerCase();
        const country = columns[1].textContent;
        const category = columns[2].textContent;
        
        const matchesCountry = !countryFilter || country.includes(countryFilter === 'dubai' ? 'דובאי' : 
                                                                countryFilter === 'paris' ? 'פריז' : 
                                                                countryFilter === 'rome' ? 'רומא' : 
                                                                countryFilter === 'london' ? 'לונדון' : '');
        const matchesCategory = !categoryFilter || category.includes(categoryFilter === 'park' ? 'פארקים' : 
                                                                   categoryFilter === 'tour' ? 'סיורים' : 
                                                                   categoryFilter === 'museum' ? 'מוזיאונים' : 
                                                                   categoryFilter === 'tower' ? 'מגדלים' : '');
        const matchesSearch = !searchText || name.includes(searchText);
        
        row.style.display = (matchesCountry && matchesCategory && matchesSearch) ? '' : 'none';
    });
}

// הצגת טופס הוספת אטרקציה חדשה
function showAddAttractionForm() {
    document.getElementById('form-title').textContent = 'הוספת אטרקציה חדשה';
    document.getElementById('attraction-form').reset();
    document.getElementById('attraction-form').dataset.mode = 'add';
    document.getElementById('attraction-form-container').style.display = 'block';
}

// הסתרת טופס האטרקציה
function hideAttractionForm() {
    document.getElementById('attraction-form-container').style.display = 'none';
}

// הצגת טופס עריכת אטרקציה קיימת
function showEditAttractionForm(attractionId) {
    fetch(`/api/attraction/${attractionId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('שגיאה בטעינת פרטי האטרקציה');
            }
            return response.json();
        })
        .then(attraction => {
            document.getElementById('form-title').textContent = 'עריכת אטרקציה';
            
            const form = document.getElementById('attraction-form');
            form.dataset.mode = 'edit';
            form.dataset.attractionId = attractionId;
            
            document.getElementById('attraction-name').value = attraction.name;
            document.getElementById('attraction-country').value = attraction.contry;
            document.getElementById('attraction-category').value = attraction.category;
            document.getElementById('attraction-price').value = attraction.price;
            document.getElementById('attraction-description').value = attraction.description;
            document.getElementById('attraction-image').value = attraction.image;
            
            if (attraction.openingHours) {
                document.getElementById('attraction-opening-hours').value = attraction.openingHours;
            }
            
            if (attraction.duration) {
                document.getElementById('attraction-duration').value = attraction.duration;
            }
            
            if (attraction.accessibility) {
                document.getElementById('attraction-accessibility').checked = attraction.accessibility;
            }
            
            document.getElementById('attraction-form-container').style.display = 'block';
        })
        .catch(error => {
            console.error('שגיאה בטעינת פרטי האטרקציה:', error);
            alert('שגיאה בטעינת פרטי האטרקציה: ' + error.message);
        });
}

// שמירת אטרקציה חדשה או עדכון אטרקציה קיימת
function saveAttraction(event) {
    event.preventDefault();

    const form = document.getElementById('attraction-form');
    const mode = form.dataset.mode;

    const attractionData = {
        name: document.getElementById('attraction-name').value,
        contry: document.getElementById('attraction-country').value,
        category: document.getElementById('attraction-category').value,
        price: parseFloat(document.getElementById('attraction-price').value),
        description: document.getElementById('attraction-description').value,
        image: document.getElementById('attraction-image').value,
        openingHours: document.getElementById('attraction-opening-hours').value,
        duration: document.getElementById('attraction-duration').value,
        accessibility: document.getElementById('attraction-accessibility').checked
    };

    let url = '/add-attraction';  
    let method = 'POST';

    if (mode === 'edit') {
        url = `/api/attraction/${form.dataset.attractionId}`;
        method = 'PUT';
    }

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attractionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('שגיאה בשמירת האטרקציה');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || 'האטרקציה נשמרה בהצלחה ✅');
        hideAttractionForm();
        loadAttractions();
    })
    .catch(error => {
        console.error('שגיאה בשמירת האטרקציה:', error);
        alert('שגיאה בשמירת האטרקציה: ' + error.message);
    });
}

// מחיקת אטרקציה
function deleteAttraction(attractionId) {
    if (!confirm('האם אתה בטוח שברצונך למחוק את האטרקציה?')) return;
    
    fetch(`/api/attraction/${attractionId}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || 'האטרקציה נמחקה בהצלחה');
        loadAttractions();
    })
    .catch(error => {
        console.error('שגיאה במחיקת האטרקציה:', error);
        alert('שגיאה במחיקת האטרקציה: ' + error.message);
    });
}
