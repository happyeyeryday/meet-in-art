import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {runtimeFiles,validateManifest} from './asset-manifest.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const directory=process.argv.includes('--dist')?'dist':'public';
const missing=[];
const required=['artworks/CJK.ttf','artworks/yawning.jpg','artworks/desperate.jpg','artworks/fifer.jpg',...['yawning','desperate','fifer'].flatMap(id=>[`demo/${id}-before.png`,`demo/${id}-after.png`]),...runtimeFiles,'runtime-manifest.json'];
for(const file of required){try{if(!(await stat(path.join(root,directory,file))).size)missing.push(file+' (empty)');}catch{missing.push(file);}}
let manifest;
try{manifest=JSON.parse(await readFile(path.join(root,directory,'runtime-manifest.json'),'utf8'));}catch{missing.push('运行资源清单缺失或 JSON 损坏');}
const packageInfo=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
const manifestErrors=validateManifest(manifest,packageInfo.dependencies['@mediapipe/tasks-vision']);
missing.push(...manifestErrors);
if(!manifestErrors.length)for(const file of manifest.files){try{
 const data=await readFile(path.join(root,directory,file.path));
 if(data.length!==file.bytes)missing.push(file.path+' (length mismatch)');
 if(createHash('sha256').update(data).digest('hex')!==file.sha256)missing.push(file.path+' (SHA-256 mismatch)');
}catch{missing.push(file.path+' (manifest file missing)');}}
if(missing.length){console.error('离线 AI 资源尚不完整：\n'+missing.map(f=>'  - '+f).join('\n'));process.exitCode=1;}
else console.log('本地图片、模型与运行时文件及 SHA-256 一致；还需运行浏览器真实推理验收。');
