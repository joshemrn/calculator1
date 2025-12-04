import { auth, googleProvider } from './firebase-config.js';
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorBox = document.getElementById('login-error');
const googleBtn = document.getElementById('google-signin');

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
}

function clearError() {
  errorBox.textContent = '';
  errorBox.classList.add('hidden');
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Redirects are handled centrally in auth-guard.js
  } catch (err) {
    console.error(err);
    let msg = 'Could not sign in. Please check your email and password.';
    if (err.code === 'auth/user-not-found') msg = 'No account found with that email.';
    else if (err.code === 'auth/wrong-password') msg = 'Incorrect password. Please try again.';
    else if (err.code === 'auth/too-many-requests') msg = 'Too many attempts. Please wait a minute and try again.';
    showError(msg);
  }
});

googleBtn?.addEventListener('click', async () => {
  clearError();
  try {
    await signInWithPopup(auth, googleProvider);
    // Redirect handled by auth-guard
  } catch (err) {
    console.error(err);
    let msg = 'Google sign-in failed. Please try again or use email/password.';
    if (err.code === 'auth/popup-closed-by-user') msg = 'Google sign-in was closed before completion.';
    showError(msg);
  }
});
