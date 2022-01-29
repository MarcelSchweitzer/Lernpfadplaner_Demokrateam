# Lernpfadplaner_Demokrateam

How to install:

1. navigate to https://nodejs.org/ and install node.js version 16.13.1 on your machine
2. navigate to https://www.postgresql.org/download/ and install PostgreSQL on your machine
3. use username: postgres, pw: demokrateam123 as login credentials
4. set up a server hosted at localhost:5432 (default)
5. set up a database named users (see setup_db.sql)
6. run the code contained in setup_db.sql via pgadmin's Query Tool
7. run "git clone https://github.com/MarcelSchweitzer/Lernpfadplaner_Demokrateam.git"
8. run "cd Lernpfadplaner_Demokrateam"
9. run "npm install" to install dependencies
10. run "node app" to start the server
11. navigate to localhost:8080/get_started with your browser

Functions of datas:

> To change the display on the pages, the css-files in public and the views have to be edited; to change / add / delete functonality of / to buttons or other elements and to change the processing of data in the jsons, the js-files in public have to be edited.

- node_modules: ?
- public
  - css
    - editor.css: for the workspace
    - main.css: for the home-page (not landing page) and the page for a open learningpath besides the workspace
    - settings.css: for the user-settings and the lp-settings and their settings framework
  - html
    - impressum.html: empty impressumpage, nowhere linked
  - img: images used
  - js
    - dependencies: ?
    - helpers: ?
    - clientSession.js: ?
    - coockie.js: ?
    - eventHandler.js: ?
    - httpHandler.js: ?
    - workspace.js: ?
- res: hardcoded informations / words used in different places or combinations across the project
- src: ?
- views
  - partials
    - coockie.ejs: ?
    - dahboard.ejs: ?
    - editor.ejs: ?
    - footer.ejs: ?
    - header.ejs: ?
    - lpSettings.ejs: settings for the active learningpath
    - settings.ejs: framework of the setting pages lpSettings and userSettings
    - userSettings.ejs: settings for the user of the active session
  - index.ejs: ?
  - landing.ejs: ?
- .env: ?
- .gitignore: ?
- app.js: ?
- package-lock.json: ?
- package.json: ?
- setup_db.swl: SQL expression to setup a database locally working with your localhost
