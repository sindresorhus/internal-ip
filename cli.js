#!/usr/bin/env node
'use strict';
var meow = require('meow');
var internalIp = require('./');

meow({
	help: [
		'Example',
		'  $ internal-ip',
		'  192.168.0.123'
	].join('\n')
});

console.log(internalIp());
