import type { WSProgram, WSFetchDeclaration } from '../types/ws-types';
import type { CompileOptions } from '../types/compile-types';
import { resolveExpression } from './resolve';
import { PHI } from '../stdlib/math';
export class WSQLCompiler {
private program: WSProgram;
private options: CompileOptions;
constructor(program: WSProgram, options: CompileOptions = {}) {
this.program = program;
this.options = options;
}
compile(): string {
if (this.program.fetches.length === 0) return '-- no WSQL fetch declarations';
const lines: string[] = [];
lines.push('-- WEBSCRIPT WSQL compiled SQL output');
lines.push('-- authored by Peace Thabiwa, SAGEWORKS AI, Maun, Botswana');
lines.push('-- each fetch declaration compiles to a spatially-typed query');
lines.push('');

for (const fetch of this.program.fetches) {
  lines.push(this.compileFetch(fetch));
  lines.push('');
}

return lines.join('\n');
}
private compileFetch(fetch: WSFetchDeclaration): string {
const lines: string[] = [];
const limit = fetch.limit ? Math.round(Number(resolveExpression(fetch.limit))) : 10;
const table = fetch.source;
lines.push(`-- ws: fetch ${fetch.entity} from ${fetch.source}`);
lines.push(`SELECT`);
lines.push(`  *,`);
lines.push(`  ROW_NUMBER() OVER (ORDER BY id) - 1 AS ws_index,`);
lines.push(`  POWER(${PHI.toFixed(6)}, ROW_NUMBER() OVER (ORDER BY id) - 1) * 55 AS ws_orbital_radius,`);
lines.push(`  ((ROW_NUMBER() OVER (ORDER BY id) - 1) * (360.0 / ${limit})) AS ws_orbital_angle`);
lines.push(`FROM ${table}`);

if (fetch.where) {
  const whereVal = resolveExpression(fetch.where);
  lines.push(`WHERE id > 0`);
}

lines.push(`ORDER BY id ASC`);
lines.push(`LIMIT ${limit};`);

lines.push('');
lines.push(`-- spatial mapping result type:`);
lines.push(`-- ws_index:          integer   (0-based position in result)`);
lines.push(`-- ws_orbital_radius: float     (phi^index * 55, Fibonacci-derived)`);
lines.push(`-- ws_orbital_angle:  float     (evenly distributed around origin)`);

return lines.join('\n');
}
}
