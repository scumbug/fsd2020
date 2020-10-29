//import libs and env
require('dotenv').config
const express = require('express')
const hbs = require('express-handlebars')
const helper = require('./helper.js')

//declare const
const PORT = (parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000

//create express app
const app = express()

//setup hbs
app.engine('hbs', hbs({ defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

//mount static folder
app.use(express.static(`${__dirname}/public`))

//logger
app.use(
    (req,_res,next) => {
        console.info(`${helper.getDate()}: ${req.method} ${req.originalUrl}`)
        next()
    }
) 

//landing page
app.get( '/',
    (_req,res) => {
        const cart = []
        res.status(200)
        res.type('text/html')
        res.render('index', { savecart: JSON.stringify(cart)})
    }
)

//process form
app.post('/add',
    express.urlencoded({ extended: true }),
    (req,res) => {
        //code form processing here
        const cart = JSON.parse(req.body.savecart)
        let idx = cart.findIndex( cart => cart.productName === req.body.productName.toLowerCase() )
        if(cart.length == 0 || idx == -1)
            cart.push(req.body)
        else
            cart[idx]['productQuantity'] = parseInt(cart[idx]['productQuantity']) + parseInt(req.body.productQuantity)
        res.status(200)
        res.type('text/html')
        res.render('index', { cart, savecart: JSON.stringify(cart) })
    }
)

//redirect all not routed to index
app.use((_req,res) => { res.redirect('/') })

//start server
app.listen(PORT, () => { console.info(`App has started on ${PORT} at ${helper.getDate()}`)})