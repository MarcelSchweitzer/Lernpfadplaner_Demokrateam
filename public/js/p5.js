var bg

function newSketch(p) {
    p.setup = function () {

      if(session.propExists([session.getLpIndexById(session.getCurrentlearningPathId()),'scenarios', session.getCurrentScenarioIndex(), 'resource']))
        bg = p.loadImage('https://cors-anywhere.herokuapp.com/'+session.getCurrentScenario().resource)
      else
        bg = 230

      // TODO make canvas parent(workspace) size
      p.createCanvas(600, 400); 
    }
  
    p.draw = function () {
      p.background(230);

      // draw one frame per second
      p.frameRate(1);

      if(session.ScenariosExist() && session.getProp('scenarios').length > 0 && session.interactionsExist() && session.getCurrentScenario().interactions.length > 0){
        interactions = session.getCurrentScenario().interactions
        for(i = 0; i < interactions.length; i++){
          let c = i == session.getCurrentInteractionIndex() ? p.color(255, 0, 0) : p.color(0, 255, 0);
          p.fill(c);
          p.noStroke();
          p.circle(interactions[i].x_coord, interactions[i].y_coord, 20);
        }
      }
    }
  }
