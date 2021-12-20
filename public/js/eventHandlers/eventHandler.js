$(document).ready(()=>{
    mountEventHandlers();
});

function mountEventHandlers(){
    
    $('.button').click(function(){

        let inputType = $(this).attr('type');
        let inputId = $(this).attr('id');

        console.log("clicked: "+inputType+" - id: "+inputId);
        
        // handle open buttons
        if(inputType == 'open'){
            let lpId = inputId.replace('edit', '');
            session.openLearningPath(lpId);
            getEditPage(lpId);
        }
    
        // handle create button
        else if(inputType == 'create'){
            session.createLearningPath();
            let lpId = session.getCurrentLearningPathId();
            getEditPage(lpId);
        }

        // handle delete buttons        
        else if(inputType = 'delete'){

        }

        // close current LearningPath (open landing page)
        if(inputId == 'homeBtn'){
            getHomePage();
        }

        else if(inputType == 'save'){
            console.log(currentLearningPath.getId());
            console.log("stfy"+JSON.stringify(currentLearningPath))
            //$.post('/editor', { id : "id" , lp : JSON.stringify(currentLearningPath)});
        }
    });
}