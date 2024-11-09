import { createLocalREST, localRestDelete, localRestGet, localRestPost, localRestPut } from "../src/index";

const users = [{
  name: "Dag",
  age: 23
}]


beforeEach(() => {
  const store = {} as { [key: string]: string };
  function save(key: string, value: string) {
    store[key] = value;
  }

  function load(key: string) {
    return store[key];
  }


  createLocalREST(save, load, {
    users,
    "accounts": [{
      name: "Dags account",
      number: 123432123343
    }],
    "contacts": [{
      name: "Test account",
      number: 321222332323
    }],
    "payments": [{
      from: "Dags account",
      to: "Test account",
      amount: 123,
      message: "test"
    }]
  });
});




type User = {
  name: string,
  age: number
}


test("can get initial values", () => {
  const val = [{ ...users[0], id: 1 }]
  expect(localRestGet<User>("users")).toStrictEqual(val);
});



test("can store and load item", () => {
  const user = {
    name: "Dag 2",
    age: 23,
  };
  localRestPost("users", [user]);
  const appendedUsers = [{ ...users[0], id: 1 }, { ...user, id: 2 }]
  expect(localRestGet<User>("users")).toStrictEqual(appendedUsers);
});


test("can store and load item", () => {
  const user = {
    id: 1,
    name: "Dag 2",
    age: 23,
  };
  localRestPut("users", user);

  expect(localRestGet<User>("users", 0)[0]).toStrictEqual(user);
});

test("can delete item", () => {

  localRestDelete("users", 1);

  expect(localRestGet<User>("users").length).toStrictEqual(0);
});


test("deleting first items returns new item", () => {
  const user = {
    name: "Dag 2",
    age: 23,
  };

  localRestPost("users", [user]);
  localRestDelete("users", 1);



  expect(localRestGet<User>("users")[0]).toStrictEqual({ ...user, id: 2 });
});


test("dont overwrite initial values", () => {
  const olga = {
    id: 1,
    name: "Olga",
    age: 81
  }
  const store = {
    "users":
      JSON.stringify({ currentIndex: 2, values: [olga] })
  } as { [key: string]: string };

  function save(key: string, value: string) {
    store[key] = value;
  }

  function load(key: string) {
    return store[key];
  }


  createLocalREST(save, load, {
    users,
    "accounts": [{
      name: "Dags account",
      number: 123432123343
    }],
    "contacts": [{
      name: "Test account",
      number: 321222332323
    }],
    "payments": [{
      from: "Dags account",
      to: "Test account",
      amount: 123,
      message: "test"
    }]
  });

  expect(localRestGet<User>("users")[0]).toStrictEqual(olga);
});




test(" overwrite initial values", () => {
  const olga = {
    id: 1,
    name: "Olga",
    age: 81
  }
  const store = {
    "users":
      JSON.stringify({ currentIndex: 2, values: [olga] })
  } as { [key: string]: string };

  function save(key: string, value: string) {
    store[key] = value;
  }

  function load(key: string) {
    return store[key];
  }


  createLocalREST(save, load, {
    users,
    "accounts": [{
      name: "Dags account",
      number: 123432123343
    }],
    "contacts": [{
      name: "Test account",
      number: 321222332323
    }],
    "payments": [{
      from: "Dags account",
      to: "Test account",
      amount: 123,
      message: "test"
    }]
  },
    true);

  expect(localRestGet<User>("users")).toStrictEqual(users);
});