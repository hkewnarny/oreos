var database = require('../data/database');

module.exports=function(app)
{
	var playLists_db = database.playLists;
	var songs_db = database.songs;

	app.get('/',function(req,res){
		res.render('index.html', { scripts: ['auth.js'] })
	});

  app.get('/playLists', function(req, res) {
    playLists_db.find({}).sort({ createdAt: 1 }).exec(function (err, playLists) {
        if(err) {
          console.log("findAllPlayLists Error:");
          console.log(err);
        } else {
          res.send(playLists);
        }
    });
  });

  app.post('/playLists', function(req, res) {
    req.body.createdAt = new Date().getTime();
    playLists_db.insert(req.body, function(err, new_playList) {
      if(err) {
        console.log("add error:");
        console.log(err);
      } else {
        res.send(new_playList)
        console.log(playLists_db.find({}));
      }
    });
  });

  app.post('/removePlayList', function(req, res) {
    playLists_db.remove({ _id: req.body.id }, {}, function (err, numRemoved)  {
      if(err) {
        console.log("remove error: ");
        console.log(err);
      } else {
        console.log("playLists removed: ");
        console.log(numRemoved);
        res.send({numRemoved: numRemoved});
      }
    });
  });

	app.get('/songs', function(req, res) {
    songs_db.find({}).sort({ createdAt: 1 }).exec(function (err, songs) {
        if(err) {
          console.log("findAllSongs Error:");
          console.log(err);
        } else {
          res.send(songs);
        }
    });
  });

  app.post('/songs', function(req, res) {
    req.body.createdAt = new Date().getTime();
    songs_db.insert(req.body, function(err, new_song) {
      if(err) {
        console.log("add error:");
        console.log(err);
      } else {
        res.send(new_song)
        console.log(songs_db.find({}));
      }
    });
  });

  app.post('/removeSong', function(req, res) {
    songs_db.remove({ _id: req.body.id }, {}, function (err, numRemoved)  {
      if(err) {
        console.log("remove error: ");
        console.log(err);
      } else {
        console.log("songs removed: ");
        console.log(numRemoved);
        res.send({numRemoved: numRemoved});
      }
    });
  });
};
