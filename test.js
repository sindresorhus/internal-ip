import {isIPv4, isIPv6} from 'net';
import test from 'ava';
import m from '.';

// Travis VMs don't have IPs on their interfaces
// https://docs.travis-ci.com/user/ci-environment/#Networking
const ci = Boolean(process.env.CI);

test('IPv6', async t => {
	const ip = await m.v6();
	if (ci) {
		t.is(ip, null);
	} else {
		t.true(isIPv6(ip));
	}
});

test('IPv4', async t => {
	const ip = await m.v4();
	if (ci) {
		t.is(ip, null);
	} else {
		t.true(isIPv4(ip));
	}
});

test('synchronous IPv6', t => {
	const ip = m.v6.sync();
	if (ci) {
		t.is(ip, null);
	} else {
		t.true(isIPv6(ip));
	}
});

test('synchronous IPv4', t => {
	const ip = m.v4.sync();
	if (ci) {
		t.is(ip, null);
	} else {
		t.true(isIPv4(ip));
	}
});
