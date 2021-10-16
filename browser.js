/* eslint-env browser */
import pEvent from 'p-event';
import isIp from 'is-ip';

const getIp = async ({isSecondTry = false} = {}) => {
	try {
		const peerConnection = new RTCPeerConnection({iceServers: []});

		peerConnection.createDataChannel('');
		peerConnection.createOffer(peerConnection.setLocalDescription.bind(peerConnection), () => {});

		const {candidate} = await pEvent(peerConnection, 'icecandidate', {
			timeout: 10_000,
		});

		peerConnection.close();

		if (!(candidate && candidate.candidate)) {
			return;
		}

		const result = candidate.candidate.split(' ')[4];
		if (!result.endsWith('.local')) {
			return result;
		}

		if (isSecondTry) {
			return;
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

		return await getIp({isSecondTry: true});
	} catch {}
};

export async function internalIpV6() {
	const result = await getIp();
	if (isIp.v6(result)) {
		return result;
	}
}

export async function internalIpV4() {
	const result = await getIp();
	if (isIp.v4(result)) {
		return result;
	}
}

export function internalIpV6Sync() {
	return undefined;
}

export function internalIpV4Sync() {
	return undefined;
}
