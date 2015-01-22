var Datastore = require('nedb');

var playLists = new Datastore({ filename: '../data/playLists', autoload: true }),
	videos = new Datastore({ filename:  '../data/videos', autoload: true });


videos.ensureIndex({fieldName: 'playListId', unique: true});
videos.ensureIndex({fieldName: 'videoId', unique: true});

module.exports = {
    playLists: playLists,
    videos: videos
};