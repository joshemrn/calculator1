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
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const signInEmailBtn = document.getElementById('sign-in-email-btn');
const signUpEmailBtn = document.getElementById('sign-up-email-btn');
const authError = document.getElementById('auth-error');
const authMessage = document.getElementById('auth-message');

// Event Listeners
if (signOutBtn) signOutBtn.addEventListener('click', signOut);
if (signInEmailBtn) signInEmailBtn.addEventListener('click', signInWithEmail);
if (signUpEmailBtn) signUpEmailBtn.addEventListener('click', signUpWithEmail);

// Firebase Auth State Observer
auth.onAuthStateChanged((user) => {
  if (user && user.emailVerified) {
    handleFirebaseUser(user);
  } else if (user && !user.emailVerified) {
    showError('Please verify your email address. Check your inbox for the verification link.');
    auth.signOut();
  }
});

// Email/Password Authentication Functions
async function signUpWithEmail() {
  const email = authEmail.value.trim();
  const password = authPassword.value;
  
  if (!email || !password) {
    showError('Please enter both email and password');
    return;
  }
  
  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.sendEmailVerification();
    showMessage('Account created! Please check your email to verify your account before signing in.');
    authEmail.value = '';
    authPassword.value = '';
  } catch (error) {
    showError(error.message);
  }
}

async function signInWithEmail() {
  const email = authEmail.value.trim();
  const password = authPassword.value;
  
  if (!email || !password) {
    showError('Please enter both email and password');
    return;
  }
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    
    if (!userCredential.user.emailVerified) {
      showError('Please verify your email before signing in. Check your inbox for the verification link.');
      await auth.signOut();
      return;
    }
    
    // User will be handled by onAuthStateChanged
  } catch (error) {
    showError(error.message);
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
