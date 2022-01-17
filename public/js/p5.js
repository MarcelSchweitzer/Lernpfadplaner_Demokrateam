function newCanv(p){
  if(session.learningPathOpened() && session.ScenariosExist()){
    let img;
    p.preload = function(){
      img = p.loadImage(session.getCurrentlearningPath().scenarios[session.getCurrentScenarioIndex()].resource);
      console.log(img);
    }

    p.setup = function(){
      p.background(50);
      p.noFill();
      p.colorMode(p.RGB, 255,255,255,1);

      let workspaceId = '#workspace' + session.getCurrentScenarioIndex()

      let w = document.querySelector(workspaceId).offsetWidth;
      let h = document.querySelector(workspaceId).offsetHeight;

      p.createCanvas(w,h);
      p.background(50);

      let scale;
      let center = 0;
      if(img.height>img.width){
        scale = h/img.height;
        center = (w-img.width*scale)/2
        console.log('hoch')
      } else{
        scale = h/img.height;
        center = (w-img.width*scale)/2
        console.log('breit')
      }
      p.image(img, center, 0, img.width*scale, img.height*scale);
    }

    p.draw = function () {
      p.frameRate(60);
      if(session.ScenariosExist() && session.getProp('scenarios').length > 0 && session.interactionsExist() && session.getCurrentScenario().interactions.length > 0){
        p.background(50);
        let interactions = session.getCurrentScenario().interactions
        for(i = 0; i < interactions.length; i++){
          i == session.getCurrentInteractionIndex() ? p.stroke(205, 12, 30, 0.7) : p.stroke(12, 230, 30, 0.3);
          p.strokeWeight(10);
          p.circle(interactions[i].x_coord, interactions[i].y_coord, 40);
        }
      }
    }
  }
}