const path = require('path')
const express = require('express');
const { datafileURL } = require('./constants');
const app = new express();

if (!datafileURL) {
  console.log('WARNING: No datafile URL provided');
  return;
}


app.use(express.static(__dirname + '/src'));


app.get('/dist/bundle.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist') + '/bundle.js');
});

app.listen(8080, () => console.log('Running on port 8080!'));
