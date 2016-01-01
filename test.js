import test from 'ava';
import isIp from 'is-ip';
import m from './';

test('main', t => {
	t.true(isIp.v4(m()));
});

test('IPv4', t => {
	t.true(isIp.v4(m.v4()));
});

test('IPv6', t => {
	t.true(isIp.v6(m.v6()));
});
