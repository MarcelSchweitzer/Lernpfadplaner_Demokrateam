var bg

function newSketch(p) {
    p.setup = function () {
      p.background(0, 0, 0, 0);
      p.noFill();
      p.colorMode(p.RGB, 255, 255, 255, 1);

      let workspace = document.querySelector('.workspace');
      let width = workspace.clientWidth;
      let height = workspace.clientHeight;

      // TODO make canvas parent(workspace) size
      p.createCanvas(649, 498); 
    }
  
    p.draw = function () {
      p.clear();

      p.frameRate(10);

      if(session.ScenariosExist() && session.getProp('scenarios').length > 0 && session.interactionsExist() && session.getCurrentScenario().interactions.length > 0){
        interactions = session.getCurrentScenario().interactions
        for(i = 0; i < interactions.length; i++){
          i == session.getCurrentInteractionIndex() ? p.stroke(205, 12, 30, 0.7) : p.stroke(12, 230, 30, 0.3);
          p.strokeWeight(10);
          p.circle(interactions[i].x_coord, interactions[i].y_coord, 40);
        }
      }
    }
  }