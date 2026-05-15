export enum TokenType {
ENTITY        = 'ENTITY',
PARTICLE      = 'PARTICLE',
PROPERTY      = 'PROPERTY',
NUMBER        = 'NUMBER',
STRING        = 'STRING',
FUNCTION      = 'FUNCTION',
OPERATOR      = 'OPERATOR',
ASSIGN        = 'ASSIGN',
COLON         = 'COLON',
DOT           = 'DOT',
COMMA         = 'COMMA',
LPAREN        = 'LPAREN',
RPAREN        = 'RPAREN',
LBRACE        = 'LBRACE',
RBRACE        = 'RBRACE',
LBRACKET      = 'LBRACKET',
RBRACKET      = 'RBRACKET',
NUMBER_LIT    = 'NUMBER_LIT',
CLASSIFIER    = 'CLASSIFIER',
KEYWORD_PHI   = 'KEYWORD_PHI',
KEYWORD_PI    = 'KEYWORD_PI',
KEYWORD_TAU   = 'KEYWORD_TAU',
KEYWORD_FETCH = 'KEYWORD_FETCH',
KEYWORD_FROM  = 'KEYWORD_FROM',
KEYWORD_WHERE = 'KEYWORD_WHERE',
KEYWORD_ORDER = 'KEYWORD_ORDER',
KEYWORD_LIMIT = 'KEYWORD_LIMIT',
KEYWORD_MAP   = 'KEYWORD_MAP',
KEYWORD_PAGE  = 'KEYWORD_PAGE',
KEYWORD_EVERY = 'KEYWORD_EVERY',
IDENTIFIER    = 'IDENTIFIER',
COMMENT       = 'COMMENT',
NEWLINE       = 'NEWLINE',
EOF           = 'EOF'
}
export interface Token {
type: TokenType;
value: string;
line: number;
column: number;
}
export const PARTICLES: Set<string> = new Set([
'of', 'at', 'as', 'by', 'through', 'into', 'from'
]);
export const CLASSIFIERS: Set<string> = new Set([
'orbital', 'harmonic', 'depth', 'fibonacci', 'angular', 'spatial'
]);
export const BUILTIN_FUNCTIONS: Set<string> = new Set([
'harmonic', 'orbit', 'distance', 'field', 'hue', 'decay',
'fibonacci', 'harmonic_scale', 'clamp', 'lerp', 'normalize'
]);
export const RESERVED_KEYWORDS: Set<string> = new Set([
'phi', 'pi', 'tau', 'fetch', 'from', 'where', 'order', 'limit',
'map', 'page', 'every', 'self', 'cursor', 'origin', 'viewport',
'parent', 'children', 'world'
]);
