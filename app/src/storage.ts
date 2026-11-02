import type {ComparisonSession} from './types.ts';
const DB='step-into-the-painting';
async function open():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{
 const request=indexedDB.open(DB,1);request.onupgradeneeded=()=>request.result.createObjectStore('sessions',{keyPath:'id'});
 request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
});}
export async function saveSession(value:ComparisonSession):Promise<void>{const db=await open();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('sessions','readwrite');tx.objectStore('sessions').put(value);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}finally{db.close();}}
export async function listSessions():Promise<ComparisonSession[]>{const db=await open();try{return await new Promise((resolve,reject)=>{const r=db.transaction('sessions').objectStore('sessions').getAll();r.onsuccess=()=>resolve(r.result.sort((a:ComparisonSession,b:ComparisonSession)=>b.savedAt.localeCompare(a.savedAt)));r.onerror=()=>reject(r.error);});}finally{db.close();}}
export async function removeSession(id:string):Promise<void>{const db=await open();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('sessions','readwrite');tx.objectStore('sessions').delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}finally{db.close();}}
