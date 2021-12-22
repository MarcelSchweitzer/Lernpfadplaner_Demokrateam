const pgp = require('pg-promise')( /*options*/ );
const { Client } = require('pg');

require('dotenv').config();

function noop() {}

// TODO move to .env!
const credentials = {
    database: process.env.DB_Name,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}

function createClient() {
    var dbClient = new Client(credentials);
    dbClient.connect();
    return dbClient;
}

function select(from = '', select = '*', where = '', cb = noop) {
    let dbClient = createClient();
    let query = 'SELECT ' + select + ' FROM ' + from;
    if (where != '')
        query += ' WHERE ' + where;
    console.log(query);
    dbClient.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return false
        }
        dbClient.end();
        return cb(res.rows)
    });
}

function selectMatch(from = '', select = '*', col, equals, cb = noop) {
    let quotes = ((typeof equals != 'number') ? "'" : "");
    let where = col + "=" + quotes + equals + quotes;
    return module.exports.select(from, select, where, cb)
}

function insert(table, dict, cb = noop) {
    let dbClient = createClient();
    let query = 'INSERT INTO ' + table + ' ('
    for (let [key, value] of Object.entries(dict))
        query += key + ','
    query = query.slice(0, -1)
    query += ') VALUES ('
    for (let [key, value] of Object.entries(dict)) {
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
        return cb()
    });

}

module.exports.select = select;
module.exports.selectMatch = selectMatch;
module.exports.insert = insert;