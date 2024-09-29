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
