function debounce(fn, time, triggerNow) {
  let t = null;

  return function (...args) {
    let _self = this;

    if (t) {
      clearTimeout(t);
    }

    if (triggerNow) {
      let exec = !t;

      t = setTimeout(() => {
        t = null;
      }, time);

      if (exec) {
        fn.apply(_self, args);
      }
    } else {
      t = setTimeout(() => {
        fn.apply(_self, args);
      }, time);
    }
  };
}
