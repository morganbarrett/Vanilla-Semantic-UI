/*!
 * # Vanilla Semantic UI - Sidebar
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

ui.sidebar = function(element, settings){
	var selector = settings.selector,
		className = settings.className,
		regExp = settings.regExp,
		error = settings.error,
		/*$context        = $(settings.context),
		$sidebars       = element.children(selector.sidebar),
		$fixed          = $context.children(selector.fixed),
		$pusher         = $context.children(selector.pusher),
		$style,*/
		elementNamespace,
		id,
		currentScroll,
		transitionEvent,
		module;

	/*module = {

		initialize: function() {
			module.debug('Initializing sidebar', parameters);

			module.create.id();

			transitionEvent = module.get.transitionEvent();

			// avoids locking rendering if initialized in onReady
			if(settings.delaySetup) {
				requestAnimationFrame(module.setup.layout);
			}
			else {
				module.setup.layout();
			}

			requestAnimationFrame(function() {
				module.setup.cache();
			});

			module.instantiate();
		},


		create: {
			id: function() {
				id = (Math.random().toString(16) + '000000000').substr(2,8);
				elementNamespace = '.' + id;
				module.verbose('Creating unique id for element', id);
			}
		},

		destroy: function() {
			module.verbose('Destroying previous module for', element);
			element
				.off(eventNamespace)
				.removeData(moduleNamespace)
			;
			if(module.is.ios()) {
				module.remove.ios();
			}
			// bound by uuid
			$context.off(elementNamespace);
			$window.off(elementNamespace);
			$document.off(elementNamespace);
		},

		event: {
			clickaway: function(event) {
				var
					clickedInPusher = ($pusher.find(event.target).length > 0 || $pusher.is(event.target)),
					clickedContext  = ($context.is(event.target))
				;
				if(clickedInPusher) {
					module.verbose('User clicked on dimmed page');
					module.hide();
				}
				if(clickedContext) {
					module.verbose('User clicked on dimmable context (scaled out page)');
					module.hide();
				}
			},
			touch: function(event) {
				//event.stopPropagation();
			},
			containScroll: function(event) {
				if(element.scrollTop <= 0)  {
					element.scrollTop = 1;
				}
				if((element.scrollTop + element.offsetHeight) >= element.scrollHeight) {
					element.scrollTop = element.scrollHeight - element.offsetHeight - 1;
				}
			},
			scroll: function(event) {
				if( $(event.target).closest(selector.sidebar).length === 0 ) {
					event.preventDefault();
				}
			}
		},

		bind: {
			clickaway: function() {
				module.verbose('Adding clickaway events to context', $context);
				if(settings.closable) {
					$context
						.on('click'    + elementNamespace, module.event.clickaway)
						.on('touchend' + elementNamespace, module.event.clickaway)
					;
				}
			},
			scrollLock: function() {
				if(settings.scrollLock) {
					module.debug('Disabling page scroll');
					$window
						.on('DOMMouseScroll' + elementNamespace, module.event.scroll)
					;
				}
				module.verbose('Adding events to contain sidebar scroll');
				$document
					.on('touchmove' + elementNamespace, module.event.touch)
				;
				element
					.on('scroll' + eventNamespace, module.event.containScroll)
				;
			}
		},
		unbind: {
			clickaway: function() {
				module.verbose('Removing clickaway events from context', $context);
				$context.off(elementNamespace);
			},
			scrollLock: function() {
				module.verbose('Removing scroll lock from page');
				$document.off(elementNamespace);
				$window.off(elementNamespace);
				element.off('scroll' + eventNamespace);
			}
		},

		add: {
			inlineCSS: function() {
				var
					width     = module.cache.width  || element.outerWidth(),
					height    = module.cache.height || element.outerHeight(),
					isRTL     = module.is.rtl(),
					direction = module.get.direction(),
					distance  = {
						left   : width,
						right  : -width,
						top    : height,
						bottom : -height
					},
					style
				;

				if(isRTL){
					module.verbose('RTL detected, flipping widths');
					distance.left = -width;
					distance.right = width;
				}

				style  = '<style>';

				if(direction === 'left' || direction === 'right') {
					module.debug('Adding CSS rules for animation distance', width);
					style  += ''
						+ ' .ui.visible.' + direction + '.sidebar ~ .fixed,'
						+ ' .ui.visible.' + direction + '.sidebar ~ .pusher {'
						+ '   -webkit-transform: translate3d('+ distance[direction] + 'px, 0, 0);'
						+ '           transform: translate3d('+ distance[direction] + 'px, 0, 0);'
						+ ' }'
					;
				}
				else if(direction === 'top' || direction == 'bottom') {
					style  += ''
						+ ' .ui.visible.' + direction + '.sidebar ~ .fixed,'
						+ ' .ui.visible.' + direction + '.sidebar ~ .pusher {'
						+ '   -webkit-transform: translate3d(0, ' + distance[direction] + 'px, 0);'
						+ '           transform: translate3d(0, ' + distance[direction] + 'px, 0);'
						+ ' }'
					;
				}

				// IE is only browser not to create context with transforms 
				// https://www.w3.org/Bugs/Public/show_bug.cgi?id=16328 
				if( module.is.ie() ) {
					if(direction === 'left' || direction === 'right') {
						module.debug('Adding CSS rules for animation distance', width);
						style  += ''
							+ ' body.pushable > .ui.visible.' + direction + '.sidebar ~ .pusher:after {'
							+ '   -webkit-transform: translate3d('+ distance[direction] + 'px, 0, 0);'
							+ '           transform: translate3d('+ distance[direction] + 'px, 0, 0);'
							+ ' }'
						;
					}
					else if(direction === 'top' || direction == 'bottom') {
						style  += ''
							+ ' body.pushable > .ui.visible.' + direction + '.sidebar ~ .pusher:after {'
							+ '   -webkit-transform: translate3d(0, ' + distance[direction] + 'px, 0);'
							+ '           transform: translate3d(0, ' + distance[direction] + 'px, 0);'
							+ ' }'
						;
					}
					// opposite sides visible forces content overlay 
					style += ''
						+ ' body.pushable > .ui.visible.left.sidebar ~ .ui.visible.right.sidebar ~ .pusher:after,'
						+ ' body.pushable > .ui.visible.right.sidebar ~ .ui.visible.left.sidebar ~ .pusher:after {'
						+ '   -webkit-transform: translate3d(0px, 0, 0);'
						+ '           transform: translate3d(0px, 0, 0);'
						+ ' }'
					;
				}
				style += '</style>';
				$style = $(style)
					.appendTo($head)
				;
				module.debug('Adding sizing css to head', $style);
			}
		},

		refresh: function() {
			module.verbose('Refreshing selector cache');
			$context  = $(settings.context);
			$sidebars = $context.children(selector.sidebar);
			$pusher   = $context.children(selector.pusher);
			$fixed    = $context.children(selector.fixed);
			module.clear.cache();
		},

		refreshSidebars: function() {
			module.verbose('Refreshing other sidebars');
			$sidebars = $context.children(selector.sidebar);
		},

		repaint: function() {
			module.verbose('Forcing repaint event');
			element.style.display = 'none';
			var ignored = element.offsetHeight;
			element.scrollTop = element.scrollTop;
			element.style.display = '';
		},

		setup: {
			cache: function() {
				module.cache = {
					width  : element.outerWidth(),
					height : element.outerHeight(),
					rtl    : (element.css('direction') == 'rtl')
				};
			},
			layout: function() {
				if( $context.children(selector.pusher).length === 0 ) {
					module.debug('Adding wrapper element for sidebar');
					module.error(error.pusher);
					$pusher = $('<div class="pusher" />');
					$context
						.children()
							.not(selector.omitted)
							.not($sidebars)
							.wrapAll($pusher)
					;
					module.refresh();
				}
				if(element.nextAll(selector.pusher).length === 0 || element.nextAll(selector.pusher)[0] !== $pusher[0]) {
					module.debug('Moved sidebar to correct parent element');
					module.error(error.movedSidebar, element);
					element.detach().prependTo($context);
					module.refresh();
				}
				module.clear.cache();
				module.set.pushable();
				module.set.direction();
			}
		},

		attachEvents: function(selector, event) {
			var
				$toggle = $(selector)
			;
			event = $.isFunction(module[event])
				? module[event]
				: module.toggle
			;
			if($toggle.length > 0) {
				module.debug('Attaching sidebar events to element', selector, event);
				$toggle
					.on('click' + eventNamespace, event)
				;
			}
			else {
				module.error(error.notFound, selector);
			}
		},

		show: function(callback) {
			callback = $.isFunction(callback)
				? callback
				: function(){}
			;
			if(module.is.hidden()) {
				module.refreshSidebars();
				if(settings.overlay)  {
					module.error(error.overlay);
					settings.transition = 'overlay';
				}
				module.refresh();
				if(module.othersActive()) {
					module.debug('Other sidebars currently visible');
					if(settings.exclusive) {
						// if not overlay queue animation after hide
						if(settings.transition != 'overlay') {
							module.hideOthers(module.show);
							return;
						}
						else {
							module.hideOthers();
						}
					}
					else {
						settings.transition = 'overlay';
					}
				}
				module.pushPage(function() {
					callback.call(element);
					settings.onShow.call(element);
				});
				settings.onChange.call(element);
				settings.onVisible.call(element);
			}
			else {
				module.debug('Sidebar is already visible');
			}
		},

		hide: function(callback) {
			callback = $.isFunction(callback)
				? callback
				: function(){}
			;
			if(module.is.visible() || module.is.animating()) {
				module.debug('Hiding sidebar', callback);
				module.refreshSidebars();
				module.pullPage(function() {
					callback.call(element);
					settings.onHidden.call(element);
				});
				settings.onChange.call(element);
				settings.onHide.call(element);
			}
		},

		othersAnimating: function() {
			return ($sidebars.not(element).filter('.' + className.animating).length > 0);
		},
		othersVisible: function() {
			return ($sidebars.not(element).filter('.' + className.visible).length > 0);
		},
		othersActive: function() {
			return(module.othersVisible() || module.othersAnimating());
		},

		hideOthers: function(callback) {
			var
				$otherSidebars = $sidebars.not(element).filter('.' + className.visible),
				sidebarCount   = $otherSidebars.length,
				callbackCount  = 0
			;
			callback = callback || function(){};
			$otherSidebars
				.sidebar('hide', function() {
					callbackCount++;
					if(callbackCount == sidebarCount) {
						callback();
					}
				})
			;
		},

		toggle: function() {
			module.verbose('Determining toggled direction');
			if(module.is.hidden()) {
				module.show();
			}
			else {
				module.hide();
			}
		},

		pushPage: function(callback) {
			var
				transition = module.get.transition(),
				$transition = (transition === 'overlay' || module.othersActive())
					? element
					: $pusher,
				animate,
				dim,
				transitionEnd
			;
			callback = $.isFunction(callback)
				? callback
				: function(){}
			;
			if(settings.transition == 'scale down') {
				module.scrollToTop();
			}
			module.set.transition(transition);
			module.repaint();
			animate = function() {
				module.bind.clickaway();
				module.add.inlineCSS();
				module.set.animating();
				module.set.visible();
			};
			dim = function() {
				module.set.dimmed();
			};
			transitionEnd = function(event) {
				if( event.target == $transition[0] ) {
					$transition.off(transitionEvent + elementNamespace, transitionEnd);
					module.remove.animating();
					module.bind.scrollLock();
					callback.call(element);
				}
			};
			$transition.off(transitionEvent + elementNamespace);
			$transition.on(transitionEvent + elementNamespace, transitionEnd);
			requestAnimationFrame(animate);
			if(settings.dimPage && !module.othersVisible()) {
				requestAnimationFrame(dim);
			}
		},

		pullPage: function(callback) {
			var
				transition = module.get.transition(),
				$transition = (transition == 'overlay' || module.othersActive())
					? element
					: $pusher,
				animate,
				transitionEnd
			;
			callback = $.isFunction(callback)
				? callback
				: function(){}
			;
			module.verbose('Removing context push state', module.get.direction());

			module.unbind.clickaway();
			module.unbind.scrollLock();

			animate = function() {
				module.set.transition(transition);
				module.set.animating();
				module.remove.visible();
				if(settings.dimPage && !module.othersVisible()) {
					$pusher.classList.remove(className.dimmed);
				}
			};
			transitionEnd = function(event) {
				if( event.target == $transition[0] ) {
					$transition.off(transitionEvent + elementNamespace, transitionEnd);
					module.remove.animating();
					module.remove.transition();
					module.remove.inlineCSS();
					if(transition == 'scale down' || (settings.returnScroll && module.is.mobile()) ) {
						module.scrollBack();
					}
					callback.call(element);
				}
			};
			$transition.off(transitionEvent + elementNamespace);
			$transition.on(transitionEvent + elementNamespace, transitionEnd);
			requestAnimationFrame(animate);
		},

		scrollToTop: function() {
			module.verbose('Scrolling to top of page to avoid animation issues');
			currentScroll = $(window).scrollTop();
			element.scrollTop(0);
			window.scrollTo(0, 0);
		},

		scrollBack: function() {
			module.verbose('Scrolling back to original page position');
			window.scrollTo(0, currentScroll);
		},

		clear: {
			cache: function() {
				module.verbose('Clearing cached dimensions');
				module.cache = {};
			}
		},

		set: {

			// ios only (scroll on html not document). This prevent auto-resize canvas/scroll in ios
			// (This is no longer necessary in latest iOS)
			ios: function() {
				$html.classList.add(className.ios);
			},

			// container
			pushed: function() {
				$context.classList.add(className.pushed);
			},
			pushable: function() {
				$context.classList.add(className.pushable);
			},

			// pusher
			dimmed: function() {
				$pusher.classList.add(className.dimmed);
			},

			// sidebar
			active: function() {
				element.classList.add(className.active);
			},
			animating: function() {
				element.classList.add(className.animating);
			},
			transition: function(transition) {
				transition = transition || module.get.transition();
				element.classList.add(transition);
			},
			direction: function(direction) {
				direction = direction || module.get.direction();
				element.classList.add(className[direction]);
			},
			visible: function() {
				element.classList.add(className.visible);
			},
			overlay: function() {
				element.classList.add(className.overlay);
			}
		},
		remove: {

			inlineCSS: function() {
				module.debug('Removing inline css styles', $style);
				if($style && $style.length > 0) {
					$style.remove();
				}
			},

			// ios scroll on html not document
			ios: function() {
				$html.classList.remove(className.ios);
			},

			// context
			pushed: function() {
				$context.classList.remove(className.pushed);
			},
			pushable: function() {
				$context.classList.remove(className.pushable);
			},

			// sidebar
			active: function() {
				element.classList.remove(className.active);
			},
			animating: function() {
				element.classList.remove(className.animating);
			},
			transition: function(transition) {
				transition = transition || module.get.transition();
				element.classList.remove(transition);
			},
			direction: function(direction) {
				direction = direction || module.get.direction();
				element.classList.remove(className[direction]);
			},
			visible: function() {
				element.classList.remove(className.visible);
			},
			overlay: function() {
				element.classList.remove(className.overlay);
			}
		},

		get: {
			direction: function() {
				if(element.classList.contains(className.top)) {
					return className.top;
				}
				else if(element.classList.contains(className.right)) {
					return className.right;
				}
				else if(element.classList.contains(className.bottom)) {
					return className.bottom;
				}
				return className.left;
			},
			transition: function() {
				var
					direction = module.get.direction(),
					transition
				;
				transition = ( module.is.mobile() )
					? (settings.mobileTransition == 'auto')
						? settings.defaultTransition.mobile[direction]
						: settings.mobileTransition
					: (settings.transition == 'auto')
						? settings.defaultTransition.computer[direction]
						: settings.transition
				;
				module.verbose('Determined transition', transition);
				return transition;
			},
			transitionEvent: function() {
				var
					element     = document.createElement('element'),
					transitions = {
						'transition'       :'transitionend',
						'OTransition'      :'oTransitionEnd',
						'MozTransition'    :'transitionend',
						'WebkitTransition' :'webkitTransitionEnd'
					},
					transition
				;
				for(transition in transitions){
					if( element.style[transition] !== undefined ){
						return transitions[transition];
					}
				}
			}
		},

		is: {

			ie: function() {
				var
					isIE11 = (!(window.ActiveXObject) && 'ActiveXObject' in window),
					isIE   = ('ActiveXObject' in window)
				;
				return (isIE11 || isIE);
			},

			ios: function() {
				var
					userAgent      = navigator.userAgent,
					isIOS          = userAgent.match(regExp.ios),
					isMobileChrome = userAgent.match(regExp.mobileChrome)
				;
				if(isIOS && !isMobileChrome) {
					module.verbose('Browser was found to be iOS', userAgent);
					return true;
				}
				else {
					return false;
				}
			},
			mobile: function() {
				var
					userAgent    = navigator.userAgent,
					isMobile     = userAgent.match(regExp.mobile)
				;
				if(isMobile) {
					module.verbose('Browser was found to be mobile', userAgent);
					return true;
				}
				else {
					module.verbose('Browser is not mobile, using regular transition', userAgent);
					return false;
				}
			},
			hidden: function() {
				return !module.is.visible();
			},
			visible: function() {
				return element.classList.contains(className.visible);
			},
			// alias
			open: function() {
				return module.is.visible();
			},
			closed: function() {
				return module.is.hidden();
			},
			vertical: function() {
				return element.classList.contains(className.top);
			},
			animating: function() {
				return $context.classList.contains(className.animating);
			},
			rtl: function () {
				if(module.cache.rtl === undefined) {
					module.cache.rtl = (element.css('direction') == 'rtl');
				}
				return module.cache.rtl;
			}
		}
	};*/

	module = {};

	return module;
};

