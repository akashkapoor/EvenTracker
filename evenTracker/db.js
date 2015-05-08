var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 

var InstaDataSchema = new Schema({
    instagramId     : {type: String, unique: true},
    localPath       : String,
    createTime      : Date,
    url             : String,
    caption         : String,
    commentCount    : Number,
    likesCount      : Number,
    instaLink       : String,
    latitude        : String,
    longitude       : String,
    rawData         : Schema.Types.Mixed
});

var StorySchema = new Schema({
	name 			       : {type: String, unique: true},
	createTime  	       : Number,
	startTime              : Number,
    collectionStartTime    : Number,
    endTime                : Number,
    collectionOn           : Boolean,
    tags 			       : [{
                                name    : String,
                                images  : [{ type: Schema.ObjectId, unique: true, dropDups: true, ref: 'InstaData' }]
                            }],
    locationTag 	       : [{ 
                                latitude     : String,
                                longitude   : String,
                                distance    : String,
                                images      : [{ type: Schema.ObjectId, unique: true, dropDups: true, ref: 'InstaData' }]
                            }]
});

var InstaData = mongoose.model( 'InstaData', InstaDataSchema ); 
var Story = mongoose.model('Story', StorySchema);

mongoose.connect( 'mongodb://localhost/evenTracker' );