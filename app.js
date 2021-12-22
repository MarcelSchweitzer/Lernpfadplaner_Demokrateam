const express = require('express');
const session = require('express-session');
const { render } = require('express/lib/response');
const PsqlStore = require('./src/psqlStore.js')(session);
const unique = require('./src/uniqueIdentifiers.js');
const dbMan = require('./src/dbManager.js');

require('dotenv').config();

const app = express();

app.use(session({
    store: new PsqlStore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000
    }
}));

// app.use(cookieParser());
app.set('view engine', 'ejs');

// host public static folder for files
app.use(express.static('public'));
app.use('img', express.static(__dirname + 'public/img'));
app.use('html', express.static(__dirname + 'public/html'));
app.use('css', express.static(__dirname + 'public/css'));
app.use('js', express.static(__dirname + 'public/js'));


// user loading site initialy
app.get('/', function(req, res) {

    if (req.session.isAuth == true) {

        // user is known
        dbMan.selectMatch('public.user', 'uid, nickname', 'latestSession', req.sessionID, renderIndex)
    } else {

        // user is unknowm
        req.session.isAuth = true;
        renderIndex([{ 'uid': 0, 'nickname': 'Anonymer Benutzer' }]);
    }

    function renderIndex(data) {
        console.log("USER :" + data[0]['uid'] + " logged on!");
        dbMan.selectMatch('public.learningpath', 'lpid, title', 'owner', data[0]['uid'], (_data) => {
            res.render('index', {
                data: {
                    learningPaths: _data,
                    uId: data[0]['uid'],
                    nickname: data[0]['nickname']
                }
            });
        });
    }
})


app.get('/get_started', function(req, res) {
    res.render('landing');
})


// user wants to edit a learningPath
app.get('/editor/lp=:lpId', function(req, res) {
    openId = req.params.lpId;
    if (req.session.isAuth == true) {

        // get name for new learningPath
        getCurrentUser(req.sessionID, (currentUserID) => {
            dbMan.selectMatch('public.learningpath', 'lpid, title', 'owner', currentUserID, (data) => {});
        });
    }

    // return ejs rendered page for editor screen
    res.render('partials/editor', {
        data: {
            id: req.params.lpId
        }
    });
})


// user wants to create a learningPath
app.get('/create', function(req, res) {
    if (req.session.isAuth == true) {

        // get name for new learningPath
        getCurrentUser(req.sessionID, (currentUserID) => {
            dbMan.selectMatch('public.learningpath', 'lpid, title', 'owner', currentUserID, (data) => {
                let lpids = [];
                let names = [];
                for (let i = 0; i < data.length; i++) {
                    lpids.push(data[i]['lpid']);
                    names.push(data[i]['title']);
                }
                let id = unique.uniqueId(lpids);
                let name = unique.uniqueName('Lernpfad', names);
                dbMan.insert('public.learningpath', { 'lpid': id, 'title': name, 'owner': currentUserID }, () => {
                    res.render('partials/settings', {
                        data: {
                            'learningpathTitle': name
                        }
                    });
                })
            });
        });
    } else {

        // authenticate user before lp can be created
        res.render('landing');
    }
})


// user wants to edit the settings of a learningPath
app.get('/settings/', function(req, res) {

    // return ejs rendered page for editor screen
    res.render('partials/settings');

})


// user wants to navigate back to landing page
app.get('/home/user=:user', function(req, res) {
    getCurrentUser(req.sessionID, (uid) => {
        dbMan.selectMatch('public.learningpath', 'lpid, title', 'owner', uid, (data) => {
            res.render('partials/dashboard', {
                data: {
                    learningPaths: data
                }
            });
        })
    });
})

// user wants a list of his learningPaths
//app.get('/learningPaths/user=:user', function(req, res) {
//    getCurrentUser(req.sessionID, (uid) => {
//        dbMan.selectMatch('learningpath', 'lpid, title', 'owner', uid, (data) => {
//            res.status().send('partials/dashboard', {
//                data: {
//                    learningPaths: data
//                }
//            });
//        })
//    });
//})


// user wants to push his updates to the server
app.post('/editor', function(req, res) {
    // console.log(req.data);

    // TODO only send 200 if everything worked out fine!
    res.send('200')
})


// start server
app.listen(process.env.HTTP_PORT, function(err) {
    if (err)
        console.log("Error in server setup");
    console.log("Server listening on Port", process.env.HTTP_PORT);
})

// return the current user
function getCurrentUser(sessionID, cb = noop) {
    dbMan.selectMatch('public.user', 'uid', 'latestSession', sessionID, (data) => {
        return cb(data[0]['uid'])
    });
}