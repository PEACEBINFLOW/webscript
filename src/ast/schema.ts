export const AST_SCHEMA_VERSION = '0.1.0';
export const SCHEMA = {
program: {
required: ['version', 'author', 'entities', 'constraints', 'classifiers', 'boundaries', 'fetches'],
types: {
version: 'string',
author: 'string',
entities: 'array',
constraints: 'array',
classifiers: 'array',
boundaries: 'array',
fetches: 'array'
}
},
entity: {
required: ['id', 'name', 'properties'],
optional: ['relation', 'children']
},
constraint: {
required: ['target', 'property', 'expr']
},
classifier: {
required: ['quantity', 'type', 'entity'],
optional: ['parent', 'properties']
},
boundary: {
required: ['type', 'equation', 'origin'],
optional: ['sides']
},
expression: {
types: ['literal', 'reference', 'binary', 'call', 'constant']
}
};
