class CanvasManager {
  constructor() {
    this.p5Obj = null;
    this.canvas = null;
    this.material = [];
    this.scale = [];
    this.userOffsetX = [];
    this.userOffsetY = [];
    this.initposition = [];
    this.hoveredInteraction = null;
    this.draggedInteraction = null;
    this.backgrounddragged = false;
    this.dragTimeOut = false;
  }

  setBackgrounddragged(backgrounddragged) {
    this.backgrounddragged = backgrounddragged;
  }

  getBackgrounddragged() {
    return this.backgrounddragged;
  }

  setDragTimeOut(dragTimeOut) {
    this.dragTimeOut = dragTimeOut;
  }

  getDragTimeOut() {
    return this.dragTimeOut;
  }

  setUserOffset(x, y) {
    this.userOffsetX[session.getCurrentScenarioIndex()] = x;
    this.userOffsetY[session.getCurrentScenarioIndex()] = y;
  }

  setInitPosition(position) {
    this.initposition[session.getCurrentScenarioIndex()] = position;
  }

  getInitPosition() {
    return this.initposition[session.getCurrentScenarioIndex()];
  }

  getUserOffset() {
    return { x: this.userOffsetX[session.getCurrentScenarioIndex()], y: this.userOffsetY[session.getCurrentScenarioIndex()] };
  }

  setP5(p) {
    this.p5Obj = p;
  }

  setCanvas(cnv) {
    this.canvas = cnv;
  }

  setCurrentMaterial(path) {

    // TODO check material type here

    if (true)
      this.setImage(session.getCurrentScenarioIndex(), path);
    else
      this.setVideo(session.getCurrentScenarioIndex(), path);
  }

  setImage(index, path) {
    let success;

    if (this.material[index])
      this.material[index].remove();

    // load image ist hmtl object
    this.p5Obj.createImg(path, '', (img) => {
      img.id('wsImage' + index);

      // get width and height
      const width = document.getElementById('wsImage' + index).clientWidth;
      const height = document.getElementById('wsImage' + index).clientHeight;

      // hide original html object
      img.hide();

      // if width & heigth > 0 -> load successfull, save to imagelist
      if (width > 0 && height > 0) {
        this.material[index] = img;

        success = true;
      }

      this.scale[index] = 1;
      this.scaleToZero(index);
      this.initposition[index] = null;
      this.hoveredInteraction = null;
      this.draggedInteraction = null;
      
    });
  }

  setVideo(index, path) {
    if (this.material[index])
      this.material[index].remove();

    document.getElementById('workspace' + index).innerHTML = '<video  id="movie" src="' + path + '" height="100%" width="100%" controls autoplay > </video>';
    const player = document.getElementById('movie');
    player.load();

    this.scale[session.getCurrentScenarioIndex()] = 1;
    this.userOffsetX[session.getCurrentScenarioIndex()] = 0;
    this.userOffsetY[session.getCurrentScenarioIndex()] = 0;
    this.initposition[session.getCurrentScenarioIndex()] = null;
    this.hoveredInteraction = null;
    this.draggedInteraction = null;
  }

  getCurrentMaterial() {
    return this.material[session.getCurrentScenarioIndex()];
  }

  getMaterial(index) {
    return images[index];
  }

  getWorkSpaceName() {
    return 'workspace' + session.getCurrentScenarioIndex();
  }

  getWorkSpaceId() {
    return '#' + this.getWorkSpaceName();
  }

  getMaterialDimension() {
    const w = this.material[session.getCurrentScenarioIndex()].width;
    const h = this.material[session.getCurrentScenarioIndex()].height;
    return {width: w, height: h};
  }

  getWorkspaceDimension() {
    const w = document.querySelector(this.getWorkSpaceId()).offsetWidth;
    const h = document.querySelector(this.getWorkSpaceId()).offsetHeight;
    return {width: w, height: h};
  }

  addToScale(scale) {
    this.scale[session.getCurrentScenarioIndex()] += scale;
  }

  getScale(index = session.getCurrentScenarioIndex()) {
    return this.scale[index];
  }

  setScale(scale, index = session.getCurrentScenarioIndex()) {
    this.scale[index] = scale;
  }

  scaleToZero(index) {

    if (this.material[index].width > this.canvas.width)
      this.scale[index] = this.canvas.width / this.material[index].width;
    if (this.material[index].height > this.canvas.height && this.canvas.height / this.material[index].height < this.scale[index])
      this.scale[index] = this.canvas.height / this.material[index].height;
    this.userOffsetX[index] = this.material[index].width / 2 * this.scale[index];
    if (this.material[index].width * this.scale[index] < this.canvas.width)
      this.userOffsetX[index] = this.userOffsetX[index] + ((this.canvas.width - this.material[index].width * this.scale[index]) / 2);
    this.userOffsetY[index] = this.material[index].height / 2 * this.scale[index];
    if (this.material[index].height * this.scale[index] < this.canvas.height)
      this.userOffsetY[index] = this.userOffsetY[index] + ((this.canvas.height - this.material[index].height * this.scale[index]) / 2);
  }
  
