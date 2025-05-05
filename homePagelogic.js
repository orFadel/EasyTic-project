// קובץ homePagelogic.js - גרסה מתוקנת ומאוחדת

document.addEventListener('DOMContentLoaded', function() {
  console.log('דף נטען, בודק סטטוס התחברות...');
  
  // קריאה לפונקציה שבודקת את מצב ההתחברות של המשתמש
  checkUserLogin();
  
  // הוספת האזנה לכפתור ההתנתקות
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      logoutUser();
    });
  }
  
  // בדיקה אם המשתמש מחובר לפני טעינת אטרקציות מומלצות
  loadRecommendedAttractions();
});

/**
 * טעינת אטרקציות מומלצות רק אם המשתמש מחובר
 */
function loadRecommendedAttractions() {
  // בדיקה יותר מקיפה אם המשתמש מחובר
  const isLoggedIn = checkIfUserIsLoggedIn();
  
  console.log('מצב התחברות משתמש:', isLoggedIn ? 'מחובר' : 'לא מחובר');
  
  // בדיקת אלמנט הכותרת
  const recommendedTitle = document.getElementById("recommended-attractions-title");
  
  if (isLoggedIn) {
    console.log('טוען אטרקציות מומלצות למשתמש מחובר');
    
    // הקוד המקורי לטעינת אטרקציות מומלצות ימשיך רק אם המשתמש מחובר
    loadUserRecommendations();
  } else {
    console.log('משתמש לא מחובר, לא טוען אטרקציות מומלצות אישיות');
    
    // הסתרת הכותרת של אטרקציות מומלצות אם המשתמש לא מחובר
    if (recommendedTitle) {
      recommendedTitle.style.display = 'none';
      console.log('הכותרת "אטרקציות מומלצות בשבילך" מוסתרת');
    }
    
    // ניקוי הקונטיינר של האטרקציות המומלצות
    const container = document.getElementById("dynamic-gallery");
    if (container) {
      container.innerHTML = "";
    }
  }
}

/**
 * בדיקה מקיפה אם המשתמש מחובר
 * @returns {boolean} האם המשתמש מחובר או לא
 */
