import * as arrTk from '/src/js/arrayToolkit.js'

export default class LearningPath {
  constructor(id, name) {
    this.id = id; 
    this.module = new Module(name);
    this.learningGoal = new LearningGoal();
  }

  // id is immutable!
  getId(){ return this.id }

  getName(){ return this.module.getName() }
  setName(name){ this.module.setName(name) }

  createOverview() { }
  getShortOverview() { }
  goalComparison() { }
  createLicenseList() { }
}

class LearningGoal {
  constructor(goalTaxonomyLevel = 0, goalEvaluation = 0, evaluationModeID = 0) {
    this.goalTaxonomyLevel = goalTaxonomyLevel; //int
    this.goalEvaluation = goalEvaluation; //int
    this.evaluationModeID = evaluationModeID; //int
  }

  setGoalTxonomyLevel() { }
  getGoalTxonomyLevel() { }

  setGoalEvaluation() { }
  getGoalEvaluation() { }

  setEvaluationMode() { }
  getEvaluationMode() { }
}

class Module {
  constructor(name, description = "", notes = "") {
    this.name = name; //String
    this.description = description; //String
    this.notes = notes; //String
    this.scenarios = []; //Scenario-Array
    this.categoryIDs = []; //Int-Array
    this.interactionTypeIDs = []; //Int-Array
  }

  setName(name) { this.name = name; }
  getName() { return this.name; }

  setDescripton(description) { this.description = description; }
  getDescription() { return this.description; }

  setNotes(notes) { this.notes = notes; }
  getNotes() { return this.notes; }

  // create scanario at any position
  createScenario(index=null, title=null) {
    sc = new Scenario(title)
    this.scenarios = arrTk.insertAt(this.scenarios, sc, index)
  }

  moveScenario(indexOld, indexNew) {
    this.scenarios = arrTk.mvByIndex(this.scenarios, indexOld, indexNew)
  }

  deleteScenario(index) {
    this.scenarios = arrTk.rmByIndex(this.scenarios, index)
  }

  setCategories(categories) { this.categoryIDs = categories }
  getCategories() { return this.categoryIDs }

  setInteractionTypes(interactionTypes) { this.interactionTypeIDs = interactionTypes }
  getInteractionTypes() { return this.interactionTypeIDs }

  getExTaxonomy() {

    // TODO get highest taxonomy level

  }
  getUsedLicense() {

    // TODO return list of all used licenses
    
  }

  getEvaluations() {

    // TODO return evaluations

  }
}

// TODO Title instead of name?

class Scenario {
  constructor(title) {
    this.title = title;

    // TODO 

   }
 
  setTitle(title) { this.title = title; }
  getTitle() { return this.title; }

  // TODO 
}