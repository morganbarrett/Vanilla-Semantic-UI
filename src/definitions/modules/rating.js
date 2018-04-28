/*!
 * # Semantic UI - Rating
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function(vs, window, document, undefined){
	'use strict';

	if(typeof window == 'undefined' || window.Math != Math){
		if(typeof self == 'undefined' || self.Math != Math){
			window = Function('return this')();
		} else {
			window = self;
		}
	}

	function prevAll(elem, func){
		while(elem = elem.previousElementSibling){
			func(elem);
		}
	}

	function nextAll(elem, func){
		while(elem = elem.nextElementSibling){
			func(elem);
		}
	}

	function isPlainObject(obj) {
		if (typeof (obj) !== 'object' || obj.nodeType || obj !== null && obj !== undefined && obj === obj.window) {
			return false;
		}

		if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
			return false;
		}

		return true;
	}

	function extend(){
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	}

	vs.rating = function(allModules, parameters){
		var moduleSelector = "",
			time = new Date().getTime(),
			performance = [],
			modules = [];

		if(typeof allModules === "string"){
			moduleSelector = allModules;
			allModules = document.querySelectorAll(allModules);
			allModules = [].slice.call(allModules);
		}

		if(typeof allModules !== "object"){
			allModules = [allModules];
		}

		allModules.forEach(function(element){
			var settings = ( isPlainObject(parameters) )
					? extend(true, {}, vs.rating.settings, parameters)
					: extend({}, vs.rating.settings),
				namespace = settings.namespace,
				className = settings.className,
				metadata = settings.metadata,
				selector = settings.selector,
				error = settings.error,
				eventNamespace = '.' + namespace,
				moduleNamespace = 'module' + namespace[0].toUpperCase() + namespace.substr(1),
				instance = element[moduleNamespace],
				icons = [].slice.call(element.querySelectorAll(selector.icon)),
				initialLoad,
				module;

			module = {
				initialize: function(){
					module.verbose('Initializing rating module', settings);
					
					console.log();

					if(icons.length === 0) {
						module.setup.layout();
					}

					if(settings.interactive) {
						module.enable();
					}
					else {
						module.disable();
					}
					
					module.set.initialLoad();
					module.set.rating( module.get.initialRating() );
					module.remove.initialLoad();
					module.instantiate();
				},
				instantiate: function(){
					module.verbose('Instantiating module', settings);
					instance = module;
					element[moduleNamespace] = module;
				},
				destroy: function(){
					module.verbose('Destroying previous instance', instance);
					module.remove.events();
					element[moduleNamespace] = undefined;
				},
				refresh: function(){
					icons = [].slice.call(element.querySelectorAll(selector.icon));
				},
				setup: {
					layout: function(){
						var maxRating = module.get.maxRating(),
							settings = vs.rating.settings,
							html = settings.templates.icon(maxRating);

						module.debug('Generating icon html dynamically');
						element.innerHTML = html;
						module.refresh();
					}
				},
				event: {
					mouseenter: function(event){
						nextAll(this, function(elem){
							elem.classList.remove(className.selected);
						});

						function addClass(elem){
							elem.classList.add(className.selected);
						}
						
						addClass(element);
						addClass(this);

						prevAll(this, addClass);
					},
					mouseleave: function(event){
						element.classList.remove(className.selected);
						for(var i in icons){
							icons[i].classList.remove(className.selected);
						}
					},
					click: function(event){
						var currentRating = module.get.rating(),
							rating        = icons.indexOf(event.target) + 1,
							canClear      = (settings.clearable == 'auto')
							 ? (icons.length === 1)
							 : settings.clearable;

						if(canClear && currentRating == rating){
							module.clearRating();
						} else {
							module.set.rating(rating);
						}
					}
				},
				clearRating: function(){
					module.debug('Clearing current rating');
					module.set.rating(0);
				},
				bind: {
					events: function() {
						module.verbose('Binding events');
						element.onclick = module.event.click;
						element.onmouseover = module.event.mouseenter;
						element.onmouseout = module.event.mouseleave;
					}
				},
				remove: {
					events: function() {
						module.verbose('Removing events');
						element.onclick = undefined;
						element.onmouseover = undefined;
						element.onmouseout = undefined;
					},
					initialLoad: function() {
						initialLoad = false;
					}
				},
				enable: function() {
					module.debug('Setting rating to interactive mode');
					module.bind.events();
					element.classList.remove(className.disabled);
				},
				disable: function() {
					module.debug('Setting rating to read-only mode');
					module.remove.events();
					element.classList.add(className.disabled);
				},
				is: {
					initialLoad: function(){
						return initialLoad;
					}
				},
				get: {
					initialRating: function(){
						var rating = element.dataset[metadata.rating];

						if(rating !== undefined) {
							element.removeAttribute("data-" + metadata.rating);
							return rating;
						}

						return settings.initialRating;
					},
					maxRating: function() {
						if(element.dataset[metadata.maxRating] !== undefined){
							element.dataset[metadata.maxRating] = null;
							return element.dataset[metadata.maxRating];
						}
						return settings.maxRating;
					},
					rating: function() {
						var currentRating = icons.filter(function(elem){
							return elem.matches('.' + className.active);
						}).length;
						module.verbose('Current rating retrieved', currentRating);
						return currentRating;
					}
				},
				set: {
					rating: function(rating) {
						var ratingIndex = rating - 1 >= 0 ? rating - 1 : 0,
							activeIcon = icons[ratingIndex];

						element.classList.remove(className.selected);

						for(var i in icons){
							icons[i].classList.remove(className.selected);
							icons[i].classList.remove(className.active);
						}

						if(rating > 0) {
							module.verbose('Setting current rating to', rating);
							activeIcon.classList.add(className.active);
							prevAll(activeIcon, function(elem){elem.classList.add(className.active);});
						}
						if(!module.is.initialLoad()) {
							settings.onRate.call(element, rating);
						}
					},
					initialLoad: function() {
						initialLoad = true;
					}
				},
				setting: function(name, value) {
					module.debug('Changing setting', name, value);
					if( isPlainObject(name) ) {
						extend(true, settings, name);
					}
					else if(value !== undefined) {
						if(isPlainObject(settings[name])) {
							extend(true, settings[name], value);
						}
						else {
							settings[name] = value;
						}
					}
					else {
						return settings[name];
					}
				},
				internal: function(name, value) {
					if(isPlainObject(name)){
						extend(true, module, name);
					}
					else if(value !== undefined) {
						module[name] = value;
					}
					else {
						return module[name];
					}
				},
				debug: function() {
					if(!settings.silent && settings.debug) {
						if(settings.performance) {
							module.performance.log(arguments);
						}
						else {
							module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
							module.debug.apply(console, arguments);
						}
					}
				},
				verbose: function() {
					if(!settings.silent && settings.verbose && settings.debug) {
						if(settings.performance) {
							module.performance.log(arguments);
						}
						else {
							module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
							module.verbose.apply(console, arguments);
						}
					}
				},
				error: function() {
					if(!settings.silent) {
						module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
						module.error.apply(console, arguments);
					}
				},
				performance: {
					log: function(message) {
						var
							currentTime,
							executionTime,
							previousTime
						;
						if(settings.performance) {
							currentTime   = new Date().getTime();
							previousTime  = time || currentTime;
							executionTime = currentTime - previousTime;
							time          = currentTime;
							performance.push({
								'Name'           : message[0],
								'Arguments'      : [].slice.call(message, 1) || '',
								'Element'        : element,
								'Execution Time' : executionTime
							});
						}
						clearTimeout(module.performance.timer);
						module.performance.timer = setTimeout(module.performance.display, 500);
					},
					display: function() {
						var
							title = settings.name + ':',
							totalTime = 0
						;
						time = false;
						clearTimeout(module.performance.timer);
						performance.forEach(function(data, index){
							totalTime += data['Execution Time'];
						});
						title += ' ' + totalTime + 'ms';
						if(moduleSelector) {
							title += ' \'' + moduleSelector + '\'';
						}
						if(allModules.length > 1) {
							title += ' ' + '(' + allModules.length + ')';
						}
						if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
							console.groupCollapsed(title);
							if(console.table) {
								console.table(performance);
							}
							else {
								performance.forEach(function(data, index) {
									console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
								});
							}
							console.groupEnd();
						}
						performance = [];
					}
				},
				invoke: function(query, passedArguments){
					var object = instance,
						maxDepth,
						found,
						response;

					if(typeof query == 'string' && object !== undefined) {
						query    = query.split(/[\. ]/);
						maxDepth = query.length - 1;
						query.forEach(function(value, depth){
							var camelCaseValue = (depth != maxDepth)
								? value + query[depth + 1].toUpperCase() + query[depth + 1].slice(1)
								: query
							;
							if( isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
								object = object[camelCaseValue];
							}
							else if( object[camelCaseValue] !== undefined ) {
								found = object[camelCaseValue];
								return false;
							}
							else if( isPlainObject( object[value] ) && (depth != maxDepth) ) {
								object = object[value];
							}
							else if( object[value] !== undefined ) {
								found = object[value];
								return false;
							}
							else {
								return false;
							}
						});
					}

					if(typeof found === 'function'){
						response = found.apply(element, passedArguments);
					} else if(found !== undefined) {
						response = found;
					}

					return response;
				}
			}

			module.initialize();
			modules.push(module);
		});

		return modules;
	}

	vs.rating.settings = {
		name: 'Rating',
		namespace: 'rating',
		slent: false,
		debug: false,
		verbose: false,
		performance: true,
		initialRating: 0,
		interactive: true,
		maxRating: 4,
		clearable: 'auto',
		fireOnInit: false,
		onRate: function(rating){},
		error: {
			method: 'The method you called is not defined',
			noMaximum: 'No maximum rating specified. Cannot generate HTML automatically'
		},
		metadata: {
			rating: 'rating',
			maxRating: 'maxRating'
		},
		className: {
			active: 'active',
			disabled: 'disabled',
			selected: 'selected',
			loading: 'loading'
		},
		selector: {
			icon: '.icon'
		},
		templates: {
			icon: function(maxRating){
				var icon = 1,
					html = '';

				while(icon <= maxRating){
					html += '<i class="icon"></i>';
					icon++;
				}

				return html;
			}
		}
	};
})(vs, window, document);
