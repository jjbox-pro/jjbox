iMainPage = function(){
    this.name = 'mainPage';
    this.tmpl = tmplMgr.iMainPage;
    
	iMainPage.superclass.constructor.apply(this, arguments);
    
};
	
    utils.extend(iMainPage, Interface);
    
    iMainPage.prototype.getChildren = function(){
        this.children = {
			header: bHeader,
			mmenu: bMmenu,
			intro: bIntro,
			content: bContent,
			rmenu: bRmenu,
			footer: bFooter
		};
    };
	
	iMainPage.prototype.bindEvent = function(){
		var self = this;
		
		this.initBackToTop();
	};
	
	iMainPage.prototype.initBackToTop = function(){
		if( !appl.isMobileDevice ){
			var self = this;
			
			this.cont.find('.mainPage-back-toTop-wrp').html(tmplMgr.iMainPage.backToTop());
			
			this.backToTop = this.cont.find('.mainPage-back-toTop');
		
			this.backToTop.hide();

			cntMgr.window.scroll(function(){
				if ($(this).scrollTop() > 200) {
					self.backToTop.fadeIn();
				} else {
					self.backToTop.fadeOut();
				}
			});

			this.backToTop.click(function(){
				cntMgr.body.animate({scrollTop: 0}, 800);

				return false;
			});
		}
	};
			