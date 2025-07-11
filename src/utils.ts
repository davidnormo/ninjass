import type { StyleDef } from "./types.ts";

/**
 * Simple deep merge, only handles nested plain objects :)
 */
export const merge = (target: Object, ...sources: Object[]): StyleDef => {
  let out: StyleDef = {...target};
  for (let s of sources) {
    for (let p in s) {
      if (typeof s[p] === "object" && typeof target[p] === "object") {
        out[p] = merge(target[p], s[p]);
      } else {
        out[p] = s[p];
      }
    }
  }
  return out as StyleDef;
};