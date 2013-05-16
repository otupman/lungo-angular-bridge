/**
 * Simple server that either delivers a recognised route to the web app or servers a 
 * file-system item.
 *
 */
var express = require('express');
var app = express();
app.get('/', function(req, res) {
  res.redirect('/index.html');
});
app.get('/examples', function(req, res) {
  res.sendfile('docs/www-root/index.html');
});
module.exports = app;