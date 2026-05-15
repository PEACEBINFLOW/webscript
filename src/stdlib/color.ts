export function hueFromAngle(angle: number): string {
const deg = (((angle / (Math.PI * 2)) * 360) + 180) % 360;
return hsl(${deg.toFixed(1)}, 80%, 60%);
}
export function distortionColor(n: number): string {
const ia = ((n - 2) * 180) / n;
if (ia < 90)  return '#8a60e0';
if (ia > 90)  return '#c8941a';
return '#2a9e6a';
}
export function decay(rate: number, alpha: number): string {
return rgba(0, 0, 0, ${(1 - rate) * alpha});
}
