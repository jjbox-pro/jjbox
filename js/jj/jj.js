var JJ_Base = function(){};

JJ_Base.prototype.init = function(){};

JJ_Base.prototype.free = function(){};

JJ_Base.prototype.clone = function(){};



var JJ_File = function(nameOrObj, type){
	if( nameOrObj instanceof Object )
		utils.copyProperties(this, nameOrObj);
	else{
		this.name = nameOrObj;
		this.type = type;
	}
	
	this.type = this.type||JJ_File.types.script;
};

utils.inherit(JJ_File, JJ_Base);

JJ_File.types = {
	script: 0,
	stylesheet: 1
};

JJ_File.prototype.getName = function(){
	return this.name;
};

JJ_File.prototype.getType = function(){
	return this.type;
};



var JJ_FileLoader = function(){};

utils.inherit(JJ_FileLoader, JJ_Base);



JJ_FileLoader.initialLlist = [
	new JJ_File('/css/main.css', JJ_File.types.stylesheet),
	new JJ_File('/js/lib/jquery-3.3.1.min.js')
];

JJ_FileLoader.prototype.loadFile = function(file, opt){
	switch(file.getType()){
		case JJ_File.types.script: 
			return this.loadScriptFile.apply(this, arguments);
		case JJ_File.types.stylesheet: 
			return this.loadStylesheetFile.apply(this, arguments);
	}
	
	return this.loadScriptFile.apply(this, arguments);
};

JJ_FileLoader.prototype.loadScriptFile = function(file, opt){
	opt = opt||{};
	
	var script = document.createElement('script');
	script.src = file.getName();
	
	if( opt.async !== undefined )
		script.async = opt.async;
	
	script.onload = function(){
		if( opt.callback )
			opt.callback();
	};
	
	opt.parent = opt.parent||document.head;
	
	opt.parent.appendChild(script);
};

JJ_FileLoader.prototype.loadStylesheetFile = function(file, opt){
	opt = opt||{};
	
	var stylesheet = document.createElement('link');
	stylesheet.href = file.getName();

	stylesheet.setAttribute('rel', 'stylesheet');
	stylesheet.setAttribute('type', 'text/css');

	stylesheet.async = false;
	
	stylesheet.onload = function(){
		if( opt.callback )
			opt.callback();
	};
	
	document.head.appendChild(stylesheet);
};

JJ_FileLoader.prototype.loadFilesList = function(list, opt){
	opt = opt||{};
	
	var count = 0;
	
	for(var file in list){
		file = list[file];
		
		count++;
		
		this.loadFile(file, {callback: function(){
			if( opt.callback && !(--count) )
				opt.callback();
		}});
	}
};



var JJ_Managers = function(){};

utils.inherit(JJ_Managers, JJ_Base);

JJ_Managers.prototype.add = function(name, manager, opt){
	this[name] = manager;
};



var JJ = function(){
	
};

utils.inherit(JJ, JJ_Base);


JJ.prototype.init = function(servData){
	this.servData = servData;
	
	this.initManagers();
	
	this.mgrs.add('fl', new JJ_FileLoader());
	
	this.mgrs.fl.loadFilesList(JJ_FileLoader.initialLlist, {callback: this.onDependenciesLoaded.bind(this)});
};

JJ.prototype.initManagers = function(){
	this.mgrs = new JJ_Managers();
};

JJ.prototype.onDependenciesLoaded = function(){
	$('body').css('background-color', 'black');
	$('body').css('color', 'white');
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