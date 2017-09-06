bHeader = function(){
    this.name = 'header';
    
	bHeader.superclass.constructor.apply(this, arguments);
};
	
    utils.extend(bHeader, Block);
    
    bHeader.prototype.getChildren = function(){
        this.children = {};
    };