function checkIfUserIsLoggedIn() {
  // בדיקת מזהה משתמש ב-localStorage
  const userId = localStorage.getItem('usrId');
  
  // בדיקת פרטי משתמש ב-localStorage
  let userInfo = null;
  try {
    const userInfoStr = localStorage.getItem('userInfo');
    userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (e) {
    console.error('שגיאה בפענוח userInfo מ-localStorage:', e);
  }
  
  // בדיקה אם יש מידע ב-session/localStorage הישן
  const username = sessionStorage.getItem('username');
  const displayName = sessionStorage.getItem('displayName') || localStorage.getItem('displayName');
  const sessionUserId = sessionStorage.getItem('userId');
  
  console.log('בדיקת התחברות:', { 
    userId, 
    'userInfo exists': !!userInfo, 
    username, 
    displayName, 
    sessionUserId 
  });
  
  // בדיקה שהמזהה קיים וגם שהוא לא ריק
  const hasUserId = userId && userId.trim() !== '';
  
  // וידוא שאם יש userInfo, הוא מכיל מידע ולא ריק
  const hasUserInfo = userInfo && userInfo.userId;
  
  // החזרת תוצאת הבדיקה - האם המשתמש מחובר לפי לפחות אחד מהנתונים
  return !!(hasUserId || hasUserInfo || username || displayName || sessionUserId);
}

/**
 * פונקציה לטעינת ההמלצות של המשתמש המחובר
 */
function loadUserRecommendations() {
  const userId = localStorage.getItem("usrId");
  if (!userId) {
    console.error('אין מזהה משתמש בזיכרון המקומי');
    return;
  }
  
  console.log('טוען המלצות עבור משתמש:', userId);
  
  fetchUserRecommendations(userId);
}

/**
 * פונקציית עזר לשליפת המלצות המשתמש מהשרת
 */
async function fetchUserRecommendations(userId) {
  try {
    const responseSearches = await fetch("http://localhost:2001/user-recent-searches/"+userId);
    
    if (!responseSearches.ok) {
      throw new Error(`Server returned ${responseSearches.status}: ${responseSearches.statusText}`);
    }
    
    // מערך של האטרקציות הרנדומליות
    const attractionsId = await responseSearches.json();
    var responseAttractions = [];
    
    // מעבר על ה-ids וארגון האטרקציות במערך json
    for (const id of attractionsId) {
      try {
        const response = await fetch(`http://localhost:2001/api/attraction-productId/`+id);
        if (!response.ok) {
          console.warn(`Error fetching attraction with id ${id}`);
          continue;
        }
        const data = await response.json();
        responseAttractions.push(data);
      } catch (error) {
        console.error(`Failed to fetch attraction ${id}:`, error.message);
      }
    }
    
    // עדכון התצוגה עם האטרקציות שהתקבלו
    updateAttractionsDisplay(responseAttractions);
  } catch (error) {
    console.error('שגיאה בשליפת המלצות המשתמש:', error);
  }
}

/**
 * פונקציית עזר לעדכון תצוגת האטרקציות המומלצות
 */
function updateAttractionsDisplay(attractions) {
  const container = document.getElementById("dynamic-gallery");
  if (!container) {
    console.error('לא נמצא קונטיינר להצגת אטרקציות מומלצות');
    return;
  }

  // מנקה תוכן קודם
  container.innerHTML = ""; 
  
  // ניקוי קונטיינר הקנבס
  const canvasContainer = document.getElementById("ticketsB");
  if (canvasContainer) {
    canvasContainer.innerHTML = "";
  }
  
  // בדיקה אם יש אטרקציות להצגה
  if (attractions && attractions.length > 0) {
    // הצגת הכותרת אם יש אטרקציות
    const recommendedTitle = document.getElementById("recommended-attractions-title");
    if (recommendedTitle) {
      recommendedTitle.style.display = 'block'; // מוציא את הכותרת מהסתרה
      console.log('הכותרת "אטרקציות מומלצות בשבילך" מוצגת');
    }
    
    // מציג את האטרקציות הרנדומליות ב-html
    attractions.forEach(attraction => {
      const attractionID = attraction.productId;
      const card = document.createElement("button");
      card.className = "dynamic-ticket";
      card.setAttribute("data-id", attractionID);
      card.setAttribute("onclick", "showCanvas("+attractionID+")");
      card.innerHTML = `
        <div class="image-container">
          <img id="dynamicImage" src="${attraction.mainImage}">
        </div>
        <div class="content">
          <div class="title">${attraction.attractionName}</div>
          <div class="subtitle">${attraction.category}</div>
          <div class="bottom-ticket">
            <a href="#" class="button">בחרו אפשרות</a>
            <div class="product-number">מוצר מס: <b>${attraction.productId}</b></div>
          </div>
        </div>
      `;
      container.appendChild(card);
      
      // יצירת קנבס עבור האטרקציה
      createAttractionCanvas(attraction, canvasContainer);
    });
  } else {
    // אם אין אטרקציות, הסתר את הכותרת
    const recommendedTitle = document.getElementById("recommended-attractions-title");
    if (recommendedTitle) {
      recommendedTitle.style.display = 'none';
      console.log('אין אטרקציות להצגה, הכותרת מוסתרת');
    }
  }
}

/**
 * פונקציית עזר ליצירת קנבס עבור אטרקציה
 */
function createAttractionCanvas(attraction, container) {
  if (!container) return;
  
  const attractionID = attraction.productId;
  const canvas = document.createElement("div");
  
  canvas.innerHTML = `<div class="offcanvas offcanvas-start" tabindex="-1" data-bs-backdrop="true" data-bs-scroll="false" id="${attractionID}">
    <div class="offcanvas-header">
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" onclick="closeCanvas(${attractionID})"></button>
    </div>
    <div class="offcanvas-body">
      <h2 class="offcanvas-title">${attraction.attractionName}</h2>
      <h3 class="offcanvas-subtitle">${attraction.attractionNameENGLISH}</h3>
      <!-- Content for Lotus Mega Yacht -->
      <div id="carousel-${attractionID}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="${attraction.gallery[0]}" class="d-block w-100" alt="תמונה 1">
          </div>
          <div class="carousel-item">
            <img src="${attraction.gallery[1]}" class="d-block w-100" alt="תמונה 2">
          </div>
          <div class="carousel-item">
            <img src="${attraction.gallery[2]}" class="d-block w-100" alt="תמונה 3">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${attractionID}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${attractionID}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <p>${attraction.description}</p>
      <h5><i class="fas fa-clock"></i> שעות פעילות </h5>
      <p>${attraction.openingHours}</p>
      <h5><i class="fas fa-hourglass-half"></i> זמן ממוצע לבילוי </h5>
      <p> ${attraction.visitDuration}</p>
      <h5><i class="fas fa-wheelchair"></i> נגישות </h5>
      <p>${attraction.accessibility}</p>

      <div class="container mt-3">
        <div class="ticket-container" data-contry='${attraction.city}' data-name='${attraction.attractionName}' data-category='${attraction.category}' data-id="${attractionID}">
          <div class="ticket-category" data-type="adult">
            <div>
              <button class="btn btn-secondary" onclick="decreaseAmount('adult', this)">-</button>
              <span class="amount" data-id="adult-amount">0</span>
              <button class="btn btn-secondary" onclick="increaseAmount('adult', this)">+</button>
            </div>
            <span class="price" data-id="adult-price">₪${attraction.ticketTypes[0].price}</span>
            <div>
              <span class="sub-text">מגיל 10</span>
            </div>
            <span>מבוגר</span>
          </div>

          <div class="ticket-category" data-type="child">
            <div>
              <button class="btn btn-secondary" onclick="decreaseAmount('child', this)">-</button>
              <span class="amount" data-id="child-amount">0</span>
              <button class="btn btn-secondary" onclick="increaseAmount('child', this)">+</button>
            </div>
            <span class="price" data-id="child-price">₪${attraction.ticketTypes[1].price}</span>
            <div>
              <span class="sub-text">מגיל 3 עד 10</span>
            </div>
            <span>ילד</span>
          </div>

          <div class="ticket-category" data-type="infant">
            <div>
              <button class="btn btn-secondary" onclick="decreaseAmount('infant', this)">-</button>
              <span class="amount" data-id="infant-amount">0</span>
              <button class="btn btn-secondary" onclick="increaseAmount('infant', this)">+</button>
            </div>
            <span class="price" data-id="infant-price">₪${attraction.ticketTypes[2].price}</span>
            <div>
              <span class="sub-text">עד גיל 3</span>
            </div>
            <span>פעוט</span>
          </div>

          <div class="ticket-category">
            <span id="total-price">₪0</span>
            <span>סכום ההזמנה</span>
          </div>

        </div>
      </div>

      <div class="text-center">
        <button class="btn btn-custom" type="button" onclick="addCart(${attractionID})">הוסף לסל</button>
      </div>

    </div>
  </div>`;
  
  container.appendChild(canvas);
}

/**
 * בדיקה אם המשתמש מחובר ועדכון ממשק המשתמש בהתאם
 */
function checkUserLogin() {
  console.log('בודק סטטוס התחברות משתמש...');
  
  // בדיקה אם יש אובייקט userInfo ב-localStorage
  let userInfo = null;
  try {
    const userInfoStr = localStorage.getItem('userInfo');
    userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (e) {
    console.error('שגיאה בפענוח userInfo מ-localStorage:', e);
  }
  
  // בדיקה אם יש מידע ב-session/localStorage הישן
  const username = sessionStorage.getItem('username');
  const displayName = sessionStorage.getItem('displayName') || localStorage.getItem('displayName');
  const userId = sessionStorage.getItem('userId');
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  console.log('נתוני משתמש משמירה:', { username, displayName, userId, isAdmin });
  console.log('נתוני userInfo מ-localStorage:', userInfo);
  
  // בדיקה אם המשתמש מחובר לפי אחד מהנתונים
  const isLoggedIn = !!(userInfo || username || displayName || userId);
  console.log('סטטוס התחברות:', isLoggedIn ? 'מחובר' : 'לא מחובר');
  
  // עדכון תצוגת השם במידה ויש משתמש מחובר
  const userGreeting = document.getElementById('user-greeting');
  if (userGreeting) {
    if (isLoggedIn) {
      // הצגת שם המשתמש
      const nameToShow = userInfo?.displayName || displayName || username || 'משתמש';
      userGreeting.textContent = ` היי, ${nameToShow}`;
    } else {
      // הצגת "אורח/ת"
      userGreeting.textContent = ' היי, אורח/ת';
    }
    userGreeting.style.visibility = 'visible';
  }
  
  // עדכון תצוגת האלמנטים לפי מצב התחברות
  updateDisplayElements(isLoggedIn);
}

/**
 * עדכון תוכן הפרופיל והממשק
 */
function updateProfileContent(userInfo, fallbackDisplayName) {
  console.log('Updating profile content...');
  
  const userGreetingElement = document.getElementById('user-greeting');
  if (!userGreetingElement) {
    console.error('User greeting element not found');
    return;
  }
  
  // בדיקה אם המשתמש מחובר
  const isLoggedIn = checkIfLoggedIn(userInfo, fallbackDisplayName);
  
  // עדכון התוכן לפי מצב ההתחברות
  if (isLoggedIn) {
    // הצגת שם המשתמש
    const displayName = userInfo?.displayName || fallbackDisplayName;
    console.log('User is logged in, display name:', displayName);
    userGreetingElement.textContent = ` היי, ${displayName}`;
  } else {
    // הצגת "אורח/ת"
    console.log('User is not logged in');
    userGreetingElement.textContent = ' היי, אורח/ת';
  }
  
  // הצגת האלמנט כי טענו את המידע
  userGreetingElement.style.visibility = 'visible';
  
  // עדכון תצוגת האלמנטים לפי מצב התחברות
  updateDisplayElements(isLoggedIn);
}

/**
 * בדיקה אם המשתמש מחובר
 */
function checkIfLoggedIn(userInfo, fallbackDisplayName) {
  return (userInfo && (userInfo.token || userInfo.userId || userInfo.displayName)) || fallbackDisplayName;
}

/**
 * עדכון תצוגת האלמנטים לפי מצב התחברות
 */
function updateDisplayElements(isLoggedIn) {
  console.log('מעדכן תצוגת אלמנטים לפי מצב התחברות:', isLoggedIn);
  
  // בדיקה אם המשתמש מנהל
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true' || 
  (JSON.parse(localStorage.getItem('userInfo'))?.isAdmin === true);

  console.log('סטטוס מנהל:', isAdmin);

  // עדכון אלמנטים למשתמש מחובר
  document.querySelectorAll('.logged-in-only').forEach(el => {
    el.style.display = isLoggedIn ? 'block' : 'none';
  });

  // עדכון אלמנטים למנהל בלבד
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin ? 'block' : 'none';
  });
  
  // עדכון אלמנטים למשתמש לא מחובר
  document.querySelectorAll('.logged-out-only').forEach(el => {
    el.style.display = isLoggedIn ? 'none' : 'block';
  });
  
  // טיפול מיוחד בפריטי תפריט נפתח
  document.querySelectorAll('.dropdown-item.logged-in-only').forEach(el => {
    el.style.display = isLoggedIn ? 'flex' : 'none';
  });

  document.querySelectorAll('.dropdown-item.admin-only').forEach(el => {
    el.style.display = isAdmin ? 'flex' : 'none';
  });
  
  document.querySelectorAll('.dropdown-item.logged-out-only').forEach(el => {
    el.style.display = isLoggedIn ? 'none' : 'flex';
  });
  
  // עדכון קווים מפרידים בתפריט הנפתח
  document.querySelectorAll('.dropdown-divider.logged-in-only').forEach(el => {
    el.style.display = isLoggedIn ? 'block' : 'none';
  });
  
  // עדכון קישור לאזור האישי
  const personalAreaLink = document.getElementById('personal-area-link');
  if (personalAreaLink) {
    if (isLoggedIn) {
      personalAreaLink.classList.remove('disabled');
      personalAreaLink.setAttribute('href', 'userProfile.html');
    } else {
      personalAreaLink.classList.add('disabled');
      personalAreaLink.setAttribute('href', 'loginPage.html');
    }
  }
  
  // עדכון עגלת הקניות למשתמש מחובר
  if (isLoggedIn) {
    const username = sessionStorage.getItem('username');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (username || (userInfo && userInfo.username)) {
      updateCartCount(username || (userInfo ? userInfo.username : null));
    }
  } else {
    // איפוס כמות המוצרים בעגלה
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = '0';
    }
  }
}

