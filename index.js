import {createSocket} from 'node:dgram';
import {networkInterfaces} from 'node:os';

function isLinkLocalAddress(family, address) {
	if (family === 'IPv6') {
		return address.startsWith('fe80');
	}

	if (family === 'IPv4') {
		return address.startsWith('169.254.');
	}

	return false;
}

function findIpFromInterfaces(family) {
	let globalAddress;
	let globalInterfaceName;
	let linkLocalAddress;
	let linkLocalInterfaceName;
	let hasMultipleLinkLocalInterfaces = false;

	for (const [interfaceName, addresses] of Object.entries(networkInterfaces())) {
		if (!addresses) {
			continue;
		}

		let interfaceGlobalAddress;
		let interfaceLinkLocalAddress;

		for (const networkInterface of addresses) {
			if (networkInterface.internal || networkInterface.family !== family) {
				continue;
			}

			if (isLinkLocalAddress(family, networkInterface.address)) {
				interfaceLinkLocalAddress ??= networkInterface.address;
				continue;
			}

			interfaceGlobalAddress ??= networkInterface.address;
		}

		if (interfaceGlobalAddress) {
			if (globalAddress && globalInterfaceName !== interfaceName) {
				return;
			}

			globalAddress = interfaceGlobalAddress;
			globalInterfaceName = interfaceName;
			continue;
		}

		if (interfaceLinkLocalAddress && !globalAddress) {
			if (linkLocalAddress && linkLocalInterfaceName !== interfaceName) {
				hasMultipleLinkLocalInterfaces = true;
				continue;
			}

			linkLocalAddress = interfaceLinkLocalAddress;
			linkLocalInterfaceName = interfaceName;
		}
	}

	if (globalAddress) {
		return globalAddress;
	}

	if (hasMultipleLinkLocalInterfaces) {
		return;
	}

	return linkLocalAddress;
}

function findIpViaUdp(socketType, remoteAddress) {
	return new Promise((resolve, reject) => {
		const socket = createSocket(socketType);
		socket.unref();
		socket.on('error', error => {
			socket.close();
			reject(error);
		});
		socket.connect(1, remoteAddress, () => {
			const {address} = socket.address();
			socket.close();
			resolve(address);
		});
	});
}

async function findIp(socketType, remoteAddress, family) {
	try {
		const address = await findIpViaUdp(socketType, remoteAddress);
		if (address && address !== '::' && address !== '0.0.0.0') {
			return address;
		}
	} catch {}

	return findIpFromInterfaces(family);
}

export async function internalIpV6() {
	return findIp('udp6', '2001:4860:4860::8888', 'IPv6');
}

export async function internalIpV4() {
	return findIp('udp4', '8.8.8.8', 'IPv4');
}

export function internalIpV6Sync() {
	return findIpFromInterfaces('IPv6');
}

export function internalIpV4Sync() {
	return findIpFromInterfaces('IPv4');
}
