//import libs
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

//declare PORT
const PORT = process.env.PORT || 3000;

//create express instance
const app = express();

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

//
//SQL statements
//

// get an array of customers object { id: '', company: ''}
const SQL_GET_CUST_LIST = 'SELECT id, company FROM northwind.customers';
// get an array of employee object { id: '', name: ''}
const SQL_GET_EMP_LIST = `SELECT id, CONCAT(first_name,' ',last_name) AS name FROM northwind.employees`;
// get an array of shipper object { id: '', company: ''}
const SQL_GET_SHIPPER_LIST = 'SELECT id, company FROM northwind.shippers';
// get an array of status object
const SQL_GET_STATUS_LIST = 'SELECT * FROM northwind.orders_status';
// get an array of product object
const SQL_GET_PRODUCT_LIST = 'SELECT id,product_name,list_price FROM products';
// insert data into orders
const SQL_INSERT_ORDER = `INSERT INTO orders(
        employee_id,
        customer_id,
        shipper_id,
        status_id) VALUES (?,?,?,?)`;
// insert order details
const SQL_INSERT_ORDER_DETAILS =
	'INSERT INTO order_details(order_id,product_id,quantity,unit_price,status_id) VALUES (?,?,?,?,?)';
// get product prices
const SQL_GET_PRODUCT_PRICE = 'SELECT list_price FROM products WHERE id = ?';

//SQL queries
const getEmployee = getQuery(SQL_GET_EMP_LIST, db);
const getCustomer = getQuery(SQL_GET_CUST_LIST, db);
const getShipper = getQuery(SQL_GET_SHIPPER_LIST, db);
const getStatus = getQuery(SQL_GET_STATUS_LIST, db);
const getProduct = getQuery(SQL_GET_PRODUCT_LIST, db);
const getProductPrice = getQuery(SQL_GET_PRODUCT_PRICE, db);

//start cors
app.use(cors());

//send db data to client
app.get('/api/:method', async (req, res) => {
	switch (req.params.method) {
		case 'employees':
			res.json(await getEmployee());
			break;
		case 'customers':
			res.status(200).json(await getCustomer());
			break;
		case 'shippers':
			res.status(200).json(await getShipper());
			break;
		case 'status':
			res.status(200).json(await getStatus());
			break;
		case 'products':
			res.status(200).json(await getProduct());
			break;
		default:
			res.status(404).send('Method not recognised');
	}
});
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
//app logic
app.post('/order', async (req, res) => {
	//start order transaction
	const data = req.body;
	const conn = await db.getConnection();
	try {
		//transaction wrapper
		await conn.beginTransaction();

		//insert record into orders [employee_id,customer_id,shipper_id,status_id]
		let [t] = await conn.query(SQL_INSERT_ORDER, [
			data.employee_id,
			data.customer_id,
			data.shipper_id,
			data.status_id,
		]);

		const last = t.insertId;

		for (let line of data.orderDetails) {
			const [[price]] = await getProductPrice(line.product_id);

			//insert record(s) into orders_details [order_id,product_id,quantity,unit_price,status_id]
			t = await conn.query(SQL_INSERT_ORDER_DETAILS, [
				last,
				line.product_id,
				line.quantity,
				price.list_price,
				line.status_id,
			]);
		}

		// await data.orderDetails.forEach(async (line) => {
		// 	//get product price
		// 	const [[price]] = await conn.query(SQL_GET_PRODUCT_PRICE, [
		// 		line.product_id,
		// 	]);

		// 	//insert record(s) into orders_details [order_id,product_id,quantity,unit_price,status_id]
		// 	t = await conn.query(SQL_INSERT_ORDER_DETAILS, [
		// 		last,
		// 		line.product_id,
		// 		line.quantity,
		// 		price,
		// 		line.status_id,
		// 	]);
		// });

		//transaction wrapper
		await conn.commit();
	} catch (e) {
		conn.rollback();
		res.status(500).end;
	} finally {
		conn.release();
		res.status(200).end;
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
