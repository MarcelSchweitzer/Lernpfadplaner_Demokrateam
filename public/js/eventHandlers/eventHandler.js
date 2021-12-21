$(document).ready(() => {
  mountHeaderEventHandlers();
  mountIndexEventHandlers();
});

function mountEventHandler(handler, fun) {
  elem = document.getElementById(handler);
  elem.removeEventListener('click', fun, true);
  elem.addEventListener('click', fun, true);
}

function mountHeaderEventHandlers() {
  mountEventHandler('settingsBtn', settingsHandler);
  mountEventHandler('homeBtn', homeHandler);
}

function mountIndexEventHandlers() {
  mountHeaderEventHandlers();
  /** 
  for(lp of session.getLearningPaths()){
      mountEventHandler('edit'+lp.getId(), openHandler(lp.getId()));
      mountEventHandler('delete'+lp.getId(), deleteHandler(lp.getId()));
  }

  */
  mountEventHandler('createLpBtn', createHandler);
}

function mountSettingsEventHandlers() {
  mountEventHandler('saveSettingsBtn', saveSettingsHandler);
}

function mountEditorEventHandlers() {

}

function openHandler(id) {
  session.openLearningPath(id);
  getEditPage(id);
}

function createHandler() {
  session.createLearningPath();
  let lpId = session.getCurrentLearningPathId();
  getCreatePage(lpId);
}

function deleteHandler(id) {

}

function settingsHandler() {
  getSettingsPage();
}

function homeHandler() {
  getHomePage();
}

function saveSettingsHandler() {
  getEditPage();
}

function exportHandler() {
  getEditPage();
}