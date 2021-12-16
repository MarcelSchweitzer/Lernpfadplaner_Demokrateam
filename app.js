const express = require('express');
const path = require('path');
const session = require('./backend/src/js/session.cjs');

const app = express();
const sess = new session.Session();

// create test learning path
sess.createLearningPath();
sess.addLearningPath();
sess.addLearningPath();
sess.addLearningPath();
sess.addLearningPath();
sess.addLearningPath();
sess.addLearningPath();
sess.openLearningPath(sess.getLearningPathIds()[2])
sess.removeLearningPath(sess.getCurrentLearningPathId())
sess.createLearningPath();

app.use('/public', express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');

// render index.ejs
app.get('/', function (req, res) {
  res.render('index', {data: {
    learningPathNames: sess.getLearningPathNames()
  }});
})

app.post('/', (req, res)=>{
  res.render('learningPathEditor', {data: {
    currentModuleName: sess.readCurrentLearningPath().getName()
  }});
});

app.listen(8082);