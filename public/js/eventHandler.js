// stores currently dragged element
var draggedInteraction = null;

// is true when changes are not saved yet
var unsavedChanges = false;

// stores files that are to be imported
let importFiles = []

// on startup
$(document).ready(() => {
    toggleHeaderText();
    updateUserName();
    fetchLearningPaths();
});

function isValidURL(url) {
    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res==null)
        alertToUser("Bild konnte nicht geladen werden!")
    return (res != null)
  };

function createCanvas(){
    if(session.learningPathOpened() && session.ScenariosExist() && session.getCurrentLearningPath().scenarios.length > 0){
        workspaceId = 'workspace' + session.getCurrentScenarioIndex();
        document.getElementById(workspaceId).innerHTML = "";
        new p5(newCanv, workspaceId)
    }
}

function loadWorkspaceBackgrounds(){
    if(session.ScenariosExist() && session.getCurrentLearningPath().scenarios.length > 0){
        for(let i = 0; i < session.getCurrentLearningPath().scenarios.length; i++){
            canvasManager.setImage(i, session.getCurrentLearningPath().scenarios[i].resource)
        }
    }
}

function generatePDF() {
    html2canvas(document.getElementById('main')).then(function(canvas){

        var imgdata = canvas.toDataURL("image/png",1.0);
        var doc = new jsPDF('', 'pt', 'a4');
        doc.addImage(imgdata, 'JPEG', 0, 0, 595.28, 592.28/canvas.width * canvas.height );
        doc.save("Lernpfad.pdf");
    });

}

