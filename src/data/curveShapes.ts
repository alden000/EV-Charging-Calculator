import type { ChargeCurvePoint } from "./types";

/**
 * Relative charge-power multipliers (of peak kW) at SOC breakpoints
 * 0,10,20,...,100. These approximate publicly documented/observed
 * DC fast-charging taper shapes for common battery/architecture families.
 * They are intentionally simplified — the vehicle DB update pipeline
 * (see src/data/vehicleUpdater.ts) is meant to replace these with
 * measured per-vehicle curves over time.
 */
export const CURVE_SHAPES = {
  // 800V architecture with a strong flat plateau (Ioniq 5/6, EV6, Taycan)
  flat800v: [0.55, 0.95, 1.0, 1.0, 1.0, 0.95, 0.85, 0.7, 0.5, 0.35, 0.2],
  // Tesla LFP packs: quick ramp, long plateau, gradual taper
  teslaLfp: [0.5, 0.95, 1.0, 1.0, 0.95, 0.85, 0.75, 0.6, 0.45, 0.3, 0.15],
  // Tesla NCA/NCM packs: sharp early peak, continuous taper
  teslaNca: [0.6, 1.0, 0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15],
  // Typical 400V non-Tesla BEV
  gradualTaper: [0.4, 0.85, 1.0, 1.0, 0.9, 0.75, 0.6, 0.45, 0.3, 0.2, 0.1],
  // Older/simpler platforms (Leaf, Bolt): moderate peak, earlier fade
  slowLegacy: [0.5, 0.9, 1.0, 0.95, 0.75, 0.55, 0.4, 0.3, 0.2, 0.15, 0.1],
} as const;

export type CurveShapeName = keyof typeof CURVE_SHAPES;

const SOC_BREAKPOINTS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export function curveFromShape(peakKW: number, shape: CurveShapeName): ChargeCurvePoint[] {
  const multipliers = CURVE_SHAPES[shape];
  return SOC_BREAKPOINTS.map((soc, i) => ({
    soc,
    kw: Math.round(peakKW * multipliers[i] * 10) / 10,
  }));
}
