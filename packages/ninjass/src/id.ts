let i = 0;

const getId = () => ++i;

const sym = Symbol.for('@ninjass');

export const writeToStore = (val: any): number => {
  const id = getId();
  globalThis[sym][id] = val;

  return id;
}

export const __reset = () => {
  i = 0;
  globalThis[sym] = {};
}
