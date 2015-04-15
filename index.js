var through = require('through2');
var path = require('path');

module.exports = function (file, config) {

	// console.log('CONFIG', config.basePath);

	var lineNum = 1;

	return through(function (buf, enc, next) {

		var chunk = buf.toString('utf8');

		var result = [];

		chunk.split('\n').forEach(function (line) {

			logExtra = '"[" + __filename.replace(/\\\\/g, "/").replace("' + config.basePath + '", "") + ":' + (lineNum++) + ']"';

			// console.log('Extra:', logExtra);

			var newLine = line.replace(/console\.log\(/g, 'console.log(' + logExtra + ',');
			result.push(newLine);
		}, this);

		this.push(result.join('\n'));

		next();

	});

};