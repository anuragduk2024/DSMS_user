// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5PtOm03qSDsRhXQxQLWWOoXGWdBbLN8I",
  authDomain: "streetlight-management-system.firebaseapp.com",
  projectId: "streetlight-management-system",
  storageBucket: "streetlight-management-system.firebasestorage.app",
  messagingSenderId: "507121450507",
  appId: "1:507121450507:web:7e186a7f4afc082600110e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);