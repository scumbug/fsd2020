//import libs
require('dotenv').config()
const express = require('express')
const hbs = require('express-handlebars')
const { getDate } = require('./helper.js')
const mysql = require('mysql2/promise')


//set constants
const PORT = (parseInt(process.argv[2]) > 1024 && parseInt(process.argv[2])) || (parseInt(process.env.PORT) > 1024 && parseInt(process.env.PORT)) || 3000
const SQL_GET_APP_CAT = 'SELECT distinct(category) FROM apps'
const SQL_GET_APPS = 'SELECT * FROM apps WHERE category = ?'

//setup db connection
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: 'playstore',
    waitForConnections: true,
    connectionLimit: process.env.DB_CONN_LIMIT || 2,
    timezone: '+08:00'
})

//create express
const app = express()

//setup hbs
app.engine('hbs', hbs({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

const cat_route = require('./category')(db)
const app_route = require('./app')(db)

//setup landing page
app.get('/',
    async (req,res) => {
        const conn = await db.getConnection()
        try {
            let [results] = await db.query(SQL_GET_APP_CAT)
            res.status(200)
            res.type('text/html')
            res.render('index', {results})
        } catch (e) {
            console.log(e)
        } finally {
            conn.release()
        }
    }
)

app.use(cat_route)
app.use(app_route)

//start server
db.getConnection()
.then(conn => {
    console.info('Pinging DB')
    return Promise.all([Promise.resolve(conn), conn.ping()])
})
.then(results => {
    results[0].release()

    app.listen(
        PORT,
        console.info(`App has started on ${PORT} at ${getDate()}`)
    )
})
.catch(e => {
    console.error(e)
})
