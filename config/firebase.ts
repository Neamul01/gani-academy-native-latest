import { initializeApp } from "firebase/app";
import Constants from "expo-constants";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiKey = Constants.expoConfig?.extra?.apiKey;
const authDomain = Constants.expoConfig?.extra?.authDomain;

const projectId = Constants.expoConfig?.extra?.projectId;
const storageBucket = Constants.expoConfig?.extra?.storageBucket;

const messagingSenderId = Constants.expoConfig?.extra?.messagingSenderId;
const appId = Constants.expoConfig?.extra?.appId;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// export const auth = getAuth();
// export const database = getFirestore();
