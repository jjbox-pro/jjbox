utils = {
	loadScript: function(url, callback){
		var script = document.createElement('script');
		script.src = url;
		document.body.appendChild(script);
		script.onload = function(){
			if( callback ){
				callback();
			}
		};
	},
	
	extend: function(child, parent) {
		var F = function() {};
		F.prototype = parent.prototype;
		child.prototype = new F();
		child.prototype.constructor = child
		child.superclass = parent.prototype
		
		// Наследование статичных методов
		for (var i in parent){
			if ( !child[i] ) 
				child[i] = parent[i];
		}
	},
	
	// Объекты и массивы //

	// Проверка объекта на пустоту
	isEmpty: function(obj) {
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) return false;
		}
		return true;
	},
	
	// Является ли элемент массивом
	isArray: function (obj) {
		return obj instanceof Array;
	},
	
	// Rоличество полей в ассоциативном массиве
	sizeOf: function(obj){
		var count=0;
		for(var i in obj){
			count++;
		}
		return count;
	},
	
	// Находится ли элемент в массиве
	inArray: Array.prototype.indexOf ?
	function (arr, val) {
		return arr.indexOf(val) != -1
	} :
	function (arr, val) {
		var i = arr.length
		while (i--) {
			if (arr[i] === val) return true;
		}
		return false;
	},
		
	// Клонирует объекты и массивы любого уровня вложенности
	clone: function(obj, own){
		if (obj == null) return null;
		
		var newObj = utils.isArray(obj) ? [] : {};
		for(var i in obj){
			if( own && !obj.hasOwnProperty(i) )
				continue;
			
			if (obj[i] && obj[i] instanceof Object){
				if (obj[i].clone) {
					newObj[i] = obj[i].clone();
				} else {
					newObj[i] = this.clone(obj[i], own);
				}
			} else {
				newObj[i] = obj[i];
			}
		}
		
		return newObj;
	},
	
	isEqual: function(obj1, obj2, compare_func){
		if (obj1 == obj2) return true;
		
		if (utils.sizeOf(obj1) != utils.sizeOf(obj2)) return false;
		
		for (var i in obj1){
			if (typeof(obj1[i]) == 'object' && typeof(obj2[i]) != 'object') return false;
				
			if (typeof(obj1[i]) == 'object'){
				if (!utils.isEqual(obj1[i], obj2[i], compare_func)) return false;
			} else {
				if (compare_func){
					if( compare_func(obj1[i], obj2[i]) )
						return false;
				}
				else if (obj1[i] != obj2[i]) return false;
			}
		}
		
		return true;
	},
	
	isArrsIntersects: function (arr1, arr2){
		if (arr1.length && arr2.length){
			for (var item1 in arr1) {
				item1 = arr1[item1];
				for (var item2 in arr2) {
					item2 = arr2[item2];
					if (item1 == item2) {
						return true;
					}
				}
			}
		}
		return false;
	},
	
	objToArr: function(obj, sortFunc){
		var arr = [];
		for (var i in obj){
			arr.push(obj[i]);
		}
		
		if( sortFunc ){
			arr.sort(function(a, b){
				return sortFunc(a, b);
			});
		}
		
		return arr;
	},
	
	arrToObj: function(arr){
		var obj = {};
		for (var i in arr){
			obj[arr[i].id] = arr[i];
		}
		return obj;
	},
	
	calcObjSum: function(obj){
		var sum = 0;
		for (var i in obj){
			sum += obj[i];
		}
		return sum;
	},
	
	// События //
	
	// Место, куда кликнули
	getPosFromEvent: function(e, prop){
		prop = prop||'page';
		
		return {x: e[prop+'X'], y: e[prop+'Y']};
	},
	
	// Определяем, какая кнопка мыши нажата
	getMouseButton: function(e){
		// Для ie
		if (!e.which && e.button) {
			if (e.button & 1) e.which = 1;
			else if (e.button & 4) e.which = 2;
			else if (e.button & 2) e.which = 3;
		}
		
		return e.which;
	},

	// Копирование собственных свойств ($.extend копирует в т.ч. функции класса)
	copyProperties: function(to, from){
		to = to||{};
		for (var i in from) {
			if (from.hasOwnProperty(i)) {
				if ( from[i] instanceof Object && !utils.isInstance(from[i])) {
					if (!to[i]) {
						to[i] = from[i];
					} else {
						utils.copyProperties(to[i], from[i]);	
					}
				} else {
					to[i] = from[i];	
				}
			}
		}
		return to;
	},

	cloneCls: function(obj){
		var clone = obj.constructor ? new obj.constructor(): {};
		return utils.copyProperties(clone, obj);
	},

	isInstance: function(obj){
		if (obj == null) return false;
		return obj.__proto__ != undefined;
	},
	
	// форматирование //
	
	cleanPhoneNumber: function(text, noSign){
		text = text.replace(new RegExp('[^\\d' + (noSign?'':'+') + ']', 'g'), '');
		
		return text;
	},
	
	// Сделать первую букву прописной
	upFirstLetter: function(text){
		return text.charAt(0).toUpperCase()+text.slice(1);
	},
	
	// Сделать первую букву строчной
	downFirstLetter: function(text){
		return text.charAt(0).toLowerCase()+text.slice(1);
	},
	
	// Вывод числа с округление и отбрасыванием после знака
	toFixed: function(val, dec, simpleFixed){
		if( dec === undefined ) return ~~val;
		else if( dec == 0 || simpleFixed ) return (+val||0).toFixed(dec);
		
		var mult = Math.pow(10, dec);
		return (~~(val*mult) / mult).toFixed(dec);
	},
	
	toInt: function(val, opt){
		opt = opt||{};
		
		if( opt.bigNum )
			return val < 0 ? Math.ceil(val) : Math.floor(val);
		else
			return val|0; // Работает быстрее чем ceil и floor, но только с числами не больше 32-х разрядов
	},
	
	selectKMSign: function(num) {
		num = Math.abs(num);
		
		if(num >= 1e7) return 'M';
		if(num >= 1e4) return 'K';
		return '';
	},
	
	// Общая функция для форматирования чисел
	formatNum: function (num, opt) {
		var result = '';

		if (!opt) opt = {};
		
		if( opt.abs ) {
			num = Math.abs(num);
		}
		
		/*ПРЕФИКСЫ*/
		//вывод знака
		if (opt.sign) {
			result += num>0? '+': (opt.int && num && Math.abs(num) < 1 ? '-' : '');
		}
		var km = opt.KM? utils.selectKMSign(num): '';
		if (km) {
			num /= km == 'M'? 1e6: 1e3;
		}

		/*ОКРУГЛЕНИЕ*/

		//база для округления
		var base;
		if (opt.base) {
			base = Math.pow(10, opt.base);
			num *= base;
		}
		
		if (opt.toPercent) {
			num *= 100;
		} 
		//округление числа
		if (opt.servRound) {
			num = utils.servRound(num);
		}
		if (opt.floor) {
			num = Math.floor(num);
		} 
		if (opt.round){
			num = Math.round(num);
		}
		if (opt.ceil){
			num = Math.ceil(num);
		}
		if (opt.int){
			num = utils.toInt(num, opt.int);
		}
		if (opt.base) {
			num /= base;
		}
		

		
		/*ВЫВОД*/
		if ( opt.fixed === undefined ) opt.fixed = false;
		if ( opt.uFixed === undefined ) opt.uFixed = false;

		if (opt.mixed) {
			if (Math.abs(num) >= 1e3) {
				result += utils.stages(~~num);
			} else {
				result += opt.fixed === false? ''+num: num.toFixed(opt.fixed);
			}
		} else if (opt.stages) {
			result += utils.stages(num);
		} else if (opt.fixed !== false){
			result += num.toFixed(opt.fixed);
		} else if (opt.uFixed !== false){
			result += utils.toFixed(num, opt.uFixed); // Строгое округление (отброс остатка до нужного знака)
		}
		else {
			result += ''+num;
		}

		/*КМ*/
		
		if (km) {
			result += km;
		}


		return result;
	},
	
	//дробь в проценты
	toPercent: function(val, dec) {
		val *= 100.001;
		return (dec) ? utils.toFixed(val, dec) : ~~val;
	},
	
	fixDecimal: function(val){
		return Math.round(val * 100) / 100;
	},
	
	//разбиваем на группы
	stages: function(num) {
		num = '' + num;
		
		var numDec = utils.getDec(num);
		var numReg = '';
		var part = '';
		var sign = num < 0 ? '-' : '';
		num = ('' + ~~num).replace('-', '');
		
		while(part = num.slice(-3)){
			num = num.slice(0, -3);
			numReg = part + ' ' + numReg;
		}
		
		return sign + numReg.slice(0, -1) + numDec;
	},
	
	// Возвращает дробную часть числа (с точкой)
	getDec: function(num) {
		return ('' + num).replace(/[0-9,-]+\d*/,'');
	},
	
	// Убираем спецсимволы
	unescapeHtml: function(str){
		return (str||'')
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&rsquo;/g,"'")
			.replace(/&#039;/g, "'")
			.replace(/&#39;/g, "'")
			.replace(/&#92;/g, '\\');
	
	},
	
	// Вставляем спецсимволы
	escapeHtml: function(str){
		return str
			.replace(/[&]/g, '&amp;')
			.replace(/[<]/g, '&lt;')
			.replace(/[>]/g, '&gt;')
			.replace(/["]/g, '&quot;')
			.replace(/[']/g, "&rsquo;")
			.replace(/[\\]/g, "&#92;")
			.replace(/[\/]/g, "&#47;")
	},
		
	// Название константы по её коду
	cnstName: function(cnstBlock, val){
		for (var name in cnstBlock) {
			if (cnstBlock[name] == val) {
				return name;	
			}
		}
		return '';
	},   

	createIds: function(from, to, field){
		if (!field) field = 'name';
		for (var id in from) {

			to[from[id][field]] = +id;
		}
	},

	htmlToText: function(html){
		return $('<div>'+html+'</div>').text();
	},
	
	// HTML/CSS //
	
	// Счётчик знаков в инпутах 
	assignLengthCounter: function(textElem, max, counter){
		$(textElem).on('input', function(){
			var text = $(this).val(),
				rest = max - text.length;
			
			if( rest < 0 )
				$(this).val( text.slice(0, rest) );
			
			$(counter).text(Math.max(0, rest));
		}).trigger('input');
	},
	
	// Проверка input'a на ввод целого числа 
	checkInputInt: function(el, maxVal, minVal, noZero){
		var $el = $(el),
			val = $el.val(),
			sign = val[0] == '-' ? '-' : '',
			valChecked = sign + ~~val.replace(/[^\d]/gi, ""),
			valid = true; // Валидация изменения значения в инпуте. Если значение валидно (не вставлялись буквеннык символы, левые знаки и т.п.) не производим ручную вставку в инпут ($el.val(val)), дабы не сбрасывать положение каретки
		
		// Если были вырезаны неподходящие символы 
		if( val.length != valChecked.length )
			valid = false;
		
		val = +valChecked;
		
		if( maxVal !== undefined && val > maxVal ){
			val = ~~maxVal;
			valid = false;
		}
		else if( minVal !== undefined && val <= minVal ){
			val = !noZero ? minVal : '';
			valid = false;
		}

		val = '' + val;

		if( !valid )
			$el.val(val);
		
		return val;
	},
	
	// Проверка input'a на ввод дробного числа (работает с типами text и tel)
	checkInputFloat: function(el, maxVal, minVal){
		var $el = $(el),
			val = $el.val(),
			sign = val[0] == '-' ? '-' : '',
			valChecked = val.replace(/[^\d.,]/gi, ""),
			valid = true; // Валидация изменения значения в инпуте. Если значение валидно (не вставлялись буквеннык символы, левые знаки и т.п.) не производим ручную вставку в инпут ($el.val(val)), дабы не сбрасывать положение каретки
		
		if( valChecked === '' )
			return false;
		
		valChecked = sign + valChecked;
		
		// Если были вырезаны неподходящие символы
		if( val.length != valChecked.length )
			valid = false;
		
		val = +valChecked;
		
		if( maxVal !== undefined && val > maxVal ){
			val = ~~maxVal;
			valid = false;
		}
		else if( minVal !== undefined && val <= minVal ){
			val = minVal;
			valid = false;
		}

		val = '' + val;

		if( !valid )
			$el.val(val);
	},
	
	textSelection: function(el){
		el = $(el).get(0);
		  
		if( window.getSelection ){  
			var s = window.getSelection();  
			if( s.setBaseAndExtent ){
				s.setBaseAndExtent(el, 0, el, el.innerText.length-1);  
			}
			else{  
				var r = document.createRange();  
				r.selectNodeContents(el);  
				s.removeAllRanges();  
				s.addRange(r);
			}
		}
		else if( document.getSelection ){
			var s = document.getSelection();  
			var r = document.createRange();  
			r.selectNodeContents(el);  
			s.removeAllRanges();  
			s.addRange(r);  
		}
		else if( document.selection ){
			var r = document.body.createTextRange();  
			r.moveToElementText(el);  
			r.select();
		}
	},
	
	// УРЛ //
	
	urlToObj: function(url) {
		url = url || document.location.search;
		if (url[0] == '?' || url[0] == '#') url = url.slice(1);//отрубаем вопросительный знак
		
		var arr = url.split('&');
		var params = {};
		for (var i in arr) {
			if (arr[i].indexOf('=') == -1){
				params[arr[i]] = true;//если параметр без значения, пинаем true
			} else {
				var part = arr[i].split('=');
				params[part[0]] = decodeURIComponent(part[1].replace(/[+]/g, ' '));//правим все плюсы
			}
		}
		return params;
	},
	
	urlToObjFull: function(url) {
		//обработка полной ссылки (путь+параметры)
		url = url.split('?');
		if ( url[1] ) {
			var path = url[0];
			
			url = url[1].split('#');
			
			var get = utils.urlToObj(url[0]);
			var hash = url.length > 1? utils.urlToObj(url[1]): {};
		} else {
			url = url[0].split('#');
			
			var path = url[0];
			var get = {};
			var hash = url.length > 1? utils.urlToObj(url[1]): {};
		}
		return {
			path: path,
			get: get,
			hash: hash}
	},
	
	// checkSame проверять наличие уже присутствуещих свойств. Если есть заносить в объект с постфиксом _(index)
	serializeToObject: function(str, checkSame) {
		var params = {};
		
		if( !str ) return params;
		
		var arr = str.split('&');
		var index = 0;
		for (var i in arr) {
			var part = arr[i].split('=');
			if( params[part[0]] !== undefined && checkSame )
				part[0] += '_' + (index++);
			
			params[part[0]] = decodeURIComponent(part[1].replace(/[+]/g, ' ')); // Правим все плюсы	
		}
		return params;
	},
	
	getHashParams: function(param){
		var hashObj = utils.urlToObj(location.hash);
		return param ? hashObj[param] : hashObj;
	},
	
	objToUrl: function(obj){
		var url = '';
		for(var param in obj){
			url += param+'='+obj[param]+'&';
		}
		return url.substr(0, url.length-1);
	},
	
	objToUrlFull: function(obj){
		var url = obj.path;
		if (utils.sizeOf(obj.get)) url += '?' + utils.objToUrl(obj.get);
		if (utils.sizeOf(obj.hash)) url += '#' + utils.objToUrl(obj.hash);
		return url;
	},
	
	// Маски //
	
	// Есть ли индекс в маске
	inMask: function(ind, mask){
		return ((1<<ind)&mask) > 0
	},

	// Переключает индекс в маске
	toggleMask: function(ind, mask){
		return mask + (utils.inMask(ind, mask)? -1: 1) * (1<<ind);
	},
	
	// Разное //
	
	random: function(n){
		var rnd = Math.random();
		if (rnd == 1) rnd = 0;
		return utils.toInt(rnd*n);
	},
	
	// Длина строки в байтах
	getStrByteLength: function(str) {
		var length = str.length, count = 0, i = 0, ch = 0;
		for(i; i < length; i++){
			ch = str.charCodeAt(i);
			if(ch <= 127){
			   count++;
			}else if(ch <= 2047){
			   count += 2;
			}else if(ch <= 65535){
			   count += 3;
			}else if(ch <= 2097151){
			   count += 4;
			}else if(ch <= 67108863){
			   count += 5;
			}else{
			   count += 6;
			}
		}
		return count;
	},
	
	getWindowWidth: function(val){
		return $(window).width() + utils.toInt(val);
	},
	
	getWindowHeight: function(val){
		return $(window).height() + utils.toInt(val);;
	},
	
	/*
		арифметические операции над каждым членом массива или объекта
		obj1 - объект, массив
		obj2 - объект или число, если obj1 - объект, массив или число, если obj1 - массив
		action - один из +-/*
		!obj1.length <= obj2.length, поля obj1 должны присутствовать в obj2
	*/
	objMath: function(obj1, action, obj2){
		var obj3 = utils.isArray(obj1)? []: {};
		for (var i in obj1) {
			var obj1i = obj1[i];
			var obj2i = typeof(obj2)=='object'? obj2[i]: obj2;
			switch(action){
				case '+':
					obj3[i] = obj1i + obj2i;
					break;
				case '-':
					obj3[i] = obj1i - obj2i;
					break;
				case '/':
					obj3[i] = obj1i / obj2i;
					break;
				case '*':
					obj3[i] = obj1i * obj2i;
					break;
			}
		}
		return obj3;
	},
	
	strictRound: function(val, dec) {
		return +utils.toFixed(val, dec||5, true); // Округляем в 5-м знаке
	},
	
	setFullScreen: function(el){
		el = el ? $(el).get(0) : document.documentElement;
		
		if(el.requestFullscreen) el.requestFullscreen();
		else if(el.mozRequestFullScreen) el.mozRequestFullScreen();
		else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
		else if(el.msRequestFullscreen) el.msRequestFullscreen();
		else {
			//альтернативное решение для браузеров, которые не поддерживают fullscreen
		}
	},
	
	unsetFullScreen: function(el){
		el = document;
		
		if(el.exitFullscreen) el.exitFullscreen();
		else if(el.mozCancelFullScreen) el.mozCancelFullScreen();
		else if(el.webkitCancelFullScreen) el.webkitCancelFullScreen();
		else if(el.msExitFullscreen) el.msExitFullscreen();
		else {
			//альтернативное решение для браузеров, которые не поддерживают exitfullscreen()
		}
	},

	hasTouches: function() {  
		  try {  
		    document.createEvent("TouchEvent");  
		    return true;  
		  } catch (e) {  
		    return false;  
		  }  
	},

	//проверяем длину строки
	//предел - [min, max], либо max, либо min, max
	checkLimits: function(name, limits){
		if ( arguments[1] instanceof Object ) {
			limits = arguments[1];
		} else if ( arguments[2] !== undefined) {
			limits = [arguments[1], arguments[2]]
		} else {
			limits = [0, arguments[1]]
		}
		
	    name = name||'';

	    return name.length >= limits[0] && name.length <= limits[1];
	},
	
	isLSAvail: function(){
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	},
	
	isSessionStorageAvail: function(){
		try {
			return 'sessionStorage' in window && window['sessionStorage'] !== null;
		} catch (e) {
			return false;
		}
	},
};