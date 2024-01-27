let encoder = new TextEncoder();

export async function verifySignature(secret, header, payload) {
	let parts = header.split("=");
	let sigHex = parts[1];

	let algorithm = { name: "HMAC", hash: { name: 'SHA-256' } };

	let keyBytes = encoder.encode(secret);
	let extractable = false;
	let key = await crypto.subtle.importKey(
		"raw",
		keyBytes,
		algorithm,
		extractable,
		[ "sign", "verify" ],
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