
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
console.log('.');
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
    promotions.push({"sku": result[i].sku,
     "brand": result[i].brand,
      "type": result[i].type,
      "description": result[i].description,
      "btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=promotions" role="button">Buy Now</a></p>',
     "img_holder": '<a href="/itm_promo?sku=' + result[i].sku + '"><img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png"></a>'});
    //console.log(path);
  }
  res.render('pages/index', { promotions: promotions});
});
});


console.log('..');

console.log('...');
app.get('/getform', function(req, res){
var name = req.query.name;
var quest = req.query.quest;
 res.send("Hi "+name+" I am sure you will "+quest) ;
});

app.get('/trousers', function(req, res) {
  db.collection('trousers').find().toArray(function(err, result) {
  if (err) throw err;
  var trousers = [];
  for (var i = 0; i < result.length; i++) {
    trousers.push({"sku": result[i].sku,
     "brand": result[i].brand,
      "type": result[i].type,
      "description": result[i].description,
     "btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=trousers" role="button">Buy Now</a></p>',
     "img_holder": '<a href="/itm_trousers?sku=' + result[i].sku + '"><img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png"></a>'});
    //console.log(path);
  }
  res.render('pages/trousers', { trousers: trousers});
});
});
app.get('/itm_trousers', function(req, res){
//console.log(req.query.sku);
db.collection('trousers').find({sku: req.query.sku}).toArray(function(err, result) {
if (err) throw err;
var search = [];
  for (var i = 0; i < result.length; i++) {
    search.push({"sku": result[i].sku,
              "brand": result[i].brand,
              "type": result[i].type,
              "description": result[i].description,
               "path": "/" + result[i].sku + ".png",
               "colour": result[i].colour,
               "quantity": result[i].quantity,
               "price": result[i].price,
               "btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=trousers" role="button">Buy Now</a></p>',
               "img_holder": '<img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png">'});
  }
res.render('pages/itm_trousers', { search: search });
});
});

app.get('/promotions', function(req, res) {
  db.collection('promotions').find().toArray(function(err, result) {
  if (err) throw err;
  var promotions = [];
  for (var i = 0; i < result.length; i++) {
    promotions.push({"sku": result[i].sku,
     "brand": result[i].brand,
      "type": result[i].type,
       "description": result[i].description,
       "btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=promotions" role="button">Buy Now</a></p>',
      "img_holder": '<a href="/itm_promo?sku=' + result[i].sku + '"><img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png"></a>'});
    //console.log(path);
  }
  res.render('pages/promotions', { promotions: promotions });
});
});
app.get('/itm_promo', function(req, res){
//console.log(req.query.sku);
db.collection('promotions').find({sku: req.query.sku}).toArray(function(err, result) {
if (err) throw err;
var search = [];
  for (var i = 0; i < result.length; i++) {
    search.push({"sku": result[i].sku,
              "brand": result[i].brand,
              "type": result[i].type,
              "description": result[i].description,
               "path": "/" + result[i].sku + ".png",
               "colour": result[i].colour,
               "quantity": result[i].quantity,
               "price": result[i].price,
               "btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=promotions" role="button">Buy Now</a></p>',
               "img_holder": '<img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png">'});
  }
res.render('pages/itm_promo', { search: search });
});
});


console.log('....');


app.get('/tshirts', function(req, res) {
  db.collection('tshirts').find().toArray(function(err, result) {
  if (err) throw err;
  var tshirts = [];
  for (var i = 0; i < result.length; i++) {
    tshirts.push({"sku": result[i].sku,
     "brand": result[i].brand,
      "type": result[i].type,
       "description": result[i].description,
       "btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=tshirts" role="button">Buy Now</a></p>',
      "img_holder": '<a href="/itm_tshirt?sku=' + result[i].sku + '"><img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png"></a>'});
    //console.log(path);
  }
  res.render('pages/tshirts', { tshirts: tshirts });
});
});
app.get('/itm_tshirt', function(req, res){
//console.log(req.query.sku);
db.collection('tshirts').find({sku: req.query.sku}).toArray(function(err, result) {
if (err) throw err;
var search = [];
  for (var i = 0; i < result.length; i++) {
    search.push({"sku": result[i].sku,
              "brand": result[i].brand,
              "type": result[i].type,
              "description": result[i].description,
               "path": "/" + result[i].sku + ".png",
               "colour": result[i].colour,
               "quantity": result[i].quantity,
               "price": result[i].price,
               "btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=tshirts" role="button">Buy Now</a></p>',
               "img_holder": '<img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png">'});
  }
res.render('pages/itm_tshirt', { search: search });
});
});

app.get('/shoes', function(req, res) {
  db.collection('shoes').find().toArray(function(err, result) {
  if (err) throw err;
  var shoes = [];
  for (var i = 0; i < result.length; i++) {
    shoes.push({"sku": result[i].sku,
     "brand": result[i].brand,
      "type": result[i].type,
       "description": result[i].description,
       "btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=shoes" role="button">Buy Now</a></p>',
      "img_holder": '<a href="/itm_shoes?sku=' + result[i].sku + '"><img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png"></a>'});
    //console.log(path);
  }
  res.render('pages/shoes', { shoes: shoes });
});
});
app.get('/itm_shoes', function(req, res){
//console.log(req.query.sku);
db.collection('shoes').find({sku: req.query.sku}).toArray(function(err, result) {
if (err) throw err;
var search = [];
  for (var i = 0; i < result.length; i++) {
    search.push({"sku": result[i].sku,
              "brand": result[i].brand,
              "type": result[i].type,
              "description": result[i].description,
               "path": "/" + result[i].sku + ".png",
               "colour": result[i].colour,
               "quantity": result[i].quantity,
               "price": result[i].price,
               "btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=shoes" role="button">Buy Now</a></p>',
               "img_holder": '<img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png">'});
  }
res.render('pages/itm_shoes', { search: search });
});
});
app.get('/basket', function(req, res) {
  db.collection(req.query.col).find({sku: req.query.sku}).toArray(function(err, result) {
  if (err) throw err;
  var search = [];
    for (var i = 0; i < result.length; i++) {
      search.push({"sku": result[i].sku,
                "brand": result[i].brand,
                "type": result[i].type,
                "description": result[i].description,
                 "path": "/" + result[i].sku + ".png",
                 "colour": result[i].colour,
                 "quantity": result[i].quantity,
                 "price": result[i].price,
                 "img_holder": '<a class="thumbnail pull-left" href="#"> <img class="media-object" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png" style="width: auto; height: 72px;"></a>'});
    }
  res.render('pages/basket', { search: search });
  });
  });

  app.get('/login', function(req, res) {
    db.collection('users').find({login: req.query.log, password: req.query.pas}).toArray(function(err, result) {
    if (err) throw err;
    var search = [];
      for (var i = 0; i < result.length; i++) {
        search.push({"login": result[i].log,
                  "password": result[i].pas});
      }
      if(search == null){
            res.render('pages/index', { search: search });
      }
             res.render('pages/login', { search: search });

    });
    });




app.get('/about', function(req, res) {
 res.render('pages/about');
});
app.get('/contact', function(req, res) {
 res.render('pages/contact');
});

app.get('/register', function(req, res) {
 res.render('pages/register');
});

console.log('.....');
app.listen(8080);
console.log('All good to go!');
console.log(' ');
console.log(' ');
console.log('Hit CTRL + C to stop the server.');
console.log(' ');
console.log(' ');
