export async function loadImage(src:string):Promise<HTMLImageElement>{return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('图片无法读取，请选择 JPG、PNG 或 WebP。'));im.src=src;});}
export async function decodePhoto(blob:Blob,mirrored=false):Promise<HTMLCanvasElement>{
 if(blob.size>20*1024*1024)throw new Error('照片超过 20 MB，请先缩小后重试。');
 if(!['image/jpeg','image/png','image/webp'].includes(blob.type))throw new Error('请使用 JPG、PNG 或 WebP 照片；HEIC 请先转换为 JPG。');
 const bitmap=await createImageBitmap(blob,{imageOrientation:'from-image'}).catch(()=>{throw new Error('图片内容损坏或格式不受支持，请换一张照片。');});
 try{
  if(bitmap.width<100||bitmap.height<100)throw new Error('照片太小，请使用至少 100×100 像素的图片。');
  const factor=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');
  canvas.width=Math.round(bitmap.width*factor);canvas.height=Math.round(bitmap.height*factor);
  const ctx=canvas.getContext('2d')!;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
  if(mirrored){ctx.translate(canvas.width,0);ctx.scale(-1,1);}ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);return canvas;
 }finally{bitmap.close();}
}
export async function canvasFromUrl(url:string):Promise<HTMLCanvasElement>{const im=await loadImage(url);const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;c.getContext('2d')!.drawImage(im,0,0);return c;}
export function photoBlob(dataUrl:string):Blob {
 const [header,encoded]=dataUrl.split(',');
 const type=/^data:(image\/(?:jpeg|png|webp));base64$/.exec(header)?.[1];
 if(!type||!encoded)throw new Error('本机照片数据无法读取，请重新上传。');
 return new Blob([Uint8Array.from(atob(encoded),c=>c.charCodeAt(0))],{type});
}
export function download(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
