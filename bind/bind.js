Function.prototype.bind = function (context) {
  var _this = this,
    slice = Array.prototype.slice,
    args = slice.call(arguments, 1),
    F = function () {};

  if (typeof this !== "function") {
    throw new TypeError("");
  }

  var fn = function () {
    var funcArgs = args.concat(arguments);

    _this.apply(this instanceof _this ? this : context, funcArgs);
  };

  F.prototype = this.prototype;
  fn.prototype = new F();

  return fn;
};
