/*****************
 * Базовый блок *
 *****************/

Block = function(parent){
    this.parent = parent;
	
    //полное имя - берем от родителя
    
    this.fullName = this.calcFullName();
    //шаблон берем от родителя
    this.tmpl = this.calcTmplFolder();
	//настройки - пока пустые
	this.options = this.options || {}; // this.options могут быть установлены раньше вызова конструктора Block
    this.options.resizeParent = true;//если компонент ресайзится, то ресайз передаётся родителю
    this.options.clearData = true;
    this.init();
}

//обнуление данных
Block.prototype.init = function(){
    //нотификации (на перерисовку)
    this.notif = {show: [], other: {}};//show - действия на показ блока, other - любые другие действия
    //дочерние элементы
    this.children = {};
};

//на удаление???, сначала создаём экземпляр, потом проверяем, можно ли создать
Block.prepareData = function(){
    return {};
};

//формируем список детей
Block.prototype.getChildren = function(){
};

//инициализация детей
Block.prototype.initChildren = function(){
    for (var child in this.children){
        this.addChild(child, this.children[child]);
    }
};

//создание нового дочернего блока в процессе работы
Block.prototype.addChild = function(name, cls, id){
    //this[name] = new cls(this, id);
    //this.children[name] = this[name];
	
	this.children[name] = new cls(this, id);
}

//передача команды дочерним блокам
Block.prototype.doChildren = function(command, params){
    for (var child in this.children){
        if(this.children[child]){
            this.children[child][command](params);
        }
    }
};



//выбираем папку шаблона
Block.prototype.calcTmplFolder = function(){
    if (this.tmpl){
        return this.tmpl;
    } else if (this.parent){
        
        return this.parent.tmpl[this.name];
    } else {
        return tmplMgr[this.name];
    }
};

//собираем полное имя
Block.prototype.calcFullName = function(){
    if (this.parent){
        return this.parent.name+'-'+this.name;
    } else {
        return this.name;
    }
};


//Подключаем всё
Block.prototype.bindAll = function(){
    //инициализация детей
    this.getChildren();
    this.initChildren();
    //подключение событий
    this._bindEvent();
    this.bindEvent();
};


//добавляем нотификации
Block.prototype.addNotif = function(){
    
};


//действия, которые биндим
Block.prototype.bindEvent = function(){
};

//действия, которые биндим - стандартные
Block.prototype._bindEvent = function(){
    var self = this;
    
    if(this.parent){
        this.wrp.on('.'+this.fullName, 'resize', function(e){
            self.resize();
        });
    } else {
        this.wrp.on('resize', function(e){            
            self.resize();
        });
    }
};

Block.prototype._afterShow = function(){}

Block.prototype._afterShow2 = function(){}

Block.prototype.getSize = function(){
    if(this.cont){
        return {
            x: this.cont.outerWidth(true),
            y: this.cont.outerHeight(true)
        }
    } else {
        return {
            x: 0,
            y: 0
        }
    }
}

//действия на изменение размера
//усли выставлен параметр - оповещаем дочерние элементы, если не выставлен - родительские
Block.prototype.resize = function(dirDown){
    if (dirDown){
        this.doChildren('resize', dirDown);
    } else {
        if (this.parent && this.options.resizeParent) {
            this.parent.resize();
        }   
    }
}

//добавляем уведомления
Block.prototype.bindNotif = function(){
    this.removeNotif();

	this.notifHandler = notifMgr.getHandler();
	
	//стандартные
    this._bindNotif();
    
    //свободные
    for (var notif in this.notif.other){
        notifMgr.addListener(notif, this.notifHandler, this.notif.other[notif].bind(this));
    }
};

Block.prototype._bindNotif = function(events, action){
	events = events||this.notif.show;
	action = action||this.show.bind(this);
	
    for(var event in events){
        //нужно будет переделать - хранить ссылки или идентификаторы на функции
        notifMgr.addListener(events[event], this.notifHandler, action);
    }
};

//функция сбора данных, по завершении нужно выполнить this.dataReceived()
Block.prototype.getData = function(){
    this.dataReceived();
};

//формирование данных для шаблона - используются данные блока, синхронная работа
Block.prototype.getTmplData = function(){
    return this.data;
};

//получение главного шаблона
Block.prototype.getTmpl = function(){
    return this.tmpl.main || this.tmpl;
}

//проверяем, стоит ли показывать - ЗАГЛУШКА
Block.prototype.shouldShow = function() {
	return true;
};

