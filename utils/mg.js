//import libs
const { MongoClient } = require('mongodb');

//
// Helper Functions
//

// init Mongo via URI
const init = (URI) => {
	return new MongoClient(URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
};

// check if Mongo is alive
const check = (mongo) => {
	return new Promise((resolve, reject) => {
		mongo
			.connect()
			.then((r) => {
				console.log('MongoDB is alive!');
				resolve();
			})
			.catch((e) => reject('Unable to connect to MongoDB'));
	});
};

// get reviews JSON and av ratings
const getReviews = (client, db, collection) => {
	const closure = (id) => {
		return client
			.db(db)
			.collection(collection)
			.aggregate([
				{
					$match: { ID: id },
				},
				{
					$group: {
						_id: '$ID',
						reviews: { $push: '$_id' },
						average_ratings: { $push: '$rating' },
					},
				},
				{
					$project: {
						_id: 0,
						reviews: 1,
						average_ratings: { $avg: '$average_ratings' },
					},
				},
			])
			.toArray();
	};
	return closure;
};

module.exports = {
	init,
	check,
	getReviews,
};
