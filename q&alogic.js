document.addEventListener('DOMContentLoaded', (event) => {
  updateCartCount();
  
  // בדוק אם המשתמש מחובר
  checkUserLoginStatus();
  
  // אתחול קטגוריות השאלות
  const paymentButton = document.querySelector('.vertical-button[onclick="toggleQuestions(\'payment\')"]');
  if (paymentButton) {
    paymentButton.click(); // הצג את הקטגוריה הראשונה כברירת מחדל
  }
  
  // הגדר את כפתור השליחה של הטופס
  const questionForm = document.getElementById('myForm');
  if (questionForm) {
    questionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      submitQuestion();
    });
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
  // בודק אם המשתמש מחובר בשיטות שונות
  const displayName = localStorage.getItem('displayName') || sessionStorage.getItem('displayName');
  const userId = sessionStorage.getItem('userId');
  const questionForm = document.getElementById('myForm');
  
  if (!displayName || !userId) {
    // המשתמש אינו מחובר, הצג הודעה במקום הטופס
    if (questionForm) {
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
    if (messageLabel) {
      messageLabel.textContent = `שלום ${displayName}, מה השאלה שלך?`;
    }
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
  
  // הפוך את אלמנטי הטופס ללא פעילים במהלך השליחה
  messageTextarea.disabled = true;
  submitButton.disabled = true;
  
  try {
    // קבל מידע משתמש מ-sessionStorage
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');

    if (!userId || !username) {
      alert('עליך להתחבר למערכת כדי לשלוח שאלה');
      window.location.href = 'loginPage.html';
      return;
    }
    
    // שלח את השאלה לשרת
    const response = await fetch('/api/submit-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: messageTextarea.value,
        email: username
      })
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
      // הצג הודעת שגיאה
      alert(data.message || 'אירעה שגיאה בשליחת השאלה');
      
      // הפעל מחדש את אלמנטי הטופס
      messageTextarea.disabled = false;
      submitButton.disabled = false;
    }
  } catch (error) {
    console.error('Error submitting question:', error);
    alert('אירעה שגיאה בשליחת השאלה');
    
    // הפעל מחדש את אלמנטי הטופס
    messageTextarea.disabled = false;
    submitButton.disabled = false;
  }
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
  submitQuestion();
  return false;
}