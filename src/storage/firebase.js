// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA3fu--lakz0C7iHu5v0Ix5AhfmRF91_kA",
    authDomain: "annual-report-f4712.firebaseapp.com",
    projectId: "annual-report-f4712",
    storageBucket: "annual-report-f4712.appspot.com",
    messagingSenderId: "997968597192",
    appId: "1:997968597192:web:d31dd89afd93d07bee55fd",
    measurementId: "G-53GHSWH6N4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)