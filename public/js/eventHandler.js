var unsavedChanges = false;

$(document).ready(() => {
    mountHeaderEventHandlers();
    mountIndexEventHandlers();
    updateUserName();
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

// mount a connection between a html element and a learningpath property 
function mountPropertyConnection(input, lpProp, index = null, indexKey = null) {
    let inp = document.getElementById(input);
    inp.addEventListener('input', () => {
        unsavedChanges = true;
        session.setProp(lpProp, inp.value, index, indexKey)
    }, false);
}

// mount the event handlers for the header
function mountHeaderEventHandlers() {
    mountButtonHandler('settingsBtn', () => {
        getSettingsPage();
    });
    mountButtonHandler('homeBtn', () => {
        if (session.learningPathOpened()) {
            LearningPathToServer(session.getCurrentLearningPath(), () => {
                session.closeLearningPath();
                getHomePage();
            });
        } else {
            getHomePage();
        }
    });
    mountButtonHandler('downloadButton', () => {
        if (session.learningPathOpened()) {
            downloadLearningpaths([session.getCurrentLearningPath()], 'json');
        } else {
            lpids = []
            for (lp of session.getLearningPaths())
                lpids.push(lp.id);
            downloadLearningpaths(session.getLearningPaths(), 'json');
        }
    });

    mountButtonHandler('exportButton', () => {

        // TODO 


        if (session.learningPathOpened()) {
            downloadLearningpaths([session.getCurrentLearningPath()], 'pdf');
        } else {
            lpids = []
            for (lp of session.getLearningPaths())
                lpids.push(lp.id);
            downloadLearningpaths(session.getLearningPaths(), 'pdf');
        }
    });
}

// mount eventhandlers for the dashboard page
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

// mount eventhandlers for the settings page
function mountSettingsEventHandlers() {
    mountButtonHandler('saveSettingsBtn', () => {
        if (session.learningPathOpened())
            getEditPage();
        else
            getHomePage();
    });
    let uidInp = document.getElementById('userNameInput');
    if (typeof(uidInp) != 'undefined' && uidInp != null) {
        uidInp.addEventListener('input', () => {
            changeUserName(uidInp.value, () => {
                updateUserName();
            });
        }, false);
    }

    var interactivityInputs = document.getElementsByClassName('interactivityInputCB');
    for (let i = 0; i < interactivityInputs.length; i++) {
        interactivityInputs[i].removeEventListener('input', interactivitySelectionHandler, false);
        interactivityInputs[i].addEventListener('input', interactivitySelectionHandler, false);
    }
}

// mount eventhandlers for the editor page
function mountEditorEventHandlers() {
    mountPropertyConnection('lpNotes', 'notes');
    mountPropertyConnection('lpEvaluationMode', 'evaluationModeID');
    mountPropertyConnection('lpTitleInput', 'title');

    for (let i = 0; i < session.getProp('scenarios').length; i++) {
        mountPropertyConnection('lpDescription' + i, 'scenarios', i, 'description')
        mountPropertyConnection('lpLearningGoal' + i, 'scenarios', i, 'learningGoal')
        mountPropertyConnection('lpResource' + i, 'scenarios', i, 'resource')
        mountPropertyConnection('lpTitleInput' + i, 'scenarios', i, 'title')
        mountButtonHandler('deleteScenario' + i, () => {
            session.deleteScenario(i);
            LearningPathToServer(session.getCurrentLearningPath(), () => {
                getEditPage();
            });
        });
    }

    mountButtonHandler('addScenarioButton', () => {
        session.createScenario({ 'title': 'Neues Szenario' }, () => {
            LearningPathToServer(session.getCurrentLearningPath(), () => {
                getEditPage(session.getCurrentLearningPathId(), () => {
                    window.scrollTo(0, document.body.scrollHeight);
                });
            });
        });
    });

}

// handle clicks on the create learningpath button
function createHandler() {
    createLpOnServer(() => {
        fetchLearningPaths();
        getSettingsPage(mode = 'lpSettingsOnly');
    });
}

// handle clicks on delete learningpath buttons
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

// handle clicks on existing learning paths -> editor
function editHandler() {
    let editID = this.getAttribute("id");
    editID = editID.replaceAll("edit", "");
    getEditPage(editID);
    session.openLearningPath(editID);
}

function exportHandler() {

}

// save the currently opened learning path to the server
function saveCurrentLp() {
    if (session.learningPathOpened()) {
        LearningPathToServer(session.getCurrentLearningPath(), () => {
            alertToUser('Änderungen gespeichert!', 3);
            unsavedChanges = false;
        });
    }
}

// handle a change in the selection of available interactivity types
function interactivitySelectionHandler() {
    let checked = document.getElementById(this.getAttribute("id")).checked
    let category = this.getAttribute("class").replaceAll('interactivityInputCB ', '');
    let interactivity = this.getAttribute("id").replaceAll('CB', '')
    interactivity = interactivity.replace(/^\s+|\s+$/g, '');
    let newList = session.getProp('interactivityTypes', category) == null ? [] : session.getProp('interactivityTypes', category);
    if (checked)
        newList.push(interactivity)
    else
        newList = rmByValue(newList, interactivity)
    session.setProp('interactivityTypes', newList, category)
    unsavedChanges = true;
    saveCurrentLp();
}

// alert a message to the user
function alertToUser(message, seconds = 5, color = 'black') {

    // TODO

    console.log(message);
}

// autosave
setInterval(function() {
    if (unsavedChanges)
        saveCurrentLp()
}, 10000)