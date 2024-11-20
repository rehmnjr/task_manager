
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const form = document.getElementById('login-form');

// Toggle password visibility
togglePassword.addEventListener('click', function () {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    // Change the icon based on visibility
    if (type === 'password') {
        togglePassword.classList = 'fa-solid fa-eye';  // Open eye icon (show password)
    } else {
        togglePassword.classList = 'fa-solid fa-eye-slash';  // Closed eye icon (hide password)
    }
});

// Function to set a cookie
function setCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000); // Convert hours to milliseconds
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from submitting normally

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Save JWT token to cookie for 1 hour
            setCookie('authToken', data.token, 1);

            // Redirect to home page
            window.location.href = '/';
        } else {
            alert(data.message); // Display error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});

// Redirect to Sign Up page when "Sign Up" button is clicked
document.getElementById('sign').addEventListener('click', () => {
    window.location.href = 'register.html'; // Redirect to register.html
});
