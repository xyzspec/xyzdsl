export type RenderQuality = 'low' | 'balanced' | 'high';
export const QUALITY = {
  low: { dpr: 1, maxTier: 'preview' },
  balanced: { dpr: 1.5, maxTier: 'standard' },
  high: { dpr: 2, maxTier: 'detail' },
} as const;
export function isRenderQuality(value: unknown): value is RenderQuality {
  return value === 'low' || value === 'balanced' || value === 'high';
}
export function defaultQuality(memory?: number, cores?: number, _coarse = false): RenderQuality {
  return (memory !== undefined && memory <= 2) || (cores !== undefined && cores <= 2) ? 'low' : 'balanced';
}
export function initialQuality(): RenderQuality {
  if (typeof navigator === 'undefined') return 'balanced';
  return defaultQuality((navigator as Navigator & { deviceMemory?: number }).deviceMemory, navigator.hardwareConcurrency, typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches);
}
