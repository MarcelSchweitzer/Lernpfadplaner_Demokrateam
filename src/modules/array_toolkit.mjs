// remove by index
export function rmByIndex(arr, ind){
  if(index >= arr.length || index < 0){
    throw "Index Out of Bound!"
  }
  return arr.filter(function(value, index){ 
    return index != ind;
  });
}

// remove by value
export function rmByValue(arr, val){
  return arr.filter(function(value){ 
    return value != val;
  });
}

// move one elem from one index to another
export function mvByIndex(arr, index, newIndex) {
  if(index >= arr.length || newIndex >= arr.length
    || index < 0 || newIndex < 0){
    throw "Index Out of Bound!"
  }else{
    if (newIndex != index) {
      arr.splice(newIndex, 0, arr[index])
  
      // shift left
      if (newIndex < index)
        arr = rmByIndex(arr, index + 1)
  
      // shift right
      else
        arr = rmByIndex(arr, index)
    } 
  }
  return arr
}