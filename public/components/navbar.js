function navbar() {
    // Return the updated navbar HTML structure
    return `
        <header class="header">
            <style>
                .header {
                    background-color: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid #e5e7eb;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1rem 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .brand {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .brand svg {
                    height: 1.5rem;
                    width: 1.5rem;
                    color: #4F46E5;
                }
                .brand h1 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    background: linear-gradient(to right, #4F46E5, rgba(79, 70, 229, 0.6));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .navbar-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .username {
                    font-size: 0.875rem;
                    color: #4B5563;
                }
                .logout-button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background-color: transparent;
                    border: none;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #1F2937;
                    cursor: pointer;
                    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
                }
                .logout-button:hover {
                    background-color: #F3F4F6;
                    color: #111827;
                }
                .logout-button svg {
                    height: 1rem;
                    width: 1rem;
                }
            </style>
            <div class="container">
                <div class="brand">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
                    <h1>Task Manager</h1>
                </div>
                <div class="navbar-right">
                    <span class="username">Welcome, User</span>
                    <button class="logout-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    `;
}

function handleNavbarLogic() {
    const userElement = document.querySelector('.username');

    // Function to get a cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Get the authToken from cookies
    const authToken = getCookie('authToken');
    if (!authToken) {
        window.location.href = './login.html';
        return;
    }

    try {
        // Decode the JWT token to extract user information
        const payload = JSON.parse(atob(authToken.split('.')[1])); // Decode base64 payload
        const username = payload.username; // Ensure username is present in the payload

        if (userElement && username) {
            userElement.innerText = `Welcome, ${username}`;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        window.location.href = './login.html';
    }

    // Logout functionality
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = './login.html';
        });
    }
}

export { navbar, handleNavbarLogic };
