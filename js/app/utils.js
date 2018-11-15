JJ_Utils = function(){
	
};

// Прототипирование
JJ_Utils.prototype.inherit = function(Child, Parent) {
	var F = function(){};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
	
	// Наследование статичных методов
	for (var i in Parent){
		if( Child[i] === undefined )
			Child[i] = Parent[i];
	}
};
	
// Примесь
JJ_Utils.prototype.mix = function(ChildProto, ParentProto) {
	ChildProto = ChildProto.prototype;
	ParentProto = ParentProto.prototype;

	var childMethods = {};

	for (var key in ChildProto)
		childMethods[key] = true;

	for (var key in ParentProto){
		if( ParentProto.hasOwnProperty(key) && !childMethods[key] ){
			ChildProto[key] = ParentProto[key];
		}
	}
};

JJ_Utils.prototype.loadScript = function(url, opt){
	opt = opt||{};

	var script = document.createElement('script');
	script.src = url;

	if( opt.async !== undefined )
		script.async = opt.async;

	script.onload = function(){
		if( opt.callback )
			opt.callback();
	};

	opt.parent = opt.parent||document.body;

	opt.parent.appendChild(script);
};

JJ_Utils.prototype.loadStylesheet = function(href, opt){
	opt = opt||{};

	var stylesheet = document.createElement('link');
	stylesheet.href = href;

	stylesheet.setAttribute('rel', 'stylesheet');
	stylesheet.setAttribute('type', 'text/css');

	stylesheet.async = false;

	stylesheet.onload = function(){
		if( opt.callback )
			opt.callback();
	};
	
	document.head.appendChild(stylesheet);
};

JJ_Utils.prototype.isArray = function(obj){
	return (obj instanceof Array);
};

JJ_Utils.prototype.sizeOf = function(obj){
	var count = 0, key;
	for(key in obj) ++count;
	
	return count;
};

JJ_Utils.prototype.random = function(n){
	var rnd = Math.random();
	
	if (rnd == 1) rnd = 0;
	
	return utils.toInt(rnd*n);
};

JJ_Utils.prototype.clone = function(obj, opt){
	if( !(obj instanceof Object) ) return obj;
	
	if( obj.clone instanceof Function )
		return obj.clone(opt);
	
	opt = opt||{};
	
	if( obj.__noClone__ )
		return obj;
	
	obj.__noClone__ = true;
	
	var clone = new obj.constructor();
	
	for(var key in obj){
		if( !obj.hasOwnProperty(key) || key == '__noClone__' )
			continue;
		
		if( obj[key] instanceof Object )
			clone[key] = utils.clone(obj[key], opt);
		else
			clone[key] = obj[key];
	}
	
	delete obj.__noClone__;
	
	return clone;
};

/* Форматирование */

JJ_Utils.prototype.toInt = function(val){
	if( Math.abs(val) > 2e9 )
		return val < 0 ? Math.ceil(val) : Math.floor(val);
	else
		return val|0; // Работает быстрее чем ceil и floor, но только с числами не больше 32-х разрядов
},

utils = new JJ_Utils();