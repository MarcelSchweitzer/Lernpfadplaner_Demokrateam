// return a standard name with incrementing numbers
function uniqueName(schema, listOfNames) {
    if (listOfNames == null || listOfNames.length === 0 || !listOfNames.includes(schema))
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