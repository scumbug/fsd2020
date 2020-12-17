// import libs
const mysql = require('mysql2/promise');

//
// SQL Utils
//

// init MySQL with params
const init = (params = {}) => {
	return mysql.createPool({
		host: params.host || process.env.DB_HOST || 'localhost',
		port: params.host || process.env.DB_PORT || 3306,
		user: params.user || process.env.DB_USER,
		password: params.password || process.env.DB_PWD,
		database: params.database || process.env.DB_NAME,
		timezone: '+08:00',
		connectionLimit: 5,
		waitForConnections: true,
	});
};

// check if MySQL is alive
const check = (pool) => {
	return new Promise((resolve, reject) => {
		pool
			.getConnection()
			.then((conn) => {
				console.log('Pinging MySQL db...');
				return Promise.all([Promise.resolve(conn), conn.ping()]);
			})
			.then((conn) => {
				console.log('MySQL is alive!');
				conn[0].release();
				resolve();
			})
			.catch((e) => reject('Unable to connect to MySQL DB'));
	});
};

// Query helper
const mkQuery = (sql, pool) => {
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

module.exports = { init, check, mkQuery };
