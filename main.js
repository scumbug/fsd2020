//import libs
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

//declare port
const PORT = process.env.PORT || 3000;

//declare SQL statement
const SQL_GET_ORDER_DETAILS = `
    SELECT
        orders.id,
        orders.order_date,
        orders.customer_id,
        order_details.quantity,
        order_details.unit_price,
        order_details.discount,
        products.standard_cost
    FROM orders
    JOIN order_details
    ON orders.id = order_details.order_id 
    JOIN products
    ON products.id = order_details.product_id
    WHERE orders.id = ?`;

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
const getOrder = getQuery(SQL_GET_ORDER_DETAILS, db);

//create express instance
const app = express();

//landing
app.get('/', (req, res) => {
	res.status(200).send('test');
});

//GET order
app.get('/order/total/:orderID', async (req, res) => {
	const data = await getOrder(req.params.orderID);
	let total = 0;
	let discount = 0;
	let cost_price = 0;
	data.forEach((record) => {
		total += record.quantity * record.unit_price;
		discount += record.quantity * record.cost_price;
		cost_price += record.quantity * record.standard_cost;
	});
	res.status(200);
	res.type('application/json');
	res.send({
		total,
		discount,
		cost_price,
		order_id: data[0].order_id,
		customer_id: data[0].customer_id,
	});
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
