var ImageMeta = function (media) {
	if(!media) {
		return;
	}
	
	this.instaId = media['id'];
	this.createTime = media['created_time'];
	this.url = media['images']['standard_resolution']['url'];
	if(media['caption'] != null){
		this.caption = media['caption']['text'];	
	} else {
		this.caption = null;
	}
	this.commentCount = media['comments']['count'];
	this.likesCount = media['likes']['count'];
	this.instaLink = media['link'];
	if(media['location'] != null) {
		this.lat = media['location']['latitude'];
		this.lon = media['location']['longitude'];		
	} else {
		this.lat = null;
		this.lon = null;
	}
};

ImageMeta.prototype.consoleLog = function() {
	console.log(this.instaId);
	console.log(this.createTime);
	console.log(this.url);
	console.log(this.caption);
	console.log(this.commentCount);
	console.log(this.likesCount);
	console.log(this.instaLink);
	console.log(this.lat);
	console.log(this.lon);
};

module.exports = ImageMeta;