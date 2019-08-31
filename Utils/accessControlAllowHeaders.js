module.exports = () => {
    return {
        h1: res.header("Access-Control-Allow-Origin", "*"),
        h2: res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    }
}