import type {Point} from './types.ts';
export const MODEL_VERSION='pose_landmarker_full/float16/1';
let worker:Worker|null=null;let sequence=0;
type Result={poses:Point[][];inferenceMs:number};
const pending=new Map<number,{resolve:(v:Result)=>void;reject:(e:Error)=>void;timer:ReturnType<typeof setTimeout>}>();
function reset(reason:string){worker?.terminate();worker=null;for(const p of pending.values()){clearTimeout(p.timer);p.reject(new Error(reason));}pending.clear();}
function getWorker(){
 if(worker)return worker;
 worker=new Worker(new URL('./pose.worker.ts',import.meta.url),{type:'module'});
 worker.onmessage=e=>{const p=pending.get(e.data.id);if(!p)return;clearTimeout(p.timer);pending.delete(e.data.id);if(e.data.error)p.reject(new Error(e.data.error));else p.resolve(e.data);};
 worker.onerror=()=>reset('姿态识别线程无法启动，请检查本地运行环境与模型文件。');return worker;
}
export async function detect(canvas:HTMLCanvasElement):Promise<Result>{const bitmap=await createImageBitmap(canvas);return new Promise((resolve,reject)=>{
 const id=++sequence;const timer=setTimeout(()=>reset('识别超过 45 秒，请重试或换用电脑浏览器。'),45000);
 pending.set(id,{resolve,reject,timer});try{getWorker().postMessage({id,bitmap},[bitmap]);}catch(error){bitmap.close();pending.delete(id);clearTimeout(timer);reject(error);}
});}
