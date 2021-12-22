const dbMan = require('./dbManager.js');


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
        if (userId === null) {
            this.user = {
                uID: createId(),
                nickname: createUserName()
            };
        } else {
            // TODO get username from DATABASE
        }

    }

    getUserInfo() {
        return this.user;
    }
}

module.exports.userSession = userSession;