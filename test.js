let c = {
  id: 222,
  parentId: 111,
  title: "orange",
};

let b = {
  id: 111,
  parentId: 1,
  title: "apple",
  children: [c],
};

let a = {
  id: 1,
  title: "root",
  children: [b],
};

let nodes = [a, b, c];
const xx = [];
export function toPath(c) {
  if (!c.parentId) {
    xx.push(c.title);
    return xx;
  } else {
    xx.push(c.title);
    nodes.forEach((node) => {
      if (node.id == c.parentId) {
        toPath(node);
      }
    });
  }

  return xx;
}

console.log(toPath(c));
