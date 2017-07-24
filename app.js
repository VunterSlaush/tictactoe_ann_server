'use strict';
const PORT = 4446;
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var server = require('http').createServer(app).listen(PORT);
var network = require('./network');
var localIp;
//var portName = process.argv[2]; // 2do argumento de la llamada!


app.set('superSecret', 'mmm');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(err, req, res, next) { // Acciones en caso de un error inesperado del parseo!
  console.error(err.stack);
  res.status(500).json({success:false, m:"Error Desconocido"});
});

app.get('/', function(req, res)
{
    res.sendFile(__dirname + '/index.html');
});

app.post('/play', function (req,res)
{
  res.json({result:network.play(req.body.game)});
});

app.post('/train',function (req,res)
{
  if(req.body.key && req.body.key == "MOTA RULES")
  {
    network.train(req.body.game, req.body.target,res);
  }
  else {
    res.json({success:false});
  }
});
