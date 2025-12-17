// IMPORTANT: This file is for SERVER-SIDE Firebase initialization only.
// Do not import this file in any client-side code.

import { initializeApp, getApp, getApps, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const db = getFirestore(app);

export function getDb() {
    return db;
}
