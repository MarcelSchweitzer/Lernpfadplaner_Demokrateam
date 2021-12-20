const fstk = require('./fileSystemToolkit.js');
const animalNameList = fstk.textToArray('./res/animalNames.txt');

function createUserId(){

    //TODO unique
    return Math.floor(100000 + Math.random() * 9000000000);
}

function createUserName(){
    let randIndex = Math.floor(Math.random() * (animalNameList.length));
    const animal = animalNameList[randIndex];
    console.log(animal);
    return animal
}

class userSession{
    constructor(userId = null){
        if(userId === null){
            this.userId = createUserId();
            this.userName = createUserName();
            console.log('User session: user: '+this.userId+' nickname: '+this.userName);  
        }else{
            this.userId = userId
            // TODO get username from DATABASE
        }
    }
} 

module.exports.userSession = userSession;