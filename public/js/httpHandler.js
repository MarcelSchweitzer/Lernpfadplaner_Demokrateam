// request edit patch from server
function getEditPage(lpid = session.getCurrentLearningPathId()) {
    $.get('/editor', { 'lpid': lpid }).done((data, status) => {
        replaceBody(data);
        fetchLearningPaths(() => {
            mountEditorEventHandlers();
        });
    });
}

function createLpOnServer(cb = noop) {
    $.get('/create').done((data, status) => {
        session.addLearningPath(data.content);
        session.openLearningPath(data['learningpathID'])
        return cb()
    });
}

function getHomePage() {

    // request index patch from server
    $.get('/home').done((data, status) => {
        replaceBody(data);
        mountIndexEventHandlers();
    });

    fetchLearningPaths();
}

function getSettingsPage(mode = null) {
    if (mode == null && session.getCurrentLearningPathId() == null)
        mode = 'userSettingsOnly';
    else if (mode == null)
        mode = 'allSettings';
    $.get('/settings', { 'lpid': session.getCurrentLearningPathId(), 'mode': mode }).done((data, status) => {
        replaceBody(data);
        mountSettingsEventHandlers();
    });
}

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

function deleteLearningPath(lpid, cb = noop) {
    $.post('/deletelp', { 'lpid': lpid }).done((data, status) => {
        if (status === 'success')
            return cb()
        else
            alertToUser('Lernpfad konnte nicht gelöscht werden!');
    });
}

function fetchLearningPaths(cb = noop) {
    // fetch users learning paths from server
    $.get('/learningPaths').done((data) => {
        lps = JSON.parse(data)
        session.updateLearningPaths(lps);
        return cb()
    });
}

function replaceBody(data) {
    const main = document.getElementById('main');
    main.innerHTML = data;
}

function changeUserName(newUserName, cb = noop) {
    $.post('/updateUserName', { 'nickname': newUserName }).done((data, status) => {
        if (status === 'success')
            return cb();
    });
}

function updateUserName() {
    $.get('/whoami').done((data) => {
        document.getElementById("usernameText").innerText = data.nickname;
    });
}

function downloadLearningpaths(lps, format) {
    var text = JSON.stringify(lps);
    var filename = session.learningPathOpened() ? session.getCurrentLearningPath().title + '.' + format : 'Meine_Lernpfade.' + format;

    download(filename, text);
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