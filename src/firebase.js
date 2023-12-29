
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"




const firebaseConfig = {
  apiKey: "AIzaSyDeUJC8XDMq_sniBebWqqKcXnw1Zckbe7U",
  authDomain: "chatapp-9f111.firebaseapp.com",
  projectId: "chatapp-9f111",
  storageBucket: "chatapp-9f111.appspot.com",
  messagingSenderId: "520167812247",
  appId: "1:520167812247:web:3bc57c264ab34cb084cdd2",
  measurementId: "G-WC2N6YN6E3"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage(app);

setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log("Session Persistence set");
    })
    .catch((error) => {
       console.log(error.message);
    });