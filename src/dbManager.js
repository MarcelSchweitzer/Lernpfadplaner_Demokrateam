const pgp = require('pg-promise')(/*options*/);
const { Client } = require('pg');

// TODO move to .env!
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

function select(from='', select='*', where=''){
  let dbClient = createClient();
  const query = 'SELECT '+select+' FROM '+from;
  if(where != '')
    query += ' WHERE '+where;
  console.log(query);
  dbClient.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return false
    }
    dbClient.end();
    return(res.rows)
  });
}

function insert(table, dict, callback=function(){return}) {
  let dbClient = createClient();
  let query = 'INSERT INTO '+table+' ('
  for(let [key, value] of Object.entries(dict))
    query += key+','
  query = query.slice(0, -1)
  query += ') VALUES ('
  for(let [key, value] of Object.entries(dict)){
    var quotes = ((typeof value != 'number') ? "'" : "");
    query += quotes + value + quotes + ','
  }
  query = query.slice(0, -1)
  query += ');'
  console.log(query)
  dbClient.query(query, (err, res) => {
      if (err) {
          console.error(err);
          return false
      }
      dbClient.end()
      callback();
      return true
  });

}

module.exports.select = select;
module.exports.insert = insert;