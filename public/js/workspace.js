class CanvasManager {
  constructor() { 
    this.images = []
    this.p5Obj = null;
    this.canvas = null
    this.scale = 1;
    this.userOffsetX = 0;
    this.userOffsetY = 0;
  }

  setUserOffset(x, y){
    this.userOffsetX = x;
    this.userOffsetY = y;
  }

  getUserOffset(){
    return{'x': this.userOffsetX, 'y': this.userOffsetY}
  }

  setP5(p){
    this.p5Obj = p;
  }

  setCanvas(cnv){
    this.canvas = cnv;
  }

  setCurrentImage(path){
    this.setImage(session.getCurrentScenarioIndex(), path);
  }

  setImage(index, path){

    let success; 

    if(this.images[index])
      this.images[index].remove();
    
    // load image ist hmtl object
    this.p5Obj.createImg(path, "", (img)=>{
      img.id('wsImage' + index)
    
      // get width and height 
      let width = document.getElementById('wsImage' + index).clientWidth
      let height = document.getElementById('wsImage' + index).clientWidth
  
      // hide original html object
      img.hide()
      
      // if width & heigth > 0 -> load successfull, save to imagelist
      if(width > 0 && height > 0){
        this.images[index] = img
        success = true;
      }
    });
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

  addToScale(scale){
    this.scale += scale;
  }

  getScale(){
    return this.scale;
  }

  printCurrentCanvas(format){
    if(session.scenarioOpened()){
      this.p5Obj.saveCanvas(this.canvas, session.getCurrentScenario().title, format);
    }
  }

}

let canvasManager = new CanvasManager();

function newCanv(p){

  canvasManager.setP5(p);

  if(session.learningPathOpened() && session.ScenariosExist()){

    p.setup = function(){

      // create canvas
      let cnv = p.createCanvas(canvasManager.getWorkspaceDimension().width, canvasManager.getWorkspaceDimension().height);
      canvasManager.setCanvas(cnv);

      // no fill mode
      p.noFill();

      // set colorMode
      p.colorMode(p.RGB, 255,255,255,1);

    }

    // handle drag events

    p.mouseDragged = function () {
      if(p.mouseX > 0 && p.mouseY > 0 && p.mouseX < p.width && p.mouseY < p.height && draggedInteraction == null)
        canvasManager.setUserOffset(p.mouseX, p.mouseY)
    }

    p.mouseWheel = function (event) {
      if(p.mouseX > 0 && p.mouseY > 0 && p.mouseX < p.width && p.mouseY < p.height){
        canvasManager.addToScale(event.delta * -0.0005)
        return false;
      }
    }

    p.draw = function () {

      // set FrameRate
      p.frameRate(60);

      
      // draw background
      p.background(50);

      // translate (zoom + position)
      p.translate(canvasManager.getUserOffset().x, canvasManager.getUserOffset().y);
      p.scale(canvasManager.getScale(), canvasManager.getScale());

      // draw image
      if(canvasManager.getCurrentImage()){
        p.image(canvasManager.getCurrentImage(),
        - canvasManager.getCurrentImage().width / 2,
        - canvasManager.getCurrentImage().height / 2,
        canvasManager.getImageDimension().width,
        canvasManager.getImageDimension().height
        );
      }

      if(session.ScenariosExist() && session.getProp('scenarios').length > 0 && session.interactionsExist() && session.getCurrentScenario().interactions.length > 0){

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