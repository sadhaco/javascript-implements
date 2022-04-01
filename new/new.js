function myNew(fn, ...args) {
  let instance = Object.create(fn.prototype);
  let res = fn.apply(instance, args);

  // 如果修改构造函数的返回值为对象类型，则返回该对象，如果不是，则正常返回 instance
  return typeof res === "object" ? res : instance;
}
