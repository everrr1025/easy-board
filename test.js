const getFolders = (bks) => {
  const result = [];
  let inner = (bks) => {
    if (!bks.url) {
      result.push({ id: bks.id, title: bks.title });
    }
    if (bks.children) {
      for (const node of bks.children) {
        inner(node);
      }
    }
    return result;
  };
  return inner(bks);
};

const getChildren = (bk, id) => {
  let result;
  let inner = (bk, id) => {
    if (bk.id == id) {
      result = bk;
    } else {
      bk.children &&
        bk.children.forEach((child) => {
          result = inner(child, id);
        });
    }
    return result;
  };
  return inner(bk, id);
};
const ob = {
  title: "hongda",
  id: 1,
  children: [
    {
      title: "music",
      parentId: 1,
      id: 2,
      children: [
        {
          title: "jay",
          parentId: 2,
          id: 6,
          children: [{ title: "安静", parentId: 6, id: 7, url: 1 }],
        },
      ],
    },
    {
      title: "food",
      parentId: 1,
      id: 3,
      children: [{ title: "水煮牛肉", parentId: 3, id: 8, url: 1 }],
    },
    {
      title: "sports",
      parentId: 1,
      id: 4,
      children: [{ title: "nba", parentId: 4, id: 9 }],
    },
    { title: "toDo", parentId: 1, id: 5, url: 1 },
  ],
};
const path = [];
const getPaths = (ob) => {
  const path1 = [];
  if (ob.url) {
    return;
  }

  path1.push(ob.title);

  if (ob.children) {
    let over = true;
    for (const child of ob.children) {
      if (!child.url) over = false;
    }

    if (over) {
      path.push(path1);
      return;
    } else {
      path1.push();
      for (const child of ob.children) {
        if (!child.url) {
          path1.push(child.title);
          getPaths(child);
        }
      }
    }
  }
};

//console.log(getFolders(ob));

const folders = getFolders(ob);
const paths = [];

const getPath = (ob, id) => {
  paths.push(getChildren(ob, id).title);

  if (!getChildren(ob, id).parentId) {
    return paths;
  } else {
    const parent = getChildren(ob, id).parentId;

    return getPath(ob, parent);
  }
};

const getFullPath = (ob, id) => {
  const paths = [];
  const inner = (ob, id) => {
    paths.push(getChildren(ob, id).title);
    if (!getChildren(ob, id).parentId) {
    } else {
      const parent = getChildren(ob, id).parentId;

      inner(ob, parent);
    }
    return paths;
  };

  return inner(ob, id);
};

console.log(getFullPath(ob, 8));
