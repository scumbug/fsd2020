const express = require('express')

const SQL_GET_APPS = 'SELECT * FROM apps WHERE category = ?'

module.exports = (db) => {
    const router = express.Router()

    router.get('/category',
        async (req, res) => {
            const conn = await db.getConnection();
            try {
                let [results] = await conn.query(SQL_GET_APPS, req.query.q);
                res.status(200);
                res.type('text/html');
                res.render('category', { results, cat: req.query.q });
            } catch (e) {
                console.log(e);
            } finally {
                conn.release();
            }
        }
    )

    return router
}