'use strict';
var os = require('os');

var type = {
	v4: {
		def: '127.0.0.1',
		family: 'IPv4'
	},
	v6: {
		def: '::1',
		family: 'IPv6'
	}
};

function internalIp(version) {
	var options = type[version];
	var ret;
	var interfaces = os.networkInterfaces();

	Object.keys(interfaces).some(function (el) {
		interfaces[el].some(function (el2) {
			if (!el2.internal && el2.family === options.family) {
				ret = el2.address;
				return true;
			}
		});
		return ret;
	});

	return ret || options.def;
}

function v4() {
	return internalIp('v4');
}

function v6() {
	return internalIp('v6');
}

module.exports = v4;
module.exports.v4 = v4;
module.exports.v6 = v6;
