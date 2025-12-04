import { auth } from './firebase-config.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const form = document.getElementById('forgot-form');
const emailInput = document.getElementById('email');
const errorBox = document.getElementById('forgot-error');
const successBox = document.getElementById('forgot-success');

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
  successBox.classList.add('hidden');
}

function showSuccess(message) {
  successBox.textContent = message;
  successBox.classList.remove('hidden');
  errorBox.classList.add('hidden');
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  try {
    await sendPasswordResetEmail(auth, email);
    showSuccess('Password reset email sent. Please check your inbox.');
  } catch (err) {
    console.error(err);
    let msg = 'Could not send reset email. Please try again.';
    if (err.code === 'auth/user-not-found') msg = 'No account found with that email.';
    else if (err.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
    showError(msg);
  }
});
