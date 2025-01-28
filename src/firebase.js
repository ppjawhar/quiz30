import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7oyznhuUvp8DVZWLLECoY-Z1alH5UKH8",
  authDomain: "ekquiz30-69c41.firebaseapp.com",
  projectId: "ekquiz30-69c41",
  storageBucket: "ekquiz30-69c41.firebasestorage.app",
  messagingSenderId: "283405035805",
  appId: "1:283405035805:web:f13f0be3af37760f4e19f4",
  measurementId: "G-TVCN3S3EGT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
