// return a unique id
function uniqueId(listOfIds) {
  while (true) {
    let randomId = Math.floor(100000 + Math.random() * 9000000000);
    if (!listOfIds.includes(randomId))
      return randomId;
  }
}

// return a standard name with incrementing numbers
function uniqueName(schema, listOfNames) {
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