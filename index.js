import {networkInterfaces} from 'node:os';
import {gateway4async, gateway4sync, gateway6async, gateway6sync} from 'default-gateway';
import {contains, normalize} from 'cidr-tools';

function findIp({gateway}) {
	// Look for the matching interface in all local interfaces
	for (const addresses of Object.values(networkInterfaces())) {
		for (const {cidr} of addresses) {
			if (contains(cidr, gateway)) {
				return normalize(cidr).split('/')[0];
			}
		}
	}
}

export async function internalIpV6() {
	try {
		return findIp((await gateway6async()));
	} catch {}
}

export async function internalIpV4() {
	try {
		return findIp((await gateway4async()));
	} catch {}
}

export function internalIpV6Sync() {
	try {
		return findIp(gateway6sync());
	} catch {}
}

export function internalIpV4Sync() {
	try {
		return findIp(gateway4sync());
	} catch {}
}
