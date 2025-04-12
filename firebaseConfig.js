
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//import { getAuth, getReactNativePersistence } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API.toString(),
  authDomain: "react-native-db-32d3e.firebaseapp.com",
  projectId: "react-native-db-32d3e",
  storageBucket: "react-native-db-32d3e.firebasestorage.app",
  messagingSenderId: "829931391093",
  appId: "1:829931391093:web:000583ffa16cae7d60903c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
//const auth = getAuth(app, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)});

export { app, auth, db };
