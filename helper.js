module.exports = {
    //get random numbers for a range (inclusive)
    getRandInt: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
    },

    //pretty print dates
    getDate: () => {
        let date = new Date().toString().replace(/ GMT.+/, '')
        return date
    }
}