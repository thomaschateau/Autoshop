
console.log('Node server by Autograph.');
console.log('Initialising...');
// server.js
// load the things we need
'use strict';

const app = require('express')();
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/autoshopdb',
    collection: 'sessions'
});

const url = "mongodb://localhost:27017/autoshopdb";
//var app = express();
//app.use(express.static('public'))
var db;
MongoClient.connect(url, function(err, database){
 if(err) throw err;
 db = database;
});


app.use(session({
  secret: 'secret session key',
  resave: false,
  saveUninitialized: true,
  store: store,
  unset: 'destroy',
  name: 'session cookie name'
}));

app.get('/', (req, res) => {
  if(!req.session.test) {
    req.session.test = 'OK';
    res.send('OK');
  }
});

app.get('/test', (req, res) => {
  res.send(req.session.test); // 'OK'
});




// set the view engine to ejs
app.set('view engine', 'ejs');
// render pages
/*
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

app.get('/getform', function(req, res){
var name = req.query.name;
var quest = req.query.quest;
 res.send("Hi "+name+" I am sure you will "+quest) ;
});

app.get('/item', function(req, res){
var x = req.query.x;
var y = req.query.y;
 res.send("X + Y=" + parseInt(x+y));
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
*/

app.listen(8080);
console.log('All good to go!');
console.log(' ');
console.log('Hit CTRL + C to stop the server.');
console.log(' ');
