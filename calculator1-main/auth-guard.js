import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const publicPages = ['login.html', 'signup.html', 'forgot-password.html', 'verify-email.html'];

function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  return page;
}

onAuthStateChanged(auth, (user) => {
  const page = getCurrentPage();

  if (!user) {
    // Not logged in: only allow auth-related public pages
    if (!publicPages.includes(page)) {
      window.location.href = 'login.html';
    }
    return;
  }

  // Logged in: enforce email verification for protected content
  if (!user.emailVerified) {
    if (page !== 'verify-email.html') {
      window.location.href = 'verify-email.html';
    }
    return;
  }

  // Logged in & verified: don't allow auth pages
  if (publicPages.includes(page)) {
    window.location.href = 'index.html';
  }
});
