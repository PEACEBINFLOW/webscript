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
