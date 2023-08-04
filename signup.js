    // Get references to the form and button elements
    const signupForm = document.getElementById('signup-form');
    const signupButton = document.getElementById('signup-button');

    // Function to handle form submission
    function handleFormSubmission(event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      // Perform validation (You can add more validation logic here)
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      // Perform further actions, e.g., sending data to the server, etc.
      
      // Fetch API POST request to the server
      fetch('/signup', {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ username,email, confirmPassword })
      }).then(function(res) {
        if(res.status==401){alert("email already exist");return;}
        console.log(";klkjiokj");
        window.location.href = '/login';      });
    }
    alert(`Sign up successful!\nUsername: ${username}\nEmail: ${email}`);

    // Add event listener to the "Sign Up" button
    signupButton.addEventListener('click', handleFormSubmission);


// Add event listener to the "Sign Up" button

