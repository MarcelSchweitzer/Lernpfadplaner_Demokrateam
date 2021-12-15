import LearningPath from '/src/modules/learningpath.js'
import * as arrTk from '/src/modules/arrayToolkit.js'
import * as unique from '/src/modules/uniqueIdentifiers.js'

export default class Session{
    constructor(){
        this.learningPaths = [];
        this.currentLearningPathId = null;

        // TODO settingsMangager class?

    }

    // get Id of current (opened) learningPath
    getCurrentLearningPathId(){ return this.currentLearningPathId; }

    // get a read only object representation of current lp 
    readCurrentLearningPath(){ 
        if(this.currentLearningPathId === null)
            return null
        return this.readLearningPathById(this.currentLearningPathId);
    }

    // get a read only object representation by id 
    readLearningPathById(id){
        for (var lp in this.learningPaths){
            if(this.learningPaths[lp].getId() == id)
                return this.learningPaths[lp]
        }
        return null
    }

    // return list of all available learning path ids 
    getLearningPathIds(){ 
        var ids = [];
        for (var lp in this.learningPaths)
            ids.push(this.learningPaths[lp].getId())
        return ids
    }

    // return list of all available learning path names 
    getLearningPathNames(){ 
        var names = [];
        for (var lp in this.learningPaths)
            names.push(this.learningPaths[lp].getName())
        return names
    }    

    // create learningpath meaning (add + open)
    createLearningPath(id=null, name=null){ 
        var newLP = this.addLearningPath();
        this.openLearningPath(newLP)
    }

    // add learning path to list and return id
    addLearningPath(id=null, name=null){
        if(id === null)

            // get unique unused id if not passed
            id = unique.uniqueId(this.getLearningPathIds());

        if(name === null)

            // get unique unused name if not passed 
            name = unique.uniqueName('lernpfad', this.getLearningPathNames())

        var lp = new LearningPath(id, name);
        this.learningPaths = arrTk.insertAt(this.learningPaths, lp);

        // return id
        return lp.getId()
    }

    // remove Learning Path from list
    removeLearningPath(id){

        // if deleted path is opened -> close
        if(this.currentLearningPathId == id)
            this.closeLearningPath();
        
        this.learningPaths = arrTk.rmById(this.learningPaths, id);
    }

    // open a learning path by id
    openLearningPath(id){ 
        this.currentLearningPathId = id;
    }

    // close the current learning path
    closeLearningPath(){
        this.currentLearningPathId = null;
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