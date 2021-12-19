function getEditPage(editId){
    // send get request to server 
    $.get('/editor', { id : editId } ).done(function(data, status){

        // replace current html with view recieved by server
        let recievedView = document.open("text/body", "replace");
        recievedView.write(data);
        recievedView.close();
    });
}