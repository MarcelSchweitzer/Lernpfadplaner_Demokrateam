$(document).ready(()=>{
    session = new Session();

    $('.button').click(function(){
        let inputType = $(this).attr('type');
        let inpuId = $(this).attr('id');
        
        // handle open buttons
        if(inputType == 'open'){
            let lpId = inpuId.replace('edit', '');
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
    });
});