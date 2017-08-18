var http=require('http');
var app=require('./app');
http.createServer(app.onRequest).listen(8000);