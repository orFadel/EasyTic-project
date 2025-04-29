document.addEventListener('DOMContentLoaded', function() {
  console.log('Document loaded, initializing user interface...');
  
  // בדיקה אם יש משתמש מחובר
  checkUserLogin();
  
  // עדכון כמות המוצרים בעגלה
  updateCartCount();
  
  // טיפול באירוע התנתקות
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    console.log('Logout link found, adding event listener');
    logoutLink.addEventListener('click', function(event) {
      event.preventDefault();
      logoutUser();
    });
  } else {
    console.log('Logout link not found');
  }
});

/**
 * בדיקה אם המשתמש מחובר ועדכון ממשק המשתמש בהתאם
 */
function checkUserLogin() {
  console.log('Checking user login status...');
  
  // בדיקה אם יש אובייקט userInfo ב-localStorage
  let userInfo = null;
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo'));
  } catch (e) {
    console.error('Error parsing userInfo from localStorage:', e);
  }
  
  // בדיקה אם יש מידע ב-session/localStorage הישן
  const username = sessionStorage.getItem('username');
  const displayName = sessionStorage.getItem('displayName') || localStorage.getItem('displayName');
  const userId = sessionStorage.getItem('userId');
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  console.log('Session data:', { username, displayName, userId, isAdmin });
  console.log('localStorage userInfo:', userInfo);
  
  // אם אין אובייקט userInfo אבל יש נתונים בשדות הישנים, צור אובייקט חדש
  if (!userInfo && (username || displayName || userId)) {
    console.log('Creating new userInfo object from session data');
    userInfo = {
      userId: userId,
      username: username,
      displayName: displayName,
      isAdmin: isAdmin,
      token: ''
    };
    
    // שמירת האובייקט החדש ב-localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }
  
  // עדכון ממשק המשתמש
  updateProfileContent(userInfo, displayName);
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
  console.log('Updating display elements, isLoggedIn:', isLoggedIn);
  
  // עדכון אלמנטים כלליים
  document.querySelectorAll('.logged-in-only').forEach(el => {
    el.style.display = isLoggedIn ? 'block' : 'none';
  });
  
  document.querySelectorAll('.logged-out-only').forEach(el => {
    el.style.display = isLoggedIn ? 'none' : 'block';
  });
  
  // טיפול מיוחד בפריטי תפריט
  document.querySelectorAll('.dropdown-item.logged-in-only').forEach(el => {
    el.style.display = isLoggedIn ? 'flex' : 'none';
  });
  
  document.querySelectorAll('.dropdown-item.logged-out-only').forEach(el => {
    el.style.display = isLoggedIn ? 'none' : 'flex';
  });
  
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
  
  // עדכון עגלת הקניות אם המשתמש מחובר
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
  console.log('Logging out user...');
  
  // ניקוי הנתונים מה-sessionStorage (שיטה ישנה)
  sessionStorage.removeItem('displayName');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('isAdmin');
  
  // ניקוי הנתונים מה-localStorage (שיטה ישנה)
  localStorage.removeItem('displayName');
  localStorage.removeItem('UserName');
  
  // ניקוי הנתונים מה-localStorage (שיטה חדשה)
  localStorage.removeItem('userInfo');
  
  // שליחת בקשת התנתקות לשרת
  fetch('/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Logout response:', response);
    // ריענון הדף הנוכחי במקום הפניה לדף התחברות
    window.location.reload();
  })
  .catch(error => {
    console.error('Error during logout:', error);
    // ריענון הדף הנוכחי גם במקרה של שגיאה
    window.location.reload();
  });
}

/**
 * עדכון כמות המוצרים בעגלה
 */
function updateCartCount(username) {
  // אם אין שם משתמש, לא נעשה כלום
  if (!username) {
    console.log('No username provided, skipping cart update');
    return;
  }
  
  console.log('Updating cart count for username:', username);
  
  // בקשת נתוני העגלה מהשרת
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
      
      console.log('Cart updated, total items:', totalItems);
    })
    .catch(error => {
      console.error('Error fetching cart:', error);
    });
}

// פונקציה לשימוש בקוד ישן
function getDisplayNameFromSessionStorage() {
  return sessionStorage.getItem('displayName') || localStorage.getItem('displayName');
}
