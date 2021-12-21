$(document).ready(()=>{
    mountEventHandlers();
});

function mountEventHandlers(){
    
    $('.button').click(function(){

        let inputClass = $(this).attr('class');
        let inputId = $(this).attr('id');

        console.log("clicked: "+inputClass+" - id: "+inputId);
        
        // handle open buttons
        if(inputClass.includes('open')){
            let lpId = inputId.replace('edit', '');
            session.openLearningPath(lpId);
            getEditPage(lpId);
        }
    
        // handle create button
        else if(inputClass.includes('create')){
            session.createLearningPath();
            let lpId = session.getCurrentLearningPathId();
            getCreatePage(lpId);
        }

        // handle delete buttons        
        else if(inputClass.includes('delete')){

        }

        // close current LearningPath (open landing page)
        if(inputClass.includes('homeBtn')){
            getHomePage();
        }

        else if(inputClass.includes('save')){
            console.log(currentLearningPath.getId());
            console.log("stfy"+JSON.stringify(currentLearningPath))
            //$.post('/editor', { id : "id" , lp : JSON.stringify(currentLearningPath)});
        }
    });
}