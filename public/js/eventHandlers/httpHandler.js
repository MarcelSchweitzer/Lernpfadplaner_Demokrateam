// request edit patch from server
function getEditPage(editId = 0) {
  // send get request to server 
  $.get('/editor/lp=' + editId, { uId: session.getUserId() }).done(function (data, status) { replaceBody(data) });
}

function getCreatePage() {
  // send get request to server 
  $.get('/create').done(function (data, status) {
    replaceBody(data),
      mountSettingsEventHandlers();
  });
}

function getHomePage() {

  // request index patch from server
  $.get('/home/user=' + session.getUserId()).done(function (data, status) {
    replaceBody(data);
    mountIndexEventHandlers();
  });

  // fetch users learning paths from server
  $.get('/learningPaths/user=' + session.getUserId()).done(function (data, status) {
    for (lp of data.data.learningPaths)
      session.addLearningPath(lp.id, lp.name);
  });

}

function getSettingsPage() {
  $.get('/settings').done(function (data, status) {
    replaceBody(data);
    mountSettingsEventHandlers;
  });
}

function replaceBody(data) {
  const main = document.getElementById('main');
  main.innerHTML = data;
}