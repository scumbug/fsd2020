//import libs
const { getQuery } = require('./helper')
const express = require('express')

//SQL constants
const SQL_GET_SHOW_DEETS = 'SELECT * FROM tv_shows WHERE tvid = ?'


module.exports = (db) => {
    const getShowDeets = getQuery(SQL_GET_SHOW_DEETS,db)
    const router = express.Router()

    router.get('/detail/:tvid',
        async (req, res) => {
            try {
                let result = await getShowDeets(req.params.tvid)
                if (result == null) {
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
                res.format({
                    'text/html': () => {
                        res.type('text/html')
                        res.render('detail', { result: result[0] })
                    },
                    'application/json': () => {
                        res.type('application/json')
                        res.json(result)
                    },
                    'default': () => {
                        res.type('text/plain')
                        res.send(JSON.stringify(result))
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