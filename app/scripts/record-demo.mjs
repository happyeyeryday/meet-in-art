import {chromium} from '@playwright/test';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.resolve(root,'../deliverables'),evidence=path.resolve(root,'../evidence/recording');
await mkdir(evidence,{recursive:true});
const base=process.env.DEMO_URL||'http://127.0.0.1:4173';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw new Error('Recording must use localhost.');
const log={kind:'Continuous live browser recording with explanatory captions; no simulated landmarks or scores',syntheticPhotos:true,externalRequests:[],events:[],completed:false};
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--disable-background-networking','--proxy-server=http://127.0.0.1:9','--proxy-bypass-list=127.0.0.1;localhost']});
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:evidence,size:{width:1440,height:900}},acceptDownloads:true,serviceWorkers:'block'});
await context.route('**/*',route=>{const u=route.request().url();if(/^https?:/.test(u)&&new URL(u).origin!==new URL(base).origin){log.externalRequests.push(u);return route.abort();}return route.continue();});
const page=await context.newPage(),video=page.video(),start=Date.now();log.browser=browser.version();log.startedAt=new Date().toISOString();
const holdUntil=async seconds=>{const remaining=seconds*1000-(Date.now()-start);if(remaining>0)await page.waitForTimeout(remaining);};
const idle=()=>page.locator('.busy-indicator').waitFor({state:'hidden',timeout:90000});
async function caption(text){log.events.push({seconds:(Date.now()-start)/1000,caption:text});console.log(text);await page.evaluate(text=>{let e=document.querySelector('#recording-caption');if(!e){e=document.createElement('div');e.id='recording-caption';e.style.cssText='position:fixed;bottom:14px;left:50%;transform:translateX(-50%);max-width:1150px;width:max-content;padding:13px 24px;background:#243026ee;color:#fff9ed;border-radius:4px;font:18px/1.7 "Microsoft YaHei",sans-serif;z-index:9999;pointer-events:none;box-shadow:0 4px 18px #0003;text-align:center';document.body.append(e);}e.textContent='演示字幕 · '+text;},text);}
const scroll=async selector=>{await page.locator(selector).evaluate(e=>e.scrollIntoView({behavior:'smooth',block:'start'}));await page.waitForTimeout(700);};
try{
 await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 await caption('与画相逢：选一幅画，拍两次，留下自己的观察。内置照片均为 AI 合成。');await holdUntil(10);
 await page.locator('[data-art="desperate"]').click();await scroll('#studio');await caption('观察《绝望的人》：手臂的折线、紧凑的取景和浅色衣袖。');await holdUntil(24);
 await page.locator('.demo-single[data-slot="0"]').click();await idle();await scroll('#studio');await caption('第一次示例已由本机 MediaPipe 实际识别。青色是照片关键点，黄色是原画人工参考点。');await holdUntil(39);
 await scroll('.feedback');await caption('建议解释具体的姿态和构图差异。误差单位是肩宽，不是艺术评分。');await holdUntil(53);
 await page.locator('.demo-single[data-slot="1"]').click();await idle();await scroll('#studio');await caption('第二次双臂展开。两张照片都重新推理，没有预填分数。');await holdUntil(69);
 await page.locator('#show-points').uncheck();await page.waitForTimeout(2500);await page.locator('#show-points').check();await caption('标记可以关闭，重新观察照片本身；相似程度只是一个观察线索。');await holdUntil(81);
 await scroll('.palette-comparison');await caption('主要色块和比例单独比较。可以用日常衣服、道具和背景重新演绎。');await holdUntil(95);
 await scroll('#reflection');await page.locator('#reflection-text').fill('第二次双肘展开后，我更注意到手臂围住头部的折线。保留白衬衫和日常背景。这是 AI 合成示例的功能演示。');await page.locator('#save').click();await caption('只比较两次共同可见的关节；记录拍摄想法，并保存到当前浏览器。');await holdUntil(109);
 const event=page.waitForEvent('download');await page.locator('#export-png').click();const item=await event;const exported=path.join(evidence,'recorded-export.png');await item.saveAs(exported);await idle();
 const jsonEvent=page.waitForEvent('download');await page.locator('#export-json').click();await(await jsonEvent).saveAs(path.join(evidence,'recorded-session.json'));
 await page.goto(pathToFileURL(exported).href);await caption('这是刚刚导出的真实 PNG：原画、两次照片、实测差异和个人说明。');await holdUntil(124);
 await page.goto(base,{waitUntil:'networkidle'});await page.locator('#records-toggle').click();await page.locator('.restore').first().waitFor();await caption('刷新后仍能从“我的记录”恢复照片与说明；照片没有上传到服务器。');await holdUntil(135);
 await page.locator('.restore').first().click();await scroll('#reflection');await caption('本地恢复完成。清理浏览器数据会删除记录，因此也提供 PNG 和 JSON 导出。');await holdUntil(144);
 await page.locator('[data-art="fifer"]').click();await page.locator('#load-pair').click();await idle();await scroll('#studio');await caption('三幅画都可离线使用。AI 合成演示不能替代真人试用，也不能证明学习效果。');await holdUntil(158);
 log.completed=true;log.durationSeconds=(Date.now()-start)/1000;
}finally{await context.close();await video.saveAs(path.join(out,'名画仿拍_真实演示.webm'));await browser.close();log.finishedAt=new Date().toISOString();await writeFile(path.join(evidence,'recording.json'),JSON.stringify(log,null,2)+'\n');}
console.log('Saved live browser recording.');
