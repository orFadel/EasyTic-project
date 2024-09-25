document.addEventListener('DOMContentLoaded', (event) => {
  updateCartCount();
});

// Function to get the username from the URL
function getUsernameFromURL() {
  const queryString = window.location.search; //שולף את היוזר מהURL ושומר במשתנה
  const urlParams = new URLSearchParams(queryString);
  //תביא לי את השם שנמצא בתוך הURL
  return urlParams.get('username');
}

// Function to get the username from local storage
function getUsernameFromLocalStorage() {
  return localStorage.getItem('username');
}

// Function to set the username in local storage
function setUsernameInLocalStorage(username) {
  localStorage.setItem('username', username);
}

// פונקציה שמעדכנת את כמות המוצרים בעגלה
function updateCartCount() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var totalItems = cart.reduce((total, item) => total + item.amount, 0); // סוכם את כל הכמויות
  document.getElementById('cart-count').textContent = totalItems; // עדכון המספר שמופיע על האייקון
}

// Update the content next to the profile icon
function updateProfileContent() {
  const userGreetingElement = document.getElementById('user-greeting');//  האיזור שבו מופיע ההי אורחת
  const profileLinkElement = document.getElementById('profile-link');// זה ממש ההי אורחת

  const usernameFromURL = getUsernameFromURL();// יכנס לי לתוך המשתנה החדש השם שהוכנס בPROMPT 
  const usernameFromLocalStorage = getUsernameFromLocalStorage();//אם השם שלי נמצא בלוקל סטוררג

  // Use the username from the URL if available, otherwise use the one from local storage
//
  const username = usernameFromURL || usernameFromLocalStorage;

  if (username && userGreetingElement && profileLinkElement) {
    userGreetingElement.textContent = `היי, ${username}`;
    // Update the profile link href to include the username
    profileLinkElement.href = `loginPage.html?username=${username}`;

    // Set the username in local storage for future use
    setUsernameInLocalStorage(username);
  }
}

// Call the function to update the profile content on page load
//השורה הנל מתבצעת בכל רענון לדף
updateProfileContent();
