import type { WSFetchDeclaration } from '../types/ws-types';
import { QueryBuilder } from './query-builder';
import { mapResultsToSpatial } from './spatial-mapper';
export class WSQLBridge {
private fetches: WSFetchDeclaration[];
constructor(fetches: WSFetchDeclaration[]) {
this.fetches = fetches;
}
compileQueries(): string[] {
return this.fetches.map(f => new QueryBuilder(f).buildSQL());
}
mapToSpatial(rows: Record<string, any>[], cx: number, cy: number) {
return mapResultsToSpatial(rows, cx, cy);
}
}
export { QueryBuilder }     from './query-builder';
export { mapResultsToSpatial } from './spatial-mapper';
