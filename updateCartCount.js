<<<<<<< HEAD
function updateCartCount() {
  const username = localStorage.getItem('UserName');
  if (!username) {
    // אם אין משתמש מחובר, מאפס את מספר הפריטים
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = '0';
    }
    return;
  }
  
  // ניסיון לקבל את העגלה מהשרת
  fetch(`/api/cart?username=${username}`)
    .then(response => {
      if (!response.ok) throw new Error('שגיאה בטעינת העגלה');
      return response.json();
    })
    .then(data => {
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
    })
    .catch(error => {
      console.error('שגיאה בעדכון מספר הפריטים:', error);
      // במקרה של שגיאה, ננסה להשתמש בנתונים מקומיים
      if (localStorage.getItem("cart")) {
        try {
          const cart = JSON.parse(localStorage.getItem("cart"));
          let totalItems = 0;
          cart.forEach(item => {
            totalItems += item.amount;
          });
          const cartCountElement = document.getElementById('cart-count');
          if (cartCountElement) {
            cartCountElement.textContent = totalItems;
          }
        } catch (e) {
          console.error('שגיאה בקריאת עגלה מקומית:', e);
          const cartCountElement = document.getElementById('cart-count');
          if (cartCountElement) {
            cartCountElement.textContent = '0';
          }
        }
      } else {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
          cartCountElement.textContent = '0';
        }
      }
    });
}

// טעינת המספר בכניסה לעמוד
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});
=======
// פונקציה שמעדכנת את כמות המוצרים בעגלה מה-DB
async function updateCartCount() {
    try {
      const response = await fetch('/api/updateCartCount', {
        method: 'GET', // נניח שיש לך API שמחזיר את העגלה
        credentials: 'include' // אם אתה צריך לשלוח קוקיז (כגון session cookies)
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch cart data');
      }
  
      const cart = await response.json(); // הנח שהשרת מחזיר את העגלה כמערך
  
      // סוכם את כל הכמויות
      const totalItems = cart.reduce((total, item) => total + item.amount, 0); 
      document.getElementById('cart-count').textContent = totalItems; // עדכון המספר שמופיע על האייקון
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  }

document.addEventListener('DOMContentLoaded', updateCartCount);
>>>>>>> 6ab9571fae77d3e9e904904252e5c58053a79d66
