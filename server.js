/*
SAM YOUNG
CS 290
 * Write your Express server in this file as described in README.md.
 */

var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');

var bodyParser = require('body-parser');
var twitData = require('./twitData');
var app = express();
var port = process.env.PORT || 3000;


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());

app.get('/twits', function(req, res, next) {


		var templateArgs = {
      twit: twitData,

		};
		res.render('type', templateArgs);

});

app.get('/twits/:type',function(req,res,next){
	console.log("==url params for req:",req.params);
	var type = req.params.type;
	var data = twitData[type];
	if(data){
		var templateArgs={
			twit: data.twits,
			name: data.name,
			showModal: true
		}
	res.render('twitPage',templateArgs);
	}else{
		next();
	}
});

app.post('/twits/:type/addtwit', function (req, res, next) {
  var type = twitData[req.params.type];

  if (type) {
    if (req.body && req.body.text) {

      var tweet = {
        text: req.body.text,
        author: req.body.author
      };

      type.twits = type.twits || [];

      type.twits.push(tweet);
      fs.writeFile('twitData.json', JSON.stringify(twitData), function (err) {
        if (err) {
          res.status(500).send("Unable to save twit to \"database\".");
        } else {
          res.status(200).send();
        }
      });

    } else {
      res.status(400).send("twit must have text and author.");
    }

  } else {
    next();
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', function(req, res){
	res.status(404).render('404Page');
});
app.listen(port, function () {
  console.log("== Server listening on port", port);
});
