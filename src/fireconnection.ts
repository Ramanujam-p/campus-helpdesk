import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
    apiKey: "AIzaSyB6HUPV-gKsajhmCw6iNXmQfdM-9PKObSE",
    authDomain: "student-helpdesk-f4987.firebaseapp.com",
    projectId: "student-helpdesk-f4987",
    storageBucket: "student-helpdesk-f4987.firebasestorage.app",
    messagingSenderId: "260468037622",
    appId: "1:260468037622:web:87cff01aa287a38fc199d7",
    measurementId: "G-4NXF1N791Q",
};

/* ================= INITIALIZE ================= */

export const app: FirebaseApp = initializeApp(firebaseConfig);

/**
 * Analytics only works in browser environments
 * (avoid SSR / test crashes)
 */
export const analytics: Analytics | null =
    typeof window !== "undefined"
        ? getAnalytics(app)
        : null;

export const db: Firestore = getFirestore(app);
