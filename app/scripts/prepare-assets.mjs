import {cp,mkdir,writeFile,readFile,rename,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {validateManifest} from './asset-manifest.mjs';
const require=createRequire(import.meta.url);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const installed=path.join(root,'node_modules/@mediapipe/tasks-vision');
const packageInfo=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
const expected=packageInfo.dependencies['@mediapipe/tasks-vision'];
let info;
try{info=JSON.parse(await readFile(path.join(installed,'package.json'),'utf8'));}
catch{throw new Error('请先联网运行 npm install --ignore-scripts，再执行 npm run prepare:assets。缺失的模型和 WASM 不会被替换为模拟实现。');}
if(info.name!=='@mediapipe/tasks-vision'||info.version!==expected)throw new Error(`MediaPipe 版本不匹配：需要 ${expected}，实际 ${info.version}`);
const wasm=path.join(root,'public/wasm'),models=path.join(root,'public/models');
await mkdir(wasm,{recursive:true});await mkdir(models,{recursive:true});
// Resolve the package export, as in the official copy-wasm.js, rather than
// relying on a particular npm package directory layout.
await cp(path.dirname(require.resolve('@mediapipe/tasks-vision/vision_wasm_internal.js')),wasm,{recursive:true});
await cp(path.join(installed,'vision_bundle.mjs'),path.join(wasm,'vision_bundle.mjs'));
const modelURL='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task';
const target=path.join(models,'pose_landmarker_full.task');
let model;try{model=await readFile(target);}catch{}
if(!model||model.length<1000000||(model.indexOf(Buffer.from('PK\x03\x04'))<0||model.indexOf(Buffer.from('PK\x03\x04'))>4096)){
 const response=await fetch(modelURL,{signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw new Error(`模型下载失败：HTTP ${response.status}`);
 model=Buffer.from(await response.arrayBuffer());
 if(model.length<1000000||(model.indexOf(Buffer.from('PK\x03\x04'))<0||model.indexOf(Buffer.from('PK\x03\x04'))>4096))throw new Error('模型文件无效：预期完整 MediaPipe .task ZIP，收到的可能是错误页面。');
 await writeFile(target+'.download',model);await rename(target+'.download',target);
}
const files=[];
for(const dir of ['wasm','models'])for(const name of await readdir(path.join(root,'public',dir))){
 const relative=`${dir}/${name}`,bytes=await readFile(path.join(root,'public',relative));
 if(name.endsWith('.wasm')&&bytes.subarray(0,4).toString('hex')!=='0061736d')throw new Error(`WASM 文件损坏：${relative}`);
 files.push({path:relative,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),source:dir==='models'?modelURL:`https://www.npmjs.com/package/@mediapipe/tasks-vision/v/${info.version}`});
}
const manifest={package:info.name,version:info.version,model:'pose_landmarker_full/float16/1',preparedAt:new Date().toISOString(),files,note:'文件检查不代表真实推理已验收。'};
const errors=validateManifest(manifest,expected);
if(errors.length)throw new Error(errors.join('\n'));
await writeFile(path.join(root,'public/runtime-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('官方版本运行资源已保存，并记录 SHA-256。下一步：npm test、npm run build、npm run start:demo，再执行浏览器验收。');
