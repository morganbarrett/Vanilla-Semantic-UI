/*!
 * # Vanilla Semantic UI - Shape
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

ui.shape = function(element, settings){
	var selector = settings.selector,
		error = settings.error,
		className = settings.className,
		sides = element.querySelectorAll(selector.sides),
		side = element.querySelectorAll(selector.side),
		nextIndex = false,
		activeSide,
		nextSide,
		module;

	/*module = {

		initialize: function() {
			module.verbose('Initializing module for', element);
			module.set.defaultSide();
			module.instantiate();
		},

		refresh: function() {
			module.verbose('Refreshing selector cache for', element);
			$module = $(element);
			$sides  = $(this).find(selector.shape);
			$side   = $(this).find(selector.side);
		},

		repaint: function() {
			module.verbose('Forcing repaint event');
			var
				shape          = $sides[0] || document.createElement('div'),
				fakeAssignment = shape.offsetWidth
			;
		},

		animate: function(propertyObject, callback) {
			module.verbose('Animating box with properties', propertyObject);
			callback = callback || function(event) {
				module.verbose('Executing animation callback');
				if(event !== undefined) {
					event.stopPropagation();
				}
				module.reset();
				module.set.active();
			};
			settings.beforeChange.call($nextSide[0]);
			if(module.get.transitionEvent()) {
				module.verbose('Starting CSS animation');
				$module
					.classList.add(className.animating)
				;
				$sides
					.css(propertyObject)
					.one(module.get.transitionEvent(), callback)
				;
				module.set.duration(settings.duration);
				requestAnimationFrame(function() {
					$module
						.classList.add(className.animating)
					;
					$activeSide
						.classList.add(className.hidden)
					;
				});
			}
			else {
				callback();
			}
		},

		queue: function(method) {
			module.debug('Queueing animation of', method);
			$sides
				.one(module.get.transitionEvent(), function() {
					module.debug('Executing queued animation');
					setTimeout(function(){
						$module.shape(method);
					}, 0);
				})
			;
		},

		reset: function() {
			module.verbose('Animating states reset');
			$module
				.classList.remove(className.animating)
				.attr('style', '')
				.removeAttr('style')
			;
			// removeAttr style does not consistently work in safari
			$sides
				.attr('style', '')
				.removeAttr('style')
			;
			$side
				.attr('style', '')
				.removeAttr('style')
				.classList.remove(className.hidden)
			;
			$nextSide
				.classList.remove(className.animating)
				.attr('style', '')
				.removeAttr('style')
			;
		},

		is: {
			complete: function() {
				return ($side.filter('.' + className.active)[0] == $nextSide[0]);
			},
			animating: function() {
				return $module.classList.contains(className.animating);
			}
		},

		set: {

			defaultSide: function() {
				$activeSide = $module.find('.' + settings.className.active);
				$nextSide   = ( $activeSide.next(selector.side).length > 0 )
					? $activeSide.next(selector.side)
					: $module.find(selector.side).first()
				;
				nextIndex = false;
				module.verbose('Active side set to', $activeSide);
				module.verbose('Next side set to', $nextSide);
			},

			duration: function(duration) {
				duration = duration || settings.duration;
				duration = (typeof duration == 'number')
					? duration + 'ms'
					: duration
				;
				module.verbose('Setting animation duration', duration);
				if(settings.duration || settings.duration === 0) {
					$sides.add($side)
						.css({
							'-webkit-transition-duration': duration,
							'-moz-transition-duration': duration,
							'-ms-transition-duration': duration,
							'-o-transition-duration': duration,
							'transition-duration': duration
						})
					;
				}
			},

			currentStageSize: function() {
				var
					$activeSide = $module.find('.' + settings.className.active),
					width       = $activeSide.outerWidth(true),
					height      = $activeSide.outerHeight(true)
				;
				$module
					.css({
						width: width,
						height: height
					})
				;
			},

			stageSize: function() {
				var
					$clone      = $module.clone().classList.add(className.loading),
					$activeSide = $clone.find('.' + settings.className.active),
					$nextSide   = (nextIndex)
						? $clone.find(selector.side).eq(nextIndex)
						: ( $activeSide.next(selector.side).length > 0 )
							? $activeSide.next(selector.side)
							: $clone.find(selector.side).first(),
					newWidth    = (settings.width == 'next')
						? $nextSide.outerWidth(true)
						: (settings.width == 'initial')
							? $module.width()
							: settings.width,
					newHeight    = (settings.height == 'next')
						? $nextSide.outerHeight(true)
						: (settings.height == 'initial')
							? $module.height()
							: settings.height
				;
				$activeSide.classList.remove(className.active);
				$nextSide.classList.add(className.active);
				$clone.insertAfter($module);
				$clone.remove();
				if(settings.width != 'auto') {
					$module.css('width', newWidth + settings.jitter);
					module.verbose('Specifying width during animation', newWidth);
				}
				if(settings.height != 'auto') {
					$module.css('height', newHeight + settings.jitter);
					module.verbose('Specifying height during animation', newHeight);
				}
			},

			nextSide: function(selector) {
				nextIndex = selector;
				$nextSide = $side.filter(selector);
				nextIndex = $side.index($nextSide);
				if($nextSide.length === 0) {
					module.set.defaultSide();
					module.error(error.side);
				}
				module.verbose('Next side manually set to', $nextSide);
			},

			active: function() {
				module.verbose('Setting new side to active', $nextSide);
				$side
					.classList.remove(className.active)
				;
				$nextSide
					.classList.add(className.active)
				;
				settings.onChange.call($nextSide[0]);
				module.set.defaultSide();
			}
		},

		flip: {

			up: function() {
				if(module.is.complete() && !module.is.animating() && !settings.allowRepeats) {
					module.debug('Side already visible', $nextSide);
					return;
				}
				if( !module.is.animating()) {
					module.debug('Flipping up', $nextSide);
					var
						transform = module.get.transform.up()
					;
					module.set.stageSize();
					module.stage.above();
					module.animate(transform);
				}
				else {
					module.queue('flip up');
				}
			},

			down: function() {
				if(module.is.complete() && !module.is.animating() && !settings.allowRepeats) {
					module.debug('Side already visible', $nextSide);
					return;
				}
				if( !module.is.animating()) {
					module.debug('Flipping down', $nextSide);
					var
						transform = module.get.transform.down()
					;
					module.set.stageSize();
					module.stage.below();
					module.animate(transform);
				}
				else {
					module.queue('flip down');
				}
			},

			left: function() {
				if(module.is.complete() && !module.is.animating() && !settings.allowRepeats) {
					module.debug('Side already visible', $nextSide);
					return;
				}
				if( !module.is.animating()) {
					module.debug('Flipping left', $nextSide);
					var
						transform = module.get.transform.left()
					;
					module.set.stageSize();
					module.stage.left();
					module.animate(transform);
				}
				else {
					module.queue('flip left');
				}
			},

			right: function() {
				if(module.is.complete() && !module.is.animating() && !settings.allowRepeats) {
					module.debug('Side already visible', $nextSide);
					return;
				}
				if( !module.is.animating()) {
					module.debug('Flipping right', $nextSide);
					var
						transform = module.get.transform.right()
					;
					module.set.stageSize();
					module.stage.right();
					module.animate(transform);
				}
				else {
					module.queue('flip right');
				}
			},

			over: function() {
				if(module.is.complete() && !module.is.animating() && !settings.allowRepeats) {
					module.debug('Side already visible', $nextSide);
					return;
				}
				if( !module.is.animating()) {
					module.debug('Flipping over', $nextSide);
					module.set.stageSize();
					module.stage.behind();
					module.animate(module.get.transform.over() );
				}
				else {
					module.queue('flip over');
				}
			},

			back: function() {
				if(module.is.complete() && !module.is.animating() && !settings.allowRepeats) {
					module.debug('Side already visible', $nextSide);
					return;
				}
				if( !module.is.animating()) {
					module.debug('Flipping back', $nextSide);
					module.set.stageSize();
					module.stage.behind();
					module.animate(module.get.transform.back() );
				}
				else {
					module.queue('flip back');
				}
			}

		},

		get: {

			transform: {
				up: function() {
					var
						translate = {
							y: -(($activeSide.outerHeight(true) - $nextSide.outerHeight(true)) / 2),
							z: -($activeSide.outerHeight(true) / 2)
						}
					;
					return {
						transform: 'translateY(' + translate.y + 'px) translateZ('+ translate.z + 'px) rotateX(-90deg)'
					};
				},

				down: function() {
					var
						translate = {
							y: -(($activeSide.outerHeight(true) - $nextSide.outerHeight(true)) / 2),
							z: -($activeSide.outerHeight(true) / 2)
						}
					;
					return {
						transform: 'translateY(' + translate.y + 'px) translateZ('+ translate.z + 'px) rotateX(90deg)'
					};
				},

				left: function() {
					var
						translate = {
							x : -(($activeSide.outerWidth(true) - $nextSide.outerWidth(true)) / 2),
							z : -($activeSide.outerWidth(true) / 2)
						}
					;
					return {
						transform: 'translateX(' + translate.x + 'px) translateZ(' + translate.z + 'px) rotateY(90deg)'
					};
				},

				right: function() {
					var
						translate = {
							x : -(($activeSide.outerWidth(true) - $nextSide.outerWidth(true)) / 2),
							z : -($activeSide.outerWidth(true) / 2)
						}
					;
					return {
						transform: 'translateX(' + translate.x + 'px) translateZ(' + translate.z + 'px) rotateY(-90deg)'
					};
				},

				over: function() {
					var
						translate = {
							x : -(($activeSide.outerWidth(true) - $nextSide.outerWidth(true)) / 2)
						}
					;
					return {
						transform: 'translateX(' + translate.x + 'px) rotateY(180deg)'
					};
				},

				back: function() {
					var
						translate = {
							x : -(($activeSide.outerWidth(true) - $nextSide.outerWidth(true)) / 2)
						}
					;
					return {
						transform: 'translateX(' + translate.x + 'px) rotateY(-180deg)'
					};
				}
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
			},

			nextSide: function() {
				return ( $activeSide.next(selector.side).length > 0 )
					? $activeSide.next(selector.side)
					: $module.find(selector.side).first()
				;
			}

		},

		stage: {

			above: function() {
				var
					box = {
						origin : (($activeSide.outerHeight(true) - $nextSide.outerHeight(true)) / 2),
						depth  : {
							active : ($nextSide.outerHeight(true) / 2),
							next   : ($activeSide.outerHeight(true) / 2)
						}
					}
				;
				module.verbose('Setting the initial animation position as above', $nextSide, box);
				$sides
					.css({
						'transform' : 'translateZ(-' + box.depth.active + 'px)'
					})
				;
				$activeSide
					.css({
						'transform' : 'rotateY(0deg) translateZ(' + box.depth.active + 'px)'
					})
				;
				$nextSide
					.classList.add(className.animating)
					.css({
						'top'       : box.origin + 'px',
						'transform' : 'rotateX(90deg) translateZ(' + box.depth.next + 'px)'
					})
				;
			},

			below: function() {
				var
					box = {
						origin : (($activeSide.outerHeight(true) - $nextSide.outerHeight(true)) / 2),
						depth  : {
							active : ($nextSide.outerHeight(true) / 2),
							next   : ($activeSide.outerHeight(true) / 2)
						}
					}
				;
				module.verbose('Setting the initial animation position as below', $nextSide, box);
				$sides
					.css({
						'transform' : 'translateZ(-' + box.depth.active + 'px)'
					})
				;
				$activeSide
					.css({
						'transform' : 'rotateY(0deg) translateZ(' + box.depth.active + 'px)'
					})
				;
				$nextSide
					.classList.add(className.animating)
					.css({
						'top'       : box.origin + 'px',
						'transform' : 'rotateX(-90deg) translateZ(' + box.depth.next + 'px)'
					})
				;
			},

			left: function() {
				var
					height = {
						active : $activeSide.outerWidth(true),
						next   : $nextSide.outerWidth(true)
					},
					box = {
						origin : ( ( height.active - height.next ) / 2),
						depth  : {
							active : (height.next / 2),
							next   : (height.active / 2)
						}
					}
				;
				module.verbose('Setting the initial animation position as left', $nextSide, box);
				$sides
					.css({
						'transform' : 'translateZ(-' + box.depth.active + 'px)'
					})
				;
				$activeSide
					.css({
						'transform' : 'rotateY(0deg) translateZ(' + box.depth.active + 'px)'
					})
				;
				$nextSide
					.classList.add(className.animating)
					.css({
						'left'      : box.origin + 'px',
						'transform' : 'rotateY(-90deg) translateZ(' + box.depth.next + 'px)'
					})
				;
			},

			right: function() {
				var
					height = {
						active : $activeSide.outerWidth(true),
						next   : $nextSide.outerWidth(true)
					},
					box = {
						origin : ( ( height.active - height.next ) / 2),
						depth  : {
							active : (height.next / 2),
							next   : (height.active / 2)
						}
					}
				;
				module.verbose('Setting the initial animation position as left', $nextSide, box);
				$sides
					.css({
						'transform' : 'translateZ(-' + box.depth.active + 'px)'
					})
				;
				$activeSide
					.css({
						'transform' : 'rotateY(0deg) translateZ(' + box.depth.active + 'px)'
					})
				;
				$nextSide
					.classList.add(className.animating)
					.css({
						'left'      : box.origin + 'px',
						'transform' : 'rotateY(90deg) translateZ(' + box.depth.next + 'px)'
					})
				;
			},

			behind: function() {
				var
					height = {
						active : $activeSide.outerWidth(true),
						next   : $nextSide.outerWidth(true)
					},
					box = {
						origin : ( ( height.active - height.next ) / 2),
						depth  : {
							active : (height.next / 2),
							next   : (height.active / 2)
						}
					}
				;
				module.verbose('Setting the initial animation position as behind', $nextSide, box);
				$activeSide
					.css({
						'transform' : 'rotateY(0deg)'
					})
				;
				$nextSide
					.classList.add(className.animating)
					.css({
						'left'      : box.origin + 'px',
						'transform' : 'rotateY(-180deg)'
					})
				;
			}
		}
	};*/

	module = {};
	
	return module;
};

ui.shape.settings = {
	silent: false,
	debug: false,
	verbose: false,
	jitter: 0,
	performance: true,
	namespace: 'shape',
	width: 'initial',
	height: 'initial',
	allowRepeats: false,
	duration: false,
	beforeChange: function() {},
	onChange: function() {},
	selector: {
		sides: '.sides',
		side: '.side'
	},
	error: {
		side: 'You tried to switch to a side that does not exist.',
		method: 'The method you called is not defined'
	},
	className: {
		animating: 'animating',
		hidden: 'hidden',
		loading: 'loading',
		active: 'active'
	}
};
