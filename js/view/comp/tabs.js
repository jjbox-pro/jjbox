/******
 * Вкладка
 */

Tab = function(parent){
    //this.parent = parent;
    
	Tab.superclass.constructor.apply(this, arguments);
};
    utils.extend(Tab, Block);
    

    Tab.prototype.onHide = function(){}

    Tab.prototype.bind = function(){};

    Tab.prototype.applyStatus = function(){
        this.tab.removeClass('-disabled');
    };
	
	Tab.prototype.beforeOpenTab = function(){}; // Заглушка
	
	Tab.prototype.afterOpenTab = function(){}; // Заглушка
    
	Tab.prototype.resize = function(){
		Block.prototype.resize.apply(this);
    };
    
	Tab.prototype.getOffsetTop = function(){
        return this.wrp.offset().top;
    };
	
	// Если был асинхронный запрос получения данных, проверям активность вкладки
	Tab.prototype._afterShow2 = function(){
		if( this.tabs )
            this.wrp.toggleClass('-hidden', this.tabs.activeTab && this != this.tabs.activeTab);
	};
	
	Tab.prototype.isActive = function(){
		return this.tabs.activeTab && this == this.tabs.activeTab;
	};

/******
 * Вкладки
 */
Tabs = function(cont, parent, options){
    this.linkClass = '.js-tabLink';
    this.wrpClass = '.js-tabWrp';
    this.linkField = 'tab';
    
    this.parent = parent;//родитель
    this.cont = cont;//контейнер
    this.tabCont = this.cont.find('.tabs-cont');//контейнер для вкладок - там выделяются места для вкладок, для которых нет определенного в верстке врапера
    this.options = options||{};
    this.activeTab = false;
    this.tabs = {};
    
    this.bind();
};

Tabs.prototype.addTab = function(tab){
    this[tab.name] = tab;
    
    tab.cont = this.cont.find(this.wrpClass+'[data-'+this.linkField+'="'+tab.name+'"]');
    tab.tab = this.cont.find(this.linkClass+'[data-'+this.linkField+'="'+tab.name+'"]');
    
    tab.bind();
    tab.applyStatus();
}


Tabs.prototype.addTabs = function(tabs){
    for(var tab in tabs){
        if(tabs[tab] instanceof Tab){
            this.addTab2(tabs[tab]);
        }
    }
}

Tabs.prototype.addTab2 = function(tab){
    //пишем в себя и в родителя ссылку на вкладку
    this.tabs[tab.name] = tab;
	
	tab.tabs = this;
    
    //присоединяем кнопку
    tab.tab = this.cont.find(this.linkClass+'[data-'+this.linkField+'="'+tab.name+'"]');
    if(tab.tab.length == 0){
        tab.tab = $(tmplMgr.tabs.tab(tab));
        this.cont.find('.tabs-wrp').append(tab.tab);
    }
    
    //ищем врапер, если не находим, создаём
    var wrp = this.cont.find('.'+tab.getWrpClass());
    if(wrp.length == 0){
        wrp = $('<div class="tab-wrp '+tab.getWrpClass()+'"></div>')
        this.tabCont.append(wrp);
    }
    
    tab.applyStatus();
}

Tabs.prototype.bind = function(){
	var self = this;
	
    this.cont.find(this.linkClass).addClass('-disabled');
    
    this.cont.on('click', this.linkClass, function(){
        self.selectTab(this);
    });
}

Tabs.prototype.selectTab = function(el){
	if ( $(el).hasClass('-disabled') ) return;
	var tabName = $(el).data(this.linkField);
	this.openTab(tabName||false);
};

//открывает вкладку, если пустота - отключает все вкладки
Tabs.prototype.openTab = function(tab){
    var self = this;
    
    if (typeof tab == 'string') tab = this.tabs[tab];
    
    if (this.activeTab == tab) return;
    
    if (this.activeTab) this.activeTab.onHide();
	
    this.activeTab = tab;
	
    if (this.activeTab) this.activeTab.beforeOpenTab();
    
    this.cont.find(this.linkClass).each(function(){
        var el = $(this);
        el.toggleClass('-active', self.activeTab && el.data(self.linkField) == self.activeTab.name);
    });
    
    this.cont.find(this.wrpClass).each(function(){
        var el = $(this);
        el.toggleClass('-hidden', self.activeTab && el.data(self.linkField) != self.activeTab.name);
    });
    
    //новые выделялки
    for(var tab in this.tabs){
        tab = this.tabs[tab];
        tab.tab.toggleClass('-active', this.activeTab && tab == this.activeTab);
        if(tab.wrp){
            tab.wrp.toggleClass('-hidden', this.activeTab && tab != this.activeTab);
        }
    }
	
    if (this.activeTab) this.activeTab.afterOpenTab();
    
    this.onOpenTab(this.activeTab);
};

Tabs.prototype.getTab = function(tabName){
	return this.tabs[tabName];
};

//заглушка, срабатывает при открытии вкладки
Tabs.prototype.onOpenTab = function(tab){}

Tabs.prototype.reload = function(){
	var $tabs = this.cont.find('.tabs-wrp').html(''),
		activeTab = this.activeTab;
	
	for(var tab in this.tabs){
		tab = this.tabs[tab];
		tab.tab = $(tmplMgr.tabs.tab(tab));
		$tabs.append(tab.tab);
	}
	
	this.activeTab = false;
	
	this.openTab(activeTab);
};
