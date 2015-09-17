# o-contextual-help [![Build Status](https://travis-ci.org/Pearson-Higher-Ed/o-contextual-help.svg?branch=master)](https://travis-ci.org/Pearson-Higher-Ed/o-contextual-help) [![Coverage Status](https://coveralls.io/repos/Pearson-Higher-Ed/o-contextual-help/badge.svg?branch=master&service=github)](https://coveralls.io/github/Pearson-Higher-Ed/o-contextual-help?branch=master)

## Quick start
This module will automatically inject and initialize itself on the page, as a new o-drawer with an ID of 'o-contextual-help-drawer'.  The object itself will then be added on to the same element as .oContextualHelp.  So, to access the object after it's initialized, simply use the following.

```js
document.getElementById('o-contextual-help-drawer').oContextualHelp;
```

## API

O-contextual-help inherits most of it's API from o-drawer.  The 'open', 'close', and 'toggle' methods are for convenience, and literally call the drawer's respective methods on your behalf.

### Methods

`open()`

calls Drawer.open()

`close()`

calls Drawer.close()

`toggle()`

calls Drawer.toggle()

`setLanguage(langCode)`

Sets the internal member variable for use in fetching content.  Default is 'en-us';

`openHelpTopic(topicId)`

Directly opens the help contents to a specific topic.  This will bypass the list and is also used internally to go from the help topic list to the help topic contents.

`addTopics(topic || [topic, topic, ...])`

Add a topic or topics to the internal array of topics to display in the list.

`removeTopics(topic || [topic, topic, ...])`

Remove a topic or topics to the internal array of topics to display in the list.

`removeAllTopics()`

Empty the internal help topic array.

`getTopics()`

Returns the internal help topic array.

### Events

| Event Name							 | Description																				 |
|--------------------------|-----------------------------------------------------|
| oDrawer.open						 | Fires immediately when the `open` method is called. |
| oDrawer.close						| Fires immediately when the `close` method is called. |


```js
document.getElementById('o-contextual-help-drawer').addEventListener('oDrawer.open', function (e) {
  // Do something
});
```

## Accessibility

The module will automatically update `aria-expanded` depending on the state of the target element.

## License

This software is published by Pearson Education under the [MIT license](LICENSE).
