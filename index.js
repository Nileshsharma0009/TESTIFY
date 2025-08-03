    // Show registration form
    document.getElementById('continueBtn').onclick = function () {
      document.getElementById('registrationSection').classList.remove('hidden');
      document.getElementById('loginSection').classList.add('hidden');
    };

    // Show login form
    document.getElementById('showLoginBtn').onclick = function () {
      document.getElementById('loginSection').classList.remove('hidden');
      document.getElementById('registrationSection').classList.add('hidden');
    };

    // Registration logic
    document.getElementById('registrationForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value.trim();

      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);

      document.getElementById('regMsg').textContent = "Registration successful! Please login.";
      setTimeout(() => {
        document.getElementById('registrationSection').classList.add('hidden');
        document.getElementById('loginSection').classList.remove('hidden');
      }, 1000);
    });

    // Enable login button when fields are filled
    document.getElementById('loginForm').addEventListener('input', function () {
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      document.getElementById('loginBtn').disabled = !(email && password);
    });

    // Login logic
    document.getElementById('loginForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      const storedEmail = localStorage.getItem('userEmail');
      const storedPassword = localStorage.getItem('userPassword');

      if (email === storedEmail && password === storedPassword) {
        document.getElementById('loginMsg').textContent = "Login successful!";
        setTimeout(() => {
          document.getElementById('loginSection').classList.add('hidden');
          document.getElementById('nextPageSection').classList.remove('hidden');
        }, 1000);
      } else {
        document.getElementById('loginMsg').textContent = "Invalid email or password.";
      }
    });