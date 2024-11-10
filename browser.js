/* eslint-env browser */
import {pEvent} from 'p-event';
import {isIPv4, isIPv6} from 'is-ip';

async function tryGetIp() {
	try {
		const peerConnection = new RTCPeerConnection({iceServers: []});

		peerConnection.createDataChannel('');
		const offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offer);

		const {candidate} = await pEvent(peerConnection, 'icecandidate', {
			timeout: 10_000,
		});

		peerConnection.close();

		if (!candidate?.candidate) {
			return;
		}

		const result = candidate.candidate.split(' ')[4];
		if (!result.endsWith('.local')) {
			return result;
		}
	} catch {}
}

async function getIp() {
	const ip = await tryGetIp();

	if (ip) {
		return ip;
	}

	const inputDevices = await navigator.mediaDevices.enumerateDevices();
	const inputDeviceTypes = new Set(inputDevices.map(({kind}) => kind));

	const constraints = {};
	if (inputDeviceTypes.has('audioinput')) {
		constraints.audio = true;
	} else if (inputDeviceTypes.has('videoinput')) {
		constraints.video = true;
	} else {
		return;
	}

	const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
	for (const track of mediaStream.getTracks()) {
		track.stop();
	}

	return tryGetIp();
}

export async function internalIpV6() {
	const result = await getIp();
	if (isIPv6(result)) {
		return result;
	}
}

export async function internalIpV4() {
	const result = await getIp();
	if (isIPv4(result)) {
		return result;
	}
}

export function internalIpV6Sync() {}

export function internalIpV4Sync() {}
