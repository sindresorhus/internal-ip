import {isIPv4, isIPv6} from 'net';
import test from 'ava';
import internalIp from '.';

// Travis VMs don't have IPs on their interfaces.
// https://docs.travis-ci.com/user/ci-environment/#Networking
const isCI = Boolean(process.env.CI);

test('IPv6', async t => {
	const ip = await internalIp.v6();
	if (isCI) {
		t.is(ip, undefined);
	} else {
		t.true(isIPv6(ip));
	}
});

test('IPv4', async t => {
	const ip = await internalIp.v4();
	if (isCI) {
		t.is(ip, undefined);
	} else {
		t.true(isIPv4(ip));
	}
});

test('synchronous IPv6', t => {
	const ip = internalIp.v6.sync();
	if (isCI) {
		t.is(ip, undefined);
	} else {
		t.true(isIPv6(ip));
	}
});

test('synchronous IPv4', t => {
	const ip = internalIp.v4.sync();
	if (isCI) {
		t.is(ip, undefined);
	} else {
		t.true(isIPv4(ip));
	}
});
