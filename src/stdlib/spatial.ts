import type { WSPoint } from '../types/ws-types';
export function orbit(cx: number, cy: number, r: number, angle: number): WSPoint {
return {
x: cx + r * Math.cos(angle),
y: cy + r * Math.sin(angle)
};
}
export function distance(ax: number, ay: number, bx: number, by: number): number {
return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
}
export function insideCircle(x: number, y: number, cx: number, cy: number, r: number): boolean {
return Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= Math.pow(r, 2);
}
export function polygonVertices(n: number, cx: number, cy: number, r: number, startAngle = -Math.PI / 2): WSPoint[] {
return Array.from({ length: n }, (_, i) => {
const a = startAngle + (Math.PI * 2 / n) * i;
return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
});
}
export function insidePolygon(px: number, py: number, verts: WSPoint[]): boolean {
let inside = false;
for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
const xi = verts[i].x, yi = verts[i].y;
const xj = verts[j].x, yj = verts[j].y;
if (((yi > py) !== (yj > py)) && (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)) {
inside = !inside;
}
}
return inside;
}
export function exteriorAngleVectors(n: number, startDeg: number): Array<{ dx: number; dy: number; deg: number }> {
const step = 360 / n;
return Array.from({ length: n }, (_, i) => {
const deg = startDeg + step * i;
const rad = deg * (Math.PI / 180);
return { dx: Math.cos(rad), dy: Math.sin(rad), deg };
});
}
