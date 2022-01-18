class CanvasManager {
  constructor() { 
    this.images = []
    this.p5Obj = null;
    this.scale;
    this.center;
  }

  setP5(p){
    this.p5Obj = p;
  }

  setCurrentImage(path){
    this.images[session.getCurrentScenarioIndex()] = this.p5Obj.loadImage(path);
  }

  setImage(index, path){
    this.images[index] = this.p5Obj.loadImage(path);
  }

  getCurrentImage(){
    return this.images[session.getCurrentScenarioIndex()]
  }

  getImage(index){
    return images[index]
  }

  getWorkSpaceId(){
    return '#workspace' + session.getCurrentScenarioIndex()
  }

  getImageDimension(){
    let w = this.images[session.getCurrentScenarioIndex()].width
    let h = this.images[session.getCurrentScenarioIndex()].height
    return {'width': w, 'height': h}
  }

  getWorkspaceDimension(){
    let w = document.querySelector(this.getWorkSpaceId()).offsetWidth;
    let h = document.querySelector(this.getWorkSpaceId()).offsetHeight;
    return {'width': w, 'height': h}
  }

  getScale(){
    let img = this.images[session.getCurrentScenarioIndex()]
    return (img.height > img.width) ? this.getWorkspaceDimension().height / img.height : this.getWorkspaceDimension().height / img.height;
  }

  getCenter(){
    let img = this.images[session.getCurrentScenarioIndex()]
    return (img.height > img.width) ? (this.getWorkspaceDimension().width - img.width * this.getScale()) / 2 : (this.getWorkspaceDimension().width - img.width * this.getScale()) / 2;
  }
}

let canvasManager = new CanvasManager();

function newCanv(p){

  canvasManager.setP5(p);

  if(session.learningPathOpened() && session.ScenariosExist()){

    p.setup = function(){

      // create canvas
      p.createCanvas(canvasManager.getWorkspaceDimension().width, canvasManager.getWorkspaceDimension().height);

      // no fill mode
      p.noFill();

      // set colorMode
      p.colorMode(p.RGB, 255,255,255,1);

    }

    p.draw = function () {

      // set FrameRate
      p.frameRate(60);

      if(session.ScenariosExist() && session.getProp('scenarios').length > 0 && session.interactionsExist() && session.getCurrentScenario().interactions.length > 0){

        // draw background
        p.background(50);

        // draw image
        p.image(canvasManager.getCurrentImage(), canvasManager.getCenter(), 0, canvasManager.getImageDimension().width * canvasManager.getScale(), canvasManager.getImageDimension().height * canvasManager.getScale());

        let interactions = session.getCurrentScenario().interactions

        // draw cicles 
        for(i = 0; i < interactions.length; i++){
          i == session.getCurrentInteractionIndex() ? p.stroke(205, 12, 30, 0.7) : p.stroke(12, 230, 30, 0.3);
          p.strokeWeight(10);
          p.circle(interactions[i].x_coord, interactions[i].y_coord, 40);
        }

      }
    }
  }

}