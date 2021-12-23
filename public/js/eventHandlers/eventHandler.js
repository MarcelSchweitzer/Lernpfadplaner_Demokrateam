$(document).ready(() => {
    mountHeaderEventHandlers();
    mountIndexEventHandlers();
});

function mountEventHandler(handler, fun) {
    let elem = document.getElementById(handler);
    try {
        elem.removeEventListener('click', fun, false);
        elem.addEventListener('click', fun, false);
    } catch (e) {
        console.log('unable to mount evenlistener: ' + e)
    }
}

function mountHeaderEventHandlers() {
    mountEventHandler('settingsBtn', settingsHandler);
    mountEventHandler('homeBtn', homeHandler);
}

function mountIndexEventHandlers() {
    mountHeaderEventHandlers();
    mountEventHandler('createLpBtn', createHandler);

    var openButtons = document.getElementsByClassName('open');
    var deleteButtons = document.getElementsByClassName('delete');
    for (let i = 0; i < openButtons.length; i++) {
        openButtons[i].removeEventListener('click', editHandler, false);
        openButtons[i].addEventListener('click', editHandler, false);
    }
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].removeEventListener('click', deleteHandler, false);
        deleteButtons[i].addEventListener('click', deleteHandler, false);
    }

}

function mountSettingsEventHandlers() {
    mountEventHandler('saveSettingsBtn', saveSettingsHandler);
}

function mountEditorEventHandlers() {

}

function openHandler(id) {
    session.openLearningPath(id);
    getEditPage();
}

function createHandler() {
    session.createLearningPath();
    let lpId = session.getCurrentLearningPathId();
    getCreatePage(lpId);
}

function deleteHandler() {
    let _id = this.getAttribute('id');
    lpID = _id.replaceAll('delete', '');
    deleteID = '_del' + lpID
    editID = '_edit' + lpID

    let deleteButton = document.getElementById(deleteID);
    deleteButton.remove();

    let editButton = document.getElementById(editID);
    editButton.remove();

    deleteLearningPath(lpID)
}

function settingsHandler() {
    getSettingsPage(session.getCurrentLearningPathId());
}

function homeHandler() {
    getHomePage();
}

function saveSettingsHandler() {
    getEditPage();
}

function exportHandler() {
    getEditPage();
}

function editHandler() {
    let editID = this.getAttribute("id");
    editID = editID.replaceAll("edit", "");
    getEditPage(editID);
    session.openLearningPath(editID);
}