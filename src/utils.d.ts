import type { StyleDef } from "./types.ts";
/**
 * Simple deep merge, only handles nested plain objects :)
 */
export declare const merge: (target: Object, ...sources: Object[]) => StyleDef;
