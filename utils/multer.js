// import libs
const multer = require('multer');

/**
 * Process file received from HTTP request.
 * @param {string} storage - Either 'memory' or 'disk'
 * @param {string} name - Specify a filename
 */
const init = (storage = 'memory', name) => {
	const engine =
		storage == 'disk'
			? multer.diskStorage({ filename: name })
			: multer.memoryStorage();
	return multer({
		storage: engine, //store upload on RAM/disk
		limits: { fileSize: 5 * 1000 * 1000 }, //5MB limit
	});
};
module.exports = { init };
