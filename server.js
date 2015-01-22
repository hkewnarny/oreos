var express=require('express'),
    bodyParser = require('body-parser'),
    multer = require('multer');

var app=express();


app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer()); // for parsing multipart/form-data
app.engine('html', require('ejs').renderFile);

require('./router/main')(app);

var server=app.listen(3001,function(){
	console.log("Express is running on port 3001");
});
