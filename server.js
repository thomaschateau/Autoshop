
console.log('Node server by Autograph.');
console.log('Initialising...');
// server.js
// load the things we need
var express = require('express');
var app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');
// use res.render to load up an ejs view file
// pages
// index page
app.get('/', function(req, res) {
 res.render('pages/index');
});
app.get('/about', function(req, res) {
 res.render('pages/about');
});
app.get('/contact', function(req, res) {
 res.render('pages/contact');
});
app.get('/login', function(req, res) {
 res.render('pages/login');
});
app.get('/register', function(req, res) {
 res.render('pages/register');
});
app.get('/basket', function(req, res) {
 res.render('pages/basket');
});
app.listen(8080);
console.log('All good to go!');
console.log(' ');
console.log('Hit ctrl + c to shut down the server.');
console.log(' ');
