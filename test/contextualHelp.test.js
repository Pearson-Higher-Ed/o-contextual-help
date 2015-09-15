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
		}
		ch.cache = {
			test: testCache
		}
		ch.openHelpTopic('test');
		var titleText = document.querySelector('#o-contextual-help-topic-content-target h4').innerText;
		expect(titleText).to.be(testCache.title);
		var content = document.querySelector('#o-contextual-help-topic-content-target div').innerHTML;
		expect(content).to.be(testCache.content);
	});
});

describe('ContextualHelp add/remove topics', function() {
	// this needs some thought on mocking the test before impl
});
