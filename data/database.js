var Datastore = require('nedb');

var playLists = new Datastore({ filename: 'playLists', autoload: true }),
	songs = new Datastore({ filename:  __dirname + 'songs', autoload: true });



//videos.ensureIndex({fieldName: 'playListId', unique: true});
//videos.ensureIndex({fieldName: 'videoId', unique: true});
songs.insert({title: "none", uploader: "none", songId: "none", creationDate: "123"}, function(err, newdoc) {
	if(err) {
		console.log("fucking error");
		console.log(err);
	} else {
		console.log(newdoc);
	}

});

songs.find({}, function(err, data) {
	console.log(data);
});

module.exports = {
    playLists: playLists,
    songs: songs
};