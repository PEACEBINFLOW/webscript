import type { ParseTree, EntityNode, RelationalNode, ConstraintNode, ClassifierNode, FetchNode, PageBoundaryNode, PropertyNode, ExpressionNode } from '../parser/constructs';
import { ConstructType } from '../parser/constructs';
import type { WSProgram, WSEntity, WSProperty, WSExpression, WSRelation, WSConstraint, WSClassifier, WSFetchDeclaration, WSBoundary } from '../types/ws-types';
import { createProgram, createEntity } from './nodes';
export class ASTBuilder {
private tree: ParseTree;
constructor(tree: ParseTree) {
this.tree = tree;
}
build(): WSProgram {
const program = createProgram();
for (const node of this.tree) {
  switch (node.construct) {
    case ConstructType.ENTITY_DECLARATION:
      program.entities.push(this.buildEntity(node as EntityNode));
      break;
    case ConstructType.RELATIONAL_BINDING:
      program.entities.push(this.buildRelational(node as RelationalNode));
      break;
    case ConstructType.EQUATION_CONSTRAINT:
      program.constraints.push(this.buildConstraint(node as ConstraintNode));
      break;
    case ConstructType.CLASSIFIER_UNIT:
      program.classifiers.push(this.buildClassifier(node as ClassifierNode));
      break;
    case ConstructType.FETCH_DECLARATION:
      program.fetches.push(this.buildFetch(node as FetchNode));
      break;
    case ConstructType.PAGE_BOUNDARY:
      program.boundaries.push(this.buildBoundary(node as PageBoundaryNode));
      break;
  }
}

return program;
}
private buildEntity(node: EntityNode): WSEntity {
const entity = createEntity(node.name);
entity.properties = node.properties.map(p => this.buildProperty(p));
return entity;
}
private buildRelational(node: RelationalNode): WSEntity {
const relation: WSRelation = {
particle: node.particle as WSRelation['particle'],
target: node.parent
};
const entity = createEntity(node.entity, relation);
entity.properties = node.properties.map(p => this.buildProperty(p));
return entity;
}
private buildConstraint(node: ConstraintNode): WSConstraint {
return {
target: node.target,
property: node.property,
expr: this.buildExpression(node.expression)
};
}
private buildClassifier(node: ClassifierNode): WSClassifier {
return {
quantity: node.quantity,
type: node.classifier as WSClassifier['type'],
entity: node.entity,
parent: node.parent,
properties: node.properties?.map(p => this.buildProperty(p))
};
}
private buildFetch(node: FetchNode): WSFetchDeclaration {
const fetch: WSFetchDeclaration = {
entity: node.entity,
source: node.source
};
if (node.clauses.where)  fetch.where  = this.buildExpression(node.clauses.where);
if (node.clauses.order)  fetch.order  = this.buildExpression(node.clauses.order);
if (node.clauses.limit)  fetch.limit  = this.buildExpression(node.clauses.limit);
if (node.clauses.map)    fetch.map    = this.buildExpression(node.clauses.map);
if (node.clauses.radius) fetch.radius = this.buildExpression(node.clauses.radius);
if (node.clauses.color)  fetch.color  = this.buildExpression(node.clauses.color);
return fetch;
}
private buildBoundary(node: PageBoundaryNode): WSBoundary {
const props: Record<string, WSExpression> = {};
for (const p of node.properties) {
props[p.name] = this.buildExpression(p.value);
}
return {
type: 'circle',
equation: props.boundary || { type: 'literal', value: 0 },
origin: 'center'
};
}
private buildProperty(node: PropertyNode): WSProperty {
return { name: node.name, value: this.buildExpression(node.value) };
}
private buildExpression(node: ExpressionNode): WSExpression {
if (node.type === 'constant') {
return { type: 'constant', value: node.constant };
}
if (node.type === 'literal') {
return { type: 'literal', value: node.value };
}
if (node.type === 'reference') {
return { type: 'reference', path: node.path };
}
if (node.type === 'binary') {
return {
type: 'binary',
left: this.buildExpression(node.left!),
right: this.buildExpression(node.right!),
operator: node.operator as WSExpression['operator']
};
}
if (node.type === 'call') {
return {
type: 'call',
fn: node.fn as WSExpression['fn'],
args: node.args?.map(a => this.buildExpression(a)) || []
};
}
return { type: 'literal', value: 0 };
}
}
