const crypto = require('crypto');

async function verifySignature(secret, header, payload) {
	// Create an HMAC instance with the SHA-256 algorithm
	const hmac = crypto.createHmac('sha256', secret);
	hmac.update(payload);
	const signature = hmac.digest('hex');
	return header === `sha256=${signature}`;
}

module.exports = {
	verifySignature
};