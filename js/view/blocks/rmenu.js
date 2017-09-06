bRmenu = function(){
    this.name = 'rmenu';
    
	bRmenu.superclass.constructor.apply(this, arguments);
};
	
    utils.extend(bRmenu, Block);
    
    bRmenu.prototype.getChildren = function(){
        this.children = {};
    };