//import libs & env
const dotenv = require("dotenv")
dotenv.config()

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
        const q = req.query.q
        const n = req.query.n
        let gifs = new Array()
        try {
            let gifJSON = await (await searchGifs(q,n)).json()

            //oop to extract all relevant data to be passed to render engine
            for(const gif of gifJSON.data){
                await gifs.push(
                    {
                        "src":gif.images.fixed_height.url,
                        "alt":gif.title,
                        "url":gif.url
                    }
                )
            }
        } catch (e) {
            console.error(e)
            return Promise.reject(e)
        }
        res.status(200)
        res.type('text/html')
        res.render('gif', { gifs , n })
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
const searchGifs = (q,limit) => {
    return fetch(withQuery(ENDPOINT,{ q, api_key: KEY, limit }))
}