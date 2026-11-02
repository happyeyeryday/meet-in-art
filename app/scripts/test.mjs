import {writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let transcript='';const originalWrite=process.stdout.write.bind(process.stdout);
process.stdout.write=function(chunk,...args){transcript+=chunk.toString();return originalWrite(chunk,...args);};
process.on('exit',()=>{mkdirSync(path.resolve(root,'../evidence'),{recursive:true});writeFileSync(path.resolve(root,'../evidence/unit-tests.txt'),transcript);});
// In-process imports avoid child-process test isolation, which the restricted
// executor denies with EPERM (sometimes alongside a misleading status: 0).
await import('./build.mjs');
await import('../tests/analysis.test.ts');
await import('../tests/palette.test.mjs');
await import('../tests/assets.test.mjs');
