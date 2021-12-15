// remove by index
export function rmByIndex(arr, ind){
  if(ind >= arr.length || ind < 0)
    throw 'Index Out of Bound!'
  else
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
    || index < 0 || newIndex < 0 || arr.length < 1){
    throw 'Index Out of Bound!'
  }else{
    if (newIndex != index) {
  
      // shift left
      if (newIndex < index){
        arr.splice(newIndex, 0, arr[index])
        arr = rmByIndex(arr, index + 1)
      }

      // shift right
      else{
        arr.splice(newIndex+1, 0, arr[index])
        arr = rmByIndex(arr, index)
      }
    } 
  }
  return arr
}

export function insertAt(arr, element, index=null){
  if(index > arr.length || index < 0)
    throw 'Index Out of Bound!'

  // insert at end of list if index was not passed
  if(index === null)
    index = arr.length
  
  return arr.splice(index, 0, element)  
}