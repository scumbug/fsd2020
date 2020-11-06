//import libs
require('dotenv').config()
const express = require('express')
const hbs = require('express-handlebars')
const mysql = require('mysql2/promise')
const morgan = require('morgan')
const { getDate } = require('./helper')

//globals
const PORT = (parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000

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
app.use(morgan('combined'))

//
// Setup Routers
//
//Landing Page
app.use(require('./landing')())
//Book Listing
app.use(require('./catalog')(db))
//Book Details
app.use(require('./details')(db))
//Book Reviews
app.use(require('./reviews')())

//mount static resources
app.use(express.static(`${__dirname}/static`))

//404 everything else
app.use((_req, res) => {
    res.status(404)
    res.type('text/html')
    res.render('error', { code: '404 Page not found' })
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