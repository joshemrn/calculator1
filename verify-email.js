import { auth } from './firebase-config.js';
import { sendEmailVerification, reload } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const resendBtn = document.getElementById('resend-btn');
const refreshBtn = document.getElementById('refresh-btn');
const errorBox = document.getElementById('verify-error');
const successBox = document.getElementById('verify-success');

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

resendBtn?.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  try {
    await sendEmailVerification(user);
    showSuccess('Verification email sent again. Please check your inbox.');
  } catch (err) {
    console.error(err);
    showError('Could not resend verification email. Please try again later.');
  }
});

refreshBtn?.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  try {
    await reload(user);
    if (user.emailVerified) {
      window.location.href = 'index.html';
    } else {
      showError('Your email is not verified yet. Please click the link in your email, then try again.');
    }
  } catch (err) {
    console.error(err);
    showError('Could not refresh status. Please try again.');
  }
});
