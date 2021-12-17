const express = require('express');
const path = require('path');
const lpSession = require('./backend/src/js/session.cjs');
//const userSession = require('express-session');
const fst = require('./backend/src/js/helpers/fileSystemToolkit.cjs');

const sess = new lpSession.Session();
const app = express();
const scriptPacks = fst.readJson('./views/scriptPacks.json');
const stylePacks = fst.readJson('./views/stylePacks.json');

const port = 8082;

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

  // pack all script files
  function packScripts(view){
    return fst.readFile(scriptPacks[view]);
  }

    // pack all css files
    function packStyle(view){
      return fst.readFile(stylePacks[view]);
    }

  // return ejs rendered page for home screen to client
  res.render('index', {data: {
    js : packScripts('index'),
    style : packStyle('index'),
    learningPathNames: sess.getLearningPathNames()
  }});
})

// render index.ejs
app.get('/learningPathEditor', function (req, res) {

  // make requested learningPath current learningPath
  // console.log(req.query.id);

  // return ejs rendered page for home screen
  res.render('learningPathEditor', {data: {
    learningPathIds: sess.getLearningPathIds(),
    learningPathNames: sess.getLearningPathNames()
  }});
})


/*** 
// react to posts
app.post('/', (req, res)=>{

  // console.log(req);
  
  // return ejs rendered html for editor page
  res.render('/learningPathEditor', {data: {
    currentModuleName: sess.readCurrentLearningPath().getName()
  }});
});

*/



app.listen(port, function(err){
  if (err)
    console.log("Error in server setup");
  console.log("Server listening on Port", port);
});