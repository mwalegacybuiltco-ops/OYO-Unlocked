// Run from a trusted administrator terminal, never from the browser.
import {createRequire} from 'node:module';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {initializeApp,applicationDefault}=require('firebase-admin/app');
const {getAuth}=require('firebase-admin/auth');const {getFirestore}=require('firebase-admin/firestore');
const uid=process.argv[2];if(!uid||!/^[a-zA-Z0-9_-]{1,128}$/.test(uid))throw Error('Usage: node scripts/set-owner.mjs YOUR_FIREBASE_AUTH_UID');
initializeApp({credential:applicationDefault()});const user=await getAuth().getUser(uid);
await getFirestore().runTransaction(async tx=>{const ref=getFirestore().doc('privateConfig/owner'),old=await tx.get(ref);if(old.exists&&old.data().uid!==uid)throw Error('A different owner is already registered. This tool will not add another owner or transfer access.');tx.set(ref,{uid,configuredAt:Date.now()});});
await getAuth().setCustomUserClaims(uid,{...user.customClaims,owner:true});console.log('Sole owner registered. Sign out/in to refresh the ID token.');
