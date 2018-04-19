
console.log('Node server by Autograph.');
console.log('Initialising...');
// server.js
// load the things we need
var express = require('express');
var app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');
// render pages
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
app.get('/trousers', function(req, res) {
 res.render('pages/trousers');
});
app.get('/tshirts', function(req, res) {
 res.render('pages/tshirts');
});
app.get('/shoes', function(req, res) {
 res.render('pages/shoes');
});
app.listen(8080);
console.log('All good to go!');
console.log(' ');
console.log('Hit CTRL + C to stop the server.');
console.log(' ');
