import { ASSETS } from '../assets';
import { appState } from '../appState';

export function renderAuthScreen(app) {
  app.innerHTML = '';
  const screen = document.createElement('main');
  screen.className = 'screen select-role-screen auth-screen';
  screen.insertAdjacentHTML('beforeend', `
    <img src="${ASSETS.splashHeaderLogo}" alt="Nana" class="auth-logo" />
    <h1 class="screen-title">Welcome</h1>
    <p class="auth-copy">Sign in when the backend is ready, or skip for testing.</p>
    <label class="settings-field">Email<input type="email" placeholder="you@email.com" /></label>
    <label class="settings-field">Password<input type="password" placeholder="Password" /></label>
    <button type="button" class="continue-button auth-submit">Sign up / Login</button>
    <button type="button" class="settings-link auth-skip">Skip for testing</button>
  `);
  const go = () => { window.location.hash = appState.children.length ? '#child-added' : '#homepage-newuser'; };
  screen.querySelector('.auth-submit').addEventListener('click', go);
  screen.querySelector('.auth-skip').addEventListener('click', go);
  app.append(screen);
}
