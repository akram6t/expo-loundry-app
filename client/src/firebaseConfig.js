// Import the functions you need from the SDKs you need
import  { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';
import { getMessaging, getToken } from 'firebase/messaging';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDfq2oXJWdiuNX0vcu-e8pQJS4itvD19sI",
  authDomain: "loundry-app-b96eb.firebaseapp.com",
  projectId: "loundry-app-b96eb",
  databaseURL: "https://loundry-app-b96eb-default-rtdb.firebaseio.com",
  storageBucket: "loundry-app-b96eb.appspot.com",
  messagingSenderId: "776419526999",
  appId: "1:776419526999:web:54f89d60624b4153eb5612",
  measurementId: "G-G8SHHWLCQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const database = getDatabase(app);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);