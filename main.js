/*global require, module*/
'use strict';

var ContextualHelp = require('./src/js/ContextualHelp'),
	Drawer = require('o-drawer');


var startContextualHelp = function () {

	// remove handler
	document.removeEventListener('o.DOMContentLoaded', startContextualHelp);

	// add drawer div to page
	var container = document.createElement('div');
	container.id = 'o-contextual-help-drawer';
	container.setAttribute('data-o-component', 'o-drawer');
	container.setAttribute('aria-role', 'menu');
	container.setAttribute('role', 'menu');
	container.classList.add('o-drawer-right', 'o-drawer-animated', 'o-contextual-help__drawer');
	document.getElementsByTagName("body")[0].appendChild(container);

	// init help inside of drawer
	var help = new ContextualHelp(container);

	// init Drawer on container
	var drawer = new Drawer(container);

	// bind drawer open / close events to ContextualHelp events for open
	help.open = function(){ drawer.open(); };
	help.close = function(){ drawer.close(); };
	help.toggle = function(){ drawer.toggle(); };

};

document.addEventListener('o.DOMContentLoaded', startContextualHelp);

module.exports = ContextualHelp;
