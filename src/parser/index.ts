import { Token, TokenType } from '../lexer/tokens';
import { WSParseError, ERROR_CODES } from './errors';
import type {
ParseTree,
EntityNode,
RelationalNode,
ConstraintNode,
ClassifierNode,
FetchNode,
PageBoundaryNode,
PropertyNode,
ExpressionNode
} from './constructs';
import { ConstructType } from './constructs';
export class Parser {
private tokens: Token[];
private position: number;
constructor(tokens: Token[]) {
this.tokens = tokens.filter(t => t.type !== TokenType.NEWLINE && t.type !== TokenType.COMMENT);
this.position = 0;
}
parse(): ParseTree {
const tree: ParseTree = [];
while (!this.isAtEnd()) {
const node = this.parseTopLevel();
if (node) tree.push(node);
}
return tree;
}
private parseTopLevel() {
const tok = this.peek();
if (tok.type === TokenType.KEYWORD_FETCH) return this.parseFetch();
if (tok.type === TokenType.KEYWORD_PAGE)  return this.parsePage();
if (tok.type === TokenType.KEYWORD_EVERY) return this.parseEvery();

if (tok.type === TokenType.NUMBER_LIT) {
  const next = this.peekAt(1);
  if (next && next.type === TokenType.CLASSIFIER) return this.parseClassifier();
}

if (tok.type === TokenType.IDENTIFIER || tok.type === TokenType.FUNCTION) {
  const next = this.peekAt(1);
  if (next) {
    if (next.type === TokenType.PARTICLE) return this.parseRelational();
    if (next.type === TokenType.DOT)      return this.parseConstraint();
    if (next.type === TokenType.LBRACE)   return this.parseEntity();
  }
}

this.advance();
return null;
}
private parseEntity(): EntityNode {
const nameTok = this.advance();
this.expect(TokenType.LBRACE);
const properties = this.parsePropertyBlock();
return {
construct: ConstructType.ENTITY_DECLARATION,
name: nameTok.value,
properties,
line: nameTok.line,
column: nameTok.column,
raw: nameTok.value
};
}
private parseRelational(): RelationalNode {
const entityTok = this.advance();
const particleTok = this.advance();
const parentTok = this.advance();
this.expect(TokenType.LBRACE);
const properties = this.parsePropertyBlock();
return {
construct: ConstructType.RELATIONAL_BINDING,
entity: entityTok.value,
particle: particleTok.value,
parent: parentTok.value,
properties,
line: entityTok.line,
column: entityTok.column,
raw: ${entityTok.value} ${particleTok.value} ${parentTok.value}
};
}
private parseConstraint(): ConstraintNode {
const targetTok = this.advance();
this.expect(TokenType.DOT);
const propTok = this.advance();
this.expect(TokenType.ASSIGN);
const expression = this.parseExpression();
return {
construct: ConstructType.EQUATION_CONSTRAINT,
target: targetTok.value,
property: propTok.value,
expression,
line: targetTok.line,
column: targetTok.column,
raw: ${targetTok.value}.${propTok.value}
};
}
private parseClassifier(): ClassifierNode {
const quantityTok = this.advance();
const classifierTok = this.advance();
const entityTok = this.advance();
let parent: string | undefined;
let properties: PropertyNode[] | undefined;

if (!this.isAtEnd() && this.peek().type === TokenType.PARTICLE) {
  this.advance();
  parent = this.advance().value;
}

if (!this.isAtEnd() && this.peek().type === TokenType.LBRACE) {
  this.advance();
  properties = this.parsePropertyBlock();
}

return {
  construct: ConstructType.CLASSIFIER_UNIT,
  quantity: parseFloat(quantityTok.value),
  classifier: classifierTok.value,
  entity: entityTok.value,
  parent,
  properties,
  line: quantityTok.line,
  column: quantityTok.column,
  raw: `${quantityTok.value} ${classifierTok.value} ${entityTok.value}`
};
}
private parseFetch(): FetchNode {
this.advance();
const entityTok = this.advance();
this.expect(TokenType.IDENTIFIER);
const sourceTok = this.advance();
this.expect(TokenType.LBRACE);
const clauses: Record<string, ExpressionNode> = {};
while (!this.isAtEnd() && this.peek().type !== TokenType.RBRACE) {
  const keyTok = this.advance();
  this.expect(TokenType.COLON);
  clauses[keyTok.value] = this.parseExpression();
}
this.expect(TokenType.RBRACE);

return {
  construct: ConstructType.FETCH_DECLARATION,
  entity: entityTok.value,
  source: sourceTok.value,
  clauses,
  line: entityTok.line,
  column: entityTok.column,
  raw: `fetch ${entityTok.value} from ${sourceTok.value}`
};
}
private parsePage(): PageBoundaryNode {
const pageTok = this.advance();
if (!this.isAtEnd() && this.peek().type === TokenType.PARTICLE) this.advance();
if (!this.isAtEnd() && this.peek().type === TokenType.IDENTIFIER) this.advance();
this.expect(TokenType.LBRACE);
const properties = this.parsePropertyBlock();
return {
construct: ConstructType.PAGE_BOUNDARY,
properties,
line: pageTok.line,
column: pageTok.column,
raw: 'page'
};
}
private parseEvery(): EntityNode {
this.advance();
const classifierTok = this.advance();
const entityTok = this.advance();
if (!this.isAtEnd() && this.peek().type === TokenType.PARTICLE) this.advance();
if (!this.isAtEnd() && this.peek().type === TokenType.IDENTIFIER) this.advance();
this.expect(TokenType.LBRACE);
const properties = this.parsePropertyBlock();
return {
construct: ConstructType.ENTITY_DECLARATION,
name: every_${classifierTok.value}_${entityTok.value},
properties,
line: classifierTok.line,
column: classifierTok.column,
raw: every ${classifierTok.value} ${entityTok.value}
};
}
private parsePropertyBlock(): PropertyNode[] {
const properties: PropertyNode[] = [];
while (!this.isAtEnd() && this.peek().type !== TokenType.RBRACE) {
const nameTok = this.advance();
if (nameTok.type === TokenType.RBRACE) break;
this.expect(TokenType.COLON);
const value = this.parseExpression();
properties.push({ name: nameTok.value, value, line: nameTok.line });
}
if (!this.isAtEnd()) this.expect(TokenType.RBRACE);
return properties;
}
private parseExpression(): ExpressionNode {
return this.parseBinary();
}
private parseBinary(): ExpressionNode {
let left = this.parseUnary();
while (!this.isAtEnd() && this.peek().type === TokenType.OPERATOR) {
const op = this.advance().value;
const right = this.parseUnary();
left = { type: 'binary', left, right, operator: op };
}
return left;
}
private parseUnary(): ExpressionNode {
const tok = this.peek();
if (tok.type === TokenType.KEYWORD_PHI) {
  this.advance();
  return { type: 'constant', constant: 'phi' };
}
if (tok.type === TokenType.KEYWORD_PI) {
  this.advance();
  return { type: 'constant', constant: 'pi' };
}
if (tok.type === TokenType.KEYWORD_TAU) {
  this.advance();
  return { type: 'constant', constant: 'tau' };
}

if (tok.type === TokenType.NUMBER_LIT) {
  this.advance();
  return { type: 'literal', value: parseFloat(tok.value) };
}

if (tok.type === TokenType.FUNCTION) {
  return this.parseFunctionCall();
}

if (tok.type === TokenType.IDENTIFIER) {
  this.advance();
  if (!this.isAtEnd() && this.peek().type === TokenType.DOT) {
    this.advance();
    const prop = this.advance().value;
    return { type: 'reference', path: `${tok.value}.${prop}` };
  }
  return { type: 'reference', path: tok.value };
}

this.advance();
return { type: 'literal', value: 0 };
}
private parseFunctionCall(): ExpressionNode {
const fnTok = this.advance();
this.expect(TokenType.LPAREN);
const args: ExpressionNode[] = [];
while (!this.isAtEnd() && this.peek().type !== TokenType.RPAREN) {
args.push(this.parseExpression());
if (!this.isAtEnd() && this.peek().type === TokenType.COMMA) this.advance();
}
this.expect(TokenType.RPAREN);
return { type: 'call', fn: fnTok.value, args };
}
private expect(type: TokenType): Token {
const tok = this.peek();
if (tok.type !== type) {
throw new WSParseError(
Expected ${type} but got ${tok.type} ("${tok.value}"),
ERROR_CODES.UNEXPECTED_TOKEN,
tok.line,
tok.column,
tok.value
);
}
return this.advance();
}
private advance(): Token {
if (!this.isAtEnd()) this.position++;
return this.tokens[this.position - 1];
}
private peek(): Token {
return this.tokens[this.position];
}
private peekAt(offset: number): Token | null {
const idx = this.position + offset;
return idx < this.tokens.length ? this.tokens[idx] : null;
}
private isAtEnd(): boolean {
return this.position >= this.tokens.length || this.tokens[this.position].type === TokenType.EOF;
}
}
export { ConstructType } from './constructs';
export type { ParseTree, EntityNode, RelationalNode, ConstraintNode, ClassifierNode } from './constructs';
