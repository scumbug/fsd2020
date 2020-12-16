// import libs
const express = require('express');
const morgan = require('morgan');
const mg = require('./mg'); // Mongo Utils
const sql = require('./sql'); // MySQL Utils
require('dotenv').config();

// declare PORT and constants
const PORT = process.env.PORT || 3000;

// init mongo and mysql
const mongo = mg.initMongo(process.env.MONGO_URI);
const db = sql.initMySQL();

// SQL stmt
const SQL_GET_GAME_BY_ID = 'SELECT * FROM game WHERE gid = ?';

// SQL queries
const getGame = sql.mkQuery(SQL_GET_GAME_BY_ID, db);

// declare express instance
const app = express();

// init middlewares
app.use(morgan('tiny'));

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
		const [reviews] = await mg.getReviews(mongo, game.gid);
		//construct object and return as JSON
		res.status(200).json({ ...game, ...reviews });
	} catch (e) {
		console.log(e);
	}
});

// start server
Promise.all([mg.checkMongo(mongo), sql.checkMySQL(db)])
	.then(() => {
		app.listen(
			PORT,
			console.log(`App has started on ${PORT} at ${new Date()}`)
		);
	})
	.catch((e) => console.log(e));
