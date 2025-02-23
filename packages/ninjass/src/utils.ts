/**
 * Simple deep merge, only handles nested plain objects :)
 */
export const merge = (target, ...sources) => {
  for (let s of sources) {
    for (let p in s) {
      if (typeof s[p] === "object" && typeof target[p] === "object") {
        merge(target[p], s[p]);
      } else {
        target[p] = s[p];
      }
    }
  }
  return target;
};