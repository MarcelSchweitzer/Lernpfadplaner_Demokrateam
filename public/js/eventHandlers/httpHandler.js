// request edit patch from server
function getEditPage(lpid) {
    $.get('/editor', { 'lpid': lpid }).done(function(data, status) { replaceBody(data) });
}

function getCreatePage(cb = noop) {
    $.get('/create').done((data, status) => {
        replaceBody(data);
        mountSettingsEventHandlers();
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

function getSettingsPage(currentLp) {
    $.get('/settings', { lpid: currentLp }).done((data, status) => {
        replaceBody(data);
        mountSettingsEventHandlers();
    });
}

function LearningPathToServer() {

    // TODO

}

function deleteLearningPath(lpid, cb = noop) {
    $.post('/deletelp', { 'lpid': lpid }).done((data, status) => {
        if (status === 'success')
            return cb()
        else
            alert('Lernpfad konnte nicht gelöscht werden!');
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