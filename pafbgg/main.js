// import libs
const express = require('express');
const morgan = require('morgan');
const mg = require('./utils/mg'); // Mongo Utils
const sql = require('./utils/sql'); // MySQL Utils
const s3 = require('./utils/s3'); // S3 Utils
const mult = require('./utils/multer');
require('dotenv').config();

// declare PORT and constants
const PORT = process.env.PORT || 3000;
const MDB = process.env.MONGO_DB;
const MC = process.env.MONGO_COLLECTION;

// init plugins
const mongo = mg.init(process.env.MONGO_URI);
const db = sql.init();
const multer = mult.init('memory', 'test');

// SQL stmt
const SQL_GET_GAME_BY_ID = 'SELECT * FROM game WHERE gid = ?';
// SQL queries
const getGame = sql.mkQuery(SQL_GET_GAME_BY_ID, db);

// Mongo queries
const getReviews = mg.getReviews(mongo, MDB, MC);

// declare express instance
const app = express();

// init middlewares
app.use(morgan('tiny'));

app.post('/', multer.single('test'), (req, res) => {
	console.log(req.file);
	res.status(200).end();
});

/* 
    GET /game/:id
    Returns the following JSON
    {
        name
        year
        url
        image
        reviews[ids....]
        average_ratings
    } 
*/
app.get('/game/:id', async (req, res) => {
	try {
		//pull game from MYSQL
		const [game] = await getGame(req.params.id);
		//pull reviews from Mongo
		const [reviews] = await getReviews(game.gid);
		//construct object and return as JSON
		res.status(200).json({ ...game, ...reviews });
	} catch (e) {
		console.log(e);
	}
});

// start server
Promise.all([sql.check(db), mg.check(mongo)])
	.then(() => {
		app.listen(
			PORT,
			console.log(`App has started on ${PORT} at ${new Date()}`)
		);
	})
	.catch((e) => {
		console.log(e);
		console.log('Killing app...');
		process.exit();
	});
