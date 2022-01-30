
const express = require('express');
const session = require('express-session');
const PsqlStore = require('./src/psqlStore.js')(session);
const unique = require('./src/uniqueIdentifiers.js');
const dbMan = require('./src/dbManager.js');
const fstk = require('./src/fileSystemToolkit.js');
const { stringify } = require('nodemon/lib/utils');
const evaluationModes = fstk.textToArray('./res/evaluationModes.txt');
const interactionTypes = fstk.readJson('./res/interactionTypes.json');
const taxonomyLevels = fstk.textToArray('./res/taxonomyLevels.txt');

require('dotenv').config();

const app = express();

function noop() { return }

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
app.get('/', (req, res) => {

    if (req.session.isAuth == true) {

        // user is known
        dbMan.selectMatch('public.user', 'uid, nickname', 'latestSession', req.sessionID, renderIndex)
    } else {

        // user is unknowm
        req.session.isAuth = true;
        renderIndex([{ 'uid': 0, 'nickname': 'Anonymer Benutzer' }]);
    }

    function renderIndex(data) {
        console.log("user " + data[0]['uid'] + " connected!");
        dbMan.selectMatch('public.learningPath', 'content', 'owner', data[0]['uid'], (_data) => {
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

app.get('/get_started', (req, res) => {
    res.render('landing');
})

// user wants to edit a learningPath
app.get('/editor', (req, res) => {
    let lpid = req.query.lpid;

    if (req.session.isAuth == true) {

        // resolve uid
        getCurrentUser(req.sessionID, (uid) => {

            // find owner of lp
            dbMan.selectMatch('public.learningPath', 'owner, content', 'lpid', lpid, (data) => {
                // check if user is owner of lp that is to be deleted
                if (uid == data[0]['owner']) {
                    res.render('partials/editor', {
                        data: {
                            'learningPath': data[0]['content'],
                            'evaluationModes': evaluationModes,
                            'taxonomyLevels': taxonomyLevels
                        }
                    });
                } else {
                    res.render('landing');
                }
            });
        });
    }
})

// user wants to create a learningPath
app.get('/create', (req, res) => {
    if (req.session.isAuth == true) {

        // get name for new learningPath
        getCurrentUser(req.sessionID, (currentUserID) => {
            dbMan.selectMatch('public.learningPath', 'lpid, title', 'owner', currentUserID, (data) => {

                let names = [];
                for (let i = 0; i < data.length; i++) {
                    names.push(data[i]['title']);
                }

                let id = uniqueLpId()
                let name = unique.uniqueName('Neuer Lernpfad', names);

                // default settings for new learningPaths
                const defaultProps = {
                    "id": id,
                    "title": name,
                    "evaluationModeID": 'Keine Bewertung',
                    'taxonomyLevel': "",
                    'notes': "",
                    "lpSettings":{
                        "activeDefaultTypes":{},
                        "katIntCreated":{},
                        "onlyIntCreated":{}
                    },
                    'scenarios': [{
                        'title': 'Neues Szenario',
                        'resource': 'img/example.jpg',
                        "description": "",
                        "learningGoal": "",
                        "note": "",
                    }]
                }
                dbMan.insert('public.learningPath', {
                    'lpid': id,
                    'title': name,
                    'content': JSON.stringify(defaultProps),
                    'owner': currentUserID
                }, () => {
                    res.status(200).send({
                        'learningPathID': id,
                        'learningPathTitle': name,
                        'content': JSON.stringify(defaultProps),
                    });
                })
            });
        });
    } else {

        // authenticate user before lp can be created
        res.render('landing');
    }
})

// user wants to edit the settings
app.get('/settings', (req, res) => {
    let sid = req.sessionID;
    let lpid = req.query.lpid;
    let mode = req.query.mode;

    if (req.session.isAuth == true) {

        if (mode == 'userSettingsOnly') {
            dbMan.selectMatch('public.user', 'uid, nickname', 'latestSession', sid, (data) => {
                res.render('partials/settings', {
                    data: {
                        'lpSet': false,
                        'userSet': true,
                        'nickname': data[0]['nickname']
                    }
                });
            });
        } else if (mode == 'lpSettingsOnly') {
            lpSet(false);
        } else if (mode == 'allSettings') {
            lpSet(true);
        }
    }

    function lpSet(getUserSettings) {
        // resolve uid
        dbMan.selectMatch('public.user', 'uid, nickname', 'latestSession', sid, (data) => {

            // find owner of lp
            dbMan.selectMatch('public.learningPath', 'owner, title, content', 'lpid', lpid, (_data) => {

                // check if user is owner of lp that is to be deleted
                if (data[0]['uid'] == _data[0]['owner']) {
                    res.render('partials/settings', {
                        data: {
                            'lpSet': true,
                            'learningPath': _data[0]['content'],
                            'userSet': getUserSettings,
                            'nickname': data[0]['nickname'],
                            'interactionTypes':interactionTypes
                        }
                    });
                } else {
                    res.render('landing');
                }
            });
        });
    }
})

// user wants to navigate back to dashboard page
app.get('/home', (req, res) => {
    getCurrentUser(req.sessionID, (uid) => {
        dbMan.selectMatch('public.learningPath', 'content', 'owner', uid, (data) => {
            res.render('partials/dashboard', {
                data: {
                    learningPaths: data
                }
            });
        })
    });
})

// user wants a list of his learningPaths
app.get('/learningPaths', (req, res) => {
    getCurrentUser(req.sessionID, (uid) => {
        dbMan.selectMatch('learningPath', 'content', 'owner', uid, (data) => {
            res.send(JSON.stringify(data));
        })
    });
})

// user wants to push his updates to the server
app.post('/updateLp', (req, res) => {
    let lpid = req.body.lpid;
    let newLp = req.body.newLp;

    if (req.session.isAuth == true) {

        // resolve uid
        getCurrentUser(req.sessionID, (uid) => {

            if(newLp == 'true'){
                let id = uniqueLpId()
                var newCont = JSON.parse(req.body.learningPath)
                newCont['id'] = id
                newContJSON = JSON.stringify(newCont)
                dbMan.insert('public.learningPath', {
                    'lpid' : id,
                    'title': req.body.title,
                    'content': newContJSON,
                    'owner': uid
                }, 
                () => { res.send('200') }, 
                () => { res.send('500') })
            }
            
            else{
                // find owner of lp
                dbMan.selectMatch('public.learningPath', 'owner', 'lpid', lpid, (owner) => {
                    if (uid == owner[0]['owner']) {
                        dbMan._update('learningPath', 'lpid', lpid, {
                            'title': req.body.title,
                            'content': req.body.learningPath
                        }, 
                        () => { res.send('200') }, 
                        () => { res.send('500') })
                    }else{
                        res.send('500')
                    }
                });
            }
        });
    }
});


app.post('/updateUserName', (req, res) => {
    let sid = req.sessionID;

    if (req.session.isAuth == true) {
        getCurrentUser(sid, (uid) => {
            dbMan._update('public.user', 'uid', uid, {
                'nickname': req.body.nickname
            }, () => {

                // respond OK to client
                res.send('200')
            })
        });
    }
});

// user wants to know his username
app.get('/whoami', (req, res) => {
    let sid = req.sessionID;

    if (req.session.isAuth == true) {

        // resolve uid
        dbMan.selectMatch('public.user', 'nickname', 'latestSession', sid, (data) => {
            res.status(200).send({
                'nickname': data[0]['nickname']
            });
        });
    }
});

app.post('/updateSettings', (req, res) => {

    res.send('200')
})

// user wants to delete a learningPath
app.post('/deleteLp', (req, res) => {
    let lpid = req.body.lpid;

    if (req.session.isAuth == true) {

        // resolve uid
        getCurrentUser(req.sessionID, (uid) => {

            // find owner of lp
            dbMan.selectMatch('public.learningPath', 'owner', 'lpid', lpid, (owner) => {

                if(owner.length > 0){
                    // check if user is owner of lp that is to be deleted
                    if (uid == owner[0]['owner']) {
                        dbMan._delete('learningPath', 'lpid', lpid, () => {

                            // respond OK to client
                            res.send('200')
                        })
                    }
                }
            });
        });
    }
})

// return the current user
function getCurrentUser(sessionID, cb = noop) {
    dbMan.selectMatch('public.user', 'uid', 'latestSession', sessionID, (data) => {
        return cb(data[0]['uid'])
    });
}

function uniqueLpId(){
    lpids = []
    dbMan.select('public.learningPath', 'lpid', '', (data) => {
        for (let i = 0; i < data.length; i++)
            lpids.push(data[i]['lpid'])
    })
    return unique.uniqueId(lpids);
}

// start server
app.listen(process.env.HTTP_PORT, process.env.SERVER_IP, function(err) {
    if (err)
        console.log("Error in server setup");
    console.log("Server listening on Port", process.env.HTTP_PORT);
})