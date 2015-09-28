'use strict';
var test = require('ava');
var isIp = require('is-ip');
var internalIp = require('./');

test('main', function (t) {
	t.assert(isIp(internalIp()));
	t.end();
});

test('IPv4', function (t) {
	t.assert(isIp(internalIp.v4()));
	t.end();
});

test('IPv6', function (t) {
	t.assert(isIp(internalIp.v6()));
	t.end();
});
