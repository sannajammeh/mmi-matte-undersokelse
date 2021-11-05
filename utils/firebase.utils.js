// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEEhkPbvHYuWLSZwlAf2unukKk9njwkaU",
  authDomain: "matte-undersokelse.firebaseapp.com",
  projectId: "matte-undersokelse",
  storageBucket: "matte-undersokelse.appspot.com",
  messagingSenderId: "232100195652",
  appId: "1:232100195652:web:2b5b4294eb66e7e298bb11",
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const signIn = () => signInAnonymously(auth);
