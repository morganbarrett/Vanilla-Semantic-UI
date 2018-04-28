var vs = {
	parse: function(selector){
		if(typeof selector === "string"){
			var elems = document.querySelectorAll(selector);
			return [].slice.call(elems);
		}

		if(typeof selector !== "object"){
			return [selector];
		}

		return selector;
	},
	extendSettings: function(name, parameters){
		var args = [{}, vs[name].settings];

		if(this.isPlainObject(parameters)){
			args.unshift(true);
			args.push(parameters);
		}

		return this.extend(...args);
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
	},
	isPlainObject: function(obj){
		if (typeof (obj) !== 'object' || obj.nodeType || obj !== null && obj !== undefined && obj === obj.window) {
			return false;
		}

		if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
			return false;
		}

		return true;
	},
	extend: function(){
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = vs.extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	},
	isVisible: function(e){
    	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
	},
	fadeIn: function(elem, display){
		elem.style.opacity = 0;
		elem.style.display = display || "block";

		(function fade(){
			var val = parseFloat(elem.style.opacity) + .1;
			
			if(val <= 1){
				elem.style.opacity = val;
				requestAnimationFrame(fade);
			}
		})();
	},
	fadeOut: function(elem){//might not be used
		elem.style.opacity = 1;

		(function fade() {
			if ((elem.style.opacity -= .1) < 0) {
				elem.style.display = "none";
			} else {
				requestAnimationFrame(fade);
			}
		})();
	}
};