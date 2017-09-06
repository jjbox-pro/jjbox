bFooter = function(){
    this.name = 'footer';
    
	bFooter.superclass.constructor.apply(this, arguments);
};
	
    utils.extend(bFooter, Block);
    
    bFooter.prototype.getChildren = function(){
        this.children = {};
    };