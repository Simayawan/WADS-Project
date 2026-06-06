// lib/firebase/adminApp.ts
//import 'server-only';
//import { initializeApp, getApps, cert } from 'firebase-admin/app';
//import { getAuth } from 'firebase-admin/auth';
//import serviceAccount from '@/serviceAccountKey.json';

//export const firebaseApp = getApps().find((it) => it.name === "firebase-admin-app") ||
//    initializeApp({
//        credential: cert(serviceAccount as any),
//    }, "firebase-admin-app");

//export const auth = getAuth(firebaseApp);

// comment for now