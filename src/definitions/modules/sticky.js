/*!
 * # Vanilla Semantic UI - Sticky
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

ui.sticky = function(element, settings){
	var className = settings.className,
		namespace = settings.namespace,
		error = settings.error,
		scroll = element.querySelectorAll(settings.scrollContext),
		container,
		context,
		instance = element[moduleNamespace],
		requestAnimationFrame = window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(callback){ setTimeout(callback, 0); },
		documentObserver,
		observer,
		module;
	
	module = {
		initialize: function(){
			module.determineContainer();
			module.determineContext();
			module.verbose('Initializing sticky', settings, container);

			module.save.positions();
			module.checkErrors();
			module.bind.events();

			if(settings.observeChanges){
				module.observeChanges();
			}
		},
		destroy: function(){
			module.verbose('Destroying previous instance');
			module.reset();
			if(documentObserver){
				documentObserver.disconnect();
			}
			if(observer){
				observer.disconnect();
			}
			//$window
			//	.off('load' + eventNamespace, module.event.load)
			//	.off('resize' + eventNamespace, module.event.resize)
			
			//$scroll
			//	.off('scrollchange' + eventNamespace, module.event.scrollchange)
			
			//element.removeData(moduleNamespace);
		},
		observeChanges: function(){
			if('MutationObserver' in window){
				documentObserver = new MutationObserver(module.event.documentChanged);
				observer         = new MutationObserver(module.event.changed);
				documentObserver.observe(document, {
					childList : true,
					subtree   : true
				});
				observer.observe(element, {
					childList : true,
					subtree   : true
				});
				observer.observe($context[0], {
					childList : true,
					subtree   : true
				});
				module.debug('Setting up mutation observer', observer);
			}
		},
		determineContainer: function(){
			if(settings.container){
				container = document.querySelector(settings.container);
			}
			else {
				container = element.offsetParent;
			}
		},
		determineContext: function(){
			if(settings.context){
				context = document.querySelectorAll(settings.context);
			}
			else {
				context = container;
			}
			if(context.length === 0){
				module.error(error.invalidContext, settings.context, module);
				return;
			}
		},
		checkErrors: function(){
			if( module.is.hidden() ){
				module.error(error.visible, module);
			}
			if(module.cache.element.height > module.cache.context.height){
				module.reset();
				module.error(error.elementSize, module);
				return;
			}
		},
		bind: {
			events: function(){
				$window
					.on('load' + eventNamespace, module.event.load)
					.on('resize' + eventNamespace, module.event.resize)
				;
				// pub/sub pattern
				$scroll
					.off('scroll' + eventNamespace)
					.on('scroll' + eventNamespace, module.event.scroll)
					.on('scrollchange' + eventNamespace, module.event.scrollchange)
				;
			}
		},
		event: {
			changed: function(mutations){
				clearTimeout(module.timer);
				module.timer = setTimeout(function(){
					module.verbose('DOM tree modified, updating sticky menu', mutations);
					module.refresh();
				}, 100);
			},
			documentChanged: function(mutations){
				[].forEach.call(mutations, function(mutation){
					if(mutation.removedNodes){
						[].forEach.call(mutation.removedNodes, function(node){
							if(node == element || $(node).find(element).length > 0){
								module.debug('Element removed from DOM, tearing down events');
								module.destroy();
							}
						});
					}
				});
			},
			load: function(){
				module.verbose('Page contents finished loading');
				requestAnimationFrame(module.refresh);
			},
			resize: function(){
				module.verbose('Window resized');
				requestAnimationFrame(module.refresh);
			},
			scroll: function(){
				requestAnimationFrame(function(){
					$scroll.triggerHandler('scrollchange' + eventNamespace, $scroll.scrollTop() );
				});
			},
			scrollchange: function(event, scrollPosition){
				module.stick(scrollPosition);
				settings.onScroll.call(element);
			}
		},
		refresh: function(hardRefresh){
			module.reset();
			if(!settings.context){
				module.determineContext();
			}
			if(hardRefresh){
				module.determineContainer();
			}
			module.save.positions();
			module.stick();
			settings.onReposition.call(element);
		},
		supports: {
			sticky: function(){
				var
					$element = $('<div/>'),
					element = $element[0]
				;
				$element.classList.add(className.supported);
				return($element.css('position').match('sticky'));
			}
		},
		save: {
			lastScroll: function(scroll){
				module.lastScroll = scroll;
			},
			elementScroll: function(scroll){
				module.elementScroll = scroll;
			},
			positions: function(){
				var
					scrollContext = {
						height : $scroll.height()
					},
					element = {
						margin: {
							top    : parseInt(element.css('margin-top'), 10),
							bottom : parseInt(element.css('margin-bottom'), 10),
						},
						offset : element.offset(),
						width  : element.outerWidth(),
						height : element.outerHeight()
					},
					context = {
						offset : $context.offset(),
						height : $context.outerHeight()
					},
					container = {
						height: $container.outerHeight()
					}
				;
				if( !module.is.standardScroll() ){
					module.debug('Non-standard scroll. Removing scroll offset from element offset');

					scrollContext.top  = scroll.scrollTop;
					scrollContext.left = scroll.scrollLeft;

					element.offset.top  += scrollContext.top;
					context.offset.top  += scrollContext.top;
					element.offset.left += scrollContext.left;
					context.offset.left += scrollContext.left;
				}
				module.cache = {
					fits          : ( (element.height + settings.offset) <= scrollContext.height),
					sameHeight    : (element.height == context.height),
					scrollContext : {
						height : scrollContext.height
					},
					element: {
						margin : element.margin,
						top    : element.offset.top - element.margin.top,
						left   : element.offset.left,
						width  : element.width,
						height : element.height,
						bottom : element.offset.top + element.height
					},
					context: {
						top           : context.offset.top,
						height        : context.height,
						bottom        : context.offset.top + context.height
					}
				};
				module.set.containerSize();

				module.stick();
				module.debug('Caching element positions', module.cache);
			}
		},
		get: {
			direction: function(scroll){
				var
					direction = 'down'
				;
				scroll = scroll || $scroll.scrollTop();
				if(module.lastScroll !== undefined){
					if(module.lastScroll < scroll){
						direction = 'down';
					}
					else if(module.lastScroll > scroll){
						direction = 'up';
					}
				}
				return direction;
			},
			scrollChange: function(scroll){
				scroll = scroll || scroll.scrollTop;
				return (module.lastScroll)
					? (scroll - module.lastScroll)
					: 0
				;
			},
			currentElementScroll: function(){
				if(module.elementScroll){
					return module.elementScroll;
				}
				return ( module.is.top() )
					? Math.abs(parseInt(element.style.top, 10))    || 0
					: Math.abs(parseInt(element.style.bottom, 10)) || 0
				;
			},
			elementScroll: function(scroll){
				scroll = scroll || scroll.scrollTop;
				var
					element        = module.cache.element,
					scrollContext  = module.cache.scrollContext,
					delta          = module.get.scrollChange(scroll),
					maxScroll      = (element.height - scrollContext.height + settings.offset),
					elementScroll  = module.get.currentElementScroll(),
					possibleScroll = (elementScroll + delta)
				;
				if(module.cache.fits || possibleScroll < 0){
					elementScroll = 0;
				}
				else if(possibleScroll > maxScroll ){
					elementScroll = maxScroll;
				}
				else {
					elementScroll = possibleScroll;
				}
				return elementScroll;
			}
		},
		remove: {
			lastScroll: function(){
				delete module.lastScroll;
			},
			elementScroll: function(scroll){
				delete module.elementScroll;
			},
			minimumSize: function(){
				container.style.minHeight = "";
			},
			offset: function(){
				element.style.marginTop = "";
			}
		},
		set: {
			offset: function(){
				module.verbose('Setting offset on element', settings.offset);
				element.style.marginTop = settings.offset;
			},
			containerSize: function(){
				var tagName = container.tagName;
				
				if(tagName === 'HTML' || tagName == 'body'){
					// this can trigger for too many reasons
					//module.error(error.container, tagName, element);
					module.determineContainer();
				}
				else {
					if( Math.abs(container.offsetHeight - module.cache.context.height) > settings.jitter){
						module.debug('Context has padding, specifying exact height for container', module.cache.context.height);
						container.style.height = module.cache.context.height;
					}
				}
			},
			minimumSize: function(){
				var element = module.cache.element;
				container.style.minHeight = element.height;
			},
			scroll: function(scroll){
				module.debug('Setting scroll on element', scroll);
				if(module.elementScroll == scroll){
					return;
				}
				if( module.is.top() ){
					element.style.bottom = "";
					element.style.top = -scroll + "px";
				}
				if( module.is.bottom() ){
					element.style.top = "";
					element.style.bottom = scroll + "px";
				}
			},
			size: function(){
				if(module.cache.element.height !== 0 && module.cache.element.width !== 0){
					element.style.setProperty('width',  module.cache.element.width  + 'px', 'important');
					element.style.setProperty('height', module.cache.element.height + 'px', 'important');
				}
			}
		},
		is: {
			standardScroll: function(){
				return (scroll[0] == window);
			},
			top: function(){
				return element.classList.contains(className.top);
			},
			bottom: function(){
				return element.classList.contains(className.bottom);
			},
			initialPosition: function(){
				return (!module.is.fixed() && !module.is.bound());
			},
			hidden: function(){
				return (!ui.isVisible(element));
			},
			bound: function(){
				return element.classList.contains(className.bound);
			},
			fixed: function(){
				return element.classList.contains(className.fixed);
			}
		},
		stick: function(scroll){
			var
				cachedPosition = scroll || scroll.scrollTop,
				cache          = module.cache,
				fits           = cache.fits,
				sameHeight     = cache.sameHeight,
				element        = cache.element,
				scrollContext  = cache.scrollContext,
				context        = cache.context,
				offset         = (module.is.bottom() && settings.pushing)
					? settings.bottomOffset
					: settings.offset,
				scroll         = {
					top    : cachedPosition + offset,
					bottom : cachedPosition + offset + scrollContext.height
				},
				direction      = module.get.direction(scroll.top),
				elementScroll  = (fits)
					? 0
					: module.get.elementScroll(scroll.top),

				// shorthand
				doesntFit      = !fits,
				elementVisible = (element.height !== 0)
			;
			if(elementVisible && !sameHeight){

				if( module.is.initialPosition() ){
					if(scroll.top >= context.bottom){
						module.debug('Initial element position is bottom of container');
						module.bindBottom();
					}
					else if(scroll.top > element.top){
						if( (element.height + scroll.top - elementScroll) >= context.bottom ){
							module.debug('Initial element position is bottom of container');
							module.bindBottom();
						}
						else {
							module.debug('Initial element position is fixed');
							module.fixTop();
						}
					}

				}
				else if( module.is.fixed() ){

					// currently fixed top
					if( module.is.top() ){
						if( scroll.top <= element.top ){
							module.debug('Fixed element reached top of container');
							module.setInitialPosition();
						}
						else if( (element.height + scroll.top - elementScroll) >= context.bottom ){
							module.debug('Fixed element reached bottom of container');
							module.bindBottom();
						}
						// scroll element if larger than screen
						else if(doesntFit){
							module.set.scroll(elementScroll);
							module.save.lastScroll(scroll.top);
							module.save.elementScroll(elementScroll);
						}
					}

					// currently fixed bottom
					else if(module.is.bottom() ){

						// top edge
						if( (scroll.bottom - element.height) <= element.top){
							module.debug('Bottom fixed rail has reached top of container');
							module.setInitialPosition();
						}
						// bottom edge
						else if(scroll.bottom >= context.bottom){
							module.debug('Bottom fixed rail has reached bottom of container');
							module.bindBottom();
						}
						// scroll element if larger than screen
						else if(doesntFit){
							module.set.scroll(elementScroll);
							module.save.lastScroll(scroll.top);
							module.save.elementScroll(elementScroll);
						}

					}
				}
				else if( module.is.bottom() ){
					if( scroll.top <= element.top ){
						module.debug('Jumped from bottom fixed to top fixed, most likely used home/end button');
						module.setInitialPosition();
					}
					else {
						if(settings.pushing){
							if(module.is.bound() && scroll.bottom <= context.bottom ){
								module.debug('Fixing bottom attached element to bottom of browser.');
								module.fixBottom();
							}
						}
						else {
							if(module.is.bound() && (scroll.top <= context.bottom - element.height) ){
								module.debug('Fixing bottom attached element to top of browser.');
								module.fixTop();
							}
						}
					}
				}
			}
		},
		bindTop: function(){
			module.debug('Binding element to top of parent container');
			module.remove.offset();
			element.style.left = "";
			element.style.top = "";
			element.style.marginBottom = "";
				
			element.classList.remove(className.fixed);
			element.classList.remove(className.bottom);
			element.classList.add(className.bound);
			element.classList.add(className.top);

			settings.onTop.call(element);
			settings.onUnstick.call(element);
		},
		bindBottom: function(){
			module.debug('Binding element to bottom of parent container');
			module.remove.offset();
			element.style.left = "";
			element.style.top = "";
			
			element.classList.remove(className.fixed);
			element.classList.remove(className.top);
			element.classList.add(className.bound);
			element.classList.add(className.bottom);
			
			settings.onBottom.call(element);
			settings.onUnstick.call(element);
		},
		setInitialPosition: function(){
			module.debug('Returning to initial position');
			module.unfix();
			module.unbind();
		},
		fixTop: function(){
			module.debug('Fixing element to top of page');
			if(settings.setSize){
				module.set.size();
			}
			module.set.minimumSize();
			module.set.offset();
		

			element.style.left = module.cache.element.left;
			element.style.bottom = "";
			element.style.marginBottom = "";

			element.classList.remove(className.bound);
			element.classList.remove(className.bottom);
			element.classList.add(className.fixed);
			element.classList.add(className.top);
			
			settings.onStick.call(element);
		},
		fixBottom: function(){
			module.debug('Sticking element to bottom of page');
			if(settings.setSize){
				module.set.size();
			}
			module.set.minimumSize();
			module.set.offset();

			element.style.left = module.cache.element.left;
			element.style.bottom = "";
			element.style.marginBottom = "";

			element.classList.remove(className.bound);
			element.classList.remove(className.top);
			element.classList.add(className.fixed);
			element.classList.add(className.bottom);

			settings.onStick.call(element);
		},
		unbind: function(){
			if( module.is.bound() ){
				module.debug('Removing container bound position on element');
				module.remove.offset();

				element.classList.remove(className.bound);
				element.classList.remove(className.top);
				element.classList.remove(className.bottom);
			}
		},
		unfix: function(){
			if( module.is.fixed() ){
				module.debug('Removing fixed position on element');
				module.remove.minimumSize();
				module.remove.offset();
				element.classList.remove(className.fixed);
				element.classList.remove(className.top);
				element.classList.remove(className.bottom);
				
				settings.onUnstick.call(element);
			}
		},
		reset: function(){
			module.debug('Resetting elements position');
			module.unbind();
			module.unfix();
			module.resetCSS();
			module.remove.offset();
			module.remove.lastScroll();
		},
		resetCSS: function(){
			element.style.width = "";
			element.style.height = "";
			container.style.height = "";
		}
	};

	return module;
};

ui.sticky.settings = {
	name           : 'Sticky',
	namespace      : 'sticky',

	silent         : false,
	debug          : false,
	verbose        : true,
	performance    : true,

	// whether to stick in the opposite direction on scroll up
	pushing        : false,

	context        : false,
	container      : false,

	// Context to watch scroll events
	scrollContext  : window,

	// Offset to adjust scroll
	offset         : 0,

	// Offset to adjust scroll when attached to bottom of screen
	bottomOffset   : 0,

	// will only set container height if difference between context and container is larger than this number
	jitter         : 5,

	// set width of sticky element when it is fixed to page (used to make sure 100% width is maintained if no fixed size set)
	setSize        : true,

	// Whether to automatically observe changes with Mutation Observers
	observeChanges : false,

	// Called when position is recalculated
	onReposition   : function(){},

	// Called on each scroll
	onScroll       : function(){},

	// Called when element is stuck to viewport
	onStick        : function(){},

	// Called when element is unstuck from viewport
	onUnstick      : function(){},

	// Called when element reaches top of context
	onTop          : function(){},

	// Called when element reaches bottom of context
	onBottom       : function(){},

	error         : {
		container      : 'Sticky element must be inside a relative container',
		visible        : 'Element is hidden, you must call refresh after element becomes visible. Use silent setting to surpress this warning in production.',
		method         : 'The method you called is not defined.',
		invalidContext : 'Context specified does not exist',
		elementSize    : 'Sticky element is larger than its container, cannot create sticky.'
	},

	className : {
		bound     : 'bound',
		fixed     : 'fixed',
		supported : 'native',
		top       : 'top',
		bottom    : 'bottom'
	}
};
