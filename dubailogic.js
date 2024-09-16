// Prices for each category (can be dynamic based on selected canvas)
const prices = {
  adult: 50,
  child: 30,
  infant: 10
};

// Selected amounts for each category
const amounts = {
  adult: 0,
  child: 0,
  infant: 0
};

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


function setCanvasPrices(canvasId, callback) {
  switch (canvasId) {
    case 'canvas1':
      prices.adult = 95;
      prices.child = 79;
      prices.infant = 0;
      break;
    case 'canvas2':
      prices.adult = 95;
      prices.child = 69;
      prices.infant = 0;
      break;
    case 'canvas3':
      prices.adult = 49;
      prices.child = 29;
      prices.infant = 0;
      break;
    case 'canvas4':
      prices.adult = 185;
      prices.child = 149;
      prices.infant = 0;
      break;
    case 'canvas5':
      prices.adult = 309;
      prices.child = 269;
      prices.infant = 0;
      break;
    case 'canvas6':
      prices.adult = 179;
      prices.infant = 0;
      break;
    case 'canvas7':
      prices.adult = 22;
      prices.infant = 0;
      break;
    case 'canvas8':
      prices.adult = 89;
      prices.child = 79;
      prices.infant = 0;
      break;
    case 'canvas9':
      prices.adult = 0;
      prices.child = 0;
      prices.infant = 0;
      break;
    case 'canvas10':
      prices.adult = 0;
      prices.infant = 0;
      break;
    case 'canvas11':
      prices.adult = 0;
      prices.infant = 0;
      break;
    case 'canvas12':
      prices.adult = 0;
      prices.child = 0;
      prices.infant = 0;
      break;
    default:
      break;
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

// Set initial prices for each canvas with callback to updateTotalPrice
setCanvasPrices('canvas1', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas1"]'));
});

setCanvasPrices('canvas2', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas2"]'));
});

setCanvasPrices('canvas3', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas3"]'));
});

setCanvasPrices('canvas4', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas4"]'));
});

setCanvasPrices('canvas5', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas5"]'));
});

setCanvasPrices('canvas6', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas6"]'));
});

setCanvasPrices('canvas7', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas7"]'));
});

setCanvasPrices('canvas8', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas8"]'));
});

setCanvasPrices('canvas9', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas9"]'));
});

setCanvasPrices('canvas10', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas10"]'));
});

setCanvasPrices('canvas11', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas11"]'));
});

setCanvasPrices('canvas12', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas12"]'));
});

setCanvasPrices('canvas13', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas9"]'));
});

setCanvasPrices('canvas14', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas10"]'));
});

setCanvasPrices('canvas15', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas11"]'));
});

setCanvasPrices('canvas16', function() {
  updateTotalPrice(document.querySelector('.ticket-container[data-canvas="canvas12"]'));
});



