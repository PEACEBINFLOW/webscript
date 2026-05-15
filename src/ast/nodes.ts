import type {
WSProgram,
WSEntity,
WSConstraint,
WSClassifier,
WSBoundary,
WSFetchDeclaration,
WSProperty,
WSExpression,
WSRelation
} from '../types/ws-types';
export function createProgram(): WSProgram {
return {
version: '0.1.0',
author: 'Peace Thabiwa / SAGEWORKS AI',
entities: [],
constraints: [],
classifiers: [],
boundaries: [],
fetches: []
};
}
export function createEntity(name: string, relation?: WSRelation): WSEntity {
return { id: generateId(name), name, relation, properties: [] };
}
export function createConstraint(target: string, property: string, expr: WSExpression): WSConstraint {
return { target, property, expr };
}
export function createClassifier(quantity: number, type: string, entity: string): WSClassifier {
return { quantity, type: type as WSClassifier['type'], entity };
}
function generateId(name: string): string {
return ws_${name}_${Math.random().toString(36).slice(2, 7)};
}
