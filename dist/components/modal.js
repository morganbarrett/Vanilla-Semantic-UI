/*!
 * # Vanilla Semantic UI 0.0.1 - Modal
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

ui.modal = function(element, settings){
	var selector = settings.selector,
		className = settings.className,
		error = settings.error,
		context = element.querySelectorAll(settings.context),
		close = element.querySelectorAll(selector.close),
		allModals,
		otherModals,
		focusedElement,
		dimmable,
		dimmer,
		ignoreRepeatedEvents = false,
		elementEventNamespace,
		id,
		observer,
		module;
	
	/*module  = {

		initialize: function() {
			module.verbose('Initializing dimmer', $context);

			module.create.id();
			module.create.dimmer();
			module.refreshModals();

			module.bind.events();
			if(settings.observeChanges) {
				module.observeChanges();
			}
			module.instantiate();
		},

		create: {
			dimmer: function() {
				var
					defaultSettings = {
						debug      : settings.debug,
						variation  : settings.centered
							? false
							: 'top aligned'
						,
						dimmerName : 'modals'
					},
					dimmerSettings = $.extend(true, defaultSettings, settings.dimmerSettings)
				;
				if($.fn.dimmer === undefined) {
					module.error(error.dimmer);
					return;
				}
				module.debug('Creating dimmer');
				$dimmable = $context.dimmer(dimmerSettings);
				if(settings.detachable) {
					module.verbose('Modal is detachable, moving content into dimmer');
					$dimmable.dimmer('add content', $module);
				}
				else {
					module.set.undetached();
				}
				$dimmer = $dimmable.dimmer('get dimmer');
			},
			id: function() {
				id = (Math.random().toString(16) + '000000000').substr(2,8);
				elementEventNamespace = '.' + id;
				module.verbose('Creating unique id for element', id);
			}
		},

		observeChanges: function() {
			if('MutationObserver' in window) {
				observer = new MutationObserver(function(mutations) {
					module.debug('DOM tree modified, refreshing');
					module.refresh();
				});
				observer.observe(element, {
					childList : true,
					subtree   : true
				});
				module.debug('Setting up mutation observer', observer);
			}
		},

		refresh: function() {
			module.remove.scrolling();
			module.cacheSizes();
			module.set.screenHeight();
			module.set.type();
		},

		refreshModals: function() {
			$otherModals = $module.siblings(selector.modal);
			$allModals   = $otherModals.add($module);
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
				module.debug('Attaching modal events to element', selector, event);
				$toggle
					.off(eventNamespace)
					.on('click' + eventNamespace, event)
				;
			}
			else {
				module.error(error.notFound, selector);
			}
		},

		bind: {
			events: function() {
				module.verbose('Attaching events');
				$module
					.on('click' + eventNamespace, selector.close, module.event.close)
					.on('click' + eventNamespace, selector.approve, module.event.approve)
					.on('click' + eventNamespace, selector.deny, module.event.deny)
				;
				$window
					.on('resize' + elementEventNamespace, module.event.resize)
				;
			}
		},

		get: {
			id: function() {
				return (Math.random().toString(16) + '000000000').substr(2,8);
			}
		},

		event: {
			approve: function() {
				if(ignoreRepeatedEvents || settings.onApprove.call(element, $(this)) === false) {
					module.verbose('Approve callback returned false cancelling hide');
					return;
				}
				ignoreRepeatedEvents = true;
				module.hide(function() {
					ignoreRepeatedEvents = false;
				});
			},
			deny: function() {
				if(ignoreRepeatedEvents || settings.onDeny.call(element, $(this)) === false) {
					module.verbose('Deny callback returned false cancelling hide');
					return;
				}
				ignoreRepeatedEvents = true;
				module.hide(function() {
					ignoreRepeatedEvents = false;
				});
			},
			close: function() {
				module.hide();
			},
			click: function(event) {
				if(!settings.closable) {
					module.verbose('Dimmer clicked but closable setting is disabled');
					return;
				}
				var
					$target   = $(event.target),
					isInModal = ($target.closest(selector.modal).length > 0),
					isInDOM   = $.contains(document.documentElement, event.target)
				;
				if(!isInModal && isInDOM && module.is.active()) {
					module.debug('Dimmer clicked, hiding all modals');
					module.remove.clickaway();
					if(settings.allowMultiple) {
						module.hide();
					}
					else {
						module.hideAll();
					}
				}
			},
			debounce: function(method, delay) {
				clearTimeout(module.timer);
				module.timer = setTimeout(method, delay);
			},
			keyboard: function(event) {
				var
					keyCode   = event.which,
					escapeKey = 27
				;
				if(keyCode == escapeKey) {
					if(settings.closable) {
						module.debug('Escape key pressed hiding modal');
						module.hide();
					}
					else {
						module.debug('Escape key pressed, but closable is set to false');
					}
					event.preventDefault();
				}
			},
			resize: function() {
				if( $dimmable.dimmer('is active') && ( module.is.animating() || module.is.active() ) ) {
					requestAnimationFrame(module.refresh);
				}
			}
		},

		toggle: function() {
			if( module.is.active() || module.is.animating() ) {
				module.hide();
			}
			else {
				module.show();
			}
		},

		show: function(callback) {
			callback = $.isFunction(callback)
				? callback
				: function(){}
			;
			module.refreshModals();
			module.set.dimmerSettings();
			module.showModal(callback);
		},

		hide: function(callback) {
			callback = $.isFunction(callback)
				? callback
				: function(){}
			;
			module.refreshModals();
			module.hideModal(callback);
		},

		showModal: function(callback) {
			callback = $.isFunction(callback)
				? callback
				: function(){}
			;
			if( module.is.animating() || !module.is.active() ) {

				module.showDimmer();
				module.cacheSizes();
				module.set.screenHeight();
				module.set.type();
				module.set.clickaway();

				if( !settings.allowMultiple && module.others.active() ) {
					module.hideOthers(module.showModal);
				}
				else {
					if(settings.allowMultiple && settings.detachable) {
						$module.detach().appendTo($dimmer);
					}
					settings.onShow.call(element);
					if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
						module.debug('Showing modal with css animations');
						$module
							.transition({
								debug       : settings.debug,
								animation   : settings.transition + ' in',
								queue       : settings.queue,
								duration    : settings.duration,
								useFailSafe : true,
								onComplete : function() {
									settings.onVisible.apply(element);
									if(settings.keyboardShortcuts) {
										module.add.keyboardShortcuts();
									}
									module.save.focus();
									module.set.active();
									if(settings.autofocus) {
										module.set.autofocus();
									}
									callback();
								}
							})
						;
					}
					else {
						module.error(error.noTransition);
					}
				}
			}
			else {
				module.debug('Modal is already visible');
			}
		},

		hideModal: function(callback, keepDimmed) {
			callback = $.isFunction(callback)
				? callback
				: function(){}
			;
			module.debug('Hiding modal');
			if(settings.onHide.call(element, $(this)) === false) {
				module.verbose('Hide callback returned false cancelling hide');
				return;
			}

			if( module.is.animating() || module.is.active() ) {
				if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
					module.remove.active();
					$module
						.transition({
							debug       : settings.debug,
							animation   : settings.transition + ' out',
							queue       : settings.queue,
							duration    : settings.duration,
							useFailSafe : true,
							onStart     : function() {
								if(!module.others.active() && !keepDimmed) {
									module.hideDimmer();
								}
								if(settings.keyboardShortcuts) {
									module.remove.keyboardShortcuts();
								}
							},
							onComplete : function() {
								settings.onHidden.call(element);
								module.restore.focus();
								callback();
							}
						})
					;
				}
				else {
					module.error(error.noTransition);
				}
			}
		},

		showDimmer: function() {
			if($dimmable.dimmer('is animating') || !$dimmable.dimmer('is active') ) {
				module.debug('Showing dimmer');
				$dimmable.dimmer('show');
			}
			else {
				module.debug('Dimmer already visible');
			}
		},

		hideDimmer: function() {
			if( $dimmable.dimmer('is animating') || ($dimmable.dimmer('is active')) ) {
				$dimmable.dimmer('hide', function() {
					module.remove.clickaway();
					module.remove.screenHeight();
				});
			}
			else {
				module.debug('Dimmer is not visible cannot hide');
				return;
			}
		},

		hideAll: function(callback) {
			var
				$visibleModals = $allModals.filter('.' + className.active + ', .' + className.animating)
			;
			callback = $.isFunction(callback)
				? callback
				: function(){}
			;
			if( $visibleModals.length > 0 ) {
				module.debug('Hiding all visible modals');
				module.hideDimmer();
				$visibleModals
					.modal('hide modal', callback)
				;
			}
		},

		hideOthers: function(callback) {
			var
				$visibleModals = $otherModals.filter('.' + className.active + ', .' + className.animating)
			;
			callback = $.isFunction(callback)
				? callback
				: function(){}
			;
			if( $visibleModals.length > 0 ) {
				module.debug('Hiding other modals', $otherModals);
				$visibleModals
					.modal('hide modal', callback, true)
				;
			}
		},

		others: {
			active: function() {
				return ($otherModals.filter('.' + className.active).length > 0);
			},
			animating: function() {
				return ($otherModals.filter('.' + className.animating).length > 0);
			}
		},


		add: {
			keyboardShortcuts: function() {
				module.verbose('Adding keyboard shortcuts');
				$document
					.on('keyup' + eventNamespace, module.event.keyboard)
				;
			}
		},

		save: {
			focus: function() {
				var
					$activeElement = $(document.activeElement),
					inCurrentModal = $activeElement.closest($module).length > 0
				;
				if(!inCurrentModal) {
					$focusedElement = $(document.activeElement).blur();
				}
			}
		},

		restore: {
			focus: function() {
				if($focusedElement && $focusedElement.length > 0) {
					$focusedElement.focus();
				}
			}
		},

		remove: {
			active: function() {
				$module.classList.remove(className.active);
			},
			clickaway: function() {
				$dimmer
					.off('click' + elementEventNamespace)
				;
			},
			bodyStyle: function() {
				if($body.attr('style') === '') {
					module.verbose('Removing style attribute');
					$body.removeAttr('style');
				}
			},
			screenHeight: function() {
				module.debug('Removing page height');
				$body
					.css('height', '')
				;
			},
			keyboardShortcuts: function() {
				module.verbose('Removing keyboard shortcuts');
				$document
					.off('keyup' + eventNamespace)
				;
			},
			scrolling: function() {
				$dimmable.classList.remove(className.scrolling);
				$module.classList.remove(className.scrolling);
			}
		},

		cacheSizes: function() {
			$module.classList.add(className.loading);
			var
				scrollHeight = $module.prop('scrollHeight'),
				modalHeight  = $module.outerHeight()
			;
			if(module.cache === undefined || modalHeight !== 0) {
				module.cache = {
					pageHeight    : $(document).outerHeight(),
					height        : modalHeight + settings.offset,
					scrollHeight  : scrollHeight + settings.offset,
					contextHeight : (settings.context == 'body')
						? $(window).height()
						: $dimmable.height(),
				};
				module.cache.topOffset = -(module.cache.height / 2);
			}
			$module.classList.remove(className.loading);
			module.debug('Caching modal and container sizes', module.cache);
		},

		can: {
			fit: function() {
				var
					contextHeight  = module.cache.contextHeight,
					verticalCenter = module.cache.contextHeight / 2,
					topOffset      = module.cache.topOffset,
					scrollHeight   = module.cache.scrollHeight,
					height         = module.cache.height,
					paddingHeight  = settings.padding,
					startPosition  = (verticalCenter + topOffset)
				;
				return (scrollHeight > height)
					? (startPosition + scrollHeight + paddingHeight < contextHeight)
					: (height + (paddingHeight * 2) < contextHeight)
				;
			}
		},

		is: {
			active: function() {
				return $module.classList.contains(className.active);
			},
			animating: function() {
				return $module.transition('is supported')
					? $module.transition('is animating')
					: $module.is(':visible')
				;
			},
			scrolling: function() {
				return $dimmable.classList.contains(className.scrolling);
			},
			modernBrowser: function() {
				// appName for IE11 reports 'Netscape' can no longer use
				return !(window.ActiveXObject || "ActiveXObject" in window);
			}
		},

		set: {
			autofocus: function() {
				var
					$inputs    = $module.find('[tabindex], :input').filter(':visible'),
					$autofocus = $inputs.filter('[autofocus]'),
					$input     = ($autofocus.length > 0)
						? $autofocus.first()
						: $inputs.first()
				;
				if($input.length > 0) {
					$input.focus();
				}
			},
			clickaway: function() {
				$dimmer
					.on('click' + elementEventNamespace, module.event.click)
				;
			},
			dimmerSettings: function() {
				if($.fn.dimmer === undefined) {
					module.error(error.dimmer);
					return;
				}
				var
					defaultSettings = {
						debug      : settings.debug,
						dimmerName : 'modals',
						closable   : 'auto',
						variation  : settings.centered
							? false
							: 'top aligned'
						,
						duration   : {
							show     : settings.duration,
							hide     : settings.duration
						}
					},
					dimmerSettings = $.extend(true, defaultSettings, settings.dimmerSettings)
				;
				if(settings.inverted) {
					dimmerSettings.variation = (dimmerSettings.variation !== undefined)
						? dimmerSettings.variation + ' inverted'
						: 'inverted'
					;
					$dimmer.classList.add(className.inverted);
				}
				else {
					$dimmer.classList.remove(className.inverted);
				}
				if(settings.blurring) {
					$dimmable.classList.add(className.blurring);
				}
				else {
					$dimmable.classList.remove(className.blurring);
				}
				$context.dimmer('setting', dimmerSettings);
			},
			screenHeight: function() {
				if( module.can.fit() ) {
					$body.css('height', '');
				}
				else {
					module.debug('Modal is taller than page content, resizing page height');
					$body
						.css('height', module.cache.height + (settings.padding * 2) )
					;
				}
			},
			active: function() {
				$module.classList.add(className.active);
			},
			scrolling: function() {
				$dimmable.classList.add(className.scrolling);
				$module.classList.add(className.scrolling);
			},
			type: function() {
				if(module.can.fit()) {
					module.verbose('Modal fits on screen');
					if(!module.others.active() && !module.others.animating()) {
						module.remove.scrolling();
					}
				}
				else {
					module.verbose('Modal cannot fit on screen setting to scrolling');
					module.set.scrolling();
				}
			},
			undetached: function() {
				$dimmable.classList.add(className.undetached);
			}
		}
	};*/

	module = {};
	
	return module;
};

