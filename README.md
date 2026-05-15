WEBSCRIPT
Spatial Dimensional Language for the Web
v0.1 Specification
Authored by Peace Thabiwa
SAGEWORKS AI, Maun, Botswana
WEBSCRIPT is a contextual relational computation language for the browser.
It is a mathematical communication layer between HTML, CSS, SVG, JavaScript,
TypeScript, and SQL. Not a framework. Not a library. Not a preprocessor.
A language.
WHAT IT IS
WEBSCRIPT is a declarative constraint-based spatial DSL with four properties:
Declarative: you describe relationships, not procedures.
Constraint-based: properties are bound to equations, not static values.
Spatial: geometry and position are first-class citizens.
Relational: entities know each other and their mathematical relationships.
THE STABLE ARCHITECTURE
WEBSCRIPT owns: relational syntax, spatial mathematics, constraint
orchestration, semantic topology mapping, runtime graph inference.
HTML owns: field space, semantic substrate, interaction surface.
SVG owns: geometry rendering.
CSS owns: projection styling layer.
JavaScript owns: execution engine, object system, event loop.
THE SENTENCE STRUCTURE
Four patterns form the complete grammar:
Pattern 1 — Entity Declaration
card {
depth    : 300
rotate   : harmonic(0.5)
position : orbit(cursor)
}
Pattern 2 — Relational Particle (from Mandarin topic-comment grammar)
panel of viewport {
sync    : parent.rhythm
opacity : field(0.85)
depth   : phi * 300
}
Pattern 3 — Equation Constraint (live reactive binding)
card.rotation = cursor.angle * harmonic(0.4)
card.scale    = distance(origin) ^ 0.5
Pattern 4 — Classifier Units (from Mandarin measure words)
7 orbital nodes
3 harmonic layers
1 depth field
COMPILATION TARGETS
Every WEBSCRIPT declaration compiles to all six simultaneously:
HTML, CSS, SVG, JavaScript, TypeScript, SQL
BUILT-IN FUNCTIONS
harmonic(t)      0.5 - cos(pi*t) / 2         easing
orbit(target, r) position on circle around target
distance(a, b)   Euclidean distance
field(value)     spatially typed scalar
phi              1.618033988749895
pi               3.14159265358979
fibonacci(n)     first n Fibonacci numbers
hue(angle)       HSL color from spatial angle
decay(rate)      trail fade multiplier
REPOSITORY STRUCTURE
src/lexer/       tokenizer
src/parser/      AST builder
src/ast/         AST node type definitions
src/compiler/    six target compilers
src/runtime/     browser runtime engine
src/types/       TypeScript type definitions
src/stdlib/      standard library functions
src/wsql/        WSQL data bridge
src/cli/         command line interface
tests/           test suites per module
playground/      browser-based live editor
docs/            specification documents
examples/        example WEBSCRIPT programs
INSTALLATION
npm install webscript-lang
USAGE (CLI)
npx ws compile input.ws --target html
npx ws compile input.ws --target css
npx ws compile input.ws --target all
npx ws serve input.ws
USAGE (API)
const { compile } = require('webscript-lang')
const result = compile('card { depth: 300 }', { target: 'all' })
OWNERSHIP
WEBSCRIPT is authored by Peace Thabiwa.
Published under SAGEWORKS AI, Maun, Botswana.
Language specification, syntax, grammar, compiler architecture, runtime
engine, and type system are the intellectual property of Peace Thabiwa
and SAGEWORKS AI.
Specification license: Creative Commons Attribution 4.0
Implementation license: MIT
Trademark: WEBSCRIPT and the symbol are trademarks of SAGEWORKS AI.
