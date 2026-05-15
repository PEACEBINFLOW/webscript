export const PHI   = 1.618033988749895;
export const PI    = Math.PI;
export const TAU   = Math.PI * 2;
export function harmonic(t: number): number {
return 0.5 - Math.cos(t * PI) / 2;
}
export function phi_r(i: number, base: number): number {
return Math.pow(PHI, i) * base;
}
export function fibonacci(n: number): number[] {
const seq = [1, 1];
for (let i = 2; i < n; i++) {
seq.push(seq[i - 1] + seq[i - 2]);
}
return seq.slice(0, n);
}
export function intAngle(n: number): number {
return ((n - 2) * 180) / n;
}
export function extAngle(n: number): number {
return 360 / n;
}
export function distortionScale(n: number): number {
return 0.4 + (180 - intAngle(n)) / 120 * 1.8;
}
export function clamp(value: number, min: number, max: number): number {
return Math.max(min, Math.min(max, value));
}
export function lerp(a: number, b: number, t: number): number {
return a + (b - a) * t;
}
export function normalize(value: number, min: number, max: number): number {
return (value - min) / (max - min);
}
