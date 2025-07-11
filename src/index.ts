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

export const createStyle = (
  def: StyleDef, 
  ...defs: Array<StyleDef>
): Wrapper => {
  return new Wrapper(merge(def, ...defs));
};

export const mergeStyles = (base: Wrapper, ...overrides: Wrapper[]) => {
  const x = merge(base.o, ...overrides.map((x) => x?.o));
  return new Wrapper(x);
};