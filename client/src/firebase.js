// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realestate-87f05.firebaseapp.com",
  projectId: "mern-realestate-87f05",
  storageBucket: "mern-realestate-87f05.appspot.com",
  messagingSenderId: "358460190676",
  appId: "1:358460190676:web:33f599fd7e5a016a5e7041"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

