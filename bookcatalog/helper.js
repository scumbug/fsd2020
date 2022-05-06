const fetch = require('node-fetch')
const withQuery = require('with-query').default

//pretty print dates
const getDate = () => {
    return date = new Date().toString().replace(/ GMT.+/, '')
}

//query DB
const getQuery = (sql, pool) => {
    const result = async (params) => {
        const conn = await pool.getConnection()
        try {
            const [res] = await conn.query(sql, params)
            return res
        } catch (e) {
            return Promise.reject(e)
        } finally {
            conn.release()
        }
    }
    return result
}

//helper function for generating ASCII array
const ASCIIArr = (first,last) => {
    let arr = []
    for(i = first.charCodeAt(0);i <= last.charCodeAt(0); i++)
        arr.push(String.fromCharCode(i))
    return arr
}

//query NYT API
const getNYT = async (title) => {
    //setup Auth
    const KEY = process.env.NYT_KEY
    const ENDPOINT = 'https://api.nytimes.com/svc/books/v3/reviews.json'
    
    const result = await( await fetch(withQuery(ENDPOINT, {
        'api-key': KEY,
        title
    }))).json()

    return result
}

module.exports = { getDate, getQuery, ASCIIArr, getNYT }