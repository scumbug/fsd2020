//install libs
const express = require('express');
require('dotenv').config();

//declare const
const cart = [
	{ item: 'apple', quantity: 6 },
	{ item: 'pear', quantity: 3 },
	{ item: 'banana', quantity: 66 },
	{ item: 'peach', quantity: 23 },
	{ item: 'watermelon', quantity: 1 },
	{ item: 'pineapple', quantity: 45 },
	{ item: 'orange', quantity: 32 },
];

//declare env
const PORT =
	(parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) ||
	(parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) ||
	3000;

//declare express instance
const app = express();

//return cart data in json
app.get('/cart', (_req, res) => {
	res.format({
		'application/json': () => {
			res.status(200);
			res.type('application/json');
			res.json(cart);
		},
		default: () => {
			res.status(406);
			res.type('text/plain');
			res.send('406 Not Acceptable');
		},
	});
});

app.listen(PORT, () => {
	console.log(`App started on ${PORT} at ${new Date()}`);
});
