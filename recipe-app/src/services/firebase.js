import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-LLw8sbr_uzY_p_jokkDLKuXjfMoFzJA",
  authDomain: "recipe-app-956ea.firebaseapp.com",
  projectId: "recipe-app-956ea",
  storageBucket: "recipe-app-956ea.firebasestorage.app",
  messagingSenderId: "829802135570",
  appId: "1:829802135570:web:149de93002f677411058cb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);