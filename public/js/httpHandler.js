// request edit patch from server
function getEditPage(lpid = session.getCurrentlearningPathId(), cb = noop) {
    $.get('/editor', { 'lpid': lpid }).done((data, status) => {
        replaceBody(data);
        fetchlearningPaths(() => {

            // the last scenario is opened by default
            session.openScenario(session.getProp('scenarios').length - 1);

            // the first interaction is opened by default
            session.openInteraction(0);

            createCanvases();
            return cb()
        });
    });
}

function getHomePage() {

    // request index patch from server
    $.get('/home').done((data, status) => {
        replaceBody(data);
    });

    fetchlearningPaths();
}

// request the settings page from the server
function getSettingsPage(mode = null) {
    if (mode == null && session.getCurrentlearningPathId() == null)
        mode = 'userSettingsOnly';
    else if (mode == null)
        mode = 'allSettings';
    $.get('/settings', { 'lpid': session.getCurrentlearningPathId(), 'mode': mode }).done((data, status) => {
        replaceBody(data);
    });
}

// push any learningPath to the server
function learningPathToServer(learningPath, cb = noop) {
    if (JSON.stringify(learningPath) != 'undefined') {
        $.post('/updateLp', { 'lpid': learningPath.id, 'title': learningPath.title, 'learningPath': JSON.stringify(learningPath) }).done((data, status) => {
            if (status === 'success')
                return cb()
            else
                alertToUser("Lernpfad konnte nicht gespeichert werden!", 10, 'red');
        });
    }
}

// create a new learningPath on the server and add it to the list of learningPaths
function createLpOnServer(cb = noop) {
    $.get('/create').done((data, status) => {
        session.addlearningPath(data.content);
        session.openlearningPath(data['learningPathID'])
        return cb()
    });
}


// delete a learningPath from the server
function deletelearningPath(lpid, cb = noop) {
    $.post('/deleteLp', { 'lpid': lpid }).done((data, status) => {
        if (status === 'success')
            return cb()
        else
            alertToUser('Lernpfad konnte nicht gelöscht werden!');
    });
}

// fetch all learningPaths that we have access to
function fetchlearningPaths(cb = noop) {
    // fetch users learning paths from server
    $.get('/learningPaths').done((data) => {
        lps = JSON.parse(data)
        session.updatelearningPaths(lps);
        return cb()
    });
}

// serve a list of learningPaths as a download for the user
function downloadlearningPaths(lps, format) {
    var text = JSON.stringify(lps, null, 4);
    var filename = session.learningPathOpened() ? session.getCurrentlearningPath().title + '.' + format : 'Meine_Lernpfade.' + format;

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