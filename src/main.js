// import LearningPath from LearningPath
import {rmByIndex, rmByValue, mvByIndex} from '/src/modules/array_toolkit.mjs'

// lp = new LearningPath('test')


// test array_toolkit
var test_arr = ['max', 'wassim', 'hannah', 'malcolm', 'hadis', 'behnaz', 'daniel', 'adrian']

test_arr = rmByValue(test_arr, 'max')
test_arr = rmByIndex(test_arr, 2)
console.log(test_arr);
test_arr = mvByIndex(test_arr, 0, 5)
console.log(test_arr);
test_arr = mvByIndex(test_arr, 4, 2)
console.log(test_arr);
test_arr = mvByIndex(test_arr, 2, 5)
console.log(test_arr);
test_arr = mvByIndex(test_arr, 5, 2)
console.log(test_arr);