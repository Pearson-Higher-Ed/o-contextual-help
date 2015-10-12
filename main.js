import ContextualHelp from './src/js/ContextualHelp';
import Drawer from 'o-drawer';

export default ContextualHelp;

const startContextualHelp = () => {

	// remove handler
	document.removeEventListener('o.DOMContentLoaded', startContextualHelp);

	// add drawer div to page
	const container = document.createElement('div');
	container.id = 'o-contextual-help-drawer';
	container.setAttribute('data-o-component', 'o-drawer');
	container.setAttribute('aria-role', 'menu');
	container.setAttribute('role', 'menu');
	container.classList.add('o-drawer-right', 'o-drawer-animated', 'o-contextual-help__drawer');
	document.getElementsByTagName('body')[0].appendChild(container);

	// init help inside of drawer
	const help = new ContextualHelp(container);

	// init Drawer on container
	const drawer = new Drawer(container);

	// bind drawer open / close events to ContextualHelp events for open
	help.open = () => drawer.open();
	help.close = () => drawer.close();
	help.toggle = () => drawer.toggle();

};

document.addEventListener('o.DOMContentLoaded', startContextualHelp);
