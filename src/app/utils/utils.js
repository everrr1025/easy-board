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
