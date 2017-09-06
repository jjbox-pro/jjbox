TmplMgr = function(opt){
	opt = opt||{};
	
	if ( opt.loadTmpl ) TmplMgr.loadTemplates(opt, this);
    
	opt.templates = opt.templates||$('body');
	
    TmplMgr.parseTemplates(opt.templates, this);
};

TmplMgr.loadTemplates = function(opt, tmpls){
	opt = opt||{};
	
	opt.src = opt.src||'/html/templates/main.html';
	
	$.get(opt.src + (opt.version?opt.version:''), function(resp){
		TmplMgr.templatesLoaded($(snip.wrp(resp)), opt, tmpls);
	});
};

TmplMgr.templatesLoaded = function(templates, opt, tmpls){
	TmplMgr.parseTemplates($(templates), tmpls);
	
	if (opt.callback) opt.callback();
};

TmplMgr.parseTemplates = function(el, tmpls){
	$(el).find('script[type="text/plain"]').each(function(){
		var el = $(this),
			pathArr = el.attr('id').split('.'),
			dest = tmpls,
			item;
			
		for (var i = 0; i<pathArr.length; i++){
			item = pathArr[i];
			if (i == pathArr.length-1) break;
			if (!dest[item]) dest[item] = {};
			dest = dest[item];
		}
		dest[item] = $.extend(doT.template(this.innerHTML), dest[item]);
	});
};


