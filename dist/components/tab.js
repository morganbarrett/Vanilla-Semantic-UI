/*!
 * # Vanilla Semantic UI 0.0.1 - Tab
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

ui.tab = function(element, settings){
	var className = settings.className,
		metadata = settings.metadata,
		selector = settings.selector,
		error = settings.error,
		context,
		$tabs,
		cache = {},
		firstLoad = true,
		recursionDepth = 0,
		activeTabPath,
		parameterArray,
		module,
		historyEvent;

	/*module = {

		initialize: function() {
			module.debug('Initializing tab menu item', $module);
			module.fix.callbacks();
			module.determineTabs();

			module.debug('Determining tabs', settings.context, $tabs);
			// set up automatic routing
			if(settings.auto) {
				module.set.auto();
			}
			module.bind.events();

			if(settings.history && !initializedHistory) {
				module.initializeHistory();
				initializedHistory = true;
			}

			module.instantiate();
		},

		bind: {
			events: function() {
				// if using $.tab don't add events
				if( !$.isWindow( element ) ) {
					module.debug('Attaching tab activation events to element', $module);
					$module
						.on('click' + eventNamespace, module.event.click)
					;
				}
			}
		},

		determineTabs: function() {
			var
				$reference
			;

			// determine tab context
			if(settings.context === 'parent') {
				if($module.closest(selector.ui).length > 0) {
					$reference = $module.closest(selector.ui);
					module.verbose('Using closest UI element as parent', $reference);
				}
				else {
					$reference = $module;
				}
				$context = $reference.parent();
				module.verbose('Determined parent element for creating context', $context);
			}
			else if(settings.context) {
				$context = $(settings.context);
				module.verbose('Using selector for tab context', settings.context, $context);
			}
			else {
				$context = $('body');
			}
			// find tabs
			if(settings.childrenOnly) {
				$tabs = $context.children(selector.tabs);
				module.debug('Searching tab context children for tabs', $context, $tabs);
			}
			else {
				$tabs = $context.find(selector.tabs);
				module.debug('Searching tab context for tabs', $context, $tabs);
			}
		},

		fix: {
			callbacks: function() {
				if( $.isPlainObject(parameters) && (parameters.onTabLoad || parameters.onTabInit) ) {
					if(parameters.onTabLoad) {
						parameters.onLoad = parameters.onTabLoad;
						delete parameters.onTabLoad;
						module.error(error.legacyLoad, parameters.onLoad);
					}
					if(parameters.onTabInit) {
						parameters.onFirstLoad = parameters.onTabInit;
						delete parameters.onTabInit;
						module.error(error.legacyInit, parameters.onFirstLoad);
					}
					settings = $.extend(true, {}, $.fn.tab.settings, parameters);
				}
			}
		},

		initializeHistory: function() {
			module.debug('Initializing page state');
			if( $.address === undefined ) {
				module.error(error.state);
				return false;
			}
			else {
				if(settings.historyType == 'state') {
					module.debug('Using HTML5 to manage state');
					if(settings.path !== false) {
						$.address
							.history(true)
							.state(settings.path)
						;
					}
					else {
						module.error(error.path);
						return false;
					}
				}
				$.address
					.bind('change', module.event.history.change)
				;
			}
		},

		event: {
			click: function(event) {
				var
					tabPath = $(this).data(metadata.tab)
				;
				if(tabPath !== undefined) {
					if(settings.history) {
						module.verbose('Updating page state', event);
						$.address.value(tabPath);
					}
					else {
						module.verbose('Changing tab', event);
						module.changeTab(tabPath);
					}
					event.preventDefault();
				}
				else {
					module.debug('No tab specified');
				}
			},
			history: {
				change: function(event) {
					var
						tabPath   = event.pathNames.join('/') || module.get.initialPath(),
						pageTitle = settings.templates.determineTitle(tabPath) || false
					;
					module.performance.display();
					module.debug('History change event', tabPath, event);
					historyEvent = event;
					if(tabPath !== undefined) {
						module.changeTab(tabPath);
					}
					if(pageTitle) {
						$.address.title(pageTitle);
					}
				}
			}
		},

		refresh: function() {
			if(activeTabPath) {
				module.debug('Refreshing tab', activeTabPath);
				module.changeTab(activeTabPath);
			}
		},

		cache: {

			read: function(cacheKey) {
				return (cacheKey !== undefined)
					? cache[cacheKey]
					: false
				;
			},
			add: function(cacheKey, content) {
				cacheKey = cacheKey || activeTabPath;
				module.debug('Adding cached content for', cacheKey);
				cache[cacheKey] = content;
			},
			remove: function(cacheKey) {
				cacheKey = cacheKey || activeTabPath;
				module.debug('Removing cached content for', cacheKey);
				delete cache[cacheKey];
			}
		},

		set: {
			auto: function() {
				var
					url = (typeof settings.path == 'string')
						? settings.path.replace(/\/$/, '') + '/{$tab}'
						: '/{$tab}'
				;
				module.verbose('Setting up automatic tab retrieval from server', url);
				if($.isPlainObject(settings.apiSettings)) {
					settings.apiSettings.url = url;
				}
				else {
					settings.apiSettings = {
						url: url
					};
				}
			},
			loading: function(tabPath) {
				var
					$tab      = module.get.tabElement(tabPath),
					isLoading = $tab.classList.contains(className.loading)
				;
				if(!isLoading) {
					module.verbose('Setting loading state for', $tab);
					$tab
						.classList.add(className.loading)
						.siblings($tabs)
							.classList.remove(className.active + ' ' + className.loading)
					;
					if($tab.length > 0) {
						settings.onRequest.call($tab[0], tabPath);
					}
				}
			},
			state: function(state) {
				$.address.value(state);
			}
		},

		changeTab: function(tabPath) {
			var
				pushStateAvailable = (window.history && window.history.pushState),
				shouldIgnoreLoad   = (pushStateAvailable && settings.ignoreFirstLoad && firstLoad),
				remoteContent      = (settings.auto || $.isPlainObject(settings.apiSettings) ),
				// only add default path if not remote content
				pathArray = (remoteContent && !shouldIgnoreLoad)
					? module.utilities.pathToArray(tabPath)
					: module.get.defaultPathArray(tabPath)
			;
			tabPath = module.utilities.arrayToPath(pathArray);
			$.each(pathArray, function(index, tab) {
				var
					currentPathArray   = pathArray.slice(0, index + 1),
					currentPath        = module.utilities.arrayToPath(currentPathArray),

					isTab              = module.is.tab(currentPath),
					isLastIndex        = (index + 1 == pathArray.length),

					$tab               = module.get.tabElement(currentPath),
					$anchor,
					nextPathArray,
					nextPath,
					isLastTab
				;
				module.verbose('Looking for tab', tab);
				if(isTab) {
					module.verbose('Tab was found', tab);
					// scope up
					activeTabPath  = currentPath;
					parameterArray = module.utilities.filterArray(pathArray, currentPathArray);

					if(isLastIndex) {
						isLastTab = true;
					}
					else {
						nextPathArray = pathArray.slice(0, index + 2);
						nextPath      = module.utilities.arrayToPath(nextPathArray);
						isLastTab     = ( !module.is.tab(nextPath) );
						if(isLastTab) {
							module.verbose('Tab parameters found', nextPathArray);
						}
					}
					if(isLastTab && remoteContent) {
						if(!shouldIgnoreLoad) {
							module.activate.navigation(currentPath);
							module.fetch.content(currentPath, tabPath);
						}
						else {
							module.debug('Ignoring remote content on first tab load', currentPath);
							firstLoad = false;
							module.cache.add(tabPath, $tab.html());
							module.activate.all(currentPath);
							settings.onFirstLoad.call($tab[0], currentPath, parameterArray, historyEvent);
							settings.onLoad.call($tab[0], currentPath, parameterArray, historyEvent);
						}
						return false;
					}
					else {
						module.debug('Opened local tab', currentPath);
						module.activate.all(currentPath);
						if( !module.cache.read(currentPath) ) {
							module.cache.add(currentPath, true);
							module.debug('First time tab loaded calling tab init');
							settings.onFirstLoad.call($tab[0], currentPath, parameterArray, historyEvent);
						}
						settings.onLoad.call($tab[0], currentPath, parameterArray, historyEvent);
					}

				}
				else if(tabPath.search('/') == -1 && tabPath !== '') {
					// look for in page anchor
					$anchor     = $('#' + tabPath + ', a[name="' + tabPath + '"]');
					currentPath = $anchor.closest('[data-tab]').data(metadata.tab);
					$tab        = module.get.tabElement(currentPath);
					// if anchor exists use parent tab
					if($anchor && $anchor.length > 0 && currentPath) {
						module.debug('Anchor link used, opening parent tab', $tab, $anchor);
						if( !$tab.classList.contains(className.active) ) {
							setTimeout(function() {
								module.scrollTo($anchor);
							}, 0);
						}
						module.activate.all(currentPath);
						if( !module.cache.read(currentPath) ) {
							module.cache.add(currentPath, true);
							module.debug('First time tab loaded calling tab init');
							settings.onFirstLoad.call($tab[0], currentPath, parameterArray, historyEvent);
						}
						settings.onLoad.call($tab[0], currentPath, parameterArray, historyEvent);
						return false;
					}
				}
				else {
					module.error(error.missingTab, $module, $context, currentPath);
					return false;
				}
			});
		},

		scrollTo: function($element) {
			var
				scrollOffset = ($element && $element.length > 0)
					? $element.offset().top
					: false
			;
			if(scrollOffset !== false) {
				module.debug('Forcing scroll to an in-page link in a hidden tab', scrollOffset, $element);
				$(document).scrollTop(scrollOffset);
			}
		},

		update: {
			content: function(tabPath, html, evaluateScripts) {
				var
					$tab = module.get.tabElement(tabPath),
					tab  = $tab[0]
				;
				evaluateScripts = (evaluateScripts !== undefined)
					? evaluateScripts
					: settings.evaluateScripts
				;
				if(typeof settings.cacheType == 'string' && settings.cacheType.toLowerCase() == 'dom' && typeof html !== 'string') {
					$tab
						.empty()
						.append($(html).clone(true))
					;
				}
				else {
					if(evaluateScripts) {
						module.debug('Updating HTML and evaluating inline scripts', tabPath, html);
						$tab.html(html);
					}
					else {
						module.debug('Updating HTML', tabPath, html);
						tab.innerHTML = html;
					}
				}
			}
		},

		fetch: {

			content: function(tabPath, fullTabPath) {
				var
					$tab        = module.get.tabElement(tabPath),
					apiSettings = {
						dataType         : 'html',
						encodeParameters : false,
						on               : 'now',
						cache            : settings.alwaysRefresh,
						headers          : {
							'X-Remote': true
						},
						onSuccess : function(response) {
							if(settings.cacheType == 'response') {
								module.cache.add(fullTabPath, response);
							}
							module.update.content(tabPath, response);
							if(tabPath == activeTabPath) {
								module.debug('Content loaded', tabPath);
								module.activate.tab(tabPath);
							}
							else {
								module.debug('Content loaded in background', tabPath);
							}
							settings.onFirstLoad.call($tab[0], tabPath, parameterArray, historyEvent);
							settings.onLoad.call($tab[0], tabPath, parameterArray, historyEvent);

							if(settings.loadOnce) {
								module.cache.add(fullTabPath, true);
							}
							else if(typeof settings.cacheType == 'string' && settings.cacheType.toLowerCase() == 'dom' && $tab.children().length > 0) {
								setTimeout(function() {
									var
										$clone = $tab.children().clone(true)
									;
									$clone = $clone.not('script');
									module.cache.add(fullTabPath, $clone);
								}, 0);
							}
							else {
								module.cache.add(fullTabPath, $tab.html());
							}
						},
						urlData: {
							tab: fullTabPath
						}
					},
					request         = $tab.api('get request') || false,
					existingRequest = ( request && request.state() === 'pending' ),
					requestSettings,
					cachedContent
				;

				fullTabPath   = fullTabPath || tabPath;
				cachedContent = module.cache.read(fullTabPath);


				if(settings.cache && cachedContent) {
					module.activate.tab(tabPath);
					module.debug('Adding cached content', fullTabPath);
					if(!settings.loadOnce) {
						if(settings.evaluateScripts == 'once') {
							module.update.content(tabPath, cachedContent, false);
						}
						else {
							module.update.content(tabPath, cachedContent);
						}
					}
					settings.onLoad.call($tab[0], tabPath, parameterArray, historyEvent);
				}
				else if(existingRequest) {
					module.set.loading(tabPath);
					module.debug('Content is already loading', fullTabPath);
				}
				else if($.api !== undefined) {
					requestSettings = $.extend(true, {}, settings.apiSettings, apiSettings);
					module.debug('Retrieving remote content', fullTabPath, requestSettings);
					module.set.loading(tabPath);
					$tab.api(requestSettings);
				}
				else {
					module.error(error.api);
				}
			}
		},

		activate: {
			all: function(tabPath) {
				module.activate.tab(tabPath);
				module.activate.navigation(tabPath);
			},
			tab: function(tabPath) {
				var
					$tab          = module.get.tabElement(tabPath),
					$deactiveTabs = (settings.deactivate == 'siblings')
						? $tab.siblings($tabs)
						: $tabs.not($tab),
					isActive      = $tab.classList.contains(className.active)
				;
				module.verbose('Showing tab content for', $tab);
				if(!isActive) {
					$tab
						.classList.add(className.active)
					;
					$deactiveTabs
						.classList.remove(className.active + ' ' + className.loading)
					;
					if($tab.length > 0) {
						settings.onVisible.call($tab[0], tabPath);
					}
				}
			},
			navigation: function(tabPath) {
				var
					$navigation         = module.get.navElement(tabPath),
					$deactiveNavigation = (settings.deactivate == 'siblings')
						? $navigation.siblings($allModules)
						: $allModules.not($navigation),
					isActive    = $navigation.classList.contains(className.active)
				;
				module.verbose('Activating tab navigation for', $navigation, tabPath);
				if(!isActive) {
					$navigation
						.classList.add(className.active)
					;
					$deactiveNavigation
						.classList.remove(className.active + ' ' + className.loading)
					;
				}
			}
		},

		deactivate: {
			all: function() {
				module.deactivate.navigation();
				module.deactivate.tabs();
			},
			navigation: function() {
				$allModules
					.classList.remove(className.active)
				;
			},
			tabs: function() {
				$tabs
					.classList.remove(className.active + ' ' + className.loading)
				;
			}
		},

		is: {
			tab: function(tabName) {
				return (tabName !== undefined)
					? ( module.get.tabElement(tabName).length > 0 )
					: false
				;
			}
		},

		get: {
			initialPath: function() {
				return $allModules.eq(0).data(metadata.tab) || $tabs.eq(0).data(metadata.tab);
			},
			path: function() {
				return $.address.value();
			},
			// adds default tabs to tab path
			defaultPathArray: function(tabPath) {
				return module.utilities.pathToArray( module.get.defaultPath(tabPath) );
			},
			defaultPath: function(tabPath) {
				var
					$defaultNav = $allModules.filter('[data-' + metadata.tab + '^="' + tabPath + '/"]').eq(0),
					defaultTab  = $defaultNav.data(metadata.tab) || false
				;
				if( defaultTab ) {
					module.debug('Found default tab', defaultTab);
					if(recursionDepth < settings.maxDepth) {
						recursionDepth++;
						return module.get.defaultPath(defaultTab);
					}
					module.error(error.recursion);
				}
				else {
					module.debug('No default tabs found for', tabPath, $tabs);
				}
				recursionDepth = 0;
				return tabPath;
			},
			navElement: function(tabPath) {
				tabPath = tabPath || activeTabPath;
				return $allModules.filter('[data-' + metadata.tab + '="' + tabPath + '"]');
			},
			tabElement: function(tabPath) {
				var
					$fullPathTab,
					$simplePathTab,
					tabPathArray,
					lastTab
				;
				tabPath        = tabPath || activeTabPath;
				tabPathArray   = module.utilities.pathToArray(tabPath);
				lastTab        = module.utilities.last(tabPathArray);
				$fullPathTab   = $tabs.filter('[data-' + metadata.tab + '="' + tabPath + '"]');
				$simplePathTab = $tabs.filter('[data-' + metadata.tab + '="' + lastTab + '"]');
				return ($fullPathTab.length > 0)
					? $fullPathTab
					: $simplePathTab
				;
			},
			tab: function() {
				return activeTabPath;
			}
		},

		utilities: {
			filterArray: function(keepArray, removeArray) {
				return $.grep(keepArray, function(keepValue) {
					return ( $.inArray(keepValue, removeArray) == -1);
				});
			},
			last: function(array) {
				return $.isArray(array)
					? array[ array.length - 1]
					: false
				;
			},
			pathToArray: function(pathName) {
				if(pathName === undefined) {
					pathName = activeTabPath;
				}
				return typeof pathName == 'string'
					? pathName.split('/')
					: [pathName]
				;
			},
			arrayToPath: function(pathArray) {
				return $.isArray(pathArray)
					? pathArray.join('/')
					: false
				;
			}
		}
	};*/
	
	module = {};
	
	return module;
};

