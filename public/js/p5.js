let  sketch = [];
//console.log(session.getCurrentlearningPath().scenarios.length)
for(let i = 0; i < 3; i++){
  sketch[i] = function(p){
    let img;
    let workshop = p._userNode
    let workshopID = parseInt(workshop.substring(9));
    p.preload = function(){
      img = p.loadImage(session.getCurrentlearningPath().scenarios[workshopID].resource);
      console.log(img);
    }

    p.setup = function(){
      p.background(50);
      p.noFill();
      p.colorMode(p.RGB, 255,255,255,1);

      let w = document.querySelector('#'+ workshop).offsetWidth;
      let h = document.querySelector('#'+ workshop).offsetHeight;

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
        interactions = session.getCurrentScenario().interactions
        for(i = 0; i < interactions.length; i++){
          i == session.getCurrentInteractionIndex() ? p.stroke(205, 12, 30, 0.7) : p.stroke(12, 230, 30, 0.3);
          p.strokeWeight(10);
          p.circle(interactions[i].x_coord, interactions[i].y_coord, 40);
        }
      }
    }
  }
}

/*if(session.learningPathOpened() && session.ScenariosExist()){
  for(let i = 0; i < session.getCurrentlearningPath().scenarios.length; i++){
    sketch[i] = function(p){
      let img;

      p.preload = function(){
        img[i] = p.loadImage(session.getCurrentlearningPath().scenarios[i].resource);
        console.log(img);
      }

      p.setup = function(){
        p.background(50);
        p.noFill();
        p.colorMode(p.RGB, 255,255,255,1);
      
        let workspaceID = '#workspace' + i
        let w = document.querySelector(workspaceID).offsetWidth;
        let h = document.querySelector(workspaceID).offsetHeight;
      
        p.createCanvas(w,h);
        p.background(50);
      
        let scale;
        let center = 0;
        if(img.height>img.width){
          scale = h/img.height;
          center = (w-img.width*scale)/2
        } else{
          scale = h/img.height;
          center = (w-img.width*scale)/2
        }
      
        p.image(img, center, 0, img.width*scale, img.height*scale);
      }

      p.draw = function () {
        p.frameRate(60);
      
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
  }
}*/