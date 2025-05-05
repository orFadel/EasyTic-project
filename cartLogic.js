document.addEventListener('DOMContentLoaded', (event) => {
    updateCartCount();
    loadCart();
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
            htmlStrig += '<th>מספר מוצר</th>';
            htmlStrig += '<th>עיר</th>';   
            htmlStrig += '<th>קטגוריה</th>';
            htmlStrig += '<th>שם</th>';
            htmlStrig += '<th>סוג</th>'; 
            htmlStrig += '<th>כמות</th>';
            htmlStrig += '<th>סכום ביניים</th>';
            htmlStrig += '<th>סה"כ</th>';  
            htmlStrig += '<th>    </th>';
            htmlStrig += '</tr>';

            // לולאה שעוברת על עגלת הקניות ומוסיפה שורות לטבלה
            for (let i = 0; i < cart.length; i++) {
                sum += cart[i].price * cart[i].amount;
                htmlStrig += '<tr id="tr'+cart[i].productId+'">';
                htmlStrig += '<td>'+cart[i].productId+'</td>'; // מספר מוצר
                htmlStrig += '<td>'+cart[i].contry+'</td>'; // עיר
                htmlStrig += '<td>'+cart[i].category+'</td>'; // קטגוריה
                htmlStrig += '<td>'+cart[i].productName+'</td>'; // שם
                htmlStrig += '<td class="type">'+cart[i].type+'</td>'; // סוג
                htmlStrig += '<td>'+cart[i].amount+'</td>'; // כמות
                htmlStrig += '<td>'+cart[i].price+'</td>'; // מחיר ביניים
                htmlStrig += '<td>'+cart[i].price * cart[i].amount+'</td>'; // סה"כ
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

async function loadCart() {
    console.log("טוען עגלת קניות...");

    // נניח שאת מזהה את המשתמש בעזרת username מה-localStorage
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
        var htmlString = '';

        if (cart && cart.length > 0) {
            htmlString += '<tr>';
            htmlString += '<th>מספר מוצר</th>';
            htmlString += '<th>עיר</th>';   
            htmlString += '<th>קטגוריה</th>';
            htmlString += '<th>שם</th>';
            htmlString += '<th>סוג</th>'; 
            htmlString += '<th>כמות</th>';
            htmlString += '<th>סכום ביניים</th>';
            htmlString += '<th>סה"כ</th>';  
            htmlString += '<th>    </th>';
            htmlString += '</tr>';

            // לולאה שעוברת על עגלת הקניות ומוסיפה שורות לטבלה
            for (let i = 0; i < cart.length; i++) {
                sum += cart[i].price * cart[i].amount;
                htmlString += '<tr id="tr'+cart[i].productId+'-'+cart[i].type+'">';
                htmlString += '<td>'+cart[i].productId+'</td>'; // מספר מוצר
                htmlString += '<td>'+cart[i].contry+'</td>'; // עיר
                htmlString += '<td>'+cart[i].category+'</td>'; // קטגוריה
                htmlString += '<td>'+cart[i].productName+'</td>'; // שם
                htmlString += '<td class="type">'+cart[i].type+'</td>'; // סוג
                htmlString += '<td>'+cart[i].amount+'</td>'; // כמות
                htmlString += '<td>'+cart[i].price+'</td>'; // מחיר ביניים
                htmlString += '<td>'+cart[i].price * cart[i].amount+'</td>'; // סה"כ
                htmlString += `<td><button class="deleteFromCart" onclick="deleteRow('${cart[i].productId}', '${cart[i].type}')"> <i class="fas fa-trash"></i></button></td>`;
                htmlString += '</tr>';
            }

            // מעדכנים את המחיר הכולל
            document.getElementById("total_price").innerHTML = sum;
        } else {
            htmlString = '<tr><td colspan="9">העגלה שלך ריקה</td></tr>';
            document.getElementById("total_price").innerHTML = "0";
        }

        // מעדכנים את ה-HTML של טבלת עגלת הקניות
        document.getElementById("table_cart").innerHTML = htmlString;

    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// פונקציה למחיקת שורה מהטבלה ומ-DB
async function deleteRow(id, type) {
    console.log(`מחיקת פריט: ${id}, סוג: ${type}`);

    const success = await removeFromDatabase(id, type); // העברת שניהם לפונקציה
    if (success) { 
        // מחפשים את השורה לפי המזהה המשולב productId + type
        var row = document.getElementById("tr" + id + "-" + type);
        if (row) {
            row.remove(); // מוחק את השורה מהטבלה
            await recalculateTotalPrice(); // עדכון הסכום
            updateCartCount(); // עדכון כמות הפריטים
        } else {
            console.error(`לא נמצאה שורה עם מזהה tr${id}-${type}`);
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

        if (!response.ok) {
            console.error('Error removing item from cart:', result.message);
            return false;
        } else {
            console.log(`Item ${id} of type ${type} removed successfully from DB`);
            updateCartCount(); // עדכון כמות הפריטים
            return true;
        }
    } catch (error) {
        console.error('Error contacting server:', error);
        return false;
    }
}

// פונקציה לעדכון מספר הפריטים בעגלה
async function updateCartCount() {
    const username = localStorage.getItem('UserName') || 
                     (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : null) ||
                     sessionStorage.getItem('username');
    
    if (!username) {
      // אם אין משתמש מחובר, מאפס את מספר הפריטים
      const cartCountElement = document.getElementById('cart-count');
      if (cartCountElement) {
        cartCountElement.textContent = '0';
      }
      return;
    }
    
    // ניסיון לקבל את העגלה מהשרת
    try {
      const response = await fetch(`/api/cart?username=${username}`);
      
      if (!response.ok) {
        throw new Error('שגיאה בטעינת העגלה');
      }
      
      const data = await response.json();
      
      if (data.cart && Array.isArray(data.cart)) {
        let totalItems = 0;
        // חישוב סך כל הפריטים בעגלה
        data.cart.forEach(item => {
          totalItems += item.amount;
        });
        
        // עדכון המספר באייקון העגלה
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
          cartCountElement.textContent = totalItems;
        }
      } else {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
          cartCountElement.textContent = '0';
        }
      }
    } catch (error) {
      console.error('שגיאה בעדכון מספר הפריטים:', error);
      const cartCountElement = document.getElementById('cart-count');
      if (cartCountElement) {
        cartCountElement.textContent = '0';
      }
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
