import * as fs from 'fs';
import * as path from 'path';
import { compile, parse } from '../index';
import type { WSTarget } from '../types/ws-types';
export function cmdCompile(inputPath: string, target: WSTarget = 'all', outputDir?: string): void {
const source = fs.readFileSync(inputPath, 'utf-8');
const result = compile(source, { target });
if (result.errors.length > 0) {
console.error('WEBSCRIPT compile errors:');
for (const err of result.errors) {
console.error(  [${err.code}] ${err.message});
}
process.exit(1);
}
const base = path.basename(inputPath, '.ws');
const dir  = outputDir || path.dirname(inputPath);
if (result.html)       writeOutput(path.join(dir, ${base}.html),       result.html);
if (result.css)        writeOutput(path.join(dir, ${base}.css),        result.css);
if (result.svg)        writeOutput(path.join(dir, ${base}.svg),        result.svg);
if (result.js)         writeOutput(path.join(dir, ${base}.js),         result.js);
if (result.typescript) writeOutput(path.join(dir, ${base}.d.ts),       result.typescript);
if (result.sql)        writeOutput(path.join(dir, ${base}.sql),        result.sql);
if (result.ast)        writeOutput(path.join(dir, ${base}.ast.json),   result.ast);
console.log(WEBSCRIPT compiled: ${inputPath} → ${target});
}
export function cmdParse(inputPath: string): void {
const source = fs.readFileSync(inputPath, 'utf-8');
const program = parse(source);
console.log(JSON.stringify(program, null, 2));
}
function writeOutput(filePath: string, content: string): void {
fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, content, 'utf-8');
console.log(  wrote: ${filePath});
}
