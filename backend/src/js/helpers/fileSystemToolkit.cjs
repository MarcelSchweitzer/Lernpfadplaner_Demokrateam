const fs = require('fs');
const path = require('path'); 

function readJson(dataPath){
  JSON.parse(readFile(dataPath));
}

function readFile(dataPath){
  dataPath = replaceSep(dataPath);
  fs.readFile('test.txt', 'utf8', function(err, data) {
    console.log("TEXT.TXT:");
    if(err)       
      throw err;
    return data;
  });
}

function replaceSep(str_in){
  return str_in.replace(/\\/g, "/");
}

module.exports.readJson = readJson;
module.exports.readFile = readFile;