function myNew(fn, ...args) {
  let instance = Object.create(fn.prototype);
  let res = fn.apply(instance, args);

  return typeof res === "object" ? res : instance;
}
