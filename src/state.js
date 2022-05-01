import { getBookmarks } from "../src/app/utils/chrome.js";
let state = {
  navigator: { isSelected: "bookmarks" },
  bookmarks: {
    bks: null,
    isSelected: null,
    editBar: {
      current: null, //add,edit,delete
      add: {
        active: false,
      },
      edit: {
        active: false,
      },
      delete: {
        active: false,
      },
    },
    path: [],
  },
  tabs: {},
  notes: {},
};

let listener = {
  navigator: [],
  bookmarks: [],
};

let lis = {
  bookmarks: {
    isSelected: {
      listener: [],
    },
    bks: {
      listener: [],
    },
    listener: [],
    editBar: {
      current: {
        listener: [],
      },
      add: {
        listener: [],
      },
      edit: {
        editing: { listener: [] },
        active: { listener: [] },

        listener: [],
      },
    },
    path: {
      listener: [],
    },
  },
};

export const registerListener = (key, callback) => {
  if (!key) throw new Error("must provide a key");
  listener[key].push(callback);
};

export const register = (key, callback) => {
  const path = key.split(".");
  const res = path.reduce((pre, cur) => {
    return pre[cur];
  }, lis);

  res.listener.push(callback);
};

export const setState1 = (path, value) => {
  const parts = path.split(".");
  const limit = parts.length - 1;
  let xx = {};
  for (let i = 0; i < limit; ++i) {
    const key = parts[i];

    xx = xx[key] ?? state[key];
  }
  const key = parts[limit];
  xx[key] = value;
  const cbs = parts.reduce((pre, cur) => {
    return pre[cur];
  }, lis);

  cbs &&
    cbs.listener &&
    cbs.listener.forEach((cb) => {
      cb();
    });

  console.log(state);
};

export const setState = (key, stateIn) => {
  console.log(`setState invoked`);
  key ? (state[key] = stateIn) : (state = stateIn);
  if (key) {
    listener[key].forEach((cb) => {
      cb();
    });
  }

  return state;
};

export const getState = (key) => {
  return key ? structuredClone(state[key]) : state;
};

export const getState1 = (key) => {
  const parts = key.split(".");
  const cbs = parts.reduce((pre, cur) => {
    return pre[cur];
  }, state);

  return cbs;
};

export const bookmarkAdded = () => {
  getBookmarks().then((nodes) => {
    setState1("bookmarks.bks", nodes);
    lis.bookmarks.bks.listener.forEach((cb) => {
      cb();
    });
  });
};
