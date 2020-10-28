const fetch = require('node-fetch')
const withQuery = require('with-query').default

const ENDPOINT = 'http://api.openweathermap.org/data/2.5/weather'
const KEY = '7905d1ce8d579db583094fc080ba8f41'

fetch(withQuery(
        ENDPOINT,
        {
            q: 'singapore',
            appid: KEY
        }
    )
)
.then(result => result.json())
.then(result => console.info(result))
.catch(e => console.error(e))