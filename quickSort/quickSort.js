function quickSort(arr, low, high) {
  if (low < high) {
    let pivotpos = partition(arr, low, high);
    quickSort(arr, low, pivotpos - 1);
    quickSort(arr, pivotpos + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[low];
  while (low < high) {
    while (low < high && arr[high] >= pivot) --high;
    arr[low] = arr[high];
    while (low < high && arr[low] <= pivot) ++low;
    arr[high] = arr[low];
  }
  arr[low] = pivot;
  return low;
}
