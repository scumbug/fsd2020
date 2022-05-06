//import libs
const express = require('express')
const { getQuery } = require('./helper')

//SQL constants
const SQL_GET_BOOK_LISTING = 'SELECT * FROM book2018 WHERE title LIKE ? ORDER BY title asc LIMIT 10 OFFSET ?'
const SQL_GET_LIST_COUNT = 'SELECT count(*) as totalBooks FROM book2018 WHERE title LIKE ?'

module.exports = (db) => {
    const router = express.Router()
    //declare query functions
    const getBookList = getQuery(SQL_GET_BOOK_LISTING, db)
    const getBookCount = getQuery(SQL_GET_LIST_COUNT, db)

    router.get(['/catalog/:alpha', '/catalog/:alpha/:p'], async (req, res, next) => {

        //get listing of books by first letter, 10 per page, asc

        const p = parseInt(req.params.p) || 1

        try {
            const q = req.params.alpha
            let [pages] = await getBookCount(`${q}%`)
            pages = Math.ceil(pages.totalBooks / 10)
            //check for extremes
            if (p > pages || req.params.p <= 0) {
                console.log('here')
                res.status(404)
                res.type('text/html')
                res.render('error', { code: '404 Page not Found' })
                return
            }
            const offset = (p == 1) ? 0 : (p - 1) * 10
            const results = await (await getBookList([`${q}%`, offset]))
                .map(
                    (book) => { return { title: book.title, book_id: book.book_id } }
                )
            res.status(200)
            res.type('text/html')
            res.render('catalog', {
                results,
                idx: q,
                prevPage: p - 1,
                nextPage: p + 1,
                finalPage: pages - p
            })
        } catch (e) {
            res.status(500)
            res.type('text/html')
            res.render('error', { code: '500 Internal Server Error' })
            return Promise.reject(e)
        }
    })
    return router
}