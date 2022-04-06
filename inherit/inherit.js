var inherit = (function () {
  var F = function () {};
  return function (Child, Parent) {
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.constructor = Child;
  };
})();
