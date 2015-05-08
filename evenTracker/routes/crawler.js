var express = require('express');
var router = express.Router();
var ImageMeta = require('./imageMeta');

var sleep = require('sleep');

var mongoose = require( 'mongoose' );
var Story = mongoose.model('Story');
var InstaData = mongoose.model('InstaData');

var insta_id = 'f462dd5e5fa5473bab9023d342669fa9',
	insta_secret = '38df46b64577463ca80488935beb567b';

var ig = require('instagram-node').instagram();
ig.use({ client_id: insta_id,
         client_secret: insta_secret });

/* GET home page. */
router.get('/', function(req, res, next) {
  // Crawl all collectionOn stories.
  Story.find({ collectionOn: true, collectionStartTime:{$lte: Date.now()/1000}})
    .populate('tags.images')
    .populate('location.images')
    .exec(function (err, stories) {
    if (err){
    	console.log(err);
    }
    for(var i=0; i<stories.length; i++){
    	console.log(stories[i]);
    	crawlStory(stories[i]);
    }
  });
  res.send("OK");
});

var crawlStory = function(story) {
  for (var i = 0; i < story.tags.length; i++) {
    var earliestImage = 14300316000;
    var latestImage = story.startTime;

    for(var j=0; j<story.tags[i].images.length; j++) {
      var thiM = new ImageMeta(story.tags[i].images[j].data);
      if(thiM.createTime > latestImage) {
        latestImage = thiM.createTime;
      }
      if(thiM.createTime < earliestImage) {
        earliestImage = thiM.createTime;
      }
    }
    // if((Date.now()/1000)-story.endTime > (3600*5)) {
    //   crawlTag(story, i, latestImage, story.endTime);
    //   //story.collectionOn = false;
    // } else 
    if(earliestImage < story.startTime && latestImage > story.endTime) {
      story.collectionOn = false;
      story.save();
    }
    else{
      crawlTag(story, i, latestImage, story.endTime);
    }
  };
};

var crawlTag = function(story, tagIdx, startTime, endTime) {	
  console.log("Crawling: " + String(story.tags[tagIdx].name) + " - " + String(startTime) + "-" + String(endTime));
	var tagMediaResponseHandler = function(err, medias, pagination, remaining, limit) {
		var goAhead = true;
    if(err) {
      console.log(err);
      return;
    }
    if(!medias) {
      return;
    }
		for(var i=0; i<medias.length; i++) {
      var thiM = new ImageMeta(medias[i]);
      thiM.consoleLog();
      var addAnOld = false;
      var addAnExtra = true;
      if(thiM.createTime < startTime) {
        goAhead = false;
        if(addAnOld == false) {
          addAnOld = true;
          storeImage(story, tagIdx, thiM, medias[i]);
        }
      } 
      else if(thiM.createTime > endTime && addAnExtra==false) {
        addAnExtra = true;
        storeImage(story, tagIdx, thiM, medias[i]);
      }
      else if(thiM.createTime < endTime) {
        storeImage(story, tagIdx, thiM, medias[i]);
      }
    }
    // Check if need to continue.
    if(goAhead == true && pagination.next) {
      sleep.sleep(2);
		  pagination.next(tagMediaResponseHandler);
		}
	};
  // Start collection on Instagram for the tag.
	console.log("calling tag media recent " + story.tags[tagIdx].name);
  var blah = ig.tag_media_recent(story.tags[tagIdx].name, tagMediaResponseHandler);
  console.log(blah);
}

var storeImage = function (story, tagIdx, thiM, media) {
  var newInstaData = new InstaData({
    instagramId: thiM.instaId,
    createTime      : new Date(thiM.createTime*1000),
    url             : thiM.url,
    caption         : thiM.caption,
    commentCount    : thiM.commentCount,
    likesCount      : thiM.likesCount,
    instaLink       : thiM.instaLink,
    latitude        : thiM.lat,
    longitude       : thiM.lon,
    data: media
  }); 

  newInstaData.save(function (err){
    if(err) {
      InstaData.findOne({instagramId: thiM.instaId}, function(err, instaData) {
        if(!err) {
          if(instaData == null) {
            console.log("InstaData NuLL for duplicate");
          } else {
            story.tags[tagIdx].images.push(instaData._id);
            story.save(function(err) {
              if(err)
                console.log(err);
            });    
          }
        } else {
          console.log(err);
        }
      });
      console.log(err);
    } else {
      story.tags[tagIdx].images.push(newInstaData._id);
      story.save(function(err) {
        if(err)
          console.log(err);
      });
    }
  });
}

module.exports = router;
