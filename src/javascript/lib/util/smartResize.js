var $ = require('jquery');

function smartResize(callback, options) {
	options = options || {};
	$(window).on('resize', getResizeHandler(callback, options));
}

function getResizeHandler(callback, options) {
	var smartTimeout;

	return function(event) {
		if (smartTimeout) {
			clearTimeout(smartTimeout);
		}
		var SMART_DELAY = options.delay || 300;
		var context = options.context || window;
		var args = arguments;

		smartTimeout = setTimeout(function() {
			clearTimeout(smartTimeout);
			callback.apply(context, args);
		}, SMART_DELAY);
	};
}

module.exports = smartResize;
