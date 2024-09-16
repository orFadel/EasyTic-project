window.addEventListener('load', function() {
    console.log("start");
    let sum = 0;
    var cart = JSON.parse(localStorage.getItem("cart"));
    var htmlStrig = '';
    if(localStorage.getItem("cart") && localStorage.getItem("cart").length){
        let sum = 0;
        let contry1= null;
        let contry2= null;
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
            for (let i = 0; i < cart.length; i++) {
                sum += cart[i].price * cart[i].amount;
                htmlStrig += '<tr id="tr'+cart[i].id+'">';
                htmlStrig += '<td>'+cart[i].price * cart[i].amount+'</td>'; //סה"כ
                htmlStrig += '<td>'+cart[i].price+'</td>'; //מחיר ביניים
                htmlStrig += '<td>'+cart[i].amount+'</td>'; //כמות
                htmlStrig += '<td class="type">'+cart[i].type+'</td>'; //סוג
                htmlStrig += '<td>'+cart[i].name+'</td>'; //שם
                htmlStrig += '<td>'+cart[i].category+'</td>'; //קטגוריה
                htmlStrig += '<td>'+cart[i].contry+'</td>'; //עיר
                htmlStrig += '<td>'+cart[i].id+'</td>'; //מספר מוצר
                htmlStrig += '<td><button class="deleteFromCart" onclick="deleteRow('+cart[i].id+')"> <i class="fas fa-trash"></i></button></td>';
                htmlStrig += '</tr>';
            }
            this.document.getElementById("total_price").innerHTML = sum;
        }
        document.getElementById("table_cart").innerHTML = htmlStrig;
});

function deleteRow(id) {
    var row = document.getElementById("tr" + id);
    if (row) {
        row.remove();
        // Remove the item from local storage
        removeFromLocalStorage(id);
        // Update the total price
        recalculateTotalPrice();
    }
}

function removeFromLocalStorage(id) {
    var cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === id) {
                cart.splice(i, 1); // Remove the item from the array
                break; // Exit the loop since the item is found and removed
            }
        }
        localStorage.setItem("cart", JSON.stringify(cart)); // Update the local storage
    }
}

function recalculateTotalPrice() {
    var cart = JSON.parse(localStorage.getItem("cart"));
    var sum = 0;
    if (cart) {
        for (var i = 0; i < cart.length; i++) {
            sum += cart[i].price * cart[i].amount;
        }
    }
    document.getElementById("total_price").innerHTML = sum;
}

document.getElementById('confirmationCheckbox').addEventListener('change', function() {
    var orderButton = document.getElementById('orderButton');
    orderButton.disabled = !this.checked;
  });

  // Add an event listener to the orderButton
document.getElementById("orderButton").addEventListener("click", function() {
    window.location.href = "payment.html";
});
