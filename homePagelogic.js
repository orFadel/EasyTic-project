// Function to get the display name from session storage
function getDisplayNameFromSessionStorage() {
  return sessionStorage.getItem('displayName');
}

// Function to remove the display name from session storage (for logout)
function logoutUser() {
  sessionStorage.removeItem('displayName');
  // Redirect to login page after logout
  window.location.href = 'loginPage.html'; 
}

// Update the content next to the profile icon
function updateProfileContent() {
  const userGreetingElement = document.getElementById('user-greeting');
  const profileLinkElement = document.getElementById('profile-link');

  // Get the display name from session storage
  const displayName = getDisplayNameFromSessionStorage();

  // If there's no display name, set the greeting to "Guest"
  if (!displayName) {
    userGreetingElement.textContent = 'היי, אורח/ת';
    profileLinkElement.href = 'loginPage.html'; // Redirect to login page
  } else {
    userGreetingElement.textContent = `היי, ${displayName}`;
    profileLinkElement.href = 'loginPage.html'; // Use login page for profile link if profilePage.html doesn't exist
  }

  // After loading the information, show the element
  userGreetingElement.style.visibility = 'visible';
}

// Add event listener for the logout icon
document.getElementById('logout-icon').addEventListener('click', function () {
  logoutUser();
});

// Call the function to update the profile content on page load
document.addEventListener('DOMContentLoaded', updateProfileContent);

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // עדכון מספר סוגי הפריטים באייקון
  document.getElementById('cart-count').textContent = cart.length;
}

// קריאה לפונקציה בעת טעינת הדף
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();  // טוען את מספר הפריטים בעגלה מ-localStorage
});






