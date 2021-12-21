const express = require('express');
const cookieParser = require('cookie-parser');
const dbMan = require('./src/dbManager.js');
const userSession = require('./src/userSession.js');

const port = 8082;
const app = express();

app.use(cookieParser());
app.set('view engine', 'ejs');

// host public static folder for files
app.use(express.static('public'));
app.use('img', express.static(__dirname + 'public/img'));
app.use('html', express.static(__dirname + 'public/html'));
app.use('css', express.static(__dirname + 'public/css'));
app.use('js', express.static(__dirname + 'public/js'));

// dbMan.select('users');

// user loading site initialy
app.get('/', function (req, res) {

  // TODO authenticate user by cookie

  var userSess = new userSession.userSession();

  // attatch session cookie to response
  userCookie = userSess.getSessionCookie();
  for (const [key, value] of Object.entries(userCookie)) {
    res.cookie(key, value);
  }

  res.render('index', {data: {
    learningPaths: [
      {id:12341234324, name:"lernpfad1"},
      {id:3434234, name:"lernpfad2"},
      {id:34234234324, name:"lernpfad3"},
      {id:2343432423, name:"lernpfad4"}
    ],
    uId: userSess.getUserInfo()['uId'],
    nickname: userSess.getUserInfo()['nickname']
  }});
})

app.get('/get_started', function (req, res) {
  res.render('landing');
})

// user wants to edit a learningPath
app.get('/editor/lp=:lpId', function (req, res) {
  openId = req.params.lpId;
  userId = req.uId; // TODO get from cookie
  // dbMan.select('user_session')

  // return ejs rendered page for editor screen
  res.render('partials/editor', {data: {
    id: req.params.lpId
  }});

})

// user wants to create a learningPath
app.get('/create', function (req, res) {
  userId = 2554774756; // TODO get from cookie
  // dbMan.select('user_session')

  // return ejs rendered page for editor screen
  res.render('partials/settings');

})

// user wants to edit the settings of a learningPath
app.get('/settings', function (req, res) {

  // return ejs rendered page for editor screen
  res.render('partials/settings');

})

// user wants to navigate back to landing page
app.get('/home/user=:user', function (req, res) {

  // return ejs rendered page for dashboard screen
  res.render('partials/dashboard', {data: {
    learningPaths: [
      {id:12341234324, name:"lernpfad1"},
      {id:3434234, name:"lernpfad2"},
      {id:34234234324, name:"lernpfad3"},
      {id:2343432423, name:"lernpfad4"}
    ],
  }});

app.get('/learningPaths/user=:user', function (req, res) {

  // return list of users learningpaths
  res.send({data: {
    learningPaths: [
      {id:12341234324, name:"lernpfad1"},
      {id:3434234, name:"lernpfad2"},
      {id:34234234324, name:"lernpfad3"},
      {id:2343432423, name:"lernpfad4"}
    ],
  }});
})

})

// user wants to push his updates to the server
app.post('/editor', function (req, res) {
  // console.log(req.data);

  // TODO only send 200 if everything worked out fine!
  res.send('200')
})

// start server
app.listen(port, function(err){
  if (err)
    console.log("Error in server setup");
  console.log("Server listening on Port", port);
});