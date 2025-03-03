document.addEventListener('DOMContentLoaded', (event) => {
  updateCartCount();
  console.log("מצב התחברות:", localStorage.getItem('UserName'));
});

function increaseAmount(category, amountElement) {
  const amountSpan = amountElement.parentElement.querySelector('.amount');
  const amountValue = parseInt(amountSpan.textContent);
  amountSpan.textContent = amountValue + 1;
  updateTotalPrice(amountElement.closest('.ticket-container')); //יעדכן מחיר סופי
}

function decreaseAmount(category, amountElement) {
  const amountSpan = amountElement.parentElement.querySelector('.amount');
  const amountValue = parseInt(amountSpan.textContent);
  if (amountValue > 0) {
    amountSpan.textContent = amountValue - 1;
    updateTotalPrice(amountElement.closest('.ticket-container'));
  }
}

async function testCartAdd() {
  const username = localStorage.getItem('UserName');
  if (!username) {
    console.error("יש להתחבר למערכת");
    return;
  }
  
  const testItem = {
    id: "1000",
    name: "מוצר בדיקה",
    category: "קטגוריה",
    contry: "דובאי",
    type: "adult",
    price: 100,
    amount: 1
  };
  
  try {
    const response = await fetch('/api/cart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        username: username,
        cart: [testItem]
      })
    });
    
    const text = await response.text();
    console.log('סטטוס תגובה:', response.status);
    console.log('תוכן תגובה:', text);
    
    if (!response.ok) {
      throw new Error(`שגיאת שרת: ${response.status} - ${text}`);
    }
    
    alert("פריט בדיקה נוסף בהצלחה");
    updateCartCount();
  } catch (error) {
    console.error('שגיאה בבדיקה:', error);
    alert("נכשלה הוספת פריט בדיקה: " + error.message);
  }
}

async function addCart(id) {
  // בדיקה אם המשתמש מחובר
  const username = localStorage.getItem('UserName');
  if (!username) {
    alert("יש להתחבר למערכת לפני הוספת פריטים לעגלה");
    window.location.href = "loginPage.html";
    return;
  }

  var container = document.querySelector('[data-id="'+id+'"]');
  if (!container) {
    console.error("לא נמצא מיכל עם מזהה " + id);
    return;
  }

  var name = container.getAttribute('data-name');
  var category = container.getAttribute('data-category');
  var contry = container.getAttribute('data-contry');
  var cartItems = [];
  var itemAdded = false; // דגל שמציין אם הוספנו פריט כלשהו
  
  container.querySelectorAll('.ticket-category').forEach(ticket => {
    if(ticket.getAttribute('data-type')){
      const amount = parseInt(ticket.querySelector('.amount').textContent);
      if(amount > 0){
        itemAdded = true;
        let price = ticket.querySelector('.price').textContent.replace('₪', '').trim();
        price = parseInt(price);
        
        let item = {
          id: id, // שם השדה כפי שהשרת מצפה לקבל
          name: name,
          category: category,
          contry: contry,
          type: ticket.getAttribute('data-type'),
          price: price,
          amount: amount
        };
        
        cartItems.push(item);
      }      
    } 
  });
  
  if (!itemAdded) {
    alert("נא לבחור לפחות פריט אחד להוספה");
    return;
  }

  try {
    console.log('שליחת נתונים לשרת:', { username, cart: cartItems });
    
    // שליחת הנתונים לשרת - שימוש ב-cart במקום items כדי להתאים לשרת
    const response = await fetch('/api/cart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        username: username, 
        cart: cartItems 
      })
    });

    console.log('תגובה התקבלה:', response.status, response.statusText);

    // ניסיון לקרוא את תוכן התגובה
    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      responseData = await response.json();
      console.log('תגובת JSON:', responseData);
    } else {
      responseData = await response.text();
      console.log('תגובת טקסט:', responseData);
    }

    if (!response.ok) {
      throw new Error(`שגיאת שרת: ${response.status} - ${responseData}`);
    }

    console.log('העגלה עודכנה בהצלחה:', responseData);
    
    // איפוס כמויות
    container.querySelectorAll('.ticket-category .amount').forEach(amountEl => {
      amountEl.textContent = '0';
    });
    container.querySelector('#total-price').textContent = '₪0';
    
    // עדכון מספר הפריטים בעגלה
    updateCartCount();
    
    // סגירת החלונית
    if (typeof $ !== 'undefined') {
      $('.offcanvas.show').offcanvas('hide');
    } else {
      const openCanvas = document.querySelector('.offcanvas.show');
      if (openCanvas) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(openCanvas);
        if (bsOffcanvas) bsOffcanvas.hide();
      }
    }

    alert("הפריטים נוספו בהצלחה לעגלת הקניות!");
  } catch (error) {
    console.error('שגיאה מפורטת בעדכון העגלה:', error);
    alert("אירעה שגיאה בהוספת הפריטים לעגלה. נא לנסות שוב מאוחר יותר.");
  }
}

function updateTotalPrice(container) {
  const getPriceAndAmount = (type) => {
    const priceElement = container.querySelector(`.ticket-category[data-type="${type}"] .price`);
    const amountElement = container.querySelector(`.ticket-category[data-type="${type}"] .amount`);
    
    if (!priceElement || !amountElement) return { type, price: 0, amount: 0 };
    
    const priceText = priceElement.textContent.replace('₪', '').trim();
    return {
      type: type,
      price: parseInt(priceText),
      amount: parseInt(amountElement.textContent)
    };
  };
  
  const adult = getPriceAndAmount('adult');
  const child = getPriceAndAmount('child');
  const infant = getPriceAndAmount('infant');

  let total = 0;

  if (adult.amount > 0) {
    total += adult.price * adult.amount;
  }

  if (child.amount > 0) {
    total += child.price * child.amount;
  }

  if (infant.amount > 0) {
    total += infant.price * infant.amount;
  }
  
  // עדכון המחיר הכולל
  const totalElement = container.querySelector('#total-price');
  if (totalElement) {
    totalElement.textContent = `₪${total}`;
  }
}

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
      const cartCountElement = document.getElementById('cart-count');
      if (cartCountElement) {
        cartCountElement.textContent = '0';
      }
    });
}