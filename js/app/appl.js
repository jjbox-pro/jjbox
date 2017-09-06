function Appl(){}

Appl.prototype.init = function(data){
	var self = this;
	
	info.init(data);
	
	this.checkDevice();
	
	this.waiting = 0;
	
	this.waiting++;
	
	tmplMgr = new TmplMgr({
		loadTmpl: true,
		callback: function(){self.onLoad();},
		templates: $('.body-cont'),
		version: data.version
	});
	
	//setTimeout(function(){if(self.waiting!=0)self.toggleLoader(true);}, 3000);
};

Appl.prototype.onLoad = function(){
	if ( --this.waiting != 0 ) return;
	
	cntMgr = (new CntMgr()).init();
	
	new iMainPage();
	
	snip = $.extend(snip, tmplMgr.snipet);
	
	cntMgr.tryShowInterface('mainPage');
	
	appl.inited = true;  
};

Appl.prototype.reload = function(){
	$(document).find('body').fadeOut(200, function(){
		Appl.reloadNow();
	});
};

Appl.prototype.reloadNow = function(){
	location.reload();
};

Appl.prototype.checkDevice = function(){
	appl.isMobileDevice = device.mobile();
	if( appl.isMobileDevice ){
		$(document).find('body').addClass('-device-mobile');
	}
};

Appl.prototype.cnst = {
	protocol: 'http:'
};

appl = new Appl();