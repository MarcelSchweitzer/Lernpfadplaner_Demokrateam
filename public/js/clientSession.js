class Session {
    constructor() {
        this.learningPaths = [];
        this.currentLearningPathId = null;
        this.currentScenarioIndex = null;
        this.currentInteractionIndex = null;
    }

    // set a property of a learningpath
    setProp(key, value, index = null, indexKey = null) {
        if (index === null)
            this.learningPaths[this.getLpIndexById(this.currentLearningPathId)][key] = value;
        else if (index !== null && indexKey === null)
            this.learningPaths[this.getLpIndexById(this.currentLearningPathId)][key][index] = value;
        else
            this.learningPaths[this.getLpIndexById(this.currentLearningPathId)][key][index][indexKey] = value;
    }

    // get property of a learningpath
    getProp(key, index = null, indexKey = null) {
        if (index === null)
            return this.learningPaths[this.getLpIndexById(this.currentLearningPathId)][key];
        else if (index !== null && indexKey === null)
            return this.learningPaths[this.getLpIndexById(this.currentLearningPathId)][key][index];
        else
            return this.learningPaths[this.getLpIndexById(this.currentLearningPathId)][key][index][indexKey];
    }

    // add learning path to list and return id
    addLearningPath(params) {
        let lp = params;
        this.learningPaths = insertAt(this.learningPaths, lp);
    }

    // remove Learning Path from list
    removeLearningPath(id) {

        // if deleted path is opened -> close
        if (this.currentLearningPathId == id)
            this.closeLearningPath();

        this.learningPaths = rmById(this.learningPaths, id);
    }

    // create scanario at any position
    createScenario(props, cb = noop) {
        this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios = insertAt(this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios, props);
        return cb()
    }

    // move a scenario within the list of scenarios
    moveScenario(indexOld, indexNew) {
        this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios = mvByIndex(this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios, indexOld, indexNew)
    }

    // delete a scenario
    deleteScenario(index) {
        this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios = rmByIndex(this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios, index)
    }

    // get the currently shown scenarios
    getCurrentScenario() {
        if (this.learningPathOpened() && this.scenarioOpened())
            return this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex]
    }

    // set a scenario property
    setScenarioProp(key, value, index = this.currentScenarioIndex) {
        if (this.learningPathOpened() && this.scenarioOpened && index != null)
            this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex][key] = value;
    }

    // get a scenario property
    getScenarioProp(key, index = this.currentScenarioIndex) {
        if (this.learningPathOpened() && this.scenarioOpened && index != null)
            return this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex][key]
    }

    // add a new interaction
    addInteraction(coordinates, category, interactionType) {
        console.log('adding interaction ' + JSON.stringify(coordinates) + ' cat: ' + category + ' interaction type: ' + interactionType)
        if (this.learningPathOpened() && this.scenarioOpened())
            this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex].interactions = insertAt(this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex].interactions, { 'x_coord': coordinates.x, 'y_coord': coordinates.y, 'category': category, 'interactionType': interactionType });
    }

    // move interaction from indexOld to IndexNew
    moveInteraction(indexOld, indexNew) {
        if (this.learningPathOpened() && this.scenarioOpened())
            this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex].interactions = mvByIndex(this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex].interactions, indexOld, indexNew);
    }


    // delete interaction in current lp and scenario by index
    deleteInteraction(index) {
        if (this.learningPathOpened() && this.scenarioOpened())
            this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex].interactions = rmByIndex(this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex].interactions, index);
    }

    // get Interaction a given index
    getInteraction() {
        if (this.learningPathOpened() && this.scenarioOpened() && this.interactionOpened())
            return this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex].interactions[this.getCurrentInteractionIndex]
    }

    // change a property of a interaction
    setInteractionProp(key, value) {
        if (this.learningPathOpened() && this.scenarioOpened() && this.interactionOpened())
            this.learningPaths[this.getLpIndexById(this.currentLearningPathId)].scenarios[this.currentScenarioIndex].interactions[this.currentInteractionIndex][key] = value
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

    // get the index in the list of a learningpath that the element with the given id has
    getLpIndexById(id) {
        for (let i = 0; i < this.learningPaths.length; i++)
            if (this.learningPaths[i].id == id)
                return i
        return null
    }

    // get all learningPaths
    getLearningPaths() { return this.learningPaths; }

    // set the current set of lps to be another set of lps
    updateLearningPaths(learningPaths) {
        this.learningPaths = []

        // TODO 
        if (learningPaths)
            for (let i = 0; i < learningPaths.length; i++)
                this.addLearningPath(learningPaths[i].content);
    }

    // open a learning path by id
    openLearningPath(id) {
        this.currentLearningPathId = id;
    }

    // close the current learning path
    closeLearningPath() {
        this.currentLearningPathId = null;
    }

    // open a scenario by index
    openScenario(index) {
        this.currentScenarioIndex = index;
    }

    // close the current scenario
    closeScenario() {
        this.currentScenarioIndex = null;
    }

    // open a scenario by index
    openInteraction(index) {
        this.currentInteractionIndex = index;
    }

    // close the current scenario
    closeInteraction() {
        this.currentInteractionIndex = null;
    }

    // return true if a learningpath is opened
    learningPathOpened() {
        return this.currentLearningPathId != null;
    }

    // return true if a scenario is opened
    scenarioOpened() {
        return this.currentScenarioIndex != null;
    }

    // return true if a scenario is opened
    interactionOpened() {
        return this.currentInteractionIndex != null;
    }

}

const session = new Session();