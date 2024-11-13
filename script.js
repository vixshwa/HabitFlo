function showSignup() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('signup-container').classList.remove('hidden');
    document.getElementById('auth-container').classList.add('hidden');
}

function showLogin() {
    document.getElementById('signup-container').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('auth-container').classList.add('hidden');
}

function showAuth() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('signup-container').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
}

function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid login credentials');
        }
    })
    .catch(err => console.error(err));
}

function signupUser() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        document.getElementById('signup-error').classList.remove('hidden');
        return;
    }

    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Signup successful');
            showLogin();
        } else {
            alert('Signup failed');
        }
    })
    .catch(err => console.error(err));
}
