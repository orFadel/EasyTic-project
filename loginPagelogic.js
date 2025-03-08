function handleSuccessfulLogin(userData) {
    console.log('Handling successful login with data:', userData);
    
    // שמירת מידע המשתמש ב-localStorage בפורמט אחיד
    const userInfo = {
        userId: userData.userId,
        username: userData.username || document.getElementById('uname').value.trim(),
        displayName: userData.displayName,
        isAdmin: userData.isAdmin,
        token: userData.token || '' // אם קיים
    };
    
    console.log('Saving user info to localStorage:', userInfo);
    
    // שמירה ב-localStorage לשימוש עקבי
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // שמירה גם ב-sessionStorage וב-localStorage לתאימות עם הקוד הקיים
    sessionStorage.setItem('userId', userData.userId);
    sessionStorage.setItem('username', userInfo.username);
    sessionStorage.setItem('displayName', userData.displayName);
    localStorage.setItem('displayName', userData.displayName);
    sessionStorage.setItem('isAdmin', userData.isAdmin ? 'true' : 'false');
    
    // בדיקה אם יש דף להפנות אליו
    const redirectPage = localStorage.getItem('redirectAfterLogin');
    
    console.log('Redirect after login:', redirectPage);
    
    if (redirectPage) {
        // מחיקת המידע על ההפניה
        localStorage.removeItem('redirectAfterLogin');
        
        // הפניה לדף המבוקש
        window.location.href = redirectPage;
    } else if (userData.isAdmin) {
        // אם המשתמש מנהל, הפנייה לדף ניהול או בקשת אישור
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('redirect') === 'admin') {
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

async function handleLogin() {
    const usernameInput = document.getElementById('uname').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    console.log('Username:', usernameInput);
    console.log('Password:', passwordInput);

    if (usernameInput !== '' && passwordInput !== '') {
        localStorage.setItem('UserName', usernameInput);

        try {
            // בקשת התחברות לשרת
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password: passwordInput })
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (response.ok) {
                // המרת JSON רק אם הבקשה הצליחה
                const data = JSON.parse(responseText);
                console.log('User Data:', data); // בדיקה אם הנתונים מהשרת תקינים

                const userId = data.userId;
                const isAdmin = data.isAdmin;  // קבלת מידע אם המשתמש מנהל
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
                    console.log('User data for login:', userData);
                    
                    // טיפול בהתחברות המוצלחת
                    handleSuccessfulLogin(userData);
                }
            } else {
                // המרת JSON רק אם יש שגיאה ברמת השרת
                let message;
                try {
                    message = JSON.parse(responseText);
                } catch (error) {
                    message = { message: "Unknown error occurred." };
                }

                if (response.status === 401) {
                    alert('Invalid username or password. Please try again.');
                } else if (response.status === 404) {
                    // משתמש לא נמצא - נציע לו להירשם
                    const displayName = prompt('הכנס שם תצוגה מותאם אישית:');
                    if (displayName !== null && displayName.trim() !== '') {
                        const createUserResponse = await fetch('/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: usernameInput, password: passwordInput, displayName: displayName.trim() })
                        });

                        if (createUserResponse.ok) {
                            alert('User registered successfully!');
                            const registerData = await createUserResponse.json();
                            sessionStorage.setItem('userId', registerData.userId);
                            sessionStorage.setItem('username', usernameInput); // שמירת שם המשתמש בסשן
                            sessionStorage.setItem('displayName', displayName.trim());
                            localStorage.setItem('displayName', displayName.trim());

                            window.location.href = 'homePage.html';
                        } else {
                            const registerMessage = await createUserResponse.json();
                            alert(registerMessage.message);
                        }
                    } else {
                        alert('יש להזין שם תצוגה.');
                    }
                } else {
                    alert(message.message);
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred while trying to log in. Please try again later.');
        }
    } else {
        alert('יש להזין שם משתמש וסיסמה.');
    }
}

// פונקציונליות של הצגת/הסתרת סיסמה
const passwordInput = document.getElementById('password');
const togglePasswordIcon = document.getElementById('togglePassword');

togglePasswordIcon.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
});