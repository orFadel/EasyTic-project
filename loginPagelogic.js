async function handleLogin() {
    const usernameInput = document.getElementById('uname').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    console.log('Username:', usernameInput);
    console.log('Password:', passwordInput);

  
    if (usernameInput !== '' && passwordInput !== '') {
        localStorage.setItem('UserName', usernameInput);
  
        // בקשת התחברות לשרת
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
  
        if (response.ok) {
            // הצלחה: משתמש קיים במערכת
            const data = await response.json();
            const userId = data.userId;
  
            if (userId) {
                // שמירת ה-userId ושם התצוגה
                sessionStorage.setItem('userId', userId);
                let displayName = sessionStorage.getItem('displayName') || localStorage.getItem('displayName') || usernameInput;
                sessionStorage.setItem('displayName', displayName);
                localStorage.setItem('displayName', displayName);
  
                // ניתוב לעמוד הבית
                window.location.href = 'homePage.html';
            }
        } else {
            const message = await response.json();
  
            // בדיקת סיבת השגיאה
            if (response.status === 401) {
                // סיסמה לא נכונה למשתמש קיים
                alert('Invalid username or password. Please try again.');
            } else if (response.status === 404) {
                // משתמש לא נמצא: נרשום משתמש חדש
                const displayName = prompt('הכנס שם תצוגה מותאם אישית:');
                if (displayName !== null && displayName.trim() !== '') {
                    // בקשת רישום לשרת
                    const createUserResponse = await fetch('/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: usernameInput, password: passwordInput, displayName: displayName.trim() })
                    });
  
                    if (createUserResponse.ok) {
                        // רישום הצליח: שמירת פרטי המשתמש
                        alert('User registered successfully!');
                        const registerData = await createUserResponse.json();
                        sessionStorage.setItem('userId', registerData.userId);
                        sessionStorage.setItem('displayName', displayName.trim());
                        localStorage.setItem('displayName', displayName.trim());
  
                        // ניתוב לעמוד הבית לאחר רישום
                        window.location.href = 'homePage.html';
                    } else {
                        const registerMessage = await createUserResponse.json();
                        alert(registerMessage.message);
                    }
                } else {
                    alert('יש להזין שם תצוגה.');
                }
            } else {
                // הצגת הודעת שגיאה עבור קריאות אחרות
                alert(message.message);
            }
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
