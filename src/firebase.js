// firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIlRbdQNG0KCqgHhnTVtQJgrzCmR8SdWA",
  authDomain: "checkvinaudit.firebaseapp.com",
  projectId: "checkvinaudit",
  storageBucket: "checkvinaudit.firebasestorage.app",
  messagingSenderId: "254452218878",
  appId: "1:254452218878:web:4477fc29e0b7cdae79deaf",
  measurementId: "G-4DVNJBTQJ0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore and Authentication services
const db = getFirestore(app);
const auth = getAuth(app);

// Export services and methods for use in your components
export {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};
