const express = require('express');
// const expressSession = require('express-Session');
const cookieParser = require('cookie-parser');
//const pgSession = require('connect-pg-simple')(expressSession);
//const pg = require('pg');
const pgp = require("pg-promise")(/*options*/);
const path = require('path');
// const editorRoutes = require('./routes/editorRoutes');
var lpSession = require('./backend/src/js/Session.cjs');
const fst = require('./backend/src/js/helpers/fileSystemToolkit.cjs');
const sptk = require('./backend/src/js/helpers/scriptPackToolkit.cjs');

const scriptPacks = fst.readJson('./views/scriptPacks.json');S
const stylePacks = fst.readJson('./views/stylePacks.json');

const scrPack = new sptk.scriptPacker(scriptPacks, stylePacks);

const lpSess = new lpSession.Session();
const db = pgp("postgres://postgres:demokrateam123@localhost:5432/user_cookies");
const app = express();


const port = 8082;

// use ejs as view engine 
app.set('view engine', 'ejs');

app.use(cookieParser());

// app.use('/editor', editorRoutes);

// TODO function for cookie validation

/*** 

const pgPool = new pg.Pool({
  database: 'user_cookies',
  user: 'postgres',
  password: 'demokrateam123',
  port: 5432,
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times
});

// create cookie for user session 
app.use(expressSession({
  store: new pgSession({
    pool : pgPool,                
    tableName : 'user_session'  
  }),
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 } // 1 year
}));


*/ 


// create test learningpaths
lpSess.createLearningPath();
lpSess.addLearningPath();
lpSess.addLearningPath();
lpSess.addLearningPath();
lpSess.addLearningPath();
lpSess.addLearningPath();
lpSess.addLearningPath();
lpSess.openLearningPath(lpSess.getLearningPathIds()[2])
lpSess.removeLearningPath(lpSess.getCurrentLearningPathId())
lpSess.createLearningPath();



// render index.ejs
app.get('/', function (req, res) {

  // TODO catch sql injection
  // TODO unique session id
  let sId = Math.floor(100000 + Math.random() * 9000000000);
  let user_cookie = {
    'sid':sId,
    'sess':{"info1":"123",
            "info2":"456"},
     'expire':'2023-01-01 00:00:00' 
  }

  // cookie for every key
  for (const [key, value] of Object.entries(user_cookie)) {
    res.cookie(key, value);
  }

  // insert into pg db
  db.query('INSERT INTO user_session(${this:name}) VALUES(${this:csv})', user_cookie);

  // req.session.isAuth = true;

  // return ejs rendered page for home screen to client
  res.render('index', {data: {
    js : scrPack.packScripts('index'),
    style : scrPack.packStyle('index'),
    learningPaths: lpSess.getLearningPaths()
  }});
})

app.get('/editor', function (req, res) {

  lpSess.openLearningPath(req.query.id);

  // return ejs rendered page for home screen
  res.render('editor', {data: {
    js : scrPack.packScripts('editor'),
    currentLearningPath: lpSess.getCurrentLearningPath()
  }});

})


app.listen(port, function(err){
  if (err)
    console.log("Error in server setup");
  console.log("Server listening on Port", port);
});