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


