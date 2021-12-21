// request edit patch from server
function getEditPage(editId){
    // send get request to server 
    $.get('/editor', { id : editId }).done(function(data, status){ replaceBody(data) });
}

function getCreatePage(){
    // send get request to server 
    $.get('/create').done(function(data, status){ replaceBody(data) });
}

// request index patch from server
function getHomePage(){
    $.get('/home' ).done(function(data, status){ replaceBody(data) });
}

function getSettingsPage(){
    $.get('/settings' ).done(function(data, status){ replaceBody(data) });
}

function replaceBody(data){
    const main = document.getElementById('main');
    main.innerHTML = data;
    mountEventHandlers();
}