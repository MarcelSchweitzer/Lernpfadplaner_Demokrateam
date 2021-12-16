$(document).ready(()=>{
    $('.button').click(function(){

        // handle open buttons
        if(this.type = 'open'){
            $.get('/learningPathEditor', { id : this.id } ).done(function(data, status){
                let recievedView = document.open("text/html", "replace");
                recievedView.write(data);
                recievedView.close();
            });

        // handle delete buttons
        }else if(this.type= 'delete'){

        }
    });
});