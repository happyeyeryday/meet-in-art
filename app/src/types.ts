export interface Point { x: number; y: number; visibility?: number; presence?: number }
export type Points = Partial<Record<number, Point>>;
export interface Frame { width: number; height: number }
export interface Artwork {
  id: string; title: string; englishTitle: string; artist: string; year: string;
  image: string; source: string; imageSource: string; license: string;
  focus: string; observation: string; observations: string[]; props: string[];
  reference: Points; frame: Frame; demo: [string, string];
}
export interface Swatch { hex: string; proportion: number }
export interface Advice { kind: 'pose' | 'composition'; title: string; detail: string; joint?: number; magnitude: number }
export interface Analysis {
  status: 'ok' | 'partial' | 'no-person' | 'multiple-people' | 'model-error';
  reason: string; points: Points; matched: number[]; poseError: number | null;
  composition: { dx: number; dy: number; scaleRatio: number } | null;
  advice: Advice[]; palette: Swatch[]; inferenceMs: number | null;
}
export interface Attempt {
  id: string; dataUrl: string; width: number; height: number; filename: string;
  provenance: 'user-upload' | 'ai-generated'; mirrored: boolean;
  analysis: Analysis; createdAt: string;
}
export interface ComparisonSession {
  schemaVersion: 1; id: string; artworkId: string; attempts: [Attempt | null, Attempt | null];
  reflection: string; savedAt: string; modelVersion: string; algorithmVersion: string;
}
