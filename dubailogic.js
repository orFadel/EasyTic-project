document.addEventListener('DOMContentLoaded', (event) => {
  updateCartCount();
  console.log(localStorage.getItem('UserName'));
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

async function addCart(id) {
  var container = document.querySelector('[data-id="'+id+'"]');
  var name = container.getAttribute('data-name');
  var category = container.getAttribute('data-category');
  var contry = container.getAttribute('data-contry');
  var cartItems = [];
  
  container.querySelectorAll('.ticket-category').forEach(ticket => {
    if(ticket.getAttribute('data-type')){
      if(parseInt(ticket.querySelector('.amount').textContent) != 0){
        let item = {
          id: id,
          name: name,
          category: category,
          contry: contry,
          type: ticket.getAttribute('data-type'),
          price: parseInt(ticket.querySelector('.price').textContent.replace('₪', '')),
          amount: parseInt(ticket.querySelector('.amount').textContent)
        };
        
        // Update local storage
        if(localStorage.getItem("cart") && localStorage.getItem("cart").length){
          var cart = JSON.parse(localStorage.getItem("cart"));
          var exist = false;
          for (let i = 0; i < cart.length; i++) {
            if(cart[i].id == item.id && cart[i].type == item.type){
              cart[i].amount += item.amount;
              exist = true;
            }
          }
          if(!exist){
            cart.push(item);
          }
          localStorage.setItem("cart", JSON.stringify(cart));
        } else {
          localStorage.setItem("cart", JSON.stringify([item]));
        }
        
        // Add item to cartItems array
        cartItems.push(item);
      }      
    } 
  });
  
  const username = localStorage.getItem('UserName');
  if (username) {
    fetch('http://localhost:2001/api/cart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, cart: cartItems })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => console.log('Cart updated:', data))
    .catch(error => console.error('Error updating cart:', error));  
  } else {
    console.error('Username not found in localStorage');
  }  

  // Auto close canvas and update cart count
  $('.offcanvas.show').offcanvas('hide');
  updateCartCount();
  location.reload();  
}


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






