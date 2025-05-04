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
        
        // בדיקה האם זהו דף הניהול
        const isAdminPage = currentPath.includes('adminDeshboard') ||
                           currentPath.includes('admin-dashboard') ||
                           currentPath.includes('/admin');

        // בדיקת מידע המשתמש מכל המקורות האפשריים
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const username = sessionStorage.getItem('username');
        const displayName = sessionStorage.getItem('displayName') || localStorage.getItem('displayName');
        const isAdmin = sessionStorage.getItem('isAdmin') === 'true' || userInfo.isAdmin === true;
        
        // בדיקה אם המשתמש מחובר
        const isLoggedIn = (userInfo && (userInfo.token || userInfo.userId)) || username || displayName;
        
        console.log('Auth check:', { 
            page: currentPath, 
            isLoggedIn, 
            isAdmin, 
            userInfo: userInfo || 'none' 
        });
        
        if (isHomePage) {
            console.log('Home page detected - no authentication check needed');
            return; // אם זה דף הבית, נצא מהפונקציה ללא בדיקה
        }
        
        // בדיקה אם זהו דף מנהל ואם למשתמש יש הרשאות מנהל
        if (isAdminPage) {
            console.log('Admin page detected - checking admin privileges');
            
            if (!isLoggedIn) {
                console.log('User not logged in - redirecting to login page');
                localStorage.setItem('redirectAfterLogin', currentPath);
                window.location.href = 'loginPage.html?redirect=admin';
                return;
            }
            
            if (!isAdmin) {
                console.log('User is not admin - access denied');
                alert('גישה נדחתה - גישה למנהלים בלבד');
                window.location.href = 'homePage.html';
                return;
            }
            
            console.log('Admin access granted');
            return;
        }
        
        // בדיקה רגילה למשתמש מחובר לדפים מוגנים אחרים
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