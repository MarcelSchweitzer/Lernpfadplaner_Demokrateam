function noop() {}

// remove by index
function rmByIndex(arr, ind) {
    if (ind >= arr.length || ind < 0)
        throw 'Index Out of Bound!'
    else
        return arr.filter(function(value, index) {
            return index != ind
        });
}

// remove by value
function rmByValue(arr, val) {
    return arr.filter(function(value, index) {
        return value != val
    })
}

// remove by id
function rmById(arr, id) {
    return arr.filter(function(value) {
        return value.id != id
    });
}

// move one elem from one index to another
function mvByIndex(arr, index, newIndex) {
    if (index >= arr.length || newIndex >= arr.length ||
        index < 0 || newIndex < 0 || arr.length < 1) {
        throw 'Index Out of Bound!'
    } else {
        if (newIndex != index) {

            // shift left
            if (newIndex < index) {
                arr.splice(newIndex, 0, arr[index])
                arr = rmByIndex(arr, index + 1)
            }

            // shift right
            else {
                arr.splice(newIndex + 1, 0, arr[index])
                arr = rmByIndex(arr, index)
            }
        }
    }
    return arr
}

function insertAt(arr, element, index = null) {
    // insert at end of list if index was not passed
    if (index === null)
        index = arr.length

    if (index > arr.length || index < 0)
        throw 'Index Out of Bound!'

    arr.splice(index, 0, element)

    return arr
}