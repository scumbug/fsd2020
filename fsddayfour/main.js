//import libs & env
require("dotenv").config()

const helper = require('./helper.js') //self written helper functions

const express = require('express')
const hbs = require('express-handlebars')


//set constants
const PORT = (parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000

//load express & hbs
const app = express()
app.engine('hbs', hbs({ defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

//logger
app.use(
    (req,res,next) => {
        console.info(`${helper.getDate()}: ${req.method} ${req.originalUrl}`)
        next()
    }
) 
//mount static resources
app.use(express.static(`${__dirname}/public`))

//parse form
app.use(express.urlencoded({ extended: true }))

//process form
app.post('/register',
    (req,res) => {
        console.log(req.body)
        res.status(201)
        //res.sendFile(`${__dirname}/public/done.html`)
        //res.send(req.body)
        //res.redirect('/?created=true')
        const created = true
        res.render('index', {created})
    }
)

//setup landing page
app.get('/',
    (req,res) => {
        res.status(200)
        res.type('text/html')
        res.render('index', { created: req.query.created })
    }
)

//redirect all non-mapped to index
app.use(
    (_req,res) => { res.redirect('/') }
)

//start server
app.listen(
    PORT,
    () => {
        console.info(`Application has started on ${PORT} at ${helper.getDate()}`)
    }
)