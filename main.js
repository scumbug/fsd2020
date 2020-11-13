//load lib
const express = require('express')
const hbs = require('express-handlebars')

//set port
const port = (parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000

//create app
const app = express()

//vars
let visitsCounter = 0

//config handlebar
app.engine('hbs', hbs({ defaultLayout: 'default.hbs' }))
app.set('view engine','hbs')

//logger
app.use(
    (req,_res,next) => {
        console.info(`${new Date()}: ${req.method} ${req.originalUrl}`)
        next()
    }
)

//get /time
app.get('/time',
    (_req,res) => {
        //Response
        res.status(200) //HTTP status
        res.type('text/html') //HTTP content type
        //res.send(`Current time is ${new Date}`)
        visitsCounter++
        res.render(
            'time',
            {
                timenow: new Date(),
                visited: visitsCounter
            })
    }
)

app.get('/faketime',
    (_req,res) => {
        res.status(200)
        res.type('text/html')
        res.render('time')
    }
)

//load static content
app.use(express.static(__dirname + '/public'))

//redirect 404
app.use(
    (_req,res) => {
        res.status(404)
        res.type('text/html')
        res.sendFile( __dirname + '/public/404.html')
    }
)

//start server
app.listen(
    port,
    () => {
        console.info(`application started on port ${port} at ${new Date()}`)
    }
)
