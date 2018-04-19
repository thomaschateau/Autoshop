var express = require('express');
var app = express();
app.get('/test', function(req, res){
 res.send("Hello world! by express");
});
app.listen(8080);
