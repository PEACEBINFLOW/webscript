#!/usr/bin/env node
import { cmdCompile, cmdParse } from './commands';
import type { WSTarget } from '../types/ws-types';
const args = process.argv.slice(2);
const command = args[0];
function printUsage(): void {
console.log('');
console.log('WEBSCRIPT v0.1 — Spatial Dimensional Language');
console.log('authored by Peace Thabiwa, SAGEWORKS AI, Maun, Botswana');
console.log('');
console.log('Usage:');
console.log('  ws compile <file.ws> [--target html|css|svg|js|typescript|sql|all]');
console.log('  ws parse   <file.ws>');
console.log('  ws version');
console.log('  ws help');
console.log('');
}
switch (command) {
case 'compile': {
const input  = args[1];
const tFlag  = args.indexOf('--target');
const target = (tFlag >= 0 ? args[tFlag + 1] : 'all') as WSTarget;
const oFlag  = args.indexOf('--out');
const outDir = oFlag >= 0 ? args[oFlag + 1] : undefined;
if (!input) { printUsage(); process.exit(1); }
cmdCompile(input, target, outDir);
break;
}
case 'parse': {
const input = args[1];
if (!input) { printUsage(); process.exit(1); }
cmdParse(input);
break;
}
case 'version':
console.log('WEBSCRIPT v0.1.0');
break;
case 'help':
default:
printUsage();
}
