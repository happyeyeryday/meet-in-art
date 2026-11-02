// Pure validation of the runtime inventory, separate from file I/O and inference.
export const runtimeFiles=[
 'wasm/vision_bundle.mjs',
 'wasm/vision_wasm_module_internal.js','wasm/vision_wasm_module_internal.wasm',
 'wasm/vision_wasm_internal.js','wasm/vision_wasm_internal.wasm',
 'wasm/vision_wasm_nosimd_internal.js','wasm/vision_wasm_nosimd_internal.wasm',
 'models/pose_landmarker_full.task'
];
export function validateManifest(manifest,expectedVersion){
 const errors=[];
 if(!manifest||typeof manifest!=='object'||Array.isArray(manifest))return ['运行资源清单不是 JSON 对象'];
 if(manifest.package!=='@mediapipe/tasks-vision')errors.push('清单中的 MediaPipe 包名不匹配');
 if(manifest.version!==expectedVersion)errors.push('清单中的 MediaPipe 版本与 package.json 不匹配');
 if(manifest.model!=='pose_landmarker_full/float16/1')errors.push('清单中的模型版本不匹配');
 if(!Array.isArray(manifest.files)||!manifest.files.length)return [...errors,'清单没有有效文件条目'];
 const paths=new Set();
 for(const file of manifest.files){
  if(!file||typeof file.path!=='string'||! /^(wasm|models)\/[A-Za-z0-9_.-]+$/.test(file.path)){
   errors.push('清单含有不合法的资源路径');continue;
  }
  if(paths.has(file.path))errors.push(`清单重复条目：${file.path}`);
  paths.add(file.path);
  if(!Number.isSafeInteger(file.bytes)||file.bytes<=0)errors.push(`清单缺少有效文件长度：${file.path}`);
  if(typeof file.sha256!=='string'||!/^[0-9a-f]{64}$/.test(file.sha256))errors.push(`清单缺少有效 SHA-256：${file.path}`);
 }
 for(const file of runtimeFiles)if(!paths.has(file))errors.push(`清单漏记必需资源：${file}`);
 return errors;
}
