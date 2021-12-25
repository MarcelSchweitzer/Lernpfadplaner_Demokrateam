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
            'scenarios': [], // list of dicts
            'categoryIDs': [],
            'interactionTypeIDs': []
        };
    }

    setProp(key, value) {
        this.props[key] = value;
    }

    getProp(key) {
        return this.props[key];
    }

    // create scanario at any position
    createScenario(index = null, title = null) {
        sc = new Scenario(title)
        this.props.scenarios = arrTk.insertAt(this.props.scenarios, sc, index)
    }

    moveScenario(indexOld, indexNew) {
        this.scenarios = arrTk.mvByIndex(this.props.scenarios, indexOld, indexNew)
    }

    deleteScenario(index) {
        this.props.scenarios = arrTk.rmByIndex(this.props.scenarios, index)
    }
}