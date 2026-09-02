document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }));

    // Client-side Validation for Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            let valid = true;
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            const submitBtn = loginForm.querySelector('.submit-btn');

            emailError.textContent = '';
            passwordError.textContent = '';

            if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
                emailError.textContent = 'Please enter a valid email address.';
                valid = false;
            }

            if (!password.value) {
                passwordError.textContent = 'Password is required.';
                valid = false;
            }

            if (!valid) {
                e.preventDefault();
            } else {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Logging in...';
            }
        });
    }

    // Client-side Validation for Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            let valid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            const confirmPasswordError = document.getElementById('confirmPasswordError');
            const submitBtn = registerForm.querySelector('.submit-btn');

            nameError.textContent = '';
            emailError.textContent = '';
            passwordError.textContent = '';
            confirmPasswordError.textContent = '';

            if (!name.value.trim()) {
                nameError.textContent = 'Name is required.';
                valid = false;
            }

            if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
                emailError.textContent = 'Please enter a valid email address.';
                valid = false;
            }

            if (password.value.length < 6) {
                passwordError.textContent = 'Password must be at least 6 characters.';
                valid = false;
            }

            if (password.value !== confirmPassword.value) {
                confirmPasswordError.textContent = 'Passwords do not match.';
                valid = false;
            }

            if (!valid) {
                e.preventDefault();
            } else {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Registering...';
            }
        });
    }

    // Debounce Search input (Optional UX enhancement)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let timeout = null;
        searchInput.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                // Could trigger AJAX here, but simple form submit works for this req
                // document.getElementById('searchForm').submit(); 
            }, 500);
        });
    }
});
