'use strict';

var XHR = require('o-xhr'),
	Collapse = require('o-collapse');

// setup templates
var helpTemplate = requireText('../html/helpT.html'),
	topicExcerptTemplate = requireText('../html/excerptT.html'),
	topicTemplate = requireText('../html/contentT.html');


function ContextualHelp(el){

	var me = this,
		baseURL = 'https://raw.githubusercontent.com/Pearson-Higher-Ed/help-content/master/out/';

	function getConfig(){
		var conf = {},
			configEl = document.querySelector('[data-o-contextual-help-config]');
		if (!configEl){
			return conf;
		}
		try{
			conf = JSON.parse(configEl.textContent);
		}
		catch(e){
			conf = {};
			throw new Error('Unable to parse configuration object: invalid JSON');
		}
		return conf;
	}

	this.fetchHelpContent = function(contentId, cb){
		cb = cb || function(){};
		if(contentId.replace(/\s/,'') === ''){
			cb("no content ID issued");
		}
		if(me.cache && me.cache[contentId]){
			cb(null, me.cache[contentId]);
			return;
		}
		// get it from github
		XHR({
			url: baseURL + me.lang + '/' + contentId + '.json',
			onSuccess: function (req){
				var data = JSON.parse(req.responseText);
				// if found, stick in cache
				me.cache[contentId] = data;
				// return in cb(null, content)
				cb(null, data);
			},
			onError: function (req) {
				// retry as en-us
				if(me.lang !== me.defaultLang){
					var tempLang = me.defaultLang;
					XHR({
						url: baseURL + '/' + tempLang + '/' + contentId + '.json',
						onSuccess: function(reqInner){
							var data = JSON.parse(reqInner.responseText);
							me.cache[contentId] = data;
							cb(null, data);
						},
						onError: function(reqInner){
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
	el.querySelector('#contextual-help-close-content').onclick = function(){
		me._el.classList.remove('o-contextual-help__detail--visible');
		return false;
	};
	// establish configuration
	var conf = getConfig();
	if(conf && conf.helpTopics && conf.helpTopics.length > 0){
		this.topics = conf.helpTopics;
	}
	// populate excerpts into topic list
	this.populateFromList = function(list, cb){
		cb = cb || function(){};
		if(list.length > 0){
			var item = list.splice(0,1)[0];
			me.fetchHelpContent(item, function(err, cData){
				if(!cData || err){
					if(list.length > 0){
						me.populateFromList(list, cb);
					}
				}
				var nExcerpt = document.createElement('div');
				nExcerpt.innerHTML = topicExcerptTemplate;
				var title = nExcerpt.querySelector('h4 a');
				title.innerHTML = cData.title;
				title.onclick = function(){
					me.openHelpTopic(item);
				};
				nExcerpt.querySelector('p').innerHTML = cData.excerpt;
				me._el.querySelector('.o-contextual-help__excerpt-list').appendChild(nExcerpt);
				if(list.length > 0){
					me.populateFromList(list, cb);
				}
			});
		}
	};

	this.init = function(){

		// remove everything
		this._el.querySelector('.o-contextual-help__excerpt-list').innerHTML = '';
		// populate from list
		var theList = this.topics.slice(0);
		this.populateFromList(theList);
		return;
	};

	// bind header event for show / hide
	var eventEl = document.querySelector('header.o-app-header');
	if(eventEl){
		eventEl.addEventListener('oAppHeader.help.toggle', function(){
			if(me.toggle){ me.toggle(); }
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

	var contentTarget = this._el.querySelector('#o-contextual-help-topic-content-target');
	if(!topic){
		contentTarget.innerHTML = '';
	}
	// fetch it and put the content in the content target
	if(topic){
		this.fetchHelpContent(topic, function(err, cData){
			if(err){
				throw err;
			}
			if(!cData){
				return;
			}
			contentTarget.innerHTML = topicTemplate;
			contentTarget.querySelector('h4').innerHTML = cData.title;
			var contentCT = contentTarget.querySelector('div');
			contentCT.innerHTML = cData.content;
			Collapse.init(contentCT);
		});
	}
	this._el.classList.add('o-contextual-help__detail--visible');
	if(this.open){
		this.open();
	}
};

/*
	takes string topic or array of strings
	adds these topics to the topic list
*/
ContextualHelp.prototype.addTopics = function(topic){
	if(typeof topic === 'string'){
		topic = [topic];
	}
	for(var i=0, l=topic.length; i<l; i++){
		var t = topic[i];
		if(this.topics.indexOf(t) < 0){
			this.topics.push(t);
		}
	}
	this.init();
};
ContextualHelp.prototype.removeTopics = function(topic){
	if(typeof topic === 'string'){
		topic = [topic];
	}
	for(var i=0, l=topic.length; i<l; i++){
		var t = topic[i];
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
	return;
};

/*
	returns list of all topics corruntly in use
*/
ContextualHelp.prototype.getTopics = function(){
	return this.topics;
};

module.exports = ContextualHelp;