// shortcut for tabbed content with no defined navigation
//$.tab = function() {
//	$(window).tab.apply(this, arguments);
//};

ui.tab.settings = {
	name            : 'Tab',
	namespace       : 'tab',

	silent          : false,
	debug           : false,
	verbose         : false,
	performance     : true,

	auto            : false,      // uses pjax style endpoints fetching content from same url with remote-content headers
	history         : false,      // use browser history
	historyType     : 'hash',     // #/ or html5 state
	path            : false,      // base path of url

	context         : false,      // specify a context that tabs must appear inside
	childrenOnly    : false,      // use only tabs that are children of context
	maxDepth        : 25,         // max depth a tab can be nested

	deactivate      : 'siblings', // whether tabs should deactivate sibling menu elements or all elements initialized together

	alwaysRefresh   : false,      // load tab content new every tab click
	cache           : true,       // cache the content requests to pull locally
	loadOnce        : false,      // Whether tab data should only be loaded once when using remote content
	cacheType       : 'response', // Whether to cache exact response, or to html cache contents after scripts execute
	ignoreFirstLoad : false,      // don't load remote content on first load

	apiSettings     : false,      // settings for api call
	evaluateScripts : 'once',     // whether inline scripts should be parsed (true/false/once). Once will not re-evaluate on cached content

	onFirstLoad : function(tabPath, parameterArray, historyEvent) {}, // called first time loaded
	onLoad      : function(tabPath, parameterArray, historyEvent) {}, // called on every load
	onVisible   : function(tabPath, parameterArray, historyEvent) {}, // called every time tab visible
	onRequest   : function(tabPath, parameterArray, historyEvent) {}, // called ever time a tab beings loading remote content

	templates : {
		determineTitle: function(tabArray) {} // returns page title for path
	},

	error: {
		api        : 'You attempted to load content without API module',
		method     : 'The method you called is not defined',
		missingTab : 'Activated tab cannot be found. Tabs are case-sensitive.',
		noContent  : 'The tab you specified is missing a content url.',
		path       : 'History enabled, but no path was specified',
		recursion  : 'Max recursive depth reached',
		legacyInit : 'onTabInit has been renamed to onFirstLoad in 2.0, please adjust your code.',
		legacyLoad : 'onTabLoad has been renamed to onLoad in 2.0. Please adjust your code',
		state      : 'History requires Asual\'s Address library <https://github.com/asual/jquery-address>'
	},

	metadata : {
		tab    : 'tab',
		loaded : 'loaded',
		promise: 'promise'
	},

	className   : {
		loading : 'loading',
		active  : 'active'
	},

	selector    : {
		tabs : '.ui.tab',
		ui   : '.ui'
	}
};
