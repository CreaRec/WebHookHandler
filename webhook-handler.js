const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.WEBHOOK_HANDLER_PORT || 3000;

// Parse JSON in request body
app.use(bodyParser.json());

// Define a POST route to handle webhook requests
app.post('/webhook/expenses-bot', (req, res) => {
	// Parse the webhook payload
	// const { repository, ref, action } = req.body;
	console.log('Received webhook request');
	console.log(req.body);

	// Perform any validation or filtering based on the payload

	// Execute the shell script
	const shellScript = spawn('sh', ['/data/test.sh']);

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
