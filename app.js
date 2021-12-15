console.log('hi');

const express = require('express');
const path = require('path');
const app = express();

app.use('/')

app.get('/', function (req, res) {
  res.send('Home')
})

app.get('/editModule', function (req, res) {
  res.send('Editing Screen')
})

app.listen(8080)