# Local REST

Should maybe rename this vCRUDe as in Very CRUDe

Cause overengineering is still engineering

There is probably 5 better ways of solving this, and at least one is native in the browser. But it was a fun experiment.

NB! this is 1 indexed cause why not.

## Methods

### Init the API / storage

```TS
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
    }]
  });

```

### Get

```TS
  localRestGet<User>("users") // returns User[]
  localRestGet<User>("users", 1) // returns list with the indexed user
```

### Post

Post is always array as we can not overload functions

```TS
  const user = {
    name: "Dag 2",
    age: 23,
  };
  localRestPost("users", [user]);
```

### Put

put has the id of the object so we dont need to pass it additionally

```TS
  const user = {
    id: 1,
    name: "Dag 2",
    age: 23,
  };
  localRestPut("users", user);
```

### Delete

pretty straight forward

```TS
  localRestDelete("users", 1);
```
