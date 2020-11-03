const express = require('express')
const SQL_GET_MOVIE_DEETS = 'SELECT * FROM tv_shows WHERE tvid = ?'
module.exports = (db) => {
    const router = express.Router()

    router.get('/detail/:tvid',
        async (req, res) => {
            const conn = await db.getConnection()
            try {
                let [result] = await db.query(SQL_GET_MOVIE_DEETS, req.params.tvid)
                if (result[0] == null) {
                    res.status(404)
                    res.type('text/html')
                    res.send('404 Show not Found')
                    return
                }
                const star = Math.round(result[0]['rating'])
                result[0]['rating'] = ''
                for (i = 0; i < star; i++) {
                    result[0]['rating'] += '★'
                }
                res.status(200)
                res.type('text/html')
                res.render('detail', { result: result[0] })
            } catch (e) {
                res.status(500)
                res.type('text/html')
                res.send(JSON.stringify(e))
            } finally {
                conn.release()
            }
        }
    )
    return router

}