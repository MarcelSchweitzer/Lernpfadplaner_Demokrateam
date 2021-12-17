const fst = require('./fileSystemToolkit.cjs');

class scriptPacker{
    constructor(scriptPack, stylePack){
        this.scriptPack = scriptPack;
        this.stylePack = stylePack;
    }
        // pack all script files
    packScripts(view){
        return fst.readFile(this.scriptPack[view]);
    }
    
    // pack all css files
    packStyle(view){
        return fst.readFile(this.stylePack[view]);
  }

}




  module.exports.scriptPacker = scriptPacker;