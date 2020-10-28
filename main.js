//import libs & env
const dotenv = require("dotenv")
dotenv.config()

const helper = require('./helper.js')

const express = require('express')
const hbs = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

//set constants
const PORT = (parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000
const KEY = process.env.GIPHY || ""
const ENDPOINT = 'https://api.giphy.com/v1/gifs/search'

//load express & hbs
const app = express()
app.engine('hbs', hbs({ defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

//logger
app.use(
    (req,_res,next) => {
        console.info(`${helper.getDate()}: ${req.method} ${req.originalUrl}`)
        next()
    }
) 
//mount static resources
app.use(express.static(`${__dirname}/public`))

//setup landing page
app.get('/',
    (_req,res) => {
        res.status(200)
        res.type('text/html')
        res.render('index')
    }
)

//grab gifs
app.get('/search',
    async (req,res) => {
        const param = req.query.q
        let gifs = new Array()
        let gifJSON = await fetch(withQuery(ENDPOINT,{ q: param, api_key: KEY, limit: 10}))
        gifJSON = await gifJSON.json()
        for(const gif of gifJSON.data){
            await gifs.push(gif.images.downsized_large.url)
        }
        res.status(200)
        res.type('text/html')
        res.render('gif', { gifs })
    }
)

//redirect all non-mapped to index
app.use(
    (_req,res) => { res.redirect('/') }
)

//start server
if(KEY)
    app.listen(
        PORT,
        () => {
            console.info(`Application has started on ${PORT} at ${helper.getDate()}`)
        }
    )
else
    console.error('No API KEY')