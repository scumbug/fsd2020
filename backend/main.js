// Import Libs
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Declare PORT and constants
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

// Create Express instance
const app = express();

// Start logging
app.use(morgan('tiny'));
app.use(cors());

app.post('/auth', express.json(), (req, res) => {
	//Handle auth here
	console.log(req.body);
});

// Start server
app.listen(PORT, () => {
	console.info(`Application started on port ${PORT} at ${new Date()}`);
});
