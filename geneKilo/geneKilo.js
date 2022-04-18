// 生成千位符，小数点后保留两位，不足两位补 0

const str = "11123123123.3212";

function geneKilo(str) {
  let arr = str.split("."),
    int = arr[0],
    intArr = int.split(""),
    decimal = arr[1] === undefined ? "00" : arr[1].substring(0, 2),
    res = "";

  while (decimal.length < 2) {
    decimal += "0";
  }

  while (intArr.length > 3) {
    let temp = intArr.splice(intArr.length - 3);
    res = "," + temp.join("") + res;
  }

  if (intArr.length > 0) {
    res = intArr.join("") + res;
  } else {
    res = res.substring(1);
  }

  res = res + "." + decimal;
  return res;
}

let res = geneKilo(str);

console.log(res);
