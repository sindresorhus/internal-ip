'use strict';
const os = require('os');
const defaultNetwork = require('default-network');

function internalIp(family) {
	return new Promise(function (resolve, reject) {
		defaultNetwork.collect(function (err, interfaces) {
			if (err) {
				return reject(err);
			}

			if (!interfaces || !Object.keys(interfaces).length) {
				return reject(new Error('No interfaces found'));
			}

			const foundInterface = Object.keys(interfaces).find(intf => {
				return interfaces[intf].find(addr => {
					return addr.family === family ? intf : false;
				});
			});

			if (!foundInterface) {
				return reject(new Error('No matching interface found for family ' + family));
			}

			const addresses = os.networkInterfaces()[foundInterface];
			const networkInterface = addresses.find(address => address.family === family);

			if (!networkInterface || !networkInterface.address) {
				return reject(new Error('Interface ' + foundInterface + 'not found in os.networkInterfaces()'));
			}

			resolve(networkInterface.address);
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
