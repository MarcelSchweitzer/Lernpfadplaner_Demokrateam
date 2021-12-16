const express = require('express');
const path = require('path');
const session = require('./backend/src/js/session.cjs');

const sess = new session.Session();
const app = express();

// use ejs as view engine 
app.set('view engine', 'ejs');

// create test learningpaths
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

// render index.ejs
app.get('/', function (req, res) {

  // return ejs rendered page for home screen
  res.render('index', {data: {
    learningPathNames: sess.getLearningPathNames()
  }});
})

// react to posts
app.post('/', (req, res)=>{
  
  // return ejs rendered html for editor page
  res.render('learningPathEditor', {data: {
    currentModuleName: sess.readCurrentLearningPath().getName()
  }});
});

app.listen(8082);