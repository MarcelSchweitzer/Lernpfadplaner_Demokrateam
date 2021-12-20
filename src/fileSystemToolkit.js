const fs = require('fs');

// read json file synchronously
function readJson(dataPath){
  return JSON.parse(readFile(dataPath));
}

// read File, return array line by line
function textToArray(dataPath){
  text =  fs.readFileSync(dataPath).toString('utf-8');
  arr = text.split('\r\n')
  return arr
}

// read file synchronously
function readFile(dataPath){
  dataPath = replaceSep(dataPath);
  return fs.readFileSync(dataPath, {encoding: 'utf8'});
}

function replaceSep(str_in){
  return str_in.replace(/\\/g, '/');
}

module.exports.readJson = readJson;
module.exports.readFile = readFile;
module.exports.textToArray = textToArray;