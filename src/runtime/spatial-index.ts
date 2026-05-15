import type { WSPoint } from '../types/ws-types';
import { distance } from '../stdlib/spatial';
export interface SpatialEntry {
id: string;
position: WSPoint;
radius: number;
entity: string;
}
export class SpatialIndex {
private entries: SpatialEntry[] = [];
insert(entry: SpatialEntry): void {
this.entries.push(entry);
}
update(id: string, position: WSPoint): void {
const entry = this.entries.find(e => e.id === id);
if (entry) entry.position = position;
}
query(point: WSPoint, radius: number): SpatialEntry[] {
return this.entries.filter(e =>
distance(point.x, point.y, e.position.x, e.position.y) <= radius
);
}
nearest(point: WSPoint, count = 1): SpatialEntry[] {
return this.entries
.map(e => ({ entry: e, d: distance(point.x, point.y, e.position.x, e.position.y) }))
.sort((a, b) => a.d - b.d)
.slice(0, count)
.map(r => r.entry);
}
all(): SpatialEntry[] {
return [...this.entries];
}
clear(): void {
this.entries = [];
}
}
