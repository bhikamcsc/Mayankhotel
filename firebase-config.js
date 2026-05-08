// Firebase Config - Mayank Restorent
// Aapka Firebase project: inventry-app-6df60

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4m3QJCaoWAZMyW0B3DrVDf0GP8naRliU",
  authDomain: "inventry-app-6df60.firebaseapp.com",
  projectId: "inventry-app-6df60",
  storageBucket: "inventry-app-6df60.firebasestorage.app",
  messagingSenderId: "150846837650",
  appId: "1:150846837650:web:97b599ca6ee10a9f85a74b",
  measurementId: "G-C5YBVC6D4Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
};
