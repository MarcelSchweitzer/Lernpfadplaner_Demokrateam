// request edit patch from server
function getEditPage(editId){
    // send get request to server 
    $.get('/editor', { id : editId } ).done(function(data, status){

        const main = document.getElementById('main');
        main.innerHTML = data;
        mountEventHandlers();
    });
}

// request index patch from server
function getHomePage(){
    $.get('/home' ).done(function(data, status){
        const main = document.getElementById('main');
        main.innerHTML = data;
        mountEventHandlers();
    });
}