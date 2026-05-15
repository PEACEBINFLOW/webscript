import type { WSFetchDeclaration } from '../types/ws-types';
import { resolveExpression } from '../compiler/resolve';
import { PHI } from '../stdlib/math';
export class QueryBuilder {
private fetch: WSFetchDeclaration;
constructor(fetch: WSFetchDeclaration) {
this.fetch = fetch;
}
buildSQL(): string {
const limit = this.fetch.limit
? Math.round(Number(resolveExpression(this.fetch.limit)))
: 10;
const lines: string[] = [];
lines.push('SELECT');
lines.push('  *,');
lines.push('  ROW_NUMBER() OVER (ORDER BY id) - 1 AS ws_index,');
lines.push(`  POWER(${PHI.toFixed(6)}, ROW_NUMBER() OVER (ORDER BY id) - 1) * 55 AS ws_orbital_radius,`);
lines.push(`  ((ROW_NUMBER() OVER (ORDER BY id) - 1) * (360.0 / ${limit})) AS ws_orbital_angle`);
lines.push(`FROM ${this.fetch.source}`);
lines.push(`ORDER BY id ASC`);
lines.push(`LIMIT ${limit};`);
return lines.join('\n');
}
buildSpatialMap(rows: Record<string, any>[]): Record<string, any>[] {
const count = rows.length;
return rows.map((row, i) => ({
...row,
ws_index:          i,
ws_orbital_radius: Math.pow(PHI, i) * 55,
ws_orbital_angle:  (i * (360.0 / count))
}));
}
}
