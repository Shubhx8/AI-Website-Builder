// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webmaxer-d2e9e.firebaseapp.com",
  projectId: "webmaxer-d2e9e",
  storageBucket: "webmaxer-d2e9e.firebasestorage.app",
  messagingSenderId: "556926666445",
  appId: "1:556926666445:web:8f89617cbd6eca4f7b4b84",
  measurementId: "G-Y1WH0YBH8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}