// request edit patch from server
function getEditPage(lpid) {
    $.get('/editor', { 'lpid': lpid }).done((data, status) => {
        replaceBody(data);
        mountEditorEventHandlers();
    });
}

function createLpOnServer(cb = noop) {
    $.get('/create').done((data, status) => {
        session.addLearningPath(data['learningpathID'], data['learningpathTitle']);
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

function getSettingsPage(lp = session.getCurrentLearningPathId()) {
    $.get('/settings', { 'lpid': lp }).done((data, status) => {
        replaceBody(data);
        mountSettingsEventHandlers();
    });
}

function LearningPathToServer(learningPath, cb = noop) {
    if (JSON.stringify(learningPath) != 'undefined') {
        $.post('/updateLp', { 'lpid': learningPath.getProp('id'), 'title': learningPath.getProp('title'), 'learningPath': JSON.stringify(learningPath) }).done((data, status) => {
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