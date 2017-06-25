'use strict';

// TODO: Remove dependency on ip module
// https://github.com/whitequark/ipaddr.js/issues/59

const os = require('os');
const defaultGateway = require('default-gateway');
const ip = require('ip');
const ipaddr = require('ipaddr.js');

function internalIp(family) {
	return defaultGateway[family]().then(result => {
		const interfaces = os.networkInterfaces();
		let ret;

		// Remove IPv6 zone index and parse gateway address as a ipaddr.js object
		// https://github.com/whitequark/ipaddr.js/issues/60
		const gatewayIp = ipaddr.parse(result.gateway.replace(/%.+/, ''));

		// Look for the matching interface in all local interfaces
		Object.keys(interfaces).some(name => {
			return interfaces[name].some(addr => {
				const subnet = ip.subnet(addr.address, addr.netmask);
				const net = ipaddr.parseCIDR(addr.address + '/' + subnet.subnetMaskLength);
				if (net[0].kind() === gatewayIp.kind() && gatewayIp.match(net)) {
					ret = net[0].toString();
				}
				return Boolean(ret);
			});
		});

		if (!ret) {
			throw new Error('Unable to determine internal IP');
		}

		return ret;
	});
}

module.exports = () => internalIp('v4');
module.exports.v4 = () => internalIp('v4');
module.exports.v6 = () => internalIp('v6');
