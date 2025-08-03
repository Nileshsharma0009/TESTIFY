document.addEventListener('DOMContentLoaded', () => {
  // Registration Handler
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const data = Object.fromEntries(formData);

      if (data.password !== data.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message);

        if (res.ok) {
          // After successful registration, redirect to login
          window.location.href = 'login.html';
        }
      } catch (err) {
        console.error(err);
        alert('Registration failed. Please try again.');
      }
    });
  }

  // Login Handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData);

      try {
        const res = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
          alert('Login successful');
          localStorage.setItem('token', result.token); // Save token
          window.location.href = 'test.html'; // Replace with your actual next page
        } else {
          alert(result.message || 'Invalid credentials');
        }
      } catch (err) {
        console.error(err);
        alert('Login failed. Please try again.');
      }
    });
  }
});



