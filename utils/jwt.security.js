const jwt = require("jsonwebtoken");



//generate a JWT
const generateToken = (user)=>{
    try{
        const token = jwt.sign(
            //payload
            {
                id:user._id,
                role:user.role
            },
            //secret key
            process.env.JWT_SECRET,
            //options
            {
                expiresIn:"1000h",
                algorithm: "HS256"
            }
        )
        return token;
    }
    catch(err){
        console.error("Error generating token:", err.message);
        throw new Error("Token generation failed");
    }
}




// verify a JWT
const verifyToken= (req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                succes:false,
                message:"No token provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; //attach the decoded user info to the request object
        next();

    }   
    catch(err){
        console.error("Error verifying token:", err.message);
        throw new Error("Token verification failed");
    }
}




 module.exports = {
    generateToken,
    verifyToken
 }