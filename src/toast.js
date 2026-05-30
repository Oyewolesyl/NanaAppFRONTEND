let toastTimer = null;

export function showToast(message, type = 'success') {
  if (!message) return;

  let toast = document.querySelector('.nana-toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'nana-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(toast);
  }

  toast.className = `nana-toast nana-toast--${type}`;
  toast.textContent = message;

  requestAnimationFrame(() => {
    toast.classList.add('nana-toast--visible');
  });

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('nana-toast--visible');
  }, 2200);
}
