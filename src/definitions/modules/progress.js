/*!
 * # Vanilla Semantic UI - Progress
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

ui.progress = function(element, settings){
	var className = settings.className,
		metadata = settings.metadata,
		selector = settings.selector,
		error = settings.error,
		bar = element.querySelector(selector.bar),
		progress = element.querySelectorAll(selector.progress),
		label = element.querySelectorAll(selector.label),
		animating = false,
		transitionEnd,
		module;

	module = {
		initialize: function(){
			module.debug('Initializing progress bar', settings);

			module.set.duration();
			module.set.transitionEvent();

			module.read.metadata();
			module.read.settings();
		},
		reset: function(){
			module.remove.nextValue();
			module.update.progress(0);
		},
		complete: function(){
			if(module.percent === undefined || module.percent < 100){
				module.remove.progressPoll();
				module.set.percent(100);
			}
		},
		read: {
			metadata: function(){
				var data = {
					percent: element.dataset[metadata.percent],
					total: element.dataset[metadata.total],
					value: element.dataset[metadata.value]
				};

				if(data.percent){
					module.debug('Current percent value set from metadata', data.percent);
					module.set.percent(data.percent);
				}
				if(data.total){
					module.debug('Total value set from metadata', data.total);
					module.set.total(data.total);
				}
				if(data.value){
					module.debug('Current value set from metadata', data.value);
					module.set.value(data.value);
					module.set.progress(data.value);
				}
			},
			settings: function(){
				if(settings.total !== false){
					module.debug('Current total set in settings', settings.total);
					module.set.total(settings.total);
				}
				if(settings.value !== false){
					module.debug('Current value set in settings', settings.value);
					module.set.value(settings.value);
					module.set.progress(module.value);
				}
				if(settings.percent !== false){
					module.debug('Current percent set in settings', settings.percent);
					module.set.percent(settings.percent);
				}
			}
		},
		bind: {
			transitionEnd: function(callback){
				var transitionEnd = module.get.transitionEnd();

				bar.addEventListener(transitionEnd, function(event){
				    clearTimeout(module.failSafeTimer);
					callback.call(this, event);
				    event.target.removeEventListener(event.type, arguments.callee);
				});

				module.failSafeTimer = setTimeout(function(){
					bar.dispatchEvent(transitionEnd);
				}, settings.duration + settings.failSafeDelay);

				module.verbose('Adding fail safe timer', module.timer);
			}
		},
		increment: function(incrementValue){
			var
				maxValue,
				startValue,
				newValue
			;
			if( module.has.total() ){
				startValue     = module.get.value();
				incrementValue = incrementValue || 1;
				newValue       = startValue + incrementValue;
			}
			else {
				startValue     = module.get.percent();
				incrementValue = incrementValue || module.get.randomValue();

				newValue       = startValue + incrementValue;
				maxValue       = 100;
				module.debug('Incrementing percentage by', startValue, newValue);
			}
			newValue = module.get.normalizedValue(newValue);
			module.set.progress(newValue);
		},
		decrement: function(decrementValue){
			var
				total     = module.get.total(),
				startValue,
				newValue
			;
			if(total){
				startValue     =  module.get.value();
				decrementValue =  decrementValue || 1;
				newValue       =  startValue - decrementValue;
				module.debug('Decrementing value by', decrementValue, startValue);
			}
			else {
				startValue     =  module.get.percent();
				decrementValue =  decrementValue || module.get.randomValue();
				newValue       =  startValue - decrementValue;
				module.debug('Decrementing percentage by', decrementValue, startValue);
			}
			newValue = module.get.normalizedValue(newValue);
			module.set.progress(newValue);
		},
		has: {
			progressPoll: function(){
				return module.progressPoll;
			},
			total: function(){
				return (module.get.total() !== false);
			}
		},
		get: {
			text: function(templateText){
				var value = module.value || 0,
					total = module.total || 0,
					percent = (animating)
						? module.get.displayPercent()
						: module.percent || 0,
					left = (module.total > 0)
						? (total - value)
						: (100 - percent);
				
				templateText = templateText || '';
				templateText = templateText
					.replace('{value}', value)
					.replace('{total}', total)
					.replace('{left}', left)
					.replace('{percent}', percent);
				
				module.verbose('Adding variables to progress bar text', templateText);
				return templateText;
			},
			normalizedValue: function(value){
				if(value < 0){
					module.debug('Value cannot decrement below 0');
					return 0;
				}
				if(module.has.total()){
					if(value > module.total){
						module.debug('Value cannot increment above total', module.total);
						return module.total;
					}
				}
				else if(value > 100 ){
					module.debug('Value cannot increment above 100 percent');
					return 100;
				}
				return value;
			},
			updateInterval: function(){
				if(settings.updateInterval == 'auto'){
					return settings.duration;
				}
				return settings.updateInterval;
			},
			randomValue: function(){
				module.debug('Generating random increment percentage');
				return Math.floor((Math.random() * settings.random.max) + settings.random.min);
			},
			numericValue: function(value){
				return (typeof value === 'string')
					? (value.replace(/[^\d.]/g, '') !== '')
						? +(value.replace(/[^\d.]/g, ''))
						: false
					: value
				;
			},
			transitionEnd: function(){
				var element = document.createElement('element'),
					transition,
					transitions = {
						'transition': 'transitionend',
						'OTransition': 'oTransitionEnd',
						'MozTransition': 'transitionend',
						'WebkitTransition': 'webkitTransitionEnd'
					};
					
				for(transition in transitions){
					if( element.style[transition] !== undefined ){
						return transitions[transition];
					}
				}
			},
			displayPercent: function(){
				var barWidth = bar.width,
					totalWidth = element.width,
					minDisplay = parseInt(bar.style.minWidth, 10),
					displayPercent = (barWidth > minDisplay)
						? (barWidth / totalWidth * 100)
						: module.percent;
				
				return (settings.precision > 0)
					? Math.round(displayPercent * (10 * settings.precision)) / (10 * settings.precision)
					: Math.round(displayPercent);
			},
			percent: function(){
				return module.percent || 0;
			},
			value: function(){
				return module.nextValue || module.value || 0;
			},
			total: function(){
				return module.total || false;
			}
		},
		create: {
			progressPoll: function(){
				module.progressPoll = setTimeout(function(){
					module.update.toNextValue();
					module.remove.progressPoll();
				}, module.get.updateInterval());
			},
		},
		is: {
			complete: function(){
				return module.is.success() || module.is.warning() || module.is.error();
			},
			success: function(){
				return element.classList.contains(className.success);
			},
			warning: function(){
				return element.classList.contains(className.warning);
			},
			error: function(){
				return element.classList.contains(className.error);
			},
			active: function(){
				return element.classList.contains(className.active);
			},
			visible: function(){
				return ui.isVisible(element);
			}
		},
		remove: {
			progressPoll: function(){
				module.verbose('Removing progress poll timer');
				if(module.progressPoll){
					clearTimeout(module.progressPoll);
					delete module.progressPoll;
				}
			},
			nextValue: function(){
				module.verbose('Removing progress value stored for next update');
				delete module.nextValue;
			},
			state: function(){
				module.verbose('Removing stored state');
				delete module.total;
				delete module.percent;
				delete module.value;
			},
			active: function(){
				module.verbose('Removing active state');
				element.classList.remove(className.active);
			},
			success: function(){
				module.verbose('Removing success state');
				element.classList.remove(className.success);
			},
			warning: function(){
				module.verbose('Removing warning state');
				element.classList.remove(className.warning);
			},
			error: function(){
				module.verbose('Removing error state');
				element.classList.remove(className.error);
			}
		},
		set: {
			barWidth: function(value){
				if(value > 100){
					module.error(error.tooHigh, value);
				}
				else if (value < 0){
					module.error(error.tooLow, value);
				}
				else {
					bar.style.width = value + '%';
					element.setAttribute('data-percent', parseInt(value, 10));
				}
			},
			duration: function(duration){
				duration = duration || settings.duration;
				duration = (typeof duration == 'number')
					? duration + 'ms'
					: duration
				;
				module.verbose('Setting progress bar transition duration', duration);
				bar.style.transitionDuration = duration;
			},
			percent: function(percent){
				percent = (typeof percent == 'string')
					? +(percent.replace('%', ''))
					: percent;
				
				// round display percentage
				percent = (settings.precision > 0)
					? Math.round(percent * (10 * settings.precision)) / (10 * settings.precision)
					: Math.round(percent);
				
				module.percent = percent;

				if( !module.has.total() ){
					module.value = (settings.precision > 0)
						? Math.round( (percent / 100) * module.total * (10 * settings.precision)) / (10 * settings.precision)
						: Math.round( (percent / 100) * module.total * 10) / 10;
					
					if(settings.limitValues){
						module.value = (module.value > 100)
							? 100
							: (module.value < 0)
								? 0
								: module.value;
					}
				}

				module.set.barWidth(percent);
				module.set.labelInterval();
				module.set.labels();
				settings.onChange.call(element, percent, module.value, module.total);
			},
			labelInterval: function(){
				var animationCallback = function(){
						module.verbose('Bar finished animating, removing continuous label updates');
						clearInterval(module.interval);
						animating = false;
						module.set.labels();
					};

				clearInterval(module.interval);
				module.bind.transitionEnd(animationCallback);
				animating = true;
				module.interval = setInterval(function(){
					//var isInDOM = $.contains(document.documentElement, element)

					//if(!isInDOM){
						clearInterval(module.interval);
						animating = false;
					//}
					module.set.labels();
				}, settings.framerate);
			},
			labels: function(){
				module.verbose('Setting both bar progress and outer label text');
				module.set.barLabel();
				module.set.state();
			},
			label: function(text){
				text = text || '';
				if(text){
					text = module.get.text(text);
					module.verbose('Setting label to text', text);
					label.textContent = text;
				}
			},
			state: function(percent){
				percent = (percent !== undefined)
					? percent
					: module.percent
				;
				if(percent === 100){
					if(settings.autoSuccess && !(module.is.warning() || module.is.error() || module.is.success())){
						module.set.success();
						module.debug('Automatically triggering success at 100%');
					}
					else {
						module.verbose('Reached 100% removing active state');
						module.remove.active();
						module.remove.progressPoll();
					}
				}
				else if(percent > 0){
					module.verbose('Adjusting active progress bar label', percent);
					module.set.active();
				}
				else {
					module.remove.active();
					module.set.label(settings.text.active);
				}
			},
			barLabel: function(text){
				if(text !== undefined){
					progress.textContent = module.get.text(text);
				}
				else if(settings.label == 'ratio' && module.total){
					module.verbose('Adding ratio to bar label');
					progress.textContent = module.get.text(settings.text.ratio);
				}
				else if(settings.label == 'percent'){
					module.verbose('Adding percentage to bar label');
					progress.textContent = module.get.text(settings.text.percent);
				}
			},
			active: function(text){
				text = text || settings.text.active;
				module.debug('Setting active state');
				if(settings.showActivity && !module.is.active() ){
					element.classList.add(className.active);
				}
				module.remove.warning();
				module.remove.error();
				module.remove.success();
				text = settings.onLabelUpdate('active', text, module.value, module.total);
				if(text){
					module.set.label(text);
				}
				module.bind.transitionEnd(function(){
					settings.onActive.call(element, module.value, module.total);
				});
			},
			success : function(text){
				text = text || settings.text.success || settings.text.active;
				module.debug('Setting success state');
				element.classList.add(className.success);
				module.remove.active();
				module.remove.warning();
				module.remove.error();
				module.complete();
				if(settings.text.success){
					text = settings.onLabelUpdate('success', text, module.value, module.total);
					module.set.label(text);
				} else {
					text = settings.onLabelUpdate('active', text, module.value, module.total);
					module.set.label(text);
				}
				module.bind.transitionEnd(function(){
					settings.onSuccess.call(element, module.total);
				});
			},
			warning : function(text){
				text = text || settings.text.warning;
				module.debug('Setting warning state');
				element.classList.add(className.warning);
				module.remove.active();
				module.remove.success();
				module.remove.error();
				module.complete();
				text = settings.onLabelUpdate('warning', text, module.value, module.total);
				if(text){
					module.set.label(text);
				}
				module.bind.transitionEnd(function(){
					settings.onWarning.call(element, module.value, module.total);
				});
			},
			error : function(text){
				text = text || settings.text.error;
				module.debug('Setting error state');
				element.classList.add(className.error);
				module.remove.active();
				module.remove.success();
				module.remove.warning();
				module.complete();
				text = settings.onLabelUpdate('error', text, module.value, module.total);
				if(text){
					module.set.label(text);
				}
				module.bind.transitionEnd(function(){
					settings.onError.call(element, module.value, module.total);
				});
			},
			transitionEvent: function(){
				transitionEnd = module.get.transitionEnd();
			},
			total: function(totalValue){
				module.total = totalValue;
			},
			value: function(value){
				module.value = value;
			},
			progress: function(value){
				if(!module.has.progressPoll()){
					module.debug('First update in progress update interval, immediately updating', value);
					module.update.progress(value);
					module.create.progressPoll();
				}
				else {
					module.debug('Updated within interval, setting next update to use new value', value);
					module.set.nextValue(value);
				}
			},
			nextValue: function(value){
				module.nextValue = value;
			}
		},
		update: {
			toNextValue: function(){
				var
					nextValue = module.nextValue
				;
				if(nextValue){
					module.debug('Update interval complete using last updated value', nextValue);
					module.update.progress(nextValue);
					module.remove.nextValue();
				}
			},
			progress: function(value){
				var
					percentComplete
				;
				value = module.get.numericValue(value);
				if(value === false){
					module.error(error.nonNumeric, value);
				}
				value = module.get.normalizedValue(value);
				if( module.has.total() ){
					module.set.value(value);
					percentComplete = (value / module.total) * 100;
					module.debug('Calculating percent complete from total', percentComplete);
					module.set.percent( percentComplete );
				}
				else {
					percentComplete = value;
					module.debug('Setting value to exact percentage value', percentComplete);
					module.set.percent( percentComplete );
				}
			}
		}
	};
	
	return module;
};

ui.progress.settings = {
	silent: false,
	debug: false,
	verbose: false,
	performance: true,
	duration: 300,
	updateInterval: 'auto',
	autoSuccess: true,
	showActivity: true,
	limitValues: true,
	label: 'percent',
	precision: 0,
	framerate: (1000 / 30), /// 30 fps
	percent: false,
	total: false,
	value: false,
	failSafeDelay: 100,
	onLabelUpdate: function(state, text, value, total){
		return text;
	},
	onChange: function(percent, value, total){},
	onSuccess: function(total){},
	onActive: function(value, total){},
	onError: function(value, total){},
	onWarning: function(value, total){},
	regExp: {
		variable: /\{\$*[A-z0-9]+\}/g
	},
	random: {
		min: 2,
		max: 5
	},
	metadata: {
		percent: 'percent',
		total: 'total',
		value: 'value'
	},
	selector: {
		bar: '.bar',
		label: 'label',
		progress: '.bar > .progress'
	},
	className: {
		active: 'active',
		error: 'error',
		success: 'success',
		warning: 'warning'
	},
	error: {
		method: 'The method you called is not defined.',
		nonNumeric: 'Progress value is non numeric',
		tooHigh: 'Value specified is above 100%',
		tooLow: 'Value specified is below 0%'
	},
	text: {
		active: false,
		error: false,
		success: false,
		warning: false,
		percent: '{percent}%',
		ratio: '{value} of {total}'
	}
};
