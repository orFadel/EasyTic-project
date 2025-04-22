document.addEventListener('DOMContentLoaded', (event) => {
  updateCartCount();
  
  // בדוק אם המשתמש מחובר
  checkUserLoginStatus();
  
  // עדכן סטטוס התחברות בכותרת
  updateHeaderLoginStatus();
  
  // אתחול קטגוריות השאלות
  const paymentButton = document.querySelector('.vertical-button[onclick="toggleQuestions(\'payment\')"]');
  if (paymentButton) {
    paymentButton.click(); // הצג את הקטגוריה הראשונה כברירת מחדל
  }
});

function toggleQuestions(category) {
  // הסתר את כל רשימות השאלות
  document.querySelectorAll('.question-list').forEach(function (list) {
    list.classList.remove('active');
  });

  // הצג את רשימת השאלות שנבחרה
  const selectedList = document.getElementById(category + '-questions');
  if (selectedList) {
    selectedList.classList.add('active');
  }
}

function toggleAnswer(questionContainer) {
  // שנה את הנראות של התשובה הקשורה לשאלה שנלחצה
  const answer = questionContainer.nextElementSibling;
  answer.classList.toggle('active');
}

function checkUserLoginStatus() {
  // בדיקה מקיפה של אפשרויות שמירת פרטי משתמש
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const displayName = userInfo.displayName || localStorage.getItem('displayName') || sessionStorage.getItem('displayName');
  const userId = userInfo.userId || userInfo.id || localStorage.getItem('userId') || sessionStorage.getItem('userId');
  const token = userInfo.token;
  
  console.log('בדיקת סטטוס התחברות:', { displayName, userId, token });
  
  const questionForm = document.getElementById('myForm');
  const loginMessage = document.querySelector('.login-required-message');
  
  // אם כבר קיימת הודעת התחברות, נסיר אותה אם המשתמש מחובר
  if (loginMessage && (token || displayName || userId)) {
    loginMessage.remove();
    if (questionForm) {
      questionForm.style.display = 'block';
    }
  }
  
  if (!token && !displayName && !userId) {
    // המשתמש אינו מחובר, הצג הודעה במקום הטופס
    if (questionForm && !loginMessage) {
      const loginMessage = document.createElement('div');
      loginMessage.className = 'login-required-message';
      loginMessage.innerHTML = `
        <p>עליך להתחבר למערכת כדי לשלוח שאלה</p>
        <a href="loginPage.html" class="btn btn-primary">התחבר למערכת</a>
      `;
      
      // החלף את הטופס עם ההודעה
      questionForm.style.display = 'none';
      questionForm.parentNode.insertBefore(loginMessage, questionForm);
    }
  } else {
    // המשתמש מחובר, הצג את שם המשתמש בטופס
    const messageLabel = document.querySelector('label[for="message"]');
    if (messageLabel && displayName) {
      messageLabel.textContent = `שלום ${displayName}, מה השאלה שלך?`;
    }
  }
}

function updateHeaderLoginStatus() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const displayName = userInfo.displayName;
  const userGreeting = document.getElementById('user-greeting');
  
  if (displayName && userGreeting) {
    userGreeting.textContent = ` היי, ${displayName}`;
    
    // הסתרת לינק "התחבר" והצגת "האזור האישי שלי" ו"התנתקות"
    const loginLinks = document.querySelectorAll('.logged-out-only');
    const profileLinks = document.querySelectorAll('.logged-in-only');
    
    loginLinks.forEach(link => link.style.display = 'none');
    profileLinks.forEach(link => link.style.display = 'block');
  }
}

