const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const secureEnv = require('secure-env');
const cors = require('cors');

//load in env
global.env = secureEnv({ secret: process.argv[2] });

const db = mysql.createPool({
	host: 'localhost',
	user: global.env.DB_USER,
	password: global.env.DB_PASSWORD,
	database: global.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 5,
});

//declare port and variables
const PORT =
	(parseInt(process.argv[3]) > 1024 && parseInt(process.argv[3])) ||
	(parseInt(global.env.PORT) > 1024 && parseInt(global.env.PORT)) ||
	3000;
const NAMESPACE = '/api';
const ALL_RSVP =
	'SELECT id, name, email, phone, status, createdBy, createdDt, updatedBy, updatedDt from rsvp';
const INSERT_RSVP =
	'INSERT into rsvp(name, email, phone, status, createdBy, createdDt) values (?,?,?,?,?,CURDATE())';

//generic query function
const makeQuery = (sql, pool) => {
	return async (binds = []) => {
		const conn = await pool.getConnection();
		try {
			const [result] = await conn.query(sql, binds);
			return result;
		} finally {
			conn.release();
		}
	};
};

//query functions
const findrsvp = makeQuery(ALL_RSVP, db);
const insertrsvp = makeQuery(INSERT_RSVP, db);

//create express instance
const app = express();

//start cors
app.use(cors());

//load bodyparser
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '20mb' }));

//get all rsvp in db
app.get(`${NAMESPACE}/rsvp`, async (req, res) => {
	try {
		res.status(200).json(await findrsvp());
	} catch (e) {
		console.log(e);
	}
});

//insert a record into db
app.post(`${NAMESPACE}/rsvp`, async (req, res) => {
	try {
		const result = await insertrsvp([
			req.body.name,
			req.body.email,
			req.body.phone,
			req.body.status,
			1,
		]);
		res.status(200).json([result]);
	} catch (e) {
		res.status(500).json(e);
	}
});

//start server
db.getConnection()
	.then((conn) => {
		console.info('Pinging DB....');
		return Promise.all([Promise.resolve(conn), conn.ping()]);
	})
	.then((ans) => {
		console.info('DB is online!');
		ans[0].release();
		app.listen(
			PORT,
			console.info(`App has started on ${PORT} at ${new Date()}`)
		);
	})
	.catch((e) => {
		console.error(e);
	});
