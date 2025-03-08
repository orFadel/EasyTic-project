/**
 * קובץ checkAuth.js - מיועד להכללה בדפים שדורשים התחברות
 */

(function() {
    // בדיקה אם יש משתמש מחובר בעת טעינת הדף
    document.addEventListener('DOMContentLoaded', function() {
        // בדיקה אם זהו דף הבית - אם כן, לא נבצע בדיקת אבטחה
        const currentPath = window.location.pathname;
        const isHomePage = currentPath === '/' || 
                          currentPath === '/index.html' || 
                          currentPath === '/homePage.html' || 
                          currentPath.endsWith('/');
        
        if (isHomePage) {
            console.log('Home page detected - no authentication check needed');
            return; // אם זה דף הבית, נצא מהפונקציה ללא בדיקה
        }
        
        console.log('Authentication check for protected page:', currentPath);
        
        // בדיקת נתוני המשתמש
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const username = sessionStorage.getItem('username');
        const displayName = sessionStorage.getItem('displayName') || localStorage.getItem('displayName');
        
        // בדיקה אם המשתמש מחובר
        const isLoggedIn = (userInfo && (userInfo.token || userInfo.userId)) || username || displayName;
        
        if (!isLoggedIn) {
            console.log('User not logged in - redirecting to login page');
            
            // שמירת הדף הנוכחי כדי לחזור אליו לאחר ההתחברות
            localStorage.setItem('redirectAfterLogin', currentPath);
            
            // הפנייה לדף ההתחברות
            window.location.href = 'loginPage.html';
        } else {
            console.log('User is logged in - access allowed');
        }
    });
})();