import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAihoa5yM6g0q5KjfUisaxUlr-VDSXPuYo",
  authDomain: "hakaton-b59ac.firebaseapp.com",
  projectId: "hakaton-b59ac",
  storageBucket: "hakaton-b59ac.firebasestorage.app",
  messagingSenderId: "431415591430",
  appId: "1:431415591430:web:4995f6887a841d8aaff987",
  measurementId: "G-5HW2WK7S0F"
};

export const Context = createContext(null)

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    auth,
    firestore
  }}>
    <App />
  </Context.Provider>
);