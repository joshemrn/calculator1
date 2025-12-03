// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpIRLh5_fQFLwikeYDgdreMRUmO03hpK0",
  authDomain: "calculator-email-sign-in.firebaseapp.com",
  projectId: "calculator-email-sign-in",
  storageBucket: "calculator-email-sign-in.firebasestorage.app",
  messagingSenderId: "181160292060",
  appId: "1:181160292060:web:ccd73186876ab5a8214e19"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Google Sign-In Configuration
const CLIENT_ID = '177744902464-nrlnvqafdvc2ftma22ib1a10pfrq9o3t.apps.googleusercontent.com';
let currentUser = null;

// DOM Elements
const signOutBtn = document.getElementById('sign-out-btn');
const userProfile = document.getElementById('user-profile');
const userName = document.getElementById('user-name');
const userPhoto = document.getElementById('user-photo');

// Sign In Elements
const signInEmail = document.getElementById('sign-in-email');
const signInPassword = document.getElementById('sign-in-password');
const signInBtn = document.getElementById('sign-in-btn');
const signInError = document.getElementById('sign-in-error');
const showSignUpLink = document.getElementById('show-sign-up');
const showForgotPasswordLink = document.getElementById('show-forgot-password');

// Sign Up Elements
const signUpEmail = document.getElementById('sign-up-email');
const signUpPassword = document.getElementById('sign-up-password');
const signUpBtn = document.getElementById('sign-up-btn');
const signUpError = document.getElementById('sign-up-error');
const signUpMessage = document.getElementById('sign-up-message');
const showSignInLink = document.getElementById('show-sign-in');

// Forgot Password Elements
const forgotPasswordEmail = document.getElementById('forgot-password-email');
const resetPasswordBtn = document.getElementById('reset-password-btn');
const forgotPasswordError = document.getElementById('forgot-password-error');
const forgotPasswordMessage = document.getElementById('forgot-password-message');
const backToSignInLink = document.getElementById('back-to-sign-in');

// Section Elements
const signInSection = document.getElementById('sign-in-section');
const signUpSection = document.getElementById('sign-up-section');
const forgotPasswordSection = document.getElementById('forgot-password-section');

// Event Listeners
if (signOutBtn) signOutBtn.addEventListener('click', signOut);
if (signInBtn) signInBtn.addEventListener('click', signInWithEmail);
if (signUpBtn) signUpBtn.addEventListener('click', signUpWithEmail);
if (resetPasswordBtn) resetPasswordBtn.addEventListener('click', resetPassword);
if (showSignUpLink) showSignUpLink.addEventListener('click', (e) => { e.preventDefault(); showSection('sign-up'); });
if (showSignInLink) showSignInLink.addEventListener('click', (e) => { e.preventDefault(); showSection('sign-in'); });
if (showForgotPasswordLink) showForgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); showSection('forgot-password'); });
if (backToSignInLink) backToSignInLink.addEventListener('click', (e) => { e.preventDefault(); showSection('sign-in'); });

// Handle Enter key on password fields
if (signInPassword) signInPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') signInWithEmail(); });
if (signUpPassword) signUpPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') signUpWithEmail(); });
if (forgotPasswordEmail) forgotPasswordEmail.addEventListener('keypress', (e) => { if (e.key === 'Enter') resetPassword(); });

// Section Switching
function showSection(section) {
  if (signInSection) signInSection.classList.add('hidden');
  if (signUpSection) signUpSection.classList.add('hidden');
  if (forgotPasswordSection) forgotPasswordSection.classList.add('hidden');
  
  if (section === 'sign-in' && signInSection) {
    signInSection.classList.remove('hidden');
    clearSignInErrors();
  } else if (section === 'sign-up' && signUpSection) {
    signUpSection.classList.remove('hidden');
    clearSignUpErrors();
  } else if (section === 'forgot-password' && forgotPasswordSection) {
    forgotPasswordSection.classList.remove('hidden');
    clearForgotPasswordErrors();
  }
}

function clearSignInErrors() {
  if (signInError) signInError.classList.add('hidden');
}

function clearSignUpErrors() {
  if (signUpError) signUpError.classList.add('hidden');
  if (signUpMessage) signUpMessage.classList.add('hidden');
}

function clearForgotPasswordErrors() {
  if (forgotPasswordError) forgotPasswordError.classList.add('hidden');
  if (forgotPasswordMessage) forgotPasswordMessage.classList.add('hidden');
}

// Firebase Auth State Observer
auth.onAuthStateChanged((user) => {
  if (user && user.emailVerified) {
    handleFirebaseUser(user);
  } else if (user && !user.emailVerified) {
    showSignInError('Please verify your email address. Check your inbox for the verification link.');
    auth.signOut();
  }
});

// Email/Password Authentication Functions
async function signUpWithEmail() {
  if (!signUpEmail || !signUpPassword) return;
  
  const email = signUpEmail.value.trim();
  const password = signUpPassword.value;
  
  if (!email || !password) {
    showSignUpError('Please enter both email and password');
    return;
  }
  
  if (password.length < 6) {
    showSignUpError('Password must be at least 6 characters');
    return;
  }
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    
    // Configure email verification with redirect URL
    const actionCodeSettings = {
      url: window.location.origin + window.location.pathname,
      handleCodeInApp: false
    };
    
    await userCredential.user.sendEmailVerification(actionCodeSettings);
    showSignUpMessage('Account created! Please check your email to verify your account before signing in.');
    signUpEmail.value = '';
    signUpPassword.value = '';
  } catch (error) {
    showSignUpError(error.message);
  }
}

