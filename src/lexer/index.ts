import { TokenType, Token, PARTICLES, CLASSIFIERS, BUILTIN_FUNCTIONS, RESERVED_KEYWORDS } from './tokens';
import { PATTERNS } from './patterns';
export class Lexer {
private source: string;
private position: number;
private line: number;
private column: number;
private tokens: Token[];
constructor(source: string) {
this.source = source;
this.position = 0;
this.line = 1;
this.column = 1;
this.tokens = [];
}
tokenize(): Token[] {
while (this.position < this.source.length) {
this.scanToken();
}
this.tokens.push({
type: TokenType.EOF,
value: '',
line: this.line,
column: this.column
});
return this.tokens;
}
private scanToken(): void {
const remaining = this.source.slice(this.position);
if (PATTERNS.WHITESPACE.test(remaining)) {
  const match = remaining.match(PATTERNS.WHITESPACE)![0];
  this.advance(match.length);
  return;
}

if (PATTERNS.NEWLINE.test(remaining)) {
  this.tokens.push({ type: TokenType.NEWLINE, value: '\n', line: this.line, column: this.column });
  this.line++;
  this.column = 1;
  this.position++;
  return;
}

if (PATTERNS.COMMENT.test(remaining)) {
  const match = remaining.match(PATTERNS.COMMENT)![0];
  this.advance(match.length);
  return;
}

if (PATTERNS.NUMBER.test(remaining)) {
  const match = remaining.match(PATTERNS.NUMBER)![0];
  this.tokens.push({ type: TokenType.NUMBER_LIT, value: match, line: this.line, column: this.column });
  this.advance(match.length);
  return;
}

if (PATTERNS.IDENTIFIER.test(remaining)) {
  const match = remaining.match(PATTERNS.IDENTIFIER)![0];
  const type = this.classifyIdentifier(match);
  this.tokens.push({ type, value: match, line: this.line, column: this.column });
  this.advance(match.length);
  return;
}

const singleChar = remaining[0];
const singleCharToken = this.scanSingleChar(singleChar);
if (singleCharToken) {
  this.tokens.push({ ...singleCharToken, line: this.line, column: this.column });
  this.advance(1);
  return;
}

this.advance(1);
}
private classifyIdentifier(value: string): TokenType {
if (value === 'phi') return TokenType.KEYWORD_PHI;
if (value === 'pi')  return TokenType.KEYWORD_PI;
if (value === 'tau') return TokenType.KEYWORD_TAU;
if (value === 'fetch') return TokenType.KEYWORD_FETCH;
if (value === 'page') return TokenType.KEYWORD_PAGE;
if (value === 'every') return TokenType.KEYWORD_EVERY;
if (value === 'where') return TokenType.KEYWORD_WHERE;
if (value === 'order') return TokenType.KEYWORD_ORDER;
if (value === 'limit') return TokenType.KEYWORD_LIMIT;
if (value === 'map')   return TokenType.KEYWORD_MAP;
if (PARTICLES.has(value))          return TokenType.PARTICLE;
if (CLASSIFIERS.has(value))        return TokenType.CLASSIFIER;
if (BUILTIN_FUNCTIONS.has(value))  return TokenType.FUNCTION;
return TokenType.IDENTIFIER;
}
private scanSingleChar(char: string): Omit<Token, 'line' | 'column'> | null {
switch (char) {
case '{': return { type: TokenType.LBRACE, value: '{' };
case '}': return { type: TokenType.RBRACE, value: '}' };
case '(': return { type: TokenType.LPAREN, value: '(' };
case ')': return { type: TokenType.RPAREN, value: ')' };
case '[': return { type: TokenType.LBRACKET, value: '[' };
case ']': return { type: TokenType.RBRACKET, value: ']' };
case ':': return { type: TokenType.COLON, value: ':' };
case '.': return { type: TokenType.DOT, value: '.' };
case ',': return { type: TokenType.COMMA, value: ',' };
case '=': return { type: TokenType.ASSIGN, value: '=' };
case '+': return { type: TokenType.OPERATOR, value: '+' };
case '-': return { type: TokenType.OPERATOR, value: '-' };
case '': return { type: TokenType.OPERATOR, value: '' };
case '/': return { type: TokenType.OPERATOR, value: '/' };
case '^': return { type: TokenType.OPERATOR, value: '^' };
case '%': return { type: TokenType.OPERATOR, value: '%' };
default:  return null;
}
}
private advance(count: number): void {
this.column += count;
this.position += count;
}
}
export { Token, TokenType } from './tokens';
