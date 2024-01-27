const crypto = require('crypto');

let encoder = new TextEncoder();

async function verifySignature2(secret, header, payload) {
	// Create an HMAC instance with the SHA-256 algorithm
	const hmac = crypto.createHmac('sha256', secret);

	// Update the HMAC with the data to sign
	hmac.update(payload);

	// Calculate the HMAC signature as a hexadecimal string
	const signature = hmac.digest('hex');

	console.log('HMAC Signature:', signature);
	return header === `sha256=${signature}`;
}

async function verifySignature(secret, header, payload) {
	let parts = header.split("=");
	let sigHex = parts[1];

	let algorithm = {name: "HMAC", hash: {name: 'SHA-256'}};

	let keyBytes = encoder.encode(secret);
	let extractable = false;
	let key = await crypto.subtle.importKey(
		"raw",
		keyBytes,
		algorithm,
		extractable,
		["sign", "verify"],
	);

	let sigBytes = hexToBytes(sigHex);
	let dataBytes = encoder.encode(payload);
	return await crypto.subtle.verify(
		algorithm.name,
		key,
		sigBytes,
		dataBytes,
	);
}

function hexToBytes(hex) {
	let len = hex.length / 2;
	let bytes = new Uint8Array(len);

	let index = 0;
	for (let i = 0; i < hex.length; i += 2) {
		let c = hex.slice(i, i + 2);
		bytes[index] = parseInt(c, 16);
		index += 1;
	}

	return bytes;
}

module.exports = {
	verifySignature,
	verifySignature2
};