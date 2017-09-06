bIntro = function(){
    this.name = 'intro';
    
	bIntro.superclass.constructor.apply(this, arguments);
};
	
    utils.extend(bIntro, Block);
    
    bIntro.prototype.getChildren = function(){
        this.children = {};
    };
	
	bIntro.prototype.bindEvent = function(){
		var self = this;
		
		plug.initImgGallery(this, 'intro', '', {needWaitContent:true})
	};
	
	bIntro.prototype.toggleDisplay = function(show){
		this.constructor.superclass.toggleDisplay.apply(this, arguments);
		
		plug.toggleImgAutoScrolling(this, show);
	};