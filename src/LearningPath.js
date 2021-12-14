class LearningPath{
 constructor(name){ //TODO: getNextFreeName method for name
  this.module = new Module(name);
  this.learningGoal = new LearningGoal();
 }
 
 createOverview(){}
 getShortOverview(){}
 goalComparison(){}
 createLicenseList(){}
}

class LearningGoal{
 constructor(goalTaxonomyLevel = 0, goalEvaluation = 0, evaluationModeID = 0){
  this.goalTaxonomyLevel = goalTaxonomyLevel; //int
  this.goalEvaluation = goalEvaluation; //int
  this.evaluationModeID = evaluationModeID; //int
 }

 setGoalTxonomyLevel(){}
 getGoalTxonomyLevel(){}

 setGoalEvaluation(){}
 getGoalEvaluation(){}

 setEvaluationMode(){}
 getEvaluationMode(){}
}

class Module{
 constructor(name, description = "", notes =""){
  this.name = name;
  this.description = description;
  this.notes = notes;

  this.scenarioIDs = [];
 }

setName(){}
getName(){}

setDescripton(){}
getDescription(){}

setNotes(){}
getNotes(){}

createScenario(){}
deleteScenario(){}

setCategories(){}
getCategories(){}

setInteractionTypes(){}
getInteractionTypes(){}

getExTaxonomy(){}
getUsedLicense(){}
getEvaluations(){}
}