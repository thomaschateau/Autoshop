// // index page
// app.get('/', function(req, res) {
// res.render('pages/index');
// });
// index page
app.get('/', function(req, res) {
 var drinks = [
 { name: 'Bloody Mary', drunkness: 3 },
 { name: 'Martini', drunkness: 5 },
 { name: 'Scotch', drunkness: 10 }
 ];
 var tagline = "Any code of your own that you havent looked at for six or more months might as well have been written by someone else.";
 res.render('pages/index', {
 drinks: drinks,
 tagline: tagline
 });
});
