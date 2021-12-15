const express = require('express');
const path = require('path');
const session = require('./backend/src/js/session.cjs')

const app = express();

// create user session
var sess = new session.Session();

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
sess.createLearningPath();

app.use('/public', express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');

// render index.ejs
app.get('/', function (req, res) {
  res.render('index', {});
})

app.get('/editModule', function (req, res) {
  res.render('learningPathEditor', {data : {currentModuleName: sess.readCurrentLearningPath().getName()}});
})

app.listen(8082)