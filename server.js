
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
 var drinks = [
 { name: 'Bloody Mary', drunkness: 3 },
 { name: 'Martini', drunkness: 5 },
 { name: 'Scotch', drunkness: 10 }
 ];

 var tagline = "Any code of your own that you havent looked at for six or more months might as well have been written by someone else."
 res.render('pages/trousers', {
 drinks: drinks,
 tagline: tagline
 });
});


app.get('/all', function(req, res) {
  var drinks = [
  { brand: 'trousers1', type: 'type1' },
  { brand: 'trousers2', type: 'type2' },
  { brand: 'trousers3', type: 'type3' }
  ];

 db.collection('trousers').find().toArray(function(err, result) {
 if (err) throw err;
 var output = "<h1>All the quotes</h1>";
 for (var i = 0; i < result.length; i++) {

 output += '<div class="col-lg-4 col-md-6 mb-4"> <div class="card h-100"><a href="#"><img class="card-img-top" src="pictures/t5.jpg" alt=""></a> <div class="card-body">'
 output += '<h4 class="card-title"> <a href="#">' +result[i].brand+'</a> </h4> <h5>'+result[i].type+'</h5> <p class="card-text">'+result[i].description+'</p>'
 output += '</div> <div class="card-footer"> <small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small> </div> </div> </div>'



 }
 res.send(output);
 });
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
