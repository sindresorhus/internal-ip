'use strict';
const defaultGateway = require('default-gateway');
const {networkInterfaces} = require('os');
const {parse, parseCIDR} = require('ipaddr.js');

function findIp(gateway) {
	const gatewayIp = parse(gateway);

	// Look for the matching interface in all local interfaces
	for (const addrs of Object.values(networkInterfaces())) {
		for (const addr of addrs) {
			const prefix = parse(addr.netmask).prefixLengthFromSubnetMask();
			const net = parseCIDR(`${addr.address}/${prefix}`);

			if (net[0] && net[0].kind() === gatewayIp.kind() && gatewayIp.match(net)) {
				return net[0].toString();
			}
		}
	}
}

async function promise(family) {
	try {
		const {gateway} = await defaultGateway[family]();
		return findIp(gateway);
	} catch {}
}

function sync(family) {
	try {
		const {gateway} = defaultGateway[family].sync();
		return findIp(gateway);
	} catch {}
}

const internalIp = {};
internalIp.v6 = () => promise('v6');
internalIp.v4 = () => promise('v4');
internalIp.v6.sync = () => sync('v6');
internalIp.v4.sync = () => sync('v4');

module.exports = internalIp;
