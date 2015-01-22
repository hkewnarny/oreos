var database = require('../data/database');

module.exports=function(app)
{
	var playLists_db = database.playLists;
	var songs_db = database.songs;

	app.get('/',function(req,res){
		res.render('index.html', { scripts: ['auth.js'] })
	});

	app.get('/songs', function(req, res) {
	    songs_db.find({}, function(err, songs) {
        if(err) {
          console.log("findAll Error:");
          console.log(err);
        } else {
          res.send(songs);
        }
	    });
  	});

  app.post('/songs', function(req, res) {
    //console.log(req.body);
    //console.log("full db: ");
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
};
