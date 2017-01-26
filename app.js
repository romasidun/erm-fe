var express = require('express');

var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/', function(req, res, next) {
  //Path to your main file
  res.status(200).sendFile(path.join(__dirname+'./public/index.html')); 
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);