// handle button click events
document.addEventListener('click', (event) => {
    let id = event.target.getAttribute('id');
    let classes = event.target.classList;
    let button = event.target;

    if (id == 'homeBtn') {
        if (session.learningPathOpened()) {
            saveCurrentLp();
            learningPathToServer(session.getCurrentLearningPath(), () => {
                session.closeLearningPath();
                toggleSettingsButton();
                getHomePage();
            });
        } else {
            getHomePage();
        }
    }

    else if (id == 'lpSettingsBtn') {
        getSettingsPage(mode = 'lpSettingsOnly');
    }

    // open user settings page
    else if (id == 'userSettingsBtn') {
        getSettingsPage(mode = 'userSettingsOnly');
    }
    
    else if (id == 'usernameText') {
        getSettingsPage(mode = 'userSettingsOnly');
    }
    
    // download as json
    else if (id == 'downloadButton') {
        if (session.learningPathOpened()) {
            downloadlearningPaths([session.getCurrentLearningPath()], 'json');
        } else {
            lpids = []
            for (lp of session.getlearningPaths())
                lpids.push(lp.id);
            downloadlearningPaths(session.getlearningPaths(), 'json');
        }
    }
    
    // export as pdf - @wassim, this code gets to run, when the button is clicked
    // if yout have onClick as well, you cannot controll which one is ran first, js has a non-blocking event loop
    else if (id == 'exportButton') {
        var doc = new jsPDF();
        var specialElementHandlers = {
            '#main': function (element, renderer) {
                return true;
            }
        };
        var source = window.document.getElementsByTagName("body")[0];
        doc.fromHTML(source, 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        },
            function (){ doc.save('sample-file.pdf');});
        
        generatePDF();
    }

    // copy material url
    else if (id == 'copyBtnMaterialUrl'){
        copy("materialUrl");
    }
    
    // create a new learning path
    else if (id == 'createLpBtn') {
        createLpOnServer(() => {
            fetchLearningPaths();
            getSettingsPage(mode = 'lpSettingsOnly');
        });
    }
    
    // Save button in settings page
    else if (id == 'saveSettingsBtn') {
        if (session.learningPathOpened()) {
            saveCurrentLp();
            getEditPage();
        } else {
            getHomePage();
        }
    } 
    
    else if (id == 'addScenarioButton') {
        if (session.learningPathOpened()) {
            session.createScenario({ 'title': 'Neues Szenario' }, () => { //ändern
                learningPathToServer(session.getCurrentLearningPath(), () => {
                    getEditPage(session.getCurrentLearningPathId(), () => {

                        // scroll to the bottom
                        window.scrollTo(0, document.body.scrollHeight);
                    });
                });
            });
        } 
    } 

    // delete interactivity button
    else if(id == 'deleteInteractivity'){
        if(session.interactionOpened()){
            session.deleteInteraction(session.getCurrentInteractionIndex());
            session.closeInteraction();
            if(session.interactionsExist && session.getCurrentScenario().interactions.length > 0)
                session.openInteraction(session.getCurrentScenario().interactions.length - 1)
            refreshInteractivityList();
            unsavedChanges = true;
        }
    }

    // show treegrap in editor
    else if(id == "showTreegraph"){ //ändern
        openTreegraphOverlay(session.getCurrentLearningPath());
    }

    // add Category Tab
    else if(id == 'addTab'){

        // find unused name
        let interactionTypes = Object.keys(session.getCurrentLearningPath().interactionTypes);
        let newCatName = uniqueName("Neue_Kategorie", interactionTypes);
        let categoryID = newCatName.replaceAll(" ", "_");

        // create new Interactivytytype for user 
        session.setProp('interactionTypes', {}, categoryID);
        unsavedChanges = true;

        $('#addtabNav').before(`
                                    <li class="nav-item">
                                        <a class="nav-link" id="` + categoryID + `-tab" data-toggle="tab" draggable="false" href="#a` + categoryID + `" role="tab" aria-controls="tmpCat" aria-selected="false">
                                            <input type="text" onSubmit="return false;" class="form-control-sm newCat changeCatName" id="changeCatName-` + categoryID + `"  style="background-color:transparent; border:none" value="` + categoryID + `">
                                        </a>
                                    </li>
                             `);
        $('#lastTabContent').before(`
                                        <div class="tab-pane fade" id="a` + categoryID + `" role="tabpanel" aria-labelledby="` + categoryID + `-tab">
                                            <div class="items">
                                                <div id="lastCheckboxelement` + categoryID + `"></div>
                                            </div>
                                            <div class="settingsItems">
                                                <button class="btn btn-light checkAllBtn customInput selectAll" id="catCheck ` + categoryID + `"> Alle aus dieser Kategorie auswählen </button>
                                                <button class="btn btn-light checkAllBtn customInput selectNone" id="catUnCheck ` + categoryID + `"> Keine aus dieser Kategorie auswählen </button>
                                                <input type="text" onSubmit="return false;" class="form-control interInp newIntertypeName" id="newIntertypeName-` + categoryID + `" placeholder="Neuer Interaktionstyp">
                                                <button class="btn btn-light createBtn customInput createInter" id="createInter-` + categoryID + `">
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                  `);
    }

    else if(classes.contains('selectAll')) {
        let category = id.replaceAll('catCheck ', '');
        let interactionTypes = session.getCurrentLearningPath().interactionTypes[category];

        for (let [interactionTypeName, interactionChecked] of Object.entries(interactionTypes)){
            interactionTypes[interactionTypeName] = "true";
        }

        $(".interactionInputCB"+category).prop('checked', true)
        session.setProp('interactionTypes', interactionTypes, category)
        unsavedChanges = true;
        saveCurrentLp();
    }

    else if(classes.contains('selectNone')) {
        let category = id.replaceAll('catUnCheck ', '');

        let interactionTypes = session.getCurrentLearningPath().interactionTypes[category];

        for (let [interactionTypeName, interactionChecked] of Object.entries(interactionTypes)){
            interactionTypes[interactionTypeName] = "false";
        }
        $(".interactionInputCB"+category).prop('checked', false)
        session.setProp('interactionTypes', interactionTypes, category)
        unsavedChanges = true;
        saveCurrentLp();
    }

    // open Threegraph from dashboard
    else if(classes.contains('showTreegraphDashboard')){ //ändern
        let lpID = id.replaceAll('showTreegraphDashboard', '');
        forwardTreegraph(lpID);
    }

    // download lp from dashboard
    else if(classes.contains('downLoadFromDashboard')){
        let lpID = id.replaceAll('downLoadFromDashboard', '');
        session.openLearningPath(lpID);
    }

    // download lp from dashboard
    else if(classes.contains('settingsPageBtn')){
        let lpID = id.replaceAll('settingsPageBtn', '');
        session.openLearningPath(lpID);
        getSettingsPage(mode = 'lpSettingsOnly');
    }

    // handle open scenario buttons
    else if ((classes.contains('openScenario') || classes.contains('openScenarioImg'))) {
        let scenarioIndex = id.replaceAll('openScenario', '')
        scenarioIndex = scenarioIndex.replaceAll('Img', '')
        let collapseID = '#collapse' + scenarioIndex;
        let imgID = '#openScenario' + scenarioIndex + 'Img';
        let classListCollapse = document.getElementById(collapseID.replaceAll('#', '')).className.split(/\s+/);
        if(!classListCollapse.includes('collapsing')){
            if ((!session.scenarioOpened() || scenarioIndex != session.getCurrentScenarioIndex())){
                let worspaceID = '#workspace' + scenarioIndex;
                $(worspaceID).append( $("#defaultCanvas0") );
                $('.openScenarioImg').attr("src","./img/arrows-fullscreen.svg");
                $(imgID).attr("src","./img/arrows-collapse.svg");
                $(collapseID).collapse('show');
                session.openScenario(scenarioIndex);

            }else if(session.scenarioOpened() && scenarioIndex == session.getCurrentScenarioIndex()){
                $(imgID).attr("src","./img/arrows-fullscreen.svg");
                $(collapseID).collapse('hide');
                session.closeScenario();
                refreshInteractivityInputs();
            }
        }   
        refreshInteractivityList();
    }

    // create new interactionType
    else if (classes.contains('createInter')){

        // get Category
        let categoryID = id.replaceAll('createInter-', '')

        // read value from input
        let newInteractionType = document.getElementById("newIntertypeName-" + categoryID).value;

        // get current interactionTypes for this category
        let interactionTypes = {}

        // check if name is valid
        if(newInteractionType != "" && ! Object.keys(interactionTypes).includes(newInteractionType)){
            lastElemID = '#lastCheckboxelement' + categoryID
            $(lastElemID).before(`
                <input type="checkbox" class="interactionInputCB` + categoryID + `" id="` + newInteractionType + `CB" name="` + newInteractionType + `" checked>
                    <label for="` + newInteractionType + `CB">` + newInteractionType + `</label>
                    <br>
                `);

            // add new interactiontype
            interactionTypes[newInteractionType] = "true";
            
            // add to Learningpath
            session.setProp('interactionTypes', interactionTypes, categoryID);
            unsavedChanges = true;
            $(".newIntertypeName").val("");
        }
        else{
            alertToUser('Name bereits verwendet oder ungültig!', 3, 'red');
        }
    }

    // handle delete scenario buttons
    else if (classes.contains('deleteScenario')) {
        scenarioIndex = id.replaceAll('deleteScenario', '');
        session.deleteScenario(scenarioIndex);
        learningPathToServer(session.getCurrentLearningPath(), () => {
            getEditPage();
        });
    }

    // handle open learningPath buttons
    else if (classes.contains('openLp')) {
        editID = id.replaceAll('openLp', '');
        getEditPage(editID);
    }

    // handle delete learningPath buttons
    else if (classes.contains('deleteLp')) {
        let lpID = id.replaceAll('delete', '');
        let rowId = 'lpRow' + lpID

        let row = document.getElementById(rowId);
        row.remove();
        
        deletelearningPath(lpID, () => {
            if (session.getCurrentLearningPathId() == lpID)
                session.closeLearningPath()
            session.removelearningPath(lpID)
        })
        
    } 
    
    else if (classes.contains('interactivityListItem')) {
        interID = id.replaceAll('iaListItem', '');
        session.openInteraction(interID);
        refreshInteractivityInputs();
    }

}, false);

