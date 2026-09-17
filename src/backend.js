import {freshGame,checkProof} from '../functions/game/engine.js';
import {missions} from '../functions/game/content.js';
import * as device from './device.js';
export const cloud=true;
let fb,user=null,onChange=()=>{};
export let session={game:freshGame(),proofs:[],user:null,reviewer:false,entitlement:false,mode:'firebase',ready:false,connectionError:''};
async function refresh(){const result=await fb.call('getPlayer',{});const claims=(await user.getIdTokenResult()).claims;session={...session,...result,user:{uid:user.uid,email:user.email},isOwner:result.isOwner===true,reviewer:result.isOwner===true,resourceAdmin:result.isOwner===true,moderator:result.isOwner===true,ready:true,connectionError:''};onChange(session);}
export async function initBackend(listener){onChange=listener;if(!cloud){session={...session,...await device.read(),mode:'device',ready:true};onChange(session);return;}try{fb=await import('./firebase.js');await fb.initFirebase();fb.watchAuth(async u=>{user=u;if(u){try{await refresh();}catch(e){session={...session,ready:true,connectionError:e.message};onChange(session);}}else{session={...session,user:null,game:freshGame(),proofs:[],entitlement:false,isOwner:false,reviewer:false,resourceAdmin:false,moderator:false,resources:null,ready:true};onChange(session);}});}catch(e){session={...session,ready:true,connectionError:e.message};onChange(session);}}
export function switchMode(){throw Error('This edition uses Firebase accounts.');}
async function saveDevice(value){await device.write(value);session={...session,...value};onChange(session);}
const signed=()=>{if(!navigator.onLine)throw Error('Connect to the internet for this feature.');if(!user)throw Error('Open Online account and sign in for this feature.');};
export async function auth(kind,email,password){if(!navigator.onLine)throw Error('Connect to the internet to set up or recover your account.');if(!fb||session.connectionError)throw Error('The owner must configure the online account service first. Device play remains available.');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email||''))throw Error('Enter your account email address.');await fb.authenticate(kind,email,password);}
export async function signOut(){await fb.logout();}
export async function action(a){if(!cloud)return saveDevice(device.action(session,a));signed();await fb.call('gameAction',a);await refresh();}
export async function submitProof(missionId,proof,file){if(!cloud)return saveDevice(await device.submit(session,missionId,proof,file));signed();checkProof(proof,missions.find(m=>m.id===missionId));if(file&&(file.size>5*1024*1024||!['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type)))throw Error('Choose a JPG, PNG, WebP, or PDF up to 5 MB.');const id=crypto.randomUUID();let attachment=null;if(file)attachment=await fb.uploadProof(user.uid,id,file);await fb.call('submitProof',{missionId,proofId:id,proof,attachment});await refresh();}
export async function chat(guideId,message){if(!cloud){const result=device.guide(session,guideId,message);await saveDevice(result.save);return {text:result.text};}signed();const result=await fb.call('askGuide',{guideId,message});await refresh();return result;}
export async function fight(worldId,answer,choice){if(!cloud){const result=device.battle(session,worldId,answer,choice);await saveDevice(result.save);return result;}signed();const result=await fb.call('battle',{worldId,answer,expectedRound:session.game.bosses[worldId]?.round||0});await refresh();return result;}
export async function proofFile(p){if(!cloud)return device.file(p.id);signed();return fb.readProofFile(p.attachment);}
export async function checkout(){if(!navigator.onLine)throw Error('Reconnect to open the purchase page.');const purchase=import.meta.env.VITE_PURCHASE_URL;if(purchase){if(new URL(purchase).protocol!=='https:')throw Error('Purchase links must use HTTPS.');location.assign(purchase);return;}signed();const {url}=await fb.call('createCheckout',{});if(new URL(url).protocol!=='https:')throw Error('Invalid checkout address.');location.assign(url);}
export async function reviewQueue(){signed();return fb.call('reviewQueue',{});}
export async function reviewProof(data){signed();const result=await fb.call('reviewProof',data);await refresh();return result;}
export function exportSave(){return new Blob([JSON.stringify({exportedAt:new Date().toISOString(),...session},null,2)],{type:'application/json'});}
export async function refreshPlayer(){if(user)await refresh();}
// These legacy UI paths cannot simulate or modify live progress.
export async function simulateReview(id){if(cloud)throw Error('Online proof requires the owner review.');await saveDevice(device.review(session,id));}
export async function resetLocal(){if(cloud)throw Error('Switch to device play first.');await device.clear();await saveDevice({game:freshGame(),proofs:[]});}
export async function importSave(file){if(cloud)throw Error('Backups restore only to device play.');if(file.size>20000000)throw Error('Backup is too large.');await saveDevice(device.restore(JSON.parse(await file.text())));}

export async function saveResources(resources){signed();await fb.call('saveResources',{resources,expectedRevision:session.resources?.revision||0});await refresh();}

export async function getAdminOverview(){signed();return fb.call('getAdminOverview',{});}
export async function saveAnnouncement(data){signed();await fb.call('saveAnnouncement',data);await refresh();}

export function watchGamerChat(next,error){signed();return fb.watchGamerChat(next,error);}
export async function sendChat(text,messageId){signed();return fb.call('sendChat',{text,messageId});}
export async function reportChat(messageId,reason){signed();return fb.call('reportChat',{messageId,reason});}
export async function moderateChat(messageId,mute=false){signed();return fb.call('moderateChat',{messageId,mute});}
export async function getChatReports(){signed();return fb.call('getChatReports',{});}
export async function resolveChatReport(id){signed();return fb.call('resolveChatReport',{id});}