/**
 * התנתקות המשתמש
 */
function logoutUser() {
  console.log('מתנתק מהמערכת...');
  
  // ניקוי מלא של כל הנתונים בזיכרון המקומי
  // ניקוי sessionStorage
  sessionStorage.removeItem('displayName');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('isAdmin');
  
  // ניקוי localStorage - כל המפתחות הרלוונטיים
  localStorage.removeItem('displayName');
  localStorage.removeItem('UserName');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('usrId'); // חשוב מאוד - זה המפתח שנשמר ומציג אטרקציות
  
  // מחיקת כל הנתונים הקשורים למשתמש גם במפתחות פחות מובהקים
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('user_id');
  localStorage.removeItem('token');
  
  // עדכון התצוגה להסתרת האטרקציות המומלצות
  const recommendedTitle = document.getElementById('recommended-attractions-title');
  if (recommendedTitle) {
    recommendedTitle.style.display = 'none';
  }
  
  const dynamicGallery = document.getElementById('dynamic-gallery');
  if (dynamicGallery) {
    dynamicGallery.innerHTML = '';
  }
  
  // ניסיון לשלוח בקשת התנתקות לשרת
  try {
    fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('תגובת שרת להתנתקות:', response);
      // ריענון הדף הנוכחי
      window.location.reload();
    })
    .catch(error => {
      console.error('שגיאה בעת התנתקות:', error);
      // ריענון הדף הנוכחי גם במקרה של שגיאה
      window.location.reload();
    });
  } catch (error) {
    console.error('שגיאה בעת שליחת בקשת התנתקות:', error);
    // ריענון הדף במקרה של שגיאה
    window.location.reload();
  }
}

