$(document).ready(()=>{
    $('.button').click(function(){

        // handle open buttons
        if(this.type = 'open'){

            // send get request to server 
            lpId = this.id.replace('edit', '');
            $.get('/learningPathEditor', { id : lpId } ).done(function(data, status){

                // replace current html with view recieved by server
                let recievedView = document.open("text/html", "replace");
                recievedView.write(data);
                recievedView.close();
            });

        // handle delete buttons
        }else if(this.type = 'delete'){

        }
    });
});