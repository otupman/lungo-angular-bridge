var express = require('express');
var app = express();
app.get('/', function(req, res) {
  res.redirect('/index.html');
});
app.get('/examples', function(req, res) {
  res.sendfile('docs/www-root/index.html');
});
module.exports = app;