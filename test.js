import {isIPv4, isIPv6} from 'net';
import test from 'ava';
import m from './';

test('main', async t => {
	t.true(isIPv4(await m()));
});

test('IPv4', async t => {
	t.true(isIPv4(await m.v4()));
});

test('IPv6', async t => {
	t.true(isIPv6(await m.v6()));
});
