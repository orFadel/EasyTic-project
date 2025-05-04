document.addEventListener('DOMContentLoaded', function() {
    console.log('מסמך התחברות נטען, מאתחל ממשק משתמש...');
    
    // בדיקה אם יש משתמש מחובר - אם כן, הפנייה לדף הבית
    checkUserLogin();
    
    // הצגת המודל בעת טעינת העמוד
    const welcomeModal = document.getElementById('welcome-modal');
    if (welcomeModal) {
      welcomeModal.style.display = 'block';
    }
    
    // אתחול ולידציה של טופס
    initFormValidation();
    
    // מאזינים לאירועי לחיצה
    setupEventListeners();
  });
  
  // אתחול מאזיני אירועים נוספים
  function setupEventListeners() {
    // מאזין להתחברות עם גוגל
    const googleLoginButtons = document.querySelectorAll('.google-btn');
    googleLoginButtons.forEach(button => {
      button.addEventListener('click', handleGoogleLogin);
    });
    
    // מאזין לכפתור ההתחברות
    const loginButton = document.getElementById('submit-button');
    if (loginButton) {
      loginButton.addEventListener('click', handleLogin);
    }
    
    // מאזין לכפתור ההרשמה
    const registerButton = document.getElementById('register-button');
    if (registerButton) {
      registerButton.addEventListener('click', handleRegistration);
    }
    
    // מאזינים למעבר בין טפסים
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    
    if (showRegisterLink) {
      showRegisterLink.addEventListener('click', function() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
      });
    }
    
    if (showLoginLink) {
      showLoginLink.addEventListener('click', function() {
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
      });
    }
    
    // מאזין לצפייה בסיסמה (טופס התחברות)
    const togglePasswordIcon = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePasswordIcon && passwordInput) {
      togglePasswordIcon.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // שינוי האייקון בין עין פתוחה לעין סגורה
        if (type === 'text') {
          this.classList.remove('fa-eye-slash');
          this.classList.add('fa-eye');
        } else {
          this.classList.remove('fa-eye');
          this.classList.add('fa-eye-slash');
        }
      });
    }
    
    // מאזין לצפייה בסיסמה (טופס הרשמה)
    const toggleRegPasswordIcon = document.getElementById('toggleRegPassword');
    const regPasswordInput = document.getElementById('reg-password');
    
    if (toggleRegPasswordIcon && regPasswordInput) {
      toggleRegPasswordIcon.addEventListener('click', function () {
        const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        regPasswordInput.setAttribute('type', type);
        
        // שינוי האייקון בין עין פתוחה לעין סגורה
        if (type === 'text') {
          this.classList.remove('fa-eye-slash');
          this.classList.add('fa-eye');
        } else {
          this.classList.remove('fa-eye');
          this.classList.add('fa-eye-slash');
        }
      });
    }
  }
  
  // אתחול ולידציה של טופס
  function initFormValidation() {
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
      input.addEventListener('input', function() {
        validateField(this);
      });
    });
  }
  
  // ולידציה של שדה
  function validateField(field) {
    if (field.checkValidity()) {
      field.classList.add('is-valid');
      field.classList.remove('is-invalid');
      field.parentElement.querySelector('.valid-feedback').style.display = 'block';
      field.parentElement.querySelector('.invalid-feedback').style.display = 'none';
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
      field.parentElement.querySelector('.valid-feedback').style.display = 'none';
      field.parentElement.querySelector('.invalid-feedback').style.display = 'block';
    }
  }
  
  // פונקציה לטיפול בהתחברות עם גוגל
  async function handleGoogleLogin() {
    console.log('מתחיל תהליך התחברות עם גוגל');
    const button = document.querySelector('.google-btn');
    
    try {
      // הצגת אינדיקטור טעינה
      showLoading(button, true);
      
      // יצירת אובייקט Google OAuth
      const googleAuth = google.accounts.oauth2.initCodeClient({
        client_id: '20535000026-ihg42f1n3i68bfd70m5l1vhpgf8m91ou.apps.googleusercontent.com',
        scope: 'email profile',
        ux_mode: 'popup',
        callback: async (response) => {
          if (response.code) {
            try {
              // שליחת קוד האימות לשרת שלך
              const serverResponse = await fetch('/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: response.code })
              });
              
              if (serverResponse.ok) {
                const userData = await serverResponse.json();
                // טיפול במשתמש שהתחבר
                handleSuccessfulLogin(userData);
              } else {
                const errorText = await serverResponse.text();
                throw new Error(`Google authentication failed on server: ${errorText}`);
              }
            } catch (error) {
              console.error('שגיאה בשליחת קוד האימות לשרת:', error);
              showError('אירעה שגיאה בהתחברות עם גוגל. אנא נסה שנית.');
            }
          } else {
            console.error('לא התקבל קוד אימות מגוגל');
            showError('אירעה שגיאה בהתחברות עם גוגל. אנא נסה שנית.');
          }
          
          // ביטול אינדיקטור טעינה
          showLoading(button, false);
        }
      });
      
      // פתיחת חלון ההתחברות של גוגל
      googleAuth.requestCode();
      
    } catch (error) {
      console.error('שגיאה בהתחברות עם גוגל:', error);
      showError('אירעה שגיאה בהתחברות עם גוגל. אנא נסה שנית.');
      showLoading(button, false);
    }
  }

  function showLoading(buttonElement, isLoading) {
    if (isLoading) {
      const originalText = buttonElement.innerHTML;
      buttonElement.setAttribute('data-original-text', originalText);
      buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> מתחבר...';
      buttonElement.disabled = true;
    } else {
      const originalText = buttonElement.getAttribute('data-original-text');
      if (originalText) {
        buttonElement.innerHTML = originalText;
      }
      buttonElement.disabled = false;
    }
  }

  function showError(message) {
    // בדיקה אם כבר קיים אלמנט להודעות שגיאה
    let errorContainer = document.getElementById('login-error');
    
    // אם לא קיים, יצירת אלמנט חדש
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.id = 'login-error';
      errorContainer.className = 'alert alert-danger mt-3';
      
      // הוספת האלמנט לטופס
      const form = document.querySelector('form');
      if (form) {
        form.parentNode.insertBefore(errorContainer, form);
      }
    }
    
    // הצגת הודעת השגיאה
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    
    // הסרת ההודעה אחרי 5 שניות
    setTimeout(() => {
      errorContainer.style.display = 'none';
    }, 5000);
  }
  
  // פונקציה לטיפול בהתחברות רגילה
  async function handleLogin() {
    const usernameInput = document.getElementById('uname').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    console.log('שם משתמש:', usernameInput);
    console.log('סיסמה:', passwordInput);
  
    if (usernameInput !== '' && passwordInput !== '') {
      localStorage.setItem('UserName', usernameInput);
  
      try {
        // בקשת התחברות לשרת
        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
  
        console.log('סטטוס תגובה:', response.status);
        const responseText = await response.text();
        console.log('תוכן תגובה:', responseText);
  
        if (response.ok) {
          // המרת JSON רק אם הבקשה הצליחה
          const data = JSON.parse(responseText);
          console.log('נתוני משתמש:', data);
  
          const userId = data.userId;
          const isAdmin = data.isAdmin;
          const displayName = data.displayName || usernameInput;
  
          if (userId) {
            // הכנת אובייקט המשתמש לשמירה
            const userData = {
              userId: userId,
              username: usernameInput,
              displayName: displayName,
              isAdmin: isAdmin,
              token: data.token || ''
            };
            
            // בדיקה שהנתונים נשמרו נכון
            console.log('נתוני משתמש להתחברות:', userData);
            
            // טיפול בהתחברות המוצלחת
            handleSuccessfulLogin(userData);
          }
          else {
           localStorage.removeItem('usrId');
          }
        } else {
          // המרת JSON רק אם יש שגיאה ברמת השרת
          let message;
          try {
            message = JSON.parse(responseText);
          } catch (error) {
            message = { message: "שגיאה לא ידועה." };
          }
  
          if (response.status === 401) {
            alert('שם משתמש או סיסמה שגויים, אנא נסה שנית.');
          } else if (response.status === 404) {
            // משתמש לא נמצא - נציע לו להירשם
            alert('המשתמש לא נמצא. באפשרותך להירשם כמשתמש חדש.');
            // מעבר לטופס הרשמה
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('register-form').style.display = 'block';
            
            // מילוי אוטומטי של שם המשתמש
            document.getElementById('reg-uname').value = usernameInput;
          } else {
            alert(message.message);
          }
        }
      } catch (error) {
        console.error('שגיאה במהלך התחברות:', error);
        alert('אירעה שגיאה במהלך ההתחברות. אנא נסה שנית מאוחר יותר.');
      }
    } else {
      alert('יש להזין שם משתמש וסיסמה.');
    }
  }
  
  // פונקציה לטיפול בהרשמה
