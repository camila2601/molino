// Reemplaza con la configuración de tu proyecto Firebase (Project settings)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAAkiSd_qH66__fes7_DmmUhEP5_rEg1SU",
  authDomain: "molino-7d243.firebaseapp.com",
  projectId: "molino-7d243",
  storageBucket: "molino-7d243.firebasestorage.app",
  messagingSenderId: "987163156159",
  appId: "1:987163156159:web:a8823835786b813055f00a",
  measurementId: "G-LMT85V5X7J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);