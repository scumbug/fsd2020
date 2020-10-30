//import libs
require('dotenv').config()
const helper = require('./helper.js')
const express = require('express')
const hbs = require('express-handlebars')
const withQuery = require('with-query').default
const fetch = require('node-fetch')

//declare constants
const PORT = (parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000
const KEY = process.env.NEWS
const ENDPOINT = 'https://newsapi.org/v2/top-headlines'

//create app
const app = express()

//setup hbs
app.engine('hbs', hbs({ defaultLayout: 'default.hbs' }))
app.set('view engine', 'hbs')

//mount static resources
app.use(express.static(`${__dirname}/public`))

//setup landing page
app.get('/',
    (req,res) => {
        res.status(200)
        res.type('text/html')
        res.render('index')
    }
)

//search
app.get('/search',
    async (req,res) => {
        try {
            newsJSON = await( await grabNews(req.query.q, req.query.country, req.query.category)).json()
            const articles = newsJSON.articles.map(
                (article) => {
                    return {
                        title: article.title,
                        description: article.description,
                        url: article.url,
                        urlToImage: article.urlToImage,
                        publishedAt: article.publishedAt,
                    }
                }
            )
            res.status(200)
            res.type('text/html')
            res.render('index', { articles, q: req.query.q })
        } catch (e) {
            console.error(e)
            return Promise.reject(e)
        }
    }
)

//redirect non routed to landing page
app.use(
    (_req,res) => {
        res.redirect('/')
    }
)

//start server
app.listen(
    PORT,
    () => { console.info(`App has started on ${PORT} at ${helper.getDate()}`)}
)

const grabNews = (q,country,category) => {
    return fetch(withQuery(
        ENDPOINT,
        {
            country,
            category,
            q,
            apiKey: KEY,
        }
    ))
}