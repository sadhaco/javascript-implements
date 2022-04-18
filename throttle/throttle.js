function throttle(fn, delay) {
  let t = null,
    begin = new Date().getTime();

  return function (...args) {
    let _self = this,
      cur = new Date().getTime();

    clearTimeout(t);

    if (cur - begin >= delay) {
      fn.apply(_self, args);
      begin = cur;
    } else {
      t = setTimeout(() => {
        fn.apply(_self, args);
      }, delay);
    }
  };
}
