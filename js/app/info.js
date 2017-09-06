/**
	Хранилище всех данных
*/

function Info(){
	var self = this;
	
	this.init = function(data){
		
		return this;
	};
	
	this.addElementToList = function(list, id, data){
		data.id = id;
		data.order = utils.sizeOf(list);
		
		list[id] = data;
	};
	
	this.addTabPriceData = function(tabsData, tabName, data){
		var tab = tabsData[tabName] = tabsData[tabName]||{};
		if( !tab.priceData ){
			tab.priceData = {};
			tab.priceData.list = [];
			tab.priceData.prepareData = function(tabCls, priceData){
				tabCls.staticData = tabCls.staticData||{};
				var list = priceData.list;
				for(var item in list){
					list[item].id = tabCls.exemplar.name + '_' + item;
				}
				tabCls.staticData.priceArr = list;
			};
		}
		tab.priceData.list.push(data);
	};
	
	this.addTabGalleryData = function(tabsData, tabName, data){
		var tab = tabsData[tabName] = tabsData[tabName]||{};
		if( !tab.galleryData ){
			tab.galleryData = {};
			tab.galleryData.list = [];
			tab.galleryData.prepareData = function(tabCls, galleryData){
				tabCls.staticData = tabCls.staticData||{};
				var list = galleryData.list;
				for(var item in list){
					list[item].id = tabCls.exemplar.name + '_' + item;
					list[item].order = +item;
				}
				tabCls.staticData.galleryArr = list;
			};
		}
		tab.galleryData.list.push(data);
	};
}

info = new Info();

/***********************
****НИЖЕ ИДУТ ДАННЫЕ**** 
***********************/

/* КОНТАКЫ */
info.contacts = {};
	info.contacts.site = {text: 'ВсеМастер.рф'};
	info.contacts.phones = {};
	info.contacts.phones.list = {};
		info.addElementToList(info.contacts.phones.list, 'phone', {text: '280-18-55'});
		info.addElementToList(info.contacts.phones.list, 'phone_regional', {text: '+7(913) 573-97-58'});
	info.contacts.mails = {};
	info.contacts.mails.list = {};
		info.addElementToList(info.contacts.mails.list, 'mail', {text: 'vsemaster.rf@gmail.com', href: 'vsemaster.rf@gmail.com'});
	info.contacts.messengers = {};
	info.contacts.messengers.phone = '+7 923 775 55 83';
	info.contacts.messengers.list = {};
		info.addElementToList(info.contacts.messengers.list, 'whatsapp', {text: 'Whatsapp', href: 'whatsapp://send?phone='});
		info.addElementToList(info.contacts.messengers.list, 'viber', {text: 'Viber', href: 'viber://chat?number='});
			info.addElementToList(info.contacts.messengers.list, 'telegram', {text: 'Telegram', href: 'tg://resolve?domain='});
	info.contacts.social = {};
	info.contacts.social.list = {};
		info.addElementToList(info.contacts.social.list, 'vk', {text: 'Вконтакте', href: 'https://vk.com/rmasla'});




/* МЕНЮ */
info.menu = {};
	info.addElementToList(info.menu, 'general', {title: 'Главная'});
	info.addElementToList(info.menu, 'services', {title: 'Услуги'});
		info.menu.services.child = {};
			info.addElementToList(info.menu.services.child, 'services_electrics', {title: 'Электрика'});
			info.addElementToList(info.menu.services.child, 'services_sanitary', {title: 'Сантехника'});
			info.addElementToList(info.menu.services.child, 'services_siding', {title: 'Сайдинг'});
	info.addElementToList(info.menu, 'price', {title: 'Цены'});
	info.addElementToList(info.menu, 'contacts', {title: 'Контакты'});
		info.menu.contacts.child = {};
			info.addElementToList(info.menu.contacts.child, 'contacts_about', {title: 'О нас'});





/* ИНТРО (СЛАЙДЕР НА ГЛАВНОЙ СТРАНИЦЕ) */
info.intro = {};
	info.intro.gallery = {};
		info.intro.gallery.list = [
			{scr: '/cont/img/work_examples/dog.jpg', scrSmall: '/cont/img/work_examples/dog.jpg'},
			{scr: '/cont/img/work_examples/field.jpg'},
			{scr: '/cont/img/work_examples/gnome.jpg'},
			{scr: '/cont/img/work_examples/golf.jpg'},
			{scr: '/cont/img/work_examples/leaf.jpg'},
			{scr: '/cont/img/work_examples/pencils.jpg'},
			{scr: '/cont/img/work_examples/river.jpg'},
			{scr: '/cont/img/work_examples/train.jpg'},
			{scr: '/cont/img/work_examples/test.jpg'},
		];





/* ДАННЫЕ ДЛЯ ВКЛАДОК */
info.tabsData = {};



/* ТАБЛИЦЫ С ЦЕНАМИ */

/* ВКЛАДКА "ЦЕНЫ" */
tempData = {
	list: [
		{name: 'Погрузка угля', countPreFix: '', count: 2, countPostFix: ' ч.', costPreFix: 'от ', cost: 500, costPostFix: ' руб.', order: 0},
		{name: 'Уборка конюшен', countPreFix: '', count: 1, countPostFix: ' ч.', costPreFix: '', cost: 340, costPostFix: ' руб.', order: 1},
	],
	title: 'Дополнительные услуги',
	order: 5
}
info.addTabPriceData(info.tabsData, 'price', tempData);

/* ВКЛАДКА "САЙДИНГ" */
tempData = {
	list: [
		{name: 'Обивка стен', countPreFix: '', count: 1, countPostFix: ' кв. м2', costPreFix: '', cost: 1000, costPostFix: ' руб.', order: 0},
	],
	title: 'Сайдинг99999999999',
	order: 0,
}
info.addTabPriceData(info.tabsData, 'services_siding', tempData);



/* ГАЛЕРЕИ */

/* ВКЛАДКА "САЙДИНГ" */

tempData = {
	list: [
		{scr: '/cont/img/services/siding/dog.jpg', scrSmall: '/cont/img/services/siding/dog.jpg'},
		{scr: '/cont/img/services/siding/field.jpg'},
		{scr: '/cont/img/services/siding/gnome.jpg'},
		{scr: '/cont/img/services/siding/golf.jpg'},
		{scr: '/cont/img/services/siding/leaf.jpg'},
		{scr: '/cont/img/services/siding/pencils.jpg'},
		{scr: '/cont/img/services/siding/river.jpg'},
		{scr: '/cont/img/services/siding/train.jpg'},
		{scr: '/cont/img/services/siding/test.jpg'},
	],
	title: 'Галерея Сайдинга',
	height: 150,
}
info.addTabGalleryData(info.tabsData, 'services_siding', tempData);

tempData = {
	list: [
		{scr: '/cont/img/services/siding/dog.jpg', scrSmall: '/cont/img/services/siding/dog.jpg'},
		{scr: '/cont/img/services/siding/field.jpg'},
		{scr: '/cont/img/services/siding/gnome.jpg'},
		{scr: '/cont/img/services/siding/golf.jpg'},
		{scr: '/cont/img/services/siding/leaf.jpg'},
		{scr: '/cont/img/services/siding/pencils.jpg'},
		{scr: '/cont/img/services/siding/river.jpg'},
		{scr: '/cont/img/services/siding/train.jpg'},
		{scr: '/cont/img/services/siding/test.jpg'},
	],
	title: 'Галерея Сайдинга',
	height: 150,
}
info.addTabGalleryData(info.tabsData, 'services_siding', tempData);