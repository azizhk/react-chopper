export const ReactChopper = (target, componentReference) => {
  const preproxy = new WeakMap();

  const makeHandler = path => {
    return {
      set(target, key, value, receiver) {
        if (typeof value === "object") {
          value = proxify(value, [...path, key]);
        }
        target[key] = value;
        componentReference.setState({ [key]: value });
        return true;
      }
    };
  };

  const proxify = (obj, path) => {
    for (let key of Object.keys(obj)) {
      if (typeof obj[key] === "object") {
        obj[key] = proxify(obj[key], [...path, key]);
      }
    }
    let p = new Proxy(obj, makeHandler(path));
    preproxy.set(p, obj);
    return p;
  };

  return proxify(target, []);
};

export default ReactChopper;
