const pgp = require("pg-promise")(/*options*/);
const { Client } = require('pg');

const credentials = {
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: 'demokrateam123',
  port: 5432,
}

function createClient(){
  var dbClient = new Client(credentials);
  dbClient.connect();
  return dbClient;
}

function select(from="", select="*", where=""){
  let dbClient = createClient();
  const query = 'SELECT '+select+' FROM '+from;
  if(where != "")
    query += ' WHERE '+where;
  console.log(query);
  dbClient.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return -1
    }
    console.log(res.rows);
    dbClient.end();
    return(res.rows)
  });
}

module.exports.select = select;