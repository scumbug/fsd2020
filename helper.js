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
    let secDiff = Math.floor( ( d2 - d1) / 1000 );
    return secDiff;
 } 

const minutesDiff = (d1, d2) => {
    let seconds = secondsDiff(d1, d2);
    let minutesDiff = Math.floor( seconds / 60 );
    return minutesDiff;
}

const getQuery = (sql, pool) => {
    const result = async (params) => {
        const conn = await pool.getConnection()
        try {
            const [res] = await pool.query(sql,params)
            console.log('getting query')
            return res
        } catch(e) {
            return Promise.reject(e)
        } finally {
            conn.release()
        }
    }
    return result
}

module.exports = { getRandInt, getDate, minutesDiff, getQuery }