//import libs
const express = require('express');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const cors = require('cors');

//declare port
const PORT = process.env.PORT || 3000;

//setup mongo
const mongo = new MongoClient(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//start express instance
const app = express();
app.use(cors());
app.use(morgan('combined'));

// GET /countries
app.get('/countries', async (req, res) => {
	try {
		const result = await mongo
			.db('winemag')
			.collection('wine')
			.distinct('country');
		res.status(200).json(result);
	} catch (e) {
		console.log(e);
		res.status(500).json(e);
	}
});

// GET /country/:country
app.get('/country/:country', async (req, res) => {
	const country = req.params['country'];
	try {
		const result = await mongo
			.db('winemag')
			.collection('wine')
			.find({
				country: { $regex: country, $options: 'i' }, //lookup based on regex
			})
			.sort({ province: 1 }) //sort asc based on key province
			.limit(50) //limit results to 50
			.project({ title: 1, price: 1 }) //only retrieve some number of keys
			.toArray();
		if (result.length == 0) {
			res.status(404).json({ message: 'Not found' });
		} else {
			res.status(200).json(result);
		}
	} catch (e) {
		res.status(500).json(e);
	}
});

//start listen server
mongo
	.connect()
	.then(
		app.listen(PORT, console.log(`App has started on ${PORT} at ${new Date()}`))
	)
	.catch((e) => console.log('mongoDB not up'));
