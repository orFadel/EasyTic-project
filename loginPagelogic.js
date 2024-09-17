async function handleLogin() {
  const usernameInput = document.getElementById('uname').value.trim();
  const passwordInput = document.getElementById('password').value.trim();

  if (usernameInput !== '' && passwordInput !== '') {
    // שלח את הבקשה לשרת
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameInput, password: passwordInput })
    });

    const message = await response.text();
    if (response.ok) {
      // הצג חלון prompt למשתמש כדי להכניס שם מותאם אישית
      const displayName = prompt('הכנס שם תצוגה מותאם אישית:');
      
      if (displayName !== null && displayName.trim() !== '') {
        // שמור את שם התצוגה ב-sessionStorage כדי להשתמש בו במהלך החיבור
        sessionStorage.setItem('displayName', displayName.trim());
      } else {
        // במקרה שהמשתמש לא הכניס שם מותאם, שמור את שם המשתמש הרגיל
        sessionStorage.setItem('displayName', usernameInput);
      }
      
      // ניתוב לעמוד הבית עם שם התצוגה
      window.location.href = 'homePage.html';
    } else {
      alert(message); // הצג הודעת שגיאה
    }
  } else {
    alert('יש להזין שם משתמש וסיסמה.');
  }
}

// הוסף אירוע על לחצן להראות/להסתיר סיסמא
const passwordInput = document.getElementById('password');
const togglePasswordIcon = document.getElementById('togglePassword');

togglePasswordIcon.addEventListener('click', function () {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
});
