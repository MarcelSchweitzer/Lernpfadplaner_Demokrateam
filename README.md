![project logo](https://github.com/MarcelSchweitzer/Lernpfadplaner_Demokrateam/blob/main/public/img/favicon/favicon.png?raw=true)
# Lernpfadplaner - Demokrateam 

<a href="https://github.com/MarcelSchweitzer/Lernpfadplaner_Demokrateam/blob/main/LICENSE"><img alt="License: MIT" src="https://black.readthedocs.io/en/stable/_static/license.svg"></a>

## Getting Started

- navigate to https://nodejs.org/ and install node.js version 16.13.1 on your machine
- navigate to https://www.postgresql.org/download/ and install PostgreSQL on your machine
- use username: postgres, pw: demokrateam123 as login credentials
- set up a server hosted at localhost:5432 (default)
- set up a database named "users"
- run the code contained in setup_db.sql via pgadmin's Query Tool
- run the following commands:

```console
git clone https://github.com/MarcelSchweitzer/Lernpfadplaner_Demokrateam.git
cd Lernpfadplaner_Demokrateam
npm install
npm start
```

- navigate to localhost:8080/get_started with your browser

## Folder structure:

- node_modules: contains third-party dependencies
- public
  - css
    - editor.css: for the editor page
    - main.css: for the dashboard and landing page
    - settings.css: for the user-settings and the lp-settings and their settings framework
  - html
    - impressum.html: # TODO ( write impressum, link not functional - covered?)
  - img: images used
  - js
    - dependencies:
      - pleaseRotate.js: a third party project by Rob Scanlon http://github.com/arscan/pleaserotate.js
    - helpers:
      - arrayToolkit.js: helper functions for array operations
      - uniqueIdentifiers.js: helper functions for finding unique names and ids
    - clientSession.js:
    - cookie.js: contains code responsibly for the cookie banner
    - eventHandler.js: contains globaly scoped code for event handling
    - httpHandler.js: contains globaly scoped code for server interaction
    - workspace.js: responsible for the workspace area
- res: hardcoded information / words used in different places or combinations across the project
- src: server side modules
  - dbManager.js: handles database requests
  - fileSystemToolkit.js: provides functions for importing textfiles (containing static data)
  - psqlStore: handles cookies beeing stored in the database
  - uniqueIdentifiers.js: helper functions for finding unique names and ids (server side differs from client side)
- views:
  - partials: views to be rendered at specific user events
    - cookie.ejs: the cookie banner
    - dahboard.ejs: the dashboard body
    - editor.ejs: the editor body
    - footer.ejs: the footer
    - header.ejs: the header
    - lpSettings.ejs: settings for the active learningpath
    - settings.ejs: framework of the setting pages lpSettings and userSettings
    - userSettings.ejs: settings for the user of the active session
  - index.ejs: the framework containing partials
  - landing.ejs: the landing page
- .env: Information about the server side environment
- .gitignore
- app.js: Server side code
- package-lock.json: information about the project and its dependencies
- package.json: information about the project and its dependencies
- setup_db.sql: SQL expression to setup a database locally working with your localhost

## License

This project is licensed under the terms of MIT license. Please see the LICENSE file for details.
