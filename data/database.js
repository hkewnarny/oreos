var Datastore = require('nedb');

var playLists = new Datastore({ filename: __dirname + 'playLists', autoload: true }),
	songs = new Datastore({ filename:  __dirname + 'songs', autoload: true });

playLists.find({}, function(err, data) {
	console.log(data);
});

module.exports = {
    playLists: playLists,
    songs: songs
};