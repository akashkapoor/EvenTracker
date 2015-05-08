var express = require('express')
  , router = express.Router()

router.get('/', function(req, res, next) {
	res.render('create', { title: 'Bosss' });
});
var mongoose = require( 'mongoose' );
var LocationTag = mongoose.model('LocationTag');
var Tag = mongoose.model('Tag');
var Story = mongoose.model('Story');

router.get('/process', function(req, res, next) {
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

	console.log(name);
	console.log(tag1);
	console.log(tag2);
	console.log(lat);
	console.log(lon);
	console.log(dist);
	console.log(start);
	console.log(end);

	var success = true;
	var error = "";
	if(!name || name.length < 2) {
		error = "Story name too short.";
		success = false;
	} else if(!tag1 || tag1.length < 1) {
		success = false;
		error = "At least 1 tag required.";
	}

	var locationPresent = -1;
	if(lat && lon && dist) {
		locationPresent = 1;
	} else if(!lat && !lon && !dist) {
		locationPresent = 0;
	} else {
		error = "Invalid GPS specification.";
	}
	var sDate = new Date(start*1000);
	var eDate = new Date(end*1000);

	var story = new Story({
		name: name,
		startTime: sDate,
		endTime: eDate
	});
	story.save(function (err) {
		if(!err) {
			tagInserter(res, name, tag1);
			if(tag2){
				tagInserter(res, name, tag2);
			}
			renderPage(res, true, "");
		} else {
			console.log(err);
			renderPage(res, false, "Unable to save story.");
		}
	});

	/*var location = new LocationTag({
		latitude 	: lat,
   	 	longitude 	: lon,
    	distance	: dist
	});
	location.save(function (err) {
		if(!err) {
			//renderPage(res, true, "");
			
		} else {
			console.log(err);
			renderPage(res, false, "Unable to save location.");
		}
	});*/	
});

var tagInserter = function(res, storyName, tag) {
	Tag.find({name: tag}, function (err, docs) {
		if(docs.length) {
			console.log(tag + "already exists.");
		} else {
			var keyword1 = new Tag({
				name: tag
			});
			keyword1.save(function(err){
				if(!err) {
					Story.find({name:storyName}, function(err, docs) {	
						if(docs.length) {
							docs[0].tags.push(keyword1._id);
							docs[0].save(function (err) {});
						} else {
							console.log("Story NOT FOUND.");
						}
					});
				} else {
					console.log(err);
					renderPage(res, false, "Unable to save tag 1.");
				}
			});
		}
	});
};


var renderPage = function(res, success, error) {
	var title = "";
	var heading = "";

	if (success == false) {
		title = "Story Creation Failed!";
		heading = "Unable to create the story.";
	} else {
		title = "Story Creation Successful!";
		heading = "The story was successfully created.";
	}
	res.render('createResponse', { title: title, heading: heading, error: error });
};

module.exports = router