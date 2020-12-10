//import libs
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const { getQuery } = require('./helper');

//
//SQL statements
//

//SQL queries

//declare port
const PORT = process.env.PORT || 3000;

//create app
const app = express();

//setup bodyparser and cors
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

//setup DB
const db = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	connectionLimit: 5,
	waitForConnections: true,
});

//app logic

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
