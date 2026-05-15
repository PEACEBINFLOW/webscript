import type { WSProgram, WSEntity } from '../types/ws-types';
import type { CompileOptions } from '../types/compile-types';
export class TypeScriptCompiler {
private program: WSProgram;
private options: CompileOptions;
constructor(program: WSProgram, options: CompileOptions = {}) {
this.program = program;
this.options = options;
}
compile(): string {
const lines: string[] = [];
lines.push('// WEBSCRIPT compiled TypeScript output');
lines.push('// authored by Peace Thabiwa, SAGEWORKS AI, Maun, Botswana');
lines.push('');
lines.push('// base entity interface');
lines.push('export interface WSEntity {');
lines.push('  id:          string');
lines.push('  name:        string');
lines.push('  element?:    HTMLElement');
lines.push('  position?:   { x: number; y: number }');
lines.push('  properties:  Record<string, number | string>');
lines.push('}');
lines.push('');
lines.push('// spatial function types');
lines.push('export type WSHarmonic  = { fn: "harmonic";  arg: number }');
lines.push('export type WSOrbit     = { fn: "orbit";     target: string; r: number }');
lines.push('export type WSField     = { fn: "field";     value: number | string }');
lines.push('export type WSDistance  = { fn: "distance";  from: string }');
lines.push('');
for (const entity of this.program.entities) {
  lines.push(this.compileEntityInterface(entity));
}

for (const classifier of this.program.classifiers) {
  lines.push(`// ${classifier.quantity} ${classifier.classifier} ${classifier.entity}`);
  lines.push(`export type WS${capitalize(classifier.entity)}Array = Array<WSEntity & {`);
  lines.push(`  index:         number`);
  lines.push(`  orbitalAngle:  number`);
  lines.push(`  classifier:    '${classifier.classifier}'`);
  lines.push(`}>`);
  lines.push('');
}

lines.push('// constraint types');
for (const constraint of this.program.constraints) {
  lines.push(`// ${constraint.target}.${constraint.property} = reactive expression`);
  lines.push(`export type WS${capitalize(constraint.target)}${capitalize(constraint.property)} = number`);
}

return lines.join('\n');
}
private compileEntityInterface(entity: WSEntity): string {
const lines: string[] = [];
const name = capitalize(entity.name);
lines.push(export interface WS${name} extends WSEntity {);
if (entity.relation) {
  lines.push(`  parent:   '${entity.relation.target}'`);
}

for (const prop of entity.properties) {
  const tsType = this.inferType(prop.value.type);
  lines.push(`  ${prop.name}:   ${tsType}`);
}

lines.push('}');
lines.push('');
return lines.join('\n');
}
private inferType(exprType: string): string {
switch (exprType) {
case 'literal':   return 'number';
case 'call':      return 'WSHarmonic | WSOrbit | WSField';
case 'reference': return 'string';
case 'binary':    return 'number';
case 'constant':  return 'number';
default:          return 'unknown';
}
}
}
function capitalize(s: string): string {
return s.charAt(0).toUpperCase() + s.slice(1);
}
