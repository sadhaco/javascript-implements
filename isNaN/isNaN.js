function isNaN(key) {
  var res = Number(key) + "";

  return res === "NaN" ? true : false;
}
