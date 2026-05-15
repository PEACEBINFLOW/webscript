var currentTab = 'html';
var lastResult = null;
var EXAMPLES = {
basic: 'card {\n  depth    : 300\n  rotate   : harmonic(0.5)\n  position : orbit(cursor)\n}',
relational: 'panel of viewport {\n  depth   : phi * 300\n  opacity : field(0.85)\n  sync    : parent.rhythm\n}',
constraint: 'card {\n  depth : 300\n}\n\ncard.rotation = cursor.angle * harmonic(0.4)\ncard.scale    = distance(origin) ^ 0.5',
classifier: '7 orbital nodes\n3 harmonic layers\n1 depth field',
game: 'player of world {\n  position : orbit(spawn, 0)\n  health   : 100\n  boundary : circle(phi * 20)\n}\n\nplayer.rotation = cursor.angle * harmonic(0.2)\n\n3 orbital nodes of player'
};
function loadExample(name) {
document.getElementById('ws-input').value = EXAMPLES[name] || '';
runCompile();
}
function showTab(tab) {
currentTab = tab;
document.querySelectorAll('.tab').forEach(function(t) {
t.classList.toggle('active', t.textContent.toLowerCase() === tab || t.textContent.toLowerCase() === tab + 's');
});
if (lastResult) displayResult(lastResult);
}
function displayResult(result) {
var out = document.getElementById('compiled-output');
switch (currentTab) {
case 'html': out.textContent = result.html || ''; break;
case 'css':  out.textContent = result.css  || ''; break;
case 'svg':  out.textContent = result.svg  || ''; break;
case 'js':   out.textContent = result.js   || ''; break;
case 'ts':   out.textContent = result.typescript || ''; break;
case 'sql':  out.textContent = result.sql  || ''; break;
case 'ast':  out.textContent = result.ast  || ''; break;
}
}
function runCompile() {
var src = document.getElementById('ws-input').value;
document.getElementById('f-status').textContent = 'compiling...';
try {
if (typeof ws_compile === 'function') {
lastResult = ws_compile(src);
} else {
lastResult = mockCompile(src);
}
document.getElementById('f-errors').textContent   = lastResult.errors.length;
document.getElementById('f-warnings').textContent = lastResult.warnings.length;
document.getElementById('f-status').textContent   = 'compiled ok';
displayResult(lastResult);
renderLive(src);
} catch (e) {
document.getElementById('f-status').textContent = 'error: ' + e.message;
document.getElementById('compiled-output').textContent = 'Error: ' + e.message;
}
}
function mockCompile(src) {
var entities = [];
var constraints = [];
var classifiers = [];
var lines = src.split('\n');
for (var i = 0; i < lines.length; i++) {
var line = lines[i].trim();
if (!line || line.startsWith('//')) continue;
if (/^\d+\s+\w+\s+\w+/.test(line)) classifiers.push(line);
else if (/\w+.\w+\s*=/.test(line)) constraints.push(line);
else if (/\w+(\s+\w+\s+\w+)?\s*{/.test(line)) entities.push(line.replace('{','').trim());
}
var html = '<!-- WEBSCRIPT compiled HTML -->\n';
entities.forEach(function(e) {
var name = e.split(' ')[0];
html += '<div class="ws-entity ws-' + name + '" data-ws-entity="' + name + '">\n</div>\n';
});
classifiers.forEach(function(c) {
var parts = c.split(' ');
var n = parseInt(parts[0]);
for (var i = 0; i < n; i++) {
html += '<div class="ws-' + parts[2] + ' ' + parts[1] + '" data-ws-index="' + i + '"></div>\n';
}
});
var css = '/* WEBSCRIPT compiled CSS */\n:root {\n  --ws-phi: 1.618;\n  --ws-pi: 3.14159;\n}\n';
entities.forEach(function(e) {
var name = e.split(' ')[0];
css += '.ws-' + name + ' {\n  transform-style: preserve-3d;\n  transform: rotate(var(--ws-' + name + '-rotation, 0rad));\n}\n';
});
var js = '// WEBSCRIPT compiled JS\nvar ws = {\n  phi: 1.618,\n  harmonic: function(t) { return 0.5 - Math.cos(t * Math.PI) / 2; }\n};\n';
constraints.forEach(function(c) { js += '// constraint: ' + c + '\n'; });
var ts = '// WEBSCRIPT compiled TypeScript\nexport interface WSEntity {\n  id: string;\n  name: string;\n  properties: Record<string, number | string>;\n}\n';
entities.forEach(function(e) {
var name = e.split(' ')[0];
ts += 'export interface WS' + name.charAt(0).toUpperCase() + name.slice(1) + ' extends WSEntity {}\n';
});
var sql = '-- WEBSCRIPT WSQL output\n-- no fetch declarations in source\n';
var ast = JSON.stringify({
version: '0.1.0',
author: 'Peace Thabiwa / SAGEWORKS AI',
entities: entities.map(function(e) { return { name: e.split(' ')[0] }; }),
constraints: constraints.map(function(c) { return { raw: c }; }),
classifiers: classifiers.map(function(c) { return { raw: c }; })
}, null, 2);
return { html: html, css: css, svg: '', js: js, typescript: ts, sql: sql, ast: ast, errors: [], warnings: [] };
}
function renderLive(src) {
var canvas = document.getElementById('live-canvas');
var ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var W = canvas.width, H = canvas.height;
var cx = W / 2, cy = H / 2;
var PHI = 1.618, TAU = Math.PI * 2;
var classifierMatch = src.match(/(\d+)\s+orbital\s+(\w+)/);
var count = classifierMatch ? parseInt(classifierMatch[1]) : 3;
var hasConstraint = src.indexOf('.rotation') >= 0;
ctx.clearRect(0, 0, W, H);
var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.5);
grad.addColorStop(0, 'rgba(10, 16, 32, 1)');
grad.addColorStop(1, 'rgba(6, 5, 10, 1)');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, W, H);
ctx.beginPath();
ctx.arc(cx, cy, 80, 0, TAU);
ctx.strokeStyle = 'rgba(232,255,71,0.1)';
ctx.lineWidth = 1;
ctx.setLineDash([3, 6]);
ctx.stroke();
ctx.setLineDash([]);
var colors = ['#e8ff47', '#47b8ff', '#47ffb8', '#ffaa47', '#7b9fff', '#ff47aa', '#ff6b6b'];
for (var i = 0; i < count; i++) {
var angle = (TAU / count) * i - Math.PI / 2;
var x = cx + 80 * Math.cos(angle);
var y = cy + 80 * Math.sin(angle);
var col = colors[i % colors.length];
ctx.beginPath();
ctx.arc(x, y, 6, 0, TAU);
ctx.fillStyle = col;
ctx.shadowBlur = 10;
ctx.shadowColor = col;
ctx.fill();
ctx.shadowBlur = 0;
ctx.beginPath();
ctx.moveTo(cx, cy);
ctx.lineTo(x, y);
ctx.strokeStyle = col + '33';
ctx.lineWidth = 1;
ctx.stroke();
}
ctx.beginPath();
ctx.arc(cx, cy, 4, 0, TAU);
ctx.fillStyle = '#e8ff47';
ctx.shadowBlur = 12;
ctx.shadowColor = '#e8ff47';
ctx.fill();
ctx.shadowBlur = 0;
ctx.fillStyle = 'rgba(232,255,71,0.2)';
ctx.font = '9px Share Tech Mono, monospace';
ctx.textAlign = 'center';
ctx.fillText(count + ' orbital nodes · angle[i] = i × (360/' + count + ')', cx, H - 12);
}
document.addEventListener('DOMContentLoaded', function() {
runCompile();
});
