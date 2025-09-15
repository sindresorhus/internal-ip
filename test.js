import {isIPv4, isIPv6} from 'node:net';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {internalIpV6, internalIpV4, internalIpV6Sync, internalIpV4Sync} from './index.js';

const mockInterfaces = () => ({
	lo0: [
		{cidr: '127.0.0.1/8'},
		{cidr: '::1/128'},
	],
	en0: [
		{cidr: '192.168.1.118/24'},
		{cidr: 'fe80::1/64'},
	],
});

async function withMocks(t, gateway4 = '192.168.1.1', gateway6 = 'fe80::1') {
	t.mock.module('node:os', {
		namedExports: {
			networkInterfaces: mockInterfaces,
		},
	});

	t.mock.module('default-gateway', {
		namedExports: {
			gateway4async: async () => ({gateway: gateway4}),
			gateway4sync: () => ({gateway: gateway4}),
			gateway6async: async () => ({gateway: gateway6}),
			gateway6sync: () => ({gateway: gateway6}),
		},
	});

	return import('./index.js?' + Math.random());
}

test('async IPv4', async () => {
	const ip = await internalIpV4();
	assert.ok(isIPv4(ip));
});

test('async IPv6', async () => {
	const ip = await internalIpV6();
	assert.ok(!ip || isIPv6(ip));
});

test('sync IPv4', () => {
	const ip = internalIpV4Sync();
	assert.ok(isIPv4(ip));
});

test('sync IPv6', () => {
	const ip = internalIpV6Sync();
	assert.ok(!ip || isIPv6(ip));
});

test('mocked IPv4 returns host address not network address', async t => {
	const module = await withMocks(t);
	const ip = await module.internalIpV4();
	assert.strictEqual(ip, '192.168.1.118');
	assert.ok(!ip.endsWith('.0'));
});

test('mocked IPv4 sync', async t => {
	const module = await withMocks(t);
	const ip = module.internalIpV4Sync();
	assert.strictEqual(ip, '192.168.1.118');
});

test('mocked IPv6', async t => {
	const module = await withMocks(t);
	const ip = await module.internalIpV6();
	assert.strictEqual(ip, 'fe80::1');
});

test('mocked IPv6 sync', async t => {
	const module = await withMocks(t);
	const ip = module.internalIpV6Sync();
	assert.strictEqual(ip, 'fe80::1');
});

test('returns undefined when no matching gateway', async t => {
	const module = await withMocks(t, '10.0.0.1');
	const ip = await module.internalIpV4();
	assert.strictEqual(ip, undefined);
});
