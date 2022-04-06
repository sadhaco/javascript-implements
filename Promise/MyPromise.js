const PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (value instanceof MyPromise) {
        value.then(resolve, reject);
      }

      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;

        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.value = reason;

        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }

  catch(errorCallback) {
    return this.then(null, errorCallback);
  }

  finally(callback) {
    this.then(
      (value) => {
        return Promise.resolve(callback()).then(() => {
          return value;
        });
      },
      (error) => {
        return Promise.resolve(callback()).then(() => {
          throw error;
        });
      }
    );
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;

    return new MyPromise((resolve, reject) => {
      if (value && value.then && typeof value.then === "function") {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let result = [],
        len = promises.length,
        index = 0;

      if (len === 0) {
        resolve(result);
        return;
      }

      for (let i = 0; i < len; i++) {
        MyPromise.resolve(promises[i])
          .then((value) => {
            result[i] = value;
            index++;
            if (index === len) resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      let len = promises.length;

      if (len === 0) return;

      for (let i = 0; i < len; i++) {
        MyPromise.resolve(promises[i])
          .then((value) => {
            resolve(value);
            return;
          })
          .catch((error) => {
            reject(error);
            return;
          });
      }
    });
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    throw new TypeError("chain");
  }

  let called = false;

  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    try {
      let then = x.then;

      if (typeof then === "fcuntion") {
        then.call(
          x,
          (v) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, v, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

MyPromise.defer = MyPromise.deferred = function () {
  let deferred = {};

  deferred.promise = new MyPromise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
};

module.exports = MyPromise;

// export default MyPromise;
