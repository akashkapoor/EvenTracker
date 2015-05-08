var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var Story = mongoose.model('Story');


/* GET home page. */
router.get('/', function(req, res, next) {
  Story.find({})
    .populate('tags.images')
    .populate('locationTag.images')
    .exec(function (err, docs) {
    if (err){
    	console.log(err);
    } else {
    	res.render('index', { title: 'evenTracker', stories: docs});
    }
    
  });
});


module.exports = router;
