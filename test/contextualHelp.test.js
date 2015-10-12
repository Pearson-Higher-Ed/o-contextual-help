/*global describe, it*/

import expect from 'expect.js';
import ContextualHelp from '../src/js/ContextualHelp';

describe('ContextualHelp Init', () => {

	it('should initialise', () => {
		const ch = new ContextualHelp(document.body);
		expect(ch).to.not.be(null);
	});

	it('should return itself', () => {
		const ch = new ContextualHelp(document.body);
		expect(ch).to.have.property('openHelpTopic');
	});

	it('should attach itself to el as .oContextualHelp', () => {
		new ContextualHelp(document.body);
		expect(document.body).to.have.property('oContextualHelp');
	});
});

describe('ContextualHelp config loader (no config)', () => {

	it('should not have topics if there is no config', () => {
		const ch = new ContextualHelp(document.body);
		expect(ch.topics).to.be.an('array');
		expect(ch.topics).to.have.length(0);
	});

});

describe('ContextualHelp config loader (with config)', () => {

	it('should have topics if there IS a valid config', () => {
		const demoConf = {
			"helpTopics": [
				"console/student/freetrial",
				"console/student/studentresources",
				"console/student/contactsupport"
			]
		};
		document.body.innerHTML = '';
		const confEl = document.createElement('script');
		confEl.setAttribute('type', 'application/json');
		confEl.setAttribute('data-o-contextual-help-config');
		confEl.innerText = JSON.stringify(demoConf);
		document.body.appendChild(confEl);

		const ct = document.createElement('div');
		document.body.appendChild(ct);

		const ch = new ContextualHelp(ct);
		expect(ch.topics).to.be.an('array');
		expect(ch.topics).to.have.length(3);
	});
});

describe('ContextualHelp direct loader', () => {
	it('should open specific contents', () => {
		const ch = new ContextualHelp(document.body);
		const testCache = {
			title: 'test content',
			excerpt: 'lorem ipsum',
			content: '<p>Lorem Ipsum dolar sit amet.</p>'
		};
		ch.cache = {
			test: testCache
		};
		ch.openHelpTopic('test');
		const titleText = document.querySelector('#o-contextual-help-topic-content-target h4').innerText;
		expect(titleText).to.be(testCache.title);
		const content = document.querySelector('#o-contextual-help-topic-content-target div').innerHTML;
		expect(content).to.be(testCache.content);
	});
});

describe('ContextualHelp add/remove topics', () => {
	const fakeHelp = {
		title: 'Fake Content',
		excerpt: 'This is the fake content for the test.',
		content: '<p>This is fake.</p>'
	};
	const fakeHelp2 = {
		title: 'Fake Content 2',
		excerpt: 'This is the fake content for the test, second.',
		content: '<p>This is also fake.</p>'
	};
	it('should add topics to the cache', () => {

		const ch = new ContextualHelp(document.body);
		ch.cache = {
			fake: fakeHelp
		};
		ch.addTopics('fake');
		expect(ch.topics).to.contain('fake');
		ch.openHelpTopic('fake');
		const titleText = document.querySelector('#o-contextual-help-topic-content-target h4').innerText;
		expect(titleText).to.be(fakeHelp.title);
		const content = document.querySelector('#o-contextual-help-topic-content-target div').innerHTML;
		expect(content).to.be(fakeHelp.content);
	});

	it('removeAllTopics() should empty the topics list', () => {
		const ch = new ContextualHelp(document.body);
		ch.cache = {
			fake: fakeHelp,
			fake2: fakeHelp2
		};
		ch.addTopics(['fake', 'fake2']);
		expect(ch.topics).to.contain('fake');
		expect(ch.topics).to.contain('fake2');
		ch.removeAllTopics();
		expect(ch.topics).to.have.length(0);
	});

	it('removeTopics() should remove topic from list by name', () => {
		const ch = new ContextualHelp(document.body);
		ch.cache = {
			fake: fakeHelp,
			fake2: fakeHelp2
		};
		ch.addTopics(['fake', 'fake2']);
		expect(ch.topics).to.contain('fake');
		expect(ch.topics).to.contain('fake2');
		ch.removeTopics('fake');
		expect(ch.topics).to.have.length(1);
		expect(ch.topics).to.contain('fake2');
	});
});

describe('setLanguage()', () => {
	it('should change the language code', () => {
		const ch = new ContextualHelp(document.body);
		expect(ch.lang).to.be('en-us');
		ch.setLanguage('ru');
		expect(ch.lang).to.be('ru');
	});
});

describe('side effects', () => {
	it('should clear out the content if no id is passed to open', () => {
		const ch = new ContextualHelp(document.body);
		ch.openHelpTopic();
		const newContent = ch._el.querySelector('#o-contextual-help-topic-content-target').innerHTML;
		expect(newContent).to.be('');
	});
});
