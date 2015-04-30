var through = require('through2');
var path = require('path');

module.exports = function (file, config) {

	var prepend = null;

	if(config.addTemplateLog)
		if(file.indexOf('.jade', file.length - '.jade'.length) !== -1) {
			prepend = '- console.debug("TEMPLATE RENDERING");\n'
		}

	var lineNum = 1;

	var filename = file;

	if(config.basePath) {
		filename = file.substring(file.indexOf(config.basePath) + config.basePath.length);
	}

	return through(function (buf, enc, next) {

		var chunk = buf.toString('utf8');

		var result = [];

		if(prepend) {
			chunk = prepend + chunk;
			prepend = null;
		}

		chunk.split('\n').forEach(function (line) {

			var regex = /console\.(log|warn|error|debug)\(/g;

			var parsed = regex.exec(line);

			var logExtra = '"[' + filename + ':' + (lineNum++) + ']"';
			if(parsed) {
				if(config.includeLevel) {
					logExtra = '"[' + parsed[1].toUpperCase() + ' ' + filename + ':' + (lineNum++) + ']"';
				}
				
				line = line.replace(regex, 'console.' + parsed[1] + '(' + logExtra + ',');
			}

			result.push(line);
		}, this);

		this.push(result.join('\n'));

		next();

	});

};
