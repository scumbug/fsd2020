const md5 = require('md5')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

//get random numbers for a range (inclusive)
const getRandInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

//pretty print dates
const getDate = () => {
    return date = new Date().toString().replace(/ GMT.+/, '')
}

function secondsDiff(d1, d2) {
    let millisecondDiff = d2 - d1;
    let secDiff = Math.floor((d2 - d1) / 1000);
    return secDiff;
}

const minutesDiff = (d1, d2) => {
    let seconds = secondsDiff(d1, d2);
    let minutesDiff = Math.floor(seconds / 60);
    return minutesDiff;
}

const getQuery = (sql, pool) => {
    const result = async (params) => {
        const conn = await pool.getConnection()
        try {
            const [res] = await pool.query(sql, params)
            console.log('getting query')
            return res
        } catch (e) {
            return Promise.reject(e)
        } finally {
            conn.release()
        }
    }
    return result
}

const getMarvel = async (endpoint, query) => {
    //setup Auth
    const baseUrl = 'https://gateway.marvel.com/v1/public'
    const ts = Date.now()
    const apikey = process.env.MARVEL_PUB
    const hash = md5(ts + process.env.MARVEL_PRI + process.env.MARVEL_PUB)
    const auth = { ts, apikey, hash}

    //get full params
    const q = Object.assign(query || {}, auth)

    const result = await (await fetch(withQuery(baseUrl+endpoint, q))).json()
    return result.data.results
}

const getCharDeets = async (query) => {
    //setup Auth
    const baseUrl = 'https://gateway.marvel.com/v1/public/characters/'
    const ts = Date.now()
    const apikey = process.env.MARVEL_PUB
    const hash = md5(ts + process.env.MARVEL_PRI + process.env.MARVEL_PUB)
    const auth = { ts, apikey, hash }

    const result = await (await fetch(withQuery(baseUrl+query, auth))).json()
    return result.data.results
}

const getEventDeets = async (query) => {
    //setup Auth
    const baseUrl = 'https://gateway.marvel.com/v1/public/events/'
    const ts = Date.now()
    const apikey = process.env.MARVEL_PUB
    const hash = md5(ts + process.env.MARVEL_PRI + process.env.MARVEL_PUB)
    const auth = { ts, apikey, hash }

    const result = await (await fetch(withQuery(baseUrl+query, auth))).json()
    return result.data.results
}

module.exports = { getRandInt, getDate, minutesDiff, getQuery, getMarvel, getCharDeets, getEventDeets }