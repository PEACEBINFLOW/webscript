import type { WSNode, WSPoint } from '../types/ws-types';
import { PHI, TAU } from '../stdlib/math';
import { orbit } from '../stdlib/spatial';
export function mapResultsToSpatial(
rows: Record<string, any>[],
cx: number,
cy: number
): WSNode[] {
const count = rows.length;
return rows.map((row, i) => {
const r     = Math.pow(PHI, i % 5) * 55;
const angle = (TAU / count) * i;
const pos   = orbit(cx, cy, r, angle);
return {
entity: {
id:         wsql_node_${i},
name:       String(row.name || node_${i}),
properties: Object.entries(row).map(([name, value]) => ({
name,
value: { type: 'literal', value: typeof value === 'number' ? value : String(value) }
}))
},
position:      pos,
orbitalAngle:  angle,
orbitalRadius: r,
data:          row
};
});
}
