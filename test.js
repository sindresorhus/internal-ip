import test from 'ava';
import isIp from 'is-ip';
import fn from './';

test('main', t => {
	t.true(isIp.v4(fn()));
	t.end();
});

test('IPv4', t => {
	t.true(isIp.v4(fn.v4()));
	t.end();
});

test('IPv6', t => {
	t.true(isIp.v6(fn.v6()));
	t.end();
});
