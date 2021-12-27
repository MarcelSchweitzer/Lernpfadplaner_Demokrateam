class Session {
    constructor() {
        this.learningPaths = [];
        this.currentLearningPathId = null;
        this.userId = 0;
    }

    createScenario(params, cb = noop) {
        if (this.currentLearningPathId != null) {
            this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].createScenario({ 'props': { 'title': params.title } }, () => {
                return cb()
            });
        }
    }

    updateScenarioProperty() {

    }

    getUserId() {
        return this.userId;
    }
    setUserId(uid) {
        this.userId = uid;
    }

    // get Id of current (opened) learningPath
    getCurrentLearningPathId() { return this.currentLearningPathId; }

    // get a read only object representation by id 
    getLearningPathById(id) {
        return this.learningPaths[this.getLpIndexById(id)]
    }

    setCurrentLearningPathProp(key, value) {
        this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].setProp(key, value);
    }

    getCurrentLearningPathProp(key) {
        return this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].getProp(key);
    }

    setLearningPathPropById(id, key, value) {
        this.learningPaths[this.getLpIndexById(id)].setProp(key, value);
    }

    getLearningPathPropById(id, key) {
        return this.learningPaths[this.getLpIndexById(id)].getProp(key);
    }

    // get a read only object representation of current lp 
    getCurrentLearningPath() {
        return this.getLearningPathById(this.currentLearningPathId);
    }

    getLpIndexById(id) {
        for (let i = 0; i < this.learningPaths.length; i++)
            if (this.learningPaths[i].getProp('id') == id)
                return i
        return null
    }

    // return learning paths
    getLearningPaths() {
        return this.learningPaths;
    }

    updateLearningPath(id, newLP) {
        this.learningPaths[this.getLpIndexById(id)] = newLP;
    }

    updateLearningPaths(learningPaths) {
        this.learningPaths = []

        // TODO 
        if (learningPaths)
            for (let i = 0; i < learningPaths.length; i++)
                session.addLearningPath(learningPaths[i].content);
    }

    // add learning path to list and return id
    addLearningPath(params) {
        let lp = new LearningPath(params);
        this.learningPaths = insertAt(this.learningPaths, lp);

        // return 
        return lp.getProp('id')
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