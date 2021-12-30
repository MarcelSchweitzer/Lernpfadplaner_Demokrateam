// stores currently dragged element
var draggedInteraction = null;

// is true when changes are not saved yet
var unsavedChanges = false;

$(document).ready(() => {
    updateUserName();
    fetchLearningPaths();
});

document.addEventListener('click', (event) => {
    let id = event.target.getAttribute('id');
    let classes = event.target.classList;
    let button = event.target;

    if (id == 'homeBtn') {
        if (session.learningPathOpened()) {
            saveCurrentLp();
            LearningPathToServer(session.getCurrentLearningPath(), () => {
                session.closeLearningPath();
                getHomePage();
            });
        } else {
            getHomePage();
        }
    } else if (id == 'settingsBtn') {
        getSettingsPage();
    } else if (id == 'downloadButton') {
        if (session.learningPathOpened()) {
            downloadLearningpaths([session.getCurrentLearningPath()], 'json');
        } else {
            lpids = []
            for (lp of session.getLearningPaths())
                lpids.push(lp.id);
            downloadLearningpaths(session.getLearningPaths(), 'json');
        }
    } else if (id == 'exportButton') {
        if (session.learningPathOpened()) {
            downloadLearningpaths([session.getCurrentLearningPath()], 'pdf');
        } else {
            lpids = []
            for (lp of session.getLearningPaths())
                lpids.push(lp.id);
            downloadLearningpaths(session.getLearningPaths(), 'pdf');
        }
    } else if (id == 'createLpBtn') {
        createLpOnServer(() => {
            fetchLearningPaths();
            getSettingsPage(mode = 'lpSettingsOnly');
        });
    } else if (id == 'saveSettingsBtn') {
        if (session.learningPathOpened())
            getEditPage();
        else
            getHomePage();
    } else if (id == 'addScenarioButton') {
        if (session.learningPathOpened()) {
            session.createScenario({ 'title': 'Neues Szenario' }, () => {
                LearningPathToServer(session.getCurrentLearningPath(), () => {
                    getEditPage(session.getCurrentLearningPathId(), () => {

                        // scroll to the bottom
                        window.scrollTo(0, document.body.scrollHeight);
                    });
                });
            });
        }
    }

    // handle open scenario buttons
    else if (classes.contains('openScenario')) {
        scenarioIndex = id.replaceAll('openScenario', '');
        if (button.getAttribute("aria-expanded") === 'false')
            session.openScenario(scenarioIndex);
        else
            session.closeScenario();
    }

    // handle delete scenario buttons
    else if (classes.contains('deleteScenario')) {
        scenarioIndex = id.replaceAll('deleteScenario', '');
        session.deleteScenario(scenarioIndex);
        LearningPathToServer(session.getCurrentLearningPath(), () => {
            getEditPage();
        });
    }

    // handle open learningpath buttons
    else if (classes.contains('openLp')) {
        editID = id.replaceAll('openLp', '');
        getEditPage(editID);
        session.openLearningPath(editID);
    }

    // handle delete learningpath buttons
    else if (classes.contains('deleteLp')) {
        lpID = id.replaceAll('deleteLp', '');
        deleteID = 'openLpDiv' + lpID
        editID = 'deleteLpDiv' + lpID

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
}, false);

document.addEventListener('input', (event) => {
    let id = event.target.getAttribute('id');
    let classes = event.target.classList;
    let input = event.target;

    if (id == 'lpNotes') {
        updateLpProperty('notes', input.value);
    } else if (id == 'lpEvaluationMode') {
        updateLpProperty('evaluationModeID', input.value);
    } else if (id == 'lpTitleInput') {
        updateLpProperty('title', input.value);
    } else if (id == 'userNameInput') {
        changeUserName(input.value, () => {
            updateUserName();
        });
    } else if (classes.contains('lpTitleInput')) {
        scenarioIndex = id.replaceAll('lpTitleInput', '');
        updateLpProperty('scenarios', input.value, scenarioIndex, 'title');
    } else if (classes.contains('lpDescription')) {
        scenarioIndex = id.replaceAll('lpDescription', '');
        updateLpProperty('scenarios', input.value, scenarioIndex, 'description');
    } else if (classes.contains('lpLearningGoal')) {
        scenarioIndex = id.replaceAll('lpLearningGoal', '');
        updateLpProperty('scenarios', input.value, scenarioIndex, 'learningGoal');
    } else if (classes.contains('lpResource')) {
        scenarioIndex = id.replaceAll('lpResource', '');
        updateLpProperty('scenarios', input.value, scenarioIndex, 'resource');
    } else if (classes.contains('interactivityInputCB')) {
        let checked = input.checked
        let category = input.getAttribute("class").replaceAll('interactivityInputCB ', '');
        let interactivity = id.replaceAll('CB', '')
        interactivity = interactivity.replace(/^\s+|\s+$/g, '');
        let newList = session.getProp('interactivityTypes', category) == null ? [] : session.getProp('interactivityTypes', category);
        if (checked)
            newList.push(interactivity)
        else
            newList = rmByValue(newList, interactivity)
        session.setProp('interactivityTypes', newList, category)
        unsavedChanges = true;
        saveCurrentLp();
    } else if (id == 'interactionTypeDrop') {
        if (session.learningPathOpened() && session.scenarioOpened() && session.interactionOpened()) {
            let elemId = $(input).find('option:selected').attr('id')
            let category = elemId.split('$$')[0];
            let interactionType = elemId.split('$$')[1];
            alert('changing interaction' + category + "-" + interactionType + ' @ ' + JSON.stringify(coordinates));
            session.setInteractionProp('category', category);
            session.setInteractionProp('interactionType', interactionType);
            draggedInteraction = null;
        }
    }
});

// fire on drag start 
document.addEventListener("dragstart", (event) => {
    draggedInteraction = event.target;
    if (draggedInteraction != null && draggedInteraction.classList.contains("interactivityBox")) {
        draggedInteraction.style.opacity = .5;
    }
}, false);

// allow dropping of interactivities
document.addEventListener("dragover", (event) => {
    if (draggedInteraction != null && draggedInteraction.classList.contains("interactivityBox"))
        event.preventDefault();
}, false);

// handle dropable elements beeing dropped
document.addEventListener("drop", (event) => {
    let coordinates = { 'x': event.offsetX, 'y': event.offsetY };

    droppedTo = event.target;

    if (draggedInteraction != null && draggedInteraction.classList.contains("interactivityBox")) {
        draggedInteraction.style.opacity = 1;
        event.preventDefault();
        if (droppedTo.classList.contains('workspace')) {
            let category = draggedInteraction.getAttribute('id').split('$$')[0];
            let interactionType = draggedInteraction.getAttribute('id').split('$$')[1];
            alert('adding interaction' + category + "-" + interactionType + ' @ ' + JSON.stringify(coordinates));
            session.addInteraction(coordinates, category, interactionType);
            draggedInteraction = null;
        }
    }
}, false);


// update a learning path property
function updateLpProperty(lpProp, value, index = null, indexKey = null) {
    unsavedChanges = true;
    session.setProp(lpProp, value, index, indexKey)
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

// alert a message to the user
function alertToUser(message, seconds = 5, color = 'black') {

    // TODO

    console.log(message);
}

// autosave every ten seconds
setInterval(function() {
    if (unsavedChanges)
        saveCurrentLp()
}, 10000)