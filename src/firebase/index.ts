'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    
    // FIX: Force use of explicit config. 
    // The previous auto-init was picking up restricted internal credentials in your dev environment.
    if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
      try {
        firebaseApp = initializeApp(firebaseConfig);
      } catch (e) {
        console.warn('Config init failed, falling back', e);
        firebaseApp = initializeApp(); 
      }
    } else {
      firebaseApp = initializeApp();
    }

    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
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