//показываем блок
Block.prototype.show = function(){	
    //запрашиваем данные
    this.data = (this.data && !this.options.clearData)? this.data: {};
    this.getData();
};

//получаем название класса для врапера
Block.prototype.getWrpClass = function(){
    return this.fullName+'-wrp';
};

//устанавливаем обертку
Block.prototype.setWrp = function(){
    //устанавливаем врапер
    var wrpClass = this.getWrpClass();
    if(this.parent){
        if(this.parent.wrp){//родитель может быть сам ещё не создан
            this.wrp = this.parent.wrp.find('.'+wrpClass);
        }else if(this.parent.cont){//родитель может быть сам ещё не создан
            this.wrp = this.parent.cont.find('.'+wrpClass);
        }
    } else { // Окно
        if(this.wrp){
            this.wrp.remove();
        }
		
		/*
		if( debug.isDen() ){
			this.wrp = $('<div class="'+wrpClass+'"></div>');
			
			if( !(this instanceof Interface) ){
				this.wrp.addClass('wnd-wrp -debug-isDen');
			}
			
			if (this instanceof Interface || !wndMgr.interface) {
				wndMgr.cont.append(this.wrp);
			} else {
				wndMgr.interface.wrp.append(this.wrp);
			}
		}
		else{
			this.wrp = $('<div class="wnd-wrp ' + wrpClass + '"></div>');
			
			if ( wndMgr.interface ) {
				wndMgr.interface.wrp.append(this.wrp);
			} else {
				wndMgr.cont.append(this.wrp);
			}
		}
		*/
		
		this.wrp = $('<div class="wnd-wrp ' + wrpClass + '"></div>');
			
		if ( wndMgr.interface ) {
			wndMgr.interface.wrp.append(this.wrp);
		} else {
			wndMgr.cont.append(this.wrp);
		}
    }
};

Block.prototype.removeWrp = function(){
    if (this.wrp) {
        this.wrp.unbind();
		this.wrp.off();
    }
    delete this.wrp;
};

//создаём контент для установки во врапер
Block.prototype.createCont = function(){
    var tmpl = this.getTmpl();
    var data = this.getTmplData();
    var cont = tmpl(data);
    return cont;
};

//данные для отображения блока получены - отрисовываем блок
Block.prototype.dataReceived = function(){
    this.ready = false;
	
    //var wrp = this.getWrp();
    //if(this.state == Block.state.inited){
    var firstShow = !this.wrp || !(this.parent || this.options.isWnd);
	
    if(firstShow){
        //подключение нотификаций
        this.addNotif();
        this.bindNotif();
    }

    if (!this.shouldShow()) return;
    
    this.remove();
    
    if(firstShow){
        this.setWrp();
    }
    if(!this.wrp){
        return;
    }
    
    //создаём контент
    this.cont = $(this.createCont());
    //пишем его во врапер
    this.wrp.html(this.cont);
	
	//this.wrp.toggleClass('-hidden', !this.shouldShow());
	
    if(firstShow){
        this.bindAll();
    }
	
    this.beforeChldShow();
    
    //показываем детей
	this.doChildren('removeWrp');
    this.doChildren('show');
    //устанавливаем состояние
    
    this._afterShow();
    this.afterShow();
	this._afterShow2();
	
    //обновим таймеры
	//timeMgr.tick2(true);
    
    this.resize();
    
    if(this.options.isWnd){//только для окон
		if( firstShow || this.active )
			wndMgr.onWndFirstShow(this);
    }
    this.ready = true;
};

//действия перед показом детей
Block.prototype.beforeChldShow = function(){
    
}

//действия выполняемые после показа блока (например переподключение слайдеров)
Block.prototype.afterShow = function(){
    
}

//удаляем блок
Block.prototype.remove = function(){
    //убираем детей
    this.doChildren('remove');
    //убираем контент
    if (this.wrp) {
        this.wrp.html('');
    }
};

Block.prototype.removeNotif = function(){
    //отключаем нотификации
    this.doChildren('removeNotif');
    if (this.notifHandler) {
        notifMgr.removeListeners(this.notifHandler);
    }
};

// Дейчтвия на закрытие блока
Block.prototype.onClose = function(){
    // Заглушка
};

Block.prototype.toggleDisplay = function(show){
    this.wrp.toggleClass('-hidden', !show);
}

