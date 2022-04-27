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
