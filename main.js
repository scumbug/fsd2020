//import libs
const express = require('express')
const hbs = require('express-handlebars')
const mysql = require('mysql2/promise')
const { getDate } = require('./helper')
require('dotenv').config()

//declare constants
const PORT = (parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000

//setup DB
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: 'leisure',
    waitForConnections: true,
    connectionLimit: process.env.DB_CONN_LIMIT || 2,
    timezone: '+08:00'
})

//declare routers
const landing = require('./landing')(db)
const detail = require('./detail')(db)

//create express
const app = express()

//setup HBS
app.engine('hbs', hbs({ defaultLayout: 'default.hbs' }))
app.set('view engine', 'hbs')

//routing
app.use(landing)
app.use(detail)

//start server
db.getConnection()
    .then(conn => {
        console.info('Pinging DB....')
        return Promise.all([Promise.resolve(conn), conn.ping()])
    })
    .then(ans => {
        console.info('DB is online!')
        ans[0].release()
        app.listen(
            PORT,
            console.info(`App has started on ${PORT} at ${getDate()}`)
        )
    })
    .catch(e => { console.error(e) })