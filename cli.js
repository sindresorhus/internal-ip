#!/usr/bin/env node
'use strict';
const meow = require('meow');
const internalIp = require('./');

const cli = meow({
	help: [
		'Usage',
		'  $ internal-ip',
		'',
		'Options',
		'  -4, --ipv4  Return the IPv4 address (default)',
		'  -6, --ipv6  Return the IPv6 address',
		'',
		'Examples',
		'  $ internal-ip',
		'  192.168.0.123',
		'  $ internal-ip --ipv6',
		'  fe80::200:f8ff:fe21:67cf'
	]
}, {
	alias: {
		4: 'ipv4',
		6: 'ipv6'
	}
});

const fn = cli.flags.ipv4 ? 'v4' : cli.flags.ipv6 ? 'v6' : 'v4';
internalIp[fn]().then((err, ip) => {
	console[err ? 'error' : 'log'](err || ip);
	process.exit(err ? 1 : 0);
});
