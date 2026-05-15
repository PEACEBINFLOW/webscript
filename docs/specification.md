WEBSCRIPT LANGUAGE SPECIFICATION
Version 0.1
Authored by Peace Thabiwa, SAGEWORKS AI, Maun, Botswana
IDENTITY
WEBSCRIPT is a contextual relational computation language for the browser.
It is a declarative constraint-based spatial DSL.
It is not a framework, library, preprocessor, or markup language.
It is a compiled language that targets HTML, CSS, SVG, JavaScript,
TypeScript, and SQL simultaneously from a single source declaration.
PHILOSOPHY
The browser is already a spatial, mathematical, geometric system.
WEBSCRIPT reveals and programs that structure directly.
HTML is not transformed. HTML becomes the field space.
Geometry is projected inside that field.
FOUR-LAYER ARCHITECTURE
WEBSCRIPT   owns:  relational syntax, spatial mathematics,
constraint orchestration, semantic topology,
runtime graph inference
HTML        owns:  field space, semantic substrate,
interaction surface, accessibility
SVG         owns:  geometry rendering
CSS         owns:  projection styling
JavaScript  owns:  execution engine, object system, event loop
THE SIX GRAMMAR CONSTRUCTS

Entity Declaration
entity { property : value }
Relational Binding
entity particle parent { property : value }
Equation Constraint
entity.property = expression
Classifier Generation
n classifier entity
Fetch Declaration
fetch entity from source { clauses }
Page Boundary
page { boundary : equation }

RELATIONAL PARTICLES
of       parent-child containment
at       spatial position
as       behavioral classification
by       authored by
through  passes through
into     enters / transforms into
from     originates from
CLASSIFIER TYPES
orbital    circular arrangement
harmonic   wave-based arrangement
depth      z-axis layering
fibonacci  Fibonacci-sequence spacing
angular    angle-based distribution
spatial    3D positioning
BUILT-IN FUNCTIONS
harmonic(t)     0.5 - cos(pi*t) / 2
orbit(t, r)     circular position
distance(a, b)  Euclidean distance
field(v)        spatially typed scalar
hue(angle)      color from spatial angle
decay(rate)     trail fade multiplier
fibonacci(n)    Fibonacci sequence
clamp(v,mn,mx)  range clamp
lerp(a,b,t)     linear interpolation
CONSTANTS
phi    1.618033988749895
pi     3.14159265358979
tau    6.28318530717959
COMPILATION TARGETS
html         structural topology
css          mathematical styling
svg          vector geometry
js           reactive runtime
typescript   typed interfaces
sql          spatial data queries
OWNERSHIP
Authored by:  Peace Thabiwa
Organization: SAGEWORKS AI
Location:     Maun, Botswana
Year:         2025
Specification: Creative Commons Attribution 4.0
Implementation: MIT License
Trademark: WEBSCRIPT and symbol are trademarks of SAGEWORKS AI
