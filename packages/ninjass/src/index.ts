import { writeToStore } from "./id.js";
import { StyleDef } from "./types.js";
import { merge } from "./utils.js";

import './client.ts';

class Wrapper {
  o: StyleDef;
  id: number;

  constructor(o) {
    this.o = o;
    this.id = writeToStore(this.o);
  }
  valueOf() {
    if (process.env.IS_SERVER === 'false') {
      return this.id;
    } else {
      return JSON.stringify(this.o).replaceAll('"', "`");
    }
  }
}

type BaseDefs = Record<string, StyleDef>;

export const createStyles = <Defs extends BaseDefs>(
  defs: Defs, 
  opts?: { overrides: BaseDefs }
): Record<keyof Defs, Wrapper> => {
  const out: any = {};

  for (let p in defs) {
    if (opts?.overrides?.[p]) {
      merge(defs[p], opts?.overrides?.[p].o);
    }

    out[p] = new Wrapper(defs[p]);
  }

  return out as Record<keyof Defs, any>;
};

export const mergeStyles = (base: Wrapper, ...overrides: Wrapper[]) => {
  const x = merge({}, base.o, ...overrides.map((x) => x?.o));
  return new Wrapper(x);
};