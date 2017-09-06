bContent = function(){
    this.name = 'content';
    
	bContent.superclass.constructor.apply(this, arguments);
};
	
    utils.extend(bContent, Block);
    
    bContent.prototype.getChildren = function(){
        this.children = {};
		
		for(var tab in bContent.tabs){
			this.children[tab] = bContent.tabs[tab];
		}
    };
	
	bContent.prototype.beforeChldShow = function() {
	    this.tabs = new Tabs(this.parent.cont);
		
		this.tabs.addTabs(this.children);
		
		this.activeTabName = (this.tabs.tabs[location.hash.slice(1)]||{}).name||'general';
		
		this.tabs.onOpenTab = function(tab){
			this.parent.children.intro.toggleDisplay( tab.name == 'general' );
			
			if( tab.dependence )
				this.tabs.cont.find(this.tabs.linkClass + '[data-'+this.tabs.linkField+'='+tab.dependence+']').addClass('-active');
		}.bind(this);
	};
	
	bContent.prototype.afterShow = function() {
		this.tabs.openTab(this.activeTabName);
	};


/* Генерируем список табов на основе главного меню */
bContent.tabs = {};

bContent.generateTabs = function(list){
	var tabCls,
		tabDataList;
	
	for(var item in list){
		item = list[item];

		tabCls = bContent.tabs[item.id] = function(){
			this.name = this.constructor.exemplar.name;
			
			this.dependence = this.name.split('_');
			
			if( this.dependence[1] )
				this.dependence = this.dependence[0];
			else
				delete this.dependence;
			
			this.constructor.superclass.constructor.apply(this, arguments);
		}
		tabCls.exemplar = {
			name: item.id
		}
		
		tabDataList = info.tabsData[item.id]; // Статические данные для табов (таблицы с ценами, галереи и т.д)
		
		if( tabDataList ){
			for(var tabData in tabDataList){
				tabData = tabDataList[tabData];
				
				if( tabData.prepareData ) tabData.prepareData(tabCls, tabData);
			}
		}
		
		utils.extend(tabCls, Tab);
		
		if( item.child ) bContent.generateTabs(item.child);
	}
};

bContent.generateTabs(info.menu);


/* Связываем колбеки (обработчики) табов со статическими данными */
for(var tabCls in bContent.tabs){
	tabCls = bContent.tabs[tabCls];
	
	if( tabCls.staticData ){
		tabCls.prototype.getData = function(){
			this.data = {};
			
			var thisCls = this.constructor;
			
			if( thisCls.staticData.priceArr ){
				this.data.priceList = [];
				
				for(var price in thisCls.staticData.priceArr){
					this.data.priceList.push(utils.clone(thisCls.staticData.priceArr[price]));
				}
			}
			
			if( thisCls.staticData.galleryArr ){
				this.data.galleryList = [];
				
				for(var gallery in thisCls.staticData.galleryArr){
					this.data.galleryList.push(utils.clone(thisCls.staticData.galleryArr[gallery]));
				}
			}
			
			this.dataReceived();
		}
		
		tabCls.prototype.afterShow = function(){
			if( this.data.priceList ){
				this.data.tables = {};
					var table;

					for(var price in this.data.priceList){
						price = this.data.priceList[price];
						table = this.data.tables[price.id] = new tblPrice(this, this.cont.find('#'+price.id));
						table.data.list = price.list;
						table.toggleSort('cost');
					}
			}
			
			if( this.data.galleryList ){
				for(var gallery in this.data.galleryList){
					gallery = this.data.galleryList[gallery];
					
					gallery.opt = gallery.opt||{};
					
					gallery.opt.needWaitContent = this.parent.activeTabName == this.name;
					
					plug.initImgGallery(this, gallery.id, gallery.group, gallery.opt);
				}
			}
		};
		
		if( tabCls.staticData.galleryArr ){
			tabCls.prototype.onHide = function(){
				plug.toggleImgAutoScrolling(this, false);
			}
			tabCls.prototype.beforeOpenTab = function(){
				plug.toggleImgAutoScrolling(this, true);
			}
		}
	}
}



bContent.tabs.price.prototype.getData = function(){
	this.data = {};
	
	this.getPriceList();
	
	this.dataReceived();
}

bContent.tabs.price.prototype.afterShow = function(){
	this.data.tables = {};
	var table;
	
	for(var price in this.data.priceList){
		price = this.data.priceList[price];
		table = this.data.tables[price.id] = new tblPrice(this, this.cont.find('#'+price.id));
		table.data.list = price.list;
		table.toggleSort('cost');
	}
};

bContent.tabs.price.prototype.getPriceList = function(){
	this.data.priceList = [];
	
	var tabCls;
	
	for(var tab in this.parent.tabs.tabs){
		tab = this.parent.tabs.tabs[tab];
		tabCls = bContent.tabs[tab.name];
		
		if( tabCls.staticData && tabCls.staticData.priceArr ){
			for(var price in tabCls.staticData.priceArr){
				this.data.priceList.push(utils.clone(tabCls.staticData.priceArr[price]));
			}
		}
	}
	
	this.data.priceList.sort(function(a, b){return a.order - b.order;});
};





tblPrice = function(parent, cont) {
    this.tmpl = tmplMgr.table.price.list;
    this.data = {};
    
	tblPrice.superclass.constructor.apply(this, arguments);
	
    this.bind();
};

utils.extend(tblPrice, Table);

tblPrice.prototype.getSortVal = function(service, field) {
	if (field == 'name') return service.name.toLowerCase();
    if (field == 'count') return service.count;
	if (field == 'cost') return service.cost;
	
    return service.order;
};

tblPrice.prototype.afterShow = function() {
	var showTable = !this.data.list.length;
	
	if( this.showTable != showTable ){
		this.parent.wrp.find('.tbl').toggleClass('-hidden', showTable);
		
		this.showTable = showTable;
	}
};