import type { WSTarget } from './ws-types';
export interface CompileOptions {
target?: WSTarget;
phi?: boolean;
minify?: boolean;
sourceMap?: boolean;
prefix?: string;
customProperties?: boolean;
generateTypes?: boolean;
}
export interface CompileResult {
html?: string;
css?: string;
svg?: string;
js?: string;
typescript?: string;
sql?: string;
ast?: string;
errors: CompileError[];
warnings: CompileWarning[];
}
export interface CompileError {
code: string;
message: string;
line?: number;
column?: number;
source?: string;
}
export interface CompileWarning {
code: string;
message: string;
line?: number;
column?: number;
}
