// request edit patch from server
function getEditPage(lpid = session.getCurrentLearningPathId(), cb = noop) {
    $.get('/editor', { 'lpid': lpid }).done((data, status) => {
        replaceBody(data);
        fetchLearningPaths(() => {

            // the last scenario is opened by default
            session.openScenario(session.getProp('scenarios').length - 1);
            return cb()
        });
    });
}

function getHomePage() {

    // request index patch from server
    $.get('/home').done((data, status) => {
        replaceBody(data);
    });

    fetchLearningPaths();
}

// request the settings page from the server
function getSettingsPage(mode = null) {
    if (mode == null && session.getCurrentLearningPathId() == null)
        mode = 'userSettingsOnly';
    else if (mode == null)
        mode = 'allSettings';
    $.get('/settings', { 'lpid': session.getCurrentLearningPathId(), 'mode': mode }).done((data, status) => {
        replaceBody(data);
    });
}

// push any learningpath to the server
function LearningPathToServer(learningPath, cb = noop) {
    if (JSON.stringify(learningPath) != 'undefined') {
        $.post('/updateLp', { 'lpid': learningPath.id, 'title': learningPath.title, 'learningPath': JSON.stringify(learningPath) }).done((data, status) => {
            if (status === 'success')
                return cb()
            else
                alertToUser("Lernpfad konnte nicht gespeichert werden!", 10, 'red');
        });
    }
}

// create a new learningpath on the server and add it to the list of learningpaths
function createLpOnServer(cb = noop) {
    $.get('/create').done((data, status) => {
        session.addLearningPath(data.content);
        session.openLearningPath(data['learningpathID'])
        return cb()
    });
}


// delete a learningpath from the server
function deleteLearningPath(lpid, cb = noop) {
    $.post('/deletelp', { 'lpid': lpid }).done((data, status) => {
        if (status === 'success')
            return cb()
        else
            alertToUser('Lernpfad konnte nicht gelöscht werden!');
    });
}

// fetch all learningpaths that we have access to
function fetchLearningPaths(cb = noop) {
    // fetch users learning paths from server
    $.get('/learningPaths').done((data) => {
        lps = JSON.parse(data)
        session.updateLearningPaths(lps);
        return cb()
    });
}

// serve a list of learningpaths as a download for the user
function downloadLearningpaths(lps, format) {
    var text = JSON.stringify(lps);
    var filename = session.learningPathOpened() ? session.getCurrentLearningPath().title + '.' + format : 'Meine_Lernpfade.' + format;

    download(filename, text);
}

// push a change of username to the server
function changeUserName(newUserName, cb = noop) {
    $.post('/updateUserName', { 'nickname': newUserName }).done((data, status) => {
        if (status === 'success')
            return cb();
    });
}

// update the username shown in the header
function updateUserName() {
    $.get('/whoami').done((data) => {
        document.getElementById("usernameText").innerText = data.nickname;
    });
}

// replace the main area by some new html
function replaceBody(data) {
    const main = document.getElementById('main');
    main.innerHTML = data;
}

function download(filename, text) {
    var tmp = document.createElement('a');
    tmp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    tmp.setAttribute('download', filename);
    tmp.style.display = 'none';
    document.body.appendChild(tmp);
    tmp.click()
    document.body.removeChild(tmp);
}