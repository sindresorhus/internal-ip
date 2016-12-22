'use strict';
const os = require('os');
const defaultNetwork = require('default-network');

const def = {
	IPv4: '127.0.0.1',
	IPv6: '::1'
};

function internalIp(family) {
	return new Promise(function (resolve) {
		defaultNetwork.collect(function (err, data) {
			if (err || !data || !Object.keys(data).length) {
				return resolve(def[family]);
			}

			const addresses = os.networkInterfaces()[Object.keys(data)[0]];
			const networkInterface = addresses.find(address => address.family === family);

			if (networkInterface && networkInterface.address) {
				resolve(networkInterface.address);
			} else {
				resolve(def[family]);
			}
		});
	});
}

function v4() {
	return internalIp('IPv4');
}

function v6() {
	return internalIp('IPv6');
}

module.exports = v4;
module.exports.v4 = v4;
module.exports.v6 = v6;
