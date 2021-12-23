class Session {
    constructor() {
        this.learningPaths = [];
        this.currentLearningPathId = null;
        this.userId = 0;
    }

    getUserId() {
        return this.userId;
    }

    // get Id of current (opened) learningPath
    getCurrentLearningPathId() { return this.currentLearningPathId; }

    // get a read only object representation by id 
    getLearningPathById(id) {
        return this.learningPaths[this.getLpIndexById(id)]
    }

    // get a read only object representation of current lp 
    getCurrentLearningPath() {
        return this.getLearningPathById(this.currentLearningPathId);
    }

    getLpIndexById(id) {
        for (let i = 0; i < this.learningPaths.length; i++)
            if (this.learningPaths[i].getId() == id)
                return i
        return null
    }

    // return learning paths
    getLearningPaths() {
        return this.learningPaths;
    }

    // return list of all available learning path ids 
    getLearningPathIds() {
        let ids = [];
        for (var lp in this.learningPaths)
            ids.push(this.learningPaths[lp].getId())
        return ids
    }

    // return list of all available learning path names 
    getLearningPathNames() {
        let names = [];
        for (let lp in this.learningPaths)
            names.push(this.learningPaths[lp].getName())
        return names
    }

    // create meaning add + open
    createLearningPath(id = null, name = null) {
        let newLP = this.addLearningPath();
        this.openLearningPath(newLP)
    }

    updateLearningPath(id, newLP) {
        this.learningPaths[this.getLpIndexById(id)] = newLP;
    }

    updateLearningPaths(learningPaths) {
        this.learningPaths = []

        // TODO 
        if (learningPaths)
            for (let i = 0; i < learningPaths.length; i++)
                session.addLearningPath(learningPaths[i]['lpid'], learningPaths[i]['title'])
    }

    // add learning path to list and return id
    addLearningPath(id, name) {
        let lp = new LearningPath(id, name);
        this.learningPaths = insertAt(this.learningPaths, lp);

        // return 
        return lp.getId()
    }

    // remove Learning Path from list
    removeLearningPath(id) {

        // if deleted path is opened -> close
        if (this.currentLearningPathId == id)
            this.closeLearningPath();

        this.learningPaths = rmById(this.learningPaths, id);
    }

    // open a learning path by id
    openLearningPath(id) {
        this.currentLearningPathId = id;
    }

    // close the current learning path
    closeLearningPath() {
        this.currentLearningPathId = null;
    }
}

const session = new Session();