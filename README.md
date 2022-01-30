# Lernpfadplaner - Demokrateam

## Getting Started

* navigate to https://nodejs.org/ and install node.js version 16.13.1 on your machine
* navigate to https://www.postgresql.org/download/ and install PostgreSQL on your machine
* use username: postgres, pw: demokrateam123 as login credentials
* set up a server hosted at localhost:5432 (default)
* set up a database named "users"
* run the code contained in setup_db.sql via pgadmin's Query Tool
* run the following commands:
```console
git clone https://github.com/MarcelSchweitzer/Lernpfadplaner_Demokrateam.git
cd Lernpfadplaner_Demokrateam
npm install
npm start
``` 
* navigate to localhost:8080/get_started with your browser

## Functions of datas:

> To change the display on the pages, the css-files in public and the views have to be edited; to change / add / delete functonality of / to buttons or other elements and to change the processing of data in the jsons, the js-files in public have to be edited.

> not all classes are related to functions or external css, some are just for clarity

> Bootstrap is used across the content

> css for madie screen (diffrent screen sizes) is only defined in main.css but used for alls files, e.g. used in settings.ejs

> the information data holds is different on eyery page / for every .ejs and is configurated in app.js via the app.get function

- node_modules: contains third-party dependencies
- public
  - css
    - editor.css: for the workspace
    - main.css: for the dashboard, landing page and the editor page besides the workspace
    - settings.css: for the user-settings and the lp-settings and their settings framework
  - html
    - impressum.html: empty impressumpage, nowhere linked
  - img: images used
  - js
    - dependencies: 
      - pleaseRotate.js: a third party project by Rob Scanlon http://github.com/arscan/pleaserotate.js
    - helpers: 
      - arrayToolkit.js: helper functions for array operations
      - uniqueIdentifiers.js: helper functions for finding unique names and ids
    - clientSession.js: 
    - cookie.js: contains code responsibly for the cookie banner
    - eventHandler.js: contains globaly scoped code for eventhandling
    - httpHandler.js: contains globaly scoped code for server interaction
    - workspace.js: responsible for the workspace area
- res: hardcoded informations / words used in different places or combinations across the project
- src: ?
- views
  - partials
    - cookie.ejs: ?
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

## License

This project is licensed under the terms of MIT license. Please see the LICENSE file for details.
