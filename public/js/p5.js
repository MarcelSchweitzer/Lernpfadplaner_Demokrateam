var bg

function newSketch(p) {
    p.setup = function () {
      if(session.propExists([session.getLpIndexById(session.getCurrentlearningPathId()),'scenarios', session.getCurrentScenarioIndex(), 'resource'])){
        // console.log("loading image!..")

        // Creates CORS Error

        bg = p.loadImage(session.getCurrentScenario().resource)
        // bg.crossOrigin = "";
      }else{
        bg = 230
      }

      // TODO make canvas parent(workspace) size
      p.createCanvas(900, 500); 
    }
  
    p.draw = function () {
      p.clear();
      //load as image
      p.image(bg, 0, 0);
      
      //p.background(bg);
      p.frameRate(3);

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
