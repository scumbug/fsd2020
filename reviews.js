//import libs
const express = require('express')
const { getNYT } = require('./helper')

module.exports = () => {
    const router = express.Router()
    //find book reviews
    router.post('/detail/:book_id/reviews',
        express.urlencoded({ extended: true }),
        async (req, res) => {
            //fetch and render reviews
            try {
                const title = req.body.title
                const authors = req.body.authors
                const q = await getNYT(title)
                if (q.results.length) {
                    //process review
                    res.status(200)
                    res.type('text/html')
                    res.render('reviews', { q, title, authors, noReviews: false })

                } else {
                    res.status(200)
                    res.type('text/html')
                    res.render('reviews', { title, authors, noReviews: true })
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