$(document).ready(()=>{
    $('.button').click(function(){

        // close current LearningPath aka open landing page
        if(this.type = 'close'){
            $.get('/', { id : "id" } ).done(function(data, status){

                // replace current html with view recieved by server
                let recievedView = document.open("text/html", "replace");
                recievedView.write(data);
                recievedView.close();
            });

        }
    });
});