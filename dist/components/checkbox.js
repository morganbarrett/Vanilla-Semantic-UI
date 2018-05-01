/*!
 * # Vanilla Semantic UI 0.0.1 - Checkbox
 * http://github.com/morganbarrett/vanilla-semantic-ui/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

ui.checkbox = function(element, settings){
	var selector = settings.selector,
		error = settings.error,
		className = settings.className,
		label = element.querySelectorAll(selector.label),
		input = element.querySelectorAll(selector.input),
		input = input[0],
		initialLoad = false,
		shortcutPressed = false,
		observer,
		module;

	module = {
		initialize: function(){
			module.verbose('Initializing checkbox', settings);

			module.create.label();
			module.bind.events();

			module.set.tabbable();
			module.hide.input();

			module.observeChanges();
			module.setup();
		},
		fix: {
			reference: function(){
				if( element.matches(selector.input) ){
					module.debug('Behavior called on <input> adjusting invoked element');
					element = element.closest(selector.checkbox);
					module.refresh();
				}
			}
		},
		setup: function(){
			module.set.initialLoad();
			if( module.is.indeterminate() ){
				module.debug('Initial value is indeterminate');
				module.indeterminate();
			}
			else if( module.is.checked() ){
				module.debug('Initial value is checked');
				module.check();
			}
			else {
				module.debug('Initial value is unchecked');
				module.uncheck();
			}
			module.remove.initialLoad();
		},
		refresh: function(){
			label = element.querySelectorAll("> " + selector.label);
			input = element.querySelectorAll("> " + selector.input);
			input  = input[0];
		},
		hide: {
			input: function(){
				module.verbose('Modifying <input> z-index to be unselectable');
				input.classList.add(className.hidden);
			}
		},
		show: {
			input: function(){
				module.verbose('Modifying <input> z-index to be selectable');
				input.classList.remove(className.hidden);
			}
		},
		observeChanges: function(){
			if('MutationObserver' in window){
				observer = new MutationObserver(function(mutations){
					module.debug('DOM tree modified, updating selector cache');
					module.refresh();
				});
				observer.observe(element, {
					childList : true,
					subtree   : true
				});
				module.debug('Setting up mutation observer', observer);
			}
		},
		attachEvents: function(selector, event){
			var elems = document.querySelectorAll(selector);
			
			event = typeof module[event] == "function" ?
						module[event] : module.toggle;
			
			if(elems.length > 0){
				module.debug('Attaching checkbox events to element', selector, event);
				elems.forEach(function(elem){
					elem.onclick = event;
				});
			} else {
				module.error(error.notFound);
			}
		},
		event: {
			click: function(event){
				if(ui.checkTarget(event, selector.input)){
					module.verbose('Using default check action on initialized checkbox');
					return;
				}
				if(ui.checkTarget(event, selector.link)){
					module.debug('Clicking link inside checkbox, skipping toggle');
					return;
				}
				module.toggle();
				input.focus();
				event.preventDefault();
			},
			keydown: function(event){
				var key     = event.which,
					keyCode = {
						enter  : 13,
						space  : 32,
						escape : 27
					};

				if(key == keyCode.escape){
					module.verbose('Escape key pressed blurring field');
					input.blur();
					shortcutPressed = true;
				}
				else if(!event.ctrlKey && ( key == keyCode.space || key == keyCode.enter) ){
					module.verbose('Enter/space key pressed, toggling checkbox');
					module.toggle();
					shortcutPressed = true;
				}
				else {
					shortcutPressed = false;
				}
			},
			keyup: function(event){
				if(shortcutPressed){
					event.preventDefault();
				}
			}
		},
		check: function(){
			if( !module.should.allowCheck() ){
				return;
			}
			module.debug('Checking checkbox', input);
			module.set.checked();
			if( !module.should.ignoreCallbacks() ){
				settings.onChecked.call(input);
				settings.onChange.call(input);
			}
		},
		uncheck: function(){
			if( !module.should.allowUncheck() ){
				return;
			}
			module.debug('Unchecking checkbox');
			module.set.unchecked();
			if( !module.should.ignoreCallbacks() ){
				settings.onUnchecked.call(input);
				settings.onChange.call(input);
			}
		},
		indeterminate: function(){
			if( module.should.allowIndeterminate() ){
				module.debug('Checkbox is already indeterminate');
				return;
			}
			module.debug('Making checkbox indeterminate');
			module.set.indeterminate();
			if( !module.should.ignoreCallbacks() ){
				settings.onIndeterminate.call(input);
				settings.onChange.call(input);
			}
		},
		determinate: function(){
			if( module.should.allowDeterminate() ){
				module.debug('Checkbox is already determinate');
				return;
			}
			module.debug('Making checkbox determinate');
			module.set.determinate();
			if( !module.should.ignoreCallbacks() ){
				settings.onDeterminate.call(input);
				settings.onChange.call(input);
			}
		},
		enable: function(){
			if( module.is.enabled() ){
				module.debug('Checkbox is already enabled');
				return;
			}
			module.debug('Enabling checkbox');
			module.set.enabled();
			settings.onEnable.call(input);
		},
		disable: function(){
			if( module.is.disabled() ){
				module.debug('Checkbox is already disabled');
				return;
			}
			module.debug('Disabling checkbox');
			module.set.disabled();
			settings.onDisable.call(input);
		},
		get: {
			radios: function(){
				var name = module.get.name();
				return document.querySelector('input[name="' + name + '"]').closest(selector.checkbox);
			},
			otherRadios: function(){
				return module.get.radios().not(module);
			},
			name: function(){
				return input.getAttribute('name');
			}
		},
		is: {
			initialLoad: function(){
				return initialLoad;
			},
			radio: function(){
				return (input.classList.contains(className.radio) || input.getAttribute('type') == 'radio');
			},
			indeterminate: function(){
				return input.indeterminate !== undefined && input.indeterminate;
			},
			checked: function(){
				return input.checked !== undefined && input.checked;
			},
			disabled: function(){
				return input.disabled !== undefined && input.disabled;
			},
			enabled: function(){
				return !module.is.disabled();
			},
			determinate: function(){
				return !module.is.indeterminate();
			},
			unchecked: function(){
				return !module.is.checked();
			}
		},
		should: {
			allowCheck: function(){
				if(module.is.determinate() && module.is.checked() && !module.should.forceCallbacks() ){
					module.debug('Should not allow check, checkbox is already checked');
					return false;
				}
				if(settings.beforeChecked.apply(input) === false){
					module.debug('Should not allow check, beforeChecked cancelled');
					return false;
				}
				return true;
			},
			allowUncheck: function(){
				if(module.is.determinate() && module.is.unchecked() && !module.should.forceCallbacks() ){
					module.debug('Should not allow uncheck, checkbox is already unchecked');
					return false;
				}
				if(settings.beforeUnchecked.apply(input) === false){
					module.debug('Should not allow uncheck, beforeUnchecked cancelled');
					return false;
				}
				return true;
			},
			allowIndeterminate: function(){
				if(module.is.indeterminate() && !module.should.forceCallbacks() ){
					module.debug('Should not allow indeterminate, checkbox is already indeterminate');
					return false;
				}
				if(settings.beforeIndeterminate.apply(input) === false){
					module.debug('Should not allow indeterminate, beforeIndeterminate cancelled');
					return false;
				}
				return true;
			},
			allowDeterminate: function(){
				if(module.is.determinate() && !module.should.forceCallbacks() ){
					module.debug('Should not allow determinate, checkbox is already determinate');
					return false;
				}
				if(settings.beforeDeterminate.apply(input) === false){
					module.debug('Should not allow determinate, beforeDeterminate cancelled');
					return false;
				}
				return true;
			},
			forceCallbacks: function(){
				return (module.is.initialLoad() && settings.fireOnInit);
			},
			ignoreCallbacks: function(){
				return (initialLoad && !settings.fireOnInit);
			}
		},
		can: {
			change: function(){
				return !( element.classList.contains(className.disabled) || element.classList.contains(className.readOnly) || input.disabled || input.readonly );
			},
			uncheck: function(){
				return (typeof settings.uncheckable === 'boolean')
					? settings.uncheckable
					: !module.is.radio()
				;
			}
		},
		set: {
			initialLoad: function(){
				initialLoad = true;
			},
			checked: function(){
				module.verbose('Setting class to checked');
				element.classList.remove(className.indeterminate);
				element.classList.add(className.checked);
					
				if( module.is.radio() ){
					module.uncheckOthers();
				}

				if(!module.is.indeterminate() && module.is.checked()){
					module.debug('Input is already checked, skipping input property change');
					return;
				}

				module.verbose('Setting state to checked', input);
				
				input.indeterminate = false;
				input.checked = true;

				module.trigger.change();
			},
			unchecked: function(){
				module.verbose('Removing checked class');

				element.classList.remove(className.indeterminate);
				element.classList.remove(className.checked);

				if(!module.is.indeterminate() &&  module.is.unchecked() ){
					module.debug('Input is already unchecked');
					return;
				}
				module.debug('Setting state to unchecked');
				
				input.indeterminate = false;
				input.checked = false;

				module.trigger.change();
			},
			indeterminate: function(){
				module.verbose('Setting class to indeterminate');
				element.classList.add(className.indeterminate);
				
				if( module.is.indeterminate() ){
					module.debug('Input is already indeterminate, skipping input property change');
					return;
				}
				module.debug('Setting state to indeterminate');
				input.indeterminate = true;
				module.trigger.change();
			},
			determinate: function(){
				module.verbose('Removing indeterminate class');
				element.classList.remove(className.indeterminate);

				if( module.is.determinate() ){
					module.debug('Input is already determinate, skipping input property change');
					return;
				}
				module.debug('Setting state to determinate');
				input.indeterminate = false;
			},
			disabled: function(){
				module.verbose('Setting class to disabled');
				element.classList.add(className.disabled);
		
				if( module.is.disabled() ){
					module.debug('Input is already disabled, skipping input property change');
					return;
				}
				module.debug('Setting state to disabled');
				input.disabled = 'disabled';
				module.trigger.change();
			},
			enabled: function(){
				module.verbose('Removing disabled class');
				element.classList.remove(className.disabled);
				if( module.is.enabled() ){
					module.debug('Input is already enabled, skipping input property change');
					return;
				}
				module.debug('Setting state to enabled');
				input.disabled = false;
				module.trigger.change();
			},
			tabbable: function(){
				module.verbose('Adding tabindex to checkbox');
				if( input.getAttribute('tabindex') === undefined){
					input.setAttribute('tabindex', 0);
				}
			}
		},
		remove: {
			initialLoad: function(){
				initialLoad = false;
			}
		},
		trigger: {
			change: function(){
				var events = document.createEvent('HTMLEvents'),
					inputElement = input[0];
				
				if(inputElement){
					module.verbose('Triggering native change event');
					events.initEvent('change', true, false);
					inputElement.dispatchEvent(events);
				}
			}
		},
		create: {
			label: function(){
				var prev = [];
				
				while(element.previousElementSibling && element.previousElementSibling.matches(selector.label)){
					var n = element.previousElementSibling;
					n.remove();
					input.after(n);
					module.debug('Moving existing label', label);
					return;
				}

				label = document.createElement('label');
				input.after(label);

				module.debug('Creating label', label);
			}
		},
		has: {
			label: function(){
				return (label.length > 0);
			}
		},
		bind: {
			events: function(){
				module.verbose('Attaching checkbox events');

				function check(func){
					return function(event){
						if(ui.checkTarget(event, selector.input)){
							func();
						}
					}
				};

				element.onclick = module.event.click;
				element.onkeydown = check(module.event.keydown);
				element.onkeyup = check(module.event.keyup);
			}
		},
		unbind: {
			events: function(){
				module.debug('Removing events');
				element.onclick = undefined;
				element.onkeydown = undefined;
				element.onkeyup = undefined;
			}
		},
		uncheckOthers: function(){
			var radios = module.get.otherRadios();
			module.debug('Unchecking other radios', radios);
			radios.classList.remove(className.checked);
		},
		toggle: function(){
			if( !module.can.change() ){
				if(!module.is.radio()){
					module.debug('Checkbox is read-only or disabled, ignoring toggle');
				}
				return;
			}
			if( module.is.indeterminate() || module.is.unchecked() ){
				module.debug('Currently unchecked');
				module.check();
			}
			else if( module.is.checked() && module.can.uncheck() ){
				module.debug('Currently checked');
				module.uncheck();
			}
		}
	};
	
	return module;
};

ui.checkbox.settings = {
	silent: false,
	debug: false,
	verbose: true,
	performance: true,
	uncheckable: 'auto',
	fireOnInit: false,
	onChange: function(){},
	beforeChecked: function(){},
	beforeUnchecked: function(){},
	beforeDeterminate: function(){},
	beforeIndeterminate: function(){},
	onChecked: function(){},
	onUnchecked: function(){},
	onDeterminate: function(){},
	onIndeterminate: function(){},
	onEnable: function(){},
	onDisable: function(){},
	error: {
		method: 'The method you called is not defined'
	},
	selector : {
		checkbox: '.ui.checkbox',
		label: 'label, .box',
		input: 'input[type="checkbox"], input[type="radio"]',
		link: 'a[href]'
	},
	className: {
		checked: 'checked',
		indeterminate: 'indeterminate',
		disabled: 'disabled',
		hidden: 'hidden',
		radio: 'radio',
		readOnly: 'read-only'
	}
};
