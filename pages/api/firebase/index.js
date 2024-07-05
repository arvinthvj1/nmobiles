// Import the functions you need from the SDKs you need
"use client"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup ,onAuthStateChanged} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcR4o8MtmfunMSDOi06nAIh8O8YVAXhtM",
  authDomain: "batch5-32f82.firebaseapp.com",
  projectId: "batch5-32f82",
  storageBucket: "batch5-32f82.appspot.com",
  messagingSenderId: "207585484889",
  appId: "1:207585484889:web:dc9075ff00b0048851d148",
  measurementId: "G-J31FL6J4J8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup ,onAuthStateChanged};