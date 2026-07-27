import { appState } from '../appState';
import { showToast } from '../toast';
import { ASSETS } from '../assets';

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
      <div class="auth-brand-card">
        <img
          src="${ASSETS.logoFull}"
          alt="Nana the App"
          class="auth-logo nana-auth-face"
        />
        <span class="auth-brand-status">Secure family care account</span>
      </div>

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
          autocomplete="name"
          placeholder="Your name"
        />
      </label>

      <label class="settings-field">
        Email
        <input
          class="auth-email"
          type="email"
          inputmode="email"
          autocomplete="email"
          placeholder="you@email.com"
        />
      </label>

      <label class="settings-field">
        Password
        <input
          class="auth-password"
          type="password"
          autocomplete="current-password"
          minlength="6"
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
  let isBusy = false;

  function setBusy(nextBusy, message = '') {
    isBusy = nextBusy;
    screen.classList.toggle('auth-screen--busy', nextBusy);
    screen.setAttribute('aria-busy', String(nextBusy));
    registerButton.disabled = nextBusy;
    loginButton.disabled = nextBusy;
    nameInput.disabled = nextBusy;
    emailInput.disabled = nextBusy;
    passwordInput.disabled = nextBusy;
    modeButtons.forEach((button) => {
      button.disabled = nextBusy;
    });

    if (message) status.textContent = message;
  }

  function validateCredentials({ requireName = false } = {}) {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (requireName && !nameInput.value.trim()) {
      status.textContent = 'Please enter your full name.';
      nameInput.focus();
      return false;
    }

    if (!email || !email.includes('@')) {
      status.textContent = 'Please enter a valid email address.';
      emailInput.focus();
      return false;
    }

    if (!password || password.length < 6) {
      status.textContent = 'Password must be at least 6 characters.';
      passwordInput.focus();
      return false;
    }

    return true;
  }

  function setAuthMode(mode) {
    authMode = mode;
    const isLogin = mode === 'login';

    screen.dataset.authMode = mode;
    nameField.hidden = isLogin;
    registerButton.hidden = isLogin;
    loginButton.hidden = !isLogin;
    passwordInput.autocomplete = isLogin ? 'current-password' : 'new-password';
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
      if (isBusy) return;
      setAuthMode(button.dataset.authMode);
    });
  });

  setAuthMode(authMode);

  registerButton
    .addEventListener('click', async () => {
      if (isBusy || !validateCredentials({ requireName: true })) return;

      setBusy(true, 'Creating secure Nana account...');

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
      } finally {
        setBusy(false);
      }
    });

  loginButton
    .addEventListener('click', async () => {
      if (isBusy || !validateCredentials()) return;

      setBusy(true, 'Signing you in...');

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
      } finally {
        setBusy(false);
      }
    });

  screen
    .querySelector('.auth-skip')
    .addEventListener('click', () => {
      if (isBusy) return;
      showToast('Testing mode opened');
      goNext();
    });

  app.append(screen);
}
