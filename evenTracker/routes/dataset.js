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
    .populate('tags.images', '-rawData')
    .populate('locationTag.images', '-rawData')
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
      res.json({ story: storyName, imageData: images });
      /*var data = [];
      for(var k=0; k<images.length; k++) {
        if(images[k].latitude != null) {
        var outputPair = "(" + images[k].createTime.getHours()+":"+images[k].createTime.getMinutes()+":"+images[k].createTime.getSeconds() + "), [" + images[k].latitude + ", " + images[k].longitude + "])"; 
        data.push(outputPair);
      }
      }
      console.log(data);
      //res.render('map2', { title: storyName, lat: latInfo, lon: longInfo});
      res.send('ok');*/
      //console.log(imageSet);
      //res.send('ok');
    }    
  });
});


module.exports = router;
