<p align="center">
  <a href="https://react.semantic-ui.com">
    <img height="200" src="https://raw.githubusercontent.com/morganbarrett/Vanilla-Semantic-UI/master/logo.png">
  </a>
</p>

<h1 align="center">
	Vanilla Semantic UI
</h1>

Vanilla Semantic UI removes the jQuery dependency from [Semantic](http://www.semantic-ui.com), a UI framework designed for theming.

### Features
* 50+ UI elements
* 3000+ CSS variables
* 3 Levels of variable inheritance (similar to SublimeText)
* Built with EM values for responsive design
* Flexbox friendly

Semantic allows developers to build beautiful websites fast, with **concise HTML**, **intuitive javascript**, and **simplified debugging**, helping make front-end development a delightful experience. Semantic is responsively designed allowing your website to scale on multiple devices. 

Vanilla Semantic UI is not yet production ready, but will soon have all the power of Semantic UI without jQuery as a dependency.

### Browser Support
* Last 2 Versions FF, Chrome, Safari Mac
* IE 11+
* Android 4.4+, Chrome for Android 44+
* iOS Safari 7+
* Microsoft Edge 12+

Although some components will work in IE9, [grids](http://semantic-ui.com/collections/grid.html) and other [flexbox](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Flexible_boxes) components are not supported by IE9 and may not appear correctly.

## Installation
### NPM
```console
$ npm i vanilla-semantic-ui
```
### Yarn
```console
$ yarn add vanilla-semantic-ui
```
### CDN
```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/vanilla-semantic-ui@0.0.1/dist/vanilla-semantic.min.css">

<script src="https://cdn.jsdelivr.net/npm/vanilla-semantic-ui@0.0.1/dist/vanilla-semantic.min.js"></script>
```

## Usage
#### Old (jQuery) way
```javascript
$('.star.rating').rating({
	initialRating: 3
});
```
#### New (Vanilla) way
```javascript
ui('.star.rating').rating({
	initialRating: 3
});
```

## To Do
### Behaviors
* api.js
* form.js
* visibility.js

### Globals
* site.js

### Modules
* ~~accordion.js~~ ✓
* ~~checkbox.js~~ ✓
* ~~dimmer.js~~ ✓
* dropdown.js
* ~~embed.js~~ ✓
* modal.js
* ~~nag.js~~ ✓
* popup.js
* ~~progress.js~~ ✓
* ~~rating.js~~ ✓
* search.js
* shape.js
* sidebar.js
* sticky.js
* tab.js
* ~~transition.js~~ ✓