ui.modal.settings = {
	name           : 'Modal',
	namespace      : 'modal',

	silent         : false,
	debug          : false,
	verbose        : false,
	performance    : true,

	observeChanges : false,

	allowMultiple  : false,
	detachable     : true,
	closable       : true,
	autofocus      : true,

	inverted       : false,
	blurring       : false,

	centered       : true,

	dimmerSettings : {
		closable : false,
		useCSS   : true
	},

	// whether to use keyboard shortcuts
	keyboardShortcuts: true,

	context    : 'body',

	queue      : false,
	duration   : 500,
	offset     : 0,
	transition : 'scale',

	// padding with edge of page
	padding    : 50,

	// called before show animation
	onShow     : function(){},

	// called after show animation
	onVisible  : function(){},

	// called before hide animation
	onHide     : function(){ return true; },

	// called after hide animation
	onHidden   : function(){},

	// called after approve selector match
	onApprove  : function(){ return true; },

	// called after deny selector match
	onDeny     : function(){ return true; },

	selector    : {
		close    : '> .close',
		approve  : '.actions .positive, .actions .approve, .actions .ok',
		deny     : '.actions .negative, .actions .deny, .actions .cancel',
		modal    : '.ui.modal'
	},
	error : {
		dimmer    : 'UI Dimmer, a required component is not included in this page',
		method    : 'The method you called is not defined.',
		notFound  : 'The element you specified could not be found'
	},
	className : {
		active     : 'active',
		animating  : 'animating',
		blurring   : 'blurring',
		inverted   : 'inverted',
		loading    : 'loading',
		scrolling  : 'scrolling',
		undetached : 'undetached'
	}
};
