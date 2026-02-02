import {isIPv4, isIPv6} from 'node:net';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
	internalIpV6,
	internalIpV4,
	internalIpV6Sync,
	internalIpV4Sync,
} from './index.js';

const mockInterfaces = () => ({
	lo0: [
		{address: '127.0.0.1', family: 'IPv4', internal: true},
		{address: '::1', family: 'IPv6', internal: true},
	],
	en0: [
		{address: '192.168.1.118', family: 'IPv4', internal: false},
		{address: 'fe80::1', family: 'IPv6', internal: false},
	],
});

const mockInterfacesWithGlobalIpv6 = () => ({
	lo0: [
		{address: '127.0.0.1', family: 'IPv4', internal: true},
		{address: '::1', family: 'IPv6', internal: true},
	],
	en0: [
		{address: '192.168.1.118', family: 'IPv4', internal: false},
		{address: 'fe80::1', family: 'IPv6', internal: false},
		{address: '2001:db8::1', family: 'IPv6', internal: false},
	],
});

const mockInterfacesLinkLocalBeforeGlobalIpv6 = () => ({
	utun0: [
		{address: 'fe80::1', family: 'IPv6', internal: false},
	],
	awdl0: [
		{address: 'fe80::2', family: 'IPv6', internal: false},
	],
	en0: [
		{address: '2001:db8::1', family: 'IPv6', internal: false},
	],
});

const mockInterfacesMultiple = () => ({
	lo0: [
		{address: '127.0.0.1', family: 'IPv4', internal: true},
		{address: '::1', family: 'IPv6', internal: true},
	],
	en0: [
		{address: '192.168.1.118', family: 'IPv4', internal: false},
		{address: 'fe80::1', family: 'IPv6', internal: false},
	],
	utun3: [
		{address: '10.8.0.2', family: 'IPv4', internal: false},
		{address: 'fe80::2', family: 'IPv6', internal: false},
	],
});

const mockInterfacesWithIpv4LinkLocal = () => ({
	lo0: [
		{address: '127.0.0.1', family: 'IPv4', internal: true},
		{address: '::1', family: 'IPv6', internal: true},
	],
	en0: [
		{address: '192.168.1.118', family: 'IPv4', internal: false},
	],
	awdl0: [
		{address: '169.254.10.20', family: 'IPv4', internal: false},
	],
});

function mockUdp(ipv4Address, ipv6Address) {
	return {
		namedExports: {
			createSocket(type) {
				const address = type === 'udp4' ? ipv4Address : ipv6Address;
				return {
					unref() {},
					on(event, handler) {
						if (event === 'error' && !address) {
							// Simulate ENETUNREACH for offline
							setTimeout(() => handler(new Error('connect ENETUNREACH')), 0);
						}
					},
					connect(_port, _address, callback) {
						if (address) {
							callback();
						}
					},
					address() {
						return {address};
					},
					close() {},
				};
			},
		},
	};
}

test('async IPv4', async () => {
	const ip = await internalIpV4();
	assert.ok(ip === undefined || isIPv4(ip));
});

test('async IPv6', async () => {
	const ip = await internalIpV6();
	assert.ok(ip === undefined || isIPv6(ip));
});

test('sync IPv4', () => {
	const ip = internalIpV4Sync();
	assert.ok(ip === undefined || isIPv4(ip));
});

test('sync IPv6', () => {
	const ip = internalIpV6Sync();
	assert.ok(ip === undefined || isIPv6(ip));
});

test('mocked sync IPv4', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfaces}});
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(module.internalIpV4Sync(), '192.168.1.118');
});

test('mocked sync IPv6 returns link-local when no global address', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfaces}});
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(module.internalIpV6Sync(), 'fe80::1');
});

test('mocked sync IPv6 prefers global over link-local', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfacesWithGlobalIpv6}});
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(module.internalIpV6Sync(), '2001:db8::1');
});

test('mocked sync IPv6 ignores multiple link-local interfaces before a global address', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfacesLinkLocalBeforeGlobalIpv6}});
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(module.internalIpV6Sync(), '2001:db8::1');
});

test('mocked sync returns undefined when multiple IPv4 interfaces exist', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfacesMultiple}});
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(module.internalIpV4Sync(), undefined);
});

test('mocked sync returns undefined when multiple IPv6 interfaces exist without global address', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfacesMultiple}});
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(module.internalIpV6Sync(), undefined);
});

test('mocked sync IPv4 ignores link-local interfaces', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfacesWithIpv4LinkLocal}});
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(module.internalIpV4Sync(), '192.168.1.118');
});

test('mocked async IPv4 uses UDP result', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfaces}});
	t.mock.module('node:dgram', mockUdp('10.0.0.5', 'fe80::2'));
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(await module.internalIpV4(), '10.0.0.5');
});

test('mocked async IPv6 uses UDP result', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfaces}});
	t.mock.module('node:dgram', mockUdp('10.0.0.5', '2001:db8::5'));
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(await module.internalIpV6(), '2001:db8::5');
});

test('mocked async IPv4 falls back to networkInterfaces when UDP fails', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfaces}});
	t.mock.module('node:dgram', mockUdp(undefined, undefined));
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(await module.internalIpV4(), '192.168.1.118');
});

test('mocked async IPv6 falls back to networkInterfaces when UDP fails', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfaces}});
	t.mock.module('node:dgram', mockUdp(undefined, undefined));
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(await module.internalIpV6(), 'fe80::1');
});

test('mocked async IPv6 fallback ignores multiple link-local interfaces before a global address', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfacesLinkLocalBeforeGlobalIpv6}});
	t.mock.module('node:dgram', mockUdp(undefined, undefined));
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(await module.internalIpV6(), '2001:db8::1');
});

test('mocked async IPv4 fallback ignores link-local interfaces', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfacesWithIpv4LinkLocal}});
	t.mock.module('node:dgram', mockUdp(undefined, undefined));
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(await module.internalIpV4(), '192.168.1.118');
});

test('mocked async IPv4 returns undefined when multiple interfaces exist and UDP fails', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfacesMultiple}});
	t.mock.module('node:dgram', mockUdp(undefined, undefined));
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(await module.internalIpV4(), undefined);
});

test('mocked async IPv6 returns undefined when multiple interfaces exist and UDP fails', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfacesMultiple}});
	t.mock.module('node:dgram', mockUdp(undefined, undefined));
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(await module.internalIpV6(), undefined);
});

test('async IPv6 falls back when UDP returns unspecified address', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfaces}});
	t.mock.module('node:dgram', mockUdp('10.0.0.5', '::'));
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(await module.internalIpV6(), 'fe80::1');
});

test('async IPv4 falls back when UDP returns unspecified address', async t => {
	t.mock.module('node:os', {namedExports: {networkInterfaces: mockInterfaces}});
	t.mock.module('node:dgram', mockUdp('0.0.0.0', '::'));
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(await module.internalIpV4(), '192.168.1.118');
});

test('sync: returns undefined when no non-internal interfaces exist', async t => {
	t.mock.module('node:os', {
		namedExports: {
			networkInterfaces: () => ({
				lo0: [
					{address: '127.0.0.1', family: 'IPv4', internal: true},
					{address: '::1', family: 'IPv6', internal: true},
				],
			}),
		},
	});
	const module = await import('./index.js?' + Math.random());
	assert.strictEqual(module.internalIpV4Sync(), undefined);
	assert.strictEqual(module.internalIpV6Sync(), undefined);
});
