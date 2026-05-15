import type { WSExpression } from '../types/ws-types';
import { PHI, PI, TAU, harmonic } from '../stdlib/math';
export function resolveExpression(expr: WSExpression): number | string {
switch (expr.type) {
case 'literal':
return typeof expr.value === 'number' ? expr.value : String(expr.value);
case 'constant':
  if (expr.value === 'phi') return PHI;
  if (expr.value === 'pi')  return PI;
  if (expr.value === 'tau') return TAU;
  return 0;

case 'reference':
  return `var(--ws-${(expr.path || '').replace('.', '-')})`;

case 'binary': {
  const left  = resolveExpression(expr.left!);
  const right = resolveExpression(expr.right!);
  if (typeof left === 'number' && typeof right === 'number') {
    switch (expr.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      case '^': return Math.pow(left, right);
      case '%': return left % right;
    }
  }
  return `calc(${left} ${expr.operator} ${right})`;
}

case 'call': {
  const args = expr.args?.map(a => resolveExpression(a)) || [];
  switch (expr.fn) {
    case 'harmonic':
      return typeof args[0] === 'number' ? harmonic(args[0]) : 0.5;
    case 'phi':
      return typeof args[0] === 'number' ? Math.pow(PHI, args[0]) : PHI;
    case 'orbit':
      return `orbit(${args.join(', ')})`;
    case 'field':
      return typeof args[0] === 'number' ? args[0] : 1;
    default:
      return 0;
  }
}

default:
  return 0;
}
}
