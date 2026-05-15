export type WSTarget = 'html' | 'css' | 'svg' | 'js' | 'typescript' | 'sql' | 'all';
export type WSParticleKeyword = 'of' | 'at' | 'as' | 'by' | 'through' | 'into' | 'from';
export type WSClassifierKeyword =
| 'orbital'
| 'harmonic'
| 'depth'
| 'fibonacci'
| 'angular'
| 'spatial';
export type WSBuiltinFunction =
| 'harmonic'
| 'orbit'
| 'distance'
| 'field'
| 'hue'
| 'decay'
| 'fibonacci'
| 'harmonic_scale';
export type WSOperator = '+' | '-' | '*' | '/' | '^' | '%';
export type WSScalar = number | string;
export interface WSPoint {
x: number;
y: number;
z?: number;
}
export interface WSExpression {
type: 'literal' | 'reference' | 'binary' | 'call' | 'phi' | 'pi' | 'tau';
value?: WSScalar;
path?: string;
left?: WSExpression;
right?: WSExpression;
operator?: WSOperator;
fn?: WSBuiltinFunction;
args?: WSExpression[];
}
export interface WSProperty {
name: string;
value: WSExpression;
}
export interface WSRelation {
particle: WSParticleKeyword;
target: string;
}
export interface WSConstraint {
target: string;
property: string;
expr: WSExpression;
}
export interface WSClassifier {
quantity: number;
type: WSClassifierKeyword;
entity: string;
parent?: string;
}
export interface WSBoundary {
type: 'circle' | 'triangle' | 'polygon' | 'rectangle';
equation: WSExpression;
origin: 'center' | 'corner' | WSPoint;
sides?: number;
}
export interface WSEntity {
id: string;
name: string;
relation?: WSRelation;
properties: WSProperty[];
children?: WSEntity[];
}
export interface WSFetchDeclaration {
entity: string;
source: string;
where?: WSExpression;
order?: WSExpression;
limit?: WSExpression;
map?: WSExpression;
radius?: WSExpression;
color?: WSExpression;
}
export interface WSNode {
entity: WSEntity;
position?: WSPoint;
orbitalAngle?: number;
orbitalRadius?: number;
data?: Record<string, WSScalar>;
}
export interface WSProgram {
version: string;
author: string;
entities: WSEntity[];
constraints: WSConstraint[];
classifiers: WSClassifier[];
boundaries: WSBoundary[];
fetches: WSFetchDeclaration[];
}
