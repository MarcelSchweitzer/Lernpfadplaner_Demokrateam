import Session from '/src/js/session.js'
import * as arrTK from '/src/js/arrayToolkit.js'

// test array_toolkit
var test_arr = []

test_arr = arrTK.insertAt(test_arr, "max")
console.log(test_arr);
test_arr = arrTK.insertAt(test_arr, "daniel", 0)
console.log(test_arr);
test_arr = arrTK.insertAt(test_arr, "adrian", 0)
console.log(test_arr);
test_arr = arrTK.insertAt(test_arr, "hannah", 2)
console.log(test_arr);
test_arr = arrTK.insertAt(test_arr, "wassim", 1)
console.log(test_arr);
test_arr = arrTK.insertAt(test_arr, "malcolm")
console.log(test_arr);
test_arr = arrTK.insertAt(test_arr, "hadis", 2)
console.log(test_arr);
test_arr = arrTK.insertAt(test_arr, "behnaz", 1)
console.log(test_arr);
test_arr = arrTK.rmByIndex(test_arr, 2)
console.log(test_arr);
test_arr = arrTK.mvByIndex(test_arr, 0, 1)
console.log(test_arr);
test_arr = arrTK.mvByIndex(test_arr, 4, 2)
console.log(test_arr);
test_arr = arrTK.mvByIndex(test_arr, 2, 5)
console.log(test_arr);
test_arr = arrTK.mvByIndex(test_arr, 5, 2)
console.log(test_arr);
test_arr = arrTK.mvByIndex(test_arr, 0, 4)
console.log(test_arr);

// test session
var sess = new Session();

// create test learning path
sess.createLearningPath();

sess.addLearningPath();
sess.addLearningPath();
sess.addLearningPath();
sess.addLearningPath();
sess.addLearningPath();
sess.addLearningPath();

console.log(sess.getLearningPathIds())

console.log('current name ' + sess.readCurrentLearningPath().getName())
console.log('current id ' + sess.readCurrentLearningPath().getId())
sess.openLearningPath(sess.getLearningPathIds()[2])
console.log('current id ' + sess.readCurrentLearningPath().getId())
console.log('current name ' + sess.readCurrentLearningPath().getName())
sess.removeLearningPath(sess.getCurrentLearningPathId())
console.log(sess.getLearningPathIds())
console.log('current id ' + sess.getCurrentLearningPathId())