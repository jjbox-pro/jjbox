snip = {
	nobr: function(text, tag, cls){
		return snip.wrp('tst-nobr ' + (cls||''), text, tag||'div');
	},
    
	wrp: function(text, tag, cls){
        tag = tag||'span';
		
		return '<'+tag+' class="'+(cls||'')+'">'+(text||'')+'</'+tag+'>';
	},
	
	link: function(text, href, cls, opt){
		opt = opt||{};
		opt.target = opt.target ? 'target="'+ opt.target +'"' : '';
		
		return '<a class="'+(cls||'')+'" href="'+href+'" '+opt.target+'>'+text+'</a>';
	},
	
	linkPhone: function(text, href, cls, opt){
		href = href||text;
		href = 'tel:' + utils.cleanPhoneNumber(href);
		
		return snip.link(text, href, (cls||'') + ' tst-nobr', opt);
	},
	
	linkMail: function(text, href, cls, opt){
		href = 'mailto:' + utils.cleanPhoneNumber(href);
		
		return snip.link(text, href, (cls||'') + ' tst-nobr', opt);
	},
	
	// Табличная кнопка
    btnTable: function(field, text, hint){
        if (!text) text = '';
        return '<button class="js-colSort btnTbl" data-field="'+field+'" '+(hint?'title="'+hint+'"':'')+'><span class="btnTbl-back"></span><span class="btnTbl-left"></span><span class="btnTbl-right"></span>'+text+'<br><span class="btnTbl-sort"></span></button>';
    },
	
	/* Снипиты проекта */
	messengerIcon: function(opt){
		opt = opt||{};
		
		return snip.wrp('', '', 'messengerIcon -' + opt.type);
	},
	
	messenger: function(opt){
		opt = opt||{};
		
		opt.cls = opt.cls||'messenger-block';
		
		return snip.wrp(snip.messengerIcon(opt) + opt.text, 'div', opt.cls);
	},
	
	socialIcon: function(opt){
		opt = opt||{};
		
		return snip.wrp('', '', 'socialIcon -' + opt.type);
	},
	
	social: function(opt){
		opt = opt||{};
		opt.cls = opt.cls||'social-block';
		
		return snip.link(snip.socialIcon(opt) + opt.text, opt.url, opt.cls, {target: '_blank'});
	},
};