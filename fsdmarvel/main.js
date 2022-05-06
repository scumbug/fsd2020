//import libs
const express = require('express')
const hbs = require('express-handlebars')
const { getDate, getMarvel } = require('./helper')
require('dotenv').config()

//express constants
const PORT = parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2]) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000

//router constants
const landing = require('./landing')
const search = require('./search')

//create express
const app = express()

//setup hbs
app.engine('hbs', hbs({ defaultLayout: 'default.hbs' }))
app.set('view engine', 'hbs')

//setup routing
app.use(landing())
app.use(search())

//start server
if (process.env.MARVEL_PUB) {
    app.listen(
        PORT,
        () => { console.log(`App has started on ${PORT} at ${getDate()}`) }
    )
} else
    console.error('No API key generated')

/*
const q = fetch(withQuery(baseUrl+EP,
    {
        ts,
        apikey,
        hash,
    }
)).then(
    res => res.json()
).then(
    json => console.log(json.data.results)
)
*/