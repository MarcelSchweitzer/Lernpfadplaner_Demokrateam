// remove by index
function rmByIndex(arr, index) {
  return arr.splice(index, 1)
}

// move one elem from one index to another
function mvByIndex(arr, index, newIndex) {
  if (newIndex != index) {
    arr = arr.splice(newIndex, 0, arr[index])

    // shift left
    if (newIndex < index)
      arr = arr.splice(index + 1, 1)

    // shift right
    else
      arr = arr.splice(index, 1)

    return arr

    // no shift
  } else {
    return arr
  }
}