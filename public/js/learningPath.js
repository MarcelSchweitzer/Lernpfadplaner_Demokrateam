function noop() {}

class LearningPath {
    constructor(params) {
        this.props = params.props;
    }

    setProp(key, value, index = null, indexKey = null) {
        if (index === null)
            this.props[key] = value;
        else if (index !== null && indexKey === null)
            this.props[key][index] = value;
        else
            this.props[key][index][indexKey] = value;

    }

    getProp(key, index = null, indexKey = null) {
        if (index === null)
            return this.props[key];
        else if (index !== null && indexKey === null)
            return this.props[key][index];
        else
            return this.props[key][index][indexKey];
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