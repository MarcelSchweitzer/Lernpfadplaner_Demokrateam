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
    if (!getCookie('allowCookies')){
        $('#CookieBanner').modal({
            backdrop: 'static',
            keyboard: false
        }).modal('show');
    }
});

function isValidImageURL(str){
    if ( typeof str !== 'string' ) return false;
    return !!str.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi);
}

function highestExisTaxo(scenarios) {
    var highestTaxo = "";
    for(var i = 0; i < scenarios.length; i++){
        for(var j = 0; j < scenarios[i].interactions.length; j++){
            highestTaxo = (scenarios[i].interactions[j].taxonomyLevelInt > highestTaxo ? scenarios[i].interactions[j].taxonomyLevelInt : highestTaxo);
        }
    }
    return highestTaxo;

}

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


// TODO works for exactly one scenario - older ones get overwritten
function generatePDF(scenarios, title, index = null) {
    const offset = 20; 
    const dinA4X = 592.28;
    const dinA4Y = 837.54;
    const fontSize = 12;
    const indent = 35;
    const space = 15;
    var offsetY = 0;
    var page = 1;

    var doc = new jsPDF('p', 'pt', 'a4');
    for(let i = 0; i < scenarios.length; i++){
        var wrappedPage = false
        if (i > 0) {
            doc.addPage();
            page++;
            offsetY = 0;
        }

        // alway begin new page for new lp
        doc.setPage(page);
        let ind = (index == null) ? i : index;
        canvasManager.scaleToZero(i);
        setTimeout(()=>{
        
            html2canvas(document.getElementById('workspace' + ind)).then(function(canvas){

                var imgdata = canvas.toDataURL();
                doc.addImage(imgdata, 'png', 0, 0, dinA4X, dinA4X/canvas.width * canvas.height);

                doc.setFontSize(fontSize);
        
                function printDict(dict, indentN = 1){
                    offsetY++;
                    for (const [key, value] of Object.entries(dict)) {
                        if(value){
                            
                            // cap first letter of key
                            let cappedKey = key.charAt(0).toUpperCase() + key.slice(1);

                            // get offset for first page (canvas)
                            initOffset = (!wrappedPage) ? dinA4X/canvas.width * canvas.height : 0;

                            let yPos = fontSize * offsetY + space * offsetY  +  offset + initOffset
                            if(yPos > dinA4Y){
                                doc.addPage();
                                wrappedPage = true;
                                page++;
                                offsetY = 1;
                                doc.setPage(page);
                                yPos = fontSize * offsetY + space * offsetY  +  offset
                            }

                            // check for nested data
                            if(typeof value == 'string' || typeof value == 'number'){

                                // handle numbers
                                text = (typeof value == 'string') ? value : "" + value

                                if(text != "" && text != " "){
                                    doc.text(indent * indentN, yPos, cappedKey + ": " + text);
                                    offsetY++;
                                }
                            }else if(typeof value == 'object'){
                                doc.text(indent * indentN, yPos, cappedKey + ":");
                                printDict(value, indentN + 1);
                                offsetY++;
                            }
                        }
                    }
                }

                printDict(scenarios[i]);

                if(i == scenarios.length - 1 ){
                    doc.save(title+".pdf");
                    }
                });
        }, 50);
    }
}

function deleteOpenInteraction() {
    if(session.interactionOpened()){
        session.deleteInteraction(session.getCurrentInteractionIndex());
        session.closeInteraction();
        if(session.interactionsExist && session.getCurrentScenario().interactions.length > 0)
            session.openInteraction(session.getCurrentScenario().interactions.length - 1)
        refreshInteractivityList();
        unsavedChanges = true;
    }
}

