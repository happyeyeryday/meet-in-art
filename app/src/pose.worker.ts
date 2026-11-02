/** Adapted from Google AI Edge MediaPipe samples' pose-landmarker.worker.ts.
 * Copyright 2026 The MediaPipe Authors. Apache-2.0. See licenses/. */
let instance:any=null;
let initialization:Promise<any>|null=null;
async function init(){
 if(instance)return instance;
 if(!initialization)initialization=(async()=>{
  const runtimeURL='/wasm/vision_bundle.mjs';
  const library=await import(/* @vite-ignore */ runtimeURL) as typeof import('@mediapipe/tasks-vision');
  // The official BaseWorker selects module-compatible loaders with true.
  const fileset=await library.FilesetResolver.forVisionTasks('/wasm',true);
  instance=await library.PoseLandmarker.createFromOptions(fileset,{
   baseOptions:{modelAssetPath:'/models/pose_landmarker_full.task',delegate:'CPU'},
   runningMode:'IMAGE',numPoses:2,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,outputSegmentationMasks:false
  });return instance;
 })().catch(error=>{initialization=null;throw error;});
 return initialization;
}
self.onmessage=async(event:MessageEvent)=>{
 const {id,bitmap}=event.data;
 try{const landmarker=await init();const start=performance.now();const result=landmarker.detect(bitmap);
  self.postMessage({id,poses:result.landmarks,inferenceMs:performance.now()-start});
 }catch(error){self.postMessage({id,error:error instanceof Error?error.message:String(error)});}
 finally{bitmap?.close();}
};
