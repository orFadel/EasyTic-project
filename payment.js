// payment.js
async function showPopup(event) {
    event.preventDefault(); // מניעת שליחת הטופס אוטומטית

    const userId = sessionStorage.getItem('userId'); 
    if (!userId) {
        alert("User ID is missing!"); 
        return; 
    }

    const popup = document.getElementById("popup");
    const spinner = document.getElementById("loading");
    
    if (!popup || !spinner) {
        alert("Pop up or spinner element is missing");
        return;
    }
    
    try {
        // הצגת ספינר
        spinner.style.display = "block";
        popup.style.display = "block"; // הצגת הפופ-אפ

        const response = await fetch('/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }) 
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        document.getElementById("order-number-value").textContent = data.orderNumber;

        // החבאת הספינר
        spinner.style.display = "none";

        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
    } catch (error) {
        console.error("Error in payment process:", error);
        alert("אירעה שגיאה בתהליך התשלום. אנא נסה שוב.");
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
  
function formatCardNumber(input) {
    // הסרת תווים לא מספריים
    let cardNumber = input.value.replace(/\D/g, '');
    // הכנסת רווח כל 4 ספרות
    cardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    // עדכון ערך הקלט
    input.value = cardNumber;
}
