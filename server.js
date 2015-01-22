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

var users = {};

io.on('connection', function (socket) {
	socket.on('pauseSong', function (data) {
	    // Tell the client to execute 'pauseSong'
	    io.emit('pauseSong', data);
  	});

  	socket.on('playSong', function (data) {
	    // Tell the client to execute 'playSong'
	    io.emit('playSong', data);
  	});

  	socket.on('selectSong', function (data) {
	    // Tell the client to execute 'selectSong'
	    io.emit('selectSong', data);
  	});

  	socket.on('startSong', function (data) {
	    // Tell the client to execute 'startSong'
	    io.emit('startSong', data);
  	});


  	socket.on('updatePlaylist', function (data) {
	    // Tell the client to execute 'updatePlaylist'
	    io.emit('updatePlaylist');
  	});

  	socket.on('updateListOfPlaylists', function (data) {
	    // Tell the client to execute 'updateListOfPlaylists'
	    io.emit('updateListOfPlaylists');
  	});

  	socket.on('userJoin', function(data) {
  		console.log(socket.id + " JOINED!");
  		users[socket.id] = 1;
		console.log("current users: " + JSON.stringify(users));
  		// if (playlistsToUsers[data].length != 0) {
  		// 	//Get first info from first user on playlist
  		// 	var existingUser = playlistsToUsers[data][0];
  		// 	io.sockets.socket(existingUser).emit('updateCurrentSong', data);

  		// 	io.emit('syncToSong', {
  		// 		playlist: data,
  		// 		song: playlistsToSongs[data]
  		// 	});
  		// } else {
  		// 	playlistsToUsers[data].push(socket.id);
  		// }
  	});

  	socket.on('updateCurrentSong', function(data) {

  	});

  	socket.on('userLeave', function(data) {
  		console.log(socket.id + " LEFT!");
  		delete users[socket.id];
		console.log("current users: " + JSON.stringify(users));
  	});
});