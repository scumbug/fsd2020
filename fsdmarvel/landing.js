const express = require('express')
const { getMarvel } = require('./helper')
const EP = '/characters'

module.exports = () => {
    const router = express.Router()
    router.get('/',
        async (req,res) => {
            //landing page here
            const results = await getMarvel(EP,{series: 24229, orderBy: '-modified'})
            res.status(200)
            res.type('text/html')
            res.render('landing', {results})
        }
    )
    return router
}