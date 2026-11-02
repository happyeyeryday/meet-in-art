import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),dir=path.join(root,'evidence/video');await mkdir(dir,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true});
try{const page=await browser.newPage({viewport:{width:1480,height:960}});await page.goto(pathToFileURL(path.join(root,'deliverables/名画仿拍_真实演示.webm')).href);
 await page.waitForFunction(()=>{const v=document.querySelector('video');return v&&v.readyState>=2;});
 const info=await page.locator('video').evaluate(v=>{v.pause();v.controls=false;v.style.cssText='width:1440px;height:900px;max-width:none';return {duration:v.duration,width:v.videoWidth,height:v.videoHeight};});
 if(!(info.duration>=120&&info.duration<=180&&info.width===1440&&info.height===900))throw new Error('Video duration/dimensions do not meet delivery requirements');
 for(const t of [3,30,60,100,114,130,150]){
  await page.locator('video').evaluate((v,time)=>new Promise(resolve=>{v.addEventListener('seeked',()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)),{once:true});v.currentTime=time;}),t);
  await page.locator('video').screenshot({path:path.join(dir,`frame-${t}.png`)});
 }
 await writeFile(path.join(dir,'verification.json'),JSON.stringify({...info,decodedFrames:[3,30,60,100,114,130,150],method:'Chrome decodes the delivered WebM; screenshots taken after seeked events',passed:true},null,2)+'\n');console.log(info);
}finally{await browser.close();}
