/*global describe, it*/
'use strict';

var expect = require('expect.js');

var ContextualHelp = require('./../src/js/ContextualHelp');

describe('ContextualHelp', function() {

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
