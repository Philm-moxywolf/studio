'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, deleteApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

export function initializeFirebase() {
  let firebaseApp: FirebaseApp;

  // 1. Check if an app already exists
  if (getApps().length > 0) {
    firebaseApp = getApp();
    
    // 2. CRITICAL FIX: Check if the existing app is the broken "auto-init" version
    // If it's missing the apiKey from your config, it's the wrong instance.
    if (!firebaseApp.options.apiKey && firebaseConfig?.apiKey) {
      console.warn("Detected misconfigured Firebase App (App Hosting ghost). Resetting...");
      deleteApp(firebaseApp); // Destroy the bad instance
      firebaseApp = initializeApp(firebaseConfig); // Re-initialize with YOUR config
    }
  } else {
    // 3. No app exists, initialize fresh with your config
    // Fallback to empty object if config is missing to prevent crash
    firebaseApp = initializeApp(firebaseConfig || {});
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
