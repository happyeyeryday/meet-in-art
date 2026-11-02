import {test} from 'node:test';
import assert from 'node:assert/strict';
import {extractPalette,validateOptions} from '../dist/src/vendor/colorthief/pipeline.js';
import {MmcqQuantizer} from '../dist/src/vendor/colorthief/quantizers/mmcq.js';
function palette(data,width,height){return extractPalette(data,width,height,validateOptions({colorCount:5,quality:1,ignoreWhite:false,colorSpace:'oklch'}),new MmcqQuantizer());}
test('white background contributes its actual share',()=>{const data=new Uint8ClampedArray(400);for(let i=0;i<100;i++)data.set(i<70?[255,255,255,255]:[200,0,0,255],i*4);const colors=palette(data,10,10);assert.equal(colors.length,2);assert.equal(colors.find(c=>c.hex()==='#ffffff').proportion,.7);assert.equal(colors.find(c=>c.hex()==='#c80000').proportion,.3);});
test('single-color images are accepted without inventing five colors',()=>{const data=new Uint8ClampedArray(400);for(let i=0;i<100;i++)data.set([64,100,32,255],i*4);const colors=palette(data,10,10);assert.equal(colors.length,1);assert.equal(colors[0].hex(),'#406420');assert.equal(colors[0].proportion,1);});
test('palette proportions sum to one for multicolor data',()=>{const data=new Uint8ClampedArray(400);for(let i=0;i<100;i++)data.set([i*2,255-i*2,i,255],i*4);const colors=palette(data,10,10);assert.ok(colors.length<=5);assert.ok(Math.abs(colors.reduce((s,c)=>s+c.proportion,0)-1)<1e-10);});
