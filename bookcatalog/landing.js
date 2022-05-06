//import libs
const express = require('express')
const { ASCIIArr } = require('./helper')

module.exports = () => {
    const router = express.Router()
    router.get('/', (_req, res) => {

        const alpha = ASCIIArr('A', 'Z')
        const num = ASCIIArr('0', '9')
    
        res.status(200)
        res.type('text/html')
        res.render('landing', { alpha, num })
    })
    return router
}