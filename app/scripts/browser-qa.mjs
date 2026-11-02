import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const evidence=process.env.EVIDENCE_DIR?path.resolve(process.env.EVIDENCE_DIR):path.resolve(root,'../evidence/browser');await mkdir(evidence,{recursive:true});
const base=process.env.DEMO_URL||'http://127.0.0.1:4173';
if(!['127.0.0.1','localhost','[::1]'].includes(new URL(base).hostname))throw new Error('验收仅允许本地服务。');
const require=createRequire(import.meta.url);
let chromium,browser,context;
const result={startedAt:new Date().toISOString(),base,passed:false,checks:[],requests:[],externalRequests:[],pageErrors:[],cases:[],limitation:'Automated browser acceptance does not constitute a human study or performance benchmark.'};
const check=(name,condition)=>{assert.ok(condition,name);result.checks.push(name);};
async function idle(page){await page.locator('.busy-indicator').waitFor({state:'hidden',timeout:120000});}
async function download(page,selector,file){const pending=page.waitForEvent('download',{timeout:60000});await page.locator(selector).click();const item=await pending;await item.saveAs(path.join(evidence,file));await idle(page);return readFile(path.join(evidence,file));}
try{
 try{({chromium}=require('playwright'));}catch{try{({chromium}=require('@playwright/test'));}catch{({chromium}=require('/usr/lib/node_modules/notebooklm-mcp/node_modules/patchright-core'));}}
 const options={headless:true,args:['--disable-dev-shm-usage','--disable-background-networking','--proxy-server=http://127.0.0.1:9','--proxy-bypass-list=127.0.0.1;localhost']};
 if(process.env.CHROME_PATH)options.executablePath=process.env.CHROME_PATH;
 else try{await access('/usr/bin/google-chrome');options.executablePath='/usr/bin/google-chrome';}catch{}
 browser=await chromium.launch(options);result.browserVersion=browser.version();result.offlineIsolation='Fresh context and empty browser cache; HTTP/S proxy to unused local port 9, bypassing only localhost; external-origin routes aborted; local CSP connect-src self.';
 // New context has no pre-existing caches or user data; all external requests
 // are rejected. The local HTTP server serves the actual prebuilt dist/ files.
 context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true,serviceWorkers:'block'});
 await context.route('**/*',route=>{const request=route.request(),url=request.url();if(!/^https?:/.test(url))return route.continue();result.requests.push({url,method:request.method()});if(new URL(url).origin!==new URL(base).origin){result.externalRequests.push(url);return route.abort();}return route.continue();});
 const page=await context.newPage();page.on('pageerror',e=>result.pageErrors.push(e.message));
 await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 check('three artwork cards',await page.locator('[data-art]').count()===3);
 await page.screenshot({path:path.join(evidence,'desktop-initial.png'),fullPage:true});
 for(const id of ['yawning','desperate','fifer']){
  await page.locator(`[data-art="${id}"]`).click();await page.locator('#load-pair').click();await idle(page);
  const data=JSON.parse((await download(page,'#export-json',`${id}.json`)).toString());
  check(`${id}: two AI-labelled examples`,data.attempts.every(a=>a.provenance==='ai-generated'));
  check(`${id}: real valid pose results`,data.attempts.every(a=>a.analysis.status==='ok'&&a.analysis.poseError!==null&&Object.keys(a.analysis.points).length===33&&a.analysis.inferenceMs>=0));
  check(`${id}: max three suggestions`,data.attempts.every(a=>a.analysis.advice.length<=3));
  await page.locator('#reflection-text').fill('本次记录用于功能验收。素材为 AI 合成，不代表真人学习效果。');
  const png=await download(page,'#export-png',`${id}-comparison.png`);
  check(`${id}: PNG export dimensions`,png.subarray(0,8).toString('hex')==='89504e470d0a1a0a'&&png.readUInt32BE(16)===1800&&png.readUInt32BE(20)===1450);
  await page.locator('#save').click();await page.locator('#toast').filter({hasText:'已保存'}).waitFor();
  result.cases.push({id,statuses:data.attempts.map(a=>a.analysis.status),inferenceMs:data.attempts.map(a=>a.analysis.inferenceMs),poseErrors:data.attempts.map(a=>a.analysis.poseError)});
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.locator('#toast.visible').waitFor({state:'hidden',timeout:8000});await page.screenshot({path:path.join(evidence,`${id}-desktop.png`),fullPage:true});
 }
 await page.reload({waitUntil:'networkidle'});await page.locator('#records-toggle').click();
 await page.locator('.saved-record').first().waitFor();check('three saved sessions survive reload',await page.locator('.saved-record').count()===3);
 await page.locator('.restore').first().click();check('reflection restored',(await page.locator('#reflection-text').inputValue()).includes('功能验收'));
 await page.locator('.mirror').first().click();await idle(page);
 const mirrored=JSON.parse((await download(page,'#export-json','mirrored.json')).toString());check('mirror reruns real inference',mirrored.attempts[0].mirrored&&mirrored.attempts[0].analysis.status==='ok');
 await page.locator('input[data-upload="0"]').setInputFiles(path.join(root,'public/demo/fifer-after.png'));await idle(page);
 const uploaded=JSON.parse((await download(page,'#export-json','upload.json')).toString());check('file upload runs real inference',uploaded.attempts[0].provenance==='user-upload'&&uploaded.attempts[0].analysis.status==='ok');
 await page.setViewportSize({width:390,height:844});check('mobile has no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:path.join(evidence,'mobile.png'),fullPage:true});
 await page.locator('#records-toggle').click();await page.locator('.delete').first().click();await page.waitForFunction(()=>document.querySelectorAll('.saved-record').length===2);result.checks.push('delete saved session');await page.locator('#close-records').click();await page.reload({waitUntil:'networkidle'});await page.locator('#records-toggle').click();await page.locator('.saved-record').first().waitFor();check('deletion survives reload',await page.locator('.saved-record').count()===2);await page.locator('.restore').first().click();
 const blank=await page.evaluate(async()=>{const c=document.createElement('canvas');c.width=500;c.height=500;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,500,500);return c.toDataURL('image/png').split(',')[1];});
 await page.locator('input[data-upload="0"]').setInputFiles({name:'blank.png',mimeType:'image/png',buffer:Buffer.from(blank,'base64')});await idle(page);
 const empty=JSON.parse((await download(page,'#export-json','blank.json')).toString());check('no-person photo does not invent pose',empty.attempts[0].analysis.status==='no-person'&&empty.attempts[0].analysis.poseError===null);
 await page.locator('input[data-upload="0"]').setInputFiles({name:'broken.jpg',mimeType:'image/jpeg',buffer:Buffer.from('invalid image')});await idle(page);check('corrupt upload reports error',(await page.locator('#toast').innerText()).includes('损坏'));

 const stable=JSON.parse((await download(page,'#export-json','after-corrupt.json')).toString());check('corrupt upload preserves previous attempt',stable.attempts[0].id===empty.attempts[0].id);
 for(const [name,mimeType,buffer,message]of [['large.jpg','image/jpeg',Buffer.alloc(20*1024*1024+1),'20 MB'],['unsupported.heic','image/heic',Buffer.from('HEIC'),'HEIC']]){
  await page.locator('input[data-upload="0"]').setInputFiles({name,mimeType,buffer});await idle(page);check(name+' validation',(await page.locator('#toast').innerText()).includes(message));
 }
 const fixtures=await page.evaluate(async()=>{
  const im=new Image();im.src='/demo/fifer-after.png';await im.decode();
  const draw=(width,height,mime,kind)=>{const c=document.createElement('canvas');c.width=width;c.height=height;const x=c.getContext('2d');x.fillStyle='#ddd';x.fillRect(0,0,width,height);
   if(kind==='two'){x.drawImage(im,0,0,640,960);x.drawImage(im,700,0,640,960);}else if(kind==='crop'){x.drawImage(im,0,im.naturalHeight*.65,im.naturalWidth,im.naturalHeight*.35,0,0,width,height);}else{x.drawImage(im,0,0,width,height);}return c.toDataURL(mime,.92).split(',')[1];};
  return {tiny:draw(60,60,'image/png'),jpeg:draw(600,900,'image/jpeg'),webp:draw(600,900,'image/webp'),two:draw(1340,960,'image/png','two'),crop:draw(600,450,'image/png','crop')};
 });
 await page.locator('input[data-upload="0"]').setInputFiles({name:'tiny.png',mimeType:'image/png',buffer:Buffer.from(fixtures.tiny,'base64')});await idle(page);check('tiny photo rejected',(await page.locator('#toast').innerText()).includes('太小'));
 for(const [name,mimeType]of [['jpeg','image/jpeg'],['webp','image/webp'],['two','image/png'],['crop','image/png']]){
  await page.locator('input[data-upload="0"]').setInputFiles({name:name+'.'+(name==='jpeg'?'jpg':name==='webp'?'webp':'png'),mimeType,buffer:Buffer.from(fixtures[name],'base64')});await idle(page);
  const data=JSON.parse((await download(page,'#export-json',name+'.json')).toString());const a=data.attempts[0].analysis;
  if(name==='two')check('multiple people rejected',a.status==='multiple-people'&&a.poseError===null);
  else if(name==='crop')check('cropped legs cannot yield upper-body comparison',a.status!=='ok'&&a.poseError===null);
  else check(name+' image runs real inference',a.status==='ok'&&a.poseError!==null);
 }
 await page.setViewportSize({width:1440,height:1000});await page.locator('[data-art="desperate"]').click();await page.locator('#load-pair').click();await idle(page);
 await page.locator('#reflection-text').fill('观察画面。'.repeat(40));check('200-character reflection accepted',(await page.locator('#reflection-text').inputValue()).length===200);await download(page,'#export-png','reflection-200-characters.png');
 await page.locator('#show-points').uncheck();check('overlay toggle clears marker canvas',await page.locator('canvas.skeleton').first().evaluate(c=>!c.getContext('2d').getImageData(0,0,c.width,c.height).data.some(v=>v!==0)));await page.locator('#show-points').check();
 // Recreate the page/worker before fault injection so the model is not cached in memory.
 await page.route('**/models/pose_landmarker_full.task',route=>route.fulfill({status:404,body:'Missing model test'}));await page.reload({waitUntil:'networkidle'});await page.locator('#load-pair').click();await idle(page);
 const failed=JSON.parse((await download(page,'#export-json','missing-model.json')).toString());check('missing model reports failure and still shows palette',failed.attempts.every(a=>a.analysis.status==='model-error'&&a.analysis.poseError===null&&a.analysis.palette.length>0));await page.unroute('**/models/pose_landmarker_full.task');
 check('no outside-origin requests',result.externalRequests.length===0);check('no image upload requests',result.requests.every(r=>r.method==='GET'||r.method==='HEAD'));check('no uncaught page errors',result.pageErrors.length===0);
 result.passed=true;console.log('Browser checks passed:',result.checks.length);
}catch(error){result.error=error.stack||String(error);process.exitCode=1;console.error(result.error);}
finally{await context?.close();await browser?.close();result.finishedAt=new Date().toISOString();await writeFile(path.join(evidence,'acceptance.json'),JSON.stringify(result,null,2)+'\n');}