ui.sidebar.settings = {
	name              : 'Sidebar',
	namespace         : 'sidebar',

	silent            : false,
	debug             : false,
	verbose           : false,
	performance       : true,

	transition        : 'auto',
	mobileTransition  : 'auto',

	defaultTransition : {
		computer: {
			left   : 'uncover',
			right  : 'uncover',
			top    : 'overlay',
			bottom : 'overlay'
		},
		mobile: {
			left   : 'uncover',
			right  : 'uncover',
			top    : 'overlay',
			bottom : 'overlay'
		}
	},

	context           : 'body',
	exclusive         : false,
	closable          : true,
	dimPage           : true,
	scrollLock        : false,
	returnScroll      : false,
	delaySetup        : false,

	duration          : 500,

	onChange          : function(){},
	onShow            : function(){},
	onHide            : function(){},

	onHidden          : function(){},
	onVisible         : function(){},

	className         : {
		active    : 'active',
		animating : 'animating',
		dimmed    : 'dimmed',
		ios       : 'ios',
		pushable  : 'pushable',
		pushed    : 'pushed',
		right     : 'right',
		top       : 'top',
		left      : 'left',
		bottom    : 'bottom',
		visible   : 'visible'
	},

	selector: {
		fixed   : '.fixed',
		omitted : 'script, link, style, .ui.modal, .ui.dimmer, .ui.nag, .ui.fixed',
		pusher  : '.pusher',
		sidebar : '.ui.sidebar'
	},

	regExp: {
		ios          : /(iPad|iPhone|iPod)/g,
		mobileChrome : /(CriOS)/g,
		mobile       : /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/g
	},

	error   : {
		method       : 'The method you called is not defined.',
		pusher       : 'Had to add pusher element. For optimal performance make sure body content is inside a pusher element',
		movedSidebar : 'Had to move sidebar. For optimal performance make sure sidebar and pusher are direct children of your body tag',
		overlay      : 'The overlay setting is no longer supported, use animation: overlay',
		notFound     : 'There were no elements that matched the specified selector'
	}
};
