import { ASSETS } from '../assets';
import { appState } from '../appState';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://nanaappbackend.onrender.com';

export function renderAuthScreen(app) {
  app.innerHTML = '';

  const screen = document.createElement('main');

  screen.className =
    'screen select-role-screen auth-screen';

  screen.insertAdjacentHTML(
    'beforeend',
    `
      <img
        src="${ASSETS.splashHeaderLogo}"
        alt="Nana"
        class="auth-logo nana-wink-logo"
      />

      <h1 class="screen-title">Welcome</h1>

      <p class="auth-copy">
        Create an account or sign in.
      </p>

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

      <label class="settings-field">
        Role
        <select class="auth-role">
          <option value="parent">Parent / Guardian</option>
          <option value="doctor">Doctor</option>
        </select>
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

  const emailInput =
    screen.querySelector('.auth-email');

  const passwordInput =
    screen.querySelector('.auth-password');

  const nameInput =
    screen.querySelector('.auth-name');

  const roleInput =
    screen.querySelector('.auth-role');

  const status =
    screen.querySelector('.auth-status');

  const goNext = () => {
    window.location.hash =
      appState.children.length
        ? '#child-added'
        : '#homepage-newuser';
  };

  screen
    .querySelector('.auth-register')
    .addEventListener('click', async () => {
      status.textContent = 'Creating account...';

      try {
        const response = await fetch(
          `${API_URL}/api/auth/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              email: emailInput.value.trim(),
              password:
                passwordInput.value,
              role: roleInput.value,
              full_name:
                nameInput.value.trim(),
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              'Registration failed'
          );
        }

        status.textContent =
          'Account created. Please login.';
      } catch (err) {
        status.textContent =
          err.message;
      }
    });

  screen
    .querySelector('.auth-login')
    .addEventListener('click', async () => {
      status.textContent =
        'Signing in...';

      try {
        const response = await fetch(
          `${API_URL}/api/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              email: emailInput.value.trim(),
              password:
                passwordInput.value,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Login failed'
          );
        }

        localStorage.setItem(
          'nana_access_token',
          data.access_token
        );

        localStorage.setItem(
          'nana_user',
          JSON.stringify(data.user)
        );

        goNext();
      } catch (err) {
        status.textContent =
          err.message;
      }
    });

  screen
    .querySelector('.auth-skip')
    .addEventListener(
      'click',
      goNext
    );

  app.append(screen);
}