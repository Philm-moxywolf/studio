'use client';

import React, { useMemo, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // SAFETY PATCH: Fix "parameter 1 is not of type 'Node'" error.
  // This is usually caused by browser extensions or hydration mismatches.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.MutationObserver) {
      const originalObserve = window.MutationObserver.prototype.observe;
      window.MutationObserver.prototype.observe = function (target, options) {
        if (!(target instanceof Node)) {
          return; // Silently ignore invalid targets
        }
        return originalObserve.call(this, target, options);
      };
    }
  }, []);

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
