// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAV5pFjckU-HmFWm-dYlNL9EXN49JK3wpY",
  authDomain: "notesbog-1f909.firebaseapp.com",
  projectId: "notesbog-1f909",
  storageBucket: "notesbog-1f909.firebasestorage.app",
  messagingSenderId: "31228533977",
  appId: "1:31228533977:web:4acad0a9f14ad60ed072c8",
  measurementId: "G-9YGXYFV4FQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const storage = getStorage(app);
export {app, database, storage}