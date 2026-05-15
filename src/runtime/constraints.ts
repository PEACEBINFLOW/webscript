import type { WSExpression, WSPoint } from '../types/ws-types';
import { PHI, PI, harmonic } from '../stdlib/math';
import { distance, orbit } from '../stdlib/spatial';
export interface RuntimeContext {
cursor:   WSPoint;
origin:   WSPoint;
viewport: { width: number; height: number };
entities: Map<string, { position: WSPoint; properties: Record<string, number> }>;
t:        number;
}
export function resolveRuntimeExpression(expr: WSExpression, ctx: RuntimeContext): number {
switch (expr.type) {
case 'literal':
return typeof expr.value === 'number' ? expr.value : 0;
case 'constant':
  if (expr.value === 'phi') return PHI;
  if (expr.value === 'pi')  return PI;
  if (expr.value === 'tau') return PI * 2;
  return 0;

case 'reference': {
  const path = expr.path || '';
  if (path === 'cursor.angle') {
    return Math.atan2(ctx.cursor.y - ctx.origin.y, ctx.cursor.x - ctx.origin.x);
  }
  if (path === 'cursor.x') return ctx.cursor.x;
  if (path === 'cursor.y') return ctx.cursor.y;
  if (path === 'viewport.width')  return ctx.viewport.width;
  if (path === 'viewport.height') return ctx.viewport.height;
  if (path === 'viewport.diagonal') {
    return Math.sqrt(ctx.viewport.width ** 2 + ctx.viewport.height ** 2);
  }
  return 0;
}

case 'binary': {
  const left  = resolveRuntimeExpression(expr.left!,  ctx);
  const right = resolveRuntimeExpression(expr.right!, ctx);
  switch (expr.operator) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/': return right !== 0 ? left / right : 0;
    case '^': return Math.pow(left, right);
    case '%': return left % right;
    default:  return 0;
  }
}

case 'call': {
  const args = expr.args?.map(a => resolveRuntimeExpression(a, ctx)) || [];
  switch (expr.fn) {
    case 'harmonic':  return harmonic(args[0] || 0);
    case 'distance':  return distance(ctx.cursor.x, ctx.cursor.y, ctx.origin.x, ctx.origin.y);
    case 'field':     return args[0] || 0;
    default:          return 0;
  }
}

default:
  return 0;
}
}