//сделать активным - пока больше для Wnd и задников
Block.prototype.setActive = function(active){
    this.active = active;


    if (this.cont) {
        this.cont.toggleClass('-active', this.active);
    }
}

Block.prototype.setZ = function(z){
    if(this.options.staticZ) return;
    if (this.wrp) {
        this.cont.css('z-index', z);
    }
}

//размеры контейнера
Block.prototype.getSizePx = function(marg){
    if (!marg) marg = false;
    if (this.cont) {
        return {
            x: this.cont.outerWidth(marg),
            y: this.cont.outerHeight(marg)
        }
    }
    return {x: 0, y: 0}
}

//установка стиля контейнеру(в основном размеры и позиционирование)
Block.prototype.setStyle = function(style){
    if (this.cont) {
        this.cont.css(style)
    }
}

/*****************
 * Базовое окно2 *
 *****************/

Wnd = function(id, data, parent){
    this.id = id;
    this.data = data;
    this.tmplWrp = tmplMgr.wnd3.wnd;
    
    this.options = {
        moving : appl.isMobile ? false : true,
        setHash: true,
        isWnd: true,
        canClose: true,
        canMinimize: false,
        canCloseAll: true,
        clearData: true
    };
    
    if(!device.desktop()){
        this.options.moving = false;
    }
    
	Wnd.superclass.constructor.apply(this, [parent]);
};
    utils.extend(Wnd, Block);
    
    Wnd.prototype.getTmplWrpData = function(cont){
        return {cont: cont, options: this.options};
    }
    
    Wnd.prototype.createCont = function(){
        //получаем контент
        var cont = Block.prototype.createCont.apply(this);
        
        //оборачиваем в оконные обёртки
        if (this.tmplWrp) {
            return this.tmplWrp(this.getTmplWrpData(cont));   
        } else {
            return cont;
        }
        

        //return this;
    };
    
    Wnd.prototype._afterShow = function(){

        wndMgr.positionMobileWnd();
        this.cont.find('.wnd3-cont').on('resize', function(){
            wndMgr.onChangeMobileWndHeight()
        });
        this.setAutoPos();
    }
    
    //получаем идентичные окна
    Wnd.prototype.getIdentWnd = function(){
        var wndList = wndMgr.getWndByType(this.constructor);
        for (var wnd in wndList) {
            wnd = wndList[wnd];

            if (wnd.id == this.id) {
                return wnd;
            }
        }
        return false;
    };
    
    //получаем конфликтующие окна - их нужно будет удалить перед добавлением нового окна
    Wnd.prototype.getConflictWnd = function(){
        return wndMgr.getWndByType(this.constructor);
    };
    
    //действия, которые биндим - стандартные
    Wnd.prototype._bindEvent = function(){
        var self = this;
        
        Block.prototype._bindEvent.apply(this);
        
        if(!appl.isMobile && this.options.moving){
            //тягатор окон
            this.wrp.draggable({ 
                handle: '.wnd-panelLR.-type-header, .wnd2-borders *, .-draggable', 
                containment:[-10000, 0,  10000, 10000], 
                drag: function( event, ui ) {
                    if(!self.options.moving){
                        return false;
                    } else {
                        self.saveWndPos(ui.position);
                    }
                }
            });
        }
        
        
        //выключатор
        this.wrp.on('click', '.js-wnd-close', function(){
            self.close();
			return false;
        });

        //активатор
        this.wrp.on('mousedown', function(){
            wndMgr.setActiveWnd(self);
        });
    };
    
    Wnd.prototype.saveWndPos = function(pos){
        var wndPos = ls.getWndPos({});
        if (wndPos && typeof(this.name) != 'undefined'){
            if(!pos){
                pos = this.cont.offset();
            }

            wndPos[this.name] = pos;
            ls.setWndPos(wndPos);
        }
    };
    
    
    //установить позицию по умолчанию
    Wnd.prototype.setAutoPos = function(){
        if(!device.desktop()){
            this.widenToScr();
        } else {
            var wndPos = ls.getWndPos({});

            if(this.defaultPos){
                this.setStoredPos();
            } else if(wndPos){
                if(wndPos[this.name] && typeof(this.name) != 'undefined'){
                    this.defaultPos = {
                        left: wndPos[this.name].left,
                        top: wndPos[this.name].top
                    };
                    this.setStoredPos();
                } else {
                    this.moveToCenter();
                }
            } else {
                this.moveToCenter();
            }
        }
    };
    
    Wnd.prototype.widenToScr = function(){
        this.wrp.css({width: '100%', height: '100%'});
    };
    
    
    //установить позицию из сохранённых данных
    Wnd.prototype.setStoredPos = function(){
        this.wrp.css('left', this.defaultPos.left);
        this.wrp.css('top', this.defaultPos.top);
        delete this.defaultPos;
    }

    //установить позицию в центр экрана
    Wnd.prototype.moveToCenter = function(){
        var posX = -this.cont.outerWidth()/2;
        var posY = -this.cont.outerHeight()/2;
        var left = $(window).width()/2;
        var top = $(window).height()/2 + window.pageYOffset;

        if (top + posY < 0){
            top = posY = 0;
        }

        this.wrp.css('left', left + posX);
        this.wrp.css('top', top + posY);
    };
    
    Wnd.prototype.close = function(){
        wndMgr.removeWnd(this);
		
		this.doChildren('onClose');
		
        this.remove();
        this.removeNotif();
		
        this.wrp.remove();
    };
	
    Wnd.prototype.resize = function(){        
        if(!device.desktop()){
            //верх
            this.wrp.find('.wnd3-header-btn').each(function(){
                var el = $(this);
                el.width(el.height())
            })

        }
        
        //низ
        var footerBtn = this.wrp.find('.wnd3-footer-btn');
        var availWidth = this.wrp.find('.wnd3-footer').width();
        footerBtn.each(function(){
            availWidth -= $(this).width();
        })
        var padding = ~~(availWidth/(footerBtn.length-1))
        footerBtn.each(function(i){
            if(i){
                $(this).css({'margin-left': padding});
            }
        })
    };



