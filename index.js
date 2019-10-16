'use strict';
const os = require('os');
const defaultGateway = require('default-gateway');
const ipaddr = require('ipaddr.js');

function findIp(gateway) {
	const interfaces = os.networkInterfaces();
	const gatewayIp = ipaddr.parse(gateway);
	let ip;

	// Look for the matching interface in all local interfaces
	Object.keys(interfaces).some(name => {
		return interfaces[name].some(addr => {
			const prefix = ipaddr.parse(addr.netmask).prefixLengthFromSubnetMask();
			const net = ipaddr.parseCIDR(`${addr.address}/${prefix}`);

			if (net[0] && net[0].kind() === gatewayIp.kind() && gatewayIp.match(net)) {
				ip = net[0].toString();
			}

			return Boolean(ip);
		});
	});

	return ip;
}

async function promise(family) {
	try {
		const result = await defaultGateway[family]();
		return findIp(result.gateway);
	} catch (_) {}
}

function sync(family) {
	try {
		const result = defaultGateway[family].sync();
		return findIp(result.gateway);
	} catch (_) {}
}

const internalIp = {};
internalIp.v6 = () => promise('v6');
internalIp.v4 = () => promise('v4');
internalIp.v6.sync = () => sync('v6');
internalIp.v4.sync = () => sync('v4');

module.exports = internalIp;
