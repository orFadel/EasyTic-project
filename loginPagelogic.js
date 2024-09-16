function handleLogin() {
  const usernameInput = document.getElementById('uname');
  const passwordInput = document.getElementById('password');

  // Check if username and password fields are not empty
  if (usernameInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
    // Validate username (6 letters only)
    const usernameRegex = /^[A-Za-z]{6}$/;
    if (usernameRegex.test(usernameInput.value.trim())) {
      // Validate password (8 letters and numbers)
      const passwordRegex = /^[A-Za-z0-9]{8}$/;
      if (passwordRegex.test(passwordInput.value.trim())) {
        const name = prompt('Please enter your name:');

        // Check if the name is not empty
        if (name && name.trim() !== '') {
          alert(`Welcome, ${name}! Redirecting to the home page.`);
          
          // Redirect to the home page
          window.location.href = `homePage.html?username=${name}`;
        } else {
          alert('Name is required. Please try again.');
        }
      } else {
        alert('Password must be 8 characters long and contain only letters and numbers (0-9).');
      }
    } else {
      alert('Username must be 6 characters long and contain only letters.');
    }
  } else {
    alert('Both username and password are required. Please fill them out.');
  }
}

  // Get password input and eye icon elements
  const passwordInput = document.getElementById('password');
  const togglePasswordIcon = document.getElementById('togglePassword');

  // Add click event listener to toggle password visibility
  togglePasswordIcon.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
  });