//Funktion noch nicht fertig (und wahrscheinlich nicht an der richtigen Stelle)
function highestExisTaxo(json) {
    var highestTaxo = "";
    return "4. Analysieren";
}

document.addEventListener('input', (event) => {
    let id = event.target.getAttribute('id');
    let classes = event.target.classList;
    let input = event.target;

    if (id == 'lpNotes') {
        updateLpProperty('notes', input.value);
        $("#lpNotesModal").val(input.value);
    }
    
    else if (id == 'lpNotesModal') {
        updateLpProperty('notes', input.value);
        $("#lpNotes").val(input.value);
    }
    
    else if (id == 'lpEvaluationMode') {
        updateLpProperty('evaluationModeID', input.value);
    } 
    
    else if (id == 'lpTaxonomyLevel') {//ändern
        updateLpProperty('taxonomyLevelID', input.value);
        
        console.log(input.value);
        if(input.value < highestExisTaxo(session.getCurrentLearningPath()['scenarios'])  && input.value != "")
            $("#taxToLow").modal("show");
    }
    
    else if (id == 'lpTitleInput') {
        updateLpProperty('title', input.value);
    } 
    
    else if (id == 'userNameInput') {
        changeUserName(input.value, () => {
            updateUserName();
        });
    } 
    
    else if (classes.contains('lpTitleInput')) {
        scenarioIndex = id.replaceAll('lpTitleInput', '');
        updateLpProperty('scenarios', input.value, scenarioIndex, 'title');
    } 
    
    else if (classes.contains('lpDescription')) {
        scenarioIndex = id.replaceAll('lpDescription', '');
        updateLpProperty('scenarios', input.value, scenarioIndex, 'description');
    } 
    
    else if (classes.contains('lpLearningGoal')) {
        scenarioIndex = id.replaceAll('lpLearningGoal', '');
        updateLpProperty('scenarios', input.value, scenarioIndex, 'learningGoal');
    }

    else if (classes.contains('lpNote')) {
        scenarioIndex = id.replaceAll('lpNote', '');
        updateLpProperty('scenarios', input.value, scenarioIndex, 'note');
    }

    else if (classes.contains('lpResource')) {
        scenarioIndex = id.replaceAll('lpResource', '');
        updateLpProperty('scenarios', input.value, scenarioIndex, 'resource');
        if (isValidImageURL(input.value) == true){
            canvasManager.setCurrentImage(input.value);
        } else {
            canvasManager.setCurrentVideo(input.value);
        }
    }
    
    else if (classes.contains('interactionInputCB')) {
        let checked = input.checked;
        let category = input.getAttribute("class").replaceAll('interactionInputCB', '')
        let interactivity = id.replaceAll('CB', '');
        interactivity = interactivity.replace(/^\s+|\s+$/g, '');
        
        interactionTypes = session.getCurrentLearningPath()['interactionTypes'][category];

        if (checked)
            interactionTypes[interactivity] = "true"
        else
            interactionTypes[interactivity] = "false"
        session.setProp('interactionTypes', interactionTypes, category)
        unsavedChanges = true;
        saveCurrentLp();
    } 
    
    else if (id == 'x_coord') {
        updateInteractionProperty('x_coord', input.value)
    } 
    
    else if (id == 'y_coord') {
        updateInteractionProperty('y_coord', input.value)
    } 

    else if (id == 'materialUrl') {
        updateInteractionProperty('materialUrl', input.value)
    } 
    
    else if (id == 'evaluationHeurestic') {
        updateInteractionProperty('evaluationHeurestic', input.value)
    } 
    
    else if (id == 'behaviorSettings') {
        updateInteractionProperty('behaviorSettings', input.value)
    } 

    else if (id == 'taxonomyLevelInt') {
        updateInteractionProperty('taxonomyLevelInt', input.value)

        if(input.value > session.getCurrentLearningPath()["taxonomyLevelID"] && session.getCurrentLearningPath()["taxonomyLevelID"] != "")
            $("#taxToHigh").modal("show");
    } 
    
    else if (id == 'interactionTypeDrop') {
        if (session.learningPathOpened() && session.scenarioOpened() && session.interactionOpened()) {

            let elemId = $(input).find('option:selected').attr('id')
            if(elemId != "noInteractiontype"){
                let category = elemId.split('$$')[1];
                let interactionType = elemId.split('$$')[2];
                category = category.trim();
                interactionType = interactionType.trim();
                session.setInteractionProp('category', category);
                session.setInteractionProp('interactionType', interactionType);
                refreshInteractivityList();
            }
        }
    }

    else if (id == 'importDrop'){
        for(let i = 0; i < document.querySelector('.fileDrop').files.length; i++){
            let fileReader = new FileReader();

            fileReader.addEventListener("load", () => {
                try{
                    importFiles.push(JSON.parse(fileReader.result));
                }catch( e ){
                    alertToUser('Lernpfad konnte nicht geladen werden!', 5, 'red')
                }
                if(importFiles.length == document.querySelector('.fileDrop').files.length){
                    importLP(importFiles);
                    importFiles = []
                }
            }, false);

            fileReader.readAsText(document.querySelector('.fileDrop').files[i]);
        }
    }

    // change category name
    else if (classes.contains('changeCatName')){
        let changeCategory = id.replaceAll('changeCatName-', '')
        let newCatName = input.value;

        let newInter = session.getCurrentLearningPath().interactionTypes

        // new interactionTypes
        if(newInter[changeCategory]){
            Object.defineProperty(newInter, newCatName,
                Object.getOwnPropertyDescriptor(newInter, changeCategory));
            delete newInter[changeCategory];
            session.setProp('interactionTypes', newInter)
        }

        unsavedChanges = true;
        
        $('#' + id).prop('id', 'changeCatName-'+newCatName);
        $('#createInter-' + changeCategory).prop('id', 'createInter-'+newCatName);
        $('#newIntertypeName-' + changeCategory).prop('id', 'newIntertypeName-'+newCatName);
        $('#catCheck ' + changeCategory).prop('id', 'catCheck '+newCatName);
        $('#catUnCheck ' + changeCategory).prop('id', 'catUnCheck '+newCatName);
        $('#lastCheckboxelement' + changeCategory).prop('id', 'lastCheckboxelement'+newCatName);
        $('.interactionInputCB' + changeCategory).attr('class', 'interactionInputCB' + newCatName);
    }
});

