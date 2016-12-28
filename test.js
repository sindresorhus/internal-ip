import {isIPv4, isIPv6} from 'net';
import test from 'ava';
import m from './';

// Skip IP tests on Travis because their VMs do not have addresses assigned.
// See https://docs.travis-ci.com/user/ci-environment/#Networking

test('main', async t => {
	let result;
	try {
		result = await m();
	} catch (err) {
		if (process.env.TRAVIS === 'true') {
			return t.true(err.message === 'No interfaces found');
		}
	}

	t.true(isIPv4(result));
});

test('IPv4', async t => {
	let result;
	try {
		result = await m.v4();
	} catch (err) {
		if (process.env.TRAVIS === 'true') {
			return t.true(err.message === 'No interfaces found');
		}
	}

	t.true(isIPv4(result));
});

test('IPv6', async t => {
	let result;
	try {
		result = await m.v6();
	} catch (err) {
		if (process.env.TRAVIS === 'true') {
			return t.true(err.message === 'No interfaces found');
		}
	}

	t.true(isIPv6(result));
});
