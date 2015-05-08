var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var Story = mongoose.model('Story');


module.exports = function (app) {
    app.use('/cars', require('./cars'));
};

/* GET home page. */
router.get('/', function(req, res, next) {
  Story.find().lean().exec(function(err, docs) {
  	console.log(docs);
  	res.render('index', { title: 'Express', stories: docs});
  });
});

/* GET home page. */
//router.post('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//s});


module.exports = router;
