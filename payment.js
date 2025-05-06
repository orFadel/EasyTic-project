// payment.js
async function showPopup(event) {
    event.preventDefault();

    // בדיקת ולידציה של טופס התשלום
    const cardNumber = document.getElementById("card_number").value;
    const expiryDate = document.getElementById("expiry_date").value;
    const cvv = document.getElementById("cvv").value;

    if (!cardNumber || !expiryDate || !cvv) {
        alert("נא למלא את כל פרטי התשלום");
        return;
    }

    // שימוש באותו מזהה כמו בדפים האחרים
    const userId = localStorage.getItem('usrId') || sessionStorage.getItem('userId');
    
    if (!userId) {
        alert("נדרשת התחברות לפני ביצוע רכישה");
        window.location.href = "/login";
        return;
    }

    const popup = document.getElementById("popup");
    const spinner = document.getElementById("loading");
    
    if (!popup || !spinner) {
        alert("בעיה בהצגת חלונית העיבוד");
        return;
    }
    
    try {
        // הצגת ספינר
        spinner.style.display = "block";
        
        console.log("שולח בקשת תשלום לשרת עם מזהה משתמש:", userId);
        
        // בדיקת העגלה לפני שליחת בקשת תשלום
        const cartResponse = await fetch(`/api/cart/${userId}`);
        const cartData = await cartResponse.json();

        if (!cartResponse.ok || !cartData.cart || cartData.cart.length === 0) {
            throw new Error('העגלה ריקה או שלא נמצאה');
        }

        console.log("נמצאה עגלה עם פריטים:", cartData.cart);
        
        // שליחת הבקשה לשרת
        const response = await fetch('/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                userId: userId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'שגיאה בעיבוד התשלום');
        }

        const data = await response.json();
        console.log("תשובה מהשרת:", data);
        
        // הצגת מספר ההזמנה בפופאפ
        document.getElementById("order-number-value").textContent = data.orderNumber;
        
        // הצגת פופאפ ההצלחה
        popup.style.display = "block";
        
        // החבאת הספינר
        spinner.style.display = "none";

        // אחרי 3 שניות ניווט לדף הבית
        setTimeout(() => {
            console.log("מעבר לדף הבית...");
            window.location.href = "/";
        }, 3000);
    } catch (error) {
        console.error("שגיאה בתהליך התשלום:", error);
        alert("אירעה שגיאה בתהליך התשלום: " + error.message);
        spinner.style.display = "none";
    }
}

function getUserId() {
    return sessionStorage.getItem('userId');
}
  
function closePopup() {
    // סגירת חלונית הפופ-אפ
    const popup = document.getElementById('popup');
    const spinner = document.getElementById('spinner');
    
    popup.style.display = 'none'; // החבאת הפופ-אפ
    spinner.style.display = 'none'; // החבאת הספינר
}
  
function formatExpiryDate(input) {
    // הסרת כל תו שאינו ספרה
    let value = input.value.replace(/\D/g, '');

    // הגבלת האורך ל-6 ספרות (MMYYYY)
    if (value.length > 6) {
        value = value.slice(0, 6);
    }

    // הוספת '/' לאחר 2 ספרות
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }

    input.value = value;

    // ולידציה של החודש והשנה
    const parts = value.split('/');
    if (parts.length === 2) {
        const month = parseInt(parts[0], 10);
        const year = parseInt(parts[1], 10);

        const now = new Date();
        const currentMonth = now.getMonth() + 1; // getMonth() מחזיר ערכים בין 0 ל-11
        const currentYear = now.getFullYear();

        if (month < 1 || month > 12) {
            input.setCustomValidity("יש להזין חודש בין 01 ל-12");
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
            input.setCustomValidity("תאריך התוקף חייב להיות נוכחי או עתידי");
        } else {
            input.setCustomValidity("");
        }
    } else {
        input.setCustomValidity("יש להזין תאריך בפורמט MM/YYYY");
    }
}

function formatCardNumber(input) {
    // הסרת תווים לא מספריים
    let cardNumber = input.value.replace(/\D/g, '');
    // הכנסת רווח כל 4 ספרות
    cardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    // עדכון ערך הקלט
    input.value = cardNumber;
}
