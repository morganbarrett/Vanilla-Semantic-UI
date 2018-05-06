/*!
 * # Vanilla Semantic UI - Transition
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

ui.transition = function(element, settings){
	var error,
		className,
		metadata,
		animationEnd,
		animationName,
		module;

	module = {
		initialize: function(){

			// get full settings
			settings        = module.get.settings.apply(element, moduleArguments);

			// shorthand
			className       = settings.className;
			error           = settings.error;
			metadata        = settings.metadata;

			// define namespace
			eventNamespace  = '.' + settings.namespace;
			moduleNamespace = 'module-' + settings.namespace;

			// get vendor specific events
			animationEnd    = module.get.animationEndEvent();

			if(methodInvoked){
				methodInvoked = module.invoke(query);
			}

			// method not invoked, lets run an animation
			if(methodInvoked === false){
				module.verbose('Converted arguments into settings object', settings);
				if(settings.interval){
					module.delay(settings.animate);
				}
				else  {
					module.animate();
				}
				module.instantiate();
			}
		},
		refresh: function(){
			module.verbose('Refreshing display type on next animation');
			delete module.displayType;
		},
		forceRepaint: function(){
			module.verbose('Forcing element repaint');
			var parentElement = element.parentElement,
				nextElement = element.nextElementSibling;
			
			element.remove();
			
			if(nextElement.length){
				parentElement.append(element);
			}
			else {
				nextElement.before(element);
			}
		},
		repaint: function(){
			module.verbose('Repainting element');
			var fakeAssignment = element.offsetWidth;
		},
		delay: function(interval){
			var
				direction = module.get.animationDirection(),
				shouldReverse,
				delay
			;
			if(!direction){
				direction = module.can.transition()
					? module.get.direction()
					: 'static'
				;
			}
			interval = (interval !== undefined)
				? interval
				: settings.interval
			;
			shouldReverse = (settings.reverse == 'auto' && direction == className.outward);
			delay = (shouldReverse || settings.reverse == true)
				? (allModules.length - index) * settings.interval
				: index * settings.interval
			;
			module.debug('Delaying animation by', delay);
			setTimeout(module.animate, delay);
		},
		animate: function(overrideSettings){
			settings = overrideSettings || settings;
			if(!module.is.supported()){
				module.error(error.support);
				return false;
			}
			module.debug('Preparing animation', settings.animation);
			if(module.is.animating()){
				if(settings.queue){
					if(!settings.allowRepeats && module.has.direction() && module.is.occurring() && module.queuing !== true){
						module.debug('Animation is currently occurring, preventing queueing same animation', settings.animation);
					}
					else {
						module.queue(settings.animation);
					}
					return false;
				}
				else if(!settings.allowRepeats && module.is.occurring()){
					module.debug('Animation is already occurring, will not execute repeated animation', settings.animation);
					return false;
				}
				else {
					module.debug('New animation started, completing previous early', settings.animation);
					instance.complete();
				}
			}
			if( module.can.animate() ){
				module.set.animating(settings.animation);
			}
			else {
				module.error(error.noAnimation, settings.animation, element);
			}
		},
		reset: function(){
			module.debug('Resetting animation to beginning conditions');
			module.remove.animationCallbacks();
			module.restore.conditions();
			module.remove.animating();
		},
		queue: function(animation){
			module.debug('Queueing animation of', animation);
			module.queuing = true;
			
			element.addEventListener(animationEnd, function(event){
			    module.queuing = false;
				module.repaint();
				module.animate.apply(this, settings);
			    event.target.removeEventListener(event.type, arguments.callee);
			});
		},
		complete: function (event){
			module.debug('Animation complete', settings.animation);
			module.remove.completeCallback();
			module.remove.failSafe();
			if(!module.is.looping()){
				if( module.is.outward() ){
					module.verbose('Animation is outward, hiding element');
					module.restore.conditions();
					module.hide();
				}
				else if( module.is.inward() ){
					module.verbose('Animation is outward, showing element');
					module.restore.conditions();
					module.show();
				}
				else {
					module.verbose('Static animation completed');
					module.restore.conditions();
					settings.onComplete.call(element);
				}
			}
		},
		force: {
			visible: function(){
				var style          = element.getAttribute('style'),
					userStyle      = module.get.userStyle(),
					displayType    = module.get.displayType(),
					overrideStyle  = userStyle + 'display: ' + displayType + ' !important;',
					currentDisplay = element.style.display,
					emptyStyle     = (style === undefined || style === '');

				if(currentDisplay !== displayType){
					module.verbose('Overriding default display to show element', displayType);
					element.setAttribute('style', overrideStyle);
				} else if(emptyStyle){
					element.removeAttribute('style');
				}
			},
			hidden: function(){
				var style          = element.getAttribute('style'),
					currentDisplay = element.style.display,
					emptyStyle     = (style === undefined || style === '');
				
				if(currentDisplay !== 'none' && !module.is.hidden()){
					module.verbose('Overriding default display to hide element');
					element.style.display = "none";

				} else if(emptyStyle){
					element.removeAttribute('style');
				}
			}
		},
		has: {
			direction: function(animation){
				var hasDirection = false;
				
				animation = animation || settings.animation;
				if(typeof animation === 'string'){
					animation = animation.split(' ');
					animation.forEach(function(word, index){
						if(word === className.inward || word === className.outward){
							hasDirection = true;
						}
					});
				}

				return hasDirection;
			},
			inlineDisplay: function(){
				var
					style = element.getAttribute('style') || ''
				;
				return typeof style.match(/display.*?;/, '') == "object";
			}
		},
		set: {
			animating: function(animation){
				var animationClass,
					direction;

				// remove previous callbacks
				module.remove.completeCallback();

				// determine exact animation
				animation      = animation || settings.animation;
				animationClass = module.get.animationClass(animation);

				// save animation class in cache to restore class names
				module.save.animation(animationClass);

				// override display if necessary so animation appears visibly
				module.force.visible();

				module.remove.hidden();
				module.remove.direction();

				module.start.animation(animationClass);
			},
			duration: function(animationName, duration){
				duration = duration || settings.duration;
				duration = (typeof duration == 'number')
					? duration + 'ms'
					: duration
				;
				if(duration || duration === 0){
					module.verbose('Setting animation duration', duration);
					element.style.animationDuration = duration;
				}
			},
			direction: function(direction){
				direction = direction || module.get.direction();
				if(direction == className.inward){
					module.set.inward();
				}
				else {
					module.set.outward();
				}
			},
			looping: function(){
				module.debug('Transition set to loop');
				element.classList.add(className.looping);
			},
			hidden: function(){
				element.classList.add(className.transition);
				element.classList.add(className.hidden);
			},
			inward: function(){
				module.debug('Setting direction to inward');
				element.classList.remove(className.outward);
				element.classList.add(className.inward);
			},
			outward: function(){
				module.debug('Setting direction to outward');
				element.classList.remove(className.inward);
				element.classList.add(className.outward);
			},
			visible: function(){
				element.classList.add(className.transition);
				element.classList.add(className.visible);
			}
		},
		start: {
			animation: function(animationClass){
				animationClass = animationClass || module.get.animationClass();
				module.debug('Starting tween', animationClass);
				element.classList.add(animationClass);
				
				//element.one(animationEnd + '.complete' + eventNamespace, module.complete)
				element.addEventListener(animationEnd, function(event){
				    module.complete(event);
				    event.target.removeEventListener(event.type, arguments.callee);
				});

				if(settings.useFailSafe){
					module.add.failSafe();
				}

				module.set.duration(settings.duration);
				settings.onStart.call(element);
			}
		},
		save: {
			animation: function(animation){
				if(!module.cache){
					module.cache = {};
				}
				module.cache.animation = animation;
			},
			displayType: function(displayType){
				if(displayType !== 'none'){
					element.dataset[metadata.displayType] = displayType;
				}
			},
			transitionExists: function(animation, exists){
				ui.transition.exists[animation] = exists;
				module.verbose('Saving existence of transition', animation, exists);
			}
		},
		restore: {
			conditions: function(){
				var
					animation = module.get.currentAnimation()
				;
				if(animation){
					element.classList.remove(animation);
					module.verbose('Removing animation class', module.cache);
				}
				module.remove.duration();
			}
		},
		add: {
			failSafe: function(){
				var
					duration = module.get.duration()
				;
				module.timer = setTimeout(function(){
					element.triggerHandler(animationEnd);
				}, duration + settings.failSafeDelay);
				module.verbose('Adding fail safe timer', module.timer);
			}
		},
		remove: {
			animating: function(){
				element.classList.remove(className.animating);
			},
			animationCallbacks: function(){
				module.remove.queueCallback();
				module.remove.completeCallback();
			},
			queueCallback: function(){
				//element.off('.queue' + eventNamespace);
			},
			completeCallback: function(){
				//element.off('.complete' + eventNamespace);
			},
			display: function(){
				element.style.display = '';
			},
			direction: function(){
				element.classList.remove(className.inward);
				element.classList.remove(className.outward);
			},
			duration: function(){
				element.style.animationDuration = "";
			},
			failSafe: function(){
				module.verbose('Removing fail safe timer', module.timer);
				if(module.timer){
					clearTimeout(module.timer);
				}
			},
			hidden: function(){
				element.classList.remove(className.hidden);
			},
			visible: function(){
				element.classList.remove(className.visible);
			},
			looping: function(){
				module.debug('Transitions are no longer looping');
				if( module.is.looping() ){
					module.reset();
					element.classList.remove(className.looping);
				}
			},
			transition: function(){
				element.classList.remove(className.visible);
				element.classList.remove(className.hidden);
			}
		},
		get: {
			settings: function(animation, duration, onComplete){
				// single settings object
				if(typeof animation == 'object'){
					return ui.extend(true, {}, ui.transition.settings, animation);
				}
				// all arguments provided
				else if(typeof onComplete == 'function'){
					return ui.extend({}, ui.transition.settings, {
						animation  : animation,
						onComplete : onComplete,
						duration   : duration
					});
				}
				// only duration provided
				else if(typeof duration == 'string' || typeof duration == 'number'){
					return ui.extend({}, ui.transition.settings, {
						animation : animation,
						duration  : duration
					});
				}
				// duration is actually settings object
				else if(typeof duration == 'object'){
					return ui.extend({}, ui.transition.settings, duration, {
						animation : animation
					});
				}
				// duration is actually callback
				else if(typeof duration == 'function'){
					return ui.extend({}, ui.transition.settings, {
						animation  : animation,
						onComplete : duration
					});
				}
				// only animation provided
				else {
					return ui.extend({}, ui.transition.settings, {
						animation : animation
					});
				}
			},
			animationClass: function(animation){
				var
					animationClass = animation || settings.animation,
					directionClass = (module.can.transition() && !module.has.direction())
						? module.get.direction() + ' '
						: ''
				;
				return className.animating + ' '
					+ className.transition + ' '
					+ directionClass
					+ animationClass
				;
			},
			currentAnimation: function(){
				return (module.cache && module.cache.animation !== undefined)
					? module.cache.animation
					: false
				;
			},
			currentDirection: function(){
				return module.is.inward()
					? className.inward
					: className.outward
				;
			},
			direction: function(){
				return module.is.hidden() || !module.is.visible()
					? className.inward
					: className.outward
				;
			},
			animationDirection: function(animation){
				var
					direction
				;
				animation = animation || settings.animation;
				if(typeof animation === 'string'){
					animation = animation.split(' ');
					// search animation name for out/in class
					animation.forEach(function(word, index){
						if(word === className.inward){
							direction = className.inward;
						}
						else if(word === className.outward){
							direction = className.outward;
						}
					});
				}
				// return found direction
				if(direction){
					return direction;
				}
				return false;
			},
			duration: function(duration){
				duration = duration || settings.duration;
				if(duration === false){
					duration = element.style.animationDuration || 0;
				}
				return (typeof duration === 'string')
					? (duration.indexOf('ms') > -1)
						? parseFloat(duration)
						: parseFloat(duration) * 1000
					: duration
				;
			},
			displayType: function(shouldDetermine){
				shouldDetermine = (shouldDetermine !== undefined)
					? shouldDetermine
					: true
				;
				if(settings.displayType){
					return settings.displayType;
				}
				if(shouldDetermine && element.dataset[metadata.displayType] === undefined){
					// create fake element to determine display state
					module.can.transition(true);
				}
				return element.dataset[metadata.displayType];
			},
			userStyle: function(style){
				style = style || element.getAttribute('style') || '';
				return style.replace(/display.*?;/, '');
			},
			transitionExists: function(animation){
				return ui.transition.exists[animation];
			},
			animationStartEvent: function(){
				var
					element     = document.createElement('div'),
					animations  = {
						'animation'       :'animationstart',
						'OAnimation'      :'oAnimationStart',
						'MozAnimation'    :'mozAnimationStart',
						'WebkitAnimation' :'webkitAnimationStart'
					},
					animation
				;
				for(animation in animations){
					if( element.style[animation] !== undefined ){
						return animations[animation];
					}
				}
				return false;
			},
			animationEndEvent: function(){
				var
					element     = document.createElement('div'),
					animations  = {
						'animation'       :'animationend',
						'OAnimation'      :'oAnimationEnd',
						'MozAnimation'    :'mozAnimationEnd',
						'WebkitAnimation' :'webkitAnimationEnd'
					},
					animation
				;
				for(animation in animations){
					if( element.style[animation] !== undefined ){
						return animations[animation];
					}
				}
				return false;
			}
		},
		can: {
			transition: function(forced){
				var
					animation         = settings.animation,
					transitionExists  = module.get.transitionExists(animation),
					displayType       = module.get.displayType(false),
					elementClass,
					tagName,
					clone,
					currentAnimation,
					inAnimation,
					directionExists
				;
				if( transitionExists === undefined || forced){
					module.verbose('Determining whether animation exists');
					
					elementClass = element.getAttribute('class');
					tagName = element.tagName;

					clone = document.createElement(tagName); 
					
					clone.classList.add( elementClass );

					element.after(clone);

					clone.classList.add(animation);
					clone.classList.remove(className.inward);
					clone.classList.remove(className.outward);
					clone.classList.add(className.animating);
					clone.classList.add(className.transition);

					currentAnimation = clone.style.animationName;

					clone.classList.add(className.inward);

					inAnimation = clone,style.animationName;
					
					if(!displayType){
						clone.setAttribute('class', elementClass);
						clone.removeAttribute('style');
						clone.classList.remove(className.hidden);
						clone.classList.remove(className.visible);
						//clone.show();

						displayType = clone.style.display;
						
						module.verbose('Determining final display state', displayType);
						module.save.displayType(displayType);
					}

					clone.remove();

					if(currentAnimation != inAnimation){
						module.debug('Direction exists for animation', animation);
						directionExists = true;
					} else if(currentAnimation == 'none' || !currentAnimation){
						module.debug('No animation defined in css', animation);
						return;
					} else {
						module.debug('Static animation found', animation, displayType);
						directionExists = false;
					}
					module.save.transitionExists(animation, directionExists);
				}
				return (transitionExists !== undefined)
					? transitionExists
					: directionExists
				;
			},
			animate: function(){
				// can transition does not return a value if animation does not exist
				return (module.can.transition() !== undefined);
			}
		},
		is: {
			animating: function(){
				return element.classList.contains(className.animating);
			},
			inward: function(){
				return element.classList.contains(className.inward);
			},
			outward: function(){
				return element.classList.contains(className.outward);
			},
			looping: function(){
				return element.classList.contains(className.looping);
			},
			occurring: function(animation){
				animation = animation || settings.animation;
				animation = '.' + animation.replace(' ', '.');
				return ( element.filter(animation).length > 0 );
			},
			visible: function(){
				return element.is(':visible');
			},
			hidden: function(){
				return element.css('visibility') === 'hidden';
			},
			supported: function(){
				return(animationEnd !== false);
			}
		},
		hide: function(){
			module.verbose('Hiding element');
			if( module.is.animating() ){
				module.reset();
			}
			element.blur(); // IE will trigger focus change if element is not blurred before hiding
			module.remove.display();
			module.remove.visible();
			module.set.hidden();
			module.force.hidden();
			settings.onHide.call(element);
			settings.onComplete.call(element);
			// module.repaint();
		},
		show: function(display){
			module.verbose('Showing element', display);
			module.remove.hidden();
			module.set.visible();
			module.force.visible();
			settings.onShow.call(element);
			settings.onComplete.call(element);
			// module.repaint();
		},
		toggle: function(){
			if( module.is.visible() ){
				module.hide();
			}
			else {
				module.show();
			}
		},
		stop: function(){
			module.debug('Stopping current animation');
			element.triggerHandler(animationEnd);
		},
		stopAll: function(){
			module.debug('Stopping all animation');
			module.remove.queueCallback();
			element.triggerHandler(animationEnd);
		},
		clear: {
			queue: function(){
				module.debug('Clearing animation queue');
				module.remove.queueCallback();
			}
		},
		enable: function(){
			module.verbose('Starting animation');
			element.classList.remove(className.disabled);
		},
		disable: function(){
			module.debug('Stopping animation');
			element.classList.add(className.disabled);
		}
	};

	return module;
};

ui.transition.exists = {};

ui.transition.settings = {

	// module info
	name          : 'Transition',

	// hide all output from this component regardless of other settings
	silent        : false,

	// debug content outputted to console
	debug         : false,

	// verbose debug output
	verbose       : false,

	// performance data output
	performance   : true,

	// event namespace
	namespace     : 'transition',

	// delay between animations in group
	interval      : 0,

	// whether group animations should be reversed
	reverse       : 'auto',

	// animation callback event
	onStart       : function(){},
	onComplete    : function(){},
	onShow        : function(){},
	onHide        : function(){},

	// whether timeout should be used to ensure callback fires in cases animationend does not
	useFailSafe   : true,

	// delay in ms for fail safe
	failSafeDelay : 100,

	// whether EXACT animation can occur twice in a row
	allowRepeats  : false,

	// Override final display type on visible
	displayType   : false,

	// animation duration
	animation     : 'fade',
	duration      : false,

	// new animations will occur after previous ones
	queue         : true,

	metadata : {
		displayType: 'display'
	},

	className   : {
		animating  : 'animating',
		disabled   : 'disabled',
		hidden     : 'hidden',
		inward     : 'in',
		loading    : 'loading',
		looping    : 'looping',
		outward    : 'out',
		transition : 'transition',
		visible    : 'visible'
	},

	// possible errors
	error: {
		noAnimation : 'Element is no longer attached to DOM. Unable to animate.  Use silent setting to surpress this warning in production.',
		repeated    : 'That animation is already occurring, cancelling repeated animation',
		method      : 'The method you called is not defined',
		support     : 'This browser does not support CSS animations'
	}
};
