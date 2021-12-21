// request edit patch from server
function getEditPage(editId){
    // send get request to server 
    $.get('/editor/', { uId : session.getUserId() }).done(function(data, status){ replaceBody(data) });
}

function getCreatePage(){
    // send get request to server 
    $.get('/create').done(function(data, status){ replaceBody(data) });
}

// request index patch from server
function getHomePage(){
    $.get('/home/user='+session.getUserId()).done(function(data, status){ 
        replaceBody(data);
        mountIndexEventHandlers();
    });
    $.get('/learningPaths/user='+session.getUserId()).done(function(data, status){
        console.log(data.learningPaths);
    });

}

function getSettingsPage(){
    $.get('/settings' ).done(function(data, status){ replaceBody(data) });
}

function replaceBody(data){
    const main = document.getElementById('main');
    main.innerHTML = data;
}