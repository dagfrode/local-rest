import { createLocalREST, localRestGet, localRestPost } from "../src/index";

beforeAll(() => {
  const store = {} as { [key: string]: string };
  function save(key: string, value: string) {
    store[key] = value;
  }

  function load(key: string) {
    return store[key];
  }
  createLocalREST(save, load);
});

test("can store and load item", () => {
  const user = {
    name: "Dag",
    age: 23,
  };
  localRestPost("/users", user);
  const users = localRestGet("/users");
  expect(users).toStrictEqual([user]);
});