function deleteIntType(category, interactionType) {
    var createdTypes = session.getCurrentLearningPath().lpSettings.createdTypes;

    delete createdTypes[category][interactionType];

    if(Object.keys(createdTypes[category]).length === 0 && Object.keys(session.getCurrentLearningPath().lpSettings.activeDefaultTypes).includes(category))
        delete createdTypes[category];
    
    $("#div" + category + interactionType).remove();

    session.setProp("lpSettings", createdTypes, "createdTypes");
    unsavedChanges = false;
    saveCurrentLp();
}

function deleteCatType(category) {
    var createdTypes = session.getCurrentLearningPath().lpSettings.createdTypes;

    delete createdTypes[category];

    let active = ($("#" + category + "-tab").hasClass("active"))

    $("#" + category + "Nav").remove();
    $("#a" + category).remove();

    if(active){
        $("#Global-tab").addClass("active");
        $("#aGlobal").removeClass("fade").addClass("fadeshow").addClass("active");
        $("#Globalact").addClass("active");
    }

    session.setProp("lpSettings", createdTypes, "createdTypes");
    unsavedChanges = false;
    saveCurrentLp();
    
}

function changeSettingsComplete(newSettings){
    session.setProp("lpSettings", newSettings),
    getSettingsPage(mode = 'lpSettingsOnly');
}

