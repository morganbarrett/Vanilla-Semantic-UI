/*!
 * # Vanilla Semantic UI 0.0.1 - Core
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

var ui = function(elements){
	var obj = {};

	if(typeof elements === "string"){
		var elems = document.querySelectorAll(elements);
		elements = [].slice.call(elems);
	} else if(typeof elements !== "object"){
		elements = [elements];
	}

	for(var c in ui){
		if(ui[c].settings == undefined){
			continue;
		}

		obj[c] = (function(name, comp){
			return function(params){
				var args = [{}, comp.settings],
					time = new Date().getTime(),
					perf = [];

				if(ui.isPlainObject(params)){
					args = [true, {}, comp.settings, params];
				}
				
				var settings = ui.extend.apply(this, args);
				
				elements.forEach(function(element){
					element[name] = makeModule(name, comp, element, settings);
				});
			};
		})(c, ui[c]);
	}

	return obj;
};

function makeModule(name, comp, element, settings){
	var instance = element[name],
		module = comp(element, settings, instance);

	module.destroy = function(){
		module.verbose('Destroying previous instance', instance);
		if(module.unbind.events){
			module.unbind.events();
		}
		element[name] = undefined;
	};

	module.debug = function(){
		if(!settings.silent && settings.debug){
			if(settings.performance){
				module.performance.log(arguments);
			}
			else {
				module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
				module.debug.apply(console, arguments);
			}
		}
	};

	module.verbose = function(){
		if(!settings.silent && settings.verbose && settings.debug){
			if(settings.performance){
				module.performance.log(arguments);
			}
			else {
				module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
				module.verbose.apply(console, arguments);
			}
		}
	};

	module.error = function(){
		if(!settings.silent){
			module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
			module.error.apply(console, arguments);
		}
	};

	module.performance = {
		log: function(message){
			var
				currentTime,
				executionTime,
				previousTime
			;
			if(settings.performance){
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
		display: function(){
			var title = settings.name + ':',
				totalTime = 0;

			time = false;
			clearTimeout(module.performance.timer);
			performance.forEach(function(data, index){
				totalTime += data['Execution Time'];
			});
			title += ' ' + totalTime + 'ms';
			if( (console.group !== undefined || console.table !== undefined) && performance.length > 0){
				console.groupCollapsed(title);
				if(console.table){
					console.table(performance);
				}
				else {
					performance.forEach(function(data, index){
						console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
					});
				}
				console.groupEnd();
			}
			performance = [];
		}
	};
	
	module.verbose('Instantiating module', settings);
	if(module.initialize) module.initialize();

	return module;
};

ui.invoke = function(query, passedArguments){
	var object = instance,
		maxDepth,
		found,
		response;

	if(typeof query == 'string' && object !== undefined) {
		query = query.split(/[\. ]/);
		maxDepth = query.length - 1;
		query.forEach(function(value, depth){
			var camelCaseValue = (depth != maxDepth)
				? value + query[depth + 1].toUpperCase() + query[depth + 1].slice(1)
				: query
			;
			if( ui.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
				object = object[camelCaseValue];
			}
			else if( object[camelCaseValue] !== undefined ) {
				found = object[camelCaseValue];
				return false;
			}
			else if( ui.isPlainObject( object[value] ) && (depth != maxDepth) ) {
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
};