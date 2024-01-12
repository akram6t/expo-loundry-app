// Import the functions you need from the SDKs you need
import  { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';
// import { getMessaging, getToken } from 'firebase/messaging';
import { getAnalytics } from "firebase/analytics";
import Constants from "expo-constants";

const firebaseConfig = Constants?.expoConfig?.extra?.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const fConfig = {...firebaseConfig};

export const database = getDatabase(app);
// export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);