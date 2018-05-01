/*!
 * # Vanilla Semantic UI 0.0.1 - Accordion
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

ui.accordion = function(element, settings){
	var className = settings.className,
		selector = settings.selector,
		error = settings.error,
		title = element.querySelectorAll(selector.title),
		observer,
		module;

	module = {
		initialize: function(){
			module.debug('Initializing', element);
			module.bind.events();
			if(settings.observeChanges){
				module.observeChanges();
			}
		},
		refresh: function(){
			title = element.querySelector(selector.title);
			content = element.querySelector(selector.content);
		},
		observeChanges: function(){
			if('MutationObserver' in window){
				observer = new MutationObserver(function(mutations){
					module.debug('DOM tree modified, updating selector cache');
					module.refresh();
				});
				observer.observe(element, {
					childList : true,
					subtree   : true
				});
				module.debug('Setting up mutation observer', observer);
			}
		},
		bind: {
			events: function(){
				module.debug('Binding delegated events');
				element[settings.on] = function(event){
					if(ui.checkTarget(event, selector.trigger)){
						module.event.click(event.target);
					}
				}
			}
		},
		event: {
			click: function(target){
				module.toggle.call(targets);
			}
		},
		toggle: function(query){
			var activeTitle = (query !== undefined) ?
								(typeof query === 'number') ? 
									title[query] : query.closest(selector.title) :
									element.closest(selector.title);
			var activeContent = [];

			activeTitle.forEach(function(title) {
			    if (title.nextElementSibling && title.nextElementSibling.matches(selector.content))
			        activeContent.push(title.nextElementSibling);
			});

			var isAnimating = activeContent.classList.contains(className.animating),
				isActive = activeContent.classList.contains(className.active),
				isOpen = (isActive && !isAnimating),
				isOpening = (!isActive && isAnimating)
			;
			module.debug('Toggling visibility of content', activeTitle);
			if(isOpen || isOpening){
				if(settings.collapsible){
					module.close.call(activeTitle);
				}
				else {
					module.debug('Cannot close accordion content collapsing is disabled');
				}
			}
			else {
				module.open.call(activeTitle);
			}
		},
		open: function(query){
			var activeTitle = (query !== undefined) ?
								(typeof query === 'number') ? 
									title[query] : query.closest(selector.title) :
									element.closest(selector.title),
				activeContent = activeTitle.query("+ " + selector.content),
				isAnimating = activeContent.classList.contains(className.animating),
				isActive = activeContent.classList.contains(className.active),
				isOpen = (isActive || isAnimating);

			if(isOpen){
				module.debug('Accordion already open, skipping', activeContent);
				return;
			}

			module.debug('Opening accordion content', activeTitle);
			settings.onOpening.call(activeContent);
			settings.onChanging.call(activeContent);

			if(settings.exclusive){
				module.closeOthers.call(activeTitle);
			}

			activeTitle.classList.add(className.active);
			activeTitle.classList.add(className.animating);

			if(settings.animateChildren){
				var transition = ui.transition !== undefined && ui.transition(element, 'is supported');

				activeContent.children.forEach(function(child){
					if(transition){
						child.transition({
							animation   : 'fade in',
							queue       : false,
							useFailSafe : true,
							debug       : settings.debug,
							verbose     : settings.verbose,
							duration    : settings.duration
						});
					} else {
						ui.fadeIn(child, {
							duration: settings.duration,
							ondone: module.resetOpacity
						});
					}
				});
			}

			//activeContent.slideDown(settings.duration, settings.easing, function(){
			ui.fadeIn(activeContent, {ondone: function(){
				activeContent.classList.remove(className.animating);
				activeContent.classList.add(className.active);
					
				module.reset.display.call(this);
				settings.onOpen.call(this);
				settings.onChange.call(this);
			}});
		},
		close: function(query){
			var activeTitle = (query !== undefined) ?
								(typeof query === 'number') ? 
									title[query] : query.closest(selector.title) :
									element.closest(selector.title),
				activeContent = activeTitle.query("+ " + selector.content),
				isAnimating    = activeContent.classList.contains(className.animating),
				isActive       = activeContent.classList.contains(className.active),
				isOpening      = (!isActive && isAnimating),
				isClosing      = (isActive && isAnimating);

			if((isActive || isOpening) && !isClosing){
				module.debug('Closing accordion content', activeContent);
				
				settings.onClosing.call(activeContent);
				settings.onChanging.call(activeContent);
		
				activeTitle.classList.remove(className.active);
				activeTitle.classList.remove(className.animating);

				if(settings.animateChildren){
					var transition = ui.transition !== undefined && ui.transition(element, 'is supported');

					activeContent.children.forEach(function(child){
						if(transition){
							child.transition({
								animation   : 'fade out',
								queue       : false,
								useFailSafe : true,
								debug       : settings.debug,
								verbose     : settings.verbose,
								duration    : settings.duration
							});
						} else {
							ui.fadeOut(child, {
								duration: settings.duration,
								ondone: module.resetOpacity
							});
						}
					});
				}
				
				//activeContent.slideUp(settings.duration, settings.easing, function(){
				ui.fadeOut(activeContent, {ondone: function(){
					activeContent.classList.remove(className.animating);
					activeContent.classList.remove(className.active);
					
					module.reset.display.call(this);
					settings.onClose.call(this);
					settings.onChange.call(this);
				}});
			}
		},
		closeOthers: function(index){
			var activeTitle = index !== undefined ? title[index] : element.closest(selector.title);
			var parentTitles = [],
				p;
			
			while (p = activeTitle.parentElement){
				if(p.matches(selector.content)){
					var prev = element.previousElementSibling;
					if(prev && prev.matches('div')){
						parentTitles.push(prev);
					}
				}
			}
				
			var activeAccordion = activeTitle.closest(selector.accordion),
				activeSelector = selector.title + '.' + className.active + ':visible',
				activeContent = selector.content + '.' + className.active + ':visible',
				openTitles,
				nestedTitles,
				openContents;

			if(settings.closeNested){
				openTitles = activeAccordion.find(activeSelector).not($parentTitles);
				openContents = openTitles.next($content);
			} else {
				openTitles = activeAccordion.find(activeSelector).not($parentTitles);
				nestedTitles = activeAccordion.find(activeContent).find(activeSelector).not($parentTitles);
				openTitles = openTitles.not($nestedTitles);
				openContents = openTitles.next($content);
			}

			if( $openTitles.length > 0 ){
				module.debug('Exclusive enabled, closing other content', $openTitles);
				$openTitles
					.removeClass(className.active)
				;
				$openContents
					.removeClass(className.animating)
					.stop(true, true)
				;
				if(settings.animateChildren){
					if($.fn.transition !== undefined && $module.transition('is supported')){
						$openContents
							.children()
								.transition({
									animation   : 'fade out',
									useFailSafe : true,
									debug       : settings.debug,
									verbose     : settings.verbose,
									duration    : settings.duration
								})
						;
					}
					else {
						$openContents
							.children()
								.stop(true, true)
								.animate({
									opacity: 0
								}, settings.duration, module.resetOpacity)
						;
					}
				}
				$openContents
					.slideUp(settings.duration , settings.easing, function(){
						$(this).removeClass(className.active);
						module.reset.display.call(this);
					})
				;
			}
		},
		reset: {
			display: function(elem){
				module.verbose('Removing inline display from element', elem);
				elem.style.display = "";

				if(elem.getAttribute('style') === ''){
					elem.setAttribute("style", "");
				}
			},
			opacity: function(elem){
				module.verbose('Removing inline opacity from element', elem);
				elem.style.opacity = "";

				if(elem.getAttribute('style') === ''){
					elem.setAttribute("style", "");
				}
			},
		}
	};
		
	return module;
};

ui.accordion.settings = {
	silent: false,
	debug: false,
	verbose: false,
	performance: true,
	on: 'onclick', // event on title that opens accordion
	observeChanges: true,  // whether accordion should automatically refresh on DOM insertion
	exclusive: true,  // whether a single accordion content panel should be open at once
	collapsible: true,  // whether accordion content can be closed
	closeNested: false, // whether nested content should be closed when a panel is closed
	animateChildren: true,  // whether children opacity should be animated
	duration: 350, // duration of animation
	easing: 'easeOutQuad', // easing equation for animation
	onOpening: function(){}, // callback before open animation
	onClosing: function(){}, // callback before closing animation
	onChanging: function(){}, // callback before closing or opening animation
	onOpen: function(){}, // callback after open animation
	onClose: function(){}, // callback after closing animation
	onChange: function(){}, // callback after closing or opening animation
	error: {
		method : 'The method you called is not defined'
	},
	className   : {
		active    : 'active',
		animating : 'animating'
	},
	selector    : {
		accordion : '.accordion',
		title     : '.title',
		trigger   : '.title',
		content   : '.content'
	}
};
