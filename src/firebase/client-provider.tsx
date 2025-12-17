'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

// --- MOVED OUTSIDE COMPONENT ---
// SAFETY PATCH: Run immediately to catch extension errors before hydration
if (typeof window !== 'undefined' && window.MutationObserver) {
  const originalObserve = window.MutationObserver.prototype.observe;
  window.MutationObserver.prototype.observe = function (target, options) {
    if (!(target instanceof Node)) {
      return; // Silently ignore invalid targets
    }
    return originalObserve.call(this, target, options);
  };
}
// -------------------------------

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