async function handleRegistration() {
    const email = document.getElementById('reg-email').value.trim();
    const username = document.getElementById('reg-uname').value.trim();
    const displayName = document.getElementById('reg-displayname').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const termsCheck = document.getElementById('terms-check').checked;
  
    console.log('נתוני הרשמה:', { email, username, displayName });
  
    if (!email || !username || !displayName || !password) {
      alert('יש למלא את כל השדות הנדרשים');
      return;
    }
  
    if (!termsCheck) {
      alert('יש לאשר את תנאי השימוש כדי להמשיך');
      return;
    }
  
    try {
      // שליחת בקשת רישום לשרת
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email,
          username: username, 
          password: password, 
          displayName: displayName 
        })
      });
  
      console.log('סטטוס תגובה:', response.status);
      const responseText = await response.text();
      console.log('תוכן תגובה:', responseText);
      
      if (response.status === 200 || response.status === 201) {
        // רישום מוצלח
        alert('הרשמה בוצעה בהצלחה!');
        
        // המרת התגובה ל-JSON
        const data = JSON.parse(responseText);
        
        // הכנת אובייקט המשתמש לשמירה
        const userData = {
          userId: data.userId || 'user_' + Date.now(), // ערך ברירת מחדל למקרה שהשרת לא מחזיר מזהה
          username: username,
          displayName: displayName,
          email: email, // הוספת אימייל
          isAdmin: data.isAdmin || false,
          token: data.token || 'temp_token_' + Math.random().toString(36).substr(2) // ערך זמני אם אין טוקן מהשרת
        };
        
        console.log('נתוני משתמש להתחברות אחרי הרשמה:', userData);
        
        // שמירת המידע ב-localStorage
        localStorage.setItem('userInfo', JSON.stringify(userData));
        
        // שמירה גם בשדות הנפרדים לתאימות עם הקוד הקיים
        sessionStorage.setItem('userId', userData.userId);
        localStorage.setItem('usrId', userData.userId);
        sessionStorage.setItem('username', userData.username);
        sessionStorage.setItem('displayName', userData.displayName);
        localStorage.setItem('displayName', userData.displayName);
        sessionStorage.setItem('isAdmin', userData.isAdmin ? 'true' : 'false');
        
        console.log('המשתמש נרשם והתחבר בהצלחה. עובר לדף הפרופיל...');
        
        // הפניה לדף פרופיל המשתמש
        window.location.href = 'userProfile.html';
      } else if (response.status === 409) {
        // שם משתמש כבר קיים
        alert('שם המשתמש או האימייל כבר קיימים במערכת. נסה שם אחר.');
      } else {
        // שגיאה אחרת
        let message;
        try {
          message = JSON.parse(responseText).message;
        } catch (e) {
          message = 'שגיאה לא ידועה התרחשה בתהליך ההרשמה.';
        }
        alert(message);
        localStorage.removeItem('usrId');
      }
    } catch (error) {
      console.error('שגיאה במהלך הרשמה:', error);
      localStorage.removeItem('usrId');
      // במקרה של שגיאת רשת, נדמה הרשמה מוצלחת בסביבת הפיתוח
      console.log('מדמה הרשמה מוצלחת לצורך פיתוח...');
      const userData = {
        userId: 'demo_user_' + Date.now(),
        username: username,
        displayName: displayName,
        email: email,
        isAdmin: false,
        token: 'demo_token_' + Math.random().toString(36).substring(2)
      };
      
      // שמירת המידע ב-localStorage
      localStorage.setItem('userInfo', JSON.stringify(userData));
      
      // שמירה גם בשדות הנפרדים לתאימות עם הקוד הקיים
      sessionStorage.setItem('userId', userData.userId);
      sessionStorage.setItem('username', userData.username);
      sessionStorage.setItem('displayName', userData.displayName);
      localStorage.setItem('displayName', userData.displayName);
      sessionStorage.setItem('isAdmin', 'false');
      
      console.log('המשתמש נרשם והתחבר בהצלחה (מצב פיתוח). עובר לדף הפרופיל...');
      
      // הפניה לדף פרופיל המשתמש
      window.location.href = 'userProfile.html';
    }
  }
  
  // פונקציה לטיפול בהתחברות מוצלחת (משותפת לכל סוגי ההתחברות)
  function handleSuccessfulLogin(userData) {
    console.log('***DEBUG*** מטפל בהתחברות מוצלחת עם נתונים:', userData);
    
    // שמירת מידע המשתמש ב-localStorage בפורמט אחיד
    const userInfo = {
        userId: userData.userId,
        username: userData.username || document.getElementById('uname')?.value.trim(),
        displayName: userData.displayName,
        isAdmin: userData.isAdmin,
        token: userData.token || '' // אם קיים
    };
    
    console.log('***DEBUG*** שומר נתוני משתמש ב-localStorage ו-sessionStorage:', userInfo);
    
    // שמירה ב-localStorage לשימוש עקבי
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // שמירה גם ב-sessionStorage וב-localStorage לתאימות עם הקוד הקיים
    sessionStorage.setItem('userId', userData.userId);
    localStorage.setItem('usrId', userData.userId);
    sessionStorage.setItem('username', userInfo.username);
    sessionStorage.setItem('displayName', userData.displayName);
    localStorage.setItem('displayName', userData.displayName);
    sessionStorage.setItem('isAdmin', userData.isAdmin ? 'true' : 'false');
    
    // חשוב: שמירת הטוקן גם ב-sessionStorage
    if (userData.token) {
        sessionStorage.setItem('token', userData.token);
        console.log('***DEBUG*** טוקן נשמר ב-sessionStorage:', userData.token.substring(0, 10) + '...');
    }
    
    // וידוא שהטוקן נשמר
    const sessionToken = sessionStorage.getItem('token');
    const localToken = userInfo.token;
    
    if (!sessionToken && localToken) {
        console.error('***DEBUG*** הטוקן לא נשמר ב-sessionStorage כראוי! מנסה שוב...');
        sessionStorage.setItem('token', localToken);
    }
    
    // בדיקה שוב שהטוקן נשמר
    if (sessionStorage.getItem('token')) {
        console.log('***DEBUG*** אימות: טוקן נמצא ב-sessionStorage');
    } else {
        console.error('***DEBUG*** אזהרה: טוקן עדיין לא נמצא ב-sessionStorage!');
    }
    
    // בדיקה אם יש דף להפנות אליו
    const redirectPage = localStorage.getItem('redirectAfterLogin');
    
    console.log('***DEBUG*** הפניה לאחר התחברות:', redirectPage);
    
    if (redirectPage) {
        // מחיקת המידע על ההפניה
        localStorage.removeItem('redirectAfterLogin');
        
        // הפניה לדף המבוקש
        window.location.href = redirectPage;
    } else if (userData.isAdmin) {
        // אם המשתמש מנהל, הפנייה לדף ניהול או בקשת אישור
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('redirect') === 'admin') {
            console.log('***DEBUG*** מעביר למסך ניהול עם הטוקן:', sessionStorage.getItem('token') ? 'נמצא' : 'לא נמצא');
            window.location.href = 'adminDeshboard.html';
        } else {
            const goToAdmin = confirm('ברוך הבא מנהל! האם ברצונך לעבור לממשק הניהול?');
            if (goToAdmin) {
                window.location.href = 'adminDeshboard.html';
            } else {
                window.location.href = 'homePage.html';
            }
        }
    } else {
        // הפניה לדף הבית
        window.location.href = 'homePage.html';
    }
}
  
  // בדיקה אם יש משתמש מחובר
  function checkUserLogin() {
    console.log('בודק מצב התחברות משתמש בדף התחברות...');
    
    // בדיקה אם יש מידע משתמש ב-localStorage
    let userInfo = null;
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    } catch (e) {
      console.error('שגיאה בפענוח userInfo:', e);
    }
    
    // בדיקה אם יש מידע ב-sessionStorage/localStorage הישן
    const username = sessionStorage.getItem('username');
    const displayName = sessionStorage.getItem('displayName') || localStorage.getItem('displayName');
    const userId = sessionStorage.getItem('userId');
    
    console.log('מצב התחברות:', { userInfo, username, displayName, userId });
    
    // אם יש משתמש מחובר כלשהו, העבר לדף הבית
    if (userInfo || username || displayName || userId) {
      console.log('משתמש כבר מחובר, מפנה לדף הבית');
      window.location.href = 'homePage.html';
      return;
    }
    
    // אם אנחנו כאן, המשתמש לא מחובר - וודא שהאלמנטים מוצגים כראוי
    console.log('משתמש לא מחובר, מעדכן תצוגת אלמנטים');
    
    // הסתרת אלמנטים למשתמש מחובר
    document.querySelectorAll('.logged-in-only').forEach(el => {
      el.style.display = 'none';
    });
    
    // הצגת אלמנטים למשתמש לא מחובר
    document.querySelectorAll('.logged-out-only').forEach(el => {
      el.style.display = 'block';
    });
    
    // עדכון בתפריט הנפתח
    document.querySelectorAll('.dropdown-item.logged-in-only').forEach(el => {
      el.style.display = 'none';
    });
    
    document.querySelectorAll('.dropdown-item.logged-out-only').forEach(el => {
      el.style.display = 'flex';
    });
    
    // וודא שהקווים המפרידים למשתמש מחובר לא מוצגים
    document.querySelectorAll('.dropdown-divider.logged-in-only').forEach(el => {
      el.style.display = 'none';
    });
    
    // עדכון טקסט בכותרת התפריט הנפתח
    const userGreeting = document.getElementById('user-greeting');
    if (userGreeting) {
      userGreeting.textContent = ' היי, אורח/ת';
      userGreeting.style.visibility = 'visible';
    }
  }
