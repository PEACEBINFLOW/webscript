import type { WSProgram } from '../types/ws-types';
import { Engine }         from './engine';
import { ConstraintGraph } from './graph';
import { SpatialIndex }   from './spatial-index';
export class Runtime {
public engine:  Engine;
public graph:   ConstraintGraph;
public spatial: SpatialIndex;
constructor(program: WSProgram) {
this.engine  = new Engine(program);
this.graph   = new ConstraintGraph(program);
this.spatial = new SpatialIndex();
}
mount(container: HTMLElement): void {
this.engine.mount(container);
}
unmount(): void {
this.engine.unmount();
}
}
export { Engine }         from './engine';
export { ConstraintGraph } from './graph';
export { SpatialIndex }   from './spatial-index';
