const logger = (req, res, next)=>{
    try{
        const METHOD = req.method;
        const URL = req.url;
        const TIME = new Date().toLocaleString()

        console.log(`[${TIME}]: URL: ${URL} - METHOD: ${METHOD}`)
        next();
    }
    catch(err){
        res.status(500).send(err.message)
    }
}


module.exports = logger;