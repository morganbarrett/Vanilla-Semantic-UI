/*!
 * # Vanilla Semantic UI 0.0.1 - Rating
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

vs.rating = function(element, settings){
	var namespace = settings.namespace,
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

			if(icons.length === 0){
				module.setup.layout();
			}

			if(settings.interactive){
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
				if(!vs.checkTarget(event, selector.icon)){
					return;
				}

				vs.nextAll(this, function(elem){
					elem.classList.remove(className.selected);
				});

				function addClass(elem){
					elem.classList.add(className.selected);
				}
				
				addClass(element);
				addClass(this);

				vs.prevAll(this, addClass);
			},
			mouseleave: function(event){
				if(!vs.checkTarget(event, selector.icon)){
					return;
				}

				element.classList.remove(className.selected);
				for(var i in icons){
					icons[i].classList.remove(className.selected);
				}
			},
			click: function(event){
				if(!vs.checkTarget(event, selector.icon)){
					return;
				}

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
			events: function(){
				module.verbose('Binding events');
				element.onclick = module.event.click;
				element.onmouseover = module.event.mouseenter;
				element.onmouseout = module.event.mouseleave;
			}
		},
		remove: {
			events: function(){
				module.verbose('Removing events');
				element.onclick = undefined;
				element.onmouseover = undefined;
				element.onmouseout = undefined;
			},
			initialLoad: function(){
				initialLoad = false;
			}
		},
		enable: function(){
			module.debug('Setting rating to interactive mode');
			module.bind.events();
			element.classList.remove(className.disabled);
		},
		disable: function(){
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

				if(rating !== undefined){
					element.removeAttribute("data-" + metadata.rating);
					return rating;
				}

				return settings.initialRating;
			},
			maxRating: function(){
				if(element.dataset[metadata.maxRating] !== undefined){
					element.dataset[metadata.maxRating] = null;
					return element.dataset[metadata.maxRating];
				}
				return settings.maxRating;
			},
			rating: function(){
				var currentRating = icons.filter(function(elem){
					return elem.matches('.' + className.active);
				}).length;
				module.verbose('Current rating retrieved', currentRating);
				return currentRating;
			}
		},
		set: {
			rating: function(rating){
				var ratingIndex = rating - 1 >= 0 ? rating - 1 : 0,
					activeIcon = icons[ratingIndex];

				element.classList.remove(className.selected);

				for(var i in icons){
					icons[i].classList.remove(className.selected);
					icons[i].classList.remove(className.active);
				}

				if(rating > 0){
					module.verbose('Setting current rating to', rating);
					activeIcon.classList.add(className.active);
					vs.prevAll(activeIcon, function(elem){elem.classList.add(className.active);});
				}
				if(!module.is.initialLoad()){
					settings.onRate.call(element, rating);
				}
			},
			initialLoad: function(){
				initialLoad = true;
			}
		}
	};

	return module;
};

vs.rating.settings = {
	name: 'Rating',
	namespace: 'rating',
	silent: false,
	debug: false,
	verbose: false,
	performance: true,
	initialRating: 0,
	interactive: true,
	maxRating: 4,
	clearable: 'auto',
	fireOnInit: false,
	onRate: function(rating){},
	selector: {
		icon: '.icon'
	},
	metadata: {
		rating: 'rating',
		maxRating: 'maxRating'
	},
	error: {
		method: 'The method you called is not defined',
		noMaximum: 'No maximum rating specified. Cannot generate HTML automatically'
	},
	className: {
		active: 'active',
		disabled: 'disabled',
		selected: 'selected',
		loading: 'loading'
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
