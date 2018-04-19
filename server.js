var express = require('express');
app.use(express.static('public'))
var app = express();
app.get('/public', function(req, res){
 res.send("Hello world! by express");
});
app.listen(8080);
