function noop() {}

class LearningPath {
    constructor(params) {
        this.props = params.props;
    }

    setProp(key, value, index = null) {
        if (index === null)
            this.props[key] = value;
        else
            this.props[key][index] = value

    }

    getProp(key, index = null) {
        if (index === null)
            return this.props[key];
        else
            return this.props[key][index];
    }

    // create scanario at any position
    createScenario(props, cb = noop) {
        this.props.scenarios = insertAt(this.props.scenarios, props);
        return cb()
    }

    moveScenario(indexOld, indexNew) {
        this.props.scenarios = mvByIndex(this.props.scenarios, indexOld, indexNew)
    }

    deleteScenario(index) {
        this.props.scenarios = rmByIndex(this.props.scenarios, index)
    }
}