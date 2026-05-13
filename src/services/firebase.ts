import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Solo inicializar si tenemos la configuración mínima requerida
const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app;
try {
  if (isConfigValid) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn(
      "Configuración de Firebase ausente o incompleta. El modo online no estará disponible.",
    );
  }
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
}

export const isFirebaseConfigured = isConfigValid;
export const auth = app ? getAuth(app) : ({ currentUser: null } as any);
export const db = app
  ? getFirestore(
      app,
      import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "(default)",
    )
  : ({} as any);

export const googleProvider = new GoogleAuthProvider();

export const signIn = async () => {
  if (!isFirebaseConfigured) {
    alert("Firebase no está configurado. Revisa tu archivo .env.local");
    return;
  }
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    console.error("Auth Error Detail:", error);
    if (
      error.message?.includes("invalid_client") ||
      error.message?.includes("client secret is invalid")
    ) {
      alert(
        "❌ Error de Configuración de Firebase:\n\nEl 'Client Secret' de Google Auth es inválido.",
      );
      return;
    }
    alert(`Error de autenticación: ${error.message}`);
  }
};

export const signInGuest = async () => {
  if (!isFirebaseConfigured) return { user: { uid: "local-guest" } } as any;
  try {
    return await signInAnonymously(auth);
  } catch (error: any) {
    console.error("Guest Auth Error:", error);
    throw error;
  }
};

export const signOut = () => (isFirebaseConfigured ? auth.signOut() : null);

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  console.error("Firestore Error: ", error, operationType, path);
  throw error;
}
