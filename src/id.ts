let i = 0;

const getId = () => ++i;

export const sym = Symbol.for("@ninjass");

export const writeToStore = (val: any): number => {
  const id = getId();
  globalThis[sym][id] = val;

  return id;
};

export const __reset = () => {
  i = 0;
  globalThis[sym] = {};
};

export const __getLatestId = () => i;