  printCurrentCanvas(format) {
    if (session.scenarioOpened()) {
      this.p5Obj.saveCanvas(this.canvas, session.getCurrentScenario().title, format);
    }
  }

  resizeCanvas() {
    if (this.p5Obj && session.scenarioOpened())
      this.p5Obj.resizeCanvas(document.getElementById(this.getWorkSpaceName()).clientWidth, document.getElementById(this.getWorkSpaceName()).clientHeight);
  }

  setHover(index) {
    this.hoveredInteraction = index;
  }

  getHover() {
    return this.hoveredInteraction;
  }

  setDrag(index) {
    this.draggedInteraction = index;
  }

  getDrag() {
    return this.draggedInteraction;
  }

  inCanvas() {
    return this.p5Obj.mouseX > 0 && this.p5Obj.mouseY > 0 && this.p5Obj.mouseX < this.p5Obj.width && this.p5Obj.mouseY < this.p5Obj.height;
  }

}

const canvasManager = new CanvasManager();

function newCanv(p) {

  canvasManager.setP5(p);

  if (session.learningPathOpened() && session.ScenariosExist()) {

    p.setup = function() {

      // create canvas
      const cnv = p.createCanvas(canvasManager.getWorkspaceDimension().width, canvasManager.getWorkspaceDimension().height);
      canvasManager.setCanvas(cnv);

      // no fill mode
      p.noFill();

      // set colorMode
      p.colorMode(p.RGB, 255, 255, 255, 1);

      // handle resizeEvents
      document.getElementById('defaultCanvas0').onresize = function() {
        canvasManager.resizeCanvas(document.getElementById(canvasManager.getWorkSpaceId()).clientWidth, document.getElementById(canvasManager.getWorkSpaceId()).clientHeight);
      };

      const resetZoomBtn = p.createButton('').id('resetZoomBtn').class('btn btn-light scenarioBtn canvasBtn').position(10, 10)
        .size(100, 40);
      const resetZoomImg = p.createImg('img/aspect-ratio.svg').id('resetZoomBtn').class('button dashIcon scenarioBtnImg canvasBtn').parent(resetZoomBtn);
      const fullScreenBtn = p.createButton('').id('fullScreenBtn').class('btn btn-light scenarioBtn canvasBtn').position(10, 70)
        .size(100, 40);
      const fullScreenImg = p.createImg('img/fullscreen-exit.svg').id('fullScreenBtn').class('button dashIcon scenarioBtnImg canvasBtn').parent(fullScreenBtn);

    };

    // handle drag events
    p.mouseDragged = function (event) {
      if (canvasManager.inCanvas()) {
        // select dragged element
        if (canvasManager.getHover() != null && canvasManager.getDrag() == null) {
          canvasManager.setDrag(canvasManager.getHover());
          session.openInteraction(canvasManager.getHover());
          refreshInteractivityInputs();
        }

        // move dragged elemt
        else if (canvasManager.getDrag() != null) {
          session.setInteractionProp('x_coord', (event.offsetX - (session.getCurrentScenario().interactions[canvasManager.getDrag()].hotSpotSize / 2 * canvasManager.getScale()) - canvasManager.getUserOffset().x) / canvasManager.getScale());
          session.setInteractionProp('y_coord', (event.offsetY - (session.getCurrentScenario().interactions[canvasManager.getDrag()].hotSpotSize / 2 * canvasManager.getScale()) - canvasManager.getUserOffset().y) / canvasManager.getScale());
        }

        // move background
        else if (draggedInteraction == null && canvasManager.getDrag() == null && canvasManager.getHover() == null) {
          if (!canvasManager.getDragTimeOut()) {
            canvasManager.setInitPosition({x: p.mouseX, y: p.mouseY});
            canvasManager.setBackgrounddragged(true);
            canvasManager.setDragTimeOut(true);
            setTimeout(() => {
              if (canvasManager.getInitPosition()) {
                const bgDeltaX = canvasManager.getInitPosition().x - p.mouseX;
                const bgDeltaY = canvasManager.getInitPosition().y - p.mouseY;
                canvasManager.setUserOffset(canvasManager.getUserOffset().x - bgDeltaX, canvasManager.getUserOffset().y - bgDeltaY);
                canvasManager.setDragTimeOut(false);
              }
            }, 20);
          }
        }
      }
    };

    p.mouseReleased = function () {
      canvasManager.setDrag(null);
      canvasManager.setDrag(null);
      canvasManager.setBackgrounddragged(false);
      canvasManager.setInitPosition(null);
      canvasManager.setDragTimeOut(false);
    };

    p.mouseMoved = function (event) {
      if (canvasManager.inCanvas()) {
        if (session.interactionsExist()) {

          let hover = false;
          for (let i = 0; i < session.getCurrentScenario().interactions.length; i++) {
            const leftBorder = session.getCurrentScenario().interactions[i].x_coord - 5;
            const rightBorder = session.getCurrentScenario().interactions[i].x_coord + 5 + (session.getCurrentScenario().interactions[i].hotSpotSize); // !!
            const topBorder = session.getCurrentScenario().interactions[i].y_coord - 5; // !!
            const bottomBorder = session.getCurrentScenario().interactions[i].y_coord + 5 + (session.getCurrentScenario().interactions[i].hotSpotSize); // !!
            const x = (event.offsetX - canvasManager.getUserOffset().x) / canvasManager.getScale();
            const y = (event.offsetY - canvasManager.getUserOffset().y) / canvasManager.getScale();

            if (x > leftBorder && x < rightBorder && y > topBorder && y < bottomBorder) {
              canvasManager.setHover(i);
              hover = true;
            }
          }
          if (!hover)
            canvasManager.setHover(null);
        }
      }
    };

    p.mouseClicked = function (event) {
      if (canvasManager.inCanvas()) {
        canvasManager.setInitPosition(null);
        canvasManager.setDrag(null);
  
        // select interactivity by click
        if (canvasManager.getHover() != null) {
          session.openInteraction(canvasManager.getHover());
          refreshInteractivityInputs();
        }
      }
    };

    p.mouseWheel = function (event) {

      const zoomFactor = -0.0005;
      const offsetFactor = 25;

      if (canvasManager.inCanvas() && canvasManager.getScale() > 0) {
        canvasManager.addToScale(event.delta * zoomFactor * Math.sqrt(canvasManager.getScale()));
        if (event.delta < 0) {
          canvasManager.setUserOffset(
            canvasManager.getUserOffset().x + ((p.width / 2 - p.mouseX) * canvasManager.getScale() / offsetFactor),
            canvasManager.getUserOffset().y + ((p.height / 2 - p.mouseY) * canvasManager.getScale() / offsetFactor)
          );
        } else {
          canvasManager.setUserOffset(
            canvasManager.getUserOffset().x - ((p.width / 2 - p.mouseX) * canvasManager.getScale() / offsetFactor),
            canvasManager.getUserOffset().y - ((p.height / 2 - p.mouseY) * canvasManager.getScale() / offsetFactor)
          );
        }
        return false;
      }
    };

    p.draw = function () {

      // set FrameRate
      p.frameRate(30);


      // draw background
      p.background(245);

      // translate (zoom + position)
      p.translate(canvasManager.getUserOffset().x, canvasManager.getUserOffset().y);
      p.scale(canvasManager.getScale(), canvasManager.getScale());

      // draw image
      if (canvasManager.getCurrentMaterial()) {
        p.image(canvasManager.getCurrentMaterial(),
          - canvasManager.getCurrentMaterial().width / 2,
          - canvasManager.getCurrentMaterial().height / 2,
          canvasManager.getMaterialDimension().width,
          canvasManager.getMaterialDimension().height
        );
      }

      if (session.ScenariosExist() && session.getCurrentLearningPath()['scenarios'].length > 0 && session.interactionsExist() && session.getCurrentScenario().interactions.length > 0) {

        const interactions = session.getCurrentScenario().interactions;

        // draw cicles 
        for (i = 0; i < interactions.length; i++) {

          p.stroke(12, 230, 30, 0.1); // !!
          p.strokeWeight(interactions[i].hotSpotSize / 3);

          // inner rect
          p.rect(interactions[i].x_coord + 10, interactions[i].y_coord + 10, interactions[i].hotSpotSize - 20, interactions[i].hotSpotSize - 20, 20); // !!

          // default color
          p.stroke(12, 230, 30, 0.3); // !!

          // color for selected
          if (i === session.getCurrentInteractionIndex())
            p.stroke(205, 12, 30, 0.7); // !!

          // color for hover
          if (i === canvasManager.getHover())
            p.stroke(120, 120, 30, 0.7); // !!

          // color for drag
          if (i === canvasManager.getDrag())
            p.stroke(205, 12, 30, 0.7); // !!

          p.strokeWeight(interactions[i].hotSpotSize / 5);

          // outer rect
          p.rect(interactions[i].x_coord, interactions[i].y_coord, interactions[i].hotSpotSize, interactions[i].hotSpotSize, 20); // !!

        }
      }
    };
  }
}

// create THE canvas object // TODO there should be one for each scenario
function createCanvas() {
  if (session.learningPathOpened() && session.ScenariosExist() && session.getCurrentLearningPath().scenarios.length > 0) {
    workspaceId = 'workspace' + session.getCurrentScenarioIndex();
    document.getElementById(workspaceId).innerHTML = '';
    new p5(newCanv, workspaceId);
  }
}

// load the image background for each scenario (workspace)
function loadWorkspaceMaterials() {
  if (session.ScenariosExist() && session.getCurrentLearningPath().scenarios.length > 0) {
    for (let i = 0; i < session.getCurrentLearningPath().scenarios.length; i++) {

      // TODO check material type here
      const resource = session.getCurrentLearningPath().scenarios[i].resource;
      if (true)
        canvasManager.setImage(i, resource);
      else
        canvasManager.setVideo(i, resource);
    }
  }
}