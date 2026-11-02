import type {Artwork,ComparisonSession} from './types.ts';
import {loadImage,download} from './images.ts';
import {comparePair} from './analysis.ts';
export function exportJSON(session:ComparisonSession){download(new Blob([JSON.stringify(session,null,2)],{type:'application/json'}),'名画仿拍记录-'+session.artworkId+'.json');}
function wrap(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,width:number,line=34){let row='';for(const ch of text){if(ctx.measureText(row+ch).width>width){ctx.fillText(row,x,y);y+=line;row='';}row+=ch;}if(row)ctx.fillText(row,x,y);return y+line;}
export async function exportPNG(art:Artwork,session:ComparisonSession){
 const canvas=document.createElement('canvas');canvas.width=1800;canvas.height=1450;const ctx=canvas.getContext('2d')!;
 ctx.fillStyle='#f6f2e9';ctx.fillRect(0,0,1800,1450);ctx.fillStyle='#232823';ctx.font='bold 48px PaintingCJK, sans-serif';ctx.fillText('与画相逢',70,85);
 ctx.font='26px PaintingCJK, sans-serif';ctx.fillText(`${art.title} · ${art.artist} · ${art.year}`,70,135);
 const sources=[art.image,...session.attempts.map(a=>a?.dataUrl)];const labels=['参考原画','第一次尝试','第二次尝试'];
 for(let i=0;i<3;i++){
  const x=70+i*575;ctx.fillStyle='#e9e3d8';ctx.fillRect(x,180,535,720);
  if(sources[i])try{const im=await loadImage(sources[i]!);const scale=Math.min(535/im.naturalWidth,720/im.naturalHeight);ctx.drawImage(im,x+(535-im.naturalWidth*scale)/2,180+(720-im.naturalHeight*scale)/2,im.naturalWidth*scale,im.naturalHeight*scale);}catch{}
  ctx.fillStyle='#232823';ctx.font='bold 28px PaintingCJK, sans-serif';ctx.fillText(labels[i],x,945);
  ctx.font='22px PaintingCJK, sans-serif';if(i>0){const a=session.attempts[i-1];ctx.fillText(a?.provenance==='ai-generated'?'AI 合成演示素材 · 非真人试用':'用户上传照片',x,984);ctx.fillText(a?.analysis.poseError===null||!a?'姿态：有效信息不足':`姿态差异：${a.analysis.poseError.toFixed(2)} 肩宽`,x,1022);}
 }
 const [first,second]=session.attempts;const pair=first&&second?comparePair(art.reference,art.frame,{points:first.analysis.points,frame:first},{points:second.analysis.points,frame:second}):null;
 ctx.fillStyle='#9a4534';ctx.font='bold 30px PaintingCJK, sans-serif';ctx.fillText(pair?.summary??'有效姿态信息不足，暂不比较变化',70,1100);
 ctx.fillStyle='#6d726a';ctx.font='21px PaintingCJK, sans-serif';ctx.fillText(pair?.detail??'',70,1138);
 ctx.fillStyle='#232823';ctx.font='26px PaintingCJK, sans-serif';wrap(ctx,'拍摄想法：'+(session.reflection||'尚未填写'),70,1190,1660,40);
 ctx.fillStyle='#6d726a';ctx.font='21px PaintingCJK, sans-serif';wrap(ctx,'几何差异仅供观察；相似程度不代表作品优劣。此记录不构成学习效果的证据。',70,1340,1660,30);
 ctx.fillText('朱昭荣 · 宋琪语  /  艺术与 AI 课程项目',70,1410);
 const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('导出图片失败，请重试。');download(blob,'与画相逢-'+art.id+'.png');
}