// fire on drag start 
document.addEventListener("dragstart", (event) => {
    draggedInteraction = event.target;
    if (draggedInteraction != null && draggedInteraction.classList.contains("interactivityBox") && session.scenarioOpened()) {
        draggedInteraction.style.opacity = .5;
    }
}, false);

// allow dropping of interactivities
document.addEventListener("dragover", (event) => {
    if (draggedInteraction != null && draggedInteraction.classList.contains("interactivityBox") && session.scenarioOpened())
        event.preventDefault();
}, false);

// handle dropable elements beeing dropped
document.addEventListener("drop", (event) => {
    
    let coordinates = { 'x': (event.offsetX - canvasManager.getUserOffset().x) / canvasManager.getScale() , 'y': (event.offsetY - canvasManager.getUserOffset().y) / canvasManager.getScale() };

    droppedTo = event.target;

    if (draggedInteraction != null && draggedInteraction.classList.contains("interactivityBox") && session.scenarioOpened()) {
        draggedInteraction.style.opacity = 1;
        event.preventDefault();
        if (droppedTo.classList.contains('p5Canvas')) {
            let category = draggedInteraction.getAttribute('id').split('$$')[0];
            let interactionType = draggedInteraction.getAttribute('id').split('$$')[1];
            category.trim()
            interactionType.trim()
            session.addInteraction(coordinates, "", "", category, interactionType, " ", " ");
            unsavedChanges = true;
            session.openInteraction(session.getCurrentScenario().interactions.length - 1)
            refreshInteractivityList();
        }
    }
    draggedInteraction = null;
}, false);

