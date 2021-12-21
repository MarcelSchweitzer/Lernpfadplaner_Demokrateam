$(document).ready(()=>{
    mountHeaderEventHandlers();
    mountIndexEventHandlers();
});

function mountEventHandler(handler, fun){
    elem = document.getElementById(handler);
    elem.removeEventListener('click', fun, true);
    elem.addEventListener('click', fun, true);
}

function mountHeaderEventHandlers(){
    mountEventHandler('settingsBtn', settingsHandler);
    mountEventHandler('homeBtn', homeHandler);
}

function mountIndexEventHandlers(){
    mountHeaderEventHandlers();
    for(lp in session.getLearningPaths()){
        console.log(lp);
    }
    //mountEventHandler('editLpBtn', openHandler);
    mountEventHandler('createLpBtn', createHandler);
}

function mountSettingsEventHandlers(){
    mountEventHandler('saveSettingsBtn', saveSettingsHandler);
}

function mountEditorEventHandlers(){
    
}


function openHandler(id){
    session.openLearningPath(id);
    getEditPage(id);
}

function createHandler(){
    session.createLearningPath();
    let lpId = session.getCurrentLearningPathId();
    getCreatePage(lpId);
}

function deleteHandler(){

}

function settingsHandler(){
    getSettingsPage();
}

function homeHandler(){
    getHomePage();
}

function saveSettingsHandler(){

}

function exportHandler(){
    getEditPage();
}