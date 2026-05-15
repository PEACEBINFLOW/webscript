export enum ConstructType {
ENTITY_DECLARATION  = 'ENTITY_DECLARATION',
RELATIONAL_BINDING  = 'RELATIONAL_BINDING',
EQUATION_CONSTRAINT = 'EQUATION_CONSTRAINT',
CLASSIFIER_UNIT     = 'CLASSIFIER_UNIT',
FETCH_DECLARATION   = 'FETCH_DECLARATION',
PAGE_BOUNDARY       = 'PAGE_BOUNDARY',
EVERY_DECLARATION   = 'EVERY_DECLARATION'
}
export interface ParseNode {
construct: ConstructType;
line: number;
column: number;
raw: string;
}
export interface EntityNode extends ParseNode {
construct: ConstructType.ENTITY_DECLARATION;
name: string;
properties: PropertyNode[];
}
export interface RelationalNode extends ParseNode {
construct: ConstructType.RELATIONAL_BINDING;
entity: string;
particle: string;
parent: string;
properties: PropertyNode[];
}
export interface ConstraintNode extends ParseNode {
construct: ConstructType.EQUATION_CONSTRAINT;
target: string;
property: string;
expression: ExpressionNode;
}
export interface ClassifierNode extends ParseNode {
construct: ConstructType.CLASSIFIER_UNIT;
quantity: number;
classifier: string;
entity: string;
parent?: string;
properties?: PropertyNode[];
}
export interface FetchNode extends ParseNode {
construct: ConstructType.FETCH_DECLARATION;
entity: string;
source: string;
clauses: Record<string, ExpressionNode>;
}
export interface PageBoundaryNode extends ParseNode {
construct: ConstructType.PAGE_BOUNDARY;
properties: PropertyNode[];
}
export interface PropertyNode {
name: string;
value: ExpressionNode;
line: number;
}
export interface ExpressionNode {
type: 'literal' | 'reference' | 'binary' | 'call' | 'constant';
value?: number | string;
path?: string;
left?: ExpressionNode;
right?: ExpressionNode;
operator?: string;
fn?: string;
args?: ExpressionNode[];
constant?: 'phi' | 'pi' | 'tau';
}
export type ParseTree = Array
EntityNode | RelationalNode | ConstraintNode |
ClassifierNode | FetchNode | PageBoundaryNode

;


FILE 015 — src/parser/errors.ts
Path: /src/parser/errors.ts
export class WSParseError extends Error {
public readonly code: string;
public readonly line: number;
public readonly column: number;
public readonly source: string;
constructor(message: string, code: string, line: number, column: number, source = '') {
super(message);
this.name = 'WSParseError';
this.code = code;
this.line = line;
this.column = column;
this.source = source;
}
}
export const ERROR_CODES = {
UNEXPECTED_TOKEN:    'WS001',
MISSING_BRACE:       'WS002',
MISSING_COLON:       'WS003',
INVALID_PARTICLE:    'WS004',
INVALID_CLASSIFIER:  'WS005',
INVALID_EXPRESSION:  'WS006',
MISSING_ENTITY_NAME: 'WS007',
INVALID_CONSTRAINT:  'WS008',
MISSING_PAREN:       'WS009',
UNKNOWN_FUNCTION:    'WS010'
};
