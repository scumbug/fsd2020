//import libs
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

//declare port
const PORT = process.env.PORT || 3000;

//declare SQL statement
const SQL_GET_ORDER_TOTALS = `SELECT * FROM order_totals WHERE order_id = ?`;

//declare mysql pool
const db = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME || 'northwind',
	connectionLimit: 5,
	waitForConnections: true,
});

//query DB helper function
const getQuery = (sql, pool) => {
	const result = async (params) => {
		const conn = await pool.getConnection();
		try {
			const [res] = await conn.query(sql, params);
			return res;
		} catch (e) {
			return Promise.reject(e);
		} finally {
			conn.release();
		}
	};
	return result;
};

//declare SQL query
const getOrder = getQuery(SQL_GET_ORDER_TOTALS, db);

//create express instance
const app = express();

//landing
app.get('/', (req, res) => {
	res.status(200).send('test');
});

//GET order
app.get('/order/total/:orderID', async (req, res) => {
	const data = await getOrder(req.params.orderID);
	res.status(200);
	res.type('application/json');
	res.send(data);
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
