import type { WSProgram, WSClassifier } from '../types/ws-types';
import type { CompileOptions } from '../types/compile-types';
import { resolveExpression } from './resolve';
import { PHI, PI, TAU } from '../stdlib/math';
import { polygonVertices } from '../stdlib/spatial';
export class SVGCompiler {
private program: WSProgram;
private options: CompileOptions;
constructor(program: WSProgram, options: CompileOptions = {}) {
this.program = program;
this.options = options;
}
compile(): string {
const lines: string[] = [];
lines.push('<!-- WEBSCRIPT compiled SVG output -->');
lines.push('<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" data-ws-version="0.1">');
lines.push('  <defs>');
lines.push('    <filter id="ws-glow">');
lines.push('      <feGaussianBlur stdDeviation="3" result="b"/>');
lines.push('      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>');
lines.push('    </filter>');
lines.push('  </defs>');
lines.push('');
for (const boundary of this.program.boundaries) {
  const r = resolveExpression(boundary.equation);
  if (typeof r === 'number') {
    lines.push(`  <!-- page boundary: ${boundary.type} -->`);
    lines.push(`  <clipPath id="ws-page-boundary">`);
    lines.push(`    <circle cx="200" cy="200" r="${r}"/>`);
    lines.push(`  </clipPath>`);
    lines.push('');
  }
}

for (const entity of this.program.entities) {
  lines.push(`  <!-- entity: ${entity.name} -->`);
  lines.push(`  <g data-ws-entity="${entity.name}" id="ws-${entity.name}">`);
  lines.push(`  </g>`);
}

for (const classifier of this.program.classifiers) {
  lines.push(this.compileSVGClassifier(classifier));
}

lines.push('</svg>');
return lines.join('\n');
}
private compileSVGClassifier(classifier: WSClassifier): string {
const lines: string[] = [];
const count = classifier.quantity;
const cx = 200, cy = 200, r = 80;
lines.push(  <!-- ${count} ${classifier.classifier} ${classifier.entity} -->);
lines.push(  <g data-ws-classifier="${classifier.classifier}" data-ws-count="${count}">);
lines.push(    <!-- orbit ring -->);
lines.push(    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(232,255,71,0.2)" stroke-width="1" stroke-dasharray="3 6"/>);
for (let i = 0; i < count; i++) {
  const a = (TAU / count) * i - PI / 2;
  const x = (cx + r * Math.cos(a)).toFixed(2);
  const y = (cy + r * Math.sin(a)).toFixed(2);
  lines.push(`    <!-- node ${i} · angle: ${((TAU / count) * i * 180 / PI).toFixed(1)}° -->`);
  lines.push(`    <circle cx="${x}" cy="${y}" r="5" data-ws-index="${i}" filter="url(#ws-glow)"/>`);
}

lines.push('  </g>');
return lines.join('\n');
}
}
