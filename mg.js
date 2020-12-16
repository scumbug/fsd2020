//import libs
const { MongoClient } = require('mongodb');

//
// Helper Functions
//

// init Mongo via URI
const initMongo = (URI) => {
	return new MongoClient(URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
};

// check if Mongo is alive
const checkMongo = async (mongo) => {
	console.log('Connecting to mongo...');
	return await mongo.connect();
};

// get reviews JSON and av ratings
const getReviews = (client, id) => {
	return client
		.db(process.env.MONGO_DB)
		.collection(process.env.MONGO_COLLECTION)
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

module.exports = {
	initMongo,
	checkMongo,
	getReviews,
};
