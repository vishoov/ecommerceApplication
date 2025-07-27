const expressRateLimit = require('express-rate-limit');


const rateLimit = expressRateLimit({
    windowMs: 60*60*1000,
    max:100,
    message:"Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
})


module.exports = rateLimit;