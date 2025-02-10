// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e225b.firebaseapp.com",
  projectId: "mern-blog-e225b",
  storageBucket: "mern-blog-e225b.firebasestorage.app",
  messagingSenderId: "734297121956",
  appId: "1:734297121956:web:9c34c7118cd1f0403e7231",
  measurementId: "G-NRBEV66RWP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
 
