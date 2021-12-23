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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        console.log("User :" + data[0]['uid'] + " connected");
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
app.get('/editor', function(req, res) {
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
app.get('/settings', function(req, res) {

    // TODO

    //dbMan.selectMatch('public.learningpath', 'title', 'lpid', req.query.lpid, (title) => {
    //    res.render('partials/settings', {
    //        data: {
    //            'learningpathTitle': title[0]['title']
    //        }
    //    });
    //})
    res.render('partials/settings', {
        data: {
            'learningpathTitle': 'Lernpfad'
        }
    });

})

// user wants to navigate back to landing page
app.get('/home', function(req, res) {
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
app.get('/learningPaths', function(req, res) {
    getCurrentUser(req.sessionID, (uid) => {
        dbMan.selectMatch('learningpath', 'lpid, title', 'owner', uid, (data) => {
            res.send(JSON.stringify(data));
        })
    });
})

// user wants to push his updates to the server
app.post('/updateLp', function(req, res) {

    res.send('200')
})

app.post('/updateSettings', function(req, res) {

    res.send('200')
})

// TODO increase performance by only updating props instaed of full lp
app.post('updateLpProp', function(req, res) {

    res.send('200')
})

// user wants to delete a learningPath
app.post('/deletelp', function(req, res) {
    let lpid = req.body.lpid;

    if (req.session.isAuth == true) {

        // resolve uid
        getCurrentUser(req.sessionID, (uid) => {

            // find owner of lp
            dbMan.selectMatch('public.learningpath', 'owner', 'lpid', lpid, (owner) => {

                // check if user is owner of lp that is to be deleted
                if (uid == owner[0]['owner']) {
                    dbMan._delete('learningpath', 'lpid', lpid, () => {

                        // respond OK to client
                        res.send('200')
                    })
                }
            });
        });
    }
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