export const styleHyphenFormat = (styleIn) => {
  const styleOut = {};
  Object.keys(styleIn).forEach((key) => {
    styleOut[
      key.replace(/[A-Z]/g, (match, offset, string) => {
        return (offset > 0 ? "-" : "") + match.toLowerCase();
      })
    ] = styleIn[key];
  });

  return styleOut;
};

export const getChildren = (bk, id) => {
  if (!bk || !id) return;
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

export const getFolders = (bks) => {
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
export const getBookmarks = (bks) => {
  const result = [];
  let inner = (bks) => {
    if (bks.url) {
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

export const getFullPath = (ob, id, exlude) => {
  let paths = [];

  const inner = (ob, id) => {
    if (id == exlude) {
      paths = [];
      return;
    }
    const current = getChildren(ob, id);

    if (current) {
      paths.push(current.title);
      if (current.parentId && current.parentId != 1) {
        inner(ob, current.parentId);
      } else {
      }
    }

    return paths;
  };

  return inner(ob, id);
};

export const getFullPathNode = (ob, id) => {
  let paths = [];

  const inner = (ob, id) => {
    const current = getChildren(ob, id);
    if (!current) {
      return paths;
    }

    paths.push(current);
    if (current.parentId && current.parentId != 1) {
      inner(ob, current.parentId);
    }
    return paths;
  };

  return inner(ob, id);
};
