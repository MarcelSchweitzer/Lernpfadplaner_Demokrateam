![project logo](https://github.com/MarcelSchweitzer/Lernpfadplaner_Demokrateam/blob/main/public/img/favicon/favicon-meta-app.svg?raw=true) ![project logo](https://github.com/MarcelSchweitzer/Lernpfadplaner_Demokrateam/blob/main/public/img/favicon/favicon.svg?raw=true)

# Lernpfadplaner - Demokrateam

<a href="https://github.com/MarcelSchweitzer/Lernpfadplaner_Demokrateam/blob/main/LICENSE"><img alt="License: MIT" src="https://black.readthedocs.io/en/stable/_static/license.svg"></a> <a href="https://github.com/airbnb/javascript"><img alt="Code style: Airbnb" src="https://img.shields.io/badge/code%20style-Airbnb-blueviolet"></a>
</p>

## Table of Contents
1. [About](#about)
   1. [Style-Guide](#style-guide)
2. [Getting Started](#getting-started)
3. [Make changes](#make-changes)
4. [Folder Structure](#folder-structure)
5. [License](#license)

## About

The Lernpfadplaner (learning path planner) was created by 8 students of the University of Wuppertal, is based on an idea of [Dr. Heike Seehagen-Marx](https://www.seehagen-marx.de/) and has been greatly supported by [Dr. Marcel Schweitzer](https://www.hpc.uni-wuppertal.de/en/scientific-computing-and-high-performance-computing/members/dr-marcel-schweitzer.html).

The tool aims to enable educators to plan interactive learning media.

A learning path is a project consisting of several scenarios.

A scenario is represented by its material (which is specified by the material url).
Interactivities such as a questions, quizes or other tasks can be arranged and provided with individual properties.

Learning paths can be exported as JSON or PDF.

JSON files can be imported via the dashboard page.

### Style Guide

> HTML/CSS: [Google](https://google.github.io/styleguide/htmlcssguide.html)

> JS: [AirBnb](https://github.com/airbnb/javascript)

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

## Make changes

> Change the project color: Search & Replace '5bb9fc' with your color of choice

## Folder structure:

- node_modules: contains third-party dependencies
- public
  - css
    - editor.css: for the editor page
    - main.css: for the dashboard, landing page, the cookies and overall used css
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
    - treegraph.js: creates the treeGraph
    - ioHandler.js: import / export / download
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