function refreshInteractivityList() {
    $('.interactivityList').html('');
    if (session.scenarioOpened() && session.propExists(['interactions'], session.getCurrentScenario())) {
        for (let i = 0; i < session.getCurrentScenario().interactions.length; i++) {
            inter = session.getCurrentScenario().interactions[i];
            $('.interactivityList').append(`
                                                <div class="interactivityListElem">
                                                    <button class="btn btn-light interactivityListItem" id="iaListItem` + i + `">` + inter.category + ` - ` + inter.interactionType + `</button>
                                                </div>
                                          `);
        }
        refreshInteractivityInputs();
    }
}

function refreshInteractivityInputs() {
    let speed = 40
    if (session.interactionOpened()) {
        $(".interactionSettings").css("display", "inline");
        $(".x_coord").val(session.getCurrentInteraction().x_coord);
        $(".y_coord").val(session.getCurrentInteraction().y_coord);
        $(".materialUrl").val(session.getCurrentInteraction().materialUrl);
        $(".evaluationHeurestic").val(session.getCurrentInteraction().evaluationHeurestic);
        let taxoDropID = session.getCurrentInteraction().taxonomyLevelInt.replaceAll(" ", "_");
        $(`#taxonomyLevelInt option[id='${taxoDropID}']`).prop('selected', true);
        let behaDropID = session.getCurrentInteraction().behaviorSettings;
        $(`#behaviorSettings option[id='${behaDropID}']`).prop('selected', true);
        $(`#behaviorSettings option[id='${behaDropID}']`).prop('selected', true);
        let dropID = '$$'+session.getCurrentInteraction().category+'$$'+session.getCurrentInteraction().interactionType;
        $(`#interactionTypeDrop option[id='${dropID}']`).prop('selected', true);
    }else{
        $(".interactionSettings").css("display", "none");
    }
}

function updateInteractionProperty(key, value) {
    unsavedChanges = true;
    session.setInteractionProp(key, value);
}

// update a learning path property
function updateLpProperty(key, value, index = null, indexKey = null) {
    unsavedChanges = true;
    session.setProp(key, value, index, indexKey)
}

// save the currently opened learning path to the server
function saveCurrentLp() {
    if (session.learningPathOpened()) {
        learningPathToServer(session.getCurrentLearningPath(), () => {
            unsavedChanges = false;
        });
    }
}

