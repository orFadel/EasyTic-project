document.addEventListener('DOMContentLoaded', (event) => {
  updateCartCount();
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

function addCart(id) {
  var container = document.querySelector('[data-id="'+id+'"]');
  var name = container.getAttribute('data-name');
  var category = container.getAttribute('data-category');
  var contry = container.getAttribute('data-contry');
  container.querySelectorAll('.ticket-category').forEach(ticket => {
    if(ticket.getAttribute('data-type')){
      if(parseInt(ticket.querySelector('.amount').textContent) != 0){
        item = {
          id:id,
          name: name,
          category: category,
          contry: contry,
          type: ticket.getAttribute('data-type'),
          price: parseInt(ticket.querySelector('.price').textContent.replace('₪', '')),
          amount: parseInt(ticket.querySelector('.amount').textContent)
        };
        if(localStorage.getItem("cart") && localStorage.getItem("cart").length){
          var cart = JSON.parse(localStorage.getItem("cart"));
          // check if item exist
          var exist = false;
          for (let i = 0; i < cart.length; i++) {
            if(cart[i].id == item.id && cart[i].type == item.type){
              cart[i].amount = cart[i].amount + item.amount;
              exist = true;
            }
          }
          if(!exist){
            cart.push(item);
          }
          localStorage.setItem("cart", JSON.stringify(cart));
        }else{
          localStorage.setItem("cart", JSON.stringify([item]));
        }
      }      
    } 
  });
//   הסגירת הקאנבס אוטומטית
$('.offcanvas.show').offcanvas('hide');
// עדכון מספר המוצרים בעגלה
updateCartCount();
}

// פונקציה שמעדכנת את כמות המוצרים בעגלה
function loadCartCount() {
  var cart = JSON.parse(localStorage.getItem("cart"));
  var distinctItemsCount = cart ? cart.length : 0;  // סופרים את מספר הפריטים השונים בעגלה
  document.getElementById('cart-count').textContent = distinctItemsCount;
}

document.addEventListener('DOMContentLoaded', function() {
  loadCartCount();  // טוען את מספר הפריטים בעגלה
});


function updateTotalPrice(container) {
  const getPriceAndAmount = (type) => ({
    type: type,
    price: parseInt(container.querySelector(`.ticket-category[data-type="${type}"] .price`).textContent.replace('₪', '')),
    amount: parseInt(container.querySelector(`.ticket-category[data-type="${type}"] .amount`).textContent)
  });
  
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
  
  // Update the total price in the HTML
  container.querySelector('#total-price').textContent = `₪${total}`;
}

  // Update displayed prices
  const adultPriceElement = document.querySelector('.ticket-category[data-type="adult"] .price');
  const childPriceElement = document.querySelector('.ticket-category[data-type="child"] .price');
  const infantPriceElement = document.querySelector('.ticket-category[data-type="infant"] .price');

  if (adultPriceElement && childPriceElement && infantPriceElement) {
    adultPriceElement.textContent = `₪${prices.adult}`;
    childPriceElement.textContent = `₪${prices.child}`;
    infantPriceElement.textContent = `₪${prices.infant}`;
  }

  // Call the callback function after updating prices
  if (typeof callback === 'function') {
    callback();
  }
}



