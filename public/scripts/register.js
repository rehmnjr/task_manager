
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Toggle password visibility
togglePassword.addEventListener('click', function () {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    confirmPasswordInput.type = type;

    // Change the icon based on visibility
    if (type === 'password') {
        togglePassword.classList = 'fa-solid fa-eye';  // Open eye icon (show password)
    } else {
        togglePassword.classList = 'fa-solid fa-eye-slash';  // Closed eye icon (hide password)
    }
});


async function handleRegister(event) {
    // event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch(
            '/auth/register',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Display success message
            localStorage.setItem('username', username);
            window.location.href = 'login.html'; // Redirect to login page after successful sign-up
        } else {
            alert(data.message); // Display error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
}