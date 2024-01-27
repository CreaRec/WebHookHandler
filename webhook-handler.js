const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const {verifySignature} = require("./github-payload-verifier");

const app = express();
const port = process.env.WEBHOOK_HANDLER_PORT || 3000;

// Parse JSON in request body
app.use(bodyParser.json());

// Define a POST route to handle webhook requests
app.post('/webhook/expenses-bot', async (req, res) => {
	console.log('Received webhook request');
	// Get GitHub header with signature
	const webhookSignature = req.headers['x-hub-signature-256'];
	if (!webhookSignature) {
		console.log('No signature provided');
		res.status(400).send('No signature provided');
		return;
	}
	let payload = req.body;
	let verificationResult = await verifySignature("secret", webhookSignature, JSON.stringify(payload));
	if (!verificationResult) {
		console.log('Signature verification failed');
		res.status(400).send('Signature verification failed');
		return;
	}
	console.log('Signature verification succeeded');
	console.log("Executing shell script")
	// Execute the shell script
	const shellScript = spawn('sh', ['/data/expenses-bot-deploy.sh']);

	shellScript.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	shellScript.stderr.on('data', (data) => {
		console.error(`stderr: ${data}`);
	});

	shellScript.on('close', (code) => {
		console.log(`Shell script exited with code ${code}`);
		res.status(200).send('Webhook received and processed.');
	});
});

app.get('/health', (req, res) => {
	console.log('Received health check request');
	res.status(200).send('OK');
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
