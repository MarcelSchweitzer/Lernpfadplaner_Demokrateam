// request edit patch from server
function getEditPage(lpid) {
    $.get('/editor', { 'lpid': lpid }).done(function(data, status) { replaceBody(data) });
}

function getCreatePage() {
    $.get('/create').done(function(data, status) {
        replaceBody(data);
        mountSettingsEventHandlers();
    });
}

function getHomePage() {

    // request index patch from server
    $.get('/home').done(function(data, status) {
        replaceBody(data);
        mountIndexEventHandlers();
    });

    // fetch users learning paths from server
    $.get('/learningPaths').done(function(data) {
        lps = JSON.parse(data)
        for (let i = 0; i < lps.length; i++)
            session.addLearningPath(lps[i]['lpid'], lps[i]['title'])
    });

}

function getSettingsPage(currentLp) {
    $.get('/settings', { lpid: currentLp }).done(function(data, status) {
        replaceBody(data);
        mountSettingsEventHandlers();
    });
}

function LearningPathToServer() {

    // TODO

}

function deleteLearningPath(lpid) {
    $.post('/deletelp', { 'lpid': lpid }).done(function(data, status) {
        console.log("sent delete request to server! Status: " + status);
    });
}

function replaceBody(data) {
    const main = document.getElementById('main');
    main.innerHTML = data;
}