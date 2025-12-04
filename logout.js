import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.querySelector('[data-logout]');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    logoutBtn.disabled = true;
    try {
      await signOut(auth);
      window.location.href = 'login.html';
    } catch (err) {
      console.error('Sign-out error', err);
      logoutBtn.disabled = false;
      alert('Could not sign out. Please try again.');
    }
  });
});
