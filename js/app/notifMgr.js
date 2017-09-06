/************************
 * Менеджер уведомлений *
 ***********************/

var notifMgr = {
	events: {},
    
    handler: 0,// счетчик хэндлеров
    
    getHandler: function(){
        return this.handler++;
    },
    
	toArray: function(params){
        return utils.isArray(params) ? params : [params];
    },
    
	//регистрация колбека на событие - с проверкой списка параметров
    //
    //нотификация, к которой присоединяется колбэк(id или {id: id, params: params} или {id: id, callback:callback, params: params})
    //уникальное имя колбэка
    //функция колбэка
    //опционально список идентификаторов, на которые колбэк будет вызываться
	addListener: function (eventName, callName, callback) {
        if (typeof eventName == 'object') {
			if( eventName.params !== undefined )
				var paramsArr = this.toArray(eventName.params);
			
            callback = eventName.callback||callback;
			
			eventName = eventName.id;
        }
        
		if (!this.events[eventName]) {
			this.events[eventName] = {};
		}
		
		this.events[eventName][callName] = {params: paramsArr, callback: callback};
	},
    
    //кандидат на удаление
	removeListener: function (eventName, callName) {
		if (typeof eventName =='object')
            eventName = eventName.id;
		
		delete this.events[eventName][callName];
	},
    
    //удаляет все события по хэндлеру
	removeListeners: function (handler) {
        for(var event in this.events){
            delete this.events[event][handler];    
        }
    },
    
	//запуск колбэков на произошедшее событие
	runEvent: function (eventName, params) {
		if (!this.events[eventName]) return;
		for (var call in this.events[eventName]) {
            var notif = this.events[eventName][call];
            if ( notif.params ) {
				// Если указаны параметры, params обязан быть массивом, если нет, преобразовываем
				var paramsArr = this.toArray(params);
				// Ищем пересечение списков
                for (var id in paramsArr) {
                    if (utils.inArray(notif.params, paramsArr[id])) {
                        notif.callback(paramsArr);
                    }
                }
            } else {
                notif.callback(params);
            }
		}
	}
};

Notif = {};
Notif.ids = {
	//townCur: 0,//смена текущего города
};

Notif.delay = 500; // Время задержки после, которого будет выполняться обновление контента для всех пришедших за это время нотификаций

