//import libs
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { getQuery } = require('./helper');
require('dotenv').config();

//setup mysql
const db = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME || 'northwind',
	connectionLimit: 5,
	waitForConnections: true,
});

//
//SQL statements
//
const SQL_UPSERT_TODO =
	'INSERT INTO todo(id,title,image) VALUES (?,?,?) ON DUPLICATE KEY UPDATE title = ?';
const SQL_UPSERT_TASK =
	'INSERT INTO task(id,todo_id,description,priority) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE description = ? , priority = ?';
const SQL_GET_TODOS = 'SELECT * FROM todo';
const SQL_GET_TODO = 'SELECT * FROM todo where id = ?';
const SQL_DELETE_TODO = 'DELETE FROM todo WHERE id = ?';
const SQL_GET_TASK = 'SELECT * FROM task WHERE todo_id = ?';

const getTodos = getQuery(SQL_GET_TODOS, db);
const getTodo = getQuery(SQL_GET_TODO, db);
const deleteTodo = getQuery(SQL_DELETE_TODO, db);
const getTasks = getQuery(SQL_GET_TASK, db);

//
// S3 setup
//

//create s3 bucket instance
const s3 = new AWS.S3({
	endpoint: process.env.S3_ENDPOINT,
	accessKeyId: process.env.S3_ACCESS_KEY,
	secretAccessKey: process.env.S3_SECRET_KEY,
	s3ForcePathStyle: true,
	signatureVersion: 'v4',
});

//upload function
const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.S3_BUCKET,
		acl: 'readonly',
		//upload file
		key: (req, file, cb) => {
			cb(null, `${new Date().getTime().toString()}_${file.originalname}`);
		},
		//declare file metadata
		metadata: (req, file, cb) => {
			cb(null, {
				fileName: file.fieldname,
				originalFile: file.originalname,
			});
		},
	}),
});

//declare port
const PORT = process.env.PORT || 3000;

//create app
const app = express();

//setup bodyparser and cors
app.use(cors());

//get todo list
app.get('/todos', async (req, res) => {
	res.status(200).json(await getTodos());
});

//get todo details
app.get('/todo/:id', async (req, res) => {
	let [todo] = await getTodo(req.params.id);
	todo.tasks = await getTasks(req.params.id);
	res.status(200).json(todo);
});

//delete todo
app.get('/delete/:id', async (req, res) => {
	await deleteTodo([req.params.id]);
	res.status(200).end();
});

//form submit
app.post('/submit', upload.single('upload'), async (req, res) => {
	//handle text portion of form
	const conn = await db.getConnection();
	const data = JSON.parse(req.body.form);
	try {
		await conn.beginTransaction();

		//handle upload
		const file = req.file ? req.file.location : '';

		// INSERT: id,title,image OR UPDATE: title
		let [t] = await conn.query(SQL_UPSERT_TODO, [
			data.id,
			data.title,
			file,
			data.title,
		]);

		const last = t.insertId;

		for (let task of data.tasks) {
			// INSERT: id,todo_id,description,priority OR UPDATE: description, priority
			t = await conn.query(SQL_UPSERT_TASK, [
				task.id,
				last,
				task.description,
				parseInt(task.priority),
				task.description,
				parseInt(task.priority),
			]);
		}

		await conn.commit();
	} catch (error) {
		console.log(error);
		await conn.rollback();
	} finally {
		await conn.release();
	}
	res.status(200).json({ message: 'success' });
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
