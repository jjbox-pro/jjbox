var JJ_Base = function(){};

JJ_Base.prototype.init = function(){};

JJ_Base.prototype.free = function(){};

JJ_Base.prototype.clone = function(){};



var JJ_FileLoader = function(){};

JJ_FileLoader.initialLlist = [
	{name: '/js/app/utils.js'}
];

JJ_FileLoader.prototype.loadFile = function(name, opt){
	opt = opt||{};

	var script = document.createElement('script');
	script.src = name;

	if( opt.async !== undefined )
		script.async = opt.async;

	script.onload = function(){
		if( opt.callback )
			opt.callback();
	};

	opt.parent = opt.parent||document.head;

	opt.parent.appendChild(script);
};

JJ_FileLoader.prototype.loadFilesList = function(list){
	for(var file in list){
		file = list[file];
		
		this.loadFile(file.name, file);
	}
};



var JJ = function(){
	
};

JJ.prototype.preInit = function(){
	var fileLoader =  new JJ_FileLoader();
	
	fileLoader.loadFilesList(JJ_FileLoader.initialLlist);
};

JJ.prototype.init = function(servData){
	this.servData = servData;
	
//	this.mgrs.scriptMgr = new ScriptMgr(this.servData.scriptsData);
//	
//	this.scriptMgr.loadScripts(this.afterInitScriptsLoaded.bind(this));
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

jj.preInit();