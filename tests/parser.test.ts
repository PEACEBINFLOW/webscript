import { Lexer } from '../src/lexer/index';
import { Parser, ConstructType } from '../src/parser/index';
describe('WEBSCRIPT Parser', () => {
function parse(src: string) {
const tokens = new Lexer(src).tokenize();
return new Parser(tokens).parse();
}
test('parses entity declaration', () => {
const tree = parse('card { depth : 300 }');
expect(tree).toHaveLength(1);
expect(tree[0].construct).toBe(ConstructType.ENTITY_DECLARATION);
expect((tree[0] as any).name).toBe('card');
});
test('parses relational binding', () => {
const tree = parse('panel of viewport { depth : 300 }');
expect(tree[0].construct).toBe(ConstructType.RELATIONAL_BINDING);
expect((tree[0] as any).particle).toBe('of');
expect((tree[0] as any).parent).toBe('viewport');
});
test('parses equation constraint', () => {
const tree = parse('card.rotation = cursor.angle * harmonic(0.4)');
expect(tree[0].construct).toBe(ConstructType.EQUATION_CONSTRAINT);
expect((tree[0] as any).target).toBe('card');
expect((tree[0] as any).property).toBe('rotation');
});
test('parses classifier unit', () => {
const tree = parse('7 orbital nodes');
expect(tree[0].construct).toBe(ConstructType.CLASSIFIER_UNIT);
expect((tree[0] as any).quantity).toBe(7);
expect((tree[0] as any).classifier).toBe('orbital');
});
test('parses phi constant in expression', () => {
const tree = parse('panel { depth : phi * 300 }');
const entity = tree[0] as any;
const depthProp = entity.properties[0];
expect(depthProp.value.type).toBe('binary');
expect(depthProp.value.left.constant).toBe('phi');
});
});
