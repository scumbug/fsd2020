//import libs
require('dotenv').config()
const express = require('express')
const hbs = require('express-handlebars')
const mysql = require('mysql2/promise')
const morgan = require('morgan')
const { getDate, ASCIIArr, getQuery, getNYT } = require('./helper')

//globals
const PORT = (parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000

//SQL Queries
const SQL_GET_BOOK_LISTING = 'SELECT * FROM book2018 WHERE title LIKE ? ORDER BY title asc LIMIT 10 OFFSET ?'
const SQL_GET_LIST_COUNT = 'SELECT count(*) as totalBooks FROM book2018 WHERE title LIKE ?'
const SQL_GET_BOOK_DEETS = 'SELECT * FROM book2018 WHERE book_id = ?'

//connect to DB
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: process.env.DB_CONN_LIMIT || 5,
    timezone: '+08:00'
})

//create express instance
const app = express()

//setup hbs
app.engine('hbs', hbs({ defaultLayout: 'default.hbs' }))
app.set('view engine', 'hbs')

//logger
//app.use(morgan('combined'))

//main nav page
app.get('/', (req, res) => {

    const alpha = ASCIIArr('A', 'Z')
    const num = ASCIIArr('0', '9')

    res.status(200)
    res.type('text/html')
    res.render('landing', { alpha, num })
})

//book listing
app.get(['/catalog/:alpha', '/catalog/:alpha/:p'], async (req, res) => {

    //get listing of books by first letter, 10 per page, asc

    //declare query functions
    const getBookList = await getQuery(SQL_GET_BOOK_LISTING, db)
    const getBookCount = await getQuery(SQL_GET_LIST_COUNT, db)

    const p = parseInt(req.params.p) || 1

    try {
        let [pages] = await getBookCount(`${req.params.alpha}%`)
        pages = Math.ceil(pages.totalBooks / 10)
        //check for extremes
        if (p > pages || p <= 0) {
            res.status(404)
            res.type('text/html')
            res.render('error', {code: '404 Page not Found'})
            return
        }
        const offset = (p == 1) ? 0 : (p - 1) * 10
        const results = await (await getBookList([`${req.params.alpha}%`, offset]))
            .map(
                (book) => { return { title: book.title, book_id: book.book_id } }
            )
        res.status(200)
        res.type('text/html')
        res.render('catalog', {
            results,
            idx: req.params.alpha,
            prevPage: p - 1,
            nextPage: p + 1,
            finalPage: pages - p
        })
    } catch (e) {
        Promise.reject(e)
    }
})

//book details
app.get('/detail/:book_id', async (req, res) => {
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
                        bookId: result.bookId,
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
            res.render('error', {code: '404 Page not Found'})
        }
    } catch (e) {
        Promise.reject(e)
    }
})

//find book reviews
app.post('/detail/:book_id/reviews',
    express.urlencoded({ extended: true }),
    async (req, res) => {
        //fetch and render reviews
        try {
            const title = req.body.title
            const q = await getNYT(title)
            if (q.results) {
                //process review
                res.status(200)
                res.type('text/html')
                res.render('reviews', { q, title, authors: req.body.authors })

            } else {
                res.status(204)
                res.type('text/html')
                res.render('reviews', { noReviews: false })
            }
        } catch (e) {
            Promise.reject(e)
        }
    })

//mount static resources
app.use(express.static(`${__dirname}/static`))

//404 everything else
app.use((_req, res) => {
    res.status(404)
    res.type('text/html')
    res.render('error', {code: '404 Page not found'})
})

//start server
db.getConnection()
    .then(conn => {
        console.info('Pinging DB....')
        return Promise.all([Promise.resolve(conn), conn.ping()])
    })
    .then(ans => {
        console.info('DB is online!')
        ans[0].release()
        if (process.env.NYT_KEY) {
            app.listen(
                PORT,
                console.info(`App has started on ${PORT} at ${getDate()}`)
            )
        } else { next() }
    })
    .catch(e => {
        console.error('Cant start server, check DB or API KEY')
        process.exit(1)
    })