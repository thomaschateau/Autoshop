console.log('Node server by Autograph.');
console.log('Initialising...');
// server.js
// Autograph team, CASD3 2018
// load the things we need
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/autoshopdb";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'))
app.use(session({ secret: 'example' }));
app.use(bodyParser());
//Twitter stuff
var Twitter = require('twitter');
var client = new Twitter({
	consumer_key: 'xzRL5GX9qaV5pjEVcJGspQtEs',
	consumer_secret: 'iIfLl7XCy5iVb0tnO0xavSSl0sUgIZbihWOkWvLvEadCWMDVUE',
	access_token_key: '988939621164863488-k4AfpRzxEAzsvmmF5nTcP2oxouxfqU0',
	access_token_secret: 'e7F9plouL48IrJC14vYT1t6gaDFxeGU7s2RDEwSkdimwT'
});
// Set the engine
app.set('view engine', 'ejs');
var db;
//Connecting to the database
MongoClient.connect(url, function(err, database) {
	if (err) throw err;
	db = database;
	app.listen(8080);
});
// Page management
// Redirect from "/"
app.get('/', function(req, res) {
	res.redirect('/index');
});
// Render api.ejs
app.get('/api', function(req, res) {
	var params = {
		screen_name: 'NodeJS'
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			var json = [];
			for (var i = 0; i < tweets.length; i++) {
				json.push({
					"name": tweets[i].user.name,
					"text": tweets[i].text,
					"location": tweets[i].user.location,
					"url": tweets[i].user.url,
				});
			}
			res.render('pages/api', {
				json: json
			});
		}
	});
});
//Render index.ejs
app.get('/index', function(req, res) {
	db.collection('promotions').find().toArray(function(err, result) {
		if (err) throw err;
		var promotions = [];
		console.log(req.session.username);
		for (var i = 0; i < result.length; i++) {
			promotions.push({
				"sku": result[i].sku,
				"brand": result[i].brand,
				"type": result[i].type,
				"description": result[i].description,
				"btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=promotions" role="button">Buy Now</a></p>',
				"img_holder": '<a href="/itm_promo?sku=' + result[i].sku + '"><img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png"></a>'
			});
			//console.log(path);
		}
		res.render('pages/index', {
			promotions: promotions
		});
	});
});

