function noop() {}

class LearningPath {
    constructor(id, title) {
        this.props = {
            'id': id,
            'title': title,
            'goalTaxonomyLevel': 0,
            'goalEvaluation': 0,
            'evaluationModeID': 0,
            'description': '',
            'notes': '',
            'categoryIDs': [],
            'interactionTypeIDs': []
        };
        this.scenarios = [] // list of dicts
    }

    setProp(key, value) {
        this.props[key] = value;
    }

    getProp(key) {
        return this.props[key];
    }

    // create scanario at any position
    createScenario(title = null, index = null) {
        let sc = new Scenario(title)
        this.scenarios = insertAt(this.scenarios, sc, index)
        return sc
    }

    moveScenario(indexOld, indexNew) {
        this.scenarios = mvByIndex(this.scenarios, indexOld, indexNew)
    }

    deleteScenario(index) {
        this.scenarios = rmByIndex(this.scenarios, index)
    }
}

class Scenario {
    constructor(title) {
        this.props = {
            'title': title
        }
    }

    setProp(key, value) {
        this.props[key] = value;
    }

    getProp(key) {
        return this.props[key];
    }
}