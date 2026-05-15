import type { WSProgram, WSConstraint, WSPoint } from '../types/ws-types';
import { PHI, PI, TAU, harmonic } from '../stdlib/math';
import { orbit, distance } from '../stdlib/spatial';
export class Engine {
private program: WSProgram;
private cursor: WSPoint = { x: 0, y: 0 };
private origin: WSPoint = { x: 0, y: 0 };
private frameCallbacks: Array<(t: number) => void> = [];
private constraintCallbacks: Array<() => void> = [];
private t: number = 0;
private running: boolean = false;
constructor(program: WSProgram) {
this.program = program;
}
mount(container: HTMLElement): void {
this.origin = {
x: container.clientWidth / 2,
y: container.clientHeight / 2
};
document.addEventListener('mousemove', (e) => {
  this.cursor = { x: e.clientX, y: e.clientY };
  this.resolveConstraints();
});

window.addEventListener('resize', () => {
  this.origin = {
    x: container.clientWidth / 2,
    y: container.clientHeight / 2
  };
});

this.running = true;
this.loop();
}
unmount(): void {
this.running = false;
}
onFrame(cb: (t: number) => void): void {
this.frameCallbacks.push(cb);
}
onConstraint(cb: () => void): void {
this.constraintCallbacks.push(cb);
}
resolveConstraints(): void {
for (const constraint of this.program.constraints) {
const el = document.querySelector(.ws-${constraint.target}) as HTMLElement;
if (!el) continue;
  if (constraint.property === 'rotation') {
    const angle = Math.atan2(
      this.cursor.y - this.origin.y,
      this.cursor.x - this.origin.x
    );
    const rotation = angle * harmonic(0.4);
    el.style.setProperty(`--ws-${constraint.target}-rotation`, `${rotation}rad`);
  }

  if (constraint.property === 'scale') {
    const d = distance(this.cursor.x, this.cursor.y, this.origin.x, this.origin.y);
    const scale = Math.pow(d / 500, 0.5);
    el.style.setProperty(`--ws-${constraint.target}-scale`, `${scale}`);
  }

  if (constraint.property === 'opacity') {
    const d = distance(this.cursor.x, this.cursor.y, this.origin.x, this.origin.y);
    const diagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    const opacity = 1 - (d / diagonal);
    el.style.setProperty(`--ws-${constraint.target}-opacity`, `${opacity}`);
  }
}

for (const cb of this.constraintCallbacks) cb();
}
private loop(): void {
if (!this.running) return;
this.t += 0.01;
for (const cb of this.frameCallbacks) cb(this.t);
requestAnimationFrame(() => this.loop());
}
}

FILE 033 — src/runtime/graph.ts
Path: /src/runtime/graph.ts
import type { WSProgram, WSEntity, WSConstraint } from '../types/ws-types';
export interface GraphNode {
entity: WSEntity;
dependencies: string[];
dependents: string[];
}
export class ConstraintGraph {
private nodes: Map<string, GraphNode> = new Map();
private constraints: WSConstraint[] = [];
constructor(program: WSProgram) {
this.constraints = program.constraints;
for (const entity of program.entities) {
this.nodes.set(entity.name, {
entity,
dependencies: [],
dependents: []
});
}
this.buildEdges();
}
private buildEdges(): void {
for (const constraint of this.constraints) {
const node = this.nodes.get(constraint.target);
if (!node) continue;
  if (constraint.expr.path) {
    const dep = constraint.expr.path.split('.')[0];
    if (dep === 'cursor' || dep === 'origin' || dep === 'viewport') {
      node.dependencies.push(dep);
    }
  }
}
}
getNode(name: string): GraphNode | undefined {
return this.nodes.get(name);
}
getConstraintsFor(entityName: string): WSConstraint[] {
return this.constraints.filter(c => c.target === entityName);
}
getDependencies(entityName: string): string[] {
return this.nodes.get(entityName)?.dependencies || [];
}
}
