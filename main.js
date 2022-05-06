//import libs & env
require("dotenv").config()

const helper = require('./helper.js') //self written helper functions

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

/*

Grab gifs.

gifJSON is a nested await that will query the endpoint then convert to json

if only need one arr to be passed to hbs to handle can use the below instead of a for loop
const srcs = await gifJSON.data.map(gifJSON => gifJSON.images.fixed_height.url)

*/

app.get('/search',
    async (req,res) => {
        try {
            let gifs = new Array()
            let gifJSON = await (await searchGifs(req.query.q,req.query.n)).json()

            //loop to extract all relevant data to be passed to render engine
            for(gif of gifJSON.data){
                gifs.push(
                    {
                        "src": gif.images.fixed_height.url,
                        "alt": gif.title,
                        "url": gif['url'] //use this to get null value if key does not exist or keys thats not valid naming scheme of JS
                    }
                )
            }

            /* alternatively we can use map()
            const gifs = gifJSON.data.map(
                (gif) => {
                    return { src: gif.images.fixed_height.url, alt: gif.tile, url: gif.url }
                }
            )
            */

            res.status(200)
            res.type('text/html')
            res.render('gif', { gifs , q: req.query.q, n: req.query.n , e: !!gifs.length})
        } catch (e) {
            console.error(e)
            return Promise.reject(e)
        }
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

//helper functions
const searchGifs = (q,limit) => { return fetch(withQuery(ENDPOINT,{ q, api_key: KEY, limit })) }