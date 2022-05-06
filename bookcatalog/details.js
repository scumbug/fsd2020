//import libs
const express = require('express')
const { getQuery } = require('./helper')

//SQL constants
const SQL_GET_BOOK_DEETS = 'SELECT * FROM book2018 WHERE book_id = ?'

module.exports = (db) => {
    const router = express.Router()
    router.get('/detail/:book_id', async (req, res) => {
        //declare query functions
        const getBookDeets = await getQuery(SQL_GET_BOOK_DEETS, db)

        //logic
        try {
            let [result] = await getBookDeets(req.params.book_id)
            if (result) {
                //handle JSON transforming here
                result.authors = result.authors.split("|")
                result.genres = result.genres.split("|")

                res.status(200)
                res.type('text/html')
                res.format({
                    'text/html': () => {
                        res.type('text/html')
                        res.render('detail', { result })
                    },
                    'application/json': () => {
                        res.type('application/json')
                        res.json({
                            bookId: result.book_id,
                            title: result.title,
                            authors: result.authors,
                            summary: result.description,
                            pages: result.pages,
                            rating: result.rating,
                            ratingCount: result.rating_count,
                            genre: result.genres,
                        })
                    },
                    'default': () => {
                        res.status(406)
                        res.type('text/plain')
                        res.send('406 Not Acceptable')
                    }
                })
            } else {
                res.status(404)
                res.type('text/html')
                res.render('error', { code: '404 Page not Found' })
            }
        } catch (e) {
            res.status(500)
            res.type('text/html')
            res.render('error', { code: '500 Internal Server Error' })
            return Promise.reject(e)
        }
    })
    return router
}