
console.log('Node server by Autograph.');
console.log('Initialising...');
// server.js
// load the things we need
const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const url = "mongodb://localhost:27017/autoshopdb";
const express = require('express'); //npm install express
const session = require('express-session'); //npm install express-session
const bodyParser = require('body-parser'); //npm install body-parser
const app = express();
 app.use(express.static('public'))
//this tells express we are using sesssions. These are variables that only belong to one user of the site at a time.
app.use(session({ secret: 'example' }));
app.use (bodyParser ());
// set the view engine to ejs
app.set('view engine', 'ejs');
var db;
//this is our connection to the mongo db, ts sets the variable db as our database
MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database;
  app.listen(8080);
});


//********** GET ROUTES - Deal with displaying pages ***************************
app.get('/index', function(req, res) {
  db.collection('promotions').find().toArray(function(err, result) {
  if (err) throw err;
  var promotions = [];
             console.log(req.session.username);
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
//this is our login route, all it does is render the login.ejs page.
app.get('/login', function(req, res) {
  res.render('pages/login');
});

//adduser route simply draws our adduser page
app.get('/adduser', function(req, res) {
  res.render('pages/adduser')
});
//logour route cause the page to Logout.
//it sets our session.loggedin to false and then redirects the user to the login
app.get('/logout', function(req, res) {
  if(!req.session.loggedin){res.redirect('/login');return;}
  req.session.loggedin = false;
  req.session.destroy();
  res.redirect('/login');
});

//********** POST ROUTES - Deal with processing data from forms ***************************


//the dologin route detasl with the data from the login screen.
//the post variables, username and password ceom from the form on the login page.
app.post('/dologin', function(req, res) {
  console.log(JSON.stringify(req.body));
    console.log(req.session.username);
  var uname = req.body.username;
  var pword = req.body.password;

  db.collection('people').findOne({"login.username":uname}, function(err, result) {
    if (err) throw err;//if there is an error, throw the error
    //if there is no result, redirect the user back to the login system as that username must not exist
    if(!result){
      res.redirect('/login');
      return;
    }
    //if there is a result then check the password, if the password is correct set session loggedin to true and send the user to the index
    if(result.login.password == pword){
       req.session.loggedin = true;
       req.session.username = uname;
       res.render('pages/profile', { user: result });
     }
    //otherwise send them back to login
    else{res.redirect('/login')}
  });
});

app.get('/profile', function(req, res) {
    var uname = req.session.username;
  db.collection('people').findOne({"login.username":uname}, function(err, result) {
    if (err) throw err;//if there is an error, throw the error
    //if there is no result, redirect the user back to the login system as that username must not exist
    if(!result){
      res.redirect('/login');
      return;
    }
    //if there is a result then check the password, if the password is correct set session loggedin to true and send the user to the index
    res.render('pages/profile', { user: result });
    //otherwise send them back to login
  });
});

//the adduser route deals with adding a new user
//dataformat for storing new users.

//{"_id":18,
//"gender":"female",
//"name":{"title":"miss","first":"allie","last":"austin"},
//"location":{"street":"9348 high street","city":"canterbury","state":"leicestershire","postcode":"N7N 1WE"},
//"email":"allie.austin@example.com",
//"login":{"username":"smalldog110","password":"lickit"},
//"dob":"1970-07-06 16:32:37","registered":"2011-02-08 07:10:24",
//"picture":{"large":"https://randomuser.me/api/portraits/women/42.jpg","medium":"https://randomuser.me/api/portraits/med/women/42.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/women/42.jpg"},
//"nat":"GB"}

app.post('/adduser', function(req, res) {
  //check we are logged in
  //we create the data string from the form components that have been passed in

var datatostore = {
"name":{"first":req.body.first,"last":req.body.last},
"location":{"street":req.body.street,"city":req.body.city,"postcode":req.body.postcode},
"email":req.body.email,
"login":{"username":req.body.username,"password":req.body.password},
"dob":req.body.dob,
"registered":Date()}
//once created we just run the data string against the database and all our new data will be saved/
  db.collection('people').save(datatostore, function(err, result) {
    if (err) throw err;
    console.log(JSON.stringify(datatostore));
    //when complete redirect to the index
    res.redirect('/login');
  })
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



  app.get('/about', function(req, res) {
   res.render('pages/about');
  });
  app.get('/contact', function(req, res) {
   res.render('pages/contact');
  });

  app.get('/register', function(req, res) {
   res.render('pages/register');
  });
  app.get('/basket_empty', function(req, res) {
   res.render('pages/basket_empty');
  });
  console.log('.....');
  console.log('All good to go!');
  console.log(' ');
  console.log(' ');
  console.log('Hit CTRL + C to stop the server.');
  console.log(' ');
  console.log(' ');
