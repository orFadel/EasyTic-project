function showPopup() {
    // Clear cart local storage
    localStorage.removeItem('cart');
  
    // Generate a random 6-digit order number
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
  
    // Show the loading spinner
    document.getElementById('loading').style.display = 'block';
  
    // Simulate a delay 
    setTimeout(function () {
        // Hide the loading spinner
        document.getElementById('loading').style.display = 'none';
  
        // Show the pop-up message
        document.getElementById('popup').style.display = 'block';
  
        // Display the random order number
        document.getElementById('order-number-value').textContent = orderNumber;
  
        // Redirect to homePage.html after 3 seconds
        setTimeout(function() {
            window.location.href = "homePage.html";
        }, 3000); // 3 seconds delay
    }, 3000); // 3 seconds delay
  
    // Prevent form submission
    return false;
}

  
function closePopup() {
    // Close the pop-up message
    document.getElementById('popup').style.display = 'none';
}
  
function formatCardNumber(input) {
    // Remove non-numeric characters
    let cardNumber = input.value.replace(/\D/g, '');
    // Insert space every 4 digits
    cardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Update input value
    input.value = cardNumber;
}
