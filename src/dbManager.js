const pgp = require('pg-promise')(/* options */);
const { Client } = require('pg');

require('dotenv').config();

function noop() {}

const credentials = {
  database: process.env.DB_Name,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// create a new db client (for non-blocking behaviour)
function createClient() {
  const dbClient = new Client(credentials);
  dbClient.connect();
  return dbClient;
}

// select
function select(from = '', select = '*', where = '', cb = noop) {
  const dbClient = createClient();
  let query = `SELECT ${select} FROM ${from}`;
  if (where != '') { query += ` WHERE ${where}`; }
  // console.log(query);
  dbClient.query(query, (err, res) => {
    if (err) {
      console.error(err);
      return false;
    }
    dbClient.end();
    return cb(res.rows);
  });
}

// select an exact match
function selectMatch(from = '', select = '*', col, equals, cb = noop) {
  const quotes = ((typeof equals !== 'number') ? "'" : '');
  const where = `${col}=${quotes}${equals}${quotes}`;
  return module.exports.select(from, select, where, cb);
}

// insert into databas
function insert(table, dict, cb = noop, errCb = noop) {
  const dbClient = createClient();
  let query = `INSERT INTO ${table} (`;
  for (const [key, value] of Object.entries(dict)) { query += `${key},`; }
  query = query.slice(0, -1);
  query += ') VALUES (';
  for (const [key, value] of Object.entries(dict)) {
    const quotes = ((typeof value !== 'number') ? "'" : '');
    query += `${quotes + value + quotes},`;
  }
  query = query.slice(0, -1);
  query += ');';
  // console.log(query)
  dbClient.query(query, (err, res) => {
    if (err) {
      console.error(err);
      return errCb();
    }
    dbClient.end();
    return cb();
  });
}

// delete from Database
function _delete(table, attrib, equals, cb = noop) {
  const dbClient = createClient();
  let query = `DELETE FROM ${table} WHERE ${attrib}=`;
  const quotes = ((typeof equals !== 'number') ? "'" : '');
  query += `${quotes + equals + quotes},`;
  query = query.slice(0, -1);
  // console.log(query)
  dbClient.query(query, (err, res) => {
    if (err) {
      console.error(err);
      return false;
    }
    dbClient.end();
    return cb();
  });
}

// update an entry
function _update(table, key, equals, dict, cb = noop) {
  const listOfKeys = Object.keys(dict);
  const listOfValues = Object.values(dict);

  if (listOfKeys.length != listOfValues.length) { return; }

  const dbClient = createClient();
  let query = `UPDATE ${table} SET `;

  for (let i = 0; i < listOfKeys.length; i++) {
    const quotes = ((typeof listOfValues[i] !== 'number') ? "'" : '');
    query += `${listOfKeys[i]}=${quotes}${listOfValues[i]}${quotes},`;
  }
  query = query.slice(0, -1);
  query += ` WHERE ${key}=`;
  const _quotes = ((typeof equals !== 'number') ? "'" : '');
  query += _quotes + equals + _quotes;

  // console.log(query)
  dbClient.query(query, (err, res) => {
    if (err) {
      console.error(err);
      return false;
    }
    dbClient.end();
    return cb();
  });
}

module.exports.select = select;
module.exports.selectMatch = selectMatch;
module.exports.insert = insert;
module.exports._delete = _delete;
module.exports._update = _update;
