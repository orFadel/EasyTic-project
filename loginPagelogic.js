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
                    sessionStorage.setItem('userId', userId);
                    sessionStorage.setItem('username', usernameInput); // שמירת שם המשתמש בסשן
                    sessionStorage.setItem('displayName', displayName);
                    localStorage.setItem('displayName', displayName);

                    // שמירת המידע אם המשתמש הוא מנהל
                    sessionStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');

                    // בדיקה שהנתונים נשמרו נכון
                    console.log('Saved userId in sessionStorage:', sessionStorage.getItem('userId'));
                    console.log('Saved username in sessionStorage:', sessionStorage.getItem('username'));
                    console.log('Saved isAdmin in sessionStorage:', sessionStorage.getItem('isAdmin'));
                    console.log('Saved displayName in localStorage:', localStorage.getItem('displayName'));

                    // בדיקה אם המשתמש מנהל ויש redirect לעמוד המנהל
                    const urlParams = new URLSearchParams(window.location.search);
                    if (isAdmin && urlParams.get('redirect') === 'admin') {
                        window.location.href = 'adminDeshboard.html';
                    } else if (isAdmin) {
                        // אם המשתמש מנהל אבל אין redirect, נשאל אם ברצונו לעבור לעמוד המנהל
                        const goToAdmin = confirm('ברוך הבא מנהל! האם ברצונך לעבור לממשק הניהול?');
                        if (goToAdmin) {
                            window.location.href = 'adminDeshboard.html';
                        } else {
                            window.location.href = 'homePage.html';
                        }
                    } else {
                        // אחרת - ניתוב לעמוד הבית
                        window.location.href = 'homePage.html';
                    }
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