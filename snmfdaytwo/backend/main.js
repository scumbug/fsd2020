// import libs
const express = require('express');
const sql = require('./utils/sql');
const morgan = require('morgan');
const passport = require('passport');
const LocalAuth = require('passport-local').Strategy;
const sha1 = require('sha1');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// setup PORT
const PORT = 3000;
const SECRET = process.env.SECRET || 'smd';

// create sql pool
const pool = sql.init();

// sql stmt
const SQL_CHECK_CRED =
	'SELECT count(*) as auth FROM user WHERE user_id = ? AND password = ?';

// sql queries
const checkCred = sql.mkQuery(SQL_CHECK_CRED, pool);

// config auth strat
passport.use(
	new LocalAuth(
		{
			usernameField: 'username',
			passwordField: 'password',
		},
		async (user, pwd, done) => {
			//do auth here
			const [res] = await checkCred([user, sha1(pwd)]);
			if (res.auth)
				done(null, {
					username: user,
					logintime: new Date(),
					security: 2,
				});
			else done('salah logins', false);
		}
	)
);

// init express
const app = express();

// setup middlewares
app.use(cors());
app.use(morgan('tiny'));
app.use(passport.initialize());

// login
app.post(
	'/login',
	express.urlencoded({ extended: true }),
	express.json(),
	(req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err != null || !user) {
				res.status(401).json({ error: err });
				return;
			}
			// login successful
			req.user = user;
			next();
		})(req, res, next);
	},
	(req, res) => {
		// login succeess, generate token
		const token = jwt.sign(
			{
				sub: req.user.username, // subject
				iss: 'myapp', // issuer
				iat: new Date().getTime() / 1000, // issue time
				exp: new Date().getTime() / 1000 + 30,
				data: {
					logintime: req.user.logintime,
				},
			},
			SECRET
		);
		res.status(200).json({ message: `logging in at ${new Date()}`, token });
	}
);

app.get(
	'/private',
	(req, res, next) => {
		// check auth
		// check request has auth header and bearer prefix
		const auth = req.get('Authorization');
		if (auth == null || auth.split(' ')[0] != 'Bearer') {
			res.status(403);
			res.json({ message: 'Auth header missing' });
			return;
		}
		// validate sig
		try {
			jwt.verify(auth.split(' ')[1], SECRET);
			req.token = 'verified';
			next();
		} catch (e) {
			res.status(403);
			res.json({ message: e });
		}
	},
	(req, res) => {
		res.status(200).json({ message: 'seegret message' });
	}
);

// start server
Promise.all([sql.check(pool)])
	.then(() => {
		app.listen(PORT, console.log(`App started on ${PORT} at ${new Date()}`));
	})
	.catch((e) => {
		console.log(e, '\nKilling app....');
		process.exit();
	});
