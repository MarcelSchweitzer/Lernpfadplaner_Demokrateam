import * as learningPath from '/src/modules/learningpath.mjs'
import {rmByIndex, mvByIndex, insertAt} from '/src/modules/arrayToolkit.mjs'

// test learningPath

var lp = new learningPath.LearningPath('test')


// test array_toolkit
var test_arr = []

test_arr = insertAt(test_arr, "max")
console.log(test_arr);
test_arr = insertAt(test_arr, "daniel", 0)
console.log(test_arr);
test_arr = insertAt(test_arr, "adrian", 0)
console.log(test_arr);
test_arr = insertAt(test_arr, "hannah", 2)
console.log(test_arr);
test_arr = insertAt(test_arr, "wassim", 1)
console.log(test_arr);
test_arr = insertAt(test_arr, "malcolm")
console.log(test_arr);
test_arr = insertAt(test_arr, "hadis", 2)
console.log(test_arr);
test_arr = insertAt(test_arr, "behnaz", 1)
console.log(test_arr);
test_arr = rmByIndex(test_arr, 2)
console.log(test_arr);
test_arr = mvByIndex(test_arr, 0, 1)
console.log(test_arr);
test_arr = mvByIndex(test_arr, 4, 2)
console.log(test_arr);
test_arr = mvByIndex(test_arr, 2, 5)
console.log(test_arr);
test_arr = mvByIndex(test_arr, 5, 2)
console.log(test_arr);
test_arr = mvByIndex(test_arr, 0, 4)
console.log(test_arr);