$(document).ready(()=>{
    $('.button').click(function(){
        let inputType = $( this ).attr('type');
        
        // handle open buttons
        if(inputType == 'open'){
            // send get request to server 
            lpId = this.id.replace('edit', '');
            $.get('/editor', { id : lpId } ).done(function(data, status){

                // replace current html with view recieved by server
                let recievedView = document.open("text/html", "replace");
                recievedView.write(data);
                recievedView.close();
            });

        // handle create button
        }else if(inputType == 'create'){
            $.get('/editor', { id : "null" } ).done(function(data, status){

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