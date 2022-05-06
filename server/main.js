// import libs
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const ws = require('express-ws');
require('dotenv').config();

// declare port
const PORT = 3000;
const ROOM = {};

// express instance
const app = express();
// add ws support
ws(app);

// middlewares
app.use(cors());
app.use(morgan('tiny'));

app.ws('/chat', (ws, req) => {
	const name = req.query.name;
	console.log(`New ws conn: ${name}`);
	ws.chatterName = name;
	ROOM[name] = ws;

	ws.on('message', (payload) => {
		// build payload
		const chat = JSON.stringify({
			from: name,
			message: payload,
			ts: new Date().toString(),
		});

		// broadcast message
		for (let p in ROOM) ROOM[p].send(chat);
	});

	// close ws
	ws.on('close', () => {
		console.log(`Closing ws conn for ${name}`);
		ROOM[name].close();
		// remove from room
		delete ROOM[name];
	});
});

// start server
app.listen(PORT, console.log(`App started on ${PORT} at ${new Date()}`));
