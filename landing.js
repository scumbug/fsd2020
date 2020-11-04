//import libs
const express = require('express')
const { getQuery } = require('./helper')

//SQL constants
const SQL_GET_SHOWS = 'SELECT * FROM tv_shows ORDER BY name desc LIMIT ? OFFSET ?'
const SQL_GET_COUNT = 'SELECT count(*) AS showcount FROM tv_shows ORDER BY name desc'

module.exports = (db) => {
    const router = express.Router()
    const getShowsCount = getQuery(SQL_GET_COUNT,db)
    const getShows = getQuery(SQL_GET_SHOWS,db)
    let pages = null
    router.get(['/', '/:page'],
        async (req, res) => {
            const p = parseInt(req.params.page) || 1
            try {
                [pages] = await getShowsCount()
                pages = Math.ceil(pages.showcount / 3)
                if (p > pages || p <= 0) {
                    res.status(404)
                    res.type('text/html')
                    res.send('404 Page not Found')
                    return
                }
                const offset = (p == 1) ? 0 : (p - 1) * 3
                const results = await getShows([15, offset])
                res.status(200)
                res.format({
                    'text/html': () => {
                        res.type('text/html')
                        res.render('landing', { results, prevPage: p - 1, nextPage: p + 1, finalPage: pages-p })
                    },
                    'application/json': () => {
                        res.type('application/json')
                        res.json(results)
                    },
                    'default': () => {
                        res.type('text/plain')
                        res.send(JSON.stringify(results))
                    }
                })
            } catch (e) {
                res.status(500)
                res.type('text/html')
                res.send(JSON.stringify(e))
                return Promise.reject(e)
            }
        }
    )

    return router
}