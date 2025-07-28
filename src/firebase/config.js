// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ Ganti Firestore ke Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyCnETWvUKZlKtygRQ65Gpq3kLKCvNOOJQE",
  authDomain: "chatapp-ca10f.firebaseapp.com",
  databaseURL: "https://chatapp-ca10f-default-rtdb.asia-southeast1.firebasedatabase.app", // ✅ Tambahkan ini!
  projectId: "chatapp-ca10f",
  storageBucket: "chatapp-ca10f.appspot.com", // ✅ Typo: perbaiki .app jadi .app**spot**.com
  messagingSenderId: "237594256569",
  appId: "1:237594256569:web:f6b3afeaf6e881fd8d6768",
  measurementId: "G-SE0J9J1PFC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // ✅ Sekarang pakai Realtime Database
