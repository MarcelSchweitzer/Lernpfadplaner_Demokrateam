class Session {
    constructor() {
        this.learningPaths = [];
        this.currentlearningPathId = null;
        this.currentScenarioIndex = null;
        this.currentInteractionIndex = null;
    }

    // set a property of a learningPath
    setProp(key, value, index = null, indexKey = null) {
        if (index === null)
            this.learningPaths[this.getLpIndexById(this.currentlearningPathId)][key] = value;
        else if (index !== null && indexKey === null)
            this.learningPaths[this.getLpIndexById(this.currentlearningPathId)][key][index] = value;
        else
            this.learningPaths[this.getLpIndexById(this.currentlearningPathId)][key][index][indexKey] = value;
    }

    // find out if a property of a learningpath exists e.g propExists(['scenario', 3, 'interactions'])
    propExists(calls, root=this.learningPaths){
        if(calls.length == 1 && root[calls[0]])
            return true
        if(root[calls[0]]){
            let origCalls = calls.slice()
            calls.splice(0, 2, calls[1])
            return this.propExists(calls, root[origCalls[0]])
        }
        return false
    }

    interactionsExist(){
        return this.propExists([this.getLpIndexById(this.currentlearningPathId),'scenarios', this.currentScenarioIndex, 'interactions'])
    }

    ScenariosExist(){
        return this.propExists([this.getLpIndexById(this.currentlearningPathId),'scenarios'])
    }

    // add learning path to list and return id
    addlearningPath(params) {
        let lp = params;
        this.learningPaths = insertAt(this.learningPaths, lp);
    }

    // remove Learning Path from list
    removelearningPath(id) {

        // if deleted path is opened -> close
        if (this.currentlearningPathId == id)
            this.closeLearningPath();

        this.learningPaths = rmById(this.learningPaths, id);
    }

    // create scanario at any position
    createScenario(props, cb = noop) { //ändern
        this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios = insertAt(this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios, props);
        return cb()
    }

    // move a scenario within the list of scenarios
    moveScenario(indexOld, indexNew) {
        this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios = mvByIndex(this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios, indexOld, indexNew)
    }

    // delete a scenario
    deleteScenario(index) {
        this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios = rmByIndex(this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios, index)
    }

    // get the currently shown scenarios
    getCurrentScenarioIndex() {
        return this.currentScenarioIndex
    }

    // get the currently shown scenarios
    getCurrentScenario() {
        if (this.learningPathOpened() && this.scenarioOpened())
            return this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios[this.currentScenarioIndex]
    }

    // add a new interaction
    addInteraction(coordinates, materialUrl, evaluationHeurestic, category, interactionType, taxonomyLevelInt, behaviorSettings='Click') {
        if (this.learningPathOpened() && this.scenarioOpened())
            this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios[this.currentScenarioIndex].interactions = insertAt(this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios[this.currentScenarioIndex].interactions, { 'x_coord': coordinates.x, 'y_coord': coordinates.y, 'materialUrl': materialUrl, 'evaluationHeurestic': evaluationHeurestic, 'category': category, 'behaviorSettings':behaviorSettings, 'taxonomyLevelInt': taxonomyLevelInt, 'interactionType': interactionType});
    }

    // move interaction from indexOld to IndexNew
    moveInteraction(indexOld, indexNew) {
        if (this.learningPathOpened() && this.scenarioOpened())
            this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios[this.currentScenarioIndex].interactions = mvByIndex(this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios[this.currentScenarioIndex].interactions, indexOld, indexNew);
    }


    // delete interaction in current lp and scenario by index
    deleteInteraction(index) {
        if (this.learningPathOpened() && this.scenarioOpened())
            this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios[this.currentScenarioIndex].interactions = rmByIndex(this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios[this.currentScenarioIndex].interactions, index);
    }

    // get Interaction a given index
    getCurrentInteraction() {
        if (this.learningPathOpened() && this.scenarioOpened() && this.interactionOpened())
            return this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios[this.currentScenarioIndex].interactions[this.currentInteractionIndex]
    }

    getCurrentInteractionIndex() {
        return this.currentInteractionIndex
    }

    // change a property of a interaction
    setInteractionProp(key, value) {
        if (this.learningPathOpened() && this.scenarioOpened() && this.interactionOpened())
            this.learningPaths[this.getLpIndexById(this.currentlearningPathId)].scenarios[this.currentScenarioIndex].interactions[this.currentInteractionIndex][key] = value
    }


    // get Id of current (opened) learningPath
    getCurrentLearningPathId() { return this.currentlearningPathId; }

    // get a read only object representation by id 
    getlearningPathById(id) {
        return this.learningPaths[this.getLpIndexById(id)]
    }

    // get a read only object representation of current lp 
    getCurrentLearningPath() {
        return this.getlearningPathById(this.currentlearningPathId);
    }

    // get the index in the list of a learningPath that the element with the given id has
    getLpIndexById(id) {
        for (let i = 0; i < this.learningPaths.length; i++)
            if (this.learningPaths[i].id == id)
                return i
        return null
    }

    // get all learningPaths
    getlearningPaths() { return this.learningPaths; }

    // set the current set of lps to be another set of lps
    updatelearningPaths(learningPaths) {
        this.learningPaths = []

        // TODO 
        if (learningPaths)
            for (let i = 0; i < learningPaths.length; i++)
                this.addlearningPath(learningPaths[i].content);
    }

    // open a learning path by id
    openLearningPath(id) {
        this.currentlearningPathId = id;
    }

    // close the current learning path
    closeLearningPath() {
        this.currentlearningPathId = null;
        this.currentScenarioIndex = null;
        this.currentInteractionIndex = null;
    }

    // open a scenario by index
    openScenario(index) {
        // console.log("open scenario "+index)
        this.currentScenarioIndex = index;
    }

    // close the current scenario
    closeScenario() {
        // console.log("close scenario "+this.currentScenarioIndex)
        this.currentScenarioIndex = null;
        this.currentInteractionIndex = null;
    }

    // open a scenario by index
    openInteraction(index) {
        this.currentInteractionIndex = index;
    }

    // close the current scenario
    closeInteraction() {
        this.currentInteractionIndex = null;
    }

    // return true if a learningPath is opened
    learningPathOpened() {
        return this.currentlearningPathId != null;
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