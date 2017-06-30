import {isIPv4, isIPv6} from 'net';
import test from 'ava';
import m from '.';

test('IPv6', async t => {
	t.true(isIPv6(await m.v6()));
});

test('IPv4', async t => {
	t.true(isIPv4(await m.v4()));
});
