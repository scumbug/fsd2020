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
        id,
        employee_id,
        customer_id,
        shipper_id,
        ship_name,
        ship_address,
        ship_city,
        ship_state_province,
        ship_zip_postal_code,
        ship_country_region,
        tax_rate,
        status_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
// insert order details
const SQL_INSERT_ORDER_DETAILS =
	'INSERT INTO order_details(order_id,product_id,quantity,unit_price,status_id) VALUES (?,?,?,?,?)';

//SQL queries
const getEmployee = getQuery(SQL_GET_EMP_LIST, db);
const getCustomer = getQuery(SQL_GET_CUST_LIST, db);
const getShipper = getQuery(SQL_GET_SHIPPER_LIST, db);
const getStatus = getQuery(SQL_GET_STATUS_LIST, db);
const getProduct = getQuery(SQL_GET_PRODUCT_LIST, db);

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
	console.log('post called');
	console.log(req.body);
	const conn = await db.getConnection();
	try {
		//transaction wrapper
		await conn.beginTransaction();

		//insert record into orders
		//let [t] = await conn.query(SQL_INSERT_ORDER, [2, 2, 1, 0]);

		//insert record(s) into orders_details
		//[t] = await conn.query(SQL_INSERT_ORDER_DETAILS, [t.insertId, 3, 1, 50, 0]);

		//transaction wrapper
		await conn.commit();
	} catch (e) {
		conn.rollback();
	} finally {
		conn.release();
	}
	res.status(200).end;
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
