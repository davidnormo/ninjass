import { StyleDef } from "./types.js";
import './client.ts';
declare class Wrapper {
    o: StyleDef;
    id: number;
    constructor(o: any);
    valueOf(): string | number;
}
export declare const createStyle: (def: StyleDef, ...defs: Array<StyleDef>) => Wrapper;
export declare const mergeStyles: (base: Wrapper, ...overrides: Wrapper[]) => Wrapper;
export {};
