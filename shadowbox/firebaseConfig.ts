import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNnfva80knd8XxWl5dC6hpYDrbbVvdzNE",
  authDomain: "shadowbox-56302.firebaseapp.com",
  projectId: "shadowbox-56302",
  storageBucket: "shadowbox-56302.firebasestorage.app",
  messagingSenderId: "727871873170",
  appId: "1:727871873170:web:feffa1a344ed1ecd4dc64b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);