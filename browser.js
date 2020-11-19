/* eslint-env browser */
'use strict';
import pEvent from 'p-event';

const ipv4 = async ({isSecondTry = false} = {}) => {
	const peerConnection = new RTCPeerConnection({iceServers: []});

	peerConnection.createDataChannel('');
	peerConnection.createOffer(peerConnection.setLocalDescription.bind(peerConnection), () => {});

	const {candidate} = await pEvent(peerConnection, 'icecandidate', {
		timeout: 10000
	});

	peerConnection.close();

	if (candidate && candidate.candidate) {
		const result = candidate.candidate.split(' ')[4];
		if (result.endsWith('.local')) {
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

			return ipv4({isSecondTry: true});
		}

		return result;
	}
};

export const v4 = async () => {
	try {
		return await ipv4();
	} catch {}
};

v4.sync = () => undefined;

export const v6 = () => undefined;

v6.sync = () => undefined;
