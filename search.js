const express = require('express')
const md5 = require('md5')
const fetch = require('node-fetch')
const withQuery = require('with-query').default
const { getMarvel, getCharDeets, getEventDeets } = require('./helper')

const EP = '/characters'

module.exports = () => {
    const router = express.Router()
    router.get('/search',
        async (req, res) => {
            if (!req.query.q) {
                res.status(200)
                res.type('text/html')
                res.render('search')
            }
            else {
                //search character id
                const nameStartsWith = req.query.q
                const char = await getMarvel(EP, { nameStartsWith })
                //get first char details
                console.log(char[0].events.items)
                const [charDeets] = await getCharDeets(char[0]['id'])
                let events = []
                //const events = await getEventDeets(116)
                res.status(200)
                res.type('text/html')
                res.render('char',{result: char[0], events})
            }
        })
    return router
}