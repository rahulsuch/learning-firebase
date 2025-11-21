// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgnCV5T2kWI4pZMGijYWubx4R8ga9npuc",
  authDomain: "learning-firebase-4d55b.firebaseapp.com",
  projectId: "learning-firebase-4d55b",
  storageBucket: "learning-firebase-4d55b.firebasestorage.app",
  messagingSenderId: "408447315542",
  appId: "1:408447315542:web:e4c551ad138224ee2a15f7",
  databaseURL: "https://learning-firebase-4d55b-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);