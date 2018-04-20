
console.log('Node server by Autograph.');
console.log('Initialising...');
// server.js
// load the things we need
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017/autoshopdb";
var express = require('express');
var app = express();
app.use(express.static('public'))
var db;
MongoClient.connect(url, function(err, database){
 if(err) throw err;
 db = database;
});


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
  db.collection('trousers').find().toArray(function(err, result) {
  if (err) throw err;
  var trousers = [
  { brand: 'trousers1', type: 'type1' },
  { brand: 'trousers2', type: 'type2' },
  { brand: 'trousers3', type: 10 }
  ];
  for (var i = 0; i < result.length; i++) {
    //trousers += [{ brand: result[i].brand, type: result[i].type, description: result[i].description }];
        console.log(result[i].brand);
        console.log(trousers.brand);
  }
  res.render('pages/trousers', { trousers: trousers });
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
