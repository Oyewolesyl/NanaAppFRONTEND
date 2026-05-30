import { appState } from '../appState';
import { showToast } from '../toast';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://nanaappbackend.onrender.com';

export function renderAuthScreen(app) {
  app.innerHTML = '';

  const screen = document.createElement('main');
  screen.className = 'screen select-role-screen auth-screen';

  screen.insertAdjacentHTML(
    'beforeend',
    `
      <img
        src="/ani1.svg"
        alt="Nana"
        class="auth-logo nana-auth-face"
      />

      <h1 class="screen-title">Welcome</h1>

      <p class="auth-copy">
        Create your account to start using Nana.
      </p>

      <div class="auth-mode-switch" aria-label="Choose authentication mode">
        <button type="button" class="auth-mode-button auth-mode-button--active" data-auth-mode="signup">
          Sign up
        </button>
        <button type="button" class="auth-mode-button" data-auth-mode="login">
          Login
        </button>
      </div>

      <label class="settings-field">
        Full Name
        <input
          class="auth-name"
          type="text"
          placeholder="Your name"
        />
      </label>

      <label class="settings-field">
        Email
        <input
          class="auth-email"
          type="email"
          placeholder="you@email.com"
        />
      </label>

      <label class="settings-field">
        Password
        <input
          class="auth-password"
          type="password"
          placeholder="Password"
        />
      </label>

      <button
        type="button"
        class="continue-button auth-register auth-compact-button"
      >
        Create Account
      </button>

      <button
        type="button"
        class="continue-button auth-login auth-compact-button"
        hidden
      >
        Login
      </button>

      <button
        type="button"
        class="settings-link auth-skip"
      >
        Skip for testing
      </button>

      <p class="auth-status"></p>
    `
  );

  const logo = screen.querySelector('.nana-auth-face');

  logo.src = '/ani1.svg';

  setTimeout(() => {
    logo.src = '/ani2.svg';

    setTimeout(() => {
      logo.src = '/ani3.svg';
    }, 600);
  }, 500);

  const emailInput = screen.querySelector('.auth-email');
  const passwordInput = screen.querySelector('.auth-password');
  const nameInput = screen.querySelector('.auth-name');
  const nameField = nameInput.closest('.settings-field');
  const status = screen.querySelector('.auth-status');
  const copy = screen.querySelector('.auth-copy');
  const registerButton = screen.querySelector('.auth-register');
  const loginButton = screen.querySelector('.auth-login');
  const modeButtons = screen.querySelectorAll('.auth-mode-button');
  let authMode = 'signup';

  function setAuthMode(mode) {
    authMode = mode;
    const isLogin = mode === 'login';

    screen.dataset.authMode = mode;
    nameField.hidden = isLogin;
    registerButton.hidden = isLogin;
    loginButton.hidden = !isLogin;
    copy.textContent = isLogin
      ? 'Welcome back. Sign in to continue.'
      : 'Create your account to start using Nana.';
    status.textContent = '';

    modeButtons.forEach((button) => {
      button.classList.toggle(
        'auth-mode-button--active',
        button.dataset.authMode === mode
      );
    });
  }

  const goNext = () => {
    window.location.hash =
      appState.children.length
        ? '#child-added'
        : '#homepage-newuser';
  };

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setAuthMode(button.dataset.authMode);
    });
  });

  setAuthMode(authMode);

  registerButton
    .addEventListener('click', async () => {
      if (!nameInput.value.trim()) {
        status.textContent = 'Please enter your full name.';
        return;
      }

      status.textContent = 'Creating account...';

      try {
        const response = await fetch(
          `${API_URL}/api/auth/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: emailInput.value.trim(),
              password: passwordInput.value,
              role: 'parent',
              full_name: nameInput.value.trim(),
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        status.textContent =
          'Account created. Please login.';
        showToast('Account created. Please login.');
        setAuthMode('login');
      } catch (err) {
        status.textContent =
          err?.message || 'Registration failed';
        showToast(status.textContent, 'error');
      }
    });

  loginButton
    .addEventListener('click', async () => {
      status.textContent = 'Signing in...';

      try {
        const response = await fetch(
          `${API_URL}/api/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: emailInput.value.trim(),
              password: passwordInput.value,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        localStorage.setItem(
          'nana_access_token',
          data.access_token
        );

        localStorage.setItem(
          'nana_user',
          JSON.stringify(data.user)
        );

        showToast('Signed in');
        goNext();
      } catch (err) {
        status.textContent =
          err?.message || 'Login failed';
        showToast(status.textContent, 'error');
      }
    });

  screen
    .querySelector('.auth-skip')
    .addEventListener('click', () => {
      showToast('Testing mode opened');
      goNext();
    });

  app.append(screen);
}
