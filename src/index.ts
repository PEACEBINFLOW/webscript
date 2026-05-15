import { Lexer } from './lexer/index';
import { Parser } from './parser/index';
import { ASTBuilder } from './ast/index';
import { Compiler } from './compiler/index';
import { Runtime } from './runtime/index';
import { WSQLBridge } from './wsql/index';
import type { CompileOptions, CompileResult, WSProgram } from './types/index';
export { Lexer } from './lexer/index';
export { Parser } from './parser/index';
export { ASTBuilder } from './ast/index';
export { Compiler } from './compiler/index';
export { Runtime } from './runtime/index';
export { WSQLBridge } from './wsql/index';
export type {
CompileOptions,
CompileResult,
WSProgram,
WSEntity,
WSConstraint,
WSParticle,
WSClassifier,
WSBoundary,
WSNode
} from './types/index';
export const VERSION = '0.1.0';
export const AUTHOR = {
name: 'Peace Thabiwa',
organization: 'SAGEWORKS AI',
location: 'Maun, Botswana'
};
export const LANGUAGE = {
name: 'WEBSCRIPT',
version: VERSION,
targets: ['html', 'css', 'svg', 'js', 'typescript', 'sql'] as const,
particles: ['of', 'at', 'as', 'by', 'through', 'into', 'from'] as const,
classifiers: ['orbital', 'harmonic', 'depth', 'fibonacci', 'angular', 'spatial'] as const
};
export function compile(source: string, options: CompileOptions = {}): CompileResult {
const lexer = new Lexer(source);
const tokens = lexer.tokenize();
const parser = new Parser(tokens);
const parseTree = parser.parse();
const ast = new ASTBuilder(parseTree).build();
return new Compiler(ast, options).compile();
}
export function parse(source: string): WSProgram {
const lexer = new Lexer(source);
const tokens = lexer.tokenize();
const parser = new Parser(tokens);
const parseTree = parser.parse();
return new ASTBuilder(parseTree).build();
}
export function createRuntime(program: WSProgram): Runtime {
return new Runtime(program);
}
