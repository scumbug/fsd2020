//get random numbers for a range (inclusive)
const getRandInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

//get API keys
const getKey = (service) => {
    let keyfile = fs.readFileSync('./.secrets.json')
    let keys = JSON.parse(keyfile)
    return keys[service]
}

//pretty print dates
const getDate = () => {
    let date = new Date().toString().replace(/ GMT.+/, '')
    return date
}

module.exports = { getRandInt, getDate, getKey, }