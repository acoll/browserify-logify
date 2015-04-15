var through = require('through2');
var path = require('path');

module.exports = function (file) {

	var lineNum = 1;

	return through(function (buf, enc, next) {

		var chunk = buf.toString('utf8');

		var result = [];

		chunk.split('\n').forEach(function (line) {

			logExtra = '"[" + __filename.split("' + (path.sep === '/' ? '/' : '\\') + '").slice(3).join("/") + ":' + (lineNum++) + ']"';

			var newLine = line.replace(/console\.log\(/g, 'console.log(' + logExtra + ',');
			result.push(newLine);
		}, this);

		this.push(result.join('\n'));

		next();

	});

};