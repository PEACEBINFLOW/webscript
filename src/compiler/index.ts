import type { WSProgram } from '../types/ws-types';
import type { CompileOptions, CompileResult } from '../types/compile-types';
import { HTMLCompiler }       from './html';
import { CSSCompiler }        from './css';
import { SVGCompiler }        from './svg';
import { JSCompiler }         from './js';
import { TypeScriptCompiler } from './typescript';
import { WSQLCompiler }       from './wsql';
export class Compiler {
private program: WSProgram;
private options: CompileOptions;
constructor(program: WSProgram, options: CompileOptions = {}) {
this.program = program;
this.options = options;
}
compile(): CompileResult {
const result: CompileResult = { errors: [], warnings: [] };
const target = this.options.target || 'all';
try {
  if (target === 'all' || target === 'html') {
    result.html = new HTMLCompiler(this.program, this.options).compile();
  }
  if (target === 'all' || target === 'css') {
    result.css = new CSSCompiler(this.program, this.options).compile();
  }
  if (target === 'all' || target === 'svg') {
    result.svg = new SVGCompiler(this.program, this.options).compile();
  }
  if (target === 'all' || target === 'js') {
    result.js = new JSCompiler(this.program, this.options).compile();
  }
  if (target === 'all' || target === 'typescript') {
    result.typescript = new TypeScriptCompiler(this.program, this.options).compile();
  }
  if (target === 'all' || target === 'sql') {
    result.sql = new WSQLCompiler(this.program, this.options).compile();
  }
  result.ast = JSON.stringify(this.program, null, 2);
} catch (err) {
  result.errors.push({
    code: 'WS500',
    message: err instanceof Error ? err.message : String(err)
  });
}

return result;
}
}

FILE 025 — src/compiler/html.ts
Path: /src/compiler/html.ts
import type { WSProgram, WSEntity, WSProperty, WSClassifier } from '../types/ws-types';
import type { CompileOptions } from '../types/compile-types';
import { resolveExpression } from './resolve';
export class HTMLCompiler {
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
lines.push('<!-- WEBSCRIPT compiled HTML output -->');
lines.push('<!-- authored by Peace Thabiwa, SAGEWORKS AI, Maun, Botswana -->');
lines.push('');
for (const entity of this.program.entities) {
  lines.push(this.compileEntity(entity));
}

for (const classifier of this.program.classifiers) {
  lines.push(this.compileClassifier(classifier));
}

return lines.join('\n');
}
private compileEntity(entity: WSEntity, indent = ''): string {
const attrs: string[] = [];
attrs.push(class="${this.prefix}-entity ${this.prefix}-${entity.name}");
if (entity.relation) {
  attrs.push(`data-${this.prefix}-particle="${entity.relation.particle}"`);
  attrs.push(`data-${this.prefix}-parent="${entity.relation.target}"`);
}

for (const prop of entity.properties) {
  const val = resolveExpression(prop.value);
  attrs.push(`data-${this.prefix}-${prop.name}="${val}"`);
}

const constraints = this.program.constraints
  .filter(c => c.target === entity.name)
  .map(c => c.property);

if (constraints.length > 0) {
  attrs.push(`data-${this.prefix}-bind="${constraints.join(',')}"`);
}

return `${indent}<div\n${indent}  ${attrs.join(`\n${indent}  `)}\n${indent}></div>`;
}
private compileClassifier(classifier: WSClassifier): string {
const lines: string[] = [];
lines.push(<!-- ${classifier.quantity} ${classifier.classifier} ${classifier.entity} -->);
const angle = 360 / classifier.quantity;
for (let i = 0; i < classifier.quantity; i++) {
  lines.push(`<div`);
  lines.push(`  class="${this.prefix}-${classifier.entity} ${classifier.classifier}"`);
  lines.push(`  data-${this.prefix}-index="${i}"`);
  lines.push(`  data-${this.prefix}-angle="${(angle * i).toFixed(2)}"`);
  if (classifier.parent) lines.push(`  data-${this.prefix}-parent="${classifier.parent}"`);
  lines.push(`></div>`);
}

return lines.join('\n');
}
}