function importLP(learningPaths) {
    for(let i = 0; i < learningPaths.length; i++){
        for(let j = 0; j < learningPaths[i].length; j++){
            session.addlearningPath(learningPaths[i][j])
            learningPathToServer(session.getlearningPathById(learningPaths[i][j].id), ()=>{
            }, true);
        }
    }
    setTimeout(() => {
        getHomePage();
    }, 1000);
}

// alert a message to the user
function alertToUser(message, seconds = 5, color = 'black') {
    userMess = document.getElementById("userMessage")
    userMess.innerText = message;
    userMess.style.color = color;
    setTimeout(() => {
        userMess.innerText = "";
        userMess.style.color = 'black';
    }, seconds * 1000)
}

// autosave every ten seconds
setInterval(function() {
    if (unsavedChanges)
        saveCurrentLp()
}, 1000)

window.onbeforeunload = function() {
    if(unsavedChanges){
        return "Deine Änderunge werden eventuell nicht gespeichert!";
    }
};

window.onresize = (event) =>{
    canvasManager.resizeCanvas();
    toggleHeaderText();
};

// check if there is enough space to show text in header bar
function toggleHeaderText(){
    screenSize = document.body.clientWidth;
    if(screenSize < 720){
        document.getElementById("userMessage").style.visibility = "hidden";
        document.getElementById("usernameText").style.visibility = "hidden";
        $("#userMessageDiv").removeClass("col-4");
        $("#userMessageDiv").addClass("col-2");
        $("#rightHeaderButtons").removeClass("col-2");
        $("#rightHeaderButtons").addClass("col-4");
    }else{
        document.getElementById("userMessage").style.visibility = "visible";
        document.getElementById("usernameText").style.visibility = "visible";
        $("#userMessageDiv").removeClass("col-2");
        $("#userMessageDiv").addClass("col-4");
        $("#rightHeaderButtons").removeClass("col-4");
        $("#rightHeaderButtons").addClass("col-2");
    }
}

function toggleSettingsButton(){
    if(session.learningPathOpened()){
        document.getElementById("lpSettingsBtn").style.visibility = "visible";
    }else{
        document.getElementById("lpSettingsBtn").style.visibility = "hidden";
    }
}

function forwardTreegraph(lpID){
    document.getElementById("treegraphNavDashboard").style.display = "block";
    createTreegraph(session.getlearningPathById(lpID));
}

function closeForwardTreegraph(){
    document.getElementById("treegraphNavDashboard").style.display = "none";
}

function openTreegraphOverlay(lpID){
    document.getElementById("treegraphNav").style.display = "block";
    createTreegraph(lpID);
}

function closeTreegraphOverlay(){
    document.getElementById("treegraphNav").style.display = "none";
}

function createTreegraph(lpData){

    var nodeList = [];
    var scenarioList = [];

    for(var i=0; i < lpData.scenarios.length; i++){
        if ("interactions" in lpData.scenarios[i]){
            var interactList=[];
            for(var j=0; j < lpData.scenarios[i].interactions.length; j++){
                const interactDict = {
                    "name": lpData.scenarios[i].interactions[j].interactionType
                }
                interactList.push(interactDict);
            }
            const scenarioDict = {
                "name": lpData.scenarios[i].title,
                "children": interactList
            }
            scenarioList.push(scenarioDict);
        } else {
            const scenarioDict = {
                "name": lpData.scenarios[i].title
            }
            scenarioList.push(scenarioDict);
        }
    }

    var root = {"name": lpData.title, "parent": "null", "children": scenarioList}

    nodeList.push(root);

    let parent = document.getElementById("treegraph");
    parent.innerHTML = "";

    let div = document.createElement("div");

    parent.appendChild(div);

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = 960 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = nodeList[0];
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);

    d3.select(self.frameElement).style("height", "500px");

    function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", click);

        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeEnter.append("text")
            .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
            .attr("r", 10)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

// Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}

// searchbox
function searchBox() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchIn");
    filter = input.value.toUpperCase();
    table = document.getElementById("infoTab");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }

function copy(elementID) {
    let copyText = document.getElementById(elementID).value;
    navigator.clipboard.writeText(copyText)
}

$('#categoryTabs a').on('click', function(e) {
    e.preventDefault()
    $(this).tab('show')
});

function isValidImageURL(str){
    if ( typeof str !== 'string' ) return false;
    return !!str.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi);
}
