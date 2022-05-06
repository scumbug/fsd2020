//import libs
const helper = require('./helper.js')
const express = require('express')
const hbs = require('express-handlebars')

//create app obj
const app = express()

//set variables
const PORT = (parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000
const date = helper.getDate()

//setup handlebars engine
app.engine('hbs', hbs({ defaultLayout: 'default.hbs' }))
app.set('view engine', 'hbs')

//logger
app.use(
    (req,res,next) => {
        console.info(`${date}: ${req.method} ${req.originalUrl}`)
        next()
    }
)

//load static
app.use(express.static(`${__dirname}/public`))

//roll dice
app.get('/roll',
    (req,res) => {
        //get dicecount and start rolling
        let dicecount = 2
        let dices = new Array()
        for(i = 0; i < dicecount; i++){
            dices.push(helper.getRandInt(1,6))
        }
        
        //send response
        res.status(200)
        res.type('text/html')
        res.render('roll', { dices })
    }
)

//serve home
app.get('/',
    (req,res) => {
        res.status(200)
        res.type('text/html')
        res.render('index')
    }
)

//redirect the rest to home
app.use(
    (req,res) => {
        res.redirect('/')
    }
)

//start server
app.listen(
    PORT,
    () => {
        console.info(`App has started on port ${PORT} at ${date}`)
    }
)

