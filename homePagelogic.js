// Function to get the username from the URL
function getUsernameFromURL() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
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

// Update the content next to the profile icon
function updateProfileContent() {
  const userGreetingElement = document.getElementById('user-greeting');
  const profileLinkElement = document.getElementById('profile-link');

  const usernameFromURL = getUsernameFromURL();
  const usernameFromLocalStorage = getUsernameFromLocalStorage();

  // Use the username from the URL if available, otherwise use the one from local storage
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
updateProfileContent();
