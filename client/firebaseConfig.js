// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// import { as } from '@react-native-async-storage/async-storage';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfq2oXJWdiuNX0vcu-e8pQJS4itvD19sI",
  authDomain: "loundry-app-b96eb.firebaseapp.com",
  projectId: "loundry-app-b96eb",
  storageBucket: "loundry-app-b96eb.appspot.com",
  messagingSenderId: "776419526999",
  appId: "1:776419526999:web:54f89d60624b4153eb5612",
  measurementId: "G-G8SHHWLCQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const database = 
export const analytics = getAnalytics(app);