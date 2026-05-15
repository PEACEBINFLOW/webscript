import type { WSProgram, WSConstraint } from '../types/ws-types';
import type { CompileOptions } from '../types/compile-types';
import { PHI, PI } from '../stdlib/math';
export class JSCompiler {
private program: WSProgram;
private options: CompileOptions;
private prefix: string;
constructor(program: WSProgram, options: CompileOptions = {}) {
this.program = program;
this.options = options;
this.prefix = options.prefix || 'ws';
}
compile(): string {
const lines: string[] = [];
lines.push('// WEBSCRIPT compiled JavaScript output');
lines.push('// authored by Peace Thabiwa, SAGEWORKS AI, Maun, Botswana');
lines.push('');
lines.push('(function() {');
lines.push('');
lines.push('  const ws = {');
lines.push(    phi:      ${PHI},);
lines.push(    pi:       ${PI},);
lines.push(    tau:      ${PI * 2},);
lines.push('    harmonic: t => 0.5 - Math.cos(t * Math.PI) / 2,');
lines.push('    orbit:    (cx, cy, r, a) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }),');
lines.push('    distance: (ax, ay, bx, by) => Math.sqrt((ax-bx)**2 + (ay-by)**2),');
lines.push('    field:    v => v,');
lines.push('    lerp:     (a, b, t) => a + (b - a) * t');
lines.push('  };');
lines.push('');
lines.push('  window.ws = ws;');
lines.push('');
if (this.program.constraints.length > 0) {
  lines.push('  // reactive constraint observers');
  lines.push('  let _mx = window.innerWidth / 2;');
  lines.push('  let _my = window.innerHeight / 2;');
  lines.push('');
  lines.push('  document.addEventListener("mousemove", function(e) {');
  lines.push('    _mx = e.clientX;');
  lines.push('    _my = e.clientY;');
  lines.push('    _resolveConstraints();');
  lines.push('  });');
  lines.push('');
  lines.push('  function _resolveConstraints() {');
  lines.push('    var cx = window.innerWidth / 2;');
  lines.push('    var cy = window.innerHeight / 2;');

  for (const constraint of this.program.constraints) {
    lines.push(this.compileConstraint(constraint));
  }

  lines.push('  }');
  lines.push('');
  lines.push('  _resolveConstraints();');
}

for (const classifier of this.program.classifiers) {
  lines.push(this.compileClassifierRuntime(classifier));
}

lines.push('})();');
return lines.join('\n');
}
private compileConstraint(constraint: WSConstraint): string {
const selector = .ws-${constraint.target};
const prop = --ws-${constraint.target}-${constraint.property};
if (constraint.property === 'rotation') {
  return [
    `    // ${constraint.target}.${constraint.property} = cursor.angle * harmonic(0.4)`,
    `    var _angle_${constraint.target} = Math.atan2(_my - cy, _mx - cx);`,
    `    var _rot_${constraint.target} = _angle_${constraint.target} * ws.harmonic(0.4);`,
    `    document.querySelectorAll("${selector}").forEach(function(el) {`,
    `      el.style.setProperty("${prop}", _rot_${constraint.target} + "rad");`,
    `    });`
  ].join('\n');
}

if (constraint.property === 'scale') {
  return [
    `    // ${constraint.target}.${constraint.property} = distance(origin)^0.5`,
    `    var _dist_${constraint.target} = ws.distance(_mx, _my, cx, cy);`,
    `    var _scale_${constraint.target} = Math.pow(_dist_${constraint.target} / 500, 0.5);`,
    `    document.querySelectorAll("${selector}").forEach(function(el) {`,
    `      el.style.setProperty("${prop}", _scale_${constraint.target});`,
    `    });`
  ].join('\n');
}

return `    // constraint: ${constraint.target}.${constraint.property}`;
}
private compileClassifierRuntime(classifier: any): string {
const count = classifier.quantity;
const type = classifier.classifier;
return [
'',
  // ${count} ${type} ${classifier.entity} — batch generation,
  (function() {,
    var count = ${count};,
    var TAU = ws.tau;,
    var r = 80;,
    var cx = window.innerWidth / 2;,
    var cy = window.innerHeight / 2;,
    for (var i = 0; i < count; i++) {,
      var angle = (TAU / count) * i;,
      var pos = ws.orbit(cx, cy, r, angle);,
      // node ${classifier.entity}[i] at (pos.x, pos.y),
    },
  })();
].join('\n');
}
}
