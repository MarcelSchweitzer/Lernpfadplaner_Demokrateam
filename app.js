const express = require('express');
const cookieParser = require('cookie-parser');
const pgp = require("pg-promise")(/*options*/);
// const editorRoutes = require('./routes/editorRoutes');
const fst = require('./src/fileSystemToolkit.js');
const sptk = require('./src/scriptPackToolkit.js');
const scriptPacks = fst.readJson('./views/scriptPacks.json');
const stylePacks = fst.readJson('./views/stylePacks.json');
const scrPack = new sptk.scriptPacker(scriptPacks, stylePacks);

const user_db = pgp("postgres://postgres:demokrateam123@localhost:5432/users");
const app = express();

var uId = 0;


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

// render index.ejs
app.get('/', function (req, res) {

  if(typeof req.inialReq !== 'undefined' && req.inialReq !== 'true'){
    console.log('first req');
  }

  // TODO unique session id
  let sId = Math.floor(100000 + Math.random() * 9000000000);
  let uId = Math.floor(100000 + Math.random() * 9000000000);

  let user_cookie = {
    'sid':sId,
    'uid':uId,
    'sess':{"info1":"123",
            "info2":"456"},
     'expire':'2023-01-01 00:00:00' 
  }

  // cookie for every key
  for (const [key, value] of Object.entries(user_cookie)) {
    res.cookie(key, value);
  }

  // insert into db
  user_db.query('INSERT INTO users(uid) VALUES(' + uId + ')');
  user_db.query('INSERT INTO user_session(${this:name}) VALUES(${this:csv})', user_cookie);

  // req.session.isAuth = true;

  // return ejs rendered page for home screen to client
  res.render('index/index', {data: {
    js : scrPack.packScripts('index'),
    style : scrPack.packStyle('index'),
    learningPaths: [
      {id:12341234324, name:"lernpfad1"},
      {id:3434234, name:"lernpfad2"},
      {id:34234234324, name:"lernpfad3"},
      {id:2343432423, name:"lernpfad4"}
    ]
  }});
})

app.get('/editor', function (req, res) {
  openId = req.query.id;
  if(openId == 'null'){

    // add learningPath to db
    let lp = {'id':req.id, 'owner':234593454053}
    user_db.query('INSERT INTO user_learningpath(${this:name}) VALUES(${this:csv})', lp);
  }else{
    // TODO
  }

  // return ejs rendered page for home screen
  res.render('editor/editor', {data: {
    js : scrPack.packScripts('editor'),
    style : scrPack.packStyle('editor'),
    id: req.id
  }});

})

app.post('/editor', function (req, res) {
  console.log(req.data);

  // TODO only send 200 if everything worked out fine!
  res.send('200')
})


app.listen(port, function(err){
  if (err)
    console.log("Error in server setup");
  console.log("Server listening on Port", port);
});