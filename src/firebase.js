import {initializeApp} from 'firebase/app';
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,signOut,connectAuthEmulator} from 'firebase/auth';
import {getFunctions,httpsCallable,connectFunctionsEmulator} from 'firebase/functions';
import {getStorage,ref,uploadBytes,getBlob,connectStorageEmulator} from 'firebase/storage';
import {initializeAppCheck,ReCaptchaEnterpriseProvider} from 'firebase/app-check';
import {getFirestore,collection,query,orderBy,limit,onSnapshot,connectFirestoreEmulator} from 'firebase/firestore';
let auth,functions,storage,firestore;
export async function initFirebase(){const e=import.meta.env;const config={apiKey:e.VITE_FIREBASE_API_KEY,authDomain:e.VITE_FIREBASE_AUTH_DOMAIN,projectId:e.VITE_FIREBASE_PROJECT_ID,storageBucket:e.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:e.VITE_FIREBASE_MESSAGING_SENDER_ID,appId:e.VITE_FIREBASE_APP_ID};if(Object.values(config).some(v=>!v))throw Error('Firebase setup is incomplete. Add the web app configuration to .env and rebuild.');const app=initializeApp(config);if(e.VITE_APPCHECK_SITE_KEY)initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider(e.VITE_APPCHECK_SITE_KEY),isTokenAutoRefreshEnabled:true});auth=getAuth(app);firestore=getFirestore(app);functions=getFunctions(app,e.VITE_FIREBASE_REGION||'us-central1');storage=getStorage(app);if(e.VITE_USE_EMULATORS==='true'){connectFirestoreEmulator(firestore,'127.0.0.1',8080);connectAuthEmulator(auth,'http://127.0.0.1:9099');connectFunctionsEmulator(functions,'127.0.0.1',5001);connectStorageEmulator(storage,'127.0.0.1',9199);}}
export const watchAuth=fn=>onAuthStateChanged(auth,fn);
export const authenticate=(kind,email,password)=>kind==='signup'?createUserWithEmailAndPassword(auth,email,password):kind==='reset'?sendPasswordResetEmail(auth,email):signInWithEmailAndPassword(auth,email,password);
export const logout=()=>signOut(auth);
export const call=async(name,data)=>(await httpsCallable(functions,name)(data)).data;
export async function uploadProof(uid,id,file){const path=`proofs/${uid}/${id}/evidence`;await uploadBytes(ref(storage,path),file,{contentType:file.type});return {path,name:file.name,type:file.type,size:file.size};}
export const readProofFile=attachment=>getBlob(ref(storage,attachment.path),5*1024*1024);


export const watchGamerChat=(next,error)=>onSnapshot(query(collection(firestore,'gamerChat'),orderBy('createdAt','desc'),limit(100)),snapshot=>next(snapshot.docs.map(d=>({id:d.id,...d.data()})).reverse()),error);
