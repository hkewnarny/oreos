var express = require('express'),
    bodyParser = require('body-parser'),
    multer = require('multer');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3001;

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer()); // for parsing multipart/form-data
app.engine('html', require('ejs').renderFile);

require('./router/main')(app);

server.listen(port, function(){
	console.log("Express is running on port %d", port);
});

io.on('connection', function (socket) {
	socket.on('pauseSong', function (data) {
	    // Tell the client to execute 'pauseSong'
	    io.emit('pauseSong', {
	      username: socket.username,
	      message: data
    	});
  	});

  	socket.on('playSong', function (data) {
	    // Tell the client to execute 'playSong'
	    io.emit('playSong', {
	      username: socket.username,
	      message: data
    	});
  	});
});