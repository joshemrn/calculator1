import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const form = document.getElementById('signup-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');
const errorBox = document.getElementById('signup-error');
const successBox = document.getElementById('signup-success');

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

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const password2 = password2Input.value;

  if (password !== password2) {
    showError('Passwords do not match.');
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    if (name) {
      try {
        await updateProfile(cred.user, { displayName: name });
      } catch (err) {
        console.warn('Could not update display name', err);
      }
    }

    try {
      await sendEmailVerification(cred.user);
    } catch (err) {
      console.warn('Could not send verification email', err);
    }

    showSuccess('Account created. Please check your email for a verification link.');
    // After a short delay, move to verify page
    setTimeout(() => {
      window.location.href = 'verify-email.html';
    }, 2000);
  } catch (err) {
    console.error(err);
    let msg = 'Could not create account. Please try again.';
    if (err.code === 'auth/email-already-in-use') msg = 'An account already exists with that email.';
    else if (err.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
    else if (err.code === 'auth/weak-password') msg = 'Password is too weak. Use at least 6 characters.';
    showError(msg);
  }
});
