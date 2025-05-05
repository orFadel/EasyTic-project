function updateCartCount() {
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
