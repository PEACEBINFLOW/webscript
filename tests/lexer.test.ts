import { Lexer, TokenType } from '../src/lexer/index';
describe('WEBSCRIPT Lexer', () => {
test('tokenizes entity declaration', () => {
const src = 'card { depth : 300 }';
const tokens = new Lexer(src).tokenize();
expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
expect(tokens[0].value).toBe('card');
expect(tokens[1].type).toBe(TokenType.LBRACE);
expect(tokens[4].type).toBe(TokenType.NUMBER_LIT);
expect(tokens[4].value).toBe('300');
});
test('tokenizes relational particle', () => {
const src = 'panel of viewport { }';
const tokens = new Lexer(src).tokenize();
expect(tokens[0].value).toBe('panel');
expect(tokens[1].type).toBe(TokenType.PARTICLE);
expect(tokens[1].value).toBe('of');
expect(tokens[2].value).toBe('viewport');
});
test('tokenizes phi constant', () => {
const src = 'depth : phi * 300';
const tokens = new Lexer(src).tokenize();
const phiToken = tokens.find(t => t.type === TokenType.KEYWORD_PHI);
expect(phiToken).toBeDefined();
expect(phiToken!.value).toBe('phi');
});
test('tokenizes equation constraint', () => {
const src = 'card.rotation = cursor.angle * harmonic(0.4)';
const tokens = new Lexer(src).tokenize();
expect(tokens[0].value).toBe('card');
expect(tokens[1].type).toBe(TokenType.DOT);
expect(tokens[2].value).toBe('rotation');
expect(tokens[3].type).toBe(TokenType.ASSIGN);
});
test('tokenizes classifier unit', () => {
const src = '7 orbital nodes';
const tokens = new Lexer(src).tokenize();
expect(tokens[0].type).toBe(TokenType.NUMBER_LIT);
expect(tokens[0].value).toBe('7');
expect(tokens[1].type).toBe(TokenType.CLASSIFIER);
expect(tokens[1].value).toBe('orbital');
expect(tokens[2].value).toBe('nodes');
});
test('skips comments', () => {
const src = '// this is a comment\ncard { }';
const tokens = new Lexer(src).tokenize();
const commentToken = tokens.find(t => t.value.includes('comment'));
expect(commentToken).toBeUndefined();
expect(tokens[0].value).toBe('card');
});
});
