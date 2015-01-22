var database = require('../data/database');

module.exports=function(app)
{
	var playLists_db = database.playLists;
	var videos_db = database.videos;

	app.get('/',function(req,res){
		res.render('index.html', { scripts: ['auth.js'] })
	});

	app.get('/videos', function(req, res) {
	    videos_db.find({}, function(err, videos) {
	      res.send(videos);
	    });
  	});

    app.post('/videos', function(req, res) {
      console.log(req.body);
      createdAt = new Date().getTime();
      videos_db.insert({
      	title: req.body.title,
      	uploader: req.body.author,
      	videoId: req.body.videoId,
      	creationDate: createdAt
      }, function(err, new_video) {
        res.send(new_video)
      });
    });
};
