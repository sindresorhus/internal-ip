import {isIPv4, isIPv6} from 'node:net';
import process from 'node:process';
import test from 'ava';
import {internalIpV6, internalIpV4, internalIpV6Sync, internalIpV4Sync} from './index.js';

const isCI = Boolean(process.env.CI);

test('IPv6 - async', async t => {
	const ip = await internalIpV6();
	if (isCI) {
		t.is(ip, undefined);
	} else {
		t.true(isIPv6(ip));
	}
});

test('IPv4 - async', async t => {
	const ip = await internalIpV4();
	t.true(isIPv4(ip));
});

test('IPv6 - sync', t => {
	const ip = internalIpV6Sync();
	if (isCI) {
		t.is(ip, undefined);
	} else {
		t.true(isIPv6(ip));
	}
});

test('IPv4 - sync', t => {
	const ip = internalIpV4Sync();
	t.true(isIPv4(ip));
});
