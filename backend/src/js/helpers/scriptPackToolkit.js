const fst = require('./fileSystemToolkit.js');

class scriptPacker{
    constructor(scriptPack, stylePack){
        this.scriptPack = scriptPack;
        this.stylePack = stylePack;
    }

    // pack all script files
    packScripts(view){
        return this.packFiles(view, this.scriptPack);
    }
    
    // pack all css files
    packStyle(view){
        return this.packFiles(view, this.stylePack);
    }

    packFiles(view, filePack){
        let packed = "";
        for(let pack of filePack[view]){
            packed += fst.readFile(pack);
        }
        return packed;
    }

}




  module.exports.scriptPacker = scriptPacker;