var JJ = function(){
	this.mgrs = {};
};


JJ.prototype.init = function(servData){
	this.servData = servData;
	
	this.mgrs.scriptMgr = new ScriptMgr(this.servData.scriptsData);
	
	this.scriptMgr.loadScripts(this.afterInitScriptsLoaded.bind(this));
};

/* 
	Назначение: вызывается после загрузки всех необходимых скриптов.
 */
JJ.prototype.afterInitScriptsLoaded = function(){
	//this.mgrs.tmplMgr = new TmplMgr(this.servData.tmplMgr.data);
	
	//this.mgrs.cntMgr = new CntMgr(this.servData.tmplMgr.data);
};

JJ.prototype.afterDataLoad = function(){
	// Строим страницу приложения
	
	this.mgrs.cntMgr.init();
};

var jj = new JJ();