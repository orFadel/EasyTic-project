document.addEventListener('DOMContentLoaded', (event) => {
    updateCartCount();
  });

window.addEventListener('load', async function() {
    console.log("start");

    // נניח שאת מזהה את המשתמש בעזרת username מה-sessionStorage
    const username = localStorage.getItem('UserName');

    if (!username) {
        console.error('Username is missing!');
        return;
    }

    try {
        // מבצעים בקשה לשרת כדי לקבל את עגלת הקניות של המשתמש מה-DB
        const response = await fetch(`/api/cart?username=${username}`);
        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to fetch cart:', data.message);
            return;
        }

        var cart = data.cart; // העגלה שהתקבלה מהשרת
        let sum = 0;
        var htmlStrig = '';

        if (cart && cart.length > 0) {
            htmlStrig += '<tr>';
            htmlStrig += '<th>סה"כ</th>';     
            htmlStrig += '<th>סכום ביניים</th>';
            htmlStrig += '<th>כמות</th>';
            htmlStrig += '<th>סוג</th>'; 
            htmlStrig += '<th>שם</th>';
            htmlStrig += '<th>קטגוריה</th>';
            htmlStrig += '<th>עיר</th>';
            htmlStrig += '<th>מספר מוצר</th>';
            htmlStrig += '<th>    </th>';
            htmlStrig += '</tr>';

            // לולאה שעוברת על עגלת הקניות ומוסיפה שורות לטבלה
            for (let i = 0; i < cart.length; i++) {
                sum += cart[i].price * cart[i].amount;
                htmlStrig += '<tr id="tr'+cart[i].productId+'">';
                htmlStrig += '<td>'+cart[i].price * cart[i].amount+'</td>'; // סה"כ
                htmlStrig += '<td>'+cart[i].price+'</td>'; // מחיר ביניים
                htmlStrig += '<td>'+cart[i].amount+'</td>'; // כמות
                htmlStrig += '<td class="type">'+cart[i].type+'</td>'; // סוג
                htmlStrig += '<td>'+cart[i].productName+'</td>'; // שם
                htmlStrig += '<td>'+cart[i].category+'</td>'; // קטגוריה
                htmlStrig += '<td>'+cart[i].contry+'</td>'; // עיר
                htmlStrig += '<td>'+cart[i].productId+'</td>'; // מספר מוצר
                htmlStrig += `<td><button class="deleteFromCart" onclick="deleteRow(${cart[i].productId}, '${cart[i].type}')"> <i class="fas fa-trash"></i></button></td>`;
                htmlStrig += '</tr>';
            }

            // מעדכנים את המחיר הכולל
            document.getElementById("total_price").innerHTML = sum;
        } else {
            htmlStrig = '<tr><td colspan="9">העגלה שלך ריקה</td></tr>';
        }

        // מעדכנים את ה-HTML של טבלת עגלת הקניות
        document.getElementById("table_cart").innerHTML = htmlStrig;

    } catch (error) {
        console.error('Error fetching cart:', error);
    }
});

// פונקציה למחיקת שורה מהטבלה ומ-DB
async function deleteRow(id, type) {
    const success = await removeFromDatabase(id, type); // העברת שניהם לפונקציה
    if (success) { 
        var row = document.getElementById("tr" + id);
        if (row) {
            row.remove(); // מוחק את השורה מהטבלה
            await recalculateTotalPrice(); // עדכון הסכום
            updateCartCount(); // עדכון כמות הפריטים
        }
    }
}

async function removeFromDatabase(id, type) {
    const username = localStorage.getItem('UserName'); // או sessionStorage
    if (!username) {
        console.error("User not logged in!");
        return false;
    }

    try {
        const response = await fetch(`/api/cart/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: username, 
                productId: id,
                type: type  // העברת ה-type לשרת
            })
        });

        const result = await response.json();
        updateCartCount();

        if (!response.ok) {
            console.error('Error removing item from cart:', result.message);
            return false;
        } else {
            console.log(`Item ${id} of type ${type} removed successfully from DB`);
            return true;
        }
    } catch (error) {
        console.error('Error contacting server:', error);
        return false;
    }
}

// פונקציה לעדכון הסכום הכולל ב-DB
async function recalculateTotalPrice() {
    const username = localStorage.getItem('UserName')
    if (!username) {
        console.error("User not logged in!");
        return;
    }

    try {
        // בקשה לקבלת העגלה המעודכנת מה-DB
        const response = await fetch(`/api/cart?username=${username}`);
        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to fetch cart:', data.message);
            return;
        }

        var cart = data.cart;
        let sum = 0;

        if (cart && cart.length > 0) {
            for (var i = 0; i < cart.length; i++) {
                sum += cart[i].price * cart[i].amount;
            }
        }

        // עדכון המחיר הכולל ב-HTML
        document.getElementById("total_price").innerHTML = sum;
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

document.getElementById('confirmationCheckbox').addEventListener('change', function() {
    var orderButton = document.getElementById('orderButton');
    orderButton.disabled = !this.checked;
  });

  // Add an event listener to the orderButton
document.getElementById("orderButton").addEventListener("click", function() {
    window.location.href = "payment.html";
});
