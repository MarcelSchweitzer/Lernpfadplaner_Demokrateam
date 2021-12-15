console.log('hi');

const express = require('express');
const path = require('path');
const app = express();

app.use('/public', express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
})

app.get('/editModule', function (req, res) {
  res.send('Editing Screen')
})

app.listen(8080)