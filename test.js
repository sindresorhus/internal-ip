import {isIPv4, isIPv6} from 'net';
import test from 'ava';
import m from '.';

// Skip tests on Travis as their VMs don't have IPs on their interfaces
// https://docs.travis-ci.com/user/ci-environment/#Networking
if (!process.env.CI) {
	test('IPv6', async t => {
		t.true(isIPv6(await m.v6()));
	});

	test('IPv4', async t => {
		t.true(isIPv4(await m.v4()));
	});

	test('synchronous IPv6', t => {
		t.true(isIPv6(m.v6.sync()));
	});

	test('synchronous IPv4', t => {
		t.true(isIPv4(m.v4.sync()));
	});
}
