
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

var bodyParser = require ('body-parser');
app.use (bodyParser ());


// set the view engine to ejs
app.set('view engine', 'ejs');
// render pages
app.get('/', function(req, res) {
  db.collection('promotions').find().toArray(function(err, result) {
  if (err) throw err;
  var promotions = [];
  for (var i = 0; i < result.length; i++) {
    promotions.push({"brand": result[i].brand, "type": result[i].type, "description": result[i].description});
  }
  res.render('pages/index', { promotions: promotions });
});
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

app.get('/item', function(req, res) {
 res.render('pages/item');
});

app.get('/trousers', function(req, res) {
  db.collection('trousers').find().toArray(function(err, result) {
  if (err) throw err;
  var trousers = [];
  for (var i = 0; i < result.length; i++) {
    trousers.push({"sku": result[i].sku, "brand": result[i].brand, "type": result[i].type, "description": result[i].description, "path": "/" + result[i].sku + ".jpg"});
    //console.log(path);
  }
  res.render('pages/trousers', { trousers: trousers });
});
});


app.get('/tshirts', function(req, res) {
  db.collection('tshirts').find().toArray(function(err, result) {
  if (err) throw err;
  var tshirts = [];
  for (var i = 0; i < result.length; i++) {
    tshirts.push({"brand": result[i].brand, "type": result[i].type, "description": result[i].description});
  }
  res.render('pages/tshirts', { tshirts: tshirts });
});
});

app.get('/shoes', function(req, res) {
  db.collection('shoes').find().toArray(function(err, result) {
  if (err) throw err;
  var shoes = [];
  for (var i = 0; i < result.length; i++) {
    shoes.push({"brand": result[i].brand, "type": result[i].type, "description": result[i].description});
  }
  res.render('pages/shoes', { shoes: shoes });
});
});


app.listen(8080);
console.log('All good to go!');
console.log(' ');
console.log('Hit CTRL + C to stop the server.');
console.log(' ');
