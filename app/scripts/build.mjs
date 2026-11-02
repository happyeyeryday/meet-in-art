import {readdir,readFile,writeFile,mkdir,rm,cp} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {stripTypeScriptTypes} from 'node:module';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
await cp(path.join(root,'public'),dist,{recursive:true});
async function compile(dir){for(const entry of await readdir(path.join(root,dir),{withFileTypes:true})){
 const relative=path.join(dir,entry.name);
 if(entry.isDirectory()){await compile(relative);continue;}
 if(entry.name.endsWith('.d.ts'))continue;
 const dest=path.join(dist,relative.replace(/\.ts$/,'.js'));await mkdir(path.dirname(dest),{recursive:true});
 if(entry.name.endsWith('.ts')){
  let source=stripTypeScriptTypes(await readFile(path.join(root,relative),'utf8'),{mode:'transform',sourceMap:false});
  source=source.replace(/(['"])(\.[^'"\n]+)\.ts\1/g,'$1$2.js$1');await writeFile(dest,source);
 }else await cp(path.join(root,relative),dest);
}}
await compile('src');
await writeFile(path.join(dist,'index.html'),(await readFile(path.join(root,'index.html'),'utf8')).replace('src/main.ts','src/main.js'));
await cp(path.join(root,'licenses'),path.join(dist,'licenses'),{recursive:true});
console.log('Built dist/ using the Node.js TypeScript transformer; no package installation required.');
