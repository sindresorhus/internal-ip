import {isIPv4, isIPv6} from 'node:net';
import {env} from 'node:process';
import {platform} from 'node:os';
import test from 'ava';
import {internalIpV6, internalIpV4, internalIpV6Sync, internalIpV4Sync} from './index.js';

// Only Darwin has IPv6 on GitHub Actions
const canTestV6 = env.CI ? platform() === 'darwin' : true;

test('IPv6 - async', async t => {
	if (!canTestV6) {
		t.true(isIPv6(await internalIpV6()));
	} else {
		t.is(ip, undefined);
	}
});

test('IPv4 - async', async t => {
	t.true(isIPv4(await internalIpV4()));
});

test('IPv6 - sync', t => {
	if (canTestV6) {
		t.true(isIPv6(internalIpV6Sync()));
	} else {
		t.is(ip, undefined);
	}
});

test('IPv4 - sync', t => {
	t.true(isIPv4(internalIpV4Sync()));
});
