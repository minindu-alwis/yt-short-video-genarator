// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "short-ai-40b09.firebaseapp.com",
  projectId: "short-ai-40b09",
  storageBucket: "short-ai-40b09.firebasestorage.app",
  messagingSenderId: "1002392047606",
  appId: "1:1002392047606:web:5fddcea304e651f9b2c1d7",
  measurementId: "G-1FC16KD2RH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);