/*************
 * Интерфейс *
 *************/

Interface = function(){
	this.wndList = [];

	cntMgr.addInterface(this);

	Interface.superclass.constructor.apply(this);
};
	
    utils.extend(Interface, Block);
    
	/*тип, идентификатор окна*/
	Interface.prototype.addWnd = function(type, id){
        var self = this;
        
		//проверяем, можно ли отобразить окно с такими идентификатором
		var data = type.prepareData ? type.prepareData(id) : {};
        
		if (!data) return;
		
		var wnd = new type(id, data);
		
        if(wnd.init)
            wnd.init();
        
		if( !wnd.options.inactive )
			this.deactivateAll();
			
		//ищем идентичные окна. Если есть, новое окно не создаём, а выделяем существующее
		var wndIdent = wnd.getIdentWnd();
		
		if (wndIdent) {
			this.setActiveWnd(wndIdent);
			
			return wndIdent;
		} else {
			//удаляем конфликтующие окна
			this.closeWndList(wnd.getConflictWnd());
			
			this.wndList.push(wnd);
            
			wnd.show();//окно всегда показываем сразу же после создания
            
			return wnd;
		}
	};
    
	Interface.prototype.deactivateAll = function(){
		var wnd = this.getActiveWnd();
		if (wnd) {
			wnd.setActive(false);
		}
	}
    
	Interface.prototype.getActiveWnd = function() {
		//активный элемент - самый последний
		if (this.isEmpty()) return false;
        if (this.wndList.length == 0) return false;
		return this.wndList[this.wndList.length-1];
	}
    
	// onlyWnd == true - возвращает количество окон без учета панелей
	Interface.prototype.isEmpty = function(onlyWnd){
        return (onlyWnd ? this.wndList.length : utils.sizeOf(this.children)) == 0;
	};
    
	Interface.prototype.closeWndList = function(wndList){
		for (var wnd in wndList) {
            wnd = wndList[wnd];
            if (wnd.options.canClose) {
                wnd.close();
            }
		}
	}
    
    Interface.prototype.beforeChldShow = function(){
        for(var i in this.children){
            cntMgr.list.push(this.children[i])
        }
    }

	Interface.prototype.show = function(){
		Interface.superclass.show.apply(this);
    };

    //устанавливаем ид, проверяем
    Interface.prototype.setId = function(id){
    }

    //собираем ид, отдаём
    Interface.prototype.getId = function(){
    }
	
	Interface.prototype.setWrp = function(){
		if(this.wrp){
			this.wrp.remove();
		}
		
		this.wrp = $('<div class="interface-wrp ' + this.getWrpClass() + '"></div>');

		cntMgr.cont.append(this.wrp);
	};
	
	// Действие по нажатию клавиши esc
	Interface.prototype.esc = function(){
		// Заглушка
	};