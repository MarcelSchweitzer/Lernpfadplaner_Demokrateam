$(document).ready(()=>{

    $('.button').click(function(){
        let inputType = $( this ).attr('type');

        // close current LearningPath (open landing page)
        if(inputType == 'close'){
            $.get('/', { id : "id" } ).done(function(data, status){

                // replace current html with view recieved by server
                let recievedView = document.open("text/html", "replace");
                recievedView.write(data);
                recievedView.close();
            });
        }


        else if(inputType == 'save'){
            console.log(currentLearningPath.getId());
            console.log("stfy"+JSON.stringify(currentLearningPath))
            //$.post('/editor', { id : "id" , lp : JSON.stringify(currentLearningPath)});
        }

    });
});