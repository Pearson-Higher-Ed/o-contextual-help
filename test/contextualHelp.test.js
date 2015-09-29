/*global describe, it*/
'use strict';

var expect = require('expect.js');

var ContextualHelp = require('./../src/js/ContextualHelp');

describe('ContextualHelp Init', function() {

	it('should initialise', function() {
		var ch = new ContextualHelp(document.body);
		expect(ch).to.not.be(null);
	});

	it('should return itself', function() {
		var ch = new ContextualHelp(document.body);
		expect(ch).to.have.property('openHelpTopic');
	});

	it('should attach itself to el as .oContextualHelp', function() {
		new ContextualHelp(document.body);
		expect(document.body).to.have.property('oContextualHelp');
	});
});

describe('ContextualHelp config loader (no config)', function() {

	it('should not have topics if there is no config', function() {
		var ch = new ContextualHelp(document.body);
		expect(ch.topics).to.be.an('array');
		expect(ch.topics).to.have.length(0);
	});

});

describe('ContextualHelp config loader (with config)', function() {

	it('should have topics if there IS a valid config', function() {
		var demoConf = {
			"helpTopics": [
				"console/student/freetrial",
				"console/student/studentresources",
				"console/student/contactsupport"
			]
		};
		document.body.innerHTML = '';
		var confEl = document.createElement('script');
		confEl.setAttribute('type', 'application/json');
		confEl.setAttribute('data-o-contextual-help-config');
		confEl.innerText = JSON.stringify(demoConf);
		document.body.appendChild(confEl);

		var ct = document.createElement('div');
		document.body.appendChild(ct);

		var ch = new ContextualHelp(ct);
		expect(ch.topics).to.be.an('array');
		expect(ch.topics).to.have.length(3);
	});
});

describe('ContextualHelp direct loader', function() {
	it('should open specific contents', function() {
		var ch = new ContextualHelp(document.body);
		var testCache = {
			title: 'test content',
			excerpt: 'lorem ipsum',
			content: '<p>Lorem Ipsum dolar sit amet.</p>'
		};
		ch.cache = {
			test: testCache
		};
		ch.openHelpTopic('test');
		var titleText = document.querySelector('#o-contextual-help-topic-content-target h4').innerText;
		expect(titleText).to.be(testCache.title);
		var content = document.querySelector('#o-contextual-help-topic-content-target div').innerHTML;
		expect(content).to.be(testCache.content);
	});
});

describe('ContextualHelp add/remove topics', function() {
	var fakeHelp = {
		title: 'Fake Content',
		excerpt: 'This is the fake content for the test.',
		content: '<p>This is fake.</p>'
	};
	var fakeHelp2 = {
		title: 'Fake Content 2',
		excerpt: 'This is the fake content for the test, second.',
		content: '<p>This is also fake.</p>'
	};
	it('should add topics to the cache', function(){

		var ch = new ContextualHelp(document.body);
		ch.cache = {
			fake: fakeHelp
		};
		ch.addTopics('fake');
		expect(ch.topics).to.contain('fake');
		ch.openHelpTopic('fake');
		var titleText = document.querySelector('#o-contextual-help-topic-content-target h4').innerText;
		expect(titleText).to.be(fakeHelp.title);
		var content = document.querySelector('#o-contextual-help-topic-content-target div').innerHTML;
		expect(content).to.be(fakeHelp.content);
	});

	it('removeAllTopics() should empty the topics list', function(){
		var ch = new ContextualHelp(document.body);
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

	it('removeTopics() should remove topic from list by name', function(){
		var ch = new ContextualHelp(document.body);
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

describe('setLanguage()', function(){
	it('should change the language code', function(){
		var ch = new ContextualHelp(document.body);
		expect(ch.lang).to.be('en-us');
		ch.setLanguage('ru');
		expect(ch.lang).to.be('ru');
	});
});

describe('side effects', function(){
	it('should clear out the content if no id is passed to open', function(){
		var ch = new ContextualHelp(document.body);
		ch.openHelpTopic();
		var newContent = ch._el.querySelector('#o-contextual-help-topic-content-target').innerHTML;
		expect(newContent).to.be('');
	});
});
