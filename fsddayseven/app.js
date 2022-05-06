const express = require('express')

const SQL_GET_APPS_BY_APPID = 'SELECT * FROM apps WHERE app_id = ?'

module.exports = (db) => {
    const router = express.Router()
    router.get('/app/:appid',
        async (req, res) => {
            const appid = req.params.appid;
            const conn = await db.getConnection();
            try {
                let [result] = await db.query(SQL_GET_APPS_BY_APPID, appid);
                res.status(200);
                res.type('text/html');
                res.render('app', { result: result[0] });
            } catch (e) {
                console.log(e);
            } finally {
                conn.release();
            }
        }
    )
    return router
}