/**
 * עדכון כמות המוצרים בעגלה
 */
function updateCartCount(username) {
  if (!username) {
    console.log('אין שם משתמש, דילוג על עדכון העגלה');
    return;
  }
  
  console.log('מעדכן כמות מוצרים בעגלה עבור משתמש:', username);
  
  // בדיקה אם יש תקשורת שרת
  fetch(`/api/cart?username=${username}`)
    .then(response => response.json())
    .then(data => {
      let totalItems = 0;
      if (data.cart && Array.isArray(data.cart)) {
        totalItems = data.cart.reduce((total, item) => total + item.amount, 0);
      }
      
      const cartCount = document.getElementById('cart-count');
      if (cartCount) {
        cartCount.textContent = totalItems.toString();
      }
      
      console.log('עגלה עודכנה, סה"כ פריטים:', totalItems);
    })
    .catch(error => {
      console.error('שגיאה בהבאת נתוני עגלה:', error);
    });
}

// פונקציה לשימוש בקוד ישן
function getDisplayNameFromSessionStorage() {
  return sessionStorage.getItem('displayName') || localStorage.getItem('displayName');
}

// פונקציית עזר לנוחות בבחירת אלמנטים על ידי טקסט (ל-jQuery יש :contains אבל אנחנו משתמשים בג'אווהסקריפט טהור)
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Document.prototype.querySelector) {
  Document.prototype.querySelector = Element.prototype.querySelector;
}

