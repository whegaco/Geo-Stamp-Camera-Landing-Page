import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const trackEvent = async (eventName: string, eventData: Record<string, any> = {}) => {
  try {
    await addDoc(collection(db, 'events'), {
      eventName,
      timestamp: Date.now(),
      ...eventData
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const logInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);

// Error handlers
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path,
    timestamp: Date.now()
  }
  
  // Try to push to firestore, ignore failure to avoid infinite loops
  try {
    addDoc(collection(db, 'error_logs'), errInfo).catch(e => console.error('Failed logging error to firestore', e));
  } catch (e) {
    console.error('Failed logging error to firestore', e);
  }

  console.error('Firestore Error: ', errInfo);
  // Do not rethrow by default to prevent Unhandled Promise Rejections.
  // The caller can check if they want to throw.
  return errInfo;
}
