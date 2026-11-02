import {getPaletteSync} from './vendor/colorthief/sync.ts';
import type {Swatch} from './types.ts';
export function paletteFrom(source: HTMLCanvasElement): Swatch[] {
  const small=document.createElement('canvas');small.width=192;small.height=Math.max(1,Math.round(192*source.height/source.width));
  small.getContext('2d')!.drawImage(source,0,0,small.width,small.height);
  const palette=getPaletteSync(small,{colorCount:5,quality:3,ignoreWhite:false,colorSpace:'oklch'});
  return (palette??[]).map(c=>({hex:c.hex(),proportion:c.proportion}));
}
