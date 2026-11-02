import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase web config — set these in frontend/.env
// (Firebase console → Project settings → General → Your apps → Web app)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
    firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

// Only initialize when configured — keeps the app running before setup
export const firebaseAuth = isFirebaseConfigured
    ? getAuth(initializeApp(firebaseConfig))
    : null;

// Social auth providers
export const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null;

// Social login helper
export const signInWithSocial = async (provider) => {
    if (!firebaseAuth || !provider) {
        throw new Error('Firebase not configured');
    }
    return await signInWithPopup(firebaseAuth, provider);
};

// Map cryptic Firebase auth errors to actionable messages
export const friendlyAuthError = (err) => {
    const code = err?.code || '';
    const msg = err?.message || '';
    if (code.includes('configuration-not-found') || msg.includes('configuration-not-found')) {
        return 'This sign-in method is not enabled yet. In Firebase Console go to Authentication → Sign-in method and enable it (Google / Email-Password).';
    }
    if (code.includes('invalid-api-key') || msg.includes('invalid-api-key')) {
        return 'Firebase API key is invalid. Check VITE_FIREBASE_API_KEY in frontend/.env';
    }
    if (code.includes('project-not-found')) {
        return 'Firebase project not found. Check VITE_FIREBASE_PROJECT_ID in frontend/.env';
    }
    if (code.includes('popup-closed-by-user') || code.includes('popup-blocked')) {
        return 'Sign-in popup was closed or blocked before completing.';
    }
    if (code.includes('email-already-in-use')) return 'That email is already registered.';
    if (code.includes('invalid-email')) return 'Please enter a valid email address.';
    if (code.includes('weak-password')) return 'Password is too weak (min 6 characters).';
    return msg || 'Firebase sign-in failed';
};
