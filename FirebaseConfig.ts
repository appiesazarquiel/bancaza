import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase usando variables de entorno de Expo
// Define estos valores en un archivo .env (en local)
// y como secrets en EAS (para los builds en la nube).
// Las claves deben empezar por EXPO_PUBLIC_ para estar disponibles en el cliente.
const cleanEnv = (value?: string) =>
  value?.trim().replace(/^['\"]|['\"]$/g, '');

// Use static env access so Expo can inline EXPO_PUBLIC_* values in web exports.
const apiKey = cleanEnv(process.env.EXPO_PUBLIC_FIREBASE_API_KEY);
const authDomain = cleanEnv(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN);
const projectId = cleanEnv(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);

if (!apiKey || !authDomain || !projectId) {
  throw new Error(
    '[FirebaseConfig] Faltan variables de entorno. Revisa EXPO_PUBLIC_FIREBASE_API_KEY, EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN y EXPO_PUBLIC_FIREBASE_PROJECT_ID en .env'
  );
}

if (!apiKey.startsWith('AIza')) {
  throw new Error(
    '[FirebaseConfig] EXPO_PUBLIC_FIREBASE_API_KEY no parece una Web API Key de Firebase (debe empezar por "AIza").'
  );
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
