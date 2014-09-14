'use strict';
var test = require('ava');
var isIp = require('is-ip');
var internalIp = require('./');

test(function (t) {
	t.assert(isIp(internalIp()));
	t.end();
});