// מוסיף בחירת אלמנטים על פי טקסט שהם מכילים
Document.prototype.querySelector = function(selector) {
  if (selector.includes(':contains(')) {
    const match = selector.match(/:contains\(["']?([^)"']+)["']?\)/);
    if (match) {
      const searchText = match[1];
      const baseSelector = selector.replace(/:contains\(["']?([^)"']+)["']?\)/, '');
      
      const allElements = this.querySelectorAll(baseSelector || '*');
      for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].textContent.includes(searchText)) {
          return allElements[i];
        }
      }
      return null;
    }
  }
  return Element.prototype.querySelector.call(this, selector);
};

// פונקציה לתמיכה ב-showCanvas במקרה שהפונקציה המקורית לא מוגדרת
if (typeof showCanvas !== 'function') {
  window.showCanvas = function(id) {
    const offcanvasElement = document.getElementById(id);
    if (offcanvasElement && typeof bootstrap !== 'undefined') {
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
      bsOffcanvas.show();
    } else {
      console.error('לא ניתן לפתוח את ה-offcanvas - חסרה ספריית bootstrap או שהאלמנט לא קיים');
    }
  };
}

// פונקציה לתמיכה ב-closeCanvas במקרה שהפונקציה המקורית לא מוגדרת
if (typeof closeCanvas !== 'function') {
  window.closeCanvas = function(id) {
    const offcanvasElement = document.getElementById(id);
    if (offcanvasElement && typeof bootstrap !== 'undefined') {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  };
}
