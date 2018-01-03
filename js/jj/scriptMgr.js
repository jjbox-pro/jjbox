function ScriptMgr(data){
	this.jj = jj;
	
	this.scriptsArr = data.scriptsArr;
};

ScriptMgr.prototype.loadScripts = function(callback){
	//... загрузка скриптов
	
	if( callback ) callback();
};