//Render login.ejs
app.get('/login', function(req, res) {
	res.render('pages/login');
});
// Logout the current user. Redirect to login if not logged
app.get('/logout', function(req, res) {
	if (!req.session.loggedin) {
		res.redirect('/login');
		return;
	}
	req.session.loggedin = false;
	req.session.destroy();
	res.redirect('/login');
});
// Post login. Look for the user in the db
app.post('/dologin', function(req, res) {
	console.log(JSON.stringify(req.body));
	console.log(req.session.username);
	var uname = req.body.username;
	var pword = req.body.password;
	db.collection('people').findOne({
		"login.username": uname
	}, function(err, result) {
		if (err) throw err;
		//Redirect if the user doesnt exist
		if (!result) {
			res.redirect('/login');
			return;
		}
		//Check the password if the user exists
		if (result.login.password == pword) {
			req.session.loggedin = true;
			req.session.username = uname;
			res.render('pages/profile', {
				user: result
			});
		}
		//Otherwise send them back to login
		else {
			res.redirect('/login')
		}
	});
});
// Render user profile page
app.get('/profile', function(req, res) {
	var uname = req.session.username;
	db.collection('people').findOne({
		"login.username": uname
	}, function(err, result) {
		if (err) throw err;
		if (!result) {
			res.redirect('/login');
			return;
		}
		res.render('pages/profile', {
			user: result
		});
	});
});
// Get the data from the register form and stuff it in the db
app.post('/adduser', function(req, res) {
	var datatostore = {
		"name": {
			"first": req.body.first,
			"last": req.body.last
		},
		"location": {
			"street": req.body.street,
			"city": req.body.city,
			"postcode": req.body.postcode
		},
		"email": req.body.email,
		"login": {
			"username": req.body.username,
			"password": req.body.password
		},
		"dob": req.body.dob,
		"registered": Date()
	}
	//Stuff the data
	db.collection('people').save(datatostore, function(err, result) {
		if (err) throw err;
		console.log(JSON.stringify(datatostore));
		//And redirect to login
		res.redirect('/login');
	})
});
//Render trousers.ejs
app.get('/trousers', function(req, res) {
	db.collection('trousers').find().toArray(function(err, result) {
		if (err) throw err;
		var trousers = [];
		for (var i = 0; i < result.length; i++) {
			trousers.push({
				"sku": result[i].sku,
				"brand": result[i].brand,
				"type": result[i].type,
				"description": result[i].description,
				"btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=trousers" role="button">Buy Now</a></p>',
				"img_holder": '<a href="/itm_trousers?sku=' + result[i].sku + '"><img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png"></a>'
			});
			//console.log(path);
		}
		res.render('pages/trousers', {
			trousers: trousers
		});
	});
});
//Render single trousers
app.get('/itm_trousers', function(req, res) {
	//console.log(req.query.sku);
	db.collection('trousers').find({
		sku: req.query.sku
	}).toArray(function(err, result) {
		if (err) throw err;
		var search = [];
		for (var i = 0; i < result.length; i++) {
			search.push({
				"sku": result[i].sku,
				"brand": result[i].brand,
				"type": result[i].type,
				"description": result[i].description,
				"path": "/" + result[i].sku + ".png",
				"colour": result[i].colour,
				"quantity": result[i].quantity,
				"price": result[i].price,
				"btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=trousers" role="button">Buy Now</a></p>',
				"img_holder": '<img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png">'
			});
		}
		res.render('pages/itm_trousers', {
			search: search
		});
	});
});
//Render promo item list
app.get('/promotions', function(req, res) {
	db.collection('promotions').find().toArray(function(err, result) {
		if (err) throw err;
		var promotions = [];
		for (var i = 0; i < result.length; i++) {
			promotions.push({
				"sku": result[i].sku,
				"brand": result[i].brand,
				"type": result[i].type,
				"description": result[i].description,
				"btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=promotions" role="button">Buy Now</a></p>',
				"img_holder": '<a href="/itm_promo?sku=' + result[i].sku + '"><img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png"></a>'
			});
			//console.log(path);
		}
		res.render('pages/promotions', {
			promotions: promotions
		});
	});
});
//Render single promotion item
app.get('/itm_promo', function(req, res) {
	//console.log(req.query.sku);
	db.collection('promotions').find({
		sku: req.query.sku
	}).toArray(function(err, result) {
		if (err) throw err;
		var search = [];
		for (var i = 0; i < result.length; i++) {
			search.push({
				"sku": result[i].sku,
				"brand": result[i].brand,
				"type": result[i].type,
				"description": result[i].description,
				"path": "/" + result[i].sku + ".png",
				"colour": result[i].colour,
				"quantity": result[i].quantity,
				"price": result[i].price,
				"btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=promotions" role="button">Buy Now</a></p>',
				"img_holder": '<img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png">'
			});
		}
		res.render('pages/itm_promo', {
			search: search
		});
	});
});
console.log('....');
//Render all tshirts
app.get('/tshirts', function(req, res) {
	db.collection('tshirts').find().toArray(function(err, result) {
		if (err) throw err;
		var tshirts = [];
		for (var i = 0; i < result.length; i++) {
			tshirts.push({
				"sku": result[i].sku,
				"brand": result[i].brand,
				"type": result[i].type,
				"description": result[i].description,
				"btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=tshirts" role="button">Buy Now</a></p>',
				"img_holder": '<a href="/itm_tshirt?sku=' + result[i].sku + '"><img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png"></a>'
			});
			//console.log(path);
		}
		res.render('pages/tshirts', {
			tshirts: tshirts
		});
	});
});
//Single tshirt details
app.get('/itm_tshirt', function(req, res) {
	//console.log(req.query.sku);
	db.collection('tshirts').find({
		sku: req.query.sku
	}).toArray(function(err, result) {
		if (err) throw err;
		var search = [];
		for (var i = 0; i < result.length; i++) {
			search.push({
				"sku": result[i].sku,
				"brand": result[i].brand,
				"type": result[i].type,
				"description": result[i].description,
				"path": "/" + result[i].sku + ".png",
				"colour": result[i].colour,
				"quantity": result[i].quantity,
				"price": result[i].price,
				"btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=tshirts" role="button">Buy Now</a></p>',
				"img_holder": '<img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png">'
			});
		}
		res.render('pages/itm_tshirt', {
			search: search
		});
	});
});
//Render shoes.ejs
app.get('/shoes', function(req, res) {
	db.collection('shoes').find().toArray(function(err, result) {
		if (err) throw err;
		var shoes = [];
		for (var i = 0; i < result.length; i++) {
			shoes.push({
				"sku": result[i].sku,
				"brand": result[i].brand,
				"type": result[i].type,
				"description": result[i].description,
				"btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=shoes" role="button">Buy Now</a></p>',
				"img_holder": '<a href="/itm_shoes?sku=' + result[i].sku + '"><img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png"></a>'
			});
			//console.log(path);
		}
		res.render('pages/shoes', {
			shoes: shoes
		});
	});
});
//Render single shoes item
app.get('/itm_shoes', function(req, res) {
	//console.log(req.query.sku);
	db.collection('shoes').find({
		sku: req.query.sku
	}).toArray(function(err, result) {
		if (err) throw err;
		var search = [];
		for (var i = 0; i < result.length; i++) {
			search.push({
				"sku": result[i].sku,
				"brand": result[i].brand,
				"type": result[i].type,
				"description": result[i].description,
				"path": "/" + result[i].sku + ".png",
				"colour": result[i].colour,
				"quantity": result[i].quantity,
				"price": result[i].price,
				"btn_holder": '<p><a class="btn btn-primary" href="/basket?sku=' + result[i].sku + '&col=shoes" role="button">Buy Now</a></p>',
				"img_holder": '<img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png">'
			});
		}
		res.render('pages/itm_shoes', {
			search: search
		});
	});
});
//Render basket
app.get('/basket', function(req, res) {
	if (!req.session.loggedin) {
		res.redirect('/login');
		return;
	}
	db.collection(req.query.col).find({
		sku: req.query.sku
	}).toArray(function(err, result) {
		if (err) throw err;
		var search = [];
		for (var i = 0; i < result.length; i++) {
			search.push({
				"sku": result[i].sku,
				"brand": result[i].brand,
				"type": result[i].type,
				"description": result[i].description,
				"path": "/" + result[i].sku + ".png",
				"colour": result[i].colour,
				"quantity": result[i].quantity,
				"price": result[i].price,
				"img_holder": '<a class="thumbnail pull-left" href="#"> <img class="media-object" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png" style="width: auto; height: 72px;"></a>'
			});
		}
		res.render('pages/basket', {
			search: search
		});
	});
});
//Render about.ejs
app.get('/about', function(req, res) {
	res.render('pages/about');
});
//Render contact.ejs
app.get('/contact', function(req, res) {
	res.render('pages/contact');
});
//Render register.ejs
app.get('/register', function(req, res) {
	res.render('pages/register');
});
//Render basket_empty.ejs
app.get('/basket_empty', function(req, res) {
	res.render('pages/basket_empty');
});
//Show fancy stuff
console.log('.....');
console.log('All good to go!');
console.log(' ');
console.log(' ');
console.log('Hit CTRL + C to stop the server.');
console.log(' ');
console.log(' ');
