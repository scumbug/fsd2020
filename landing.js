const express = require('express')
const SQL_GET_SHOWS = 'SELECT * FROM tv_shows ORDER BY name desc LIMIT ? OFFSET ?'
const SQL_GET_COUNT = 'SELECT count(*) AS showcount FROM tv_shows ORDER BY name desc'

module.exports = (db) => {
    const router = express.Router()
    let pages = null
    router.get(['/', '/:page'],
        async (req, res) => {
            const conn = await db.getConnection()
            const p = parseInt(req.params.page) || 1
            try {
                [pages] = await db.query(SQL_GET_COUNT)
                pages = Math.ceil(pages[0].showcount / 3)
                if (p > pages || p <= 0) {
                    res.status(404)
                    res.type('text/html')
                    res.send('404 Page not Found')
                }
                const offset = (p == 1) ? 0 : (p - 1) * 3
                const [results] = await db.query(SQL_GET_SHOWS, [15, offset])
                res.status(200)
                res.type('text/html')
                res.render('landing', { results, prevPage: p - 1, nextPage: p + 1 })
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