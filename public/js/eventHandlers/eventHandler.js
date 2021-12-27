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
    let uidInp = document.getElementById('userNameInput');
    if (typeof(uidInp) != 'undefined' && uidInp != null) {
        uidInp.addEventListener('input', () => {
            changeUserName(uidInp.value, () => {
                updateUserName();
            });
        }, false);
    }
}

function mountEditorEventHandlers() {
    propertyConnection('lpNotes', 'notes');
    propertyConnection('lpEvaluationMode', 'evaluationModeID');
    propertyConnection('lpTitleInput', 'title');

    mountButtonHandler('addScenarioButton', () => {
        let newScenario = session.createScenario('Neues Szenario');
        LearningPathToServer(session.getCurrentLearningPath());
        addScenarioElement(newScenario.props);
    });

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

function addScenarioElement(elementData = null) {
    const defaultData = {
        'title': 'Szenario',
    }
    let props = (elementData == null ? defaultData : elementData);


    let scenarios = document.getElementsByClassName('scenario');
    let scenarioIDs = [];
    for (let scen of scenarios)
        scenarioIDs.push(scen.id);
    let divID = uniqueName('scenario', scenarioIDs);
    let headingID = divID + 'Heading';
    let colapseID = divID + 'Colapse';
    let lpDescritionID = divID + 'lpDescrition';
    let lpLearningGoal = divID + 'lpLearningGoal';
    let lastScenario = scenarios[scenarios.length - 1];

    let newScenarioDiv = document.createElement('div');
    newScenarioDiv.innerHTML =
        `
    <div class="card scenario" id="` + divID + `" >
        <div class="card-header" id="` + headingID + `">
            <h5 class="mb-0">
                <button class="btn btn-link" data-toggle="collapse" data-target="#` + colapseID + `" aria-expanded="false" aria-controls="` + colapseID + `">
                    <img src="./img/script.png" alt="script" class="script"> ` + props.title + `
                </button>
            </h5>
        </div>

        <div id="` + colapseID + `" class="collapse" aria-labelledby="` + headingID + `" data-parent="#accordion">
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label for="` + lpDescritionID + `">Beschreibung</label>
                        <input type="text" class="form-control" id="` + lpDescritionID + `" placeholder="Beschreibung">
                    </div>
                    <div class="form-group">
                        <label for="` + lpLearningGoal + `">Lernziel</label>
                        <input type="text" class="form-control" id="` + lpLearningGoal + `" placeholder="Lernziel">
                    </div>
                </form>
                <div>
                    <label>Material</label>
                    <div class="innen-material">

                    </div>
                </div>
            </div>
        </div>
    </div>
    `

    lastScenario.parentNode.insertBefore(newScenarioDiv, lastScenario);
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