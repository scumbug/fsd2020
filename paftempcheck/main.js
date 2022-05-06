//import libs
const express = require('express');
const morgan = require('morgan');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();

//declare constants
const PORT = process.env.PORT || 3000;
const MDB = process.env.MONGO_DB;
const MC = process.env.MONGO_COLLECTION;

//setup mongo
const mongo = new MongoClient(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//setup S3
const s3 = new AWS.S3({
	endpoint: process.env.S3_ENDPOINT,
	accessKeyId: process.env.S3_ACCESS_KEY,
	secretAccessKey: process.env.S3_SECRET_KEY,
	//below is required for minio server
	s3ForcePathStyle: true,
	signatureVersion: 'v4',
});

//return object to be inserted into mongo
const makeTemp = (params, key) => {
	return {
		ts: new Date(),
		user: params.username,
		q1: params.q1,
		q2: params.q2,
		temp: params.temp,
		img: key,
	};
};

//set multer
const upload = multer({
	storage: multer.memoryStorage(), //store upload on RAM
	limits: { fileSize: 5 * 1000 * 1000 }, //5MB limit
});

//promisify uploading to S3
const uploadS3 = (file, s3) => {
	return new Promise((resolve, reject) => {
		//gen unique keyname
		const key = `${new Date().getTime().toString()}_${file.originalname}`;
		//set s3 params
		const params = {
			Bucket: process.env.S3_BUCKET,
			Key: key,
			Body: file.buffer,
			ACL: 'readonly', //special ACL for minio
			ContentType: file.mimetype,
			ContentLength: file.size,
		};
		s3.putObject(params, (err, result) => {
			if (err == null) {
				resolve(key);
			} else reject(err);
		});
	});
};

//setup express instance
const app = express();

//setup middlewares
app.use(morgan('tiny'));

//landing test
app.get('/', (req, res) => {
	res.status(200).json({ message: 'success' });
});

// POST /temp
app.post('/temp', upload.single('temp-img'), async (req, res) => {
	//body.username,body.q1,body.q2,body.temp

	//insert temp record
	try {
		let result = await uploadS3(req.file, s3);
		result = await mongo
			.db(MDB)
			.collection(MC)
			.insertOne(makeTemp(req.body, result));
		res.status(200).json(result);
	} catch (e) {
		res.status(500).json(e);
	}
});

//start server

const checkS3 = new Promise((resolve, reject) => {
	if (process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
		resolve();
	} else {
		reject('No S3 Keys');
	}
});

Promise.all([checkS3, mongo.connect()])
	.then(() => {
		app.listen(
			PORT,
			console.log(`App has started on ${PORT} at ${new Date()}`)
		);
	})
	.catch((e) => console.log(e));
