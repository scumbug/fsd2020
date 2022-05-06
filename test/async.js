const fetch = require('node-fetch')
const withQuery = require('with-query').default

const ENDPOINT = 'http://api.openweathermap.org/data/2.5/weather'
const KEY = ''

const getWeather = async (city, key) => {
    const res = await fetch(withQuery(
        ENDPOINT,
        {
            q: 'singapore',
            appid: KEY
        }
    ))
    
    let weather

    try {
        weather = await res.json()
    } catch (e) {
        return Promise.reject(e)
    }

    return weather
}

getWeather('singapore', KEY)
    .then(output => console.info(output))
    .catch(e => console.error(e))