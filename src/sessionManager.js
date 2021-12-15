import * as learningPath from '/src/modules/learningpath.mjs'
import * as arrTk from '/src/modules/array_toolkit.mjs'
import * as unique from '/src/modules/uniqueIdentifiers.mjs'

class Session{
    constructor(){
        this.learningPaths = [];
        this.currentLearningPathId = null;

        // TODO settingsMangager class?

    }

    // get Id of current (opened) learningPath
    getCurrentLearningPathId(){ return this.currentLearningPathId; }

    // get a read only object representation of current lp 
    readCurrentLearningPath(){ 
        return this.getLearningPathById(this.currentLearningPathId);
    }

    // get learningpath object by index
    getLearningPathById(id){
        for (var lp in this.learningPaths){
            if(this.learningPaths[lp].getId() == id)
                return this.learningPaths[lp]
        }
    }

    // return list of all available learning path ids 
    getLearningPathIds(){ 
        var ids = [];
        for (lp in this.learningPaths)
            ids.push(this.learningPaths[lp].getId())
        return ids
    }

    // return list of all available learning path names 
    getLearningPathNames(){ 
        var names = [];
        for (lp in this.learningPaths)
            names.push(this.learningPaths[lp].getName())
        return names
    }    

    // create learning path meaning (add + open)
    createLearningPath(id=null, name=null){ 
        var newId = this.addLearningPath();
        this.openLearningPath(newId)
    }

    // add learning path to list and return id
    addLearningPath(id=null, name=null){
        if(id === null)

            // get unique unused id if not passed
            id = unique.uniqueId(this.getLearningPathIds());

        if(name === null)

            // get unique unused name if not passed 
            name = unique.uniqueName('lernpfad', this.getLearningPathNames())

        var lp = new learningPath.LearningPath(id, name);
        this.learningPaths = arrTk.insertAt(this.learningPaths, lp);

        // return id
        return lp.getId()
    }

    // open a learning path by id
    openLearningPath(id){ 
        this.currentLearningPathId = id;
    }

    // close the current learning path
    closeLearningPath(){
        this.CurrentLearningPathId = null;
    }

    // load learning paths from disk (json)
    loadLearningPaths(){
        var lp = []
        try{

            // TODO load JSON file

        }catch(err){

            // learningPaths.json not found! -> empty array

        }
        return lp
    }

    // load user settings from disk (json)
    loadUserSettings(){

        // TODO load JSON file

    }
}


// test session
var sess = new Session();

// add test learning path
sess.createLearningPath();


// print name
console.log(sess.readCurrentLearningPath().getName())