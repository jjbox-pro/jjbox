/*********************
 * Менеджер контента *
 ********************/

CntMgr = function(){
	var self = this;
	
	this.body = $('body');
	this.window = $(window);
	
	this.list = []; // Cписок ресурсов (блоков с контентом)
	this.cont;
    this.interfaces = {};//список интерфейсов
	
	this.init = function(){
		this.setWrp();
		
		this.startWaitContent();
		
		return this;
	};
    
	this.setWrp = function(){
		this.wrp = this.body.find('.body-cont-wrp');
        this.cont = this.wrp.find('.body-cont');
        if(this.cont.length == 0){
            this.cont = this.wrp;
        }
	};
	
	this.startWaitContent = function(){
		var self = this;
		
		this.contentWaiting = 0;
		
		this.preloaderTimeout = setTimeout(function(){
			self.wrp.append(tmplMgr.preloader());
			self.wrp.find('.preloader-wrp').fadeIn();
		}, 2000);
	};
	
	this.waitContent = function(){
		this.contentWaiting++;
	};
	
    this.addInterface = function(interface){
        this.interfaces[interface.name] = interface;
        interface.parent = this;
    }

    this.showInterface = function(ifName, ifId){
        if (this.interface) {
        	this.interface.removeNotif();
            this.interface.remove();
            this.list = [];
        }
        this.interface = this.interfaces[ifName];
        this.interface.setId(ifId);
        this.interface.show();
    }

	this.tryShowInterface = function(ifName, ifId){
		var interface = this.interfaces[ifName];
		if (interface.shouldShow()) {
			this.showInterface(ifName, ifId);
		}
	};
    
	this.showContent = function(){
		if( --this.contentWaiting != 0 || this.contentLoaded ) return;
		
		var self = this;
		
		this.contentLoaded = true;
		
		clearTimeout(this.preloaderTimeout);
		
		this.cont.addClass('-cont-loaded');
		this.wrp.find('.preloader-wrp').fadeOut(1000, function(){
			self.wrp.find('.preloader-wrp').remove();
		});
	};
};