var unsavedChanges = false;

$(document).ready(() => {
    mountHeaderEventHandlers();
    mountIndexEventHandlers();
    fetchLearningPaths();
});

function mountButtonHandler(element, fun) {
    let elem = document.getElementById(element);
    try {
        elem.addEventListener('click', fun, false);
    } catch (e) {
        elem.removeEventListener('click', fun, false);
        elem.addEventListener('click', fun, false);
    }
}

function propertyConnection(input, lpProp) {
    let inp = document.getElementById(input);
    inp.addEventListener('input', () => {
        unsavedChanges = true;
        session.setCurrentLearningPathProp(lpProp, inp.value)
    }, false);
}

function mountHeaderEventHandlers() {
    mountButtonHandler('settingsBtn', () => {
        getSettingsPage();
    });
    mountButtonHandler('homeBtn', () => {
        if (session.getCurrentLearningPathId() != null) {
            LearningPathToServer(session.getCurrentLearningPath(), () => {
                session.closeLearningPath();
                getHomePage();
            });
        } else {
            getHomePage();
        }
    });
}

function mountIndexEventHandlers() {
    mountButtonHandler('createLpBtn', createHandler);

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
    mountButtonHandler('saveSettingsBtn', () => {
        if (session.getCurrentLearningPathId() != null)
            getEditPage();
        else
            getHomePage();
    });
}

function mountEditorEventHandlers() {
    propertyConnection('lpNotes', 'notes');
    propertyConnection('lpEvaluationMode', 'evaluationModeID');
    propertyConnection('lpTitleInput', 'title');
}

function createHandler() {
    createLpOnServer(() => {
        fetchLearningPaths();
        getSettingsPage(mode = 'lpSettingsOnly');
    });
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

    deleteLearningPath(lpID, () => {
        if (session.getCurrentLearningPathId() == lpID)
            session.closeLearningPath()
        session.removeLearningPath(lpID)
    })
}

function editHandler() {
    let editID = this.getAttribute("id");
    editID = editID.replaceAll("edit", "");
    getEditPage(editID);
    session.openLearningPath(editID);
}

function exportHandler() {

}

function saveCurrentLp() {
    if (session.getCurrentLearningPathId() != null) {
        LearningPathToServer(session.getCurrentLearningPath(), () => {
            alertToUser('Änderungen gespeichert!', 3);
            unsavedChanges = false;
        });
    }
}

function alertToUser(message, seconds = 5, color = 'black') {

    // TODO

    console.log(message);
}

// autosave

setInterval(function() {
    if (unsavedChanges)
        saveCurrentLp()
}, 30000)