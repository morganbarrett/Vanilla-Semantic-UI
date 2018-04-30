/*!
 * # Vanilla Semantic UI - Core
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

var vs = function(modules){
	var obj = {};

	if(typeof modules === "string"){
		var elems = document.querySelectorAll(modules);
		modules = [].slice.call(elems);
	} else if(typeof modules !== "object"){
		modules = [modules];
	}

	for(var f in vs){
		var func = vs[f];
		
		if(func.settings != undefined){
			obj[f] = (function(name, component){
				return function(params){
					var args = [{}, component.settings];

					if(vs.isPlainObject(params)){
						args.unshift(true);
						args.push(params);
					}

					var extSettings = vs.extend.apply(this, args),
						time = new Date().getTime(),
						performance = [];

					modules.forEach(function(element){
						component(element, extSettings, time, performance);
					});
				};
			})(f, func);
		}
	}

	return obj;
};

vs.invoke = function(query, passedArguments){
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
			if( vs.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
				object = object[camelCaseValue];
			}
			else if( object[camelCaseValue] !== undefined ) {
				found = object[camelCaseValue];
				return false;
			}
			else if( vs.isPlainObject( object[value] ) && (depth != maxDepth) ) {
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