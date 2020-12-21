function singleTextValueToMulti(value) {
  let rv = {};
  Object.keys(value).map((key) => (rv[key] = [value[key]]));
  return rv;
}

function multiTextValueToSingle(value) {
  let rv = {};
  Object.keys(value).map((key) => (rv[key] = value[key].join(" / ")));
  return rv;
}

export { singleTextValueToMulti, multiTextValueToSingle };
