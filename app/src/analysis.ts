import type { Point, Points, Frame, Advice, Analysis } from './types.ts';

export const ALGORITHM_VERSION = '1.0.0';
export const CONFIDENCE = 0.6;
export const JOINTS = [11, 12, 13, 14, 15, 16];
export const CONNECTIONS = [[11,12],[11,13],[13,15],[12,14],[14,16]];
const names: Record<number,string> = {11:'左肩',12:'右肩',13:'左肘',14:'右肘',15:'左腕',16:'右腕'};
const finite = (p: Point | undefined): p is Point => !!p && Number.isFinite(p.x) && Number.isFinite(p.y);
export function reliable(p: Point | undefined): p is Point {
  return finite(p) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1 &&
    (p.visibility ?? 1) >= CONFIDENCE && (p.presence ?? 1) >= CONFIDENCE;
}
function shoulderGeometry(points: Points, frame: Frame) {
  if (!(frame.width > 0 && frame.height > 0) || !reliable(points[11]) || !reliable(points[12])) return null;
  const l = points[11], r = points[12];
  const width = Math.hypot((l.x-r.x)*frame.width, (l.y-r.y)*frame.height);
  if (width < frame.width * 0.035) return null;
  return { x:(l.x+r.x)/2, y:(l.y+r.y)/2, width };
}
export function comparePose(reference: Points, referenceFrame: Frame, points: Points, frame: Frame): Pick<Analysis,'status'|'reason'|'points'|'matched'|'poseError'|'composition'|'advice'> {
  const a = shoulderGeometry(reference,referenceFrame), b = shoulderGeometry(points,frame);
  const matched = JOINTS.filter(id=>reliable(reference[id]) && reliable(points[id]));
  if (!a || !b) return {status:'partial',reason:'双肩没有同时清楚出现，暂时无法可靠判断姿态与人物位置。请让肩膀和手臂完整入镜。',points,matched,poseError:null,composition:null,advice:[]};
  const composition = { dx:b.x-a.x, dy:b.y-a.y, scaleRatio:(b.width/frame.width)/(a.width/referenceFrame.width) };
  const deltas = matched.filter(id=>id>=13).map(id=> {
    const p=points[id]!, r=reference[id]!;
    const dx = ((p.x-b.x)*frame.width/b.width)-((r.x-a.x)*referenceFrame.width/a.width);
    const dy = ((p.y-b.y)*frame.height/b.width)-((r.y-a.y)*referenceFrame.height/a.width);
    return {id,dx,dy,error:Math.hypot(dx,dy)};
  });
  const advice: Advice[]=[];
  if (Math.abs(composition.dx) > .05) advice.push({kind:'composition',title:`人物可以向画面${composition.dx>0?'左':'右'}移一点`,detail:`肩部中心横向相差约 ${Math.round(Math.abs(composition.dx)*100)}% 画幅。这里的左右指屏幕画面。`,magnitude:Math.abs(composition.dx)*3});
  if (Math.abs(composition.dy) > .06) advice.push({kind:'composition',title:`把人物在画面中的位置${composition.dy>0?'上移':'下移'}一点`,detail:`肩部中心纵向相差约 ${Math.round(Math.abs(composition.dy)*100)}% 画幅，可调整取景。`,magnitude:Math.abs(composition.dy)*3});
  if (composition.scaleRatio < .84 || composition.scaleRatio > 1.18) advice.push({kind:'composition',title:composition.scaleRatio<1?'试着让人物在画面中更大一些':'试着让人物在画面中更小一些',detail:`肩宽占画幅比例约为参考的 ${Math.round(composition.scaleRatio*100)}%。可调整镜头距离或取景；这不是全身面积。`,magnitude:Math.abs(Math.log(composition.scaleRatio))});
  if (deltas.length>=2) for (const d of [...deltas].sort((x,y)=>y.error-x.error)) {
    if (d.error<.2) continue;
    const vertical=Math.abs(d.dy)>=Math.abs(d.dx);
    const screenSide=points[d.id]!.x<.5?'画面左侧':'画面右侧';
    const direction=vertical?(d.dy>0?'抬高一点':'放低一点'):(d.dx>0?'向画面左侧移一点':'向画面右侧移一点');
    advice.push({kind:'pose',joint:d.id,title:`${names[d.id]}可以${direction}`,detail:`标记位于${screenSide}；已扣除人物远近与整体位置的影响。${vertical?'先调整高度，再观察手臂方向。':'左右指屏幕画面，关节名称按人物自身左右。'}`,magnitude:d.error});
  }
  const selected: Advice[]=[];
  // Keep at least one composition cue when needed; no more than two limb cues.
  const pose = advice.filter(a=>a.kind==='pose').sort((a,b)=>b.magnitude-a.magnitude);
  const comp = advice.filter(a=>a.kind==='composition').sort((a,b)=>b.magnitude-a.magnitude);
  if (pose[0]) selected.push(pose[0]);
  if (comp[0]) selected.push(comp[0]);
  if (pose[1]) selected.push(pose[1]); else if (comp[1]) selected.push(comp[1]);
  return {status:deltas.length>=2?'ok':'partial',reason:deltas.length>=2?'仅比较清楚可见的肩、肘、腕；数值表示几何差异，不评价艺术好坏。':'手臂可比较点不足，暂只展示人物位置和配色。',points,matched,poseError:deltas.length>=2?deltas.reduce((s,d)=>s+d.error,0)/deltas.length:null,composition,advice:selected};
}
export function emptyAnalysis(status: Analysis['status'], reason: string): Analysis {
  return {status,reason,points:{},matched:[],poseError:null,composition:null,advice:[],palette:[],inferenceMs:null};
}
export function mirrorPoints(points: Points): Points {
  const out: Points={};
  for(const [key,p] of Object.entries(points)) if(p) out[Number(key)]={...p,x:1-p.x};
  // Anatomical IDs remain attached to the same person; do not relabel left/right.
  return out;
}
export function poseChange(first: number | null, second: number | null): string {
  if(first===null || second===null) return '有效姿态信息不足，暂不比较变化';
  const delta=second-first;
  if(Math.abs(delta)<.03) return '两次姿态差异接近';
  return delta<0?'第二次的姿态更接近参考':'第二次的姿态与参考差异增大';
}
/** Compare the same visible joints in both attempts, so occlusion cannot
 * improve the result merely by removing a poorly matched limb. */
export function comparePair(reference: Points, referenceFrame: Frame, first: {points: Points; frame: Frame}, second: {points: Points; frame: Frame}) {
  const common = JOINTS.filter(id=>reliable(reference[id]) && reliable(first.points[id]) && reliable(second.points[id]));
  const filter = (points: Points): Points => Object.fromEntries(common.map(id=>[id,points[id]]));
  const a = comparePose(reference,referenceFrame,filter(first.points),first.frame);
  const b = comparePose(reference,referenceFrame,filter(second.points),second.frame);
  const joints = common.filter(id=>id>=13);
  return {first:a.poseError,second:b.poseError,joints,summary:poseChange(a.poseError,b.poseError),
    detail:a.poseError!==null && b.poseError!==null ? `仅比较两次都清楚可见的 ${joints.length} 个肘、腕；误差 ${a.poseError.toFixed(2)} → ${b.poseError.toFixed(2)} 肩宽。` : '两次需要共同可见的双肩，以及至少两个肘、腕，才能比较变化。'};
}
