var through = require('through2');
var path = require('path');

module.exports = function (file, config) {

	var prepend = null;

	if(config.addTemplateLog)
		if(file.indexOf('.jade', file.length - '.jade'.length) !== -1) {
			prepend = '- console.log("TEMPLATE RENDERING");\n'
		}

	var lineNum = 1;

	return through(function (buf, enc, next) {

		var chunk = buf.toString('utf8');

		var result = [];

		if(prepend) {
			chunk = prepend + chunk;
			prepend = null;
		}

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
