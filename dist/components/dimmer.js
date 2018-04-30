/*!
 * # Vanilla Semantic UI 0.0.1 - Dimmer
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

vs.dimmer = function(element, settings){
	var selector = settings.selector,
		namespace = settings.namespace,
		className = settings.className,
		error = settings.error,
		eventNamespace = '.' + namespace,
		moduleNamespace = 'module-' + namespace,
		clickEvent = ('ontouchstart' in document.documentElement)
			? 'touchstart' : 'onclick',
		instance = element[moduleNamespace],
		dimmer,
		dimmable,
		module;

	module = {
		preinitialize: function(){
			if(module.is.dimmer()){
				dimmable = element.parentElement;
				dimmer = element;
			} else {
				dimmable = element;
				
				if(module.has.dimmer()){
					if(settings.dimmerName){
						dimmer = dimmable.querySelector(selector.dimmer).filter(function(elem){
							return elem.matches('.' + settings.dimmerName);
						});
					} else {
						dimmer = dimmable.querySelector(selector.dimmer);
					}
				} else {
					dimmer = module.create();
				}

				module.set.variation();
			}
		},
		initialize: function(){
			module.debug('Initializing dimmer', settings);

			module.bind.events();
			module.set.dimmable();
			module.instantiate();
		},
		instantiate: function(){
			module.verbose('Storing instance of module', module);
			instance = module;
			element[moduleNamespace] = instance;
		},
		destroy: function(){
			module.verbose('Destroying previous module', dimmer);
			module.unbind.events();
			module.remove.variation();
			dimmable[clickEvent] = undefined;
			dimmable.onmouseover = undefined;
			dimmable.onmouseout = undefined;
		},
		bind: {
			events: function(){
				if(settings.on == 'hover'){
					dimmable.onmouseover = function(event){
						if(event.target.parentElement == dimmable){
							module.show();
						}
					}

					dimmable.onmouseout = function(event){
						console.log(event.target.parentElement == dimmable, event.target.parentElement, dimmable)
						if(event.target.parentElement == dimmable){
							module.hide();
						}
					}
				} else if(settings.on == 'click'){
					dimmable[clickEvent] = module.toggle;
				}

				if( module.is.page() ){
					module.debug('Setting as a page dimmer', dimmable);
					module.set.pageDimmer();
				}

				if( module.is.closable() ){
					module.verbose('Adding dimmer close event', dimmer);
					dimmable[clickEvent] = module.event.click;
				}
			}
		},
		unbind: {
			events: function(){
				element[moduleNamespace] = undefined;
				dimmable[clickEvent] = undefined;
				dimmable.onmouseover = undefined;
				dimmable.onmouseout = undefined;
			}
		},
		event: {
			click: function(event){
				module.verbose('Determining if event occured on dimmer', event);
				if(  event.target.matches(selector.content) ){
					module.hide();
					event.stopImmediatePropagation();
				}
			}
		},
		addContent: function(elem){
			var content = elem;

			module.debug('Add content to dimmer', content);

			if(content.parentElement !== dimmer){
				content.remove();
				dimmer.append(content);
			}
		},
		create: function(){
			var elem = settings.template.dimmer();

			if(settings.dimmerName){
				module.debug('Creating named dimmer', settings.dimmerName);
				elem.classList.add(settings.dimmerName);
			}
			
			dimmable.append(elem);
			
			return elem;
		},
		show: function(callback){
			module.debug('Showing dimmer', dimmer, settings);

			if(typeof callback !== "function"){
				callback = function(){};
			}

			if( (!module.is.dimmed() || module.is.animating()) && module.is.enabled() ){
				module.animate.show(callback);
				settings.onShow.call(element);
				settings.onChange.call(element);
			} else {
				module.debug('Dimmer is already shown or disabled');
			}
		},
		hide: function(callback){
			if(typeof callback !== "function"){
				callback = function(){};
			}

			if( module.is.dimmed() || module.is.animating() ){
				module.debug('Hiding dimmer', dimmer);
				module.animate.hide(callback);
				settings.onHide.call(element);
				settings.onChange.call(element);
			}
			else {
				module.debug('Dimmer is not visible');
			}
		},
		toggle: function(){
			module.verbose('Toggling dimmer visibility', dimmer);
			if( !module.is.dimmed() ){
				module.show();
			}
			else {
				module.hide();
			}
		},
		animate: {
			show: function(callback){
				if(typeof callback !== "function"){
					callback = function(){};
				}

				if(settings.useCSS && vs.transition !== undefined && vs.transition(dimmer, 'is supported')){
					if(settings.opacity !== 'auto'){
						module.set.opacity();
					}

					vs.transition(dimmer, {
						displayType : 'flex',
						animation   : settings.transition + ' in',
						queue       : false,
						duration    : module.get.duration(),
						useFailSafe : true,
						onStart     : function(){
							module.set.dimmed();
						},
						onComplete  : function(){
							module.set.active();
							callback();
						}
					});
				} else {
					module.verbose('Showing dimmer animation with javascript');
					module.set.dimmed();
					
					if(settings.opacity == 'auto'){
						settings.opacity = 0.8;
					}

					dimmer.style.opacity = 0;
					dimmer.style.width = "100%";
					dimmer.style.height = "100%";

					vs.fadeIn(dimmer, {
						to: settings.opacity,
						display: "flex",
						duration: module.get.duration(),
						ondone: function(){
							dimmer.removeAttribute('style');
							module.set.active();
							callback();
						}
					});
				}
			},
			hide: function(callback){
				if(typeof callback !== "function"){
					callback = function(){};
				}

				if(settings.useCSS && vs.transition !== undefined && vs.transition(dimmer, 'is supported')){
					module.verbose('Hiding dimmer with css');
					vs.transition(dimmer, {
						displayType : 'flex',
						animation   : settings.transition + ' out',
						queue       : false,
						duration    : module.get.duration(),
						useFailSafe : true,
						onStart     : function(){
							module.remove.dimmed();
						},
						onComplete  : function(){
							module.remove.active();
							callback();
						}
					});
				} else {
					module.verbose('Hiding dimmer with javascript');
					module.remove.dimmed();
					
					vs.fadeOut(dimmer, {
						duration: module.get.duration(),
						ondone: function(){
							module.remove.active();
							dimmer.removeAttribute('style');
							callback();
						}
					});
				}
			}
		},
		get: {
			dimmer: function(){
				return dimmer;
			},
			duration: function(){
				if(typeof settings.duration == 'object'){
					if( module.is.active() ){
						return settings.duration.hide;
					}
					else {
						return settings.duration.show;
					}
				}
				return settings.duration;
			}
		},
		has: {
			dimmer: function(){
				if(settings.dimmerName){
					return ( element.querySelectorAll(selector.dimmer).filter(function(elem){
						return elem.match('.' + settings.dimmerName)
					}).length > 0);
				}
				else {
					return ( element.querySelectorAll(selector.dimmer).length > 0 );
				}
			}
		},
		is: {
			active: function(){
				return dimmer.classList.contains(className.active);
			},
			animating: function(){
				return dimmer.classList.contains(className.animating);
			},
			closable: function(){
				if(settings.closable == 'auto'){
					if(settings.on == 'hover'){
						return false;
					}
					return true;
				}
				return settings.closable;
			},
			dimmer: function(){
				return element.classList.contains(className.dimmer);
			},
			dimmable: function(){
				return element.classList.contains(className.dimmable);
			},
			dimmed: function(){
				return dimmable.classList.contains(className.dimmed);
			},
			disabled: function(){
				return dimmable.classList.contains(className.disabled);
			},
			enabled: function(){
				return !module.is.disabled();
			},
			page: function (){
				return dimmable.matches('body');
			},
			pageDimmer: function(){
				return dimmer.classList.contains(className.pageDimmer);
			}
		},
		can: {
			show: function(){
				return !dimmer.classList.contains(className.disabled);
			}
		},
		set: {
			opacity: function(opacity){
				var
					color      = getComputedStyle(dimmer).backgroundColor,
					colorArray = color.split(','),
					isRGB      = (colorArray && colorArray.length == 3),
					isRGBA     = (colorArray && colorArray.length == 4)
				;
				opacity    = settings.opacity === 0 ? 0 : settings.opacity || opacity;
				if(isRGB || isRGBA){
					colorArray[3] = opacity + ')';
					color         = colorArray.join(',');
				}
				else {
					color = 'rgba(0, 0, 0, ' + opacity + ')';
				}
				module.debug('Setting opacity to', opacity);
				dimmer.style.backgroundColor = color;
			},
			active: function(){
				dimmer.classList.add(className.active);
			},
			dimmable: function(){
				dimmable.classList.add(className.dimmable);
			},
			dimmed: function(){
				dimmable.classList.add(className.dimmed);
			},
			pageDimmer: function(){
				dimmer.classList.add(className.pageDimmer);
			},
			disabled: function(){
				dimmer.classList.add(className.disabled);
			},
			variation: function(variation){
				variation = variation || settings.variation;
				if(variation){
					dimmer.classList.add(variation);
				}
			}
		},
		remove: {
			active: function(){
				dimmer.classList.remove(className.active);
			},
			dimmed: function(){
				dimmable.classList.remove(className.dimmed);
			},
			disabled: function(){
				dimmer.classList.remove(className.disabled);
			},
			variation: function(variation){
				variation = variation || settings.variation;
				if(variation){
					dimmer.classList.remove(variation);
				}
			}
		}
	};

	module.preinitialize();

	return module;
};

vs.dimmer.settings = {
	name: 'Dimmer',
	namespace: 'dimmer',
	silent: false,
	debug: false,
	verbose: false,
	performance: true,
	dimmerName: false,
	variation: false,
	closable: 'auto',
	useCSS: false,
	transition: 'fade',
	on: false,
	opacity: 'auto',
	onChange: function(){},
	onShow: function(){},
	onHide: function(){},
	error: {
		method: 'The method you called is not defined.'
	},
	duration: {
		show: 500,
		hide: 500
	},
	selector: {
		dimmer: '.ui.dimmer',
		content: '.ui.dimmer > .content, .ui.dimmer > .content > .center'
	},
	template: {
		dimmer: function(){
			var elem = document.createElement("div");
			elem.setAttribute('class', 'ui dimmer');
			return elem;
		}
	},
	className: {
		active: 'active',
		animating: 'animating',
		dimmable: 'dimmable',
		dimmed: 'dimmed',
		dimmer: 'dimmer',
		disabled: 'disabled',
		hide: 'hide',
		pageDimmer: 'page',
		show: 'show'
	}
};
