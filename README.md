# Lernpfadplaner_Demokrateam

installation:

1) navigate to https://nodejs.org/ and install the latest LTS version of node.js on your machine
2) navigate to https://www.postgresql.org/download/ an install PostgreSQL on your machine
3) use username: postgres, pw: demokrateam123 as login credentials
4) set up a server hosted at localhost:5432
5) set up a database name users (CREATE DATABASE users WITH ENCODING 'UTF8')
6) connect to the users database (\c users)
7) run the remaining code contained in setup_db.sql via psql or pgadmin 
8) run "git clone https://github.com/MarcelSchweitzer/Lernpfadplaner_Demokrateam.git"
9) run "cd Lernpfadplaner_Demokrateam"
10) run "git checkout backend"
11) run "npm install" to install dependencies
12) run "npm start" to start the server
13) navigate to localhost:8082 with your browser
