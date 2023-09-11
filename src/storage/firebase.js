// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCdXQC67xCMtWV4pA6wkMrQflrRgLPG1Q0",
    authDomain: "annual-report-52e9f.firebaseapp.com",
    projectId: "annual-report-52e9f",
    storageBucket: "annual-report-52e9f.appspot.com",
    messagingSenderId: "834740483460",
    appId: "1:834740483460:web:94e28062664287d14e59d1",
    measurementId: "G-3NE3EC6D2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)