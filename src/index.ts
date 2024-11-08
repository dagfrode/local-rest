export function sum(a: number, b: number) {
  return a + b;
}

type SharedFunctions = {
  save: (key: string, value: string) => void;
  load: (key: string) => string;
};

// fremfor å lagre i array kan det lagres i object med en id
// trenger en wrapper rundt og som holder orden på neste index og verdiene

// trenger å plukke ting ut fra path

const sharedFunctions: SharedFunctions = {} as SharedFunctions;

export function createLocalREST(
  save: SharedFunctions["save"],
  load: SharedFunctions["load"]
) {
  sharedFunctions.save = save;
  sharedFunctions.load = load;
}

export function localRestPost<T>(path: string, value: T) {
  const existingRaw = sharedFunctions.load(path) || "[]";
  const existing = JSON.parse(existingRaw) as T[];
  sharedFunctions.save(path, JSON.stringify([...existing, value]));
}
export function localRestPut<T>(path: string, index: number, value: T) {}
export function localRestGet<T>(path: string): T {
  return JSON.parse(sharedFunctions.load(path)) as T;
}
export function localRestDelete<T>(path: string, index: number, value: T) {}
