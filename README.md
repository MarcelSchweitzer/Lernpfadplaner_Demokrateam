# Lernpfadplaner_Demokrateam

installation:

1) navigate to https://nodejs.org/ and install node.js version 16.13.1 on your machine
2) navigate to https://www.postgresql.org/download/ and install PostgreSQL on your machine
3) use username: postgres, pw: demokrateam123 as login credentials
4) set up a server hosted at localhost:5432 (default)
5) set up a database name users (see setup_db.sql)
6) connect to the users database (\c users)
7) run the remaining code contained in setup_db.sql via psql or pgadmin's Query Tool
8) run "git clone https://github.com/MarcelSchweitzer/Lernpfadplaner_Demokrateam.git"
9) run "cd Lernpfadplaner_Demokrateam"
10) run "npm install" to install dependencies
11) run "node app" to start the server
12) navigate to localhost:8082/get_started with your browser
