// return a unique id
export function uniqueId(listOfIds){
    while(true){
        var randomId = Math.floor(100000 + Math.random() * 9000000000);
        if(!listOfIds.includes(randomId))
            return randomId;
    }
}

// return a standard name with incrementing numbers
export function uniqueName(schema, listOfNames){
    var name = schema;
    var num = 1;

    // search until free name has been found
    while(true){
        var nextName = name + num.toString();
        if(!listOfNames.includes(nextName))
            return nextName;
        num++;
    }
}