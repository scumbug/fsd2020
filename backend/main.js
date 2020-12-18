// Import Libs
const morgan = require('morgan');
const express = require('express');
const sql = require('./utils/sql');
const mult = require('./utils/multer');
const aws = require('./utils/s3');
const mg = require('./utils/mg');
require('dotenv').config();

// Declare PORT and constants
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

// Create Express instance
const app = express();

// Init plugins
const db = sql.init();
const upload = mult.init('disk');
const s3 = aws.init();
const mongo = mg.init(process.env.MONGO_URI);

const uploadS3 = aws.upload('fsd', s3);
const insertFFT = mg.insertDoc(
	mongo,
	process.env.MONGO_DB,
	process.env.MONGO_COLLECTION
);

// SQL Stmt
const SQL_CHECK_CRED =
	'SELECT count(*) as auth FROM user WHERE user_id = ? AND password = ?';
// SQL queries
const auth = sql.mkQuery(SQL_CHECK_CRED, db);

// Start logging
app.use(morgan('tiny'));

// POST /auth - Authenticate login
app.post('/auth', express.json(), async (req, res) => {
	//Handle auth here
	const [authFlag] = await auth([req.body.username, req.body.password]);
	if (!authFlag.auth) {
		res.status(401).json({ message: 'Error! Authentication failed!' });
	} else {
		res.status(200).json({ message: 'Authentication Success!' });
	}
});

// POST /submit - Process form
app.post('/submit', upload.single('upload'), async (req, res) => {
	const form = JSON.parse(req.body.form);
	try {
		// Do auth
		const [authFlag] = await auth([form.cred.username, form.cred.password]);
		if (!authFlag.auth) {
			res.status(401).json({ message: 'Error! Authentication failed!' });
		} else {
			// Auth success, upload image
			const key = await uploadS3(req.file);
			// Build object to send to mongo
			const record = {
				title: form.title,
				comments: form.comments,
				imageurl: `http://${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`,
				timestamp: new Date(),
			};
			// Insert into Mongo
			const mongoinsert = await insertFFT(record);
			// Delete tmp file
			await mult.deleteLocal(req.file.path);
			// Send Response to frontend
			res
				.status(200)
				.json({ message: 'Insert FFT successful', id: mongoinsert.insertedId });
		}
	} catch (e) {
		// Catch errors arising from failed S3 and Mongo uploads
		res.status(500).json({ message: e });
	}
});

app.use(express.static(`${__dirname}/frontend`));

// Start server
Promise.all([sql.check(db), aws.check(), mg.check(mongo)]).then(() => {
	app.listen(PORT, () => {
		console.info(`Application started on port ${PORT} at ${new Date()}`);
	});
});
