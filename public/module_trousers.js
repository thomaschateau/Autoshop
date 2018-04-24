app.get('/trousers', function(req, res) {
  db.collection('trousers').find().toArray(function(err, result) {
  if (err) throw err;
  var trousers = [];
  for (var i = 0; i < result.length; i++) {
    trousers.push({"sku": result[i].sku,
     "brand": result[i].brand,
      "type": result[i].type,
      "description": result[i].description,
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
               "img_holder": '<img class="card-img-top" src="../' + result[i].sku + '.png" alt="' + result[i].sku + '.png">'});
  }
res.render('pages/itm_trousers', { search: search });
});
});
