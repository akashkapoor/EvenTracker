var express = require('express')
  , router = express.Router()
  , ImageMeta = require('./imageMeta')

var c_id = '008d18f70616460789e708a19b1b4c21',
	c_secret = 'deaceb7a1272478caf055dd87136c738';

var ig = require('instagram-node').instagram();

var mongoose = require( 'mongoose' );
var LocationTag = mongoose.model('LocationTag');
var Tag = mongoose.model('Tag');
var Story = mongoose.model('Story');

ig.use({ client_id: c_id,
         client_secret: c_secret });

var mediaHandler = function(medias) {
	var lastSeenDB = 142975500;
	var earliestSeenInsta = Math.floor(new Date()/1000)+(3600*24)
	var latestSeenInsta = 0
	for (var i = 0, len = medias.length; i<len; i++) {
		var thiM = new ImageMeta(medias[i]);
		thiM.consoleLog();
		console.log("**\n");
		console.log(tag);
		if(thiM.createTime < earliestSeenInsta) {
			earliestSeenInsta = thiM.createTime;
		}
		if(thiM.createTime > latestSeenInsta) {
			latestSeenInsta = thiM.createTime;
		}
	}
	if(lastSeenDB < earliestSeenInsta) {
		return true;
	} else {
		return false;		
	}
};


router.get('/', function(req, res, next) {
	var tagMediaResponseHandler = function(err, medias, pagination, remaining, limit) {
		var goAhead = mediaHandler(medias);
		if(goAhead == true && pagination.next) {
		    pagination.next(tagMediaResponseHandler);
		} else {
			res.render('index', { title: 'Bosss' });		
		}
	};
	ig.tag_media_recent('party', tagMediaResponseHandler);
});

module.exports = router