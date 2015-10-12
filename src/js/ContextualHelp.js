const xhr = require('o-xhr');
const Collapse = require('o-collapse');

// Templates
const helpTemplate = require('text!../html/helpT.html');
const topicExcerptTemplate = require('text!../html/excerptT.html');
const topicTemplate = require('text!../html/contentT.html');

module.exports = ContextualHelp;

function ContextualHelp(el) {
	const baseURL = 'https://raw.githubusercontent.com/Pearson-Higher-Ed/help-content/master/out/';

	function getConfig() {
		let conf = {};
		const configEl = document.querySelector('[data-o-contextual-help-config]');
		if (!configEl) {
			return conf;
		}
		try {
			conf = JSON.parse(configEl.textContent);
		}
		catch(e) {
			conf = {};
			throw new Error('Unable to parse configuration object: invalid JSON');
		}
		return conf;
	}

	this.fetchHelpContent = (contentId, cb) => {
		cb = cb || function() {};
		if (contentId.replace(/\s/,'') === '') {
			cb('no content ID issued');
		}
		if (this.cache && this.cache[contentId]) {
			cb(null, this.cache[contentId]);
			return;
		}
		// get it from github
		xhr({
			url: baseURL + this.lang + '/' + contentId + '.json',
			onSuccess: (req) => {
				const data = JSON.parse(req.responseText);
				// if found, stick in cache
				this.cache[contentId] = data;
				// return in cb(null, content)
				cb(null, data);
			},
			onError: (req) => {
				// retry as en-us
				if(this.lang !== this.defaultLang){
					const tempLang = this.defaultLang;
					xhr({
						url: baseURL + '/' + tempLang + '/' + contentId + '.json',
						onSuccess: (reqInner) => {
							const data = JSON.parse(reqInner.responseText);
							this.cache[contentId] = data;
							cb(null, data);
						},
						onError: (reqInner) => {
							cb(reqInner);
						}
					});
				}
				else{
					cb(req);
				}
			}
		});
	};

	this.defaultLang = 'en-us';
	this.lang = this.defaultLang;
	// figure out what el is and go get it if necessary
	if(el instanceof String){
		el = document.querySelector('#'+el);
	}

	this._el = el;
	// init content cache
	this.cache = {};

	// init topics list
	this.topics = [];


	// add templates to target el
	if(el.nodeType){
		el.innerHTML = helpTemplate;
	}
	// add event helpers for inner templates
	el.querySelector('#contextual-help-close-content').onclick = () => {
		this._el.classList.remove('o-contextual-help__detail--visible');
		return false;
	};
	// establish configuration
	const conf = getConfig();
	if(conf && conf.helpTopics && conf.helpTopics.length > 0){
		this.topics = conf.helpTopics;
	}
	// populate excerpts into topic list
	this.populateFromList = (list, cb) => {
		cb = cb || function(){};
		if(list.length > 0){
			const item = list.splice(0,1)[0];
			this.fetchHelpContent(item, (err, cData) => {
				if(!cData || err){
					if(list.length > 0){
						this.populateFromList(list, cb);
					}
				}
				const nExcerpt = document.createElement('div');
				nExcerpt.innerHTML = topicExcerptTemplate;
				const title = nExcerpt.querySelector('h4 a');
				title.innerHTML = cData.title;
				title.onclick = () => {
					this.openHelpTopic(item);
				};
				nExcerpt.querySelector('p').innerHTML = cData.excerpt;
				this._el.querySelector('.o-contextual-help__excerpt-list').appendChild(nExcerpt);
				if(list.length > 0){
					this.populateFromList(list, cb);
				}
			});
		}
	};

	this.init = function(){

		// remove everything
		this._el.querySelector('.o-contextual-help__excerpt-list').innerHTML = '';
		// populate from list
		const theList = this.topics.slice(0);
		this.populateFromList(theList);
	};

	// bind header event for show / hide
	const eventEl = document.querySelector('header.o-app-header');
	if(eventEl){
		eventEl.addEventListener('oAppHeader.help.toggle', () => {
			if (this.toggle) {
				this.toggle();
			}
		});
	}

	this.init();
	this._el.oContextualHelp = this;
	return this;
}

ContextualHelp.prototype.setLanguage = function(langCode){
	this.lang = langCode;
	this._el.classList.add('o-contextual-help__detail--visible');
};

ContextualHelp.prototype.openHelpTopic = function(topic){

	const contentTarget = this._el.querySelector('#o-contextual-help-topic-content-target');
	if (!topic) {
		contentTarget.innerHTML = '';
	}
	// fetch it and put the content in the content target
	if (topic) {
		this.fetchHelpContent(topic, function(err, cData){
			if(err){
				throw err;
			}
			if(!cData){
				return;
			}
			contentTarget.innerHTML = topicTemplate;
			contentTarget.querySelector('h4').innerHTML = cData.title;
			const contentCT = contentTarget.querySelector('div');
			contentCT.innerHTML = cData.content;
			Collapse.init(contentCT);
		});
	}
	this._el.classList.add('o-contextual-help__detail--visible');
	if (this.open) {
		this.open();
	}
};

/*
	takes string topic or array of strings
	adds these topics to the topic list
*/
ContextualHelp.prototype.addTopics = function(topic){
	if (typeof topic === 'string') {
		topic = [topic];
	}
	for (let i=0, l=topic.length; i<l; i++) {
		const t = topic[i];
		if(this.topics.indexOf(t) < 0){
			this.topics.push(t);
		}
	}
	this.init();
};
ContextualHelp.prototype.removeTopics = function(topic){
	if (typeof topic === 'string') {
		topic = [topic];
	}
	for (let i=0, l=topic.length; i<l; i++) {
		const t = topic[i];
		if(this.topics.indexOf(t) >= 0){
			this.topics.splice(this.topics.indexOf(t), 1);
		}
	}
	this.init();
};

/*
removes all topics from current config
*/
ContextualHelp.prototype.removeAllTopics = function(){
	this.topics = [];
	this.init();
};

/*
	returns list of all topics corruntly in use
*/
ContextualHelp.prototype.getTopics = function(){
	return this.topics;
};

