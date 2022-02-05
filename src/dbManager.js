const pgp = require('pg-promise')( /*options*/ );
const { Client } = require('pg');

require('dotenv').config();

function noop() {}

const credentials = {
    database: process.env.DB_Name,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}

// create a new db client (for non-blocking behaviour)
function createClient() {
    var dbClient = new Client(credentials);
    dbClient.connect();
    return dbClient;
}

// select
function select(from = '', select = '*', where = '', cb = noop) {
    let dbClient = createClient();
    let query = 'SELECT ' + select + ' FROM ' + from;
    if (where != '')
        query += ' WHERE ' + where;
    // console.log(query);
    dbClient.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return false
        }
        dbClient.end();
        return cb(res.rows)
    });
}

// select an exact match
function selectMatch(from = '', select = '*', col, equals, cb = noop) {
    let quotes = ((typeof equals != 'number') ? "'" : "");
    let where = col + "=" + quotes + equals + quotes;
    return module.exports.select(from, select, where, cb)
}

// insert into databas
function insert(table, dict, cb = noop, errCb = noop) {
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
        // console.log(query)
    dbClient.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return errCb()
        }
        dbClient.end()
        return cb()
    });

}

// delete from Database
function _delete(table, attrib, equals, cb = noop) {
    let dbClient = createClient();
    let query = 'DELETE FROM ' + table + ' WHERE ' + attrib + '=';
    let quotes = ((typeof equals != 'number') ? "'" : "");
    query += quotes + equals + quotes + ','
    query = query.slice(0, -1)
        //console.log(query)
    dbClient.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return false
        }
        dbClient.end()
        return cb()
    });
}

// update an entry
function _update(table, key, equals, dict, cb = noop) {
    let listOfKeys = Object.keys(dict);
    let listOfValues = Object.values(dict)

    if (listOfKeys.length != listOfValues.length)
        return

    let dbClient = createClient();
    let query = 'UPDATE ' + table + ' SET '

    for (let i = 0; i < listOfKeys.length; i++) {
        let quotes = ((typeof listOfValues[i] != 'number') ? "'" : "");
        query += listOfKeys[i] + '=' + quotes + listOfValues[i] + quotes + ','
    }
    query = query.slice(0, -1)
    query += ' WHERE ' + key + '=';
    let _quotes = ((typeof equals != 'number') ? "'" : "");
    query += _quotes + equals + _quotes

    //console.log(query)
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
module.exports._delete = _delete;
module.exports._update = _update;