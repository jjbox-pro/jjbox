plug = {
	initImgGallery: function(parent, cls, group, opt){
		opt = opt||{};
		group = group||'0';
		
		plug.initImgviewer(parent, cls, group, opt);
		plug.initImgScroller(parent, cls, group, opt);
	},
	
	initImgviewer: function(parent, cls, group, opt){
		opt = opt||{};
		group = group||'0';
		
		var options = {
			rel: cls+'-group-' + group, 
			speed: 500,  
			returnFocus: false,
			trapFocus: false
		};
		
		if( utils.getWindowWidth() > utils.getWindowHeight() )
			options.height = '90%';
		else
			options.width = '90%';
		
		utils.copyProperties(options, opt);
		
		parent.cont.find('.'+cls+'-gallery.'+cls+'-group-'+group+' a').colorbox(options);
	},
	initImgScroller: function(parent, cls, group, opt){
		opt = opt||{};
		group = group||'0';
		
		var options = {
				autoScrollingMode: 'onStart',
				autoScrollingDirection: "backAndForth",
			},
			events = {
				enter: 'mouseenter',
				leave: 'mouseleave'
			};
		
		if( appl.isMobileDevice ){
			options.isMobile = true;
			options.visibleHotSpotBackgrounds = "always";
			options.manualContinuousScrolling = true;
			
			events.enter = 'touchstart';
			events.leave = 'touchend'
		}
		
		utils.copyProperties(options, opt);
		
		if( opt.needWaitContent ){
			options.setupComplete = function() {
				cntMgr.showContent();
			}
			cntMgr.waitContent();
		}
		
		parent.autoScrollingTimeout = parent.autoScrollingTimeout||{};
		
		var selector = '.'+cls+'-gallery.'+cls+'-group-'+group;
		
		parent.cont.find(selector).smoothDivScroll(options)
			.bind(events.enter, function() {
				clearTimeout(parent.autoScrollingTimeout[$(this).data('selector')]);

				$(this).smoothDivScroll('stopAutoScrolling');
			})
			.bind(events.leave, function() {
				$this = $(this);

				parent.autoScrollingTimeout[$(this).data('selector')] = setTimeout(function(){
					$this.smoothDivScroll('startAutoScrolling');
				}, 5000);
			})
			.data('selector', selector);
	},
	toggleImgAutoScrolling: function(parent, state, cls){
		cls = cls||'.imgGallery';
		
		for(var timeout in parent.autoScrollingTimeout)
			clearTimeout(parent.autoScrollingTimeout[timeout]);
		
		parent.cont.find(cls).smoothDivScroll(state ? 'startAutoScrolling' : 'stopAutoScrolling');
	}
};