// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAZahzZjbMlLzOJXSTCTLmEupZ1KzD1W1I",
  authDomain: "ichhapurti-1ed59.firebaseapp.com",
  projectId: "ichhapurti-1ed59",
  storageBucket: "ichhapurti-1ed59.firebasestorage.app",
  messagingSenderId: "381193660617",
  appId: "1:381193660617:web:0aacb6816e7f2e5a1f4518",
  measurementId: "G-DL88SNKCB1"
};

// ✅ Initialize ONCE
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };