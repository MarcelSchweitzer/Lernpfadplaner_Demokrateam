class CanvasManager {
  constructor() { 
    this.p5Obj = null;
    this.canvas = null
    this.images = []
    this.scale = [];
    this.userOffsetX = [];
    this.userOffsetY = [];
    this.initposition = [session.getCurrentScenarioIndex()];
  }

  setUserOffset(x, y){
    this.userOffsetX[session.getCurrentScenarioIndex()] = x;
    this.userOffsetY[session.getCurrentScenarioIndex()] = y;
  }

  setInitPosition(position){
    this.initposition[session.getCurrentScenarioIndex()] = position;
  }

  getInitPosition(){
    return this.initposition[session.getCurrentScenarioIndex()];
  }

  getUserOffset(){
    return{'x': this.userOffsetX[session.getCurrentScenarioIndex()], 'y': this.userOffsetY[session.getCurrentScenarioIndex()]}
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
        this.scale[session.getCurrentScenarioIndex()] = 1;
        this.userOffsetX[session.getCurrentScenarioIndex()] = 0;
        this.userOffsetY[session.getCurrentScenarioIndex()] = 0;
        this.initposition[session.getCurrentScenarioIndex()] = null;
    
        console.log(this.scale)
        console.log(this.userOffsetX)
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

  getWorkSpaceName(){
    return 'workspace' + session.getCurrentScenarioIndex();
  }

  getWorkSpaceId(){
    return '#' + this.getWorkSpaceName();
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
    this.scale[session.getCurrentScenarioIndex()] += scale;
  }

  getScale(){
    return this.scale[session.getCurrentScenarioIndex()];
  }

  printCurrentCanvas(format){
    if(session.scenarioOpened()){
      this.p5Obj.saveCanvas(this.canvas, session.getCurrentScenario().title, format);
    }
  }

  resizeCanvas(){
    if(this.p5Obj)
      this.p5Obj.resizeCanvas(document.getElementById(this.getWorkSpaceName()).clientWidth, document.getElementById(this.getWorkSpaceName()).clientHeight);
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

      // handle resizeEvents
      document.getElementById('defaultCanvas0').onresize = function(){
        console.log(document.getElementById(this.getWorkSpaceId()).clientHeight)
        canvasManager.resizeCanvas(document.getElementById(this.getWorkSpaceId()).clientWidth, document.getElementById(this.getWorkSpaceId()).clientHeight);
      };

    }

    // handle drag events

    p.mouseDragged = function () {
      if(p.mouseX > 0 && p.mouseY > 0 && p.mouseX < p.width && p.mouseY < p.height && draggedInteraction == null){
        let init = (canvasManager.getInitPosition() == null) ? {'x': p.mouseX, 'y': p.mouseY} : canvasManager.getInitPosition()
        canvasManager.setUserOffset(-(init.x - p.mouseX), -(init.y - p.mouseY))
      }
    }

    p.mousePressed = function () {
      canvasManager.setInitPosition({'x': p.mouseX, 'y': p.mouseY})
    }

    p.mouseReleased = function () {
      canvasManager.setInitPosition(null);
    }
    p.mouseClicked = function () {
      canvasManager.setInitPosition(null);
    }

    p.mouseWheel = function (event) {
      console.log(canvasManager.getScale())
      if(p.mouseX > 0 && p.mouseY > 0 && p.mouseX < p.width && p.mouseY < p.height && canvasManager.getScale() > 0){
        canvasManager.addToScale(event.delta * -0.0005 * canvasManager.getScale())
        return false;
      }
    }

    p.draw = function () {

      // set FrameRate
      p.frameRate(60);

      
      // draw background
      p.background(245);

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