var $ = require('jquery');
module.exports = function(loggerName) {
	function Logger(name) {
		this.name = name;
	}

	console = console || {};

	Logger.prototype = $.extend({}, console, {
		log: function() {
			var args = Array.prototype.slice.call(arguments);
      if (console && console.log) {
				console.log.apply(console, ["'" + this.name + '-' + new Date() + "': "].concat(args));
			}
		}
	});

  return new Logger(loggerName);
};
