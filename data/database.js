var Datastore = require('nedb');

var playLists = new Datastore({ filename: __dirname + 'playLists', autoload: true }),
	songs = new Datastore({ filename:  __dirname + 'songs', autoload: true });

playLists.insert({name: "mylist", creationDate: "123"}, function(err, newdoc) {
	if(err) {
		console.log("fucking error");
		console.log(err);
	} else {
		console.log(newdoc);
	}
});

playLists.find({}, function(err, data) {
	console.log(data);
});

module.exports = {
    playLists: playLists,
    songs: songs
};