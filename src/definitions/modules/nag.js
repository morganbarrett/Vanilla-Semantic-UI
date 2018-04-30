/*!
 * # Vanilla Semantic UI - Nag
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

vs.nag = function(element, settings){
	var className = settings.className,
		selector = settings.selector,
		error = settings.error,
		namespace = settings.namespace,
		eventNamespace = '.' + namespace,
		moduleNamespace = namespace + 'Module',
		context = document.querySelector(settings.context ? settings.context : "body"),
		instance = element[moduleNamespace],
		moduleOffset,
		moduleHeight,
		contextWidth,
		contextHeight,
		contextOffset,
		yOffset,
		yPosition,
		timer,
		module,
		requestAnimationFrame = window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(callback){ setTimeout(callback, 0); };

	module = {
		initialize: function(){
			module.verbose('Initializing element');

			element.onclick = function(event){
				if(vs.checkTarget(event, selector.close)){
					module.dismiss(event);
				}
			}
			element[moduleNamespace] = module;

			if(settings.detachable && $module.parentElement !== context){
				element.remove();
				context.prepend(element);
			}

			if(settings.displayTime > 0){
				setTimeout(module.hide, settings.displayTime);
			} else {
				element.style.display = "none";
			}

			module.show();
		},
		destroy: function(){
			module.verbose('Destroying instance');
			element.onclick = undefined;
			element[moduleNamespace] = undefined;
		},
		show: function(){
			if(module.should.show() && !vs.isVisible(element)){
				console.log("hey")
				module.debug('Showing nag', settings.animation.show);
				if(settings.animation.show == 'fade'){
					vs.fadeIn(element, {
						duration: settings.duration,
						easing: settings.easing
					});
				}
				else {
					vs.fadeIn(element, {
						duration: settings.duration,
						easing: settings.easing
					});
				}
			}
		},
		hide: function(){
			module.debug('Showing nag', settings.animation.hide);
			if(settings.animation.show == 'fade'){
				vs.fadeOut(element, {
					duration: settings.duration,
					easing: settings.easing
				});
			}
			else {
				vs.fadeOut(element, {
					duration: settings.duration,
					easing: settings.easing
				});
			}
		},
		onHide: function(){
			module.debug('Removing nag', settings.animation.hide);
			element.parentNode.removeChild(element);

			if(settings.onHide){
				settings.onHide();
			}
		},
		dismiss: function(event){
			if(settings.storageMethod){
				module.storage.set(settings.key, settings.value);
			}
			module.hide();
			event.stopImmediatePropagation();
			event.preventDefault();
		},
		should: {
			show: function(){
				if(settings.persist){
					module.debug('Persistent nag is set, can show nag');
					return true;
				}
				if( module.storage.get(settings.key) != settings.value.toString() ){
					module.debug('Stored value is not set, can show nag', module.storage.get(settings.key));
					return true;
				}
				module.debug('Stored value is set, cannot show nag', module.storage.get(settings.key));
				return false;
			}
		},
		get: {
			storageOptions: function(){
				var options = {};

				if(settings.expires){
					options.expires = settings.expires;
				}
				if(settings.domain){
					options.domain = settings.domain;
				}
				if(settings.path){
					options.path = settings.path;
				}

				return options;
			}
		},
		clear: function(){
			module.storage.remove(settings.key);
		},
		storage: {
			set: function(key, value){
				var options = module.get.storageOptions();

				if(settings.storageMethod == 'localstorage' && window.localStorage !== undefined){
					window.localStorage.setItem(key, value);
					module.debug('Value stored using local storage', key, value);
				} else if(settings.storageMethod == 'sessionstorage' && window.sessionStorage !== undefined){
					window.sessionStorage.setItem(key, value);
					module.debug('Value stored using session storage', key, value);
				} else if(document.cookie !== undefined){
					//$.cookie(key, value, options);

					document.cookie = key + "=" + value + ";" +
						"expires=" + options.expires + ";" +
						//"domain=" + options.domain + ";" +
						"path=" + options.path;

					module.debug('Value stored using cookie', key, value, options);
				} else {
					module.error(error.noCookieStorage);
					return;
				}
			},
			get: function(key, value){
				var storedValue;

				if(settings.storageMethod == 'localstorage' && window.localStorage !== undefined){
					storedValue = window.localStorage.getItem(key);
				} else if(settings.storageMethod == 'sessionstorage' && window.sessionStorage !== undefined){
					storedValue = window.sessionStorage.getItem(key);
				} else if(document.cookie !== undefined){
					var reg = new RegExp("[; ]" + key + "=([^\\s;]*)");
					var sMatch = (' ' + document.cookie).match(reg);
						storedValue = sMatch[1];
				} else {
					module.error(error.noCookieStorage);
				}

				if(storedValue == 'undefined' || storedValue == 'null' || storedValue === undefined || storedValue === null){
					storedValue = undefined;
				}

				return storedValue;
			},
			remove: function(key){
				var options = module.get.storageOptions();

				if(settings.storageMethod == 'localstorage' && window.localStorage !== undefined){
					window.localStorage.removeItem(key);
				} else if(settings.storageMethod == 'sessionstorage' && window.sessionStorage !== undefined){
					window.sessionStorage.removeItem(key);
				} else if(document.cookie !== undefined){
					document.cookie = key + "=;" +
						"expires=Thu, 01 Jan 1970 00:00:00 GMT;" +
						//"domain=" + options.domain + ";" +
						"path=" + options.path;
				} else {
					module.error(error.noStorage);
				}
			}
		}
	};

	return module;
};

vs.nag.settings = {
	name: 'Nag',
	silent: false,
	debug: false,
	verbose: false,
	performance: true,
	namespace: 'Nag',
	persist: false,
	displayTime: 0,
	context: false,
	detachable: false,
	expires: 30,
	domain: false,
	path: '/',
	storageMethod: 'cookie',
	key: 'nag',
	value: 'dismiss',
	speed: 500,
	easing: 'easeOutQuad',
	onHide: function(){},
	selector: {
		close: '.close.icon'
	},
	className: {
		bottom: 'bottom',
		fixed: 'fixed'
	},
	animation: {
		show: 'slide',
		hide: 'slide'
	},
	error: {
		noCookieStorage: '$.cookie is not included. A storage solution is required.',
		noStorage: 'Neither $.cookie or store is defined. A storage solution is required for storing state',
		method: 'The method you called is not defined.'
	}
};
