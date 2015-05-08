var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var Story = mongoose.model('Story');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('createStory', { title: 'Create Story.' });
});

router.get('/process', function(req, res, next) {
  //res.send("SSup");
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var name = query['name'];
  var tag1 = query['tag1'];
  var tag2 = query['tag2'];
  var lat = query['lat'];
  var lon = query['lon'];
  var dist = query['dist'];
  var start = query['start'];
  var end = query['end'];

  errors = [];
  success = true;
  if(!name || name.length < 2) {
  	errors.push("Story name too short.");
  	success = false;
  } 
  if(!tag1 || tag1.length < 1) {
  	success = false;
  	errors.push("At least 1 tag required.");
  }

  var locationPresent = -1;
  if(lat && lon && dist) {
  	locationPresent = 1;
  } else if(!lat && !lon && !dist) {
  	locationPresent = 0;
  } else {
  	success = false;
  	errors.push("Invalid GPS specification.");
  }

  console.log(name);
  console.log(tag1);
  console.log(tag2);
  console.log(lat);
  console.log(lon);
  console.log(dist);
  console.log(start);
  console.log(end);
  if(success == true) {
	  var story = new Story({
	   	name 			       : name,
		  createTime  	       : Date.now()/1000,
		  startTime              : start,
	    collectionStartTime    : start,
	    endTime                : end,
	    collectionOn           : true
	  });
	  story.tags.push({ name: tag1, images: []});
	  story.tags.push({ name: tag2, images: []});
	  story.locationTag.push({ latitude: lat, longitude: lon, distance: dist, images: [] });
	  story.save(function (err) {
	  	if(!err) {
	  		res.render('createStoryResult', { title: 'Create Story Response.', msgs: ["Story created successfully."], status: "Success!" });
	  	} else {
	  		errors.push(err);
	  		res.render('createStoryResult', { title: 'Create Story Response.', msgs: errors, status: "Failed!"});
	  	}
	  });
  } else {
  	res.render('createStoryResult', { title: 'Create Story Response.', msgs: errors, status: "Failed!" });
  }
});


module.exports = router;
