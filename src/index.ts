export function sum(a: number, b: number) {
  return a + b;
}

type SharedFunctions = {
  save: (key: string, value: string) => void;
  load: (key: string) => string;
  initialValues: { [key: string]: any }
};

// fremfor å lagre i array kan det lagres i object med en id
// trenger en wrapper rundt og som holder orden på neste index og verdiene

// trenger å plukke ting ut fra path

const sharedFunctions: SharedFunctions = {} as SharedFunctions;

type WithId<T> = Partial<T> & { id: number };

type AsArrayOrSelf<T> = T extends Array<any> ? T : T[];

type AsIdOrIds<T> = T extends any[] ? number[] : number;


export function createLocalREST(
  save: SharedFunctions["save"],
  load: SharedFunctions["load"],
  initialValues: { [key: string]: any[] }
) {
  sharedFunctions.save = save;
  sharedFunctions.load = load;
  Object.entries(initialValues).forEach(([index, value]) => {
    localRestPost(index, value)
  })

}

type StorageWrapper<T> = {
  values: { [key: number]: WithId<T> },
  currentIndex: number
}

export function localRestPost<T>(path: string, values: T[]): number[] {
  const indexes = [] as number[]
  const existingRaw = sharedFunctions.load(path) || `{"values":{}, "currentIndex": 1}`;
  const existing = JSON.parse(existingRaw) as StorageWrapper<T>;
  values.forEach(value => {

    indexes.push(existing.currentIndex)
    existing.values[existing.currentIndex] = { ...value, id: existing.currentIndex }
    existing.currentIndex++
  })

  sharedFunctions.save(path, JSON.stringify(existing));
  return indexes
}
export function localRestPut<T>(path: string, value: WithId<T>) {
  const existingRaw = sharedFunctions.load(path) || `{"values":{}, "currentIndex": 1}`;
  const existing = JSON.parse(existingRaw) as StorageWrapper<T>;
  existing.values[value.id] = value
  sharedFunctions.save(path, JSON.stringify(existing));
}
export function localRestGet<T>(path: string, index?: number): WithId<T>[] {
  const storage = JSON.parse(sharedFunctions.load(path)) as StorageWrapper<T>;
  if (index) {

    return [storage.values[index]]
  }
  return Object.values(storage.values)
}

export function localRestDelete<T>(path: string, index: number) {
  const existingRaw = sharedFunctions.load(path) || `{"values":{}, "currentIndex": 0}`;
  const existing = JSON.parse(existingRaw) as StorageWrapper<T>;
  delete existing.values[index]
  sharedFunctions.save(path, JSON.stringify(existing));
}
