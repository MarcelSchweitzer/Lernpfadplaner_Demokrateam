const fstk = require('./fileSystemToolkit.js');
const animalNameList = fstk.textToArray('./res/animalNames.txt');

// return a unique id
function uniqueId(listOfIds) {
    if (listOfIds == null || listOfIds.length == 0)
        return randomId = Math.floor(100000 + Math.random() * 9000000000);
    while (true) {
        let randomId = Math.floor(100000 + Math.random() * 9000000000);
        if (!listOfIds.includes(randomId))
            return randomId;
    }
}

// return a standard name with incrementing numbers
function uniqueName(schema, listOfNames) {
    if (listOfNames == null || listOfNames.length == 0 || !listOfNames.includes(schema))
        return schema;
    let name = schema;
    let num = 1;

    // search until free name has been found
    while (true) {
        let nextName = name + num.toString();
        if (!listOfNames.includes(nextName))
            return nextName;
        num++;
    }
}

function createUserName() {
    let randIndex = Math.floor(Math.random() * (animalNameList.length - 1));
    let animal = animalNameList[randIndex];
    animal = 'Anonyme ' + animal;
    return animal
}

function createUniqueUserName(listOfNames) {
    return module.exports.uniqueName(module.exports.createUserName(), listOfNames);
}

module.exports.uniqueId = uniqueId;
module.exports.uniqueName = uniqueName;
module.exports.createUserName = createUserName;
module.exports.createUniqueUserName = createUniqueUserName;