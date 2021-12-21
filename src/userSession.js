const dbMan = require('./dbManager.js');
const fstk = require('./fileSystemToolkit.js');
const animalNameList = fstk.textToArray('./res/animalNames.txt');

function createId(existingIds) {
    //TODO unique
    return Math.floor(100000 + Math.random() * 9000000000);
}

function createUserName() {
    let randIndex = Math.floor(Math.random() * (animalNameList.length));
    let animal = animalNameList[randIndex];
    animal = 'Anonyme ' + animal;
    return animal
}

// return sessionCookie
class userSession {
    constructor(userId = null) {
        this.sessionId = createId();
        if (userId === null) {
            this.userId = createId();
            this.userName = createUserName();
        } else {
            this.userId = userId
            // TODO get username from DATABASE
        }


        console.log('User session: user: ' + this.userId + ' nickname: ' + this.userName);

        this.user = {
            'uId': this.userId,
            'nickname': this.userName
        }
        let info = "noInfo";
        let expire = "2023-01-01 00:00:00";

        this.sessionCookie = {
            'sid': this.sessionId,
            'uid': this.userId,
            'information': info,
            'expire': expire
        }

        dbMan.insert('users', this.user, () => {
            dbMan.insert('user_session', this.sessionCookie);
        });

    }

    getSessionCookie() {
        return this.sessionCookie;
    }

    getUserInfo() {
        return this.user;
    }
}

module.exports.userSession = userSession;