/*!
 * # Vanilla Semantic UI 0.0.1 - Embed
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

ui.embed = function(element, settings){
	var selector = settings.selector,
		className = settings.className,
		sources = settings.sources,
		error = settings.error,
		metadata = settings.metadata,
		templates = settings.templates,
		placeholder = element.querySelectorAll(selector.placeholder),
		icon = element.querySelectorAll(selector.icon),
		embed = element.querySelectorAll(selector.embed),
		module;

	module = {
		initialize: function(){
			module.debug('Initializing embed');
			module.determine.autoplay();
			module.create();
			module.bind.events();
		},
		refresh: function(){
			module.verbose('Refreshing selector cache');
			placeholder = element.querySelector(selector.placeholder);
			icon = element.querySelector(selector.icon);
			embed = element.querySelector(selector.embed);
		},
		bind: {
			events: function(){
				if( module.has.placeholder() ){
					module.debug('Adding placeholder events');
					element.onclick = function(event){
						if(ui.checkTarget(event, selector.placeholder) || ui.checkTarget(event, selector.icon)){
							module.createAndShow();
						}
					}
				}
			}
		},
		create: function(){
			var placeholder = module.get.placeholder();

			if(placeholder){
				module.createPlaceholder();
			}
			else {
				module.createAndShow();
			}
		},
		createPlaceholder: function(placeholder){
			var icon  = module.get.icon(),
				url   = module.get.url(),
				embed = module.generate.embed(url);

			placeholder = placeholder || module.get.placeholder();
			element.innerHTML = templates.placeholder(placeholder, icon);
			module.debug('Creating placeholder for embed', placeholder, icon);
		},
		createEmbed: function(url){
			module.refresh();
			url = url || module.get.url();
			embed = document.createElement('div');
			embed.classList.add(className.embed);
			embed.innerHTML = module.generate.embed(url);
			element.append(embed);
			settings.onCreate.call(element, url);
			module.debug('Creating embed object', embed);
		},
		changeEmbed: function(url){
			embed.innerHTML = module.generate.embed(url);
		},
		createAndShow: function(){
			module.createEmbed();
			module.show();
		},
		change: function(source, id, url){
			module.debug('Changing video to ', source, id, url);
			element.dataset[metadata.source] = source;
			element.dataset[metadata.id] = id;
			
			if(url){
				element.dataset[metadata.url, url];
			} else {
				element.dataset[metadata.url] = undefined;
			}

			if(module.has.embed()){
				module.changeEmbed();
			} else {
				module.create();
			}
		},
		reset: function(){
			module.debug('Clearing embed and showing placeholder');
			module.remove.active();
			module.remove.embed();
			module.showPlaceholder();
			settings.onReset.call(element);
		},
		show: function(){
			module.debug('Showing embed');
			module.set.active();
			settings.onDisplay.call(element);
		},
		hide: function(){
			module.debug('Hiding embed');
			module.showPlaceholder();
		},
		showPlaceholder: function(){
			module.debug('Showing placeholder image');
			module.remove.active();
			settings.onPlaceholderDisplay.call(element);
		},
		get: {
			id: function(){
				return settings.id || element.dataset[metadata.id];
			},
			placeholder: function(){
				return settings.placeholder || element.dataset[metadata.placeholder];
			},
			icon: function(){
				return (settings.icon)
					? settings.icon
					: (element.dataset[metadata.icon] !== undefined)
						? element.dataset[metadata.icon]
						: module.determine.icon()
				;
			},
			source: function(url){
				return (settings.source)
					? settings.source
					: (element.dataset[metadata.source] !== undefined)
						? element.dataset[metadata.source]
						: module.determine.source()
				;
			},
			type: function(){
				var source = module.get.source();
				return (sources[source] !== undefined)
					? sources[source].type
					: false
				;
			},
			url: function(){
				return (settings.url)
					? settings.url
					: (element.dataset[metadata.url] !== undefined)
						? element.dataset[metadata.url]
						: module.determine.url()
				;
			}
		},
		determine: {
			autoplay: function(){
				if(module.should.autoplay()){
					settings.autoplay = true;
				}
			},
			source: function(url){
				var matchedSource = false;

				url = url || module.get.url();
				
				if(url){
					sources.forEach(sources, function(source, name){
						if(url.search(source.domain) !== -1){
							matchedSource = name;
							return false;
						}
					});
				}
				return matchedSource;
			},
			icon: function(){
				var
					source = module.get.source()
				;
				return (sources[source] !== undefined)
					? sources[source].icon
					: false
				;
			},
			url: function(){
				var id = settings.id || element.dataset[metadata.id],
					source = settings.source || element.dataset[metadata.source],
					url = (sources[source] !== undefined) ?
						sources[source].url.replace('{id}', id) : false;
				
				if(url){
					element.dataset[metadata.url] = url;
				}

				return url;
			}
		},
		set: {
			active: function(){
				element.classList.add(className.active);
			}
		},
		remove: {
			active: function(){
				element.classList.remove(className.active);
			},
			embed: function(){
				embed.innerHTML = "";
			}
		},
		encode: {
			parameters: function(parameters){
				var urlString = [],
					index;

				for (index in parameters){
					urlString.push( encodeURIComponent(index) + '=' + encodeURIComponent( parameters[index] ) );
				}
				return urlString.join('&amp;');
			}
		},
		generate: {
			embed: function(url){
				module.debug('Generating embed html');
				var
					source = module.get.source(),
					html,
					parameters
				;
				url = module.get.url(url);
				if(url){
					parameters = module.generate.parameters(source);
					html       = templates.iframe(url, parameters);
				}
				else {
					module.error(error.noURL, element);
				}
				return html;
			},
			parameters: function(source, extraParameters){
				var parameters = (sources[source] && sources[source].parameters !== undefined) ?
					sources[source].parameters(settings) : {};

				extraParameters = extraParameters || settings.parameters;
				
				if(extraParameters){
					parameters = ui.extend({}, parameters, extraParameters);
				}

				parameters = settings.onEmbed(parameters);
				return module.encode.parameters(parameters);
			}
		},
		has: {
			embed: function(){
				return (embed.length > 0);
			},
			placeholder: function(){
				return settings.placeholder || element.dataset[metadata.placeholder];
			}
		},
		should: {
			autoplay: function(){
				return (settings.autoplay === 'auto')
					? (settings.placeholder || element.dataset[metadata.placeholder] !== undefined)
					: settings.autoplay
				;
			}
		},
		is: {
			video: function(){
				return module.get.type() == 'video';
			}
		}
	};

	return module;
};

ui.embed.settings = {
	silent: false,
	debug: false,
	verbose: false,
	performance: true,
	icon: false,
	source: false,
	url: false,
	id: false,
	autoplay: 'auto',
	color: '#444444',
	hd: true,
	brandedUI: false,
	parameters: false,
	api     : false,
	onPause : function(){},
	onPlay  : function(){},
	onStop  : function(){},
	onDisplay: function(){},
	onPlaceholderDisplay: function(){},
	onReset: function(){},
	onCreate: function(url){},
	onEmbed: function(parameters){
		return parameters;
	},
	className: {
		active: 'active',
		embed: 'embed'
	},
	error: {
		noURL: 'No URL specified',
		method: 'The method you called is not defined'
	},
	selector : {
		embed       : '.embed',
		placeholder : '.placeholder',
		icon        : '.icon'
	},
	metadata: {
		id: 'id',
		icon: 'icon',
		placeholder: 'placeholder',
		source: 'source',
		url: 'url'
	},
	sources: {
		youtube: {
			name   : 'youtube',
			type   : 'video',
			icon   : 'video play',
			domain : 'youtube.com',
			url    : '//www.youtube.com/embed/{id}',
			parameters: function(settings){
				return {
					autohide       : !settings.brandedUI,
					autoplay       : settings.autoplay,
					color          : settings.color || undefined,
					hq             : settings.hd,
					jsapi          : settings.api,
					modestbranding : !settings.brandedUI
				};
			}
		},
		vimeo: {
			name   : 'vimeo',
			type   : 'video',
			icon   : 'video play',
			domain : 'vimeo.com',
			url    : '//player.vimeo.com/video/{id}',
			parameters: function(settings){
				return {
					api      : settings.api,
					autoplay : settings.autoplay,
					byline   : settings.brandedUI,
					color    : settings.color || undefined,
					portrait : settings.brandedUI,
					title    : settings.brandedUI
				};
			}
		}
	},
	templates: {
		iframe : function(url, parameters){
			var src = url;
			if (parameters){
					src += '?' + parameters;
			}
			return ''
				+ '<iframe src="' + src + '"'
				+ ' width="100%" height="100%"'
				+ ' frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'
			;
		},
		placeholder : function(image, icon){
			var
				html = ''
			;
			if(icon){
				html += '<i class="' + icon + ' icon"></i>';
			}
			if(image){
				html += '<img class="placeholder" src="' + image + '">';
			}
			return html;
		}
	}
};