async function submitQuestion() {
  const messageTextarea = document.getElementById('message');
  const submitButton = document.getElementById('submitButton');
  const successMessage = document.getElementById('successMessage');
  
  // וודא שהמשתמש הזין שאלה
  if (!messageTextarea.value.trim()) {
    alert('אנא הזן את השאלה שלך');
    return;
  }
  
  // בדיקת התחברות מקיפה יותר
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const username = userInfo.username || userInfo.email || sessionStorage.getItem('username');
  const token = userInfo.token;
  
  // לוג המציג את פרטי המשתמש שנמצאו
  console.log('פרטי משתמש למשלוח השאלה:', { userInfo, username, token });
  
  // אם אין פרטי משתמש מספיקים לשליחה, הצג הודעה
  if (!username && !token) {
    alert('המערכת לא מזהה אותך כמשתמש מחובר. אנא התחבר שוב או רענן את הדף.');
    return;
  }
  
  // הפוך את אלמנטי הטופס ללא פעילים במהלך השליחה
  messageTextarea.disabled = true;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> שולח...';
  
  try {
    // הכנת נתונים לשליחה עם יותר אפשרויות להכללת זהות המשתמש
    const requestData = {
      message: messageTextarea.value,
      email: username
    };
    
    // הוספת נתוני אימות אם יש טוקן
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // שלח את השאלה לשרת
    const response = await fetch('/api/submit-question', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // הצג הודעת הצלחה
      submitButton.style.display = 'none';
      successMessage.style.display = 'block';
      
      // נקה את תיבת הטקסט
      messageTextarea.value = '';
      
      // הפנה לאזור המשתמש לאחר השהייה
      setTimeout(() => {
        window.location.href = 'userProfile.html#questions';
      }, 3000);
    } else {
      // הצג הודעת שגיאה מהשרת אם יש
      alert(data.message || 'אירעה שגיאה בשליחת השאלה');
      
      // הפעל מחדש את אלמנטי הטופס
      messageTextarea.disabled = false;
      submitButton.disabled = false;
      submitButton.innerHTML = 'שלח';
    }
  } catch (error) {
    console.error('Error submitting question:', error);
    alert('אירעה שגיאה בשליחת השאלה. נסה שוב מאוחר יותר.');
    
    // הפעל מחדש את אלמנטי הטופס
    messageTextarea.disabled = false;
    submitButton.disabled = false;
    submitButton.innerHTML = 'שלח';
  }
}

function isUserLoggedIn() {
  // בדיקה מקיפה יותר של מצב ההתחברות
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  // אם יש טוקן, המשתמש מחובר
  if (userInfo.token) return true;
  
  // בדיקות נוספות למקרה שהנתונים מפוצלים בזיכרון
  const hasUsername = userInfo.username || localStorage.getItem('username') || sessionStorage.getItem('username');
  const hasUserId = userInfo.id || userInfo.userId || localStorage.getItem('userId') || sessionStorage.getItem('userId');
  
  return !!(hasUsername && hasUserId);
}

// פונקציה לעדכון כמות המוצרים בעגלה
function updateCartCount() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var totalItems = cart.reduce((total, item) => total + item.amount, 0); // סוכם את כל הכמויות
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems; // עדכון המספר שמופיע על האייקון
  }
}

// פונקציה ישנה שנשארת לצורך תאימות לאחור
function submitForm() {
  event.preventDefault();
  
  // בדיקה מהירה אם המשתמש מחובר לפני שליחת השאלה
  if (!isUserLoggedIn()) {
    alert('עליך להתחבר למערכת כדי לשלוח שאלה');
    // הצג את לינק ההתחברות
    const loginMessage = document.createElement('div');
    loginMessage.className = 'login-required-message';
    loginMessage.innerHTML = `
      <p>עליך להתחבר למערכת כדי לשלוח שאלה</p>
      <a href="loginPage.html" class="btn btn-primary">התחבר למערכת</a>
    `;
    
    const myForm = document.getElementById('myForm');
    myForm.style.display = 'none';
    myForm.parentNode.insertBefore(loginMessage, myForm);
    
    return false;
  }
  
  // אם המשתמש מחובר, המשך לשליחת השאלה
  submitQuestion();
  return false;
}
