const learningPath = require('./learningPath.cjs')
const arrTk = require('./helpers/arrayToolkit.cjs') 
const uniq = require('./helpers/uniqueIdentifiers.cjs') 

class Session{
    constructor(){
        this.learningPaths = [];
        this.currentLearningPathId = null;

    }

    // get Id of current (opened) learningPath
    getCurrentLearningPathId(){ return this.currentLearningPathId; }

    // get a read only object representation of current lp 
    getCurrentLearningPath(){ 
        return this.getLearningPathById(this.currentLearningPathId);
    }

    // get a read only object representation by id 
      getLearningPathById(id){
        return this.learningPaths[this.getLpIndexById(id)]
    }

    getLpIndexById(id){
        for(let i=0; i < this.learningPaths.length; i++)
            if(this.learningPaths[i].getId() == id)
                return i
        return null
    }

    // return learning paths
    getLearningPaths(){ 
        return this.learningPaths; 
    }

    // return list of all available learning path ids 
    getLearningPathIds(){ 
        let ids = [];
        for (var lp in this.learningPaths)
            ids.push(this.learningPaths[lp].getId())
        return ids
    }

    // return list of all available learning path names 
    getLearningPathNames(){ 
        let names = [];
        for (let lp in this.learningPaths)
            names.push(this.learningPaths[lp].getName())
        return names
    }    

    // create learningpath meaning (add + open)
    createLearningPath(id=null, name=null){ 
        let newLP = this.addLearningPath();
        this.openLearningPath(newLP)
    }

    updateLearningPath(id, newLP){ 
        this.learningPaths[this.getLpIndexById(id)] = newLP;
    }

    // add learning path to list and return id
    addLearningPath(id=null, name=null){
        if(id === null)

            // get unique unused id if not passed
            id = uniq.uniqueId(this.getLearningPathIds());

        if(name === null)

            // get unique unused name if not passed 
            name = uniq.uniqueName('lernpfad', this.getLearningPathNames())

        let lp = new learningPath.LearningPath(id, name);
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
}

module.exports.Session = Session;