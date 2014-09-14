#!/usr/bin/env node
'use strict';
var pkg = require('./package.json');
var internalIp = require('./');
var argv = process.argv.slice(2);

function help() {
	console.log([
		'',
		'  ' + pkg.description,
		'',
		'  Example',
		'    $ internal-ip',
		'    192.168.0.123'
	].join('\n'));
}

if (argv.indexOf('--help') !== -1) {
	help();
	return;
}

if (argv.indexOf('--version') !== -1) {
	console.log(pkg.version);
	return;
}

console.log(internalIp());
