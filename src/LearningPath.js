class LearningPath{
 constructor(name){ //TODO: getNextFreeName function for name
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
  this.name = name; //String
  this.description = description; //String
  this.notes = notes; //String

  this.scenarios = []; //Scenario-Array

  this.categoryIDs = []; //Int-Array
  this.interactionTypeIDs = []; //Int-Array

 }

 setName(name){this.name = name;}
 getName(){return this.name;}

 setDescripton(description){this.description = description;}
 getDescription(){return this.description;}

 setNotes(notes){this.notes = notes;}
 getNotes(){return this.notes;}

 createScenario(index){
  //Objekt muss passend eingefügt werden
  //bei Einfügen in der Mitte müssen Objekte passend nach hinten verschoben werden
  this.scenarios[index] = new Scenario();
 }
 moveScenario(indexOld, indexNew){
  //Objekt muss passend neu eingefügt werden
  //altes Objekt muss passend rausgelöscht werden -> siehe deleteScenario
  this.scenarios.splice(indexNew, 0, this.scenarios[indexOld]);
 }
 deleteScenario(index){
  //objekt muss entfernt werden
  //bei objekt in der mitte muss zusätzlich die restlichen nachrücken -> nicht undefined hinterlassen
  //liste muss passend verkürzt werden
  delete this.scenarios[index];
 }

 setCategories(categories){this.categoryIDs = categories}
 getCategories(){return this.categoryIDs}

 setInteractionTypes(interactionTypes){this.interactionTypeIDs = interactionTypes}
 getInteractionTypes(){return this.interactionTypeIDs}

 getExTaxonomy(){
  //soll die höchste Taxonomy-Stufe unter allen Szenarien herausfinden
 }
 getUsedLicense(){
  //soll eine Liste aller benutzter Lizenzen zusammenstellen
 }
 getEvaluations(){
  //soll alle vorhandenen Evaluations zusammenzählen
 }
}

class Scenario{
 constructor(){}
}