var express = require('express');
var router = express.Router();


var mongoose = require( 'mongoose' );
var Story = mongoose.model('Story');

/* GET home page. */
router.get('/', function(req, res, next) {

  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var storyName = query['name'];  
  Story.find({name: storyName})
    .populate('tags.images')
    .populate('locationTag.images')
    .exec(function (err, doc) {
    if (err){
      console.log(err);
      res.send(err);
    } else {
      console.log(doc);
      var imageSet = {};
      for(var i = 0; i<doc[0].tags.length; i++) {
        for(var j=0; j<doc[0].tags[i].images.length; j++) {
          imageSet[doc[0].tags[i].images[j].instagramId] = doc[0].tags[i].images[j];
        }
      }
      var images = [];
      for(var key in imageSet) {
        images.push(imageSet[key]);
      }
      console.log(images);
      res.render('gallery', { title: storyName, imageSets: images});
    }    
  });
});

router.get('/map', function(req, res, next) {

  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var storyName = query['name'];  
  Story.find({name: storyName})
    .populate('tags.images')
    .populate('locationTag.images')
    .exec(function (err, doc) {
    if (err){
      console.log(err);
      res.send(err);
    } else {
      console.log(doc);
      var imageSet = {};
      for(var i = 0; i<doc[0].tags.length; i++) {
        for(var j=0; j<doc[0].tags[i].images.length; j++) {
          imageSet[doc[0].tags[i].images[j].instagramId] = doc[0].tags[i].images[j];
        }
      }
      var images = [];
      for(var key in imageSet) {
        images.push(imageSet[key]);
      }
      console.log(images);
      res.render('map', { title: storyName, imageSets: images});
    }    
  });
});



module.exports = router;
