import { sym, writeToStore } from "./id.js";
import { StyleDef } from "./types.js";
import { merge } from "./utils.js";

import "./client.ts";

export const createStyle = (def: StyleDef) => {
  if (sym in def) {
    return def;
  }

  if (typeof self !== "undefined") {
    const id = writeToStore(def);
    def[sym] = id;
    return id;
  } else {
    let x = {};
    Object.getOwnPropertyNames(def).forEach((n) => {
      if (["id", "valueOf"].includes(n)) return;
      x[n] = def[n];
    });
    return JSON.stringify(x).replaceAll('"', "`");
  }
};

export const mergeStyles = (
  base: StyleDef,
  ...overrides: StyleDef[]
): StyleDef => {
  return merge(base, ...overrides);
};