async function signInWithEmail() {
  console.log('Sign in button clicked');
  if (!signInEmail || !signInPassword) {
    console.log('Elements not found:', { signInEmail, signInPassword });
    return;
  }
  
  const email = signInEmail.value.trim();
  const password = signInPassword.value;
  
  console.log('Sign in attempt:', email);
  
  if (!email || !password) {
    showSignInError('Please enter both email and password');
    return;
  }
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log('Sign in successful, checking verification...');
    
    if (!userCredential.user.emailVerified) {
      showSignInError('Please verify your email before signing in. Check your inbox for the verification link.');
      await auth.signOut();
      return;
    }
    
    // User will be handled by onAuthStateChanged
  } catch (error) {
    console.error('Sign in error:', error);
    showSignInError(error.message);
  }
}

async function resetPassword() {
  if (!forgotPasswordEmail) return;
  
  const email = forgotPasswordEmail.value.trim();
  
  if (!email) {
    showForgotPasswordError('Please enter your email address');
    return;
  }
  
  try {
    // Configure password reset with redirect URL
    const actionCodeSettings = {
      url: window.location.origin + window.location.pathname,
      handleCodeInApp: false
    };
    
    await auth.sendPasswordResetEmail(email, actionCodeSettings);
    showForgotPasswordMessage('Password reset email sent! Please check your inbox.');
    forgotPasswordEmail.value = '';
  } catch (error) {
    showForgotPasswordError(error.message);
  }
}

function handleFirebaseUser(user) {
  currentUser = {
    id: user.uid,
    name: user.displayName || user.email.split('@')[0],
    email: user.email,
    picture: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=4F46E5&color=fff`,
    emailVerified: user.emailVerified
  };
  
  if (userName) userName.textContent = currentUser.name;
  if (userPhoto) userPhoto.src = currentUser.picture;
  
  const signInButton = document.getElementById('sign-in-button');
  if (signInButton) signInButton.classList.add('hidden');
  if (userProfile) {
    userProfile.classList.remove('hidden');
    userProfile.classList.add('flex');
  }
  
  const signInRequired = document.getElementById('sign-in-required');
  const calculatorContent = document.getElementById('calculator-content');
  if (signInRequired) signInRequired.classList.add('hidden');
  if (calculatorContent) calculatorContent.classList.remove('hidden');
  
  // Call page-specific initialization if available
  if (typeof onUserAuthenticated === 'function') {
    onUserAuthenticated(currentUser);
  }
}

function showError(message) {
  if (authError) {
    authError.textContent = message;
    authError.classList.remove('hidden');
  }
  if (authMessage) {
    authMessage.classList.add('hidden');
  }
}

function showMessage(message) {
  if (authMessage) {
    authMessage.textContent = message;
    authMessage.classList.remove('hidden');
  }
  if (authError) {
    authError.classList.add('hidden');
  }
}

// Google Sign-In Functions
function initializeGoogleSignIn() {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse
  });
  
  const signInButton = document.getElementById('sign-in-button');
  if (signInButton) {
    google.accounts.id.renderButton(
      signInButton,
      { theme: 'outline', size: 'medium', text: 'signin_with', shape: 'rectangular' }
    );
  }
  
  const signInButtonMain = document.getElementById('sign-in-button-main');
  if (signInButtonMain) {
    google.accounts.id.renderButton(
      signInButtonMain,
      { theme: 'filled_blue', size: 'large', text: 'signin_with', shape: 'rectangular' }
    );
  }
}

function handleCredentialResponse(response) {
  const responsePayload = parseJwt(response.credential);
  
  if (!responsePayload.email_verified) {
    alert('Please verify your email address before using the calculators.');
    return;
  }
  
  currentUser = {
    id: responsePayload.sub,
    name: responsePayload.name,
    email: responsePayload.email,
    picture: responsePayload.picture,
    emailVerified: responsePayload.email_verified
  };
  
  if (userName) userName.textContent = currentUser.name;
  if (userPhoto) userPhoto.src = currentUser.picture;
  
  const signInButton = document.getElementById('sign-in-button');
  if (signInButton) signInButton.classList.add('hidden');
  if (userProfile) {
    userProfile.classList.remove('hidden');
    userProfile.classList.add('flex');
  }
  
  const signInRequired = document.getElementById('sign-in-required');
  const calculatorContent = document.getElementById('calculator-content');
  if (signInRequired) signInRequired.classList.add('hidden');
  if (calculatorContent) calculatorContent.classList.remove('hidden');
  
  // Call page-specific initialization if available
  if (typeof onUserAuthenticated === 'function') {
    onUserAuthenticated(currentUser);
  }
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function signOut() {
  // Sign out from Firebase
  auth.signOut();
  
  currentUser = null;
  const signInButton = document.getElementById('sign-in-button');
  if (signInButton) signInButton.classList.remove('hidden');
  if (userProfile) {
    userProfile.classList.add('hidden');
    userProfile.classList.remove('flex');
  }
  
  const calculatorContent = document.getElementById('calculator-content');
  const signInRequired = document.getElementById('sign-in-required');
  if (calculatorContent) calculatorContent.classList.add('hidden');
  if (signInRequired) signInRequired.classList.remove('hidden');
}

// Initialize on page load
window.addEventListener('load', function() {
  initializeGoogleSignIn();
});
