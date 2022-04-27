let state = {
  navigator: { isSelected: "bookmarks" },
  bookmarks: {
    bks: null,
    isSelected: null,
    path: [],
  },
  tabs: {},
  notes: {},
};

let listener = {
  navigator: [],
  bookmarks: [],
};

export const registerListener = (key, callback) => {
  if (!key) throw new Error("must provide a key");
  listener[key].push(callback);
};

export const setState = (key, stateIn) => {
  key ? (state[key] = stateIn) : (state = stateIn);
  console.log(state);
  if (key) {
    listener[key].forEach((cb) => {
      cb();
    });
  }
  console.log(state);
  return state;
};

export const getState = (key) => {
  return key ? structuredClone(state[key]) : state;
};
