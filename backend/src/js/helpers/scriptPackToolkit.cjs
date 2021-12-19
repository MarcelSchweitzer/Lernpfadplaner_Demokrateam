const fst = require('./fileSystemToolkit.cjs');

class scriptPacker{
    constructor(scriptPack, stylePack){
        this.scriptPack = scriptPack;
        this.stylePack = stylePack;
    }

    // pack all script files
    packScripts(view){
        return packFiles(view, this.scriptPack);
    }
    
    // pack all css files
    packStyle(view){
        return packFiles(view, this.stylePack);
    }

    packFiles(view, filePack){
        let packed = "";
        for(let pack of this.scriptPack[view]){
            packed += fst.readFile(filePack);
        }
        return packed;
    }

}




  module.exports.scriptPacker = scriptPacker;