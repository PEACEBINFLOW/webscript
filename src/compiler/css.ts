import type { WSProgram, WSEntity, WSClassifier } from '../types/ws-types';
import type { CompileOptions } from '../types/compile-types';
import { resolveExpression } from './resolve';
import { PHI } from '../stdlib/math';
export class CSSCompiler {
private program: WSProgram;
private options: CompileOptions;
private prefix: string;
constructor(program: WSProgram, options: CompileOptions = {}) {
this.program = program;
this.options = options;
this.prefix = options.prefix || 'ws';
}
compile(): string {
const lines: string[] = [];
lines.push('/* WEBSCRIPT compiled CSS output /');
lines.push('/ authored by Peace Thabiwa, SAGEWORKS AI, Maun, Botswana */');
lines.push('');
lines.push(':root {');
lines.push(  --${this.prefix}-phi: ${PHI};);
lines.push(  --${this.prefix}-pi:  ${Math.PI};);
lines.push('');
for (const entity of this.program.entities) {
  for (const prop of entity.properties) {
    const val = resolveExpression(prop.value);
    if (typeof val === 'number') {
      lines.push(`  --${this.prefix}-${entity.name}-${prop.name}: ${val};`);
    }
  }
}

for (const constraint of this.program.constraints) {
  lines.push(`  --${this.prefix}-${constraint.target}-${constraint.property}: 0;`);
}

lines.push('}');
lines.push('');

for (const entity of this.program.entities) {
  lines.push(this.compileEntityCSS(entity));
}

for (const classifier of this.program.classifiers) {
  lines.push(this.compileClassifierCSS(classifier));
}

return lines.join('\n');
}
private compileEntityCSS(entity: WSEntity): string {
const lines: string[] = [];
const selector = .${this.prefix}-${entity.name};
lines.push(${selector} {);
const depthProp = entity.properties.find(p => p.name === 'depth');
if (depthProp) {
  const val = resolveExpression(depthProp.value);
  lines.push(`  perspective: ${val}px;`);
}

const opacityProp = entity.properties.find(p => p.name === 'opacity');
if (opacityProp) {
  const val = resolveExpression(opacityProp.value);
  lines.push(`  opacity: ${val};`);
}

const rotateProp = entity.properties.find(p => p.name === 'rotate');
if (rotateProp) {
  lines.push(`  transform-style: preserve-3d;`);
  lines.push(`  transition: transform 0.5s cubic-bezier(0.5, 0, 0.5, 1);`);
}

const bindConstraints = this.program.constraints.filter(c => c.target === entity.name);
if (bindConstraints.length > 0) {
  const transforms: string[] = [];
  for (const c of bindConstraints) {
    if (c.property === 'rotation') transforms.push(`rotate(var(--${this.prefix}-${entity.name}-rotation))`);
    if (c.property === 'scale')    transforms.push(`scale(var(--${this.prefix}-${entity.name}-scale))`);
  }
  if (transforms.length > 0) lines.push(`  transform: ${transforms.join(' ')};`);
}

lines.push('}');
lines.push('');
return lines.join('\n');
}
private compileClassifierCSS(classifier: WSClassifier): string {
const lines: string[] = [];
const angle = 360 / classifier.quantity;
lines.push(.${this.prefix}-${classifier.entity}.${classifier.classifier} {);
lines.push(  position: absolute;);
lines.push(});
lines.push('');
for (let i = 0; i < classifier.quantity; i++) {
  lines.push(`.${this.prefix}-${classifier.entity}.${classifier.classifier}:nth-child(${i + 1}) {`);
  lines.push(`  transform: rotate(${(angle * i).toFixed(2)}deg) translateX(var(--${this.prefix}-orbit-radius, 80px));`);
  lines.push(`}`);
}
lines.push('');
return lines.join('\n');
}
}