function resetSettings(){
    var defaultCategories = {};
    for(let categoryNames of Object.keys(session.getCurrentLearningPath().lpSettings.activeDefaultTypes)){
        defaultCategories[categoryNames] = [];}

    var defaultSettings = {}
    defaultSettings["activeDefaultTypes"] = defaultCategories;
    defaultSettings["createdTypes"] = {};
    defaultSettings["ignoreWarnings"] = false;
    
    changeSettingsComplete(defaultSettings);
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

    else if(id == 'resetZoomBtn'){
        canvasManager.scaleToZero(session.getCurrentScenarioIndex());
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

    else if (id == 'exportButton') {       
        generatePDF(session.getCurrentLearningPath().scenarios, session.getCurrentLearningPath().title);
    }

    else if(classes.contains('printScenario')) {
        let scenarioIndex = id.replaceAll('printScenario', '');
        generatePDF([session.getCurrentLearningPath().scenarios[scenarioIndex]], session.getCurrentLearningPath().scenarios[scenarioIndex].title, scenarioIndex);
    }

    else if( id == 'fullScreenBtn' ){
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            if (document.exitFullscreen) {
            document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
            }
        } else {
            element = $( canvasManager.getWorkSpaceId() ).get(0);
            if (element.requestFullscreen) {
            element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
            }
        }
        setTimeout(() => {
            canvasManager.scaleToZero( session.getCurrentScenarioIndex() );
        }, 200);

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
            session.createScenario({
                        'title': 'Neues Szenario',
                        'resource': "img/example.jpg",
                        "description": "",
                        "learningGoal": "",
                        "note": "",
                    }, () => { //ändern
                learningPathToServer(session.getCurrentLearningPath(), () => {
                    getEditPage(session.getCurrentLearningPathId(), () => {

                        // scroll to the bottom
                        document.getElementById("scenarios").scrollTo(0, document.getElementById("scenarios").scrollHeight);
                    });
                });
            });
        } 
    } 

    // delete interactivity button in modal
    else if(id == 'deleteInteractivity'){
        deleteOpenInteraction();
    }

    // delete interactivity button in activity-Settings
    else if(id == 'delOpenInt'){
        if(session.getCurrentLearningPath().lpSettings.ignoreWarnings)
            deleteOpenInteraction();
        else
            $("#deleteInteract").modal("show");
    }

    // show treegrap in editor
    else if(id == "showTreegraph"){
        openTreegraphOverlay(session.getCurrentLearningPath());
    }

    else if(id == "setIgnoWarnings"){
        session.getCurrentLearningPath().lpSettings.ignoreWarnings = true;
        unsavedChanges = true;
        saveCurrentLp();
    }

    else if(id == "reserSettingsBtn"){
        if(session.getCurrentLearningPath().lpSettings.ignoreWarnings)
            resetSettings();
        else
            $("#modalResetSettings").modal("show");
    }

    else if(id == "resetSettings"){
        resetSettings();
    }

    else if(id == "uncheckIgnoWarnings"){
        $("#ignoreWarnings").prop("checked", false);
    }

    else if(id == "addNewCat"){
        $("#nameNewCat").modal("show");
    }

    // add Category Tab
    else if(id == "addTab"){

        // get name from input field in modal nameNewCat
        let allCatNames = Object.keys(session.getCurrentLearningPath().lpSettings.createdTypes).concat(Object.keys(session.getCurrentLearningPath().lpSettings.activeDefaultTypes)).concat("");
        let newCatName = uniqueName(document.getElementById("catNameGiven").value, allCatNames);

        document.getElementById("catNameGiven").value = "";
        let categoryID = newCatName.replaceAll(" ", "_");

        // create new category for user 
        session.setProp("lpSettings", {}, "createdTypes" , categoryID);
        unsavedChanges = true;

        $('#addTabNav').before(`
                                    <li class="nav-item" id= "` + categoryID + `Nav">
                                        <a class="nav-link" draggable="false" id="` + categoryID + `-tab" data-toggle="tab" href="#a` + categoryID + `" role="tab" aria-controls="tmpCat" aria-selected="false">
                                            ` + newCatName + `
                                        </a>
                                        <div class="catNavWrapper">
                                            <button class="button btn-light catContent intChangeBtn catDelBtn" id="catDel` + categoryID + `">
                                                <img class="button delIntIcon catDelBtn" id="catDel` + categoryID + `" src="img/trash.svg">
                                            </button>
                                            <button class="button btn-light catContent intChangeBtn catRenameBtn" id="catRename` + categoryID + `">
                                                <img class="button nameIntIcon catRenameBtn" id="catRename` + categoryID + `" src="img/edit.png">
                                            </button>
                                        </div>
                                    </li>
                             `);
        $('#lastTabContent').before(`
                                        <div class="tab-pane fade" id="a` + categoryID + `" role="tabpanel" aria-labelledby="` + categoryID + `-tab">
                                            <div class="tabWrap">
                                                <div class="itemWrap">
                                                    <div class="items ` + categoryID + `" id="` + categoryID + `act">
                                                        <div id="lastCheckboxelement` + categoryID + `"></div>
                                                    </div>
                                                    <div class="newTypeWrap">
                                                        <input type="text" onSubmit="return false;" class="form-control newIntertypeName flexInput" id="newIntertypeName-` + categoryID + `" placeholder="Interaktionstyp">
                                                        <button class="btn-light createBtn createNewInt flexInput" id="createNewInt-` + categoryID + `">
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="settingsItems">
                                                <button class="btn btn-light checkAllBtn customInput selectAllCreatedCat" id="catCheck ` + categoryID + `"> Alle aus dieser Kategorie auswählen </button>
                                                <button class="btn btn-light checkAllBtn customInput selectNoneCreatedCat" id="catUnCheck ` + categoryID + `"> Keine aus dieser Kategorie auswählen </button>
                                            </div>
                                        </div>
                                `);

        
        let actCatTab = ($(".nav-link.active").attr("id")).slice(0, -4);

        console.log(actCatTab);

        $("#" + actCatTab + "-tab").removeClass("active");
        $("#a" + actCatTab).addClass("fade").removeClass("fadeshow").removeClass("active");
        $("#" + actCatTab + "act").removeClass("active");

        $("#" + categoryID + "-tab").addClass("active");
        $("#a" + categoryID).removeClass("fade").addClass("fadeshow").addClass("active");
        $("#" + categoryID + "act").addClass("active");

        saveCurrentLp();
    }

    else if(id == "catNameDismiss"){
        document.getElementById("catNameGiven").value = "";
    }

    else if(classes.contains('selectAllDefaultCat')) {
        let category = id.replaceAll('catCheck ', '');

        var defaultInterTypes = [];
        var allElemOfCategory = document.getElementsByClassName("defaultInputCB" + category);
        for(let interactionID of allElemOfCategory){
            defaultInterTypes.push(interactionID.name);
        }

        if(session.getCurrentLearningPath().lpSettings.createdTypes[category]){
            var interactionTypes = session.getCurrentLearningPath().lpSettings.createdTypes[category];
            for (let interactionTypeName of Object.keys(interactionTypes)){
                interactionTypes[interactionTypeName] = true;
            }
            session.setProp('lpSettings', interactionTypes, "createdTypes", category);
            $(".createdInputCB"+category).prop("checked", true);
        }
        
        $(".defaultInputCB"+category).prop("checked", true);
        session.setProp('lpSettings', defaultInterTypes, "activeDefaultTypes", category)
        unsavedChanges = true;
        saveCurrentLp();
    }

    else if(classes.contains('selectAllCreatedCat')) {
        let category = id.replaceAll('catCheck ', '');

        var interactionTypes = session.getCurrentLearningPath().lpSettings.createdTypes[category];

        for (let interactionTypeName of Object.keys(interactionTypes)){
            interactionTypes[interactionTypeName] = true;
        }

        $(".createdInputCB"+category).prop("checked", true);
        session.setProp('lpSettings', interactionTypes, "createdTypes", category);
        unsavedChanges = true;
        saveCurrentLp();
    }

    else if(classes.contains('selectNoneDefaultCat')) {
        let category = id.replaceAll('catUnCheck ', '');

        var defaultInterTypes = [];

        if(session.getCurrentLearningPath().lpSettings.createdTypes[category]){
            var interactionTypes = session.getCurrentLearningPath().lpSettings.createdTypes[category];
            for (let interactionTypeName of Object.keys(interactionTypes)){
                interactionTypes[interactionTypeName] = false;
            }
            session.setProp('lpSettings', interactionTypes, "createdTypes", category);
            $(".createdInputCB"+category).prop("checked", false);
        }

        $(".defaultInputCB"+category).prop('checked', false);
        session.setProp('lpSettings', defaultInterTypes, "activeDefaultTypes", category)
        unsavedChanges = true;
        saveCurrentLp();
    }

    else if(classes.contains('selectNoneCreatedCat')) {
        let category = id.replaceAll('catUnCheck ', '');

        var interactionTypes = session.getCurrentLearningPath().lpSettings.createdTypes[category];

        for (let interactionTypeName of Object.keys(interactionTypes)){
            interactionTypes[interactionTypeName] = false;
        }

        $(".createdInputCB"+category).prop("checked", false);
        session.setProp('lpSettings', interactionTypes, "createdTypes", category);
        unsavedChanges = true;
        saveCurrentLp();
    }

    // open Threegraph from dashboard
    else if(classes.contains('showTreegraphDashboard')){
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
    else if (classes.contains('createNewInt')){

        // get Category
        let category = id.replaceAll('createNewInt-', '');

        // read value from input
        let newInteractionType = document.getElementById("newIntertypeName-" + category).value;

        // get current interactionTypes for this category
        createdTypes = session.getCurrentLearningPath().lpSettings.createdTypes;

        if(!createdTypes[category] && newInteractionType != "")
            createdTypes[category] = {};

        var defaultInterTypes = [];
        var allElemOfCategory = document.getElementsByClassName("defaultInputCB" + category);
        for(let interactionID of allElemOfCategory){
            defaultInterTypes.push(interactionID.name);
        }
        // check if name is valid
        if(newInteractionType != "" && ! Object.keys(createdTypes[category]).includes(newInteractionType) && ! defaultInterTypes.includes(newInteractionType)){

            // add new interactiontype
            createdTypes[category][newInteractionType] = true;
            lastElemID = '#lastCheckboxelement' + category;
            $(lastElemID).before(`
                <div id="div` + category + `` + newInteractionType + `">
                    <input class="createdInputCB` + category + `" type="checkbox" checked id="` + newInteractionType + `CB" name="` + newInteractionType + `">
                    <label for="` + newInteractionType + `CB">` + newInteractionType + `</label>
                    <button class="button btn-light intChangeBtn intDelBtn ` + category + `" id="delCreInt` + newInteractionType + `">
                        <img class="button delIntIcon intDelBtn ` + category + `" id="delCreInt` + newInteractionType + `" src="img/trash.svg">
                    </button>
                    <button class="button btn-light intChangeBtn intRenameBtn ` + category + `" id="renameCreInt` + newInteractionType + `">
                        <img class="button nameIntIcon intRenameBtn ` + category + `" id="renameCreInt` + newInteractionType + `" src="img/edit.png">
                    </button>
                    <br>
                </div>
                `)

            session.setProp('lpSettings', createdTypes, "createdTypes");
            unsavedChanges = true;

            saveCurrentLp();
        } else {
            alertToUser('Name bereits verwendet oder ungültig!', 3, 'red');
        }

        $(".newIntertypeName").val("");
    }

    else if (classes.contains('intDelBtn')) {
        if(classes[2] === 'intDelBtn')
            var category = classes[3];
        else
            var category = classes[4];
        
        let interactionType = id.replaceAll('delCreInt', '');

        if(session.getCurrentLearningPath().lpSettings.ignoreWarnings)
            deleteIntType(category, interactionType);
        else {
            $(".intDelModalBtn").attr("id", interactionType);
            $(".intDelModalBtn").attr("name", category);
            $("#delIntModal").modal("show");
        }
    }

    else if (classes.contains('intDelModalBtn')) {
        deleteIntType(button.getAttribute("name"), id);
        
        $(".intDelModalBtn").attr("id", "interactionTypeNameBtn");
        $(".intDelModalBtn").attr("name", "categoryNameBtn");
    }

    else if (classes.contains('intDelDismiss')) {
        $(".intDelModalBtn").attr("id", "interactionTypeNameBtn");
        $(".intDelModalBtn").attr("name", "categoryNameBtn");
    }

    else if (classes.contains('intRenameBtn')) {   
        if(classes[2] === 'intRenameBtn')
            var category = classes[3];
        else
            var category = classes[4];
        
        let interactionType = id.replaceAll('renameCreInt', '');

        $(".intRenameModalBtn").attr("id", interactionType);
        $(".intRenameModalBtn").attr("name", category);
        $("#renameIntModal").modal("show");
    }

    else if (classes.contains('intRenameModalBtn')) {
        let category = button.getAttribute("name");
        let interactionType = id;
        
        var catInCreate = session.getCurrentLearningPath().lpSettings.createdTypes[category];

        let newIntName = document.getElementById("newIntNameGiven").value

        var defaultInterTypes = [];
        var allElemOfCategory = document.getElementsByClassName("defaultInputCB" + category);
        for(let interactionID of allElemOfCategory){
            defaultInterTypes.push(interactionID.name);
        }
        
        if(newIntName != "" && ! Object.keys(catInCreate).includes(newIntName) && ! defaultInterTypes.includes(newIntName)){
            catInCreate[newIntName]
            if(catInCreate[interactionType])
                catInCreate[newIntName] = true;
            else
                catInCreate[newIntName] = false;

            delete catInCreate[interactionType];

            session.setProp("lpSettings",catInCreate,"createdTypes",category);

            let checked = (catInCreate[newIntName] ? "checked" : "");

            $("#div" + category + interactionType).remove();
            lastElemID = '#lastCheckboxelement' + category;
            $(lastElemID).before(`
                <div id="div` + category + `` + newIntName + `">
                    <input class="createdInputCB` + category + `" type="checkbox" ` + checked + ` id="` + newIntName + `CB" name="` + newIntName + `">
                    <label for="` + newIntName + `CB">` + newIntName + `</label>
                    <button class="button btn-light intChangeBtn intDelBtn ` + category + `" id="delCreInt` + newIntName + `">
                        <img class="button delIntIcon intDelBtn ` + category + `" id="delCreInt` + newIntName + `" src="img/trash.svg">
                    </button>
                    <button class="button btn-light intChangeBtn intRenameBtn ` + category + `" id="renameCreInt` + newIntName + `">
                        <img class="button nameIntIcon intRenameBtn ` + category + `" id="renameCreInt` + newIntName + `" src="img/edit.png">
                    </button>
                    <br>
                </div>
                `)

            unsavedChanges = true;
            saveCurrentLp();
        } else {
            alertToUser('Name bereits verwendet oder ungültig!', 3, 'red');
        }

        document.getElementById("newIntNameGiven").value = "";

        $(".intRenameModalBtn").attr("id", "interactionTypeNameBtn");
        $(".intRenameModalBtn").attr("name", "categoryNameBtn");
    }

    else if (classes.contains('intRenameDismiss')){
        document.getElementById("newIntNameGiven").value = "";

        $(".intRenameModalBtn").attr("id", "interactionTypeNameBtn");
        $(".intRenameModalBtn").attr("name", "categoryNameBtn");
    }

    else if (classes.contains('catDelBtn')) {
        let category = id.replaceAll('catDel', '');

        if(session.getCurrentLearningPath().lpSettings.ignoreWarnings)
            deleteCatType(category);
        else {
            $(".catDelModalBtn").attr("id", category);
            $("#delCatModal").modal("show");
        }
    }

    else if (classes.contains('catDelModalBtn')) {
        deleteCatType(id);
        
        $(".catDelModalBtn").attr("id", "categoryNameBtn");
    }

    else if (classes.contains('catDelDismiss')) {
        $(".catDelModalBtn").attr("id", "categoryNameBtn");
    }

    else if (classes.contains('catRenameBtn')) {
        let category = id.replaceAll('catRename', '');

        $(".catRenameModalBtn").attr("id", category);
        $("#renameCatModal").modal("show");
    }

    else if (classes.contains('catRenameModalBtn')) {
        let category = id;

        let newCategory = document.getElementById("newCatNameGiven").value;
        let newCatID = newCategory.replaceAll(" ", "_");

        createdTypes = session.getCurrentLearningPath().lpSettings.createdTypes;

        if(newCatID != "" && ! Object.keys(createdTypes).includes(newCatID) && ! Object.keys(session.getCurrentLearningPath().lpSettings.activeDefaultTypes).includes(newCatID)){
            createdTypes[newCatID] = createdTypes[category];

            delete createdTypes[category];

            session.setProp("lpSettings",createdTypes,"createdTypes");

            //wenn id: category-tab die klasse hat
            let active = ($("#" + category + "-tab").hasClass("active"))

            $("#" + category + "Nav").remove();
            $("#a" + category).remove();

            $('#addTabNav').before(`
                                        <li class="nav-item" id= "` + newCatID + `Nav">
                                            <a class="nav-link" draggable="false" id="` + newCatID + `-tab" data-toggle="tab" href="#a` + newCatID + `" role="tab" aria-controls="tmpCat" aria-selected="false">
                                                ` + newCategory + `
                                            </a>
                                            <div class="catNavWrapper">
                                                <button class="button btn-light catContent intChangeBtn catDelBtn" id="catDel` + newCatID + `">
                                                    <img class="button delIntIcon catDelBtn" id="catDel` + newCatID + `" src="img/trash.svg">
                                                </button>
                                                <button class="button btn-light catContent intChangeBtn catRenameBtn" id="catRename` + newCatID + `">
                                                    <img class="button nameIntIcon catRenameBtn" id="catRename` + newCatID + `" src="img/edit.png">
                                                </button>
                                            </div>
                                        </li>
                                `);
            $('#lastTabContent').before(`
                                            <div class="tab-pane fade" id="a` + newCatID + `" role="tabpanel" aria-labelledby="` + newCatID + `-tab">
                                                <div class="tabWrap">
                                                    <div class="itemWrap">
                                                        <div class="items ` + newCatID + `" id="` + newCatID + `act">
                                                            <div id="lastCheckboxelement` + newCatID + `"></div>
                                                        </div>
                                                        <div class="newTypeWrap">
                                                            <input type="text" onSubmit="return false;" class="form-control newIntertypeName flexInput" id="newIntertypeName-` + newCatID + `" placeholder="Interaktionstyp">
                                                            <button class="btn-light createBtn createNewInt flexInput" id="createNewInt-` + newCatID + `">
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="settingsItems">
                                                    <button class="btn btn-light checkAllBtn customInput selectAllCreatedCat" id="catCheck ` + newCatID + `"> Alle aus dieser Kategorie auswählen </button>
                                                    <button class="btn btn-light checkAllBtn customInput selectNoneCreatedCat" id="catUnCheck ` + newCatID + `"> Keine aus dieser Kategorie auswählen </button>
                                                </div>
                                            </div>
                                    `);

            if(Object.keys(createdTypes[newCatID]).length > 0){
                for(let [interactionType, active] of Object.entries(createdTypes[newCatID])){
                    var checked = (active ? "checked" : "")
                    $('#lastCheckboxelement' + newCatID).before(`
                                                    <div id="div` + newCatID + `` + interactionType + `">
                                                            <input class="createdInputCB` + newCatID + `" type="checkbox" ` + checked + ` id="` + interactionType + `CB" name="` + interactionType + `">
                                                            <label for="` + interactionType + `CB">` + interactionType + `</label>
                                                            <button class="button btn-light intChangeBtn intDelBtn ` + newCatID + `" id="delCreInt` + interactionType + `">
                                                                <img class="button delIntIcon intDelBtn ` + newCatID + `" id="delCreInt` + interactionType + `" src="img/trash.svg">
                                                            </button>
                                                            <button class="button btn-light intChangeBtn intRenameBtn ` + newCatID + `"
                                                                id="renameCreInt` + interactionType + `">
                                                                <img class="button nameIntIcon intRenameBtn ` + newCatID + ` id="renameCreInt` + interactionType + `" src="img/edit.png">
                                                            </button>
                                                            <br>
                                                        </div>
                    `);
                }
            }

            if(active){
                $("#" + newCatID + "-tab").addClass("active");
                $("#a" + newCatID).removeClass("fade").addClass("fadeshow").addClass("active");
                $("#" + newCatID + "act").addClass("active");
            }

            unsavedChanges = true;
            saveCurrentLp();
        } else {
            alertToUser('Name bereits verwendet oder ungültig!', 3, 'red');
        }

        document.getElementById("newCatNameGiven").value = "";

        $(".catRenameModalBtn").attr("id", "categoryNameBtn");
    }
    
    else if (classes.contains('catRenameDismiss')){
        document.getElementById("newCatNameGiven").value = "";

        $(".catRenameModalBtn").attr("id", "categoryNameBtn");
    }


    // handle delete scenario buttons
    else if (classes.contains('deleteScenario')) {
        scenarioIndex = id.replaceAll('deleteScenario', '');
        session.deleteScenario(scenarioIndex);
        learningPathToServer(session.getCurrentLearningPath(), () => {
            getEditPage();
        });
    }

    else if (classes.contains('delScen')) {
        scenarioIndex = id.replaceAll('delScen', '');

        if(session.getCurrentLearningPath().lpSettings.ignoreWarnings){
            session.deleteScenario(scenarioIndex);
            learningPathToServer(session.getCurrentLearningPath(), () => {
                getEditPage();
            });
        }
        else {
            $("#delete"+scenarioIndex).modal("show");
        }
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
    
    else if (id == 'lpTaxonomyLevel') {
        updateLpProperty('taxonomyLevel', input.value);
        
        if(!session.getCurrentLearningPath().lpSettings.ignoreWarnings){
            if(input.value < highestExisTaxo(session.getCurrentLearningPath().scenarios)  && input.value != "")
                $("#taxToLow").modal("show");
        }
    }
    
    else if (id == 'lpTitleInput') {
        updateLpProperty('title', input.value);
    } 
    
    else if (id == 'userNameInput') {
        changeUserName(input.value, () => {
            updateUserName();
        });
    } 
    
    else if (id == "ignoreWarnings") {
        if (input.checked)
            $("#modalIgnoWar").modal("show");
        else {
            session.getCurrentLearningPath().lpSettings.ignoreWarnings = false;
            unsavedChanges = true;
            saveCurrentLp();
        }

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
    
    else if (classes.value.startsWith("defaultInputCB")) {
        let checked = input.checked;
        let category = input.getAttribute("class").replaceAll('defaultInputCB', '')
        let interactionType = id.replaceAll('CB', '');
        
        activeDefaultTypes = session.getCurrentLearningPath().lpSettings.activeDefaultTypes;
        
        if (checked) {
            if(!activeDefaultTypes[category].includes(interactionType))
                activeDefaultTypes[category].push(interactionType);
        } else {
            for(var i = 0; i < activeDefaultTypes[category].length; i++){
                if (activeDefaultTypes[category][i] === interactionType)
                    activeDefaultTypes[category].splice(i,1)
            }
        }
            
        session.setProp('lpSettings', activeDefaultTypes, "activeDefaultTypes");
        
        unsavedChanges = true;
        saveCurrentLp();
    } 
    
    else if (classes.value.startsWith("createdInputCB")) {
        let checked = input.checked;
        let category = input.getAttribute("class").replaceAll('createdInputCB', '')
        let interactionType = id.replaceAll('CB', '');

        createdIntInCat = session.getCurrentLearningPath().lpSettings.createdTypes[category];
        
        if (checked)
            createdIntInCat[interactionType] = true;
        else
            createdIntInCat[interactionType] = false;
            
        session.setProp('lpSettings', createdIntInCat, "createdTypes", category);

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

        if(!session.getCurrentLearningPath().lpSettings.ignoreWarnings){
            if(input.value > session.getCurrentLearningPath().taxonomyLevel && session.getCurrentLearningPath().taxonomyLevel != "")
                $("#taxToHigh").modal("show");
        }
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
    else if (classes.contains('changeCatName')){ //ändern
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
        $('#createNewInt-' + changeCategory).prop('id', 'createNewInt-'+newCatName);
        $('#newIntertypeName-' + changeCategory).prop('id', 'newIntertypeName-'+newCatName);
        $('#catCheck ' + changeCategory).prop('id', 'catCheck '+newCatName);
        $('#catUnCheck ' + changeCategory).prop('id', 'catUnCheck '+newCatName);
        $('#lastCheckboxelement' + changeCategory).prop('id', 'lastCheckboxelement'+newCatName);
        $('.defaultInputCB' + changeCategory).attr('class', 'defaultInputCB' + newCatName);
    }
});

// fire on drag start 
document.addEventListener("dragstart", (event) => {
    if(event.target.classList.contains("interactivityBox")){
        draggedInteraction = event.target;
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

$('#categoryTabs a').on('click', function(e) {
    e.preventDefault()
    $(this).tab('show')
});

window.onbeforeunload = function() {
    if(unsavedChanges){
        return "Deine Änderunge werden eventuell nicht gespeichert!";
    }
};

document.addEventListener("fullscreenchange", function( event ) {
    if (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement )
        $(".canvasBtn").css("display", "block");
    else
        $(".canvasBtn").css("display", "none");
});

window.onresize = (event) =>{

    canvasManager.resizeCanvas();
    toggleHeaderText();
};

// autosave every ten seconds
setInterval(function() {
    if (unsavedChanges)
        saveCurrentLp()
}, 1000)
