function noop() {}

class LearningPath {
    constructor(params) {

        this.props = {
            'id': params.props.id,
            'title': params.props.title,
            'goalTaxonomyLevel': params.props.goalTaxonomyLevel,
            'goalEvaluation': params.props.goalEvaluation,
            'evaluationModeID': params.props.evaluationModeID,
            'description': params.props.description,
            'notes': params.props.notes,
            'categoryIDs': params.props.categoryIDs,
            'interactionTypeIDs': params.props.interactionTypeIDs
        };

        this.scenarios = params.scenarios;

    }

    setProp(key, value) {
        this.props[key] = value;
    }

    getProp(key) {
        return this.props[key];
    }

    // create scanario at any position
    createScenario(props, cb = noop) {
        this.scenarios = insertAt(this.scenarios, props);
        return cb()
    }

    moveScenario(indexOld, indexNew) {
        this.scenarios = mvByIndex(this.scenarios, indexOld, indexNew)
    }

    deleteScenario(index) {
        this.scenarios = rmByIndex(this.scenarios, index)
    }
}