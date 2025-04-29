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
});

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
  
  // עדכון אלמנטים למשתמש מחובר
  document.querySelectorAll('.logged-in-only').forEach(el => {
    el.style.display = isLoggedIn ? 'block' : 'none';
  });
  
  // עדכון אלמנטים למשתמש לא מחובר
  document.querySelectorAll('.logged-out-only').forEach(el => {
    el.style.display = isLoggedIn ? 'none' : 'block';
  });
  
  // טיפול מיוחד בפריטי תפריט נפתח
  document.querySelectorAll('.dropdown-item.logged-in-only').forEach(el => {
    el.style.display = isLoggedIn ? 'flex' : 'none';
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
  
  // ניקוי נתונים מהזיכרון המקומי
  sessionStorage.removeItem('displayName');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('isAdmin');
  
  localStorage.removeItem('displayName');
  localStorage.removeItem('UserName');
  localStorage.removeItem('userInfo');
  
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