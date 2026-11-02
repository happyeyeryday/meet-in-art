import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateManifest,runtimeFiles} from '../scripts/asset-manifest.mjs';
// Metadata-only fixtures; these are not model files or inference evidence.
const inventory=()=>({package:'@mediapipe/tasks-vision',version:'1.2.0',model:'pose_landmarker_full/float16/1',files:runtimeFiles.map(path=>({path,bytes:123,sha256:'a'.repeat(64)}))});
test('empty or malformed runtime inventory cannot pass',()=>{for(const m of [null,[],{}, {...inventory(),files:[]}])assert.ok(validateManifest(m,'1.2.0').length)});
test('valid inventory shape is accepted without claiming file or inference validation',()=>assert.deepEqual(validateManifest(inventory(),'1.2.0'),[]));
test('missing model entry and mixed runtime versions are rejected',()=>{const m=inventory();m.version='0.10.0';m.files.pop();const errors=validateManifest(m,'1.2.0');assert.ok(errors.some(e=>e.includes('版本')));assert.ok(errors.some(e=>e.includes('pose_landmarker_full.task')))});
test('invalid hashes and lengths do not bypass inventory checking',()=>{const m=inventory();m.files[0].sha256='';m.files[1].bytes=0;assert.equal(validateManifest(m,'1.2.0').length,2)});
test('duplicate and escaping resource paths are rejected',()=>{const m=inventory();m.files.push({...m.files[0]},{path:'wasm/../../outside',bytes:1,sha256:'a'.repeat(64)});const errors=validateManifest(m,'1.2.0');assert.ok(errors.some(e=>e.includes('重复')));assert.ok(errors.some(e=>e.includes('不合法')))});
